import Image from "next/image";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled, ImageField, LinkField } from "@prismicio/client";

type Props = {
  label?: string | null;
  image: ImageField;
  link: LinkField;
};

const CategoryCard = ({ label, image, link }: Props) => {
  return (
    <PrismicNextLink
      field={link}
      className="group relative block h-64 overflow-hidden rounded-lg"
    >
      {isFilled.image(image) && (
        <Image
          src={image.url}
          alt={image.alt || label || ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {label && (
          <h3 className="text-center text-2xl font-bold text-white">
            {label}
          </h3>
        )}
      </div>
    </PrismicNextLink>
  );
};

export default CategoryCard;
