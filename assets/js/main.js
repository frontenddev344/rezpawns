/* ==========================================================================
   Rezpawns.com — Vanilla JS interactions
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initCookieConsent();
    initFooterConsentLink();
    initYear();
    initHeaderScroll();
    initMobileNav();
    initRevealAnimations();
    initFaqAccordion();
    initBackToTop();
    initGameFilters();
    initFullscreenButtons();
    initContactForm();
    initNewsletterForm();
    initGameCarousels();
  });

  /* Footer copyright year */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* Header gains a solid background once the page scrolls */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var toggle = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* Mobile slide-in navigation */
  function initMobileNav() {
    var toggleBtn = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (!toggleBtn || !navLinks) return;

    function closeNav() {
      toggleBtn.classList.remove("is-open");
      navLinks.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openNav() {
      toggleBtn.classList.add("is-open");
      navLinks.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggleBtn.addEventListener("click", function () {
      var isOpen = navLinks.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Fade/slide-up reveal as elements enter the viewport */
  function initRevealAnimations() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* FAQ accordion */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector(".faq-q");
      var answer = item.querySelector(".faq-a");
      if (!question || !answer) return;

      question.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        items.forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq-a").style.maxHeight = null;
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          question.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* Back-to-top floating button */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 480);
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Games page genre filtering */
  function initGameFilters() {
    var chips = document.querySelectorAll(".filter-chip");
    var cards = document.querySelectorAll("[data-genre]");
    if (!chips.length || !cards.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var filter = chip.getAttribute("data-filter");

        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-genre") === filter;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* Game detail page — fullscreen toggle for the embedded player iframe */
  function initFullscreenButtons() {
    document.querySelectorAll("[data-fullscreen-target]").forEach(function (btn) {
      var frame = document.querySelector(btn.getAttribute("data-fullscreen-target"));
      if (!frame) return;
      btn.addEventListener("click", function () {
        if (frame.requestFullscreen) frame.requestFullscreen();
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
      });
    });
  }

  /* Contact form — static site, validated and confirmed client-side */
  /* Contact form — submits to Formspree. Replace FORM_ENDPOINT with your
     real Formspree (or equivalent) endpoint before launch: https://formspree.io/f/YOUR_FORM_ID */
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;

    var FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_REAL_FORM_ID";
    var successBox = form.querySelector(".form-success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll("[required]");

      fields.forEach(function (field) {
        var wrapper = field.closest(".field");
        var errorEl = wrapper ? wrapper.querySelector(".field-error") : null;
        var value = field.value.trim();
        var fieldValid = value.length > 0;

        if (field.type === "email" && value) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (wrapper) wrapper.classList.toggle("has-error", !fieldValid);
        if (errorEl) {
          errorEl.textContent = fieldValid
            ? ""
            : field.type === "email"
            ? "Please enter a valid email address."
            : "This field is required.";
        }
        if (!fieldValid) valid = false;
      });

      if (!valid) return;

      var submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          if (successBox) successBox.classList.add("is-visible");
        })
        .catch(function () {
          if (successBox) {
            successBox.textContent = "Something went wrong sending your message — please email us directly at hello@rezpawns.com.";
            successBox.classList.add("is-visible");
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
          }
        });
    });
  }

  /* Footer newsletter — submits to Formspree. Replace FORM_ENDPOINT with your
     real Formspree (or equivalent / ESP) endpoint before launch. */
  function initNewsletterForm() {
    var form = document.querySelector("#newsletter-form");
    if (!form) return;

    var FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_REAL_FORM_ID";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type='email']");
      var note = form.querySelector(".form-note");
      if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (note) { note.textContent = "Please enter a valid email address."; note.style.color = "var(--pink)"; }
        return;
      }

      var submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value.trim() })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          if (note) { note.textContent = "You're in! Watch your inbox for updates."; note.style.color = "var(--cyan)"; }
          form.reset();
        })
        .catch(function () {
          if (note) { note.textContent = "Something went wrong — please try again later."; note.style.color = "var(--pink)"; }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
  /* Simple image carousel on game detail pages */
  function initGameCarousels() {
    document.querySelectorAll(".game-carousel").forEach(function (carousel) {
      var track = carousel.querySelector(".carousel-track");
      var slides = carousel.querySelectorAll(".carousel-slide");
      var dots = carousel.querySelectorAll(".carousel-dot");
      var prev = carousel.querySelector(".carousel-prev");
      var next = carousel.querySelector(".carousel-next");
      var index = 0;

      function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + (index * 100) + "%)";
        dots.forEach(function (d, di) { d.classList.toggle("is-active", di === index); });
      }

      if (prev) prev.addEventListener("click", function () { go(index - 1); });
      if (next) next.addEventListener("click", function () { go(index + 1); });
      dots.forEach(function (d, di) { d.addEventListener("click", function () { go(di); }); });

      var startX = null;
      track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener("touchend", function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        startX = null;
      });

      go(0);
    });
  }
  /* Cookie consent banner + gate for future ad/analytics scripts.
     Any script that needs consent (AdSense, analytics, etc.) should call:
       window.rezpawnsConsent.onConsent(function () { /* load script here */ /* })
     instead of loading unconditionally. If consent was already given in a
     previous visit, the callback fires immediately. */
  function initCookieConsent() {
    var STORAGE_KEY = "rezpawns_cookie_consent"; // "accepted" | "necessary_only"
    var callbacks = [];
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

    window.rezpawnsConsent = {
      status: stored,
      onConsent: function (cb) {
        if (window.rezpawnsConsent.status === "accepted") { cb(); }
        else { callbacks.push(cb); }
      }
    };

    function setStatus(value) {
      window.rezpawnsConsent.status = value;
      try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable */ }
      if (value === "accepted") { callbacks.forEach(function (cb) { cb(); }); callbacks = []; }
      var banner = document.getElementById("cookie-consent-banner");
      if (banner) banner.setAttribute("hidden", "");
    }

    function createBanner() {
      var existing = document.getElementById("cookie-consent-banner");
      if (existing) { existing.removeAttribute("hidden"); return; }
      var banner = document.createElement("div");
      banner.className = "consent-banner";
      banner.id = "cookie-consent-banner";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-label", "Cookie consent");
      banner.innerHTML =
        '<p>We use necessary cookies to run this site, and — only with your consent — analytics and advertising cookies. ' +
        'See our <a href="/cookie-policy.html">Cookie Policy</a> for details.</p>' +
        '<div class="consent-actions">' +
        '<button type="button" class="btn btn-primary btn-sm" data-consent="accept">Accept All</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-consent="necessary">Necessary Only</button>' +
        '</div>';
      document.body.appendChild(banner);
      banner.querySelector('[data-consent="accept"]').addEventListener("click", function () { setStatus("accepted"); });
      banner.querySelector('[data-consent="necessary"]').addEventListener("click", function () { setStatus("necessary_only"); });
    }

    if (stored !== "accepted" && stored !== "necessary_only") { createBanner(); }

    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-reopen-consent]")) {
        try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* storage unavailable */ }
        window.rezpawnsConsent.status = null;
        createBanner();
      }
    });
  }

  /* Adds a "Cookie Preferences" link into every page's footer bottom row */
  function initFooterConsentLink() {
    var row = document.querySelector(".footer-bottom-links");
    if (!row || row.querySelector("[data-reopen-consent]")) return;
    var link = document.createElement("a");
    link.href = "#";
    link.setAttribute("data-reopen-consent", "");
    link.textContent = "Cookie Preferences";
    link.addEventListener("click", function (e) { e.preventDefault(); });
    row.appendChild(link);
  }
})();
