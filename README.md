# Pizzeria Marsiglia — Site vitrine & réservation

Site vitrine dynamique pour une pizzeria (pizzas napolitaines & spécialités
siciliennes), avec un système de réservation en ligne.

Construit avec **React + TypeScript + Vite** et **Tailwind CSS v4**.

## Fonctionnalités

- Page unique avec sections : accueil, histoire, menu, réservation, contact
- Menu filtrable par catégorie (pizzas, spécialités siciliennes, salades, desserts, boissons)
- Système de réservation :
  - créneaux horaires générés dynamiquement selon les horaires d'ouverture réels
  - validation complète du formulaire (email, téléphone, date, nombre de personnes)
  - blocage des jours fermés et des créneaux passés
  - confirmation avec numéro de référence, persistée en `localStorage`
- Carte interactive (Google Maps) et coordonnées de contact
- Animations au scroll, header dynamique, design responsive (mobile → desktop)

## Démarrer en local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Personnaliser

- `src/data/business.ts` — coordonnées, horaires d'ouverture, réseaux sociaux
- `src/data/menu.ts` — carte des menus et prix
- `src/index.css` — palette de couleurs et polices (thème Tailwind)

> Les informations (adresse, téléphone, horaires) sont basées sur la
> Pizzeria Marsiglia à Orbe (VD). Le menu détaillé et les horaires complets
> n'ayant pas pu être récupérés automatiquement, ils sont reconstitués de
> façon réaliste — à vérifier et ajuster avant mise en production.
