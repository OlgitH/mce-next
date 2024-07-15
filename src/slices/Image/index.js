import { PrismicNextImage } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import clsx from "clsx";

const Image = ({ slice }) => {
  return (
    <section>
      <div className="container">
        <div className="relative">
          {slice.primary.withAccent && (
            <div className="absolute -left-4 -top-4 w-1/3">
              <div className="aspect-h-1 aspect-w-1 bg-slate-200/50" />
            </div>
          )}
          {prismic.isFilled.image(slice.primary.image) && (
            <PrismicNextImage
              field={slice.primary.image}
              sizes="100vw"
              className="relative w-full"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Image;
