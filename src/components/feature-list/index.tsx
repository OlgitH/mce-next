import * as prismic from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";
import Image from "next/image";

type Props = {
  features: any[];
};

/**
 * Component to render a list of features.
 */
const FeatureListComponent = ({ features }: Props) => {
  return (
    <section>
      {features && (
        <div className="flex flex-wrap gap-4 items-end">
          {features.map((feature, i) => {
            const image = feature?.data?.image;
            const title = feature?.data?.featured_title;
            const text = feature?.data?.featured_text;

            return (
              <div
                key={i}
                className="group cursor-pointer text-center flex flex-col items-center sm:flex-1 grow"
              >
                {isFilled.image(image) && (
                  <div className="rounded-full bg-white w-[180px] h-[180px] flex justify-center items-center">
                    <Image
                      src={image.url}
                      alt={image.alt || ""}
                      width={180}
                      height={180}
                      className="w-full scale-105 group-hover:scale-110 transition-all duration-300 ease-in-out object-contain"
                    />
                  </div>
                )}

                {isFilled.keyText(title) && (
                  <PrismicRichText
                    field={title}
                    components={{
                      heading3: ({
                        children,
                      }: {
                        children: React.ReactNode;
                      }) => <h3 className="text-xl mt-4">{children}</h3>,
                    }}
                  />
                )}

                {isFilled.richText(text) && (
                  <PrismicRichText
                    field={text}
                    components={{
                      paragraph: ({
                        children,
                      }: {
                        children: React.ReactNode;
                      }) => <p>{children}</p>,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeatureListComponent;
