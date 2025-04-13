"use client";

import { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import * as prismic from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { usePathname } from "next/navigation";
import { Locale, Navigation, Settings } from "@/app/types";
import Socials from "@/components/socials/basic";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLocale, setCurrentLocale] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const pathname = usePathname();

  // Find the current language by matching the pathname, but don't reorder the list
  useEffect(() => {
    const currentLanguage =
      locales.find(
        (locale) => pathname.startsWith(locale.url) || pathname === locale.url
      )?.lang || "en-gb"; // Default to "en-gb" if no match is found
    setCurrentLocale(currentLanguage);
  }, [pathname, locales]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60 || window.innerWidth < 600) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full bg-darkBlue text-cream transition-all duration-300 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <nav>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 transition-all duration-300">
              <PrismicNextLink field={navigation.data?.links[0].link}>
                <span className="sr-only">Go to homepage</span>
                {prismic.isFilled.image(settings.data.logo) && (
                  <PrismicNextImage
                    field={settings.data.logo}
                    alt={(settings.data.logo.alt as any) ?? ""}
                    width={isScrolled ? 40 : 60} // Shrinks logo when scrolled
                  />
                )}
              </PrismicNextLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4 items-center">
              {navigation.data?.links.map((item, i) => (
                <PrismicNextLink key={i} field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicNextLink>
              ))}
              <Socials size="small" />
            </div>

            {/* Language Switcher */}
            <div className="hidden md:block flex flex-wrap gap-3">
              <ul className="flex flex-wrap gap-3">
                {locales.map((locale) => (
                  <li key={locale.lang} className="first:font-semibold">
                    <PrismicNextLink
                      href={locale.url}
                      locale={locale.lang}
                      aria-label={`Change language to ${locale.lang_name}`}
                      className={
                        currentLocale === locale.lang
                          ? "bg-blue-500 text-white p-2 rounded"
                          : "hover:bg-gray-200 p-2 rounded"
                      }
                    >
                      {localeLabels[locale.lang] || locale.lang}
                    </PrismicNextLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 z-50"
              >
                {isOpen ? (
                  <XMarkIcon className="h-10 w-10 text-cream" />
                ) : (
                  <Bars3Icon className="h-10 w-10 text-cream" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="flex flex-col p-4 space-y-4">
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
          </div>
          <div className="flex flex-wrap gap-3">
            <ul className="flex flex-wrap gap-3 pl-4">
              {locales.map((locale) => (
                <li key={locale.lang} className="first:font-semibold">
                  <PrismicNextLink
                    href={locale.url}
                    locale={locale.lang}
                    aria-label={`Change language to ${locale.lang_name}`}
                    className={
                      currentLocale === locale.lang
                        ? "bg-blue-500 text-white p-2 rounded"
                        : "hover:bg-gray-200 p-2 rounded"
                    }
                  >
                    {localeLabels[locale.lang] || locale.lang}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
