import { PrismicNextImage } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";

const TextWithFeatures = ({ slice }) => {
  return (
    <section>
      <div className="container">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-2 md:gap-10 lg:gap-28">
          <div className="grid grid-cols-1 gap-8">
            {prismic.isFilled.image(slice.primary.icon) && (
              <PrismicNextImage field={slice.primary.icon} />
            )}
            <div className="leading-relaxed">
              <PrismicRichText field={slice.primary.text} components={{}} />
            </div>
          </div>
          <ul className="grid gap-10">
            {slice.primary.features.map((feature) => (
              <li
                key={prismic.asText(feature.description)}
                className="leading-relaxed"
              >
                <PrismicRichText field={feature.description} components={{}} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TextWithFeatures;
