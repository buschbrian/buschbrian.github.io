// Publishes a frozen snapshot of the Western Water Dashboard system atlas.
//
// The atlas is three Archify diagrams generated in the dashboard repository.
// That folder is ignored by Git there, so the atlas cannot become a second
// committed specification. This script copies one dated snapshot onto the
// portfolio. It does not pretend the snapshot stays true. Run it again when a
// refresh is worth doing.
//
// Each generated file is a complete HTML document with an inline SVG diagram
// and its own viewer. The files are copied without a change, so the published
// bytes match the delivery receipt in the dashboard repository. This script
// writes the landing page that introduces them.
//
// Usage:
//   node scripts/publish-atlas.mjs [path-to-archify-out-directory]
//
// The site has no build step. This script is run by hand.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SOURCE =
  process.argv[2] ||
  join(homedir(), "Developer/western-water-dashboard/.atlas/archify/out");
const OUT_DIR = join("projects", "western-water-dashboard-atlas");
const DIAGRAM_DIR = join(OUT_DIR, "diagrams");
const SITE = "https://buschbrian.github.io";
const PAGE = `${SITE}/projects/western-water-dashboard-atlas/`;
const NOTE = "/notes/utah-water-dashboard-rebuild/";
const DASHBOARD = `${SITE}/western-water-dashboard/`;
const REPO = "https://github.com/buschbrian/western-water-dashboard";

// The dashboard repository stamps what the snapshot describes. Read it rather
// than write a date here, so the page cannot claim a freshness the diagrams do
// not have.
const snapshot = JSON.parse(readFileSync(join(SOURCE, "snapshot.json"), "utf8"));

// One entry for each diagram. The file name is the published URL; the summary
// is the only copy this script owns.
const DIAGRAMS = [
  {
    name: "dataflow",
    file: "data-path.html",
    title: "Daily water data path",
    summary:
      "Nine official storage providers, one snow service, and the U.S. Drought " +
      "Monitor reach three Python jobs. The jobs write committed payloads. The " +
      "payloads are copied into the site and read in the browser."
  },
  {
    name: "architecture",
    file: "runtime.html",
    title: "Typed browser runtime",
    summary:
      "What a page does after it opens. Loaders check every file before use, " +
      "pure models do each calculation once, and the address bar carries the " +
      "view that a reader shares."
  },
  {
    name: "workflow",
    file: "refresh.html",
    title: "Morning refresh run",
    summary:
      "The 12:00 UTC job. Three subjects refresh independently, a failed " +
      "subject keeps its last verified file, and three named conditions each " +
      "open an issue that closes itself."
  }
];

const DESCRIPTION =
  `A frozen snapshot of the Western Water Dashboard system atlas, as the ` +
  `system stood on ${snapshot.checked}. Three diagrams show the data path, ` +
  `the browser runtime, and the daily refresh.`;

function escape(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

mkdirSync(DIAGRAM_DIR, { recursive: true });

for (const d of DIAGRAMS) {
  const stamped = snapshot.diagrams.find((x) => x.name === d.name);
  if (!stamped) throw new Error(`The snapshot does not name ${d.name}.`);
  copyFileSync(join(SOURCE, `${d.name}.html`), join(DIAGRAM_DIR, d.file));
}

// The generated documents are a vendored artifact from Archify. Six rules fail
// inside its viewer chrome, never inside a diagram:
//
//   aria-label-misuse     aria-label on a plain container, where it does nothing
//   prefer-native-element role="region" instead of <section>
//   unique-landmark       a landmark named by a later id
//   attribute-misuse      target and rel on an anchor that JavaScript fills in
//   heading-level         card titles are <h3> under an <h1>, with no <h2>
//   doctype-style         an uppercase <!DOCTYPE html>
//
// These are faults in the generator, not in this site, and repairing 800 KB of
// generated markup on every publish would be fragile. The rules are turned off
// for this folder only. Every hand-written page keeps the full ruleset.
//
// The owner approved this exemption on 2026-09-11. The reason is the scope:
// these files are a portfolio artifact, not application code, and nothing here
// ships inside the dashboard. An exemption that reached the application would
// need a different answer.
const VALIDATE_CONFIG = {
  extends: ["html-validate:recommended", "html-validate:document"],
  rules: {
    "require-sri": "off",
    "aria-label-misuse": "off",
    "prefer-native-element": "off",
    "unique-landmark": "off",
    "attribute-misuse": "off",
    "heading-level": "off",
    "doctype-style": "off"
  }
};
writeFileSync(
  join(DIAGRAM_DIR, ".htmlvalidate.json"),
  JSON.stringify(VALIDATE_CONFIG, null, 2) + "\n"
);

const cards = DIAGRAMS.map(
  (d) => `          <li class="atlas-card">
            <h2><a href="diagrams/${d.file}">${escape(d.title)}</a></h2>
            <p>${escape(d.summary)}</p>
          </li>`
).join("\n");

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escape(DESCRIPTION)}">
    <meta name="theme-color" content="#ffffff">
    <!-- A dated snapshot should not compete in search with the note that
         explains it. This follows the decision recorded in CONTENT-BACKLOG.md
         on 2026-08-24. Remove this line if the page should be indexed. -->
    <meta name="robots" content="noindex">
    <title>Western Water Dashboard system atlas | Brian Busch, GISP</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
    <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16">
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="canonical" href="${PAGE}">
    <link rel="alternate" type="application/rss+xml" title="Notes by Brian Busch" href="/feed.xml">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/site.css">
    <style>
      .page-heading .project-action { margin-top: var(--gap-el) !important; }
      .atlas-cards { list-style: none; margin: var(--gap-section) 0 0; padding: 0; display: grid; gap: var(--gap-el); }
      @media (min-width: 860px) { .atlas-cards { grid-template-columns: repeat(3, 1fr); } }
      .atlas-card { border: 1px solid var(--line); border-radius: var(--r); padding: var(--pad-card); }
      .atlas-card h2 { font-size: var(--fs-subheading); font-weight: 400; margin: 0 0 var(--gap-el); }
      .atlas-card h2 a { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
      .atlas-card h2 a:hover { color: var(--indigo); }
      .atlas-card p { margin: 0; color: var(--body); }
      .atlas-note { margin-top: var(--gap-section); color: var(--muted); max-width: var(--measure); }
    </style>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Brian Busch home"><span class="brand-mark" aria-hidden="true"></span><span>Brian Busch <em>GISP</em></span></a>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-nav-toggle><span></span><span></span><span></span></button>
      <nav class="site-nav" aria-label="Primary navigation" data-nav-menu><a aria-current="page" href="/projects/">Projects</a><a href="/notes/">Notes</a><a href="/involvement/">Involvement</a><a href="/about/">About</a></nav>
    </header>

    <main id="main" class="page">
      <section class="page-heading">
        <p class="eyebrow">Western Water Dashboard</p>
        <h1>System atlas</h1>
        <p>Three diagrams of the same system. Each one answers a different question. Open a diagram to search it, follow one relationship, or play a short guided view.</p>
        <p class="project-action"><a href="${DASHBOARD}">Open the dashboard</a> &middot; <a href="${NOTE}">Read how it was built</a> &middot; <a href="${REPO}">Source on GitHub</a></p>
      </section>

      <ul class="atlas-cards">
${cards}
      </ul>

      <p class="atlas-note">This is a snapshot. It shows the system at commit <code>${escape(snapshot.commit)}</code> of ${escape(snapshot.commitDate)}, checked on ${escape(snapshot.checked)}. The dashboard keeps changing, so the diagrams get older. The repository holds the current architecture.</p>
    </main>

    <footer class="site-footer"><p>Brian Busch | GISP | Geospatial Web Development &amp; Cartography</p><div class="footer-right"><a href="/">Home</a></div></footer>
    <script src="/assets/js/site.js"></script>
  </body>
</html>
`;

writeFileSync(join(OUT_DIR, "index.html"), page);
console.log(
  `Wrote ${OUT_DIR} from the atlas of ${snapshot.checked} ` +
    `(${snapshot.ref} at ${snapshot.commit}).`
);
