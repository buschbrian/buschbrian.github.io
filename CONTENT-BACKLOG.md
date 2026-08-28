# Content backlog

This file lists work that needs more facts or an owner decision. Do not change a claim until you have a reliable source.

## Data and method

- Add a short method section to other map articles when reliable information is available.

Resolved on 2026-08-15: the dark-sky note no longer claims a high concentration of parks. The vintage atlas note names the Esri Living Atlas as the data source. The scenic byways note states that the mileage total is the sum of the UDOT route lengths, calculated in ArcGIS Pro.

## Contact information

- Decide whether to add a resume or curriculum vitae.

Resolved on 2026-08-15: the About page shows a direct email address.

## Plain language

- Move old article text to the rules in `docs/language-style.md`.
- Work in small groups of articles.
- Define GIS terms for general readers.
- Do not change project facts, dates, awards, authorship, or source claims during the language edit.

## Project links

- Add a live project link when a public project is available.
- Keep a static image when no public project is available.

## Project browsing

- Consider filters when the project list becomes difficult to scan.
- Use a small, accessible control. Do not add a framework for this feature.

## Image size

- Consider smaller JPG fallback images for old browsers.
- Keep the current responsive WebP files.
- Measure the result before you replace an image.

---

# Owner input backlog

Added on 2026-08-17. Each item needs information that only the owner has.
The questions that unblock these items are in `docs/interview-questions.md`.
No one can source these from the repository, the site, or a public record.
Work through the sections in order. Section 1 blocks the feed.

## 1. Publication dates

Resolved on 2026-08-28 for 13 of the 18 notes. `node scripts/build-feed.mjs`
now reports 21 items, 5 with no date.

Decision on 2026-08-28: the owner overrode the 2026-08-17 rule against the
challenge day. The twelve 2024 30 Day Map Challenge notes now carry the
date of their challenge day. Day 1 is 2024-11-01 and day 12 is 2024-11-12.
The theme named in each note gives the day number. Source for the theme
list: `30daymapchallenge.com/2024/`.

Four of the twelve dates have a second, independent source that agrees:

- `utah-population-hexagons`, 2024-11-04. A LinkedIn post and the original
  file name `utpophexagon110424`.
- `raster-terrain-study`, 2024-11-06. A LinkedIn post and the original file
  name `raster1110624v2`.
- `utah-old-spanish-trail`, 2024-11-05. A LinkedIn post.
- `utah-time-and-space`, 2024-11-12. The original file name
  `uttimeandspace111224`.

One conflict, left as the challenge day: `utah-vintage-atlas` is day 7,
2024-11-07, but the LinkedIn post went out on 2024-11-08. The map was one
day late. Change the date to 2024-11-08 if the site records the day a map
reached the public instead of the day of the challenge.

`sidewalk-trails-master-plan` is 2026-08-07, from the LinkedIn post.

Resolved on 2026-08-28: `millcreek-redistricting` is 2022-02-18. Source:
the linked StoryMap "City Council Redistricting 2022" records that
publication date.

Still open. These four notes have no date and no evidence in the
repository. Only the owner can supply them:

- `future-land-use-millcreek`. An Esri finalist for 2025.
- `wui-boundary-mapping`. UGEM 2025 and UGIC 2026.
- `alcohol-spacing-regulations`. The work was 2024.
- `polygon-neighbor-coloring`. No year on the site.

- Then: decide if a note shows its date to the reader. The date is in the
  structured data and the feed. It is not yet on the page.

## 2. Professional work needs more depth

Decision on 2026-08-17: work through all five professional notes, one note
at a time.

The three personal-project notes now run to about 2,500 words at the
longest. The professional notes are 242 to 528 words. Two of the shortest
notes are the strongest credentials on the site.

For each project below, record these five items:

1. Your role. State what you did and what other people did.
2. The problem the organization had before the work.
3. The method, in steps a general reader can follow.
4. The result. Give a number when a number exists.
5. The limit. State what the map or the analysis cannot show.

- `sidewalk-trails-master-plan` (242 words). An Esri User Conference Map
  Gallery finalist for 2026. The note does not say how the gap analysis
  works, who adopted the plan, or what changed after adoption.
- `future-land-use-millcreek` (297 words). An Esri User Conference Map
  Gallery finalist for 2025. The note does not say how the General Plan
  chapter became map categories, or who uses the map now.
- `wui-boundary-mapping` (322 words). The note names HB 48 and HB 41. It
  does not explain what the bills require, or what a city must deliver.
- `alcohol-spacing-regulations` (250 words). The note does not give the
  rule the buffers come from, or state who uses the web application.
- `millcreek-redistricting` (528 words). The strongest professional note.
  It still does not give the public turnout, or the adopted result.

## 2b. Fact drift in the water dashboard numbers

Resolved on 2026-08-28: the snow site count moved from 637 to 639. The site
now states 639 in the three places that describe the application today.
Source: `buschbrian.github.io/western-water-dashboard/data/snow_sites.json`,
field `site_count`, retrieved 2026-08-18. The reservoir count is 382 and did
not change.

Two places still read 637, on purpose:

- The figure caption in `utah-water-dashboard-rebuild` reports a reading on
  March 13, 2026, from 549 of the 637 sites. That is a past measurement. Do
  not change it without the roster size on that date.
- `projects/western-water-dashboard-atlas/index.html` holds the number
  inside generated data. Rebuild that page with `scripts/publish-atlas.mjs`
  instead of editing the HTML.

Corrected the same day. The snow count is three different numbers, and the
site must say which one it means:

- `snow_sites.json`, field `site_count`: **639**. This is the roster of
  sites the application knows about. Retrieved 2026-08-18.
- `snowpack.json`, field `site_count`: **638** on 2026-08-27. This is the
  daily payload. It moves as sites report or fail to report.
- The atlas snapshot for 2026-08-23: 637 published and 2 missing.

The site now states 639 and says "in the roster", because the roster is the
stable number. Do not state a daily number in prose. It goes stale in a day.

- These counts change when the roster changes. Check them against the JSON
  API before each release, or state them as approximate.

## 3. Site purpose

Decision on 2026-08-17, refined the same day: the site has two jobs.

1. Get consulting work and side work. The reader is a city director or an
   agency manager who must decide if this person can do the job.
2. Give the owner a place to post and blog.

The two jobs do not conflict. Job 1 sets the standard for a project note.
Job 2 keeps the bar low enough to publish often. A short note is fine.

Resolved on 2026-08-17: the Involvement page is live at `/involvement/`.
It answers the work-history question below. Source material was the vault
note `03 Areas/Career/GitHub Portfolio - Professional Involvement (Draft)`.

This changes what each project note must contain:

- State the problem the organization had, in the first paragraph.
- State the result, with a number when a number exists.
- State your role, and what other people did.
- Give a clear next step for a reader who wants to hire you.

- Decide if the About page needs a rate or a service list. The work
  history question is answered by `/involvement/`.
- Decide if the site needs a services page.

## 4. Terms a general reader does not know

The language rules require an explanation for a GIS term on first use.
These terms appeared on the site with no explanation.

Resolved on 2026-08-26: every term on the list now has an explanation on
first use, or no longer appears on the site.

- Wildland-Urban Interface. The note `wui-boundary-mapping` now opens with
  the definition. The Involvement page and the notes index already had it.
- Hydrologic unit code, and drainage area. Both are explained in
  `utah-water-dashboard-rebuild`.
- Snow water equivalent. Explained in `utah-water-dashboard-rebuild`.
- Seasonal percentile. Explained in `utah-reservoir-dashboard`. The term
  "period of record" does not appear on the site.
- Acre-foot. Now explained on first use in `utah-reservoir-dashboard`.
- GISP. The About page now gives the full name, Certified GIS Professional,
  on first use, and states what the certification requires. Source: the GIS
  Certification Institute, `gisci.org`.

## 5. The 30 Day Map Challenge group

Twelve notes run from 111 to 263 words. They read as captions.

- Decide if these notes stay short, or get the same method treatment.
- Decide if the challenge group stays in the main navigation, or moves
  to one combined article.
- For each map, record the data source and the software. Some notes
  already do this. Most do not.

## 6. Maintenance decisions

- Resolved on 2026-08-17: GitHub Actions writes `feed.xml`. The workflow
  is `.github/workflows/feed.yml` and the script is
  `scripts/build-feed.mjs`. Do not edit `feed.xml` by hand. Add a new note
  slug to the `ORDER` list in the script.
- Resolved on 2026-08-24: the Western Water Dashboard system atlas is
  published at `/projects/western-water-dashboard-atlas/` as a dated,
  frozen snapshot. It is generated in the dashboard repository, where it
  is ignored by Git on purpose. Refresh it by hand with
  `node scripts/publish-atlas.mjs`. Do not edit the published copy. The
  page carries `noindex`, because a generated snapshot should not compete
  in search with the note that explains it. Change that line if the page
  should be indexed.
- The atlas source `atlas/data.mjs` still exists only on one Mac. It is
  ignored by Git in the dashboard repository and has no remote copy.
  Decide where it is backed up. The published snapshot preserves the
  output, not the source.
- Decide if the notes index shows dates after section 1 is complete.
- Decide if the earlier reservoir note stays public, or becomes a
  redirect to the current note.

## 7. The school bus service area analysis

Added on 2026-08-17. This project is not on the site. It corrected a
school district service area analysis. The original measurement ran to a
building corner with no door. The corrected measurement used the nearest
open access point, about 75 feet south. The distance moved across the
rule limit, and a group of students got transportation.

The project shows rule knowledge, an audit of another analysis, and a
measurable result. It fits the consulting purpose of the site better than
any note now published.

- Owner: answer section 7.1 of `docs/interview-questions.md` first. That
  section decides if the work can be published at all.
- Do not publish any figure, map, or document until the owner confirms
  who owns the work and what the public record already contains.
- Decide the form: a method note with no names, or a named case study.
- Decide the words for the residents before any draft.

## 8. Work that cannot be published

- List the projects that hold client or internal business information.
- Decide one pattern for them. A method note with no client data, or a
  private case study sent on request.

## 9. Work on the record with no note on the site

Added on 2026-08-28. A comparison of the LinkedIn profile against the
`notes` directory found five pieces of work that the LinkedIn profile
states, and the site does not describe anywhere. Four of the five are
municipal work for the City of Millcreek.

- The Nearmap imagery widget for ArcGIS Experience Builder. Written in
  TypeScript against the Experience Builder SDK, developed code-first from
  the public repository `github.com/buschbrian/ArcGIS-Experience-SDK`.
  About 45,000 views each year. **Held on 2026-08-28 at the owner's
  direction.** The owner will ask the City of Millcreek before this work
  appears in public. Do not publish it until the owner confirms.
- The citywide ADA ramp inventory. About 1,400 ramps and about 100
  attribute fields, collected with ArcGIS Field Maps and Survey123.
- The address review workflow in ArcGIS Experience Builder. It replaced a
  county process that used email and a spreadsheet.
- The Millcreek Hub site, `maps-millcrk.hub.arcgis.com`, public since
  2019. It is the earliest dated result of the Millcreek GIS program.
- The Capital Improvement Project application and StoryMap, 2021.

Each item needs the same permission check as section 7 before a draft
starts. Each also needs an image. The project cards on `/projects/` and
the home page all use one.

- Owner: answer section 12 of `docs/interview-questions.md` for each item
  you want published.
- Then: decide the form for each. A project card, a note, or both.
- Do not draft a note before the permission answer.

## 10. The 2024 challenge run stopped at day 12

Added on 2026-08-28. The site holds twelve maps from the 2024 30 Day Map
Challenge, days 1 to 12. The owner did not finish the remaining eighteen
days for a personal reason that the site does not need to state.

Both index pages already say "Selected maps from the 2024 30 Day Map
Challenge". That wording is accurate and it needs no explanation. A reader
who is deciding whether to hire does not need a reason for an unfinished
personal challenge.

- Do not add a health reason or any other personal reason to the site.
- Keep the word "Selected" on both index pages.
- If the owner wants the run described, use one neutral sentence: the run
  stopped after day 12.

## 11. The atlas page cannot be fixed from this repository

Added on 2026-08-28. `projects/western-water-dashboard-atlas/index.html`
reports 637 snow sites. `scripts/publish-atlas.mjs` copies that number from
`~/Developer/utah-reservoir-dashboard/.atlas/repository/atlas.html`, which
also reports 637. Running the script again changes nothing.

The number is also correct where it stands. The atlas describes the system
on a stated date, 2026-08-23, when the payload published 637 sites and 2
were missing.

- Do not edit the generated HTML by hand.
- Rebuild the atlas in the dashboard repository first, then run
  `node scripts/publish-atlas.mjs` here.
