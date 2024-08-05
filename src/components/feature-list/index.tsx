import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";
import { PrismicNextImage } from "@prismicio/next";
type Props = {
  features: any[];
};

/**
 * Component to render a list of features.
 */
const FeatureListComponent = ({ features }: Props) => {
  // console.log(features);

  return (
    <section>
      {features && (
        <div className="flex flex-wrap gap-4 items-end">
          {features.map((feature, i) => (
            <div
              key={i}
              className="text-center flex flex-col items-center sm:flex-1 grow"
            >
              {feature.data.image ? (
                <div className="rounded-full bg-green p-4 w-[140px] h-[140px] flex justify-center items-center">
                  <PrismicNextImage
                    field={feature.data.image}
                    className="w-[80%]"
                  />
                </div>
              ) : (
                ""
              )}

              {feature.data.title && (
                <h3 className="text-xl mt-4">
                  {prismic.asText(feature.data.featured_title)}
                </h3>
              )}
              {feature.data.featured_text && (
                <PrismicRichText
                  field={feature.data.featured_text}
                  components={{}}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default FeatureListComponent;
