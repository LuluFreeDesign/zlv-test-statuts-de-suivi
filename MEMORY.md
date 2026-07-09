# MEMORY.md — décisions & pièges du proto ZLV

Mémo des décisions structurantes et des pièges rencontrés, pour reprendre vite.
(Guide complet : [CLAUDE.md](CLAUDE.md) · doc utilisateur : [README.md](README.md))

## Décisions structurantes

- **Base = `main` courant de `zero-logement-vacant`** (snapshot du frontend de prod), **pas** un
  ancien fork. On y ajoute uniquement la couche démo. Pour resynchroniser : re-copier `frontend/` +
  packages depuis `main`, puis réappliquer la couche démo (voir liste ci-dessous).
- **Repo allégé** : `frontend/` + `models`/`schemas`/`utils`/`pdf`/`factories` seulement
  (`server/`, `apps/`, `analytics/` retirés ; `workspaces` + `tsconfig.json` ajustés).
- **MSW en mode navigateur** : on réutilise les handlers de test de ZLV (`frontend/src/mocks/handlers/`)
  via `setupWorker`, plus un seed déterministe. Zéro backend.
- **Auto-login** : on écrit un `authUser` valide (JWT signé par un shim) dans le localStorage avant
  l'init du store (`start.ts`).
- **Déploiement** : GitHub Pages, base path `/zlv-test-statuts-de-suivi/`, fallback SPA via `404.html`.
- **Seed** : établissement **CA du Pays Basque** (SIREN 200067106) ; logements répartis sur les
  communes de l'EPCI (pondérés par la population → Bayonne dominant), coordonnées réelles pour la
  carte ; majorité **vacants** (LOVAC), minorité **en location** (fichiers fonciers).
- **Aucun feature flag actif** (`VITE_FEATURE_FLAGS=` vide). Base vierge, feature à définir.

## Couche démo = fichiers ajoutés / modifiés par-dessus `main`

- **Ajoutés** : `frontend/src/render-app.tsx`, `frontend/src/mocks/{browser,demo-handlers,start,seed}.ts`,
  `frontend/src/mocks/shims/{http2,jsonwebtoken}.ts`, `frontend/public/mockServiceWorker.js`,
  `.github/workflows/deploy-pages.yml`, `frontend/.env`.
- **Modifiés** : `frontend/src/index.tsx` (bootstrap démo), `frontend/vite.config.mts` (base + alias
  shims), `frontend/src/utils/config.ts` (`resolveApiEndpoint` same-origin), `frontend/package.json`
  (`lodash-es`, `@types/lodash-es`, `msw.workerDirectory`), racine `package.json` (workspaces + scripts
  démo), `tsconfig.json` (references).

## Pièges résolus (à ne pas refaire)

1. **CORS / mutations qui échouent en prod** — La page et l'API mockée doivent être **same-origin**,
   sinon les PUT/POST déclenchent un preflight CORS que le service worker MSW (en `onUnhandledRequest:
   'bypass'`) laisse filer → `FETCH_ERROR` → toasts d'erreur. Invisible en test (MSW node, pas de SW).
   → `config.apiEndpoint = resolveApiEndpoint(...)` = `window.location.origin + BASE_URL + 'api'`
   (`frontend/src/utils/config.ts`). Ne pas remettre une origine absolue type `http://localhost:3001`.

2. **Modules Node dans les handlers** — `node:http2` (constantes HTTP) et `jsonwebtoken` cassent le
   bundle navigateur → shims dans `frontend/src/mocks/shims/`, aliasés dans `vite.config.mts`
   **uniquement hors test** (`process.env.VITEST !== 'true'`).

3. **Dépendance fantôme `lodash-es`** — importée par `frontend/src/theme.tsx`, fournie par `server/`
   dans le monorepo complet ; à déclarer explicitement dans `frontend/package.json` (sinon build KO).

4. **Rebuild des packages** — Après modif d'un package (`models`/`schemas`/`utils`/`pdf`/`factories`),
   rebuild (`yarn nx build @zerologementvacant/models --skip-nx-cache`) + redémarrer Vite, sinon
   `dist/lib` obsolète → types/exports manquants au runtime.

5. **`EventCard` exhaustif** — `IndividualEventCard`/`AggregatedEventCard` utilisent `ts-pattern
   .exhaustive()` → ajouter un `EventType` (dans `packages/models`) **oblige** à ajouter le case
   correspondant (sinon crash runtime). À garder en tête si la feature « statuts de suivi » ajoute des
   événements d'historique.

## État au moment du bootstrap

- Base créée par copie de `zero-logement-vacant@main` (frontend + 5 packages), trim + couche démo.
- `yarn install` propre OK · `yarn build:packages` OK · rebrand slug + `yarn.lock` réconcilié.
- Pas encore de remote GitHub configuré ni de premier commit (en attente du feu vert utilisateur).

## Pistes / différé

- Le `postbuild` de génération d'images de bâtiments (sharp) n'est pas exécuté (console errors bénins).
- Nettoyage possible des devDeps serveur restants à la racine (clever-tools, husky, knip…) — sans
  impact sur le build.
