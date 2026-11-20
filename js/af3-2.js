/* =========================================================
   ÉLECTRICITÉ 3QEM — CHAPITRES 6 À 11
   6 Quantité d'électricité · 7 Pouillet · 8 Ohm · 9 Mathiessen
   10 Puissance · 11 Effet Joule
   À partir d'ici, chaque exercice chiffré se fait dans le tableau
   Données · Inconnue · Formule · Solution (js/formules.js).
   ========================================================= */
(function(){
const ALPHA_CU=3.93e-3, ALPHA_C=-0.4e-3;
const lcd = (v,u,mode) => `<div class="meter" style="max-width:260px;margin:0 auto"><div class="lcd">${v}<small> ${u}</small></div><div class="mode">${mode}</div></div>`;
const selRow = (lbl, key, opts, cur) => `<div class="row wrap" style="gap:6px;align-items:center"><span class="small" style="min-width:90px"><b>${lbl}</b></span><div class="seg">${opts.map(([v,l])=>`<button class="${String(cur)===String(v)?'on':''}" data-${key}="${v}">${l}</button>`).join('')}</div></div>`;

/* ---------- 7. le panneau de Pouillet et son ohmmètre ---------- */
const MAT = { crni:['Chrome-nickel',1], feni:['Ferro-nickel',0.8], cu:['Cuivre',0.01725] };
function mountPouillet(root){
  const box=root.querySelector('#a7lab'), st=WS.a7lab||(WS.a7lab={m:'crni',L:1,S:1});
  const draw=()=>{ const R=MAT[st.m][1]*st.L/st.S;
    box.innerHTML=`<div class="grid g2" style="gap:14px;align-items:center"><div class="stack" style="gap:8px">
        ${selRow('Matière','pm',Object.entries(MAT).map(([k,[l]])=>[k,l]),st.m)}${selRow('Longueur','pl',[[1,'1 m'],[2,'2 m'],[3,'3 m']],st.L)}${selRow('Section','ps',[[1,'1 mm²'],[2,'2 mm²'],[3,'3 mm²']],st.S)}</div>
      <div>${lcd(frN(R,3).replace(/\s/g,' '),'Ω','ohmmètre entre A et B')}</div></div>`;
    box.querySelectorAll('[data-pm]').forEach(b=>b.onclick=()=>{ st.m=b.dataset.pm; draw(); });
    box.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{ st.L=+b.dataset.pl; draw(); });
    box.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>{ st.S=+b.dataset.ps; draw(); }); };
  draw();
}
/* ---------- 8. l'expérience d'Ohm : générateur, résistance, ampèremètre ---------- */
function mountOhmX(root){
  const box=root.querySelector('#a8lab'), st=WS.a8lab||(WS.a8lab={U:4.5,R:20});
  const draw=()=>{ const I=st.U/st.R;
    box.innerHTML=`<div class="grid g2" style="gap:14px;align-items:center"><div class="stack" style="gap:8px">${selRow('Générateur','ou',[[4.5,'4,5 V'],[9,'9 V']],st.U)}${selRow('Résistance','or',[[20,'20 Ω'],[50,'50 Ω'],[100,'100 Ω']],st.R)}
      <p class="small muted" style="margin:4px 0 0">Les fils et le générateur ont une résistance négligeable.</p></div><div>${lcd(frN(I,3),'A','ampèremètre en série')}</div></div>`;
    box.querySelectorAll('[data-ou]').forEach(b=>b.onclick=()=>{ st.U=+b.dataset.ou; draw(); });
    box.querySelectorAll('[data-or]').forEach(b=>b.onclick=()=>{ st.R=+b.dataset.or; draw(); }); };
  draw();
}

/* =================== CHAPITRE 6 — LA QUANTITÉ D'ÉLECTRICITÉ =================== */
defAF(6, {
  Q:{
    A6aq1:{q:"Une batterie porte l’indication 5 Ah. Que peut-elle fournir ?",o:["1 A pendant 5 heures, ou 5 A pendant 1 heure","5 A pendant 5 heures","5 V pendant 1 heure"],g:0,e:"Q = I . t : 1 A × 5 h = 5 A × 1 h = 5 Ah.",r:'A6a'},
    A6aq2:{q:"Le temps est donné en secondes. Dans quelle unité obtiens-tu Q ?",o:["En ampères-heures (Ah)","En coulombs (Cb)","En volts"],g:1,e:"I en A et t en s : Q en coulombs (ampères-secondes). I en A et t en h : Q en ampères-heures.",r:'A6a'},
    A6aq3:{q:"Combien de coulombs dans 1 Ah ?",o:["60 Cb","1 000 Cb","3 600 Cb"],g:2,e:"Une heure compte 3 600 secondes : 1 Ah = 1 A × 3 600 s = 3 600 Cb.",r:'A6a'},
  },
  caps:[
    {id:'A6a', sec:'6.1', t:'La quantité d’électricité', quiz:['A6aq1','A6aq2','A6aq3'], ex:{keys:['A6conv'], lbl:'Les conversions'},
     body:()=>`${progRef(['Citer les unités usuelles et normalisées de quantité d’électricité (CM2D)','Citer la formule de la quantité d’électricité (CM2D)','Résoudre des problèmes relatifs à cette loi (CM2D)'],'p. 25')}
      <p class="lead">Faisons une analogie entre le courant d’une rivière et le courant électrique.</p>
      ${tbl(['Courant d’eau','Courant électrique'],[['Le débit, en m³/s : le volume d’eau qui s’écoule par unité de temps','L’intensité I, en ampères (A) : le nombre d’électrons qui se déplacent par seconde dans le conducteur']])}
      <p>La quantité d’électricité <b>Q</b> est le nombre d’électrons transportés par un courant électrique I pendant un temps donné t.</p>
      <div class="tri-row">${fbox('Q = I . t','I : intensité (A) — t : temps (s ou h) — Q : quantité d’électricité')}${triangle('Q','I','t')}</div>
      <p>L’unité n’est pas l’électron, bien trop petit, mais le <b>coulomb</b> (Cb) : 1 Cb = 6,25 · 10¹⁸ électrons, et 1 Cb = 1 A × 1 s. La charge d’un électron vaut donc 1,6 · 10⁻¹⁹ Cb.</p>
      <p>L’unité industrielle est l’<b>ampère-heure</b> (Ah). 5 Ah, c’est la quantité transportée en 5 heures par un courant de 1 A, ou en 1 heure par un courant de 5 A. Une heure comptant 3 600 secondes : <b>1 Ah = 3 600 Cb</b>.</p>
      ${tbl(['Q s’exprime en…','si…'],[['coulombs (Cb)','I en ampères (A) et t en secondes (s)'],['ampères-heures (Ah)','I en ampères (A) et t en heures (h)']])}
      <p class="small">L’ampère est donc l’intensité du courant qui transporte 1 coulomb (6,25 · 10¹⁸ électrons) par seconde.</p>
      ${exbox('a6conv','Échauffement : les conversions','Virgule ou point, comme tu veux.')}`,
     mount:root=>mountDrillW(root.querySelector('#a6conv'),'A6conv',{rows:[{q:'1 heure en secondes',unit:'s',ans:3600},{q:'2 h 30 en heures',unit:'h',ans:2.5},{q:'45 minutes en heures',unit:'h',ans:0.75},{q:'2 Ah en coulombs',unit:'Cb',ans:2*3600},{q:'7 200 Cb en ampères-heures',unit:'Ah',ans:7200/3600}],ok:'Prêt pour les exercices.',hint:'1 h = 60 min = 3 600 s ; 1 Ah = 3 600 Cb.'})},
    {id:'A6b', sec:'6.2', t:'Exercices', quiz:[], ex:{keys:['A6x1','A6x2','A6x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Pour chaque exercice, remplis les quatre colonnes. Besoin d’une formule ? Ouvre le <b>📐 Formulaire</b> et recopie-la toi-même.</p>
      ${AX(6,'A6x1',1,'Une trottinette électrique est rechargée par un courant constant de 2 A pendant 4 h. Calculer la quantité d’électricité fournie à la batterie, en ampères-heures puis en coulombs.',[{lbl:'Q en ampères-heures',unit:'Ah',ans:2*4},{lbl:'Q en coulombs',unit:'Cb',ans:2*4*3600}],{hint:'Pour les coulombs, le temps doit être en secondes.'})}
      ${AX(6,'A6x2',2,'La batterie d’un vélo électrique (e-bike) reçoit une charge de 10 Ah en 2 h 30 (2,5 h). Quelle est l’intensité moyenne du courant de charge ?',[{lbl:'I',unit:'A',ans:10/2.5}])}
      ${AX(6,'A6x3',3,'Un smartphone possède une batterie de capacité 4 Ah (4 000 mAh). Il se recharge avec un courant moyen de 2 A. Combien de temps faut-il pour le recharger complètement ?',[{lbl:'t',unit:'h',ans:4/2}])}`},
  ],
  prereq:[{t:'Établir l’analogie entre courant d’eau et courant électrique',cap:'A6a'},{t:'Définir la quantité d’électricité Q et son unité, le coulomb',cap:'A6a'},{t:'Convertir une quantité d’électricité entre coulombs et ampères-heures',cap:'A6a'},{t:'Résoudre des exercices chiffrés faisant intervenir Q, I et t',cap:'A6b'}],
});

/* =================== CHAPITRE 7 — LA LOI DE POUILLET =================== */
defAF(7, {
  Q:{
    A7aq1:{q:"On double la longueur d’un conducteur. Sa résistance…",o:["double","est divisée par deux","ne change pas"],g:0,e:"La résistance est directement proportionnelle à la longueur.",r:'A7a'},
    A7aq2:{q:"On double la section d’un conducteur. Sa résistance…",o:["double","est divisée par deux","ne change pas"],g:1,e:"La résistance est inversement proportionnelle à la section.",r:'A7a'},
    A7bq1:{q:"Quel métal de ce tableau conduit le mieux ?",o:["Le fer (0,1)","L’aluminium (0,028)","L’argent (0,016)"],g:2,e:"Plus la résistivité ρ est petite, mieux le métal conduit. Le cuivre (0,01725) suit de près l’argent, pour bien moins cher.",r:'A7b'},
    A7bq2:{q:"Pour calculer la section d’un fil rond à partir de son diamètre d, on utilise…",o:["S = π . d","S = π . d² / 4","S = d / 2"],g:1,e:"S = π . r², et comme r = d / 2 : S = π . d² / 4.",r:'A7b'},
  },
  caps:[
    {id:'A7a', sec:'7.1 — 7.4', t:'Les expériences de Pouillet', quiz:['A7aq1','A7aq2'], ex:{keys:['A7tab'], lbl:'Le tableau des résultats'},
     body:()=>`${progRef(['Citer la loi de Pouillet et les unités correspondantes (CM2D)','Résoudre des problèmes relatifs à cette loi (CM2D)','Citer les conducteurs et isolants usuels (CM2D)'],'p. 26')}
      <p class="lead">Sur un panneau, des conducteurs sont raccordés entre deux points A et B. À l’ohmmètre, on mesure leur résistance en changeant un seul critère à la fois : la longueur, la section, puis la matière.</p>
      <div class="figure" id="a7lab"></div>
      ${exbox('a7tab','Complète le tableau des résultats','Règle le panneau ci-dessus et relève la mesure de l’ohmmètre.')}
      <h3>Conclusions</h3>
      <p>La résistance électrique d’un conducteur homogène de section uniforme est :</p>
      <ul><li><b>directement proportionnelle à sa longueur</b> ;</li><li><b>inversement proportionnelle à sa section</b> ;</li><li><b>dépendante de sa nature</b>.</li></ul>
      <div class="tri-row">${fbox('R = ρ . L / S','R : résistance (Ω) — ρ : résistivité de la matière (Ω·mm²/m) — L : longueur (m) — S : section (mm²)')}${triangle('ρ . L','R','S')}</div>
      <p class="small muted">Dans le triangle, le haut est le produit ρ.L : cache R, ρ.L ou S, il reste l’opération à faire avec les deux autres. Formules dérivées : ${fm('L = R . S / ρ')} et ${fm('S = ρ . L / R')}.</p>`,
     mount:root=>{ mountPouillet(root);
       const r=(m,L,S)=>MAT[m][1]*L/S;
       mountDrillW(root.querySelector('#a7tab'),'A7tab',{rows:[
         {q:'Chrome-nickel · 1 m · 1 mm²',unit:'Ω',ans:r('crni',1,1)},{q:'Chrome-nickel · 2 m · 1 mm²',unit:'Ω',ans:r('crni',2,1)},{q:'Chrome-nickel · 3 m · 1 mm²',unit:'Ω',ans:r('crni',3,1)},
         {q:'Chrome-nickel · 1 m · 2 mm²',unit:'Ω',ans:r('crni',1,2)},{q:'Chrome-nickel · 1 m · 3 mm²',unit:'Ω',ans:r('crni',1,3)},
         {q:'Ferro-nickel · 1 m · 1 mm²',unit:'Ω',ans:r('feni',1,1)},{q:'Cuivre · 1 m · 1 mm²',unit:'Ω',ans:r('cu',1,1)}],ok:'Longueur × 2 : résistance × 2. Section × 2 : résistance ÷ 2. Et la matière change tout.'}); }},
    {id:'A7b', sec:'7.5 — 7.6', t:'La section et les résistivités', quiz:['A7bq1','A7bq2'], ex:null,
     body:()=>`<h3>Rappel de géométrie</h3><p>Pour calculer la section d’un conducteur rond :</p>
      <div class="grid g2" style="gap:10px">${fbox('S = π . r^2','r : rayon du conducteur')}${fbox('S = π . d^2 / 4','d : diamètre du conducteur')}</div>
      <h3>Quelques valeurs de ρ à 20 °C</h3>
      <div class="grid g2" style="gap:12px">${tbl(['Métal','ρ (Ω·mm²/m)'],[['Argent','0,016'],['Cuivre','0,01725'],['Aluminium','0,028'],['Tungstène','0,056'],['Fer','0,1'],['Mercure','0,958']])}
      ${tbl(['Alliage','ρ (Ω·mm²/m)','Composition'],[['Bronze','0,067','Cu + Sn'],['Laiton','0,07','Cu + Zn'],['Maillechort','0,25','Cu + Zn + Ni'],['Manganine','0,42','Cu + Mn + Ni'],['Ferro-nickel','0,8','Fe + Ni'],['Nickel-chrome','1','Ni + Cr + Fe']])}</div>
      <p class="small muted">Ces tableaux sont aussi dans le 📐 Formulaire. Dans les exercices, on prend souvent ρ = 0,0175 pour le cuivre : utilise toujours la valeur donnée dans l’énoncé.</p>
      ${terrain('Un câble trop long ou trop fin, c’est une résistance de trop : il chauffe et la tension n’arrive pas entière au récepteur. C’est Pouillet qui te dit quelle section choisir.')}`},
    {id:'A7c', sec:'7.7', t:'Exercices', quiz:[], ex:{keys:['A7x1','A7x2','A7x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Données, inconnue, formule, solution. Attention aux unités : L en mètres, S en mm².</p>
      ${AX(7,'A7x1',1,'Calculer la résistance d’un câble de cuivre utilisé pour raccorder un panneau solaire, de section 4 mm² et de longueur 12 m. (ρ cuivre = 0,0175 Ω·mm²/m)',[{lbl:'R',unit:'Ω',ans:0.0175*12/4}])}
      ${AX(7,'A7x2',2,'Quelle longueur de câble de cuivre de section 2,5 mm² peut-on utiliser pour réaliser une résistance de 0,35 Ω ? (ρ cuivre = 0,0175 Ω·mm²/m)',[{lbl:'L',unit:'m',ans:0.35*2.5/0.0175}],{hint:'La longueur est en haut du triangle, avec ρ : L = R . S / ρ.'})}
      ${AX(7,'A7x3',3,'Un câble en aluminium (ρ = 0,028 Ω·mm²/m) de 40 m de long présente une résistance de 0,224 Ω. Quelle est sa section ?',[{lbl:'S',unit:'mm²',ans:0.028*40/0.224}])}`},
  ],
  prereq:[{t:'Établir l’influence de la longueur, de la section et de la nature d’un conducteur sur sa résistance',cap:'A7a'},{t:'Énoncer et appliquer la loi de Pouillet : R = ρ . L / S',cap:'A7a'},{t:'Utiliser un tableau de résistivités pour calculer la résistance d’un conducteur',cap:'A7b'},{t:'Résoudre des exercices chiffrés faisant intervenir R, ρ, L et S',cap:'A7c'}],
});

/* =================== CHAPITRE 8 — LA LOI D'OHM =================== */
defAF(8, {
  Q:{
    A8aq1:{q:"Dans l’expérience, que donne le produit R × I ?",o:["La tension du générateur","La puissance","La résistance des fils"],g:0,e:"Pour un générateur déterminé, le produit R . I est constant et vaut la d.d.p. à ses bornes.",r:'A8a'},
    A8bq1:{q:"Quelle est la définition du volt ?",o:["La tension qui fait circuler 1 A dans une résistance de 1 Ω","Le courant qui traverse 1 Ω","La résistance qui laisse passer 1 A"],g:0,e:"1 V = 1 Ω × 1 A. De même, l’ampère circule dans 1 Ω sous 1 V, et l’ohm laisse passer 1 A sous 1 V.",r:'A8b'},
    A8bq2:{q:"On garde la même tension et on double la résistance. Le courant…",o:["double","est divisé par deux","ne change pas"],g:1,e:"I = U / R : la résistance est au dénominateur.",r:'A8b'},
  },
  caps:[
    {id:'A8a', sec:'8.1 — 8.6', t:'L’expérience', quiz:['A8aq1'], ex:{keys:['A8tab'], lbl:'Le tableau des mesures'},
     body:()=>`${progRef(['Citer la loi d’Ohm et les unités correspondantes (CM2D)','Expliquer cette loi sous la forme I = U / R (CM2D)','Résoudre des problèmes relatifs à la loi d’Ohm (CM2D)'],'p. 26')}
      <p class="lead">Tension, courant, résistance : comme Georg Simon Ohm (1789-1854), cherchons la relation entre ces trois grandeurs.</p>
      <p>Matériel : un générateur continu de 4,5 V et 9 V, un ampèremètre, un voltmètre, des résistances de 20 Ω, 50 Ω et 100 Ω. On place successivement chaque résistance entre A et B et on note I, avec chacun des deux générateurs.</p>
      <div class="figure" id="a8lab"></div>
      ${exbox('a8tab','Complète le tableau','Relève la mesure de l’ampèremètre pour chaque montage.')}
      <h3>Constatations et conclusions</h3>
      <p>Si nous multiplions la valeur de la résistance par la valeur du courant, nous retrouvons la valeur de la tension. Pour un générateur déterminé, le produit <b>R . I est constant</b> : c’est la tension ou d.d.p. aux bornes du générateur, notée U, en volts.</p>`,
     mount:root=>{ mountOhmX(root);
       mountDrillW(root.querySelector('#a8tab'),'A8tab',{rows:[[4.5,20],[4.5,50],[4.5,100],[9,20],[9,50],[9,100]].map(([U,R])=>({q:`U = ${fr(U,1)} V · R = ${R} Ω`,unit:'A',ans:U/R})),ok:'Et R × I redonne chaque fois U : 20 × 0,225 = 4,5.'}); }},
    {id:'A8b', sec:'8.7', t:'La loi d’Ohm', quiz:['A8bq1','A8bq2'], ex:null,
     body:()=>`${defBox('Synthèse','La tension ou d.d.p. aux bornes d’un circuit est égale au produit de la résistance du circuit par l’intensité du courant qui y circule.')}
      <div class="tri-row">${fbox('U = R . I','volt (V) = ohm (Ω) × ampère (A)')}${triangle('U','R','I')}</div>
      <p class="small muted">Formules dérivées : ${fm('R = U / I')} et ${fm('I = U / R')}.</p>
      ${defBox('Définitions','Le <b>volt</b> est la d.d.p. qui fait circuler un courant de 1 A dans une résistance de 1 Ω. L’<b>ampère</b> est l’intensité du courant dans une résistance de 1 Ω sous une d.d.p. de 1 V. L’<b>ohm</b> est la résistance qui laisse circuler 1 A sous une d.d.p. de 1 V.')}
      ${labo('ohm','Le triangle de la loi d’Ohm et un calculateur pour vérifier tes réponses.')}`},
    {id:'A8c', sec:'8.8', t:'Exercices', quiz:[], ex:{keys:['A8x1','A8x2','A8x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Repère d’abord la grandeur cherchée, puis choisis la bonne forme de la loi d’Ohm.</p>
      ${AX(8,'A8x1',1,'Une borne de recharge pour vélo électrique alimente la batterie sous une tension de 42 V. Le circuit de charge présente une résistance équivalente de 21 Ω. Calculer l’intensité du courant de charge.',[{lbl:'I',unit:'A',ans:42/21}])}
      ${AX(8,'A8x2',2,'Un panneau photovoltaïque délivre une tension de 32 V à un onduleur qui absorbe un courant de 12,5 A. Calculer la résistance équivalente vue par le panneau à ce point de fonctionnement.',[{lbl:'R',unit:'Ω',ans:32/12.5}])}
      ${AX(8,'A8x3',3,'La résistance chauffante d’un chauffe-eau électrique vaut 44 Ω et est parcourue par un courant de 5 A. Quelle tension règne à ses bornes ?',[{lbl:'U',unit:'V',ans:44*5}])}`},
  ],
  prereq:[{t:'Établir expérimentalement la relation entre U, R et I',cap:'A8a'},{t:'Énoncer et appliquer la loi d’Ohm : U = R . I',cap:'A8b'},{t:'Définir le volt, l’ampère et l’ohm à partir de cette loi',cap:'A8b'},{t:'Résoudre des exercices chiffrés faisant intervenir U, R et I',cap:'A8c'}],
});

/* =================== CHAPITRE 9 — LA LOI DE MATHIESSEN =================== */
defAF(9, {
  Q:{
    A9aq1:{q:"Pourquoi la résistance d’un fil de cuivre augmente-t-elle quand il chauffe ?",o:["Le fil s’allonge beaucoup","L’agitation thermique des molécules freine le déplacement des électrons","Le cuivre devient isolant"],g:1,e:"Plus il fait chaud, plus les molécules s’agitent, et plus elles gênent les électrons.",r:'A9a'},
    A9aq2:{q:"On chauffe une tige de carbone. Sa résistance…",o:["augmente","diminue","ne change pas"],g:1,e:"Le carbone, les électrolytes et les semi-conducteurs ont un coefficient de température négatif.",r:'A9a'},
    A9bq1:{q:"Dans Rt = R0 . (1 + α . t), que représente R0 ?",o:["La résistance à la température finale","La résistance à 0 °C","Le coefficient de température"],g:1,e:"R0 est la résistance à 0 °C ; Rt celle à la température t ; α dépend de la matière.",r:'A9b'},
  },
  caps:[
    {id:'A9a', sec:'9.1 — 9.3', t:'La résistance change avec la température', quiz:['A9aq1','A9aq2'], ex:{keys:['A9exp'], lbl:'Le tableau de l’expérience'},
     body:()=>`${progRef(['Analyser l’influence de la température sur la résistance d’un conducteur (CM2D)','Distinguer les matériaux à coefficient de température positif et négatif (CM2D)','Résoudre des problèmes relatifs à la loi de Mathiessen (CM2D)'],'p. 26')}
      <p class="lead">Quand la température augmente, l’agitation thermique des molécules augmente, ce qui freine le déplacement des électrons dans la matière.</p>
      <p>Pour la plupart des métaux, la résistance augmente quand la température monte, et diminue quand elle baisse. Certains matériaux ont un <b>coefficient de température négatif</b> : leur résistance diminue quand la température augmente. Ce sont le carbone, les électrolytes et les semi-conducteurs.</p>
      <h3>Expérience 1 : une bobine de cuivre de 1 Ω</h3>
      <p>On la branche sur une source et on la laisse fonctionner, sans rien changer au circuit. On tâte sa température au début et à la fin.</p>
      ${exbox('a9exp','Complète la ligne R = U / I','Le relevé du cours : U = 6 V au départ et après 15 minutes.')}
      <p><b>Observation</b> : l’intensité a diminué. <b>Conclusion</b> : la résistance du fil de cuivre s’élève avec la température.</p>
      <h3>Expérience 2 : une tige de carbone</h3>
      <p>On mesure sa résistance à froid, puis à chaud, sous la flamme d’une bougie. La résistance varie : elle <b>diminue</b> quand la température s’élève.</p>`,
     mount:root=>mountDrillW(root.querySelector('#a9exp'),'A9exp',{rows:[{q:'À la mise en service : U = 6 V, I = 6 A',unit:'Ω',ans:6/6},{q:'Après 15 minutes : U = 6 V, I = 5 A (bobine très chaude)',unit:'Ω',ans:6/5}],ok:'La résistance est passée de 1 Ω à 1,2 Ω en chauffant.'})},
    {id:'A9b', sec:'9.4', t:'La loi de Mathiessen', quiz:['A9bq1'], ex:{keys:['A9alp'], lbl:'Positif ou négatif ?'},
     body:()=>`${fbox('Rt = R0 . (1 + α . t)','Rt : résistance à la température finale — R0 : résistance à 0 °C — α : coefficient de température — t : variation de température (°C)')}
      <p><b>α (alpha)</b> est l’augmentation ou la diminution de la résistance pour une élévation de température de 1 °C ; sa valeur dépend de la nature du conducteur.</p>
      ${tbl(['Matériau','α'],[['Cuivre','3,93 . 10⁻³'],['Aluminium','4,3 . 10⁻³'],['Tungstène','6,5 . 10⁻³'],['Argent','3,85 . 10⁻³'],['Manganine','voisin de 0'],['Carbone','−0,4 . 10⁻³']])}
      <div class="note"><b>Remarque</b>La résistance augmente pour les conducteurs métalliques, mais diminue pour le charbon, les électrolytes, les isolants (verre, porcelaine…) et les semi-conducteurs.</div>
      ${exbox('a9alp','Quand la température monte, la résistance…')}`,
     mount:root=>mountSortW(root.querySelector('#a9alp'),'A9alp',{cats:[['u','augmente'],['d','diminue'],['z','change à peine']],items:[['Cuivre','u'],['Tungstène (filament de lampe)','u'],['Carbone','d'],['Semi-conducteur','d'],['Manganine','z'],['Électrolyte','d']],ok:'Les métaux : α positif. Carbone, électrolytes, semi-conducteurs : α négatif. La manganine sert justement quand on veut une résistance stable.'})},
    {id:'A9c', sec:'9.5', t:'Exercices', quiz:[], ex:{keys:['A9x1','A9x2','A9x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Le coefficient α du cuivre et du carbone est dans le tableau (et dans le 📐 Formulaire).</p>
      ${AX(9,'A9x1',1,'Les inducteurs d’une génératrice électrique sont constitués de fil de cuivre qui font 100 Ω de résistance à la température de 0 °C. On demande ce que devient la résistance des bobinages lorsque la machine atteint en service normal une température de 80 °C.',[{lbl:'Rt à 80 °C',unit:'Ω',ans:100*(1+ALPHA_CU*80),tol:0.01}])}
      ${AX(9,'A9x2',2,'Un câble PV (cuivre) reliant des panneaux photovoltaïques à l’onduleur présente une résistance de 0,20 Ω à 20 °C (par temps couvert). En plein été, sous exposition directe au soleil, sa température atteint 60 °C. Calculer sa nouvelle résistance.',[{lbl:'R à 60 °C',unit:'Ω',ans:0.2/(1+ALPHA_CU*20)*(1+ALPHA_CU*60)}],{tip:'Ici, la résistance est donnée à 20 °C et non à 0 °C : calcule d’abord R0.',hint:'Avec la formule : R0 = R20 / (1 + α . 20), puis R60 = R0 . (1 + α . 60).'})}
      ${AX(9,'A9x3',3,'La résistance d’une tige de carbone est égale à 0,6 Ω à 0 °C. Quelle est sa résistance à 30 °C ?',[{lbl:'Rt à 30 °C',unit:'Ω',ans:0.6*(1+ALPHA_C*30),tol:0.004}],{hint:'Le α du carbone est négatif : la résistance doit diminuer.'})}`},
  ],
  prereq:[{t:'Expliquer l’influence de l’agitation thermique sur la résistance d’un conducteur',cap:'A9a'},{t:'Énoncer et appliquer la loi de Mathiessen : Rt = R0 . (1 + α . t)',cap:'A9b'},{t:'Identifier les matériaux à coefficient de température négatif',cap:'A9b'},{t:'Résoudre des exercices chiffrés faisant intervenir Rt, R0, α et t',cap:'A9c'}],
});

/* =================== CHAPITRE 10 — LA PUISSANCE ÉLECTRIQUE =================== */
defAF(10, {
  Q:{
    A10aq1:{q:"Comment mesure-t-on la puissance d’un récepteur avec deux appareils ?",o:["Voltmètre en série et ampèremètre en parallèle","Ampèremètre en série, voltmètre en parallèle, puis on multiplie U par I","Avec un ohmmètre hors tension"],g:1,e:"P = U . I : on fait le produit de la tension lue au voltmètre par l’intensité lue à l’ampèremètre.",r:'A10a'},
    A10aq2:{q:"Sous la même tension, une lampe de 100 W absorbe… qu’une lampe de 25 W.",o:["moins de courant","plus de courant","autant de courant"],g:1,e:"I = P / U : à tension égale, plus de puissance, plus de courant (4 fois plus ici).",r:'A10a'},
  },
  caps:[
    {id:'A10a', sec:'10.1 — 10.3', t:'La puissance électrique', quiz:['A10aq1','A10aq2'], ex:{keys:['A10mes'], lbl:'Les mesures'},
     body:()=>`${progRef(['Citer et définir la puissance électrique et son unité (CM2D)','Différencier puissance absorbée et puissance utile (CM2D)','Résoudre des problèmes relatifs à la puissance électrique (CM2D)'],'pp. 27-28')}
      <p class="lead">Comme la puissance d’une machine, la puissance électrique exprime l’aptitude d’une résistance à transformer l’énergie dans un temps déterminé. Son unité est le <b>watt (W)</b>.</p>
      <p>On la mesure avec deux appareils : l’<b>ampèremètre en série</b> avec le récepteur et le <b>voltmètre en parallèle</b>. La puissance est le produit de la tension lue au voltmètre par l’intensité indiquée par l’ampèremètre.</p>
      <div class="tri-row">${fbox('P = U . I','moyen mnémotechnique : <b>P U I</b>ssance')}${triangle('P','U','I')}</div>
      <p class="small muted">Formules dérivées : ${fm('U = P / I')} et ${fm('I = P / U')}.</p>
      ${exbox('a10mes','Les mesures de l’expérience','On mesure U et I pour trois récepteurs : calcule la puissance de chacun.')}
      ${labo('puissance','Des calculateurs de puissance et d’énergie.')}`,
     mount:root=>mountDrillW(root.querySelector('#a10mes'),'A10mes',{rows:[[230,0.109],[230,0.261],[230,0.435]].map(([U,I],i)=>({q:`Récepteur ${i+1} : U = ${U} V · I = ${fr(I,3)} A`,unit:'W',ans:U*I,tol:0.03})),ok:'Environ 25 W, 60 W et 100 W : tu viens de retrouver la puissance de trois lampes.'})},
    {id:'A10b', sec:'10.4', t:'Exercices', quiz:[], ex:{keys:['A10x1','A10x2','A10x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Attention aux multiples : 7,36 kW = 7 360 W.</p>
      ${AX(10,'A10x1',1,'Une borne de recharge domestique pour véhicule électrique délivre une puissance de 7,36 kW sous une tension de 230 V. Calculer l’intensité du courant de charge.',[{lbl:'I',unit:'A',ans:7360/230}],{hint:'Convertis d’abord les kW en W.'})}
      ${AX(10,'A10x2',2,'Une plaque à induction absorbe un courant de 13 A sous une tension de 230 V. Calculer sa puissance.',[{lbl:'P',unit:'W',ans:230*13}])}
      ${AX(10,'A10x3',3,'Un radiateur électrique portable consomme une puissance de 1 200 W et est parcouru par un courant de 5,2 A. Sous quelle tension fonctionne-t-il ?',[{lbl:'U',unit:'V',ans:1200/5.2}])}`},
  ],
  prereq:[{t:'Définir la puissance électrique et citer son unité, le watt',cap:'A10a'},{t:'Établir expérimentalement la relation P = U . I',cap:'A10a'},{t:'Calculer une puissance, une tension ou un courant à partir de P = U . I',cap:'A10b'}],
});

/* =================== CHAPITRE 11 — L'EFFET JOULE =================== */
defAF(11, {
  Q:{
    A11aq1:{q:"Le courant double dans une même résistance. La chaleur dégagée…",o:["double","est multipliée par quatre","ne change pas"],g:1,e:"P = R . I² : le courant intervient au carré.",r:'A11a'},
    A11aq2:{q:"Dans W = U . I . t, si t est en secondes, W s’exprime en…",o:["joules (J)","watts (W)","ampères-heures (Ah)"],g:0,e:"W en joules, U en volts, I en ampères, t en secondes. Avec t en heures, on obtient des wattheures.",r:'A11a'},
    A11bq1:{q:"Un fusible a fondu. Peut-on relier ses deux broches avec un fil quelconque ?",o:["Oui, en attendant","Non : « ponter » un fusible est dangereux, à proscrire absolument","Oui, si le fil est en cuivre"],g:1,e:"Le fusible est le point faible prévu du circuit : sans lui, un court-circuit porte les fils au rouge.",r:'A11b'},
    A11bq2:{q:"Pourquoi munit-on les machines électriques de ventilateurs ?",o:["Pour refroidir le bobinage et permettre plus de puissance sans grossir la machine","Pour faire du bruit","Pour augmenter la tension"],g:0,e:"La puissance d’une machine est limitée par la température maximale que supporte son bobinage.",r:'A11b'},
  },
  caps:[
    {id:'A11a', sec:'11.1', t:'La loi de Joule', quiz:['A11aq1','A11aq2'], ex:null,
     body:()=>`${progRef(['Citer et définir l’énergie électrique (CM2D)','Résoudre des problèmes relatifs à la loi de Joule (CM2D)','Expliquer comment limiter les effets néfastes de l’effet Joule (CM2D)'],'p. 28')}
      <p class="lead">Un conducteur parcouru par un courant dégage de la chaleur et échauffe l’air autour de lui : c’est l’<b>effet Joule</b>. Le radiateur qui chauffe la pièce, c’est aussi l’effet Joule.</p>
      <p>L’énergie fournie à un récepteur quelconque vaut :</p>
      ${fbox('W = U . I . t','W : joules — U : volts — I : ampères — t : secondes')}
      <p>Pour un conducteur passif, cette énergie se transforme en chaleur. S’il a une résistance R, la loi d’Ohm donne U = R . I. On remplace U par R . I : ${fm('W = R . I . I . t = R . I^2 . t')}</p>
      ${fbox('W = R . I^2 . t','l’énergie Joule fournie à un conducteur de résistance R parcouru par un courant constant I')}
      <p>De la même façon, la puissance P = U . I devient ${fm('P = R . I . I = R . I^2')} :</p>
      <div class="tri-row">${fbox('P = R . I^2','la puissance Joule — formule très importante')}${triangle('P','R','I^2')}</div>
      <p class="small muted">Formules dérivées : ${fm('R = P / I^2')} et ${fm('I = √(P / R)')}.</p>
      <div class="note"><b>Conclusion</b>La résistance électrique d’un circuit diminue l’intensité du courant et cause un dégagement de chaleur. Ce sont deux aspects d’un même phénomène : la transformation de l’énergie électrique en chaleur dans un récepteur.</div>`},
    {id:'A11b', sec:'11.2', t:'Inconvénients et applications de l’effet Joule', quiz:['A11bq1','A11bq2'], ex:{keys:['A11cc','A11uti'], lbl:'Le court-circuit et le tri'},
     body:()=>`<h3>Les inconvénients</h3>
      <p><b>L’échauffement des bobinages</b> : un conducteur parcouru par un courant s’échauffe. Si le courant augmente, la température monte encore, jusqu’à une nouvelle température de régime. La puissance d’une machine est donc limitée par la température maximale de son bobinage : on la munit de <b>ventilateurs</b> pour dissiper plus de chaleur.</p>
      <p><b>Les mauvais contacts</b> créent des résistances de contact : au passage du courant, la jonction mal assurée chauffe (boîte de dérivation, interrupteur, prise…).</p>
      <p><b>Le court-circuit</b> : l’intensité devient excessive, la chaleur porte le fil au rouge et peut provoquer un incendie. Il faut prévoir un point faible dans le circuit : le <b>fusible</b>.</p>
      ${exbox('a11cc','L’exemple chiffré du cours','Une ampoule de 40 W sous 230 V, puis un court-circuit de résistance Rcc = 0,1 Ω.')}
      <h3>Les applications</h3>
      <ul><li><b>Le chauffage électrique</b> : fer à repasser, chauffe-eau, cuisinière, bouilloire, radiateur, gaufrier, grille-pain…</li><li><b>L’éclairage par incandescence</b> : un filament de tungstène, dans le vide, porté à environ 2 500 °C.</li><li><b>Le coupe-circuit à fusible</b> : un fil calibré (alliage de plomb et d’étain…) tendu entre deux broches n’atteint sa température de fusion que si le courant dépasse la valeur prévue.</li></ul>
      <div class="note bad"><b>Remarque</b>Quand le fil fond, on peut être tenté de relier les deux broches par un fil quelconque : c’est « ponter » un fusible, une pratique dangereuse, à proscrire absolument.</div>
      ${exbox('a11uti','Effet Joule utile ou nuisible ?')}`,
     mount:root=>{
       mountDrillW(root.querySelector('#a11cc'),'A11cc',{rows:[{q:'Courant normal de l’ampoule : I = P / U',unit:'A',ans:40/230},{q:'Courant de court-circuit : I = U / Rcc',unit:'A',ans:230/0.1}],ok:'Plus de 13 000 fois le courant normal : c’est pour ça que le fusible doit couper.'});
       mountSortW(root.querySelector('#a11uti'),'A11uti',{cats:[['u','Utile'],['n','Nuisible']],items:[['Le grille-pain','u'],['Le bobinage d’un moteur qui chauffe','n'],['Le fil du fusible qui fond','u'],['Une prise mal serrée qui noircit','n'],['Le chauffe-eau','u'],['Un court-circuit','n']],ok:'Juste.'}); }},
    {id:'A11c', sec:'11.3', t:'Exercices', quiz:[], ex:{keys:['A11x1','A11x2','A11x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Plusieurs inconnues : écris-les toutes dans la colonne « Inconnue(s) », et une formule par inconnue.</p>
      ${AX(11,'A11x1',1,'Un grille-pain fonctionne sous 230 V et absorbe une puissance de 800 W. Calculer : a) le courant absorbé ; b) sa résistance ; c) l’énergie Joule dégagée en 10 minutes d’utilisation.',[{lbl:'a) I',unit:'A',ans:800/230},{lbl:'b) R',unit:'Ω',ans:230*230/800},{lbl:'c) W',unit:'J',ans:800*600}],{hint:'10 minutes = 600 secondes.'})}
      ${AX(11,'A11x2',2,'Un radiateur électrique absorbe 8 A sous 230 V. Quelle est sa puissance électrique ? Quelle est la résistance de l’élément de chauffe et l’énergie Joule dégagée en 1 heure (en kWh) ?',[{lbl:'P',unit:'W',ans:230*8},{lbl:'R',unit:'Ω',ans:230/8},{lbl:'W en 1 heure',unit:'kWh',ans:230*8*1/1000}],{hint:'En kWh : la puissance en kW, le temps en heures.'})}
      ${AX(11,'A11x3',3,'Une plaque de cuisson électrique, de résistance 50 Ω, consomme 8 kJ en 10 secondes de fonctionnement. Quel est le courant qui la traverse ?',[{lbl:'I',unit:'A',ans:Math.sqrt(8000/(50*10))}],{hint:'8 kJ = 8 000 J ; I = √(W / (R . t)).'})}`},
  ],
  prereq:[{t:'Établir et appliquer W = U . I . t, puis W = R . I² . t',cap:'A11a'},{t:'Établir et appliquer P = R . I² pour la puissance Joule',cap:'A11a'},{t:'Expliquer les inconvénients de l’effet Joule et les moyens de les limiter',cap:'A11b'},{t:'Citer des applications utiles de l’effet Joule',cap:'A11b'},{t:'Résoudre des exercices sur l’énergie et la puissance Joule',cap:'A11c'}],
});
})();
