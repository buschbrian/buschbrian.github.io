# Content to-do list (from the site audit)

These need your input/judgment rather than mechanical fixes, so they weren't done automatically. Pulled from the full-repo audit; PR #6 covers everything else.

## Data methodology gaps (biggest one)

Only 2 of 16 notes (`wui-boundary-mapping`, `alcohol-spacing-regulations`) have a real "how this was built" section naming datasets and logic. The rest look thin by comparison now. Three specifically assert facts with no sourcing at all:

- **`notes/utah-dark-sky-points/index.html`** — claims Utah has "one of the highest concentrations of International Dark-Sky Parks anywhere." No citation, no count, no "Data source" field in the meta-grid (every comparable post has one). Need: the actual source and ideally a count to back the claim, or soften the claim if it can't be sourced.
- **`notes/utah-vintage-atlas/index.html`** — no data source named anywhere on the page for the urban areas/rivers layers shown.
- **`notes/utah-scenic-byways/index.html`** — repeats "1,893.84 miles" in the title, meta description, deck, and meta-grid with no explanation of how it was computed and no link to the underlying UDOT dataset. Need: confirm the UDOT source and briefly explain the calculation (e.g., sum of designated byway centerline length).

The other 14 notes at least name a source in the meta-grid (UGRC, USGS, NPS, UDOT, Census, HDX, Esri Living Atlas) but could get the same "How it was built" treatment as the two done ones, time permitting.

## Content gaps

- **No resume/CV and no direct contact method anywhere on the site** (no `mailto:`, no résumé link) — only path to contact is LinkedIn/GitHub in the footer. Biggest gap for a portfolio aimed at recruiters/hiring managers.
- 12 of 16 map-challenge notes use GIS jargon ("hillshade," "hypsometric tinting," "Summarize Within," graph coloring) with no plain-language gloss for a non-GIS visitor.
- Most challenge maps are static images only — no link to a live/interactive version (only alcohol-spacing and the reservoir dashboard have one).

## UX ideas (low priority)

- No way to filter/browse the 16 notes by theme (cartography vs. policy vs. automation) now that `/notes/` just redirects to `/projects/` — it's one long scroll.
- Non-webp JPG fallbacks are large (up to ~1.3MB, e.g. `raster1110624v2.jpg`) — low risk since webp/srcset covers modern browsers, but worth trimming if legacy-client bandwidth matters.
