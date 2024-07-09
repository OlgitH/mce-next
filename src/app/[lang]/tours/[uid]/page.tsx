import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";

import { Layout } from "@/components/Layout";
import { components } from "@/slices";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata({ params: { uid, lang } }) {
  const client = createClient();
  const tour = await client.getByUID("tour", uid, { lang });

  return {
    title: tour.data.title,
  };
}

export default async function Tour({ params: { uid, lang } }) {
  const client = createClient();

  const tour = await client.getByUID("tour", uid, {
    lang,
    graphQuery: `{
      tour {
        slices {
          ... on banner {
            variation {
              ...on default {
                primary {
                  ...primaryFields
                  background_colour {
                    ...on brand_colour {
                       colour_code
                    }
                  }
                }
              }
            }
          }
           ... on text_section {
            variation {
              ...on default {
                primary {
                  ...primaryFields
                  background_colour {
                    ...on brand_colour {
                       colour_code
                    }
                  }
                  text_colour {
                    ...on brand_colour {
                       colour_code
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
  });
  const navigation = await client.getSingle("navigation", { lang });
  const settings = await client.getSingle("settings", { lang });

  const locales = await getLocales(tour, client);

  return (
    <Layout locales={locales} navigation={navigation} settings={settings}>
      <SliceZone slices={tour.data.slices} components={components} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("tour", {
    lang: "*",
  });

  return pages.map((tour) => {
    return {
      uid: tour.uid,
      lang: tour.lang,
    };
  });
}
