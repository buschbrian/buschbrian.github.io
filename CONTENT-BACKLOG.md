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

The site records a publication date for two notes. It records no date for
the other 18. A dated index and a correct feed both need these dates.

Decision on 2026-08-17: the owner will supply a list of real dates. Do not
use the challenge day and do not use the first commit date.

- Owner: give a publication date for each of the 18 notes without one.
- Then: add each date to the note structured data, the notes index, and
  the feed in one pass.
- Then: decide if a note shows its date to the reader.

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
These terms appear on the site with no explanation.

- Wildland-Urban Interface
- Hydrologic unit code, and drainage area
- Snow water equivalent
- Period of record, and seasonal percentile
- Acre-foot
- GISP, and what the certification requires

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
