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

## Decisions, 2026-11-10

| Item | Decision |
| --- | --- |
| Dashboard reservoir count on `projects/` | "More than 400". The live data has 409 reservoirs and 639 snow sites. Dated notes keep their counts. |
| "I" for city work | Keep. The owner did this work. |
| Redistricting date | February 18, 2022 is when the story map was published. The field now says "Story map published". |
| Planning Map and Property Lookup status lines | Still true. No change. |
| 2025 UGEM WUI talk | Added to the speaking table on `involvement/`. |
| About page, Western Water Dashboard | Now says it was built with AI coding agents. |
| Avalanche Paths claims | Removed. The caption and text now describe the mapped paths only. |
| Home page lede | "Maps and code by day." |
| Vintage atlas link | The link is now on the Esri style name, where it goes. |

## Checked, no change needed

- Walk to transit: 73 is all stops at 10 minutes. 25 of them are TRAX platforms.
- Urban and rural: panel 6 compares the three largest urban areas with everywhere else. It is not the Census rural class.
- White Rim: 6:50 is the hand estimate. The text labels it.
- Agentic AI note: the 69 reservoirs are the earlier, smaller set.
- Day 5 theme: the official name is "Senses: Sight". Pages use the short label.
- CodePen: the editor URL opens read-only without an account.

## Resolved later on 2026-11-10

- `notes/ugem-hub/`: Emma Hollinger is a Hub Architect.
- `notes/agentic-ai-lessons/`: Detroit's recorded storage was 175 percent larger than the capacity the tool gave it.
- `notes/alcohol-spacing-regulations/`: the five zones are listed by full name. The 300-foot and 600-foot distances come from Utah Code 32B-1-202: 300 feet for restaurant licenses, 600 feet for bars and other outlets, along the walking route. Zone names are from a third-party copy of the Millcreek code (Zoneomics), Chapters 18.41, 18.44, 18.46, 18.47, and 18.50.
- Acronyms: each page spells out each acronym at its first use in body text, as "full term (ACR)". Product names, course codes, license names, place labels, headings, and the footer keep the short form.
- The notes index says that the most useful notes come first.
