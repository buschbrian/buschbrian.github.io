# Image fit audit, 2026-11-10

## Method

A script measured each image on all 43 pages at 1440 and 390 CSS pixels.
It compared the image shape to the shape of its box. It recorded these
problems:

- **Empty bands:** `object-fit: contain` leaves bands of the card fill
  (`#f4f6fa`) beside or above the image.
- **Cropped:** `object-fit: cover` cuts part of the image.
- **Uneven row:** images in one row have different heights.
- **Upscaled:** the browser shows a source larger than its pixel size.

The percentage is the part of the box that is empty or cut.
"Off-center" results for side-by-side cards were false positives and are
not listed.

## Fixed in this branch

| Image | Where | Was | Fix |
| --- | --- | --- | --- |
| Millcreek Property Lookup | `/projects/` feature | 52% empty bands | New 4:3 screenshot, `millcreek-property-lookup-card` |
| UGEM Hub | `/projects/` feature | 20% empty bands | New 4:3 screenshot, `ugem-hub-card` |
| Western Water Dashboard map | Home work card, `/projects/` feature | 20% empty bands | New 4:3 screenshot, `western-water-dashboard-map-card` |
| Millcreek Planning Map | `/projects/` feature | 20% empty bands | New 4:3 screenshot, `millcreek-planning-map-card` |

The original files stay. Note pages and `og:image` tags still use them.

## Needs a new screenshot

| Image | Where | Problem | Notes |
| --- | --- | --- | --- |
| Millcreek redistricting | `/projects/` feature | 25% empty bands | The 2022 app may not be live. The story map is the source. |

### How to take a map screenshot

A headless browser does not draw WebGL maps. Use a normal Chrome window
with its own profile and the remote debugging port. Set the viewport to
1400 × 1050 pixels and wait until the map stops loading. Add any query
string to skip the welcome dialog on the dashboard and the Planning Map.

## Needs a card version of a map

These are finished maps, not screenshots. A crop or a new layout is a
cartography decision.

| Image | Where | Problem | Box |
| --- | --- | --- | --- |
| WUI boundary map | `/projects/` feature | 50% empty bands at the sides (portrait map) | 4:3 |
| Utah AI fictional map | `/projects/` gallery | 54% empty bands | 4:5 |
| Old Spanish Trail | `/projects/` gallery | 38% empty bands | 4:5 |
| Utah avalanche paths | `/projects/` gallery | 38% empty bands | 4:5 |
| Day 10 six maps | `/projects/` gallery | 30% cropped at the sides | 4:5 |
| Day 10 six maps | Home challenge feature | 14% (desktop) to 28% (phone) empty bands | 4:3 |
| Alcohol spacing map | `/projects/` feature | 14% empty bands (print layout, not an app) | 4:3 |
| Polygon neighbor coloring | `/projects/` feature | 14% empty bands | 4:3 |
| Future Land Use | Home, `/projects/` feature | 11% empty bands | 4:3 |

## Needs a CSS change

| Item | Where | Problem | Possible fix |
| --- | --- | --- | --- |
| Challenge strip | Home | Square tiles crop the 4:5 card images 20% at the top and bottom. Titles on Day 08 and Day 09 are cut. | Make the tiles 4:5. |
| Band color | `/projects/` features | Empty bands use `#f4f6fa`, so dark screenshots float in a light box. | Fixed when each image is 4:3. |
| Note hero images | 6 note pages | Shown at 864 px from a 720 px source (1.2×). | Add a 1440 px source to `srcset`. |
| Gallery `sizes` | `/projects/` gallery | `sizes` says 345 px. Cards show at 381 px. | Correct the `sizes` value. |

## GitHub

| Item | Problem | Status |
| --- | --- | --- |
| Profile README challenge row | The Zion image was 4:5 and the other three were square. The row was uneven. | Fixed: all four use the 4:5 `-card` images. |
| `claudex-loop` README | The stars badge points to the upstream repository. | Not an image fit problem. Not changed. |

No other public repository README has an image in a card or grid.
