// Writes feed.xml from the notes in /notes.
// The site has no build step. This script runs in GitHub Actions only.
// It uses the Node standard library and no dependencies.

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://buschbrian.github.io";
const NOTES_DIR = "notes";
const OUT = "feed.xml";

// The reading order of the notes index. A note that is not in this list
// goes after these, in alphabetical order.
const ORDER = [
  "utah-water-dashboard-rebuild",
  "agentic-ai-lessons",
  "utah-reservoir-dashboard",
  "sidewalk-trails-master-plan",
  "future-land-use-millcreek",
  "millcreek-redistricting",
  "wui-boundary-mapping",
  "alcohol-spacing-regulations",
  "polygon-neighbor-coloring",
  "utah-dark-sky-points",
  "utah-scenic-byways",
  "utah-federal-land-ownership",
  "utah-population-hexagons",
  "utah-old-spanish-trail",
  "raster-terrain-study",
  "utah-vintage-atlas",
  "utah-localities-hdx",
  "utah-ai-fictional-map",
  "utah-counties-pen-paper",
  "utah-avalanche-paths",
  "utah-time-and-space",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Makes an RFC 822 date string. Feed readers need this format.
function rfc822(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = DAYS[date.getUTCDay()];
  const month = MONTHS[m - 1];
  return `${day}, ${String(d).padStart(2, "0")} ${month} ${y} 00:00:00 -0600`;
}

// Changes HTML entities to characters, then escapes the five XML characters.
function forXml(value) {
  const text = value
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function match(source, pattern) {
  const found = source.match(pattern);
  return found ? found[1] : null;
}

function readNote(slug) {
  const file = join(NOTES_DIR, slug, "index.html");
  if (!existsSync(file)) return null;
  const source = readFileSync(file, "utf8");
  const title =
    match(source, /"headline":\s*"([^"]*)"/) ||
    match(source, /<h1>([^<]*)<\/h1>/);
  const description = match(
    source,
    /<meta name="description" content="([^"]*)"/,
  );
  const published = match(source, /"datePublished":\s*"(\d{4}-\d{2}-\d{2})"/);
  if (!title || !description) {
    throw new Error(`The note ${slug} has no title or no description.`);
  }
  return { slug, title, description, published };
}

const found = readdirSync(NOTES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const ordered = [
  ...ORDER.filter((slug) => found.includes(slug)),
  ...found.filter((slug) => !ORDER.includes(slug)).sort(),
];

const notes = ordered.map(readNote).filter(Boolean);
const undated = notes.filter((note) => !note.published).length;

const items = notes.map((note) => {
  const url = `${SITE}/notes/${note.slug}/`;
  const lines = [
    "    <item>",
    `      <title>${forXml(note.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <description>${forXml(note.description)}</description>`,
  ];
  if (note.published) lines.push(`      <pubDate>${rfc822(note.published)}</pubDate>`);
  lines.push("    </item>");
  return lines.join("\n");
});

// Use the newest publication date as the build date. This keeps the file
// stable, so a run with no content change makes no commit.
const newest = notes
  .map((note) => note.published)
  .filter(Boolean)
  .sort()
  .pop();

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  GitHub Actions writes this file from the notes in /notes.
  Do not edit it by hand. See scripts/build-feed.mjs.
  An item gets a pubDate only when the note records a datePublished value
  in its structured data.
-->
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notes by Brian Busch</title>
    <link>${SITE}/notes/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Notes on cartography, spatial analysis, and GIS applications by Brian Busch, GISP.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(newest)}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;

writeFileSync(OUT, feed);
console.log(`Wrote ${OUT} with ${notes.length} items. ${undated} have no date.`);
