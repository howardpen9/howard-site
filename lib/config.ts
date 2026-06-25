export const SITE = {
  name: "Howard Peng",
  role: "Protocol Engineer · Mechanism Designer",
  // Update this once the custom domain is attached in Vercel.
  url: "https://howardpeng.com",
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
  { label: "possible.trade", href: "https://possible.trade" },
  { label: "Email", href: "mailto:howard.peng.tw@gmail.com", handle: "howard.peng.tw@gmail.com" },
];

export type Project = {
  name: string;
  tagline: string;
  href?: string;
  year: string;
};

export const PROJECTS: Project[] = [
  {
    name: "OpenMod.ai",
    tagline: "macOS app for multi-model AI collaboration — several models reasoning side by side.",
    href: "https://openmod.ai",
    year: "2026",
  },
  {
    name: "talkBuffett",
    tagline: "Value-investing research platform — Buffett-grade analysis at 1/250,000th the cost.",
    href: "https://talkbuffett-production.up.railway.app",
    year: "2026",
  },
  {
    name: "x402-video",
    tagline: "Pay-per-call AI video generation, settled over x402 / USDC.",
    href: "https://x402-video.com",
    year: "2026",
  },
  {
    name: "AlphaLine",
    tagline: "US-first AI stock research — an agent-readable data layer for equities.",
    year: "2026",
  },
  {
    name: "x-signal-desk",
    tagline: "X monitoring + native-English writing corpus, designed for signal over volume.",
    year: "2026",
  },
  {
    name: "awesome-ai-api-proxy",
    tagline: "A weekly price observatory for AI API proxies and model tiers.",
    href: "https://github.com/howardpen9/awesome-ai-api-proxy",
    year: "2026",
  },
];
