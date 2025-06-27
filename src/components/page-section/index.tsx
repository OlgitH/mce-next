import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  bgColour: string;
};

/**
 * Component to render a section with a background colour and children.
 */
const PageSection = ({ children, bgColour }: Props) => {
  return (
    <section
      style={{
        backgroundColor: bgColour,
      }}
    >
      {children}
    </section>
  );
};

export default PageSection;
