// Publishes a frozen snapshot of the Western Water Dashboard system atlas.
//
// The atlas is generated in the dashboard repository and is ignored by Git
// there, so that it cannot become a second committed specification. This
// script copies one dated snapshot onto the portfolio and does not pretend
// the snapshot stays true. Run it again when a refresh is worth doing.
//
// The generated file is an HTML fragment: it opens with a meta charset and
// carries no doctype, html, head or body element. The site requires a
// complete document, so this wraps the fragment rather than copying it.
//
// Usage:
//   node scripts/publish-atlas.mjs [path-to-atlas.html]
//
// The site has no build step. This script is run by hand.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SOURCE =
  process.argv[2] ||
  join(homedir(), "Developer/utah-reservoir-dashboard/.atlas/repository/atlas.html");
const OUT_DIR = join("projects", "western-water-dashboard-atlas");
const SITE = "https://buschbrian.github.io";
const PAGE = `${SITE}/projects/western-water-dashboard-atlas/`;
const NOTE = "/notes/utah-water-dashboard-rebuild/";
const DASHBOARD = `${SITE}/western-water-dashboard/`;

const source = readFileSync(SOURCE, "utf8");

// The fragment's head content ends at the close of its one style element.
const end = source.indexOf("</style>");
if (end === -1) throw new Error("No style element found. Check the source file.");
const head = source.slice(0, end + "</style>".length);
const body = source.slice(end + "</style>".length).trim();

// The atlas stamps its own checked date. Read it rather than write one here,
// so the label cannot disagree with the diagram.
const checked =
  (head + body).match(/ATLAS CHECKED[\s\S]{0,120}?(\d{4}-\d{2}-\d{2})/)?.[1] ||
  (head + body).match(/(\d{4}-\d{2}-\d{2})/)?.[1];
if (!checked) throw new Error("No date found in the atlas. Check the source file.");

const DESCRIPTION =
  `A frozen snapshot of the Western Water Dashboard system atlas, as the ` +
  `system stood on ${checked}. An interactive diagram of the sources, the ` +
  `pipeline, the payloads, and the reader-facing surfaces.`;

// The generated markup is written for a browser, not for the site's HTML
// rules. These four repairs are mechanical and change no behaviour, so they
// belong here rather than in a rule exemption: the site keeps one standard.
function repair(markup) {
  return markup
    // A bare button submits by default. There is no form here, so naming the
    // type is a no-op that satisfies the rule and states the intent.
    .replace(/<button(?![^>]*\btype=)([^>]*)>/g, "<button type=\"button\"$1>")
    // One inline style, lifted to the stylesheet below.
    .replace(/(<div id="stats")\s+style="[^"]*"/, "$1")
    // A second landmark needs its own name once the snapshot note is added.
    .replace(/<aside id="panel">/, "<aside id=\"panel\" aria-label=\"Chapter detail\">")
    .replace(/[ \t]+$/gm, "");
}

// A small overlay rather than a bar in the flow: the atlas lays itself out
// against the full viewport, so anything added to the flow moves the diagram.
const BANNER_CSS = `
  #stats { display: flex; min-width: 0; flex: 1; }
  .snapshot-note {
    position: fixed; right: 10px; bottom: 26px; z-index: 40;
    display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
    justify-content: flex-end; max-width: min(92vw, 640px);
    padding: 7px 10px; border: 1px solid var(--rule);
    background: var(--paper); color: var(--ink-2);
    font-family: var(--mono); font-size: 10px; letter-spacing: .06em;
    text-transform: uppercase;
  }
  .snapshot-note b { color: var(--ink); font-weight: 600; }
  .snapshot-note a { color: var(--ink); text-underline-offset: 3px; }
  .snapshot-note a:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  @media (max-width: 720px) { .snapshot-note { display: none; } }`;

const BANNER = `
<aside class="snapshot-note" aria-label="About this snapshot">
  <span>Snapshot: the system on <b>${checked}</b></span>
  <a href="${DASHBOARD}">Live dashboard</a>
  <a href="${NOTE}">How it was built</a>
</aside>`;

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${DESCRIPTION}">
    <meta name="theme-color" content="#1e1d15">
    <meta name="robots" content="noindex">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="canonical" href="${PAGE}">
${repair(head.replace(/^<meta charset="utf-8">\n?/, "")).replace(/^/gm, "    ")}
    <style>
${BANNER_CSS.replace(/^/gm, "  ")}
    </style>
  </head>
  <body>
${repair(body).replace(/^/gm, "    ")}
${BANNER.replace(/^/gm, "    ")}
  </body>
</html>
`;

mkdirSync(OUT_DIR, { recursive: true });
// Indenting the fragment leaves whitespace on its blank lines.
writeFileSync(join(OUT_DIR, "index.html"), page.replace(/[ \t]+$/gm, ""));
console.log(`Wrote ${join(OUT_DIR, "index.html")} from the atlas of ${checked}.`);
