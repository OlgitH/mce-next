import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { components } from "@/slices";

export async function generateMetadata({
  params: { uid, lang },
}: {
  params: { uid: string; lang: string };
}): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID("page", "homepage", { lang });

  return {
    title: prismic.asText(page.data.title),
  };
}

export default async function Index({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const client = createClient();

  const features = await client.getAllByType("feature", { lang });

  const page = await client.getByUID("page", "homepage", {
    lang,
    graphQuery: `{
      page {
        
        slices {

          ...on banner {
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

          ... on tour_section {
            variation {
              ...on default {
                primary {
                  ...primaryFields
                  background_colour {
                    ...on brand_colour {
                      colour_code
                    }
                  }
                  tours {
                    tour {
                      ...tourFields
                      background_colour {
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

      
          ... on feature_area {
            variation {
              ...on default {
                primary {
                  type
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

  const locales = await getLocales(page, client);

  return (
    <Layout locales={locales} navigation={navigation} settings={settings}>
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ features }}
      />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("page", {
    lang: "*",
    filters: [prismic.filter.at("my.page.uid", "homepage")],
  });

  return pages.map((page) => {
    return {
      lang: page.lang,
    };
  });
}
