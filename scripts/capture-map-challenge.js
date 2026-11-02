async () => {
  document.querySelectorAll('[id^="capture-"]').forEach(el => el.remove());
  const data = window.captureData;
  const mapElement = document.querySelector("arcgis-map");
  const view = mapElement.view;
  const map = mapElement.map;
  const reservoirLayer = map.findLayerById("reservoirs");
  const Graphic = reservoirLayer.source.getItemAt(0).constructor;
  const Extent = view.extent.constructor;
  const originals = (await reservoirLayer.queryFeatures({ where: "1=1", outFields: ["*"], returnGeometry: true })).features;
  const byName = new Map(data.reservoirs.map(r => [r.name, r]));
  const byId = new Map(data.reservoirs.map(r => [r.station, r]));
  const featureByName = new Map(originals.map(f => [f.attributes.name, f]));
  if (originals.length !== 405 || originals.some(f => !byName.has(f.attributes.name))) {
    throw new Error("Reservoir roster does not match the verified snapshot");
  }
  map.layers.forEach(layer => { layer.visible = ["oceans-reference-layer", "reservoirs"].includes(layer.id); });
  const style = document.createElement("style");
  style.id = "capture-style";
  style.textContent = `
    html,body { background:#242723!important; overflow:hidden!important; }
    calcite-shell-panel,calcite-navigation,#storage-map-legend { display:none!important; }
    arcgis-map { position:fixed!important; inset:170px 318px 140px 24px!important; width:auto!important; height:auto!important; z-index:10000!important; border:1px solid #5f5a50; }
    arcgis-map > :not(arcgis-scale-bar) { display:none!important; }
    #capture-heading,#capture-sidebar,#capture-labels,#capture-legend,#capture-timeline,#capture-footer { position:fixed; z-index:20000; font-family:var(--app-font); color:#f5efe5; }
    #capture-heading { top:24px; left:36px; right:36px; }
    #capture-eyebrow { color:#86b9b5; font-size:17px; letter-spacing:.03em; }
    #capture-title { font-size:45px; line-height:1.06; font-weight:650; margin:18px 0 12px; }
    #capture-subtitle { font-size:20px; color:#c9c0b2; }
    #capture-sidebar { left:790px; right:30px; top:170px; height:770px; font-size:16px; }
    #capture-sidebar .kicker { color:#86b9b5; font-size:16px; margin-bottom:5px; }
    #capture-sidebar .stat { font-size:54px; line-height:1.03; font-weight:650; }
    #capture-sidebar .muted { color:#c9c0b2; font-size:15px; line-height:1.28; }
    #capture-sidebar .section { border-top:1px solid #5f5a50; margin-top:16px; padding-top:16px; }
    #capture-sidebar h2 { font-size:21px; line-height:1.1; font-weight:600; margin:0 0 6px; }
    #capture-sidebar h3 { font-size:18px; line-height:1.15; font-weight:600; margin:12px 0 3px; }
    #capture-sidebar .range { color:#e7b877; font-size:18px; }
    #capture-sidebar svg { display:block; overflow:visible; width:100%; }
    #capture-sidebar .chain-row { padding:8px 8px 8px 0; border-bottom:1px solid #454940; font-size:17px; color:#899084; }
    #capture-sidebar .chain-row span { color:#86b9b5; width:27px; display:inline-block; font-size:14px; }
    #capture-sidebar .chain-row.done { color:#f5efe5; }
    #capture-sidebar .chain-row.current { color:#e7b877; font-weight:650; }
    #capture-labels { left:25px; top:171px; width:736px; height:768px; pointer-events:none; }
    #capture-labels text { font-family:var(--app-font); }
    #capture-legend { left:36px; right:36px; bottom:96px; height:27px; display:flex; align-items:center; gap:17px; font-size:16px; }
    #capture-legend b { font-weight:500; }
    #capture-legend i { display:inline-block; width:16px; height:16px; margin-right:6px; vertical-align:-2px; border:1px solid #9a9e92; }
    #capture-timeline { left:36px; right:36px; bottom:47px; height:32px; display:flex; align-items:center; gap:9px; font-size:18px; }
    #capture-timeline .track { display:flex; flex:1; align-items:center; justify-content:space-between; position:relative; margin:0 10px; }
    #capture-timeline .track:before { content:""; position:absolute; left:0; right:0; height:1px; background:#5f5a50; z-index:-1; }
    #capture-timeline em { display:block; width:6px; height:6px; border-radius:50%; background:#5f5a50; }
    #capture-timeline em.done { background:#86b9b5; }
    #capture-timeline em.current { width:12px; height:12px; background:#f5efe5; }
    #capture-footer { left:36px; right:36px; bottom:16px; display:flex; justify-content:space-between; font-size:13px; color:#c9c0b2; }
  `;
  document.head.append(style);
  const background = document.createElement("div");
  background.id = "capture-background";
  background.style = "position:fixed;inset:0;background:#242723;z-index:9000";
  document.body.append(background);
  let ancestor = mapElement.parentElement;
  while (ancestor && ancestor !== document.body) {
    ancestor.style.background = "transparent";
    ancestor.style.zIndex = "10000";
    ancestor = ancestor.parentElement;
  }
  for (const [id, html] of [
    ["capture-heading", '<div id="capture-eyebrow"></div><div id="capture-title"></div><div id="capture-subtitle"></div>'],
    ["capture-sidebar", ""], ["capture-labels", ""], ["capture-legend", ""], ["capture-timeline", ""],
    ["capture-footer", '<span></span><span>Brian Busch · November 2026</span>']
  ]) {
    const el = document.createElement("div");
    el.id = id;
    el.innerHTML = html;
    document.body.append(el);
  }
  view.padding = { left: 0, right: 0, top: 0, bottom: 0 };
  view.constraints.minZoom = 4;
  view.popupEnabled = false;
  const point = (r, symbol) => new Graphic({ geometry: { type: "point", longitude: r.lon, latitude: r.lat, spatialReference: { wkid: 4326 } }, symbol });
  const line = (a, b, color, width) => new Graphic({ geometry: { type: "polyline", paths: [[[a.lon, a.lat], [b.lon, b.lat]]], spatialReference: { wkid: 4326 } }, symbol: { type: "simple-line", color, width, cap: "round" } });
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const million = value => (value / 1e6).toFixed(2) + "M";
  const shortName = name => ({ "Franklin D. Roosevelt Lake": "F. D. Roosevelt Lake", "Dworshak Reservoir": "Dworshak", "American Falls Reservoir": "American Falls" })[name] || name;
  const complete = data.reservoirs.filter(r => data.months.every(m => r.months[m] !== null));
  const ranked = complete.map(r => ({ ...r, swing: Math.max(...data.months.map(m => r.months[m])) - Math.min(...data.months.map(m => r.months[m])) })).sort((a, b) => b.swing - a.swing);
  if (complete.length !== 388) throw new Error("The fixed storage sample changed");
  const largest = [...data.reservoirs].sort((a, b) => b.capacity - a.capacity).slice(0, 6);
  const highlighted = [...new Map([...largest, ...ranked.slice(0, 8)].map(r => [r.station, r])).values()];
  const wettest = [...data.rain].filter(r => r.values[30] !== null).sort((a, b) => b.values[30] - a.values[30]).slice(0, 5);
  const wait = async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const start = Date.now();
    while (view.updating && Date.now() - start < 18000) await new Promise(resolve => setTimeout(resolve, 100));
    if (view.updating) throw new Error("The map did not finish drawing");
    await new Promise(resolve => setTimeout(resolve, 200));
  };
  const header = (day, title, subtitle) => {
    document.getElementById("capture-eyebrow").textContent = "#30DayMapChallenge 2026 · " + day;
    document.getElementById("capture-title").textContent = title;
    document.getElementById("capture-subtitle").textContent = subtitle;
  };
  const legend = (colors, labels, lead) => {
    document.getElementById("capture-legend").innerHTML = "<b>" + lead + "</b>" + colors.map((c, i) => '<span><i style="background:' + c + '"></i>' + labels[i] + "</span>").join("");
  };
  const timeline = (index, count, left, right) => {
    document.getElementById("capture-timeline").innerHTML = "<span>" + left + '</span><span class="track">' + Array.from({ length: count }, (_, i) => '<em class="' + (i < index ? "done" : i === index ? "current" : "") + '"></em>').join("") + "</span><span>" + right + "</span>";
  };
  const go = async rows => {
    const radius = 6378137;
    const x = lon => radius * lon * Math.PI / 180;
    const y = lat => radius * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
    const extent = new Extent({
      xmin: x(Math.min(...rows.map(r => r.lon))), xmax: x(Math.max(...rows.map(r => r.lon))),
      ymin: y(Math.min(...rows.map(r => r.lat))), ymax: y(Math.max(...rows.map(r => r.lat))),
      spatialReference: view.spatialReference
    });
    await view.goTo(extent.expand(1.16), { animate: false });
    await wait();
  };
  const screen = r => view.toScreen(featureByName.get(r.name)?.geometry || point(r).geometry);
  let labelBoxes = [];
  const lineHitsBox = (a, b, box) => {
    let low = 0, high = 1;
    for (const [start, delta, min, max] of [[a.x, b.x - a.x, box.x - 3, box.x + box.w + 3], [a.y, b.y - a.y, box.y - 3, box.y + box.h + 3]]) {
      if (delta === 0) { if (start < min || start > max) return false; }
      else {
        const t1 = (min - start) / delta, t2 = (max - start) / delta;
        low = Math.max(low, Math.min(t1, t2));
        high = Math.min(high, Math.max(t1, t2));
        if (low > high) return false;
      }
    }
    return true;
  };
  const placeLabels = rows => {
    const points = rows.map(r => ({ r, p: screen(r) }));
    const cloud = (mode === "storage" ? data.reservoirs : mode === "network" ? [...data.reservoirs, ...data.snow] : data.rain).map(screen);
    labelBoxes = [];
    const width = view.width, height = view.height;
    for (const { r, p } of points.sort((a, b) => a.p.y - b.p.y)) {
      const w = Math.max(mode === "network" ? 190 : 113, Math.min(171, shortName(r.name).length * 7.8 + 16)), h = 44;
      const candidates = [];
      for (const distance of [18, 42, 70, 100, 132]) {
        for (const [dx, dy] of [[1,-1],[-1,-1],[1,1],[-1,1],[0,-1],[0,1],[1,0],[-1,0]]) {
          const bx = Math.max(8, Math.min(width - w - 8, p.x + (dx === 0 ? -w / 2 : dx > 0 ? distance : -w - distance)));
          const by = Math.max(8, Math.min(height - h - 42, p.y + (dy === 0 ? -h / 2 : dy > 0 ? distance : -h - distance)));
          const box = { x: bx, y: by, w, h, r, p };
          const overlap = labelBoxes.reduce((sum, b) => sum + Math.max(0, Math.min(bx + w + 6, b.x + b.w + 6) - Math.max(bx - 6, b.x - 6)) * Math.max(0, Math.min(by + h + 6, b.y + b.h + 6) - Math.max(by - 6, b.y - 6)), 0);
          const covered = cloud.filter(q => q.x > bx - 3 && q.x < bx + w + 3 && q.y > by - 3 && q.y < by + h + 3).length;
          const nearestX = Math.max(bx, Math.min(bx + w, p.x)), nearestY = Math.max(by, Math.min(by + h, p.y));
          const leaderEnd = { x: nearestX, y: nearestY };
          const crossings = labelBoxes.filter(b => lineHitsBox(p, leaderEnd, b) || lineHitsBox(b.p, { x: Math.max(b.x, Math.min(b.x + b.w, b.p.x)), y: Math.max(b.y, Math.min(b.y + b.h, b.p.y)) }, box)).length;
          candidates.push({ box, score: overlap * 10000 + crossings * 5000 + covered * 230 + Math.hypot(p.x - nearestX, p.y - nearestY) });
        }
      }
      candidates.sort((a, b) => a.score - b.score);
      labelBoxes.push(candidates[0].box);
    }
  };
  const drawLabels = value => {
    document.getElementById("capture-labels").innerHTML = '<svg width="100%" height="100%" viewBox="0 0 ' + view.width + " " + view.height + '">' + labelBoxes.map(b => {
      const ex = Math.max(b.x, Math.min(b.x + b.w, b.p.x)), ey = Math.max(b.y, Math.min(b.y + b.h, b.p.y));
      return '<path d="M' + b.p.x + " " + b.p.y + " L" + ex + " " + ey + '" fill="none" stroke="#374b4b" stroke-width="1.2"/><circle cx="' + b.p.x + '" cy="' + b.p.y + '" r="3" fill="#e7b877" stroke="#243b40"/><rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" rx="3" fill="#f9f5e9" fill-opacity=".96" stroke="#52615b" stroke-width=".7"/><text x="' + (b.x + 8) + '" y="' + (b.y + 17) + '" fill="#233b42" font-size="14" font-weight="650">' + escape(shortName(b.r.name)) + '</text><text x="' + (b.x + 8) + '" y="' + (b.y + 35) + '" fill="#38585b" font-size="13">' + escape(value(b.r)) + "</text>";
    }).join("") + "</svg>";
  };
  const chart = (values, index, options = {}) => {
    const { min = 0, max = 100, height = 70, normal = null, color = "#86b9b5", ticks = [0, 50, 100], labels = ["Nov", "Apr", "Sep"] } = options;
    const w = 258, left = 29, right = 10, top = 11, bottom = height - 23;
    const x = i => left + i * (w - left - right) / (values.length - 1);
    const y = n => bottom - (n - min) * (bottom - top) / (max - min);
    const path = rows => rows.map((v, i) => (i ? "L" : "M") + x(i).toFixed(2) + " " + y(v).toFixed(2)).join(" ");
    const axes = ticks.map(t => '<path d="M' + left + " " + y(t) + "H" + (w - right) + '" stroke="#4c5148" stroke-width=".7"/><text x="' + (left - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end" fill="#c9c0b2" font-size="11">' + t + "</text>").join("");
    return '<svg viewBox="0 0 ' + w + " " + height + '" height="' + height + '">' + axes + (normal ? '<path d="' + path(normal) + '" fill="none" stroke="#e7b877" stroke-dasharray="4 4" stroke-width="1.7"/>' : "") + '<path d="' + path(values) + '" fill="none" stroke="#697366" stroke-width="1.7"/><path d="' + path(values.slice(0, index + 1)) + '" fill="none" stroke="' + color + '" stroke-width="2.6"/><circle cx="' + x(index) + '" cy="' + y(values[index]) + '" r="4" fill="#f5efe5" stroke="' + color + '" stroke-width="1.5"/>' + [0, Math.floor((values.length - 1) / 2), values.length - 1].map((i, j) => '<text x="' + x(i) + '" y="' + (height - 5) + '" text-anchor="' + (j === 0 ? "start" : j === 2 ? "end" : "middle") + '" fill="#c9c0b2" font-size="12">' + labels[j] + "</text>").join("") + "</svg>";
  };
  const networkBase = [];
  for (const s of data.snow) networkBase.push(line(s, byId.get(s.to), [35,100,130,.29], .7));
  for (const [a, b] of data.links) networkBase.push(line(byId.get(a), byId.get(b), [29,91,94,.7], 1.2));
  for (const s of data.snow) networkBase.push(point(s, { type: "simple-marker", style: "circle", size: 2.8, color: [45,126,151,.9], outline: { color: "#edf3ed", width: .3 } }));
  for (const id of data.traced) networkBase.push(point(byId.get(id), { type: "simple-marker", style: "circle", size: 4.8, color: "#265b58", outline: { color: "#f5efe5", width: .65 } }));
  let mode = null;
  window.capture = {
    async storage(index) {
      if (mode !== "storage") {
        mode = "storage";
        view.graphics.removeAll();
        reservoirLayer.visible = true;
        await go(data.reservoirs);
        placeLabels(highlighted);
      }
      const month = data.months[index];
      const result = await reservoirLayer.applyEdits({ updateFeatures: originals.map(f => {
        const r = byName.get(f.attributes.name), value = r.months[month], pct = value === null ? null : 100 * value / r.capacity;
        return new Graphic({ attributes: { ...f.attributes, size_basis: r.capacity, fill_percent: pct, late: 0, symbol_key: (pct === null ? -1 : Math.min(4, Math.max(0, Math.floor(pct / 20)))) + "|0" } });
      }) });
      if (result.updateFeatureResults.some(r => r.error)) throw new Error("A historical feature could not be updated");
      const date = new Date(month + "-15T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
      header("Day 1: Points", "Western reservoir storage", date + " · Monthly means at 405 reservoirs");
      document.getElementById("capture-sidebar").innerHTML = '<div class="kicker">388 complete records</div><div class="stat">' + data.percentages[index].toFixed(1) + '%</div><div class="muted">Combined capacity stored</div>' + chart(data.percentages, index, { min: 40, max: 65, height: 116, ticks: [40,50,60] }) + '<div class="section"><h2>Largest storage swings</h2><div class="muted">High minus low monthly mean.<br>Volumes in acre-feet.</div>' + ranked.slice(0, 3).map(r => '<h3>' + escape(shortName(r.name)) + '</h3><div class="range">' + million(r.swing) + ' acre-feet</div>' + chart(data.months.map(m => 100 * r.months[m] / r.capacity), index)).join("") + '<div class="muted" style="margin-top:11px">Reservoir trends: percent full.<br>All use the same 0–100% scale.</div></div>';
      drawLabels(r => (100 * r.months[month] / r.capacity).toFixed(1) + "% full");
      legend(["#dde2b1","#95aa87","#698c94","#416e9d","#1b3e82"], ["<20%","20–40%","40–60%","60–80%","80%+"], "Ring: capacity · Fill: share stored");
      timeline(index, 11, "Nov 2025", "Sep 2026");
      document.getElementById("capture-footer").firstElementChild.textContent = "Western Water Dashboard · Data snapshot: October 31, 2026";
      await wait();
      return { mode, index, date, updates: result.updateFeatureResults.length, percent: data.percentages[index] };
    },
    async network(stage) {
      if (mode !== "network") {
        mode = "network";
        reservoirLayer.visible = false;
        await go([...data.reservoirs, ...data.snow]);
        placeLabels(["Jackson Lake", "Lake Celilo", "Lake Mohave"].map(name => byName.get(name)));
      }
      view.graphics.removeAll();
      view.graphics.addMany(networkBase);
      for (let i = 0; i < Math.min(stage, 11); i++) view.graphics.add(line(byId.get(data.longest[i]), byId.get(data.longest[i + 1]), "#b74e25", 3));
      for (const id of data.longest.slice(0, stage + 1)) view.graphics.add(point(byId.get(id), { type: "simple-marker", style: "circle", size: 6, color: "#b74e25", outline: { color: "#fff8ea", width: 1 } }));
      header("Day 2: Lines", "How the reservoirs connect", "400 traced reservoirs · 44 connected groups · 488 snow stations");
      document.getElementById("capture-sidebar").innerHTML = '<div class="kicker">Inferred reservoir links</div><div class="stat">256</div><div class="section"><h2>A 12-reservoir chain</h2><div class="muted">Jackson Lake to Lake Celilo</div>' + data.longest.map((id, i) => '<div class="chain-row ' + (i < stage ? "done" : i === stage ? "current" : "") + '"><span>' + String(i + 1).padStart(2, "0") + "</span>" + escape(shortName(byId.get(id).name)) + "</div>").join("") + '<div class="muted" style="margin-top:17px">The loop reveals connections.<br>It does not show travel time.</div></div>';
      drawLabels(r => r.name === "Lake Mohave" ? "77 upstream reservoirs" : r.name === "Lake Celilo" ? "76 upstream reservoirs" : "Start of highlighted chain");
      legend(["#265b58","#2d7e97","#b74e25"], ["Reservoir","Snow station","Highlighted chain"], "Surface drainage connections");
      timeline(stage, 12, "Jackson Lake", "Lake Celilo");
      document.getElementById("capture-footer").firstElementChild.textContent = "USGS NLDI + NRCS SNOTEL · Straight links do not follow river paths";
      await wait();
      return { mode, stage, graphics: view.graphics.length };
    },
    async rain(day) {
      if (mode !== "rain") {
        mode = "rain";
        reservoirLayer.visible = false;
        await go(data.rain);
        placeLabels(wettest);
      }
      view.graphics.removeAll();
      const colors = ["#984e14","#ae7c28","#c6ae4f","#d2d98d","#74cfd6","#2a81bb"], breaks = [0,.5,1,2,4,8];
      for (const r of [...data.rain].sort((a, b) => (b.values[day] ?? -1) - (a.values[day] ?? -1))) {
        const value = r.values[day], index = value === null ? -1 : breaks.findLastIndex(b => value >= b);
        view.graphics.add(point(r, { type: "simple-marker", style: "circle", size: value === null ? 7 : 5 + 13 * Math.sqrt(value / 16.5), color: value === null ? [0,0,0,0] : colors[index], outline: { color: value === null ? "#405053" : "#28434c", width: .7 } }));
      }
      const stats = data.rainStats[day];
      header("Bonus map", "Four Corners precipitation", "October " + (day + 1) + ", 2026 · Rain and snow measured as water");
      document.getElementById("capture-sidebar").innerHTML = '<div class="kicker">Median of 58 stations</div><div class="stat">' + stats.median.toFixed(1) + ' in</div><div class="muted">Normal: ' + stats.normal.toFixed(1) + ' inches</div>' + chart(data.rainStats.map(r => r.median), day, { max: 8, height: 158, ticks: [0,4,8], labels: ["Oct 1","Oct 16","Oct 31"], normal: data.rainStats.map(r => r.normal) }) + '<div class="muted">Teal: 2026 · Dashed: normal</div><div class="section"><h2>Wettest five stations</h2><div class="muted">Ranked by the October 31 total.</div>' + wettest.map(r => '<h3>' + escape(r.name) + '</h3><div class="range">' + (r.values[day] === null ? "No reading" : r.values[day].toFixed(1) + " inches") + "</div>").join("") + '<div class="muted" style="margin-top:23px">' + stats.reported + ' of 111 stations reported.<br>Mountain measurements.</div></div>';
      drawLabels(r => r.values[day] === null ? "No reading" : r.values[day].toFixed(1) + " inches");
      legend(colors, ["<0.5","0.5–1","1–2","2–4","4–8","8+"], "Inches since Oct 1");
      timeline(day, 31, "Oct 1", "Oct 31");
      document.getElementById("capture-footer").firstElementChild.textContent = "NRCS SNOTEL · Normal: 1991–2020 · Matched 58-station sample";
      await wait();
      return { mode, day, stats, graphics: view.graphics.length };
    },
    verify() {
      const rows = mode === "rain" ? data.rain : mode === "network" ? [...data.reservoirs, ...data.snow] : data.reservoirs;
      const projected = rows.map(screen);
      const outside = projected.filter(p => p.x < 12 || p.x > view.width - 12 || p.y < 12 || p.y > view.height - 32);
      const overlaps = labelBoxes.flatMap((a, i) => labelBoxes.slice(i + 1).filter(b => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y).map(b => [a.r.name, b.r.name]));
      const texts = [...document.querySelectorAll("#capture-labels text")];
      const clipped = labelBoxes.filter((b, i) => texts.slice(i * 2, i * 2 + 2).some(el => { const rect = el.getBBox(); return rect.x + rect.width > b.x + b.w - 4; })).map(b => b.r.name);
      const sidebar = document.getElementById("capture-sidebar");
      if (outside.length || overlaps.length || clipped.length || sidebar.scrollHeight > sidebar.clientHeight) throw new Error(JSON.stringify({ outside: outside.length, overlaps, clipped, sidebarHeight: sidebar.scrollHeight }));
      return { mode, points: rows.length, labels: labelBoxes.map(b => b.r.name), outside: outside.length, overlaps, clipped, sidebarHeight: sidebar.scrollHeight, viewport: [view.width, view.height], extent: view.extent.toJSON() };
    }
  };
  await new Promise(resolve => setTimeout(resolve, 250));
  await window.capture.storage(10);
  return { ready: true, originals: originals.length, verification: window.capture.verify() };
}
