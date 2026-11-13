(() => {
  const THEME_KEY = "mg-theme";
  const WA_URL = "https://wa.me/923320070729";
  const root = document.documentElement;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* quota full or blocked — theme still applies for this session */
    }
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  };

  try {
    applyTheme(getPreferredTheme());
  } catch (e) {
    root.setAttribute("data-theme", "dark");
  }

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  });

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  let headerTicking = false;
  const updateHeader = () => {
    if (!header) return;
    const y = window.scrollY;
    const progress = Math.min(1, Math.max(0, y / 90));
    header.style.setProperty("--hp", progress.toFixed(3));
    header.classList.toggle("is-scrolled", progress > 0.12);
    headerTicking = false;
  };

  const onScroll = () => {
    if (headerTicking) return;
    headerTicking = true;
    requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", onScroll, { passive: true });

  const scrollToHash = (hash) => {
    if (!hash || hash === "#") return false;
    const target = document.querySelector(hash);
    if (!target) return false;
    const navH = header ? header.offsetHeight : 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (scrollToHash(hash)) {
      e.preventDefault();
      history.pushState(null, "", hash);
    }
  });

  const closeNavDropdowns = () => {
    document.querySelectorAll(".nav-item.is-open").forEach((item) => {
      item.classList.remove("is-open");
      const btn = item.querySelector(".nav-drop-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  };

  document.querySelectorAll(".nav-item").forEach((item) => {
    const btn = item.querySelector(".nav-drop-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !item.classList.contains("is-open");
      closeNavDropdowns();
      item.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.addEventListener("click", () => closeNavDropdowns());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNavDropdowns();
  });

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name")?.value?.trim() || "";
      const email = form.querySelector("#email")?.value?.trim() || "";
      const bike = form.querySelector("#bike")?.value?.trim() || "";
      const pkg = form.querySelector("#package")?.value || "";
      const message = form.querySelector("#message")?.value?.trim() || "";
      const lines = [
        "Hi MotoGloss — I'd like to book a detail.",
        name && `Name: ${name}`,
        email && `Email: ${email}`,
        bike && `Bike: ${bike}`,
        pkg && `Package: ${pkg}`,
        message && `Message: ${message}`,
      ].filter(Boolean);
      window.open(
        `${WA_URL}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
        "noopener,noreferrer"
      );
      const success = form.querySelector(".form-success");
      if (success) success.classList.add("is-visible");
    });
  }

  if (!document.querySelector(".wa-float")) {
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = WA_URL;
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
    wa.setAttribute("aria-label", "Chat with MotoGloss on WhatsApp");
    wa.innerHTML =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.01 3C9.4 3 4 8.4 4 15c0 2.2.6 4.3 1.7 6.1L4 29l8.1-1.7c1.7.9 3.7 1.4 5.7 1.4h.01c6.61 0 12.01-5.4 12.01-12S22.62 3 16.01 3zm0 21.9c-1.8 0-3.5-.5-5-1.3l-.36-.21-4.8 1 1.02-4.68-.24-.38A9.86 9.86 0 0 1 6.1 15c0-5.46 4.45-9.9 9.91-9.9 5.47 0 9.91 4.44 9.91 9.9 0 5.46-4.44 9.9-9.91 9.9zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>';
    document.body.appendChild(wa);
  }

  const hero = document.querySelector(".hero");
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dot")];
  const slideLabel = document.querySelector("[data-hero-label]");
  const slideLabels = [
    "BMW S1000RR · M Package",
    "Kawasaki Z1000",
    "Kawasaki Z1000",
  ];

  if (hero && slides.length) {
    let current = 0;
    let timer = null;

    const ensureBg = (slide) => {
      if (!slide || slide.style.backgroundImage) return;
      const src = slide.getAttribute("data-bg");
      if (src) {
        slide.style.backgroundImage = `url('${src}')`;
        slide.removeAttribute("data-bg");
      }
    };

    const warmSlides = () => {
      slides.forEach(ensureBg);
    };

    const goTo = (index) => {
      current = ((index % slides.length) + slides.length) % slides.length;
      ensureBg(slides[current]);
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach((dot, i) => {
        const active = i === current;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", String(active));
      });
      if (slideLabel) slideLabel.textContent = slideLabels[current] || "";
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => goTo(current + 1), 4800);
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = Number(dot.getAttribute("data-slide"));
        goTo(Number.isFinite(idx) ? idx : 0);
        start();
      });
    });

    const dotsWrap = document.querySelector(".hero-dots");
    if (dotsWrap) {
      dotsWrap.addEventListener("mouseenter", stop);
      dotsWrap.addEventListener("mouseleave", start);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    goTo(0);
    start();
    if ("requestIdleCallback" in window) {
      requestIdleCallback(warmSlides, { timeout: 1500 });
    } else {
      window.setTimeout(warmSlides, 400);
    }
  }
})();
