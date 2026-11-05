import { clamp, constrain, fitScale, overviewRect, pinchView, resizeView, zoomAt } from "./image-geometry.mjs";

export function initImageViewer() {
  const thumbnails = [...document.querySelectorAll("[data-image-viewer] img, .post-hero-image img, .post-gallery img")];
  if (!thumbnails.length || !window.HTMLDialogElement) return;
  const entries = [];
  const triggers = new Map();

  for (const thumbnail of thumbnails) {
    const anchor = thumbnail.closest("a");
    if (anchor && !anchor.hasAttribute("data-image-viewer") && !/\.(jpe?g|png|webp|svg)(?:[?#]|$)/i.test(anchor.href)) continue;
    const figure = thumbnail.closest("figure");
    const plainCaption = figure?.querySelector("figcaption")?.cloneNode(true);
    plainCaption?.querySelectorAll("a").forEach(link => link.remove());
    const text = plainCaption?.textContent.replace(/\s+/g, " ").trim().replace(/\.\s*\.$/, ".");
    const headings = [...document.querySelectorAll(".post-content h2")].filter(h => h.compareDocumentPosition(thumbnail) & Node.DOCUMENT_POSITION_FOLLOWING);
    const full = new URL(thumbnail.dataset.full || anchor?.dataset.full || anchor?.href || thumbnail.src, location.href).href;
    let index = entries.findIndex(entry => entry.full === full);
    if (index < 0) {
      index = entries.length;
      entries.push({
        thumbnail, full,
        title: figure?.querySelector("h3")?.textContent || headings.at(-1)?.textContent || document.querySelector("h1")?.textContent || "Image",
        caption: thumbnail.dataset.caption || text || thumbnail.alt,
      });
    }
    let trigger = anchor;
    if (!trigger) {
      const target = thumbnail.closest("picture") || thumbnail;
      trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "zoomable";
      trigger.setAttribute("aria-label", `Expand image: ${entries[index].title}`);
      target.before(trigger);
      trigger.append(target);
    }
    trigger.setAttribute("aria-haspopup", "dialog");
    triggers.set(trigger, index);
    figure?.querySelectorAll("a[href]").forEach(link => {
      if (link.href === full && !link.hasAttribute("download")) {
        triggers.set(link, index);
        link.setAttribute("aria-haspopup", "dialog");
      }
    });
  }
  if (!entries.length) return;

  const viewer = document.createElement("dialog");
  viewer.className = "lightbox";
  viewer.setAttribute("aria-labelledby", "image-viewer-title");
  viewer.setAttribute("aria-describedby", "image-viewer-help");
  viewer.innerHTML = `
    <header class="lightbox-header">
      <div class="lightbox-heading"><p>Image viewer</p><h2 id="image-viewer-title"></h2></div>
      <div class="lightbox-pages" role="group" aria-label="Images in this article">
        <button type="button" data-previous aria-label="Previous image">←</button>
        <span data-position></span>
        <button type="button" data-next aria-label="Next image">→</button>
      </div>
      <button type="button" class="lightbox-close" aria-label="Close image viewer">Close</button>
    </header>
    <div class="lightbox-canvas">
      <div class="lightbox-stage" tabindex="0" role="region" aria-label="Image canvas. Arrow keys move the image when zoomed.">
        <img class="lightbox-image" alt="" draggable="false" hidden>
      </div>
      <div class="lightbox-message"><p role="status" data-load-status></p><button type="button" data-retry hidden>Retry full image</button></div>
      <button type="button" class="lightbox-overview" aria-label="Image overview. Click to choose an area, or press Enter to center." hidden>
        <img alt="" draggable="false"><span></span>
      </button>
    </div>
    <footer class="lightbox-footer">
      <div class="lightbox-toolbar">
        <div class="lightbox-zoom" role="group" aria-label="Image zoom">
          <button type="button" data-out aria-label="Zoom out">−</button>
          <output aria-label="Image zoom" aria-live="off"></output>
          <button type="button" data-in aria-label="Zoom in">+</button>
        </div>
        <div class="lightbox-modes" role="group" aria-label="Image view">
          <button type="button" data-fit>Fit image</button>
          <button type="button" data-detail>Read labels</button>
        </div>
        <a class="lightbox-download" download>Download image <span aria-hidden="true">↓</span></a>
      </div>
      <details class="lightbox-about"><summary>Caption and controls</summary><div><p data-caption></p>
        <p id="image-viewer-help">Double-click or double-tap to read labels. Drag or scroll to move. Pinch, or hold Ctrl or Command while scrolling to zoom. Use + and − to zoom, 0 to fit, and Escape to close. Page Up and Page Down switch images.</p>
      </div></details>
      <span class="visually-hidden" role="status" data-view-status></span>
    </footer>`;
  document.body.append(viewer);
  const find = selector => viewer.querySelector(selector);
  const stage = find(".lightbox-stage");
  const image = find(".lightbox-image");
  const overview = find(".lightbox-overview");
  const output = find("output");
  const status = find("[data-load-status]");
  const close = find(".lightbox-close");
  const previous = find("[data-previous]");
  const next = find("[data-next]");
  const zoomIn = find("[data-in]");
  const zoomOut = find("[data-out]");
  const fit = find("[data-fit]");
  const detail = find("[data-detail]");
  const retry = find("[data-retry]");
  const pointers = new Map();
  let active = 0;
  let lastFocused;
  let view;
  let loadToken = 0;
  let frame;
  let lastTap;
  let lastTouchTime = -Infinity;
  let gestureMoved = false;

  const isFit = () => Math.abs(view.scale - view.fit) < .0001;
  const paint = () => {
    if (!view) return;
    image.style.width = `${view.width}px`;
    image.style.height = `${view.height}px`;
    image.style.transform = `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    stage.classList.toggle("is-zoomed", !isFit());
    fit.classList.toggle("is-active", isFit());
    detail.classList.toggle("is-active", Math.abs(view.scale - 1) < .0001);
    zoomOut.disabled = isFit();
    zoomIn.disabled = view.scale >= 2;
    output.value = `${Math.round(view.scale * 100)}%`;
    overview.hidden = isFit();
    const rect = overviewRect(view);
    Object.assign(overview.querySelector("span").style, {
      left: `${rect.x * 100}%`, top: `${rect.y * 100}%`,
      width: `${rect.width * 100}%`, height: `${rect.height * 100}%`,
    });
  };
  const render = (announce = false) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(paint);
    if (announce && view) find("[data-view-status]").textContent = isFit() ? "Whole image in view." : `Image zoom ${Math.round(view.scale * 100)} percent.`;
  };
  const localPoint = event => {
    const bounds = stage.getBoundingClientRect();
    return { x: event.clientX - bounds.left - bounds.width / 2, y: event.clientY - bounds.top - bounds.height / 2 };
  };
  const setZoom = (scale, point, announce = true) => {
    if (!view) return;
    view = zoomAt(view, scale, point);
    render(announce);
  };
  const fitImage = () => {
    if (!view) return;
    view = { ...view, scale: view.fit, x: 0, y: 0 };
    render(true);
  };
  const inspect = point => setZoom(isFit() ? 1 : view.fit, point);
  const loadImage = async () => {
    const token = ++loadToken;
    const entry = entries[active];
    pointers.clear();
    lastTap = null;
    stage.classList.remove("is-dragging");
    image.alt = entry.thumbnail.alt;
    image.src = entry.thumbnail.currentSrc || entry.thumbnail.src;
    image.hidden = false;
    overview.querySelector("img").src = entry.thumbnail.currentSrc || entry.thumbnail.src;
    find("#image-viewer-title").textContent = entry.title;
    find("[data-caption]").textContent = entry.caption;
    find("[data-position]").textContent = `${active + 1} / ${entries.length}`;
    find("[data-view-status]").textContent = `Image ${active + 1} of ${entries.length}: ${entry.title}.`;
    find(".lightbox-pages").hidden = entries.length < 2;
    previous.disabled = active === 0;
    next.disabled = active === entries.length - 1;
    find(".lightbox-download").href = entry.full;
    retry.hidden = true;
    status.textContent = "Loading full image…";
    stage.setAttribute("aria-busy", "true");
    const width = Number(entry.thumbnail.getAttribute("width")) || entry.thumbnail.naturalWidth || 1;
    const height = Number(entry.thumbnail.getAttribute("height")) || entry.thumbnail.naturalHeight || 1;
    const fit = fitScale(width, height, stage.clientWidth, stage.clientHeight);
    view = { width, height, viewportWidth: stage.clientWidth, viewportHeight: stage.clientHeight, fit, scale: fit, x: 0, y: 0 };
    render();
    try {
      const full = new Image();
      full.src = entry.full;
      await full.decode();
      if (token !== loadToken || !viewer.open) return;
      const fitted = isFit();
      image.src = entry.full;
      view = resizeView({ ...view, width: full.naturalWidth, height: full.naturalHeight }, stage.clientWidth, stage.clientHeight);
      if (fitted) view = { ...view, scale: view.fit, x: 0, y: 0 };
      stage.setAttribute("aria-busy", "false");
      status.textContent = "";
      render();
    } catch {
      if (token !== loadToken || !viewer.open) return;
      stage.setAttribute("aria-busy", "false");
      status.textContent = "The full image could not load. Check your connection and try again.";
      retry.hidden = false;
    }
  };
  const changeImage = delta => {
    const index = clamp(active + delta, 0, entries.length - 1);
    if (index === active) return;
    active = index;
    loadImage();
  };

  for (const [trigger, index] of triggers) {
    trigger.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      lastFocused = trigger;
      active = index;
      viewer.showModal();
      document.body.classList.add("lightbox-open");
      loadImage();
      close.focus();
    });
  }
  close.addEventListener("click", () => viewer.close());
  image.addEventListener("error", () => { image.hidden = !image.naturalWidth; });
  image.addEventListener("load", () => { image.hidden = false; });
  viewer.addEventListener("close", () => {
    loadToken++;
    pointers.clear();
    view = null;
    cancelAnimationFrame(frame);
    image.removeAttribute("src");
    image.hidden = true;
    overview.hidden = true;
    document.body.classList.remove("lightbox-open");
    lastFocused?.focus({ preventScroll: true });
  });
  previous.addEventListener("click", () => changeImage(-1));
  next.addEventListener("click", () => changeImage(1));
  retry.addEventListener("click", loadImage);
  zoomIn.addEventListener("click", () => setZoom(view.scale * 1.5));
  zoomOut.addEventListener("click", () => setZoom(view.scale / 1.5));
  fit.addEventListener("click", fitImage);
  detail.addEventListener("click", () => setZoom(1));
  stage.addEventListener("dblclick", event => {
    event.preventDefault();
    if (performance.now() - lastTouchTime > 500) inspect(localPoint(event));
  });
  stage.addEventListener("wheel", event => {
    if (!view) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
    if (event.ctrlKey || event.metaKey) {
      setZoom(view.scale * Math.exp(-event.deltaY * unit * .005), localPoint(event), false);
    } else {
      view = constrain({ ...view, x: view.x - event.deltaX * unit, y: view.y - event.deltaY * unit });
      render();
    }
  }, { passive: false });
  stage.addEventListener("pointerdown", event => {
    if (!view || pointers.size >= 2 || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (!pointers.size) gestureMoved = false;
    else gestureMoved = true;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY });
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", event => {
    if (!pointers.has(event.pointerId) || !view) return;
    const before = [...pointers.values()];
    const previous = pointers.get(event.pointerId);
    pointers.set(event.pointerId, { ...previous, x: event.clientX, y: event.clientY });
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    if (Math.hypot(event.clientX - previous.startX, event.clientY - previous.startY) > 6) gestureMoved = true;
    if (pointers.size === 1) view = constrain({ ...view, x: view.x + dx, y: view.y + dy });
    else if (pointers.size === 2) {
      const after = [...pointers.values()];
      const local = point => localPoint({ clientX: point.x, clientY: point.y });
      view = pinchView(view, before.map(local), after.map(local));
    }
    render();
  });
  const release = event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    stage.classList.toggle("is-dragging", pointers.size > 0);
    if (event.pointerType !== "mouse") lastTouchTime = performance.now();
    if (event.type !== "pointerup") lastTap = null;
    if (event.type === "pointerup" && event.pointerType !== "mouse" && !gestureMoved && !pointers.size) {
      const tap = { time: performance.now(), x: event.clientX, y: event.clientY };
      if (lastTap && tap.time - lastTap.time < 320 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 24) {
        inspect(localPoint(event));
        lastTap = null;
      } else lastTap = tap;
    }
  };
  for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) stage.addEventListener(type, release);
  overview.addEventListener("click", event => {
    if (!view) return;
    const bounds = overview.getBoundingClientRect();
    const x = event.detail ? (event.clientX - bounds.left) / bounds.width : .5;
    const y = event.detail ? (event.clientY - bounds.top) / bounds.height : .5;
    view = constrain({ ...view, x: (.5 - x) * view.width * view.scale, y: (.5 - y) * view.height * view.scale });
    render();
  });
  viewer.addEventListener("keydown", event => {
    if (!view || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key;
    if (key === "Tab") {
      const controls = [...viewer.querySelectorAll('button:not(:disabled), a[href], summary, [tabindex="0"]')].filter(control => control.getClientRects().length);
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls.at(-1)?.focus();
      } else if (!event.shiftKey && (index < 0 || index === controls.length - 1)) {
        event.preventDefault();
        controls[0]?.focus();
      }
      return;
    }
    if (key === "+" || key === "=") setZoom(view.scale * 1.5);
    else if (key === "-") setZoom(view.scale / 1.5);
    else if (key === "0" || key === "Home") fitImage();
    else if (key === "1") setZoom(1);
    else if (key === "PageUp") changeImage(-1);
    else if (key === "PageDown") changeImage(1);
    else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
      if (isFit() && (key === "ArrowLeft" || key === "ArrowRight")) changeImage(key === "ArrowLeft" ? -1 : 1);
      else {
        view = constrain({ ...view, x: view.x + (key === "ArrowLeft" ? 60 : key === "ArrowRight" ? -60 : 0), y: view.y + (key === "ArrowUp" ? 60 : key === "ArrowDown" ? -60 : 0) });
        render();
      }
    } else return;
    event.preventDefault();
  });
  new ResizeObserver(() => {
    if (!viewer.open || !view) return;
    view = resizeView(view, stage.clientWidth, stage.clientHeight);
    render();
  }).observe(stage);
}
