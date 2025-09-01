import { KeyTextField } from "@prismicio/client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  bgColour?: KeyTextField;
};

/**
 * Component to render a section with a background colour and children.
 */
const PageSection = ({ children, bgColour }: Props) => {
  return (
    <section
      style={{
        backgroundColor: bgColour && bgColour,
      }}
    >
      {children}
    </section>
  );
};

export default PageSection;
