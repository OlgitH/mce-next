const fs = require("fs");
const mammoth = require("mammoth");
const cheerio = require("cheerio");
const {
  paragraphsToRichText,
  listItemsToRichText,
  textOf,
} = require("./lib/richtext");

const DETAIL_FIELD_KEYS = {
  uid: "uid",
  title: "title",
  "meta title": "metaTitle",
  "meta description": "metaDescription",
  "video embed url": "videoUrl",
  "banner image": "bannerImage",
  "banner heading": "bannerHeading",
  "feature image": "featureImage",
  "feature description": "featureDescription",
};

function normalizeHeading(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .trim();
}

function normalizeDetailLabel(text) {
  return text
    .toLowerCase()
    .replace(/\(optional\)/g, "")
    .replace(/\(required\)/g, "")
    .replace(/[’']/g, "")
    .trim();
}

function tableRows($, tableEl) {
  return $(tableEl)
    .find("tr")
    .toArray()
    .map((tr) =>
      $(tr)
        .find("td,th")
        .toArray()
        .map((cell) => textOf($, cell)),
    )
    .filter((row) => row.some((cell) => cell.length > 0));
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function newTour(title) {
  return {
    title,
    titleEs: "",
    uid: "",
    metaTitle: "",
    metaDescription: "",
    metaTitleEs: "",
    metaDescriptionEs: "",
    videoUrl: "",
    bannerImage: "",
    bannerHeading: "",
    bannerHeadingEs: "",
    featureImage: "",
    featureDescription: "",
    featureDescriptionEs: "",
    overview: [],
    overviewEs: [],
    editorialNotes: [],
    includes: [],
    includesEs: [],
    excludes: [],
    excludesEs: [],
    dates: [],
    galleryImages: [],
    warnings: [],
  };
}

function applyDetailsTable($, tableEl, tour) {
  const rows = tableRows($, tableEl);
  for (const row of rows) {
    if (row.length < 2) continue;
    let label = normalizeDetailLabel(row[0]);
    if (label === "field") continue; // header row
    let esSuffix = false;
    if (/\(es\)\s*$/.test(label)) {
      esSuffix = true;
      label = label.replace(/\s*\(es\)\s*$/, "").trim();
    }
    const key = DETAIL_FIELD_KEYS[label];
    if (!key) {
      tour.warnings.push(`Unrecognized field in Details table: "${row[0]}"`);
      continue;
    }
    tour[esSuffix ? `${key}Es` : key] = row[1].trim();
  }
}

function applyDatesTable($, tableEl, tour) {
  const rows = tableRows($, tableEl);
  for (const row of rows) {
    if (row[0] && row[0].trim().toLowerCase() === "label") continue; // header row
    if (row.length < 6) {
      if (row.some((c) => c.trim().length > 0)) {
        tour.warnings.push(
          `Dates & Pricing row has fewer than 6 columns, skipped: ${JSON.stringify(row)}`,
        );
      }
      continue;
    }
    const [label, start, end, price, priceChildren, reference] = row.map(
      (c) => c.trim(),
    );
    if (!label) continue;
    tour.dates.push({ label, start, end, price, priceChildren, reference });
  }
}

/**
 * Parses a filled-in tour import .docx into an array of structured tour objects.
 * See SKILL.md for the required document format.
 */
async function parseDocx(docxPath) {
  const buffer = fs.readFileSync(docxPath);
  const { value: html, messages } = await mammoth.convertToHtml(
    { buffer },
    { includeDefaultStyleMap: true },
  );

  const $ = cheerio.load(html);
  const nodes = $("body")
    .contents()
    .toArray()
    .filter((n) => n.type === "tag");

  const tours = [];
  let currentTour = null;
  let currentSection = null;

  for (const node of nodes) {
    const tag = node.name;

    if (tag === "h1") {
      if (currentTour) tours.push(currentTour);
      currentTour = newTour(textOf($, node));
      currentSection = null;
      continue;
    }

    if (!currentTour) continue; // ignore content before the first H1

    if (tag === "h2") {
      currentSection = normalizeHeading(textOf($, node));
      continue;
    }

    switch (currentSection) {
      case "details":
        if (tag === "table") applyDetailsTable($, node, currentTour);
        break;
      case "overview":
      case "overview (es)":
        if (tag === "p") {
          const text = textOf($, node).trim();
          const target = currentSection === "overview (es)" ? "overviewEs" : "overview";
          if (/^(PRICING NOTE|DATES NOTE)\b/i.test(text)) {
            currentTour.editorialNotes.push(text);
          } else {
            currentTour[target].push(
              ...paragraphsToRichText([node]),
            );
          }
        }
        break;
      case "whats included":
      case "whats included (es)":
        if (tag === "ul" || tag === "ol") {
          const target = currentSection === "whats included (es)" ? "includesEs" : "includes";
          currentTour[target].push(
            ...listItemsToRichText($(node).find("li").toArray()),
          );
        }
        break;
      case "whats not included":
      case "whats not included (es)":
        if (tag === "ul" || tag === "ol") {
          const target = currentSection === "whats not included (es)" ? "excludesEs" : "excludes";
          currentTour[target].push(
            ...listItemsToRichText($(node).find("li").toArray()),
          );
        }
        break;
      case "dates and pricing":
        if (tag === "table") applyDatesTable($, node, currentTour);
        break;
      case "gallery images":
        if (tag === "ul" || tag === "ol") {
          for (const li of $(node).find("li").toArray()) {
            const name = textOf($, li);
            if (name) currentTour.galleryImages.push(name);
          }
        }
        break;
      default:
        break;
    }
  }
  if (currentTour) tours.push(currentTour);

  for (const tour of tours) {
    if (!tour.uid) tour.uid = slugify(tour.title);
    if (!tour.metaTitle) tour.metaTitle = tour.title;
    if (tour.dates.length === 0) {
      tour.warnings.push("No rows found in Dates & Pricing table.");
    }
    if (tour.overview.length === 0) {
      tour.warnings.push("No Overview content found.");
    }
  }

  const mammothWarnings = messages
    .filter((m) => m.type === "warning")
    .map((m) => m.message);

  return { tours, mammothWarnings };
}

module.exports = { parseDocx, slugify };
