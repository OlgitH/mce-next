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
      style={{
        backgroundColor: bgColourField.data
          ? bgColourField.data.colour_code
          : "",
      }}
    >
      <CoverImage
        src={slice.primary.background_image}
        bgColour={bgColourField.data ? bgColourField.data.colour_code : ""}
        opacity={
          (slice.primary.opacity && parseInt(slice.primary.opacity)) ??
          undefined
        }
        overlay={slice.primary.has_overlay}
      >
        <div className="container px-4 flex flex-col justify-center gap-8 h-full">
          <PrismicRichText
            field={slice.primary.inner_text}
            components={{
              heading1: ({ children }: { children: React.ReactNode }) => (
                <h1 className="coffee-heading md:text-3xl font-bold">
                  {children}
                </h1>
              ),
              paragraph: ({ children }: { children: React.ReactNode }) => (
                <p className="text-xl mb-6 last:mb-0 font-normal">{children}</p>
              ),
            }}
          />
        </div>
      </CoverImage>
    </section>
  );
};

export default Banner;
