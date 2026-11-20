/* =========================================================
   ÉLECTRICITÉ 3QEM — CHAPITRES 1 À 5
   1 Éclairage d'un local · 2 Le circuit électrique · 3 La matière
   4 Notions générales · 5 Utilisation des appareils de mesures électriques
   ========================================================= */
(function(){

/* ---------- un petit circuit : source, interrupteur, lampe ---------- */
function circSVG(st){
  const closed=st.sw && !st.cut, short=closed && st.short, lamp=closed && !short;
  const col=closed?(short?'var(--bad)':'var(--live)'):'var(--steel)', hot=short?'wire-hot':'';
  return `<svg viewBox="0 0 380 210" role="img" aria-label="Circuit : interrupteur ${st.sw?'fermé':'ouvert'}${st.cut?', fil coupé':''}${short?', court-circuit':''}, lampe ${lamp?'allumée':'éteinte'}">
    <rect x="18" y="72" width="54" height="66" rx="8" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/><text x="45" y="98" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink-2)">+</text><text x="45" y="124" text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink-2)">–</text><text x="45" y="158" text-anchor="middle" font-size="10.5" fill="var(--muted)">source 230 V</text>
    <path class="${hot}" d="M45 72 V32 H150" stroke="${col}" stroke-width="5" fill="none"/>
    ${st.sw?`<line x1="150" y1="32" x2="200" y2="32" stroke="${col}" stroke-width="5"/>`:`<line x1="150" y1="32" x2="194" y2="9" stroke="var(--steel)" stroke-width="5"/>`}
    <circle cx="150" cy="32" r="5" fill="var(--ink)"/><circle cx="200" cy="32" r="5" fill="var(--ink)"/><text x="175" y="54" text-anchor="middle" font-size="10.5" fill="var(--muted)">interrupteur</text>
    <path class="${hot}" d="M200 32 H320 V82" stroke="${col}" stroke-width="5" fill="none"/>
    <circle cx="320" cy="104" r="22" fill="${lamp?'#ffd34d':'var(--surface)'}" stroke="var(--ink-2)" stroke-width="2" ${lamp?'style="filter:drop-shadow(0 0 10px #ffcc33)"':''}/><path d="M304 88 L336 120 M336 88 L304 120" stroke="var(--ink-2)" stroke-width="2"/><text x="352" y="108" font-size="10.5" fill="var(--muted)">lampe</text>
    <path class="${hot}" d="M320 126 V180 H${st.cut?200:45} ${st.cut?'':'V138'}" stroke="${col}" stroke-width="5" fill="none"/>
    ${st.cut?`<path d="M180 180 H45 V138" stroke="var(--steel)" stroke-width="5" fill="none"/><text x="190" y="200" text-anchor="middle" font-size="10.5" fill="var(--bad)">fil interrompu</text>`:''}
    ${st.short?`<path d="M290 82 H282 V128 H290" stroke="#b8732f" stroke-width="5" fill="none"/><line x1="290" y1="82" x2="320" y2="82" stroke="#b8732f" stroke-width="4"/><line x1="290" y1="128" x2="320" y2="128" stroke="#b8732f" stroke-width="4"/><text x="274" y="108" text-anchor="end" font-size="10.5" fill="var(--bad)">fil de cuivre</text>`:''}
  </svg>`;
}
function mountCirc(root){
  const box=root.querySelector('#a1sim'), st=WS.a1sim||(WS.a1sim={sw:true,cut:false,short:false}), mem=DR().a1sim||(DR().a1sim={});
  const draw=()=>{
    const closed=st.sw&&!st.cut, short=st.short&&closed;
    if(closed&&!short) mem.on=true; if(!closed) mem.off=true; if(short) mem.short=true;
    if(mem.on&&mem.off&&mem.short&&!P().ex.A1sim){ save(); exSet('A1sim'); }
    box.innerHTML=`<div style="max-width:470px;margin:0 auto">${circSVG(st)}</div>
      <div class="row wrap" style="margin-top:10px;justify-content:center"><button class="toggle ${st.sw?'on':''}" data-a1sw><span class="sw"></span>Interrupteur ${st.sw?'fermé':'ouvert'}</button>
        <button class="btn sm" data-a1cut>${st.cut?'Réparer le fil':'Interrompre un fil'}</button>
        <button class="btn sm" data-a1sh style="${st.short?'border-color:var(--bad);color:var(--bad)':''}">${st.short?'Retirer le fil de cuivre':'Relier les deux bornes de la lampe avec un fil de cuivre'}</button></div>
      <p class="small" style="margin:10px 0 0">${short?'<b style="color:var(--bad)">DANGER : court-circuit.</b> Le récepteur ne se trouve plus dans le circuit : le courant revient à la source par le fil de cuivre, sans rien pour le limiter.':closed?'<b style="color:var(--ok)">Circuit fermé :</b> le courant fait le tour complet, la lampe éclaire.':'<b>Circuit ouvert :</b> la moindre interruption, et la lampe s’éteint.'}</p>
      <div class="tiny muted" style="margin-top:6px">${mem.on?'✓':'○'} lampe allumée · ${mem.off?'✓':'○'} circuit interrompu · ${mem.short?'✓':'○'} court-circuit</div>`;
    box.querySelector('[data-a1sw]').onclick=()=>{ st.sw=!st.sw; draw(); };
    box.querySelector('[data-a1cut]').onclick=()=>{ st.cut=!st.cut; draw(); };
    box.querySelector('[data-a1sh]').onclick=()=>{ st.short=!st.short; draw(); };
  };
  draw();
}

/* ---------- le schéma normalisé du circuit d'éclairage ---------- */
const schemaSVG = () => `<svg viewBox="0 0 420 200" role="img" aria-label="Schéma : source, fusible, interrupteur et lampe en série">
  <g stroke="var(--ink)" stroke-width="2.5" fill="none">
    <path d="M60 60 V30 H130"/><rect x="130" y="22" width="44" height="16" fill="var(--surface)"/><line x1="130" y1="30" x2="174" y2="30"/>
    <path d="M174 30 H230"/><line x1="230" y1="30" x2="268" y2="14"/><path d="M272 30 H350 V80"/>
    <circle cx="350" cy="100" r="20" fill="var(--surface)"/><path d="M336 86 L364 114 M364 86 L336 114"/>
    <path d="M350 120 V170 H60 V122"/>
    <line x1="38" y1="80" x2="82" y2="80" stroke-width="3"/><line x1="48" y1="94" x2="72" y2="94" stroke-width="6"/><line x1="38" y1="108" x2="82" y2="108" stroke-width="3"/><line x1="48" y1="122" x2="72" y2="122" stroke-width="6"/><path d="M60 60 V80 M60 122 V122"/>
  </g>
  <circle cx="230" cy="30" r="3.5" fill="var(--ink)"/><circle cx="272" cy="30" r="3.5" fill="var(--ink)"/>
  <g font-size="12" fill="var(--muted)" text-anchor="middle"><text x="60" y="148">générateur</text><text x="152" y="60">fusible</text><text x="250" y="60">interrupteur</text><text x="350" y="146">lampe</text><text x="205" y="190">conducteurs (la ligne)</text></g>
  <g font-size="13" font-weight="800" fill="var(--ink-2)"><text x="26" y="84">+</text><text x="28" y="126">–</text></g></svg>`;

/* ---------- l'atome : électrons, ions ---------- */
function atomSVG(ne){
  const P=3, inner=Math.min(ne,2), outer=Math.max(0,ne-2);
  const el=(r,a)=>`<circle cx="${130+r*Math.cos(a)}" cy="${110+r*Math.sin(a)}" r="8" fill="var(--elec)"/><text x="${130+r*Math.cos(a)}" y="${114+r*Math.sin(a)}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">–</text>`;
  return `<svg viewBox="0 0 260 220" role="img" aria-label="Atome à 3 protons et ${ne} électrons">
    <circle cx="130" cy="110" r="44" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="5 5"/><circle cx="130" cy="110" r="88" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="5 5"/>
    <circle cx="130" cy="110" r="20" fill="var(--bad-soft)" stroke="var(--bad)" stroke-width="2"/><text x="130" y="116" text-anchor="middle" font-size="15" font-weight="800" fill="var(--bad)">+${P}</text>
    <g>${[...Array(inner)].map((_,i)=>el(44,Math.PI*(i?0.15:1.15))).join('')}<animateTransform attributeName="transform" type="rotate" from="0 130 110" to="360 130 110" dur="6s" repeatCount="indefinite"/></g>
    <g>${[...Array(outer)].map((_,i)=>el(88,-Math.PI/2+i*Math.PI*0.7)).join('')}<animateTransform attributeName="transform" type="rotate" from="0 130 110" to="360 130 110" dur="14s" repeatCount="indefinite"/></g>
    <text x="10" y="18" font-size="11" fill="var(--muted)">couche K</text><text x="10" y="212" font-size="11" fill="var(--muted)">couche L (extérieure)</text></svg>`;
}
function mountAtom(root){
  const box=root.querySelector('#a3atom'), st=WS.a3atom||(WS.a3atom={ne:3}), mem=DR().a3atom||(DR().a3atom={});
  const draw=()=>{
    const q=3-st.ne, etat = q===0?'<b>Atome neutre</b> : 3 protons, 3 électrons.':q>0?`<b style="color:var(--bad)">Ion positif (ion⁺)</b> : il a perdu ${q} électron${q>1?'s':''}, la charge positive domine.`:`<b style="color:var(--elec)">Ion négatif (ion⁻)</b> : il a gagné ${-q} électron${-q>1?'s':''}, la charge négative domine.`;
    if(q>0) mem.p=true; if(q<0) mem.n=true;
    if(mem.p&&mem.n&&!P().ex.A3ion){ save(); exSet('A3ion'); }
    box.innerHTML=`<div style="max-width:300px;margin:0 auto">${atomSVG(st.ne)}</div>
      <div class="row wrap" style="justify-content:center"><button class="btn sm" data-a3m ${st.ne<=1?'disabled':''}>Arracher un électron libre</button><button class="btn sm" data-a3p ${st.ne>=6?'disabled':''}>Ajouter un électron</button></div>
      <p class="small" style="text-align:center;margin:8px 0 0">${etat}</p><div class="tiny muted" style="text-align:center">${mem.p?'✓':'○'} ion positif · ${mem.n?'✓':'○'} ion négatif</div>`;
    box.querySelector('[data-a3m]').onclick=()=>{ st.ne--; draw(); };
    box.querySelector('[data-a3p]').onclick=()=>{ st.ne++; draw(); };
  };
  draw();
}

/* ---------- le sens du courant ---------- */
function sensSVG(conv){
  const arrow=(x,y,dir)=>{ const d={r:'M0 -6 L10 0 L0 6',l:'M10 -6 L0 0 L10 6',u:'M-6 10 L0 0 L6 10',dn:'M-6 0 L0 10 L6 0'}[dir]; return `<path d="${d}" transform="translate(${x},${y})" fill="none" stroke="${conv?'var(--live)':'var(--elec)'}" stroke-width="3"/>`; };
  /* électrons : du – vers le + à l'extérieur ; conventionnel : du + vers le – à l'extérieur */
  const top = conv?'r':'l', bot = conv?'l':'r';
  return `<svg viewBox="0 0 380 190" role="img" aria-label="Sens ${conv?'conventionnel':'des électrons'} du courant">
    <path d="M60 64 V30 H320 V75 M320 115 V160 H60 V126" stroke="var(--ink-2)" stroke-width="4" fill="none"/>
    <path class="flow" d="M60 64 V30 H320 V75 M320 115 V160 H60 V126" stroke="${conv?'var(--live)':'var(--elec)'}" stroke-width="4" fill="none" style="${conv?'':'animation-direction:reverse'}"/>
    <rect x="34" y="64" width="52" height="62" rx="7" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/><text x="60" y="88" text-anchor="middle" font-size="14" font-weight="800">+</text><text x="60" y="114" text-anchor="middle" font-size="14" font-weight="800">–</text>
    <circle cx="320" cy="95" r="20" fill="#ffd34d" stroke="var(--ink-2)" stroke-width="2"/><path d="M306 81 L334 109 M334 81 L306 109" stroke="var(--ink-2)" stroke-width="2"/>
    ${arrow(190,30,top)}${arrow(190,160,bot)}
    <text x="190" y="18" text-anchor="middle" font-size="12" fill="var(--muted)">${conv?'du + vers le – (à l’extérieur)':'électrons : du – vers le + (à l’extérieur)'}</text></svg>`;
}
function mountSens(root){
  const box=root.querySelector('#a4sens'), st=WS.a4sens||(WS.a4sens={conv:false});
  const draw=()=>{ box.innerHTML=`<div style="max-width:440px;margin:0 auto">${sensSVG(st.conv)}</div><div class="row" style="justify-content:center"><div class="seg"><button class="${st.conv?'':'on'}" data-s="0">Sens des électrons</button><button class="${st.conv?'on':''}" data-s="1">Sens conventionnel</button></div></div>`;
    box.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{ st.conv=b.dataset.s==='1'; draw(); }); };
  draw();
}

/* =================== CHAPITRE 1 — ÉCLAIRAGE D'UN LOCAL =================== */
defAF(1, {
  Q:{
    A1aq1:{q:"Dans le circuit de la chaufferie, quel élément joue le rôle d’organe de commande ?",o:["La lampe","L’interrupteur simple","Le fil de cuivre"],g:1,e:"La source alimente, le fil conduit, la lampe reçoit l’énergie et l’interrupteur commande : il ouvre ou ferme le circuit.",r:'A1a'},
    A1bq1:{q:"On relie directement les deux fils de la source avec un fil de cuivre. Que se passe-t-il ?",o:["La lampe éclaire plus fort","Un court-circuit : le récepteur n’est plus dans le circuit, c’est dangereux","Rien, le cuivre est un bon conducteur"],g:1,e:"Le circuit est « court » : plus aucun récepteur ne limite le courant. C’est justement parce que le cuivre conduit bien que c’est dangereux.",r:'A1b'},
    A1bq2:{q:"Pour que la lampe éclaire, le circuit doit être…",o:["ouvert","fermé","relié à la terre"],g:1,e:"Le courant doit suivre un chemin ininterrompu. La moindre interruption, et la lampe s’éteint.",r:'A1b'},
    A1cq1:{q:"Pourquoi entoure-t-on le fil de cuivre de plastique ?",o:["Pour qu’il conduise mieux","Pour protéger l’utilisateur du courant électrique","Pour la couleur uniquement"],g:1,e:"Le plastique est un isolant : il ne laisse pas passer le courant. Le rôle des isolants est de protéger l’utilisateur.",r:'A1c'},
  },
  caps:[
    {id:'A1a', sec:'1.1 — 1.2', t:'Le problème : éclairer la chaufferie', quiz:['A1aq1'], ex:{keys:['A1el'], lbl:'Le rôle de chaque élément'},
     body:()=>`${progRef(['Distinguer circuit ouvert et circuit fermé (CM2D)','Distinguer les composants d’un circuit électrique (CM2D)','Schématiser un circuit électrique (CM2D)'],'p. 25')}
      <p class="lead">On désire réaliser l’éclairage d’une chaufferie de l’atelier d’électricité : un petit local, avec une seule porte d’accès.</p>
      <p>Le but du montage est donc d’<b>allumer une lampe d’un seul endroit</b>. Quels éléments faut-il pour réaliser ce circuit ?</p>
      ${tbl(['Il faut…','C’est…'],[['Une source de courant (230 V)','l’alimentation'],['Du fil','le conducteur'],['Une lampe','le récepteur'],['Un interrupteur simple','l’organe de commande']])}
      ${exbox('a1el','Quel est le rôle de chaque élément ?')}`,
     mount:root=>mountSortW(root.querySelector('#a1el'),'A1el',{cats:[['al','Alimentation'],['co','Conducteur'],['re','Récepteur'],['cm','Commande']],items:[
       ['La prise de courant 230 V','al'],['Le fil de cuivre','co'],['La lampe','re'],['L’interrupteur simple','cm'],['Une pile de 4,5 V','al'],['Un bouton-poussoir','cm']],ok:'Juste : alimentation, conducteur, récepteur, commande.'})},
    {id:'A1b', sec:'1.2.4 — 1.2.5', t:'Les expériences : ouvert, fermé, court-circuit', quiz:['A1bq1','A1bq2'], ex:{keys:['A1sim'], lbl:'Les trois situations du circuit'},
     body:()=>`<p class="lead">Fais les expériences du cours sur le circuit ci-dessous : ferme et ouvre l’interrupteur, interromps un fil, puis relie les deux bornes de la lampe avec un fil de cuivre.</p>
      <div class="figure" id="a1sim"></div>
      <div class="note bad" style="margin-top:14px"><b>Remarque — danger</b>Quand on relie directement les deux fils de la source (ou les deux bornes de la lampe) avec un fil de cuivre, le récepteur ne se retrouve plus dans le circuit : on dit que le circuit est « court ». Il y a DANGER, car c’est un <b>court-circuit</b>.</div>
      <h3>Ce que l’expérience montre</h3>
      <p>L’ampoule n’éclaire pas dans toutes les conditions. Pour que l’ampoule éclaire, il faut que le circuit soit <b>FERMÉ</b>. S’il y a la moindre interruption dans le circuit, la lampe s’éteint.</p>
      <p class="small muted">Et l’interrupteur, est-il nécessaire ? Sans lui, la lampe brûle tant que la source est branchée : c’est lui qui permet d’ouvrir et de fermer le circuit sans toucher aux fils.</p>`,
     mount:mountCirc},
    {id:'A1c', sec:'1.2.5', t:'Conducteurs et isolants', quiz:['A1cq1'], ex:{keys:['A1ci'], lbl:'Conducteur ou isolant ?'},
     body:()=>`<p>Pour raccorder les éléments du circuit, on utilise du <b>cuivre</b>, parce qu’il est bon conducteur du courant électrique.</p>
      <p>Autour du fil de cuivre, il y a du <b>plastique</b>, qui ne laisse pas passer le courant électrique : c’est un <b>ISOLANT</b>.</p>
      ${defBox('Définition','Le rôle des isolants est de protéger l’utilisateur du courant électrique.')}
      ${exbox('a1ci','Conducteur ou isolant ?','Le cours demande de citer trois bons conducteurs et trois isolants : classe ceux-ci.')}`,
     mount:root=>mountSortW(root.querySelector('#a1ci'),'A1ci',{cats:[['c','Conducteur'],['i','Isolant']],items:[
       ['Cuivre','c'],['Aluminium','c'],['Or','c'],['Argent','c'],['Gaine en PVC','i'],['Caoutchouc','i'],['Verre','i'],['Porcelaine','i'],['Air sec','i'],['Papier','i']],ok:'Les métaux conduisent ; plastiques, caoutchouc, verre, porcelaine, air sec et papier isolent.'})},
  ],
  prereq:[{t:'Distinguer les conducteurs de l’électricité des isolants',cap:'A1c'},{t:'Retrouver les principaux constituants d’un circuit électrique',cap:'A1a'},{t:'Comprendre que le courant doit suivre un chemin ininterrompu pour produire ses effets',cap:'A1b'},{t:'Réaliser un premier montage en respectant les mesures de sécurité',cap:null}],
});

/* =================== CHAPITRE 2 — LE CIRCUIT ÉLECTRIQUE =================== */
defAF(2, {
  Q:{
    A2aq1:{q:"Un moteur transforme l’énergie électrique en énergie…",o:["lumineuse","thermique","mécanique"],g:2,e:"Lampe : lumineuse. Radiateur : thermique. Moteur : mécanique. Accumulateur en charge : chimique.",r:'A2a'},
    A2aq2:{q:"Quelle est la fonction d’un fusible ?",o:["Ouvrir et fermer le circuit à la demande","Protéger le circuit en cas de fonctionnement anormal","Mesurer le courant"],g:1,e:"C’est un appareil de sécurité. L’ouverture et la fermeture à la demande, c’est le rôle des appareils de commande.",r:'A2a'},
    A2bq1:{q:"Pourquoi utilise-t-on un schéma avec des symboles normalisés ?",o:["Parce qu’il est plus joli","Parce qu’il peut être lu et compris par l’utilisateur, le technicien et l’ingénieur","Parce qu’il remplace le câblage"],g:1,e:"Les symboles sont les mêmes pour tout le monde : n’importe quel électricien lit ton schéma.",r:'A2b'},
    A2cq1:{q:"L’interrupteur simple est en position « 0 ». La lampe est…",o:["allumée (1)","éteinte (0)","à moitié allumée"],g:1,e:"Position 0 : circuit ouvert, lampe éteinte. Position 1 : circuit fermé, lampe allumée.",r:'A2c'},
  },
  caps:[
    {id:'A2a', sec:'2.1 — 2.2', t:'Les éléments du circuit électrique', quiz:['A2aq1','A2aq2'], ex:{keys:['A2el','A2en'], lbl:'Les deux classements'},
     body:()=>`${progRef(['Distinguer un circuit ouvert d’un circuit fermé (CM2D)','Distinguer les différents composants d’un circuit électrique (CM2D)','Schématiser un circuit électrique à l’aide de symboles normalisés (CM2D)'],'p. 25')}
      ${defBox('Définition','Le circuit électrique est constitué par des <b>conducteurs</b> reliant les bornes du <b>générateur</b> à celles du <b>récepteur</b>. Le circuit peut être ouvert ou fermé à l’aide d’un <b>interrupteur</b>.')}
      ${tbl(['Élément','Sa fonction'],[['La source (générateur)','Produire l’électricité'],['Les conducteurs','Amener le courant électrique aux récepteurs'],['Les isolants','Ne laisser passer que très difficilement le courant électrique'],['Les récepteurs','Transformer l’énergie électrique en énergie lumineuse, thermique, mécanique, chimique…'],['Les appareils de commande','Ouvrir ou fermer un circuit électrique'],['Les appareils de sécurité','Protéger le circuit en cas de fonctionnement anormal (fusibles)'],['Les appareils de mesure','Renseigner sur le fonctionnement de l’installation']])}
      ${exbox('a2el','Range chaque appareil','Le cours te demande des exemples pour chaque élément : en voici, à classer.')}
      ${exbox('a2en','Quelle énergie produit le récepteur ?')}`,
     mount:root=>{
       mountSortW(root.querySelector('#a2el'),'A2el',{cats:[['g','Générateur'],['r','Récepteur'],['c','Commande'],['s','Sécurité'],['m','Mesure']],items:[
         ['Pile','g'],['Dynamo','g'],['Lampe','r'],['Moteur','r'],['Interrupteur','c'],['Bouton-poussoir','c'],['Fusible','s'],['Disjoncteur','s'],['Voltmètre','m'],['Ampèremètre','m']],ok:'Bien classé.'});
       mountSortW(root.querySelector('#a2en'),'A2en',{cats:[['l','Lumineuse'],['t','Thermique'],['m','Mécanique'],['c','Chimique']],items:[
         ['Une lampe','l'],['Un radiateur','t'],['Un moteur','m'],['Un accumulateur qu’on recharge','c'],['Un fer à repasser','t'],['Une perceuse','m']],ok:'Juste : chaque récepteur transforme l’énergie électrique en une autre forme d’énergie.'}); }},
    {id:'A2b', sec:'2.3', t:'Le schéma électrique', quiz:['A2bq1'], ex:{keys:['A2sy'], lbl:'Lire le schéma'},
     body:()=>`${defBox('Définition','Un schéma électrique est un circuit électrique simplifié qui permet, en utilisant des <b>symboles normalisés</b>, de représenter un circuit électrique.')}
      <p>Le schéma a l’avantage de pouvoir être lu et compris par l’utilisateur, le technicien et l’ingénieur. Voici le circuit de la chaufferie, dessiné avec les symboles :</p>
      <div class="figure"><div style="max-width:460px;margin:0 auto">${schemaSVG()}</div></div>
      ${exbox('a2sy','Dans quel ordre le courant rencontre-t-il les éléments ?','Pars de la borne + du générateur.')}`,
     mount:root=>mountOrderW(root.querySelector('#a2sy'),'A2sy',{items:['La borne + du générateur','Le fusible','L’interrupteur','La lampe','La borne – du générateur'],shuffle:[3,0,4,2,1],ok:'Le courant fait le tour complet du circuit.'})},
    {id:'A2c', sec:'2.4', t:'Circuit ouvert, circuit fermé', quiz:['A2cq1'], ex:{keys:['A2tv'], lbl:'La table de vérité'},
     body:()=>`<div class="grid g2" style="gap:12px"><div class="card pad"><h3 style="margin-top:0">Circuit ouvert</h3><p class="small">Le récepteur ne fonctionne pas : le circuit est <b>ouvert</b> par un <b>interrupteur</b>. La lampe est <b>éteinte</b>, l’interrupteur est <b>ouvert</b>.</p></div>
      <div class="card pad"><h3 style="margin-top:0">Circuit fermé</h3><p class="small">Le récepteur fonctionne : le circuit est <b>fermé</b> par un <b>interrupteur</b>. La lampe est <b>allumée</b>, l’interrupteur est <b>fermé</b>.</p></div></div>
      <p>L’interrupteur simple permet d’allumer ou d’éteindre une ou plusieurs lampes d’un seul endroit. Il possède deux positions : l’action se traduit par la position « 1 » (fermé) ou « 0 » (ouvert).</p>
      ${tbl(['Position de l’interrupteur simple','État de la lampe'],[['0 (ouvert)','0 (éteinte)'],['1 (fermé)','1 (allumée)']])}
      ${exbox('a2tv','Complète la table de vérité')}`,
     mount:root=>mountSortW(root.querySelector('#a2tv'),'A2tv',{cats:[['0','0'],['1','1']],items:[['Interrupteur fermé → la lampe vaut…','1'],['Interrupteur ouvert → la lampe vaut…','0'],['Lampe allumée → l’interrupteur vaut…','1'],['Lampe éteinte (lampe en bon état) → l’interrupteur vaut…','0']],ok:'1 = fermé = allumée ; 0 = ouvert = éteinte.'})},
  ],
  prereq:[{t:'Nommer les éléments d’un circuit : générateur, ligne, commande, récepteur, protection, mesure',cap:'A2a'},{t:'Schématiser un circuit électrique simple à l’aide des symboles normalisés',cap:'A2b'},{t:'Distinguer circuit ouvert et circuit fermé et en déduire l’état du récepteur',cap:'A2c'}],
});

/* =================== CHAPITRE 3 — LA MATIÈRE =================== */
defAF(3, {
  Q:{
    A3aq1:{q:"Qu’est-ce qu’une molécule ?",o:["La plus petite partie d’un corps qui garde encore toutes les propriétés chimiques de ce corps","Une particule chargée négativement","Le noyau d’un atome"],g:0,e:"Une goutte d’eau microscopique garde toutes les propriétés de l’eau : on est arrivé à la molécule.",r:'A3a'},
    A3aq2:{q:"De quoi se compose une molécule d’eau (H₂O) ?",o:["De deux atomes d’oxygène et d’un atome d’hydrogène","De deux atomes d’hydrogène et d’un atome d’oxygène","D’un seul atome"],g:1,e:"Deux petits ensembles identiques (hydrogène) et un plus grand (oxygène).",r:'A3a'},
    A3bq1:{q:"Deux corps chargés d’électricité de même signe…",o:["s’attirent","se repoussent","n’ont aucun effet l’un sur l’autre"],g:1,e:"Même signe : ils se repoussent. Signes contraires : ils s’attirent.",r:'A3b'},
    A3bq2:{q:"Pourquoi appelle-t-on « électrons libres » les électrons des couches extérieures ?",o:["Parce qu’ils n’ont pas de charge","Parce qu’ils sont moins fortement attirés par le noyau : on peut facilement les forcer à quitter leur orbite","Parce qu’ils sont dans le noyau"],g:1,e:"Les électrons des couches intérieures, eux, quittent difficilement leur orbite : ce sont les électrons internes.",r:'A3b'},
    A3cq1:{q:"Un atome perd un électron. Il devient…",o:["un ion positif (ion⁺)","un ion négatif (ion⁻)","un neutron"],g:0,e:"Il lui manque une charge négative : la charge positive domine.",r:'A3c'},
    A3cq2:{q:"Qu’est-ce qui constitue un courant électrique dans un conducteur ?",o:["Le déplacement des protons","Le déplacement des électrons libres","La vibration des atomes"],g:1,e:"À retenir : c’est le déplacement des électrons libres qui constitue un courant électrique.",r:'A3c'},
    A3cq3:{q:"Pour que l’atome du dessin (3 électrons) soit électriquement neutre, le noyau doit comporter…",o:["1 proton","3 protons","6 protons"],g:1,e:"Dans un atome neutre, le nombre d’électrons est exactement égal au nombre de protons.",r:'A3c'},
  },
  caps:[
    {id:'A3a', sec:'3.1 — 3.3', t:'Molécules, atomes et états de la matière', quiz:['A3aq1','A3aq2'], ex:{keys:['A3zoom','A3et'], lbl:'Le zoom et les trois états'},
     body:()=>`${progRef(['Expliquer physiquement la notion de courant électrique (CM2D)'],'p. 25')}
      <p class="lead">Pour comprendre ce qu’est le courant électrique, il faut connaître la constitution de la matière.</p>
      <p>Prends une goutte d’eau (H₂O) et partage-la en deux, puis recommence des milliers de fois : tu obtiens une goutte si petite qu’il faudrait le meilleur microscope pour l’apercevoir. Elle a pourtant toutes les propriétés chimiques de l’eau : on est arrivé à la <b>molécule</b>.</p>
      ${defBox('Définition','La molécule est la plus petite partie d’un corps qui garde encore toutes les propriétés chimiques de ce corps.')}
      <p>En grossissant encore, on voit que la molécule d’eau se compose de deux petits ensembles identiques, les atomes d’<b>hydrogène</b> (H), et d’un plus grand, l’atome d’<b>oxygène</b> (O). Toutes les matières sont constituées de molécules, et ces molécules sont des combinaisons d’atomes. Il en existe plus d’une centaine de sortes, rangées dans le tableau de Mendeleïev : oxygène, carbone, hydrogène, fer, or, azote…</p>
      ${exbox('a3zoom','Du plus grand au plus petit')}
      <h3>Les trois états de la matière</h3>
      ${tbl(['État','Les molécules…'],[['Gazeux','sont toutes libres, en perpétuel mouvement désordonné, séparées par de très grands espaces'],['Liquide','sont plus proches, disposées sans ordre, avec moins de liberté'],['Solide','sont très rapprochées, pratiquement fixes, et ne vibrent que très légèrement']])}
      ${exbox('a3et','Quel état ?')}`,
     mount:root=>{
       mountOrderW(root.querySelector('#a3zoom'),'A3zoom',{items:['Une goutte d’eau','Une molécule d’eau (H₂O)','Un atome d’hydrogène','Le noyau et son électron'],shuffle:[2,3,0,1],ok:'Matière → molécules → atomes → noyau et électrons.'});
       mountSortW(root.querySelector('#a3et'),'A3et',{cats:[['g','Gazeux'],['l','Liquide'],['s','Solide']],items:[['Molécules pratiquement fixes','s'],['Molécules libres, très éloignées les unes des autres','g'],['Molécules sans ordre, mais plus proches qu’un gaz','l'],['La vapeur qui sort d’une bouilloire','g'],['Un fil de cuivre','s'],['L’eau du robinet','l']],ok:'Juste.'}); }},
    {id:'A3b', sec:'3.4', t:'La structure de l’atome', quiz:['A3bq1','A3bq2'], ex:{keys:['A3cou'], lbl:'Les couches électroniques'},
     body:()=>`<p>La structure de l’atome s’appuie sur trois lois de la physique :</p>
      <ol><li>Il existe deux sortes de charges électriques : des charges <b>positives</b> (à la borne + d’un générateur) et des charges <b>négatives</b> (à la borne –).</li><li>Deux corps chargés d’électricité de <b>même signe se repoussent</b> (+ / +).</li><li>Deux corps chargés d’électricité de <b>signes contraires s’attirent</b> (+ / −).</li></ol>
      <p>On peut se représenter l’atome comme un soleil autour duquel tournent des planètes : les planètes sont les <b>électrons</b> (charge négative), le soleil est le <b>noyau</b> (charge positive). Le noyau contient des <b>protons</b> (charges positives) et des <b>neutrons</b> (électriquement neutres). Dans un atome neutre, il y a exactement autant d’électrons que de protons.</p>
      <p>Le noyau attire l’électron (force F1) ; comme l’électron tourne très vite, la force centrifuge (F2) l’en éloigne. Ces deux forces opposées maintiennent l’électron à distance constante du noyau.</p>
      <p>Les électrons tournent sur 7 orbites, appelées couches, désignées par des lettres en partant du noyau. Les électrons des couches extérieures, moins attirés par le noyau, sont les <b>électrons libres</b> ; ceux des couches intérieures sont les <b>électrons internes</b>.</p>
      ${exbox('a3cou','Combien d’électrons au maximum sur chaque couche ?','Le tableau du cours : à retenir.')}`,
     mount:root=>mountDrillW(root.querySelector('#a3cou'),'A3cou',{rows:[{q:'Couche K (rang 1)',unit:'e⁻',ans:2,tol:0},{q:'Couche L (rang 2)',unit:'e⁻',ans:8,tol:0},{q:'Couche M (rang 3)',unit:'e⁻',ans:18,tol:0},{q:'Couche N (rang 4)',unit:'e⁻',ans:32,tol:0},{q:'Couche O (rang 5)',unit:'e⁻',ans:18,tol:0},{q:'Couche P (rang 6)',unit:'e⁻',ans:8,tol:0},{q:'Couche Q (rang 7)',unit:'e⁻',ans:2,tol:0}],ok:'2 – 8 – 18 – 32 – 18 – 8 – 2.',hint:'Le tableau est symétrique autour de la couche N.'})},
    {id:'A3c', sec:'3.5 — 3.7', t:'Les ions, les conducteurs et les isolants', quiz:['A3cq1','A3cq2','A3cq3'], ex:{keys:['A3ion','A3lib'], lbl:'L’atome et les électrons libres'},
     body:()=>`<p>À l’état normal, l’atome est électriquement neutre : il a autant de protons que d’électrons. S’il <b>gagne ou perd</b> un ou plusieurs électrons périphériques, il devient un <b>ION</b>. Essaie :</p>
      <div class="figure" id="a3atom"></div>
      <div class="note"><b>Remarque</b>Les matériaux conducteurs (cuivre, or…) ont 1 ou 2 électrons sur la couche périphérique. Les isolants (PVC…) en ont 6 ou 7 sur leur dernière couche.</div>
      <p>Un électron libre peut quitter son atome pour passer à un autre. Différents moyens permettent de le libérer :</p>
      ${exbox('a3lib','Quel moyen libère les électrons ?')}
      ${defBox('À retenir','C’est le déplacement des électrons libres qui constitue un courant électrique dans un conducteur.')}
      <h3>Conducteurs et isolants</h3>
      <p><b>Conducteurs</b> : dans les métaux, les électrons de la couche périphérique quittent facilement leur orbite. Un conducteur est fait d’ions positifs entre lesquels circulent des électrons libres. Mais tant qu’ils se déplacent au hasard, il n’y a aucun courant. Exemples : or, argent, cuivre, aluminium…</p>
      <p><b>Isolants</b> : le noyau retient si fort tous les électrons qu’aucun ne passe d’un atome à l’autre. Un isolant peut pourtant devenir un très médiocre conducteur : s’il contient des impuretés conductrices (eau et sel…), sous une tension très importante (l’éclair qui déchire l’air), à température élevée, s’il est imprégné d’une matière conductrice, ou s’il est entamé mécaniquement. Exemples : l’air, l’eau pure, le papier, le verre, les matières plastiques, le caoutchouc synthétique…</p>
      ${terrain('Une gaine entaillée par un coup de cutter, un câble qui a chauffé ou une boîte de dérivation pleine d’eau : l’isolant ne protège plus. C’est pour ça qu’on remplace un câble abîmé au lieu de le rafistoler.')}`,
     mount:root=>{ mountAtom(root);
       mountSortW(root.querySelector('#a3lib'),'A3lib',{cats:[['ch','Choc'],['ca','Chaleur'],['fr','Frottement'],['ci','Chimie'],['ma','Magnétisme'],['lu','Lumière']],items:[['Le briquet « électronique » (piézo-électrique)','ch'],['Le thermocouple d’un thermomètre haute température','ca'],['L’électricité statique d’une voiture par temps sec','fr'],['La pile et l’accumulateur','ci'],['La dynamo : un aimant tourne dans une bobine','ma'],['La cellule photovoltaïque','lu']],ok:'Les six moyens du cours.'}); }},
  ],
  prereq:[{t:'Décrire la constitution de la matière : molécules, atomes, ions',cap:'A3a'},{t:'Situer protons, neutrons et électrons dans la structure de l’atome',cap:'A3b'},{t:'Distinguer un conducteur d’un isolant à partir de sa structure atomique',cap:'A3c'},{t:'Expliquer l’origine du courant électrique par le déplacement des électrons libres',cap:'A3c'}],
});

/* =================== CHAPITRE 4 — NOTIONS GÉNÉRALES =================== */
defAF(4, {
  Q:{
    A4aq1:{q:"Que produit en permanence un générateur ?",o:["Un excès d’électrons libres à une borne (–) et un manque à l’autre (+)","Des protons","Un courant, même circuit ouvert"],g:0,e:"C’est cette différence entre les deux bornes qui pousse les électrons dans le circuit.",r:'A4a'},
    A4aq2:{q:"Comment raccorde-t-on un voltmètre ?",o:["En série dans le circuit","Directement aux bornes entre lesquelles on veut mesurer la tension","Hors tension uniquement"],g:1,e:"La tension existe entre deux points : le voltmètre se branche sur ces deux points.",r:'A4a'},
    A4bq1:{q:"À l’extérieur du générateur, les électrons se déplacent…",o:["de la borne – vers la borne +","de la borne + vers la borne –","dans les deux sens"],g:0,e:"La borne + manque d’électrons : elle les capte à la borne –. Le sens conventionnel, utilisé dans l’industrie, est l’inverse : du + vers le – à l’extérieur.",r:'A4b'},
    A4bq2:{q:"Pourquoi place-t-on un récepteur dans le circuit ?",o:["Pour décharger plus vite la pile","Pour limiter le passage des électrons : sans lui, c’est le court-circuit","Pour inverser le sens du courant"],g:1,e:"Sans récepteur, les charges rejoignent instantanément la borne + : échauffement, fusion du conducteur.",r:'A4b'},
    A4cq1:{q:"Quelle lampe a la plus grande résistance ?",o:["La lampe de 25 W","La lampe de 100 W","Elles ont la même"],g:0,e:"Le filament de la 25 W offre une résistance plus grande : moins de courant passe, elle dégage moins de lumière et de chaleur.",r:'A4c'},
    A4cq2:{q:"Que faut-il absolument respecter pour mesurer une résistance à l’ohmmètre ?",o:["La résistance doit être sous tension","La résistance ne peut pas être sous tension","L’ohmmètre se met en série"],g:1,e:"L’ohmmètre se raccorde directement sur la résistance, hors tension.",r:'A4c'},
  },
  caps:[
    {id:'A4a', sec:'4.1 — 4.3', t:'Le générateur et la différence de potentiel', quiz:['A4aq1','A4aq2'], ex:{keys:['A4ten'], lbl:'Les tensions courantes'},
     body:()=>`${progRef(['Expliquer physiquement la notion de courant électrique ; citer l’unité d’intensité, les effets et le sens conventionnel du courant (CM2D)','Différencier pratiquement la notion de différence de potentiel et de tension ; citer l’unité de d.d.p. (CM2D)','Définir la notion de résistance électrique (CM2D)'],'pp. 25-26')}
      <p class="lead">Le courant électrique est un déplacement d’électrons libres dans des conducteurs.</p>
      ${defBox('Le générateur','Un générateur d’électricité est un appareil qui produit en permanence un <b>excès</b> d’électrons libres à une des bornes (borne –) et un <b>manque</b> d’électrons libres à l’autre borne (borne +). Exemples : piles, accumulateurs, dynamo, alternateur.')}
      ${defBox('La différence de potentiel','La d.d.p., ou tension électrique, est la différence des charges + et – entre les deux bornes d’un générateur. Son unité est le <b>volt (V)</b>. On la mesure avec un <b>voltmètre</b>, raccordé directement aux bornes du générateur ou entre les bornes où l’on veut mesurer la tension.')}
      ${exbox('a4ten','Quelle tension ?','Les exemples du cours.')}`,
     mount:root=>mountSortW(root.querySelector('#a4ten'),'A4ten',{cats:[['45','4,5 V'],['12','12 V'],['230','230 V']],items:[['Une pile plate de lampe de poche','45'],['Une batterie d’automobile','12'],['Une prise de courant de la maison','230']],ok:'Le cours d’origine indique 220 V pour la prise : c’est l’ancienne valeur, le réseau belge est aujourd’hui à 230 V.'})},
    {id:'A4b', sec:'4.4', t:'Le courant électrique et son sens', quiz:['A4bq1','A4bq2'], ex:{keys:['A4ord'], lbl:'Ce qui se passe dans le circuit'},
     body:()=>`<p>Raccordons une ampoule entre les deux bornes d’une pile. À la borne +, il manque des électrons : elle tend à rétablir son équilibre en captant des électrons libres à la borne –. Il y a donc un déplacement d’électrons dans le conducteur, de la borne – vers la borne +.</p>
      <p>Pour avoir ce déplacement, il faut que le circuit soit <b>fermé</b> et qu’il y ait une <b>différence de potentiel</b>. Dès que l’excès d’électrons a comblé le manque, le générateur est déchargé : une pile, on la jette ; un accumulateur, on le recharge.</p>
      <p>Pour éviter que les charges négatives ne rejoignent instantanément la borne + (court-circuit, échauffement ou fusion du conducteur), on place dans le circuit un <b>récepteur</b> (lampe, résistance chauffante…) qui limite le passage des électrons.</p>
      <div class="figure" id="a4sens"></div>
      ${defBox('Le sens du courant','Le courant électrique est un déplacement d’électrons libres qui se fait de la borne – à la borne + <b>à l’extérieur</b> du générateur, et du + au – à l’intérieur. Le <b>sens conventionnel</b>, toujours employé dans l’industrie, est l’inverse : à l’extérieur du générateur, de la borne + vers la borne –.')}
      ${exbox('a4ord','Remets dans l’ordre','Ce qui se passe quand on branche la lampe sur la pile.')}`,
     mount:root=>{ mountSens(root); mountOrderW(root.querySelector('#a4ord'),'A4ord',{items:['On ferme le circuit entre les bornes de la pile','La borne +, qui manque d’électrons, capte ceux de la borne –','Les électrons se déplacent dans le conducteur, de la borne – vers la borne +','La lampe limite leur passage et éclaire','L’excès comble le manque : la pile est déchargée'],shuffle:[2,4,0,3,1],ok:'Juste.'}); }},
    {id:'A4c', sec:'4.5 — 4.7', t:'L’intensité et la résistance', quiz:['A4cq1','A4cq2'], ex:{keys:['A4gr','A4def'], lbl:'Grandeurs et définitions'},
     body:()=>`${defBox('L’intensité','L’intensité du courant électrique est déterminée par le nombre d’électrons qui se déplacent par seconde dans le conducteur. Symbole <b>I</b>, unité l’<b>ampère (A)</b>. On la mesure avec un <b>ampèremètre</b>, raccordé <b>en série</b> dans le circuit.')}
      ${defBox('La résistance','La résistance électrique d’un conducteur est la difficulté qu’il offre au passage du courant. Symbole <b>R</b>, unité l’<b>ohm (Ω)</b>. On la mesure avec un <b>ohmmètre</b>, raccordé directement sur la résistance. Attention : la résistance ne peut pas être sous tension pendant la mesure.')}
      <p>Exemple : le filament d’une lampe de 25 W offre une résistance plus grande que celui d’une lampe de 100 W. La lampe de 100 W dégage donc plus de chaleur et de lumière.</p>
      ${exbox('a4gr','Grandeur, unité, appareil')}
      ${exbox('a4def','Les définitions de synthèse','Lis la définition et retrouve le mot.')}`,
     mount:root=>{
       mountSortW(root.querySelector('#a4gr'),'A4gr',{cats:[['u','Tension'],['i','Intensité'],['r','Résistance']],items:[['Le volt (V)','u'],['L’ampère (A)','i'],['L’ohm (Ω)','r'],['Le voltmètre, en parallèle','u'],['L’ampèremètre, en série','i'],['L’ohmmètre, hors tension','r']],ok:'Juste.'});
       mountSortW(root.querySelector('#a4def'),'A4def',{cats:[['at','Atome'],['io','Ion'],['co','Conducteur'],['is','Isolant'],['ge','Générateur']],items:[['Plus petite partie de matière qui puisse entrer en combinaison chimique pour former des molécules','at'],['Atome qui a perdu ou gagné un ou plusieurs électrons','io'],['Matière qui permet le passage d’électrons libres d’un atome à un autre','co'],['Matière qui ne permet pas le passage d’électrons libres d’un atome à un autre','is'],['Appareil qui produit en permanence un excès d’électrons à une borne et un manque à l’autre','ge']],ok:'Les définitions du cours.'}); }},
  ],
  prereq:[{t:'Définir un générateur électrique et citer des exemples',cap:'A4a'},{t:'Définir la différence de potentiel (d.d.p.) et son unité, le volt',cap:'A4a'},{t:'Expliquer l’origine du courant électrique et son sens conventionnel',cap:'A4b'},{t:'Définir l’intensité et la résistance électriques, avec leurs unités',cap:'A4c'}],
});

/* =================== CHAPITRE 5 — APPAREILS DE MESURES =================== */
defAF(5, {
  Q:{
    A5aq1:{q:"Tu ne connais pas du tout la tension à mesurer. Quel calibre choisis-tu ?",o:["Le plus petit","Le plus élevé","Celui du milieu"],g:1,e:"Le calibre doit toujours être supérieur à la tension à mesurer. Si elle est inconnue, on commence par le plus élevé.",r:'A5a'},
    A5aq2:{q:"Pour obtenir une lecture valable sur un appareil à aiguille…",o:["l’aiguille doit dévier le moins possible","l’aiguille doit avoir une déviation importante et on regarde perpendiculairement au cadran","on lit en penchant la tête"],g:1,e:"On choisit l’échelle en fonction du calibre et on regarde bien en face du cadran.",r:'A5a'},
    A5bq1:{q:"Comment branche-t-on un ampèremètre ?",o:["En parallèle sur le récepteur","En série dans le circuit dont on veut connaître le courant","Directement sur la prise"],g:1,e:"Tout le courant à mesurer doit traverser l’appareil.",r:'A5b'},
    A5cq1:{q:"Pointes de test séparées, où doit se trouver l’aiguille de l’ohmmètre ?",o:["Sur 0","Sur la position infinie","N’importe où"],g:1,e:"Pointes séparées : infini. Pointes en contact : 0. Sinon, on règle avec le bouton prévu, et on refait la mise à zéro à chaque changement de calibre.",r:'A5c'},
  },
  caps:[
    {id:'A5a', sec:'5.1', t:'Le voltmètre', quiz:['A5aq1','A5aq2'], ex:{keys:['A5cl','A5vo'], lbl:'Classe et raccordement'},
     body:()=>`${progRef(['Placer un ampèremètre en série dans un circuit, en toute sécurité (CM2D)','Placer un voltmètre en parallèle aux bornes à mesurer, en toute sécurité (CM2D)','Lire et interpréter correctement la mesure obtenue (CM2D)'],'pp. 25-26')}
      <p>Le voltmètre mesure une d.d.p. : celle du réseau, la f.é.m. d’une pile… Un appareil qui fonctionne mal peut avoir une tension trop faible ou trop élevée ; une tension trop élevée l’use prématurément. Le voltmètre sert aussi à déterminer les chutes de tension et à rechercher les défauts.</p>
      <h3>Avant de mesurer</h3>
      <ul><li><b>Le genre de tension</b> : alternative (AC) ou continue (DC).</li><li><b>La classe de l’appareil</b> : 0,1 – 0,2 – 0,5 pour les mesures précises (laboratoire) ; 1 – 1,5 pour les mesures courantes dans les installations.</li><li><b>Le calibre</b> : toujours supérieur à la tension à mesurer. Si elle est inconnue, on choisit le calibre le plus élevé.</li></ul>
      ${exbox('a5cl','Quelle classe d’appareil ?')}
      <h3>Raccorder et lire</h3>
      ${exbox('a5vo','Remets les étapes dans l’ordre')}
      <div class="note"><b>Remarque</b>En courant continu, il faut respecter la polarité de l’appareil.</div>`,
     mount:root=>{
       mountSortW(root.querySelector('#a5cl'),'A5cl',{cats:[['l','Classe 0,1 à 0,5'],['i','Classe 1 à 1,5']],items:[['Un étalonnage au laboratoire','l'],['Le contrôle de la tension d’une prise','i'],['Une mesure de précision','l'],['Un dépannage dans une installation','i']],ok:'Plus le chiffre de la classe est petit, plus l’appareil est précis.'});
       mountOrderW(root.querySelector('#a5vo'),'A5vo',{items:['Placer l’appareil dans la position indiquée','Vérifier la mise à zéro de l’aiguille','Raccorder le voltmètre en parallèle là où l’on veut la d.d.p.','Choisir l’échelle de lecture selon le calibre','Lire en regardant perpendiculairement au cadran'],shuffle:[2,0,4,1,3],ok:'Juste.'}); }},
    {id:'A5b', sec:'5.2', t:'L’ampèremètre', quiz:['A5bq1'], ex:{keys:['A5se'], lbl:'Les points de sécurité'},
     body:()=>`<p>L’ampèremètre permet de connaître le courant absorbé par un appareil alimenté sous sa tension nominale. Comme pour le voltmètre, on veille au <b>genre du courant</b> (alternatif ou continu), à la <b>classe</b> de l’appareil et au <b>calibre</b>.</p>
      <p>On place l’appareil dans la position indiquée, puis on le branche <b>en série</b> dans le circuit dont on désire connaître le courant.</p>
      <div class="note bad"><b>Sécurité</b>Avant la mise sous tension, vérifier le raccordement de l’appareil. Attention aux parties non isolées sous tension : ne jamais effectuer de mesures en haute tension. Vérifier le calibre. Respecter la polarité en courant continu.</div>
      ${exbox('a5se','À faire ou à ne pas faire ?')}`,
     mount:root=>mountSortW(root.querySelector('#a5se'),'A5se',{cats:[['o','À faire'],['n','Interdit']],items:[['Vérifier le raccordement avant la mise sous tension','o'],['Brancher l’ampèremètre en parallèle sur le récepteur','n'],['Mesurer en haute tension avec un ampèremètre d’atelier','n'],['Respecter la polarité en courant continu','o'],['Vérifier le calibre','o']],ok:'Juste.'})},
    {id:'A5c', sec:'5.3', t:'L’ohmmètre', quiz:['A5cq1'], ex:{keys:['A5app'], lbl:'Quel appareil, et comment ?'},
     body:()=>`<p>L’ohmmètre est souvent utilisé par l’électricien. Il ne donne pas une mesure précise, mais ce n’est pas gênant pour les usages courants : il sert à la mesure approximative d’un circuit et permet de <b>détecter une coupure</b>. Exemples : vérifier l’état d’une lampe, d’un interrupteur ou d’un fusible ; repérer les conducteurs dans un circuit.</p>
      <ul><li><b>Mesure hors tension</b> : le circuit doit être mis hors tension.</li><li><b>Contrôle de l’appareil</b> : pointes séparées, l’aiguille est sur l’infini ; pointes en contact, l’aiguille est sur 0.</li><li>Si l’aiguille n’indique pas 0, on la règle avec le bouton prévu, et on refait la mise à zéro à <b>chaque changement de calibre</b>.</li></ul>
      ${terrain('Un fusible qui « a l’air bon » : à l’ohmmètre, hors tension, il doit indiquer pratiquement 0. S’il indique l’infini, il est coupé — même si on ne voit rien à l’œil.')}
      ${exbox('a5app','Quelle mesure pour quel besoin ?')}`,
     mount:root=>mountSortW(root.querySelector('#a5app'),'A5app',{cats:[['v','Voltmètre en parallèle'],['a','Ampèremètre en série'],['o','Ohmmètre hors tension']],items:[['Contrôler la tension d’une prise','v'],['Connaître le courant absorbé par un radiateur','a'],['Vérifier si un fusible est coupé','o'],['Repérer les deux bouts d’un même conducteur','o'],['Mesurer la f.é.m. d’une pile','v'],['Vérifier l’état d’un interrupteur','o']],ok:'Juste : le bon appareil, branché de la bonne façon.'})},
  ],
  prereq:[{t:'Choisir le genre de courant, la classe et le calibre adaptés',cap:'A5a'},{t:'Brancher correctement un ampèremètre (en série) et un voltmètre (en parallèle)',cap:'A5b'},{t:'Lire une mesure en respectant l’échelle et la polarité',cap:'A5a'},{t:'Utiliser un ohmmètre, hors tension, pour détecter une coupure',cap:'A5c'}],
});
})();
