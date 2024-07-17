import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import FeatureList from "@/components/feature-list";

/**
 * Props for `FeatureSection`.
 */
export type FeatureSectionProps = SliceComponentProps<Content.FeatureAreaSlice>;

/**
 * Utility function to filter features by category UID.
 */
const filterFeaturesByCategory = (features: any[], categoryUid: string) => {
  return features.filter((feature) =>
    feature.data.categories.some(
      (item: any) => item.category.uid === categoryUid
    )
  );
};

/**
 * Component for "FeatureSection" Slices.
 */
const FeatureSection = ({
  slice,
  context,
}: FeatureSectionProps): JSX.Element => {
  // console.log("XXX", context.features);

  const location = slice.primary.type.toLowerCase(); // assuming slice.primary.type is either "London" or "Colombia"
  const locationFeatures = filterFeaturesByCategory(
    (context as any).features,
    location
  );

  const services = filterFeaturesByCategory(locationFeatures, "service");
  const customPackages = filterFeaturesByCategory(
    locationFeatures,
    "custom-package"
  );
  const towns = filterFeaturesByCategory(locationFeatures, "town");

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="py-20"
    >
      <div className="container">
        <h2>Services</h2>
        <div className="flex gap-4">
          <FeatureList features={services} />
        </div>
        <h2>Custom Packages</h2>
        <div className="flex gap-4">
          <FeatureList features={customPackages} />
        </div>

        <h2>Visit magical towns</h2>
        <div className="flex gap-4">
          <FeatureList features={towns} />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
