/* =========================================================
   CHAPITRE 2.1 — SÉCURITÉ ÉLECTRIQUE ET APPAREILS DE MESURE DE BASE
   Contenu repris du cours d'Électricité 4e, pages 8 à 22.
   Les questions de la plateforme ne sont PAS celles de l'évaluation formative 2.1.
   ========================================================= */
(function(){
const Q21 = {
  a1q1:{q:"Qu'est-ce qui rend le courant électrique dangereux pour le corps ?",o:["La tension seule, quel que soit le courant","La quantité de courant qui traverse le corps","La couleur des fils touchés"],g:1,e:"Le danger vient de l'intensité qui traverse le corps. La tension « pousse », mais c'est le courant qui tétanise, paralyse ou fait fibriller le cœur.",r:'a1'},
  a1q2:{q:"La main d'un élève se crispe sur un conducteur et ne peut plus le lâcher. Vers quelle intensité se situe-t-on ?",o:["Environ 0,5 mA","Environ 10 mA","Plusieurs ampères"],g:1,e:"Vers 10 mA, la contraction musculaire empêche de lâcher le conducteur. À 0,5 mA, on sent seulement un picotement.",r:'a1'},
  a1q3:{q:"Pourquoi porte-t-on un écran facial et des vêtements non fondants dans un tableau ?",o:["Contre l'arc électrique : chaleur de plusieurs milliers de degrés, métal en fusion projeté, onde de pression","Pour se protéger de la poussière","Parce que le règlement de l'école l'impose, sans autre raison"],g:0,e:"L'arc est le second risque, souvent sous-estimé. Un tournevis mal placé suffit à le déclencher.",r:'a1'},
  a2q1:{q:"Pourquoi l'ordre des cinq règles d'or ne peut-il pas être changé ?",o:["Chaque étape rend la suivante possible et sûre : on ne condamne pas un appareil qu'on n'a pas ouvert, et une vérification faite avant la condamnation ne prouve rien","Parce que c'est l'ordre alphabétique","L'ordre est libre, du moment que les cinq sont faites"],g:0,e:"Une vérification faite avant de condamner ne prouve rien : quelqu'un peut refermer entre-temps.",r:'a2'},
  a2q2:{q:"Tu as mesuré l'absence de tension. Peux-tu te passer du cadenas ?",o:["Oui, puisque la mesure est bonne","Non : la vérification ne remplace jamais la condamnation","Oui, si la mesure a été faite au VAT"],g:1,e:"Un circuit hors tension au moment de la mesure peut être réalimenté trente secondes plus tard par quelqu'un qui ne sait pas que tu travailles.",r:'a2'},
  a2q3:{q:"Trois techniciens interviennent sur la même machine. Comment condamnent-ils le sectionneur ?",o:["Un seul cadenas, celui du chef d'équipe","Chacun pose son propre cadenas sur un moraillon","Une pancarte suffit"],g:1,e:"Chaque intervenant pose son cadenas personnel sur un moraillon : la machine ne peut être réalimentée que quand le dernier a retiré le sien.",r:'a2'},
  a3q1:{q:"Un tournevis a un manche en plastique mais ne porte pas le double triangle. Est-ce un outil isolé ?",o:["Oui, le plastique isole","Non : seul le marquage 1000 V avec double triangle garantit un outil testé pour les travaux sous tension","Oui, s'il est rouge"],g:1,e:"Un manche de tournevis ordinaire n'a subi aucun essai diélectrique.",r:'a3'},
  a3q2:{q:"Où rencontre-t-on le marquage « 500 V » ?",o:["Sur un outil isolé EN 60900","Sur un gant isolant de classe 00","Sur un multimètre CAT III"],g:1,e:"Les outils EN 60900 sont toujours marqués 1000 V. Le 500 V correspond à la classe 00 des gants isolants.",r:'a3'},
  a3q3:{q:"Avant d'utiliser des gants isolants, que fait-on ?",o:["On les roule pour les gonfler et détecter une fuite, on vérifie l'absence de coupure et la date de contrôle","On les lave","Rien, ils sont neufs chaque année"],g:0,e:"Le contrôle se fait avant chaque usage. Des sur-gants en cuir les protègent des agressions mécaniques.",r:'a3'},
  a4q1:{q:"Quand fait-on l'analyse de risques de dernière minute ?",o:["La veille, au bureau, pendant la préparation","Sur place, juste avant de commencer, et de nouveau si les conditions changent","Après le travail, pour le rapport"],g:1,e:"Elle se fait sur le lieu même, prend deux à trois minutes, est nominative et se refait si les conditions changent.",r:'a4'},
  a4q2:{q:"Remplir la fiche ARDM après l'intervention, ça compte à l'épreuve ?",o:["Oui, du moment qu'elle est signée","Non : remplir la fiche après coup ne compte pas","Oui, si le prof est d'accord"],g:1,e:"La grille UAA1 évalue que la fiche est complétée correctement et prise en considération. Après coup, elle ne sert à rien.",r:'a4'},
  a5q1:{q:"Machine arrêtée, sectionneur cadenassé. Le vérin vertical chargé peut-il encore être dangereux ?",o:["Non, plus rien ne bouge sans électricité","Oui : une charge qui peut tomber est une énergie mécanique à neutraliser","Seulement s'il est pneumatique"],g:1,e:"Couper le courant ne suffit pas : quatre énergies doivent être neutralisées.",r:'a5'},
  a5q2:{q:"Un variateur de vitesse vient d'être coupé. Que faut-il respecter avant de toucher ses bornes ?",o:["Rien, il est coupé","Le temps de décharge des condensateurs affiché sur l'appareil, souvent plusieurs minutes","Attendre qu'il refroidisse"],g:1,e:"Les condensateurs d'un variateur restent chargés après la coupure : c'est une source résiduelle d'énergie électrique.",r:'a5'},
  a5q3:{q:"Pendant la déconsignation, un collègue est parti en oubliant son cadenas. Tu peux le retirer à sa place ?",o:["Oui, s'il a terminé","Non : seul celui qui a posé un cadenas peut le retirer","Oui, avec l'accord de l'exploitant"],g:1,e:"Retirer le cadenas d'un collègue, quelle que soit la raison, revient à décider seul qu'il n'est plus en danger.",r:'a5'},
  a6q1:{q:"Pourquoi un multimètre n'est-il pas un VAT ?",o:["Il est moins précis","Il peut être sur un mauvais calibre, sur la fonction résistance ou avoir une pile déchargée : il affichera zéro sur un conducteur sous tension","Il est plus cher"],g:1,e:"Le VAT n'a pas de sélecteur de fonction : on ne peut pas se tromper de position. Le tournevis testeur à néon, lui, est proscrit.",r:'a6'},
  a6q2:{q:"En triphasé avec neutre et terre, combien de mesures faut-il faire au VAT ?",o:["3 : entre phases","7 : entre phases et entre chaque phase et le neutre","10 : entre phases, phase-neutre, phase-terre et neutre-terre"],g:2,e:"L1-L2, L2-L3, L1-L3, L1-N, L2-N, L3-N, L1-PE, L2-PE, L3-PE et N-PE. Une seule mesure entre deux phases laisse passer le cas d'une phase restée alimentée.",r:'a6'},
  a6q3:{q:"Où vérifie-t-on l'absence de tension ?",o:["À l'armoire, c'est plus pratique","Au plus près de l'endroit où l'on va travailler","N'importe où sur le circuit"],g:1,e:"Un conducteur peut être alimenté par un autre chemin que celui qu'on a coupé.",r:'a6'},
  a7q1:{q:"Que signifie l'affichage « OL » sur un multimètre ?",o:["La valeur dépasse le calibre — en continuité : le circuit est coupé","L'appareil est en panne","La pile est pleine"],g:0,e:"OL (ou « 1. » seul) : la valeur dépasse le calibre. En continuité, un circuit coupé affiche OL.",r:'a7'},
  a7q2:{q:"Tu vas intervenir dans un tableau de distribution d'atelier. Quel appareil choisis-tu ?",o:["Un CAT II 600 V","Un CAT III 1000 V","N'importe lequel, du moment qu'il affiche 400 V"],g:1,e:"Le tableau d'atelier est en distribution fixe : CAT III. En maintenance industrielle, CAT III 600 V est un minimum, CAT III 1000 V ou CAT IV 600 V est la norme.",r:'a7'},
  a7q3:{q:"Ton multimètre est CAT IV, tes cordons CAT II. Quelle est la catégorie de l'ensemble ?",o:["CAT IV","CAT III, la moyenne","CAT II : c'est toujours le maillon le plus faible qui commande"],g:2,e:"Les cordons portent aussi une catégorie, et c'est le maillon le plus faible qui fixe celle de l'ensemble.",r:'a7'},
  a8q1:{q:"La pince entoure les trois phases d'un moteur qui tourne. Elle affiche 0. Pourquoi ?",o:["Le moteur ne consomme rien","La somme des courants des trois phases est nulle : il faut n'enserrer qu'un seul conducteur","La pince est en panne"],g:1,e:"Même chose avec la phase et le neutre d'un circuit monophasé. Cette propriété sert d'ailleurs à mesurer un courant de fuite : c'est le principe du différentiel.",r:'a8'},
  a8q2:{q:"Un variateur de vitesse alimente le moteur. Quelle pince utiliser ?",o:["Une pince à valeur efficace vraie","Une pince à valeur moyenne redressée","Peu importe"],g:0,e:"Avec un courant déformé (variateur, charge non linéaire), une pince à valeur moyenne redressée donne une lecture fausse.",r:'a8'},
  a8q3:{q:"Pourquoi utilise-t-on un tournevis dynamométrique sur les bornes de puissance ?",o:["Pour aller plus vite","Pour respecter le couple prescrit : trop faible, la borne chauffe ; trop fort, elle se déforme","Parce qu'il est isolé"],g:1,e:"Les bornes de puissance ont un couple de serrage prescrit.",r:'a8'},
};

/* ---------- 2.1.1 a : le courant dans le corps ---------- */
const EFFETS=[['Environ 0,5 mA','Seuil de perception, picotement',0.5],['Environ 10 mA','Contraction musculaire : la main ne peut plus lâcher le conducteur',10],['Environ 30 mA','Paralysie respiratoire si le contact se prolonge — d’où la sensibilité des différentiels de protection des personnes',30],['Au-delà de 50 mA','Fibrillation ventriculaire, arrêt cardiaque',50],['Fortes intensités','Brûlures profondes sur le trajet du courant',1000]];
const bodyPos = I => Math.max(0,Math.min(100,(Math.log10(Math.max(I,0.1))+1)/4*100));
function mountBody(root){
  const st=WS.body||(WS.body={u:230,r:1500});
  const box=root.querySelector('#bodysim');
  const draw=()=>{
    const I=st.u/st.r*1000, row=I<5?0:I<20?1:I<50?2:I<500?3:4;
    box.innerHTML=`<div class="grid g2"><div><div class="kicker" style="margin-bottom:6px">Tension touchée</div><div class="samples">${[230,400].map(u=>`<button class="${st.u===u?'on':''}" data-bu="${u}">${u} V</button>`).join('')}</div></div>
      <div><div class="kicker" style="margin-bottom:6px">État de la peau</div><div class="samples">${[[1500,'sèche · 1 500 Ω'],[500,'mouillée · 500 Ω'],[300,'blessée · 300 Ω']].map(([r,l])=>`<button class="${st.r===r?'on':''}" data-br="${r}">${l}</button>`).join('')}</div></div></div>
      <div class="meterbar" aria-hidden="true"><i style="left:${bodyPos(I)}%"></i></div>
      <div class="row between tiny muted"><span>0,1 mA</span><span>1 mA</span><span>10 mA</span><span>100 mA</span><span>1 A</span></div>
      <p style="margin:10px 0 6px"><b>Courant dans le corps : ${fr(I,0)} mA</b> <span class="small muted">(I = U ÷ R = ${st.u} ÷ ${st.r} — calcul vu au chapitre 2.2.4)</span></p>
      ${tbl(['Intensité','Effet sur le corps'], EFFETS.map(([a,b])=>[a,b])).replace(/<tr><td><b>/g,(m,i)=>m).replace(new RegExp(`(<tr>)(<td><b>${EFFETS[row][0]}</b>)`),'<tr class="hl-row">$2')}`;
    box.querySelectorAll('[data-bu]').forEach(b=>b.onclick=()=>{ st.u=+b.dataset.bu; draw(); });
    box.querySelectorAll('[data-br]').forEach(b=>b.onclick=()=>{ st.r=+b.dataset.br; draw(); });
  };
  draw();
}

/* ---------- 2.1.4 : le VAT, règle des trois temps ---------- */
function vatSVG(lit){
  const L=[12,50,120,230,400];
  return `<svg viewBox="0 0 300 120" role="img" aria-label="Vérificateur d'absence de tension, ${lit?'voyants allumés jusqu’à '+lit+' V':'aucun voyant allumé'}">
    <rect x="20" y="14" width="150" height="92" rx="16" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>
    <text x="95" y="32" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink-2)">VAT</text>
    ${L.map((v,i)=>`<circle cx="${42+i*26}" cy="62" r="9" fill="${lit&&v<=lit?'var(--live)':'var(--grey-soft)'}" stroke="var(--line)"/><text x="${42+i*26}" y="88" text-anchor="middle" font-size="10" fill="var(--muted)">${v}</text>`).join('')}
    <path d="M170 50 C 210 50 220 30 262 30" stroke="var(--live)" stroke-width="4" fill="none"/><path d="M170 76 C 210 76 220 96 262 96" stroke="var(--ink)" stroke-width="4" fill="none"/>
    <rect x="258" y="22" width="34" height="16" rx="4" fill="var(--live)"/><rect x="258" y="88" width="34" height="16" rx="4" fill="var(--ink-2)"/>
  </svg>`;
}
function mountVat(root){
  const box=root.querySelector('#vatsim'), st=WS.vat||(WS.vat={sc:1,step:0,lit:0,msg:'',ask:false,fb:''}), dr=DR(), mem=dr.vat||(dr.vat={});
  const SC={1:'Scénario 1 — un VAT en bon état',2:'Scénario 2 — le même geste, un autre VAT'};
  const draw=()=>{
    const done=!!P().ex.a6vat;
    box.innerHTML=`<div class="row between wrap"><b>${SC[st.sc]}</b><span class="small muted">${mem.s1?'✓ scénario 1 ':''}${mem.s2?'✓ scénario 2':''}</span></div>
      <div class="figure" style="max-width:420px;margin:10px 0">${vatSVG(st.lit)}</div>
      <div class="row wrap">${[['1','Tester sur la source connue'],['2','Mesurer sur l’installation consignée'],['3','Retester sur la source connue']].map(([k,l])=>`<button class="btn sm ${st.step>=+k?'':'primary'}" data-vs="${k}" ${st.step>=+k||st.ask?'disabled':''}>${k}. ${l}</button>`).join('')}</div>
      <p class="small" style="min-height:22px">${st.msg}</p>
      ${st.ask?`<div class="q"><div class="qt">Quelle est ta conclusion ?</div><div class="opts">${[['ok','L’absence de tension est prouvée : l’intervention peut continuer.'],['ko','La mesure du deuxième temps ne vaut rien : l’installation est considérée sous tension, on recommence avec un autre VAT.']].map(([k,l],i)=>`<button class="opt" data-vc="${k}"><span class="l">${'AB'[i]}</span><span>${l}</span></button>`).join('')}</div>${st.fb}</div>`:''}
      ${done?`<div class="fb good"><b>Exercice réussi.</b> Le troisième temps n'est jamais facultatif : c'est lui qui prouve que le VAT fonctionnait encore pendant la mesure.</div>`:''}`;
    box.querySelectorAll('[data-vs]').forEach(b=>b.onclick=()=>{ const k=+b.dataset.vs;
      if(k!==st.step+1){ st.msg=`<span style="color:var(--bad)">${st.step===0?'Tu n’as pas encore prouvé que le VAT fonctionne : commence par le premier temps.':'Respecte l’ordre des trois temps.'}</span>`; draw(); return; }
      st.step=k;
      if(k===1){ st.lit=230; st.msg='Le VAT allume ses voyants jusqu’à 230 V : il fonctionne.'; }
      if(k===2){ st.lit=0; st.msg='Aucun voyant entre L1-L2 (et les neuf autres combinaisons) : rien ne s’allume.'; }
      if(k===3){ st.lit=st.sc===1?230:0; st.msg=st.sc===1?'Les voyants s’allument à nouveau sur la source connue.':'<b>Plus rien ne s’allume sur la source connue !</b>'; st.ask=true; st.fb=''; }
      draw(); });
    box.querySelectorAll('[data-vc]').forEach(b=>b.onclick=()=>{ const good=(st.sc===1?'ok':'ko');
      if(b.dataset.vc===good){ mem['s'+st.sc]=true; save();
        if(st.sc===1){ Object.assign(st,{sc:2,step:0,lit:0,ask:false,fb:'',msg:'Bien. Recommence maintenant le même geste avec un autre VAT.'}); }
        else { st.ask=false; st.msg='Exact : le VAT est tombé en panne entre le premier et le troisième temps. Sa mesure ne prouvait rien.'; if(mem.s1) exSet('a6vat'); }
      } else st.fb=`<div class="fb wrong"><b>Pas encore.</b> ${st.sc===1?'Les trois temps sont bons : le VAT a fonctionné avant et après la mesure.':'Si le VAT ne s’allume plus au troisième temps, rien ne prouve qu’il fonctionnait pendant la mesure.'}</div>`;
      draw(); });
  };
  draw();
}

/* ---------- 2.1.5 : le multimètre — on le règle soi-même, puis on justifie ---------- */
/* Multimètre à calibres manuels. Positions du sélecteur, dans le sens des aiguilles d'une montre. */
const MM_POS=[
  {k:'off', g:'',   l:'OFF'},
  {k:'vdc1000',g:'V⎓',l:'1000',fn:'vdc',cal:1000,u:'V',d:0},
  {k:'vdc200', g:'V⎓',l:'200', fn:'vdc',cal:200, u:'V',d:1},
  {k:'vdc20',  g:'V⎓',l:'20',  fn:'vdc',cal:20,  u:'V',d:2},
  {k:'vdc2',   g:'V⎓',l:'2',   fn:'vdc',cal:2,   u:'V',d:3},
  {k:'vac750', g:'V~',l:'750', fn:'vac',cal:750, u:'V',d:0},
  {k:'vac200', g:'V~',l:'200', fn:'vac',cal:200, u:'V',d:1},
  {k:'aac10',  g:'A~',l:'10A', fn:'aac',cal:10,  u:'A',d:2},
  {k:'adc10',  g:'A⎓',l:'10A', fn:'adc',cal:10,  u:'A',d:2},
  {k:'madc200',g:'A⎓',l:'200m',fn:'madc',cal:0.2,u:'mA',d:1,m:1000},
  {k:'ohm200', g:'Ω', l:'200', fn:'ohm',cal:200, u:'Ω',d:1},
  {k:'ohm2k',  g:'Ω', l:'2k',  fn:'ohm',cal:2000,u:'kΩ',d:3,m:0.001},
  {k:'ohm20k', g:'Ω', l:'20k', fn:'ohm',cal:20000,u:'kΩ',d:2,m:0.001},
  {k:'ohm200k',g:'Ω', l:'200k',fn:'ohm',cal:200000,u:'kΩ',d:1,m:0.001},
];
const MM_A0=-150, MM_STEP=300/(MM_POS.length-1), MM_C={x:130,y:194};
const mmAng = i => MM_A0+i*MM_STEP;
const MM_TASKS=[
  {k:'u1',t:'Mesurer la tension de la prise de l’établi',kind:'U',ac:true,v:231.4,best:'vac750',
   jq:[{q:'Pourquoi la fonction V~ ?',o:['Une prise fournit du continu, il faut V⎓','La prise du réseau fournit une tension alternative','Parce qu’on mesure le courant de la prise'],g:1},
       {q:'Pourquoi le calibre 750 ?',o:['C’est le plus petit calibre supérieur aux 230 V attendus : 200 afficherait OL','C’est toujours le calibre le plus grand qui est le bon','200 suffit, on arrondit'],g:0}]},
  {k:'u2',t:'Mesurer la tension de l’alimentation 24 V des circuits de commande',kind:'U',ac:false,v:24.13,best:'vdc200',
   jq:[{q:'Pourquoi la fonction V⎓ ?',o:['L’alimentation des circuits de commande fournit une tension continue','Le 24 V est toujours alternatif','Pour mesurer une résistance'],g:0},
       {q:'Pourquoi le calibre 200 ?',o:['Le calibre 1000 est plus précis','Le calibre 20 afficherait OL, mais c’est sans importance','24 V dépasse 20 : on prend le calibre juste au-dessus, qui donne la lecture la plus précise'],g:2}]},
  {k:'i1',t:'Mesurer le courant absorbé par une lampe de 60 W, sur le 230 V',kind:'I',ac:true,v:0.262,best:'aac10',
   jq:[{q:'Pourquoi l’entrée 10 A et pas l’entrée mA ?',o:['L’entrée 10 A est plus précise','0,26 A dépasse les 200 mA de l’entrée mA : son fusible fondrait','Par habitude'],g:1},
       {q:'Pourquoi brancher dans la coupure ?',o:['Le courant doit traverser l’appareil : on l’insère dans le circuit, en série','À cheval, la mesure serait plus précise','Pour ne pas couper la lampe'],g:0},
       {q:'Et juste après la mesure ?',o:['On laisse le cordon rouge où il est pour la prochaine fois','On remet immédiatement le cordon rouge dans la borne VΩ mA','On éteint la lampe'],g:1}]},
  {k:'r1',t:'Mesurer la résistance de la bobine d’un relais, hors tension',kind:'R',v:480,best:'ohm2k',
   jq:[{q:'L’écran affiche 0.480 sur le calibre 2k. Que vaut la résistance ?',o:['0,48 Ω','4 800 Ω','480 Ω : l’affichage est en kΩ'],g:2},
       {q:'Pourquoi le calibre 2k ?',o:['480 Ω dépasse le calibre 200 : on prend le plus petit calibre au-dessus','Le calibre 200k est plus sûr','On choisit toujours 2k pour une bobine'],g:0},
       {q:'Pourquoi hors tension ?',o:['Pour économiser la pile','L’ohmmètre envoie son propre courant : sous tension, la mesure est fausse et l’appareil peut être endommagé','Ce n’est pas obligatoire'],g:1}]},
];
function mmLCD(o){
  if(!o) return {txt:'',u:''};
  return o;
}
function mmSVG(st){
  const i=MM_POS.findIndex(p=>p.k===st.pos), a=mmAng(i), lcd=st.lcd||{txt:st.pos==='off'?'':'– – –',u:''};
  const groups=[...new Set(MM_POS.map(p=>p.g).filter(Boolean))].map(g=>{ const idx=MM_POS.map((p,j)=>p.g===g?j:-1).filter(j=>j>=0); return {g, a:(mmAng(idx[0])+mmAng(idx[idx.length-1]))/2, a0:mmAng(idx[0])-MM_STEP/2.4, a1:mmAng(idx[idx.length-1])+MM_STEP/2.4}; });
  const P=(ang,r)=>{ const t=ang*Math.PI/180; return [MM_C.x+Math.sin(t)*r, MM_C.y-Math.cos(t)*r]; };
  const arc=(a0,a1,r)=>{ const [x0,y0]=P(a0,r),[x1,y1]=P(a1,r); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  const plug=st.red==='a10'?70:190;
  return `<svg viewBox="0 0 260 400" class="mmsvg" role="group" aria-label="Multimètre">
    <rect x="12" y="6" width="236" height="356" rx="22" fill="var(--amber)"/><rect x="22" y="16" width="216" height="336" rx="16" fill="#2b3340"/>
    <rect x="44" y="26" width="172" height="52" rx="6" fill="#cfe3c4"/>
    <text x="178" y="64" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="28" font-weight="700" fill="#14210f">${lcd.txt}</text>
    <text x="206" y="64" text-anchor="end" font-size="11" font-weight="800" fill="#14210f">${lcd.u}</text>
    ${groups.map(g=>{ const [x,y]=P(g.a,100); return `<path d="${arc(g.a0,g.a1,90)}" stroke="#596273" stroke-width="3" fill="none"/><text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="800" fill="#ffd34d">${g.g}</text>`; }).join('')}
    ${MM_POS.map((p,j)=>{ const [x,y]=P(mmAng(j),72); return `<g class="mmpos" data-mmpos="${p.k}" style="cursor:pointer"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="${p.k===st.pos?'#ffd34d':'transparent'}"/><text x="${x.toFixed(1)}" y="${(y+3.5).toFixed(1)}" text-anchor="middle" font-size="${p.l.length>3?8.5:10}" font-weight="800" fill="${p.k===st.pos?'#141922':'#e9edf3'}">${p.l}</text></g>`; }).join('')}
    <g class="mmknob" data-mmknob tabindex="0" role="slider" aria-label="Sélecteur de fonction et de calibre" aria-valuemin="0" aria-valuemax="${MM_POS.length-1}" aria-valuenow="${i}" aria-valuetext="${MM_POS[i].g} ${MM_POS[i].l}" style="cursor:grab">
      <circle cx="${MM_C.x}" cy="${MM_C.y}" r="46" fill="#3b4452" stroke="#596273" stroke-width="3"/>
      <g class="mmarm" transform="rotate(${a} ${MM_C.x} ${MM_C.y})"><rect x="${MM_C.x-9}" y="${MM_C.y-44}" width="18" height="88" rx="9" fill="#1c222d"/><path d="M${MM_C.x} ${MM_C.y-44} l-7 14 h14 z" fill="#fff"/></g>
    </g>
    ${[['a10','10 A',70],['com','COM',130],['vo','VΩ mA',190]].map(([k,l,x])=>`<g ${k==='com'?'':`data-mmjack="${k}" style="cursor:pointer"`}><text x="${x}" y="306" text-anchor="middle" font-size="10" font-weight="800" fill="#e9edf3">${l}</text><circle cx="${x}" cy="326" r="13" fill="#141922" stroke="${k==='com'?'#888':'var(--live)'}" stroke-width="3"/>${k!=='com'&&st.red!==k?`<circle cx="${x}" cy="326" r="20" fill="transparent"/>`:''}</g>`).join('')}
    <circle cx="130" cy="326" r="7" fill="#141922"/><path d="M130 326 C 130 370 110 385 90 400" stroke="#141922" stroke-width="6" fill="none"/>
    <circle cx="${plug}" cy="326" r="8" fill="var(--live)"/><path d="M${plug} 326 C ${plug} 370 ${plug+20} 385 ${plug+40} 400" stroke="var(--live)" stroke-width="6" fill="none"/>
  </svg>`;
}
function mmEval(t, st){
  const p=MM_POS.find(x=>x.k===st.pos), live=t.kind!=='R', red=st.red, mode=st.mode;
  const lcd=(v)=>{ const vv=v*(p.m||1); return {txt:vv.toFixed(p.d).replace(/^0(?=\.)/,p.d>=3?'0':'0'),u:p.u}; };
  const OL={txt:'OL',u:p&&p.u||''};
  if(p.k==='off') return {ok:false,lcd:{txt:'',u:''},msg:'Le multimètre est éteint : tourne le sélecteur.'};
  if(!mode) return {ok:false,msg:'Choisis comment tu poses les pointes.'};
  const shortV = live && mode==='cheval' && (red==='a10' || p.fn==='madc');
  if(shortV && t.kind==='U') return {ok:false,lcd:{txt:'FUSE',u:''},bad:true,msg:'<b>Court-circuit franc !</b> Entre COM et une entrée courant, la résistance interne est quasi nulle : posée à cheval sur une tension, c’est un court-circuit. Au mieux le fusible fond, au pire l’appareil explose.'};
  if(t.kind==='U'){
    if(p.fn==='ohm') return {ok:false,bad:true,lcd:OL,msg:'Jamais l’ohmmètre sur un circuit sous tension : la lecture est fausse et l’appareil peut être endommagé.'};
    if(p.fn!=='vac'&&p.fn!=='vdc') return {ok:false,msg:'Le sélecteur est sur une fonction courant : pour une tension, choisis V~ ou V⎓.'};
    if(red!=='vo') return {ok:false,msg:'Pour une tension, le cordon rouge va dans la borne VΩ mA.'};
    if(mode==='coupure') return {ok:false,msg:'Une tension se mesure ENTRE deux points : on pose les pointes à cheval sur le composant, sans rien démonter.'};
    if(t.ac && p.fn==='vdc') return {ok:false,bad:true,lcd:{txt:'0.3',u:'V'},msg:'<b>Attention :</b> en V⎓ sur une tension alternative, l’affichage est proche de zéro. On croirait l’installation hors tension !'};
    if(!t.ac && p.fn==='vac') return {ok:false,lcd:{txt:'0.0',u:'V'},msg:'Position alternative sur une alimentation continue : la lecture est fausse. Choisis V⎓.'};
    if(t.v>p.cal) return {ok:false,lcd:OL,msg:'<b>OL</b> : la valeur dépasse le calibre. Remonte d’un calibre.'};
    if(p.k!==t.best) return {ok:false,lcd:lcd(t.v),msg:'La lecture est possible, mais peu précise : descends au calibre juste au-dessus de la valeur.'};
    return {ok:true,lcd:lcd(t.v),msg:'Mesure correcte. Justifie maintenant ton réglage.'};
  }
  if(t.kind==='I'){
    if(p.fn==='vac'||p.fn==='vdc'||p.fn==='ohm') return {ok:false,msg:'Pour un courant, le sélecteur doit être sur une fonction A.'};
    if(mode==='cheval') return {ok:false,lcd:{txt:'FUSE',u:''},bad:true,msg:'<b>Court-circuit !</b> Un ampèremètre posé à cheval est une résistance presque nulle entre deux points de tension différente. On ouvre le circuit et on insère l’appareil dans la coupure.'};
    if(p.fn==='madc') return {ok:false,lcd:{txt:'FUSE',u:''},bad:true,msg:'0,26 A traverse l’entrée mA, prévue pour 200 mA au maximum : son fusible fond. Il fallait l’entrée 10 A.'};
    if(red!=='a10') return {ok:false,msg:'Sur le calibre 10 A, le cordon rouge doit être dans la borne 10 A.'};
    if(p.fn==='adc') return {ok:false,lcd:{txt:'0.00',u:'A'},msg:'A⎓ sur un courant alternatif : la lecture est fausse. Le réseau est alternatif, choisis A~.'};
    return {ok:true,lcd:lcd(t.v),msg:'Mesure correcte. Justifie maintenant ton réglage.'};
  }
  if(red==='a10') return {ok:false,msg:'Le cordon rouge est resté dans la borne 10 A : remets-le dans VΩ mA.'};
  if(p.fn!=='ohm') return {ok:false,lcd:{txt:'0.0',u:p.u},msg:'Le circuit est hors tension : une fonction tension ou courant n’affiche rien d’utile. Choisis Ω.'};
  if(mode==='coupure') return {ok:false,msg:'Pour une résistance, on pose les deux pointes aux bornes du composant.'};
  if(t.v>p.cal) return {ok:false,lcd:OL,msg:'<b>OL</b> : la valeur dépasse le calibre. Remonte d’un calibre.'};
  if(p.k!==t.best) return {ok:false,lcd:lcd(t.v),msg:'La lecture est possible, mais peu précise : descends au calibre juste au-dessus de la valeur.'};
  return {ok:true,lcd:lcd(t.v),msg:'Mesure correcte. Justifie maintenant ton réglage.'};
}
function mountMM(root){
  const box=root.querySelector('#mmsim'), st=WS.mm||(WS.mm={t:0,red:'vo',pos:'off',mode:null,res:null,lcd:null,ans:{},jfb:''}), dr=DR(), mem=dr.mm||(dr.mm={});
  const setPos=(k)=>{ if(st.pos===k) return; st.pos=k; st.res=null; st.lcd=null; st.ans={}; st.jfb=''; };
  const draw=()=>{
    const t=MM_TASKS[st.t], allOk=MM_TASKS.every(x=>mem[x.k]), done=mem[t.k], p=MM_POS.find(x=>x.k===st.pos);
    box.innerHTML=`<div class="mm-ui"><div><div class="mmwrap">${mmSVG(st)}</div><p class="tiny muted" style="text-align:center;margin:4px 0 0">Tourne le sélecteur (glisse, clique sur une position ou utilise les flèches du clavier). Clique sur une borne pour y brancher le cordon rouge.</p></div><div>
      <div class="kicker" style="margin-bottom:6px">Mesures à réaliser</div>
      <div class="tasklist">${MM_TASKS.map((x,i)=>`<button class="${mem[x.k]?'ok':''} ${i===st.t?'on':''}" data-mt="${i}">${mem[x.k]?'✓ ':''}${x.t}</button>`).join('')}</div>
      <div class="small" style="margin:12px 0 6px"><b>Ton réglage :</b> ${p.k==='off'?'appareil éteint':`${p.g} · calibre ${p.l}`} · cordon rouge en ${st.red==='a10'?'10 A':'VΩ mA'}</div>
      <div class="kicker" style="margin:10px 0 6px">Je pose les pointes…</div><div class="seg">${[['cheval','à cheval sur le composant'],['coupure','dans la coupure du circuit']].map(([k,l])=>`<button class="${st.mode===k?'on':''}" data-mo="${k}">${l}</button>`).join('')}</div>
      <div class="row" style="margin-top:12px"><button class="btn primary sm" data-mgo ${done?'disabled':''}>Mesurer</button></div>
      ${done?`<div class="fb good" style="margin-top:10px"><b>✓ Mesure réussie et justifiée.</b> Passe à la suivante.</div>`:st.res?`<div class="fb ${st.res.ok?'good':'wrong'}" style="margin-top:10px">${st.res.msg}</div>`:''}
      ${!done&&st.res&&st.res.ok?`<div style="margin-top:8px">${t.jq.map((q,qi)=>`<div class="q"><div class="qt">${q.q}</div><div class="opts">${q.o.map((o,oi)=>`<button class="opt ${st.ans[qi]===oi?(oi===q.g?'good':'wrong'):''}" data-mj="${qi}" data-oi="${oi}"><span class="l">${'ABC'[oi]}</span><span>${o}</span></button>`).join('')}</div></div>`).join('')}${st.jfb}</div>`:''}
      ${allOk?`<div class="fb good" style="margin-top:10px"><b>Les quatre mesures sont réussies et justifiées.</b></div>`:''}
    </div></div>`;
    const svg=box.querySelector('svg');
    box.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{ st.t=+b.dataset.mt; st.res=null; st.lcd=null; st.ans={}; st.jfb=''; draw(); });
    box.querySelectorAll('[data-mo]').forEach(b=>b.onclick=()=>{ st.mode=b.dataset.mo; st.res=null; st.lcd=null; st.ans={}; draw(); });
    box.querySelectorAll('[data-mmjack]').forEach(g=>g.onclick=()=>{ st.red=g.dataset.mmjack; st.res=null; st.lcd=null; st.ans={}; draw(); });
    box.querySelectorAll('[data-mmpos]').forEach(g=>g.onclick=()=>{ setPos(g.dataset.mmpos); draw(); });
    const knob=box.querySelector('[data-mmknob]');
    knob.onkeydown=e=>{ const i=MM_POS.findIndex(x=>x.k===st.pos); let j=i;
      if(e.key==='ArrowRight'||e.key==='ArrowUp') j=Math.min(MM_POS.length-1,i+1); else if(e.key==='ArrowLeft'||e.key==='ArrowDown') j=Math.max(0,i-1); else return;
      e.preventDefault(); setPos(MM_POS[j].k); draw(); box.querySelector('[data-mmknob]').focus(); };
    knob.onpointerdown=e=>{ e.preventDefault(); knob.setPointerCapture(e.pointerId); knob.style.cursor='grabbing';
      const pt=svg.createSVGPoint();
      const move=ev=>{ pt.x=ev.clientX; pt.y=ev.clientY; const q=pt.matrixTransform(svg.getScreenCTM().inverse());
        let ang=Math.atan2(q.x-MM_C.x, MM_C.y-q.y)*180/Math.PI; ang=Math.max(MM_A0,Math.min(-MM_A0,ang));
        const j=Math.round((ang-MM_A0)/MM_STEP); if(MM_POS[j].k!==st.pos){ setPos(MM_POS[j].k);
          knob.querySelector('.mmarm').setAttribute('transform',`rotate(${mmAng(j)} ${MM_C.x} ${MM_C.y})`);
          svg.querySelectorAll('[data-mmpos]').forEach(g=>{ const on=g.dataset.mmpos===st.pos; g.querySelector('circle').setAttribute('fill',on?'#ffd34d':'transparent'); g.querySelector('text').setAttribute('fill',on?'#141922':'#e9edf3'); }); } };
      knob.onpointermove=move; move(e);
      knob.onpointerup=knob.onpointercancel=()=>{ knob.onpointermove=null; knob.onpointerup=null; draw(); };
    };
    const go=box.querySelector('[data-mgo]'); if(go) go.onclick=()=>{ st.res=mmEval(t,st); st.lcd=st.res.lcd||null; st.ans={}; st.jfb=''; draw(); };
    box.querySelectorAll('[data-mj]').forEach(b=>b.onclick=()=>{ st.ans[+b.dataset.mj]=+b.dataset.oi;
      const allRight=t.jq.every((q,qi)=>st.ans[qi]===q.g), answered=t.jq.every((q,qi)=>st.ans[qi]!=null);
      if(allRight){ mem[t.k]=true; save(); if(MM_TASKS.every(x=>mem[x.k])) exSet('a7mm'); const nx=MM_TASKS.findIndex(x=>!mem[x.k]); if(nx>=0){ st.t=nx; st.res=null; st.lcd=null; st.ans={}; } }
      else st.jfb=answered?'<div class="fb wrong"><b>Pas encore.</b> Une justification est fausse : relis le tableau des gestes et la règle du calibre.</div>':'';
      draw(); });
  };
  draw();
}

/* ---------- 2.1.6 : la pince ampèremétrique ---------- */
function pinceRead(sel, leak){
  const ph=['L1','L2','L3'].filter(k=>sel[k]).length;
  if(ph===0) return 0;
  if(ph===3) return leak?0.03:0;
  return 8;        // une phase : 8 A ; deux phases : la somme de deux courants décalés de 120° vaut encore 8 A
}
function mountPince(root){
  const box=root.querySelector('#pincesim'), st=WS.pince||(WS.pince={sel:{L1:true},leak:false}), dr=DR(), mem=dr.pince||(dr.pince={});
  const draw=()=>{
    const I=pinceRead(st.sel, st.leak), n=['L1','L2','L3'].filter(k=>st.sel[k]).length;
    if(n===1 && !st.sel.PE) mem.one=true;
    if(n===3) mem.three=true;
    if(n===3 && st.leak) mem.leak=true;
    if(mem.one && mem.three && mem.leak && !P().ex.a8pince){ save(); exSet('a8pince'); }
    const col={L1:'#7a4a21',L2:'#141922',L3:'#8e97a3',PE:'#2f9e44'};
    box.innerHTML=`<div class="grid g2"><div class="figure" style="margin:0"><svg viewBox="0 0 260 205" role="img" aria-label="Pince autour de ${['L1','L2','L3','PE'].filter(k=>st.sel[k]).join(', ')||'aucun conducteur'} : ${fr(I,3)} A">
        <ellipse cx="130" cy="78" rx="96" ry="62" fill="none" stroke="#e8a200" stroke-width="12"/>
        ${['L1','L2','L3','PE'].map((k,i)=>{ const inside=!!st.sel[k], x=inside?96+i*22:30+i*66, y=inside?84:186; return `<circle cx="${x}" cy="${y}" r="11" fill="${col[k]}" stroke="${k==='PE'?'#f2c200':'#fff'}" stroke-width="${k==='PE'?4:2}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">${k}</text>`; }).join('')}
        <rect x="88" y="4" width="84" height="28" rx="6" fill="#cfe3c4"/><text x="166" y="24" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="16" font-weight="700" fill="#14210f">${I<1&&I>0?fr(I*1000,0)+' mA':fr(I,1)+' A'}</text></svg></div>
      <div><p class="small" style="margin-top:0">Câble d'un moteur triphasé qui absorbe 8 A par phase. Choisis les conducteurs à placer dans la mâchoire.</p>
        <div class="seg">${['L1','L2','L3','PE'].map(k=>`<button class="${st.sel[k]?'on':''}" data-pc="${k}">${k}</button>`).join('')}</div>
        <label class="small row" style="margin-top:12px;gap:8px"><input type="checkbox" data-pl ${st.leak?'checked':''}> Défaut d'isolement : 30 mA fuient vers la terre par la carcasse</label>
        <div class="small" style="margin-top:12px">${n===3?(st.leak?'<b>30 mA :</b> les trois phases enserrées, il ne reste que le courant qui ne revient pas — celui de la fuite. C’est le principe du différentiel.':'<b>Zéro !</b> La somme des trois courants d’un circuit équilibré est nulle.'):n===1?'<b>8 A :</b> la mesure correcte, un seul conducteur dans la mâchoire.':n===2?'Deux phases dans la mâchoire : la lecture ne correspond à aucun courant utile. On n’enserre qu’<b>un seul</b> conducteur.':'Aucune phase dans la mâchoire.'}</div>
        <div class="tiny muted" style="margin-top:10px">${mem.one?'✓':'○'} mesurer le courant d'une phase · ${mem.three?'✓':'○'} enserrer les trois phases · ${mem.leak?'✓':'○'} détecter la fuite</div></div></div>`;
    box.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{ st.sel[b.dataset.pc]=!st.sel[b.dataset.pc]; draw(); });
    box.querySelector('[data-pl]').onchange=e=>{ st.leak=e.target.checked; draw(); };
  };
  draw();
}

defChapter({
  num:'2.1', titre:'Sécurité électrique et appareils de mesure de base', tp:'É01',
  evalInfo:'L’évaluation formative 2.1 (25 points, seuil 18) se passe sur papier, en classe, avec ton prof.',
  Q:Q21,
  caps:[
    {id:'a1', sec:'2.1.1 a', t:'Pourquoi ces règles existent', pdf:9, quiz:['a1q1','a1q2','a1q3'],
     body:()=>`<p class="lead">Le courant électrique est dangereux non par sa tension, mais par la <b>quantité de courant qui traverse le corps</b>.</p>
      <p>Le corps s'oppose plus ou moins au passage du courant : assez bien quand la peau est sèche, beaucoup moins dès qu'elle est humide, mouillée ou blessée. Branché sur 230 V, un corps laisse passer environ 150 milliampères. Fais varier la tension et l'état de la peau, et regarde où tombe le courant dans le tableau.</p>
      <div class="figure" id="bodysim"></div>
      <div class="note warn"><b>Le second risque : l'arc électrique</b>Un court-circuit dans un tableau produit un arc dont la température dépasse plusieurs milliers de degrés. Il projette du métal en fusion et s'accompagne d'une onde de pression. Un tournevis mal placé suffit à le déclencher : c'est la raison d'être de l'écran facial et des vêtements non fondants.</div>`,
     mount:mountBody},
    {id:'a2', sec:'2.1.1 b', t:'Les cinq règles d’or', pdf:9, quiz:['a2q1','a2q2','a2q3'], ex:{keys:['a2ord'], lbl:'Remettre les cinq règles dans l’ordre'},
     body:()=>`<p class="lead">Elles s'appliquent <b>dans cet ordre, sans exception et sans raccourci</b>.</p>
      ${tbl(['Règle','Ce que cela veut dire concrètement'],[
        ['1. Séparer','Couper l’installation de toutes ses sources d’alimentation, y compris les sources secondaires : batteries, condensateurs, onduleurs, redresseurs, alimentation de secours, retour par un autre départ.'],
        ['2. Condamner','Verrouiller l’organe de séparation en position ouverte : cadenas personnel et pancarte nominative. Si plusieurs personnes interviennent, chacune pose son propre cadenas sur un moraillon.'],
        ['3. Vérifier l’absence de tension','Au plus près du point de travail, sur tous les conducteurs actifs, avec un vérificateur d’absence de tension testé avant et après (voir 2.1.4).'],
        ['4. Mettre à la terre et en court-circuit','Systématique en haute tension. En basse tension, selon le risque de réalimentation : retour par un autre circuit, induction par une ligne voisine, capacité d’un long câble.'],
        ['5. Délimiter et signaler','Baliser la zone de travail et protéger par des écrans les pièces nues voisines restées sous tension.']])}
      <div class="note warn" style="margin-top:14px"><b>Point de vigilance</b>La vérification d'absence de tension ne remplace jamais la condamnation. Un circuit peut être hors tension au moment de la mesure et réalimenté trente secondes plus tard par quelqu'un qui ne sait pas que vous êtes en train de travailler.</div>
      ${exbox('ordbox','Remets les cinq règles d’or dans l’ordre','Clique sur une règle pour la placer ; clique sur une case pour la retirer.')}`,
     mount:root=>mountOrderW(root.querySelector('#ordbox'),'a2ord',{items:['Séparer','Condamner','Vérifier l’absence de tension','Mettre à la terre et en court-circuit','Délimiter et signaler'],shuffle:[2,4,0,3,1],ok:'Les cinq règles d’or, dans l’ordre.',hint:'Chaque étape rend la suivante possible : on ne condamne que ce qu’on a ouvert.'})},
    {id:'a3', sec:'2.1.1 c-e', t:'EPI, marquages et habilitation', pdf:10, quiz:['a3q1','a3q2','a3q3'], ex:{keys:['a3sort'], lbl:'Classer EPI et EPC'},
     body:()=>`<p class="lead">Les équipements de protection, et les tensions qu'on lit dessus — qui ne veulent pas toutes dire la même chose.</p>
      ${tbl(['Équipement','Ce qu’il faut savoir'],[
        ['Gants isolants (EN 60903)','Classes selon la tension d’emploi maximale : classe 00 → 500 V, classe 0 → 1 000 V, classe 1 → 7 500 V, classe 2 → 17 000 V. Contrôle avant chaque usage : rouler le gant pour le gonfler et détecter une fuite, vérifier l’absence de coupure et la date de contrôle périodique. Des sur-gants en cuir protègent contre les agressions mécaniques.'],
        ['Écran facial ou lunettes','Protection contre l’arc et les projections de métal en fusion.'],
        ['Chaussures de sécurité','Type S3 en atelier : embout de protection, semelle anti-perforation, résistance à l’eau, semelle antidérapante.'],
        ['Vêtements de travail','Coton ou tissu ignifugé, manches longues. Jamais de matière synthétique fondante. Ni bague, ni montre, ni bracelet, ni chaîne : le métal conduit et brûle.'],
        ['Outillage isolé (EN 60900)','Marquage 1 000 V et double triangle. Un outil dont l’isolant est entaillé ou brûlé est retiré du service.'],
        ['Tapis isolant','Isole du sol lors des interventions en armoire.']])}
      <div class="note" style="margin-top:14px"><b>EPI et EPC</b>L'équipement de protection individuelle protège celui qui le porte : gants, lunettes, chaussures. L'équipement de protection collective protège tout le monde : écran devant un jeu de barres, barrière, carter, balisage. La règle est de <b>privilégier la protection collective</b> — elle ne dépend pas de la discipline de chacun.</div>
      <h3 style="margin-top:18px">Où lit-on une tension — et laquelle</h3>
      ${tbl(['Matériel','Tension inscrite','Ce qu’elle signifie'],[
        ['Outillage à main isolé','1000 V uniquement','La norme ne couvre qu’un seul niveau : 1000 V en alternatif, 1500 V en continu. Il n’existe pas d’outil 60900 marqué 500 V ou 600 V.'],
        ['Gants isolants','500, 1000, 7500, 17000 V…','Tension d’emploi maximale, désignée par une classe. C’est ici que l’on rencontre le 500 V.'],
        ['Appareils de mesure','CAT II, III ou IV + 600 V ou 1000 V','Catégorie de mesure et tension admissible selon l’endroit de l’installation (voir 2.1.5). C’est ici que l’on rencontre le 600 V.'],
        ['Mégohmmètre','250, 500 ou 1000 V','La tension d’essai qu’il produit lui-même pour la mesure (chapitre 2.7).']])}
      <div class="note" style="margin-top:14px"><b>Le double triangle</b>Le pictogramme international qui signifie « convient aux travaux sous tension ». Un outil qui ne le porte pas n'est pas un outil isolé, même si son manche est en plastique.</div>
      <div class="note warn" style="margin-top:10px"><b>Qui a le droit d'intervenir</b>Le RGIE distingue la personne avertie (BA4), qui connaît le risque électrique et travaille sous surveillance, et la personne qualifiée (BA5), qui intervient seule. À l'atelier, tu travailles toujours sous la responsabilité de ton prof : c'est lui qui autorise la mise sous tension.</div>
      ${exbox('sortbox','EPI ou EPC ?','Pour chaque équipement, dis s’il protège celui qui le porte (EPI) ou tout le monde (EPC).')}`,
     mount:root=>mountSortW(root.querySelector('#sortbox'),'a3sort',{cats:[['epi','EPI'],['epc','EPC']],items:[
        ['Gants isolants classe 0','epi'],['Écran de protection devant un jeu de barres','epc','Il protège toute personne qui s’approche du jeu de barres.'],['Lunettes de protection','epi'],
        ['Balisage de la zone de travail','epc'],['Chaussures de sécurité S3','epi'],['Carter remonté sur une transmission','epc'],['Vêtements en coton à manches longues','epi'],['Barrière devant l’armoire ouverte','epc']],
        ok:'Juste. Et retiens la règle : la protection collective d’abord, parce qu’elle ne dépend pas de la discipline de chacun.'})},
    {id:'a4', sec:'2.1.2', t:'L’analyse de risques de dernière minute', pdf:12, quiz:['a4q1','a4q2'], ex:{keys:['a4ardm'], lbl:'Compléter une fiche ARDM'},
     body:()=>`<p class="lead">L'<b>ARDM</b> — ou LMRA, <i>Last Minute Risk Analysis</i> — est une vérification courte que tu fais toi-même, sur place, juste avant de commencer.</p>
      <p>Sa raison d'être tient en une phrase : entre le moment où le travail a été préparé, parfois la veille, et le moment où on le commence, <b>la situation a pu changer</b>. Une autre équipe est passée, une fuite est apparue, un échafaudage a été déplacé, la machine voisine a été remise en service.</p>
      <h3>Les questions à se poser</h3>
      <ul class="ctrlq"><li>Quelle est exactement la tâche ? Ai-je le bon « bon de travail » ?</li><li>Suis-je au bon endroit, sur la bonne machine ? Le repère correspond-il au bon de travail ?</li><li>Quelles énergies sont présentes : électrique, pneumatique, hydraulique, mécanique, thermique, chimique ?</li><li>Quels sont les risques pour moi ? Pour les personnes autour ?</li><li>Ai-je les EPI, l'outillage et les autorisations nécessaires ?</li><li>Que se passe-t-il si ça tourne mal ? Où sont l'arrêt d'urgence, l'issue, l'extincteur ?</li></ul>
      <div class="note warn" style="margin-top:14px"><b>Une seule case NON</b>Je ne commence pas et j'avertis le responsable.</div>
      <p class="small">Quatre règles d'usage : l'analyse se fait <b>sur le lieu même</b> et non au bureau ; elle prend <b>deux à trois minutes</b> ; elle est <b>refaite si les conditions changent</b> ; elle est <b>nominative</b> — c'est celui qui exécute qui la remplit.</p>
      ${exbox('ardmbox','Fiche ARDM — à toi de la remplir','<b>Bon de travail n° 118 :</b> remplacer le détecteur B3 sur la presse repérée P12. Sur place, tu constates : la plaque de la machine indique P12 ; le bon est signé et tu comprends la tâche ; le sectionneur Q0 porte ton cadenas et tu as vérifié l’absence de tension au VAT ; tes gants et tes lunettes sont en ordre ; ta caisse contient l’outillage isolé et le multimètre ; la zone est balisée ; tu as repéré l’arrêt d’urgence et l’extincteur. Mais une flaque d’huile s’étend sous la presse depuis ce matin, et le manomètre du vérin indique encore 80 bar.')}`,
     mount:root=>mountSortW(root.querySelector('#ardmbox'),'a4ardm',{cats:[['oui','OUI'],['non','NON']],items:[
        ['Je suis sur la bonne machine — le repère correspond au bon de travail','oui'],
        ['J’ai le bon de travail et je comprends la tâche à réaliser','oui'],
        ['L’installation est consignée et je l’ai vérifié moi-même','non','Le circuit hydraulique est toujours sous pression : seule l’énergie électrique est consignée.'],
        ['J’ai mes EPI, ils sont adaptés et en bon état','oui'],
        ['J’ai l’outillage et les appareils de mesure nécessaires','oui'],
        ['La zone de travail est balisée et personne n’y est exposé','oui'],
        ['Je sais où se trouvent l’arrêt d’urgence, l’issue et l’extincteur','oui'],
        ['Rien n’a changé depuis la préparation du travail','non','Une fuite est apparue depuis ce matin.']],
        ok:'Deux cases NON : tu ne commences pas, et tu avertis le responsable. C’est exactement à ça que sert l’ARDM.'})},
    {id:'a5', sec:'2.1.3', t:'Consignation et déconsignation', pdf:13, quiz:['a5q1','a5q2','a5q3'], ex:{keys:['a5ord','a5en'], lbl:'La procédure et les quatre énergies'},
     body:()=>`<p class="lead"><b>Consigner</b>, c'est l'ensemble des opérations qui mettent et maintiennent une installation hors d'état de fonctionner et hors de danger, pour la durée de l'intervention. <b>Déconsigner</b>, c'est la remettre en état, dans l'ordre inverse et avec les mêmes précautions.</p>
      <p>Avant toute chose, la zone est délimitée : barrières, rubans, cônes, écrans, panneaux « travaux en cours — ne pas manœuvrer ». Selon l'entreprise, une autorisation écrite est exigée : bon de travail, permis de feu (soudage, meulage, tronçonnage), permis d'espace confiné, permis de travail en hauteur.</p>
      ${exbox('consbox','Remets la procédure de consignation électrique dans l’ordre','Dix étapes, de la préparation au balisage.')}
      <h3>Les quatre énergies</h3>
      <p>Sur une installation pluritechnologique, couper le courant ne suffit pas.</p>
      ${tbl(['Énergie','Neutralisation et pièges'],[
        ['Électrique','Ouvrir, condamner, vérifier l’absence de tension. Attention aux sources résiduelles : condensateurs d’un variateur de vitesse — respecter le temps de décharge affiché, souvent plusieurs minutes ; batteries et onduleurs ; alimentation par un second départ.'],
        ['Mécanique','Masses encore lancées, charges qui peuvent tomber, ressorts comprimés, vérins verticaux. L’électricien contrôle que c’est neutralisé — les gestes de blocage sont vus au cours de Mécanique.'],
        ['Pneumatique','Fermer l’alimentation, purger jusqu’à 0 bar, vérifier au manomètre, purger les réservoirs tampon.'],
        ['Hydraulique','Fermer le circuit, dépressuriser par la vanne de retour au réservoir, vérifier au manomètre, purger les accumulateurs. Un accumulateur reste sous pression même pompe à l’arrêt.']])}
      <div class="note" style="margin-top:14px"><b>La vérification finale</b>On tente une mise en marche par la commande normale — rien ne doit bouger — et on lit tous les manomètres — tout doit être à zéro. Le <b>plan d'intervention de sécurité</b> de la machine liste les organes de séparation, l'ordre des manœuvres, les points de purge et les temps de décharge : le consulter fait partie de la préparation.</div>
      ${exbox('enbox','À quelle énergie correspond chaque geste ?')}
      <h3>La déconsignation</h3>
      <ol class="ctrlq"><li>Vérifier que les outils sont retirés, les protections et carters remontés, que personne ne reste dans la zone.</li><li>Retirer les mises à la terre et en court-circuit.</li><li>Retirer son cadenas — et seulement le sien.</li><li>Prévenir le responsable et l'exploitant.</li><li>Refermer l'organe de séparation.</li><li>Remettre les fluides en pression, réarmer les protections, rétablir les paramètres.</li><li>Retirer le balisage.</li><li>Procéder à l'essai de fonctionnement avec l'utilisateur.</li></ol>
      <div class="note bad" style="margin-top:14px"><b>Règle absolue</b>Seul celui qui a posé un cadenas peut le retirer. Retirer le cadenas d'un collègue, quelle que soit la raison invoquée, revient à décider seul qu'il n'est plus en danger.</div>`,
     mount:root=>{
       mountOrderW(root.querySelector('#consbox'),'a5ord',{items:['Préparer : bon de travail, schéma, EPI, VAT, cadenas, pancarte','Identifier l’organe de séparation sur le schéma, puis le retrouver grâce à son repère','Prévenir l’exploitant et arrêter la machine par sa commande normale','Ouvrir l’organe de séparation','Condamner : cadenas personnel et pancarte nominative','Tester le VAT sur une source de tension connue','Vérifier l’absence de tension au plus près du point de travail','Retester le VAT sur la source connue','Mettre à la terre et en court-circuit si le risque l’exige','Baliser la zone : l’installation est consignée'],shuffle:[4,0,7,2,9,5,1,8,3,6],ok:'La procédure de consignation électrique, dans l’ordre.',hint:'Les cinq règles d’or donnent la colonne vertébrale ; le VAT se teste avant et après la mesure.'});
       mountSortW(root.querySelector('#enbox'),'a5en',{cats:[['el','Électrique'],['me','Mécanique'],['pn','Pneumatique'],['hy','Hydraulique']],items:[
         ['Respecter le temps de décharge des condensateurs du variateur','el'],['Purger les réservoirs tampon jusqu’à 0 bar','pn'],['Purger l’accumulateur, qui reste sous pression pompe à l’arrêt','hy'],['Bloquer une charge qui peut tomber','me'],['Couper l’onduleur qui secourt l’armoire','el'],['Dépressuriser par la vanne de retour au réservoir','hy'],['Attendre l’arrêt d’un volant encore lancé','me']],ok:'Juste : quatre énergies, quatre procédures.'});
     }},
    {id:'a6', sec:'2.1.4', t:'Le vérificateur d’absence de tension', pdf:15, quiz:['a6q1','a6q2','a6q3'], ex:{keys:['a6vat'], lbl:'Les trois temps, deux scénarios'},
     body:()=>`<p class="lead">Le <b>VAT</b> sert à <b>prouver</b> qu'un conducteur n'est pas sous tension. C'est la troisième des cinq règles d'or : sans cette preuve, tout le reste de la consignation ne vaut rien — on croit l'installation coupée, on ne le sait pas.</p>
      <p>C'est un boîtier de la taille d'une grosse télécommande, prolongé par deux cordons à pointes de touche munies d'une garde. Il <b>n'a pas de sélecteur de fonction</b> : il ne fait qu'une chose, dire s'il y a de la tension entre ses deux pointes. On ne peut donc pas se tromper de position.</p>
      <div class="note warn"><b>Ce qui n'est pas un VAT</b>Un multimètre n'est pas un VAT : resté sur un mauvais calibre, sur la fonction résistance ou avec une pile déchargée, il affichera zéro sur un conducteur sous tension. Le tournevis testeur à néon est proscrit : pas de catégorie de mesure, dépend du contact du doigt avec la terre, faux négatifs.</div>
      ${tbl(['Temps','Opération','Pourquoi'],[['1','Tester le VAT sur une source de tension connue','Prouver qu’il fonctionne avant de s’en servir'],['2','Vérifier l’absence de tension sur l’installation consignée','C’est la mesure utile'],['3','Retester le VAT sur la source connue','Prouver qu’il fonctionnait encore pendant la mesure']])}
      ${exbox('vatsim','La règle des trois temps','Réalise les trois temps dans l’ordre, puis conclus. Deux scénarios.')}
      <h3>Où et quoi mesurer</h3>
      <p>Au plus près de l'endroit où l'on va travailler, et non à l'armoire : un conducteur peut être alimenté par un autre chemin. En triphasé, on mesure <b>toutes les combinaisons</b> : entre phases (L1-L2, L2-L3, L1-L3), entre chaque phase et le neutre, entre chaque phase et la terre, et entre le neutre et la terre.</p>
      <p class="small muted">Contrôles avant usage : état des cordons et des pointes, présence des garde-doigts, date de vérification, catégorie de mesure adaptée.</p>`,
     mount:mountVat},
    {id:'a7', sec:'2.1.5', t:'Le multimètre', pdf:16, quiz:['a7q1','a7q2','a7q3'], ex:{keys:['a7mm'], lbl:'Les quatre mesures, justifiées'},
     body:()=>`<p class="lead">Trois bornes, trois gestes — et une erreur à ne jamais commettre.</p>
      ${tbl(['Borne','Usage'],[['COM','Commun. Le cordon noir y reste en permanence.'],['VΩ','Tension, résistance, continuité, test de diode. Cordon rouge.'],['mA et 10 A','Entrées de mesure du courant, protégées par un fusible.']])}
      <div class="note bad" style="margin-top:14px"><b>L'erreur classique</b>Laisser le cordon rouge dans l'entrée 10 A et mesurer une tension : la résistance interne est quasi nulle, c'est un court-circuit franc. Au mieux le fusible fond, au pire l'appareil explose. <b>Après chaque mesure de courant, remettre immédiatement le cordon rouge en VΩ.</b></div>
      ${tbl(['Grandeur','Le geste','La règle de sécurité'],[['Tension','Les deux pointes à cheval sur le composant, sans rien démonter. Le circuit reste entier.','Circuit sous tension : gants, garde-doigts, une main dans la poche.'],['Courant','On ouvre le circuit et on insère l’appareil dans la coupure : tout le courant le traverse.','Jamais à cheval en mode courant : c’est un court-circuit.'],['Résistance et continuité','Les deux pointes aux bornes du composant.','Circuit obligatoirement hors tension, composant si possible déconnecté.']])}
      ${exbox('mmsim','Au multimètre','Pour chaque mesure : règle toi-même le sélecteur et le cordon rouge, pose les pointes, mesure — puis justifie ton réglage. Les erreurs sont permises ici, pas à l’atelier.')}
      <h3>Le calibre et la lecture</h3>
      <ul class="ctrlq"><li>À sélection manuelle : partir du calibre le plus élevé et descendre progressivement.</li><li>À sélection automatique : vérifier l'unité affichée — un 230 lu en millivolts n'est pas 230 V.</li><li>« OL » ou « 1. » seul : la valeur dépasse le calibre.</li><li>Une pile faible fausse silencieusement la lecture : contrôler l'indicateur de pile.</li></ul>
      <h3>La catégorie de mesure</h3>
      <p>Le point de sécurité le plus souvent ignoré. Plus on se rapproche de la source, plus les surtensions possibles sont énergétiques, plus la catégorie exigée est élevée.</p>
      ${tbl(['Catégorie','Où','Exemples'],[['CAT II','Circuits terminaux','Appareils raccordés par une prise'],['CAT III','Distribution fixe','Tableaux de distribution, départs moteurs, jeux de barres d’atelier'],['CAT IV','Origine de l’installation','Arrivée du réseau, compteur, protection générale, extérieur']])}
      <p class="small">En maintenance industrielle, <b>CAT III 600 V est un minimum</b> ; CAT III 1000 V ou CAT IV 600 V est la norme. Les cordons portent aussi une catégorie, et c'est toujours le maillon le plus faible qui commande.</p>
      <div class="note"><b>Valeurs de référence du réseau belge</b>Entre phases, 400 V. Entre phase et neutre, 230 V. En continuité, un circuit fermé donne une valeur proche de 0 Ω ; un circuit coupé affiche OL. La mesure d'isolement exige un mégohmmètre (chapitre 2.7).</div>`,
     mount:mountMM},
    {id:'a8', sec:'2.1.6-2.1.7', t:'La pince et l’outillage', pdf:17, quiz:['a8q1','a8q2','a8q3'], ex:{keys:['a8pince'], lbl:'Les trois essais à la pince'},
     body:()=>`<p class="lead">La pince ampèremétrique mesure un courant <b>sans ouvrir le circuit</b>. C'est le seul moyen pratique de connaître le courant d'un moteur en service et de le comparer à sa plaque signalétique.</p>
      ${tbl(['Type','Principe et conséquence'],[['Pince alternative','Comme un transformateur de courant : le conducteur enserré est le primaire, l’enroulement de la mâchoire le secondaire. Ne mesure que l’alternatif.'],['Pince alternatif/continu','Capteur à effet Hall dans l’entrefer. Mesure aussi le continu, mais demande une mise à zéro avant la mesure.']])}
      ${exbox('pincesim','La règle absolue : un seul conducteur','Fais les trois essais : une phase seule, les trois phases, puis les trois phases avec un défaut d’isolement.')}
      <ul class="ctrlq"><li>Refermer complètement les mâchoires et les garder propres : un entrefer fausse la mesure.</li><li>Centrer le conducteur, se méfier des champs voisins.</li><li>Valeur efficace vraie dès qu'un variateur ou une charge non linéaire est présent.</li><li>La pince se pose sur un conducteur isolé et porte elle aussi une catégorie de mesure.</li></ul>
      <h3 style="margin-top:18px">Le matériel et l'outillage</h3>
      ${tbl(['Outil','Usage'],[['Tournevis isolés','Jeu complet ; lame fine d’électricien pour les bornes à vis'],['Tournevis dynamométrique','Couple prescrit sur les bornes de puissance : trop faible, la borne chauffe ; trop fort, elle se déforme'],['Pinces','Universelle, coupante, à becs longs, à becs demi-ronds'],['Pince à dénuder','Réglable ou automatique — ne jamais entailler le cuivre'],['Pince à sertir','Pour les embouts : le cliquet garantit un sertissage mené à son terme'],['Couteau d’électricien','Dégainage des câbles'],['Clés Allen isolées','Bornes de puissance et fixations en armoire']])}
      <div class="note warn" style="margin-top:14px"><b>Rangement et contrôle</b>Chaque outil à sa place : un outil oublié dans une armoire devient un court-circuit à la remise sous tension. Contrôle visuel de l'outillage et des cordons avant chaque usage, étiquette de contrôle à jour sur les appareils de mesure. Ranger le poste en fin d'intervention : c'est un indicateur évalué à l'épreuve.</div>
      <div class="note" style="margin-top:10px"><b>★ Dessin</b>Commande et puissance, le repère d’appareil au format -2S3E et les références croisées : <button class="revoir" data-goto="a9">Dessin 1 →</button>, à la fin de ce chapitre, avant le TP É01.</div>`,
     mount:mountPince},
  ],
  prereq:[
    {t:'Mettre ses EPI et vérifier ses gants isolants.', cap:'a3'},
    {t:'Compléter une fiche ARDM.', cap:'a4'},
    {t:'Tester un VAT, l’utiliser, le retester.', cap:'a6'},
    {t:'Choisir la borne, la fonction et le calibre d’un multimètre pour une mesure donnée.', cap:'a7'},
    {t:'Mesurer une résistance et une continuité hors tension, une tension alternative et continue.', cap:'a7'},
    {t:'Poser une pince ampèremétrique sur un seul conducteur.', cap:'a8'},
  ],
  controle:[
    ['Énoncer les cinq règles d’or dans l’ordre. Pourquoi l’ordre est-il imposé ?','a2'],
    ['Quelle intensité traversant le corps provoque la tétanisation ? À partir de quelle valeur y a-t-il risque d’arrêt cardiaque ?','a1'],
    ['Quelle est la différence entre un EPI et un EPC ? Donner deux exemples de chaque.','a3'],
    ['Citer trois situations dans lesquelles il faut refaire une analyse de risques de dernière minute.','a4'],
    ['Une machine possède un vérin vertical chargé et un variateur de vitesse. Quelles énergies faut-il neutraliser et comment ?','a5'],
    ['Pourquoi retester le VAT après la mesure ?','a6'],
    ['On veut mesurer le courant d’un circuit. Où branche-t-on l’appareil, et pourquoi faut-il ouvrir le circuit ?','a7'],
    ['Que se passe-t-il si on mesure une tension avec le cordon rouge resté dans l’entrée 10 A ?','a7'],
    ['Que signifie CAT III 1000 V ? Un tel appareil convient-il pour intervenir dans un tableau d’atelier ?','a7'],
    ['Pourquoi une pince ampèremétrique affiche-t-elle zéro si l’on enserre les trois phases ?','a8'],
  ],
});
})();
