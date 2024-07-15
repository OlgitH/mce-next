import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";
type Props = {
  features: any[];
};

/**
 * Component to render a list of features.
 */
const FeatureListComponent = ({ features }: Props) => {
  // console.log(features);

  return (
    <>
      {features && (
        <div className="flex gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="border-black border bg-cream p-8 rounded grow"
            >
              {feature.data.title && (
                <h3 className="text-bold text-xl">
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
    </>
  );
};
export default FeatureListComponent;
