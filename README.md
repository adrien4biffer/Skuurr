# Urba Kids — Site vitrine, billetterie & réservation d'anniversaire

Site vitrine dynamique pour **Urba Kids**, centre de jeux couvert (1300 m²)
pour les 0-12 ans à Orbe (VD), avec labyrinthe de maïs saisonnier
« Urba Byrinthe ». Le site inclut une billetterie en ligne avec panier et
tunnel de paiement simulé, ainsi qu'un assistant de réservation
d'anniversaire en 4 étapes.

Construit en **HTML / CSS / JavaScript statique**, sans framework ni étape
de build : chaque page est directement crawlable et rapide à charger, ce qui
est le facteur SEO le plus déterminant pour un commerce local. Toute la
logique interactive (panier, paiement simulé, assistant de réservation,
horaires en direct) tourne côté client en JavaScript natif.

## Structure

```
index.html              Accueil (hero, activités, galerie, avis, horaires, FAQ)
tarifs.html              Billetterie en ligne (panier + tunnel de paiement simulé)
anniversaire.html         Assistant de réservation d'anniversaire (4 étapes)
garderie.html              Réservation de la garderie vacances (jours de vacances scolaires VD)
reglement.html            Règlement du parc
mentions-legales.html     Mentions légales (à valider juridiquement)
confidentialite.html      Politique de confidentialité / cookies (nLPD)
404.html                  Page d'erreur personnalisée
robots.txt / sitemap.xml  Indexation
site.webmanifest          Icône / PWA légère
favicon.svg               Favicon vectoriel

assets/css/base.css        Styles communs à toutes les pages
assets/css/booking.css     Styles spécifiques à l'assistant d'anniversaire
assets/js/site.js          Header, menu, FAQ, reveal, cookies, badge horaires
assets/js/tarifs.js        Panier (persistant), checkout simulé
assets/js/anniversaire.js  Logique de l'assistant de réservation
assets/js/garderie.js      Grille de jours (vacances VD) + paiement de la garderie
```

## Démarrer en local

Aucune installation n'est nécessaire — servez simplement le dossier :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000/index.html
```

## Ce qui a été mis en place pour le SEO

- Balises `<title>` et `<meta description>` uniques et optimisées par page,
  URL canonique, Open Graph et Twitter Card sur chaque page.
- Données structurées JSON-LD : `AmusementPark` (avec géolocalisation,
  horaires, action de réservation), `FAQPage`, `BreadcrumbList` sur les
  pages secondaires, `Product`/`Offer` pour chaque billet, `Service` pour
  la formule anniversaire.
- `robots.txt` + `sitemap.xml` déclarant toutes les pages indexables.
- Un seul `<h1>` par page, hiérarchie de titres cohérente, `alt` sur toutes
  les images, dimensions déclarées pour limiter les décalages de mise en
  page (CLS).
- CSS et JS mutualisés dans `/assets` (mis en cache par le navigateur dès
  la 2ᵉ page visitée) plutôt que dupliqués inline sur chaque page.
- Lien d'évitement (« skip link »), attributs ARIA sur les composants
  interactifs (accordéon FAQ, étapes du menu, méthodes de paiement) :
  l'accessibilité est aussi un signal de qualité pour les moteurs.
- Pages légales (mentions légales, confidentialité) : signal de confiance
  attendu par les moteurs de recherche pour un commerce réel.

## Ce qui rend le site plus « dynamique »

- **Badge horaires en direct** : calcule « Ouvert maintenant » / « Fermé »
  depuis les vraies plages horaires (visible dans le header, la section
  horaires et la barre CTA mobile).
- **Panier persistant** (`localStorage`) sur la billetterie : le visiteur
  ne perd pas sa sélection en rechargeant la page.
- **Validation de dates réelle** : impossible de sélectionner une date
  passée ou un jour de fermeture (25 décembre) sur les formulaires de
  réservation, avec message d'erreur explicite.
- **Compte à rebours saisonnier** pour Urba Byrinthe (nombre de jours
  restants avant la fermeture du labyrinthe).
- **Lightbox galerie**, **CTA sticky mobile**, **bandeau de consentement
  cookies** (charge Google Analytics uniquement après acceptation).
- **Formulaire newsletter** en pied de page (démo, prêt à connecter à un
  outil d'emailing).

## Avant la mise en production

- [ ] Remplacer les données de l'entreprise dans `mentions-legales.html`
      (raison sociale exacte, n° IDE, hébergeur) et faire valider la page
      confidentialité par un conseil juridique.
- [ ] Connecter un vrai prestataire de paiement suisse (Datatrans, Wallee,
      Stripe…) à la place de la simulation dans `assets/js/tarifs.js`.
- [ ] Brancher le widget Google Reviews (API Google Places) à la place des
      avis d'exemple, puis activer le bloc `aggregateRating` commenté dans
      `index.html` avec les vraies valeurs (jamais de note fictive).
- [ ] Renseigner `window.URBA_KIDS_GA_ID` avec un identifiant Google
      Analytics 4 réel pour activer la mesure d'audience.
- [ ] Vérifier les coordonnées GPS exactes du parc dans le JSON-LD
      (`index.html`) via Google Maps.
- [ ] Recopier chaque année le calendrier officiel des vacances scolaires
      vaudoises (vd.ch) dans `PERIODS` (`assets/js/garderie.js`) : les dates
      2026-2027 actuelles proviennent de sources tierces (accès direct à
      vd.ch bloqué depuis cet environnement), à recouper avant mise en ligne.
- [ ] Remplacer/optimiser les images (formats WebP/AVIF, CDN) si elles ne
      sont plus servies depuis `urba-kids.ch`.
