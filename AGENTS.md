# Portfolio repository instructions

## Purpose

This repository contains Brian Busch's public portfolio. It is a static GitHub Pages site.

## Architecture

- Use plain HTML, CSS, and JavaScript.
- Do not add a framework, package manager, or build step unless the owner approves it.
- Keep root-relative links because GitHub Pages serves this repository from the domain root.
- Keep responsive images in `assets/images/r/`. Keep the original JPG files as fallbacks.

## Language

Use the house style in `docs/language-style.md` for all new or changed text.

This rule applies to:

- Page copy and metadata
- Alternative text and captions
- Code comments
- Documentation
- Commit messages
- Branch names
- Issues and pull requests
- GitHub workflow names and messages

Do not claim full ASD-STE100 conformance. Full conformance requires the official writing rules and controlled dictionary.

## Code conventions

- Use two spaces for HTML, CSS, and JavaScript indentation.
- Use double quotation marks in HTML and JavaScript.
- Use semantic HTML and one `h1` element on each content page.
- Give each image useful alternative text.
- Give each unlabeled control an accessible name.
- Keep keyboard navigation and visible focus styles.
- Do not add a dependency when the platform can do the work.

## Verification

Run these checks after a change:

```sh
node --check assets/js/site.js
git diff --check
```

Also check all changed internal links and image paths. For a user-interface change, inspect the site at 320, 768, 1024, and 1440 CSS pixels.

## Boundaries

- Do not change project facts, dates, awards, authorship, or source claims without evidence.
- Do not delete an image until you confirm that no HTML, CSS, metadata, or structured data uses it.
- Do not rewrite an old article only to change its style. Make content migrations in small, reviewed groups.
