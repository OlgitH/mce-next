import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { components } from "@/slices";
import { PageSectionField } from "@/app/types";
import PageSection from "@/components/page-section";
export async function generateMetadata({
  params: { uid, lang },
}: {
  params: { uid: string; lang: string };
}): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID("page", "homepage", { lang });
  console.log("meta title: ", page.data.meta_title);

  return {
    title: page.data.meta_title ?? prismic.asText(page.data.title),
    description: page.data.meta_description ?? "",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_URL ?? "https://magiccoffeeexpedition.co.uk"
    ),
    alternates: {
      canonical: "/",
      languages: {
        "en-GB": "/en-gb",
        "de-CO": "/es-co",
      },
    },
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

        page_sections {
          page_section {
            ...page_sectionFields
            background_colour {
              ...on brand_colour {
                colour_code
              }
            }
            slices {

              ... on tour_section {
                  variation {
                    ...on default {
                      primary {
                        ...primaryFields
                        tours {
                          tour {
                            ...tourFields
                          }
                        }
                      }
                    }
                  }
                }

              
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
                        text_colour {
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
                      }
                    }
                  }
                }

                ... on feature_list {
                  variation {
                    ...on default {
                      primary {
                        ...primaryFields
                        featured_items {
                          featured_item {
                            ...featured_itemFields
                          }
                        }
                      }
                    }
                  }
                }

            }
          }
        }
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
                  text_colour {
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
  console.log("locales:", locales);

  return (
    <Layout
      locales={locales}
      navigation={navigation}
      settings={settings}
      uid={page.uid}
    >
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ features }}
      />
      {page.data.page_sections.length < 1 && (
        <div className="min-h-screen flex items-center justify-center">
          Page has no content
        </div>
      )}
      {/* Page sections */}
      {page.data.page_sections &&
        page.data.page_sections.map((item, i) => {
          // console.log("PS: ", item);

          const pageSectionField = item.page_section as PageSectionField;
          return (
            <PageSection
              key={i}
              bgColour={
                pageSectionField.data?.background_colour.data.colour_code ?? ""
              }
            >
              <SliceZone
                slices={pageSectionField.data?.slices}
                components={components}
              />
            </PageSection>
          );
        })}
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
