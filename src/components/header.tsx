"use client";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { usePathname } from "next/navigation";
import { Locale, Navigation, Settings } from "@/app/types";
const localeLabels: { [key: string]: string } = {
  "en-gb": "EN",
  "es-co": "ES",
};

type Props = {
  locales: Locale[];
  navigation: Navigation;
  settings: Settings;
};

export default function Header({ locales = [], navigation, settings }: Props) {
  const pathname = usePathname();

  return (
    <header className="py-4">
      <div className="container px-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 leading-none">
        <PrismicNextLink href="/">
          <span className="sr-only">Go to homepage</span>
          {prismic.isFilled.image(settings.data.logo) && (
            <PrismicNextImage
              field={settings.data.logo}
              alt={(settings.data.logo.alt as any) ?? ""}
              width="140"
            />
          )}
        </PrismicNextLink>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-10">
          <ul className="flex flex-wrap gap-6 md:gap-10">
            {navigation.data?.links.map((item, index) => (
              <li
                key={index}
                className="font-semibold tracking-tight text-slate-800"
              >
                <PrismicNextLink field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicNextLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <span aria-hidden="true">🌐</span>
            <ul className="flex flex-wrap gap-3">
              {locales.map((locale) => (
                <li key={locale.lang} className="first:font-semibold">
                  <PrismicNextLink
                    href={locale.url}
                    locale={locale.lang}
                    aria-label={`Change language to ${locale.lang_name}`}
                  >
                    {localeLabels[locale.lang] || locale.lang}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
