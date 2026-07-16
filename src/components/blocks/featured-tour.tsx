import Image from "next/image";
import Link from "next/link";

type Props = {
  picture?: string;
  alt?: string;
  children?: React.ReactNode;
  priority?: boolean;
  link?: string;
  locale?: string;
};

const FeaturedTour = ({ children, picture, alt, priority, link }: Props) => {
  return (
    <>
      {link && (
        <Link
          href={link}
          className="group relative block h-64 overflow-hidden rounded-lg"
        >
          {picture && (
            <Image
              src={picture}
              fill
              alt={alt ? alt : "picture with no alt text"}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={priority ?? false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
            {children}
          </div>
        </Link>
      )}
    </>
  );
};

export default FeaturedTour;
