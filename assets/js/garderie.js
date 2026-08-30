/*!
 * Urba Kids — réservation "Garderie vacances" (garderie.html).
 * Grille de jours limitée aux vraies dates de vacances scolaires du canton
 * de Vaud (hors vacances de Noël, comme annoncé sur la page d'accueil),
 * formulaire famille/enfant, puis paiement simulé (TWINT / carte / PostFinance).
 */
(function () {
  'use strict';

  var PRICE_PER_DAY = 49;

  /* Périodes officielles de vacances scolaires vaudoises (DGEO / État de Vaud)
   * couvrant l'horizon de réservation actuel. La garderie n'est pas proposée
   * pendant les vacances de Noël (cf. texte de présentation de l'activité).
   * À reconduire chaque année scolaire avec le calendrier vd.ch à jour. */
  var PERIODS = [
    { id: 'automne-2026', label: "Vacances d'automne 2026", start: '2026-10-10', end: '2026-10-25' },
    { id: 'relache-2027', label: 'Relâche de février 2027', start: '2027-02-06', end: '2027-02-14' },
    { id: 'paques-2027', label: 'Vacances de Pâques 2027', start: '2027-03-26', end: '2027-04-11' },
  ];

  var DAY_LABELS_SHORT = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  var MONTH_LABELS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  function pad(n) { return String(n).padStart(2, '0'); }
  function toIso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromIso(iso) {
    var parts = iso.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  function formatShort(iso) {
    var d = fromIso(iso);
    return DAY_LABELS_SHORT[d.getDay()] + ' ' + d.getDate() + ' ' + MONTH_LABELS[d.getMonth()];
  }

  /* Renvoie les jours ouvrés (lundi-vendredi) d'une période, y compris les
   * bornes de début/fin si elles tombent un jour de semaine. */
  function weekdaysInPeriod(period) {
    var days = [];
    var cur = fromIso(period.start);
    var end = fromIso(period.end);
    while (cur <= end) {
      var dow = cur.getDay();
      if (dow !== 0 && dow !== 6) days.push(toIso(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }

  var state = { selectedDays: new Set() };

  function el(id) { return document.getElementById(id); }

  function buildDayGrid() {
    var container = el('dayGrid');
    if (!container) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var html = '';
    PERIODS.forEach(function (period) {
      var days = weekdaysInPeriod(period).filter(function (iso) { return fromIso(iso) >= today; });
      if (!days.length) return;
      html += '<div class="day-period"><h4>' + period.label + '</h4><div class="day-pills">';
      days.forEach(function (iso) {
        html += '<button type="button" class="day-pill" data-day="' + iso + '" aria-pressed="false">' + formatShort(iso) + '</button>';
      });
      html += '</div></div>';
    });
    if (!html) {
      html = '<p class="field-hint">Aucune date de vacances scolaires n\'est encore ouverte à la réservation. Revenez bientôt !</p>';
    }
    container.innerHTML = html;
    container.querySelectorAll('.day-pill').forEach(function (btn) {
      btn.addEventListener('click', function () { toggleDay(btn.dataset.day, btn); });
    });
  }

  function toggleDay(iso, btn) {
    if (state.selectedDays.has(iso)) {
      state.selectedDays.delete(iso);
      btn.classList.remove('selected');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      state.selectedDays.add(iso);
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
    }
    renderRecap();
    validateForm();
  }

  function sortedDays() {
    return Array.from(state.selectedDays).sort();
  }

  function renderRecap() {
    var linesEl = el('cartLines');
    var totalEl = el('cartTotal');
    if (!linesEl || !totalEl) return;
    var days = sortedDays();
    if (!days.length) {
      linesEl.innerHTML = '<div class="cart-empty">Aucun jour sélectionné pour le moment.</div>';
    } else {
      linesEl.innerHTML = days.map(function (iso) {
        return '<div class="cart-line"><span>' + formatShort(iso) + '</span><span>CHF ' + PRICE_PER_DAY + '.-</span></div>';
      }).join('');
    }
    totalEl.textContent = 'CHF ' + (days.length * PRICE_PER_DAY) + '.-';
  }

  function validateForm() {
    var familyName = el('familyName').value.trim();
    var childFirstName = el('childFirstName').value.trim();
    var age = el('childAge').value;
    var phone = el('emergencyPhone').value.trim();
    var pickupTime = el('pickupTime').value;
    var ok = familyName && childFirstName && age && Number(age) >= 5 && Number(age) <= 12
      && phone.length >= 9 && pickupTime && state.selectedDays.size > 0;
    el('checkoutBtn').disabled = !ok;
    return ok;
  }

  function showCheckoutStep(id) {
    document.querySelectorAll('.checkout-step').forEach(function (s) { s.classList.remove('active'); });
    el(id).classList.add('active');
  }

  function renderCheckoutRecap() {
    var days = sortedDays();
    var total = days.length * PRICE_PER_DAY;
    el('checkoutLines').innerHTML =
      '<div class="checkout-line"><span>Enfant<br><small>' + escapeHtml(el('childFirstName').value.trim()) + ' ' + escapeHtml(el('familyName').value.trim()) + ', ' + escapeHtml(el('childAge').value) + ' ans</small></span><span></span></div>' +
      days.map(function (iso) {
        return '<div class="checkout-line"><span>' + formatShort(iso) + '</span><span>CHF ' + PRICE_PER_DAY + '.-</span></div>';
      }).join('');
    el('checkoutSavings').innerHTML = 'Départ prévu à ' + escapeHtml(el('pickupTime').value) + ' — contact d\'urgence : ' + escapeHtml(el('emergencyPhone').value.trim());
    ['checkoutTotal', 'checkoutTotal2', 'checkoutTotal3'].forEach(function (id) {
      var target = el(id);
      if (target) target.textContent = 'CHF ' + total + '.-';
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function openCheckout() {
    if (!validateForm()) return;
    renderCheckoutRecap();
    document.querySelectorAll('.pay-method').forEach(function (p) { p.classList.remove('selected'); p.setAttribute('aria-pressed', 'false'); });
    el('payBtn').disabled = true;
    el('checkoutModal').classList.add('open');
    el('checkoutModal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    showCheckoutStep('checkoutStepRecap');
  }
  window.openCheckout = openCheckout;

  function closeCheckout() {
    var modal = el('checkoutModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  window.closeCheckout = closeCheckout;

  window.goToPayment = function () { showCheckoutStep('checkoutStepPayment'); };
  window.backToRecap = function () { showCheckoutStep('checkoutStepRecap'); };

  window.selectPayMethod = function (method) {
    document.querySelectorAll('.pay-method').forEach(function (p) {
      var isSel = p.dataset.method === method;
      p.classList.toggle('selected', isSel);
      p.setAttribute('aria-pressed', String(isSel));
    });
    el('payBtn').disabled = false;
  };

  window.processPayment = function () {
    showCheckoutStep('checkoutStepProcessing');
    setTimeout(function () { showCheckoutStep('checkoutStepSuccess'); }, 1400);
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (!el('dayGrid')) return; // pas sur la page garderie
    buildDayGrid();
    renderRecap();

    ['familyName', 'childFirstName', 'childAge', 'emergencyPhone', 'pickupTime'].forEach(function (id) {
      el(id).addEventListener('input', validateForm);
      el(id).addEventListener('change', validateForm);
    });

    document.querySelectorAll('[data-checkout-open]').forEach(function (b) { b.addEventListener('click', openCheckout); });
    document.querySelectorAll('[data-checkout-close]').forEach(function (b) { b.addEventListener('click', closeCheckout); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCheckout(); });
  });
})();
