import { ContentRelationshipField } from "@prismicio/client";
import * as prismic from "@prismicio/client";

export type BrandColourField = ContentRelationshipField<"brand_colour"> & {
  data: {
    colour_code: string;
  };
};

export type PageSectionField = ContentRelationshipField<"page_section"> & {
  data: {
    background_colour: BrandColourField;
    slices: any;
  };
};

export type Locale = {
  lang: string;
  url: string;
  lang_name: string;
};

export type NavigationLink = {
  label: prismic.RichTextField;
  link: prismic.LinkField;
};

export type Settings = {
  data: {
    logo: prismic.ImageField;
    newsletterDisclaimer: prismic.RichTextField;
    newsletterDescription: prismic.RichTextField;
  };
};

export type Navigation = {
  data: {
    links: NavigationLink[];
  };
};
