# Brian Busch Portfolio

A static GitHub Pages site for Brian Busch's cartography and GIS work. The site uses plain HTML, CSS, and JavaScript. It has no build step. The only external resource is Google Fonts.

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
- Behavior: `assets/js/site.js`

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
npx --yes html-validate@11.6.2 "**/*.html"
git diff --check
```

Check all changed links and image paths. Test interface changes with a keyboard and at the widths in `CONTRIBUTING.md`.

The **Validate site** workflow runs the first two checks on each pull request.

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
