# Plateforme technique — maintenance industrielle

Cours animés, suivi des élèves, carnet de cotes, stages et journal de stage pour la section maintenance industrielle (3QEM, 4e à 6e EQEM et EQMM) de l'Institut Saint-Roch, Marche-en-Famenne.

- **L'app** (ce dépôt) est publiée par GitHub Pages : `https://isr-maintenance.github.io/plateforme/`
- **Les données** sont dans un Google Sheet du compte de l'école, lu et écrit par un script Google (Apps Script).
- **La connexion** se fait avec le compte Google de l'école : seules les adresses `@elmarche.be` passent.
- **Les PDF des cours** restent dans Google Drive, partagés avec elmarche.be : ils ne sont pas dans ce dépôt public.

Tant que `js/config.js` n'est pas rempli, l'app tourne en **mode test local** : tout reste dans le navigateur, on peut l'essayer avec n'importe quelle adresse @elmarche.be.

## Structure

| Dossier | Contenu |
|---|---|
| `index.html`, `css/`, `js/` | L'app (aucune compilation, fichiers servis tels quels) |
| `js/config.js` | Les 3 adresses à remplir après l'installation Google |
| `js/catalog.js` | Filières, classes, cours, plan du cours d'Électricité 4e, évaluations, stages |
| `js/relais.js` | Le chapitre 2.3 (capsules, animations, évaluation, feu vert TP É03) |
| `apps-script/donnees/` | Script du Google Sheet : stockage et droits (`Api.gs` + `Code.gs`) |
| `apps-script/connexion/` | Petit script séparé qui lit seulement l'adresse @elmarche.be |
| `tests/` | `node tests/api.test.js` vérifie le script (droits, notes, journal…) |

`js/api-core.js` est une copie de `apps-script/donnees/Api.gs` (même logique, utilisée par le mode test local).

## Installation Google (une seule fois)

### 1. Le script « Données »
1. Ouvrir le Google Sheet **Plateforme technique – données** (compte @elmarche.be).
2. **Extensions › Apps Script**. Renommer le projet « Plateforme – données ».
3. Remplacer le contenu de `Code.gs` par `apps-script/donnees/Code.gs`, puis créer un fichier `Api.gs` avec `apps-script/donnees/Api.gs`.
4. **Paramètres du projet** › cocher « Afficher le fichier manifeste », puis remplacer `appsscript.json` par `apps-script/donnees/appsscript.json`.
5. Dans `Code.gs`, vérifier `ADMIN_MAIL` et `ADMIN_NOM` (le premier coordinateur).
6. Choisir la fonction **installer** › **Exécuter** › autoriser. Dans le journal d'exécution, **copier la clé secrète**.
7. **Déployer › Nouveau déploiement › Application Web** : *Exécuter en tant que* **moi**, *Accès* **Tout le monde**. Copier l'URL `…/exec` → c'est `API_URL`.

### 2. Le script « Connexion »
1. Sur [script.google.com](https://script.google.com), **Nouveau projet** « Plateforme – connexion ».
2. Coller `apps-script/connexion/Connexion.gs` et le manifeste `apps-script/connexion/appsscript.json`.
3. Dans `Connexion.gs`, coller la clé secrète dans `SECRET` et vérifier `APP_URL`.
4. **Déployer › Nouveau déploiement › Application Web** : *Exécuter en tant que* **l'utilisateur qui accède à l'application**, *Accès* **Tous les utilisateurs de elmarche.be**. Copier l'URL → c'est `LOGIN_URL`.

### 3. L'app
1. Dans `js/config.js`, remplir `LOGIN_URL`, `API_URL` et `PDF_ELEC4` (lien Drive du cours, partagé « elmarche.be – lecteur »).
2. Sur GitHub : **Settings › Pages › Deploy from a branch › main / (root)**.
3. Ouvrir l'app, se connecter avec le compte du coordinateur, puis dans **Accès** ajouter les profs et dans **Admin** attribuer les cours.

## Mettre à jour le script
Après une modification d'`Api.gs` ou de `Code.gs` : recoller les fichiers, puis **Déployer › Gérer les déploiements › ✎ › Version : nouvelle version**. L'URL ne change pas.

## Sauvegarde
Toutes les données sont dans l'onglet `donnees` du Google Sheet (une ligne par document). En fin d'année : **Fichier › Créer une copie** pour archiver.
