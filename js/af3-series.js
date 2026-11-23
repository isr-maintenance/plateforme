/* =====================================================================
   AMPÈRE & FILS — 3QEM : LES SÉRIES D'EXERCICES (le devoir de chaque chapitre)
   Une capsule « Série d'exercices » est ajoutée à la fin des chapitres 6 à 16 et 20.
   Les énoncés viennent du cours (section DEVOIR). Les réponses sont calculées ici,
   jamais recopiées : tableau en quatre colonnes, corrigé automatiquement.
   Données variables : chaque élève reçoit ses propres valeurs (vx, js/formules.js) ; chaque liste
   contient en principe la valeur du cours papier. Un item s'écrit D({grandeur:[valeurs]}, v => [énoncé, résultats, options]).
   Clés : capsule A6s, exercices A6s1, A6s2…  (texte:true = question à justifier, vue par le prof)
   ===================================================================== */
(function(){
const RHO_CU = 0.0175;
const sec = (d) => Math.PI*d*d/4;                 // section d'un fil rond (mm²) à partir du diamètre (mm)
const p2 = (a,b) => a*b/(a+b);
const pN = (...r) => 1/r.reduce((s,x)=>s+1/x,0);
const r0 = (rt,a,t) => rt/(1+a*t);                 // résistance ramenée à 0 °C (loi de Mathiessen)
const rt = (r,a,t) => r*(1+a*t);
const L = (...l) => l.join('<br>');                 // énoncé sur plusieurs lignes (a, b, c…)
const n = (x, d=3) => fr(x, d);                     // nombre à la belge : 2,5 · 0,0175
const r4 = x => Math.round(x*1e4)/1e4;              // valeur affichée arrondie (la réponse part de ce que l'élève lit)
const D = (v, f) => ({ v, f });                     // item à données variables
const JUSTIF = 'Question à justifier : écris ton raisonnement. Ton prof le lira dans Suivi.';

/* ajoute la capsule « Série d'exercices » au chapitre ch_n ; items : [énoncé, résultats, options] ou D(valeurs, v => [...]) */
function serieAF(ch_n, items, intro){
  const ch = CHAPTERS['0.'+ch_n]; if(!ch) return;
  const keys = items.map((_,i)=>'A'+ch_n+'s'+(i+1));
  const cap = { id:'A'+ch_n+'s', sec:'Devoir', t:'Série d’exercices', chap:ch.num, quiz:[],
    ex:{ keys, lbl:'Toute la série ('+items.length+' exercices)' },
    body:()=>`<p class="lead">${intro||'La série complète du devoir de ce chapitre. Pour chaque exercice : les données, l’inconnue, la formule, puis la solution avec son unité.'}</p>
      <div class="note" style="margin-top:0"><b>Comment ça marche</b>Les résultats chiffrés sont vérifiés tout de suite. Les questions « à justifier » sont lues par ton prof. Tu peux t’arrêter et reprendre plus tard : ce que tu écris est enregistré. Attention : tes valeurs ne sont pas forcément celles de ton voisin.</div>
      ${items.map((it,i)=>{ const [en,res,more] = Array.isArray(it) ? it : it.f(vx(keys[i], it.v));
        return AX(ch_n, keys[i], i+1, en, res, Object.assign({nom:'Devoir'}, more||{})); }).join('')}`,
    mount:root=>{ mountAllDIFS(root); mountTriangles(root); } };
  ch.caps.push(cap);
}

/* ---------- CHAPITRE 6 — La quantité d'électricité ---------- */
serieAF(6, [
  D({I:[10,13,16,20,32], t:[4,5,6,7,8]}, v=>[`Une borne de recharge domestique alimente un véhicule électrique avec un courant constant de ${n(v.I)} A pendant ${n(v.t)} h. Calculer la quantité d’électricité fournie à la batterie, en ampères-heures puis en coulombs.`,
    [{lbl:'Q',unit:'Ah',ans:v.I*v.t},{lbl:'Q',unit:'C',ans:v.I*v.t*3600}],{hint:'1 Ah = 3 600 C.'}]),
  D({C:[10,12,14,15,18], I:[1.5,2,2.5,3]}, v=>[`La batterie d’un vélo électrique a une capacité de ${n(v.C)} Ah. Elle est rechargée par un chargeur qui fournit un courant constant de ${n(v.I)} A. Combien de temps (en heures) faut-il pour la recharger complètement ?`,
    [{lbl:'t',unit:'h',ans:v.C/v.I}]]),
  D({I:[1.5,2,2.5,3], m:[30,40,45,50,60]}, v=>[`Un smartphone est rechargé en charge rapide sous un courant de ${n(v.I)} A pendant ${v.m} minutes. Calculer la quantité d’électricité, en coulombs, transmise à la batterie durant cette charge.`,
    [{lbl:'Q',unit:'C',ans:v.I*v.m*60}],{hint:'En coulombs, le temps doit être en secondes.'}]),
  D({C:[50,80,100,150,200], I:[2,4,5,8,10]}, v=>[`Une batterie domestique de stockage, associée à des panneaux photovoltaïques, a une capacité de ${n(v.C)} Ah. Elle se décharge à un régime constant de ${n(v.I)} A pour alimenter la maison durant une coupure de réseau. Pendant combien de temps pourra-t-elle fournir de l’électricité ?`,
    [{lbl:'t',unit:'h',ans:v.C/v.I}]]),
  D({I:[1.5,2,2.5,3], t:[2,3,4,5]}, v=>[`Une trottinette électrique reçoit une quantité d’électricité de ${(v.I*v.t*3600).toLocaleString('fr-BE')} C au cours d’une charge de ${n(v.t)} h. Quelle est l’intensité moyenne du courant de charge ?`,
    [{lbl:'I',unit:'A',ans:v.I}],{hint:'Des coulombs avec des heures : convertis d’abord le temps en secondes.'}]),
  D({I:[5,6,8,10,12], d:[[2.5,'2 h 30'],[1.5,'1 h 30'],[3,'3 h'],[3.5,'3 h 30'],[2,'2 h']]}, v=>[L(`Un onduleur solaire charge une batterie domestique de 48 V sous un courant constant de ${n(v.I)} A pendant ${v.d[1]}.`,'a) Calculer la quantité d’électricité stockée, en ampères-heures.','b) Convertir ce résultat en coulombs.'),
    [{lbl:'a) Q',unit:'Ah',ans:v.I*v.d[0]},{lbl:'b) Q',unit:'C',ans:v.I*v.d[0]*3600}],{hint:'Une demi-heure = 0,5 h (2 h 30 = 2,5 h, et pas 2,3 h).'}]),
  D({C:[36,45,60,72], I:[0.4,0.5,0.6,0.75], h:[2,3,4]}, v=>[`Une batterie de secours (ancienne génération, au plomb) a une capacité de ${n(v.C)} Ah. Elle alimente un éclairage de secours consommant un courant de ${n(v.I)} A, à raison de ${v.h} h par jour. Pendant combien de jours pourra-t-elle fonctionner avant d’être déchargée ?`,
    [{lbl:'Durée',unit:'jours',ans:v.C/v.I/v.h}],{hint:`Calcule d’abord le nombre d’heures, puis divise par ${v.h} h par jour.`}]),
]);

/* ---------- CHAPITRE 7 — La résistance d'un conducteur (loi de Pouillet) ---------- */
const METAUX = [['cuivre',0.0175],['aluminium',0.028],['argent',0.016]];
serieAF(7, [
  D({L:[20,30,40,50], S:[4,6,10]}, v=>[`Une installation photovoltaïque comprend une chaîne (string) de 10 panneaux en série, chacun de 400 Wc (Vmp = 32 V, Imp = 12,5 A). Le câble DC (cuivre, ρ = 0,0175 Ω.mm²/m) qui relie les panneaux à l’onduleur a une longueur aller-retour de ${v.L} m et une section de ${n(v.S)} mm². Calculer la résistance du câble, puis la chute de tension qu’il occasionne au courant Imp.`,
    [{lbl:'R du câble',unit:'Ω',ans:RHO_CU*v.L/v.S},{lbl:'Chute de tension',unit:'V',ans:RHO_CU*v.L/v.S*12.5}],{hint:'La chute de tension : U = R . I avec le courant Imp.'}]),
  D({p:[2,3,4], L:[30,40,50,60]}, v=>[`On souhaite limiter la chute de tension dans le câble DC d’une installation photovoltaïque à ${v.p} % maximum. La chaîne de panneaux fonctionne sous une tension Vmp = 320 V et un courant Imp = 12,5 A ; le câble (cuivre, ρ = 0,0175 Ω.mm²/m) mesure ${v.L} m aller-retour. Quelle section minimale doit-on choisir ?`,
    [{lbl:'Chute de tension admise',unit:'V',ans:v.p/100*320},{lbl:'R maximale du câble',unit:'Ω',ans:v.p/100*320/12.5},{lbl:'S minimale (calculée)',unit:'mm²',ans:RHO_CU*v.L/(v.p/100*320/12.5)}],
    {tip:'Donne la section calculée ; dans ta solution, indique la section normalisée que tu choisirais au-dessus.'}]),
  D({S:[4,6,10], L:[10,15,20,25]}, v=>[`Une borne de recharge pour voiture électrique est alimentée par un câble en cuivre de section ${n(v.S)} mm² sur une longueur de ${v.L} m (aller-retour). Calculer la résistance de ce câble. (ρ cuivre = 0,0175 Ω.mm²/m)`,
    [{lbl:'R',unit:'Ω',ans:RHO_CU*v.L/v.S}]]),
  D({L:[40,50,60,80], S:[10,16,25]}, v=>[`On remplace un câble aérien en aluminium (ρ = 0,028 Ω.mm²/m) de ${v.L} m et ${n(v.S)} mm² de section par un câble en cuivre de même résistance. Quelle section de cuivre faut-il choisir ?`,
    [{lbl:'R du câble aluminium',unit:'Ω',ans:0.028*v.L/v.S},{lbl:'S du câble cuivre',unit:'mm²',ans:RHO_CU*v.L/(0.028*v.L/v.S)}]]),
  D({d:[2,2.5,2.8,3], L:[15,20,25,30]}, v=>[`Un câble solaire (PV) présente une section circulaire de diamètre ${n(v.d)} mm. Calculer sa section en mm² (S = π . d² / 4), puis sa résistance pour une longueur de ${v.L} m en cuivre.`,
    [{lbl:'S',unit:'mm²',ans:sec(v.d)},{lbl:'R',unit:'Ω',ans:RHO_CU*v.L/sec(v.d)}]]),
  D({La:[20,25,30], Sa:[2.5,4,6], Lb:[10,15,20], Rb:[0.04,0.05,0.06], Rc:[0.08,0.1,0.12], Sc:[1.5,2.5,4], m:METAUX, Ld:[20,30,40], Sd:[4,6,10]}, v=>{ const Rd=r4(v.m[1]*v.Ld/v.Sd); return [L('Trois grandeurs sont données ; calculer la quatrième à l’aide de R = ρ . L / S, dans le contexte d’une installation photovoltaïque :',
     `a) ρ = 0,0175 Ω.mm²/m, L = ${v.La} m, S = ${n(v.Sa)} mm² — calculer R.`,
     `b) ρ = 0,0175 Ω.mm²/m, L = ${v.Lb} m, R = ${n(v.Rb)} Ω — calculer S.`,
     `c) ρ = 0,0175 Ω.mm²/m, R = ${n(v.Rc)} Ω, S = ${n(v.Sc)} mm² — calculer L.`,
     `d) L = ${v.Ld} m, S = ${n(v.Sd)} mm², R = ${n(Rd,4)} Ω — calculer ρ, et identifier le métal correspondant.`),
    [{lbl:'a) R',unit:'Ω',ans:RHO_CU*v.La/v.Sa},{lbl:'b) S',unit:'mm²',ans:RHO_CU*v.Lb/v.Rb},{lbl:'c) L',unit:'m',ans:v.Rc*v.Sc/RHO_CU},{lbl:'d) ρ',unit:'Ω.mm²/m',ans:Rd*v.Sd/v.Ld,tol:0.01}],
    {tip:'Le nom du métal (d) va dans ta solution.'}]; }),
]);

/* ---------- CHAPITRE 8 — La loi d'Ohm ---------- */
serieAF(8, [
  D({U:[30,32,34,36], I:[11.5,12,12.5,13]}, v=>[`Un panneau photovoltaïque a une tension de fonctionnement optimal (Vmp) de ${n(v.U)} V et un courant optimal (Imp) de ${n(v.I)} A. Calculer, à l’aide de la loi d’Ohm, la résistance équivalente de la charge (onduleur) vue par le panneau à ce point de fonctionnement.`,
    [{lbl:'R',unit:'Ω',ans:v.U/v.I}]]),
  D({I:[10,16,20,32]}, v=>[`Une borne de recharge pour voiture électrique délivre une tension de 230 V et un courant de ${n(v.I)} A en charge monophasée. Calculer la résistance équivalente du circuit de charge.`,
    [{lbl:'R',unit:'Ω',ans:230/v.I}]]),
  D({U:[24,48], R:[4.8,6,8,9.6,12]}, v=>[`En cas de coupure de réseau, une batterie domestique de ${v.U} V alimente un groupe d’appareils équivalent à une résistance de ${n(v.R)} Ω. Calculer le courant fourni par la batterie.`,
    [{lbl:'I',unit:'A',ans:v.U/v.R}]]),
  D({I:[8,10,13,16]}, v=>[`Une plaque à induction fonctionne sous 230 V et absorbe un courant de ${v.I} A à pleine puissance. Calculer sa résistance équivalente.`,
    [{lbl:'R',unit:'Ω',ans:230/v.I}]]),
  D({U:[12,24], R:[4,6,8,12]}, v=>[`Un ruban LED d’éclairage domestique, alimenté en ${v.U} V continu, présente une résistance équivalente de ${n(v.R)} Ω. Calculer l’intensité du courant qui le traverse.`,
    [{lbl:'I',unit:'A',ans:v.U/v.R}]]),
  D({U:[5,9,12], I:[1.5,2,3]}, v=>[`Un chargeur rapide pour smartphone délivre une tension de ${v.U} V (mode charge rapide) sous un courant de ${n(v.I)} A. Calculer la résistance équivalente du circuit de charge à cet instant.`,
    [{lbl:'R',unit:'Ω',ans:v.U/v.I}]]),
  D({Rp:[2.4,2.56,2.8], Ip:[12,12.5,13], Rb:[6,8,9.6], Ib:[16,20,32]}, v=>['Compléter le tableau ci-dessous, relatif à trois éléments d’une installation domestique avec production solaire.'
     + tbl(['','Panneau PV','Batterie domestique','Borne de recharge'],[['R',`${n(v.Rp)} Ω`,`${n(v.Rb)} Ω`,'a) ?'],['I',`${n(v.Ip)} A`,'b) ?',`${v.Ib} A`],['U','c) ?','48 V','230 V']]),
    [{lbl:'a) R de la borne',unit:'Ω',ans:230/v.Ib},{lbl:'b) I de la batterie',unit:'A',ans:48/v.Rb},{lbl:'c) U du panneau',unit:'V',ans:v.Rp*v.Ip}]]),
]);

/* ---------- CHAPITRE 9 — La résistance et la température (loi de Mathiessen) ---------- */
const A_AL=4.3e-3, A_W=6.5e-3, A_AG=3.85e-3, A_PT=3.85e-3, A_NI=2e-4;
serieAF(9, [
  D({R:[0.3,0.4,0.5], T:[60,65,70,75]}, v=>[`Un câble en aluminium de la ligne DC entre deux rangées de panneaux photovoltaïques présente une résistance de ${n(v.R)} Ω à 25 °C. Par forte chaleur, sa température atteint ${v.T} °C. Calculer sa nouvelle résistance. (α aluminium = 4,3 . 10⁻³)`,
    [{lbl:`R à ${v.T} °C`,unit:'Ω',ans:rt(r0(v.R,A_AL,25),A_AL,v.T)}],{tip:'La résistance est donnée à 25 °C, pas à 0 °C : ramène-la d’abord à 0 °C.'}]),
  D({R:[0.05,0.1,0.2], T:[20,25,30]}, v=>[`Un shunt de mesure (résistance étalon) en Manganine, utilisé dans un multimètre de chantier, présente une résistance de ${n(v.R)} Ω à 0 °C. Que devient cette résistance lorsque l’appareil est utilisé à la température ambiante de ${v.T} °C ? (α Manganine ≈ 0)`,
    [{lbl:`R à ${v.T} °C`,unit:'Ω',ans:v.R,tol:0.005}],{hint:'Avec α ≈ 0, que vaut 1 + α . t ?'}]),
  D({R:[0.06,0.08,0.1], T:[-10,-5,0]}, v=>[`La résistance interne d’une batterie lithium de vélo électrique vaut ${n(v.R)} Ω à 20 °C. Par une froide matinée d’hiver, sa température chute à ${String(v.T).replace('-','−')} °C. On modélise cette variation, sur cette plage de température, par un coefficient de température équivalent α = −0,02 /°C (comportement à coefficient négatif, comme pour le carbone, mais plus marqué). Calculer sa nouvelle résistance interne. Que peut-on en déduire sur les performances de la batterie par temps froid ?`,
    [{lbl:'Nouvelle R',unit:'Ω',ans:rt(r0(v.R,-0.02,20),-0.02,v.T),alt:[v.R*(1+(-0.02)*(v.T-20))],tol:0.01}],
    {tip:'Ce que tu en déduis sur la batterie va dans ta solution.',hint:`Le froid fait monter la résistance : ton résultat doit être plus grand que ${n(v.R)} Ω.`}]),
  D({R0:[60,70,80], T:[2200,2400,2600]}, v=>{ const Rt=Math.round(rt(v.R0,A_W,v.T)); return [`Le filament de tungstène d’un projecteur de chantier à halogène a une résistance de ${v.R0} Ω à 0 °C. En fonctionnement, sa résistance atteint ${Rt.toLocaleString('fr-BE')} Ω. Sachant que α (tungstène) = 6,5 . 10⁻³, calculer sa température de fonctionnement.`,
    [{lbl:'Température',unit:'°C',ans:(Rt-v.R0)/(v.R0*A_W)}]]; }),
  D({R:[1,1.2,1.5], T:[35,40,45]}, v=>[`Un contact électrique plaqué argent, utilisé dans un connecteur de recharge rapide, a une résistance de ${n(v.R)} Ω à 20 °C. Quelle est sa résistance à ${v.T} °C lorsque le connecteur chauffe en pleine charge ? (α argent = 3,85 . 10⁻³)`,
    [{lbl:`R à ${v.T} °C`,unit:'Ω',ans:rt(r0(v.R,A_AG,20),A_AG,v.T),tol:0.01}]]),
  D({T:[40,50,60,70]}, v=>{ const R=Math.round(rt(100,A_PT,v.T)*100)/100; return [`Une sonde de température à résistance de platine (Pt100), utilisée dans le régulateur d’une pompe à chaleur, a une résistance de 100 Ω à 0 °C (d’où son nom). Le coefficient de température du platine vaut α = 3,85 . 10⁻³. Lorsque la pompe à chaleur fonctionne, la sonde indique une résistance de ${n(R,2)} Ω. Quelle température mesure-t-elle ?`,
    [{lbl:'Température',unit:'°C',ans:(R-100)/(100*A_PT)}]]; }),
  D({R:[18,20,22], d:[1.5,2], T:[150,200,250]}, v=>[L(`Un élément chauffant en nichrome d’un chauffe-eau électrique domestique, alimenté sous 230 V, a une résistance de ${v.R} Ω à 20 °C. Le fil a un diamètre de ${n(v.d)} mm et une résistivité ρ = 1,10 Ω.mm²/m.`,'a) Calculer la longueur du fil.',`b) Calculer le courant absorbé sous la même tension lorsque l’élément atteint ${v.T} °C. (α nichrome = 2 . 10⁻⁴)`),
    [{lbl:'a) L',unit:'m',ans:v.R*sec(v.d)/1.10},{lbl:`b) I à ${v.T} °C`,unit:'A',ans:230/rt(r0(v.R,A_NI,20),A_NI,v.T)}],{hint:'a) Calcule d’abord la section : S = π . d² / 4.'}]),
]);

/* ---------- CHAPITRE 10 — La puissance électrique ---------- */
serieAF(10, [
  D({P:[[48,36],[55,45],[60,40]], C:[40,48,60,72]}, v=>[`Les feux d’une voiture électrique (feux de route et de croisement) portent les indications ${v.P[0]} W – ${v.P[1]} W sous 12 V. Calculer l’intensité du courant dans chacun des filaments ainsi que leur résistance. Sachant que la batterie 12 V a une capacité de ${v.C} Ah, combien de temps le filament « feux de route » peut-il fonctionner sur cette seule batterie ?`,
    [{lbl:'I feux de route',unit:'A',ans:v.P[0]/12},{lbl:'R feux de route',unit:'Ω',ans:144/v.P[0]},{lbl:'I feux de croisement',unit:'A',ans:v.P[1]/12},{lbl:'R feux de croisement',unit:'Ω',ans:144/v.P[1]},{lbl:'Durée (feux de route)',unit:'h',ans:v.C/(v.P[0]/12)}]]),
  D({c:[2,2.5,3], p:[3.5,4,4.5], c2:[5,5.5,6]}, v=>[L(`Une habitation consomme en moyenne une puissance de ${n(v.c)} kW en journée. Son installation photovoltaïque produit, en plein soleil à midi, une puissance de ${n(v.p)} kW.`,'a) Quelle puissance excédentaire (surplus) est disponible pour charger la batterie domestique ou être réinjectée sur le réseau ?',`b) Si à ce moment la consommation grimpe à ${n(v.c2)} kW (four et lave-linge en fonctionnement simultané), quelle puissance complémentaire doit alors être fournie par le réseau ?`),
    [{lbl:'a) Surplus',unit:'kW',ans:v.p-v.c},{lbl:'b) Puissance du réseau',unit:'kW',ans:v.c2-v.p}]]),
  D({c:[3,3.2,3.5], pv:[1,1.2,1.4], b:[0.8,1], C:[5,7.5,10], s:[40,50,60,80]}, v=>[L(`En fin d’après-midi, une maison consomme une puissance de ${n(v.c)} kW. Le soleil faiblissant, l’installation photovoltaïque ne produit plus que ${n(v.pv)} kW ; la batterie domestique complète en fournissant ${n(v.b)} kW.`,'a) Quelle puissance reste-t-il à fournir par le réseau ?',`b) Si la batterie a une capacité de ${n(v.C)} kWh et est chargée à ${v.s} %, pendant combien de temps peut-elle encore fournir ce ${n(v.b)} kW avant de se décharger complètement ?`),
    [{lbl:'a) Puissance du réseau',unit:'kW',ans:v.c-v.pv-v.b},{lbl:'b) Durée',unit:'h',ans:v.C*v.s/100/v.b}]]),
  D({P:[2.5,3,3.5,4]}, v=>[`Un onduleur photovoltaïque délivre une puissance de ${n(v.P)} kW sous une tension de 230 V au réseau domestique. Calculer le courant injecté dans l’installation.`,
    [{lbl:'I',unit:'A',ans:v.P*1000/230}]]),
  D({C:[5,7.5,10], P:[1.5,2,2.5]}, v=>[`Une batterie domestique de ${n(v.C)} kWh se recharge à une puissance constante de ${n(v.P)} kW à partir du surplus photovoltaïque. Sachant que l’énergie W = P . t, combien de temps (en heures) faut-il pour la recharger complètement en partant d’une batterie vide ?`,
    [{lbl:'t',unit:'h',ans:v.C/v.P}]]),
  D({nu:[1.5,1.8,2.2], c:[1,1.2,1.5], pv:[3,3.5,4]}, v=>[L(`La nuit, l’installation photovoltaïque ne produit évidemment aucune puissance : une maison consomme alors ${n(v.nu)} kW, entièrement fournis par le réseau. Le lendemain, en plein jour, la même maison ne consomme que ${n(v.c)} kW alors que le PV produit ${n(v.pv)} kW.`,'a) Quelle puissance provient du réseau la nuit ?','b) Quelle puissance excédentaire le PV fournit-il en plein jour, et où peut-elle être utilisée ?'),
    [{lbl:'a) Puissance du réseau la nuit',unit:'kW',ans:v.nu},{lbl:'b) Surplus en plein jour',unit:'kW',ans:v.pv-v.c}],{tip:'Où le surplus peut être utilisé : dans ta solution.'}]),
  D({P:[1.8,2,2.4,3]}, v=>[`Un chauffe-eau électrique consomme une puissance de ${n(v.P)} kW sous une tension de 230 V. Calculer sa résistance chauffante et l’intensité du courant qui le traverse.`,
    [{lbl:'R',unit:'Ω',ans:230*230/(v.P*1000)},{lbl:'I',unit:'A',ans:v.P*1000/230}]]),
]);

/* ---------- CHAPITRE 11 — L'énergie et l'effet Joule ---------- */
serieAF(11, [
  D({R:[0.15,0.2,0.25,0.3], h:[4,5,6]}, v=>[L(`Un câble DC reliant un panneau photovoltaïque (Imp = 12,5 A) à l’onduleur présente une résistance de ${n(v.R)} Ω.`,'a) Calculer la puissance perdue par effet Joule dans ce câble.',`b) Ce courant circule pendant ${v.h} heures d’ensoleillement effectif par jour : calculer l’énergie perdue par effet Joule en une journée, en kJ puis en kWh.`),
    [{lbl:'a) P perdue',unit:'W',ans:v.R*12.5**2},{lbl:'b) W par jour',unit:'kJ',ans:v.R*12.5**2*v.h*3600/1000},{lbl:'b) W par jour',unit:'kWh',ans:v.R*12.5**2*v.h/1000}]]),
  D({R:[0.04,0.05,0.06], h:[2,3,4]}, v=>[L(`Une borne de recharge pour véhicule électrique fonctionne en triphasé sous 400 V / 16 A (11 kW). Le câble de recharge présente une résistance de ${n(v.R)} Ω par phase.`,'a) Calculer la puissance perdue par effet Joule dans une phase du câble.',`b) Calculer l’énergie perdue dans cette phase pendant une charge complète de ${v.h} heures.`),
    [{lbl:'a) P perdue (une phase)',unit:'W',ans:v.R*16**2},{lbl:`b) W en ${v.h} h`,unit:'J',ans:v.R*16**2*v.h*3600}],{hint:'b) En joules, le temps est en secondes.'}]),
  D({R:[20,24,30], m:[2,3,4]}, v=>[`Une bouilloire électrique de résistance ${v.R} Ω est branchée sous 230 V pour faire bouillir de l’eau pendant ${v.m} minutes. Calculer le courant absorbé, la puissance, et l’énergie consommée durant ce temps (en kJ).`,
    [{lbl:'I',unit:'A',ans:230/v.R},{lbl:'P',unit:'W',ans:230*230/v.R},{lbl:'W',unit:'kJ',ans:230*230/v.R*v.m*60/1000}]]),
  D({R:[150,175,200], I:[1.1,1.24,1.3], m:[5,10,15]}, v=>{ const W=Math.round(v.R*v.I**2*v.m*60/1000); return [`Un fer à souder électronique, utilisé pour l’assemblage de circuits imprimés, absorbe un courant de ${n(v.I)} A et a consommé une énergie de ${W} kJ en ${v.m} minutes d’utilisation. Quelle est sa résistance de fonctionnement ?`,
    [{lbl:'R',unit:'Ω',ans:W*1000/(v.I**2*v.m*60)}],{hint:'R = W / (I² . t), avec W en joules et t en secondes.'}]; }),
  D({P:[1000,1100,1500,2000], m:[15,20,30]}, v=>[`Un four électrique domestique consomme une énergie de ${(v.P*v.m*60/1000).toLocaleString('fr-BE')} kJ en ${v.m===15?'un quart d’heure':v.m===30?'une demi-heure':v.m+' minutes'} de cuisson, sous une tension de 230 V. Quel est le courant indiqué par un ampèremètre placé en série avec le four ?`,
    [{lbl:'I',unit:'A',ans:v.P/230}],{hint:'Commence par la puissance : P = W / t.'}]),
  D({W:[4.5,5.4,6], m:[12,15,20]}, v=>[`Un wattmètre placé dans le circuit d’alimentation du moteur d’une pompe de relevage industrielle indique une consommation de ${n(v.W)} kWh en ${v.m} minutes de fonctionnement à pleine charge. Quelle puissance indique-t-il ?`,
    [{lbl:'P',unit:'kW',ans:v.W/(v.m/60)}],{hint:'Convertis les minutes en heures.'}]),
  D({I:[1000,1500,2000], ms:[20,40,60], R:[0.04,0.05]}, v=>[`Lors d’un défaut d’isolement dans une installation domestique, un courant de court-circuit de ${v.I.toLocaleString('fr-BE')} A circule pendant ${v.ms} ms (millisecondes) avant que le disjoncteur ne coupe le circuit. La résistance au point de défaut est de ${n(v.R)} Ω. Calculer l’énergie Joule dissipée à cet endroit pendant ce très court instant, en joules.`,
    [{lbl:'WJ',unit:'J',ans:v.R*v.I**2*v.ms/1000}],{hint:'1 ms = 0,001 s.'}]),
]);

/* ---------- CHAPITRE 12 — Les résistances en série ---------- */
serieAF(12, [
  D({k:[8,10,12], U:[32,34,36], I:[11,12.5,13]}, v=>[L(`Un installateur raccorde en série une chaîne (string) de ${v.k} panneaux photovoltaïques identiques. Chaque panneau a une tension de fonctionnement optimal Vmp = ${v.U} V et un courant optimal Imp = ${n(v.I)} A.`,'a) Calculer la tension totale du string.','b) Quel est le courant qui circule dans chaque panneau ? Et dans tout le string ?'),
    [{lbl:'a) U du string',unit:'V',ans:v.k*v.U},{lbl:'b) I dans chaque panneau',unit:'A',ans:v.I},{lbl:'b) I dans le string',unit:'A',ans:v.I}]]),
  D({k:[8,10], V:[2,2.2], I:[15,20]}, v=>[L(`Une guirlande décorative à LED comporte ${v.k} LED montées en série, alimentée sous une tension continue de 24 V par un petit transformateur. Chaque LED a une tension nominale de ${n(v.V)} V et le courant de fonctionnement vaut ${v.I} mA. Une résistance R, placée en série avec les LED, limite le courant à cette valeur.`,`a) Calculer la tension totale aux bornes des ${v.k} LED.`,'b) Calculer la tension restante aux bornes de la résistance R.','c) En déduire la valeur de R.'),
    [{lbl:'a) U des LED',unit:'V',ans:v.k*v.V},{lbl:'b) U de R',unit:'V',ans:24-v.k*v.V},{lbl:'c) R',unit:'Ω',ans:(24-v.k*v.V)/(v.I/1000)}],{hint:'c) Le courant en ampères : 1 mA = 0,001 A.'}]),
  D({k:[10,13,14], V:[3.6,3.7], r:[0.04,0.05], I:[10,15,20]}, v=>[L(`Une batterie de vélo électrique est constituée de ${v.k} cellules Li-ion identiques montées en série. Chaque cellule a une tension nominale de ${n(v.V)} V et une résistance interne de ${n(v.r)} Ω.`,'a) Calculer la tension totale de la batterie.','b) Calculer la résistance interne totale du pack.',`c) Le moteur tire un courant de ${v.I} A : calculer la chute de tension due à la résistance interne totale.`,'d) En déduire la tension réellement disponible aux bornes de la batterie sous charge.'),
    [{lbl:'a) U',unit:'V',ans:v.k*v.V},{lbl:'b) r totale',unit:'Ω',ans:v.k*v.r},{lbl:'c) Chute de tension',unit:'V',ans:v.k*v.r*v.I},{lbl:'d) U sous charge',unit:'V',ans:v.k*v.V-v.k*v.r*v.I}]]),
  D({U:[9,12], R1:[100,150], R2:[220,330], I:[10,15]}, v=>[L(`Un module électronique (capteur connecté) est alimenté par une pile de ${v.U} V. Deux résistances de protection sont placées en série avant le composant : R₁ = ${v.R1} Ω et R₂ = ${v.R2} Ω. Le composant absorbe un courant de ${v.I} mA.`,'a) Calculer la résistance totale du circuit de protection.','b) Calculer la chute de tension totale aux bornes de R₁ et R₂.','c) Quelle tension reste disponible pour le composant électronique ?'),
    [{lbl:'a) R totale',unit:'Ω',ans:v.R1+v.R2},{lbl:'b) U de R₁ et R₂',unit:'V',ans:(v.R1+v.R2)*v.I/1000},{lbl:'c) U du composant',unit:'V',ans:v.U-(v.R1+v.R2)*v.I/1000}]]),
  D({U:[12,24], a:[10,15,20], b:[30,35,40]}, v=>[L(`Le circuit de commande basse tension d’un sèche-serviettes électrique comprend, en série sous ${v.U} V, un capteur de température de résistance équivalente ${v.a} Ω et une résistance de consigne de ${v.b} Ω.`,'a) Calculer le courant qui circule dans ce circuit de commande.','b) Calculer la tension aux bornes de chacun des deux éléments.'),
    [{lbl:'a) I',unit:'A',ans:v.U/(v.a+v.b)},{lbl:'b) U du capteur',unit:'V',ans:v.a*v.U/(v.a+v.b)},{lbl:'b) U de la consigne',unit:'V',ans:v.b*v.U/(v.a+v.b)}]]),
  ['Un string de panneaux photovoltaïques est monté en série sur un toit. En fin d’après-midi, l’ombre d’une cheminée recouvre partiellement un seul des panneaux du string. En t’appuyant sur la propriété du montage série (un seul courant traverse tous les éléments), explique pourquoi la production de puissance de tout le string peut chuter fortement à cause de ce seul panneau ombragé.',
    [],{texte:true,sans:JUSTIF}],
  D({R1:[15,20,25], I:[4,5]}, v=>[L(`Sur un banc d’essai, un technicien alimente sous 230 V, en série, une résistance chauffante d’essai R₁ = ${v.R1} Ω et une résistance de protection R₂ de valeur inconnue. Le courant mesuré dans le circuit vaut ${v.I} A.`,'a) Calculer la résistance totale du circuit.','b) En déduire la valeur de R₂.','c) Calculer la tension aux bornes de chacune des deux résistances.'),
    [{lbl:'a) R totale',unit:'Ω',ans:230/v.I},{lbl:'b) R₂',unit:'Ω',ans:230/v.I-v.R1},{lbl:'c) U₁',unit:'V',ans:v.R1*v.I},{lbl:'c) U₂',unit:'V',ans:(230/v.I-v.R1)*v.I}]]),
]);

/* ---------- CHAPITRE 13 — La chute de tension en ligne ---------- */
serieAF(13, [
  D({k:[3,4], R:[5,7,8], c:[1,1.5], I:[4,6,8]}, v=>[`Que vaut la d.d.p. à appliquer à la source d’un circuit constitué de ${v.k} ampoules LED en série de ${v.R} Ω chacune, alimentées par un câble de ${n(v.c)} Ω de résistance (aller), si le courant qui circule vaut ${v.I} A ?`,
    [{lbl:'U à la source',unit:'V',ans:(v.k*v.R+2*v.c)*v.I,tol:0.01}],{hint:`${n(v.c)} Ω pour l’aller seulement : le courant revient aussi par le câble.`}]),
  D({R:[20,25,30], dist:[40,50,60], U:[120,230], d:[2.5,3]}, v=>{ const RL=0.1*2*v.dist/sec(v.d), I=v.U/(v.R+RL); return [`Déterminer la chute de tension se produisant dans la ligne bifilaire qui alimente un récepteur de ${v.R} Ω et distant de ${v.dist} m du générateur de tension U = ${v.U} V. La ligne est faite de fer de ${n(v.d)} mm de diamètre (ρ = 0,1 Ω.mm²/m). Déterminer également la d.d.p. aux bornes du récepteur.`,
    [{lbl:'UL (chute en ligne)',unit:'V',ans:RL*I},{lbl:'U du récepteur',unit:'V',ans:v.R*I,tol:0.005}],{hint:'Ligne bifilaire : un aller et un retour. Section : S = π . d² / 4.'}]; }),
  D({L:[20,25,30], S:[4,6]}, v=>[L(`Un onduleur photovoltaïque est installé à ${v.L} m (aller-retour) du coffret de raccordement. Le câble utilisé est en cuivre (ρ = 0,0175 Ω.mm²/m) de section ${n(v.S)} mm². Sachant que le courant Imp vaut 12,5 A et que la tension de la chaîne de panneaux (string) est de 320 V, calculer :`,'a) la résistance du câble ;','b) la chute de tension en ligne UL ;','c) le pourcentage de chute de tension par rapport à la tension du générateur.'),
    [{lbl:'a) R',unit:'Ω',ans:RHO_CU*v.L/v.S},{lbl:'b) UL',unit:'V',ans:RHO_CU*v.L/v.S*12.5},{lbl:'c) Chute de tension',unit:'%',ans:RHO_CU*v.L/v.S*12.5/320*100}]]),
  D({L:[30,35,40], p:[1,2,3], I:[8,10,12]}, v=>[`On souhaite qu’un câble photovoltaïque (aller-retour) de ${v.L} m en cuivre (ρ = 0,0175 Ω.mm²/m) n’occasionne pas plus de ${v.p} % de chute de tension sur une chaîne fonctionnant sous 400 V et un courant de ${v.I} A. Quelle section minimale doit-on choisir ?`,
    [{lbl:'S minimale (calculée)',unit:'mm²',ans:RHO_CU*v.L/(v.p/100*400/v.I)}],{hint:`${v.p} % de 400 V, puis R max = ΔU / I.`}]),
  D({L:[20,30,40], S:[6,10], I:[16,32]}, v=>[`Une borne de recharge pour véhicule électrique, alimentée sous 230 V, est reliée au tableau électrique par un câble de cuivre de ${v.L} m (aller-retour) et de section ${n(v.S)} mm². Elle délivre un courant de ${v.I} A. Calculer la chute de tension dans le câble et la tension réellement disponible à la borne.`,
    [{lbl:'UL',unit:'V',ans:RHO_CU*v.L/v.S*v.I},{lbl:'U à la borne',unit:'V',ans:230-RHO_CU*v.L/v.S*v.I,tol:0.002}]]),
  D({L:[2,3,4], S:[16,25,35], I:[80,100,120]}, v=>[`Une batterie domestique de 48 V est reliée à l’onduleur par un câble de cuivre de ${v.L} m (aller-retour) et ${v.S} mm² de section. En pleine décharge, elle débite un courant de ${v.I} A. Calculer la chute de tension dans ce câble et le pourcentage qu’elle représente par rapport à la tension nominale de la batterie.`,
    [{lbl:'UL',unit:'V',ans:RHO_CU*v.L/v.S*v.I},{lbl:'Chute de tension',unit:'%',ans:RHO_CU*v.L/v.S*v.I/48*100}]]),
  D({km:[0.3,0.4,0.5], d:[4,5,6], I:[10,16,20], U:[220,230]}, v=>{ const S=sec(v.d), R=RHO_CU*2*v.km*1000/S; return [`Une installation photovoltaïque alimente un récepteur situé à ${n(v.km)} km du local technique. Le câble utilisé, en cuivre, a un diamètre équivalent de ${v.d} mm et est parcouru par un courant de ${v.I} A. La tension au départ est de ${v.U} V (ρ = 0,0175 Ω.mm²/m). On demande : UL = ? V, tension au récepteur = ? V, densité de courant J = ? A/mm².`,
    [{lbl:'UL',unit:'V',ans:R*v.I},{lbl:'U au récepteur',unit:'V',ans:v.U-R*v.I,tol:0.005},{lbl:'J',unit:'A/mm²',ans:v.I/S}],{hint:'La distance se parcourt à l’aller et au retour. J = I / S.'}]; }),
]);

/* ---------- CHAPITRE 14 — Les résistances en parallèle ---------- */
serieAF(14, [
  D({a:[2,3,4,5], b:[6,8,10]}, v=>[L(`Un tableau électrique domestique reçoit simultanément le courant du réseau et celui de l’onduleur photovoltaïque, tous deux sous la même tension de 230 V (les deux sources sont en parallèle sur le même jeu de barres). Le réseau fournit un courant de ${v.a} A tandis que l’onduleur PV fournit ${v.b} A.`,'a) Quel est le courant total consommé par l’habitation à cet instant ?','b) Quelle est la puissance totale consommée ?'),
    [{lbl:'a) I total',unit:'A',ans:v.a+v.b},{lbl:'b) P totale',unit:'W',ans:230*(v.a+v.b)}]]),
  D({a:[15,20,25], b:[10,15], c:[5,8], s:[3,5,7]}, v=>{ const T=v.a+v.b+v.c; return [L(`Trois sources alimentent en parallèle, sous la même tension de 48 V, le bus continu d’une installation domestique autonome : le contrôleur solaire fournit ${v.a} A, la batterie domestique fournit ${v.b} A, et un petit groupe électrogène d’appoint fournit ${v.c} A.`,'a) Calculer le courant total disponible sur le bus.',`b) Si la charge de la maison consomme ${T-v.s} A à cet instant, que devient le surplus de courant ?`),
    [{lbl:'a) I total',unit:'A',ans:T},{lbl:'b) Surplus',unit:'A',ans:v.s}],{tip:'Ce que devient le surplus : dans ta solution.'}]; }),
  D({R:[[10,25,50],[10,20,40],[20,25,50]]}, v=>[`Un hub USB alimente en parallèle, sous 5 V, trois appareils dont les résistances équivalentes valent respectivement ${v.R[0]} Ω, ${v.R[1]} Ω et ${v.R[2]} Ω. Calculer la résistance équivalente du montage, puis le courant total fourni par le port USB.`,
    [{lbl:'Réqu',unit:'Ω',ans:pN(...v.R)},{lbl:'I total',unit:'A',ans:5/pN(...v.R)}],{hint:`Réqu doit être plus petite que la plus petite résistance (${v.R[0]} Ω).`}]),
  D({a:[4,6,8], b:[2,3,4]}, v=>[`Deux chaînes (strings) de panneaux photovoltaïques, de résistances internes équivalentes R₁ = ${v.a} Ω et R₂ = ${v.b} Ω, sont raccordées en parallèle sur le même onduleur. Calculer la résistance équivalente du groupement.`,
    [{lbl:'Réqu',unit:'Ω',ans:p2(v.a,v.b)}]]),
  D({k:[4,5,6], R:[10,12,15]}, v=>[L(`Une batterie domestique est constituée de ${v.k} modules identiques de ${v.R} Ω de résistance interne, montés en parallèle.`,'a) Calculer la résistance équivalente avant qu’un module ne tombe en panne (circuit ouvert).',`b) Calculer la résistance équivalente après la panne (${v.k-1} modules restants).`),
    [{lbl:`a) Réqu (${v.k} modules)`,unit:'Ω',ans:v.R/v.k},{lbl:`b) Réqu (${v.k-1} modules)`,unit:'Ω',ans:v.R/(v.k-1)}]]),
  D({U:[230,400], a:[8,12], T:[20,25]}, v=>[`Une borne de recharge bidirectionnelle alimente en parallèle, sous ${v.U} V, deux circuits : le premier absorbe un courant de ${v.a} A, le second un courant inconnu. Le courant total mesuré est de ${v.T} A. Calculer le courant du second circuit, ainsi que sa résistance équivalente.`,
    [{lbl:'I₂',unit:'A',ans:v.T-v.a},{lbl:'R₂',unit:'Ω',ans:v.U/(v.T-v.a)}]]),
]);

/* ---------- CHAPITRE 15 — Les résistances mixtes ---------- */
const m15 = (U, r1, ...rp) => { const rq=pN(...rp), I=U/(r1+rq), Up=rq*I; return { rq, rt:r1+rq, I, Up, Ib:rp.map(r=>Up/r) }; };
serieAF(15, [
  D({R:[40,46,50], R1:[1,2,3]}, v=>{ const c=m15(230,v.R1,v.R,v.R); return [L(`Un circuit de test alimente, sous 230 V, deux radiateurs d’appoint identiques montés en parallèle (R₂ = R₃ = ${v.R} Ω chacun), eux-mêmes en série avec la résistance du câble d’alimentation R₁ = ${v.R1} Ω.`,'a) Calculer la résistance équivalente du groupement parallèle formé par les deux radiateurs.','b) Calculer la résistance totale du circuit (câble + radiateurs).','c) Calculer le courant total fourni par la source.','d) Calculer la tension aux bornes du groupement de radiateurs.'),
    [{lbl:'a) R₂ // R₃',unit:'Ω',ans:c.rq},{lbl:'b) R totale',unit:'Ω',ans:c.rt},{lbl:'c) I total',unit:'A',ans:c.I},{lbl:'d) U des radiateurs',unit:'V',ans:c.Up,tol:0.005}]]; }),
  D({U:[12,20], P:[[40,60],[30,60],[60,90]], R1:[0.5,1]}, v=>{ const c=m15(v.U,v.R1,v.P[0],v.P[1]); return [L(`Un chargeur secteur multiport alimente, sous une tension de sortie de ${v.U} V, deux ports USB-C en parallèle (R₂ = ${v.P[0]} Ω, R₃ = ${v.P[1]} Ω) placés en série avec la résistance interne du convertisseur R₁ = ${n(v.R1)} Ω.`,'a) Calculer la résistance équivalente du groupement parallèle R₂ // R₃.','b) Calculer la résistance équivalente totale du circuit.','c) Calculer le courant total débité par le convertisseur.','d) Calculer le courant dans chacun des deux ports USB-C.'),
    [{lbl:'a) R₂ // R₃',unit:'Ω',ans:c.rq},{lbl:'b) R totale',unit:'Ω',ans:c.rt},{lbl:'c) I total',unit:'A',ans:c.I},{lbl:'d) I₂',unit:'A',ans:c.Ib[0]},{lbl:'d) I₃',unit:'A',ans:c.Ib[1]}]]; }),
  D({U:[24,32], R1:[0.5,1], P:[[20,30],[30,60],[20,20]]}, v=>{ const c=m15(v.U,v.R1,v.P[0],v.P[1]); return [L(`Une installation autonome combine un panneau photovoltaïque (assimilé à une source de ${v.U} V avec une résistance interne équivalente R₁ = ${n(v.R1)} Ω) qui alimente, en série, une charge principale constituée de deux appareils en parallèle : une pompe de circulation (R₂ = ${v.P[0]} Ω) et un contrôleur de charge (R₃ = ${v.P[1]} Ω).`,'a) Calculer la résistance équivalente du groupement parallèle R₂ // R₃.','b) Calculer la résistance équivalente totale vue par le panneau (R₁ + groupement).','c) Calculer le courant total fourni par le panneau.','d) Calculer le courant dans la pompe et dans le contrôleur.'),
    [{lbl:'a) R₂ // R₃',unit:'Ω',ans:c.rq},{lbl:'b) R totale',unit:'Ω',ans:c.rt},{lbl:'c) I total',unit:'A',ans:c.I},{lbl:'d) I pompe',unit:'A',ans:c.Ib[0]},{lbl:'d) I contrôleur',unit:'A',ans:c.Ib[1]}]]; }),
  D({R1:[4,6], R:[8,12,16]}, v=>{ const c=m15(12,v.R1,v.R,v.R); return [L(`Un ruban LED est découpé en trois segments : un segment A (résistance équivalente R₁ = ${v.R1} Ω) monté en série avec deux segments identiques B et C (R₂ = R₃ = ${v.R} Ω chacun) montés en parallèle entre eux. L’ensemble est alimenté sous 12 V continu.`,'a) Calculer la résistance équivalente du groupement parallèle B // C.','b) Calculer la résistance équivalente totale du montage.','c) Calculer le courant total fourni par l’alimentation 12 V.','d) Calculer le courant dans chaque segment B et C.'),
    [{lbl:'a) B // C',unit:'Ω',ans:c.rq},{lbl:'b) R totale',unit:'Ω',ans:c.rt},{lbl:'c) I total',unit:'A',ans:c.I},{lbl:'d) I dans B (et dans C)',unit:'A',ans:c.Ib[0]}]]; }),
  D({R:[60,100,120], R1:[0.5,1]}, v=>[L(`Dans une installation domestique, une prise multiple (barrette) alimente 3 appareils identiques de ${v.R} Ω chacun, montés en parallèle ; cette barrette est reliée au tableau électrique par un câble de résistance R₁ = ${n(v.R1)} Ω placé en série. Un des trois appareils tombe en panne et se retrouve en circuit ouvert (branche coupée).`,'a) Calculer la résistance équivalente du groupement parallèle avant la panne.','b) Calculer la résistance équivalente totale du circuit avant la panne.','c) Calculer la résistance équivalente du groupement parallèle après la panne (2 appareils restants).','d) Le courant total débité par le tableau augmente-t-il ou diminue-t-il après la panne ? Justifier.'),
    [{lbl:'a) Réqu avant la panne',unit:'Ω',ans:v.R/3},{lbl:'b) R totale avant la panne',unit:'Ω',ans:v.R1+v.R/3},{lbl:'c) Réqu après la panne',unit:'Ω',ans:v.R/2}],{tip:'La réponse d), avec sa justification, va dans ta solution.'}]),
  D({I:[400,500,600], R1:[2,4], P:[[30,60],[40,120],[20,30]]}, v=>{ const rq=p2(v.P[0],v.P[1]), I=v.I/1000; return [L(`Un module de recharge solaire est parcouru par un courant total mesuré I = ${v.I} mA. Le circuit comprend une résistance série R₁ = ${v.R1} Ω (câblage et protection) suivie d’un groupement parallèle formé de R₂ = ${v.P[0]} Ω (contrôleur de charge) et R₃ = ${v.P[1]} Ω (voyant de charge à LED, avec sa résistance série intégrée).`,'a) Calculer la tension totale U aux bornes du montage.','b) Calculer la tension U aux bornes du groupement parallèle (U₂ = U₃).','c) Calculer I₂ et I₃.'),
    [{lbl:'a) U totale',unit:'V',ans:I*(v.R1+rq)},{lbl:'b) U₂ = U₃',unit:'V',ans:I*rq},{lbl:'c) I₂',unit:'A',ans:I*rq/v.P[0]},{lbl:'c) I₃',unit:'A',ans:I*rq/v.P[1]}],{hint:'Le courant en ampères : 1 mA = 0,001 A.'}]; }),
  D({R1:[1,2], P:[[60,30,20],[40,40,20],[60,20,30]], R5:[1,2,3]}, v=>[`Dans le tableau électrique simplifié d’un kot étudiant, on modélise le circuit par une résistance série R₁ = ${v.R1} Ω (câble principal), suivie d’un groupement parallèle de trois circuits R₂ = ${v.P[0]} Ω (chargeurs multiples), R₃ = ${v.P[1]} Ω (éclairage LED) et R₄ = ${v.P[2]} Ω (frigo compact), le tout en série avec une résistance R₅ = ${v.R5} Ω (protection différentielle). Calculer la résistance équivalente totale Réqu du montage.`,
    [{lbl:'R₂ // R₃ // R₄',unit:'Ω',ans:pN(...v.P)},{lbl:'Réqu totale',unit:'Ω',ans:v.R1+pN(...v.P)+v.R5}]]),
]);

/* ---------- CHAPITRE 16 — Les appareils de mesure ---------- */
serieAF(16, [
  D({Rm:[1000,1200,2000], Im:[50,100], U:[10,30,50]}, v=>[`Un appareil de mesure à cadre mobile (base d’un ancien multimètre analogique d’atelier) a une résistance interne de ${n(v.Rm/1000)} kΩ et une déviation maximum de ${v.Im} μA. On veut en faire un voltmètre de calibre ${v.U} V. Calculer la résistance additionnelle (multiplicateur) à placer en série.`,
    [{lbl:'Résistance additionnelle (en série)',unit:'Ω',ans:v.U/(v.Im*1e-6)-v.Rm,tol:0.002}],{hint:'Résistance totale = calibre / courant de déviation ; retire la résistance de l’appareil.'}]),
  D({Rm:[1000,1200,2000], Im:[50,100], I:[2,5,10]}, v=>[`Un appareil de base (${v.Im} μA — ${n(v.Rm/1000)} kΩ) doit être transformé en ampèremètre de calibre ${v.I} A pour contrôler, en atelier, le courant de sortie d’un onduleur photovoltaïque. Calculer la résistance shunt à placer en parallèle.`,
    [{lbl:'Shunt (en parallèle)',unit:'Ω',ans:v.Rm*v.Im*1e-6/(v.I-v.Im*1e-6)}]]),
  [L('Pour chacune des mesures suivantes, indique l’appareil à utiliser et la manière de le brancher (en série ou en parallèle, circuit sous tension ou hors tension) :','a) la tension aux bornes d’une batterie domestique de secours (48 V) ;','b) le courant absorbé par une borne de recharge de véhicule électrique, sans interrompre le circuit ;','c) la résistance d’une résistance chauffante démontée, hors tension.'),
    [],{texte:true,sans:JUSTIF}],
  ['Un élève veut mesurer la résistance d’un ruban LED encore raccordé et sous tension à l’aide d’un ohmmètre. Explique pourquoi cette manipulation est incorrecte et dangereuse pour l’appareil de mesure, et ce qu’il faut faire avant de mesurer.',
    [],{texte:true,sans:JUSTIF}],
  D({P:[2300,3450,4600]}, v=>[L(`Un compteur communicant (« smart meter ») affiche une puissance instantanée de ${v.P.toLocaleString('fr-BE')} W sous une tension de 230 V (installation monophasée).`,'a) Calculer le courant correspondant.','b) Un tel compteur n’est pas traversé directement par ce courant : quel dispositif interne (shunt, transformateur de courant…) lui permet de le mesurer sans risque ?'),
    [{lbl:'a) I',unit:'A',ans:v.P/230}],{tip:'La réponse b) va dans ta solution.'}]),
  D({Rm:[850,1000], Im:[50,100], I:[1,2,5]}, v=>[`Le cadre mobile d’un multimètre analogique encore utilisé en atelier a une déviation maximum de ${v.Im} μA et une résistance de ${v.Rm} Ω. Calculer la résistance shunt à utiliser pour mesurer, sur un calibre de ${v.I} A, le courant de charge de la batterie d’une trottinette électrique.`,
    [{lbl:'Shunt (en parallèle)',unit:'Ω',ans:v.Rm*v.Im*1e-6/(v.I-v.Im*1e-6)}]]),
  ['Cite deux avantages d’un multimètre numérique par rapport à un multimètre analogique à cadre mobile pour la maintenance électrique actuelle.',
    [],{texte:true,sans:JUSTIF}],
  ['Pour contrôler le courant absorbé par une pompe à chaleur triphasée (400 V) sans couper son alimentation, quel appareil de mesure faut-il utiliser et comment le placer ? Explique pourquoi on ne peut pas simplement intercaler un ampèremètre classique comme on le ferait sur un petit circuit basse tension.',
    [],{texte:true,sans:JUSTIF}],
]);

/* ---------- CHAPITRE 20 — Les puissances de 10 ---------- */
serieAF(20, [
  D({P:[4,5,6,8], k:[850,900,950]}, v=>[`Une installation photovoltaïque résidentielle a une puissance crête de ${v.P} kWc et produit en moyenne ${v.k} kWh par kWc installé et par an. Calculer sa production annuelle en Wh, puis l’exprimer sous la forme d’un produit d’un nombre entier et d’une puissance de 10.`,
    [{lbl:'Production annuelle',unit:'Wh',ans:v.P*v.k*1e3,tol:0.005}],{hint:'1 kWh = 10³ Wh.'}]),
  D({C:[5,10,15,20]}, v=>[`Une batterie domestique de stockage a une capacité de ${v.C} kWh. Exprimer cette capacité en Wh sous forme d’une puissance de 10, puis en mWh (milliwattheures).`,
    [{lbl:'Capacité',unit:'Wh',ans:v.C*1e3,tol:0.005},{lbl:'Capacité',unit:'mWh',ans:v.C*1e6,tol:0.005}]]),
  D({G:[64,128,256,512]}, v=>[`Un smartphone récent dispose d’une mémoire de stockage de ${v.G} Go. Sachant que 1 Go = 10⁹ octets, exprimer cette capacité en octets sous la forme d’un produit d’un nombre entier et d’une puissance de 10.`,
    [{lbl:'Capacité',unit:'octets',ans:v.G*1e9,tol:0.005}]]),
  D({T:[1,2,4,8], f:[2.5,4,5]}, v=>[`Un disque dur externe a une capacité de ${v.T} To (téraoctets) et un fichier vidéo pèse ${n(v.f)} Go. Combien de fichiers de ce type peut-on stocker au maximum sur ce disque dur ? Détailler le calcul en puissances de 10 (1 To = 1 000 Go).`,
    [{lbl:'Nombre de fichiers',unit:'',ans:Math.floor(v.T*1e3/v.f),tol:0.001}]]),
  D({g:[1,1.2,2.5]}, v=>[L(`Une connexion 5G domestique atteint un débit de ${n(v.g)} Gbit/s. Exprimer ce débit :`,'a) en Mbit/s ;','b) en bit/s, sous forme d’une puissance de 10.'),
    [{lbl:'a) Débit',unit:'Mbit/s',ans:v.g*1e3,tol:0.005},{lbl:'b) Débit',unit:'bit/s',ans:v.g*1e9,tol:0.005}]]),
  D({m:[10,30,300]}, v=>[L(`Un disjoncteur différentiel se déclenche pour un courant de fuite de ${v.m} mA. Exprimer cette valeur :`,'a) en A, sous forme d’une puissance de 10 ;','b) en μA.'),
    [{lbl:'a) I',unit:'A',ans:v.m*1e-3,tol:0.005},{lbl:'b) I',unit:'μA',ans:v.m*1e3,tol:0.005}]]),
  D({M:[1.5,2.5,10]}, v=>[L(`La résistance d’isolement d’un câble électrique, mesurée au moyen d’un mégohmmètre, vaut ${n(v.M)} MΩ. Exprimer cette valeur :`,'a) en Ω, sous forme d’une puissance de 10 ;','b) en kΩ.'),
    [{lbl:'a) R',unit:'Ω',ans:v.M*1e6,tol:0.005},{lbl:'b) R',unit:'kΩ',ans:v.M*1e3,tol:0.005}]]),
  D({P:[400,420,450], e:[420,440,460], k:[10,12,15]}, v=>[L(`Un panneau photovoltaïque de ${v.P} Wc produit environ ${v.e} kWh par an. Un particulier installe ${v.k} panneaux identiques. Calculer, sous forme d’un produit d’un nombre entier et d’une puissance de 10 :`,'a) la puissance crête totale de l’installation, en Wc ;','b) la production annuelle totale, en kWh.'),
    [{lbl:'a) Puissance crête',unit:'Wc',ans:v.k*v.P,tol:0.005},{lbl:'b) Production annuelle',unit:'kWh',ans:v.k*v.e,tol:0.005}]]),
]);
})();
