import { Content, ContentRelationshipField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
/**
 * Props for `TextSection`.
 */
export type TextSectionProps = SliceComponentProps<Content.TextSectionSlice>;

type BrandColourField = ContentRelationshipField<"brand_colour"> & {
  data: {
    colour_code: string;
  };
};
type TextColourField = ContentRelationshipField<"text_colour"> & {
  data: {
    colour_code: string;
  };
};
/**
 * Component for "TextSection" Slices.
 */
const TextSection = ({ slice }: TextSectionProps): JSX.Element => {
  const bgColourField = slice.primary.background_colour as BrandColourField;
  const colourField = slice.primary.text_colour as BrandColourField;
  console.log(slice.primary);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      style={{
        backgroundColor: bgColourField.data?.colour_code ?? "",
        color: colourField.data?.colour_code ?? "",
        paddingTop: slice.primary.padding_y ?? 20,
        paddingBottom: slice.primary.padding_y ?? 20,
      }}
    >
      <div className="container px-4 py-40">
        {slice.primary.heading && <h2>{slice.primary.heading}</h2>}

        {slice.primary.text && <p>{slice.primary.text[0]?.text}</p>}
        {slice.primary.rich_text && (
          <PrismicRichText
            field={slice.primary.rich_text}
            components={{
              heading2: ({ children }: { children: React.ReactNode }) => (
                <h2 className="text-2xl mb-6 last:mb-0">{children}</h2>
              ),
              paragraph: ({ children }: { children: React.ReactNode }) => (
                <p className="text-lg mb-6 last:mb-0 font-normal">{children}</p>
              ),
            }}
          />
        )}
      </div>
    </section>
  );
};

export default TextSection;
