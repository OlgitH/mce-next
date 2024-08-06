import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";
import { PrismicNextImage } from "@prismicio/next";
type Props = {
  children: any;
  bgColour: any;
};

/**
 * Component to render a list of features.
 */
const PageSection = ({ children, bgColour }: Props) => {
  // console.log(features);

  return (
    <section
      style={{
        backgroundColor: bgColour,
      }}
    >
      {children}
    </section>
  );
};
export default PageSection;
