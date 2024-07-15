import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";

const Hero = ({ slice }) => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="grid grid-cols-1 justify-items-center gap-10">
          <div className="max-w-2xl text-center leading-relaxed">
            <PrismicRichText
              field={slice.primary.text}
              components={{
                heading1: ({ children }) => (
                  <h1 className="mb-6 last:mb-0">{children}</h1>
                ),
                paragraph: ({ children }) => (
                  <p className="mb-6 last:mb-0">{children}</p>
                ),
              }}
            />
          </div>
          {prismic.isFilled.link(slice.primary.buttonLink) &&
            prismic.isFilled.keyText(slice.primary.buttonText) && (
              <PrismicNextLink
                field={slice.primary.buttonLink}
                className="rounded bg-slate-800 px-7 py-3 font-bold text-white"
              >
                {slice.primary.buttonText}
              </PrismicNextLink>
            )}
          {prismic.isFilled.image(slice.primary.image) && (
            <div className="w-full">
              <PrismicNextImage
                field={slice.primary.image}
                sizes="100vw"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
