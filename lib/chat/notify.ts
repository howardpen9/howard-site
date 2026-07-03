// Telegram push for new chat leads. Free: message your own bot via BotFather,
// set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID, done. No-op when unset.
export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[chat] telegram notify failed:", err);
  }
}
