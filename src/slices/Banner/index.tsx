import { Content, ContentRelationshipField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
import CoverImage from "@/components/cover-image";
import Socials from "@/components/socials/basic";
/**
 * Props for `Banner`.
 */
export type BannerProps = SliceComponentProps<Content.BannerSlice> & {
  context?: Context; // Context type added and made optional
};

/**
 * Custom type for linked documents.
 */
type BrandColourField = ContentRelationshipField<"brand_colour"> & {
  data: {
    colour_code: string;
  };
};

/**
 * Context type for external data.
 */
type Context = {
  bookingLink?: { url: string }; // Made optional to allow for cases where context is undefined
};

/**
 * Component for "Banner" Slices.
 */
const Banner = ({ slice, context }: BannerProps): JSX.Element => {
  const bgColourField = slice.primary.background_colour as BrandColourField;
  const textColourField = slice.primary.text_colour as BrandColourField;
  console.log("BG...", bgColourField);
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative"
      style={{
        backgroundColor: bgColourField?.data?.colour_code || "",
        color: textColourField?.data?.colour_code || "",
        height: "80vh",
      }}
    >
      <CoverImage
        src={slice.primary.background_image}
        bgColour={bgColourField?.data?.colour_code || ""}
        opacity={
          slice.primary.opacity ? parseFloat(slice.primary.opacity) : undefined
        }
        overlay={slice.primary.has_overlay}
      >
        <div className="flex flex-col justify-center gap-8 h-full items-start">
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
          {slice.primary.show_social_links && <Socials />}
          {/* {context?.bookingLink?.url && (
            <button
              className="text-2xl py-2 px-4 border border-cream shadow-sm bg-gradient-to-r from-indigo-400 to-indigo-600"
              style={{
                backgroundColor: bgColourField?.data?.colour_code ?? "white",
              }}
            >
              <a
                href={context.bookingLink.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book now
              </a>
            </button>
          )} */}
        </div>
      </CoverImage>
    </section>
  );
};

export default Banner;
