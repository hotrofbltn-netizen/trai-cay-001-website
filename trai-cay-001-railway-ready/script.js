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

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const telHref = (phoneRaw) => `tel:${String(phoneRaw || "").replace(/[^\d+]/g, "")}`;
const mailHref = (email) => `mailto:${email || ""}`;

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value !== undefined) {
    element.textContent = value;
  }
};

const setAllText = (selector, value) => {
  if (value === undefined) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const setLink = (selector, href, text) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.href = href;
    if (text !== undefined) element.textContent = text;
  });
};

const renderStats = (items = []) => {
  const stats = document.querySelector(".stats");
  if (!stats) return;

  stats.innerHTML = items
    .map(
      (item) => `
        <article>
          <strong data-count="${Number(item.value || 0)}" data-suffix="${escapeHtml(item.suffix || "")}">0</strong>
          <span>${escapeHtml(item.label)}</span>
        </article>
      `
    )
    .join("");
};

const renderSimpleSpans = (selector, items = []) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
};

const renderValues = (items = []) => {
  const grid = document.querySelector(".tech-grid");
  if (!grid) return;

  grid.innerHTML = items
    .map(
      (item) => `
        <article>
          <span class="icon">${escapeHtml(item.icon)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join("");
};

const renderProducts = (items = []) => {
  const grid = document.querySelector(".product-grid");
  if (!grid) return;

  grid.innerHTML = items
    .map(
      (item) => `
        <article class="product-card">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title)}">
          <div>
            <span>${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderFactoryItems = (items = []) => {
  const list = document.querySelector(".standard-list");
  if (!list) return;

  list.innerHTML = items
    .map(
      (item) => `
        <article>
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.text)}</span>
        </article>
      `
    )
    .join("");
};

const renderProcess = (items = []) => {
  const list = document.querySelector(".process-line");
  if (!list) return;

  list.innerHTML = items
    .map(
      (item) => `
        <article>
          <span>${escapeHtml(item.step)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join("");
};

const renderMarket = (items = []) => {
  const grid = document.querySelector(".market-grid");
  if (!grid) return;

  grid.innerHTML = items
    .map(
      (item) => `
        <article>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `
    )
    .join("");
};

const renderNews = (items = []) => {
  const grid = document.querySelector(".news-grid");
  if (!grid) return;

  grid.innerHTML = items
    .map(
      (item) => `
        <article>
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title)}">
          <div>
            <span>${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.text)}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderFooterProducts = (items = []) => {
  const columns = document.querySelectorAll(".footer > div");
  const productColumn = columns[2];
  if (!productColumn) return;

  productColumn.innerHTML = `<h3>Sản phẩm</h3>${items
    .map((item) => `<a href="#products">${escapeHtml(item)}</a>`)
    .join("")}`;
};

const applyContent = (content) => {
  const { site = {}, hero = {}, about = {}, values = {}, products = {}, factory = {}, process = {}, market = {}, news = {}, consult = {}, footer = {} } = content;

  setText(".preheader > span", site.company);
  setAllText(".logo-text strong", site.brand);
  setText(".topbar .logo-text small", site.tagline);
  setText(".footer .logo-text small", site.footerTagline || site.tagline);
  setLink('.preheader a[href^="mailto:"], .footer a[href^="mailto:"], .floating-actions a[href^="mailto:"]', mailHref(site.email), site.email);
  setLink('.preheader a[href^="tel:"], .footer a[href^="tel:"]', telHref(site.phoneRaw), site.phone);
  setLink(".hotline", telHref(site.phoneRaw));
  setText(".hotline strong", site.hotline);

  const quickCall = document.querySelector(".floating-actions a[aria-label='Gọi điện']");
  if (quickCall) quickCall.href = telHref(site.phoneRaw);

  setText(".hero-copy .kicker", hero.kicker);
  setText(".hero-copy h1", hero.title);
  setText(".hero-copy > p:not(.kicker)", hero.body);
  renderSimpleSpans(".hero-trust", hero.trust);

  const badgeValue = document.querySelector(".hero-badge strong");
  if (badgeValue) {
    badgeValue.dataset.count = Number(hero.badgeValue || 0);
    badgeValue.dataset.suffix = hero.badgeSuffix || "";
    badgeValue.textContent = "0";
  }
  setText(".hero-badge span", hero.badgeLabel);

  renderStats(content.stats);
  renderSimpleSpans(".partner-strip", content.partners);

  setText(".floating-card strong", about.cardTitle);
  setText(".floating-card span", about.cardText);
  setText(".about .section-copy .kicker", about.kicker);
  setText(".about .section-copy h2", about.title);
  setText(".about .section-copy > p:not(.kicker)", about.body);
  renderSimpleSpans(".check-grid", about.checks);

  setText(".technology .section-title .kicker", values.kicker);
  setText(".technology .section-title h2", values.title);
  renderValues(values.items);

  setText(".products .section-title .kicker", products.kicker);
  setText(".products .section-title h2", products.title);
  renderProducts(products.items);

  setText(".standard-content .kicker", factory.kicker);
  setText(".standard-content h2", factory.title);
  setText(".standard-content > p:not(.kicker)", factory.body);
  renderFactoryItems(factory.items);

  setText(".process .section-title .kicker", process.kicker);
  setText(".process .section-title h2", process.title);
  renderProcess(process.items);

  setText(".market .section-title .kicker", market.kicker);
  setText(".market .section-title h2", market.title);
  renderMarket(market.items);

  setText(".news .section-title .kicker", news.kicker);
  setText(".news .section-title h2", news.title);
  setText(".news .text-link", news.linkText);
  renderNews(news.items);

  setText(".consult .kicker", consult.kicker);
  setText(".consult h2", consult.title);
  setText(".consult p:not(.kicker)", consult.body);
  const consultButton = document.querySelector(".consult .btn");
  if (consultButton) {
    consultButton.href = telHref(site.phoneRaw);
    consultButton.textContent = consult.button;
  }

  setText(".footer-brand p", footer.description);
  renderFooterProducts(footer.products);
  const footerContact = document.querySelector(".footer > div:last-child p");
  if (footerContact) footerContact.textContent = site.address;
};

const updateChrome = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  if (progress) progress.style.width = `${progressWidth}%`;
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

const initReveal = () => {
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
};

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

const initCounters = () => {
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
};

const boot = async () => {
  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    if (response.ok) {
      applyContent(await response.json());
    }
  } catch (error) {
    console.warn("Không tải được content.json, dùng nội dung mặc định.", error);
  }

  initReveal();
  initCounters();
  updateChrome();
};

boot();
window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
