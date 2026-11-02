# Water maps for the 2026 challenge

These figures use the Western Water Dashboard's ArcGIS map, captured in Chrome on November 2, 2026.
No generated imagery is used. The public dashboard is unchanged.

## Rendering

The figures use Esri's ArcGIS Maps SDK for JavaScript and the dashboard's Oceans basemap.
Every frame keeps the native basemap attribution and the Esri credit.
The dashboard's Atkinson Hyperlegible Next font and dark-theme colors frame the maps.
The source map retains its geography, reservoir renderer, and geographic labels.
The capture hides the application controls and drainage-area outlines to give the map more space.

Storage replays historical attributes through the dashboard's native reservoir renderer.
The network and monthly precipitation layers are overlays made for these figures.
They are not production dashboard features.
Network links show inferred surface drainage relationships between the represented reservoirs.
They do not follow rivers or show managed water transfers.
The network loop highlights a fixed chain. It does not show water travel time.

## Data snapshots

The compact figure data is in `assets/data/map-challenge-2026.json`.
It includes monthly reservoir storage, inferred links, station coordinates, daily precipitation, and comparison values.

- Reservoirs: [October 31 snapshot](https://github.com/buschbrian/western-water-dashboard/blob/b5627547b0d7fb4daceffd4b5a7fc8cfe69a32d3/reservoirs.json).
- Precipitation: [November 1 snapshot](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/precipitation.json).
- Precipitation history: [1991–2026 records](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/precipitation_history.json).
- Station locations: [SNOTEL roster](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/snow_sites.json).
- Network: [USGS Network-Linked Data Index traces](https://github.com/buschbrian/western-water-dashboard/blob/6c90fbecf7c73e10dd1479fe98dfa19898c3d36f/upstream_index.json), retrieved August 30, 2026.

Storage combines the same 388 reservoirs in every month, from November 2025 through September 2026.
Each value divides summed monthly mean storage by summed capacity.
The result is 51.6207% in November, 60.0903% in May, and 48.4393% in September.
The dashboard's October 31 latest-reading total was 48.3530%. Both September and October round to 48.4% by coincidence.
Their observations and reservoir sets differ.

Precipitation compares 58 long-record stations within the 111-station map.
Historical values are decoded by cumulative summation, then divided by ten to get inches.
The comparison uses water years 1991–2020.
For each station, the normal is interpolated between stored weekly medians.
The figure shows the median of these station normals and the median current total.
October 31 gives 6.9 inches against a normal of 2.2286 inches.
Missing daily readings remain missing.
Monthly accumulation uses the dashboard's precipitation colors with labeled breaks at 0, 0.5, 1, 2, 4, and 8 inches.
These breaks differ from the dashboard's short-window precipitation scale.

## Capture and exports

`scripts/capture-map-challenge.js` contains the browser capture function.
It runs through Chrome DevTools MCP on the dashboard after the figure data is assigned to `window.captureData`.
It checks the 405-reservoir roster before changing attributes in the isolated browser session.
Its `storage`, `network`, and `rain` methods prepare one frame at a time.
The live application and its data are never changed.

Chrome captures the 1080-pixel square composition at twice its size.
The portfolio keeps 2160-pixel JPG stills and responsive WebP images.
FFmpeg encodes 1080-pixel H.264 videos at 30 frames per second, without audio.
GIF exports use a shared palette and preserve discrete observations.

Videos use native browser controls and start only when the reader selects Play.
They have no autoplay attribute. The still poster remains visible before playback.
Each note includes a text description and a table or list of the main results.
The GIF is a download, so continuous motion does not start when the note opens.

## Provider credit

Esri provides the basemap services and the ArcGIS Maps SDK for JavaScript.
The native attribution lists the basemap's other providers within every image and frame.
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
Mapbox sponsors the challenge, but these figures do not use Mapbox services.
