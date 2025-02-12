import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { Metadata } from "next";
import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";
import { Layout } from "@/components/layout";
import { components } from "@/slices";

export async function generateMetadata({
  params: { uid, lang },
}: {
  params: { uid: string; lang: string };
}): Promise<Metadata> {
  const client = createClient();

  try {
    const tour = await client.getByUID("tour", uid, { lang });
    return {
      title: tour.data.title,
    };
  } catch (error) {
    console.error("Error fetching tour metadata:", error);
    return {
      title: "Tour not found",
    };
  }
}

export default async function Tour({
  params: { uid, lang },
}: {
  params: { uid: string; lang: string };
}) {
  const client = createClient();

  try {
    const tour = await client.getByUID("tour", uid, {
      lang,
      graphQuery: `{
        tour {
          booking_link
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
            ... on tour_info_section {
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

    const navigation = await client.getSingle("navigation", {
      lang,
    });
    const settings = await client.getSingle("settings", {
      lang,
    });
    const locales = await getLocales(tour, client);

    return (
      <Layout
        locales={locales}
        navigation={navigation}
        settings={settings}
        uid={tour.uid}
      >
        <SliceZone
          context={{ bookingLink: tour.data.booking_link, locale: lang }}
          slices={tour.data.slices}
          components={components}
        />
      </Layout>
    );
  } catch (error) {
    console.error("Error fetching tour data:", error);
    return <p>Error loading tour. Please try again later.</p>;
  }
}

export async function generateStaticParams() {
  const client = createClient();

  try {
    const pages = await client.getAllByType("tour", {
      lang: "*",
    });

    return pages.map((tour) => {
      return {
        uid: tour.uid,
        lang: tour.lang,
      };
    });
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
