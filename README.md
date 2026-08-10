# Brian Busch Portfolio

A static GitHub Pages site for Brian Busch's cartography and GIS work. The site uses plain HTML, CSS, and JavaScript. It has no runtime dependencies and no build step.

## Preview the site

Run this command from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Edit content

- Homepage: `index.html`
- Projects: `projects/index.html`
- Notes: `notes/index.html`
- About: `about/index.html`
- Styles: `assets/css/site.css`
- Behavior: `assets/js/site.js`

The `notes/` directory contains the full project articles. Responsive WebP images are in `assets/images/r/`. Original JPG files provide fallback images.

## Check a change

Run these commands:

```sh
node --check assets/js/site.js
git diff --check
```

Check all changed links and image paths. Test interface changes with a keyboard and at the widths in `CONTRIBUTING.md`.

## Language standard

Use the ASD-STE100-aligned house style in `docs/language-style.md`. This rule applies to site copy, documentation, commits, issues, and pull requests.

The repository does not claim full ASD-STE100 conformance. Full conformance requires the official Issue 9 rules and controlled dictionary.

## Publish

GitHub Pages publishes the files from the repository root. The `.nojekyll` file disables Jekyll processing.

## Contribute

Read `AGENTS.md` and `CONTRIBUTING.md` before you make a change.
