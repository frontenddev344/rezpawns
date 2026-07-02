/* ==========================================================================
   Rezpawns.com — Vanilla JS interactions
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
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
  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;

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

      setTimeout(function () {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
        if (successBox) successBox.classList.add("is-visible");
      }, 700);
    });
  }

  /* Footer newsletter — static site, confirms locally */
  function initNewsletterForm() {
    var form = document.querySelector("#newsletter-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type='email']");
      var note = form.querySelector(".form-note");
      if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (note) { note.textContent = "Please enter a valid email address."; note.style.color = "var(--pink)"; }
        return;
      }
      if (note) { note.textContent = "You're in! Watch your inbox for updates."; note.style.color = "var(--cyan)"; }
      form.reset();
    });
  }
})();
