const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (navToggle && navMenu) {
  const setNavOpen = isOpen => {
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  navToggle.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });

  navMenu.addEventListener("click", event => {
    if (!event.target.closest("a")) return;
    setNavOpen(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setNavOpen(false);
  });
}

const imageLinks = document.querySelectorAll("[data-image-viewer]");
const articleImages = document.querySelectorAll(".post-hero-image img, .post-gallery img");

if (imageLinks.length || articleImages.length) {
  const viewer = document.createElement("dialog");
  viewer.className = "lightbox";
  viewer.setAttribute("aria-labelledby", "image-viewer-title");
  viewer.setAttribute("aria-describedby", "image-viewer-help");
  viewer.innerHTML = `
    <h2 class="visually-hidden" id="image-viewer-title">Image viewer</h2>
    <div class="lightbox-header">
      <div class="lightbox-tools" role="group" aria-label="Image zoom">
        <button type="button" data-zoom-out aria-label="Zoom out">&minus;</button>
        <output aria-label="Zoom relative to fit" aria-live="off">100%</output>
        <span class="visually-hidden" role="status" data-zoom-status></span>
        <button type="button" data-zoom-in aria-label="Zoom in">+</button>
        <button type="button" data-fit>Fit</button>
        <button type="button" data-actual>Actual size</button>
      </div>
      <div class="lightbox-tools">
        <a class="lightbox-original" target="_blank" rel="noreferrer">Open original</a>
        <button type="button" class="lightbox-close" autofocus>Close</button>
      </div>
    </div>
    <div class="lightbox-stage" tabindex="0" role="region" aria-label="Image. Use arrow keys to pan when zoomed.">
      <img class="lightbox-image" alt="" draggable="false" hidden>
    </div>
    <div class="lightbox-footer">
      <p class="lightbox-status" role="status"></p>
      <p class="lightbox-caption"></p>
      <p class="lightbox-help" id="image-viewer-help">Scroll or pinch to zoom. Drag or use arrow keys to move. Press 0 to fit or Escape to close.</p>
    </div>`;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector(".lightbox-stage");
  const image = viewer.querySelector(".lightbox-image");
  const caption = viewer.querySelector(".lightbox-caption");
  const status = viewer.querySelector(".lightbox-status");
  const original = viewer.querySelector(".lightbox-original");
  const close = viewer.querySelector(".lightbox-close");
  const zoomIn = viewer.querySelector("[data-zoom-in]");
  const zoomOut = viewer.querySelector("[data-zoom-out]");
  const fit = viewer.querySelector("[data-fit]");
  const actual = viewer.querySelector("[data-actual]");
  const output = viewer.querySelector("output");
  const zoomStatus = viewer.querySelector("[data-zoom-status]");
  const pointers = new Map();
  let lastFocused;
  let ready = false;
  let fitScale = 1;
  let zoom = 1;
  let maxZoom = 8;
  let panX = 0;
  let panY = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const render = (announce = false) => {
    if (!ready) return;
    const maxX = Math.max(0, (image.naturalWidth * fitScale * zoom - stage.clientWidth) / 2 + 16);
    const maxY = Math.max(0, (image.naturalHeight * fitScale * zoom - stage.clientHeight) / 2 + 16);
    panX = clamp(panX, -maxX, maxX);
    panY = clamp(panY, -maxY, maxY);
    image.style.transform = `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${zoom})`;
    stage.classList.toggle("is-zoomed", zoom > 1);
    zoomOut.disabled = zoom <= 1;
    zoomIn.disabled = zoom >= maxZoom;
    fit.disabled = false;
    actual.disabled = false;
    output.value = `${Math.round(zoom * 100)}%`;
    if (announce) zoomStatus.textContent = `Zoom ${Math.round(zoom * 100)} percent of fit.`;
  };

  const fitImage = () => {
    if (!ready) return;
    fitScale = Math.min((stage.clientWidth - 32) / image.naturalWidth, (stage.clientHeight - 32) / image.naturalHeight, 1);
    fitScale = Math.max(.01, fitScale);
    image.style.width = `${image.naturalWidth * fitScale}px`;
    image.style.height = `${image.naturalHeight * fitScale}px`;
    maxZoom = Math.max(8, 1 / fitScale);
    zoom = 1;
    panX = 0;
    panY = 0;
    render(true);
  };

  const setZoom = (value, point, announce = true) => {
    if (!ready) return;
    const next = clamp(value, 1, maxZoom);
    if (point) {
      const bounds = stage.getBoundingClientRect();
      const x = point.x - bounds.left - bounds.width / 2;
      const y = point.y - bounds.top - bounds.height / 2;
      panX = x - (x - panX) * next / zoom;
      panY = y - (y - panY) * next / zoom;
    }
    zoom = next;
    render(announce);
  };

  const openViewer = (trigger, thumbnail) => {
    lastFocused = trigger;
    ready = false;
    zoom = 1;
    pointers.clear();
    image.hidden = true;
    stage.classList.remove("is-zoomed", "is-dragging");
    [zoomIn, zoomOut, fit, actual].forEach(button => { button.disabled = true; });
    output.value = "100%";
    status.textContent = "Loading full-resolution image…";
    const figcaption = thumbnail.closest("figure")?.querySelector("figcaption");
    const plainCaption = figcaption?.cloneNode(true);
    plainCaption?.querySelectorAll("a").forEach(link => link.remove());
    caption.textContent = thumbnail.dataset.caption || figcaption?.querySelector("h3")?.textContent ||
      plainCaption?.textContent.replace(/\s+/g, " ").trim().replace(/\.\s*\.$/, ".") || thumbnail.alt;
    image.alt = thumbnail.alt;
    original.href = thumbnail.dataset.full || trigger.dataset.full || (trigger instanceof HTMLAnchorElement ? trigger.href : thumbnail.src);
    viewer.showModal();
    document.body.classList.add("lightbox-open");
    image.src = original.href;
    close.focus();
  };

  image.addEventListener("load", () => {
    if (!viewer.open) return;
    ready = true;
    image.hidden = false;
    status.textContent = "";
    fitImage();
  });
  image.addEventListener("error", () => {
    if (viewer.open) status.textContent = "The image could not load. Try Open original, or close the viewer and try again.";
  });
  close.addEventListener("click", () => viewer.close());
  viewer.addEventListener("close", () => {
    ready = false;
    pointers.clear();
    image.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    lastFocused?.focus({ preventScroll: true });
  });
  zoomIn.addEventListener("click", () => setZoom(zoom * 1.5));
  zoomOut.addEventListener("click", () => setZoom(zoom / 1.5));
  fit.addEventListener("click", fitImage);
  actual.addEventListener("click", () => setZoom(1 / fitScale));
  stage.addEventListener("wheel", event => {
    event.preventDefault();
    setZoom(zoom * Math.exp(-event.deltaY * .002), { x: event.clientX, y: event.clientY }, false);
  }, { passive: false });

  stage.addEventListener("pointerdown", event => {
    if (!ready || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", event => {
    if (!pointers.has(event.pointerId)) return;
    const before = [...pointers.values()];
    const previous = pointers.get(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1 && zoom > 1) {
      panX += event.clientX - previous.x;
      panY += event.clientY - previous.y;
    } else if (pointers.size === 2) {
      const after = [...pointers.values()];
      const distance = points => Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
      const midpoint = points => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 });
      const oldMid = midpoint(before);
      const newMid = midpoint(after);
      if (distance(before) > 0) setZoom(zoom * distance(after) / distance(before), oldMid, false);
      panX += newMid.x - oldMid.x;
      panY += newMid.y - oldMid.y;
    }
    render();
  });
  const releasePointer = event => {
    pointers.delete(event.pointerId);
    stage.classList.toggle("is-dragging", pointers.size > 0);
  };
  stage.addEventListener("pointerup", releasePointer);
  stage.addEventListener("pointercancel", releasePointer);
  stage.addEventListener("lostpointercapture", releasePointer);
  viewer.addEventListener("keydown", event => {
    if (event.key === "Tab") {
      const controls = [...viewer.querySelectorAll("button:not(:disabled), a[href], [tabindex=\"0\"]")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key === "+" || event.key === "=") setZoom(zoom * 1.5);
    else if (event.key === "-") setZoom(zoom / 1.5);
    else if (event.key === "0") fitImage();
    else if (zoom > 1 && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      panX += event.key === "ArrowLeft" ? 40 : event.key === "ArrowRight" ? -40 : 0;
      panY += event.key === "ArrowUp" ? 40 : event.key === "ArrowDown" ? -40 : 0;
      render();
    } else return;
    event.preventDefault();
  });
  new ResizeObserver(() => { if (viewer.open) fitImage(); }).observe(stage);

  imageLinks.forEach(link => {
    const thumbnail = link.querySelector("img");
    if (!thumbnail) return;
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openViewer(link, thumbnail);
    });
  });
  articleImages.forEach(thumbnail => {
    if (thumbnail.closest("a, button")) return;
    const target = thumbnail.closest("picture") || thumbnail;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zoomable";
    button.setAttribute("aria-label", `View image: ${thumbnail.alt}`);
    target.before(button);
    button.appendChild(target);
    button.addEventListener("click", () => openViewer(button, thumbnail));
  });
}
