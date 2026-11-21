/* =====================================================================
   AMPÈRE & FILS — 3QEM : LES SÉRIES D'EXERCICES (le devoir de chaque chapitre)
   Une capsule « Série d'exercices » est ajoutée à la fin des chapitres 6 à 16 et 20.
   Les énoncés viennent du cours (section DEVOIR). Les réponses sont calculées ici,
   jamais recopiées : tableau en quatre colonnes, corrigé automatiquement.
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
const JUSTIF = 'Question à justifier : écris ton raisonnement. Ton prof le lira dans Suivi.';

/* ajoute la capsule « Série d'exercices » au chapitre n ; items : [énoncé, résultats, options] */
function serieAF(n, items, intro){
  const ch = CHAPTERS['0.'+n]; if(!ch) return;
  const keys = items.map((_,i)=>'A'+n+'s'+(i+1));
  const cap = { id:'A'+n+'s', sec:'Devoir', t:'Série d’exercices', chap:ch.num, quiz:[],
    ex:{ keys, lbl:'Toute la série ('+items.length+' exercices)' },
    body:()=>`<p class="lead">${intro||'La série complète du devoir de ce chapitre. Pour chaque exercice : les données, l’inconnue, la formule, puis la solution avec son unité.'}</p>
      <div class="note" style="margin-top:0"><b>Comment ça marche</b>Les résultats chiffrés sont vérifiés tout de suite. Les questions « à justifier » sont lues par ton prof. Tu peux t’arrêter et reprendre plus tard : ce que tu écris est enregistré.</div>
      ${items.map(([en,res,more],i)=>AX(n, keys[i], i+1, en, res, Object.assign({nom:'Devoir'}, more||{}))).join('')}`,
    mount:root=>{ mountAllDIFS(root); mountTriangles(root); } };
  ch.caps.push(cap);
}

/* ---------- CHAPITRE 6 — La quantité d'électricité ---------- */
serieAF(6, [
  ['Une borne de recharge domestique alimente un véhicule électrique avec un courant constant de 16 A pendant 6 h. Calculer la quantité d’électricité fournie à la batterie, en ampères-heures puis en coulombs.',
    [{lbl:'Q',unit:'Ah',ans:16*6},{lbl:'Q',unit:'C',ans:16*6*3600}],{hint:'1 Ah = 3 600 C.'}],
  ['La batterie d’un vélo électrique a une capacité de 14 Ah. Elle est rechargée par un chargeur qui fournit un courant constant de 2 A. Combien de temps (en heures) faut-il pour la recharger complètement ?',
    [{lbl:'t',unit:'h',ans:14/2}]],
  ['Un smartphone est rechargé en charge rapide sous un courant de 2 A pendant 45 minutes. Calculer la quantité d’électricité, en coulombs, transmise à la batterie durant cette charge.',
    [{lbl:'Q',unit:'C',ans:2*45*60}],{hint:'En coulombs, le temps doit être en secondes.'}],
  ['Une batterie domestique de stockage, associée à des panneaux photovoltaïques, a une capacité de 100 Ah. Elle se décharge à un régime constant de 4 A pour alimenter la maison durant une coupure de réseau. Pendant combien de temps pourra-t-elle fournir de l’électricité ?',
    [{lbl:'t',unit:'h',ans:100/4}]],
  ['Une trottinette électrique reçoit une quantité d’électricité de 21 600 C au cours d’une charge de 3 h. Quelle est l’intensité moyenne du courant de charge ?',
    [{lbl:'I',unit:'A',ans:21600/(3*3600)}],{hint:'Des coulombs avec des heures : convertis d’abord le temps en secondes.'}],
  [L('Un onduleur solaire charge une batterie domestique de 48 V sous un courant constant de 8 A pendant 2 h 30.','a) Calculer la quantité d’électricité stockée, en ampères-heures.','b) Convertir ce résultat en coulombs.'),
    [{lbl:'a) Q',unit:'Ah',ans:8*2.5},{lbl:'b) Q',unit:'C',ans:8*2.5*3600}],{hint:'2 h 30 = 2,5 h (et pas 2,3 h).'}],
  ['Une batterie de secours (ancienne génération, au plomb) a une capacité de 45 Ah. Elle alimente un éclairage de secours consommant un courant de 0,5 A, à raison de 3 h par jour. Pendant combien de jours pourra-t-elle fonctionner avant d’être déchargée ?',
    [{lbl:'Durée',unit:'jours',ans:45/0.5/3}],{hint:'Calcule d’abord le nombre d’heures, puis divise par 3 h par jour.'}],
]);

/* ---------- CHAPITRE 7 — La résistance d'un conducteur (loi de Pouillet) ---------- */
serieAF(7, [
  ['Une installation photovoltaïque comprend une chaîne (string) de 10 panneaux en série, chacun de 400 Wc (Vmp = 32 V, Imp = 12,5 A). Le câble DC (cuivre, ρ = 0,0175 Ω.mm²/m) qui relie les panneaux à l’onduleur a une longueur aller-retour de 30 m et une section de 6 mm². Calculer la résistance du câble, puis la chute de tension qu’il occasionne au courant Imp.',
    [{lbl:'R du câble',unit:'Ω',ans:RHO_CU*30/6},{lbl:'Chute de tension',unit:'V',ans:RHO_CU*30/6*12.5}],{hint:'La chute de tension : U = R . I avec le courant Imp.'}],
  ['On souhaite limiter la chute de tension dans le câble DC d’une installation photovoltaïque à 3 % maximum. La chaîne de panneaux fonctionne sous une tension Vmp = 320 V et un courant Imp = 12,5 A ; le câble (cuivre, ρ = 0,0175 Ω.mm²/m) mesure 40 m aller-retour. Quelle section minimale doit-on choisir ?',
    [{lbl:'Chute de tension admise',unit:'V',ans:0.03*320},{lbl:'R maximale du câble',unit:'Ω',ans:0.03*320/12.5},{lbl:'S minimale (calculée)',unit:'mm²',ans:RHO_CU*40/(0.03*320/12.5)}],
    {tip:'Donne la section calculée ; dans ta solution, indique la section normalisée que tu choisirais au-dessus.'}],
  ['Une borne de recharge pour voiture électrique est alimentée par un câble en cuivre de section 6 mm² sur une longueur de 15 m (aller-retour). Calculer la résistance de ce câble. (ρ cuivre = 0,0175 Ω.mm²/m)',
    [{lbl:'R',unit:'Ω',ans:RHO_CU*15/6}]],
  ['On remplace un câble aérien en aluminium (ρ = 0,028 Ω.mm²/m) de 50 m et 10 mm² de section par un câble en cuivre de même résistance. Quelle section de cuivre faut-il choisir ?',
    [{lbl:'R du câble aluminium',unit:'Ω',ans:0.028*50/10},{lbl:'S du câble cuivre',unit:'mm²',ans:RHO_CU*50/(0.028*50/10)}]],
  ['Un câble solaire (PV) présente une section circulaire de diamètre 2,8 mm. Calculer sa section en mm² (S = π . d² / 4), puis sa résistance pour une longueur de 20 m en cuivre.',
    [{lbl:'S',unit:'mm²',ans:sec(2.8)},{lbl:'R',unit:'Ω',ans:RHO_CU*20/sec(2.8)}]],
  [L('Trois grandeurs sont données ; calculer la quatrième à l’aide de R = ρ . L / S, dans le contexte d’une installation photovoltaïque :',
     'a) ρ = 0,0175 Ω.mm²/m, L = 25 m, S = 4 mm² — calculer R.',
     'b) ρ = 0,0175 Ω.mm²/m, L = 15 m, R = 0,05 Ω — calculer S.',
     'c) ρ = 0,0175 Ω.mm²/m, R = 0,1 Ω, S = 2,5 mm² — calculer L.',
     'd) L = 30 m, S = 6 mm², R = 0,0875 Ω — calculer ρ, et identifier le métal correspondant.'),
    [{lbl:'a) R',unit:'Ω',ans:RHO_CU*25/4},{lbl:'b) S',unit:'mm²',ans:RHO_CU*15/0.05},{lbl:'c) L',unit:'m',ans:0.1*2.5/RHO_CU},{lbl:'d) ρ',unit:'Ω.mm²/m',ans:0.0875*6/30,tol:0.01}],
    {tip:'Le nom du métal (d) va dans ta solution.'}],
]);

/* ---------- CHAPITRE 8 — La loi d'Ohm ---------- */
serieAF(8, [
  ['Un panneau photovoltaïque de 400 Wc a une tension de fonctionnement optimal (Vmp) de 32 V et un courant optimal (Imp) de 12,5 A. Vérifier, à l’aide de la loi d’Ohm, que la résistance équivalente de la charge (onduleur) vue par le panneau à ce point de fonctionnement vaut environ 2,56 Ω.',
    [{lbl:'R',unit:'Ω',ans:32/12.5}]],
  ['Une borne de recharge pour voiture électrique délivre une tension de 230 V et un courant de 32 A en charge monophasée. Calculer la résistance équivalente du circuit de charge.',
    [{lbl:'R',unit:'Ω',ans:230/32}]],
  ['En cas de coupure de réseau, une batterie domestique de 48 V alimente un groupe d’appareils équivalent à une résistance de 9,6 Ω. Calculer le courant fourni par la batterie.',
    [{lbl:'I',unit:'A',ans:48/9.6}]],
  ['Une plaque à induction fonctionne sous 230 V et absorbe un courant de 13 A à pleine puissance. Calculer sa résistance équivalente.',
    [{lbl:'R',unit:'Ω',ans:230/13}]],
  ['Un ruban LED d’éclairage domestique, alimenté en 12 V continu, présente une résistance équivalente de 6 Ω. Calculer l’intensité du courant qui le traverse.',
    [{lbl:'I',unit:'A',ans:12/6}]],
  ['Un chargeur rapide pour smartphone délivre une tension de 9 V (mode charge rapide) sous un courant de 2 A. Calculer la résistance équivalente du circuit de charge à cet instant.',
    [{lbl:'R',unit:'Ω',ans:9/2}]],
  ['Compléter le tableau ci-dessous, relatif à trois éléments d’une installation domestique avec production solaire.'
     + tbl(['','Panneau PV','Batterie domestique','Borne de recharge'],[['R','2,56 Ω','9,6 Ω','a) ?'],['I','12,5 A','b) ?','32 A'],['U','c) ?','48 V','230 V']]),
    [{lbl:'a) R de la borne',unit:'Ω',ans:230/32},{lbl:'b) I de la batterie',unit:'A',ans:48/9.6},{lbl:'c) U du panneau',unit:'V',ans:2.56*12.5}]],
]);

/* ---------- CHAPITRE 9 — La résistance et la température (loi de Mathiessen) ---------- */
const A_AL=4.3e-3, A_W=6.5e-3, A_AG=3.85e-3, A_PT=3.85e-3, A_NI=2e-4;
serieAF(9, [
  ['Un câble en aluminium de la ligne DC entre deux rangées de panneaux photovoltaïques présente une résistance de 0,40 Ω à 25 °C. Par forte chaleur, sa température atteint 70 °C. Calculer sa nouvelle résistance. (α aluminium = 4,3 . 10⁻³)',
    [{lbl:'R à 70 °C',unit:'Ω',ans:rt(r0(0.40,A_AL,25),A_AL,70)}],{tip:'La résistance est donnée à 25 °C, pas à 0 °C : ramène-la d’abord à 0 °C.'}],
  ['Un shunt de mesure (résistance étalon) en Manganine, utilisé dans un multimètre de chantier, présente une résistance de 0,10 Ω à 0 °C. Que devient cette résistance lorsque l’appareil est utilisé à la température ambiante de 20 °C ? (α Manganine ≈ 0)',
    [{lbl:'R à 20 °C',unit:'Ω',ans:0.10,tol:0.005}],{hint:'Avec α ≈ 0, que vaut 1 + α . t ?'}],
  ['La résistance interne d’une batterie lithium de vélo électrique vaut 0,080 Ω à 20 °C. Par une froide matinée d’hiver, sa température chute à −5 °C. On modélise cette variation, sur cette plage de température, par un coefficient de température équivalent α = −0,02 /°C (comportement à coefficient négatif, comme pour le carbone, mais plus marqué). Calculer sa nouvelle résistance interne. Que peut-on en déduire sur les performances de la batterie par temps froid ?',
    [{lbl:'R à −5 °C',unit:'Ω',ans:rt(r0(0.080,-0.02,20),-0.02,-5),alt:[0.080*(1+(-0.02)*(-25))],tol:0.01}],
    {tip:'Ce que tu en déduis sur la batterie va dans ta solution.',hint:'Le froid fait monter la résistance : ton résultat doit être plus grand que 0,080 Ω.'}],
  ['Le filament de tungstène d’un projecteur de chantier à halogène a une résistance de 70 Ω à 0 °C. En fonctionnement, sa résistance atteint 1 162 Ω. Sachant que α (tungstène) = 6,5 . 10⁻³, calculer sa température de fonctionnement.',
    [{lbl:'Température',unit:'°C',ans:(1162-70)/(70*A_W)}]],
  ['Un contact électrique plaqué argent, utilisé dans un connecteur de recharge rapide, a une résistance de 1,20 Ω à 20 °C. Quelle est sa résistance à 35 °C lorsque le connecteur chauffe en pleine charge ? (α argent = 3,85 . 10⁻³)',
    [{lbl:'R à 35 °C',unit:'Ω',ans:rt(r0(1.20,A_AG,20),A_AG,35),tol:0.01}]],
  ['Une sonde de température à résistance de platine (Pt100), utilisée dans le régulateur d’une pompe à chaleur, a une résistance de 100 Ω à 0 °C (d’où son nom). Le coefficient de température du platine vaut α = 3,85 . 10⁻³. Lorsque la pompe à chaleur fonctionne, la sonde indique une résistance de 119,25 Ω. Quelle température mesure-t-elle ?',
    [{lbl:'Température',unit:'°C',ans:(119.25-100)/(100*A_PT)}]],
  [L('Un élément chauffant en nichrome d’un chauffe-eau électrique domestique, alimenté sous 230 V, a une résistance de 20 Ω à 20 °C. Le fil a un diamètre de 2 mm et une résistivité ρ = 1,10 Ω.mm²/m.','a) Calculer la longueur du fil.','b) Calculer le courant absorbé sous la même tension lorsque l’élément atteint 200 °C. (α nichrome = 2 . 10⁻⁴)'),
    [{lbl:'a) L',unit:'m',ans:20*sec(2)/1.10},{lbl:'b) I à 200 °C',unit:'A',ans:230/rt(r0(20,A_NI,20),A_NI,200)}],{hint:'a) Calcule d’abord la section : S = π . d² / 4.'}],
]);

/* ---------- CHAPITRE 10 — La puissance électrique ---------- */
serieAF(10, [
  ['Les feux d’une voiture électrique (feux de route et de croisement) portent les indications 48 W – 36 W sous 12 V. Calculer l’intensité du courant dans chacun des filaments ainsi que leur résistance. Sachant que la batterie 12 V a une capacité de 48 Ah, combien de temps le filament « feux de route » peut-il fonctionner sur cette seule batterie ?',
    [{lbl:'I feux de route',unit:'A',ans:48/12},{lbl:'R feux de route',unit:'Ω',ans:12/(48/12)},{lbl:'I feux de croisement',unit:'A',ans:36/12},{lbl:'R feux de croisement',unit:'Ω',ans:12/(36/12)},{lbl:'Durée (feux de route)',unit:'h',ans:48/(48/12)}]],
  [L('Une habitation consomme en moyenne une puissance de 2,5 kW en journée. Son installation photovoltaïque produit, en plein soleil à midi, une puissance de 4 kW.','a) Quelle puissance excédentaire (surplus) est disponible pour charger la batterie domestique ou être réinjectée sur le réseau ?','b) Si à ce moment la consommation grimpe à 4,8 kW (four et lave-linge en fonctionnement simultané), quelle puissance complémentaire doit alors être fournie par le réseau ?'),
    [{lbl:'a) Surplus',unit:'kW',ans:4-2.5},{lbl:'b) Puissance du réseau',unit:'kW',ans:4.8-4}]],
  [L('En fin d’après-midi, une maison consomme une puissance de 3,2 kW. Le soleil faiblissant, l’installation photovoltaïque ne produit plus que 1,4 kW ; la batterie domestique complète en fournissant 1 kW.','a) Quelle puissance reste-t-il à fournir par le réseau ?','b) Si la batterie a une capacité de 5 kWh et est chargée à 60 %, pendant combien de temps peut-elle encore fournir ce 1 kW avant de se décharger complètement ?'),
    [{lbl:'a) Puissance du réseau',unit:'kW',ans:3.2-1.4-1},{lbl:'b) Durée',unit:'h',ans:5*0.6/1}]],
  ['Un onduleur photovoltaïque délivre une puissance de 3 kW sous une tension de 230 V au réseau domestique. Calculer le courant injecté dans l’installation.',
    [{lbl:'I',unit:'A',ans:3000/230}]],
  ['Une batterie domestique de 5 kWh se recharge à une puissance constante de 2 kW à partir du surplus photovoltaïque. Sachant que l’énergie W = P . t, combien de temps (en heures) faut-il pour la recharger complètement en partant d’une batterie vide ?',
    [{lbl:'t',unit:'h',ans:5/2}]],
  [L('La nuit, l’installation photovoltaïque ne produit évidemment aucune puissance : une maison consomme alors 1,8 kW, entièrement fournis par le réseau. Le lendemain, en plein jour, la même maison ne consomme que 1,2 kW alors que le PV produit 3,5 kW.','a) Quelle puissance provient du réseau la nuit ?','b) Quelle puissance excédentaire le PV fournit-il en plein jour, et où peut-elle être utilisée ?'),
    [{lbl:'a) Puissance du réseau la nuit',unit:'kW',ans:1.8},{lbl:'b) Surplus en plein jour',unit:'kW',ans:3.5-1.2}],{tip:'Où le surplus peut être utilisé : dans ta solution.'}],
  ['Un chauffe-eau électrique consomme une puissance de 2,4 kW sous une tension de 230 V. Calculer sa résistance chauffante et l’intensité du courant qui le traverse.',
    [{lbl:'R',unit:'Ω',ans:230*230/2400},{lbl:'I',unit:'A',ans:2400/230}]],
]);

/* ---------- CHAPITRE 11 — L'énergie et l'effet Joule ---------- */
serieAF(11, [
  [L('Un câble DC reliant un panneau photovoltaïque (Imp = 12,5 A) à l’onduleur présente une résistance de 0,25 Ω.','a) Calculer la puissance perdue par effet Joule dans ce câble.','b) Ce courant circule pendant 5 heures d’ensoleillement effectif par jour : calculer l’énergie perdue par effet Joule en une journée, en kJ puis en kWh.'),
    [{lbl:'a) P perdue',unit:'W',ans:0.25*12.5**2},{lbl:'b) W par jour',unit:'kJ',ans:0.25*12.5**2*5*3600/1000},{lbl:'b) W par jour',unit:'kWh',ans:0.25*12.5**2*5/1000}]],
  [L('Une borne de recharge pour véhicule électrique fonctionne en triphasé sous 400 V / 16 A (11 kW). Le câble de recharge présente une résistance de 0,05 Ω par phase.','a) Calculer la puissance perdue par effet Joule dans une phase du câble.','b) Calculer l’énergie perdue dans cette phase pendant une charge complète de 2 heures.'),
    [{lbl:'a) P perdue (une phase)',unit:'W',ans:0.05*16**2},{lbl:'b) W en 2 h',unit:'J',ans:0.05*16**2*2*3600}],{hint:'b) En joules, le temps est en secondes : 2 h = 7 200 s.'}],
  ['Une bouilloire électrique de résistance 24 Ω est branchée sous 230 V pour faire bouillir de l’eau pendant 3 minutes. Calculer le courant absorbé, la puissance, et l’énergie consommée durant ce temps (en kJ).',
    [{lbl:'I',unit:'A',ans:230/24},{lbl:'P',unit:'W',ans:230*230/24},{lbl:'W',unit:'kJ',ans:230*230/24*180/1000}]],
  ['Un fer à souder électronique, utilisé pour l’assemblage de circuits imprimés, absorbe un courant de 1,24 A et a consommé une énergie de 161 kJ en 10 minutes d’utilisation. Quelle est sa résistance de fonctionnement ?',
    [{lbl:'R',unit:'Ω',ans:161000/(1.24**2*600)}],{hint:'R = W / (I² . t), avec W en joules et t en secondes.'}],
  ['Un four électrique domestique consomme une énergie de 990 kJ en un quart d’heure de cuisson, sous une tension de 230 V. Quel est le courant indiqué par un ampèremètre placé en série avec le four ?',
    [{lbl:'I',unit:'A',ans:990000/(15*60)/230}],{hint:'Commence par la puissance : P = W / t.'}],
  ['Un wattmètre placé dans le circuit d’alimentation du moteur d’une pompe de relevage industrielle indique une consommation de 5,4 kWh en 12 minutes de fonctionnement à pleine charge. Quelle puissance indique-t-il ?',
    [{lbl:'P',unit:'kW',ans:5.4/(12/60)}],{hint:'12 minutes = 0,2 h.'}],
  ['Lors d’un défaut d’isolement dans une installation domestique, un courant de court-circuit de 1 500 A circule pendant 40 ms (millisecondes) avant que le disjoncteur ne coupe le circuit. La résistance au point de défaut est de 0,05 Ω. Calculer l’énergie Joule dissipée à cet endroit pendant ce très court instant, en joules.',
    [{lbl:'WJ',unit:'J',ans:0.05*1500**2*0.040}],{hint:'40 ms = 0,040 s.'}],
]);

/* ---------- CHAPITRE 12 — Les résistances en série ---------- */
serieAF(12, [
  [L('Un installateur raccorde en série une chaîne (string) de 10 panneaux photovoltaïques identiques. Chaque panneau a une tension de fonctionnement optimal Vmp = 32 V et un courant optimal Imp = 12,5 A.','a) Calculer la tension totale du string.','b) Quel est le courant qui circule dans chaque panneau ? Et dans tout le string ?'),
    [{lbl:'a) U du string',unit:'V',ans:10*32},{lbl:'b) I dans chaque panneau',unit:'A',ans:12.5},{lbl:'b) I dans le string',unit:'A',ans:12.5}]],
  [L('Une guirlande décorative à LED comporte 10 LED montées en série, alimentée sous une tension continue de 24 V par un petit transformateur. Chaque LED a une tension nominale de 2 V et le courant de fonctionnement vaut 20 mA. Une résistance R, placée en série avec les LED, limite le courant à cette valeur.','a) Calculer la tension totale aux bornes des 10 LED.','b) Calculer la tension restante aux bornes de la résistance R.','c) En déduire la valeur de R.'),
    [{lbl:'a) U des LED',unit:'V',ans:10*2},{lbl:'b) U de R',unit:'V',ans:24-10*2},{lbl:'c) R',unit:'Ω',ans:(24-10*2)/0.020}],{hint:'c) 20 mA = 0,020 A.'}],
  [L('Une batterie de vélo électrique est constituée de 10 cellules Li-ion identiques montées en série. Chaque cellule a une tension nominale de 3,6 V et une résistance interne de 0,05 Ω.','a) Calculer la tension totale de la batterie.','b) Calculer la résistance interne totale du pack.','c) Le moteur tire un courant de 15 A : calculer la chute de tension due à la résistance interne totale.','d) En déduire la tension réellement disponible aux bornes de la batterie sous charge.'),
    [{lbl:'a) U',unit:'V',ans:10*3.6},{lbl:'b) r totale',unit:'Ω',ans:10*0.05},{lbl:'c) Chute de tension',unit:'V',ans:10*0.05*15},{lbl:'d) U sous charge',unit:'V',ans:10*3.6-10*0.05*15}]],
  [L('Un module électronique (capteur connecté) est alimenté par une pile de 9 V. Deux résistances de protection sont placées en série avant le composant : R₁ = 100 Ω et R₂ = 220 Ω. Le composant absorbe un courant de 15 mA.','a) Calculer la résistance totale du circuit de protection.','b) Calculer la chute de tension totale aux bornes de R₁ et R₂.','c) Quelle tension reste disponible pour le composant électronique ?'),
    [{lbl:'a) R totale',unit:'Ω',ans:100+220},{lbl:'b) U de R₁ et R₂',unit:'V',ans:(100+220)*0.015},{lbl:'c) U du composant',unit:'V',ans:9-(100+220)*0.015}]],
  [L('Le circuit de commande basse tension d’un sèche-serviettes électrique comprend, en série sous 12 V, un capteur de température de résistance équivalente 15 Ω et une résistance de consigne de 35 Ω.','a) Calculer le courant qui circule dans ce circuit de commande.','b) Calculer la tension aux bornes de chacun des deux éléments.'),
    [{lbl:'a) I',unit:'A',ans:12/(15+35)},{lbl:'b) U du capteur',unit:'V',ans:15*12/(15+35)},{lbl:'b) U de la consigne',unit:'V',ans:35*12/(15+35)}]],
  ['Un string de panneaux photovoltaïques est monté en série sur un toit. En fin d’après-midi, l’ombre d’une cheminée recouvre partiellement un seul des panneaux du string. En t’appuyant sur la propriété du montage série (un seul courant traverse tous les éléments), explique pourquoi la production de puissance de tout le string peut chuter fortement à cause de ce seul panneau ombragé.',
    [],{texte:true,sans:JUSTIF}],
  [L('Sur un banc d’essai, un technicien alimente sous 230 V, en série, une résistance chauffante d’essai R₁ = 20 Ω et une résistance de protection R₂ de valeur inconnue. Le courant mesuré dans le circuit vaut 5 A.','a) Calculer la résistance totale du circuit.','b) En déduire la valeur de R₂.','c) Calculer la tension aux bornes de chacune des deux résistances.'),
    [{lbl:'a) R totale',unit:'Ω',ans:230/5},{lbl:'b) R₂',unit:'Ω',ans:230/5-20},{lbl:'c) U₁',unit:'V',ans:20*5},{lbl:'c) U₂',unit:'V',ans:(230/5-20)*5}]],
]);

/* ---------- CHAPITRE 13 — La chute de tension en ligne ---------- */
const L13_2 = { RL: 0.1*100/sec(3) }; L13_2.I = 120/(25+L13_2.RL);
const L13_7 = { S: sec(4) }; L13_7.R = RHO_CU*1000/L13_7.S;
serieAF(13, [
  ['Que vaut la d.d.p. à appliquer à la source d’un circuit constitué de 3 ampoules LED en série de 7 Ω chacune, alimentées par un câble de 1,5 Ω de résistance (aller), si le courant qui circule vaut 8 A ?',
    [{lbl:'U à la source',unit:'V',ans:(3*7+2*1.5)*8,tol:0.01}],{hint:'1,5 Ω pour l’aller seulement : le courant revient aussi par le câble.'}],
  ['Déterminer la chute de tension se produisant dans la ligne bifilaire qui alimente un récepteur de 25 Ω et distant de 50 m du générateur de tension U = 120 V. La ligne est faite de fer de 3 mm de diamètre (ρ = 0,1 Ω.mm²/m). Déterminer également la d.d.p. aux bornes du récepteur.',
    [{lbl:'UL (chute en ligne)',unit:'V',ans:L13_2.RL*L13_2.I},{lbl:'U du récepteur',unit:'V',ans:25*L13_2.I,tol:0.005}],{hint:'Ligne bifilaire : 50 m aller + 50 m retour. Section : S = π . d² / 4.'}],
  [L('Un onduleur photovoltaïque est installé à 25 m (aller-retour) du coffret de raccordement. Le câble utilisé est en cuivre (ρ = 0,0175 Ω.mm²/m) de section 6 mm². Sachant que le courant Imp vaut 12,5 A et que la tension de la chaîne de panneaux (string) est de 320 V, calculer :','a) la résistance du câble ;','b) la chute de tension en ligne UL ;','c) le pourcentage de chute de tension par rapport à la tension du générateur.'),
    [{lbl:'a) R',unit:'Ω',ans:RHO_CU*25/6},{lbl:'b) UL',unit:'V',ans:RHO_CU*25/6*12.5},{lbl:'c) Chute de tension',unit:'%',ans:RHO_CU*25/6*12.5/320*100}]],
  ['On souhaite qu’un câble photovoltaïque (aller-retour) de 35 m en cuivre (ρ = 0,0175 Ω.mm²/m) n’occasionne pas plus de 2 % de chute de tension sur une chaîne fonctionnant sous 400 V et un courant de 10 A. Quelle section minimale doit-on choisir ?',
    [{lbl:'S minimale (calculée)',unit:'mm²',ans:RHO_CU*35/(0.02*400/10)}],{hint:'2 % de 400 V = 8 V ; R max = 8 V / 10 A.'}],
  ['Une borne de recharge pour véhicule électrique, alimentée sous 230 V, est reliée au tableau électrique par un câble de cuivre de 20 m (aller-retour) et de section 6 mm². Elle délivre un courant de 32 A. Calculer la chute de tension dans le câble et la tension réellement disponible à la borne.',
    [{lbl:'UL',unit:'V',ans:RHO_CU*20/6*32},{lbl:'U à la borne',unit:'V',ans:230-RHO_CU*20/6*32,tol:0.002}]],
  ['Une batterie domestique de 48 V est reliée à l’onduleur par un câble de cuivre de 3 m (aller-retour) et 16 mm² de section. En pleine décharge, elle débite un courant de 100 A. Calculer la chute de tension dans ce câble et le pourcentage qu’elle représente par rapport à la tension nominale de la batterie.',
    [{lbl:'UL',unit:'V',ans:RHO_CU*3/16*100},{lbl:'Chute de tension',unit:'%',ans:RHO_CU*3/16*100/48*100}]],
  ['Une installation photovoltaïque alimente un récepteur situé à 0,5 km du local technique. Le câble utilisé, en cuivre, a un diamètre équivalent de 4 mm et est parcouru par un courant de 16 A. La tension au départ est de 220 V (ρ = 0,0175 Ω.mm²/m). On demande : UL = ? V, tension au récepteur = ? V, densité de courant J = ? A/mm².',
    [{lbl:'UL',unit:'V',ans:L13_7.R*16},{lbl:'U au récepteur',unit:'V',ans:220-L13_7.R*16,tol:0.005},{lbl:'J',unit:'A/mm²',ans:16/L13_7.S}],{hint:'0,5 km aller et 0,5 km retour : 1 000 m de câble. J = I / S.'}],
]);

/* ---------- CHAPITRE 14 — Les résistances en parallèle ---------- */
serieAF(14, [
  [L('Un tableau électrique domestique reçoit simultanément le courant du réseau et celui de l’onduleur photovoltaïque, tous deux sous la même tension de 230 V (les deux sources sont en parallèle sur le même jeu de barres). Le réseau fournit un courant de 3 A tandis que l’onduleur PV fournit 8 A.','a) Quel est le courant total consommé par l’habitation à cet instant ?','b) Quelle est la puissance totale consommée ?'),
    [{lbl:'a) I total',unit:'A',ans:3+8},{lbl:'b) P totale',unit:'W',ans:230*(3+8)}]],
  [L('Trois sources alimentent en parallèle, sous la même tension de 48 V, le bus continu d’une installation domestique autonome : le contrôleur solaire fournit 20 A, la batterie domestique fournit 15 A, et un petit groupe électrogène d’appoint fournit 5 A.','a) Calculer le courant total disponible sur le bus.','b) Si la charge de la maison consomme 35 A à cet instant, que devient le surplus de courant ?'),
    [{lbl:'a) I total',unit:'A',ans:20+15+5},{lbl:'b) Surplus',unit:'A',ans:20+15+5-35}],{tip:'Ce que devient le surplus : dans ta solution.'}],
  ['Un hub USB alimente en parallèle, sous 5 V, trois appareils dont les résistances équivalentes valent respectivement 10 Ω, 25 Ω et 50 Ω. Calculer la résistance équivalente du montage, puis le courant total fourni par le port USB.',
    [{lbl:'Réqu',unit:'Ω',ans:pN(10,25,50)},{lbl:'I total',unit:'A',ans:5/pN(10,25,50)}],{hint:'Réqu doit être plus petite que la plus petite résistance (10 Ω).'}],
  ['Deux chaînes (strings) de panneaux photovoltaïques, de résistances internes équivalentes R₁ = 6 Ω et R₂ = 3 Ω, sont raccordées en parallèle sur le même onduleur. Calculer la résistance équivalente du groupement.',
    [{lbl:'Réqu',unit:'Ω',ans:p2(6,3)}]],
  [L('Une batterie domestique est constituée de 4 modules identiques de 12 Ω de résistance interne, montés en parallèle.','a) Calculer la résistance équivalente avant qu’un module ne tombe en panne (circuit ouvert).','b) Calculer la résistance équivalente après la panne (3 modules restants).'),
    [{lbl:'a) Réqu (4 modules)',unit:'Ω',ans:12/4},{lbl:'b) Réqu (3 modules)',unit:'Ω',ans:12/3}]],
  ['Une borne de recharge bidirectionnelle alimente en parallèle, sous 400 V, deux circuits : le premier absorbe un courant de 12 A, le second un courant inconnu. Le courant total mesuré est de 20 A. Calculer le courant du second circuit, ainsi que sa résistance équivalente.',
    [{lbl:'I₂',unit:'A',ans:20-12},{lbl:'R₂',unit:'Ω',ans:400/(20-12)}]],
]);

/* ---------- CHAPITRE 15 — Les résistances mixtes ---------- */
const m15 = (U, r1, ...rp) => { const rq=pN(...rp), I=U/(r1+rq), Up=rq*I; return { rq, rt:r1+rq, I, Up, Ib:rp.map(r=>Up/r) }; };
const c1=m15(230,2,46,46), c2=m15(20,1,40,60), c3=m15(32,0.5,20,30), c4=m15(12,6,12,12);
serieAF(15, [
  [L('Un circuit de test alimente, sous 230 V, deux radiateurs d’appoint identiques montés en parallèle (R₂ = R₃ = 46 Ω chacun), eux-mêmes en série avec la résistance du câble d’alimentation R₁ = 2 Ω.','a) Calculer la résistance équivalente du groupement parallèle formé par les deux radiateurs.','b) Calculer la résistance totale du circuit (câble + radiateurs).','c) Calculer le courant total fourni par la source.','d) Calculer la tension aux bornes du groupement de radiateurs.'),
    [{lbl:'a) R₂ // R₃',unit:'Ω',ans:c1.rq},{lbl:'b) R totale',unit:'Ω',ans:c1.rt},{lbl:'c) I total',unit:'A',ans:c1.I},{lbl:'d) U des radiateurs',unit:'V',ans:c1.Up,tol:0.005}]],
  [L('Un chargeur secteur multiport alimente, sous une tension de sortie de 20 V, deux ports USB-C en parallèle (R₂ = 40 Ω, R₃ = 60 Ω) placés en série avec la résistance interne du convertisseur R₁ = 1 Ω.','a) Calculer la résistance équivalente du groupement parallèle R₂ // R₃.','b) Calculer la résistance équivalente totale du circuit.','c) Calculer le courant total débité par le convertisseur.','d) Calculer le courant dans chacun des deux ports USB-C.'),
    [{lbl:'a) R₂ // R₃',unit:'Ω',ans:c2.rq},{lbl:'b) R totale',unit:'Ω',ans:c2.rt},{lbl:'c) I total',unit:'A',ans:c2.I},{lbl:'d) I₂',unit:'A',ans:c2.Ib[0]},{lbl:'d) I₃',unit:'A',ans:c2.Ib[1]}]],
  [L('Une installation autonome combine un panneau photovoltaïque (assimilé à une source de 32 V avec une résistance interne équivalente R₁ = 0,5 Ω) qui alimente, en série, une charge principale constituée de deux appareils en parallèle : une pompe de circulation (R₂ = 20 Ω) et un contrôleur de charge (R₃ = 30 Ω).','a) Calculer la résistance équivalente du groupement parallèle R₂ // R₃.','b) Calculer la résistance équivalente totale vue par le panneau (R₁ + groupement).','c) Calculer le courant total fourni par le panneau.','d) Calculer le courant dans la pompe et dans le contrôleur.'),
    [{lbl:'a) R₂ // R₃',unit:'Ω',ans:c3.rq},{lbl:'b) R totale',unit:'Ω',ans:c3.rt},{lbl:'c) I total',unit:'A',ans:c3.I},{lbl:'d) I pompe',unit:'A',ans:c3.Ib[0]},{lbl:'d) I contrôleur',unit:'A',ans:c3.Ib[1]}]],
  [L('Un ruban LED est découpé en trois segments : un segment A (résistance équivalente R₁ = 6 Ω) monté en série avec deux segments identiques B et C (R₂ = R₃ = 12 Ω chacun) montés en parallèle entre eux. L’ensemble est alimenté sous 12 V continu.','a) Calculer la résistance équivalente du groupement parallèle B // C.','b) Calculer la résistance équivalente totale du montage.','c) Calculer le courant total fourni par l’alimentation 12 V.','d) Calculer le courant dans chaque segment B et C.'),
    [{lbl:'a) B // C',unit:'Ω',ans:c4.rq},{lbl:'b) R totale',unit:'Ω',ans:c4.rt},{lbl:'c) I total',unit:'A',ans:c4.I},{lbl:'d) I dans B (et dans C)',unit:'A',ans:c4.Ib[0]}]],
  [L('Dans une installation domestique, une prise multiple (barrette) alimente 3 appareils identiques de 100 Ω chacun, montés en parallèle ; cette barrette est reliée au tableau électrique par un câble de résistance R₁ = 1 Ω placé en série. Un des trois appareils tombe en panne et se retrouve en circuit ouvert (branche coupée).','a) Calculer la résistance équivalente du groupement parallèle avant la panne.','b) Calculer la résistance équivalente totale du circuit avant la panne.','c) Calculer la résistance équivalente du groupement parallèle après la panne (2 appareils restants).','d) Le courant total débité par le tableau augmente-t-il ou diminue-t-il après la panne ? Justifier.'),
    [{lbl:'a) Réqu avant la panne',unit:'Ω',ans:100/3},{lbl:'b) R totale avant la panne',unit:'Ω',ans:1+100/3},{lbl:'c) Réqu après la panne',unit:'Ω',ans:100/2}],{tip:'La réponse d), avec sa justification, va dans ta solution.'}],
  [L('Un module de recharge solaire est parcouru par un courant total mesuré I = 500 mA. Le circuit comprend une résistance série R₁ = 4 Ω (câblage et protection) suivie d’un groupement parallèle formé de R₂ = 30 Ω (contrôleur de charge) et R₃ = 60 Ω (voyant de charge à LED, avec sa résistance série intégrée).','a) Calculer la tension totale U aux bornes du montage.','b) Calculer la tension U aux bornes du groupement parallèle (U₂ = U₃).','c) Calculer I₂ et I₃.'),
    [{lbl:'a) U totale',unit:'V',ans:0.5*(4+p2(30,60))},{lbl:'b) U₂ = U₃',unit:'V',ans:0.5*p2(30,60)},{lbl:'c) I₂',unit:'A',ans:0.5*p2(30,60)/30},{lbl:'c) I₃',unit:'A',ans:0.5*p2(30,60)/60}],{hint:'500 mA = 0,5 A.'}],
  ['Dans le tableau électrique simplifié d’un kot étudiant, on modélise le circuit par une résistance série R₁ = 1 Ω (câble principal), suivie d’un groupement parallèle de trois circuits R₂ = 60 Ω (chargeurs multiples), R₃ = 30 Ω (éclairage LED) et R₄ = 20 Ω (frigo compact), le tout en série avec une résistance R₅ = 2 Ω (protection différentielle). Calculer la résistance équivalente totale Réqu du montage.',
    [{lbl:'R₂ // R₃ // R₄',unit:'Ω',ans:pN(60,30,20)},{lbl:'Réqu totale',unit:'Ω',ans:1+pN(60,30,20)+2}]],
]);

/* ---------- CHAPITRE 16 — Les appareils de mesure ---------- */
serieAF(16, [
  ['Un appareil de mesure à cadre mobile (base d’un ancien multimètre analogique d’atelier) a une résistance interne de 1,2 kΩ et une déviation maximum de 100 μA. On veut en faire un voltmètre de calibre 30 V. Calculer la résistance additionnelle (multiplicateur) à placer en série.',
    [{lbl:'Résistance additionnelle (en série)',unit:'Ω',ans:30/100e-6-1200,tol:0.002}],{hint:'Résistance totale = 30 V / 100 μA ; retire la résistance de l’appareil.'}],
  ['Ce même appareil de base (100 μA — 1,2 kΩ) doit être transformé en ampèremètre de calibre 5 A pour contrôler, en atelier, le courant de sortie d’un onduleur photovoltaïque. Calculer la résistance shunt à placer en parallèle.',
    [{lbl:'Shunt (en parallèle)',unit:'Ω',ans:1200*100e-6/(5-100e-6)}]],
  [L('Pour chacune des mesures suivantes, indique l’appareil à utiliser et la manière de le brancher (en série ou en parallèle, circuit sous tension ou hors tension) :','a) la tension aux bornes d’une batterie domestique de secours (48 V) ;','b) le courant absorbé par une borne de recharge de véhicule électrique, sans interrompre le circuit ;','c) la résistance d’une résistance chauffante démontée, hors tension.'),
    [],{texte:true,sans:JUSTIF}],
  ['Un élève veut mesurer la résistance d’un ruban LED encore raccordé et sous tension à l’aide d’un ohmmètre. Explique pourquoi cette manipulation est incorrecte et dangereuse pour l’appareil de mesure, et ce qu’il faut faire avant de mesurer.',
    [],{texte:true,sans:JUSTIF}],
  [L('Un compteur communicant (« smart meter ») affiche une puissance instantanée de 3 450 W sous une tension de 230 V (installation monophasée).','a) Calculer le courant correspondant.','b) Un tel compteur n’est pas traversé directement par ce courant : quel dispositif interne (shunt, transformateur de courant…) lui permet de le mesurer sans risque ?'),
    [{lbl:'a) I',unit:'A',ans:3450/230}],{tip:'La réponse b) va dans ta solution.'}],
  ['Le cadre mobile d’un multimètre analogique encore utilisé en atelier a une déviation maximum de 100 μA et une résistance de 850 Ω. Calculer la résistance shunt à utiliser pour mesurer, sur un calibre de 2 A, le courant de charge de la batterie d’une trottinette électrique.',
    [{lbl:'Shunt (en parallèle)',unit:'Ω',ans:850*100e-6/(2-100e-6)}]],
  ['Cite deux avantages d’un multimètre numérique par rapport à un multimètre analogique à cadre mobile pour la maintenance électrique actuelle.',
    [],{texte:true,sans:JUSTIF}],
  ['Pour contrôler le courant absorbé par une pompe à chaleur triphasée (400 V) sans couper son alimentation, quel appareil de mesure faut-il utiliser et comment le placer ? Explique pourquoi on ne peut pas simplement intercaler un ampèremètre classique comme on le ferait sur un petit circuit basse tension.',
    [],{texte:true,sans:JUSTIF}],
]);

/* ---------- CHAPITRE 20 — Les puissances de 10 ---------- */
serieAF(20, [
  ['Une installation photovoltaïque résidentielle a une puissance crête de 6 kWc et produit en moyenne 900 kWh par kWc installé et par an. Calculer sa production annuelle en Wh, puis l’exprimer sous la forme d’un produit d’un nombre entier et d’une puissance de 10.',
    [{lbl:'Production annuelle',unit:'Wh',ans:6*900*1e3,tol:0.005}],{hint:'1 kWh = 10³ Wh.'}],
  ['Une batterie domestique de stockage a une capacité de 10 kWh. Exprimer cette capacité en Wh sous forme d’une puissance de 10, puis en mWh (milliwattheures).',
    [{lbl:'Capacité',unit:'Wh',ans:1e4,tol:0.005},{lbl:'Capacité',unit:'mWh',ans:1e7,tol:0.005}]],
  ['Un smartphone récent dispose d’une mémoire de stockage de 256 Go. Sachant que 1 Go = 10⁹ octets, exprimer cette capacité en octets sous la forme d’un produit d’un nombre entier et d’une puissance de 10.',
    [{lbl:'Capacité',unit:'octets',ans:256e9,tol:0.005}]],
  ['Un disque dur externe a une capacité de 4 To (téraoctets) et un fichier vidéo pèse 2,5 Go. Combien de fichiers de ce type peut-on stocker au maximum sur ce disque dur ? Détailler le calcul en puissances de 10 (1 To = 1 000 Go).',
    [{lbl:'Nombre de fichiers',unit:'',ans:4e3/2.5,tol:0.001}]],
  [L('Une connexion 5G domestique atteint un débit de 1,2 Gbit/s. Exprimer ce débit :','a) en Mbit/s ;','b) en bit/s, sous forme d’une puissance de 10.'),
    [{lbl:'a) Débit',unit:'Mbit/s',ans:1.2e3,tol:0.005},{lbl:'b) Débit',unit:'bit/s',ans:1.2e9,tol:0.005}]],
  [L('Un disjoncteur différentiel se déclenche pour un courant de fuite de 30 mA. Exprimer cette valeur :','a) en A, sous forme d’une puissance de 10 ;','b) en μA.'),
    [{lbl:'a) I',unit:'A',ans:30e-3,tol:0.005},{lbl:'b) I',unit:'μA',ans:30e3,tol:0.005}]],
  [L('La résistance d’isolement d’un câble électrique, mesurée au moyen d’un mégohmmètre, vaut 2,5 MΩ. Exprimer cette valeur :','a) en Ω, sous forme d’une puissance de 10 ;','b) en kΩ.'),
    [{lbl:'a) R',unit:'Ω',ans:2.5e6,tol:0.005},{lbl:'b) R',unit:'kΩ',ans:2.5e3,tol:0.005}]],
  [L('Un panneau photovoltaïque de 400 Wc produit environ 440 kWh par an. Un particulier installe 15 panneaux identiques. Calculer, sous forme d’un produit d’un nombre entier et d’une puissance de 10 :','a) la puissance crête totale de l’installation, en Wc ;','b) la production annuelle totale, en kWh.'),
    [{lbl:'a) Puissance crête',unit:'Wc',ans:15*400,tol:0.005},{lbl:'b) Production annuelle',unit:'kWh',ans:15*440,tol:0.005}]],
]);
})();
