const desktopQuery = matchMedia("(min-width: 1201px)");
const mobileNav = document.querySelector(".mobile-nav");
const menuToggle = mobileNav?.querySelector(".menu-toggle");
const trainingLink = document.querySelector(".mobile-training-link");

function setTrainingLink() {
  trainingLink?.classList.toggle("is-visible", scrollY >= innerHeight);
}

setTrainingLink();
addEventListener("scroll", setTrainingLink, { passive: true });

for (const menu of document.querySelectorAll(".desktop-menu .nav-group")) {
  menu.addEventListener("mouseenter", () => {
    if (desktopQuery.matches) menu.open = true;
  });
  menu.addEventListener("mouseleave", () => {
    if (desktopQuery.matches) menu.open = false;
  });
}

function setMobileMenu(open) {
  mobileNav?.classList.toggle("is-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute("aria-label", menuToggle.dataset[open ? "closeLabel" : "openLabel"]);
}

menuToggle?.addEventListener("click", () => setMobileMenu(!mobileNav.classList.contains("is-open")));

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openSubmenu = [...document.querySelectorAll(".site-header .nav-group[open]")].pop();
  if (openSubmenu) {
    openSubmenu.open = false;
    openSubmenu.querySelector(":scope > summary")?.focus();
  } else if (mobileNav?.classList.contains("is-open")) {
    setMobileMenu(false);
    menuToggle.focus();
  }
});

desktopQuery.addEventListener("change", () => setMobileMenu(false));
