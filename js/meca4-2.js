/* =========================================================
   MÉCANIQUE 4e — CHAPITRES 5 ET 6
   5 Transmission et transformation des mouvements · 6 Les rapports de transmission
   ========================================================= */
(function(){

/* ---------- 6. un train d'engrenages à deux étages ---------- */
const train2SVG = (z1,z1p,z2,z2p) => `<svg viewBox="0 0 440 200" role="img" aria-label="Train d’engrenages à deux étages">
  <g stroke="var(--ink-2)" stroke-width="6" stroke-dasharray="4 3" fill="var(--surface)">
    <circle cx="70" cy="85" r="24"/><circle cx="166" cy="85" r="66"/><circle cx="262" cy="85" r="22"/><circle cx="349" cy="85" r="58"/></g>
  <g fill="var(--ink)"><circle cx="70" cy="85" r="4"/><circle cx="166" cy="85" r="4"/><circle cx="262" cy="85" r="4"/><circle cx="349" cy="85" r="4"/></g>
  <path d="M166 160 V172 H262 V112" stroke="var(--meca)" stroke-width="3" fill="none" stroke-dasharray="5 3"/>
  <g font-size="12" font-weight="800" text-anchor="middle"><text x="70" y="128" fill="var(--ok)">Z1 = ${z1}</text><text x="166" y="38" fill="var(--bad)">Z’1 = ${z1p}</text><text x="262" y="128" fill="var(--ok)">Z2 = ${z2}</text><text x="349" y="160" fill="var(--bad)">Z’2 = ${z2p}</text></g>
  <g font-size="11" fill="var(--muted)" text-anchor="middle"><text x="70" y="144">arbre menant (N)</text><text x="214" y="188">Z’1 et Z2 : même arbre</text><text x="349" y="176">arbre mené (N’)</text></g></svg>`;

/* =================== CHAPITRE 5 — TRANSMISSION ET TRANSFORMATION =================== */
defMC(5, {
  Q:{
    M5aq1:{q:"Une transmission de mouvement…",o:["change la nature du mouvement","communique le même type de mouvement d’un organe à un autre","supprime le mouvement"],g:1,e:"Transmission : rotation → rotation. Transformation : par exemple rotation → translation.",r:'M5a'},
    M5aq2:{q:"Dans un système pignon-crémaillère, le mouvement est…",o:["transmis","transformé"],g:1,e:"La rotation du pignon devient une translation (mouvement rectiligne) de la crémaillère.",r:'M5a'},
    M5bq1:{q:"Quel mécanisme n’est pas réversible ?",o:["Les roues dentées","Poulies et courroie","Roue et vis sans fin"],g:2,e:"Seule la vis sans fin peut entraîner la roue ; la roue ne peut pas faire tourner la vis : la charge reste bloquée.",r:'M5b'},
    M5bq2:{q:"Un mécanisme comprend 3 roues dentées. La roue menée tourne…",o:["dans le même sens que la menante","en sens inverse"],g:0,e:"Nombre impair de roues : même sens. Nombre pair : sens inverse.",r:'M5b'},
    M5cq1:{q:"Quel mécanisme ne permet aucun glissement mais fait du bruit et doit être lubrifié ?",o:["Les roues de friction","Les roues dentées","Poulies et courroie"],g:1,e:"Les dents empêchent tout glissement ; en contrepartie : bruit, vibrations, lubrification, ajustement précis.",r:'M5c'},
    M5cq2:{q:"Pour transmettre une rotation entre deux arbres éloignés, sans bruit, on choisit plutôt…",o:["des poulies et une courroie","des roues dentées","une roue et une vis sans fin"],g:0,e:"La courroie permet de grandes distances entre axes et fait peu de bruit.",r:'M5c'},
  },
  caps:[
    {id:'M5a', sec:'5.1 — 5.3', t:'Transmettre ou transformer un mouvement', quiz:['M5aq1','M5aq2'], ex:{keys:['M5tt'], lbl:'Le classement'},
     body:()=>`<p class="lead">La <b>transmission</b> communique le même type de mouvement d’un composant à un autre ; la <b>transformation</b> change la nature du mouvement.</p>
      ${mcDef('Transmission de mouvement','C’est la communication d’un mouvement d’un organe (l’<b>organe menant</b>) à un autre (l’<b>organe mené</b>) <b>sans en changer la nature</b> : rotation à rotation, ou translation à translation.')}
      <p>Exemples : des <b>roues dentées</b> (une roue entraîne l’autre par le contact de leurs dents), des <b>poulies et une courroie</b>, des <b>chaînes et pignons</b>.</p>
      ${mcDef('Transformation de mouvement','C’est une action mécanique qui <b>change la nature du mouvement</b> : rotation en translation, ou translation en rotation. L’organe menant et l’organe mené font des mouvements différents.')}
      ${tbl(['Exemple','Ce qui se passe'],[['Vis et écrou','la vis tourne (rotation), l’écrou avance (translation)'],['Bielle-manivelle','la rotation de la manivelle devient un va-et-vient (rectiligne alternatif)'],['Pignon et crémaillère','la rotation du pignon devient un mouvement rectiligne de la crémaillère']])}
      ${exbox('m5tt','Transmission ou transformation ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m5tt'),'M5tt',{cats:[['tm','Transmission'],['tf','Transformation']],items:[
       ['La chaîne d’un vélo entre le plateau et le pignon','tm','Rotation → rotation.'],['Le vérin à vis qui soulève une voiture','tf','Rotation de la vis → translation de la charge.'],['La courroie entre le moteur et le ventilateur','tm',''],['Le pignon et la crémaillère d’une perceuse à colonne','tf','La rotation du levier fait descendre la broche.'],['Le vilebrequin et les bielles d’un compresseur à piston','tf','Rotation → va-et-vient des pistons.'],['Le réducteur à roues dentées d’un convoyeur','tm','']],ok:'Bien classé.'})},
    {id:'M5b', sec:'5.4', t:'Les cinq mécanismes de transmission', quiz:['M5bq1','M5bq2'], ex:{keys:['M5sens'], lbl:'Les sens de rotation'},
     body:()=>`<p class="lead">Les mécanismes de transmission conservent le type de mouvement entre l’organe menant et l’organe mené : une rotation entraîne une rotation.</p>
      ${tbl(['Mécanisme','Fonctionnement','Réversible ?'],[['Roues de friction','la roue menante entraîne la roue menée grâce au <b>frottement</b> entre les deux roues','oui'],['Poulies et courroie','la poulie menante entraîne la poulie menée par l’intermédiaire de la <b>courroie</b>','oui'],['Roues dentées (engrenage)','les dents de la roue menante poussent sur celles de la roue menée','oui'],['Chaîne et roues dentées','la roue menante entraîne la roue menée par l’intermédiaire de la <b>chaîne</b>','oui'],['Roue et vis sans fin','les filets de la vis poussent sur les dents de la roue','<b>non</b>']])}
      <h3>Le sens de rotation</h3>
      <div class="figure" id="m5train" style="max-width:480px;margin:10px auto"></div>
      <ul><li><b>Roues de friction, roues dentées</b> : avec un nombre <b>impair</b> de roues, la menée tourne dans le même sens que la menante ; avec un nombre <b>pair</b>, en sens inverse.</li>
        <li><b>Poulies et courroie</b> : les poulies situées du même côté de la courroie tournent dans le même sens. Celles qui sont à l’intérieur tournent en sens inverse de celles qui sont à l’extérieur. Une <b>courroie croisée</b> inverse le sens.</li>
        <li><b>Chaîne</b> : les roues à l’intérieur de la chaîne tournent dans le même sens ; une roue à l’extérieur de la chaîne tourne en sens inverse.</li>
        <li><b>Vis sans fin</b> : on ne compare pas les sens, car l’axe de la vis est perpendiculaire à l’axe de la roue.</li></ul>
      <p>Tous ces mécanismes (sauf la vis sans fin, qui réduit toujours) peuvent <b>changer la vitesse</b> quand le diamètre de la roue menante et celui de la roue menée sont différents. Les roues de friction, les poulies et les roues dentées <b>coniques</b> permettent aussi de changer l’axe du mouvement (par exemple d’un axe vertical à un axe horizontal, comme dans le différentiel d’une voiture).</p>
      ${exbox('m5sens','Même sens ou sens inverse ?','Compare le sens de la roue menée à celui de la roue menante.')}`,
     mount:root=>{ mountTrainLab(root,'m5train'); mountSortW(root.querySelector('#m5sens'),'M5sens',{cats:[['m','Même sens'],['i','Sens inverse']],items:[
       ['Deux roues dentées qui engrènent','i','Nombre pair de roues.'],['Trois roues dentées en ligne','m','Nombre impair : la roue intermédiaire rétablit le sens.'],['Deux poulies reliées par une courroie ouverte','m',''],['Deux poulies reliées par une courroie croisée','i',''],['La dynamo de vélo, contre la roue','i','Deux roues de friction en contact.'],['Le plateau et le pignon d’un vélo (chaîne)','m','Les deux roues sont à l’intérieur de la chaîne.']],ok:'Tous les sens sont justes.'}); }},
    {id:'M5c', sec:'5.5', t:'Avantages et inconvénients', quiz:['M5cq1','M5cq2'], ex:{keys:['M5av'], lbl:'Quel mécanisme ?'},
     body:()=>`${tbl(['Mécanisme','Avantages','Inconvénients'],[
        ['Roues de friction','modifie la vitesse ; peut changer l’axe ; peu de bruit ; simple et bon marché','glissement et usure des roues ; assemblage précis'],
        ['Poulies et courroie','modifie la vitesse ; peut changer l’axe ; axes éloignés ; peu de bruit ; mouvement fluide (élasticité de la courroie)','glissement ; usure et saletés ; craint les températures extrêmes ; tension à régler régulièrement'],
        ['Roues dentées','modifie la vitesse ; aucun glissement ; très petite taille possible, grande précision','bruit et vibrations ; lubrification ; coûteux, ajustement précis ; ne supporte aucune impureté'],
        ['Chaîne et roues dentées','modifie la vitesse ; aucun glissement ; axes éloignés','bruit et vibrations ; lubrification ; tension à régler ; déraille si mal tendue ; axes rigoureusement parallèles'],
        ['Roue et vis sans fin','très grande réduction de vitesse ; aucun glissement ; mouvement très précis','coûteux, ajustement précis ; s’use vite (frottement des filets)']])}
      <p class="small">Pour limiter le glissement d’une courroie, on augmente sa tension, ou on choisit une <b>courroie crantée</b> (avec des dents) ou une courroie trapézoïdale dans des poulies à gorge.</p>
      ${terrain('Courroie qui siffle au démarrage ? Elle patine : tension à vérifier. Chaîne qui claque ou saute ? Tension et usure des dents à contrôler. Ces réglages font partie de la maintenance préventive que tu feras toi-même.')}
      ${exbox('m5av','Quel mécanisme correspond ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m5av'),'M5av',{cats:[['co','Courroie'],['en','Engrenage'],['ch','Chaîne'],['vs','Vis sans fin']],items:[
       ['Il faut régler sa tension ; il craint le froid et la chaleur extrêmes','co',''],['Il peut dérailler s’il n’est pas assez tendu','ch',''],['Il ne glisse pas, est très compact, mais ne supporte aucune impureté','en',''],['Il donne une très grande réduction et bloque la charge','vs','Non réversible.'],['Il amortit les à-coups grâce à son élasticité','co','']],ok:'Bien vu.'})},
  ],
  prereq:[{t:'Distinguer transmission et transformation de mouvement',cap:'M5a'},{t:'Décrire le fonctionnement et la réversibilité des cinq mécanismes de transmission',cap:'M5b'},{t:'Prévoir le sens de rotation de l’organe mené',cap:'M5b'},{t:'Citer les avantages et les inconvénients de chaque mécanisme',cap:'M5c'}],
});

/* =================== CHAPITRE 6 — LES RAPPORTS DE TRANSMISSION =================== */
defMC(6, {
  Q:{
    M6aq1:{q:"Dans une transmission par courroie, la petite poulie tourne…",o:["plus vite que la grande","moins vite que la grande","à la même vitesse"],g:0,e:"d . N = d’ . N’ : le produit est constant, donc le plus petit diamètre a la plus grande vitesse.",r:'M6a'},
    M6aq2:{q:"Un glissement de 3 à 5 % est normal pour…",o:["une courroie","des roues de friction","des roues dentées"],g:0,e:"Courroie : 3 à 5 %. Roues de friction : 10 à 15 %. Roues dentées et chaîne : aucun glissement.",r:'M6a'},
    M6bq1:{q:"Le rapport de transmission d’un train d’engrenages vaut…",o:["le produit des dents menées / le produit des dents menantes","le produit des dents menantes / le produit des dents menées","la somme de toutes les dents"],g:1,e:"R = N’ / N = (Z1 . Z2 . Z3) / (Z’1 . Z’2 . Z’3).",r:'M6b'},
    M6bq2:{q:"À quoi sert une roue intermédiaire entre deux roues dentées ?",o:["À changer le rapport","À inverser le sens de rotation","À supprimer le glissement"],g:1,e:"Quel que soit son nombre de dents, elle ne change pas le rapport : elle rétablit le même sens de rotation.",r:'M6b'},
    M6cq1:{q:"Une vis sans fin à une entrée tourne d’un tour. La roue avance de…",o:["une dent","un tour","la moitié d’un tour"],g:0,e:"Pour chaque tour de vis, il passe une dent par entrée. Une vis à 4 entrées se comporte comme un pignon de 4 dents.",r:'M6c'},
    M6cq2:{q:"Pour un tour du pignon, la crémaillère avance de…",o:["π . d","2 . d","d / 2"],g:0,e:"La crémaillère avance de la circonférence primitive du pignon : e = π . d.",r:'M6c'},
  },
  caps:[
    {id:'M6a', sec:'6.1', t:'Poulies, courroies et roues de friction', quiz:['M6aq1','M6aq2'], ex:{keys:['M6x1','M6x2'], lbl:'Les deux exercices'},
     body:()=>`<p class="lead">Dans une transmission par lien flexible (courroie) ou par friction, le produit du diamètre par la vitesse est le même pour les deux poulies.</p>
      <div class="figure" id="m6belt" style="max-width:480px;margin:10px auto"></div>
      <div class="tri-row">${fbox('d . N = d’ . N’','d : diamètre de la poulie menante — d’ : de la poulie menée — N, N’ : leurs vitesses (tr/min)')}</div>
      <p>Le <b>rapport de transmission</b> : ${fm('R = N’ / N')}. On en tire ${fm('N’ = N . d / d’')}.</p>
      ${tbl(['','Poulies et courroies','Roues de friction'],[['Vitesse','la petite poulie tourne plus vite que la grande','la petite roue tourne plus vite que la grande'],['Glissement','3 à 5 % (force centrifuge, matelas d’air entre poulie et courroie)','10 à 15 % : important'],['Pour y remédier','augmenter le diamètre de la poulie menante ou diminuer celui de la menée ; courroies trapézoïdales et poulies à gorge','augmenter le diamètre de la roue menante ou diminuer celui de la menée'],['Sens','même sens avec une courroie ouverte, sens contraire avec une courroie croisée','sens contraire ; même sens avec une roue intermédiaire'],['Condition','—','une compression qui rapproche les deux axes']])}
      <p class="small">Avec une poulie étagée (plusieurs diamètres d₁, d₂, d₃ sur le même arbre), N reste constant et N’ prend plusieurs valeurs : ${fm('N’1 = N . d1 / d’1')}, ${fm('N’2 = N . d2 / d’2')}…</p>
      ${(v=>MX(6,'M6x1',1,`Un moteur tourne à ${v.N} tr/min. Sa poulie mesure ${v.d} mm de diamètre ; la poulie menée, ${v.dp} mm. À quelle vitesse tourne la poulie menée (sans tenir compte du glissement) ?`,[{lbl:'N’',unit:'tr/min',ans:v.N*v.d/v.dp}]))(vx('M6x1',{N:[1450,1440,2880,960],d:[120,100,80,150],dp:[300,250,200,360]}))}
      ${(v=>MX(6,'M6x2',2,`Un ventilateur doit tourner à ${v.Np} tr/min. Il est entraîné par un moteur à ${v.N} tr/min, dont la poulie mesure ${v.d} mm. Quel diamètre faut-il pour la poulie du ventilateur ? Calcule aussi le rapport de transmission.`,[{lbl:'d’',unit:'mm',ans:v.d*v.N/v.Np},{lbl:'R',unit:'',ans:v.Np/v.N}]))(vx('M6x2',{Np:[720,960,480,600],N:[1440,2880,1440,1200],d:[100,90,80,150]}))}`,
     mount:root=>mountBeltLab(root,'m6belt')},
    {id:'M6b', sec:'6.2', t:'Roues dentées, chaînes et trains d’engrenages', quiz:['M6bq1','M6bq2'], ex:{keys:['M6x3','M6x4','M6x5'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Avec des liens rigides (roues dentées, chaîne), on compte des <b>dents</b> au lieu de mesurer des diamètres.</p>
      ${fbox('Z . N = Z’ . N’','Z : nombre de dents de la roue menante — Z’ : de la roue menée — N, N’ : leurs vitesses (tr/min)')}
      <p>Les transformations : ${fm('N’ = Z . N / Z’')}, ${fm('Z’ = Z . N / N’')}, ${fm('Z = Z’ . N’ / N')}.</p>
      ${tbl(['','Roues dentées et chaîne','Engrenages'],[['Utilisation','longues distances d’axe en axe','courtes distances d’axe en axe'],['Modèles','chaînes calibrées, chaînes Galle, chaînes silencieuses','cylindriques droits ou hélicoïdaux, coniques droits ou spiroïdaux'],['Particularités','pas de glissement ; pas de traction initiale de la chaîne ; un seul sens de marche','pas de glissement ; pas de compression initiale ; deux sens de marche possibles, en intercalant une roue intermédiaire Zi']])}
      <p>Quelle que soit la forme des roues ou de la chaîne, <b>la loi ne change pas</b>.</p>
      <h3>Les trains d’engrenages</h3>
      ${mcFig(train2SVG(20,60,18,54),'Deux étages : la roue Z’1 et le pignon Z2 sont calés sur le même arbre et tournent ensemble.')}
      <p>Pour une succession de trains Z1/Z’1, Z2/Z’2, Z3/Z’3, on calcule les vitesses de proche en proche : ${fm('n = N . Z1 / Z’1')}, puis ${fm('m = n . Z2 / Z’2')}… D’où :</p>
      ${fbox('R = N’ / N = (Z1 . Z2 . Z3) / (Z’1 . Z’2 . Z’3)','R = produit des dents menantes / produit des dents menées')}
      ${(v=>MX(6,'M6x3',3,`Un pignon de ${v.z} dents tourne à ${v.N} tr/min et entraîne une roue de ${v.zp} dents. À quelle vitesse tourne la roue ?`,[{lbl:'N’',unit:'tr/min',ans:v.z*v.N/v.zp}]))(vx('M6x3',{z:[18,20,15,24],N:[1450,960,1440,720],zp:[54,80,45,60]}))}
      ${(v=>MX(6,'M6x4',4,`La chaîne d’une transmission relie un pignon moteur de ${v.z} dents, qui tourne à ${v.N} tr/min, à une roue qui doit tourner à ${v.Np} tr/min. Combien de dents faut-il à cette roue ?`,[{lbl:'Z’',unit:'dents',ans:v.z*v.N/v.Np}]))(vx('M6x4',{z:[15,12,16,20],N:[480,600,360,450],Np:[120,150,96,180]}))}
      ${(v=>MX(6,'M6x5',5,`Un réducteur à deux étages : Z1 = ${v.a[0]} dents (sur l’arbre moteur), Z’1 = ${v.a[1]} dents, Z2 = ${v.a[2]} dents, Z’2 = ${v.a[3]} dents. Le moteur tourne à ${v.N} tr/min. Calcule le rapport de transmission, puis la vitesse de l’arbre de sortie.`,[{lbl:'R',unit:'',ans:v.a[0]*v.a[2]/(v.a[1]*v.a[3]),tol:0.01},{lbl:'N’',unit:'tr/min',ans:v.N*v.a[0]*v.a[2]/(v.a[1]*v.a[3])}],{hint:'R = (Z1 . Z2) / (Z’1 . Z’2), puis N’ = N . R.'}))(vx('M6x5',{a:[[20,60,18,54],[15,45,20,80],[24,72,16,64],[18,54,15,60]],N:[1440,1450,960,2880]}))}`},
    {id:'M6c', sec:'6.3', t:'Vis sans fin, crémaillère et tambour', quiz:['M6cq1','M6cq2'], ex:{keys:['M6x6','M6x7','M6x8'], lbl:'Les trois exercices'},
     body:()=>`<h3>Le système vis et roue à vis</h3>
      <p>Il est utilisé pour de <b>fortes réductions de vitesse</b> entre deux arbres orthogonaux (perpendiculaires) et rapprochés. La vis comporte Z entrées et tourne à N tr/min ; elle attaque une roue de Z’ dents qui tourne à N’ tr/min. La loi reste ${fm('Z . N = Z’ . N’')}.</p>
      <ul><li><b>Vis à une seule entrée</b> : pour chaque tour de vis, il passe une dent de la roue. La roue tourne donc Z’ fois moins vite que la vis.</li>
        <li><b>Vis à plusieurs entrées</b> : avec 4 entrées, il passe 4 dents par tour de vis. La vis se comporte comme un pignon de 4 dents.</li></ul>
      <h3>Pignon et crémaillère</h3>
      <p>La rotation du pignon entraîne la crémaillère dans un mouvement rectiligne continu. Pour un tour du pignon, la crémaillère avance de ${fm('e = π . d')} (d = diamètre primitif du pignon).</p>
      <h3>Tambour et câble</h3>
      ${tbl(['Cas','Montage','Vitesse du crochet'],[['A — levée sur un seul brin','le crochet est suspendu à l’extrémité libre du câble','égale à la vitesse circonférentielle du tambour : '+fm('V = π . d . n / 60')],['B — levée sur deux brins','l’extrémité du câble est attachée à un point fixe F ; le crochet est fixé sur l’axe d’une poulie','moitié de la vitesse circonférentielle : '+fm('V = (1 / 2) . π . d . n / 60')]])}
      <p class="small">V en m/s, d en m, n en tr/min (le 60 transforme les minutes en secondes).</p>
      ${(v=>MX(6,'M6x6',6,`Une vis sans fin à ${v.z} entrée${v.z>1?'s':''} tourne à ${v.N} tr/min et entraîne une roue de ${v.zp} dents. À quelle vitesse tourne la roue ?`,[{lbl:'N’',unit:'tr/min',ans:v.z*v.N/v.zp}]))(vx('M6x6',{z:[1,2,1,4],N:[1450,1440,960,1500],zp:[50,40,30,60]}))}
      ${(v=>MX(6,'M6x7',7,`Le pignon d’une perceuse à colonne a un diamètre primitif de ${v.d} mm. De combien la crémaillère (et donc la broche) descend-elle quand on fait faire ${v.t} tour${v.t>1?'s':''} au pignon ?`,[{lbl:'e',unit:'mm',ans:PI*v.d*v.t}],{hint:'Un tour : π . d. Plusieurs tours : multiplie.'}))(vx('M6x7',{d:[24,30,20,36],t:[1,2,0.5,1.5]}))}
      ${(v=>MX(6,'M6x8',8,`Le tambour d’un treuil électrique mesure ${fr(v.d)} m de diamètre et tourne à ${v.n} tr/min. Le crochet est suspendu à l’extrémité du câble (levée sur un seul brin). Calcule la vitesse de levée du crochet, puis cette vitesse si on lève sur deux brins.`,[{lbl:'V sur un brin',unit:'m/s',ans:PI*v.d*v.n/60},{lbl:'V sur deux brins',unit:'m/s',ans:PI*v.d*v.n/120}]))(vx('M6x8',{d:[0.3,0.25,0.4,0.2],n:[20,24,15,30]}))}`},
  ],
  prereq:[{t:'Appliquer la loi d . N = d’ . N’ aux poulies et aux roues de friction',cap:'M6a'},{t:'Citer les causes du glissement et les moyens d’y remédier',cap:'M6a'},{t:'Appliquer la loi Z . N = Z’ . N’ aux roues dentées et aux chaînes',cap:'M6b'},{t:'Calculer le rapport d’un train d’engrenages',cap:'M6b'},{t:'Calculer une vitesse avec une vis sans fin, une crémaillère ou un tambour',cap:'M6c'}],
});

})();
