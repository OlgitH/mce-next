import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import * as prismic from "@prismicio/client";
/**
 * Props for `FeaturedSection`.
 */
export type FeaturedSectionProps =
  SliceComponentProps<Content.FeaturedSectionSlice>;

/**
 * Component for "FeaturedSection" Slices.
 */
const FeaturedSection = ({ slice }: FeaturedSectionProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-foam py-20"
    >
      <div className="container">
        <h2>{slice.primary.title ?? " No title"}</h2>

        {slice.primary.featured_blocks.map((item, i) => {
          return (
            <div key={i}>
              {prismic.asText(item.featured_block.data.title)}
              {item.featured_block.data.slices.map((slice, i) => {
                // console.log(slice.primary.featured_items);
                return (
                  <>
                    <h2>{prismic.asText(slice.primary.title)}</h2>
                    <div className="flex gap-4">
                      {slice.primary.featured_items.map((item, i) => {
                        console.log(item);

                        return (
                          <div className="bg-cream text-black p-8 rounded border-2 border-black">
                            <h3>{prismic.asText(item.featured.data.title)}</h3>
                            <p>{prismic.asText(item.featured.data.text)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedSection;
