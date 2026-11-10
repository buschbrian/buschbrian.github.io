# Site review, 2026-11-10

## Method

- A link check of all 47 pages: 1,987 links, internal paths, `#` anchors, and 76 external URLs.
- An axe-core 4.10 scan of 43 pages at 1440 and 390 CSS pixels (WCAG 2.2 AA and best practice).
- A test of the menu with a keyboard and at phone width.
- A read of each page for facts, clarity, voice, alt text, and descriptions.

## Fixed in this branch

- The challenge links on the ten 2026 pages list Day 1 to Day 10. Before, nine pages stopped at Day 9, and the Day 10 page left out Day 9.
- The menu closes on a click outside it. Escape returns focus to the menu button.
- The feed link on the notes page has an underline (axe: link-in-text-block).
- The two handles of the Day 4 year slider have names (axe: aria-input-field-name).
- Alt text now describes four maps: raster terrain, time and space, alcohol spacing, and HB 41.
- Eight meta descriptions are now 160 characters or fewer.
- The 404 page has a description. The Day 4 map page has a site title and icon links.
- The 2024 challenge pages use the same label separator as the 2026 pages.
- The projects page says "Read the note" for notes, and its 2026 summary includes Day 10.
- Small wording fixes on the WUI and sidewalk pages.

After these fixes, axe reports no violations. All internal links and anchors resolve. External links return 200, or a bot block (403 or 999) from sites that refuse scripts.

## Needs Brian

### Facts

| Page | Question |
| --- | --- |
| `projects/` | The card says 404 reservoirs and 639 snow sites. The live dashboard shows 409 reservoirs. The rebuild note says 637 sites in two places. Update to the current counts? |
| `notes/western-reservoir-storage/` | 405 reservoirs is the Day 1 snapshot. Say "snapshot" so it does not look like an error next to 404 or 409? |
| `notes/millcreek-redistricting/` | "Published February 18, 2022" is before the May 9, 2022 adoption that the page reports. |
| `notes/wasatch-front-walk-to-transit/` | 44 stops plus 25 TRAX platforms is 69, not 73. |
| `notes/white-rim-sunrise-skyline/` | 25 or 26 minutes; 6:50 or 6:54. |
| `notes/utah-urban-and-rural/` | Panel 6 says "Rural" at 27.4% on 99.2%. The Census rural figure on the page is 10.2% on 98.9%. |
| `notes/agentic-ai-lessons/` | What are the "69 reservoirs"? What was "175 percent" too large in Detroit? |
| `notes/alcohol-spacing-regulations/` | Names for the zone codes (C, M, MD, CCOZ, OHW-VCSD). Which buffer distance applies to which place? |
| `notes/utah-avalanche-paths/` | The source for "one of the most avalanche-prone corridors". |
| `notes/utah-vintage-atlas/` | The link text says David Rumsey Map Collection. The link goes to an Esri styles gallery. |
| `notes/millcreek-planning-map/`, `notes/millcreek-property-lookup/` | Are "no viewer numbers yet" and "screen reader test not complete" still true? |
| `notes/sidewalk-trails-master-plan/` | One line says the city built the sidewalk data. Another says "I built the GIS data." |
| `notes/ugem-hub/` | The role for Emma Hollinger. |
| `involvement/` | Add the 2025 UGEM WUI talk to the speaking table? The WUI page names it. |
| Home, Day 5 | Theme name: "Senses: Sight" or "Sight". For 2024: "Line Features" or "Lines". |
| `notes/` (CodePen) | The link uses a CodePen editor URL. Visitors usually need the public `/pen/` URL. |

### Voice (rule 4: name the people in shared work)

These sentences use "I" for city work. Name the people and roles, or use "helped".

- `index.html`: "Earlier I set up the city's GNSS field program".
- `about/`: "I built the city's first public ArcGIS Hub".
- `about/`: "I built the Western Water Dashboard with TypeScript". The projects page says AI agents wrote most of the code.
- `notes/millcreek-planning-map/`, `notes/millcreek-property-lookup/`: "I designed and built the application."
- `notes/millcreek-redistricting/`: "I developed six initial alternatives."
- `notes/wui-boundary-mapping/`: "I developed it with the Unified Fire Authority".

### Optional clarity

- `index.html`: "Maps and computer science by day."
- Define on first use: GNSS, MS4, AEC/BIM, sUAS (about); NIMS, ICS (involvement); UGEM, UGIC (WUI note).
- The notes index is not in date order. Say what the order is, or sort by date.
- "Explore the collection" does not say where it goes.
- The 2026 finalist submission has two URL forms on two pages.
