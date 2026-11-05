# Brian Busch Portfolio

A static GitHub Pages site for Brian Busch's geospatial applications and GIS engineering work. The site uses plain HTML, CSS, and JavaScript. It has no build step. It loads no external resources. The site serves its own copy of the Inter font from `assets/fonts/`.

The live site is at <https://buschbrian.github.io/>.

## Preview the site

Run this command from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Site structure

Each page is an `index.html` file in its own folder.

- Homepage: `index.html`
- Projects: `projects/index.html`
- Notes index: `notes/index.html`
- Notes: `notes/<slug>/index.html`, one folder for each article
- About: `about/index.html`
- Involvement: `involvement/index.html`
- Page not found: `404.html`
- Western Water Dashboard system atlas: `projects/western-water-dashboard-atlas/`
- Styles: `assets/css/site.css`
- Navigation: `assets/js/site.js`
- Image viewer: `assets/js/image-viewer.mjs` and `assets/js/image-geometry.mjs`
- Challenge reading controls: `assets/js/challenge-reading.mjs`
- Map animations: `assets/video/`
- Fixed figure data: `assets/data/map-challenge-2026.json`

Responsive WebP images are in `assets/images/r/`. The original JPG files in `assets/images/` are the fallback images.

These files help search engines and feed readers:

- `sitemap.xml`: edit it by hand when you add or remove a public page.
- `robots.txt`: points to the sitemap.
- `feed.xml`: a workflow writes this file. See [Feed](#feed).

A page with `<meta name="robots" content="noindex">` is a draft or a snapshot. Do not add it to `sitemap.xml` or `notes/index.html`. The feed script skips it.

## Feed

`scripts/build-feed.mjs` writes `feed.xml` from the notes. The **Build the feed** workflow runs the script on each push to `master` that changes a note. The workflow then commits the new `feed.xml`. To set the position of a note in the feed, add its slug to the `ORDER` list in the script.

## System atlas

`scripts/publish-atlas.mjs` copies a dated snapshot of the Western Water Dashboard diagrams into `projects/western-water-dashboard-atlas/`. Run it by hand:

```sh
node scripts/publish-atlas.mjs [path-to-archify-out-directory]
```

The generated diagram files have their own html-validate exemption in `diagrams/.htmlvalidate.json`. Do not use that exemption for a hand-written page.

## Check a change

Run these commands:

```sh
node --check assets/js/site.js
node --check assets/js/image-viewer.mjs
node --check assets/js/challenge-reading.mjs
node --test tests/*.test.mjs
npx --yes html-validate@11.6.2 "**/*.html"
git diff --check
```

Check all changed links and image paths. Test interface changes with a keyboard and at the widths in `CONTRIBUTING.md`.

The **Validate site** workflow checks JavaScript syntax, image geometry and HTML on each pull request.

Install the pre-commit hooks once in each clone:

```sh
pre-commit install
```

The hooks scan staged changes for secrets, private keys, and large files. The **Hooks** workflow runs the same hooks and a full-history secret scan.

## Language standard

Use the ASD-STE100-aligned house style in `docs/language-style.md`. This rule applies to site copy, documentation, commits, issues, and pull requests.

The repository does not claim full ASD-STE100 conformance. Full conformance requires the official Issue 9 rules and controlled dictionary.

## Publish

GitHub Pages publishes the files from the root of the `master` branch. The `.nojekyll` file disables Jekyll processing.

## Planning files

- `CONTENT-BACKLOG.md`: content work that needs more facts or an owner decision.
- `docs/interview-questions.md`: questions for the owner that unblock the backlog.

## Contribute

Read `AGENTS.md` and `CONTRIBUTING.md` before you make a change.

## Homepage selection

On November 3, 2026, Brian selected four subjects for the homepage: the 2025
and 2026 Esri finalist maps, the current 30 Day Map Challenge, and Western
Water Dashboard. Other work remains on Projects. Notes is a reading index
for methods, experiments, and lessons.

When posting a challenge map, add its tile first in the homepage hero and
make it the large tile. Mark its day in the month strip as posted, and update
the posted counts. Add its entry and day link on Projects, then its entry on
Notes. The homepage uses a dated collection label so it remains
accurate after November.

## Image viewer and challenge reading

The image viewer uses a native dialog and JavaScript modules. It needs no
framework, external service or build step. The geometry module has Node tests
for fit, zoom anchoring, pan limits, resizing, overview bounds and pinch input.

The viewer shows the existing preview while it loads the original image. A
`data-full` attribute can override the source. Image links in figure captions
use the same viewer. Modified clicks keep the link's normal browser behavior.
The download link saves the original image without opening another window.

Fit image shows the whole image. Read labels shows it at its original pixel
size. The percentage measures image pixels against CSS pixels, so 100% means
one image pixel per CSS pixel. Dragging and ordinary scrolling move the image.
Pinching and Ctrl or Command with scrolling zoom around the pointer. Double-click
or double-tap switches between fit and original size. The overview shows the
visible region and lets a reader choose another area.

Arrow keys pan a zoomed image. At fit, left and right switch images. Page Up
and Page Down also switch images. The 0 key fits the image; 1 shows original
size. Escape closes the viewer and returns focus to the trigger. Native dialog
focus handling keeps the underlying page inactive while the viewer is open.
Opening motion respects the reduced-motion preference.

On 2026 challenge notes, navigation uses the existing challenge links. This
keeps previous and next links in step with the published pages. Map details
and code excerpts are collapsed after JavaScript loads. The original HTML,
images, links and code remain available when JavaScript is unavailable.
The collection uses consistent image frames that show each map in full.

For browser verification, check portrait and landscape images, figure-caption
links, fit and original size, keyboard focus, resize while zoomed, gallery
navigation, failed image loading and retry. Check 320, 768, 1024 and 1440 CSS
pixels. Touch emulation does not replace testing on an actual iOS or Android
device.
