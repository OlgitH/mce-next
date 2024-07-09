import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `FeaturedBlock`.
 */
export type FeaturedBlockProps =
  SliceComponentProps<Content.FeaturedBlockSlice>;

/**
 * Component for "FeaturedBlock" Slices.
 */
const FeaturedBlock = ({ slice }: FeaturedBlockProps): JSX.Element => {
  console.log("FeaturedBlock slice: ", slice.primary.title);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      hello
    </section>
  );
};

export default FeaturedBlock;
