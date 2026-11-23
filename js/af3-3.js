/* =========================================================
   ÉLECTRICITÉ 3QEM — CHAPITRES 12 À 16
   12 Résistances séries · 13 Chute de tension en ligne
   14 Résistances parallèles · 15 Résistances mixtes · 16 Appareils de mesures
   ========================================================= */
(function(){
const par2 = (a,b) => a*b/(a+b);
const parN = (...r) => 1/r.reduce((s,x)=>s+1/x,0);
const selRow = (lbl, key, opts, cur) => `<div class="row wrap" style="gap:6px;align-items:center"><span class="small" style="min-width:42px"><b>${lbl}</b></span><div class="seg">${opts.map(v=>`<button class="${cur===v?'on':''}" data-${key}="${v}">${v} Ω</button>`).join('')}</div></div>`;

/* ---------- l'explorateur : trois résistances en série ou en parallèle sous 12 V ---------- */
function resSVG(mode, R){
  const box=(x,y,l,v,vert)=> vert?`<rect x="${x-9}" y="${y}" width="18" height="46" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.5"/><text x="${x+16}" y="${y+20}" font-size="12" font-weight="700" fill="var(--ink-2)">${l}</text><text x="${x+16}" y="${y+35}" font-size="11" fill="var(--muted)">${v} Ω</text>`
    :`<rect x="${x}" y="${y-9}" width="46" height="18" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.5"/><text x="${x+23}" y="${y-16}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink-2)">${l}</text><text x="${x+23}" y="${y+26}" text-anchor="middle" font-size="11" fill="var(--muted)">${v} Ω</text>`;
  const src=`<line x1="30" y1="86" x2="62" y2="86" stroke="var(--ink)" stroke-width="3"/><line x1="38" y1="98" x2="54" y2="98" stroke="var(--ink)" stroke-width="6"/><text x="12" y="96" font-size="12" font-weight="700" fill="var(--ink-2)">12 V</text>`;
  if(mode==='s') return `<svg viewBox="0 0 360 180" role="img" aria-label="Trois résistances en série"><g stroke="var(--ink)" stroke-width="2.5" fill="none"><path d="M46 86 V30 H80 M126 30 H160 M206 30 H240 M286 30 H320 V150 H46 V98"/></g>${src}${box(80,30,'R₁',R[0])}${box(160,30,'R₂',R[1])}${box(240,30,'R₃',R[2])}</svg>`;
  return `<svg viewBox="0 0 360 180" role="img" aria-label="Trois résistances en parallèle"><g stroke="var(--ink)" stroke-width="2.5" fill="none"><path d="M46 86 V24 H300 M46 98 V160 H300 M140 24 V66 M140 112 V160 M220 24 V66 M220 112 V160 M300 24 V66 M300 112 V160"/></g>${src}${box(140,66,'R₁',R[0],1)}${box(220,66,'R₂',R[1],1)}${box(300,66,'R₃',R[2],1)}</svg>`;
}
function mountExplo(root, id, mode){
  const box=root.querySelector('#'+id), st=WS[id]||(WS[id]={R:[10,20,30]});
  const draw=()=>{ const R=st.R, U=12;
    let rows;
    if(mode==='s'){ const Rt=R[0]+R[1]+R[2], I=U/Rt; rows=[['Résistance totale',`R<sub>T</sub> = ${R.join(' + ')} = <b>${fr(Rt,2)} Ω</b>`],['Le courant (le même partout)',`I = 12 / ${fr(Rt,2)} = <b>${fr(I,3)} A</b>`],...R.map((r,i)=>[`Tension aux bornes de R${'₁₂₃'[i]}`,`U${'₁₂₃'[i]} = ${r} · ${fr(I,3)} = <b>${fr(r*I,2)} V</b>`]),['Les tensions s’additionnent',`${R.map(r=>fr(r*I,2)).join(' + ')} = <b>${fr(U,2)} V</b>`]]; }
    else { const Rq=parN(...R), It=U/Rq; rows=[['Résistance équivalente',`1 / (1/${R[0]} + 1/${R[1]} + 1/${R[2]}) = <b>${fr(Rq,2)} Ω</b>`],['La tension (la même partout)','<b>12 V</b> aux bornes de chaque résistance'],...R.map((r,i)=>[`Courant dans R${'₁₂₃'[i]}`,`I${'₁₂₃'[i]} = 12 / ${r} = <b>${fr(U/r,3)} A</b>`]),['Les courants s’additionnent',`${R.map(r=>fr(U/r,3)).join(' + ')} = <b>${fr(It,3)} A</b>`]]; }
    box.innerHTML=`<div class="grid g2" style="gap:14px;align-items:center"><div>${resSVG(mode,R)}</div><div class="stack" style="gap:6px">${[0,1,2].map(i=>selRow('R'+'₁₂₃'[i],id+'r'+i,[10,20,30,60],R[i])).join('')}</div></div>
      ${tbl(['',''],rows)}`;
    [0,1,2].forEach(i=>box.querySelectorAll(`[data-${id}r${i}]`).forEach(b=>b.onclick=()=>{ st.R[i]=+b.getAttribute(`data-${id}r${i}`); draw(); })); };
  draw();
}

/* =================== CHAPITRE 12 — LES RÉSISTANCES SÉRIES =================== */
const C12 = [['a',12e3,5.6e3,680e-6],['b',56e3,18e3,0.19e-3],['c',1.8e3,1.8e3,2.7e-3],['d',27e3,4.7e3,0.57e-3]];
defAF(12, {
  Q:{
    A12aq1:{q:"Dans un circuit série, le courant…",o:["est le même dans tous les éléments","se partage entre les éléments","est plus grand dans la plus grande résistance"],g:0,e:"Il n’y a qu’un seul chemin : I₁ = I₂ = I₃ = … = Iₜ.",r:'A12a'},
    A12aq2:{q:"Dans un circuit série, quelle résistance a la plus grande tension à ses bornes ?",o:["La plus petite","La plus grande","Elles ont toutes la même"],g:1,e:"Chaque élément a une tension proportionnelle à sa résistance : U₁ = R₁ . I.",r:'A12a'},
    A12bq1:{q:"On connaît Uₜ et toutes les résistances. Pour trouver le courant, on calcule…",o:["I = Uₜ / Rₜ, avec Rₜ = R₁ + R₂ + …","I = Uₜ × Rₜ","I = Uₜ / R₁ seulement"],g:0,e:"La loi d’Ohm appliquée au réseau entier. On peut aussi l’appliquer à une partie : I = U₁ / R₁, si on connaît U₁.",r:'A12b'},
  },
  caps:[
    {id:'A12a', sec:'12.1', t:'Les caractéristiques du circuit série', quiz:['A12aq1','A12aq2'], ex:{keys:['A12vf'], lbl:'Vrai ou faux ?'},
     body:()=>`${progRef(['Décrire un montage série, parallèle et mixte (CM2D)','Calculer les courants, tensions et résistances équivalentes de ces montages (CM2D)'],'p. 26')}
      <p class="lead">Dans un circuit série, il n’y a qu’un seul chemin pour le courant.</p>
      <ul><li>Il y a <b>un seul courant</b> dans tous les éléments : ${fm('I1 = I2 = I3 = … = IT')}</li>
      <li>Chaque élément a <b>sa propre tension</b>, proportionnelle à sa résistance : ${fm('U1 = R1 . I')}, ${fm('U2 = R2 . I')}…</li>
      <li><b>Les tensions s’additionnent</b> : ${fm('UT = U1 + U2 + U3 + … + Un')} — et la f.é.m. est égale à cette somme : ${fm('E = UT')}</li>
      <li><b>Les résistances s’additionnent</b> : ${fm('RT = R1 + R2 + R3 + … + Rn')}</li>
      <li>Les puissances et les énergies s’additionnent aussi.</li></ul>
      <div class="figure" id="a12ex"></div>
      ${exbox('a12vf','Vrai ou faux, dans un circuit série ?')}`,
     mount:root=>{ mountExplo(root,'a12ex','s');
       mountSortW(root.querySelector('#a12vf'),'A12vf',{cats:[['v','Vrai'],['f','Faux']],items:[['Le courant est le même dans chaque résistance','v'],['La tension est la même aux bornes de chaque résistance','f'],['La résistance totale est la somme des résistances','v'],['La somme des tensions est égale à la tension du générateur','v'],['Si une résistance est coupée, le courant continue dans les autres','f']],ok:'Juste. Et si un élément est coupé, plus rien ne circule : c’est un seul chemin.'}); }},
    {id:'A12b', sec:'12.2 — 12.4', t:'Calculer un circuit série', quiz:['A12bq1'], ex:null,
     body:()=>`${tbl(['Je cherche…','Je calcule…'],[
        ['Le courant I',`au réseau entier : ${fm('I = UT / RT')} — ou à une partie : ${fm('I = U1 / R1')}`],
        ['La tension totale Uₜ',`${fm('UT = RT . I')} — ou ${fm('UT = U1 + U2 + U3 + …')}`],
        ['La tension d’un élément',`${fm('U1 = R1 . I')}`],
        ['La résistance totale Rₜ',`${fm('RT = R1 + R2 + R3 + …')} — ou ${fm('RT = UT / I')}`],
        ['La résistance d’un élément',`${fm('R1 = U1 / I')}`]])}
      <p class="small muted">La résistance interne d’un générateur sera vue au chapitre 19 ; la résistance des conducteurs, au chapitre 13 (la chute de tension en ligne).</p>
      ${labo('montages','Le constructeur de circuits série, parallèle et mixte, avec les calculs détaillés.')}`},
    {id:'A12c', sec:'12.5', t:'Exercices', quiz:[], ex:{keys:['A12x1','A12x2','A12x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Attention aux préfixes : kΩ, mA, µA. Convertis avant de calculer.</p>
      ${(v=>AX(12,'A12x1',1,`Deux résistances font partie du circuit de polarisation d’un transistor. Le courant vers la base du transistor est insignifiant. Trouve la tension entre les bornes de chaque résistance dans les quatre cas suivants, puis la d.d.p. totale dans chacun d’eux.
        ${tbl(['Cas','R₁','R₂','I'],['a','b','c','d'].map(k=>[k,fr(v[k][0])+' kΩ',fr(v[k][1])+' kΩ',k==='a'?Math.round(v[k][2]*1000)+' µA':fr(v[k][2])+' mA']))}`,
        ['a','b','c','d'].flatMap(k=>{ const [r1,r2,i]=v[k]; return [{lbl:`${k}) U₁`,unit:'V',ans:r1*i},{lbl:`${k}) U₂`,unit:'V',ans:r2*i},{lbl:`${k}) U total`,unit:'V',ans:(r1+r2)*i}]; }),{hint:'Pense aux unités : µA = 10⁻⁶ A, mA = 10⁻³ A, kΩ = 10³ Ω (kΩ × mA donne directement des volts).'}))(vx('A12x1',{a:[[12,5.6,0.68],[10,4.7,0.82],[15,6.8,0.56]],b:[[56,18,0.19],[47,22,0.15],[68,12,0.2]],c:[[1.8,1.8,2.7],[2.2,2.2,2.2],[1.5,3.3,3]],d:[[27,4.7,0.57],[33,3.9,0.45],[22,5.6,0.6]]}))}
      ${(v=>AX(12,'A12x2',2,`U = ${v.U} V ; R₁ = ${fr(v.a)} kΩ ; R₂ = ${fr(v.b)} kΩ, en série. Quelle est la valeur du courant ?`,[{lbl:'I',unit:'mA',ans:v.U/((v.a+v.b)*1e3)*1000}],{tip:'Donne le courant en milliampères.'}))(vx('A12x2',{U:[12,15,24],a:[2.2,3.9,4.7],b:[1.2,1.5,1.8]}))}
      ${(v=>AX(12,'A12x3',3,`Une résistance de ${v.a.toLocaleString('fr-BE')} Ω et une autre de ${v.b.toLocaleString('fr-BE')} Ω sont en série. Si la d.d.p. aux bornes de la résistance de ${v.a.toLocaleString('fr-BE')} Ω est de ${v.u} V, quel est le courant dans la résistance de ${v.b.toLocaleString('fr-BE')} Ω ?`,[{lbl:'I',unit:'mA',ans:v.u/v.a*1000}],{tip:'Donne le courant en milliampères.',hint:'En série, le courant est le même partout.'}))(vx('A12x3',{a:[1000,1500,2200],b:[2000,3300],u:[30,50,60]}))}`},
  ],
  prereq:[{t:'Citer les caractéristiques électriques d’un circuit série',cap:'A12a'},{t:'Calculer la résistance équivalente d’un groupement de résistances en série',cap:'A12b'},{t:'Résoudre des exercices chiffrés faisant intervenir U, R et I dans un circuit série',cap:'A12c'}],
});

/* =================== CHAPITRE 13 — LA CHUTE DE TENSION EN LIGNE =================== */
defAF(13, {
  Q:{
    A13aq1:{q:"Pour calculer la résistance d’une ligne bifilaire avec R = ρ . L / S, quelle longueur prend-on ?",o:["La distance entre le générateur et le récepteur","La longueur des fils aller-retour","La moitié de la distance"],g:1,e:"Le courant fait l’aller et le retour : les deux fils de ligne sont en série, RL = RL1 + RL2.",r:'A13a'},
    A13aq2:{q:"Le courant dans la ligne est…",o:["plus grand que le courant du récepteur","égal au courant du générateur et à celui du récepteur","nul"],g:1,e:"Générateur, ligne et récepteur sont en série : IL = IG = IR.",r:'A13a'},
    A13bq1:{q:"Lequel de ces moyens ne réduit PAS la chute de tension ?",o:["Prendre un conducteur de plus faible résistivité","Rapprocher le générateur des récepteurs","Augmenter la densité de courant J"],g:2,e:"UL = ρ . L . J : il faut au contraire une densité de courant non excessive, donc une section adaptée au courant.",r:'A13b'},
  },
  caps:[
    {id:'A13a', sec:'13.1 — 13.2', t:'L’expérience et les formules', quiz:['A13aq1','A13aq2'], ex:{keys:['A13exp'], lbl:'Les mesures de l’expérience'},
     body:()=>`${progRef(['Définir et calculer la chute de tension en ligne (CM2D)'],'p. 27')}
      <p class="lead">On réalise un circuit : un générateur, un récepteur, une ligne bifilaire.</p>
      <ul><li>Près du générateur, on mesure U<sub>G</sub> = <b>6 V</b> ; près du récepteur, U<sub>R</sub> = <b>4,8 V</b>.</li><li>On fait glisser une ampoule de 6,3 V le long des fils : son éclat diminue en allant du générateur vers le récepteur.</li></ul>
      ${exbox('a13exp','Que vaut la chute de tension dans l’expérience ?')}
      <h3>Conclusions</h3>
      <p>Entre le générateur et le récepteur, la tension baisse : c’est la <b>chute de tension en ligne</b> ${fm('UL = UG − UR')}. La ligne se comporte comme une résistance, ses deux fils étant en série : ${fm('RL = RL1 + RL2')}, calculée par la loi de Pouillet avec <b>la longueur aller-retour</b> :</p>
      ${fbox('RL = ρ . L / S','ρ : résistivité (Ω·mm²/m) — S : section des conducteurs (mm²) — L : longueur des fils aller-retour (m)')}
      <p>Le courant qui traverse la résistance de la ligne y produit la chute de tension :</p>
      <div class="tri-row">${fbox('UL = RL . IL','formules dérivées : RL = UL / IL et IL = UL / RL')}${triangle('UL','RL','IL')}</div>
      <p>Comme RL = ρ.L/S, on peut écrire ${fm('UL = ρ . L . I / S')}. En posant ${fm('J = I / S')}, la <b>densité de courant</b> en A/mm² : ${fm('UL = ρ . L . J')}.</p>
      <div class="note"><b>En résumé</b>${fm('UG = UL + UR')} · ${fm('UL = RL . IL')} · ${fm('UL = ρ . L . J')} · ${fm('IL = IG = IR')}</div>`,
     mount:root=>mountDrillW(root.querySelector('#a13exp'),'A13exp',{rows:[{q:'UL = UG − UR',unit:'V',ans:6-4.8},{q:'En pourcentage de la tension du générateur',unit:'%',ans:(6-4.8)/6*100}],ok:'1,2 V perdus dans la ligne, soit 20 % : énorme pour une installation.'})},
    {id:'A13b', sec:'13.3 — 13.5', t:'Limiter la chute de tension', quiz:['A13bq1'], ex:{keys:['A13lim'], lbl:'Ce qui réduit UL'},
     body:()=>`<p>Avec l’augmentation du nombre d’appareils électriques (télévisions, frigos, lessiveuses, cuisinières…), le courant a beaucoup augmenté dans les lignes, et certains secteurs ont des chutes de tension excessives. D’après ${fm('UL = ρ . L . J')}, on les limite :</p>
      <ul><li>en utilisant des conducteurs de <b>faible résistivité</b> (cuivre, ou aluminium, moins coûteux) ;</li><li>en <b>réduisant la distance</b> entre le générateur et les récepteurs : on multiplie les sous-stations (cabines) ;</li><li>en admettant une <b>densité de courant non excessive</b>, c’est-à-dire en adaptant la section du conducteur au courant.</li></ul>
      ${defBox('Définitions','La <b>d.d.p.</b> ou tension est la différence de niveau électrique qui existe en permanence entre les deux bornes d’un générateur. La <b>chute de tension</b> est la différence entre le départ et l’arrivée d’une ligne : Δu.')}
      ${exbox('a13lim','Ça réduit la chute de tension, ou ça l’augmente ?')}`,
     mount:root=>mountSortW(root.querySelector('#a13lim'),'A13lim',{cats:[['m','Réduit UL'],['p','Augmente UL']],items:[['Passer de 1,5 mm² à 2,5 mm²','m'],['Rallonger le câble de 20 m','p'],['Remplacer un câble en fer par du cuivre','m'],['Brancher deux radiateurs de plus sur la même ligne','p'],['Installer une cabine plus près des maisons','m']],ok:'Juste : section, longueur, matière et courant.'})},
    {id:'A13c', sec:'13.6', t:'Exercices', quiz:[], ex:{keys:['A13x1','A13x2','A13x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">D’abord la chute de tension dans la ligne, ensuite ce qui arrive au récepteur.</p>
      ${(v=>AX(13,'A13x1',1,`Un câble d’alimentation a une résistance totale (aller-retour) de ${fr(v.R)} Ω. Que vaut la tension aux bornes du récepteur lorsqu’il circule un courant de ${v.I} A et que la tension à la source vaut ${v.U} V ?`,[{lbl:'UL',unit:'V',ans:v.R*v.I},{lbl:'UR',unit:'V',ans:v.U-v.R*v.I}]))(vx('A13x1',{R:[0.4,0.5,0.6],I:[6,8,10],U:[110,230]}))}
      ${(v=>AX(13,'A13x2',2,`Une ligne électrique a une résistance totale (aller et retour) de ${fr(v.R)} Ω. La tension à la source est de ${v.U} V et le courant vaut ${v.I} A. Déterminer la tension U₂ au bout de la ligne, et la chute de tension exprimée en pourcentage de la tension à la source.`,[{lbl:'U₂',unit:'V',ans:v.U-v.R*v.I},{lbl:'Chute de tension',unit:'%',ans:v.R*v.I/v.U*100}]))(vx('A13x2',{R:[0.02,0.03,0.05],U:[200,230,400],I:[80,100,120]}))}
      ${(v=>AX(13,'A13x3',3,`Un câble photovoltaïque (aller-retour) présente une résistance de ${fr(v.R)} Ω. Sachant que le courant Imp vaut 12,5 A et que la tension de la chaîne de panneaux (string) est de 320 V, calculer la chute de tension en ligne et la tension disponible à l’entrée de l’onduleur.`,[{lbl:'UL',unit:'V',ans:v.R*12.5},{lbl:'Tension à l’onduleur',unit:'V',ans:320-v.R*12.5,tol:0.0005}]))(vx('A13x3',{R:[0.06,0.09,0.12]}))}`},
  ],
  prereq:[{t:'Établir l’existence d’une chute de tension entre générateur et récepteur',cap:'A13a'},{t:'Calculer la chute de tension dans une ligne d’alimentation',cap:'A13c'},{t:'Appliquer la loi de Pouillet pour la résistance et la section d’une ligne',cap:'A13a'},{t:'Citer les moyens de limiter la chute de tension',cap:'A13b'}],
});

/* =================== CHAPITRE 14 — LES RÉSISTANCES PARALLÈLES =================== */
const RCB=12/5, RAM=0.1, RQ=par2(RCB,RAM);
defAF(14, {
  Q:{
    A14aq1:{q:"Dans un circuit parallèle, la tension…",o:["est la même aux bornes de chaque branche","se partage entre les branches","est plus grande dans la plus petite résistance"],g:0,e:"Uₜ = U₁ = U₂ = U₃ = … : chaque branche est branchée sur les mêmes deux points.",r:'A14a'},
    A14aq2:{q:"Quelle branche est parcourue par le plus grand courant ?",o:["Celle qui a la plus grande résistance","Celle qui a la plus petite résistance","Toutes ont le même courant"],g:1,e:"I = U / R : même tension, plus petite résistance, plus grand courant.",r:'A14a'},
    A14bq1:{q:"Un élève trouve 145 Ω pour 100 Ω et 250 Ω en parallèle. Pourquoi est-ce forcément faux ?",o:["En parallèle, Réqu est toujours plus petite que la plus petite résistance","Il fallait trouver 350 Ω","Il fallait faire la moyenne"],g:0,e:"Chaque branche ajoutée offre un chemin de plus au courant : la résistance équivalente baisse. Ici, Réqu = 71,4 Ω.",r:'A14b'},
    A14bq2:{q:"Pourquoi ne faut-il jamais brancher un ampèremètre en parallèle ?",o:["Il affiche une valeur trop petite, c’est tout","Sa résistance est très faible : presque tout le courant passe par lui, il peut être détruit et la source surchargée","Il se met en série tout seul"],g:1,e:"Dans l’exemple du cours, 100 A traversent un ampèremètre de 10 A.",r:'A14b'},
  },
  caps:[
    {id:'A14a', sec:'14.1 — 14.2', t:'Les caractéristiques du circuit parallèle', quiz:['A14aq1','A14aq2'], ex:{keys:['A14vf'], lbl:'Vrai ou faux ?'},
     body:()=>`${progRef(['Décrire un montage parallèle (CM2D)','Citer des applications pratiques (CM2D)','Calculer les grandeurs équivalentes d’un tel montage (CM2D)'],'p. 26')}
      <ul><li>Il y a <b>une seule tension</b> aux bornes de toutes les parties du circuit : ${fm('UT = U1 = U2 = U3 = … = Un')}</li>
      <li>Chaque élément a <b>son propre courant</b> : ${fm('I1 = U / R1')}, ${fm('I2 = U / R2')}…</li>
      <li><b>Les courants s’additionnent</b> : ${fm('IT = I1 + I2 + I3 + … + In')}</li>
      <li><b>Les inverses des résistances s’additionnent</b> : ${fm('1 / RT = 1/R1 + 1/R2 + 1/R3 + … + 1/Rn')}</li>
      <li>Les puissances et les énergies s’additionnent.</li></ul>
      <div class="figure" id="a14ex"></div>
      ${tbl(['Je cherche…','Je calcule…'],[['La tension',`${fm('UT = RT . IT')} — ou pour une branche : ${fm('U2 = R2 . I2')}`],['Le courant total',`${fm('IT = I1 + I2 + I3 + …')} — ou ${fm('IT = U / Réqu')}`],['La résistance totale',`${fm('Réqu = 1 / (1/R1 + 1/R2 + 1/R3)')} — ou ${fm('Réqu = U / IT')}`],['La résistance d’une branche',`${fm('R1 = U / I1')}`]])}
      ${exbox('a14vf','Vrai ou faux, dans un circuit parallèle ?')}`,
     mount:root=>{ mountExplo(root,'a14ex','p');
       mountSortW(root.querySelector('#a14vf'),'A14vf',{cats:[['v','Vrai'],['f','Faux']],items:[['La tension est la même aux bornes de chaque branche','v'],['Le courant est le même dans chaque branche','f'],['Le courant total est la somme des courants des branches','v'],['Ajouter une branche fait augmenter la résistance équivalente','f'],['Si une lampe grille, les autres continuent de fonctionner','v']],ok:'C’est pour ça que les prises et les luminaires d’une maison sont en parallèle.'}); }},
    {id:'A14b', sec:'14.3 et 14.5', t:'Deux éléments en parallèle — l’ampèremètre mal branché', quiz:['A14bq1','A14bq2'], ex:{keys:['A14am'], lbl:'L’exemple de l’ampèremètre'},
     body:()=>`<p>Pour deux éléments en parallèle :</p>
      ${fbox('Réqu = R1 . R2 / (R1 + R2)','issu de Réqu = 1 / (1/R1 + 1/R2) : « le produit sur la somme »')}
      <p class="small">En pratique, les circuits à deux éléments en parallèle sont les plus nombreux. Pour plus de deux résistances, on peut appliquer cette formule deux par deux.</p>
      <div class="note"><b>Remarque</b>La Réqu est toujours plus petite que la plus petite des résistances en parallèle. Exemple : 1 MΩ en parallèle avec 1 mΩ donne moins de 1 mΩ.</div>
      <h3>Conséquence d’un ampèremètre monté en parallèle</h3>
      <p>Une alimentation de 12 V fournit de l’énergie à un appareil (une CB) qui tire 5 A. Pour vérifier ce courant, on prend un ampèremètre calibré à 10 A, de résistance 0,1 Ω… et on le monte <b>en parallèle</b> avec l’appareil, par erreur. Refais les calculs du cours :</p>
      ${exbox('a14am','Que se passe-t-il ?','Arrondis à trois chiffres significatifs.')}
      <p><b>Conséquences</b> : l’alimentation, avec son transformateur, ne peut pas fournir 105 A sans risque d’incendie par surintensité ; et l’ampèremètre de 10 A, traversé par 100 A, est presque certainement détruit.</p>`,
     mount:root=>mountDrillW(root.querySelector('#a14am'),'A14am',{rows:[{q:'Résistance de l’appareil : R = U / I',unit:'Ω',ans:RCB},{q:'Réqu de l’appareil en parallèle avec l’ampèremètre (0,1 Ω)',unit:'Ω',ans:RQ},{q:'Courant tiré de la source : Iₜ = U / Réqu',unit:'A',ans:12/RQ},{q:'Courant dans l’ampèremètre : Iₜ − 5 A',unit:'A',ans:12/RQ-5}],ok:'Environ 105 A tirés de la source, dont 100 A dans l’ampèremètre.'})},
    {id:'A14c', sec:'14.4', t:'Exercices', quiz:[], ex:{keys:['A14x1','A14x2','A14x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Vérifie toujours ton résultat : il doit être plus petit que la plus petite résistance.</p>
      ${(v=>AX(14,'A14x1',1,`Calculer la résistance équivalente d’un circuit électrique dans les cas suivants : a) R₁ = ${(x=>x>=1000?fr(x/1000)+' kΩ':x+' Ω')(v.a[0])}, R₂ = ${(x=>x>=1000?fr(x/1000)+' kΩ':x+' Ω')(v.a[1])} ; b) R₁ = ${(x=>x>=1000?fr(x/1000)+' kΩ':x+' Ω')(v.b[0])}, R₂ = ${(x=>x>=1000?fr(x/1000)+' kΩ':x+' Ω')(v.b[1])} ; c) R₁ = ${v.c[0]} Ω, R₂ = ${v.c[1]} Ω, R₃ = ${v.c[2]} Ω ; d) R₁ = ${(x=>x>=1000?fr(x/1000)+' MΩ':x+' kΩ')(v.d[0])}, R₂ = ${(x=>x>=1000?fr(x/1000)+' MΩ':x+' kΩ')(v.d[1])}, R₃ = ${(x=>x>=1000?fr(x/1000)+' MΩ':x+' kΩ')(v.d[2])} ; e) R₁ = R₂ = R₃ = ${v.e} kΩ.`,
        [{lbl:'a) Réqu',unit:'Ω',ans:par2(...v.a)},{lbl:'b) Réqu',unit:'Ω',ans:par2(...v.b)},{lbl:'c) Réqu',unit:'Ω',ans:parN(...v.c)},{lbl:'d) Réqu',unit:'kΩ',ans:parN(...v.d)},{lbl:'e) Réqu',unit:'kΩ',ans:v.e/3}],{hint:'En d) et e), tu peux calculer directement en kΩ.'}))(vx('A14x1',{a:[[100,150],[120,180],[220,330]],b:[[1000,820],[1500,1000],[2200,1200]],c:[[47,56,33],[68,82,39],[22,33,47]],d:[[560,1500,120],[470,1000,150],[680,2200,100]],e:[18,22,33]}))}
      ${(v=>AX(14,'A14x2',2,`Déterminer la valeur de la résistance équivalente du circuit à trois résistances en parallèle du cas c) (${v.c[0]} Ω, ${v.c[1]} Ω et ${v.c[2]} Ω).`,[{lbl:'Réqu',unit:'Ω',ans:parN(...v.c)}]))(vx('A14x1',{a:[[100,150],[120,180],[220,330]],b:[[1000,820],[1500,1000],[2200,1200]],c:[[47,56,33],[68,82,39],[22,33,47]],d:[[560,1500,120],[470,1000,150],[680,2200,100]],e:[18,22,33]}))}
      ${AX(14,'A14x3',3,'Un défaut est survenu dans le circuit précédent : on sait qu’une résistance a grillé, ouvrant ainsi la branche correspondante. Le courant I est alors de 564 mA. Quelle résistance a grillé ?',[],{sans:'Il faut la tension d’alimentation du circuit, qui figure sur le schéma de ton cours papier. Écris ton raisonnement dans le tableau : ton prof le vérifiera.'})}`},
  ],
  prereq:[{t:'Citer les caractéristiques électriques d’un circuit parallèle',cap:'A14a'},{t:'Calculer la résistance équivalente d’un groupement en parallèle',cap:'A14c'},{t:'Expliquer les conséquences d’un ampèremètre branché en parallèle',cap:'A14b'}],
});

/* =================== CHAPITRE 15 — LES RÉSISTANCES MIXTES =================== */
defAF(15, {
  Q:{
    A15aq1:{q:"Qu’est-ce que la résistance équivalente d’un montage ?",o:["La plus grande résistance du montage","La résistance qui, à elle seule, produit les mêmes effets que toutes les autres ensemble","La moyenne des résistances"],g:1,e:"Mêmes effets au niveau de l’intensité et du dégagement de chaleur.",r:'A15a'},
    A15aq2:{q:"Comment résoudre un circuit mixte ?",o:["En additionnant toutes les résistances","En le réduisant pas à pas : à chaque étape, on redessine le nouveau circuit avec les nouvelles valeurs","En appliquant seulement la formule du parallèle"],g:1,e:"On remplace un groupe série ou parallèle par sa Réqu, on redessine, et on recommence.",r:'A15a'},
  },
  caps:[
    {id:'A15a', sec:'15.1 — 15.4', t:'La résistance équivalente et la méthode', quiz:['A15aq1','A15aq2'], ex:{keys:['A15dem'], lbl:'La réduction pas à pas'},
     body:()=>`${progRef(['Décrire un montage mixte (série + parallèle)','Calculer courants, tensions et résistances équivalentes d’un montage mixte'],'p. 26')}
      <p class="lead">Un homme fort est-il capable de produire le même travail que trois hommes de force moyenne ? Oui. Pour les résistances, c’est pareil : il existe une résistance qui, à elle seule, remplace 2, 5 ou 100 autres résistances.</p>
      ${defBox('Définition','La résistance équivalente (Réqu) est la résistance qui, à elle seule, produit les mêmes effets que toutes les autres résistances prises ensemble : mêmes effets sur l’intensité et sur le dégagement de chaleur.')}
      <div class="grid g2" style="gap:10px">${fbox('Réqu = R1 + R2 + R3','montage série : les résistances s’additionnent')}${fbox('1 / Réqu = 1/R1 + 1/R2 + … + 1/Rn','montage parallèle : les inverses s’additionnent')}</div>
      <div class="note"><b>Méthodologie</b>Pour un circuit qui mélange série et parallèle, on dessine chaque fois le nouveau circuit obtenu et on y inscrit les nouvelles valeurs de résistance, jusqu’à n’avoir plus qu’une seule résistance.</div>
      <h3>Un exemple pour s’entraîner</h3>
      <p>R₁ = 4 Ω est en série avec un groupe de deux résistances en parallèle, R₂ = 6 Ω et R₃ = 3 Ω. Le tout est alimenté sous U = 12 V.</p>
      ${exbox('a15dem','Réduis le circuit, puis remonte aux courants','Une étape par ligne.')}`,
     mount:root=>mountDrillW(root.querySelector('#a15dem'),'A15dem',{rows:[{q:'1. Réqu de R₂ et R₃ en parallèle',unit:'Ω',ans:par2(6,3)},{q:'2. Réqu du circuit entier (R₁ en série)',unit:'Ω',ans:4+par2(6,3)},{q:'3. Courant total I = U / Réqu',unit:'A',ans:12/(4+par2(6,3))},{q:'4. Tension aux bornes de R₁',unit:'V',ans:4*12/(4+par2(6,3))},{q:'5. Tension aux bornes du groupe parallèle',unit:'V',ans:par2(6,3)*12/(4+par2(6,3))},{q:'6. Courant dans R₃',unit:'A',ans:par2(6,3)*12/(4+par2(6,3))/3}],ok:'Réduire, calculer le courant total, puis redescendre branche par branche : c’est la méthode.'})},
    {id:'A15b', sec:'15.5', t:'Exercices', quiz:[], ex:{keys:['A15x1','A15x2','A15x3'], lbl:'Les trois exercices'},
     body:()=>`<div class="note warn" style="margin-top:0"><b>Les schémas de ces circuits sont dans ton cours papier.</b>Sans le schéma, on ne sait pas quelles résistances sont en série ou en parallèle : la plateforme ne peut pas encore vérifier tes résultats. Remplis le tableau ; ton prof le vérifiera.</div>
      ${AX(15,'A15x1',1,'R₁ = 2 Ω ; R₂ = 12 Ω ; R₃ = 10 Ω ; I = 720 mA. Calculer : U = ? ; U₃ = ? ; I₁ = ? ; I₃ = ?',[],{sans:'Schéma du cours papier nécessaire : ton prof vérifiera ton tableau.'})}
      ${AX(15,'A15x2',2,'R₁ = 4 Ω ; R₂ = 8 Ω ; R₃ = 8 Ω ; R₄ = 2 Ω. Calculer : Réqu = ?',[],{sans:'Schéma du cours papier nécessaire : ton prof vérifiera ton tableau.'})}
      ${AX(15,'A15x3',3,'R₁ = 1 Ω ; R₂ = 2 Ω ; R₃ = 1 Ω ; R₄ = 2 Ω ; R₅ = 1 Ω ; R₆ = 1 Ω. Calculer : Réqu = ?',[],{sans:'Schéma du cours papier nécessaire : ton prof vérifiera ton tableau.'})}`},
  ],
  prereq:[{t:'Reconnaître les portions montées en série et celles montées en parallèle',cap:'A15a'},{t:'Réduire progressivement un circuit mixte à sa résistance équivalente',cap:'A15a'},{t:'Calculer la tension et l’intensité dans chaque résistance d’un montage mixte',cap:'A15b'}],
});

/* =================== CHAPITRE 16 — LES APPAREILS DE MESURES =================== */
const IM=50e-6, RM=2e3, VM=IM*RM, rs=(it)=>RM*IM/(it-IM);
defAF(16, {
  Q:{
    A16aq1:{q:"Pour transformer un cadre mobile en voltmètre de plus grand calibre, on ajoute une résistance…",o:["en parallèle (un shunt)","en série (un multiplicateur)","nulle part : on change d’aiguille"],g:1,e:"Le voltmètre est un circuit série : la résistance additionnelle prend la tension en trop.",r:'A16a'},
    A16aq2:{q:"Que veut dire « sensibilité 20 kΩ/V » ?",o:["Le voltmètre a 20 kΩ de résistance par volt de calibre","Il mesure 20 kV au maximum","Il consomme 20 kW"],g:0,e:"Un cadre de 50 µA donne toujours 20 kΩ/V : 1 / 50 µA = 20 000 Ω par volt.",r:'A16a'},
    A16bq1:{q:"Plus le calibre d’un ampèremètre est grand, plus la résistance du shunt est…",o:["grande","petite","la même"],g:1,e:"Le shunt doit dévier presque tout le courant : plus il y en a, plus il doit être petit. La résistance totale est inversement proportionnelle à la gamme.",r:'A16b'},
  },
  caps:[
    {id:'A16a', sec:'16.1', t:'Le voltmètre et sa résistance additionnelle', quiz:['A16aq1','A16aq2'], ex:{keys:['A16vo'], lbl:'Les exemples du cours'},
     body:()=>`${progRef(['Placer et utiliser correctement un ampèremètre, un voltmètre et un ohmmètre'],'pp. 25-26')}
      <p class="lead">Un voltmètre, c’est un appareil de mesure à <b>cadre mobile</b> auquel on ajoute une résistance en série.</p>
      <p>Le cadre mobile mesure le courant qui le traverse : la position de l’aiguille est proportionnelle à ce courant. Le plus utilisé dévie à fond d’échelle pour <b>50 µA</b>. Il a une résistance R<sub>m</sub>, un courant de déviation maximum I<sub>m</sub> et une tension de déviation maximum V<sub>m</sub> = R<sub>m</sub> . I<sub>m</sub>.</p>
      <p>Seul, il ne mesure que de très petites tensions. Une résistance en série, appelée <b>multiplicateur</b> (R<sub>a</sub>), en fait un voltmètre utile : elle prend la tension en trop, V<sub>a</sub> = V<sub>t</sub> − V<sub>m</sub>, parcourue par le même courant I<sub>m</sub>.</p>
      ${fbox('Ra = (Vt − Vm) / Im','Vt : calibre voulu — Vm, Im : tension et courant du cadre à pleine échelle')}
      ${exbox('a16vo','Refais les exemples du cours','Cadre mobile : 50 µA de déviation maximum, 2 kΩ de résistance.')}
      ${defBox('Définition','La quantité « ohm par volt » est la <b>sensibilité</b> de l’appareil. Un cadre de 50 µA donne toujours un voltmètre de 20 kΩ/V : (Ra + Rm) / Vt est le même pour chaque calibre, puisque le courant à pleine échelle reste 50 µA.')}`,
     mount:root=>mountDrillW(root.querySelector('#a16vo'),'A16vo',{rows:[{q:'Exemple 1 — tension de déviation maximum Vm = Im . Rm',unit:'V',ans:VM},{q:'Exemple 2 — multiplicateur pour le calibre 1 V',unit:'kΩ',ans:(1-VM)/IM/1000},{q:'Exemple 3 — multiplicateur pour le calibre 10 V',unit:'kΩ',ans:(10-VM)/IM/1000},{q:'Exemple 3 — multiplicateur pour le calibre 100 V',unit:'MΩ',ans:(100-VM)/IM/1e6}],ok:'18 kΩ, 198 kΩ, 1,998 MΩ : plus le calibre est grand, plus le multiplicateur est grand.',hint:'Im = 50 µA = 50 . 10⁻⁶ A ; Rm = 2 kΩ = 2 000 Ω.'})},
    {id:'A16b', sec:'16.2', t:'Le shunt d’ampèremètre', quiz:['A16bq1'], ex:{keys:['A16sh'], lbl:'Les gammes de l’ampèremètre'},
     body:()=>`<p>Le cadre mobile est un ampèremètre, mais sa gamme (50 µA) est bien trop petite. Pour mesurer plus, on place en <b>parallèle</b> une résistance appelée <b>shunt</b> (R<sub>s</sub>).</p>
      <p>Le courant à mesurer I<sub>T</sub> se partage : I<sub>m</sub> dans le cadre, I<sub>s</sub> dans le shunt.</p>
      <ul><li>Les courants s’additionnent : ${fm('IT = Im + Is')}, donc ${fm('Is = IT − Im')} (1).</li><li>Même tension aux bornes des deux : ${fm('Um = Us')}, donc ${fm('Rm . Im = Rs . Is')}, d’où ${fm('Rs = (Rm . Im) / Is')}.</li><li>En remplaçant Is par (1) :</li></ul>
      ${fbox('Rs = (Rm . Im) / (IT − Im)','la résistance du shunt d’ampèremètre')}
      <p class="small muted">Plutôt que de retenir cette formule par cœur, tu peux toujours la retrouver avec les lois du circuit parallèle.</p>
      ${exbox('a16sh','Les exemples du cours','Même cadre : 50 µA, 2 kΩ. Calcule le shunt pour chaque calibre.')}
      <div class="note"><b>Voltmètre et ampèremètre</b>Le voltmètre est un circuit série : quand la gamme augmente, le multiplicateur augmente, la résistance totale est proportionnelle à la gamme. L’ampèremètre est un circuit parallèle : quand la gamme augmente, le shunt diminue, la résistance totale est inversement proportionnelle à la gamme.</div>`,
     mount:root=>mountDrillW(root.querySelector('#a16sh'),'A16sh',{rows:[{q:'Calibre 1 mA (exemple 1)',unit:'Ω',ans:rs(1e-3)},{q:'Calibre 10 mA',unit:'Ω',ans:rs(10e-3)},{q:'Calibre 100 mA',unit:'Ω',ans:rs(0.1)},{q:'Calibre 1 A',unit:'Ω',ans:rs(1)}],ok:'105,3 Ω, puis environ 10 Ω, 1 Ω et 0,1 Ω.'})},
    {id:'A16c', sec:'16.3', t:'Exercices', quiz:[], ex:{keys:['A16x1','A16x2','A16x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Voltmètre : une résistance en série. Ampèremètre : un shunt en parallèle. Dans la colonne « Solution », dis aussi où tu la places.</p>
      ${(v=>AX(16,'A16x1',1,`Un appareil de mesure a une résistance interne de ${v.R} Ω et dévie à fond d’échelle pour ${v.I} mA. Que faut-il faire pour le transformer en voltmètre calibre ${v.U} V ?`,[{lbl:'Résistance additionnelle (en série)',unit:'Ω',ans:(v.U-v.R*v.I*1e-3)/(v.I*1e-3),tol:0.002}],{hint:'Commence par Vm = Rm . Im.'}))(vx('A16x1',{R:[100,200],I:[1,2],U:[50,100,200]}))}
      ${(v=>AX(16,'A16x2',2,`Déterminer la résistance additionnelle à placer dans le circuit d’un voltmètre de résistance interne de ${v.R} Ω et de calibre ${v.c} V, pour en faire un appareil de calibre ${v.U} V.`,[{lbl:'Résistance additionnelle (en série)',unit:'Ω',ans:(v.U-v.c)/(v.c/v.R)}],{hint:'Commence par le courant à pleine échelle : calibre / résistance interne.'}))(vx('A16x2',{R:[60,100],c:[10,12],U:[100,120,150]}))}
      ${(v=>AX(16,'A16x3',3,`Un appareil de mesure a une résistance de ${v.R} Ω et dévie à fond d’échelle pour ${v.I} mA. Que faut-il faire pour le transformer en ampèremètre calibre ${v.A} A ?`,[{lbl:'Shunt (en parallèle)',unit:'Ω',ans:v.R*v.I*1e-3/(v.A-v.I*1e-3)}]))(vx('A16x3',{R:[100,200],I:[1,2],A:[5,10,20]}))}`},
  ],
  prereq:[{t:'Décrire le principe d’un appareil de mesure à cadre mobile',cap:'A16a'},{t:'Calculer la résistance additionnelle (multiplicateur) d’un voltmètre',cap:'A16a'},{t:'Calculer la résistance shunt d’un ampèremètre',cap:'A16b'},{t:'Choisir et utiliser l’appareil adapté à la grandeur à mesurer',cap:'A16c'}],
});
})();
