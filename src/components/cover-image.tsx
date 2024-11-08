import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { PrismicNextImage } from "@prismicio/next";
import { ImageFieldImage } from "@prismicio/client";
type Props = {
  title?: string;
  src: ImageFieldImage;
  slug?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
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
  const image = <PrismicNextImage field={src} className="object-cover" fill />;
  return (
    <>
      <div
        className="sm:mx-0 relative z-0 w-full min-h-[300px]"
        style={{ height: height ? height + "px" : "" }}
      >
        {slug ? (
          <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
            {image}
          </Link>
        ) : (
          image
        )}
      </div>
      {overlay && (
        <div
          className="overlay w-full h-full absolute top-0 left-0 z-10"
          style={{ backgroundColor: bgColour ?? "", opacity: opacity ?? 0.6 }}
        ></div>
      )}

      <div className="inner z-30 absolute top-0 left-0 text-white w-full h-full flex justify-start items-end">
        {children}
      </div>
    </>
  );
};

export default CoverImage;
