import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
import CategoryCard from "@/components/blocks/category-card";

/**
 * Props for `CategoryLinks`.
 */
export type CategoryLinksProps =
  SliceComponentProps<Content.CategoryLinksSlice>;

/**
 * Component for "CategoryLinks" Slices.
 */
const CategoryLinks = ({ slice }: CategoryLinksProps): JSX.Element => {
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
                <h2 className="mb-8 text-center">{children}</h2>
              ),
              paragraph: ({ children }: { children: React.ReactNode }) => (
                <p className="text-center">{children}</p>
              ),
            }}
          />
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {slice.primary.cards?.map((card, i) => (
            <CategoryCard
              key={i}
              label={card.label}
              image={card.background_image}
              link={card.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryLinks;
