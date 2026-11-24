/* =====================================================================
   MÉCANIQUE 4e — EXERCICES « COMME AU BILAN »
   Les exercices du bilan de juin, pour s'entraîner dans les capsules (chapitres 6, 7 et 9) :
   d'abord placer les données et l'inconnue sur le dessin (schemas.js), puis le tableau en quatre colonnes.
   Chaque élève a ses propres valeurs (vx) ; les valeurs du bilan n'y figurent pas.
   BILEX[type](valeurs) construit un exercice ; le bilan lui-même (valeurs, réponses) est sur le serveur.
   ===================================================================== */
const bn = (x, d=3) => fr(x, d);
const BILEX = {
  /* roues de friction avec glissement : on cherche le diamètre de la roue menée */
  friction: v => ({ enonce:`Une roue de friction de ${bn(v.D)} mm de diamètre tourne à ${v.N.toLocaleString('fr-BE')} tr/min. Elle entraîne une roue qui doit tourner à ${v.Np} tr/min. Calcule le diamètre de cette dernière, sachant que le glissement est de ${v.g} %.`,
    scenes:[{type:'friction'}], tokens:[`D = ${bn(v.D)} mm`,`N = ${v.N.toLocaleString('fr-BE')} tr/min`,`N’ = ${v.Np} tr/min`,'D’ = ?',`gl = ${v.g} %`], place:{d:0,n:1,np:2,dp:3,gl:4},
    res:[{lbl:'D’',unit:'mm',ans:v.D*v.N*(1-v.g/100)/v.Np}] }),
  /* poulies et courroie sur un moteur, avec glissement : on cherche la vitesse de la poulie menée */
  belt: v => ({ enonce:`L’arbre d’un moteur tourne à ${v.N.toLocaleString('fr-BE')} tr/min et porte une poulie de ${v.D} mm de diamètre. Cette poulie entraîne, à l’aide d’une courroie, ${v.vol?'un volant':'une poulie'} de ${v.Dp} mm de diamètre. Le glissement étant de ${v.g} %, calcule la vitesse de rotation ${v.vol?'du volant':'de cette poulie'}.`,
    scenes:[{type:'belt',p:{motor:true}}], tokens:[`D = ${v.D} mm`,`N = ${v.N.toLocaleString('fr-BE')} tr/min`,`gl = ${v.g} %`,`D’ = ${v.Dp} mm`,'N’ = ?'], place:{d:0,n:1,gl:2,dp:3,np:4},
    res:[{lbl:'N’',unit:'tr/min',ans:v.N*v.D*(1-v.g/100)/v.Dp}] }),
  /* cônes de poulies à trois étages */
  cone: v => { const [d1,d2,d3,e3]=v.c, S=d3+e3, k=1-v.g/100;
    return { enonce:`Dans un dispositif à cônes de poulies à trois étages, on donne les diamètres du cône menant : ${d1} mm, ${d2} mm et ${d3} mm, et le petit diamètre du cône mené : ${e3} mm. Le cône menant tourne à ${v.N} tr/min et le glissement est de ${v.g} %. Calcule les autres diamètres du cône mené et les trois vitesses à la réception.`,
      scenes:[{type:'cone'}], tokens:[`D1 = ${d1} mm`,`D2 = ${d2} mm`,`D3 = ${d3} mm`,`N = ${v.N} tr/min`,'D’1 = ?','N’1 = ?','D’2 = ?','N’2 = ?',`D’3 = ${e3} mm`,'N’3 = ?',`gl = ${v.g} %`],
      place:{d1:0,d2:1,d3:2,n:3,e1:4,m1:5,e2:6,m2:7,e3:8,m3:9,gl:10},
      res:[{lbl:'D’1',unit:'mm',ans:S-d1},{lbl:'D’2',unit:'mm',ans:S-d2},{lbl:'N’1',unit:'tr/min',ans:v.N*d1*k/(S-d1)},{lbl:'N’2',unit:'tr/min',ans:v.N*d2*k/(S-d2)},{lbl:'N’3',unit:'tr/min',ans:v.N*d3*k/e3}],
      hint:'La même courroie passe sur chaque étage : D1 + D’1 = D2 + D’2 = D3 + D’3.' }; },
  /* pignon et roue reliés par une chaîne */
  chain: v => ({ enonce:`Un pignon de ${v.Z} dents tourne à ${v.N.toLocaleString('fr-BE')} tr/min et entraîne, à l’aide d’une chaîne, une roue dentée de ${v.Zp} dents. Calcule la vitesse de rotation de la roue dentée.`,
    scenes:[{type:'chain'}], tokens:[`Z = ${v.Z} dents`,`N = ${v.N.toLocaleString('fr-BE')} tr/min`,`Z’ = ${v.Zp} dents`,'N’ = ?'], place:{z:0,n:1,zp:2,np:3},
    res:[{lbl:'N’',unit:'tr/min',ans:v.Z*v.N/v.Zp}] }),
  /* deux roues dentées : on cherche le nombre de dents de la roue */
  gears: v => ({ enonce:`Un pignon de ${v.Z} dents tourne à ${v.N.toLocaleString('fr-BE')} tr/min et attaque une roue dentée qui doit tourner à ${v.Np} tr/min. Détermine le nombre de dents de cette roue dentée.`,
    scenes:[{type:'gears'}], tokens:[`Z = ${v.Z} dents`,`N = ${v.N.toLocaleString('fr-BE')} tr/min`,'Z’ = ?',`N’ = ${v.Np} tr/min`], place:{z:0,n:1,zp:2,np:3},
    res:[{lbl:'Z’',unit:'dents',ans:v.Z*v.N/v.Np}] }),
  /* vis sans fin : on cherche le nombre de dents de la roue */
  worm: v => ({ enonce:`Une vis à ${v.e} entrée${v.e>1?'s':''} tourne à ${v.N.toLocaleString('fr-BE')} tr/min. Elle attaque une roue qui doit tourner à ${v.Np} tr/min. Quel est le nombre de dents de cette roue ?`,
    scenes:[{type:'worm'}], tokens:[`vis à ${v.e} entrée${v.e>1?'s':''}`,`N = ${v.N.toLocaleString('fr-BE')} tr/min`,'Z’ = ?',`N’ = ${v.Np} tr/min`], place:{z:0,n:1,zp:2,np:3},
    res:[{lbl:'Z’',unit:'dents',ans:v.e*v.N/v.Np}] }),
  /* moteur, pignon et roue : on cherche le nombre de dents du pignon */
  motorgear: v => ({ enonce:`L’arbre d’un moteur électrique tourne à ${v.N.toLocaleString('fr-BE')} tr/min. Un pignon monté sur cet arbre entraînera une roue dentée de ${v.Zp} dents, qui devra tourner à ${v.Np} tr/min. Quel sera le nombre de dents du pignon à caler sur l’arbre du moteur ?`,
    scenes:[{type:'motorgear'}], tokens:[`N = ${v.N.toLocaleString('fr-BE')} tr/min`,'Z = ?',`Z’ = ${v.Zp} dents`,`N’ = ${v.Np} tr/min`], place:{n:0,z:1,zp:2,np:3},
    res:[{lbl:'Z',unit:'dents',ans:v.Zp*v.Np/v.N}] }),
  /* moteur, vis sans fin, roue et rouleau : on cherche la vitesse du rouleau */
  wormroller: v => ({ enonce:`Sur base du schéma et des données ci-dessous, calcule la vitesse de rotation du rouleau, en tr/min. Le moteur tourne à ${v.N.toLocaleString('fr-BE')} tr/min ; il entraîne une vis à ${v.e} entrée${v.e>1?'s':''}, qui attaque une roue de ${v.Zp} dents calée sur l’arbre du rouleau.`,
    scenes:[{type:'worm',p:{motor:true,roller:true}}], tokens:[`N = ${v.N.toLocaleString('fr-BE')} tr/min`,`vis à ${v.e} entrée${v.e>1?'s':''}`,`roue Z’ = ${v.Zp} dents`,'N’ (rouleau) = ?'], place:{n:0,z:1,zp:2,np:3},
    res:[{lbl:'N’ du rouleau',unit:'tr/min',ans:v.N*v.e/v.Zp}] }),
  /* levier : la charge entre l'appui et la force (inter-résistant) */
  leverir: v => ({ enonce:`Un levier s’appuie à une extrémité. Une charge Q = ${v.Q} kg est suspendue à ${bn(v.a)} m de l’appui ; la force F est appliquée vers le haut, ${bn(v.b)} m plus loin, au bout du levier. Calcule la force F.`,
    scenes:[{type:'lever',p:{kind:'ir',k:v.a/(v.a+v.b)}}], tokens:[`Q = ${v.Q} kg`,'F = ?',`${bn(v.a)} m`,`${bn(v.b)} m`], place:{q:0,f:1,a:2,b:3},
    res:[{lbl:'F',unit:'kg',ans:v.Q*v.a/(v.a+v.b)}], hint:'Les bras de levier se mesurent depuis l’appui.' }),
  /* levier : la force entre l'appui et la charge (inter-moteur) */
  leverim: v => ({ enonce:`Un levier s’appuie à une extrémité. Une force F = ${bn(v.F)} T est appliquée vers le haut à ${bn(v.a)} m de l’appui ; la charge Q est suspendue ${bn(v.b)} m plus loin, au bout du levier. Quelle charge Q (en kg) ce levier peut-il équilibrer ?`,
    scenes:[{type:'lever',p:{kind:'im',k:v.a/(v.a+v.b)}}], tokens:['Q = ?',`F = ${bn(v.F)} T`,`${bn(v.a)} m`,`${bn(v.b)} m`], place:{q:0,f:1,a:2,b:3},
    res:[{lbl:'Q',unit:'kg',ans:v.F*1000*v.a/(v.a+v.b)}], hint:'1 T = 1 000 kg. Les bras de levier se mesurent depuis l’appui.' }),
  /* un véhicule tiré sur un plateau par un treuil simple monté en poulie mobile */
  plateau: v => ({ enonce:`Un véhicule pesant ${v.Q.toLocaleString('fr-BE')} kg est remorqué sur un plateau. La longueur des rampes est de ${bn(v.L)} m et la hauteur du plateau par rapport au sol est de ${Math.round(v.h*100)} cm. Calcule : a) l’angle du plan incliné ; b) la force de traction dans le câble si l’effort est parallèle au plan ; c) la force exercée par le dépanneur sur la manivelle d’un treuil simple monté en poulie mobile, sachant que le diamètre du tambour est de ${v.d} cm et la longueur de la manivelle ${bn(v.m)} m.`,
    scenes:[{type:'ramp'},{type:'winch'}], tokens:[`Q = ${v.Q.toLocaleString('fr-BE')} kg`,'F (câble) = ?',`L = ${bn(v.L)} m`,`h = ${Math.round(v.h*100)} cm`,'α = ?',`d = ${v.d} cm`,`manivelle = ${bn(v.m)} m`,'F manivelle = ?','F (câble) tire la poulie'],
    place:{q:0,f:1,l:2,h:3,al:4,d:5,lm:6,fm:7,qc:8},
    res:[{lbl:'a) α',unit:'°',ans:Math.asin(v.h/v.L)*180/Math.PI},{lbl:'b) F (câble)',unit:'kg',ans:v.Q*v.h/v.L},{lbl:'c) F manivelle',unit:'kg',ans:v.Q*v.h/v.L/2*(v.d/200)/v.m}],
    hint:'sin α = h / L (mêmes unités). La poulie mobile divise l’effort par 2 ; le treuil : F = Q . r / L, avec r le rayon du tambour.' }),
};
/* un exercice d'entraînement : le dessin à compléter, puis le tableau */
function entItem(n, key, num, type, vals){
  const x=BILEX[type](vals);
  return { key, html:`<div class="figure exw" style="padding:14px"><div class="row" style="gap:8px"><span class="exn">${num}</span><b>Exercice ${num} — le dessin</b></div>
      <div class="difs-en">${x.enonce}</div><div data-plw="${key}p"></div></div>
    ${MX(n, key, num, `<b>Le tableau de l’exercice ${num}</b> : reprends les données de ton dessin. <details class="small" style="margin-top:4px"><summary style="cursor:pointer">Rappel de l’énoncé</summary>${x.enonce}</details>`, x.res, {hint:x.hint||''})}`,
    mount:root=>mountPlaceW(root.querySelector(`[data-plw="${key}p"]`), key+'p', { scenes:x.scenes, tokens:x.tokens, place:x.place }) };
}
/* ajoute la capsule « Comme au bilan » à la fin du chapitre n */
function entMC(n, sec, intro, items){
  const ch=CHAPTERS['10.'+n]; if(!ch) return;
  const build=()=>items.map(([type,vars,map],i)=>{ const v=vx(`M${n}z${i+1}`, vars); return entItem(n, `M${n}z${i+1}`, i+1, type, map?map(v):v); });   // map : valeurs liées tirées ensemble (pour des nombres de dents entiers)
  const keys=items.flatMap((_,i)=>[`M${n}z${i+1}p`,`M${n}z${i+1}`]);
  const cap={ id:'M'+n+'z', sec, t:'Comme au bilan', chap:ch.num, quiz:[], ex:{keys, lbl:'Les dessins et les tableaux'},
    body:()=>`<p class="lead">${intro}</p>
      <div class="note" style="margin-top:0"><b>Comme le jour du bilan</b>Pour chaque exercice : d’abord tu places les données et l’inconnue sur le dessin, puis tu complètes le tableau (données, inconnue, formule, solution, avec les unités). Ici, tu vois tout de suite si c’est juste ; au bilan, c’est ton prof qui corrige.</div>
      ${build().map(x=>x.html).join('')}`,
    mount:root=>{ build().forEach(x=>x.mount(root)); mountAllDIFS(root); mountTriangles(root); } };
  ch.caps.push(cap);
}

/* ---------- formule du glissement, utilisée au bilan ---------- */
(function(){ const F=FORMULAIRES[MC_COURSE]; if(!F) return; const i=F.lois.findIndex(l=>/^Poulies, courroie/.test(l[0]));
  F.lois.splice(i+1, 0, ['Poulies ou roues de friction avec glissement','N’ = N . d . (1 − gl) / d’',['d’ = d . N . (1 − gl) / N’','gl = 4 % → (1 − gl) = 0,96'],'gl : glissement (en %, à écrire 0,04) — la roue menée tourne moins vite','6']); })();

entMC(6, '6.4', 'Les exercices de transmission du bilan de juin, avec tes propres valeurs. Avec un glissement, la roue menée tourne un peu moins vite : N’ = N . d . (1 − gl) / d’ (un glissement de 4 % donne 1 − 0,04 = 0,96).', [
  ['friction', {D:[80,100,120], N:[1500,2000,3000], Np:[400,500,600], g:[10,12,15]}],
  ['belt', {N:[1450,1440,2900], D:[150,180,250], Dp:[600,720,900], g:[3,5], vol:[false]}],
  ['cone', {c:[[150,300,450,100],[100,250,400,150],[250,350,450,200]], N:[400,600,800], g:[3,5]}],
  ['belt', {N:[960,1450,720], D:[300,250,400], Dp:[700,600,900], g:[3,5], vol:[true]}],
  ['chain', {Z:[20,30,36], N:[800,1200,1500], Zp:[12,15,18]}],
  ['gears', {t:[[30,1200,600],[36,1440,960],[48,1800,900],[40,1450,725]]}, v=>({Z:v.t[0],N:v.t[1],Np:v.t[2]})],
  ['worm', {t:[[1,1500,25],[2,1440,40],[4,1000,50],[3,1500,45]]}, v=>({e:v.t[0],N:v.t[1],Np:v.t[2]})],
  ['motorgear', {t:[[1440,72,480],[1500,90,600],[1000,60,400],[2880,96,600]]}, v=>({N:v.t[0],Zp:v.t[1],Np:v.t[2]})],
  ['wormroller', {N:[1400,1450,960], e:[1,3], Zp:[60,72,90]}],
]);
entMC(7, '7.3', 'Les leviers du bilan de juin, avec tes propres valeurs. Place les données sur le dessin : la charge, la force, et les deux distances mesurées depuis l’appui.', [
  ['leverir', {Q:[150,250,300], a:[0.5,0.8,1.2], b:[2,2.5]}],
  ['leverim', {F:[0.8,1.2,1.5], a:[0.4,0.6], b:[1.8,2.5]}],
]);
entMC(9, '9.7', 'L’exercice de synthèse du bilan de juin : un plan incliné, un treuil et une poulie mobile, avec tes propres valeurs. Le jour du bilan, on te demande aussi les trois schémas.', [
  ['plateau', {Q:[800,1200,1500], L:[2.4,3,3.2], h:[0.6,0.7,0.9], d:[20,30], m:[0.4,0.5]}],
]);
