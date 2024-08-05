import { Content, ContentRelationshipField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
import FeaturedTour from "@/components/blocks/featured-tour";

/**
 * Props for `TourSection`.
 */
export type TourSectionProps = SliceComponentProps<Content.TourSectionSlice>;

type BrandColourField = ContentRelationshipField<"brand_colour"> & {
  data: {
    colour_code: string;
  };
};

type TourField = ContentRelationshipField<"tour"> & {
  lang: string;
  uid: string;
  data: {
    background_colour: BrandColourField;
    feature_image: {
      url: string;
      alt: string;
    };
    title: string;
    description: string;
    opacity: number;
  };
};

/**
 * Component for "TourSection" Slices.
 */
const TourSection = ({ slice }: TourSectionProps): JSX.Element => {
  const bgColourField = slice.primary.background_colour as BrandColourField;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-20"
      style={{
        backgroundColor: bgColourField.data?.colour_code,
      }}
    >
      <div className="container px-4 flex flex-col justify-center">
        <h2 className="font-[700]">{slice.primary.title}</h2>

        <div className="tour-wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-4">
          {slice.primary.tours &&
            slice.primary.tours.map((item, i) => {
              const tourField = item.tour as TourField;
              const bgColourField2 = tourField.data
                ?.background_colour as BrandColourField;
              const colour = bgColourField2?.data?.colour_code ?? "";

              return (
                <FeaturedTour
                  key={i}
                  picture={tourField.data?.feature_image?.url ?? ""}
                  bgColour={colour}
                  alt={tourField.data?.feature_image?.alt ?? ""}
                  link={`/${tourField.lang}/tours/${tourField.uid}`}
                  opacity={tourField.data?.opacity}
                >
                  <h2>{tourField.data?.title || "No title"}</h2>
                  <p>{tourField.data?.description || "No description"}</p>
                </FeaturedTour>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default TourSection;
