/*!
 * Urba Kids — script commun à toutes les pages.
 * Gère : header au scroll, menu hub, accordéon FAQ, animations reveal,
 * compteurs, badge horaires "ouvert/fermé", bandeau cookies, CTA sticky
 * mobile, lightbox galerie, formulaire newsletter (démo).
 * Chargé avec `defer` sur chaque page.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
   * Horaires réels du parc — source unique utilisée par le badge "ouvert
   * maintenant" et par les contraintes de date des formulaires de réservation.
   * 0 = dimanche ... 6 = samedi.
   * ------------------------------------------------------------------- */
  var OPENING_HOURS = {
    0: [{ start: '09:00', end: '18:00' }],
    1: [{ start: '13:00', end: '18:00' }],
    2: [{ start: '13:00', end: '18:00' }],
    3: [{ start: '09:00', end: '18:00' }],
    4: [{ start: '09:00', end: '18:00' }],
    5: [{ start: '09:00', end: '18:00' }],
    6: [{ start: '09:00', end: '18:00' }],
  };
  // Fermetures / horaires spéciaux, clé au format "MM-DD"
  var SPECIAL_DAYS = {
    '12-25': { closed: true },
    '12-24': { start: '09:00', end: '17:00' },
    '12-31': { start: '09:00', end: '17:00' },
  };
  var DAY_LABELS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  window.URBA_KIDS = { OPENING_HOURS: OPENING_HOURS, SPECIAL_DAYS: SPECIAL_DAYS, DAY_LABELS: DAY_LABELS };

  function pad(n) { return String(n).padStart(2, '0'); }
  function mmdd(date) { return pad(date.getMonth() + 1) + '-' + pad(date.getDate()); }
  function isoDate(date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()); }

  function todaysPeriods(date) {
    var key = mmdd(date);
    var special = SPECIAL_DAYS[key];
    if (special) {
      if (special.closed) return [];
      return [{ start: special.start, end: special.end }];
    }
    return OPENING_HOURS[date.getDay()] || [];
  }

  function isOpenNow(date) {
    var periods = todaysPeriods(date);
    var hhmm = pad(date.getHours()) + ':' + pad(date.getMinutes());
    return periods.some(function (p) { return hhmm >= p.start && hhmm < p.end; });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ---------------- Header scroll state ---------------- */
    var header = document.getElementById('siteHeader');
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 30); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------------- Menu hub ---------------- */
    var menuHub = document.getElementById('menuHub');
    if (menuHub) {
      var toggleMenuHub = function (open) {
        var willOpen = open === undefined ? !menuHub.classList.contains('open') : open;
        menuHub.classList.toggle('open', willOpen);
        menuHub.setAttribute('aria-hidden', String(!willOpen));
        document.body.style.overflow = willOpen ? 'hidden' : '';
      };
      window.toggleMenuHub = toggleMenuHub;
      document.querySelectorAll('[data-menu-trigger]').forEach(function (btn) {
        btn.addEventListener('click', function () { toggleMenuHub(true); });
      });
      document.querySelectorAll('[data-menu-close]').forEach(function (btn) {
        btn.addEventListener('click', function () { toggleMenuHub(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') toggleMenuHub(false);
      });
      if (window.location.hash === '#menu') toggleMenuHub(true);
    }

    /* ---------------- FAQ accordion ---------------- */
    document.querySelectorAll('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var isOpen = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(isOpen));
      });
    });

    /* ---------------- Reveal on scroll ---------------- */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------------- Count-up stats ---------------- */
    var countEls = document.querySelectorAll('[data-count]');
    if (countEls.length && 'IntersectionObserver' in window) {
      var countIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.dataset.count, 10);
            var suffix = el.dataset.suffix || '';
            var duration = 1200;
            var start = performance.now();
            function tick(now) {
              var progress = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            countIo.unobserve(el);
          });
        },
        { threshold: 0.6 }
      );
      countEls.forEach(function (el) { countIo.observe(el); });
    }

    /* ---------------- Badge "ouvert / fermé maintenant" ---------------- */
    document.querySelectorAll('[data-open-status]').forEach(function (el) {
      var now = new Date();
      var open = isOpenNow(now);
      var periods = todaysPeriods(now);
      el.classList.toggle('is-closed', !open);
      var dot = '<span class="dot-status" aria-hidden="true"></span>';
      var text;
      if (open) {
        text = 'Ouvert maintenant';
      } else if (periods.length) {
        text = 'Fermé — ouvre à ' + periods[0].start;
      } else {
        text = 'Fermé aujourd’hui';
      }
      el.innerHTML = dot + text;
    });

    /* Highlight today's row in the opening-hours table, if present */
    var todayRow = document.querySelector('[data-day="' + new Date().getDay() + '"]');
    if (todayRow) todayRow.classList.add('today');

    /* ---------------- Compte à rebours saisonnier (ex. Urba Byrinthe) ---------------- */
    document.querySelectorAll('[data-countdown-to]').forEach(function (el) {
      var target = new Date(el.dataset.countdownTo + 'T18:00:00');
      var diffDays = Math.ceil((target - new Date()) / 86400000);
      if (diffDays > 0) {
        el.textContent = diffDays === 1 ? 'Dernier jour aujourd’hui !' : 'Encore ' + diffDays + ' jours pour en profiter';
      } else {
        var banner = el.closest('.season-banner');
        if (banner) banner.style.display = 'none';
      }
    });

    /* ---------------- Footer year ---------------- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* ---------------- Sticky mobile CTA ---------------- */
    var stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
      var heroOrHeader = document.querySelector('.hero') || header;
      var showAfter = heroOrHeader ? heroOrHeader.offsetHeight * 0.6 : 400;
      var onScrollCta = function () { stickyCta.classList.toggle('show', window.scrollY > showAfter); };
      window.addEventListener('scroll', onScrollCta, { passive: true });
      onScrollCta();
    }

    /* ---------------- Gallery lightbox ---------------- */
    var lightbox = document.getElementById('galleryLightbox');
    if (lightbox) {
      var lbImg = lightbox.querySelector('img');
      var lbCaption = lightbox.querySelector('.lightbox-caption');
      var openLightbox = function (src, alt, caption) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        lbCaption.textContent = caption || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      };
      var closeLightbox = function () {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      document.querySelectorAll('.g-tile[data-full]').forEach(function (tile) {
        tile.addEventListener('click', function () {
          openLightbox(tile.dataset.full, tile.querySelector('img') ? tile.querySelector('img').alt : '', tile.dataset.caption || '');
        });
      });
      lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (btn) {
        btn.addEventListener('click', closeLightbox);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    }

    /* ---------------- Newsletter (démo, sans backend) ---------------- */
    document.querySelectorAll('.newsletter-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var note = form.querySelector('.newsletter-note');
        var input = form.querySelector('input[type=email]');
        if (note) {
          note.textContent = 'Merci ! (démo — à connecter à votre outil d’emailing, ex. Mailchimp/Brevo).';
          note.style.color = '#1a5c3b';
        }
        if (input) input.value = '';
      });
    });

    /* ---------------- Bandeau cookies / consentement ---------------- */
    var CONSENT_KEY = 'uk_cookie_consent';
    var banner = document.getElementById('cookieBanner');
    if (banner) {
      var stored = null;
      try { stored = localStorage.getItem(CONSENT_KEY); } catch (err) { /* stockage indisponible */ }
      if (!stored) {
        banner.classList.add('show');
      } else if (stored === 'accepted') {
        loadAnalytics();
      }
      var setConsent = function (value) {
        try { localStorage.setItem(CONSENT_KEY, value); } catch (err) { /* ignore */ }
        banner.classList.remove('show');
        if (value === 'accepted') loadAnalytics();
      };
      var acceptBtn = banner.querySelector('[data-cookie-accept]');
      var declineBtn = banner.querySelector('[data-cookie-decline]');
      if (acceptBtn) acceptBtn.addEventListener('click', function () { setConsent('accepted'); });
      if (declineBtn) declineBtn.addEventListener('click', function () { setConsent('declined'); });
    }

    function loadAnalytics() {
      // Emplacement prêt pour Google Analytics 4 / GTM, chargé uniquement
      // après consentement (conformité RGPD / nLPD). Remplacer GA_MEASUREMENT_ID
      // par l'identifiant réel avant mise en production.
      if (window.__uk_analytics_loaded || window.URBA_KIDS_GA_ID === undefined) return;
      window.__uk_analytics_loaded = true;
      var gaId = window.URBA_KIDS_GA_ID;
      if (!gaId || gaId.indexOf('REMPLACER') !== -1) return;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', gaId, { anonymize_ip: true });
    }
  });

  window.URBA_KIDS.isOpenNow = isOpenNow;
  window.URBA_KIDS.isoDate = isoDate;
  window.URBA_KIDS.todaysPeriods = todaysPeriods;
})();
