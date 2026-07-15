import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type ImgProps = ComponentPropsWithoutRef<"img">;
type VideoProps = ComponentPropsWithoutRef<"video">;

/**
 * MDX <img> → next/image for local public/ assets.
 * Gets automatic AVIF/WebP, lazy loading, and sized responses via /_next/image.
 * External URLs stay as native <img> (no remotePatterns needed).
 */
export function MdxImage({ src, alt, className, style, width, height, ...rest }: ImgProps) {
  if (!src || typeof src !== "string") return null;

  const isRemote = src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//");
  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote/unknown hosts
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  // Intrinsic dimensions for aspect-ratio reserve; CSS controls display size.
  const w = typeof width === "number" ? width : Number(width) || 1200;
  const h = typeof height === "number" ? height : Number(height) || 675;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={w}
      height={h}
      sizes="(max-width: 672px) 100vw, 672px"
      className={className ?? "h-auto w-full rounded-xl"}
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}

/** MDX <video> with sensible defaults: metadata preload, no layout thrash. */
export function MdxVideo({ className, style, preload, playsInline, ...rest }: VideoProps) {
  return (
    <video
      preload={preload ?? "metadata"}
      playsInline={playsInline ?? true}
      className={className}
      style={{
        display: "block",
        width: "100%",
        maxWidth: "640px",
        margin: "1.5rem auto",
        borderRadius: "12px",
        ...style,
      }}
      {...rest}
    />
  );
}
