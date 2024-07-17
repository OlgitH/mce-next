import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import FeatureListComponent from "@/components/feature-list";
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
      <div className="container">
        <FeatureListComponent features={featuredItems} />
      </div>
    </section>
  );
};

export default FeatureList;
