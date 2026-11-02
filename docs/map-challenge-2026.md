# Water maps for the 2026 challenge

These figures replay data from the Western Water Dashboard.
The Day 1 maps use Esri's Oceans basemap, captured once from the dashboard's ArcGIS map on November 2, 2026.
A Python script draws every symbol, label, and chart over the basemap.
No generated imagery is used. The public dashboard is unchanged.

## Rendering

Python and Matplotlib draw each frame at 2160 pixels.
FFmpeg scales the frames to 1080 pixels and encodes them at 60 frames per second.
Values ease between monthly or daily observations. Labels, tables, and stills show observed values.
The render scripts are kept outside this repository, with the challenge notes.

Chrome captured each Day 1 basemap once from the live dashboard, at twice its display size.
Each capture keeps the native attribution, the Esri credit, and the scale bar.
A Web Mercator transform places each reservoir and station on the captured image.
The symbols follow the dashboard's capacity rings, storage colors, and precipitation colors.
Label positions stay fixed throughout each scene.
Label placement avoids overlapping boxes and penalizes covered points and crossed leader lines.

Storage labels combine the six largest capacities and the eight largest storage swings.
Capacity ranks use all 405 reservoirs. Swing ranks use the 388 complete records.
The two groups give nine labels.
Each swing is the highest monthly mean minus the lowest, measured in acre-feet.
This is a volume range. It is not cumulative inflow, outflow, or a statistical outlier test.
The period has 11 months, from November 2025 through September 2026.
Koocanusa, Franklin D. Roosevelt Lake, and Mead have the largest ranges.
Their ranges are 2.674558, 2.4871362, and 1.99857133 million acre-feet.
The figure data includes the ranked values, observation months, and label selection.
The storage sidebar shows the combined trend and these three reservoir trends.
Reservoir trends share a 0–100% scale. The combined trend has a labeled 40–65% scale.
Gray lines show the full period. Teal lines show observations through the displayed month.
The article's range plot uses a shared 0–10 million acre-foot scale.
Bars span monthly means. Dots show September storage.

The precipitation sidebar compares the matched sample with its historical normal.
Its station list and labels use the five largest October 31 totals, throughout the scene.
A ripple marks each day that a station gains half an inch or more.

The Day 2 figure has no basemap.
Its first scene plots daily surface elevation for Lake Mead and Lake Powell.
Dashed lines trace each 2026 low back to the last date the lake was that low.
Its second scene draws the Colorado and Columbia reservoir systems as tree diagrams.
Circle size shows capacity. The fill shows the share stored that month.
Links show inferred surface drainage between the represented reservoirs.
They do not follow rivers or show managed water transfers.
The main stem of each tree follows the largest upstream capacity.
The amber chain highlights the longest chain. It does not show water travel time.

## Data snapshots

The compact figure data is in `assets/data/map-challenge-2026.json`.
It includes monthly reservoir storage, inferred links, station coordinates, daily precipitation, and comparison values.

- Reservoirs: [October 31 snapshot](https://github.com/buschbrian/western-water-dashboard/blob/b5627547b0d7fb4daceffd4b5a7fc8cfe69a32d3/reservoirs.json).
- Precipitation: [November 1 snapshot](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/precipitation.json).
- Precipitation history: [1991–2026 records](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/precipitation_history.json).
- Station locations: [SNOTEL roster](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/snow_sites.json).
- Network: [USGS Network-Linked Data Index traces](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/upstream_index.json), retrieved August 30, 2026.
- Lake elevations: [Bureau of Reclamation daily records](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/elevation_history.json).

Storage combines the same 388 reservoirs in every month, from November 2025 through September 2026.
Each value divides summed monthly mean storage by summed capacity.
The result is 51.6207% in November, 60.0903% in May, and 48.4393% in September.
The dashboard's October 31 latest-reading total was 48.3530%. Both September and October round to 48.4% by coincidence.
Their observations and reservoir sets differ.

Precipitation compares 58 long-record stations within the 111-station map.
These 58 stations have stored records for every water year from 1991 through 2026.
Five excluded stations have complete 1991–2020 records but a gap after 2020.
Historical values are decoded by cumulative summation, then divided by ten to get inches.
The comparison uses water years 1991–2020.
For each station, the normal is interpolated between stored weekly medians.
The figure shows the median of these station normals and the median current total.
October 31 gives 6.9 inches against a normal of 2.2286 inches.
Missing daily readings remain missing.
Monthly accumulation uses the dashboard's precipitation colors with labeled breaks at 0, 0.5, 1, 2, 4, and 8 inches.
These breaks differ from the dashboard's short-window precipitation scale.

## Exports

The portfolio keeps 2160-pixel JPG stills and responsive WebP images.
Each Day 1 page video is one scene. The Day 2 video has both scenes.
The page videos have no end card and no audio.

Videos use native browser controls and start only when the reader selects Play.
They have no autoplay attribute. The still poster remains visible before playback.
Each note includes a text description and a table or list of the main results.

`scripts/capture-map-challenge.js` holds the browser capture function from the first version of these figures.
That version replayed the data through the dashboard's own renderer in Chrome.
The current videos do not use it.

## Provider credit

Esri provides the basemap services and the ArcGIS Maps SDK for JavaScript.
The native attribution lists the basemap's other providers within every Day 1 image and frame.
Reservoir readings come from nine providers:

- Bureau of Reclamation RISE
- U.S. Geological Survey
- California Data Exchange Center
- USDA NRCS AWDB
- Colorado Division of Water Resources
- U.S. Army Corps of Engineers CWMS
- Montana Department of Natural Resources and Conservation
- Salt River Project
- Central Arizona Project

The USDA Natural Resources Conservation Service provides the SNOTEL precipitation measurements.
The U.S. Geological Survey provides the Network-Linked Data Index traces.
The Bureau of Reclamation provides the daily lake elevations.
Mapbox sponsors the challenge, but these figures do not use Mapbox services.

## Day 3: water in polygons

The Day 3 poster uses the published dashboard's own polygon maps.
Chrome DevTools MCP controls the date slider and map modes in a temporary capture layout.
No independent WBD download or hydrologic reclassification supplies these figures.

The snow scene shows nine selected observations from January 1 through June 17, 2026.
The completed 2025–26 season provides the observations and their normal-snow comparison.
Snow and precipitation use the reporting network's 49 HUC-6 basins.
The precipitation windows end on November 1: 0.7 inches at 620 stations over one day,
1.1 inches at 621 over three days, and 1.6 inches at 623 over seven days.
The station sets differ by window.
Seven-day soil-moisture change ends on November 1, with values in 34 basins from 300 stations.
Three sensor depths are required and frozen readings are excluded.

Drought uses 75 HUC-6 basins and the October 27 U.S. Drought Monitor map.
Its worst-class counts are 3 without drought, 6 at D0, 20 at D1, 25 at D2, 17 at D3 and 4 at D4.
Ten basins have partial U.S. coverage.
Compared with October 20, 19 basins have less land at D2 or worse, none have more, and 56 did not change.
These are different quantities and dates, with separate keys and missing-value rules.

The verified display values are in `assets/data/day-3-water-polygons.json`.
The render scripts remain with the vault's challenge code.
Captures retain the native basemap attribution.
The square post is 1080 × 1080 at 60 fps; the Reel is 1080 × 1920 at 30 fps.
The page cut is square at 30 fps, without the end card, and plays with native controls.
Values switch between observed maps. Only progress and transitions ease.
