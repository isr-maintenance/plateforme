# Plateforme technique — mode d'emploi pour Claude

Lis ce fichier en entier avant de toucher au dépôt. Il remplace les longues explications : suis-le, et ne relis pas tout le code pour « comprendre le projet ».

## Le projet en bref

- **Plateforme** des cours techniques de la section maintenance industrielle de l'Institut Saint-Roch (Marche-en-Famenne) : 3QEM, 4e à 6e EQEM et EQMM. Coordinateur : Olivier Lesenfants.
- **Site** : `https://isr-maintenance.github.io/plateforme/`, publié par GitHub Pages depuis `main`. Aucune compilation : les fichiers sont servis tels quels.
- **Serveur** : un script Google (Apps Script) sur le compte de l'école d'Olivier, avec les données dans un Google Sheet. Le code est dans `apps-script/`, et `js/api-core.js` en est une copie conforme pour le mode test local.
- **Dépôt public** : n'y mets jamais de corrigés, de données d'élèves, d'adresses mail réelles ni de secrets. Les corrigés et les évaluations formatives sont stockés côté serveur, pas dans le code.

## Ce que tu peux faire seul, et ce qui revient à Olivier

| Tu peux | Demande d'abord à Olivier |
|---|---|
| Ajouter ou corriger un chapitre, des capsules, des quiz, des exercices (`js/chapXX.js`) | Toucher à `apps-script/` (le serveur) : chaque changement doit être redéployé par Olivier |
| Corriger un texte, une coquille, une page PDF | Ajouter un nouveau cours interactif autre que l'Électricité 4e (voir « Limites actuelles ») |
| Ajouter un outil autonome dans `outils/` | Changer la connexion, les droits, le carnet de cotes, les stages |

**Toujours** : travailler sur une branche, puis ouvrir une *pull request* vers `main`. Olivier relit et fusionne. Ne pousse jamais directement sur `main`.

## Ajouter un chapitre (cours d'Électricité 4e)

Les chapitres 2.1 à 2.11 sont des exemples complets. Copie la structure de `js/chap22.js` (calculs) ou `js/chap26.js` (classements et ordres).

1. **Le plan** est dans `js/catalog.js` (`ELEC4`). Chaque chapitre y figure avec son numéro, son titre, sa page dans le PDF et son TP.
2. **Le fichier** s'appelle `js/chapXYZ.js`, enveloppé dans `(function(){ … })();`. Il appelle `defChapter({...})` :
   - `num` : '2.4' ; `titre` ; `tp` : 'É04' ; `Q` : les questions rapides ; `caps` : les capsules ;
   - `prereq` : `[{t, cap}]`, les prérequis du TP, chacun lié à une capsule ;
   - `controle` : `[[question, capId]]`, les questions de contrôle de la synthèse ;
   - en option : `noEval: true` (pas d'évaluation formative) et `prereqTitle`.
3. **Une capsule** : `{ id, sec, t, pdf, quiz:[ids], ex:{keys:[...], lbl}, body: () => html, mount: root => {...} }`.
   - `id` : lettre du chapitre + numéro, par exemple `d3`. Préfixes déjà pris : a = 2.1, b = 2.2, c = 2.3, d = 2.4, e = 2.5, f = 2.6, g = 2.7, h = 2.8, i = 2.9, j = 2.10, k = 2.11. Un nouveau chapitre prend la lettre libre suivante.
   - `sec` : la section du cours (« 2.4.3 ») ; `pdf` : la page dans le PDF élèves.
   - `quiz` : identifiants des questions de `Q` affichées en bas de la capsule.
   - `ex.keys` : clés des exercices à réussir pour valider la capsule. Chaque clé est unique dans toute la plateforme.
4. **Une question rapide** : `id: { q, o: [choix…], g: indice de la bonne réponse, e: explication, r: capId }`. Mets 2 à 4 choix plausibles, et une explication qui dit **pourquoi**.
5. **Les exercices réutilisables** (dans `js/chapitres.js`) :
   - `mountOrderW(box, key, { items, shuffle, ok, hint })` : remettre dans l'ordre. `items` est donné dans le bon ordre ; `shuffle` est l'ordre de départ affiché.
   - `mountSortW(box, key, { cats: [[code, libellé]], items: [[texte, codeJuste, explication]], ok, hint, intro })` : classer.
   - `mountDrillW(box, key, { rows: [{ q, unit, ans, tol, hint }], ok, hint, intro })` : calculs corrigés. `ans` est **calculé dans le code** (par exemple `ans: 230/16`), jamais recopié à la main ; la tolérance par défaut est de 2 %.
   - Pour la mise en page : `exbox(id, titre, sous-titre)` (cadre d'exercice), `tbl(entêtes, lignes)`, `formula(f, légende)`, `terrain(texte)` (encadré « sur le terrain »).
6. **Brancher le fichier** :
   - ajouter `<script src="js/chapXYZ.js?v=1"></script>` dans `index.html`, avant `js/core.js`, dans l'ordre des chapitres ;
   - ajouter le fichier à la liste `FILES` de `sw.js` et incrémenter `CACHE` (`plateforme-vN` → `plateforme-vN+1`).
7. **Ouverture** : un chapitre est fermé aux élèves tant que leur prof ne l'ouvre pas (Suivi › « Chapitres ouverts »). Rien à faire dans le code.

## Règles de rédaction

- **Langue** : français de Belgique. Écris « septante » et « nonante », pas « soixante-dix » ni « quatre-vingt-dix ».
- **Ton** : on tutoie l'élève. Phrases courtes, vocabulaire du métier, toujours un exemple concret d'atelier.
- **Source** : le contenu vient du cours PDF du prof. Ne pas inventer de normes ni de valeurs. En cas de doute, demande.
- **Évaluations** : les questions de la plateforme ne sont **pas** celles de l'évaluation formative ; ne recopie jamais l'évaluation ni son corrigé.
- **Chiffres** : virgule décimale (230,5 V) et unités SI, avec une espace avant l'unité.

## Vérifier avant la pull request

1. `node tests/api.test.js` doit afficher uniquement des « ✓ ». C'est indispensable si `apps-script/` a changé ; dans ce cas, recopie aussi `apps-script/donnees/Api.gs` dans `js/api-core.js`.
2. Lancer un serveur local : `python3 -m http.server 8765`, à la racine du dépôt.
3. Le site appelle le vrai serveur. Pour tester sans lui, ouvre la page avec Playwright en remplaçant `API_URL` par `''` dans `js/config.js` au chargement (`page.route('**/js/config.js*', …)`) : l'app passe alors en **mode test local** (données dans le navigateur ; `API.loginLocal('prenom.nom.student@elmarche.be')` pour se connecter).
4. Ouvre chaque nouvelle capsule et réussis chaque exercice. Vérifie qu'aucune erreur n'apparaît dans la console et que la page ne déborde pas sur téléphone (390 px de large).

## Limites actuelles (à savoir avant de promettre quelque chose)

- **Un seul cours interactif.** Le moteur de chapitres n'est branché que sur le cours **Électricité 4e** (`4-elec`). Ajouter des chapitres à un autre cours (Mécanique, TP, 5e-6e…) demande d'abord une petite adaptation du moteur. Signale-le à Olivier au lieu de bricoler.
- **Les PDF des cours** sont sur Google Drive (liens dans `js/config.js` ou réglés dans Bibliothèque) ; ils ne vont pas dans le dépôt.
- **3QEM** : la classe de l'élève est son groupe de TP (`3qem1` à `3qem3`). Les cours techniques sont donnés aux groupes de CT (`3qemct1`, `3qemct2`), dans lesquels un prof place les élèves.
- **Les apps séparées** (Banc de câblage, Dossier TP, Labo Arduino) ont leurs propres dépôts. On ne les modifie pas depuis ici.
