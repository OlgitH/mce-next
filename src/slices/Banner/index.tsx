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
  hasBookingForm?: boolean; // Whether a #booking-form section exists on this page
  locale?: string;
};

const bookNowLabel = (locale?: string) =>
  locale?.startsWith("es") ? "Reservar ahora" : "Book now";

/**
 * Component for "Banner" Slices.
 */
const Banner = ({ slice, context }: BannerProps): JSX.Element => {
  const bgColourField = slice.primary.background_colour as BrandColourField;
  const textColourField = slice.primary.text_colour as BrandColourField;
  // console.log("banner image", slice.primary.background_image);
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
        image={slice.primary.background_image}
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
          {context?.hasBookingForm && (
            <a
              href="#booking-form"
              className="inline-block text-2xl py-2 px-6 rounded-full border border-cream shadow-sm bg-gradient-to-r from-indigo-400 to-indigo-600"
            >
              {bookNowLabel(context?.locale)}
            </a>
          )}
          {slice.primary.show_social_links && <Socials />}
        </div>
      </CoverImage>
    </section>
  );
};

export default Banner;
