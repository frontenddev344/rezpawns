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

  /* Contact form — static site, validated and confirmed client-side */
  function initContactForm() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    // Replace with your real Formspree endpoint
    const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

    const successBox = form.querySelector(".form-success");
    const submitBtn = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (successBox) {
            successBox.classList.remove("is-visible");
            successBox.textContent = "";
        }

        const name = form.querySelector("#name");
        const email = form.querySelector("#email");
        const subject = form.querySelector("#subject");
        const message = form.querySelector("#message");

        const fields = [name, email, subject, message];

        // Clear previous errors
        fields.forEach(field => {
            field.setCustomValidity("");

            const wrapper = field.closest(".field");
            if (wrapper) wrapper.classList.remove("has-error");

            const error = wrapper?.querySelector(".field-error");
            if (error) error.textContent = "";
        });

        function showError(field, text) {
            field.setCustomValidity(text);

            const wrapper = field.closest(".field");
            if (wrapper) wrapper.classList.add("has-error");

            const error = wrapper?.querySelector(".field-error");
            if (error) error.textContent = text;
        }

        // Required fields
        if (!name.value.trim())
            showError(name, "Please enter your name.");

        if (!email.value.trim())
            showError(email, "Please enter your email address.");

        if (!subject.value.trim())
            showError(subject, "Please select a subject.");

        if (!message.value.trim())
            showError(message, "Please enter your message.");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Name validation
        if (!/^[A-Za-z\s]{3,50}$/.test(name.value.trim()))
            showError(name, "Please enter a valid name.");

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
            showError(email, "Please enter a valid email address.");

        // Message validation
        if (message.value.trim().length < 10)
            showError(message, "Please enter at least 10 characters.");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {

            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: new FormData(form)
            });

            if (!response.ok)
                throw new Error();

            form.reset();

            successBox.textContent =
                "✅ Thank you! Your message has been sent successfully.";

            successBox.classList.add("is-visible");

        } catch {

            successBox.textContent =
                "Unable to send your message right now. Please email us directly.";

            successBox.classList.add("is-visible");

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";

        }

    });
}

// Contact Page Form JS 
     function initNewsletterForm() {
      const form = document.querySelector("#newsletter-form");
      if (!form) return;
  
      const input = form.querySelector("input[type='email']");
      const note = form.querySelector(".form-note");
  
      form.addEventListener("submit", function (e) {
          e.preventDefault();
  
          // Clear previous validation
          input.setCustomValidity("");
  
          if (note) {
              note.textContent = "";
              note.style.color = "";
          }
  
          // Empty validation
          if (!input.value.trim()) {
              input.setCustomValidity("Please enter your email address.");
          }
  
          // Show validation error
          if (!form.checkValidity()) {
              form.reportValidity();
              return;
          }
  
          // Email validation
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
              input.setCustomValidity("Please enter a valid email address.");
          }
  
          // Show validation error
          if (!form.checkValidity()) {
              form.reportValidity();
              return;
          }
  
          // ===== SUCCESS =====
          if (note) {
              note.textContent = "✅ You're subscribed! Thank you for joining our newsletter.";
              note.style.color = "var(--cyan)";
          }
  
          form.reset();
  
          setTimeout(() => {
              if (note) {
                  note.textContent = "";
                  note.style.color = "";
              }
          }, 3000);
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
        'See our <a href="./cookie-policy.html">Cookie Policy</a> for details.</p>' +
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
