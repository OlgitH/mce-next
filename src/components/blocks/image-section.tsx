import Image from "next/image";
import Link from "next/link";
import Container from "../container";
type Props = {
  picture?: string;
  alt?: string;
  children?: React.ReactNode;
  twColour?: string;
  priority?: boolean;
};

const ImageSection = ({
  children,
  picture,
  alt,
  twColour,
  priority,
}: Props) => {
  //   const styles = {
  //     backgroundImage: `url(${picture})`,
  //     backgroundAttachment: "fixed",
  //     backgroundRepeat: "no-repeat",
  //     backgroundSize: "cover",
  //     backgroundPosition: "center",
  //   };
  return (
    <section className="image-section relative w-full h-80">
      <div
        className={`${twColour} absolute z-10 left-0 top-0 w-full h-full opacity-60`}
      ></div>
      <Container classNames="z-50 relative flex justify-center items-center big-heading h-full">
        {children && children}
      </Container>

      {picture && (
        <Image
          src={picture}
          fill
          alt={alt ? alt : "picture with no alt text"}
          className="z-0 object-cover"
          sizes="100vw"
          priority={priority ?? false}
        />
      )}
    </section>
  );
};

export default ImageSection;
