import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { Metadata } from "next";
import { getLocales } from "@/lib/getLocales";
import { createClient } from "@/prismicio";
import { Layout } from "@/components/layout";
import { components } from "@/slices";
import BookingForm from "@/components/booking-form"; // Import the correct component

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
          dates {
            label
            reference
            price
            price_children
            start
            end
          }
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
                ...on richText {
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

    const navigation = await client.getSingle("navigation", { lang });
    const settings = await client.getSingle("settings", { lang });
    const locales = await getLocales(tour, client);

    // Extract dates from the response
    const dates = tour?.data?.dates || [];
    // const bookingLink = tour?.data?.booking_link;

    // Check if there are available dates
    const hasAvailableDates = dates.length > 0;

    return (
      <Layout
        locales={locales}
        navigation={navigation}
        settings={settings}
        uid={tour.uid}
      >
        {tour.data.slices.length < 1 && (
          <div className="min-h-screen flex items-center justify-center">
            Tour has no content
          </div>
        )}

        <SliceZone
          context={{ locale: lang }}
          slices={tour.data.slices}
          components={components}
        />

        {/* Conditionally render the BookingForm only if dates are available */}
        {hasAvailableDates && (
          <section
            id="booking-form"
            className="booking-section py-8 bg-emerald-900 text-cream"
          >
            <div className="container mx-auto px-4 sm:px-0 flex justify-center">
              <BookingForm tours={dates} lang={lang} />
            </div>
          </section>
        )}
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
