export const SITE = {
  name: "Howard Peng",
  role: "Protocol Engineer · Mechanism Designer",
  url: "https://howard-peng.xyz",
  description:
    "Howard Peng — protocol engineer & mechanism designer. Mechanism design, distributed systems, and market microstructure, toward multi-agent cooperation and AI alignment.",
  bio: "Technical Director at a $100M Telegram-ecosystem fund — technical due diligence and portfolio support across stablecoin integrations and opcode-cost optimization. I work at the intersection of mechanism design, distributed systems, and market microstructure, building toward multi-agent cooperation and AI alignment.",
  email: "howard.peng.tw@gmail.com",
  avatar: "/howard.jpg",
  locale: "en",
} as const;

export type Link = { label: string; href: string; handle?: string };

export const LINKS: Link[] = [
  { label: "X", href: "https://x.com/0xhoward_peng", handle: "@0xhoward_peng" },
  { label: "GitHub", href: "https://github.com/howardpen9", handle: "howardpen9" },
  { label: "Telegram", href: "https://t.me/telepeng", handle: "@telepeng" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/haoen-peng", handle: "haoen-peng" },
];

export type Project = {
  name: string;
  tagline: string;
  href?: string; // public site / product URL
  repo?: string; // public source, when open
  year: string;
  status?: "live" | "building" | "private";
  // Screenshot for closed-source projects: drop a file at public/projects/<file>
  // and set image to "/projects/<file>". Rendered on featured cards when present.
  image?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    name: "MakeReel",
    tagline:
      "Consumer AI video studio. Pick a template or write a prompt, pay per clip from your wallet, get a 5-second video — no account, no subscription. Powered by Seedance, settled in USDC on Base.",
    href: "https://makereel.xyz",
    year: "2026",
    status: "live",
    featured: true,
  },
  {
    name: "x402-video",
    tagline:
      "Pay-per-call AI video generation over the x402 protocol — HTTP 402 → pay USDC on Base → generate. The developer- and agent-facing gateway behind MakeReel.",
    href: "https://x402video.com",
    year: "2026",
    status: "live",
    featured: true,
  },
  {
    name: "x-watchlist",
    tagline:
      "A pipeline that turns a list of X handles into a behavior map — surface-area tiers, activity personas, and follower/bio distributions, tracked over time. Closed source; live cohort dashboard.",
    href: "https://x-watchlist-production.up.railway.app/#overview",
    year: "2026",
    status: "private",
    featured: true,
    image: "/projects/x-watchlist.png",
  },
  {
    name: "talkBuffett",
    tagline: "Value-investing research platform — Buffett-grade analysis at 1/250,000th the cost.",
    href: "https://talkbuffett-production.up.railway.app",
    year: "2026",
    status: "live",
    featured: true,
  },
  {
    name: "OpenMod.ai",
    tagline: "macOS app for multi-model AI collaboration — several models reasoning side by side.",
    href: "https://openmod.ai",
    year: "2026",
    status: "live",
    featured: true,
  },
  {
    name: "AlphaLine",
    tagline: "US-first AI stock research — an agent-readable data layer for equities.",
    year: "2026",
    status: "building",
  },
  {
    name: "x-signal-desk",
    tagline: "X monitoring + native-English writing corpus, designed for signal over volume.",
    year: "2026",
    status: "building",
  },
  {
    name: "awesome-ai-api-proxy",
    tagline: "A weekly price observatory for AI API proxies and model tiers.",
    href: "https://github.com/howardpen9/awesome-ai-api-proxy",
    repo: "https://github.com/howardpen9/awesome-ai-api-proxy",
    year: "2026",
    status: "live",
  },
];
