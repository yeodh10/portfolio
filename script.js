/* =============================================================================
   Portfolio — Vanilla JS (zero dependencies)
   Hooks (per design contract, do not rename):
     #site-header (.scrolled / .nav-open), #nav-toggle, .nav-link,
     [data-count], #year, #to-top, #hero-canvas, .reveal
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------------------------------------------------------------------------
     0. Footer year
     ------------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------------------------
     1. Mobile nav toggle (#nav-toggle <-> #site-header.nav-open)
     ------------------------------------------------------------------------ */
  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function closeNav() {
    if (!header) return;
    header.classList.remove('nav-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '메뉴 열기');
    }
  }

  function toggleNav() {
    if (!header) return;
    var willOpen = !header.classList.contains('nav-open');
    header.classList.toggle('nav-open', willOpen);
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', willOpen ? '메뉴 닫기' : '메뉴 열기');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  // Close the drawer when a nav link is tapped (mobile).
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape, and when resized up to desktop.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) closeNav();
  });

  /* ---------------------------------------------------------------------------
     2. Header .scrolled toggle on scroll
     ------------------------------------------------------------------------ */
  function updateHeaderScrolled() {
    if (!header) return;
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ---------------------------------------------------------------------------
     3. Back-to-top button (#to-top)
     ------------------------------------------------------------------------ */
  var toTop = document.getElementById('to-top');

  function updateToTop() {
    if (!toTop) return;
    if (window.scrollY > 480) {
      toTop.classList.add('is-visible');
    } else {
      toTop.classList.remove('is-visible');
    }
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    });
  }

  /* ---------------------------------------------------------------------------
     4. Smooth anchor scroll with sticky-header offset
     ------------------------------------------------------------------------ */
  function headerHeight() {
    var h = header ? header.offsetHeight : 0;
    return h || 64;
  }

  var internalLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="#"]')
  );

  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      closeNav();

      var top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight() -
        12;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: prefersReduced ? 'auto' : 'smooth'
      });

      // Move focus for accessibility without re-triggering jump.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------------------------------------------------------------------------
     5. Scroll-spy — set .active on the current section's nav link
     ------------------------------------------------------------------------ */
  var spyTargets = navLinks
    .map(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) return null;
      var section = document.getElementById(href.slice(1));
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function setActiveLink(activeLink) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link === activeLink);
    });
  }

  function updateScrollSpy() {
    if (!spyTargets.length) return;
    var probe = headerHeight() + 24;
    var current = spyTargets[0].link;

    for (var i = 0; i < spyTargets.length; i++) {
      var rect = spyTargets[i].section.getBoundingClientRect();
      if (rect.top - probe <= 0) {
        current = spyTargets[i].link;
      }
    }

    // Near the very bottom, force the last section active.
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    ) {
      current = spyTargets[spyTargets.length - 1].link;
    }

    setActiveLink(current);
  }

  /* ---------------------------------------------------------------------------
     Combined scroll handler (rAF-throttled)
     ------------------------------------------------------------------------ */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateHeaderScrolled();
      updateToTop();
      updateScrollSpy();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateHeaderScrolled();
  updateToTop();
  updateScrollSpy();

  /* ---------------------------------------------------------------------------
     6. Reveal on scroll (.reveal -> .is-visible, once)
     ------------------------------------------------------------------------ */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------------------
     7. Count-up for [data-count]
        Supports optional data-prefix / data-suffix on the element.
     ------------------------------------------------------------------------ */
  var counters = Array.prototype.slice.call(
    document.querySelectorAll('[data-count]')
  );

  function formatNumber(n) {
    // Thousands separators, locale-aware.
    return Math.round(n).toLocaleString('ko-KR');
  }

  function renderCounter(el, value) {
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = prefix + formatNumber(value) + suffix;
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    if (prefersReduced) {
      renderCounter(el, target);
      return;
    }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      renderCounter(el, target * eased);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        renderCounter(el, target);
      }
    }

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        renderCounter(el, parseFloat(el.getAttribute('data-count')) || 0);
      });
    } else {
      var countObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { root: null, threshold: 0.4 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------------------------------------------------------------------------
     8. Hero canvas — floating shapes + ghost cursor
        Whiteboard metaphor. Respects prefers-reduced-motion (no loop).
        Pauses when off-screen / tab hidden. Handles resize (DPR-aware).
     ------------------------------------------------------------------------ */
  var canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.closest('.hero') || canvas.parentElement;

    var ACCENT = '#6c8cff';
    var ACCENT_2 = '#34e0d8';

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var shapes = [];
    var cursors = [];
    var rafId = null;
    var running = false;
    var onScreen = true;

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function buildScene() {
      var area = width * height;
      // Scale shape count to viewport, clamped for performance.
      var count = Math.max(6, Math.min(14, Math.round(area / 90000)));
      shapes = [];
      for (var i = 0; i < count; i++) {
        var kind = pick(['rect', 'circle', 'ring']);
        var size = rand(26, 74);
        shapes.push({
          kind: kind,
          x: rand(0, width),
          y: rand(0, height),
          size: size,
          vx: rand(-0.16, 0.16),
          vy: rand(-0.16, 0.16),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.0035, 0.0035),
          color: pick([ACCENT, ACCENT_2]),
          alpha: rand(0.1, 0.26)
        });
      }

      // A couple of "ghost cursors" drifting across, like remote collaborators.
      cursors = [
        { color: ACCENT, alpha: 0.5 },
        { color: ACCENT_2, alpha: 0.42 }
      ].map(function (c) {
        return {
          color: c.color,
          alpha: c.alpha,
          x: rand(0, width),
          y: rand(0, height),
          tx: rand(0, width),
          ty: rand(0, height),
          speed: rand(0.006, 0.012)
        };
      });
    }

    function resize() {
      var rect = (hero || canvas).getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    }

    function drawShape(s) {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = 1.5;

      var h = s.size / 2;
      if (s.kind === 'rect') {
        var r = 8;
        roundRect(-h, -h, s.size, s.size, r);
        ctx.stroke();
      } else if (s.kind === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, h, 0, Math.PI * 2);
        ctx.globalAlpha = s.alpha * 0.7;
        ctx.fill();
      } else {
        // ring
        ctx.beginPath();
        ctx.arc(0, 0, h, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function drawCursor(c) {
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.fillStyle = c.color;
      ctx.translate(c.x, c.y);
      // Simple arrow cursor (whiteboard collaborator pointer).
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 16);
      ctx.lineTo(4.2, 12);
      ctx.lineTo(7, 18);
      ctx.lineTo(9.4, 16.8);
      ctx.lineTo(6.6, 11);
      ctx.lineTo(12, 11);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      var i;
      for (i = 0; i < shapes.length; i++) {
        var s = shapes[i];
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.vr;

        var pad = s.size;
        if (s.x < -pad) s.x = width + pad;
        if (s.x > width + pad) s.x = -pad;
        if (s.y < -pad) s.y = height + pad;
        if (s.y > height + pad) s.y = -pad;

        drawShape(s);
      }

      for (i = 0; i < cursors.length; i++) {
        var c = cursors[i];
        c.x += (c.tx - c.x) * c.speed;
        c.y += (c.ty - c.y) * c.speed;
        if (Math.abs(c.tx - c.x) < 6 && Math.abs(c.ty - c.y) < 6) {
          c.tx = rand(width * 0.1, width * 0.9);
          c.ty = rand(height * 0.1, height * 0.9);
        }
        drawCursor(c);
      }

      rafId = window.requestAnimationFrame(tick);
    }

    function start() {
      if (running || prefersReduced || !onScreen) return;
      running = true;
      rafId = window.requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function drawStaticFrame() {
      ctx.clearRect(0, 0, width, height);
      shapes.forEach(drawShape);
      cursors.forEach(drawCursor);
    }

    // Initial sizing + first paint.
    resize();

    if (prefersReduced) {
      // Single static frame, no loop.
      drawStaticFrame();
    } else {
      // Pause when hero scrolls out of view.
      if ('IntersectionObserver' in window && hero) {
        var visObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              onScreen = entry.isIntersecting;
              if (onScreen) {
                start();
              } else {
                stop();
              }
            });
          },
          { threshold: 0.01 }
        );
        visObserver.observe(hero);
      }

      // Pause when the tab is hidden.
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          stop();
        } else if (onScreen) {
          start();
        }
      });

      start();
    }

    // Debounced resize.
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        if (prefersReduced) {
          drawStaticFrame();
        }
      }, 150);
    });
  }
})();
