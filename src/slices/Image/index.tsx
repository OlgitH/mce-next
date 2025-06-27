import Image from "next/image";
import * as prismic from "@prismicio/client";
import { ImageField } from "@prismicio/client";

type Props = {
  slice: {
    primary: {
      image: ImageField;
      withAccent?: boolean;
    };
  };
};

const ImageSlice = ({ slice }: Props) => {
  const image = slice.primary.image;

  return (
    <section>
      <div className="container">
        <div className="relative">
          {slice.primary.withAccent && (
            <div className="absolute -left-4 -top-4 w-1/3">
              <div className="aspect-h-1 aspect-w-1 bg-slate-200/50" />
            </div>
          )}

          {prismic.isFilled.image(image) && image.url && (
            <Image
              src={image.url}
              alt={image.alt || ""}
              width={image.dimensions?.width || 800}
              height={image.dimensions?.height || 600}
              sizes="100vw"
              className="relative w-full"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageSlice;
