/* =========================================================
   MÉCANIQUE 4e — CHAPITRES 10 À 12 (la statique)
   10 Les forces · 11 Forces parallèles et équilibre des poutres · 12 Moment et centre de gravité
   ========================================================= */
(function(){

/* ---------- 10. un vecteur force et ses quatre caractéristiques ---------- */
const vecSVG = () => `<svg viewBox="0 0 440 160" role="img" aria-label="Vecteur force : origine, direction, sens, intensité">${MC_ARROW}
  <line x1="30" y1="80" x2="420" y2="80" stroke="var(--line)" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="90" cy="80" r="6" fill="var(--ink)"/>${mcArrow(90,80,330,80,'var(--meca)',4)}
  <text x="210" y="70" text-anchor="middle" font-size="14" font-weight="800" fill="var(--meca)">F₁</text>
  <g font-size="11" fill="var(--muted)"><text x="40" y="104">origine (point d’application)</text><text x="418" y="72" text-anchor="end">direction</text><text x="330" y="104" text-anchor="middle">sens (la flèche)</text>
  <line x1="90" y1="128" x2="330" y2="128" stroke="var(--muted)" stroke-width="1"/><line x1="90" y1="122" x2="90" y2="134" stroke="var(--muted)"/><line x1="330" y1="122" x2="330" y2="134" stroke="var(--muted)"/><text x="210" y="148" text-anchor="middle">longueur = intensité, à l’échelle</text></g></svg>`;

/* ---------- 11. deux forces parallèles et leur résultante ---------- */
function parSVG(F1, F2, D, same){
  const R=same?F1+F2:F1-F2, ax=same?F2*D/(F1+F2):F2*D/(F1-F2);
  const lo=same?0:-ax, sc=300/(D-lo), X=v=>70+(v-lo)*sc, y=100;
  const xA=X(0), xB=X(D), xX=X(same?ax:-ax);
  const h=f=>20+Math.abs(f)/Math.max(F1,F2,Math.abs(R))*50;
  return `<svg viewBox="0 0 440 210" role="img" aria-label="Deux forces parallèles ${same?'de même sens':'de sens contraires'} et leur résultante">${MC_ARROW}
    <line x1="${Math.min(xA,xX)-20}" y1="${y}" x2="${xB+20}" y2="${y}" stroke="var(--ink-2)" stroke-width="3"/>
    ${mcArrow(xA,y-h(F1),xA,y-2,'var(--bad)')}<text x="${xA+6}" y="${y-h(F1)+10}" font-size="12" font-weight="800" fill="var(--bad)">F = ${F1} N</text>
    ${same?mcArrow(xB,y-h(F2),xB,y-2,'var(--bad)'):mcArrow(xB,y+h(F2),xB,y+2,'var(--bad)')}<text x="${xB-6}" y="${same?y-h(F2)+10:y+h(F2)-4}" text-anchor="end" font-size="12" font-weight="800" fill="var(--bad)">F’ = ${F2} N</text>
    ${mcArrow(xX,y+2,xX,y+h(R),'var(--ok)')}<text x="${xX+8}" y="${y+h(R)-4}" font-size="12" font-weight="800" fill="var(--ok)">R = ${R} N</text>
    <g font-size="13" font-weight="800"><text x="${xA-6}" y="${y+18}" text-anchor="end">A</text><text x="${xB+6}" y="${y+18}">B</text><text x="${xX-6}" y="${y-8}" text-anchor="end" fill="var(--ok)">X</text></g>
    <text x="220" y="202" text-anchor="middle" font-size="11" fill="var(--muted)">AB = ${fr(D)} m · AX = ${fr(ax,2)} m${same?'':' (en dehors de AB, côté de la plus grande force)'}</text></svg>`;
}

/* ---------- 12. une équerre en deux rectangles ---------- */
function equerreSVG(B, H){
  const sc=Math.min(260/B, 150/(H+10)), x0=80, y0=190, t=10*sc;
  return `<svg viewBox="0 0 440 220" role="img" aria-label="Équerre de ${B} mm sur ${H+10} mm, épaisseur 10 mm">
    <rect x="${x0}" y="${y0-t}" width="${B*sc}" height="${t}" fill="var(--meca)" opacity=".35" stroke="var(--ink-2)" stroke-width="2"/>
    <rect x="${x0}" y="${y0-t-H*sc}" width="${t}" height="${H*sc}" fill="var(--elec)" opacity=".3" stroke="var(--ink-2)" stroke-width="2"/>
    <text x="${x0+B*sc/2}" y="${y0-t/2+4}" text-anchor="middle" font-size="11" font-weight="800">2</text><text x="${x0+t/2}" y="${y0-t-H*sc/2}" text-anchor="middle" font-size="11" font-weight="800">1</text>
    <line x1="${x0-30}" y1="${y0}" x2="${x0+B*sc+30}" y2="${y0}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="${x0+B*sc+34}" y="${y0+4}" font-size="11" fill="var(--bad)">X X’</text>
    <line x1="${x0}" y1="${y0+20}" x2="${x0}" y2="${y0-t-H*sc-14}" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="${x0+6}" y="${y0-t-H*sc-4}" font-size="11" fill="var(--bad)">Y Y’</text>
    <g font-size="11" fill="var(--muted)" text-anchor="middle"><text x="${x0+B*sc/2}" y="${y0+16}">${B} mm</text><text x="${x0-18}" y="${y0-t-H*sc/2}" transform="rotate(-90 ${x0-18} ${y0-t-H*sc/2})">${H} mm</text><text x="${x0+t+8}" y="${y0-t-H*sc/2}" text-anchor="start">épaisseur 10 mm</text></g></svg>`;
}

/* =================== CHAPITRE 10 — LES FORCES =================== */
defMC(10, {
  Q:{
    M10aq1:{q:"Une force est une cause capable de…",o:["modifier l’état de repos ou de mouvement d’un corps","mesurer la masse d’un corps","produire de la chaleur"],g:0,e:"C’est la définition synthétisée : elle regroupe la définition dynamique (mouvement) et la définition statique (repos, forme).",r:'M10a'},
    M10aq2:{q:"Le principe de l’action et de la réaction dit que…",o:["à toute action correspond une réaction égale et opposée","la réaction est toujours plus faible que l’action","l’action et la réaction s’annulent sur le même corps"],g:0,e:"C’est la troisième loi de Newton : 100 N d’action, 100 N de réaction, en sens opposé.",r:'M10a'},
    M10bq1:{q:"Quelles sont les quatre caractéristiques d’une force ?",o:["Point d’application, direction, sens, intensité","Masse, vitesse, direction, sens","Origine, longueur, couleur, unité"],g:0,e:"Point d’application (où), direction (la droite), sens (vers où), intensité (combien).",r:'M10b'},
    M10cq1:{q:"Combien de newtons dans 1 kgf ?",o:["1 N","9,81 N","10 N"],g:1,e:"1 kgf est la force qui donne à 1 kg une accélération de 9,81 m/s² (la pesanteur) : 1 kgf = 9,81 N.",r:'M10c'},
    M10cq2:{q:"1 daN vaut…",o:["10 N, soit environ 1,02 kgf","100 N","0,1 N"],g:0,e:"déca = 10 : 1 daN = 10 N ≈ 1,02 kgf. C’est pratique : en daN, on retrouve presque la valeur en kg.",r:'M10c'},
    M10dq1:{q:"La résultante d’un système de forces est…",o:["la force unique qui a le même effet que toutes les autres ensemble","la plus grande des forces","la force qui s’oppose au mouvement"],g:0,e:"Les forces du système s’appellent les composantes ; la résultante les remplace toutes.",r:'M10d'},
    M10dq2:{q:"Peut-on déplacer une force le long de sa ligne d’action ?",o:["Oui, sans changer l’équilibre","Non, jamais","Seulement si elle est verticale"],g:0,e:"C’est un des principes fondamentaux de la statique.",r:'M10d'},
  },
  caps:[
    {id:'M10a', sec:'10.1 — 10.4', t:'Qu’est-ce qu’une force ?', quiz:['M10aq1','M10aq2'], ex:{keys:['M10typ'], lbl:'Les types de forces'},
     body:()=>`<p class="lead">Il faut une force pour mettre un corps au repos en mouvement, pour augmenter ou diminuer sa vitesse, pour courber sa trajectoire, ou pour le déformer.</p>
      ${tbl(['Définition','Une force est…'],[['Dynamique','une cause qui modifie l’état de mouvement d’un corps'],['Statique','une cause qui modifie l’état de repos (la forme) d’un corps'],['Synthétisée','une cause capable de modifier l’état de repos ou l’état de mouvement d’un corps']])}
      ${mcDef('Le principe de l’action et de la réaction','Aussi appelé troisième loi de Newton : pour chaque action, il existe une réaction égale et opposée. Si A pousse sur B avec 100 N (action), B repousse A avec 100 N (réaction) : condition d’équilibre, pas de mouvement.')}
      <p><b>Les types de forces</b> :</p>
      <ul><li>d’après le <b>sens</b> : la force <b>motrice</b> agit dans le même sens que le mouvement ; la force <b>résistante</b> agit en sens contraire ;</li>
        <li>d’après l’<b>action</b> : la force de <b>contact</b> (vapeur, liquides, solides) agit directement ; la force <b>à distance</b> (gravitation, magnétisme) agit sans contact.</li></ul>
      ${exbox('m10typ','Force de contact ou force à distance ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m10typ'),'M10typ',{cats:[['c','De contact'],['d','À distance']],items:[
       ['L’huile sous pression qui pousse le piston d’un vérin','c',''],['Le poids d’une charge suspendue au palan','d','Le poids est dû à la gravitation.'],['L’électroaimant qui attire une tôle','d','Magnétisme.'],['La main qui pousse un chariot','c',''],['La courroie qui entraîne une poulie','c','']],ok:'Bien classé.'})},
    {id:'M10b', sec:'10.5 — 10.7', t:'Caractéristiques et représentation d’une force', quiz:['M10bq1'], ex:{keys:['M10vec'], lbl:'Les vecteurs à l’échelle'},
     body:()=>`<p class="lead">Une force se représente par un <b>vecteur</b> (une flèche), noté F.</p>
      ${mcFig(vecSVG(),'Les quatre éléments du vecteur force.')}
      ${tbl(['Caractéristique','Ce qu’elle dit','Exemple'],[['1. Point d’application (origine)','l’endroit précis où se concentre la force','le crochet d’une grue, l’attache d’un treuil'],['2. Direction','la droite sur laquelle elle agit','horizontale, verticale, oblique'],['3. Sens','vers où elle agit, suivant la flèche','gauche ou droite, haut ou bas'],['4. Intensité','combien : la longueur du vecteur, selon l’échelle adoptée','5 cm pour 500 N à l’échelle 1 cm = 100 N']])}
      ${exbox('m10vec','Dessine à l’échelle','Quelle longueur de vecteur, ou quelle force ?')}`,
     mount:root=>(v=>mountDrillW(root.querySelector('#m10vec'),'M10vec',{intro:`Échelle : 1 cm = ${v.e} N.`,rows:[{q:`Une force de ${v.a} N : longueur du vecteur`,unit:'cm',ans:v.a/v.e},{q:`Une force de ${v.b} N : longueur du vecteur`,unit:'cm',ans:v.b/v.e},{q:`Un vecteur de ${fr(v.c)} cm représente une force de`,unit:'N',ans:v.c*v.e}],ok:'Échelle maîtrisée.',hint:'Longueur = force / échelle.'}))(vx('M10vec',{e:[50,100,20,200],a:[250,400,500,600],b:[150,700,300,900],c:[3.5,4,2.5,6]}))},
    {id:'M10c', sec:'10.6', t:'Les unités de force', quiz:['M10cq1','M10cq2'], ex:{keys:['M10u'], lbl:'Les conversions'},
     body:()=>`${tbl(['Système','Unité','Définition'],[['MKpS (des mécaniciens)','le kilogramme-force (ou kilogramme-poids) : kgf','la force qui communique à une masse de 1 kg une accélération de 9,81 m/s²'],['MKSA (international)','le newton : N','la force qui communique à une masse de 1 kg une accélération de 1 m/s²']])}
      ${fbox('1 kgf = 9,81 N','On utilise aussi le décanewton : 1 daN = 10 N ≈ 1,02 kgf')}
      ${mcRem('La <b>masse</b> (kg) n’est pas une force. Le <b>poids</b> d’une masse de 1 kg vaut 9,81 N (1 kgf). Dans les machines simples, le cours exprime les charges en kg : ce sont des kilogrammes-force.')}
      ${exbox('m10u','Conversions de forces','')}`,
     mount:root=>(v=>mountDrillW(root.querySelector('#m10u'),'M10u',{rows:[{q:`${v.a} kgf en N`,unit:'N',ans:v.a*9.81},{q:`${v.b} N en daN`,unit:'daN',ans:v.b/10},{q:`${v.c} daN en N`,unit:'N',ans:v.c*10},{q:`${v.d} N en kgf`,unit:'kgf',ans:v.d/9.81}],ok:'Conversions justes.',hint:'1 kgf = 9,81 N ; 1 daN = 10 N.'}))(vx('M10u',{a:[50,100,250,20],b:[1500,450,3200,800],c:[25,120,8,60],d:[981,490.5,1962,294.3]}))},
    {id:'M10d', sec:'10.8 — 10.9', t:'Les systèmes de forces et les principes de la statique', quiz:['M10dq1','M10dq2'], ex:{keys:['M10sys'], lbl:'Le classement'},
     body:()=>`${mcDef('Système de forces','Un corps est soumis à un système de forces quand il est sollicité simultanément par plusieurs forces.')}
      ${tbl(['Système','Ses forces'],[['De forces parallèles','les directions des forces sont parallèles'],['De forces concourantes','les directions des forces se rassemblent en un seul point'],['De forces quelconques','les directions ne sont ni toutes concourantes, ni toutes parallèles']])}
      <p>Un système de forces est <b>en équilibre</b> quand, appliqué à un corps libre, il ne modifie ni son état de repos, ni son état de mouvement rectiligne uniforme. La <b>résultante</b> est la force unique qui a le même effet que toutes les autres ensemble (les forces du système s’appellent les <b>composantes</b>).</p>
      <p><b>Les principes fondamentaux de la statique</b> :</p>
      <ol><li>Deux forces égales et opposées sont en équilibre.</li><li>Quand une force agit sur un corps, on l’appelle l’<b>action</b> ; la <b>réaction</b> est la force qui naît pour s’y opposer : l’action est égale à la réaction.</li><li>On peut toujours déplacer une force suivant sa ligne d’action sans changer l’équilibre.</li><li>Un système de forces est en équilibre quand, appliqué à un corps libre, il ne modifie ni son état de repos, ni son état de mouvement.</li><li>La résultante d’un système de forces est la force unique qui a le même effet que toutes les autres ensemble.</li></ol>
      ${exbox('m10sys','Quel système de forces ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m10sys'),'M10sys',{cats:[['p','Parallèles'],['c','Concourantes'],['q','Quelconques']],items:[
       ['Les charges posées sur une poutre et les réactions de ses deux appuis','p','Toutes verticales.'],['Trois élingues accrochées au même crochet de grue','c','Elles se rejoignent au crochet.'],['Les poids des wagonnets sur un pont roulant','p',''],['Deux câbles qui retiennent un poteau, attachés au même point en haut','c','']],ok:'Bien classé.'})},
  ],
  prereq:[{t:'Définir une force et énoncer le principe de l’action et de la réaction',cap:'M10a'},{t:'Citer les quatre caractéristiques d’une force et la représenter par un vecteur à l’échelle',cap:'M10b'},{t:'Convertir des forces entre kgf, N et daN',cap:'M10c'},{t:'Reconnaître les systèmes de forces et énoncer les principes de la statique',cap:'M10d'}],
});

/* =================== CHAPITRE 11 — FORCES PARALLÈLES ET ÉQUILIBRE DES POUTRES =================== */
defMC(11, {
  Q:{
    M11aq1:{q:"Deux forces parallèles de même sens : leur résultante vaut…",o:["la somme des deux forces","la différence des deux forces","la plus grande des deux"],g:0,e:"Même sens : R = F + F’, entre les deux forces, plus près de la plus grande.",r:'M11a'},
    M11aq2:{q:"La résultante de deux forces parallèles de même sens est placée…",o:["entre les deux forces, plus près de la plus grande","au milieu, toujours","en dehors des deux forces"],g:0,e:"F . AX = F’ . BX : la plus grande force a le plus petit bras.",r:'M11a'},
    M11bq1:{q:"Deux forces parallèles de sens contraires : la résultante est…",o:["en dehors de AB, du côté de la plus grande force","entre A et B","au milieu de AB"],g:0,e:"R = F − F’, dans le sens de la plus grande, et X tombe en dehors de AB, de son côté.",r:'M11b'},
    M11cq1:{q:"Quelle est la première condition d’équilibre d’une poutre ?",o:["La somme des charges égale la somme des réactions","La somme des moments est positive","Les deux réactions sont égales"],g:0,e:"F1 + F2 + F3 + … = RA + RB. La deuxième condition : la somme des moments est nulle.",r:'M11c'},
  },
  caps:[
    {id:'M11a', sec:'11.1', t:'Deux forces parallèles de même sens', quiz:['M11aq1','M11aq2'], ex:{keys:['M11x1','M11x2'], lbl:'Les deux exercices'},
     body:()=>`<p class="lead">On cherche la résultante R de deux forces parallèles F et F’, appliquées en A et en B (AB = D), par la <b>méthode des moments</b>.</p>
      ${mcFig(parSVG(300,200,5,true),'Même sens : R = F + F’, au point X entre A et B.')}
      ${tbl(['Caractéristique de R','Valeur'],[['Direction','parallèle aux composantes'],['Sens','celui des composantes'],['Intensité','la somme des composantes : '+fm('R = F + F’')],['Point d’application','le point X, entre A et B, tel que '+fm('F . AX = F’ . BX')]])}
      <p>On en tire ${fm('AX = F’ . D / (F + F’)')}. Dans l’exemple : AX = 200 × 5 / 500 = <b>2 m</b>.</p>
      <p class="small"><b>Solution graphique</b> : on porte en A un segment AM égal à F’ (vers le bas), en B un segment BN égal à F (vers le haut), à la même échelle ; la droite MN coupe AB au point X.</p>
      ${(v=>MX(11,'M11x1',1,`Deux forces parallèles de même sens, F = ${v.F} N en A et F’ = ${v.Fp} N en B, avec AB = ${fr(v.D)} m. Calculer la résultante et la distance AX.`,[{lbl:'R',unit:'N',ans:v.F+v.Fp},{lbl:'AX',unit:'m',ans:v.Fp*v.D/(v.F+v.Fp)}]))(vx('M11x1',{F:[300,400,250,600],Fp:[200,100,150,300],D:[5,4,2.5,6]}))}
      ${(v=>MX(11,'M11x2',2,`Deux ouvriers portent une poutre de ${fr(v.D)} m sur laquelle est posée une charge de ${v.Q} N. L’un tient l’extrémité A et porte ${v.FA} N. Où se trouve la charge, mesurée depuis A ? (On néglige le poids de la poutre.)`,[{lbl:'AX',unit:'m',ans:(v.Q-v.FA)*v.D/v.Q}],{hint:'La charge est la résultante des deux efforts : F’ = Q − FA, puis AX = F’ . D / Q.'}))(vx('M11x2',{D:[3,4,2.5,5],Q:[600,800,500,1000],FA:[400,500,300,700]}))}`},
    {id:'M11b', sec:'11.2', t:'Deux forces parallèles de sens contraires', quiz:['M11bq1'], ex:{keys:['M11x3'], lbl:'L’exercice'},
     body:()=>`${mcFig(parSVG(500,200,3,false),'Sens contraires : R = F − F’, au point X en dehors de AB.')}
      ${tbl(['Caractéristique de R','Valeur'],[['Direction','parallèle aux composantes'],['Sens','celui de la plus grande composante'],['Intensité','la différence des composantes : '+fm('R = F − F’')],['Point d’application','X en dehors de AB, du côté de la plus grande composante, tel que '+fm('F . AX = F’ . BX')]])}
      <p>Si F (en A) est la plus grande : ${fm('AX = F’ . D / (F − F’)')}. Dans l’exemple : AX = 200 × 3 / 300 = <b>2 m</b>, à gauche de A.</p>
      <p class="small"><b>Solution graphique</b> : on porte AM = − F’ et BN = + F ; la droite MN coupe le prolongement de AB en X.</p>
      ${(v=>MX(11,'M11x3',3,`Deux forces parallèles de sens contraires : F = ${v.F} N en A (vers le bas) et F’ = ${v.Fp} N en B (vers le haut), AB = ${fr(v.D)} m. Calculer la résultante et la distance AX.`,[{lbl:'R',unit:'N',ans:v.F-v.Fp},{lbl:'AX',unit:'m',ans:v.Fp*v.D/(v.F-v.Fp)}]))(vx('M11x3',{F:[500,600,400,900],Fp:[200,400,100,300],D:[3,2,4,1.5]}))}`},
    {id:'M11c', sec:'11.3', t:'L’équilibre des poutres', quiz:['M11cq1'], ex:{keys:['M11x4','M11x5'], lbl:'Les deux exercices'},
     body:()=>`<p class="lead">On calcule les réactions des appuis A et B d’une poutre par la méthode des moments, avec deux conditions d’équilibre.</p>
      ${tbl(['Condition','Écriture'],[['1re : les forces','F1 + F2 + F3 + … = RA + RB'],['2e : les moments (par rapport à A)','les moments qui font tourner dans un sens égalent ceux qui font tourner dans l’autre : la somme des moments est nulle']])}
      ${mcFig(beamSVG(10,[{x:2,F:10,lbl:'F1 = 10 t'},{x:7,F:4,lbl:'F2 = 4 t'}],'9,2 t','4,8 t','t'),'L’exemple du cours : une poutre de 10 m.')}
      <p><b>Exemple</b> : F1 + F2 = 14 t, donc RA + RB = 14 t. Moments par rapport à A : 10 × 2 + 4 × 7 = 48 = RB × 10, donc <b>RB = 4,8 t</b> et <b>RA = 14 − 4,8 = 9,2 t</b>.</p>
      ${terrain('Le chemin de roulement d’un pont roulant, un palonnier, une passerelle : avant de lever ou de poser une charge, on vérifie ce que supporte chaque appui ou chaque élingue.')}
      ${(v=>MX(11,'M11x4',4,`Une poutre de ${v.L} m repose sur deux appuis A et B. Elle porte une charge de ${v.F} kN à ${v.x} m de A. Calculer les réactions RA et RB.`,[{lbl:'RB',unit:'kN',ans:v.F*v.x/v.L},{lbl:'RA',unit:'kN',ans:v.F-v.F*v.x/v.L}],{hint:'Commence par les moments autour de A : il ne reste que RB comme inconnue.'}))(vx('M11x4',{L:[6,8,5,10],F:[12,20,15,9],x:[2,3,1.5,4]}))}
      ${(v=>MX(11,'M11x5',5,`Une poutre de ${v.L} m sur deux appuis A et B porte F1 = ${v.F1} kN à ${v.x1} m de A et F2 = ${v.F2} kN à ${v.x2} m de A. Calculer RA et RB.`,[{lbl:'RB',unit:'kN',ans:(v.F1*v.x1+v.F2*v.x2)/v.L},{lbl:'RA',unit:'kN',ans:v.F1+v.F2-(v.F1*v.x1+v.F2*v.x2)/v.L}]))(vx('M11x5',{L:[10,8,12,6],F1:[10,6,8,5],x1:[2,1,3,2],F2:[4,10,12,3],x2:[7,5,9,5]}))}`},
  ],
  prereq:[{t:'Composer deux forces parallèles de même sens',cap:'M11a'},{t:'Composer deux forces parallèles de sens contraires',cap:'M11b'},{t:'Calculer les réactions des appuis d’une poutre par la méthode des moments',cap:'M11c'}],
});

/* =================== CHAPITRE 12 — LE MOMENT D’UNE FORCE ET LE CENTRE DE GRAVITÉ =================== */
defMC(12, {
  Q:{
    M12aq1:{q:"Le moment d’une force par rapport à un point vaut…",o:["la force multipliée par la distance perpendiculaire du point à la force","la force divisée par la distance","la force multipliée par le temps"],g:0,e:"M = F . d, en N·m. Plus on tient la clé loin de l’écrou, plus le moment est grand.",r:'M12a'},
    M12aq2:{q:"Par convention, un moment est positif quand la force fait tourner…",o:["dans le sens horlogique","dans le sens anti-horlogique","vers le haut"],g:0,e:"Sens horlogique (des aiguilles d’une montre) : +. Sens anti-horlogique : −.",r:'M12a'},
    M12aq3:{q:"Un couple, c’est…",o:["deux forces égales, parallèles, de sens contraires, appliquées au même solide","deux forces de même sens","une force et sa réaction"],g:0,e:"Un couple n’a pas de résultante : il produit (ou tend à produire) une rotation ou une déformation.",r:'M12a'},
    M12bq1:{q:"Une pièce cylindrique pleine et homogène a son centre de gravité…",o:["au milieu de son diamètre (sur son axe)","sur sa surface extérieure","n’importe où"],g:0,e:"Lorsqu’un corps possède un centre, ce centre est son centre de gravité.",r:'M12b'},
    M12bq2:{q:"Une pièce percée d’un trou : dans la méthode de calcul, le trou…",o:["se soustrait","s’additionne","est ignoré"],g:0,e:"Par manque de matière (évidement, trou…), on soustrait l’élément dans le calcul.",r:'M12b'},
  },
  caps:[
    {id:'M12a', sec:'12.1', t:'Le moment d’une force et le couple', quiz:['M12aq1','M12aq2','M12aq3'], ex:{keys:['M12x1','M12x2','M12x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Une poutre encastrée chargée par une force F à une distance l de l’encastrement : l’effet de rotation dépend à la fois de F et de l. Leur produit s’appelle le <b>moment</b>.</p>
      <div class="tri-row">${fbox('M = F . d','M : moment (N·m) — F : force (N) — d : distance perpendiculaire du point O à la force (m)')}${triangle('M','F','d')}</div>
      ${mcDef('Le couple','Un système de deux forces égales, parallèles, de sens contraires, appliquées à un même corps solide. Son moment vaut M = F . d, avec d le bras de levier perpendiculaire entre les deux forces.')}
      ${mcRem('Un couple <b>n’a pas de résultante</b>. Il produit, ou tend à produire, une rotation ou une déformation. Il est déterminé par son sens.')}
      <p><b>Convention</b> : le moment est <b>positif (+)</b> si la force fait tourner autour de O dans le sens <b>horlogique</b> ; <b>négatif (−)</b> dans le sens anti-horlogique.</p>
      ${terrain('Le serrage d’un boulon se règle en N·m avec une clé dynamométrique : c’est un moment. Une rallonge sur la clé augmente d, donc le moment, pour la même force… et risque d’arracher le filetage.')}
      ${(v=>MX(12,'M12x1',1,`On serre un écrou avec une clé de ${fr(v.d)} m, en exerçant une force de ${v.F} N perpendiculaire au manche, à son extrémité. Quel est le moment de serrage ?`,[{lbl:'M',unit:'N·m',ans:v.F*v.d}]))(vx('M12x1',{d:[0.3,0.25,0.4,0.2],F:[150,200,120,250]}))}
      ${(v=>MX(12,'M12x2',2,`Le fabricant impose un serrage de ${v.M} N·m. La clé dynamométrique mesure ${fr(v.d)} m. Quelle force faut-il exercer au bout du manche ?`,[{lbl:'F',unit:'N',ans:v.M/v.d}]))(vx('M12x2',{M:[60,80,45,120],d:[0.25,0.4,0.3,0.5]}))}
      ${(v=>MX(12,'M12x3',3,`On tourne le volant d’une vanne de ${fr(v.D)} m de diamètre avec les deux mains, chacune exerçant ${v.F} N en sens contraires, sur le bord du volant. Quel est le moment du couple ?`,[{lbl:'M',unit:'N·m',ans:v.F*v.D}],{hint:'Le bras de levier entre les deux forces est le diamètre du volant.'}))(vx('M12x3',{D:[0.4,0.5,0.3,0.6],F:[40,50,60,30]}))}`},
    {id:'M12b', sec:'12.2', t:'Le centre de gravité', quiz:['M12bq1','M12bq2'], ex:{keys:['M12meth','M12x4'], lbl:'La méthode et l’exercice'},
     body:()=>`${mcDef('Le centre de gravité','Le point d’application de la force d’attraction terrestre : le poids de l’objet.')}
      <ul><li>Lorsqu’un objet possède un <b>centre</b>, ce centre est le centre de gravité.</li>
        <li><b>Pièces symétriques</b> : lorsqu’un corps possède un axe de symétrie, le centre de gravité se situe quelque part sur cet axe.</li>
        <li><b>Pièces cylindriques</b> : le centre de gravité se situe au milieu du diamètre.</li>
        <li><b>Décomposition</b> : lorsqu’un corps peut être décomposé en éléments dont on connaît le centre de gravité, le centre de gravité se trouve quelque part sur l’axe qui les relie.</li></ul>
      <p class="small">Dans les exercices, les éléments ont la même épaisseur et la même matière : chaque élément « pèse » en proportion de sa <b>surface</b>. Par manque de matière (évidement, trou…), on <b>soustrait</b> l’élément.</p>
      ${exbox('m12meth','La méthode de calcul','Remets les étapes dans l’ordre.')}
      ${fbox('d = somme des moments / somme des forces','distance du centre de gravité à l’axe choisi')}
      ${(v=>{ const A1=10*v.H, A2=v.B*10, y=(A1*(10+v.H/2)+A2*5)/(A1+A2), x=(A1*5+A2*v.B/2)/(A1+A2);
        return mcFig(equerreSVG(v.B,v.H),'Élément 1 : la branche verticale (10 × '+v.H+') · élément 2 : la base ('+v.B+' × 10).')
        + tbl(['Élément','Surface (mm²)','Distance à XX’ (mm)','Moment'],[['1','10 × '+v.H+' = '+A1,'?','?'],['2',v.B+' × 10 = '+A2,'5',A2*5],['Total',A1+A2,'','?']])
        + MX(12,'M12x4',4,`Une équerre en tôle est faite de deux rectangles : une base de ${v.B} × 10 mm et, sur sa gauche, une branche verticale de 10 × ${v.H} mm posée sur la base. Calculer la distance de son centre de gravité à l’axe XX’ (le bord inférieur), puis à l’axe YY’ (le bord gauche).`,[{lbl:'distance à XX’',unit:'mm',ans:y},{lbl:'distance à YY’',unit:'mm',ans:x}],{hint:'La branche commence à 10 mm de XX’ : son centre est à 10 + H / 2.'}); })(vx('M12x4',{B:[80,100,120,90],H:[60,50,80,70]}))}`,
     mount:root=>mountOrderW(root.querySelector('#m12meth'),'M12meth',{items:['Vérifier si la pièce est symétrique (si oui, le centre de gravité est sur l’axe de symétrie)','Supposer la figure mobile autour d’un axe XX’ (une charnière)','Décomposer la figure en éléments simples dont on connaît le centre de gravité','Appliquer au centre de gravité de chaque élément une force proportionnelle à sa quantité de matière','Chercher la position de la résultante par la méthode des moments : d = somme des moments / somme des forces'],ok:'C’est la bonne méthode.'})},
  ],
  prereq:[{t:'Calculer le moment d’une force et le moment d’un couple',cap:'M12a'},{t:'Appliquer la convention de signe des moments',cap:'M12a'},{t:'Situer le centre de gravité d’une pièce simple et le calculer par la méthode des moments',cap:'M12b'}],
});

})();
