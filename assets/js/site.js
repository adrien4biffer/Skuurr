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

  /* ---------------------------------------------------------------------
   * Urbo, la mascotte Urba Kids — petit copain flottant présent sur toutes
   * les pages (widget injecté en JS pour ne pas dupliquer le SVG partout).
   * Clic = astuce ou anecdote aléatoire dans une bulle.
   * ------------------------------------------------------------------- */
  var MASCOT_SVG =
    '<svg viewBox="0 0 100 120" role="img" aria-hidden="true">' +
    '<ellipse cx="50" cy="66" rx="36" ry="40" fill="#FF8F87"/>' +
    '<ellipse cx="50" cy="75" rx="18" ry="22" fill="#FFFBF3"/>' +
    '<circle cx="50" cy="77" r="7" fill="#FFD166"/>' +
    '<line x1="50" y1="27" x2="50" y2="13" stroke="#33405F" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="50" cy="10" r="6" fill="#FFD166"/>' +
    '<ellipse cx="18" cy="70" rx="8" ry="14" fill="#FF8F87" transform="rotate(-15 18 70)"/>' +
    '<g class="mascot-arm"><ellipse cx="82" cy="64" rx="8" ry="15" fill="#FF8F87"/></g>' +
    '<circle cx="37" cy="55" r="10" fill="#fff"/>' +
    '<circle cx="63" cy="55" r="10" fill="#fff"/>' +
    '<circle cx="39" cy="57" r="4" fill="#33405F"/>' +
    '<circle cx="65" cy="57" r="4" fill="#33405F"/>' +
    '<circle cx="40.5" cy="55.5" r="1.4" fill="#fff"/>' +
    '<circle cx="66.5" cy="55.5" r="1.4" fill="#fff"/>' +
    '<circle cx="26" cy="66" r="6" fill="#FFD166" opacity=".55"/>' +
    '<circle cx="74" cy="66" r="6" fill="#FFD166" opacity=".55"/>' +
    '<path d="M40 72 Q50 82 60 72" stroke="#33405F" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="38" cy="108" rx="9" ry="7" fill="#33405F"/>' +
    '<ellipse cx="62" cy="108" rx="9" ry="7" fill="#33405F"/>' +
    '</svg>';

  var MASCOT_TIPS = [
    "Astuce : les chaussettes sont obligatoires dans les structures de jeux — les tiennes peuvent être aussi rigolotes que moi ! 🧦",
    "Le saviez-vous ? Urba Byrinthe fête sa 9ᵉ enquête, imaginée avec Christine Pompéï ! 🌽",
    "N'oublie pas ton goûter avant de jouer, l'énergie ça se prépare ! 🍏",
    "Astuce : réserve tes billets en ligne, c'est toujours moins cher qu'au guichet ! 🎟️",
    "Le parc est ouvert 7j/7 (sauf le 25 décembre) — même les jours de pluie ! ☔",
    "Un anniversaire à organiser ? Va voir la page Anniversaires, je t'attends là-bas ! 🎂",
    "Un parking gratuit t'attend juste devant le parc. 🚗",
    "Les vacances arrivent ? La garderie m'accueille dès 5 ans ! 🧸",
  ];

  function initMascot() {
    if (document.getElementById('mascotWidget') || !document.body) return;
    var wrap = document.createElement('div');
    wrap.className = 'mascot-widget';
    wrap.id = 'mascotWidget';
    wrap.innerHTML =
      '<div class="mascot-bubble" id="mascotBubble" role="status" aria-live="polite">' +
      '<button type="button" class="mascot-close" aria-label="Fermer la bulle">&times;</button>' +
      '<p id="mascotBubbleText"></p></div>' +
      '<button type="button" class="mascot-btn" id="mascotBtn" aria-label="Astuce d\'Urbo, la mascotte Urba Kids">' +
      MASCOT_SVG +
      '</button>';
    document.body.appendChild(wrap);

    var bubble = document.getElementById('mascotBubble');
    var bubbleText = document.getElementById('mascotBubbleText');
    var btn = document.getElementById('mascotBtn');

    function showTip() {
      bubbleText.textContent = MASCOT_TIPS[Math.floor(Math.random() * MASCOT_TIPS.length)];
      bubble.classList.add('show');
    }
    btn.addEventListener('click', function () {
      if (bubble.classList.contains('show')) bubble.classList.remove('show');
      else showTip();
    });
    bubble.querySelector('.mascot-close').addEventListener('click', function (e) {
      e.stopPropagation();
      bubble.classList.remove('show');
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) bubble.classList.remove('show');
    });
  }
  window.URBA_KIDS.initMascot = initMascot;

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
      } else {
        if (stored === 'accepted') loadAnalytics();
        initMascot(); // pas de bandeau à l'écran : Urbo peut s'installer tout de suite
      }
      var setConsent = function (value) {
        try { localStorage.setItem(CONSENT_KEY, value); } catch (err) { /* ignore */ }
        banner.classList.remove('show');
        if (value === 'accepted') loadAnalytics();
        initMascot(); // bandeau fermé : la place est libre en bas de l'écran
      };
      var acceptBtn = banner.querySelector('[data-cookie-accept]');
      var declineBtn = banner.querySelector('[data-cookie-decline]');
      if (acceptBtn) acceptBtn.addEventListener('click', function () { setConsent('accepted'); });
      if (declineBtn) declineBtn.addEventListener('click', function () { setConsent('declined'); });
    } else {
      initMascot();
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
