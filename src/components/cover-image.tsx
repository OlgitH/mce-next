import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { isFilled, ImageFieldImage } from "@prismicio/client";

type Props = {
  title?: string;
  src: ImageFieldImage;
  slug?: string;
  children?: React.ReactNode;
  width?: number;
  height?: string;
  alt?: string;
  bgColour?: string;
  opacity?: number;
  overlay: boolean;
};

const CoverImage = ({
  title,
  src,
  slug,
  width,
  height,
  children,
  alt,
  bgColour,
  opacity,
  overlay,
}: Props) => {
  const image = isFilled.image(src) ? (
    <Image
      src={src.url}
      alt={alt || src.alt || ""}
      fill
      className="object-cover object-center"
      sizes="100vw"
      priority
    />
  ) : null;

  return (
    <>
      <div className="sm:mx-0 z-0 w-full relative aspect-video">
        {slug && image ? (
          <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
            {image}
          </Link>
        ) : (
          image
        )}
      </div>

      {overlay && (
        <>
          {/* Example overlays */}
          {/* Full overlay */}
          {/* <div
            className="overlay w-full h-full absolute top-0 left-0 z-10"
            style={{ backgroundColor: bgColour ?? "", opacity: opacity ?? 0.6 }}
          ></div> */}

          {/* Half-overlay with fade-out effect */}
          {/* <div
            className="half-overlay h-full w-full absolute top-0 left-0 z-10"
            style={{
              background: `linear-gradient(to right, ${bgColour} 50%, transparent 100%)`,
            }}
          ></div> */}
        </>
      )}

      {/* Inner content */}
      <div className="inner z-30 absolute top-0 left-0 text-white w-full h-full flex justify-start items-center">
        <div className="z-20 container px-4">{children}</div>
      </div>
    </>
  );
};

export default CoverImage;
