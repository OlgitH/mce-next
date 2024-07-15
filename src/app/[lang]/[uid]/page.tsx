import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { Metadata } from "next";
import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";
import { Layout } from "@/components/Layout";
import { components } from "@/slices";
import { PageSectionField } from "@/app/types";

export async function generateMetadata({
  params: { uid, lang },
}: {
  params: { uid: string; lang: string };
}): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID("page", uid, { lang });

  return {
    title: prismic.asText(page.data.title),
  };
}

export default async function Page({
  params: { uid, lang },
}: {
  params: { uid: string; lang: string };
}) {
  const client = createClient();

  const page = await client.getByUID("page", uid, {
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
                      }
                    }
                  }
                }

                ... on feature_list {
                  variation {
                    ...on default {
                      primary {
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
      {/* Page slices */}
      <SliceZone slices={page.data.slices} components={components} />
      {/* Page sections */}
      {page.data.page_sections &&
        page.data.page_sections.map((item, i) => {
          const pageSectionField = item.page_section as PageSectionField;
          return (
            <section
              key={i}
              style={{
                backgroundColor:
                  pageSectionField.data?.background_colour.data.colour_code ??
                  "",
              }}
            >
              <SliceZone
                slices={pageSectionField.data?.slices}
                components={components}
              />
            </section>
          );
        })}
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("page", {
    lang: "*",
    filters: [prismic.filter.not("my.page.uid", "homepage")],
  });

  return pages.map((page) => {
    return {
      uid: page.uid,
      lang: page.lang,
    };
  });
}
