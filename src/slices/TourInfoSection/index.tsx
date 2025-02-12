import { Content, ContentRelationshipField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";

/**
 * Props for `TourInfoSection`.
 */
export type TourInfoSectionProps =
  SliceComponentProps<Content.TourInfoSectionSlice> & {
    context: { locale: string };
  };

/**
 * Component for "TourInfoSection" Slices.
 */
const TourInfoSection = ({
  slice,
  context, // Destructure directly
}: TourInfoSectionProps): JSX.Element => {
  const { locale } = context;
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-10"
    >
      <div className="container px-4 flex md:flex-row flex-col">
        <div className="overview basis-1/2 md:pr-10">
          <h2>
            {locale === "es-co"
              ? "Resumen"
              : locale === "en-gb"
                ? "Overview"
                : "Overview"}
          </h2>
          <PrismicRichText
            field={slice.primary.overview}
            components={{
              heading3: ({ children }: { children: React.ReactNode }) => (
                <h3 className="text-2xl mb-6 last:mb-0 font-bold">
                  {children}
                </h3>
              ),
              paragraph: ({ children }: { children: React.ReactNode }) => (
                <p className="text-lg mb-6 last:mb-0 font-normal">{children}</p>
              ),
            }}
          />
        </div>
        <div className="details basis-1/2">
          <div className="mb-10">
            <h2>
              {locale === "es-co"
                ? "Incluye"
                : locale === "en-gb"
                  ? "Includes"
                  : "Includes"}
            </h2>
            <PrismicRichText
              field={slice.primary.included_section[0]?.includes}
              components={{
                listItem: ({ children }: { children: React.ReactNode }) => (
                  <li className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {children}
                  </li>
                ),
              }}
            />
          </div>

          <div className="mb-10">
            <h2>
              {locale === "es-co"
                ? "No incluye"
                : locale === "en-gb"
                  ? "Not included"
                  : "Not included"}
            </h2>
            <PrismicRichText
              field={slice.primary.included_section[0]?.does_not_include}
              components={{
                listItem: ({ children }: { children: React.ReactNode }) => (
                  <li className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 8.586L5.707 4.293a1 1 0 10-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 101.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {children}
                  </li>
                ),
              }}
            />
          </div>

          <div className="mb-10">
            <h2>
              {locale === "es-co"
                ? "Precio"
                : locale === "en-gb"
                  ? "Price"
                  : "Price"}
            </h2>
            <p>£{slice.primary.price} per person</p>
          </div>
          <div className="mb-10">
            <h2>
              {locale === "es-co"
                ? "Fechas"
                : locale === "en-gb"
                  ? "Dates"
                  : "Dates"}
            </h2>
            <PrismicRichText field={slice.primary.dates} components={{}} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourInfoSection;
