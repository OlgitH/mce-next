import { PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import * as prismic from "@prismicio/client";
import { PrismicRichText } from "./PrismicRichText";
import { Settings } from "@/app/types";

export default function SignUpForm({ settings }: { settings: Settings }) {
  return (
    <div className="py-20 bg-neutral-100 flex justify-center">
      <form
        action="/api/sign-up"
        method="post"
        className="grid w-full max-w-xl grid-cols-1 gap-6"
      >
        {prismic.isFilled.richText(settings.data.newsletterDisclaimer) && (
          <div className="text-center tracking-tight text-black">
            <PrismicRichText
              field={settings.data.newsletterDescription}
              components={{
                heading1: ({ children }: { children: React.ReactNode }) => (
                  <h1 className="mb-4 text-black-900 last:mb-0 text-6xl">
                    {children}
                  </h1>
                ),
                paragraph: ({ children }: { children: React.ReactNode }) => (
                  <p className="mb-4 last:mb-0">{children}</p>
                ),
              }}
            />
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          <div className="relative">
            <label>
              <span className="sr-only">Email address</span>
              <input
                name="email"
                type="email"
                placeholder="jane.doe@example.com"
                required={true}
                className="w-full rounded border border-slate-500 bg-slate-600 py-3 pl-3 pr-10 text-white placeholder-slate-400"
              />
            </label>
            <button
              type="submit"
              className="absolute bottom-0 right-0 top-0 flex items-center justify-center px-3 text-2xl text-slate-400"
            >
              <span className="sr-only">Submit</span>
              <span aria-hidden={true}>&rarr;</span>
            </button>
          </div>
          {prismic.isFilled.richText(settings.data.newsletterDisclaimer) && (
            <p className="text-center text-xs">
              <PrismicText field={settings.data.newsletterDisclaimer} />
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
