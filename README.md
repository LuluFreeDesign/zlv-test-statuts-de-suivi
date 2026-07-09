# ZLV — Environnement de test de fonctionnalité

Réplique **iso** de l'interface de [Zéro Logement Vacant](https://zerologementvacant.beta.gouv.fr),
qui tourne **sans backend ni base de données**, avec de **fausses données** réalistes, pour faire
tester de nouvelles fonctionnalités à des usagers.

> ⚠️ Ce dépôt est un **snapshot jetable** du frontend ZLV, pris sur le **`main` courant** de
> `zero-logement-vacant` (allégé : `frontend/` + 5 packages internes). Ce n'est pas le dépôt de
> production. C'est une base **iso-ZLV vierge**, prête pour la fonctionnalité à tester (autour des
> **statuts de suivi**).

## Comment ça marche

- Le frontend ZLV passe par **RTK Query** pour tous ses appels API.
- En **mode démo** (`VITE_DEMO_MODE=true`), on démarre **Mock Service Worker (MSW)** dans le
  navigateur : il intercepte tous les appels réseau et répond avec un jeu de fausses données injecté
  au démarrage. Aucun serveur n'est nécessaire.
- L'infrastructure de mock (`frontend/src/mocks/handlers/`) est celle **déjà présente dans ZLV** pour
  les tests : on la réutilise telle quelle, on l'active juste côté navigateur.

### Pièces ajoutées pour la démo (tout est isolé, donc facile à resynchroniser avec `main`)

| Fichier | Rôle |
|---|---|
| `frontend/src/mocks/seed.ts` | Injecte un graphe cohérent de fausses données : **CA du Pays Basque** (SIREN 200067106), logements répartis sur les communes de l'EPCI (pondérés par la population → Bayonne en concentre le plus, coordonnées réelles pour la carte), majorité vacants (LOVAC), minorité en location (fichiers fonciers), propriétaires, groupes, campagne, notes. Seed faker **déterministe** → données reproductibles. |
| `frontend/src/mocks/browser.ts` | Démarre MSW en mode navigateur (`setupWorker`). |
| `frontend/src/mocks/demo-handlers.ts` | Override du login : **n'importe quel identifiant** fonctionne, renvoie un vrai JWT. |
| `frontend/src/mocks/start.ts` | Orchestration : seed → **auto-login** (écrit `authUser` dans le localStorage) → démarre le worker. |
| `frontend/src/mocks/shims/` | Shims navigateur pour `node:http2` et `jsonwebtoken` (utilisés par les handlers, non bundlables sinon). |
| `frontend/src/render-app.tsx` | Arbre de rendu React (sorti de `index.tsx`). |
| `frontend/src/index.tsx` | Bootstrap : en mode démo, attend le seed + le worker **avant** d'importer le store et de rendre. |
| `frontend/public/mockServiceWorker.js` | Le service worker MSW (généré par `msw init`). |

Hors mode démo, tous les `./mocks/*` sont importés dynamiquement → **code-splittés hors du bundle**
de production normal.

## Lancer en local

Pré-requis : Node 24, Yarn 4 (via corepack).

```bash
corepack enable
yarn install
yarn dsfr            # copie les assets DSFR dans public/ (sinon page non stylée)
yarn build:packages  # build des 5 packages internes
yarn dev:demo        # démarre Vite (http://localhost:3002)
```

Les testeurs arrivent **directement** dans l'application (auto-login), sur le parc de logements.

## Déploiement (GitHub Pages)

Un workflow (`.github/workflows/deploy-pages.yml`) build et déploie automatiquement à chaque push
sur `main`.

1. Dans **Settings → Pages** du dépôt GitHub, choisir **Source : GitHub Actions**.
2. Pousser sur `main`.
3. Le site est servi sous `https://lulufreedesign.github.io/zlv-test-statuts-de-suivi/`.

Le base path (`/zlv-test-statuts-de-suivi/`) est géré via `VITE_BASE_PATH` (routeur + assets + scope du
service worker).

## Fonctionnalité à tester

Aucune fonctionnalité prototype n'est encore branchée : le dépôt est une **base iso-ZLV vierge**
(snapshot du `main`). L'objectif est de prototyper autour des **statuts de suivi** des logements
(périmètre à préciser).

Pour brancher la fonctionnalité :

1. Développer la vue/le composant dans `frontend/src/`.
2. Si besoin de nouvelles données, les ajouter dans `frontend/src/mocks/seed.ts` (et un handler dans
   `frontend/src/mocks/handlers/` si un nouvel endpoint est appelé).
3. (Optionnel) mettre la feature derrière un flag — l'ajouter au type `AvailableFeatureFlag`
   (`frontend/src/layouts/FeatureFlagLayout.tsx`), l'activer dans `frontend/.env` :
   ```
   VITE_FEATURE_FLAGS=mon-nouveau-flag
   ```
   puis conditionner la route/le composant (`FeatureFlagLayout flag="mon-nouveau-flag" ...`).

## Identifiants de démo

- Auto-login activé : pas besoin de se connecter.
- Si déconnexion : l'écran de login accepte **n'importe quel email + mot de passe**.
- Compte de démo : `demo@zerologementvacant.beta.gouv.fr`.
