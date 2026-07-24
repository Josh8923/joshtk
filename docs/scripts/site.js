(function () {
  "use strict";

  document.documentElement.classList.add("js-reveal-ready");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("jtk-theme", theme);
    var button = document.querySelector(".theme-toggle");
    if (button) {
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      button.innerHTML = theme === "dark" ? "<span aria-hidden='true'>☼</span>" : "<span aria-hidden='true'>◐</span>";
    }
  }

  function installThemeToggle() {
    var navbarTools = document.querySelector(".quarto-navbar-tools");
    var navbarContainer = document.querySelector(".navbar .container-fluid");
    var parent = navbarTools || navbarContainer;
    if (!parent || document.querySelector(".theme-toggle")) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", function () {
      var current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
    parent.prepend(button);
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }

  function installResearchFilters() {
    var buttons = Array.from(document.querySelectorAll("[data-research-filter]"));
    var cards = Array.from(document.querySelectorAll("[data-research-category]"));
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var category = button.dataset.researchFilter;
        buttons.forEach(function (item) {
          var active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        cards.forEach(function (card) {
          var categories = card.dataset.researchCategory.split(/\s+/);
          var show = category === "all" || categories.includes(category);
          card.hidden = !show;
        });
        var count = cards.filter(function (card) { return !card.hidden; }).length;
        var result = document.querySelector("#research-result-count");
        if (result) result.textContent = count + (count === 1 ? " project" : " projects");
      });
    });
  }

  function installPublicationFilters() {
    var buttons = Array.from(document.querySelectorAll("[data-publication-filter]"));
    var entries = Array.from(document.querySelectorAll("[data-publication-status]"));
    var input = document.querySelector("#publication-search");
    if (!buttons.length || !entries.length || !input) return;
    var status = "all";

    function update() {
      var query = input.value.trim().toLowerCase();
      entries.forEach(function (entry) {
        var statusMatch = status === "all" || entry.dataset.publicationStatus === status;
        var textMatch = !query || entry.textContent.toLowerCase().includes(query);
        entry.hidden = !(statusMatch && textMatch);
      });
      var count = entries.filter(function (entry) { return !entry.hidden; }).length;
      var result = document.querySelector("#publication-result-count");
      if (result) result.textContent = count + (count === 1 ? " scholarly item" : " scholarly items");
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        status = button.dataset.publicationFilter;
        buttons.forEach(function (item) {
          var active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        update();
      });
    });
    input.addEventListener("input", update);
    update();
  }

  function installRevealMotion() {
    var items = Array.from(document.querySelectorAll(".reveal"));
    if (!items.length) {
      document.documentElement.classList.remove("js-reveal-ready");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function updateYear() {
    var year = document.querySelector("#site-year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function initializeSite() {
    installThemeToggle();
    installResearchFilters();
    installPublicationFilters();
    installRevealMotion();
    updateYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSite);
  } else {
    initializeSite();
  }

  window.addEventListener("load", function () {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (item) {
      item.classList.add("is-visible");
    });
  });
})();
