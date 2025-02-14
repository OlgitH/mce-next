import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import FeatureListComponent from "@/components/feature-list";
import { PrismicRichText } from "@/components/PrismicRichText";
/**
 * Props for `FeatureList`.
 */
export type FeatureListProps = SliceComponentProps<Content.FeatureListSlice>;

/**
 * Component for "FeatureList" Slices.
 */
const FeatureList = ({ slice }: FeatureListProps): JSX.Element => {
  const featuredItems = slice.primary.featured_items.map((item) => {
    return item.featured_item;
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-20"
    >
      <div className="container px-4">
        {slice.primary.title && (
          <PrismicRichText
            field={slice.primary.title}
            components={{
              heading2: ({ children }: { children: React.ReactNode }) => (
                <h2 className="mb-8">{children}</h2>
              ),
              paragraph: ({ children }: { children: React.ReactNode }) => (
                <p>{children}</p>
              ),
            }}
          />
        )}

        <FeatureListComponent features={featuredItems} />
      </div>
    </section>
  );
};

export default FeatureList;
