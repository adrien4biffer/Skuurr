/*!
 * Urba Kids — assistant de réservation d'anniversaire (anniversaire.html).
 */
(function () {
  'use strict';

  var state = {
    step: 1,
    maxStepReached: 1,
    date: '', slot: '', spot: '',
    childName: '', address: '', parentEmail: '', nbChildren: 0, nbAdults: 0, table: '',
    supp: { gateau: 0, bonbons: 0, pinata: 0, fondue: 0 },
  };
  var suppPrices = { gateau: 45, bonbons: 35, pinata: 25, fondue: 6 };
  var suppLabels = { gateau: "Gâteau d'anniversaire", bonbons: 'Buffet de bonbons', pinata: 'Pinata', fondue: 'Fondue au chocolat' };
  var stepLabels = { 1: 'Créneau', 2: 'Informations', 3: 'Suppléments', 4: 'Récapitulatif' };
  var slotLabelMap = { matin: 'Matin — 9h00 à 13h00', aprem: 'Après-midi — 14h00 à 18h00' };
  var spotLabelMap = { haut1: 'Emplacement Haut 1', haut2: 'Emplacement Haut 2', haut3: 'Emplacement Haut 3', bas: 'Emplacement Bas (grande table)' };
  var tableLabelMap = { neutre: 'Table neutre', preparee: 'Table préparée (déco incluse)' };

  function el(id) { return document.getElementById(id); }

  function toggleMenu() { el('stepMenu').classList.toggle('open'); }
  window.toggleMenu = toggleMenu;

  function tryGoTo(n) {
    if (n <= state.maxStepReached) goTo(n);
    el('stepMenu').classList.remove('open');
  }
  window.tryGoTo = tryGoTo;

  function goTo(n) {
    document.querySelectorAll('.step-panel').forEach(function (p) { p.classList.remove('active'); });
    el('panel-' + n).classList.add('active');
    state.step = n;
    state.maxStepReached = Math.max(state.maxStepReached, n);
    el('curStepNum').textContent = n;
    el('curStepLabel').textContent = stepLabels[n];
    var fill = el('progressFill');
    if (fill) {
      fill.style.width = (n / 4 * 100) + '%';
      var bar = fill.parentElement;
      if (bar) bar.setAttribute('aria-valuenow', String(Math.round(n / 4 * 100)));
    }
    document.querySelectorAll('.step-menu-item').forEach(function (item) {
      var s = parseInt(item.dataset.step, 10);
      item.classList.toggle('active', s === n);
      item.classList.toggle('done', s < state.maxStepReached || s < n);
      item.classList.toggle('disabled', s > state.maxStepReached);
    });
    if (n === 4) renderRecap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.goTo = goTo;

  function selectSlot(slot) {
    state.slot = slot;
    document.querySelectorAll('.choice-card').forEach(function (c) { c.classList.toggle('selected', c.dataset.slot === slot); });
    validateStep1();
  }
  window.selectSlot = selectSlot;

  function selectSpot(spot) {
    state.spot = spot;
    document.querySelectorAll('.spot').forEach(function (c) { c.classList.toggle('selected', c.dataset.spot === spot); });
    validateStep1();
  }
  window.selectSpot = selectSpot;

  function validateStep1() {
    var dateInput = el('partyDate');
    state.date = dateInput.value;
    var warning = el('dateWarning');
    var closed = state.date && window.URBA_KIDS && window.URBA_KIDS.todaysPeriods(new Date(state.date + 'T12:00:00')).length === 0;
    if (warning) warning.classList.toggle('show', !!closed);
    el('next1').disabled = !(state.date && state.slot && state.spot) || closed;
  }
  window.validateStep1 = validateStep1;

  function selectTable(t) {
    state.table = t;
    document.querySelectorAll('.radio-pill').forEach(function (p) { p.classList.toggle('selected', p.dataset.table === t); });
    validateStep2();
  }
  window.selectTable = selectTable;

  function validateStep2() {
    state.childName = el('childName').value.trim();
    state.address = el('address').value.trim();
    state.parentEmail = el('parentEmail').value.trim();
    state.nbChildren = el('nbChildren').value;
    state.nbAdults = el('nbAdults').value;
    var emailOk = /\S+@\S+\.\S+/.test(state.parentEmail);
    el('next2').disabled = !(state.childName && state.address && emailOk && state.table);
  }

  function changeSupp(item, delta) {
    state.supp[item] = Math.max(0, state.supp[item] + delta);
    el('qty-' + item).textContent = state.supp[item];
  }
  window.changeSupp = changeSupp;

  function renderRecap() {
    var suppTotal = 0;
    var suppLines = '';
    Object.keys(state.supp).forEach(function (item) {
      if (state.supp[item] > 0) {
        var qty = item === 'fondue' ? (parseInt(state.nbChildren, 10) || 0) * state.supp[item] : state.supp[item];
        var lineTotal = qty * suppPrices[item];
        suppTotal += lineTotal;
        var qtyLabel = item === 'fondue'
          ? state.supp[item] + ' portion(s) × ' + (state.nbChildren || 0) + ' enfant(s)'
          : state.supp[item] + ' ×';
        suppLines += '<div class="recap-line"><span>' + suppLabels[item] + ' (' + qtyLabel + ')</span><span>CHF ' + lineTotal + '.-</span></div>';
      }
    });
    if (!suppLines) suppLines = '<div class="recap-line"><span>Aucun supplément sélectionné</span><span>—</span></div>';

    el('recapCard').innerHTML =
      '<div class="recap-line"><span>Date</span><span>' + (state.date || '—') + '</span></div>' +
      '<div class="recap-line"><span>Horaire</span><span>' + (slotLabelMap[state.slot] || '—') + '</span></div>' +
      '<div class="recap-line"><span>Emplacement</span><span>' + (spotLabelMap[state.spot] || '—') + '</span></div>' +
      '<div class="recap-line"><span>Enfant</span><span>' + escapeHtml(state.childName || '—') + '</span></div>' +
      '<div class="recap-line"><span>Adresse</span><span>' + escapeHtml(state.address || '—') + '</span></div>' +
      '<div class="recap-line"><span>E-mail parent</span><span>' + escapeHtml(state.parentEmail || '—') + '</span></div>' +
      '<div class="recap-line"><span>Enfants invités</span><span>' + (state.nbChildren || 0) + '</span></div>' +
      '<div class="recap-line"><span>Adultes invités</span><span>' + (state.nbAdults || 0) + '</span></div>' +
      '<div class="recap-line"><span>Table</span><span>' + (tableLabelMap[state.table] || '—') + '</span></div>' +
      suppLines +
      '<div class="recap-total"><span>Total suppléments</span><span class="amount">CHF ' + suppTotal + '.-</span></div>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function submitReservation() {
    document.querySelector('#panel-4 .b-card').style.display = 'none';
    document.querySelector('#panel-4 .nav-buttons').style.display = 'none';
    el('successBox').style.display = 'block';
    el('successBox').setAttribute('tabindex', '-1');
    el('successBox').focus();
  }
  window.submitReservation = submitReservation;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var partyDate = el('partyDate');
    if (!partyDate) return; // pas sur la page anniversaire
    if (window.URBA_KIDS) partyDate.min = window.URBA_KIDS.isoDate(new Date());
    partyDate.addEventListener('change', validateStep1);

    document.querySelector('.step-menu-wrap').addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { el('stepMenu').classList.remove('open'); });

    ['childName', 'address', 'parentEmail', 'nbChildren', 'nbAdults'].forEach(function (id) {
      el(id).addEventListener('input', validateStep2);
    });
  });
})();
