import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
import FeaturedTour from "@/components/blocks/featured-tour";
/**
 * Props for `TourSection`.
 */
export type TourSectionProps = SliceComponentProps<Content.TourSectionSlice>;

/**
 * Component for "TourSection" Slices.
 */
const TourSection = ({ slice }: TourSectionProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-pink py-20"
    >
      <div className="container flex flex-col justify-center">
        <h2>{slice.primary.title}</h2>

        <div className="tour-wrap grid grid-cols-3 auto-rows-auto gap-4">
          {slice.primary.tours &&
            slice.primary.tours.map((item, i) => {
              const colour =
                item.tour.data?.background_colour.data?.colour_code ?? "";
              console.log(item.tour.lang);

              return (
                <FeaturedTour
                  key={i}
                  picture={item.tour.data?.feature_image?.url ?? ""}
                  bgColour={colour}
                  alt={item.tour.data?.feature_image?.alt ?? ""}
                  link={`/${item.tour.lang}/tours/${item.tour.uid}`}
                  opacity={item.tour.data?.opacity}
                >
                  <h2>{item.tour.data?.title || "No title"}</h2>
                  <p>{item.tour.data?.description || "No description"}</p>
                </FeaturedTour>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default TourSection;
