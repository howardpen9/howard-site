import { Tweet } from "react-tweet";

/**
 * Embeds an X / Twitter post inside MDX. Accepts either a full status URL
 * (`url="https://x.com/user/status/123"`) or a bare `id="123"`.
 * Registered as `<Tweet />` in components/mdx.tsx.
 *
 * react-tweet fetches from the public syndication API at render time and
 * ships its own scoped `.react-tweet-theme` styles, which follow the site's
 * `.dark` class automatically (see app/globals.css guard).
 */
export function XEmbed({ url, id }: { url?: string; id?: string }) {
  const tweetId = id ?? url?.match(/status\/(\d+)/)?.[1];
  if (!tweetId) return null;
  return (
    <div className="my-6 flex justify-center">
      <Tweet id={tweetId} />
    </div>
  );
}
