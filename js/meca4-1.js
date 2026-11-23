/* =========================================================
   MÉCANIQUE 4e — CHAPITRES 1 À 4
   1 Introduction · 2 Les mouvements · 3 Le MRU · 4 Vitesse de coupe
   ========================================================= */
(function(){

/* ---------- 2. le système bielle-manivelle, animé ---------- */
function mountBielle(root){
  const box=root.querySelector('#m2bm'); if(!box) return;
  const r=42, l=140, cx=90, cy=95;
  box.innerHTML=`<svg viewBox="0 0 440 190" role="img" aria-label="Système bielle-manivelle en mouvement">
    <rect x="${cx+l-r-34}" y="${cy-30}" width="${2*r+120}" height="60" rx="6" fill="none" stroke="var(--line)" stroke-width="3"/>
    <text x="${cx+l+40}" y="${cy+50}" text-anchor="middle" font-size="11" fill="var(--muted)">cylindre</text>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 4"/>
    <line id="m2bmM" stroke="var(--meca)" stroke-width="8" stroke-linecap="round"/>
    <line id="m2bmB" stroke="var(--ink-2)" stroke-width="6" stroke-linecap="round"/>
    <rect id="m2bmP" y="${cy-24}" width="46" height="48" rx="5" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="6" fill="var(--ink)"/><circle id="m2bmJ" r="5" fill="var(--ink)"/>
    <g font-size="11" fill="var(--muted)" text-anchor="middle"><text x="${cx}" y="${cy+r+22}">manivelle</text><text id="m2bmTb" y="${cy+46}">bielle</text><text id="m2bmTp" y="${cy-32}">piston</text></g></svg>
    <div class="row" style="justify-content:center;margin-top:6px"><button class="btn sm" data-bmgo>⏸ Pause</button></div>`;
  let a=0, run=true, last=0;
  const M=box.querySelector('#m2bmM'), B=box.querySelector('#m2bmB'), Pp=box.querySelector('#m2bmP'), J=box.querySelector('#m2bmJ'), Tb=box.querySelector('#m2bmTb'), Tp=box.querySelector('#m2bmTp');
  const frame=t=>{
    if(!box.isConnected) return;
    if(run){ a += last ? (t-last)/1000*2.2 : 0; }
    last=t;
    const jx=cx+r*Math.cos(a), jy=cy-r*Math.sin(a), px=jx+Math.sqrt(l*l-(jy-cy)**2);
    M.setAttribute('x1',cx); M.setAttribute('y1',cy); M.setAttribute('x2',jx); M.setAttribute('y2',jy);
    B.setAttribute('x1',jx); B.setAttribute('y1',jy); B.setAttribute('x2',px); B.setAttribute('y2',cy);
    J.setAttribute('cx',jx); J.setAttribute('cy',jy); Pp.setAttribute('x',px-4);
    Tb.setAttribute('x',(jx+px)/2); Tp.setAttribute('x',px+19);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  box.querySelector('[data-bmgo]').onclick=e=>{ run=!run; e.target.textContent=run?'⏸ Pause':'▶ Reprendre'; };
}

/* ---------- 3. le mobile en MRU : 20 m toutes les 5 s ---------- */
const mruSVG = () => `<svg viewBox="0 0 440 130" role="img" aria-label="Un mobile parcourt 20 m toutes les 5 secondes">
  <line x1="30" y1="70" x2="420" y2="70" stroke="var(--ink-2)" stroke-width="2"/>
  ${[0,1,2,3].map(i=>`<line x1="${40+i*120}" y1="60" x2="${40+i*120}" y2="80" stroke="var(--ink-2)" stroke-width="2"/><text x="${40+i*120}" y="98" text-anchor="middle" font-size="11" fill="var(--muted)">${i*5} s</text><text x="${40+i*120}" y="114" text-anchor="middle" font-size="11" fill="var(--muted)">${i*20} m</text>`).join('')}
  ${[0,1,2].map(i=>`<text x="${100+i*120}" y="54" text-anchor="middle" font-size="11" fill="var(--meca)" font-weight="700">e = 20 m · t = 5 s</text>`).join('')}
  <rect x="28" y="22" width="24" height="18" rx="4" fill="var(--meca)"><animate attributeName="x" from="28" to="388" dur="7.5s" repeatCount="indefinite"/></rect>
  <text x="18" y="16" font-size="11" fill="var(--muted)">O (origine)</text></svg>`;

/* ---------- 4. la pièce qui tourne : en 1 tour, le point A parcourt π . d ---------- */
const vcSVG = () => `<svg viewBox="0 0 440 180" role="img" aria-label="Pièce en rotation : le point A parcourt la circonférence">
  <circle cx="110" cy="90" r="62" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="3"/>
  <g><circle cx="110" cy="28" r="7" fill="var(--bad)"/><text x="122" y="24" font-size="12" font-weight="800" fill="var(--bad)">A</text>
    <animateTransform attributeName="transform" type="rotate" from="0 110 90" to="360 110 90" dur="3s" repeatCount="indefinite"/></g>
  <line x1="48" y1="90" x2="172" y2="90" stroke="var(--meca)" stroke-width="2" stroke-dasharray="5 4"/><text x="110" y="108" text-anchor="middle" font-size="12" fill="var(--meca)" font-weight="700">d</text>
  <text x="110" y="172" text-anchor="middle" font-size="11" fill="var(--muted)">la pièce tourne à n tr/min</text>
  <g font-size="12" fill="var(--ink-2)"><text x="210" y="62">1 tour : A parcourt π . d</text><text x="210" y="88">n tours : A parcourt π . d . n</text><text x="210" y="114">d en mm → on divise par 1 000</text><text x="210" y="140" font-weight="800" fill="var(--meca)">Vc = π . d . n / 1000 (m/min)</text></g></svg>`;

/* =================== CHAPITRE 1 — INTRODUCTION À LA MÉCANIQUE =================== */
defMC(1, {
  Q:{
    M1aq1:{q:"Qui a codifié, dans l’Antiquité, la loi des leviers ?",o:["Archimède","Newton","Galilée"],g:0,e:"Archimède (vers 250 av. J.-C.) a écrit les lois des leviers, en statique.",r:'M1a'},
    M1aq2:{q:"Le levier et la roue sont utilisés depuis…",o:["environ 150 000 ans","le Moyen Âge","l’époque de Newton"],g:0,e:"La mécanique « se perd dans la nuit des temps » : le levier et la roue remontent à environ 150 000 ans.",r:'M1a'},
    M1bq1:{q:"Quelle partie de la mécanique étudie les mouvements sans s’occuper des forces qui les provoquent ?",o:["La statique","La cinématique","La dynamique"],g:1,e:"Cinématique = les mouvements seuls. Dynamique = les mouvements ET les forces qui les provoquent.",r:'M1b'},
    M1bq2:{q:"Calculer les réactions des appuis d’une poutre au repos, c’est de la…",o:["statique","cinématique","dynamique"],g:0,e:"La statique étudie les conditions pour qu’un corps reste au repos (ou en mouvement uniforme).",r:'M1b'},
    M1cq1:{q:"Que veut dire M.K.S.A. ?",o:["Mètre, kilogramme, seconde, ampère","Masse, kilo, seconde, ampère","Mètre, kelvin, seconde, ampère"],g:0,e:"Les quatre unités de base du système : le mètre, le kilogramme, la seconde et l’ampère.",r:'M1c'},
    M1cq2:{q:"Le symbole de la grandeur « masse » est m. Quel est le symbole de son unité ?",o:["m","kg","M"],g:1,e:"La grandeur masse (m) se mesure en kilogrammes (kg). Attention : le « m » de la grandeur masse n’est pas le « m » du mètre !",r:'M1c'},
  },
  caps:[
    {id:'M1a', sec:'1.1', t:'Un peu d’histoire', quiz:['M1aq1','M1aq2'], ex:{keys:['M1hist'], lbl:'La ligne du temps'},
     body:()=>`<p class="lead">La mécanique est la plus ancienne des sciences techniques : le levier et la roue remontent à environ 150 000 ans.</p>
      <p>L’Antiquité codifie les lois des leviers en statique (Archimède). Il faut ensuite attendre les Temps modernes pour voir naître, coup sur coup, la <b>cinématique</b> avec la chute des corps (Galilée) et la <b>dynamique</b> avec la gravitation universelle (Newton). Au XXᵉ siècle, Einstein remet la mécanique en question avec la relativité.</p>
      ${tbl(['Quand ?','Qui ?','Quoi ?'],[['≈ 150 000 ans','—','Utilisation du levier et de la roue'],['≈ 250 av. J.-C.','Archimède','La loi des leviers'],['≈ 1600','Guldin · Galilée','Le centre de gravité · la chute des corps'],['≈ 1700','Newton · Bernoulli · Varignon','La gravitation universelle · la dynamique liée aux mathématiques · la théorie des moments'],['1750','d’Alembert','Il ramène la dynamique à la statique'],['1900','Einstein','La relativité restreinte et générale']])}
      ${terrain('Quand tu utilises un pied de biche, un palan ou une clé dynamométrique, tu appliques des lois connues depuis Archimède et Varignon. Elles n’ont pas changé.')}
      ${exbox('m1hist','Remets les étapes dans l’ordre','Du plus ancien au plus récent.')}`,
     mount:root=>mountOrderW(root.querySelector('#m1hist'),'M1hist',{items:['Le levier et la roue','Archimède : la loi des leviers','Galilée : la chute des corps','Newton : la gravitation universelle','d’Alembert ramène la dynamique à la statique','Einstein : la relativité'],ok:'Bonne chronologie.',hint:'Archimède vit dans l’Antiquité ; Galilée meurt l’année où naît Newton.'})},
    {id:'M1b', sec:'1.2', t:'Les trois parties de la mécanique', quiz:['M1bq1','M1bq2'], ex:{keys:['M1part'], lbl:'Le classement'},
     body:()=>`${tbl(['Partie','Ce qu’elle étudie'],[['La cinématique','Les mouvements des corps, <b>sans s’occuper des forces</b> qui les provoquent'],['La statique','Les conditions pour qu’un corps reste au <b>repos</b> (ou en mouvement uniforme)'],['La dynamique','Les mouvements, en tenant compte cette fois <b>des forces qui les provoquent</b>']])}
      <p>Dans ce cours, tu verras la cinématique (les mouvements, le MRU, la vitesse de coupe, les transmissions), la dynamique (les machines simples : leviers, poulies, palans, treuils, crics, plans inclinés, vis et coins) et la statique (les forces, l’équilibre des poutres, les moments, le centre de gravité).</p>
      ${exbox('m1part','À quelle partie de la mécanique appartient chaque question ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m1part'),'M1part',{cats:[['c','Cinématique'],['s','Statique'],['d','Dynamique']],items:[
       ['À quelle vitesse tourne la poulie menée ?','c','On décrit un mouvement, sans parler de force.'],
       ['Combien de temps met le chariot du tour pour avancer de 28 cm ?','c','Un espace, une vitesse, un temps : cinématique.'],
       ['Quelle force faut-il sur la manivelle du treuil pour lever 500 kg ?','d','On relie le mouvement aux forces : dynamique (les machines simples).'],
       ['Quel effort faut-il exercer sur le palan pour lever le moteur ?','d','Machine simple : dynamique.'],
       ['Quelle charge supporte chaque appui de ce pont roulant à l’arrêt ?','s','Un corps au repos et des forces en équilibre : statique.'],
       ['Où se trouve le centre de gravité de cette équerre ?','s','Le centre de gravité est étudié en statique.']],ok:'Bien classé.'})},
    {id:'M1c', sec:'1.3', t:'Le système international (SI)', quiz:['M1cq1','M1cq2'], ex:{keys:['M1si'], lbl:'Grandeurs et unités'},
     body:()=>`<p class="lead">Le système international d’unités (SI) convient à la fois aux mécaniciens et aux électriciens.</p>
      <p>Il a été rendu obligatoire en Belgique par la loi du 16 juin 1970 et est d’application en Europe depuis 1978. Il part d’un système appelé <b>M.K.S.A.</b>, qui comprend 4 unités :</p>
      ${tbl(['Grandeur','Symbole de la grandeur','Unité','Symbole de l’unité'],[['Longueur','l','mètre','m'],['Masse','m','kilogramme','kg'],['Temps','t','seconde','s'],['Intensité électrique','I','ampère','A']])}
      ${mcRem('Ne confonds pas la <b>grandeur</b> (ce qu’on mesure : une longueur l) et l’<b>unité</b> (avec quoi on la mesure : le mètre m). Dans un calcul, chaque valeur s’écrit avec son unité : <b>l = 2,5 m</b>.')}
      ${exbox('m1si','Associe chaque mesure de l’atelier à son unité SI','')}`,
     mount:root=>mountSortW(root.querySelector('#m1si'),'M1si',{cats:[['m','m'],['kg','kg'],['s','s'],['A','A']],items:[
       ['La longueur d’un arbre de transmission','m',''],['La masse d’un moteur à lever','kg',''],['La durée d’un cycle de la presse','s',''],['Le courant absorbé par le moteur','A',''],['La course d’un vérin','m','Une course est une longueur.'],['La masse d’une bobine de câble','kg','']],ok:'Toutes les unités sont justes.'})},
  ],
  prereq:[{t:'Situer les grandes étapes de l’histoire de la mécanique',cap:'M1a'},{t:'Distinguer cinématique, statique et dynamique',cap:'M1b'},{t:'Citer les quatre unités de base du système M.K.S.A. et leurs symboles',cap:'M1c'}],
});

/* =================== CHAPITRE 2 — LES MOUVEMENTS =================== */
defMC(2, {
  Q:{
    M2aq1:{q:"En mécanique, comment appelle-t-on un corps en mouvement ?",o:["Un mobile","Un moteur","Une masse"],g:0,e:"Un corps qui se déplace est un « mobile » : une voiture, le chariot d’un tour, la tige d’un vérin…",r:'M2a'},
    M2aq2:{q:"Un corps est en mouvement par rapport à un autre lorsque…",o:["la distance qui les sépare varie avec le temps","il est plus lourd que l’autre","il tourne sur lui-même"],g:0,e:"Le mouvement est toujours relatif à un repère : si la distance varie avec le temps, il y a mouvement.",r:'M2a'},
    M2bq1:{q:"La tige d’un vérin sort puis rentre. Son sens de mouvement est…",o:["continu","alternatif","circulaire"],g:1,e:"Tantôt dans un sens, tantôt dans l’autre : mouvement alternatif.",r:'M2b'},
    M2bq2:{q:"Quelle est la trajectoire d’un écrou que l’on visse ?",o:["Rectiligne","Hélicoïdale","Parabolique"],g:1,e:"L’écrou tourne et avance en même temps : il décrit une hélice.",r:'M2b'},
    M2cq1:{q:"Le piston d’un moteur à explosion a un mouvement…",o:["rectiligne, alternatif, varié","circulaire, continu, uniforme","curviligne, continu, uniforme"],g:0,e:"Il va et vient en ligne droite, et sa vitesse change sans arrêt (elle est nulle à chaque bout de course).",r:'M2c'},
    M2cq2:{q:"La manivelle d’un moteur qui tourne à régime constant a un mouvement…",o:["rectiligne, alternatif, varié","circulaire, continu, uniforme","hélicoïdal, continu, varié"],g:1,e:"Elle tourne toujours dans le même sens, à vitesse constante.",r:'M2c'},
  },
  caps:[
    {id:'M2a', sec:'2.1 — 2.2', t:'La notion de mouvement', quiz:['M2aq1','M2aq2'],
     body:()=>`<p class="lead">L’avion et la voiture sont des corps en mouvement ; l’arbre et la maison sont des corps fixes.</p>
      ${mcDef('Le mobile','En mécanique, un corps qui est en mouvement est appelé un <b>mobile</b>.')}
      <p>Un corps est en mouvement par rapport à un autre lorsque <b>la distance qui les sépare varie avec le temps</b>. Pour décrire un mouvement, on choisit un repère :</p>
      <ul><li>le point <b>O</b> est l’<b>origine</b> (le point de départ) ;</li><li><b>e₁</b>, <b>e₂</b>… sont les <b>espaces parcourus</b> par le mobile.</li></ul>
      ${terrain('Sur une ligne de production, le colis posé sur le convoyeur est immobile par rapport au tapis, mais en mouvement par rapport au sol. Quand tu règles un capteur, tu raisonnes toujours par rapport au bâti fixe de la machine.')}`},
    {id:'M2b', sec:'2.3', t:'Les éléments qui déterminent un mouvement', quiz:['M2bq1','M2bq2'], ex:{keys:['M2traj'], lbl:'Les trajectoires'},
     body:()=>`<p class="lead">Un mouvement est déterminé par quatre éléments : l’origine, la trajectoire, le sens et la vitesse.</p>
      <p><b>1. L’origine</b> : le point de départ.</p>
      <p><b>2. La trajectoire</b> : la ligne qui joint, d’une manière continue, les différentes positions prises par le mobile au cours de son déplacement.</p>
      ${tbl(['Trajectoire','Exemples'],[['Rectiligne','la mâchoire mobile d’un étau, un tiroir'],['Circulaire','une poulie, un mandrin'],['Parabolique','un jet d’eau'],['Curviligne','une courbe quelconque'],['Hélicoïdale','le vissage d’un écrou'],['Quelconque','la chute d’une feuille']])}
      <p><b>3. Le sens</b> : il est <b>continu</b> quand le mobile parcourt sa trajectoire toujours dans le même sens ; il est <b>alternatif</b> quand la trajectoire est parcourue tantôt dans un sens, tantôt dans l’autre.</p>
      <p><b>4. La vitesse</b> : l’espace parcouru par unité de temps. Elle est <b>uniforme</b> quand elle reste constante, <b>variée</b> quand elle change.</p>
      ${exbox('m2traj','Quelle est la trajectoire ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m2traj'),'M2traj',{cats:[['r','Rectiligne'],['c','Circulaire'],['h','Hélicoïdale'],['p','Parabolique']],items:[
       ['Le chariot transversal d’un tour','r',''],['Un point de la jante d’une poulie','c',''],['La tête d’une vis que l’on serre','h','Elle tourne et avance à la fois.'],['L’eau qui sort d’un tuyau d’arrosage','p',''],['La tige d’un vérin pneumatique','r',''],['La dent d’une roue dentée','c','']],ok:'Bonnes trajectoires.'})},
    {id:'M2c', sec:'2.4', t:'En guise de synthèse : le système bielle-manivelle', quiz:['M2cq1','M2cq2'], ex:{keys:['M2bm'], lbl:'Les trois mouvements'},
     body:()=>`<p class="lead">Dans un moteur à explosion, le système bielle-manivelle réunit trois mouvements différents.</p>
      <div class="figure" id="m2bm" style="max-width:480px;margin:10px auto"></div>
      ${tbl(['Pièce','Trajectoire','Sens','Vitesse'],[['Le piston','rectiligne','alternatif','variée quelconque'],['La bielle','curviligne','continu','variée quelconque'],['La manivelle','circulaire','continu','uniforme']])}
      <p class="small">Pour classer un mouvement, respecte toujours cet ordre : <b>la trajectoire, le sens, puis la vitesse</b>.</p>
      ${exbox('m2bmx','Classe les mouvements','Pour chaque pièce, choisis la bonne description.')}`,
     mount:root=>{ mountBielle(root); mountSortW(root.querySelector('#m2bmx'),'M2bm',{cats:[['ra','rectiligne · alternatif'],['cc','circulaire · continu'],['cu','curviligne · continu']],items:[
       ['Le piston du moteur','ra','Il va et vient dans le cylindre.'],['La manivelle (le vilebrequin)','cc',''],['La bielle','cu','Son pied suit le piston, sa tête suit la manivelle : sa trajectoire est une courbe.'],['La mâchoire mobile d’un étau qu’on serre puis desserre','ra',''],['Le mandrin d’une perceuse','cc','']],ok:'Bien vu.'}); }},
  ],
  prereq:[{t:'Définir un mobile et un mouvement par rapport à un repère',cap:'M2a'},{t:'Citer les quatre éléments qui déterminent un mouvement',cap:'M2b'},{t:'Classer un mouvement selon sa trajectoire, son sens et sa vitesse',cap:'M2c'}],
});

/* =================== CHAPITRE 3 — LE MOUVEMENT RECTILIGNE UNIFORME =================== */
defMC(3, {
  Q:{
    M3aq1:{q:"Un mobile est animé d’un MRU lorsqu’il parcourt…",o:["en ligne droite, toujours dans le même sens, des espaces égaux en des temps égaux","une ligne droite, à vitesse de plus en plus grande","des espaces égaux, sur n’importe quelle trajectoire"],g:0,e:"Rectiligne = en ligne droite. Uniforme = vitesse constante, donc des espaces égaux en des temps égaux.",r:'M3a'},
    M3aq2:{q:"Dans le SI, la vitesse s’exprime en…",o:["km/h","m/s","m/min"],g:1,e:"e en mètres et t en secondes : v en mètres par seconde (m/s).",r:'M3a'},
    M3bq1:{q:"Pour passer de km/h en m/s, on…",o:["multiplie par 3,6","divise par 3,6","divise par 1 000"],g:1,e:"× 1 000 (km → m) et ÷ 3 600 (h → s) : au total, ÷ 3,6.",r:'M3b'},
    M3bq2:{q:"Combien de secondes dans 1 heure ?",o:["60","600","3 600"],g:2,e:"1 h = 60 min = 60 × 60 s = 3 600 s.",r:'M3b'},
  },
  caps:[
    {id:'M3a', sec:'3.1 — 3.3', t:'Le MRU : définition et formule', quiz:['M3aq1','M3aq2'],
     body:()=>`<p class="lead">Le mobile se déplace par rapport à un point fixe : la <b>trajectoire</b> est une ligne droite (rectiligne) et la <b>vitesse</b> est constante (uniforme).</p>
      ${mcFig(mruSVG(),'Espaces égaux (20 m) en des temps égaux (5 s) : la vitesse est régulière.')}
      ${mcDef('Définition','Un mobile est animé d’un M.R.U. lorsqu’il parcourt <b>en ligne droite</b> et <b>toujours dans le même sens</b> des <b>espaces égaux en des temps égaux</b>.')}
      <div class="tri-row">${fbox('e = v . t','e : espace parcouru (m) — v : vitesse (m/s) — t : temps (s)')}${triangle('e','v','t')}</div>
      <p>Les formules transformées : ${fm('v = e / t')} et ${fm('t = e / v')}.</p>
      ${tbl(['Grandeur','Signification','Unité SI'],[['e','espace parcouru par le mobile','m'],['v','vitesse du mobile','m/s'],['t','temps mis par le mobile','s']])}
      <p class="small">Dans l’exemple du dessin : v = e / t = 20 m / 5 s = <b>4 m/s</b>.</p>`},
    {id:'M3b', sec:'3.4', t:'Les conversions d’unités', quiz:['M3bq1','M3bq2'], ex:{keys:['M3conv','M3hms'], lbl:'Les deux séries de conversions'},
     body:()=>`<p class="lead">Si tu rencontres d’autres unités que celles du SI, convertis-les <b>avant</b> de calculer.</p>
      ${tbl(['Pour transformer…','On…'],[['des km en m','multiplie par 1 000'],['des m en km','divise par 1 000'],['des km/h en m/s','multiplie par 1 000 et divise par 3 600, ou divise par 3,6'],['des m/s en km/h','divise par 1 000 et multiplie par 3 600, ou multiplie par 3,6']])}
      <p><b>1 heure = 60 min = 3 600 s</b> · <b>1 min = 60 s</b>.</p>
      ${exbox('m3conv','Conversions de longueurs et de vitesses','Virgule ou point, comme tu veux.')}
      ${exbox('m3hms','Les heures, minutes et secondes','')}`,
     mount:root=>{
       (v=>mountDrillW(root.querySelector('#m3conv'),'M3conv',{rows:[{q:`${v.mm} mm en m`,unit:'m',ans:v.mm/1000},{q:`${v.cm} cm en m`,unit:'m',ans:v.cm/100},{q:`${v.km} km en m`,unit:'m',ans:v.km*1000},{q:`${v.kmh} km/h en m/s`,unit:'m/s',ans:v.kmh/3.6},{q:`${v.ms} m/s en km/h`,unit:'km/h',ans:v.ms*3.6}],ok:'Conversions maîtrisées.',hint:'km/h ÷ 3,6 = m/s ; m/s × 3,6 = km/h.'}))(vx('M3conv',{mm:[100,250,40,1250],cm:[15,35,8,120],km:[10,2.5,0.8,42],kmh:[80,90,54,120],ms:[30,15,25,2.5]}));
       (v=>mountDrillW(root.querySelector('#m3hms'),'M3hms',{rows:[{q:`${v.a[0]} h ${v.a[1]} min ${v.a[2]} s en secondes`,unit:'s',ans:v.a[0]*3600+v.a[1]*60+v.a[2]},{q:`${v.b[0]} h ${v.b[1]} min en secondes`,unit:'s',ans:v.b[0]*3600+v.b[1]*60},{q:`${v.c} s : combien d’heures entières ?`,unit:'h',ans:Math.floor(v.c/3600)},{q:`${v.c} s : combien de minutes restantes ?`,unit:'min',ans:Math.floor(v.c%3600/60)},{q:`${v.c} s : combien de secondes restantes ?`,unit:'s',ans:v.c%60}],ok:'Parfait.',hint:'Divise d’abord par 3 600 pour les heures ; le reste, divise-le par 60.',intro:'Pour les trois dernières lignes : décompose la durée en heures, minutes et secondes.'}))(vx('M3hms',{a:[[3,36,8],[3,45,30],[2,12,40],[1,5,15]],b:[[4,30],[2,15],[1,45],[3,20]],c:[9342,4800,7385,5530]}));
     }},
    {id:'M3c', sec:'3.5', t:'Exercices sur le MRU', quiz:[], ex:{keys:['M3x1','M3x2','M3x3','M3x4','M3x5','M3x6'], lbl:'Les six exercices'},
     body:()=>`<p class="lead">Pour chaque exercice, remplis les quatre colonnes. Besoin d’une formule ? Ouvre le <b>📐 Formulaire</b> et recopie-la toi-même. Convertis d’abord dans les bonnes unités.</p>
      ${(v=>MX(3,'M3x1',1,`Un piéton qui marche à une allure constante parcourt ${fr(v.e)} km en ${v.t[1]}. Quelle est sa vitesse, en km/h puis en m/s ?`,[{lbl:'v en km/h',unit:'km/h',ans:v.e/v.t[0]},{lbl:'v en m/s',unit:'m/s',ans:v.e/v.t[0]/3.6}],{hint:'Exprime d’abord le temps en heures : 40 min = 40 / 60 h.'}))(vx('M3x1',{e:[8.45,7.2,9.6,6.3],t:[[5/3,'1 h 40 min'],[1.5,'1 h 30 min'],[2,'2 h'],[1.25,'1 h 15 min']]}))}
      ${(v=>MX(3,'M3x2',2,`Un avion qui vole à la vitesse de croisière de ${v.v} km/h effectue un trajet de ${v.e.toLocaleString('fr-BE')} km. Calculer le temps mis pour ce voyage.`,[{lbl:'t',unit:'h',ans:v.e/v.v}]))(vx('M3x2',{v:[850,800,900,750],e:[3750,2400,4500,3000]}))}
      ${(v=>MX(3,'M3x3',3,`Une voiture roule à la vitesse constante de ${v.v} km/h pendant ${v.t} min. Quel espace a-t-elle parcouru ?`,[{lbl:'e',unit:'km',ans:v.v*v.t/60}],{hint:'Le temps doit être en heures si la vitesse est en km/h.'}))(vx('M3x3',{v:[108,90,120,72],t:[95,40,75,25]}))}
      ${(v=>MX(3,'M3x4',4,`On crie dans le puits d’une mine de ${v.e} m de profondeur. La vitesse du son est de 340 m/s. Quel est le temps mis par le son pour arriver au fond du puits ?`,[{lbl:'t',unit:'s',ans:v.e/340}]))(vx('M3x4',{e:[680,850,510,1020]}))}
      ${(v=>MX(3,'M3x5',5,`Pour réaliser un axe au tour, l’outil se déplace de ${v.v} mm/s sur une longueur de ${fr(v.L)} cm. Quel est le temps mis pour ce travail ?`,[{lbl:'t',unit:'s',ans:v.L*10/v.v}],{hint:'Mets la longueur et la vitesse dans la même unité de longueur (mm).'}))(vx('M3x5',{v:[5,4,2.5,8],L:[28.7,32,15,40]}))}
      ${(v=>MX(3,'M3x6',6,`Un ascenseur monte ${v.n} étages de 3 m en ${v.t[1]}. Calculer sa vitesse d’ascension.`,[{lbl:'v',unit:'m/s',ans:v.n*3/v.t[0]}]))(vx('M3x6',{n:[12,8,10,15],t:[[80,'1 min 20 s'],[48,'48 s'],[60,'1 min'],[90,'1 min 30 s']]}))}`},
  ],
  prereq:[{t:'Définir le mouvement rectiligne uniforme',cap:'M3a'},{t:'Écrire la formule du MRU et ses transformations, avec les unités',cap:'M3a'},{t:'Convertir des longueurs, des vitesses et des durées',cap:'M3b'},{t:'Résoudre des problèmes de MRU',cap:'M3c'}],
});

/* =================== CHAPITRE 4 — VITESSE DE COUPE ET VITESSE DE ROTATION =================== */
const nVc = (vc,d) => 1000*vc/(PI*d), n3 = (vc,d) => 1000*vc/(3*d);
defMC(4, {
  Q:{
    M4aq1:{q:"La vitesse de coupe s’exprime en…",o:["tr/min","m/min","m/s"],g:1,e:"La vitesse de coupe est un chemin parcouru en 1 minute : des mètres par minute.",r:'M4a'},
    M4aq2:{q:"Pourquoi divise-t-on par 1 000 dans la formule d’atelier ?",o:["Parce que le diamètre est en mm et que Vc est en m/min","Parce que n est en tr/s","Pour arrondir le résultat"],g:0,e:"π . d . n donne des mm par minute ; ÷ 1 000 pour avoir des m/min.",r:'M4a'},
    M4aq3:{q:"Pour une même vitesse de coupe, une pièce de grand diamètre doit tourner…",o:["plus vite","moins vite","à la même vitesse"],g:1,e:"n = 1000 . Vc / (π . d) : quand d augmente, n diminue.",r:'M4a'},
  },
  caps:[
    {id:'M4a', sec:'4.1 — 4.4', t:'Vitesse de coupe et vitesse de rotation', quiz:['M4aq1','M4aq2','M4aq3'],
     body:()=>`${mcDef('La vitesse de coupe (Vc)','Le chemin parcouru en <b>1 minute</b> par un point du tranchant de l’outil, s’il est en mouvement ; ou le chemin parcouru en 1 minute par un point de la surface travaillée, si l’outil est fixe et que la pièce est en mouvement. Elle s’exprime en <b>mètres par minute</b>.')}
      ${mcDef('La vitesse de rotation (n)','Le nombre de tours effectués par la pièce (ou par l’outil) en <b>1 minute</b>, en tr/min.')}
      ${mcFig(vcSVG(),'Un point A d’une pièce montée sur le tour, qui tourne à n tr/min.')}
      <p>En 1 tour, le point A parcourt la circonférence : π . d. En n tours, il parcourt π . d . n. D’où la formule théorique ${fm('Vc = π . d . n')} (ou ${fm('Vc = 2 . π . r . n')}).</p>
      <p>À l’atelier, le diamètre est en millimètres : on utilise la <b>formule pratique</b>.</p>
      ${fbox('Vc = π . d . n / 1000','Vc : vitesse de coupe (m/min) — d : diamètre (mm) — n : vitesse de rotation (tr/min)')}
      <p>Les formules dérivées : ${fm('n = 1000 . Vc / (π . d)')} et ${fm('d = 1000 . Vc / (π . n)')}.</p>
      <p class="small"><b>Exemple</b> (π arrondi à 3, comme à l’atelier) : un foret de d = 3 mm, Vc = 30 m/min → n = 1000 × 30 / (3 × 3) ≈ <b>3 333 tr/min</b>.</p>
      ${terrain('Sur une perceuse ou un tour, la vitesse de coupe est donnée par le fabricant de l’outil selon la matière usinée. C’est toi qui calcules n, puis qui choisis la vitesse la plus proche sur la machine.')}`},
    {id:'M4b', sec:'4.5', t:'Exercices sur la vitesse de coupe', quiz:[], ex:{keys:['M4x1','M4x2','M4x3','M4x4'], lbl:'Les quatre exercices'},
     body:()=>`<p class="lead">Prends π = 3,14 (le résultat avec π arrondi à 3 est aussi accepté).</p>
      ${(v=>MX(4,'M4x1',1,`Le diamètre à tourner est de ${v.d} mm. La vitesse de coupe employée est de ${v.vc} m/min. À quelle vitesse doit tourner le mandrin ?`,[{lbl:'n',unit:'tr/min',ans:nVc(v.vc,v.d),alt:[n3(v.vc,v.d)]}]))(vx('M4x1',{d:[51,60,38,72],vc:[20,25,18,30]}))}
      ${(v=>MX(4,'M4x2',2,`L’arbre d’une toupie porte un fer de ${v.d} mm de diamètre et tourne à ${v.n} tr/min. Calculer la vitesse de coupe.`,[{lbl:'Vc',unit:'m/min',ans:PI*v.d*v.n/1000,alt:[3*v.d*v.n/1000]}]))(vx('M4x2',{d:[100,120,90,140],n:[60,80,50,70]}))}
      ${(v=>MX(4,'M4x3',3,`Déterminer à quelle vitesse doit tourner la broche d’un tour pour réaliser sur une pièce un diamètre de ${v.d} mm, avec une vitesse de coupe de ${v.vc} m/min.`,[{lbl:'n',unit:'tr/min',ans:nVc(v.vc,v.d),alt:[n3(v.vc,v.d)]}]))(vx('M4x3',{d:[45,50,32,64],vc:[40,35,45,30]}))}
      ${(v=>MX(4,'M4x4',4,`Une fraise mesure ${v.d} cm de diamètre. À quelle vitesse doit-elle tourner pour obtenir une vitesse de coupe de ${v.vc} m/min ?`,[{lbl:'n',unit:'tr/min',ans:nVc(v.vc,v.d*10),alt:[n3(v.vc,v.d*10)]}],{hint:'Le diamètre doit être en millimètres.'}))(vx('M4x4',{d:[5,6,8,4],vc:[18,20,24,15]}))}`},
  ],
  prereq:[{t:'Définir la vitesse de coupe et la vitesse de rotation',cap:'M4a'},{t:'Écrire la formule pratique de la vitesse de coupe et ses formules dérivées',cap:'M4a'},{t:'Calculer une vitesse de rotation ou une vitesse de coupe',cap:'M4b'}],
});

})();
