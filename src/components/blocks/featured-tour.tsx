import Image from "next/image";
import Link from "next/link";
import { PrismicNextLink } from "@prismicio/next";
type Props = {
  picture?: string;
  alt?: string;
  children?: React.ReactNode;
  bgColour?: string;
  opacity?: number;
  priority?: boolean;
  link?: string;
  locale?: string;
};

const FeaturedTour = ({
  children,
  picture,
  alt,
  bgColour,
  opacity,
  priority,
  link,
}: Props) => {
  return (
    <div className="box-border grow overflow-hidden text-cream relative rounded h-56">
      <Link href={link} className="absolute p-10 left-0 w-full h-full">
        {picture && (
          <Image
            src={picture}
            fill
            alt={alt ? alt : "picture with no alt text"}
            className="z-0 object-cover relative"
            priority={priority ?? false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div
          style={{ backgroundColor: bgColour, opacity: opacity ?? 0.6 }}
          className={`overlay w-full h-full z-10 absolute left-0 top-0`}
        ></div>
        <div className="relative z-20">{children}</div>
      </Link>
    </div>
  );
};

export default FeaturedTour;
