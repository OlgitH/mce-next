#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const prismic = require("@prismicio/client");
const { parseDocx } = require("./parse-docx");

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

require("dotenv").config({ path: path.join(REPO_ROOT, ".env.local") });

const slicemachineConfig = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, "slicemachine.config.json"), "utf8"),
);
const REPOSITORY_NAME = slicemachineConfig.repositoryName;

function parseArgs(argv) {
  const args = { push: false, lang: "en-gb", lang2: "es-co" };
  for (const arg of argv) {
    if (arg === "--push") args.push = true;
    else if (arg.startsWith("--file=")) args.file = arg.slice("--file=".length);
    else if (arg.startsWith("--images="))
      args.images = arg.slice("--images=".length);
    else if (arg.startsWith("--lang=")) args.lang = arg.slice("--lang=".length);
    else if (arg.startsWith("--lang2=")) args.lang2 = arg.slice("--lang2=".length);
    else if (arg.startsWith("--only=")) args.only = arg.slice("--only=".length);
  }
  return args;
}

function usageAndExit() {
  console.error(
    [
      "Usage: node import-tours.js --file=<path to .docx> [--images=<folder>] [--lang=en-gb] [--lang2=es-co] [--only=uid1,uid2] [--push]",
      "",
      "  --file    Path to the filled-in tour import .docx (required)",
      "  --images  Folder containing the images referenced in the docx",
      "            (defaults to an \"images\" subfolder next to the docx, else the docx's folder)",
      "  --lang    Prismic locale to create documents in (default: en-gb)",
      "  --lang2   Prismic locale for the Spanish translation, only created for tours that",
      "            have any \"(ES)\" content in the docx (default: es-co)",
      "  --only    Comma-separated UIDs to process, skipping the rest of the docx",
      "  --push    Actually write to Prismic. Without this flag, the script only",
      "            prints a dry-run summary so you can check the parsed content first.",
    ].join("\n"),
  );
  process.exit(1);
}

function resolveImagesDir(docxPath, imagesArg) {
  if (imagesArg) return path.resolve(process.cwd(), imagesArg);
  const sibling = path.join(path.dirname(docxPath), "images");
  if (fs.existsSync(sibling)) return sibling;
  return path.dirname(docxPath);
}

function resolveImage(imagesDir, filename) {
  const p = path.join(imagesDir, filename);
  return fs.existsSync(p) ? p : null;
}

function textParagraph(text) {
  return { type: "paragraph", text, spans: [] };
}

function summarizeDates(dates) {
  return dates.map((d) => {
    const range = d.end ? `${d.start} - ${d.end}` : d.start;
    let price = "";
    if (d.price && d.priceChildren) price = ` — £${d.price} adults / £${d.priceChildren} children`;
    else if (d.price) price = ` — £${d.price} adults`;
    return textParagraph(`${d.label}: ${range}${price}`);
  });
}

const MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function formatEsRange(startIso, endIso) {
  if (!startIso) return "";
  const [ys, ms, ds] = startIso.split("-").map(Number);
  if (!endIso) return `${ds} de ${MESES_ES[ms - 1]} de ${ys}`;
  const [ye, me, de] = endIso.split("-").map(Number);
  if (ms === me) return `${ds}-${de} de ${MESES_ES[ms - 1]} de ${ye}`;
  return `${ds} de ${MESES_ES[ms - 1]} - ${de} de ${MESES_ES[me - 1]} de ${ye}`;
}

function summarizeDatesEs(dates) {
  return dates.map((d) => {
    const label = formatEsRange(d.start, d.end) || d.label;
    const range = d.end ? `${d.start} - ${d.end}` : d.start;
    let price = "";
    if (d.price && d.priceChildren) price = ` — £${d.price} adultos / £${d.priceChildren} niños`;
    else if (d.price) price = ` — £${d.price} adultos`;
    return textParagraph(`${label}: ${range}${price}`);
  });
}

function hasSpanish(tour) {
  return (
    tour.overviewEs.length > 0 ||
    tour.includesEs.length > 0 ||
    tour.excludesEs.length > 0 ||
    Boolean(tour.titleEs || tour.metaTitleEs || tour.metaDescriptionEs)
  );
}

function embedEndpoint(url) {
  if (/youtu\.?be/i.test(url)) {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  }
  if (/vimeo\.com/i.test(url)) {
    return `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
  }
  return null;
}

async function buildEmbedField(url, warnings) {
  const endpoint = embedEndpoint(url);
  if (!endpoint) {
    warnings.push(
      `Video Embed URL "${url}" isn't a recognized YouTube/Vimeo link — skipped. Add it manually in Prismic.`,
    );
    return undefined;
  }
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const oembed = await res.json();
    return { ...oembed, embed_url: url };
  } catch (err) {
    warnings.push(
      `Couldn't fetch embed info for "${url}" (${err.message}) — skipped. Add it manually in Prismic.`,
    );
    return undefined;
  }
}

function printDryRunSummary(tours, imagesDir) {
  console.log(`\nParsed ${tours.length} tour(s):\n`);
  for (const tour of tours) {
    console.log(`— ${tour.title}  (uid: ${tour.uid})`);
    console.log(`    Overview paragraphs: ${tour.overview.length}`);
    console.log(`    Includes: ${tour.includes.length}, Excludes: ${tour.excludes.length}`);
    console.log(`    Dates & Pricing rows: ${tour.dates.length}`);
    console.log(`    Gallery images referenced: ${tour.galleryImages.length}`);
    if (hasSpanish(tour)) {
      console.log(`    Spanish translation: yes (overview ${tour.overviewEs.length}, includes ${tour.includesEs.length}, excludes ${tour.excludesEs.length})`);
    }
    if (tour.editorialNotes && tour.editorialNotes.length > 0) {
      console.log(`    Editorial notes (excluded from Overview, sign off before publishing):`);
      for (const note of tour.editorialNotes) console.log(`      - ${note}`);
    }
    for (const name of tour.galleryImages) {
      const found = resolveImage(imagesDir, name);
      if (!found) tour.warnings.push(`Gallery image not found in ${imagesDir}: "${name}"`);
    }
    if (tour.bannerImage && !resolveImage(imagesDir, tour.bannerImage)) {
      tour.warnings.push(`Banner image not found in ${imagesDir}: "${tour.bannerImage}"`);
    }
    if (tour.featureImage && !resolveImage(imagesDir, tour.featureImage)) {
      tour.warnings.push(`Feature image not found in ${imagesDir}: "${tour.featureImage}"`);
    }
    if (tour.warnings.length > 0) {
      console.log(`    Warnings:`);
      for (const w of tour.warnings) console.log(`      - ${w}`);
    }
    console.log("");
  }
}

function buildAssets(tour, imagesDir, migration) {
  const galleryImages = tour.galleryImages
    .map((name) => {
      const p = resolveImage(imagesDir, name);
      if (!p) return null;
      return {
        image: migration.createAsset(fs.readFileSync(p), name, {
          alt: tour.title,
        }),
      };
    })
    .filter(Boolean);

  let bannerAsset = null;
  if (tour.bannerImage) {
    const p = resolveImage(imagesDir, tour.bannerImage);
    if (p) {
      bannerAsset = migration.createAsset(fs.readFileSync(p), tour.bannerImage, {
        alt: tour.title,
      });
    }
  }

  const featureImageName = tour.featureImage || tour.bannerImage;
  let featureAsset = null;
  if (featureImageName) {
    const p = resolveImage(imagesDir, featureImageName);
    if (p) {
      featureAsset = migration.createAsset(fs.readFileSync(p), featureImageName, {
        alt: tour.title,
      });
    }
  }

  return { galleryImages, bannerAsset, featureAsset };
}

async function buildDocumentData(tour, assets, variant) {
  const warnings = tour.warnings;
  const es = variant === "es";

  const title = (es && tour.titleEs) || tour.title;
  const overview = (es && tour.overviewEs.length ? tour.overviewEs : null) || tour.overview;
  const includes = (es && tour.includesEs.length ? tour.includesEs : null) || tour.includes;
  const excludes = (es && tour.excludesEs.length ? tour.excludesEs : null) || tour.excludes;
  const metaTitle = (es && tour.metaTitleEs) || tour.metaTitle;
  const metaDescription = (es && tour.metaDescriptionEs) || tour.metaDescription;
  const bannerHeading = (es && tour.bannerHeadingEs) || tour.bannerHeading;
  const featureDescription = (es && tour.featureDescriptionEs) || tour.featureDescription;
  const datesSummary = es ? summarizeDatesEs(tour.dates) : summarizeDates(tour.dates);

  const datesGroup = tour.dates.map((d) => ({
    label: d.label,
    price: d.price ? Number(d.price) : null,
    price_children: d.priceChildren ? Number(d.priceChildren) : null,
    reference: d.reference || "",
    start: d.start || null,
    end: d.end || null,
    stripe_product_id: "",
  }));

  const slices = [
    {
      slice_type: "tour_info_section",
      variation: "default",
      primary: {
        overview,
        dates: datesSummary,
        price: tour.dates[0]?.price ? Number(tour.dates[0].price) : null,
        price_children: tour.dates[0]?.priceChildren
          ? Number(tour.dates[0].priceChildren)
          : null,
        gallery_images: assets.galleryImages,
        included_section: [
          {
            includes,
            does_not_include: excludes,
          },
        ],
        background_colour: null,
        text_colour: null,
      },
      items: [],
    },
  ];

  if (assets.bannerAsset) {
    slices.unshift({
      slice_type: "banner",
      variation: "default",
      primary: {
        inner_text: [
          { type: "heading2", text: bannerHeading || title, spans: [] },
        ],
        background_image: assets.bannerAsset,
        background_colour: null,
        text_colour: null,
        opacity: "0.5",
        has_overlay: true,
        full_height: true,
        show_social_links: false,
      },
      items: [],
    });
  }

  const data = {
    title,
    meta_title: metaTitle,
    meta_description: metaDescription,
    dates: datesGroup,
    slices,
  };

  if (tour.videoUrl) {
    const embed = await buildEmbedField(tour.videoUrl, warnings);
    if (embed) data.video = embed;
  }

  if (assets.featureAsset || featureDescription) {
    data.feature_title = title;
    data.description = featureDescription || "";
    if (assets.featureAsset) data.feature_image = assets.featureAsset;
  }

  return data;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) usageAndExit();

  const docxPath = path.resolve(process.cwd(), args.file);
  if (!fs.existsSync(docxPath)) {
    console.error(`File not found: ${docxPath}`);
    process.exit(1);
  }
  const imagesDir = resolveImagesDir(docxPath, args.images);

  let { tours, mammothWarnings } = await parseDocx(docxPath);

  if (tours.length === 0) {
    console.error(
      "No tours found. Make sure each tour starts with a Heading 1 containing the tour title.",
    );
    process.exit(1);
  }

  if (args.only) {
    const wanted = new Set(args.only.split(",").map((s) => s.trim()));
    tours = tours.filter((t) => wanted.has(t.uid));
    if (tours.length === 0) {
      console.error(`No tours matched --only=${args.only}`);
      process.exit(1);
    }
  }

  const uids = tours.map((t) => t.uid);
  const dupes = uids.filter((u, i) => uids.indexOf(u) !== i);
  if (dupes.length > 0) {
    console.error(`Duplicate UIDs in this document: ${[...new Set(dupes)].join(", ")}`);
    process.exit(1);
  }

  if (mammothWarnings.length > 0) {
    console.log("Docx conversion notes:");
    mammothWarnings.forEach((w) => console.log(`  - ${w}`));
  }

  printDryRunSummary(tours, imagesDir);

  if (!args.push) {
    console.log(
      "DRY RUN — nothing was written to Prismic. Review the summary above, fix any warnings, then re-run with --push.",
    );
    return;
  }

  if (!process.env.PRISMIC_WRITE_TOKEN) {
    console.error(
      "PRISMIC_WRITE_TOKEN is not set. Add it to .env.local (see SKILL.md for how to generate one).",
    );
    process.exit(1);
  }

  const writeClient = prismic.createWriteClient(REPOSITORY_NAME, {
    writeToken: process.env.PRISMIC_WRITE_TOKEN,
  });
  const migration = prismic.createMigration();

  for (const tour of tours) {
    const assets = buildAssets(tour, imagesDir, migration);
    const data = await buildDocumentData(tour, assets, "en");
    const enDoc = migration.createDocument(
      {
        type: "tour",
        uid: tour.uid,
        lang: args.lang,
        data,
      },
      tour.title,
    );

    if (hasSpanish(tour)) {
      const esData = await buildDocumentData(tour, assets, "es");
      migration.createDocument(
        {
          type: "tour",
          uid: tour.uid,
          lang: args.lang2,
          data: esData,
        },
        tour.titleEs || tour.title,
        { masterLanguageDocument: enDoc },
      );
    }
  }

  console.log(`\nPushing ${tours.length} tour(s) to Prismic repository "${REPOSITORY_NAME}" as drafts...`);
  await writeClient.migrate(migration, {
    reporter: (event) => console.log(`  [${event.type}]`, event.data ?? ""),
  });

  console.log(
    `\nDone. New tours were created as DRAFTS. Open https://${REPOSITORY_NAME}.prismic.io/ and check the Migration Release to review and publish them.`,
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { buildDocumentData, buildAssets, hasSpanish, resolveImagesDir };
