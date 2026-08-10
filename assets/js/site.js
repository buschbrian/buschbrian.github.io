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

/* --- expandable image lightbox --- */
const zoomables = document.querySelectorAll(".post-hero-image img, .post-gallery img");

if (zoomables.length) {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Expanded image");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close expanded image">&times;</button>' +
    '<figure class="lightbox-figure"><img alt=""><figcaption class="lightbox-caption"></figcaption></figure>';
  document.body.appendChild(overlay);

  const bigImg = overlay.querySelector("img");
  const caption = overlay.querySelector(".lightbox-caption");
  const closeBtn = overlay.querySelector(".lightbox-close");
  let lastFocused = null;

  const isOpen = () => overlay.getAttribute("aria-hidden") === "false";

  const openLightbox = img => {
    lastFocused = document.activeElement;
    bigImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
    bigImg.alt = img.alt || "";
    const figcap = img.closest("figure") && img.closest("figure").querySelector("figcaption");
    const text = img.getAttribute("data-caption") || (figcap ? figcap.textContent.trim() : "");
    caption.textContent = text;
    caption.hidden = !text;
    document.body.classList.add("lightbox-open");
    overlay.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  };

  const closeLightbox = () => {
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    bigImg.removeAttribute("src");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  zoomables.forEach(img => {
    img.classList.add("zoomable");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", (img.alt ? img.alt + " — " : "") + "view full size");
    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  bigImg.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", event => {
    if (!isOpen()) return;
    if (event.key === "Escape") closeLightbox();
    // keep focus inside the dialog (close button is the only focusable control)
    if (event.key === "Tab") {
      event.preventDefault();
      closeBtn.focus();
    }
  });
}
