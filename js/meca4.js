/* =========================================================
   COURS DE MÉCANIQUE 4e — 4EQEM + 4EQMM (cours commun)
   Contenu original : « Cours de mécanique industrielle 4 QM » (Institut Saint-Roch),
   Partie 1 Mécanique générale · Partie 2 Technologie · Partie 3 Mise en situation (UAA1).
   Ce fichier : le plan du cours, le formulaire et les outils communs des chapitres (meca4-1 à meca4-4).
   Clé interne d'un chapitre : « 10.N » ; il s'affiche « N ».
   Identifiants : capsules « M6a », questions « M6aq1 », exercices « M6x1 » (M = Mécanique).
   Les réponses des exercices sont calculées dans le code, jamais recopiées.
   ========================================================= */
const MC_COURSE='4-meca';
const MECA4 = [
  // Partie 1 — Mécanique générale
  ['Introduction à la mécanique','Historique, les trois parties, le système international'],
  ['Les mouvements','Mobile, trajectoire, sens, vitesse'],
  ['Le mouvement rectiligne uniforme','e = v . t'],
  ['Vitesse de coupe et vitesse de rotation','Vc = π . d . n / 1000'],
  ['Transmission et transformation des mouvements','Les cinq mécanismes de transmission'],
  ['Les rapports de transmission','d . N = d’ . N’ · Z . N = Z’ . N’'],
  ['Les leviers','F . L = Q . l'],
  ['Poulies, palans, treuils et crics','Gagner en force, perdre en chemin'],
  ['Plans inclinés, vis et coins','F = Q . sin α'],
  ['Les forces','Caractéristiques, unités, systèmes de forces'],
  ['Forces parallèles et équilibre des poutres','La méthode des moments'],
  ['Le moment d’une force et le centre de gravité','M = F . d'],
  // Partie 2 — Technologie
  ['Le métier de mécanicien de maintenance','Missions, formation, description du poste'],
  ['Les équipements de protection individuelle','Rôle, risques, entretien des E.P.I.'],
  ['Les protections collectives et le balisage','E.P.C., délimitation de la zone de travail'],
  ['Les autorisations de travail','Permis de travail'],
  ['La consignation des installations','Électrique, hydraulique, mécanique, pneumatique'],
  ['Le plan d’intervention','Objectif, contenu, élaboration'],
  ['Les éléments mécaniques d’une installation','Caractéristiques techniques'],
  ['L’outillage du mécanicien de maintenance','Les outils de mesure : pied à coulisse, micromètre, comparateur'],
  // Partie 3 — Mise en situation (UAA1)
  ['L’analyse de risque (A.R.D.M.)','S’arrêter, penser, agir'],
  ['Consigner et déconsigner une installation','Procédures types'],
  ['Le moteur électrique et ses roulements','Démontage, extraction, montage'],
  ['Le motoréducteur et la lubrification','Vidange, étanchéité, barbotage, projection'],
  ['La motopompe, l’alignement et les accouplements',''],
  ['La pneumatique industrielle','Production, conditionnement, distribution, distributeurs'],
  ['Le vérin pneumatique','Démontage, joints, remontage'],
];
const MC_PARTS = [['Partie 1 — Mécanique générale','cinématique, dynamique, statique',0,12],['Partie 2 — Technologie','sécurité et métier',12,20],['Partie 3 — Technologie : mise en situation','UAA1 — réparer ou remplacer des composants mécaniques',20,27]];
COURSE_PLANS[MC_COURSE] = { court:'Mécanique 4e', titre:'Cours de Mécanique industrielle — 4e année', kicker:'4EQEM + 4EQMM · socle commun · 3 p./sem.',
  sous:'Mécanicien(ne) de maintenance industrielle · degré qualifiant · contenu original : le cours de mécanique industrielle 4 QM de l’Institut Saint-Roch',
  noteT:'Pour chaque exercice chiffré : le tableau en quatre colonnes.',
  note:'Données, inconnue, formule, solution : tu écris toi-même la formule, en t’aidant du formulaire du cours si besoin. Le résultat est vérifié tout de suite.',
  parts: MC_PARTS.map(([t,sub,a,b])=>({ t, sub, chaps: MECA4.slice(a,b).map(([ti,i],k)=>['10.'+(a+k+1), String(a+k+1), ti, i]) })) };

/* déclare un chapitre du cours de mécanique : chaque capsule monte aussi ses tableaux et ses triangles */
function defMC(n, ch){
  (ch.prereq||[]).forEach((x,i)=>{ if(!x.cap && !x.atel) x.atel='M'+n+'at'+i; });
  ch.caps.forEach(c=>{ const m=c.mount; c.mount=root=>{ if(m) m(root); mountAllDIFS(root); mountTriangles(root); }; });
  defChapter(Object.assign({ num:'10.'+n, lbl:String(n), course:MC_COURSE, titre:MECA4[n-1][0], tp:'', noEval:true,
    synT:'Synthèse du chapitre', synSub:'ce que tu sais faire maintenant',
    prereqTitle:'Ce que tu sais faire à la fin de ce chapitre',
    prereqNote:'Les compétences du chapitre. Chaque point se coche quand la capsule correspondante est validée.' }, ch));
}
/* exercice en quatre colonnes du chapitre n */
const MX = (n, key, num, enonce, res, more) => DX(key, Object.assign({ course:MC_COURSE, chap:'10.'+n, n:num, enonce, res }, more||{}));
const mcDef = (t, txt) => `<div class="note"><b>${t||'Définition'}</b>${txt}</div>`;
const mcRem = txt => `<div class="note warn"><b>Attention</b>${txt}</div>`;
const mcFig = (svg, leg) => `<div class="figure" style="text-align:center"><div style="max-width:520px;margin:0 auto">${svg}</div>${leg?`<div class="tiny muted" style="margin-top:6px">${leg}</div>`:''}</div>`;
const PI = Math.PI;
const rad = a => a*PI/180;

/* ---------- le formulaire général du cours (bouton 📐 Formulaire) ---------- */
FORMULAIRES[MC_COURSE] = {
  titre:'Formulaire — Mécanique 4e',
  intro:'Toutes les lois du cours, dans l’ordre des chapitres. Cherche celle qu’il te faut, puis <b>recopie-la toi-même</b> dans ton tableau : l’écrire t’aide à la retenir.',
  lois:[
    ['Mouvement rectiligne uniforme','e = v . t',['v = e / t','t = e / v'],'e : m — v : m/s — t : s · km/h ÷ 3,6 = m/s · m/s × 3,6 = km/h','3'],
    ['Vitesse de coupe (atelier)','Vc = π . d . n / 1000',['n = 1000 . Vc / (π . d)','d = 1000 . Vc / (π . n)'],'Vc : m/min — d : mm — n : tr/min','4'],
    ['Poulies, courroie, roues de friction','d . N = d’ . N’',['N’ = N . d / d’','d’ = d . N / N’'],'d, d’ : diamètres (menante, menée) — N, N’ : tr/min','6'],
    ['Rapport de transmission','R = N’ / N',['R = produit des dents menantes / produit des dents menées'],'N : vitesse de l’arbre menant — N’ : vitesse de l’arbre mené','6'],
    ['Roues dentées, chaîne, vis sans fin','Z . N = Z’ . N’',['N’ = Z . N / Z’','Z’ = Z . N / N’'],'Z, Z’ : nombre de dents (pour une vis sans fin : nombre d’entrées) — N, N’ : tr/min','6'],
    ['Train d’engrenages','N’ = N . (Z1 . Z2 . Z3) / (Z’1 . Z’2 . Z’3)',[],'Z1, Z2, Z3 : roues menantes — Z’1, Z’2, Z’3 : roues menées','6'],
    ['Pignon et crémaillère','e = π . d',[],'e : avance de la crémaillère pour 1 tour du pignon — d : diamètre primitif du pignon','6'],
    ['Tambour et câble','V = π . d . n / 60',['V = (1 / 2) . π . d . n / 60 (levée sur deux brins)'],'V : m/s — d : m — n : tr/min','6'],
    ['Les leviers','F . L = Q . l',['F = Q . l / L','Q = F . L / l'],'L : bras de levier de la force F — l : bras de levier de la charge Q (même unité)','7'],
    ['Poulie fixe','F = Q',[],'elle change seulement la direction de l’effort','8'],
    ['Poulie mobile','F = Q / 2',[],'le chemin parcouru par F est doublé','8'],
    ['Palan à corde','F = Q / n',[],'n : nombre de brins qui portent la charge','8'],
    ['Palan différentiel','F = Q . (R − r) / (2 . R)',[],'R, r : rayons des deux poulies fixes solidaires','8'],
    ['Treuil simple, cric simple','F = Q . r / L',[],'r : rayon du tambour (ou du pignon) — L : longueur de la manivelle','8'],
    ['Treuil différentiel','F = Q . (R − r) / (2 . L)',[],'R, r : rayons des deux cylindres — L : manivelle','8'],
    ['Treuil à engrenage','F = Q . (r . Z2) / (L . Z1)',['F = Q . (r / L) . (Z . Z’’) / (Z’ . Z’’’) (deux trains)'],'Z2 : pignon de la manivelle — Z1 : roue du tambour','8'],
    ['Plan incliné, effort parallèle au plan','F = Q . sin α',[],'α : angle du plan','9'],
    ['Plan incliné, effort horizontal','H = Q . tg α',[],'','9'],
    ['Plan incliné, effort quelconque','F = Q . sin α / cos β',[],'β : angle entre l’effort et le plan','9'],
    ['Angle de l’hélice d’une vis','tg α = p / (2 . π . r)',[],'p : pas — r : rayon de la vis','9'],
    ['Cric à vis (vérin à vis)','F = Q . p / (2 . π . L)',[],'p : pas de la vis — L : longueur de la manivelle (même unité)','9'],
    ['Roue et vis sans fin','rapport de réduction = n / Z',[],'n : nombre d’entrées de la vis — Z : nombre de dents de la roue','9'],
    ['Treuil à roue et vis sans fin','F = Q . (r . n) / (L . Z)',[],'r : rayon du tambour — L : manivelle — n : entrées — Z : dents','9'],
    ['Le coin','F = 2 . Q . sin (α / 2)',[],'α : angle du coin','9'],
    ['Poids d’une masse','P = m . g',['1 kgf = 9,81 N','1 daN = 10 N'],'P : N — m : kg — g = 9,81 m/s²','10'],
    ['Forces parallèles de même sens','R = F + F’',['F . AX = F’ . BX'],'X : point d’application de la résultante, entre A et B','11'],
    ['Forces parallèles de sens contraires','R = F − F’',['F . AX = F’ . BX'],'X : en dehors de AB, du côté de la plus grande force','11'],
    ['Équilibre d’une poutre','RA + RB = F1 + F2 + …',['somme des moments par rapport à A = 0'],'RA, RB : réactions des appuis','11'],
    ['Moment d’une force','M = F . d',[],'M : N·m — F : N — d : distance perpendiculaire du point à la force (m)','12'],
    ['Centre de gravité','d = somme des moments / somme des forces',[],'chaque élément simple pèse en proportion de sa surface','12'],
  ],
  valeurs:[
    ['Conversions',['De…','À…','Opération'],[['km','m','× 1 000'],['km/h','m/s','÷ 3,6'],['m/s','km/h','× 3,6'],['h','s','× 3 600'],['min','s','× 60']]],
    ['Unités de force',['Unité','Vaut'],[['1 kgf (kilogramme-force)','9,81 N'],['1 daN (décanewton)','10 N ≈ 1,02 kgf'],['1 N','force qui donne à 1 kg une accélération de 1 m/s²']]],
  ],
};

/* ---------- les dessins et les labos communs ---------- */
const MC_ARROW = `<defs><marker id="mcar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke"/></marker></defs>`;
const mcArrow = (x1,y1,x2,y2,col,w=3) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" marker-end="url(#mcar)"/>`;
const mcPivot = (x,y) => `<path d="M${x} ${y} l-14 24 h28 z" fill="var(--meca)" opacity=".85"/><line x1="${x-22}" y1="${y+26}" x2="${x+22}" y2="${y+26}" stroke="var(--ink-2)" stroke-width="2"/>`;
/* un levier : type ia (inter-appui), im (inter-moteur), ir (inter-résistant) ; lq, lf : bras de la charge et de la force, en m */
function leverSVG(type, lq, lf, Q, F){
  const W=440, x0=60, sc=(W-120)/Math.max(type==='ia'?lq+lf:Math.max(lq,lf),0.1), y=110;
  let px, xq, xf;
  if(type==='ia'){ px=x0+lq*sc; xq=x0; xf=px+lf*sc; }
  else { px=x0; xq=x0+lq*sc; xf=x0+lf*sc; }
  const up = type==='im';                       // en inter-moteur, la force soulève : flèche vers le haut
  const L=Math.min(px,xq,xf)-6, R=Math.max(px,xq,xf)+6;
  return `<svg viewBox="0 0 ${W} 200" role="img" aria-label="Levier ${({ia:'inter-appui',im:'inter-moteur',ir:'inter-résistant'})[type]}">${MC_ARROW}
    <rect x="${L}" y="${y-6}" width="${R-L}" height="12" rx="4" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>
    ${mcPivot(px,y+6)}
    ${mcArrow(xq,y-70,xq,y-10,'var(--bad)')}<text x="${xq}" y="${y-76}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--bad)">Q = ${Q}</text>
    ${up?mcArrow(xf,y+70,xf,y+10,'var(--ok)'):mcArrow(xf,y-70,xf,y-10,'var(--ok)')}<text x="${xf}" y="${up?y+86:y-76}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ok)">F = ${F}</text>
    <g font-size="12" fill="var(--muted)" text-anchor="middle">
      <line x1="${px}" y1="${y+44}" x2="${xq}" y2="${y+44}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${(px+xq)/2}" y="${y+40}">l = ${fr(lq)} m</text>
      <line x1="${px}" y1="${y+58}" x2="${xf}" y2="${y+58}" stroke="var(--ok)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${(px+xf)/2}" y="${y+72}">L = ${fr(lf)} m</text></g>
  </svg>`;
}
/* le labo des leviers : on choisit le type et on règle les deux bras */
function mountLeverLab(root, id){
  const box=root.querySelector('#'+id); if(!box) return;
  const st=WS[id]||(WS[id]={type:'ia', lq:0.5, lf:1.5, Q:120});
  const draw=()=>{
    if(st.type==='im' && st.lf>=st.lq) st.lf=Math.max(0.2, st.lq-0.3);
    if(st.type==='ir' && st.lq>=st.lf) st.lq=Math.max(0.2, st.lf-0.3);
    const F=st.Q*st.lq/st.lf;
    box.innerHTML=`<div class="row wrap" style="gap:6px;justify-content:center;margin-bottom:8px"><div class="seg">${[['ia','Inter-appui'],['im','Inter-moteur'],['ir','Inter-résistant']].map(([k,l])=>`<button class="${st.type===k?'on':''}" data-lt="${k}">${l}</button>`).join('')}</div></div>
      <div style="max-width:470px;margin:0 auto">${leverSVG(st.type, st.lq, st.lf, st.Q+' kg', fr(F,1)+' kg')}</div>
      <div class="grid g2" style="gap:10px;margin-top:6px">
        <label class="small">Bras de la charge l : <b>${fr(st.lq)} m</b><input type="range" min="0.2" max="3" step="0.1" value="${st.lq}" data-lq style="width:100%"></label>
        <label class="small">Bras de la force L : <b>${fr(st.lf)} m</b><input type="range" min="0.2" max="3" step="0.1" value="${st.lf}" data-lf style="width:100%"></label></div>
      <p class="small" style="margin:8px 0 0">F . L = Q . l → F = ${st.Q} × ${fr(st.lq)} / ${fr(st.lf)} = <b>${fr(F,1)} kg</b>. ${F<st.Q?'<b style="color:var(--ok)">Tu forces moins que la charge.</b>':F>st.Q?'<b style="color:var(--bad)">Tu forces plus que la charge</b> (mais l’extrémité se déplace plus vite et plus loin).':'Effort égal à la charge.'}</p>`;
    box.querySelectorAll('[data-lt]').forEach(b=>b.onclick=()=>{ st.type=b.dataset.lt; draw(); });
    box.querySelector('[data-lq]').oninput=e=>{ st.lq=+e.target.value; if(st.type==='ir'&&st.lq>=st.lf) st.lf=Math.min(3,st.lq+0.3); draw(); };
    box.querySelector('[data-lf]').oninput=e=>{ st.lf=+e.target.value; if(st.type==='im'&&st.lf>=st.lq) st.lq=Math.min(3,st.lf+0.3); draw(); };
  };
  draw();
}
/* deux poulies et une courroie, qui tournent vraiment : d . N = d’ . N’ */
function beltSVG(d1, d2, crossed, N1){
  const r1=d1/3.4, r2=d2/3.4, c1=[110,100], c2=[330,100], N2=N1*d1/d2;
  const T1=60/N1*40, T2=60/N2*40;      // durée d'un tour à l'écran (ralentie 40 fois)
  const belt = crossed
    ? `<line x1="${c1[0]}" y1="${c1[1]-r1}" x2="${c2[0]}" y2="${c2[1]+r2}" stroke="var(--ink-2)" stroke-width="4"/><line x1="${c1[0]}" y1="${c1[1]+r1}" x2="${c2[0]}" y2="${c2[1]-r2}" stroke="var(--ink-2)" stroke-width="4"/>`
    : `<line x1="${c1[0]}" y1="${c1[1]-r1}" x2="${c2[0]}" y2="${c2[1]-r2}" stroke="var(--ink-2)" stroke-width="4"/><line x1="${c1[0]}" y1="${c1[1]+r1}" x2="${c2[0]}" y2="${c2[1]+r2}" stroke="var(--ink-2)" stroke-width="4"/>`;
  const wheel=(c,r,T,rev,lbl)=>`<g><circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="3"/>
    <g><line x1="${c[0]}" y1="${c[1]}" x2="${c[0]}" y2="${c[1]-r+4}" stroke="var(--meca)" stroke-width="4" stroke-linecap="round"/><circle cx="${c[0]}" cy="${c[1]}" r="5" fill="var(--ink)"/>
    <animateTransform attributeName="transform" type="rotate" from="0 ${c[0]} ${c[1]}" to="${rev?-360:360} ${c[0]} ${c[1]}" dur="${T.toFixed(2)}s" repeatCount="indefinite"/></g>
    <text x="${c[0]}" y="222" text-anchor="middle" font-size="12" fill="var(--muted)">${lbl}</text></g>`;
  return `<svg viewBox="0 0 440 232" role="img" aria-label="Poulies et courroie ${crossed?'croisée':'ouverte'}">${belt}${wheel(c1,r1,T1,false,`menante · d = ${d1} mm · ${N1} tr/min`)}${wheel(c2,r2,T2,crossed,`menée · d’ = ${d2} mm · ${fr(N2,0)} tr/min`)}</svg>`;
}
function mountBeltLab(root, id){
  const box=root.querySelector('#'+id); if(!box) return;
  const st=WS[id]||(WS[id]={d1:120, d2:240, x:false});
  const draw=()=>{ const N1=1440, N2=N1*st.d1/st.d2;
    box.innerHTML=`<div style="max-width:470px;margin:0 auto">${beltSVG(st.d1,st.d2,st.x,N1)}</div>
      <div class="stack" style="gap:6px;margin-top:4px">
        <div class="row wrap" style="gap:6px;align-items:center"><span class="small" style="min-width:120px"><b>Poulie menante d</b></span><div class="seg">${[80,120,160,240].map(v=>`<button class="${st.d1===v?'on':''}" data-d1="${v}">${v} mm</button>`).join('')}</div></div>
        <div class="row wrap" style="gap:6px;align-items:center"><span class="small" style="min-width:120px"><b>Poulie menée d’</b></span><div class="seg">${[80,120,160,240].map(v=>`<button class="${st.d2===v?'on':''}" data-d2="${v}">${v} mm</button>`).join('')}</div></div>
        <div class="row wrap" style="gap:6px;align-items:center"><span class="small" style="min-width:120px"><b>Courroie</b></span><div class="seg"><button class="${!st.x?'on':''}" data-bx="0">ouverte</button><button class="${st.x?'on':''}" data-bx="1">croisée</button></div></div></div>
      <p class="small" style="margin:8px 0 0">d . N = d’ . N’ → N’ = ${N1} × ${st.d1} / ${st.d2} = <b>${fr(N2,0)} tr/min</b> · rapport R = N’ / N = <b>${fr(N2/N1,3)}</b>. ${st.x?'Courroie croisée : <b>sens de rotation inversé</b>.':'Courroie ouverte : <b>même sens de rotation</b>.'} <span class="muted">(Animation ralentie 40 fois.)</span></p>`;
    box.querySelectorAll('[data-d1]').forEach(b=>b.onclick=()=>{ st.d1=+b.dataset.d1; draw(); });
    box.querySelectorAll('[data-d2]').forEach(b=>b.onclick=()=>{ st.d2=+b.dataset.d2; draw(); });
    box.querySelectorAll('[data-bx]').forEach(b=>b.onclick=()=>{ st.x=b.dataset.bx==='1'; draw(); });
  };
  draw();
}
/* un train de roues (friction ou dentées) : n roues en contact, le sens s'inverse à chaque contact */
function trainSVG(n, teeth){
  const r=34, gap=teeth?74:68, x0=(440-(n-1)*gap)/2, y=80;
  return `<svg viewBox="0 0 440 170" role="img" aria-label="Train de ${n} roues">${[...Array(n)].map((_,i)=>{ const cx=x0+i*gap, rev=i%2===1;
    return `<g><circle cx="${cx}" cy="${y}" r="${r}" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="${teeth?7:3}" ${teeth?'stroke-dasharray="5 4"':''}/>
      <g><line x1="${cx}" y1="${y}" x2="${cx}" y2="${y-r+6}" stroke="var(--meca)" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${y}" r="4" fill="var(--ink)"/>
      <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${y}" to="${rev?-360:360} ${cx} ${y}" dur="4s" repeatCount="indefinite"/></g>
      <text x="${cx}" y="${y+r+20}" text-anchor="middle" font-size="18" fill="${rev?'var(--bad)':'var(--ok)'}">${rev?'↺':'↻'}</text>
      <text x="${cx}" y="${y+r+38}" text-anchor="middle" font-size="11" fill="var(--muted)">${i===0?'menante':i===n-1?'menée':'intermédiaire'}</text></g>`; }).join('')}</svg>`;
}
function mountTrainLab(root, id){
  const box=root.querySelector('#'+id); if(!box) return;
  const st=WS[id]||(WS[id]={n:2, t:true});
  const draw=()=>{ box.innerHTML=`<div style="max-width:470px;margin:0 auto">${trainSVG(st.n, st.t)}</div>
      <div class="row wrap" style="gap:8px;justify-content:center;margin-top:4px"><div class="seg">${[2,3,4,5].map(v=>`<button class="${st.n===v?'on':''}" data-tn="${v}">${v} roues</button>`).join('')}</div>
        <div class="seg"><button class="${st.t?'on':''}" data-tt="1">dentées</button><button class="${!st.t?'on':''}" data-tt="0">de friction</button></div></div>
      <p class="small" style="margin:8px 0 0">${st.n} roues : nombre <b>${st.n%2?'impair':'pair'}</b> → la roue menée tourne <b>${st.n%2?'dans le même sens que':'en sens inverse de'}</b> la roue menante.</p>`;
    box.querySelectorAll('[data-tn]').forEach(b=>b.onclick=()=>{ st.n=+b.dataset.tn; draw(); });
    box.querySelectorAll('[data-tt]').forEach(b=>b.onclick=()=>{ st.t=b.dataset.tt==='1'; draw(); });
  };
  draw();
}
/* une poutre sur deux appuis A et B, chargée par des forces verticales : [{x, F, lbl}] ; L : portée */
function beamSVG(L, loads, ra, rb, unit){
  const x0=40, W=360, sc=W/L, y=90;
  return `<svg viewBox="0 0 440 200" role="img" aria-label="Poutre sur deux appuis">${MC_ARROW}
    <rect x="${x0}" y="${y-7}" width="${W}" height="14" rx="3" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>
    ${mcPivot(x0,y+7)}${mcPivot(x0+W,y+7)}
    <text x="${x0}" y="${y+52}" text-anchor="middle" font-size="13" font-weight="800">A</text><text x="${x0+W}" y="${y+52}" text-anchor="middle" font-size="13" font-weight="800">B</text>
    ${loads.map(f=>`${mcArrow(x0+f.x*sc,y-62,x0+f.x*sc,y-10,'var(--bad)')}<text x="${x0+f.x*sc}" y="${y-68}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--bad)">${f.lbl||f.F+' '+unit}</text>`).join('')}
    ${ra!=null?`${mcArrow(x0-30,y+78,x0-30,y+14,'var(--ok)')}<text x="${x0-34}" y="${y+94}" text-anchor="start" font-size="12" font-weight="800" fill="var(--ok)">RA ${ra}</text>`:''}
    ${rb!=null?`${mcArrow(x0+W+30,y+78,x0+W+30,y+14,'var(--ok)')}<text x="${x0+W+34}" y="${y+94}" text-anchor="end" font-size="12" font-weight="800" fill="var(--ok)">RB ${rb}</text>`:''}
    <g font-size="11" fill="var(--muted)" text-anchor="middle">${[0].concat(loads.map(f=>f.x)).concat([L]).sort((a,b)=>a-b).map((v,i,a)=>i?`<text x="${x0+(a[i-1]+v)/2*sc}" y="${y+28}">${fr(v-a[i-1])} m</text>`:'').join('')}</g>
  </svg>`;
}
