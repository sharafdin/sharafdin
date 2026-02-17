/**
 * Reflections — Philosophy journal
 * Vanilla JS: theme toggle, smooth scroll, search, reading progress, mobile menu
 */

(function () {
  'use strict';

  const THEME_KEY = 'reflections-theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  /* ----- Theme toggle ----- */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? THEME_DARK : THEME_LIGHT);
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  }

  function bindThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  }

  /* ----- Smooth scroll for same-page anchors ----- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ----- Article search filter ----- */
  function initArticleSearch() {
    const input = document.getElementById('article-search');
    const list = document.getElementById('article-list');
    const noResults = document.getElementById('no-results');
    if (!input || !list) return;

    const items = list.querySelectorAll('.article-item');
    if (!items.length) return;

    input.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      let visible = 0;

      items.forEach(function (item) {
        const text = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
        const match = !query || text.indexOf(query) !== -1;
        item.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      if (noResults) {
        noResults.classList.toggle('hidden', visible > 0);
      }
    });
  }

  /* ----- Reading progress bar (article pages only) ----- */
  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    const article = document.querySelector('.article-body .prose, .article-single .prose');
    if (!article) return;

    function updateProgress() {
      const rect = article.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      if (docHeight <= 0) {
        bar.style.width = '100%';
        return;
      }
      const articleTop = rect.top + scrollTop - (window.innerHeight * 0.3);
      const articleHeight = article.offsetHeight;
      const start = articleTop - winHeight;
      const end = articleTop + articleHeight;
      let pct = 0;
      if (scrollTop <= start) {
        pct = 0;
      } else if (scrollTop >= end) {
        pct = 100;
      } else {
        pct = ((scrollTop - start) / (end - start)) * 100;
      }
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ----- Reading Time Estimator ----- */
  function initReadingTime() {
    const containers = document.querySelectorAll('.prose');
    if (!containers.length) return;

    containers.forEach(container => {
      const text = container.textContent || '';
      const words = text.trim().split(/\s+/).length;
      const time = Math.max(1, Math.ceil(words / 200));
      
      const display = document.querySelector('.reading-time');
      if (display) {
        display.textContent = `${time} daqiiqo oo akhris ah`;
      }
    });
  }

  /* ----- Zen Mode ----- */
  function initZenMode() {
    if (!document.body.classList.contains('article-page')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'zen-mode-toggle';
    btn.setAttribute('aria-label', 'Toggle Zen Mode');
    btn.innerHTML = '✧';
    document.body.appendChild(btn);

    const ZEN_KEY = 'reflections-zen';
    const saved = localStorage.getItem(ZEN_KEY);
    
    if (saved === 'true') {
      document.body.classList.add('zen-mode');
    }

    btn.addEventListener('click', function() {
      const isZen = document.body.classList.toggle('zen-mode');
      localStorage.setItem(ZEN_KEY, isZen);
    });
  }

  /* ----- Mobile menu ----- */
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----- Init ----- */
  function init() {
    initTheme();
    bindThemeToggle();
    initSmoothScroll();
    initArticleSearch();
    initReadingProgress();
    initReadingTime();
    initZenMode();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
