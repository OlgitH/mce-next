import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";
import { Layout } from "@/components/layout";
import { components } from "@/slices";
import { isFilled } from "@prismicio/client";
import type {
  PageSectionDocumentData,
  BrandColourDocumentData,
} from "@/../prismicio-types";
import type { FilledContentRelationshipField } from "@prismicio/client";
import PageSection from "@/components/page-section";
type Props = {
  params: Promise<{ uid: string; lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid, lang } = await params;

  const client = createClient();
  const page = await client.getByUID("page", uid, { lang });

  return {
    title: prismic.asText(page.data.title),
  };
}

export default async function Page({ params }: Props) {
  const { uid, lang } = await params;

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
              ... on text_section {
                variation {
                  ...on default {
                    primary {
                      ...primaryFields
                    }
                  }
                }
              }
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
    <Layout
      locales={locales}
      navigation={navigation}
      settings={settings}
      uid={page.uid}
    >
      {/* Page slices */}
      <SliceZone slices={page.data.slices} components={components} />

      {/* Page sections */}
      {page.data.page_sections?.map((item, i) => {
        const section = item.page_section;

        // Use isFilled to check if the page_section is valid
        if (!isFilled.contentRelationship(section)) return null;

        // Infer the correct type now that it's confirmed to be filled
        const data = section.data as PageSectionDocumentData;

        // Use isFilled again for nested background_colour
        const bgColour = isFilled.contentRelationship(data.background_colour)
          ? (data.background_colour.data as BrandColourDocumentData).colour_code
          : "";

        return (
          <PageSection key={i} bgColour={bgColour}>
            <SliceZone slices={data.slices ?? []} components={components} />
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
    filters: [prismic.filter.not("my.page.uid", "homepage")],
  });

  return pages.map((page) => ({
    uid: page.uid,
    lang: page.lang,
  }));
}
