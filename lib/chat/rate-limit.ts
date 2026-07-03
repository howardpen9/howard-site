// Daily counters for the public chat, keyed per email / IP / global.
// Backed by Upstash Redis (REST) when UPSTASH_REDIS_REST_URL/TOKEN are set;
// falls back to per-process memory otherwise (fine for local dev, weak on
// serverless — each lambda instance counts separately, so set up Upstash
// before relying on the limits in production).

// Accept both naming schemes: UPSTASH_* (direct Upstash) and KV_* (the names
// Vercel's marketplace injects when an Upstash resource is connected).
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

type PipelineResult = { result: unknown }[] | null;

async function redisPipeline(commands: (string | number)[][]): Promise<PipelineResult> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      body: JSON.stringify(commands),
    });
    if (!res.ok) return null;
    return (await res.json()) as { result: unknown }[];
  } catch {
    return null;
  }
}

const mem = new Map<string, number>();

function memIncr(key: string): number {
  const n = (mem.get(key) ?? 0) + 1;
  mem.set(key, n);
  // Crude cap so a long-lived dev server doesn't grow unbounded.
  if (mem.size > 10_000) mem.clear();
  return n;
}

export type LimitResult = { ok: boolean; used: number; remaining: number };

async function incrWindow(key: string, ttlSeconds: number): Promise<number> {
  const res = await redisPipeline([
    ["INCR", key],
    ["EXPIRE", key, ttlSeconds],
  ]);
  return res ? Number(res[0]?.result ?? 0) : memIncr(key);
}

/** Increment today's counter for `bucket` and check it against `limit`. */
export async function checkAndCount(bucket: string, limit: number): Promise<LimitResult> {
  const day = new Date().toISOString().slice(0, 10);
  // 25h expiry: key dies shortly after its day ends, regardless of timezone drift.
  const used = await incrWindow(`chat:${bucket}:${day}`, 90_000);
  return { ok: used <= limit, used, remaining: Math.max(0, limit - used) };
}

/** Short sliding-ish window (e.g. 5/min per IP) — blunts burst scripts. */
export async function checkBurst(bucket: string, limit: number, windowSeconds: number): Promise<LimitResult> {
  const slot = Math.floor(Date.now() / 1000 / windowSeconds);
  const used = await incrWindow(`chat:burst:${bucket}:${slot}`, windowSeconds * 2);
  return { ok: used <= limit, used, remaining: Math.max(0, limit - used) };
}

/** Best-effort conversation log — every email captured is a potential lead. */
export async function logChat(entry: Record<string, unknown> & { email?: string }): Promise<void> {
  const line = JSON.stringify({ at: new Date().toISOString(), ...entry });
  const cmds: (string | number)[][] = [
    ["LPUSH", "chat:log", line],
    ["LTRIM", "chat:log", 0, 4999],
  ];
  // Deduped lead list, browsable via SMEMBERS chat:emails.
  if (entry.email) cmds.push(["SADD", "chat:emails", entry.email]);
  const res = await redisPipeline(cmds);
  if (!res) console.log(`[chat] ${line}`);
}
