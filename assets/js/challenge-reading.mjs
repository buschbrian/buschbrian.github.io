export function initChallengeReading() {
  const collection = document.querySelector("#map-challenge-2026 ~ .map-grid");
  if (collection) {
    collection.classList.add("collection-2026");
    for (const card of collection.querySelectorAll(".map-card")) {
      const action = document.createElement("span");
      action.className = "map-card-action";
      action.textContent = "View map and method →";
      card.append(action);
    }
  }
  const article = document.querySelector(".post-article");
  if (!article?.querySelector(".post-header .eyebrow")?.textContent.includes("2026")) return;
  const links = article.querySelector(".challenge-links");
  if (!links) return;
  article.classList.add("is-challenge-2026");
  const days = [...links.querySelectorAll("a")].filter(link => /^Day \d+:/.test(link.textContent.trim()));
  const current = days.findIndex(link => link.getAttribute("aria-current") === "page");
  const nav = document.createElement("nav");
  nav.className = "series-bar";
  nav.setAttribute("aria-label", "2026 Map Challenge navigation");
  const collectionLink = document.createElement("a");
  collectionLink.href = "/projects/#map-challenge-2026";
  collectionLink.textContent = "← 2026 map collection";
  nav.append(collectionLink);
  if (current >= 0) {
    const steps = document.createElement("div");
    steps.className = "series-steps";
    for (const [index, direction, symbol] of [[current - 1, "Previous", "←"], [current + 1, "Next", "→"]]) {
      if (!days[index]) continue;
      const link = document.createElement("a");
      link.href = days[index].href;
      link.rel = direction === "Previous" ? "prev" : "next";
      link.textContent = `${symbol} ${days[index].textContent.trim()}`;
      link.setAttribute("aria-label", `${direction}: ${days[index].textContent.trim()}`);
      steps.append(link);
    }
    nav.append(steps);
  }
  article.prepend(nav);
  const metadata = article.querySelector(".post-meta-grid");
  if (metadata) {
    const details = document.createElement("details");
    details.className = "post-details";
    const summary = document.createElement("summary");
    summary.textContent = "Map details";
    details.append(summary);
    metadata.before(details);
    details.append(metadata);
  }
  for (const figure of article.querySelectorAll(".code-excerpt")) {
    const code = figure.querySelector("pre");
    if (!code) continue;
    const details = document.createElement("details");
    details.className = "code-details";
    const summary = document.createElement("summary");
    summary.textContent = "Read the code excerpt";
    details.append(summary);
    code.before(details);
    details.append(code);
  }
}
