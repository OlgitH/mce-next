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
  const page = await client.getByUID("page", "success", { lang });

  return {
    title: prismic.asText(page.data.title),
  };
}

export default async function SuccessPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const client = createClient();

  const features = await client.getAllByType("feature", { lang });

  const page = await client.getByUID("page", "success", { lang });
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
