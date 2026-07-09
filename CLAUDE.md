# CLAUDE.md — ZLV prototype d'environnement de test

Guide pour Claude (et l'équipe) quand on reprend ce dépôt.

## C'est quoi ce dépôt

Réplique **allégée et jetable** du frontend de [Zéro Logement Vacant](https://zerologementvacant.beta.gouv.fr),
qui tourne **sans backend** (toute l'API est mockée par **MSW** côté navigateur, avec de fausses
données) pour faire **tester de nouvelles fonctionnalités à des usagers**.

- **Base = le `main` courant de `zero-logement-vacant`** : le `frontend/` est un snapshot fidèle du
  frontend de prod ; on y ajoute uniquement une **couche démo** isolée (MSW + seed + auto-login).
- Mini-monorepo Yarn 4 + Nx : `frontend/` + 5 packages internes (`models`, `schemas`, `utils`,
  `pdf`, `factories`). `server/`, `apps/`, `analytics/` ont été retirés.
- Stack : React 18, Vite 8, TypeScript, DSFR (`@codegouvfr/react-dsfr`) + MUI/Emotion, RTK Query.
- Déployé en statique sur **GitHub Pages** : https://lulufreedesign.github.io/zlv-test-statuts-de-suivi/

> Ce n'est **pas** le dépôt de production ZLV. C'est un snapshot du frontend `main` + une couche démo.
> C'est une base **iso-ZLV vierge**, prête à accueillir la fonctionnalité à tester.

## Lancer en local

Node 24 + Yarn 4 (corepack). Le frontend tourne sur **http://localhost:3002**.

```bash
corepack enable
yarn install
yarn dsfr             # copie les assets DSFR dans public/ (sinon page non stylée)
yarn build:packages   # build des 5 packages internes
yarn dev:demo         # démarre Vite (port 3002)
```

Auto-login : les testeurs arrivent directement dans l'app. Compte démo
`demo@zerologementvacant.beta.gouv.fr` (le login accepte n'importe quel identifiant).

## Build / test / déploiement

```bash
yarn nx build frontend --skip-nx-cache   # build prod (rebuild les packages d'abord)
yarn nx test frontend --skip-nx-cache    # suite Vitest (MSW en mode node)
```

Le push sur `main` déclenche le workflow `.github/workflows/deploy-pages.yml` (build + deploy Pages).
Le workflow passe `VITE_BASE_PATH=/zlv-test-statuts-de-suivi/`.

## Architecture du mode démo (le cœur)

C'est la **seule** couche ajoutée par-dessus le frontend ZLV. Tout est isolé → facile à resynchroniser
avec `main`.

- Flag `VITE_DEMO_MODE=true` (dans `frontend/.env`, committé) → `frontend/src/index.tsx` démarre MSW,
  seed les données et fait l'auto-login **avant** d'importer le store et de rendre (`render-app.tsx`).
- `frontend/src/mocks/` :
  - `handlers/`, `mock-api.ts`, `handlers/data.ts` — **infra de mock native de ZLV** (celle des tests),
    réutilisée telle quelle.
  - `browser.ts` — `setupWorker(...demoHandlers, ...handlers)` (MSW navigateur).
  - `demo-handlers.ts` — override du login : **n'importe quel identifiant** marche, renvoie un vrai JWT.
  - `start.ts` — seed → écrit `authUser` (localStorage) → `worker.start()`.
  - `seed.ts` — jeu de fausses données **déterministe** (faker seedé). Établissement = **CA du Pays
    Basque** (SIREN 200067106) ; logements répartis sur les communes de l'EPCI (pondérés par la
    population → Bayonne en concentre le plus, coordonnées réelles pour la carte), majorité de
    logements **vacants** (LOVAC), minorité **en location** (fichiers fonciers), propriétaires,
    groupes, campagne, notes.
  - `shims/` — shims navigateur pour `node:http2` et `jsonwebtoken` (aliasés en non-test dans `vite.config.mts`).
- **API same-origin** : `config.apiEndpoint` = `resolveApiEndpoint(...)` → `window.location.origin +
  BASE_URL + 'api'` (voir `frontend/src/utils/config.ts`). **Indispensable** : sinon les mutations
  (PUT/POST) déclenchent un preflight CORS que le service worker laisse filer → échec.

## La fonctionnalité à tester (à définir)

Le dépôt est une **base iso-ZLV vierge** : aucune fonctionnalité prototype n'est encore branchée.
L'objectif annoncé est de prototyper autour des **statuts de suivi** des logements (périmètre exact
à préciser).

Pour brancher une fonctionnalité à tester :

1. Développer la vue / le composant dans `frontend/src/`.
2. Si besoin de nouvelles données : les ajouter dans `frontend/src/mocks/seed.ts` (et un handler
   dans `frontend/src/mocks/handlers/` si un nouvel endpoint est appelé).
3. (Optionnel) mettre la feature derrière un flag : l'ajouter au type `AvailableFeatureFlag`
   (`frontend/src/layouts/FeatureFlagLayout.tsx`), l'activer via `VITE_FEATURE_FLAGS=mon-flag`
   (`frontend/.env`), et conditionner la route/le composant avec `<FeatureFlagLayout flag="mon-flag" .../>`.

## Conventions

- DSFR d'abord, MUI pour le layout, Emotion `styled()` pour le custom. Jamais de hex en dur (tokens
  `fr.colors.*` ou variables CSS DSFR). Apostrophe française `’` dans les textes.
- RTK Query pour le serveur, Redux pour l'UI globale.
- **Tests** : la suite héritée de ZLV sert de filet anti-régression quand on touche un composant
  **partagé** ; pas de TDD cérémonieux sur les features jetables du proto (validation = test navigateur).

## Pièges (⚠️)

- **`lodash-es`** est une dépendance fantôme (importée par `theme.tsx`, fournie par `server/` dans le
  monorepo complet) : elle est déclarée explicitement dans `frontend/package.json` ici.
- **Après toute modif dans un package (`models`/`schemas`/`utils`/`pdf`/`factories`)** : `yarn nx build
  <package> --skip-nx-cache` puis **redémarrer Vite** (le frontend lit le `dist/lib`).
- **`public/dsfr/`** est gitignored → relancer `yarn dsfr` après un `yarn install` propre.
- L'API doit rester **same-origin** (voir ci-dessus).
- Détails et décisions : voir [MEMORY.md](MEMORY.md).
