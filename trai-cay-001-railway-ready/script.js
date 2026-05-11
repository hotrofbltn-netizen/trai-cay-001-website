const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-scroll-progress]");

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
  });
});

const updateChrome = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progress.style.width = `${progressWidth}%`;
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

const revealTargets = document.querySelectorAll(
  ".section-title, .section-copy, .image-stack, .tech-grid article, .product-card, .standard-media, .standard-content, .process-line article, .market-grid article, .news-grid article, .consult > *"
);

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.dataset.revealDelay = String(index % 4);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value);

const animateCounter = (element) => {
  const target = Number(element.dataset.count || "0");
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const started = performance.now();

  const tick = (now) => {
    const elapsed = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const value = Math.round(target * eased);
    element.textContent = `${formatNumber(value)}${suffix}`;

    if (elapsed < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll("[data-count]").forEach((counter) => {
  counterObserver.observe(counter);
});

updateChrome();
window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
