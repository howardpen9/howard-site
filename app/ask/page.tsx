import type { Metadata } from "next";
import { Chat } from "@/components/chat";
import { LangToggle, type LangPane } from "@/components/lang-toggle";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Ask",
  description: `Ask an AI version of ${SITE.name} anything — background, projects, investment framework, and how to work with him.`,
  alternates: { canonical: "/ask" },
};

const headerPanes: LangPane[] = [
  {
    code: "en",
    label: "EN",
    node: (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">Ask me anything</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The interactive version of my public brain — an AI grounded in my essays, projects, and
          resume. Recruiters, founders, and their agents welcome; if the conversation gets
          interesting, the real me is one email away.
        </p>
      </>
    ),
  },
  {
    code: "zh",
    label: "中",
    node: (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">問我任何事</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          這是我公開大腦的互動版——一個讀過我所有文章、專案與履歷的 AI。歡迎獵頭、創辦人、以及他們的
          agent；聊得有意思的話，真人就在一封 email 之外。
        </p>
      </>
    ),
  },
];

export default function AskPage() {
  return (
    <div className="py-4">
      <LangToggle panes={headerPanes} />
      <Chat />
    </div>
  );
}
