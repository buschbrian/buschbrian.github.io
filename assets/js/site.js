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

if (document.querySelector("[data-image-viewer], .post-hero-image img, .post-gallery img")) {
  import("./image-viewer.mjs").then(({ initImageViewer }) => initImageViewer()).catch(error => {
    console.warn("The image viewer is unavailable.", error);
  });
}

import("./challenge-reading.mjs").then(({ initChallengeReading }) => initChallengeReading()).catch(error => {
  console.warn("The reading controls are unavailable.", error);
});
