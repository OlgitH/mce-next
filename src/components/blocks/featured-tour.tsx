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
    <div className="box-border grow overflow-hidden relative group">
      {link && (
        <Link href={link} className="p-10 left-0 w-full h-full">
          <div className="image relative h-[240px] w-full mb-4">
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
              style={{ backgroundColor: bgColour }}
              className="transition-opacity duration-700 opacity-0 pointer-events-none group-hover:opacity-40 group-hover:pointer-events-auto w-full h-full z-10 absolute left-0 top-0"
            ></div>
          </div>

          <div className="relative z-20">{children}</div>
        </Link>
      )}
    </div>
  );
};

export default FeaturedTour;
