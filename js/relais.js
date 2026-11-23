/* =========================================================
   CHAPITRE 2.3 — LE RELAIS ÉLECTROMÉCANIQUE (démo complète)
   Contenu repris du cours d'Électricité 4e, pages 54 à 63
   ========================================================= */

const Q = {
  c1q1:{q:"Quel est le rôle d'un relais ?",o:["Un interrupteur que l'on ferme à distance, électriquement, au lieu de le fermer à la main","Un appareil qui protège le circuit contre les surintensités","Un transformateur qui abaisse le 400 V en 24 V"],g:0,e:"Le relais est un interrupteur commandé électriquement : un petit courant dans la bobine fait basculer ses contacts.",r:'c1'},
  c1q2:{q:"Le bouton de l'opérateur est en 24 V, le moteur en 400 V. Quel est l'intérêt ?",o:["Consommer moins d'énergie","Éloigner l'opérateur du danger : il ne touche qu'un circuit basse tension","Le moteur ne peut démarrer qu'avec du 24 V"],g:1,e:"C'est l'un des trois besoins du relais : l'opérateur reste sur un circuit basse tension pendant que le circuit commandé est en 400 V.",r:'c1'},
  c2q1:{q:"Dans un relais, combien de pièces bougent ?",o:["Une seule : l'armature mobile","Deux : la bobine et le noyau","Toutes, sauf le socle"],g:0,e:"Six pièces et une seule qui bouge : l'armature. Tout le reste sert à la déplacer, à la ramener, ou à recevoir les fils.",r:'c2'},
  c2q2:{q:"Quel élément ramène l'armature au repos quand on coupe la bobine ?",o:["Le noyau de fer","Le ressort de rappel","Le contact NF"],g:1,e:"Le ressort de rappel ramène l'armature en position de repos dès que la bobine n'est plus alimentée.",r:'c2'},
  c3q1:{q:"Dans « contact normalement ouvert », que veut dire « normalement » ?",o:["Quand la machine fonctionne normalement","Dans la plupart des cas, habituellement","Bobine non alimentée : l'état de référence, celui de tous les schémas"],g:2,e:"« Normalement » ne veut dire ni « habituellement » ni « quand la machine tourne » : c'est l'état bobine au repos, celui dans lequel tout schéma est dessiné.",r:'c3'},
  c3q2:{q:"On alimente la bobine. Que deviennent les contacts ?",o:["Les NF s'ouvrent et les NO se ferment, tous en même temps","Les NO s'ouvrent et les NF se ferment","Seul le premier contact bascule"],g:0,e:"L'armature fait basculer tous les contacts en même temps : les NF s'ouvrent, les NO se ferment. On entend un déclic sec.",r:'c3'},
  c3q3:{q:"Combien de bornes possède un contact inverseur ?",o:["Deux","Trois : un commun, un NO et un NF","Quatre"],g:1,e:"Le commun bascule de l'un à l'autre : le courant ressort soit par le NF, soit par le NO, jamais par les deux.",r:'c3'},
  c4q1:{q:"Une bobine 24 V DC est branchée sur 230 V AC. Que se passe-t-il ?",o:["Le relais colle plus vite","Le relais vibre légèrement","La bobine grille immédiatement"],g:2,e:"La tension de bobine est inscrite sur le relais. Une bobine 24 V branchée sur 230 V grille immédiatement.",r:'c4'},
  c4q2:{q:"Des contacts donnés pour 8 A sous 250 V AC commutent 20 A. Conséquence ?",o:["Le contact se colle ou brûle","Le relais vibre","Aucune : c'est la tension de bobine qui compte"],g:0,e:"Il ne faut jamais confondre tension de bobine et pouvoir de coupure. Un contact prévu pour 8 A qui en commute 20 se colle ou brûle.",r:'c4'},
  c4q3:{q:"Qu'est-ce qu'un contact sec ?",o:["Un contact qui ne craint pas l'humidité","Un contact sans tension propre : le circuit des contacts est totalement séparé de celui de la bobine","Un contact qui fournit lui-même du 24 V"],g:1,e:"Les contacts sont de simples interrupteurs commandés. Bobine et contacts n'ont aucune liaison électrique : c'est l'isolation galvanique, une sécurité.",r:'c4'},
  c5q1:{q:"Deux relais ont le même format et la même apparence. Peut-on raccorder le second de mémoire ?",o:["Oui, s'ils ont le même nombre de broches","Non : on lit toujours le schéma imprimé sur le relais que l'on a en main","Oui, s'ils viennent du même magasin"],g:1,e:"Règle absolue : deux relais semblables peuvent avoir des brochages différents selon le fabricant et le modèle.",r:'c5'},
  c5q2:{q:"Sur un relais, on lit « 14 ». De quoi s'agit-il ?",o:["Toujours de la 14e broche du socle","Toujours de la sortie à fermeture du premier inverseur","Ça dépend : seul le schéma imprimé sur l'appareil tranche"],g:2,e:"Un « 14 » peut être la sortie à fermeture du premier inverseur ou la quatorzième broche du socle. Ne jamais mélanger les deux numérotations.",r:'c5'},
  c5q3:{q:"À quoi sert le détrompeur ?",o:["À empêcher le relais de tomber","À donner l'orientation, pour ne pas lire le plan à l'envers","À indiquer si le relais est collé"],g:1,e:"Un plan lu à l'envers échange la gauche et la droite. On aligne le détrompeur avec celui du plan avant de lire les numéros.",r:'c5'},
  c6q1:{q:"Pourquoi le bouton d'arrêt est-il un contact NF ?",o:["Parce qu'il coûte moins cher","Si son fil se casse, la machine s'arrête : le défaut se signale de lui-même","Pour que la machine redémarre seule après une coupure"],g:1,e:"C'est la sécurité positive. Câblé en NO, une rupture de fil rendrait l'arrêt inopérant — et personne ne s'en apercevrait avant l'urgence.",r:'c6'},
  c6q2:{q:"Un élève a câblé KA1 en parallèle avec S1 (arrêt) au lieu de S2. Que se passe-t-il ?",o:["Le relais ne colle jamais","Rien ne change","Plus d'auto-maintien : le relais retombe dès qu'on lâche marche — et tant qu'on tient marche, l'arrêt ne coupe plus rien"],g:2,e:"KA1 relie les bornes de S1 : plus rien ne remplace le bouton de marche quand on le lâche. Et pendant qu'on le tient, KA1 court-circuite l'arrêt. Le contact d'auto-maintien se place toujours en parallèle avec la marche, jamais avec un organe de coupure.",r:'c6'},
  c6q3:{q:"Le courant revient après une coupure du réseau. La machine redémarre-t-elle ?",o:["Oui, puisque le relais était collé","Non : il faut un nouvel appui sur marche","Oui, mais seulement après quelques secondes"],g:1,e:"À la coupure, le relais retombe et KA1 s'ouvre. Au retour du courant, rien ne repart : c'est la protection contre le redémarrage intempestif.",r:'c6'},
  c7q1:{q:"Le relais ne colle pas, mais la bobine mesure une valeur correcte. Que faire ?",o:["Remplacer le relais","Chercher en amont : il n'y a pas de tension sur A1-A2","Changer le contact NO"],g:1,e:"La bobine est saine : le problème est en amont, dans le circuit de commande.",r:'c7'},
  c7q2:{q:"Le relais vibre ou grésille au lieu de coller franchement. Cause probable ?",o:["Tension de bobine insuffisante, ou bobine prévue pour une autre tension","Contact NF usé","Armature bloquée mécaniquement"],g:0,e:"Un relais qui grésille n'est pas alimenté à la bonne tension.",r:'c7'},
  c8q1:{q:"Relais retiré de son socle, hors tension : sa bobine affiche OL. Conclusion ?",o:["La bobine est coupée : le relais est à remplacer","Le relais est sain","Le contact NO est collé"],g:0,e:"OL entre A1 et A2 : la bobine est coupée.",r:'c7'},
  c8q2:{q:"Sur un second relais au repos, on lit 0,2 Ω entre le commun et le NO. Conclusion ?",o:["Rien d'anormal","Le contact NO est collé","La bobine est en court-circuit"],g:1,e:"Au repos, on doit lire OL entre le commun et le NO. Quelques ohms : le contact est collé. Et avant de remplacer, cherche la surintensité qui l'a soudé.",r:'c7'},
  c8q3:{q:"Qu'ont en commun un relais et un contacteur ?",o:["Ils commandent tous les deux des courants de puissance","Le même principe : bobine, noyau, armature, ressort, contacts","Ils ont tous les deux une chambre de coupure"],g:1,e:"Le contacteur a des contacts massifs et une chambre de coupure pour la puissance, mais le principe est exactement le même que celui du relais.",r:'c4'},
};

const CAPS = [
  {id:'c1', sec:'2.3.1 a', t:'Pourquoi un relais ?', quiz:['c1q1','c1q2']},
  {id:'c2', sec:'2.3.1 b', t:"Ce qu'il y a dedans", quiz:['c2q1','c2q2'], ex:'parts'},
  {id:'c3', sec:'2.3.1 c-d', t:'Comment ça marche', quiz:['c3q1','c3q2','c3q3'], ex:'coil'},
  {id:'c4', sec:'2.3.1 e-g', t:'Contact sec et caractéristiques', quiz:['c4q1','c4q2','c4q3']},
  {id:'c5', sec:'2.3.2', t:'Le plan de brochage', quiz:['c5q1','c5q2','c5q3'], ex:'pins'},
  {id:'c6', sec:'2.3.3', t:"L'auto-maintien", quiz:['c6q1','c6q2','c6q3'], ex:'steps'},
  {id:'c7', sec:'2.3.4', t:'Vérifier un relais', quiz:['c7q1','c7q2'], ex:'ohm'},
  {id:'c8', sec:'2.3.5', t:'Exercices', quiz:['c8q1','c8q2','c8q3'], ex:'calc'},
];

const TEST = [
  {id:'t1',pts:3,type:'open',q:"Décrire en trois phrases ce qui se passe dans un relais quand on alimente sa bobine.",cor:"La bobine crée un champ magnétique. Ce champ attire l'armature mobile. L'armature entraîne les contacts, qui changent d'état : les NO se ferment, les NF s'ouvrent.",r:'c3',rv:'2.3.1'},
  {id:'t2',pts:2,type:'qcm',q:"Qu'est-ce qu'un contact sec, et quel avantage cela procure-t-il ?",o:["Un contact qui supporte l'humidité : on peut l'installer dehors","Un contact libre de potentiel : on commande un circuit 400 V avec une bobine 24 V, sans liaison électrique entre les deux","Un contact qui possède sa propre alimentation, ce qui évite un transformateur"],g:1,r:'c4',rv:'2.3.1'},
  {id:'t3',pts:1,type:'qcm',q:"Sur un relais, à quoi servent les bornes A1 et A2 ?",o:["Ce sont les deux bornes de la bobine","Ce sont le commun et le NO du premier inverseur","Ce sont les bornes de la terre"],g:0,r:'c5',rv:'2.3.2'},
  {id:'t4',pts:4,type:'open',q:"Expliquer le principe de l'auto-maintien en partant de ce qui se passe quand on relâche le bouton de marche.",cor:"Quand on appuie sur marche, la bobine est alimentée et le relais colle. Un de ses propres contacts à fermeture, câblé en parallèle avec le bouton, se ferme alors. Quand on relâche le bouton, le courant passe par ce contact : la bobine reste alimentée par elle-même. Le circuit se maintient jusqu'à ce qu'on ouvre la chaîne d'arrêt.",r:'c6',rv:'2.3.3'},
  {id:'t5',pts:3,type:'qcm',q:"Le contact d'auto-maintien doit-il être câblé en parallèle avec le bouton de marche ou avec le bouton d'arrêt ? Que se passerait-il en cas d'erreur ?",o:["Avec l'arrêt ; avec la marche, le relais ne se maintiendrait pas","Avec la marche ; avec l'arrêt, il court-circuiterait S1 : plus d'auto-maintien, et l'arrêt n'agirait plus tant qu'on tient marche","Avec la bobine ; ailleurs, la bobine grillerait"],g:1,r:'c6',rv:'2.3.3'},
  {id:'t6',pts:3,type:'order',shuf:[2,0,1],q:"Un relais ne colle pas. Remets les trois vérifications dans l'ordre.",items:["Vérifier la présence de la tension entre A1 et A2, et qu'elle correspond à celle inscrite sur le relais","Vérifier que le relais est correctement enfiché dans son socle","Mesurer la résistance de la bobine hors tension"],r:'c7',rv:'2.3.4'},
  {id:'t7',pts:3,type:'calc',q:"Une bobine de relais 24 V continu mesure 480 Ω à l'ohmmètre. Calculer le courant qu'elle absorbe, puis dire si cette valeur de résistance est normale.",r:'c8',rv:'2.3.4'},
  {id:'t8',pts:2,type:'qcm',q:"Pourquoi repère-t-on le détrompeur avant de lire un plan de brochage ? Que risque-t-on sinon ?",o:["Il indique la tension de bobine ; sans lui on grille le relais","Il donne l'orientation ; sans lui on confond vue de dessus et vue de dessous, la gauche et la droite sont inversées et le câblage est faux","Il empêche d'enficher le relais ; sans lui le relais tombe"],g:1,r:'c5',rv:'2.3.2'},
  {id:'t9',pts:2,type:'qcm',q:"Quelles sont les deux caractéristiques d'un relais à ne jamais confondre ? Conséquence d'une erreur sur chacune ?",o:["La couleur et la taille : on se trompe de socle","La tension de bobine (une bobine 24 V sur 230 V grille) et le pouvoir de coupure des contacts (8 A qui en commutent 20 se collent ou brûlent)","Le nombre de broches et le nombre d'inverseurs : le relais ne rentre pas"],g:1,r:'c4',rv:'2.3.1'},
];
const SEUIL = 17, TOTAL = 23, AUTO = TEST.filter(q=>q.type!=='open').reduce((a,q)=>a+q.pts,0);

const FEUVERT = [
  {k:'f1', t:"Reconnaître la bobine, le noyau, l'armature, le ressort et les contacts sur un relais ouvert.", src:'Capsule « Ce qu’il y a dedans »', cap:'c2'},
  {k:'f2', t:"Lire le plan de brochage d'un relais, détrompeur repéré, et dire quelle broche est quoi.", src:'Capsule « Plan de brochage »', cap:'c5'},
  {k:'f3', t:"Câbler un circuit à auto-maintien à partir du schéma, sans modèle.", src:'Exercice Banc de câblage', cap:null},
  {k:'f4', t:"Expliquer, schéma en main, ce qui se passe à chacune des six étapes du fonctionnement.", src:'Simulation auto-maintien (6 étapes)', cap:'c6'},
  {k:'f5', t:"Mesurer une bobine et deux contacts à l'ohmmètre, et conclure.", src:'Capsule « Vérifier un relais »', cap:'c7'},
  {k:'f6', t:"Dire pourquoi le bouton d'arrêt est un contact à ouverture, et ce qui se passe si son fil se casse.", src:'Question rapide 2.3.3', cap:'c6'},
];

/* ---------------- état du chapitre ---------------- */
function P(){ return S.prog; }
function quizOk(id){ const a=P().quiz[id]; return !!(a && a.ok); }
function exOk(cap){
  const p=P();
  if(cap.ex && typeof cap.ex==='object') return cap.ex.keys.every(k=>!!p.ex[k]);   // chapitres décrits par données
  switch(cap.ex){
    case 'parts': return !!p.ex.parts;
    case 'coil':  return !!p.ex.coil;
    case 'pins':  return !!(p.ex.pins1 && p.ex.pins2);
    case 'steps': return [1,2,3,4,5,6].every(n=>p.steps.includes(n));
    case 'ohm':   return ['A','B','C','D'].every(k=>p.ohm[k]==='ok');
    case 'calc':  return !!p.ex.calc;
    default: return true;
  }
}
function capDone(cap){ return cap.quiz.every(quizOk) && exOk(cap); }
function capPart(cap){ return !capDone(cap) && (cap.quiz.some(id=>P().quiz[id]) || P().visited.includes(cap.id)); }
function capsDoneCount(){ return CAPS.filter(capDone).length; }
function feuVert(k){
  const p=P();
  switch(k){
    case 'f1': return capDone(CAPS[1]);
    case 'f2': return capDone(CAPS[4]);
    case 'f3': return !!p.banc;
    case 'f4': return exOk(CAPS[5]);
    case 'f5': return capDone(CAPS[6]);
    case 'f6': return quizOk('c6q1');
  }
}
function testScore(){
  const t=P().test; if(!t.submitted) return null;
  let auto=0; TEST.forEach(q=>{ if(q.type!=='open') auto+=t.pts[q.id]||0; });
  const pending = TEST.filter(q=>q.type==='open' && t.open[q.id]==null).length;
  let open=0; TEST.forEach(q=>{ if(q.type==='open' && t.open[q.id]!=null) open+=t.open[q.id]; });
  return {auto, open, total:auto+open, pending, max:TOTAL};
}

/* ---------------- quiz ---------------- */
function quizHTML(id){
  const q=Q[id], a=P().quiz[id];
  const answered = a && a.sel!=null;
  return `<div class="q" data-q="${id}">
    <div class="qt">${q.q}</div>
    <div class="opts">${melange(id, q.o.length).map((i,pos)=>{ const o=q.o[i];
      let cls='';
      if(answered){ if(i===a.sel) cls = a.ok?'good':'wrong'; }
      return `<button class="opt ${cls}" data-qopt="${id}" data-i="${i}"><span class="l">${'ABCDE'[pos]}</span><span>${o}</span></button>`;}).join('')}
    </div>
    ${answered ? (a.ok
      ? `<div class="fb good"><b>Juste.</b> ${q.e}</div>`
      : `<div class="fb wrong"><b>Pas encore.</b> Relis le passage puis réessaie. ${q.r!==S.view.cap?`<button class="revoir" data-goto="${q.r}">Revoir ${capById(q.r).sec}</button>`:''}</div>`) : ''}
  </div>`;
}
function answerQuiz(id,i){
  const q=Q[id]; const p=P();
  const prev=p.quiz[id];
  const ok = i===q.g;
  p.quiz[id] = {sel:i, ok, first: prev? prev.first : ok, tries:(prev?prev.tries:0)+1};
  if(prev && prev.ok) p.quiz[id].ok=true, p.quiz[id].sel=q.g; // déjà réussi
  save(); renderPlayer(true);
}

/* =================================================
   SVG 1 — Le relais (vue en coupe, repos/travail)
   ================================================= */
const PIV={x:80,y:100}, ARM_L=255, THETA=8.5;
function relaySVG(opts={}){
  const hs = opts.hotspots;
  return `<svg viewBox="0 0 600 300" class="svgtext" role="img" aria-label="Relais électromécanique en coupe">
  <defs>
    <pattern id="wind" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" style="fill:var(--copper)"/><line x1="0" y1="5.5" x2="6" y2="5.5" style="stroke:#7a4319;stroke-width:1.2"/></pattern>
  </defs>
  <rect x="40" y="18" width="360" height="212" rx="6" style="fill:none;stroke:var(--muted);stroke-dasharray:5 5"/>
  <text x="48" y="34" style="font-size:11px;fill:var(--muted);font-style:italic">boîtier, ouvert pour voir dedans</text>

  <!-- ressort -->
  <g id="p-ressort" class="part-hl"><line x1="232" y1="18" x2="252" y2="18" style="stroke:var(--steel);stroke-width:3"/>
    <polyline id="spring" points="" style="fill:none;stroke:var(--meca);stroke-width:2.2"/></g>

  <!-- contacts fixes -->
  <g id="p-contacts" class="part-hl">
    <line x1="318" y1="93.5" x2="372" y2="93.5" style="stroke:var(--steel);stroke-width:5;stroke-linecap:round"/>
    <line x1="318" y1="145" x2="372" y2="145" style="stroke:var(--steel);stroke-width:5;stroke-linecap:round"/>
    <text x="378" y="82" style="font-size:12px;font-weight:700;fill:var(--ink)">NF · 12</text>
    <text x="378" y="164" style="font-size:12px;font-weight:700;fill:var(--ink)">NO · 14</text>
  </g>
  <line x1="372" y1="93.5" x2="440" y2="93.5" id="w12" style="stroke:var(--ink-2);stroke-width:2"/>
  <line x1="372" y1="145" x2="440" y2="145" id="w14" style="stroke:var(--ink-2);stroke-width:2"/>

  <!-- bobine + noyau -->
  <g id="p-bobine" class="part-hl">
    <rect x="132" y="126" width="66" height="78" rx="4" id="coilbody" style="fill:url(#wind);stroke:#7a4319;stroke-width:1.5"/>
  </g>
  <g id="p-noyau" class="part-hl">
    <rect x="153" y="118" width="24" height="92" rx="2" style="fill:var(--iron);stroke:var(--steel)"/>
  </g>
  <g id="field" style="opacity:0">
    <ellipse cx="165" cy="165" rx="60" ry="52" class="field" style="fill:none;stroke:var(--amber);stroke-width:2;stroke-dasharray:6 6"/>
    <ellipse cx="165" cy="165" rx="80" ry="68" class="field" style="fill:none;stroke:var(--amber);stroke-width:1.5;stroke-dasharray:4 8"/>
  </g>
  <line x1="145" y1="204" x2="145" y2="262" id="wA1" style="stroke:var(--ink-2);stroke-width:2"/>
  <line x1="185" y1="204" x2="185" y2="262" id="wA2" style="stroke:var(--ink-2);stroke-width:2"/>

  <!-- armature (pivote autour de PIV) -->
  <g id="p-armature" class="part-hl">
    <g id="arm"><rect x="${PIV.x}" y="${PIV.y-4}" width="${ARM_L}" height="8" rx="3" style="fill:var(--ink-2)"/></g>
    <circle cx="${PIV.x}" cy="${PIV.y}" r="7" style="fill:var(--ink)"/>
  </g>
  <line x1="12" y1="${PIV.y}" x2="${PIV.x}" y2="${PIV.y}" style="stroke:var(--ink-2);stroke-width:2"/>
  <text x="6" y="${PIV.y-10}" style="font-size:12px;font-weight:700;fill:var(--ink)">11 · commun</text>
  <text x="${PIV.x-10}" y="${PIV.y+24}" style="font-size:11px;fill:var(--muted)">pivot</text>

  <!-- socle -->
  <g id="p-socle" class="part-hl">
    <rect x="20" y="236" width="400" height="26" rx="3" style="fill:var(--elec-soft);stroke:var(--elec)"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${40+i*48}" y="262" width="12" height="16" style="fill:var(--elec-ink)"/>`).join('')}
  </g>
  <text x="139" y="230" style="font-size:12px;font-weight:700;fill:var(--ink)">A1</text>
  <text x="179" y="230" style="font-size:12px;font-weight:700;fill:var(--ink)">A2</text>

  ${opts.lamps!==false?`
  <!-- voyants -->
  <g id="lampNF"><circle cx="458" cy="93.5" r="14" style="fill:var(--surface);stroke:var(--ink-2);stroke-width:2"/><text x="478" y="98" style="font-size:12px;fill:var(--muted)">voyant sur NF</text></g>
  <g id="lampNO"><circle cx="458" cy="145" r="14" style="fill:var(--surface);stroke:var(--ink-2);stroke-width:2"/><text x="478" y="150" style="font-size:12px;fill:var(--muted)">voyant sur NO</text></g>
  <text x="440" y="200" style="font-size:11.5px;fill:var(--muted)">circuit des contacts :</text>
  <text x="440" y="215" style="font-size:11.5px;fill:var(--muted)">230 V AC</text>
  <text x="440" y="250" style="font-size:11.5px;fill:var(--muted)">circuit de la bobine :</text>
  <text x="440" y="265" style="font-size:11.5px;fill:var(--muted)">24 V DC</text>`:''}

  ${hs?hs.map(h=>`<g class="hs" data-part="${h.id}" tabindex="0"><line x1="${h.x}" y1="${h.y}" x2="${h.tx}" y2="${h.ty}" style="stroke:var(--bad);stroke-width:1.2"/><circle class="badge" cx="${h.x}" cy="${h.y}" r="11"/><text x="${h.x}" y="${h.y+4.5}" text-anchor="middle">${h.n}</text></g>`).join(''):''}
  </svg>`;
}
let armAngle=0, armAnim=null;
function setArm(svg, angle){
  const arm=svg.querySelector('#arm'); if(!arm) return;
  arm.setAttribute('transform',`rotate(${angle} ${PIV.x} ${PIV.y})`);
  const sx=242, rad=angle*Math.PI/180;
  const ay = PIV.y + (sx-PIV.x)*Math.tan(rad) - 4;
  const top=18, n=9, pts=[[sx,top]];
  for(let i=1;i<n;i++){ const y=top+(ay-top)*i/n; pts.push([sx+(i%2?7:-7),y]); }
  pts.push([sx,ay]);
  svg.querySelector('#spring').setAttribute('points',pts.map(p=>p.join(',')).join(' '));
}
function animateArm(svg, target){
  cancelAnimationFrame(armAnim);
  const start=armAngle, t0=performance.now(), dur=160;
  const step=(t)=>{ const k=Math.min(1,(t-t0)/dur); const e=k<1? 1-Math.pow(1-k,3):1;
    armAngle=start+(target-start)*e; setArm(svg,armAngle); if(k<1) armAnim=requestAnimationFrame(step); };
  armAnim=requestAnimationFrame(step);
}
function relayState(svg, on){
  animateArm(svg, on?THETA:0);
  svg.querySelector('#field').style.opacity = on?1:0;
  svg.querySelector('#coilbody').style.filter = on?'drop-shadow(0 0 8px var(--amber))':'none';
  const L=(id,lit)=>{ const c=svg.querySelector(id+' circle'); if(c){ c.style.fill=lit?'var(--amber)':'var(--surface)'; c.style.filter=lit?'drop-shadow(0 0 8px var(--amber))':'none'; } };
  L('#lampNF',!on); L('#lampNO',on);
  ['#w12','#w14'].forEach((id,i)=>{ const w=svg.querySelector(id); if(w){ const live = i===0? !on : on; w.style.stroke = live?'var(--live)':'var(--ink-2)'; w.style.strokeWidth = live?3:2; }});
  ['#wA1','#wA2'].forEach(id=>{ const w=svg.querySelector(id); w.style.stroke = on?'var(--amber)':'var(--ink-2)'; w.style.strokeWidth=on?3:2; });
}

/* =================================================
   SVG 2 — Le circuit à auto-maintien (simulation)
   ================================================= */
const SIM = { power:true, s0:false, s1:false, s2:false, broken:false, err:false, ka:false, last:1, wasOn:false, restored:false };
function simReset(){ Object.assign(SIM,{power:true,s0:false,s1:false,s2:false,broken:false,err:false,ka:false,last:1,wasOn:false,restored:false,errOn:false,s2lock:false}); }
function simCompute(){
  const s0c=!SIM.s0, s1c=!SIM.s1 && !SIM.broken, s2c=SIM.s2 || (SIM.err && SIM.s2lock);
  let ka=SIM.ka, n2,n3,n4;
  for(let i=0;i<4;i++){
    n2 = SIM.power && s0c;
    n3 = n2 && (s1c || (SIM.err && ka));
    n4 = n3 && (s2c || (!SIM.err && ka));
    ka = n4;
  }
  SIM.ka=ka;
  return {n2,n3,n4,coil:n4,s0c,s1c,s2c};
}
function contactSVG(x,y1,y2,closed,label,sub,kind){
  // kind: 'nf' | 'no' | 'au' | 'ka'
  const top=y1+6, bot=y2-6;
  const tipX = closed? x+5 : x+22, tipY = closed? top : top+12;
  let act='';
  if(kind!=='ka'){
    const my=(top+bot)/2, mx=(x+tipX)/2-2;
    const hx = x-46;
    act = `<line x1="${hx+8}" y1="${my}" x2="${mx}" y2="${my}" style="stroke:var(--muted);stroke-dasharray:3 3"/>`;
    act += kind==='au'
      ? `<path d="M${hx-4} ${my-12} A12 12 0 0 1 ${hx-4} ${my+12} Z" style="fill:var(--bad)"/><line x1="${hx-4}" y1="${my}" x2="${hx+8}" y2="${my}" style="stroke:var(--ink-2);stroke-width:3"/>`
      : `<line x1="${hx}" y1="${my-10}" x2="${hx}" y2="${my+10}" style="stroke:var(--ink-2);stroke-width:3"/><line x1="${hx}" y1="${my}" x2="${hx+8}" y2="${my}" style="stroke:var(--ink-2);stroke-width:2"/>`;
  } else {
    act = `<text x="${x+30}" y="${(top+bot)/2+4}" style="font-size:11px;fill:var(--muted)">13-14</text>`;
  }
  return `<g>
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${top}" style="stroke:var(--ink-2);stroke-width:2"/>
    <line x1="${x}" y1="${bot}" x2="${x}" y2="${y2}" style="stroke:var(--ink-2);stroke-width:2"/>
    <circle cx="${x}" cy="${top}" r="2.5" style="fill:var(--ink)"/><circle cx="${x}" cy="${bot}" r="2.5" style="fill:var(--ink)"/>
    ${kind==='nf'||kind==='au'?`<line x1="${x}" y1="${top}" x2="${x+9}" y2="${top}" style="stroke:var(--ink-2);stroke-width:2"/>`:''}
    <line x1="${x}" y1="${bot}" x2="${tipX}" y2="${tipY}" style="stroke:${closed?'var(--ink)':'var(--ink-2)'};stroke-width:3;stroke-linecap:round"/>
    ${act}
    ${label?`<text x="${kind==='ka'?x+30:x-60}" y="${kind==='ka'?(top+bot)/2-10:y1+14}" ${kind==='ka'?'':'text-anchor="end"'} style="font-size:13px;font-weight:750;fill:var(--ink)">${label}</text>
    <text x="${kind==='ka'?x+30:x-60}" y="${kind==='ka'?(top+bot)/2+18:y1+29}" ${kind==='ka'?'':'text-anchor="end"'} style="font-size:11px;fill:var(--muted)">${sub}</text>`:''}
  </g>`;
}
function simSVG(st){
  const X=230, KX=340;
  const live=(b)=> b?'stroke:var(--live);stroke-width:3.2':'stroke:var(--ink-2);stroke-width:2';
  const cur = st.coil;
  const flow = (d)=> cur?`<path d="${d}" class="flow" style="fill:none;stroke:var(--amber);stroke-width:3.5"/>`:'';
  const err=SIM.err;
  // segments
  let s=`<svg viewBox="0 0 560 470" class="svgtext" role="img" aria-label="Circuit de commande à auto-maintien">`;
  s+=`<line x1="40" y1="30" x2="520" y2="30" style="${live(SIM.power)}"/><text x="40" y="22" style="font-size:12px;font-weight:700;fill:var(--ink)">L — phase du circuit de commande</text>`;
  s+=`<line x1="40" y1="445" x2="520" y2="445" style="stroke:var(--elec);stroke-width:3"/><text x="40" y="463" style="font-size:12px;font-weight:700;fill:var(--elec)">N — neutre</text>`;
  s+=`<circle cx="${X}" cy="30" r="4" style="fill:var(--ink)"/>`;
  // wires
  s+=`<line x1="${X}" y1="30" x2="${X}" y2="70" style="${live(SIM.power)}"/>`;
  s+=`<line x1="${X}" y1="120" x2="${X}" y2="160" style="${live(st.n2)}"/>`;
  s+=`<line x1="${X}" y1="210" x2="${X}" y2="250" style="${live(st.n3)}"/>`;
  s+=`<line x1="${X}" y1="310" x2="${X}" y2="350" style="${live(st.n4)}"/>`;
  s+=`<line x1="${X}" y1="398" x2="${X}" y2="445" style="stroke:var(--elec);stroke-width:2"/>`;
  // contacts
  s+=contactSVG(X,70,120,st.s0c,'S0','arrêt d’urgence · NF','au');
  s+=contactSVG(X,160,210,st.s1c,'S1','arrêt · NF','nf');
  s+=contactSVG(X,250,310,st.s2c,'S2','marche · NO','no');
  if(SIM.broken){ s+=`<g><line x1="${X-10}" y1="${150}" x2="${X+10}" y2="${170}" style="stroke:var(--bad);stroke-width:3"/><line x1="${X+10}" y1="150" x2="${X-10}" y2="170" style="stroke:var(--bad);stroke-width:3"/><text x="${X+16}" y="${150}" style="font-size:11px;font-weight:700;fill:var(--bad)">fil coupé</text></g>`; }
  // KA1 parallel
  const ky1 = err?160:250, ky2 = err?210:310;
  const nTop = err?st.n2:st.n3, nBot = err?st.n3:st.n4;
  s+=`<circle cx="${X}" cy="${ky1}" r="4" style="fill:var(--ink)"/><circle cx="${X}" cy="${ky2}" r="4" style="fill:var(--ink)"/>`;
  s+=`<line x1="${X}" y1="${ky1}" x2="${KX}" y2="${ky1}" style="${live(nTop)}"/>`;
  s+=`<line x1="${KX}" y1="${ky2}" x2="${X}" y2="${ky2}" style="${live(nBot)}"/>`;
  s+=contactSVG(KX,ky1,ky2,SIM.ka,'KA1',err?'auto-maintien — MAL CÂBLÉ':'auto-maintien · NO','ka');
  // coil
  s+=`<rect x="${X-22}" y="350" width="44" height="48" rx="3" style="fill:${cur?'var(--amber-soft)':'var(--surface)'};stroke:${cur?'var(--amber)':'var(--ink-2)'};stroke-width:2.5;${cur?'filter:drop-shadow(0 0 8px var(--amber))':''}"/>`;
  s+=`<text x="${X}" y="379" text-anchor="middle" style="font-size:13px;font-weight:800;fill:var(--ink)">KA1</text>`;
  s+=`<text x="${X+30}" y="362" style="font-size:11px;fill:var(--muted)">A1</text><text x="${X+30}" y="396" style="font-size:11px;fill:var(--muted)">A2</text>`;
  s+=`<text x="${X+60}" y="380" style="font-size:12px;font-weight:700;fill:${cur?'var(--warn)':'var(--muted)'}">${cur?'bobine alimentée — relais collé':'bobine au repos'}</text>`;
  // wire numbers
  const tag=(x,y,n)=>`<g><rect x="${x}" y="${y-9}" width="18" height="16" rx="3" style="fill:var(--surface);stroke:var(--line)"/><text x="${x+9}" y="${y+3}" text-anchor="middle" style="font-size:11px;font-weight:800;fill:var(--ink-2)">${n}</text></g>`;
  s+=tag(X+8,52,1)+tag(X+8,142,2)+tag(X+8,232,3)+tag(X+8,332,4)+tag(X+8,424,5);
  s+= err? tag(KX-60,152,2)+tag(KX-60,203,3) : tag(KX-60,242,3)+tag(KX-60,303,4);
  // current flow overlay
  if(cur){
    let d=`M${X} 30 V120 M${X} 120 V160`;
    if(st.s1c) d+=` M${X} 160 V210`;
    d+=` M${X} 210 V250`;
    if(st.s2c) d+=` M${X} 250 V310`;
    if(SIM.ka && !err) d+=` M${X} 250 H${KX} V310 H${X}`;
    if(SIM.ka && err) d+=` M${X} 160 H${KX} V210 H${X}`;
    d+=` M${X} 310 V350 M${X} 398 V445`;
    s+=flow(d);
  }
  s+=`</svg>`;
  return s;
}
const STEPS = {
  1:['Au repos','S1 (arrêt, NF) est fermé. S2 (marche, NO) est ouvert. Le contact KA1 est ouvert. La bobine n’est pas alimentée.'],
  2:['On appuie sur S2','Le courant part de la phase, traverse S0, traverse S1, traverse S2, atteint la bobine et rejoint le neutre. Le relais colle.'],
  3:['Le relais a collé','Son contact KA1 (NO) se ferme. Il relie les deux mêmes bornes que S2, exactement comme le fait le bouton de marche.'],
  4:['On relâche S2','S2 se rouvre, mais le courant passe maintenant par KA1. La bobine reste alimentée : le relais se maintient lui-même.'],
  5:['On appuie sur S1','Le circuit est coupé en amont des deux chemins. La bobine n’est plus alimentée, le relais retombe, KA1 s’ouvre.'],
  6:['On relâche S1','S1 se referme, mais KA1 et S2 sont tous deux ouverts : rien ne repart. Il faut réappuyer sur marche.'],
};
function simUpdate(){
  const host=document.getElementById('simhost'); if(!host) return;
  const st=simCompute();
  let step=null, msg=null;
  const special = SIM.err || SIM.broken || !SIM.power || SIM.s0 || SIM.restored;
  if(!SIM.power){ msg=`<b>Réseau coupé.</b> La bobine n'est plus alimentée : le relais retombe et son contact d'auto-maintien s'ouvre. Remets le réseau et observe.`; }
  else if(SIM.restored){ msg=`<b>Le courant est revenu… et rien ne repart.</b> Le circuit attend un nouvel appui sur marche : c'est la <b>protection contre le redémarrage intempestif</b>. Un simple interrupteur resté sur « marche » aurait relancé la machine — peut-être sur quelqu'un qui a les mains dedans.`; }
  else if(SIM.s0){ msg=`<b>Arrêt d'urgence enfoncé.</b> S0 coupe tout en tête de branche : rien ne peut le contourner. Le déverrouiller rétablit seulement la possibilité de démarrer.`; }
  else if(SIM.broken && SIM.s2){ msg=`<b>Tu appuies sur marche… et rien.</b> Le fil de S1 est coupé : le circuit est ouvert, la machine ne peut pas démarrer. Le défaut se signale de lui-même — c'est la <b>sécurité positive</b>. Un arrêt câblé en NO, lui, serait devenu inopérant sans que personne ne s'en aperçoive.`; }
  else if(SIM.broken){ msg=`<b>Panne : le fil de S1 est coupé.</b> Essaie de démarrer la machine avec S2.`; }
  else if(SIM.err && st.coil && SIM.s1){ msg=`<b>Marche enfoncée, tu appuies sur ARRÊT… le relais reste collé !</b> Le courant contourne S1 en passant par KA1 : l'arrêt n'agit plus. Relâche S1 et débloque S2.`; }
  else if(SIM.err && st.coil){ SIM.errOn=true; msg=`<b>Le relais colle et KA1 se ferme…</b> mais KA1 est raccordé sur les bornes de S1. Bloque S2 enfoncé (bouton « Bloquer S2 »), puis appuie sur S1. Débloque ensuite S2.`; }
  else if(SIM.err && SIM.errOn){ msg=`<b>Tu as lâché S2 : le relais retombe !</b> KA1 relie les bornes de S1, pas celles de S2 : plus rien ne remplace le bouton de marche. Il n'y a plus d'auto-maintien — et tant qu'on tenait marche, l'arrêt était court-circuité. Deux défauts pour un seul fil mal placé.`; }
  else if(SIM.err){ msg=`<b>Erreur de câblage activée.</b> KA1 est raccordé sur les bornes de S1 au lieu de S2. Démarre la machine avec S2 et observe.`; }
  if(!special && !msg){
    if(SIM.s2 && st.coil){ step=3; markStep(2); }
    else if(st.coil){ step=4; }
    else if(SIM.s1){
      if([3,4,5].includes(SIM.last)) step=5;
      else msg = SIM.s2 ? `<b>S1 est enfoncé :</b> le circuit est coupé en amont, appuyer sur marche ne sert à rien.` : `<b>Arrêt enfoncé, mais rien ne tournait.</b> Démarre d'abord avec S2.`;
    }
    else step = [5,6].includes(SIM.last) ? 6 : 1;
  }
  if(step){ SIM.last=step; markStep(step); }
  host.querySelector('.sim-svg').innerHTML = simSVG(st);
  const n=host.querySelector('.narr');
  if(step){ n.innerHTML = `<b>Étape ${step} — ${STEPS[step][0]}.</b> ${STEPS[step][1]}`+(step===2||step===3?` <span class="muted">(étapes 2 et 3 : le relais colle et KA1 se ferme)</span>`:''); }
  else n.innerHTML = msg||'';
  host.querySelectorAll('.steps6 div').forEach(d=>{ const k=+d.dataset.s; d.className = (k===step?'now ':'') + (P().steps.includes(k)?'seen':''); });
  host.querySelectorAll('[data-sim]').forEach(b=>{ const k=b.dataset.sim; if(['power','broken','err','s0','s2lock'].includes(k)) b.classList.toggle('on', !!SIM[k]); if(k==='s2lock') b.style.display=SIM.err?'':'none'; });
}
function markStep(n){ const p=P(); if(!p.steps.includes(n)){ p.steps.push(n); save(); updateTocChecks(); } }

/* =================================================
   SVG 3 — Socle 8 broches (brochage)
   ================================================= */
const PINS_TOP = [['A1','11','12','14'],['A2','21','22','24']];
function pinsLayout(view){ return view==='dessus' ? PINS_TOP : PINS_TOP.map(r=>[...r].reverse()); }
function socleSVG(view, opts={}){
  const L=pinsLayout(view), hide=opts.hide, marks=opts.marks||{};
  const dx = view==='dessus'? 0 : 1;
  let s=`<svg viewBox="0 0 300 220" class="svgtext">`;
  s+=`<text x="150" y="18" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--muted);letter-spacing:.05em">${view==='dessus'?'VUE DE DESSUS · côté vis':'VUE DE DESSOUS · côté broches'}</text>`;
  s+=`<path d="M40 34 H260 V${dx?186:206} ${dx?'L240 206':''} H${dx?40:60} ${dx?'':'L40 186'} Z" style="fill:var(--surface);stroke:var(--ink-2);stroke-width:2"/>`;
  s+= dx? `<line x1="260" y1="186" x2="240" y2="206" style="stroke:var(--bad);stroke-width:4"/>` : `<line x1="40" y1="186" x2="60" y2="206" style="stroke:var(--bad);stroke-width:4"/>`;
  s+=`<text x="${dx?236:64}" y="200" ${dx?'text-anchor="end"':''} style="font-size:11px;font-weight:700;fill:var(--bad)">détrompeur</text>`;
  L.forEach((row,r)=>row.forEach((lab,c)=>{
    const x=75+c*50, y=r?140:80; const m=marks[lab]||'';
    s+=`<g class="pin ${m}" data-pin="${lab}" tabindex="0"><circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+4}" text-anchor="middle">${hide && !m ?'':lab}</text></g>`;
  }));
  return s+`</svg>`;
}
function flankSVG(){
  return `<svg viewBox="0 0 250 220" class="svgtext">
  <text x="125" y="18" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--muted);letter-spacing:.05em">IMPRIMÉ SUR LE FLANC</text>
  <rect x="22" y="80" width="46" height="34" style="fill:none;stroke:var(--ink);stroke-width:2"/>
  <line x1="45" y1="50" x2="45" y2="80" style="stroke:var(--ink);stroke-width:2"/><line x1="45" y1="114" x2="45" y2="150" style="stroke:var(--ink);stroke-width:2"/>
  <text x="52" y="58" style="font-size:12px;font-weight:700;fill:var(--ink)">A1</text><text x="52" y="148" style="font-size:12px;font-weight:700;fill:var(--ink)">A2</text>
  <text x="45" y="170" text-anchor="middle" style="font-size:11px;fill:var(--elec);font-weight:700">bobine</text>
  <line x1="68" y1="97" x2="200" y2="97" style="stroke:var(--muted);stroke-dasharray:4 4"/>
  ${[[115,'11','12','14'],[185,'21','22','24']].map(([x,a,b,c])=>`
    <text x="${x}" y="44" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--bad)">${a}</text>
    <line x1="${x}" y1="50" x2="${x}" y2="80" style="stroke:var(--ink);stroke-width:2"/><circle cx="${x}" cy="80" r="3" style="fill:var(--ink)"/>
    <line x1="${x}" y1="80" x2="${x+14}" y2="118" style="stroke:var(--ink);stroke-width:2.5"/>
    <line x1="${x-14}" y1="122" x2="${x-14}" y2="150" style="stroke:var(--ink);stroke-width:2"/><line x1="${x-14}" y1="122" x2="${x-4}" y2="122" style="stroke:var(--ink);stroke-width:2"/>
    <line x1="${x+18}" y1="122" x2="${x+18}" y2="150" style="stroke:var(--ink);stroke-width:2"/>
    <text x="${x-14}" y="166" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--bad)">${b}</text>
    <text x="${x+18}" y="166" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--bad)">${c}</text>`).join('')}
  <text x="125" y="196" text-anchor="middle" style="font-size:11px;fill:var(--muted)">1 = commun · 2 = ouverture · 4 = fermeture</text>
  </svg>`;
}
const PIN_TASKS = [
  {q:"Clique sur les <b>deux broches de la bobine</b>.", ans:['A1','A2'], multi:true},
  {q:"Clique sur le <b>commun</b> du premier inverseur.", ans:['11']},
  {q:"Clique sur sa sortie <b>à ouverture (NF)</b>.", ans:['12']},
  {q:"Clique sur sa sortie <b>à fermeture (NO)</b>.", ans:['14']},
  {q:"Clique sur la sortie <b>à fermeture du second inverseur</b>.", ans:['24']},
];
const PIN_TASKS2 = [
  {q:"Le socle est vu <b>de dessous</b>, sans les numéros. Le plan, lui, est vu de dessus. Clique là où se trouve <b>A1</b>.", ans:['A1']},
  {q:"Toujours vu de dessous : clique sur la broche <b>14</b>.", ans:['14']},
];
const PINST = { view:'dessus', i:0, found:[], marks:{}, msg:null, i2:0, marks2:{}, msg2:null };

/* =================================================
   Ohmmètre
   ================================================= */
const RELAYS = {
  A:{nom:'Relais A', diag:'colle', r:{a:'465 Ω', nf:'OL', no:'0,1 Ω'}, w:{a:'465 Ω',nf:'OL',no:'0,1 Ω'}, test:"Déclic… mais aucun changement : le commun reste sur le NO."},
  B:{nom:'Relais B', diag:'sain',  r:{a:'470 Ω', nf:'0,2 Ω', no:'OL'}, w:{nf:'OL',no:'0,2 Ω'}, test:"Déclic sec, l'indicateur mécanique change de position."},
  C:{nom:'Relais C', diag:'cc',    r:{a:'3,2 Ω', nf:'0,2 Ω', no:'OL'}, w:{nf:'0,2 Ω',no:'OL'}, test:"Le relais chauffe et ne colle pas franchement."},
  D:{nom:'Relais D', diag:'coupee',r:{a:'OL', nf:'0,2 Ω', no:'OL'}, w:{nf:'0,2 Ω',no:'OL'}, test:"Rien : aucun déclic, l'indicateur ne bouge pas."},
};
const DIAGS = [['sain','Relais en bon état'],['coupee','Bobine coupée — à remplacer'],['cc','Spires en court-circuit — à remplacer'],['colle','Contact collé — à remplacer'],['use','Contact NF usé, oxydé ou cassé']];
const OHM = { safe:false, sel:'B', pair:null, test:false, pick:{} };
function ohmRead(){
  const R=RELAYS[OHM.sel];
  if(!OHM.pair) return '- - - -';
  if(OHM.test){ if(OHM.pair==='a') return 'BOB.'; return R.w[OHM.pair]; }
  return R.r[OHM.pair];
}

/* ---------------- rendu des capsules ---------------- */
function capBody(id){
  const dc=capById(id); if(dc && dc.body) return dc.body();
  switch(id){
  case 'c1': return `
    <p class="lead">Jusqu'ici, pour allumer une lampe, on fermait un interrupteur à la main. En industrie, trois besoins apparaissent.</p>
    <div class="need">
      <div><b>Commander un gros courant avec un petit</b>Le bouton de l'opérateur ne peut pas supporter les 15 A d'un moteur.</div>
      <div><b>Éloigner l'opérateur du danger</b>Le bouton est en 24 V pendant que le circuit commandé est en 400 V.</div>
      <div><b>Faire plusieurs choses à la fois</b>Un seul ordre ouvre un circuit, en ferme un autre et allume un voyant.</div>
    </div>
    <div class="figure" id="c1fig">${introSVG(false)}<div class="ctrls"><button class="pbtn" data-c1press><span class="cap-ic" style="background:var(--ok)"></span>Maintiens le bouton 24 V</button><span class="small muted">Le relais transmet l'ordre au moteur 400 V.</span></div></div>
    <div class="note"><b>Le relais répond aux trois.</b>C'est un interrupteur que l'on ferme à distance, électriquement, au lieu de le fermer à la main.</div>`;
  case 'c2': return `
    <p class="lead">Six pièces, et une seule qui bouge : l'armature. Clique sur les numéros pour découvrir chaque pièce.</p>
    <div class="figure">${relaySVG({lamps:false,hotspots:[
      {id:'bobine',n:1,x:104,y:186,tx:132,ty:180},{id:'noyau',n:2,x:208,y:212,tx:174,ty:200},{id:'armature',n:3,x:200,y:66,tx:200,ty:98},
      {id:'ressort',n:4,x:280,y:44,tx:250,ty:50},{id:'contacts',n:5,x:340,y:118,tx:340,ty:94},{id:'socle',n:6,x:300,y:250,tx:300,ty:250}]})}
      <div id="partinfo" class="narr">Clique sur un numéro.</div></div>
    <div class="card pad" style="background:var(--surface-2)" id="partgame"></div>`;
  case 'c3': return `
    <p class="lead">Alimente la bobine et observe : le noyau devient un aimant, attire l'armature, et tous les contacts basculent en même temps.</p>
    <div class="figure" id="c3fig">${relaySVG({})}
      <div class="ctrls"><button class="toggle" data-coil><span class="sw"></span>Alimenter A1-A2 (24 V DC)</button><span class="small muted" id="c3state">Relais au repos : NF fermé, NO ouvert.</span></div>
      <div class="figcap">Le pivot de l'armature est aussi le commun du contact : le courant entre par là et ressort soit par le NF, soit par le NO — jamais par les deux.</div></div>
    <div class="scroll-x"><table class="t"><tr><th>Terme</th><th>Signification</th></tr>
      <tr><td><b>Au repos</b></td><td>Bobine non alimentée. C'est l'état du relais dans le tiroir.</td></tr>
      <tr><td><b>Au travail — ou excité</b></td><td>Bobine alimentée, armature attirée.</td></tr>
      <tr><td><b>Contact NO</b></td><td>Normalement ouvert, ou contact à fermeture. Ouvert au repos, il se ferme quand le relais colle.</td></tr>
      <tr><td><b>Contact NF</b></td><td>Normalement fermé, ou contact à ouverture. Fermé au repos, il s'ouvre quand le relais colle.</td></tr>
      <tr><td><b>Contact inverseur</b></td><td>Trois bornes : un commun, un NO et un NF. Le commun bascule de l'un à l'autre.</td></tr></table></div>
    <div class="note warn" style="margin-top:14px"><b>Le mot « normalement »</b>Il ne veut pas dire « habituellement » ni « quand la machine tourne ». Il veut dire : bobine non alimentée. C'est l'état de référence, celui dans lequel tous les schémas sont dessinés.</div>`;
  case 'c4': return `
    <p class="lead">Les contacts d'un relais n'ont pas de tension propre : ce sont des <b>contacts secs</b>. Le circuit de la bobine et celui des contacts sont totalement séparés — c'est l'<b>isolation galvanique</b>, une sécurité.</p>
    <div class="grid g2">
      <div class="card pad"><div class="kicker">Tension de bobine</div><p>La tension à appliquer sur A1-A2 pour que le relais fonctionne. Elle est inscrite sur le relais.</p></div>
      <div class="card pad"><div class="kicker">Pouvoir de coupure des contacts</div><p>Le courant et la tension que les contacts peuvent commuter, par exemple 8 A sous 250 V AC.</p></div>
    </div>
    <div class="figure" style="margin-top:16px">
      <div class="row wrap between"><b>Banc d'essai — relais « bobine 24 V DC · contacts 8 A / 250 V AC »</b><span class="chip amber">simulation</span></div>
      <div class="grid g2" style="margin-top:12px">
        <div><div class="kicker" style="margin-bottom:6px">1. Alimenter la bobine avec…</div><div class="samples" id="c4sup">${[['12','12 V DC'],['24','24 V DC'],['230','230 V AC']].map(([k,l])=>`<button data-sup="${k}">${l}</button>`).join('')}</div></div>
        <div><div class="kicker" style="margin-bottom:6px">2. Commuter avec les contacts…</div><div class="samples" id="c4load">${[['v','Voyant 0,1 A'],['r','Résistance 1 kW (4,3 A)'],['m','Moteur 15 A']].map(([k,l])=>`<button data-load="${k}">${l}</button>`).join('')}</div></div>
      </div>
      <div class="narr" id="c4res">Choisis une alimentation et une charge.</div>
    </div>
    <div class="scroll-x"><table class="t"><tr><th></th><th>Relais</th><th>Contacteur</th></tr>
      <tr><td><b>Commande</b></td><td>De petits courants : signaux, voyants, entrées d'automate</td><td>Des courants de puissance : moteurs, résistances</td></tr>
      <tr><td><b>Contacts</b></td><td>Fins, sans dispositif particulier</td><td>Massifs, avec chambre de coupure pour éteindre l'arc</td></tr>
      <tr><td><b>Où ?</b></td><td>Circuit de commande</td><td>Circuit de puissance</td></tr></table></div>
    <p class="small muted" style="margin-top:8px">Même principe : bobine, noyau, armature, ressort, contacts. Tout ce que tu apprends ici servira au contacteur (chapitre 2.4).</p>`;
  case 'c5': return `
    <p class="lead">Le relais s'enfiche dans un socle câblé une fois pour toutes. Il faut savoir quelle broche est la bobine et lesquelles sont les contacts.</p>
    <div class="note bad"><b>Règle absolue</b>On ne raccorde jamais un relais de mémoire. On lit toujours le schéma imprimé sur le relais que l'on a en main.</div>
    <div class="figure"><div class="grid g2" style="align-items:center">
      <div>${flankSVG()}</div>
      <div id="socle1">${socleSVG(PINST.view,{marks:PINST.marks})}</div></div>
      <div class="ctrls"><button class="btn sm" data-view>Retourner le socle (vue ${PINST.view==='dessus'?'de dessous':'de dessus'})</button><span class="small muted">Les deux vues sont en miroir : seul le détrompeur donne l'orientation.</span></div>
      <div class="narr" id="pintask"></div></div>
    <h3 style="margin-top:18px">Le piège de la vue</h3>
    <p>Le plan est parfois donné vu de dessous, parfois vu de dessus. Lu dans le mauvais sens, la gauche et la droite sont inversées — et le câblage est faux.</p>
    <div class="figure"><div class="grid g2" style="align-items:center">
      <div><div class="small muted" style="text-align:center;margin-bottom:4px">Le plan fourni</div>${socleSVG('dessus')}</div>
      <div id="socle2">${socleSVG('dessous',{hide:true,marks:PINST.marks2})}</div></div>
      <div class="narr" id="pintask2"></div></div>
    <h3 style="margin-top:18px">Méthode pour lire un brochage</h3>
    <ol class="small"><li>Repérer le détrompeur ; plan vu de dessus ou de dessous ?</li><li>Localiser les deux broches de la bobine.</li><li>Repérer les broches communes des contacts.</li><li>Pour chaque commun, identifier son NF et son NO.</li><li>Reporter ces numéros sur le schéma, au crayon, avant de câbler.</li><li>Vérifier une dernière fois le relais en main avant de l'enficher.</li></ol>`;
  case 'c6': return `
    <p class="lead">Un bouton-poussoir ne reste pas enfoncé. Pour que la machine continue à tourner quand on le lâche, on place un contact NO du relais lui-même <b>en parallèle avec le bouton de marche</b>.</p>
    <div class="figure" id="simhost">
      <div class="sim-svg"></div>
      <div class="ctrls">
        <button class="pbtn" data-hold="s2"><span class="cap-ic" style="background:var(--ok)"></span>S2 Marche</button>
        <button class="pbtn" data-hold="s1"><span class="cap-ic" style="background:#2a2f37"></span>S1 Arrêt</button>
        <button class="toggle" data-sim="s0"><span class="sw"></span>S0 Arrêt d'urgence</button>
        <button class="toggle" data-sim="s2lock" style="display:none"><span class="sw"></span>Bloquer S2 enfoncé</button>
      </div>
      <div class="ctrls">
        <span class="small muted" style="font-weight:700">Situations :</span>
        <button class="toggle on" data-sim="power"><span class="sw"></span>Réseau présent</button>
        <button class="toggle" data-sim="broken"><span class="sw"></span>Fil de S1 cassé</button>
        <button class="toggle" data-sim="err"><span class="sw"></span>Erreur : KA1 sur S1</button>
        <button class="btn sm ghost" data-simreset>↺ Remettre à zéro</button>
      </div>
      <div class="narr"></div>
      <div class="steps6">${[1,2,3,4,5,6].map(n=>`<div data-s="${n}"><b>${n}</b>${STEPS[n][0]}</div>`).join('')}</div>
      <div class="figcap">Maintiens les boutons enfoncés (souris ou doigt). En rouge : les fils sous tension. En orange animé : le chemin du courant. Parcours les six étapes pour valider la capsule.</div>
    </div>
    <div class="note"><b>Pourquoi le bouton d'arrêt est-il un NF ?</b>Au repos il laisse passer le courant ; c'est l'action de l'opérateur qui l'ouvre. Si son fil se casse, le circuit s'ouvre et la machine s'arrête : le défaut se signale de lui-même. C'est la <b>sécurité positive</b>. Essaie la situation « Fil de S1 cassé ».</div>`;
  case 'c7': return `
    <p class="lead">On reçoit quatre relais de l'atelier. Mesure-les à l'ohmmètre et pose ton diagnostic pour chacun.</p>
    <label class="chk card pad" style="margin-bottom:12px"><input type="checkbox" data-safe ${OHM.safe?'checked':''}><span><b>Avant toute mesure :</b> le relais est retiré de son socle et l'installation est hors tension.<br><span class="small muted">Une mesure de continuité ne se fait jamais sur des contacts encore raccordés à un circuit sous tension.</span></span></label>
    <div class="samples" style="margin-bottom:12px">${Object.entries(RELAYS).map(([k,r])=>`<button data-rel="${k}" class="${OHM.sel===k?'on':''}">${r.nom}<span class="st">${P().ohm[k]==='ok'?'✓ diagnostiqué':P().ohm[k]==='ko'?'✗ à revoir':'à mesurer'}</span></button>`).join('')}</div>
    <div class="ohm">
      <div class="figure" style="margin:0">${ohmRelaySVG()}<div class="narr" id="ohmmsg"></div></div>
      <div class="meter">
        <div class="lcd" id="lcd">${ohmRead()}</div>
        <div class="mode">Ω — ohmmètre</div>
        <div class="pairs">
          <button data-pair="a">A1 – A2 · la bobine</button>
          <button data-pair="nf">11 – 12 · commun / NF</button>
          <button data-pair="no">11 – 14 · commun / NO</button>
        </div>
        <div class="pairs" style="margin-top:12px"><button data-test>⚡ Test de basculement (24 V DC)</button></div>
      </div>
    </div>
    <div class="card pad" style="margin-top:14px"><div class="row wrap"><b>Diagnostic du ${RELAYS[OHM.sel].nom} :</b>
      <select data-diag><option value="">— choisir —</option>${DIAGS.map(([k,l])=>`<option value="${k}" ${OHM.pick[OHM.sel]===k?'selected':''}>${l}</option>`).join('')}</select>
      <button class="btn sm primary" data-diagok>Valider</button></div><div id="diagfb"></div></div>
    <details style="margin-top:14px"><summary class="small" style="cursor:pointer;font-weight:700">Aide-mémoire : les trois cas à distinguer</summary>
    <div class="scroll-x"><table class="t" style="margin-top:8px"><tr><th>Mesure</th><th>Lecture</th><th>Conclusion</th></tr>
      <tr><td>A1 – A2</td><td>Quelques dizaines à quelques milliers d'ohms (24 V DC : 200 à 700 Ω)</td><td>Bobine saine</td></tr>
      <tr><td>A1 – A2</td><td>OL</td><td>Bobine coupée</td></tr>
      <tr><td>A1 – A2</td><td>Très faible ou nulle</td><td>Spires en court-circuit</td></tr>
      <tr><td>Commun – NF (repos)</td><td>Quelques ohms attendus — sinon</td><td>Contact usé, oxydé ou cassé</td></tr>
      <tr><td>Commun – NO (repos)</td><td>OL attendu — sinon</td><td>Contact collé</td></tr></table></div></details>
    <div class="note warn" style="margin-top:14px"><b>Avant de remplacer, comprendre.</b>Un relais dont les contacts ont été soudés par une surintensité sera de nouveau détruit si l'on ne traite pas la cause.</div>`;
  case 'c8': return `
    <p class="lead">Les exercices du chapitre, avec correction immédiate.</p>
    <div class="card pad"><div class="kicker">Exercice — calcul</div>
      <p><b>Une bobine de relais 24 V continu mesure 480 Ω à l'ohmmètre.</b> Calcule le courant qu'elle absorbe et la puissance qu'elle consomme. La valeur mesurée est-elle normale ?</p>
      <div id="calcbox"></div></div>
    <div class="note" style="margin-top:14px"><b>★ Dessin</b>Le tracé du schéma de commande à auto-maintien se fait au chapitre 4 du Cours de dessin électrique — 4e année, avec le présent chapitre et avant le TP É03.</div>`;
  }
}
function introSVG(on){
  return `<svg viewBox="0 0 560 150" class="svgtext">
  <rect x="10" y="40" width="120" height="70" rx="10" style="fill:var(--surface);stroke:var(--ok);stroke-width:2"/>
  <text x="70" y="68" text-anchor="middle" style="font-size:13px;font-weight:750;fill:var(--ink)">Bouton</text><text x="70" y="88" text-anchor="middle" style="font-size:12px;fill:var(--ok);font-weight:700">24 V</text>
  <line x1="130" y1="75" x2="210" y2="75" style="stroke:${on?'var(--amber)':'var(--ink-2)'};stroke-width:3" ${on?'class="flow"':''}/>
  <rect x="210" y="40" width="130" height="70" rx="10" style="fill:${on?'var(--amber-soft)':'var(--surface)'};stroke:${on?'var(--amber)':'var(--ink-2)'};stroke-width:2"/>
  <text x="275" y="68" text-anchor="middle" style="font-size:13px;font-weight:750;fill:var(--ink)">Relais</text><text x="275" y="88" text-anchor="middle" style="font-size:12px;fill:var(--muted)">${on?'collé — déclic !':'au repos'}</text>
  <line x1="340" y1="75" x2="420" y2="75" style="stroke:${on?'var(--live)':'var(--ink-2)'};stroke-width:${on?4:3}"/>
  <circle cx="470" cy="75" r="42" style="fill:var(--surface);stroke:var(--live);stroke-width:2"/>
  <g style="transform-origin:470px 75px;${on?'animation:spin .5s linear infinite':''}"><path d="M470 75 L470 42 A33 33 0 0 1 498 58 Z M470 75 L499 92 A33 33 0 0 1 470 108 Z M470 75 L441 92 A33 33 0 0 1 441 58 Z" style="fill:var(--steel);opacity:.6"/></g>
  <text x="470" y="140" text-anchor="middle" style="font-size:12px;font-weight:700;fill:var(--live)">Moteur 400 V · 15 A</text>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style></svg>`;
}
function ohmRelaySVG(){
  const pins=[['A1',40],['A2',90],['11',150],['12',200],['14',250]];
  const sel=OHM.pair; const map={a:['A1','A2'],nf:['11','12'],no:['11','14']};
  const act = sel? map[sel]:[];
  let s=`<svg viewBox="0 0 300 200" class="svgtext"><rect x="20" y="20" width="260" height="110" rx="10" style="fill:var(--surface);stroke:var(--ink-2);stroke-width:2"/>
  <text x="150" y="50" text-anchor="middle" style="font-size:14px;font-weight:800;fill:var(--ink)">${RELAYS[OHM.sel].nom}</text>
  <text x="150" y="70" text-anchor="middle" style="font-size:11.5px;fill:var(--muted)">bobine 24 V DC · 1 inverseur 11-12-14</text>
  <circle cx="250" cy="100" r="7" style="fill:${OHM.test?'var(--amber)':'var(--grey-soft)'};stroke:var(--ink-2)"/><text x="236" y="104" text-anchor="end" style="font-size:10.5px;fill:var(--muted)">indicateur</text>`;
  pins.forEach(([l,x])=>{ const on=act.includes(l);
    s+=`<rect x="${x-5}" y="130" width="10" height="22" style="fill:${on?'var(--amber)':'var(--steel)'}"/><text x="${x}" y="168" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--ink)">${l}</text>`; });
  if(sel){ const [a,b]=act.map(l=>pins.find(p=>p[0]===l)[1]);
    s+=`<path d="M${a} 152 C ${a} 190, ${a-10} 196, ${a-20} 198" style="fill:none;stroke:var(--bad);stroke-width:3"/><path d="M${b} 152 C ${b} 190, ${b+10} 196, ${b+20} 198" style="fill:none;stroke:#222;stroke-width:3"/>`; }
  return s+`</svg>`;
}

/* ---------------- montage (interactions) ---------------- */
function mountCap(id){
  const root=document.getElementById('capbody'); if(!root) return;
  const dc=capById(id); if(dc && dc.mount){ dc.mount(root); return; }
  if(id==='c1'){
    const b=root.querySelector('[data-c1press]'), fig=root.querySelector('#c1fig');
    const set=(on)=>{ fig.querySelector('svg').outerHTML=introSVG(on); b.classList.toggle('pressed',on); };
    bindHold(b, ()=>set(true), ()=>set(false));
  }
  if(id==='c2'){
    const svg=root.querySelector('svg'); setArm(svg,0); armAngle=0;
    const INFO={bobine:['La bobine','Un long fil de cuivre isolé, enroulé autour d’un noyau de fer. Ses deux bornes sont repérées A1 et A2.'],
      noyau:['Le noyau de fer','À l’intérieur de la bobine. Il devient un aimant quand un courant parcourt la bobine, et cesse de l’être dès que le courant s’arrête.'],
      armature:['L’armature mobile','Une pièce de fer montée sur un pivot, qui peut être attirée par le noyau. C’est la seule pièce qui bouge.'],
      ressort:['Le ressort de rappel','Il ramène l’armature en position de repos quand la bobine n’est plus alimentée.'],
      contacts:['Les contacts','Les interrupteurs proprement dits, que l’armature ouvre ou ferme en se déplaçant.'],
      socle:['Le socle','La pièce fixe, câblée une fois pour toutes, dans laquelle le relais s’enfiche.']};
    const GAME=['ressort','noyau','armature','bobine'];
    const g=P().ex; if(g.partsI==null) g.partsI=0;
    const hl=(part)=>{ svg.querySelectorAll('.part-hl').forEach(e=>e.style.opacity = !part||e.id==='p-'+part?1:.25); svg.querySelectorAll('.hs').forEach(h=>h.classList.toggle('on',h.dataset.part===part)); };
    const drawGame=()=>{ const box=root.querySelector('#partgame');
      if(g.parts){ box.innerHTML=`<b style="color:var(--ok)">✓ Défi réussi.</b> Tu reconnais les pièces d'un relais ouvert.`; return; }
      const k=GAME[g.partsI]; box.innerHTML=`<div class="kicker">Défi ${g.partsI+1}/${GAME.length}</div><b>Clique sur : ${INFO[k][0].toLowerCase()}</b> <span class="small muted">(sur le numéro)</span><div id="gamefb" class="small" style="margin-top:6px"></div>`; };
    drawGame();
    svg.querySelectorAll('.hs').forEach(h=>{ const f=()=>{ const part=h.dataset.part; hl(part);
      root.querySelector('#partinfo').innerHTML=`<b>${INFO[part][0]}.</b> ${INFO[part][1]}`;
      if(!g.parts){ const want=GAME[g.partsI]; const fb=root.querySelector('#gamefb');
        if(part===want){ g.partsI++; if(g.partsI>=GAME.length){ g.parts=true; } save(); drawGame(); updateTocChecks(); }
        else if(fb) fb.innerHTML=`<span style="color:var(--bad)">Non, ça c'est ${INFO[part][0].toLowerCase()}. Cherche encore.</span>`; } };
      h.addEventListener('click',f); h.addEventListener('keydown',e=>{ if(e.key==='Enter') f(); }); });
  }
  if(id==='c3'){
    const svg=root.querySelector('svg'); armAngle=0; setArm(svg,0); let on=false; relayState(svg,false);
    root.querySelector('[data-coil]').addEventListener('click',e=>{ on=!on; e.currentTarget.classList.toggle('on',on); relayState(svg,on);
      root.querySelector('#c3state').textContent = on? 'Relais au travail : le NF s’est ouvert, le NO s’est fermé. Déclic !' : 'Relais au repos : le ressort a ramené l’armature. NF fermé, NO ouvert.';
      if(!P().ex.coil){ P().ex.coilN=(P().ex.coilN||0)+1; if(P().ex.coilN>=2){ P().ex.coil=true; save(); updateTocChecks(); } } });
  }
  if(id==='c4'){
    let sup=null, load=null; const res=root.querySelector('#c4res');
    const upd=()=>{ root.querySelectorAll('[data-sup]').forEach(b=>b.classList.toggle('on',b.dataset.sup===sup)); root.querySelectorAll('[data-load]').forEach(b=>b.classList.toggle('on',b.dataset.load===load));
      let t='';
      if(sup==='12') t+=`<b style="color:var(--warn)">Le relais vibre et grésille :</b> tension de bobine insuffisante. `;
      if(sup==='230') t+=`<b style="color:var(--bad)">La bobine 24 V grille immédiatement !</b> On vérifie toujours la tension inscrite sur le relais. `;
      if(sup==='24') t+=`<b style="color:var(--ok)">Le relais colle franchement</b> : la bonne tension de bobine. `;
      if(sup==='24' && load){ t+= load==='m'? `Mais <b style="color:var(--bad)">15 A sur des contacts prévus pour 8 A : ils chauffent, se collent ou brûlent.</b> Il faut un contacteur.` : `La charge (${load==='v'?'0,1 A':'4,3 A'}) reste sous le pouvoir de coupure de 8 A : <b style="color:var(--ok)">OK</b>.`; }
      else if(load && sup!=='24') t+=`<span class="muted">Choisis d'abord la bonne alimentation pour que le relais commute.</span>`;
      res.innerHTML = t || 'Choisis une alimentation et une charge.'; };
    root.querySelectorAll('[data-sup]').forEach(b=>b.addEventListener('click',()=>{ sup=b.dataset.sup; upd(); }));
    root.querySelectorAll('[data-load]').forEach(b=>b.addEventListener('click',()=>{ load=b.dataset.load; upd(); }));
  }
  if(id==='c5') mountPins();
  if(id==='c6'){
    simUpdate();
    root.querySelectorAll('[data-hold]').forEach(b=>{ const k=b.dataset.hold;
      bindHold(b, ()=>{ SIM[k]=true; SIM.restored=false; b.classList.add('pressed'); simUpdate(); }, ()=>{ SIM[k]=false; b.classList.remove('pressed'); simUpdate(); }); });
    root.querySelectorAll('[data-sim]').forEach(b=>b.addEventListener('click',()=>{ const k=b.dataset.sim;
      if(k==='power'){
        if(SIM.power){ SIM.wasOn = SIM.ka; SIM.power=false; }
        else { SIM.power=true; SIM.restored = !!SIM.wasOn; SIM.wasOn=false; }
      } else { SIM[k]=!SIM[k]; SIM.restored=false; }
      if(k==='err'||k==='broken'){ SIM.ka=false; SIM.last=1; SIM.errOn=false; SIM.s2lock=false; }
      simUpdate(); }));
    root.querySelector('[data-simreset]').addEventListener('click',()=>{ simReset(); simUpdate(); });
  }
  if(id==='c7') mountOhm();
  if(id==='c8') mountCalc();
}
function bindHold(b,down,up){
  let isDown=false;
  b.addEventListener('pointerdown',e=>{ e.preventDefault(); isDown=true; try{b.setPointerCapture(e.pointerId);}catch(_){ } down(); });
  const rel=()=>{ if(isDown){ isDown=false; up(); } };
  b.addEventListener('pointerup',rel); b.addEventListener('pointercancel',rel); b.addEventListener('lostpointercapture',rel);
  b.addEventListener('keydown',e=>{ if((e.key===' '||e.key==='Enter') && !isDown){ e.preventDefault(); isDown=true; down(); } });
  b.addEventListener('keyup',e=>{ if(e.key===' '||e.key==='Enter'){ rel(); } });
}
function mountPins(){
  const root=document.getElementById('capbody'); const p=P();
  const t1=root.querySelector('#pintask'), t2=root.querySelector('#pintask2');
  const draw1=()=>{
    root.querySelector('#socle1').innerHTML=socleSVG(PINST.view,{marks:PINST.marks});
    if(p.ex.pins1){ t1.innerHTML=`<b style="color:var(--ok)">✓ Brochage lu sans erreur.</b> Remarque : en vue de dessous, les mêmes broches apparaissent dans l'ordre inverse. Essaie le bouton « Retourner ».`; }
    else { const T=PIN_TASKS[PINST.i]; t1.innerHTML=`<span class="kicker">Tâche ${PINST.i+1}/${PIN_TASKS.length}</span><br>${T.q} ${PINST.msg||''}`; }
    root.querySelectorAll('#socle1 .pin').forEach(g=>g.addEventListener('click',()=>{
      if(p.ex.pins1) return; const T=PIN_TASKS[PINST.i], lab=g.dataset.pin;
      if(T.ans.includes(lab)){ PINST.marks[lab]='good'; PINST.found.push(lab); PINST.msg='';
        if(T.ans.every(a=>PINST.found.includes(a))){ PINST.i++; PINST.found=[]; if(PINST.i>=PIN_TASKS.length){ p.ex.pins1=true; save(); updateTocChecks(); } else PINST.msg=`<span style="color:var(--ok)">✓ Bien.</span>`; }
      } else { PINST.marks[lab]='wrong'; PINST.msg=`<br><span style="color:var(--bad)">Non : ${lab} n'est pas ça. Aide-toi du schéma du flanc (1 = commun, 2 = ouverture, 4 = fermeture).</span>`; setTimeout(()=>{ if(PINST.marks[lab]==='wrong'){ delete PINST.marks[lab]; draw1(); } },900); }
      draw1(); }));
  };
  const draw2=()=>{
    root.querySelector('#socle2').innerHTML=socleSVG('dessous',{hide:true,marks:PINST.marks2});
    if(p.ex.pins2){ t2.innerHTML=`<b style="color:var(--ok)">✓ Tu as évité le piège de la vue.</b> En vue de dessous, A1 passe à droite : c'est le détrompeur, et lui seul, qui donne l'orientation.`; }
    else { const T=PIN_TASKS2[PINST.i2]; t2.innerHTML=`<span class="kicker">Tâche ${PINST.i2+1}/${PIN_TASKS2.length}</span><br>${T.q} ${PINST.msg2||''}`; }
    root.querySelectorAll('#socle2 .pin').forEach(g=>g.addEventListener('click',()=>{
      if(p.ex.pins2) return; const T=PIN_TASKS2[PINST.i2], lab=g.dataset.pin;
      if(T.ans.includes(lab)){ PINST.marks2[lab]='good'; PINST.i2++; PINST.msg2=`<span style="color:var(--ok)">✓ Exact.</span>`; if(PINST.i2>=PIN_TASKS2.length){ p.ex.pins2=true; save(); updateTocChecks(); } }
      else { PINST.marks2[lab]='wrong'; PINST.msg2=`<br><span style="color:var(--bad)">Non — c'est la position de ${lab}. Le socle est retourné : repère le détrompeur, la gauche et la droite sont inversées.</span>`; setTimeout(()=>{ if(PINST.marks2[lab]==='wrong'){ delete PINST.marks2[lab]; draw2(); } },1200); }
      draw2(); }));
  };
  draw1(); draw2();
  root.querySelector('[data-view]').addEventListener('click',e=>{ PINST.view = PINST.view==='dessus'?'dessous':'dessus'; e.currentTarget.textContent=`Retourner le socle (vue ${PINST.view==='dessus'?'de dessous':'de dessus'})`; draw1(); });
}
function mountOhm(){
  const root=document.getElementById('capbody');
  const refresh=()=>{
    root.querySelector('#lcd').innerHTML = OHM.safe? ohmRead() : '- - - -';
    root.querySelector('.ohm .figure svg').outerHTML = ohmRelaySVG();
    root.querySelectorAll('[data-pair]').forEach(b=>{ b.classList.toggle('on',b.dataset.pair===OHM.pair); b.disabled=!OHM.safe; });
    root.querySelector('[data-test]').classList.toggle('on',OHM.test); root.querySelector('[data-test]').disabled=!OHM.safe;
    const m=root.querySelector('#ohmmsg');
    if(!OHM.safe) m.innerHTML='Coche d’abord la consigne de sécurité.';
    else if(OHM.test) m.innerHTML=`<b>Bobine alimentée en 24 V DC.</b> ${RELAYS[OHM.sel].test} <span class="muted">On ne mesure pas la bobine pendant ce test.</span>`;
    else if(!OHM.pair) m.innerHTML='Place les pointes de touche : choisis une mesure sur l’ohmmètre.';
    else m.innerHTML = {a:'Mesure de la bobine, entre A1 et A2.',nf:'Mesure entre le commun et le NF, relais au repos.',no:'Mesure entre le commun et le NO, relais au repos.'}[OHM.pair];
  };
  root.querySelector('[data-safe]').addEventListener('change',e=>{ OHM.safe=e.target.checked; refresh(); });
  root.querySelectorAll('[data-rel]').forEach(b=>b.addEventListener('click',()=>{ OHM.sel=b.dataset.rel; OHM.pair=null; OHM.test=false; renderPlayer(true); }));
  root.querySelectorAll('[data-pair]').forEach(b=>b.addEventListener('click',()=>{ if(OHM.test && b.dataset.pair==='a'){ return; } OHM.pair=b.dataset.pair; refresh(); }));
  root.querySelector('[data-test]').addEventListener('click',()=>{ OHM.test=!OHM.test; if(OHM.test && OHM.pair==='a') OHM.pair=null; refresh(); });
  root.querySelector('[data-diag]').addEventListener('change',e=>{ OHM.pick[OHM.sel]=e.target.value; });
  root.querySelector('[data-diagok]').addEventListener('click',()=>{
    const v=OHM.pick[OHM.sel]; const fb=root.querySelector('#diagfb'); if(!v){ fb.innerHTML='<p class="small muted">Choisis un diagnostic.</p>'; return; }
    const R=RELAYS[OHM.sel]; const ok = v===R.diag;
    P().ohm[OHM.sel] = ok?'ok':'ko'; save(); updateTocChecks();
    fb.innerHTML = ok? `<div class="fb good"><b>Bon diagnostic.</b> ${{sain:'Bobine dans la plage d’un 24 V DC, NF à quelques ohms, NO à OL, et le basculement inverse les deux.',coupee:'A1-A2 affiche OL : la bobine est coupée, le relais est à remplacer.',cc:'Quelques ohms seulement sur la bobine : des spires sont en court-circuit.',colle:'Au repos, le NO devrait afficher OL : il est fermé, le contact est collé. Et avant de remplacer, cherche la surintensité qui l’a soudé.'}[R.diag]}</div>`
      : `<div class="fb wrong"><b>Pas encore.</b> Reprends les trois mesures au repos et compare au tableau d'aide-mémoire. Le test de basculement peut aussi t'aider.</div>`;
    root.querySelectorAll('[data-rel]').forEach(b=>{ const k=b.dataset.rel; b.querySelector('.st').textContent = P().ohm[k]==='ok'?'✓ diagnostiqué':P().ohm[k]==='ko'?'✗ à revoir':'à mesurer'; });
  });
  refresh();
}
function mountCalc(){
  const box=document.getElementById('calcbox'); const p=P(); const st=p.calc||(p.calc={});
  const draw=()=>{
    if(p.ex.calc){ box.innerHTML=`<div class="fb good"><b>Correct.</b> I = U ÷ R = 24 ÷ 480 = 0,05 A, soit 50 mA. P = U × I = 24 × 0,05 = 1,2 W. Valeur normale : une bobine 24 V continu mesure de 200 à 700 Ω environ.</div>`; return; }
    box.innerHTML=`<div class="grid g3"><label class="small"><b>Courant I</b><br><input type="text" inputmode="decimal" data-ci value="${st.i||''}" style="width:90px"> mA</label><label class="small"><b>Puissance P</b><br><input type="text" inputmode="decimal" data-cp value="${st.p||''}" style="width:90px"> W</label><label class="small"><b>Valeur de résistance</b><br><select data-cn><option value="">—</option><option value="oui" ${st.n==='oui'?'selected':''}>normale</option><option value="non" ${st.n==='non'?'selected':''}>anormale</option></select></label></div><div class="row" style="margin-top:10px"><button class="btn sm primary" data-cok>Vérifier</button><span class="small" id="calcfb">${st.fb||''}</span></div>`;
    const num=v=>parseFloat(String(v).replace(',','.'));
    box.querySelector('[data-cok]').onclick=()=>{ st.i=box.querySelector('[data-ci]').value; st.p=box.querySelector('[data-cp]').value; st.n=box.querySelector('[data-cn]').value;
      const okI=Math.abs(num(st.i)-50)<1.5, okP=Math.abs(num(st.p)-1.2)<0.06, okN=st.n==='oui';
      if(okI&&okP&&okN){ p.ex.calc=true; st.fb=''; }
      else st.fb=`<span style="color:var(--bad)">${!okI?(Math.abs(num(st.i)-0.05)<0.002?'Le courant est demandé en mA : 0,05 A = … mA. ':'Le courant : loi d\u2019Ohm, I = U ÷ R. '):''}${!okP?'La puissance : P = U × I. ':''}${!okN?'Compare à l\u2019ordre de grandeur d\u2019une bobine 24 V DC (2.3.4). ':''}</span>`;
      save(); updateTocChecks(); draw(); };
  };
  draw();
}
const ORD = { pool:['KA1 — bobine','S2 — marche (NO)','S0 — arrêt d’urgence (NF)','S1 — arrêt (NF)'], slots:[] , fb:'' };
const ORD_OK = ['S0 — arrêt d’urgence (NF)','S1 — arrêt (NF)','S2 — marche (NO)','KA1 — bobine'];
function mountOrder(){
  const box=document.getElementById('orderbox'); const p=P();
  const draw=()=>{
    if(p.ex.order){ box.innerHTML=`<div class="fb good"><b>Ordre correct : S0 → S1 → S2 → KA1.</b> Les organes de coupure en tête et en série, la commande au milieu, le récepteur au plus près de N.</div><div class="figure">${staticSchema()}</div>`; return; }
    box.innerHTML = `<div class="order-slots"><span class="small" style="font-weight:800;color:var(--live)">L ↓</span>${[0,1,2,3].map(i=>`<button class="slot" data-slot="${i}">${ORD.slots[i]||'…'}</button>`).join('<span class="muted">→</span>')}<span class="small" style="font-weight:800;color:var(--elec)">↓ N</span></div>
      <div class="order-pool">${ORD.pool.filter(x=>!ORD.slots.includes(x)).map(x=>`<button data-pool="${esc(x)}">${x}</button>`).join('')}</div>
      <button class="btn sm primary" data-ordck ${ORD.slots.filter(Boolean).length<4?'disabled':''}>Vérifier</button> <span class="small">${ORD.fb}</span>`;
    box.querySelectorAll('[data-pool]').forEach(b=>b.addEventListener('click',()=>{ const i=[0,1,2,3].find(i=>!ORD.slots[i]); if(i!=null){ ORD.slots[i]=b.dataset.pool; ORD.fb=''; draw(); } }));
    box.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{ ORD.slots[+b.dataset.slot]=null; draw(); }));
    const ck=box.querySelector('[data-ordck]'); if(ck) ck.addEventListener('click',()=>{
      if(ORD_OK.every((x,i)=>ORD.slots[i]===x)){ p.ex.order=true; save(); updateTocChecks(); }
      else ORD.fb=`<span style="color:var(--bad)">Pas encore. Les organes de coupure se placent en premier, le récepteur en dernier.</span>`;
      draw(); });
  };
  draw();
}
function staticSchema(){ const keep={...SIM}; simReset(); const svg=simSVG(simCompute()); Object.assign(SIM,keep); return svg; }
