const menuButton = document.querySelector(".menu-button");
const header = document.querySelector(".site-header");

menuButton?.addEventListener("click", () => {
  const open = header.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
