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
| Corriger un texte, une coquille, une page PDF | Ajouter un nouveau cours interactif (voir « Les cours interactifs ») |
| Ajouter un outil autonome dans `outils/` | Changer la connexion, les droits, le carnet de cotes, les stages |

**Publier** : regarde d'abord avec quel compte GitHub la session travaille : `gh api user --jq .login`.
- **`isr-maintenance`** (le compte d'Olivier, administrateur du dépôt) : fais les vérifications ci-dessous, puis pousse directement sur `main`. Pas de *pull request* : Olivier ne veut pas valider ses propres demandes.
- **Tout autre compte** (un collègue) : travaille sur une branche, puis ouvre une *pull request* vers `main`. Olivier relit et fusionne. GitHub refuse de toute façon un envoi direct sur `main` depuis ces comptes (règle « Protection main », validation par `@olivier7887`).

## Ajouter un chapitre (cours d'Électricité 4e)

Pour l'Électricité 3QEM (« Ampère & Fils »), voir plus bas « Le cours d'Électricité 3QEM ».

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
   - `mountDefiW(box, { app:'banc', defi, lvl, titre, consigne })` : un défi à réussir dans le Banc de câblage. Le Banc s'ouvre dans la plateforme, directement sur ce défi ; quand l'élève le réussit, le Banc le signale et la clé est enregistrée. Clé à mettre dans `ex.keys` : `defiKey('banc', defi, lvl)` (par exemple `banc:r5:1`). Un niveau supérieur réussi compte aussi. `defi` est la clé du défi dans le Banc (`EX` dans son `index.html` : `r5` = Relais 5 · marche-arrêt avec maintien, `simple`, `vav`, `tl`, `direct`…). Pour une fiche (identification, principe, câblage), c'est la fin du câblage qui compte.
   - **Ordre et données propres à chaque élève** : les choix des questions rapides et les éléments de `mountSortW` / `mountOrderW` s'affichent dans un ordre tiré au sort pour chaque élève (`melange`, automatique : écris les choix dans n'importe quel ordre). Pour les calculs, utilise des **données variables** : `vx('clé', {grandeur:[valeurs]})` tire une valeur dans chaque liste, toujours la même pour un élève. Mets la valeur du cours dans la liste, et calcule `ans` à partir des valeurs tirées. Exemples : `(v=>mountDrillW(box,'b7j',{rows:[…v.a…]}))(vx('b7j',{a:[…]}))` ; `${(v=>AX(6,'A6x1',1,`… ${fr(v.I)} A …`,[{ans:v.I*v.t}]))(vx('A6x1',{I:[…],t:[…]}))}`. La vue prof (Suivi) montre les valeurs de l'élève. Les exemples guidés liés au texte du cours et les valeurs de normes (RGIE, réseau) restent fixes.
6. **Brancher le fichier** :
   - ajouter `<script src="js/chapXYZ.js?v=1"></script>` dans `index.html`, avant `js/core.js`, dans l'ordre des chapitres ;
   - ajouter le fichier à la liste `FILES` de `sw.js` et incrémenter `CACHE` (`plateforme-vN` → `plateforme-vN+1`).
7. **Ouverture** : un chapitre est fermé aux élèves tant que leur prof ne l'ouvre pas (Suivi › « Chapitres ouverts »). Rien à faire dans le code.

## Les cours interactifs

Deux cours ont des chapitres dans la plateforme : **Électricité 4e** (`4-elec`) et **Électricité 3QEM** (`3em-elec`, « Ampère & Fils »).

- Chaque chapitre appartient à un cours : `defChapter({ course:'3em-elec', … })` (par défaut `4-elec`).
- Le plan d'un cours (titre, parties, chapitres) est dans `COURSE_PLANS` (`js/catalog.js`) ; le cours y a `statut:'demo'` et un `chip`.
- **Numéro de chapitre** : le serveur n'accepte que des clés du type `2.3`. Un cours qui numérote 1, 2, 3… utilise une clé interne `0.N` et `lbl:'N'` pour l'affichage (c'est le cas du 3QEM).
- Chapitres ouverts par défaut : `OUV_DEF` dans `js/chapitres.js`. En 3QEM, c'est le **groupe de CT** de l'élève qui compte pour les cours techniques.
- **Un cours qui se fait dans une app séparée** (TP électricité 3QEM → Dossier TP) : `statut:'app'` et `module:'dossier'` dans `COURS`. La carte du cours ouvre l'app en un clic, avec la connexion automatique (`MODULES`, `openApp`).
- Ajouter un troisième cours : une entrée dans `COURSE_PLANS`, `statut:'demo'` dans `COURS`, ses chapitres avec `course`, son `OUV_DEF`. Le suivi prof, la page du cours et le lecteur s'adaptent seuls.

## Le cours d'Électricité 3QEM (Ampère & Fils)

- Fichiers : `js/af3.js` (formulaire du cours + outils), `js/af3-1.js` (chapitres 1 à 5), `af3-2.js` (6 à 11), `af3-3.js` (12 à 16), `af3-4.js` (17 à 20).
- Un chapitre se déclare avec `defAF(n, {Q, caps, prereq})` : clé `0.n`, cours, synthèse « ce que tu sais faire » (les compétences exercées du cours, chacune liée à une capsule).
- Identifiants : capsules `A6a`, questions `A6aq1`, exercices `A6x1` (A = Ampère & Fils, puis le numéro du chapitre).
- **Les exercices chiffrés** se font dans le tableau en quatre colonnes **Données · Inconnue · Formule · Solution** :
  `AX(n, clé, numéro, énoncé, [{lbl, unit, ans, tol}], {hint, tip, sans})`. `ans` est **calculé dans le code**. Tolérance par défaut 2 %, à resserrer quand une réponse fausse serait trop proche (`tol:0.004`).
  Liste de résultats vide (`[]`) : pas de correction automatique (par exemple quand le schéma manque) ; `sans` explique pourquoi, et le prof voit le tableau dans Suivi (clic sur le nom de l'élève).
  L'exercice est validé quand les quatre colonnes sont remplies, que la formule contient un « = » et que les résultats sont justes.
- **Formules** (`js/formules.js`) : l'élève écrit en ligne, la plateforme affiche en vrai. `/` fait une fraction (`(ρ . L) / S`), `^` un exposant, `_` un indice (`R1` devient R₁ tout seul), `√(…)` une racine, `.` le point de multiplication. Dans le contenu : `fm('R = ρ . L / S')` (dans le texte), `fbox(formule, légende)` (encadré), `triangle(haut, gauche, droite)` (triangle mnémotechnique cliquable, haut = gauche × droite).
- **Le formulaire** (bouton 📐) : `FORMULAIRES['3em-elec']` dans `js/af3.js`. Il est en lecture seule, volontairement : l'élève recopie la formule lui-même. Toute nouvelle loi du cours s'y ajoute.
- **Les points « à l'atelier »** : un élément de `prereq` sans capsule (`cap:null`) reçoit une clé `atel` (par exemple `A1mont`). Le prof le coche dans Suivi (« À l'atelier — validé par toi », action serveur `setAtelier`) ; l'élève ne peut pas le cocher lui-même.
- **Les séries d'exercices (devoirs)** : `js/af3-series.js`, une capsule `A{n}s` « Série d'exercices » ajoutée à la fin des chapitres 6 à 16 et 20, avec `serieAF(n, [[énoncé, résultats, options]])`. Clés `A{n}s1`, `A{n}s2`… Options en plus de `AX` : `texte:true` (question à justifier : une seule case « Ta réponse », lue par le prof), `alt:[…]` dans un résultat (autre réponse admise quand l'énoncé permet deux lectures). Les en-têtes Nom / Classe / Date du devoir papier ne sont pas repris.

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

- **Deux cours interactifs** : Électricité 4e et Électricité 3QEM. Ajouter un autre cours (Mécanique, TP, 5e-6e…) suit « Les cours interactifs » ; demande d'abord l'accord d'Olivier.
- **Taille de la progression** : tout ce qu'un élève fait est enregistré dans un seul document, limité à 45 000 caractères par le serveur. Les cases du tableau en quatre colonnes sont limitées à 250 caractères pour cette raison.
- **Les PDF des cours** sont sur Google Drive (liens dans `js/config.js` ou réglés dans Bibliothèque) ; ils ne vont pas dans le dépôt.
- **3QEM** : la classe de l'élève est son groupe de TP (`3qem1` à `3qem3`). Les cours techniques sont donnés aux groupes de CT (`3qemct1`, `3qemct2`), dans lesquels un prof place les élèves.
- **Les apps séparées** (Banc de câblage, Dossier TP, Labo Arduino) ont leurs propres dépôts, sur le compte `olivier7887`. On ne les modifie pas depuis ici.
- **Ouverture dans la plateforme** : `APPS` (`js/pages.js`). Avec `panel:true`, l'app s'ouvre dans un panneau plein écran (`openPanel`), sinon dans un nouvel onglet. Seul le Banc a `panel:true` pour l'instant : une app doit d'abord savoir qu'elle est dans la plateforme (`#plateforme&embed` : pas de bouton « ← Plateforme ») et signaler ses défis réussis (`postMessage` `{src, type:'reussi', k, complet, titre}` vers `https://isr-maintenance.github.io`). Les outils de la plateforme (`outils/…`) s'ouvrent aussi dans le panneau.


## Déposer le PDF d'un cours (profs)

Les PDF ne vont jamais dans ce dépôt. Ils vont dans le dossier Google Drive **Cours** d'Olivier, partagé en Éditeur avec les profs (il apparaît dans « Partagés avec moi ») : https://drive.google.com/drive/folders/1l2d0A9bqAI-9klFyZh0m2rtmpJhbl9Xn

1. **Vérifie le PDF** : aucun nom d'élève, aucune cote, aucune adresse. Les corrigés et les évaluations formatives vont dans des PDF séparés, jamais dans la version élèves.
2. **Nomme-le** comme ceux d'Olivier, sans accents ni espaces : `Cours_Matiere_4e_eleves.pdf`, `Cours_Matiere_4e_PROF_avec_corriges.pdf`, `Cours_Matiere_4e_evaluations_formatives_PROF.pdf` (par exemple `Cours_Mecanique_4e_eleves.pdf`).
3. **Dépose-le** dans le dossier Cours, avec le navigateur du prof (Claude dans Chrome). Si tu ne peux pas envoyer le fichier toi-même, demande au prof de le glisser dans le dossier, puis continue.
4. **Partage** : la version élèves en lecture pour toute l'école (Accès général : ELMA, lecteur), comme `Cours_Electricite_4e_eleves.pdf`. Les versions PROF gardent seulement l'accès du dossier (les profs) : n'y touche pas.
5. **Lie la version élèves à la plateforme** : connecté avec le compte du prof, onglet **Bibliothèque** (vue prof), ajoute le lien Drive au bon cours. Ce lien est enregistré sur le serveur : rien à changer dans le dépôt pour cette étape.
6. **Ne supprime ni ne modifie** aucun autre fichier du dossier Cours.
7. Pour des chapitres interactifs ensuite, suis « Ajouter un chapitre » (branche et pull request), en tenant compte des « Limites actuelles ».
