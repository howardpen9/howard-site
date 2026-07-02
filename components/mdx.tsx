import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { remarkFullUrls } from "@/lib/remark-full-urls";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { XEmbed } from "@/components/x-embed";
import { BarChart, StatCards } from "@/components/bar-chart";
import { LayerCake } from "@/components/layer-cake";
import { QuadrantChart } from "@/components/quadrant-chart";
import { Aside } from "@/components/aside";

const components = { Tweet: XEmbed, BarChart, StatCards, LayerCake, QuadrantChart, Aside };

const options = {
  // MDX from the local file system is authored content, not user input.
  // Disabling blockJS allows JSX expression props like data={[...]} in
  // custom chart components. blockDangerousJS remains true (default) to
  // prevent eval/Function access even in the unlikely edge case.
  blockJS: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkFullUrls],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      {/* @ts-expect-error Server Component */}
      <MDXRemote source={source} options={options} components={components} />
    </div>
  );
}
