#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
} = require("docx");

const OUT_DIR = path.resolve(process.cwd(), "tours-import");
const OUT_FILE = path.join(OUT_DIR, "Tour Import Template.docx");

function cell(text, { bold = false, width } = {}) {
  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, bold })] })],
  });
}

function detailsTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [cell("Field", { bold: true, width: 35 }), cell("Value", { bold: true, width: 65 })] }),
      ...rows.map(([field, value]) => new TableRow({ children: [cell(field, { width: 35 }), cell(value, { width: 65 })] })),
    ],
  });
}

function datesTable(rows) {
  const header = ["Label", "Start Date", "End Date", "Price (Adult)", "Price (Child)", "Stripe Reference"];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: header.map((h) => cell(h, { bold: true })) }),
      ...rows.map((r) => new TableRow({ children: r.map((v) => cell(v)) })),
    ],
  });
}

function bulletList(items) {
  return items.map(
    (text) =>
      new Paragraph({
        text,
        bullet: { level: 0 },
      }),
  );
}

function p(text) {
  return new Paragraph({ children: [new TextRun(text)] });
}

const introduction = [
  new Paragraph({ children: [new TextRun({ text: "TOUR IMPORT TEMPLATE — read me first", bold: true })] }),
  p(
    "1. For each tour, duplicate everything from its Heading 1 title down to the end of its Gallery Images list. One Heading 1 = one tour. This document can hold multiple tours.",
  ),
  p(
    "2. Keep the six Heading 2 section names exactly as shown below: Details, Overview, What's Included, What's Not Included, Dates & Pricing, Gallery Images.",
  ),
  p(
    "3. Put every image you reference (gallery, banner, feature) in an \"images\" folder next to this document, named exactly as you reference it below (e.g. valley-01.jpg).",
  ),
  p("4. Dates must be written as YYYY-MM-DD, e.g. 2026-09-14."),
  p(
    "5. Everything in the Details table is optional — leave the Value column blank rather than deleting the row.",
  ),
  p(
    "6. Spanish translation is optional. Add a \"Title (ES)\", \"Meta Title (ES)\", \"Meta Description (ES)\", " +
      "\"Banner Heading (ES)\" or \"Feature Description (ES)\" row to the Details table, and/or an \"Overview (ES)\", " +
      "\"What's Included (ES)\" or \"What's Not Included (ES)\" section, to have the importer also create a linked " +
      "Spanish (es-co) translation alongside the English document. Any \"(ES)\" field you omit falls back to the " +
      "English version. Images and the Dates & Pricing table are shared between languages — only the date range " +
      "shown in the Spanish page's date summary is auto-translated.",
  ),
  p(
    "This introduction is ignored by the importer — it only reads content starting from the first Heading 1.",
  ),
  new Paragraph({ text: "", pageBreakBefore: true }),
];

const exampleTour = [
  new Paragraph({ text: "Sacred Valley Coffee Trek", heading: HeadingLevel.HEADING_1 }),

  new Paragraph({ text: "Details", heading: HeadingLevel.HEADING_2 }),
  detailsTable([
    ["UID (optional)", "sacred-valley-coffee-trek"],
    ["Meta Title (optional)", "Sacred Valley Coffee Trek | Magic Coffee Expedition"],
    ["Meta Description (optional)", "A 6-day trek through Peru's Sacred Valley visiting smallholder coffee farms."],
    ["Video Embed URL (optional)", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["Banner Image (optional)", "banner.jpg"],
    ["Banner Heading (optional)", "Sacred Valley Coffee Trek"],
    ["Feature Image (optional)", "feature.jpg"],
    ["Feature Description (optional)", "6 days trekking to remote coffee farms in Peru's Sacred Valley."],
    ["Title (ES) (optional)", "Trekking Cafetero por el Valle Sagrado"],
    ["Meta Title (ES) (optional)", "Trekking Cafetero por el Valle Sagrado | Magic Coffee Expedition"],
    ["Meta Description (ES) (optional)", "Un trekking de 6 días por el Valle Sagrado del Perú visitando pequeños cafetales."],
  ]),

  new Paragraph({ text: "Overview", heading: HeadingLevel.HEADING_2 }),
  p(
    "Join us on a 6-day trek through the Sacred Valley, visiting smallholder coffee farms and learning about traditional processing methods.",
  ),
  p("You'll stay in family-run lodges, share meals with local growers, and hike through some of Peru's most spectacular scenery."),

  new Paragraph({ text: "Overview (ES)", heading: HeadingLevel.HEADING_2 }),
  p(
    "Únete a este trekking de 6 días por el Valle Sagrado, visitando pequeños cafetales y conociendo métodos tradicionales de procesamiento.",
  ),
  p("Te alojarás en posadas familiares, compartirás comidas con los caficultores locales, y caminarás por algunos de los paisajes más espectaculares del Perú."),

  new Paragraph({ text: "What's Included", heading: HeadingLevel.HEADING_2 }),
  ...bulletList([
    "6 nights' accommodation",
    "All meals from Day 1 dinner to Day 6 breakfast",
    "English-speaking guide",
    "Airport transfers",
  ]),

  new Paragraph({ text: "What's Included (ES)", heading: HeadingLevel.HEADING_2 }),
  ...bulletList([
    "6 noches de alojamiento",
    "Todas las comidas desde la cena del día 1 hasta el desayuno del día 6",
    "Guía de habla inglesa",
    "Traslados desde/hacia el aeropuerto",
  ]),

  new Paragraph({ text: "What's Not Included", heading: HeadingLevel.HEADING_2 }),
  ...bulletList(["International flights", "Travel insurance", "Personal spending money"]),

  new Paragraph({ text: "What's Not Included (ES)", heading: HeadingLevel.HEADING_2 }),
  ...bulletList(["Vuelos internacionales", "Seguro de viaje", "Gastos personales"]),

  new Paragraph({ text: "Dates & Pricing", heading: HeadingLevel.HEADING_2 }),
  datesTable([
    ["14-19 Sept 2026", "2026-09-14", "2026-09-19", "1450", "1050", "SVCT-SEP26"],
    ["12-17 Oct 2026", "2026-10-12", "2026-10-17", "1450", "1050", "SVCT-OCT26"],
  ]),

  new Paragraph({ text: "Gallery Images", heading: HeadingLevel.HEADING_2 }),
  ...bulletList(["valley-01.jpg", "valley-02.jpg", "farmers-01.jpg"]),
];

const doc = new Document({
  sections: [{ children: [...introduction, ...exampleTour] }],
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, "images"), { recursive: true });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUT_FILE, buffer);
  console.log(`Wrote template to ${OUT_FILE}`);
  console.log(`Put images in ${path.join(OUT_DIR, "images")}`);
});
