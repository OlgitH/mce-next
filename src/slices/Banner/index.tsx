import { Content, ContentRelationshipField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
import CoverImage from "@/components/cover-image";

/**
 * Props for `Banner`.
 */
export type BannerProps = SliceComponentProps<Content.BannerSlice>;

/**
 * Custom type for linked documents.
 */
type BrandColourField = ContentRelationshipField<"brand_colour"> & {
  data: {
    colour_code: string;
  };
};

/**
 * Component for "Banner" Slices.
 */
const Banner = ({ slice }: BannerProps): JSX.Element => {
  const bgColourField = slice.primary.background_colour as BrandColourField;
  // console.log(bgColourField);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative"
    >
      <CoverImage
        src={slice.primary.background_image}
        height={300}
        bgColour={bgColourField.data ? bgColourField.data.colour_code : ""}
        opacity={slice.primary.opacity}
      >
        <PrismicRichText
          field={slice.primary.inner_text}
          components={{
            heading1: ({ children }: { children: React.ReactNode }) => (
              <h1 className="text-[2.6rem] mb-6 last:mb-0 font-bold">
                {children}
              </h1>
            ),
            paragraph: ({ children }: { children: React.ReactNode }) => (
              <p className="text-xl mb-6 last:mb-0 font-normal">{children}</p>
            ),
          }}
        />
      </CoverImage>
    </section>
  );
};

export default Banner;
