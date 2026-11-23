/* =========================================================
   MÉCANIQUE 4e — CHAPITRES 7 À 9 (la dynamique : les machines simples)
   7 Les leviers · 8 Poulies, palans, treuils et crics · 9 Plans inclinés, vis et coins
   Les forces sont exprimées en kg (kilogramme-force), comme dans le cours.
   ========================================================= */
(function(){

/* ---------- 8. le palan : n brins portent la charge ---------- */
function palanSVG(n){
  const w=26, x0=220-(n-1)*w/2, top=30, bot=150;
  return `<svg viewBox="0 0 440 220" role="img" aria-label="Palan à ${n} brins">${MC_ARROW}
    <line x1="120" y1="18" x2="320" y2="18" stroke="var(--ink-2)" stroke-width="3"/><path d="M130 18 l-10 -10 M160 18 l-10 -10 M190 18 l-10 -10 M220 18 l-10 -10 M250 18 l-10 -10 M280 18 l-10 -10 M310 18 l-10 -10" stroke="var(--ink-2)" stroke-width="1.5"/>
    <rect x="${x0-14}" y="${top}" width="${(n-1)*w+28}" height="20" rx="6" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>
    ${n>1?`<rect x="${x0-14}" y="${bot-20}" width="${(n-1)*w+28}" height="20" rx="6" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>`:''}
    ${[...Array(n)].map((_,i)=>`<line x1="${x0+i*w}" y1="${top+20}" x2="${x0+i*w}" y2="${bot-(n>1?20:0)}" stroke="var(--meca)" stroke-width="3"/>`).join('')}
    <line x1="220" y1="${bot}" x2="220" y2="${bot+16}" stroke="var(--ink-2)" stroke-width="3"/>
    <rect x="190" y="${bot+16}" width="60" height="34" rx="4" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/><text x="220" y="${bot+38}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--bad)">Q</text>
    <line x1="${x0+(n-1)*w+14}" y1="${top+10}" x2="${x0+(n-1)*w+60}" y2="${top+10}" stroke="var(--meca)" stroke-width="3"/>${mcArrow(x0+(n-1)*w+60,top+10,x0+(n-1)*w+60,top+80,'var(--ok)')}
    <text x="${x0+(n-1)*w+68}" y="${top+70}" font-size="12" font-weight="800" fill="var(--ok)">F</text>
    <text x="220" y="214" text-anchor="middle" font-size="11" fill="var(--muted)">${n} brin${n>1?'s':''} porte${n>1?'nt':''} la charge</text></svg>`;
}
function mountPalanLab(root, id){
  const box=root.querySelector('#'+id); if(!box) return;
  const st=WS[id]||(WS[id]={n:2}); const Q=500, h=16;
  const draw=()=>{ box.innerHTML=`<div style="max-width:420px;margin:0 auto">${palanSVG(st.n)}</div>
    <div class="row wrap" style="gap:6px;justify-content:center"><div class="seg">${[1,2,3,4,6].map(v=>`<button class="${st.n===v?'on':''}" data-pn="${v}">${v} brin${v>1?'s':''}</button>`).join('')}</div></div>
    <p class="small" style="margin:8px 0 0">Charge Q = ${Q} kg à lever de ${h} m. Effort : F = Q / n = ${Q} / ${st.n} = <b>${fr(Q/st.n,1)} kg</b>. Longueur de câble à tirer : ${h} × ${st.n} = <b>${h*st.n} m</b>.${st.n===1?' (Une seule poulie fixe : elle ne fait que changer la direction de l’effort.)':''}</p>`;
    box.querySelectorAll('[data-pn]').forEach(b=>b.onclick=()=>{ st.n=+b.dataset.pn; draw(); }); };
  draw();
}

/* ---------- 9. le plan incliné : les trois cas ---------- */
function inclineSVG(cas){
  const a=25, x0=40, y0=170, L=360, x1=x0+L, y1=y0-L*Math.tan(rad(a));
  const mx=x0+L*0.55, my=y0-L*0.55*Math.tan(rad(a));
  const ux=Math.cos(rad(a)), uy=-Math.sin(rad(a));
  const dir = cas===1 ? [ux,uy] : cas===2 ? [1,0] : [Math.cos(rad(a+25)), -Math.sin(rad(a+25))];
  return `<svg viewBox="0 0 440 200" role="img" aria-label="Plan incliné, cas ${cas}">${MC_ARROW}
    <path d="M${x0} ${y0} L${x1} ${y0} L${x1} ${y1} Z" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>
    <g transform="rotate(${-a} ${mx} ${my})"><rect x="${mx-22}" y="${my-30}" width="44" height="30" rx="4" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/></g>
    ${mcArrow(mx,my-14,mx,my+46,'var(--bad)')}<text x="${mx+6}" y="${my+50}" font-size="12" font-weight="800" fill="var(--bad)">Q</text>
    ${mcArrow(mx,my-14,mx+dir[0]*80,my-14+dir[1]*80,'var(--ok)')}<text x="${mx+dir[0]*86}" y="${my-18+dir[1]*86}" font-size="12" font-weight="800" fill="var(--ok)">${cas===2?'H':'F'}</text>
    <text x="${x0+46}" y="${y0-6}" font-size="13" fill="var(--meca)" font-weight="800">α</text>
    <text x="${x1+6}" y="${(y0+y1)/2}" font-size="12" fill="var(--muted)">h</text>
    ${cas===3?`<text x="${mx+40}" y="${my-40}" font-size="12" fill="var(--meca)" font-weight="800">β</text>`:''}</svg>`;
}

/* =================== CHAPITRE 7 — LES LEVIERS =================== */
defMC(7, {
  Q:{
    M7aq1:{q:"Dans un levier inter-appui, où se trouve l’appui ?",o:["Entre les deux forces","À une extrémité, la charge au milieu","À une extrémité, la force motrice au milieu"],g:0,e:"Inter-appui : l’appui (le pivot) est entre la force motrice F et la charge Q. Exemple : le pied de biche.",r:'M7a'},
    M7aq2:{q:"Une brouette est un levier…",o:["inter-appui","inter-moteur","inter-résistant"],g:2,e:"La roue est l’appui, la charge est entre la roue et tes mains : la résistance est au milieu.",r:'M7a'},
    M7aq3:{q:"Dans un levier inter-moteur (ton avant-bras qui soulève un objet), la force motrice est…",o:["toujours plus grande que la charge","toujours plus petite que la charge","toujours égale à la charge"],g:0,e:"La force est plus près de l’appui que la charge : son bras de levier est plus court, il faut forcer plus. En échange, la charge se déplace plus vite et plus loin.",r:'M7a'},
    M7bq1:{q:"Quelle force faut-il prendre en compte dans le calcul d’un levier ?",o:["La force perpendiculaire au bras de levier","La force parallèle au bras","N’importe quelle force"],g:0,e:"Dans tous les cas, on considère la force perpendiculaire au bras de levier.",r:'M7b'},
  },
  caps:[
    {id:'M7a', sec:'7.1', t:'Les trois genres de leviers', quiz:['M7aq1','M7aq2','M7aq3'], ex:{keys:['M7type'], lbl:'Le classement'},
     body:()=>`<p class="lead">Un levier est une barre rigide qui pivote autour d’un appui. On distingue trois genres, selon ce qui se trouve <b>au milieu</b>.</p>
      ${tbl(['Genre','Ce qui est au milieu','Exemples'],[['Inter-appui','l’<b>appui</b> est situé entre les deux forces','pied de biche, balance, pince, ciseaux'],['Inter-moteur','la <b>force motrice</b> est située entre la charge et le pivot','ton bras qui soulève un objet, le chargeur frontal, la grue de levage'],['Inter-résistant','la <b>force résistante</b> (la charge) est située entre l’appui et la force motrice','brouette, benne de semi-remorque, remorque']])}
      <div class="figure" id="m7lab" style="max-width:500px;margin:10px auto"></div>
      <ul><li>Dans le levier <b>inter-résistant</b>, la charge est toujours supérieure à la force motrice : on gagne en force.</li>
        <li>Dans le levier <b>inter-moteur</b>, c’est l’inverse : la force motrice est toujours plus grande que la charge, mais la charge se déplace plus loin et plus vite.</li>
        <li>Dans le levier <b>inter-appui</b>, tout dépend de la position de l’appui.</li></ul>
      ${exbox('m7type','Quel genre de levier ?','')}`,
     mount:root=>{ mountLeverLab(root,'m7lab'); mountSortW(root.querySelector('#m7type'),'M7type',{cats:[['ia','Inter-appui'],['im','Inter-moteur'],['ir','Inter-résistant']],items:[
       ['Un pied de biche qui soulève une plaque','ia',''],['Une paire de ciseaux','ia','L’axe est entre la main et le papier.'],['Une brouette','ir',''],['La flèche d’une grue actionnée par un vérin près de son pivot','im','Le vérin pousse entre le pivot et la charge.'],['Une benne basculante de camion','ir',''],['Une pince multiprise','ia','']],ok:'Les trois genres sont maîtrisés.'}); }},
    {id:'M7b', sec:'7.2', t:'La loi des leviers', quiz:['M7bq1'], ex:{keys:['M7x1','M7x2','M7x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Pour les trois genres, la loi est la même : à l’équilibre, la force multipliée par son bras de levier est égale à la charge multipliée par le sien.</p>
      <div class="tri-row">${fbox('F . L = Q . l','F : force motrice — L : bras de levier de F (distance de l’appui à F) — Q : charge — l : bras de levier de Q')}</div>
      <p>D’où ${fm('F = Q . l / L')} et ${fm('Q = F . L / l')}. Les deux bras s’expriment dans la même unité.</p>
      ${mcRem('Dans tous les cas, il faut considérer la force <b>perpendiculaire</b> au bras de levier. Et mesure toujours les bras <b>à partir de l’appui</b>.')}
      ${(v=>MX(7,'M7x1',1,`Levier inter-appui. Avec un pied de biche, on soulève une charge Q = ${v.Q} kg placée à ${fr(v.l)} m de l’appui. On pousse à ${fr(v.L)} m de l’appui, de l’autre côté. Quelle force faut-il exercer ?`,[{lbl:'F',unit:'kg',ans:v.Q*v.l/v.L}]))(vx('M7x1',{Q:[200,150,300,240],l:[0.1,0.05,0.15,0.08],L:[1.2,0.8,1.5,1]}))}
      ${(v=>MX(7,'M7x2',2,`Levier inter-résistant. Une brouette porte Q = ${v.Q} kg à ${fr(v.l)} m de l’axe de la roue. Les poignées sont à ${fr(v.L)} m de cet axe. Quel effort faut-il pour soulever les poignées ?`,[{lbl:'F',unit:'kg',ans:v.Q*v.l/v.L}]))(vx('M7x2',{Q:[200,120,90,150],l:[0.4,0.5,0.3,0.35],L:[1.4,1.5,1.2,1.4]}))}
      ${(v=>MX(7,'M7x3',3,`Levier inter-moteur. Un vérin agit à ${fr(v.L)} m du pivot d’un bras de chargement et développe une force F = ${v.F} kg. Quelle charge Q peut-il soulever à l’extrémité du bras, à ${fr(v.l)} m du pivot ?`,[{lbl:'Q',unit:'kg',ans:v.F*v.L/v.l}],{hint:'Q = F . L / l : le bras de la charge est le plus long.'}))(vx('M7x3',{L:[0.5,0.4,0.6,0.3],F:[1000,1200,900,1500],l:[2.2,2,3,1.8]}))}`},
  ],
  prereq:[{t:'Reconnaître les trois genres de leviers et en citer des exemples',cap:'M7a'},{t:'Appliquer la loi des leviers F . L = Q . l',cap:'M7b'}],
});

/* =================== CHAPITRE 8 — POULIES, PALANS, TREUILS ET CRICS =================== */
defMC(8, {
  Q:{
    M8aq1:{q:"Que fait une poulie fixe ?",o:["Elle divise l’effort par deux","Elle change seulement la direction de l’effort","Elle double la vitesse de la charge"],g:1,e:"F = Q : on ne gagne pas en force, mais on tire dans une direction plus pratique (vers le bas, par exemple).",r:'M8a'},
    M8aq2:{q:"Avec une poulie mobile, pour lever la charge de 1 m, tu dois tirer…",o:["1 m de câble","2 m de câble","0,5 m de câble"],g:1,e:"On gagne en force (F = Q / 2), on perd en chemin parcouru : le câble tiré est deux fois plus long.",r:'M8a'},
    M8aq3:{q:"Un palan différentiel a R = r. Que se passe-t-il ?",o:["L’effort est nul mais la charge ne bouge pas","La charge monte très vite","L’effort vaut Q"],g:0,e:"Il s’enroule autant de chaîne qu’il s’en déroule : F = 0 mais la charge ne monte pas. Plus R et r sont proches (sans être égaux), plus on gagne en force.",r:'M8a'},
    M8bq1:{q:"Dans un treuil simple, l’effort sur la manivelle diminue quand…",o:["le rayon du tambour diminue ou la manivelle s’allonge","le rayon du tambour augmente","la charge augmente"],g:0,e:"F = Q . r / L : r petit et L grand donnent un petit effort (mais la charge monte moins vite).",r:'M8b'},
    M8bq2:{q:"Un treuil, un cric, un palan… ne sont en fait qu’une combinaison de…",o:["leviers","plans inclinés","ressorts"],g:0,e:"Le treuil est une succession de leviers : r et L en sont les deux bras.",r:'M8b'},
  },
  caps:[
    {id:'M8a', sec:'8.1 — 8.2', t:'Poulies et palans', quiz:['M8aq1','M8aq2','M8aq3'], ex:{keys:['M8x1','M8x2'], lbl:'Les deux exercices'},
     body:()=>`<p class="lead">La règle d’or des machines simples : <b>ce qu’on gagne en force, on le perd en chemin parcouru</b>.</p>
      ${tbl(['Machine','Remarque','Formule'],[['Poulie fixe','une succession ininterrompue de leviers inter-appui à bras égaux : elle ne fait que changer la direction de l’effort ; la chape qui la tient supporte 2 F',fm('F = Q')],['Poulie mobile','une succession de leviers dont l’appui est d’un côté de la poulie : on gagne en force, on perd en chemin parcouru (câble deux fois plus long) ; l’attache supporte Q / 2',fm('F = Q / 2')],['Palan à corde','des moufles (groupes de poulies) : l’effort est réparti sur les brins qui portent la charge',fm('F = Q / n')],['Palan différentiel','deux poulies fixes de rayons R et r, solidaires, et une poulie mobile reliée à la charge',fm('F = Q . (R − r) / (2 . R)')]])}
      ${mcDef('Le palan','Appareil permettant de soulever et de déplacer de très lourdes charges au bout d’un câble ou d’une chaîne.')}
      <div class="figure" id="m8palan" style="max-width:460px;margin:10px auto"></div>
      <p class="small"><b>Exemple</b> : deux moufles de trois poulies, soit 6 brins, pour une charge de 500 kg à lever de 16 m : F = 500 / 6 ≈ 83 kg, et il faut tirer 16 × 6 = 96 m de câble.</p>
      <p><b>Palan différentiel</b> : plus la différence entre R et r est petite, plus la machine est efficace (forcer moins ou lever plus). Si R = r, la force est nulle… mais la charge ne bouge pas, car il s’enroule autant de chaîne qu’il s’en déroule.</p>
      ${(v=>MX(8,'M8x1',1,`Un palan à corde a ${v.n} brins qui portent une charge de ${v.Q} kg. Quel effort faut-il exercer ? Quelle longueur de câble faut-il tirer pour lever la charge de ${v.h} m ?`,[{lbl:'F',unit:'kg',ans:v.Q/v.n},{lbl:'longueur tirée',unit:'m',ans:v.h*v.n}]))(vx('M8x1',{n:[4,6,3,2],Q:[400,600,450,240],h:[2,3,4,5]}))}
      ${(v=>MX(8,'M8x2',2,`Palan différentiel : Q = 1 000 kg, R = 20 cm, r = ${v.r} cm. Calculer l’effort F.`,[{lbl:'F',unit:'kg',ans:1000*(20-v.r)/(2*20)}]))(vx('M8x2',{r:[10,15,18,16]}))}`,
     mount:root=>mountPalanLab(root,'m8palan')},
    {id:'M8b', sec:'8.3 — 8.4', t:'Treuils et crics', quiz:['M8bq1','M8bq2'], ex:{keys:['M8x3','M8x4','M8x5'], lbl:'Les trois exercices'},
     body:()=>`${mcDef('Le treuil','Appareil de levage composé d’un cylindre (le tambour) que l’on fait tourner sur son axe, et autour duquel s’enroule une corde ou un câble.')}
      ${tbl(['Machine','Remarque','Formule'],[['Treuil simple','pour un tour de manivelle, le tambour fait un tour et le câble s’enroule de 2 . π . r ; l’ascension est d’autant plus petite que le rayon du tambour est petit',fm('F = Q . r / L')],['Treuil différentiel','un tambour à deux diamètres (rayons R et r) et une poulie mobile : le câble passant sous la poulie s’enroule sur un cylindre et se déroule sur l’autre ; la charge monte de la moitié de la différence',fm('F = Q . (R − r) / (2 . L)')],['Treuil à engrenage','le tambour porte une roue dentée Z1 commandée par un pignon Z2 calé sur l’axe de la manivelle : la rotation du tambour est fortement diminuée',fm('F = Q . (r . Z2) / (L . Z1)')],['Cric simple (crémaillère)','une crémaillère commandée par un pignon de rayon r ; pour un tour de manivelle, la crémaillère monte de 2 . π . r',fm('F = Q . r / L')]])}
      <p class="small">r : rayon du tambour (ou du pignon) — L : longueur de la manivelle — Z1 : dents de la roue du tambour — Z2 : dents du pignon de la manivelle. Avec deux trains d’engrenages, on multiplie les rapports : ${fm('F = Q . (r / L) . (Z . Z’’) / (Z’ . Z’’’)')}.</p>
      ${mcDef('Le cric','Machine munie d’une crémaillère et d’un système de roues dentées commandé par une manivelle, utilisée pour soulever à faible hauteur de fortes charges. Le <b>cric à engrenage</b> est un cric à crémaillère dont le pignon est commandé par la manivelle via un ou deux engrenages supplémentaires.')}
      ${(v=>MX(8,'M8x3',3,`Un treuil simple a un tambour de ${v.r} cm de rayon et une manivelle de ${v.L} cm. Quel effort faut-il exercer sur la manivelle pour lever ${v.Q} kg ?`,[{lbl:'F',unit:'kg',ans:v.Q*v.r/v.L}]))(vx('M8x3',{r:[10,8,12,6],L:[40,32,48,30],Q:[300,200,240,150]}))}
      ${(v=>MX(8,'M8x4',4,`Un treuil différentiel a deux cylindres de rayons R = ${v.R} cm et r = ${v.r} cm. La manivelle mesure ${v.L} cm. Quel effort faut-il pour lever ${v.Q} kg ?`,[{lbl:'F',unit:'kg',ans:v.Q*(v.R-v.r)/(2*v.L)}]))(vx('M8x4',{R:[15,12,20,16],r:[12,10,16,12],L:[40,30,50,40],Q:[800,600,1000,500]}))}
      ${(v=>MX(8,'M8x5',5,`Un treuil à engrenage : tambour de ${v.r} cm de rayon, manivelle de ${v.L} cm, pignon de la manivelle Z2 = ${v.z2} dents, roue du tambour Z1 = ${v.z1} dents. Quel effort faut-il pour lever ${v.Q} kg ?`,[{lbl:'F',unit:'kg',ans:v.Q*v.r*v.z2/(v.L*v.z1)}]))(vx('M8x5',{r:[10,8,12,10],L:[40,35,40,30],z2:[15,12,20,18],z1:[60,48,80,72],Q:[1000,800,1200,600]}))}`},
  ],
  prereq:[{t:'Expliquer le rôle d’une poulie fixe et d’une poulie mobile',cap:'M8a'},{t:'Calculer l’effort sur un palan à corde ou un palan différentiel',cap:'M8a'},{t:'Calculer l’effort sur un treuil simple, différentiel ou à engrenage',cap:'M8b'},{t:'Décrire le cric simple et le cric à engrenage',cap:'M8b'}],
});

/* =================== CHAPITRE 9 — PLANS INCLINÉS, VIS ET COINS =================== */
defMC(9, {
  Q:{
    M9aq1:{q:"Le plan incliné est…",o:["la deuxième machine simple, après le levier","une sorte de poulie","une machine qui ne sert qu’en statique"],g:0,e:"C’est un plan rigide, supposé sans frottement, incliné d’un angle α.",r:'M9a'},
    M9aq2:{q:"Pour un même plan incliné, quel effort est le plus petit ?",o:["L’effort parallèle au plan","L’effort horizontal","Ils sont égaux"],g:0,e:"F = Q . sin α est toujours plus petit que H = Q . tg α (car cos α < 1).",r:'M9a'},
    M9bq1:{q:"Le système vis-écrou est en fait…",o:["un plan incliné enroulé en hélice","un levier inter-moteur","une poulie mobile"],g:0,e:"Déroulée, l’hélice d’une vis donne un triangle rectangle : base 2 . π . r, hauteur = le pas p.",r:'M9b'},
    M9bq2:{q:"Une vis sans fin à 1 entrée entraîne une roue de 50 dents. Le rapport de réduction vaut…",o:["50","1/50","1/2"],g:1,e:"Rapport = n / Z = 1 / 50 : la roue tourne 50 fois moins vite que la vis.",r:'M9b'},
    M9cq1:{q:"Plus l’angle α d’un coin est petit…",o:["plus l’effort à fournir est petit","plus l’effort à fournir est grand","l’effort ne dépend pas de l’angle"],g:0,e:"F = 2 . Q . sin (α / 2) : un coin très aigu écarte les pièces avec peu d’effort.",r:'M9c'},
  },
  caps:[
    {id:'M9a', sec:'9.1', t:'Le plan incliné', quiz:['M9aq1','M9aq2'], ex:{keys:['M9x1','M9x2'], lbl:'Les deux exercices'},
     body:()=>`<p class="lead">C’est la deuxième machine simple (le levier étant la première) : un plan rigide, supposé sans frottement, incliné d’un angle α.</p>
      <div class="grid g3" style="gap:10px">${[1,2,3].map(c=>`<div class="figure" style="margin:0">${inclineSVG(c)}<div class="tiny muted" style="text-align:center">${['1er cas : effort parallèle au plan','2e cas : effort horizontal','3e cas : effort quelconque'][c-1]}</div></div>`).join('')}</div>
      ${tbl(['Cas','Effort moteur','Formule'],[['1er cas','tangent (parallèle) au plan incliné',fm('F = Q . sin α')],['2e cas','horizontal, parallèle au sol',fm('H = Q . tg α')],['3e cas','quelconque, faisant un angle β avec le plan',fm('F = Q . sin α / cos β')]])}
      <p class="small">Utilise ta calculatrice en mode <b>degrés</b> (DEG) pour sin, cos et tg.</p>
      ${terrain('Une rampe de chargement, un tapis incliné ou une glissière de pièces sont des plans inclinés. Une pente plus douce demande moins d’effort, mais une rampe plus longue.')}
      ${(v=>MX(9,'M9x1',1,`On pousse une caisse de ${v.Q} kg sur un plan incliné de ${v.a}°, sans frottement, avec un effort parallèle au plan. Quel effort faut-il ?`,[{lbl:'F',unit:'kg',ans:v.Q*Math.sin(rad(v.a))}]))(vx('M9x1',{Q:[200,150,300,250],a:[20,15,25,30]}))}
      ${(v=>MX(9,'M9x2',2,`La même caisse de ${v.Q} kg, sur un plan incliné de ${v.a}°, est poussée cette fois horizontalement. Quel effort H faut-il ?`,[{lbl:'H',unit:'kg',ans:v.Q*Math.tan(rad(v.a))}]))(vx('M9x2',{Q:[200,150,300,250],a:[20,15,25,30]}))}`},
    {id:'M9b', sec:'9.2 — 9.5', t:'La vis, le cric à vis et la vis sans fin', quiz:['M9bq1','M9bq2'], ex:{keys:['M9x3','M9x4','M9x5'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Le système vis + écrou est identique à un plan incliné : les filets de l’écrou glissent sur les filets de la vis comme une charge sur un plan incliné enroulé en hélice.</p>
      <p>Si on déroule une spire de la vis, on obtient un triangle rectangle : la base vaut ${fm('AB = 2 . π . r')} et la hauteur vaut le <b>pas</b> ${fm('BC = p')}. L’angle de l’hélice vaut donc :</p>
      ${fbox('tg α = p / (2 . π . r)','p : pas de la vis — r : rayon de la vis')}
      <p>Applications : vérin à vis, arrache-poulie, serre-joint, étau…</p>
      ${tbl(['Machine','Remarque','Formule'],[['Cric à vis (vérin à vis)','une manivelle tourne une longue tige filetée ; pour un tour de manivelle, la charge monte d’un pas : le travail moteur 2 . π . L . F égale le travail résistant p . Q',fm('F = Q . p / (2 . π . L)')],['Roue et vis sans fin','une vis (souvent à filet trapézoïdal) engrène avec une roue ; la vis est toujours motrice',fm('rapport = n / Z')],['Treuil à roue et vis sans fin','un tambour de rayon r solidaire d’une roue de Z dents, attaquée par une vis à n entrées mue par une manivelle L',fm('F = Q . (r . n) / (L . Z)')]])}
      <p class="small">n : nombre d’entrées de la vis — Z : nombre de dents de la roue. Exemple : vis à 1 entrée, roue de 50 dents → rapport = 1/50.</p>
      ${(v=>MX(9,'M9x3',3,`Un cric à vis a un pas de ${v.p} mm. Sa manivelle mesure ${v.L} mm. Quel effort faut-il exercer sur la manivelle pour soulever ${v.Q.toLocaleString('fr-BE')} kg (sans frottement) ?`,[{lbl:'F',unit:'kg',ans:v.Q*v.p/(2*PI*v.L)}]))(vx('M9x3',{p:[4,5,6,3],L:[250,300,200,250],Q:[1500,2000,1200,1000]}))}
      ${(v=>MX(9,'M9x4',4,`Une vis à ${v.n} entrée${v.n>1?'s':''} engrène avec une roue de ${v.Z} dents. Calcule le rapport de réduction, puis la vitesse de la roue si la vis tourne à ${v.N} tr/min.`,[{lbl:'rapport',unit:'',ans:v.n/v.Z,tol:0.01},{lbl:'vitesse de la roue',unit:'tr/min',ans:v.N*v.n/v.Z}]))(vx('M9x4',{n:[1,2,1,3],Z:[50,40,30,60],N:[1450,1440,1500,900]}))}
      ${(v=>MX(9,'M9x5',5,`Un treuil à roue et vis sans fin : tambour de ${v.r} cm de rayon, manivelle de ${v.L} cm, vis à ${v.n} entrée${v.n>1?'s':''}, roue de ${v.Z} dents. Quel effort faut-il pour lever ${v.Q} kg ?`,[{lbl:'F',unit:'kg',ans:v.Q*v.r*v.n/(v.L*v.Z)}]))(vx('M9x5',{r:[10,12,8,15],L:[30,40,25,30],n:[1,2,1,1],Z:[40,50,30,60],Q:[500,800,300,900]}))}`},
    {id:'M9c', sec:'9.6', t:'Le coin', quiz:['M9cq1'], ex:{keys:['M9x6'], lbl:'L’exercice'},
     body:()=>`<p class="lead">Le coin est un prisme de section triangulaire isocèle, d’angle α très petit. Son but est d’écarter l’une de l’autre deux pièces très rapprochées, entre lesquelles on l’introduit.</p>
      <p>La force F enfonce le coin ; chacune de ses faces pousse une pièce avec une force Q, perpendiculaire à la face.</p>
      ${fbox('F = 2 . Q . sin (α / 2)','F : force sur le coin — Q : force sur chaque pièce — α : angle du coin')}
      ${terrain('Les coins servent à caler une machine, à démonter un moyeu, ou comme clavette. Le tranchant d’un burin ou d’une hache fonctionne de la même façon.')}
      ${(v=>MX(9,'M9x6',6,`Un coin d’angle α = ${v.a}° doit exercer une force Q = ${v.Q} kg sur chacune des deux pièces à écarter. Quelle force F faut-il appliquer sur le coin ?`,[{lbl:'F',unit:'kg',ans:2*v.Q*Math.sin(rad(v.a/2))}]))(vx('M9x6',{a:[20,15,30,10],Q:[400,600,300,800]}))}`},
  ],
  prereq:[{t:'Calculer l’effort sur un plan incliné, dans les trois cas',cap:'M9a'},{t:'Expliquer pourquoi la vis est un plan incliné et calculer l’angle de l’hélice',cap:'M9b'},{t:'Calculer l’effort sur un cric à vis et sur un treuil à vis sans fin',cap:'M9b'},{t:'Calculer la force à appliquer sur un coin',cap:'M9c'}],
});

})();
