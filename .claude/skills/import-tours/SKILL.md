---
name: import-tours
description: Turn a filled-in .docx into new Tour documents in the live Prismic repo (magic-coffee), created as drafts for review before publishing.
---

# Import Tours into Prismic

This skill converts a specifically-formatted `.docx` file into Prismic `tour`
documents via the [Prismic Migration API](https://prismic.io/docs/migration-api-technical-reference).
New tours are always created as **drafts** — the Migration API cannot publish
directly, so every tour created this way must be reviewed and published by
hand in Prismic.

It maps onto the `tour` custom type defined in `customtypes/tour/index.json`
and its slices (`banner`, `tour_info_section`). If that schema changes,
`scripts/parse-docx.js` and `scripts/import-tours.js` need updating to match.

## One-time setup

1. Dependencies (`mammoth`, `docx`, `cheerio`, `dotenv`, `@prismicio/client`)
   are already in `package.json`. Run `npm install` if you haven't recently.
2. Generate a Prismic write token: in the Prismic repo (magic-coffee) go to
   **Settings → API & Security → Write APIs** and create a bearer token.
3. Copy `.env.example` to `.env.local` (already gitignored) and paste the
   token in as `PRISMIC_WRITE_TOKEN`. Never put it in `.env` (that file is
   *not* gitignored in this repo) or commit it anywhere.

## Step 1 — Generate a template

```
npm run tours:template
```

This writes `tours-import/Tour Import Template.docx` plus an empty
`tours-import/images/` folder. The template already contains a worked
example tour — duplicate that block per tour you're adding, then delete or
overwrite the example.

## Step 2 — Fill in the docx

**One Heading 1 = one tour.** Put as many tours in one document as you like;
each new Heading 1 starts a new tour. Content before the first Heading 1 is
ignored (that's where the instructions live).

Under each tour's Heading 1, use exactly these Heading 2 section names, in
any order:

### Details (a 2-column table: Field | Value)

All rows are optional — leave the Value cell blank rather than deleting the
row.

| Field | What it does |
|---|---|
| UID | The URL slug (`/tours/<uid>`). Auto-generated from the title if blank. |
| Meta Title | Browser tab / SEO title. Defaults to the tour title. |
| Meta Description | SEO description. |
| Video Embed URL | A YouTube or Vimeo link. Other providers aren't auto-embedded — add those manually in Prismic afterwards. |
| Banner Image | Filename of the hero banner image (must exist in the images folder). If set, a Banner slice is created at the top of the page. |
| Banner Heading | Text shown over the banner. Defaults to the tour title. |
| Feature Image | Image used if this tour is later added to a homepage "Featured Tours" list. Defaults to the Banner Image if omitted. |
| Feature Description | Short blurb used in the same homepage feature card. |
| Title (ES) | Spanish page title. Optional — see **Spanish translation** below. |
| Meta Title (ES) | Spanish meta title. Falls back to the English Meta Title if omitted. |
| Meta Description (ES) | Spanish meta description. Falls back to English if omitted. |
| Banner Heading (ES) | Spanish banner heading. Falls back to English if omitted. |
| Feature Description (ES) | Spanish feature blurb. Falls back to English if omitted. |

### Overview

One or more paragraphs of free text. Bold, italic and links are preserved.

If a paragraph starts with **`PRICING NOTE`** or **`DATES NOTE`**, it's treated
as an editorial note for whoever reviews the import — it's excluded from the
page's Overview and instead surfaced separately in the dry-run summary and
printed by whichever tool ran the import, for sign-off before publishing.
Use these to flag assumptions (currency conversions, placeholder dates,
ambiguous source pricing) that need a human decision.

### What's Included

A bulleted list — one item per line.

### What's Not Included

A bulleted list — one item per line.

### Spanish translation (optional)

Add any of the `(ES)` Details rows above, and/or an **Overview (ES)**,
**What's Included (ES)**, or **What's Not Included (ES)** section (same
format as their English counterparts), and the importer automatically
creates a second document in the Spanish locale (`es-co` by default, override
with `--lang2`), linked to the English one as a translation. Any `(ES)` field
or section you don't fill in falls back to the English content.

Images, and the Dates & Pricing table (dates, prices, Stripe references), are
shared between languages — there's no per-language date table. The Spanish
page's generated date summary auto-translates the date range and "adults/
children" wording, but the `dates` group's `label` field itself is shared
verbatim between locales; edit it per-locale in Prismic afterwards if you
want a fully localized label there too.

### Dates & Pricing (a table)

Header row: `Label | Start Date | End Date | Price (Adult) | Price (Child) | Stripe Reference`.
One data row per departure. **Dates must be `YYYY-MM-DD`.** Prices are plain
numbers, no currency symbol. Stripe Reference is whatever reference/SKU you
use for that departure in Stripe — the Stripe **product ID** itself isn't set
by this import; add it in Prismic once the product exists in Stripe.

These rows drive the booking form on the tour page, so at least one row is
required for a bookable tour.

### Gallery Images

A bulleted list of image filenames (must exist in the images folder).

## Step 3 — Put images in the images folder

Every filename referenced in Banner Image, Feature Image, or Gallery Images
must exist in the images folder (defaults to `tours-import/images/`, or pass
`--images=<path>`). Missing files are reported as warnings and simply
skipped — the tour still imports without them.

## Step 4 — Dry run

```
npm run tours:import -- --file="tours-import/Tour Import Template.docx"
```

Without `--push` this only parses and prints a summary: tour titles, UIDs,
counts of dates/images/includes, whether a Spanish translation was found, any
`PRICING NOTE`/`DATES NOTE` editorial notes pulled out of the Overview, and
any warnings (missing images, unrecognized Details fields, missing
Overview/Dates, duplicate UIDs). Nothing is sent to Prismic. Fix any warnings
and re-run until it's clean.

## Step 5 — Push to Prismic

```
npm run tours:import -- --file="tours-import/Tour Import Template.docx" --push
```

`--lang` sets the primary locale (default `en-gb`). For any tour with Spanish
`(ES)` content in the docx (see **Spanish translation** above), a second
document is automatically created in `--lang2` (default `es-co`), linked to
the first as a translation — no separate run needed.

This creates one or two `tour` documents per Heading 1 (English, plus Spanish
if present), as **drafts**, in the `magic-coffee` repository. Open the repo,
check the Migration Release (or each document individually), review, and
publish.

## What actually gets created

Per tour: `title`, `meta_title`, `meta_description`, the `dates` group (for
the Stripe booking form), and a slice zone containing (in order) an optional
`banner` slice and a `tour_info_section` slice (overview, a generated dates
summary, price/price_children from the first date row, gallery images,
included/not-included lists). `background_colour`/`text_colour` links on
slices are left unset — set those manually in Prismic if you want non-default
styling. `feature_title`/`description`/`feature_image` are only set if you
filled in Feature Image or Feature Description. Images are uploaded once and
shared between the English and Spanish documents, not duplicated.

## Troubleshooting

- **"No tours found"** — the doc has no Heading 1 styled paragraph. Use
  Word's actual "Heading 1" style, not bold text.
- **A section's content didn't come through** — the Heading 2 text must match
  one of the section names above, including the `(ES)` suffix for Spanish
  ones (case-insensitive, apostrophes/`&` are tolerated, but don't rename or
  merge sections).
- **Video field missing after import** — only youtu.be/youtube.com and
  vimeo.com links are auto-embedded (via their oEmbed endpoints). Paste the
  URL into Prismic's Embed field manually for anything else.
- **Wrong repository** — the repo name is read from `slicemachine.config.json`
  (`magic-coffee`); this always targets the live repo, there is no
  staging/sandbox split in this project.
