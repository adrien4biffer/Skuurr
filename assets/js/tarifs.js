/*!
 * Urba Kids — logique panier & billetterie (page tarifs.html).
 * Persistance du panier en localStorage, validation de la date de visite,
 * simulation d'un tunnel de paiement (TWINT / carte / PostFinance).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'uk_cart_v1';
  var prices = { entree: 11, abo10: 110, labyrinthe: 6, combi: 13 };
  var onsitePrices = { entree: 14, abo10: 120, labyrinthe: 8, combi: 16 };
  var labels = {
    entree: 'Entrée Urba Kids (2–12 ans)',
    abo10: 'Abonnement 10 entrées',
    labyrinthe: 'Urba Byrinthe',
    combi: 'Combi Urba Kids + Byrinthe',
  };
  var cart = { entree: 0, abo10: 0, labyrinthe: 0, combi: 0 };
  var selectedPayMethod = null;

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      Object.keys(cart).forEach(function (k) {
        if (typeof parsed[k] === 'number' && parsed[k] >= 0) cart[k] = parsed[k];
      });
    } catch (err) { /* localStorage indisponible ou corrompu : on repart d'un panier vide */ }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (err) { /* ignore */ }
  }

  function cartHasItems() {
    return Object.keys(cart).some(function (k) { return cart[k] > 0; });
  }

  function cartTotals() {
    var total = 0, savings = 0;
    Object.keys(cart).forEach(function (item) {
      if (cart[item] > 0) {
        total += cart[item] * prices[item];
        savings += cart[item] * (onsitePrices[item] - prices[item]);
      }
    });
    return { total: total, savings: savings };
  }

  function el(id) { return document.getElementById(id); }

  function renderCart() {
    var linesEl = el('cartLines');
    if (!linesEl) return;
    var totalEl = el('cartTotal');
    var banner = el('savingsBanner');
    var savingsAmount = el('savingsAmount');
    var checkoutBtn = el('checkoutBtn');
    var html = '';
    Object.keys(cart).forEach(function (item) {
      var qtyEl = el('qty-' + item);
      if (qtyEl) qtyEl.textContent = cart[item];
      var minusBtn = document.querySelector('.qty-control[data-item="' + item + '"] button:first-child');
      if (minusBtn) minusBtn.disabled = cart[item] <= 0;
      if (cart[item] > 0) {
        var lineTotal = cart[item] * prices[item];
        html += '<div class="cart-line"><span>' + cart[item] + ' × ' + labels[item] + '</span><span>CHF ' + lineTotal + '.-</span></div>';
      }
    });
    var hasItems = cartHasItems();
    var totals = cartTotals();
    linesEl.innerHTML = hasItems ? html : '<div class="cart-empty">Aucun billet sélectionné pour le moment.</div>';
    if (totalEl) totalEl.textContent = 'CHF ' + totals.total + '.-';
    if (banner && savingsAmount) {
      if (totals.savings > 0) {
        banner.style.display = 'block';
        savingsAmount.textContent = 'CHF ' + totals.savings + '.-';
      } else {
        banner.style.display = 'none';
      }
    }
    if (checkoutBtn) checkoutBtn.disabled = !hasItems;
    saveCart();
  }

  function changeQty(item, delta) {
    cart[item] = Math.max(0, cart[item] + delta);
    renderCart();
  }
  window.changeQty = changeQty;

  function showCheckoutStep(id) {
    document.querySelectorAll('.checkout-step').forEach(function (s) { s.classList.remove('active'); });
    el(id).classList.add('active');
  }

  function renderCheckoutRecap() {
    var totals = cartTotals();
    var html = '';
    Object.keys(cart).forEach(function (item) {
      if (cart[item] > 0) {
        var lineTotal = cart[item] * prices[item];
        var onsiteLine = cart[item] * onsitePrices[item];
        html += '<div class="checkout-line"><span>' + cart[item] + ' × ' + labels[item] + '<br><small>au lieu de CHF ' + onsiteLine + '.- sur place</small></span><span>CHF ' + lineTotal + '.-</span></div>';
      }
    });
    el('checkoutLines').innerHTML = html;
    el('checkoutSavings').innerHTML = totals.savings > 0
      ? '🎉 En achetant en ligne aujourd\'hui, vous économisez <strong>CHF ' + totals.savings + '.-</strong> par rapport au tarif sur place.'
      : '';
    ['checkoutTotal', 'checkoutTotal2', 'checkoutTotal3'].forEach(function (id) {
      var target = el(id);
      if (target) target.textContent = 'CHF ' + totals.total + '.-';
    });
  }

  function openCheckout() {
    var dateInput = el('visitDate');
    var error = el('visitDateError');
    var date = dateInput.value;
    if (!date) {
      if (error) error.classList.add('show');
      dateInput.focus();
      return;
    }
    if (error) error.classList.remove('show');
    renderCheckoutRecap();
    selectedPayMethod = null;
    document.querySelectorAll('.pay-method').forEach(function (p) { p.classList.remove('selected'); });
    var payBtn = el('payBtn');
    if (payBtn) payBtn.disabled = true;
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
    selectedPayMethod = method;
    document.querySelectorAll('.pay-method').forEach(function (p) {
      var isSel = p.dataset.method === method;
      p.classList.toggle('selected', isSel);
      p.setAttribute('aria-pressed', String(isSel));
    });
    el('payBtn').disabled = false;
  };

  window.processPayment = function () {
    showCheckoutStep('checkoutStepProcessing');
    // Simulation de paiement (démo) — à remplacer par un vrai PSP suisse
    // (Datatrans, Wallee, Stripe...) prenant en charge TWINT/carte/PostFinance.
    setTimeout(function () {
      showCheckoutStep('checkoutStepSuccess');
      cart = { entree: 0, abo10: 0, labyrinthe: 0, combi: 0 };
      renderCart();
    }, 1400);
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (!el('cartLines')) return; // pas sur la page tarifs
    loadCart();
    renderCart();

    document.querySelectorAll('.qty-control').forEach(function (wrap) {
      var item = wrap.dataset.item;
      var buttons = wrap.querySelectorAll('button');
      buttons[0].addEventListener('click', function () { changeQty(item, -1); });
      buttons[1].addEventListener('click', function () { changeQty(item, 1); });
    });

    var visitDate = el('visitDate');
    if (visitDate && window.URBA_KIDS) {
      visitDate.min = window.URBA_KIDS.isoDate(new Date());
      visitDate.addEventListener('change', function () {
        var error = el('visitDateError');
        if (error && visitDate.value) error.classList.remove('show');
      });
    }

    document.querySelectorAll('[data-checkout-open]').forEach(function (b) { b.addEventListener('click', openCheckout); });
    document.querySelectorAll('[data-checkout-close]').forEach(function (b) { b.addEventListener('click', closeCheckout); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCheckout(); });
  });
})();
