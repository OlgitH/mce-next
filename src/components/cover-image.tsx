"use client";

import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { isFilled, ImageField } from "@prismicio/client";

type Props = {
  title?: string;
  image: ImageField;
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
  image,
  slug,
  width,
  height,
  children,
  alt,
  bgColour,
  opacity,
  overlay,
}: Props) => {
  console.log("[CoverImage] Props:", {
    title,
    image,
    slug,
    width,
    height,
    alt,
    bgColour,
    opacity,
    overlay,
  });
  console.log("[CoverImage] isFilled.image(image):", isFilled.image(image));
  if (isFilled.image(image)) {
    console.log("[CoverImage] image.url:", image.url);
    console.log("[CoverImage] image.alt:", image.alt);
  }

  return (
    <>
      <div className="sm:mx-0 z-0 w-full h-full relative">
        {slug && isFilled.image(image) ? (
          <Link
            as={`/posts/${slug}`}
            href="/posts/[slug]"
            aria-label={title}
            className="block relative w-full h-full"
          >
            <Image
              src={image.url}
              alt={alt || image.alt || ""}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          </Link>
        ) : (
          isFilled.image(image) && (
            <Image
              src={image.url}
              alt={alt || image.alt || ""}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
          )
        )}
      </div>

      {overlay && (
        <div
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{
            backgroundColor: bgColour || "black",
            opacity: opacity ?? 0.5,
          }}
        />
      )}

      <div className="inner z-30 absolute top-0 left-0 text-white w-full h-full flex justify-start items-center">
        <div className="z-20 container px-4">{children}</div>
      </div>
    </>
  );
};

export default CoverImage;
