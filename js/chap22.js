/* =========================================================
   CHAPITRE 2.2 — LES BASES DE L'ÉLECTRICITÉ
   Contenu repris du cours d'Électricité 4e, pages 23 à 52.
   Les réponses des calculs sont calculées ici, pas recopiées.
   Les questions de la plateforme ne sont PAS celles de l'évaluation formative 2.2.
   ========================================================= */
(function(){
/* lien vers le labo « Lois de base en électricité » (Outils), ouvert sur le bon onglet */
const labo=(tab,txt)=>`<div class="note" style="margin:14px 0"><b>Pour aller plus loin : le labo des lois de base</b>${txt} <a class="btn sm" style="margin-left:6px" href="outils/lois-electricite.html#${tab}" target="_blank" rel="opener">Ouvrir le labo ↗</a></div>`;
const R3=Math.sqrt(3), RHO=0.0225, RHO_AL=0.036;
const Q22 = {
  b1q1:{q:"Qu'est-ce qu'un courant électrique ?",o:["Le déplacement d'ensemble des électrons libres dans une même direction","L'agitation des électrons au hasard","La chaleur qui circule dans le métal"],g:0,e:"Tant que les électrons libres s'agitent au hasard, il ne se passe rien. Dès qu'on les pousse tous du même côté, il y a courant.",r:'b1'},
  b1q2:{q:"Une gaine en PVC est entaillée. Isole-t-elle encore ?",o:["Oui, le PVC est toujours isolant","Non : un isolant n'est jamais absolu — une gaine entaillée n'isole plus","Seulement en continu"],g:1,e:"L'air sec isole mais un arc le traverse ; le bois sec isole, le bois humide non ; une gaine intacte isole, une gaine entaillée non.",r:'b1'},
  b2q1:{q:"Le circuit est ouvert en un seul point. Que se passe-t-il ailleurs dans le circuit ?",o:["Le courant continue ailleurs","Rien ne circule nulle part","Le courant s'accumule au point d'ouverture"],g:1,e:"La condition : le circuit doit être fermé. Ouvert en un seul point, rien ne circule nulle part.",r:'b2'},
  b2q2:{q:"Pourquoi le courant devient-il énorme dans un court-circuit ?",o:["Parce que la tension augmente","Parce qu'il n'y a plus de récepteur pour le limiter : il ne reste que la très faible résistance des conducteurs","Parce que le fusible le provoque"],g:1,e:"C'est le récepteur qui limite le courant. Sans lui, conducteurs qui chauffent, isolant qui fond, arc.",r:'b2'},
  b3q1:{q:"Laquelle de ces phrases est correcte ?",o:["« La tension de ce fil est de 230 V »","« La tension entre ce fil et le neutre est de 230 V »","« Le courant entre les deux bornes est de 2 A »"],g:1,e:"Une tension existe toujours ENTRE deux points. Le courant, lui, TRAVERSE un composant.",r:'b3'},
  b3q2:{q:"Où s'arrête l'analogie de l'eau ?",o:["Elle est valable partout","L'eau qui fuit tombe par terre, alors que l'électricité qui « fuit » cherche à revenir à sa source — et peut passer par toi","Elle ne marche que pour la résistance"],g:1,e:"Il ne faut pas s'y fier au-delà des trois lignes du tableau.",r:'b3'},
  b3q3:{q:"Quel ordre de grandeur pour un moteur d'atelier ?",o:["0,02 A","5 à 15 A","Plusieurs milliers d'ampères"],g:1,e:"0,02 A, c'est une LED ; plusieurs milliers d'ampères, c'est un court-circuit.",r:'b3'},
  b4q1:{q:"La résistance vaut 1,5 kΩ. Que faut-il écrire dans la formule ?",o:["1,5","1 500","0,0015"],g:1,e:"On convertit d'abord, on calcule ensuite. Écrire 1,5 au lieu de 1 500 donne une erreur d'un facteur mille.",r:'b4'},
  b4q2:{q:"Une batterie porte l'indication 90 Ah. Que représente ce nombre ?",o:["Une quantité d'électricité : courant × durée","Une tension","Une puissance"],g:0,e:"Q = I × t. 90 Ah alimentent 1,5 A pendant 60 heures, ou 3 A pendant 30 heures.",r:'b4'},
  b5q1:{q:"On mesure 0,8 Ω sur un enroulement de moteur 230 V. Va-t-il absorber 230 ÷ 0,8 = 287 A ?",o:["Oui, c'est la loi d'Ohm","Non : la loi d'Ohm ne permet pas de calculer directement le courant d'un moteur — on lit sa plaque signalétique","Oui, mais seulement au démarrage"],g:1,e:"La loi d'Ohm s'applique aux composants qui se comportent comme des résistances. Pas aux moteurs ni aux tubes fluorescents.",r:'b5'},
  b5q2:{q:"Corps aux mains sèches (1 500 Ω) sous 230 V : environ 153 mA. Que dire de ce courant ?",o:["Il est sans danger","Il dépasse trois fois le seuil de fibrillation (50 mA)","Il est juste au seuil de perception"],g:1,e:"Et si la peau est humide, la résistance tombe à quelques centaines d'ohms : le courant est multiplié par cinq ou par dix.",r:'b5'},
  b6q1:{q:"Deux lampes sont en parallèle. L'une grille. Que devient l'autre ?",o:["Elle s'éteint aussi","Elle continue de fonctionner","Elle éclaire deux fois plus"],g:1,e:"En parallèle, chaque branche reçoit la même tension et fonctionne seule. C'est pour ça que les prises et luminaires d'un bâtiment sont en parallèle.",r:'b6'},
  b6q2:{q:"Pourquoi les organes de sécurité d'une machine sont-ils câblés en série ?",o:["Pour économiser du fil","Si un seul s'ouvre, la machine s'arrête — c'est exactement ce qu'on veut","Pour que le courant se partage"],g:1,e:"Ce n'est pas un défaut du montage série : c'est ce qu'on lui demande.",r:'b6'},
  b6q3:{q:"Un élève annonce 145 Ω pour 100 Ω et 250 Ω en parallèle. Sans calculer, pourquoi est-ce faux ?",o:["En parallèle, le résultat est plus petit que la plus petite des deux : moins de 100 Ω","Il faut additionner : 350 Ω","Il faut faire la moyenne"],g:0,e:"Ajouter un chemin facilite le passage du courant, donc fait baisser la résistance. La bonne valeur est 71,4 Ω.",r:'b6'},
  b7q1:{q:"Le courant double dans un conducteur. Que devient l'échauffement ?",o:["Il double","Il est multiplié par quatre","Il ne change pas"],g:1,e:"P = R × I² : le courant intervient au carré. C'est pourquoi une surcharge modeste finit par détruire un bobinage.",r:'b7'},
  b7q2:{q:"La plaque d'un moteur indique 4 kW. Est-ce la puissance qu'il prend au réseau ?",o:["Oui","Non : c'est la puissance mécanique sur l'arbre, plus faible que la puissance absorbée","Non : c'est la puissance au démarrage"],g:1,e:"Une partie est perdue en chaleur. L'écart entre les deux, c'est le rendement.",r:'b7'},
  b8q1:{q:"Que signifie « 50 Hz » sur le réseau belge ?",o:["Le courant change de sens 50 fois par seconde","La tension vaut 50 V","Le réseau a 50 phases"],g:0,e:"En alternatif, le courant s'inverse régulièrement : 50 fois par seconde chez nous.",r:'b8'},
  b8q2:{q:"Tu mesures du 230 V alternatif en position continue (V⎓). Que risques-tu ?",o:["Rien, la lecture est la même","Lire une valeur proche de zéro et croire l'installation hors tension","Faire fondre le fusible"],g:1,e:"Sur le multimètre, il faut choisir AC ou DC.",r:'b8'},
  b8q3:{q:"Entre les trois phases, tu lis 400 V, 400 V et 0 V. Diagnostic ?",o:["Tout va bien","Une phase est perdue — un moteur qui tourne dans cet état grille en quelques minutes","On est sur un réseau 230 V"],g:1,e:"Trois mesures, trois diagnostics, sans rien démonter.",r:'b8'},
  b8q4:{q:"Un fil vert-jaune peut-il servir de phase, même provisoirement ?",o:["Oui, s'il est bien repéré","Jamais : il est strictement réservé au conducteur de protection","Oui, en commande 24 V"],g:1,e:"Un vert-jaune utilisé comme phase est un danger mortel pour le prochain intervenant.",r:'b8'},
  b9q1:{q:"On double la longueur d'un câble. Que devient sa résistance ?",o:["Elle double","Elle est divisée par deux","Elle ne change pas"],g:0,e:"R = ρ × L ÷ S : la résistance est proportionnelle à la longueur, inversement proportionnelle à la section.",r:'b9'},
  b9q2:{q:"Pourquoi prend-on ρ = 0,0225 pour le cuivre dans les calculs de câble, et pas 0,018 ?",o:["Pour arrondir","Parce que la résistivité augmente avec la température : on prend la valeur du câble en service","Parce que le cuivre industriel est impur"],g:1,e:"0,018 est la valeur à 20 °C. Un conducteur qui travaille chauffe, donc résiste davantage.",r:'b9'},
  b9q3:{q:"La section d'un conducteur, c'est…",o:["Le diamètre extérieur du fil isolé","La surface de la coupe du cuivre, en mm²","Le nombre de brins"],g:1,e:"Sur le terrain, on mesure le diamètre de l'âme dénudée et on en déduit la section : S = π × d² ÷ 4.",r:'b9'},
  b10q1:{q:"Pourquoi met-on un embout sur un conducteur souple ?",o:["Pour la couleur","Sans lui, les brins s'écrasent et se dispersent : un seul brin qui touche la borne voisine, c'est un court-circuit","Pour pouvoir le dévisser plus vite"],g:1,e:"Embout choisi à la section, tous les brins au fond, sertissage à la pince à cliquet, puis on tire dessus.",r:'b10'},
  b10q2:{q:"Quand pose-t-on les bagues numérotées ?",o:["Après la mise sous tension","À une extrémité seulement","Aux deux extrémités, AVANT la connexion"],g:2,e:"Un fil non repéré, c'est un fil qu'il faudra suivre à la main dans dix ans.",r:'b10'},
  b10q3:{q:"Les quatre contrôles hors tension sont bons. Tu mets sous tension ?",o:["Oui, tout de suite","Non : j'appelle le professeur pour la mise sous tension","Oui, si le disjoncteur est neuf"],g:1,e:"Puis seulement, on appelle le professeur. Jamais avant.",r:'b10'},
};

/* ---------- 2.2.2 : le circuit ---------- */
function circuitSVG(st){
  const closed=st.sw && !st.cut, short=st.short && st.sw && !st.cut, lamp=closed && !short;
  const w=short?'wire-hot':'', col=closed?'var(--live)':'var(--steel)';
  return `<svg viewBox="0 0 360 200" role="img" aria-label="Circuit : interrupteur ${st.sw?'fermé':'ouvert'}${st.cut?', fil de retour coupé':''}${short?', court-circuit':''}, lampe ${lamp?'allumée':'éteinte'}">
    <rect x="22" y="70" width="44" height="60" rx="6" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/><text x="44" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink-2)">+</text><text x="44" y="120" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink-2)">–</text><text x="44" y="150" text-anchor="middle" font-size="10" fill="var(--muted)">source</text>
    <path class="${w}" d="M44 70 V30 H140" stroke="${col}" stroke-width="5" fill="none"/>
    ${st.sw?`<line x1="140" y1="30" x2="190" y2="30" stroke="${col}" stroke-width="5"/>`:`<line x1="140" y1="30" x2="184" y2="8" stroke="var(--steel)" stroke-width="5"/>`}
    <circle cx="140" cy="30" r="5" fill="var(--ink)"/><circle cx="190" cy="30" r="5" fill="var(--ink)"/><text x="165" y="52" text-anchor="middle" font-size="10" fill="var(--muted)">interrupteur</text>
    <path class="${w}" d="M190 30 H300 V80" stroke="${col}" stroke-width="5" fill="none"/>
    <circle cx="300" cy="100" r="20" fill="${lamp?'#ffd34d':'var(--surface)'}" stroke="var(--ink-2)" stroke-width="2" ${lamp?'style="filter:drop-shadow(0 0 10px #ffcc33)"':''}/><path d="M286 86 L314 114 M314 86 L286 114" stroke="var(--ink-2)" stroke-width="2"/><text x="335" y="104" font-size="10" fill="var(--muted)">lampe</text>
    <path class="${w}" d="M300 120 V170 H${st.cut?190:44} ${st.cut?'':'V130'}" stroke="${col}" stroke-width="5" fill="none"/>
    ${st.cut?`<path d="M170 170 H44 V130" stroke="var(--steel)" stroke-width="5" fill="none"/><text x="180" y="190" text-anchor="middle" font-size="10" fill="var(--bad)">fil coupé</text>`:''}
    ${st.short?`<line x1="276" y1="76" x2="276" y2="160" stroke="#596273" stroke-width="7" stroke-linecap="round"/><line x1="276" y1="80" x2="300" y2="80" stroke="#596273" stroke-width="4"/><line x1="276" y1="160" x2="300" y2="160" stroke="#596273" stroke-width="4"/><text x="262" y="122" text-anchor="end" font-size="10" fill="var(--bad)">tournevis</text>`:''}
  </svg>`;
}
function mountCircuit(root){
  const box=root.querySelector('#circsim'), st=WS.circ||(WS.circ={sw:true,cut:false,short:false}), mem=DR().circ||(DR().circ={});
  const draw=()=>{
    const closed=st.sw&&!st.cut, short=st.short&&closed;
    if(closed&&!short) mem.on=true; if(!closed) mem.off=true; if(short) mem.short=true;
    if(mem.on&&mem.off&&mem.short&&!P().ex.b2sim){ save(); exSet('b2sim'); }
    box.innerHTML=`<div class="figure" style="margin:0"><div style="max-width:460px;margin:0 auto">${circuitSVG(st)}</div></div>
      <div class="row wrap" style="margin-top:10px"><button class="toggle ${st.sw?'on':''}" data-csw><span class="sw"></span>Interrupteur ${st.sw?'fermé':'ouvert'}</button>
        <button class="btn sm" data-ccut>${st.cut?'Réparer le fil de retour':'Couper le fil de retour'}</button>
        <button class="btn sm" data-cshort style="${st.short?'border-color:var(--bad);color:var(--bad)':''}">${st.short?'Retirer le tournevis':'Un tournevis touche les deux bornes de la lampe'}</button></div>
      <p class="small" style="margin:10px 0 0">${short?'<b style="color:var(--bad)">Court-circuit !</b> Le courant revient à la source sans passer par la lampe. Plus rien ne le limite : il devient énorme en une fraction de seconde, les conducteurs chauffent violemment. C’est contre cela que protègent fusible et disjoncteur (chapitre 2.5).':!closed?'Le circuit est ouvert en un point : rien ne circule <b>nulle part</b>, la lampe est éteinte.':'Circuit fermé : source, aller, récepteur, retour. Le courant circule, la lampe éclaire.'}</p>
      <div class="tiny muted" style="margin-top:6px">${mem.on?'✓':'○'} circuit fermé · ${mem.off?'✓':'○'} circuit ouvert · ${mem.short?'✓':'○'} court-circuit</div>`;
    box.querySelector('[data-csw]').onclick=()=>{ st.sw=!st.sw; draw(); };
    box.querySelector('[data-ccut]').onclick=()=>{ st.cut=!st.cut; draw(); };
    box.querySelector('[data-cshort]').onclick=()=>{ st.short=!st.short; draw(); };
  };
  draw();
}

/* ---------- 2.2.4 : la loi d'Ohm, interactive ---------- */
function mountOhmLab(root){
  const box=root.querySelector('#ohmlab'), st=WS.ohmlab||(WS.ohmlab={find:'I',U:230,R:100,I:10});
  const html=()=>{
    let res, line;
    if(st.find==='I'){ res=st.U/st.R; line=`I = U ÷ R = ${fr(st.U,1)} ÷ ${fr(st.R,1)} = <b>${fr(res,3)} A</b>`; }
    if(st.find==='U'){ res=st.R*st.I; line=`U = R × I = ${fr(st.R,1)} × ${fr(st.I,2)} = <b>${fr(res,2)} V</b>`; }
    if(st.find==='R'){ res=st.U/st.I; line=`R = U ÷ I = ${fr(st.U,1)} ÷ ${fr(st.I,2)} = <b>${fr(res,2)} Ω</b>`; }
    const sl=(k,lbl,min,max,step,u)=>`<label class="small" style="display:block;margin:8px 0"><b>${lbl} = ${fr(st[k],k==='I'?2:1)} ${u}</b><input type="range" min="${min}" max="${max}" step="${step}" value="${st[k]}" data-ol="${k}" style="width:100%"></label>`;
    return `<div class="grid g2"><div>
        <div class="kicker" style="margin-bottom:6px">Je cherche…</div>
        <div class="seg">${[['I','le courant I'],['U','la tension U'],['R','la résistance R']].map(([k,l])=>`<button class="${st.find===k?'on':''}" data-of="${k}">${l}</button>`).join('')}</div>
        ${st.find!=='U'?sl('U','U',1,400,1,'V'):''}${st.find!=='R'?sl('R','R',1,2000,1,'Ω'):''}${st.find!=='I'?sl('I','I',0.01,20,0.01,'A'):''}
      </div><div>
        <svg viewBox="0 0 200 160" role="img" aria-label="Triangle de la loi d'Ohm, ${st.find} caché" style="max-width:240px;margin:0 auto">
          <path d="M100 10 L190 150 H10 Z" fill="var(--elec-soft)" stroke="var(--elec)" stroke-width="3"/><line x1="45" y1="95" x2="155" y2="95" stroke="var(--elec)" stroke-width="2"/><line x1="100" y1="95" x2="100" y2="150" stroke="var(--elec)" stroke-width="2"/>
          ${[['U',100,75],['R',62,132],['I',138,132]].map(([k,x,y])=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="26" font-weight="800" fill="${k===st.find?'var(--muted)':'var(--elec-ink)'}" ${k===st.find?'text-decoration="line-through"':''}>${k}</text>`).join('')}
          ${st.find==='U'?'':''}</svg>
        <p class="tiny muted" style="text-align:center">On cache du doigt la grandeur cherchée : ce qui reste visible donne l'opération.</p>
        <div class="formula"><div class="f" style="font-size:16px">${line}</div></div></div></div>`; };
  const draw=()=>{ box.innerHTML=html();
    box.querySelectorAll('[data-of]').forEach(b=>b.onclick=()=>{ st.find=b.dataset.of; draw(); });
    box.querySelectorAll('[data-ol]').forEach(inp=>inp.oninput=()=>{ st[inp.dataset.ol]=+inp.value; const y=document.createElement('div'); y.innerHTML=html(); 
      box.querySelector('.formula').innerHTML=y.querySelector('.formula').innerHTML; box.querySelectorAll('label b').forEach((b,i)=>b.textContent=y.querySelectorAll('label b')[i].textContent); });
  };
  draw();
}

/* ---------- 2.2.5 : série et parallèle ---------- */
function mountSP(root){
  const box=root.querySelector('#spsim'), st=WS.sp||(WS.sp={mode:'s',cut:false});
  const U=24, R1=40, R2=80;
  const draw=()=>{
    let I1,I2,U1,U2,I,Req;
    if(st.mode==='s'){ Req=R1+R2; I=st.cut?0:U/Req; I1=I2=I; U1=st.cut?0:R1*I; U2=st.cut?0:R2*I; }
    else { Req=R1*R2/(R1+R2); I1=st.cut?0:U/R1; I2=U/R2; I=I1+I2; U1=st.cut?0:U; U2=U; }
    const P1=U1*I1, P2=U2*I2, Pm=U*U/R1;
    const lampC=(p)=>p>0.01?`rgba(255,204,51,${0.35+0.65*Math.min(1,p/Pm)})`:'var(--surface)';
    const lamp=(x,y,p,lbl,cut)=>`<circle cx="${x}" cy="${y}" r="17" fill="${lampC(p)}" stroke="var(--ink-2)" stroke-width="2"/><path d="M${x-12} ${y-12} L${x+12} ${y+12} M${x+12} ${y-12} L${x-12} ${y+12}" stroke="var(--ink-2)" stroke-width="2"/>${cut?`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="16" font-weight="900" fill="var(--bad)">✕</text>`:''}<text x="${x}" y="${y+34}" text-anchor="middle" font-size="10" fill="var(--muted)">${lbl}</text>`;
    const svg = st.mode==='s'
      ? `<path d="M40 60 V20 H320 V80" stroke="var(--live)" stroke-width="4" fill="none"/><path d="M320 80 V140 H40 V100" stroke="var(--elec)" stroke-width="4" fill="none"/>${lamp(140,20,P1,'R1 = 40 Ω',st.cut)}${lamp(240,20,P2,'R2 = 80 Ω',false)}`
      : `<path d="M40 60 V20 H260 M40 100 V140 H260" stroke="var(--ink-2)" stroke-width="4" fill="none"/><path d="M160 20 V60 M160 100 V140 M260 20 V60 M260 100 V140" stroke="var(--ink-2)" stroke-width="4"/>${lamp(160,80,P1,'R1 = 40 Ω',st.cut)}${lamp(260,80,P2,'R2 = 80 Ω',false)}`;
    box.innerHTML=`<div class="seg">${[['s','En série'],['p','En parallèle']].map(([k,l])=>`<button class="${st.mode===k?'on':''}" data-spm="${k}">${l}</button>`).join('')}<button class="${st.cut?'on':''}" data-spc>${st.cut?'R1 réparée':'R1 coupée (lampe grillée)'}</button></div>
      <div class="figure"><svg viewBox="0 0 360 170" style="max-width:460px;margin:0 auto" role="img" aria-label="Deux lampes ${st.mode==='s'?'en série':'en parallèle'} sous 24 V${st.cut?', R1 coupée':''}"><rect x="22" y="60" width="36" height="40" rx="5" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/><text x="40" y="85" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink-2)">24 V</text>${svg}</svg></div>
      ${tbl(['','R1 = 40 Ω','R2 = 80 Ω','Ensemble'],[['Courant',fr(I1,2)+' A',fr(I2,2)+' A',fr(I,2)+' A'],['Tension',fr(U1,1)+' V',fr(U2,1)+' V','24 V'],['Résistance','40 Ω','80 Ω',(st.cut&&st.mode==='s')?'∞ (coupé)':fr(st.cut?R2:Req,1)+' Ω']])}
      <p class="small" style="margin-bottom:0">${st.mode==='s'?(st.cut?'<b>Tout s’arrête :</b> un seul chemin, coupé en un point.':'Le <b>même courant</b> traverse les deux ; les tensions s’ajoutent : 8 + 16 = 24 V.'):(st.cut?'<b>R2 continue de fonctionner</b> : sa branche reçoit toujours 24 V.':'La <b>même tension</b> sur chaque branche ; les courants s’ajoutent : 0,6 + 0,3 = 0,9 A. Résistance équivalente 26,7 Ω — moins que 40 Ω : on a ouvert un second chemin.')}</p>`;
    box.querySelectorAll('[data-spm]').forEach(b=>b.onclick=()=>{ st.mode=b.dataset.spm; draw(); });
    box.querySelector('[data-spc]').onclick=()=>{ st.cut=!st.cut; draw(); };
  };
  draw();
}

/* ---------- 2.2.6 : est-ce que ça passe ? ---------- */
function mountPasse(root){
  const box=root.querySelector('#passe'), st=WS.passe||(WS.passe={on:{}});
  const APP=[['rad','Radiateur 2 000 W',2000],['bouil','Bouilloire 2 200 W',2200],['perc','Perceuse 690 W',690],['lamp','Lampe 60 W',60]];
  const draw=()=>{
    const Pt=APP.filter(a=>st.on[a[0]]).reduce((s,a)=>s+a[2],0), I=Pt/230, ok=I<=16;
    box.innerHTML=`<p class="small" style="margin-top:0">Circuit 230 V protégé par un disjoncteur de <b>16 A</b>. Branche des appareils :</p>
      <div class="samples">${APP.map(([k,l])=>`<button class="${st.on[k]?'on':''}" data-pa="${k}">${l}</button>`).join('')}</div>
      <div class="formula"><div class="f" style="font-size:16px">I = P ÷ U = ${fr(Pt,0)} ÷ 230 = ${fr(I,2)} A</div><div class="small" style="margin-top:6px">${Pt===0?'Aucun appareil.':ok?`<b style="color:var(--ok)">Ça passe</b> : ${fr(I,1)} A ≤ 16 A.`:`<b style="color:var(--bad)">Le disjoncteur va déclencher</b> : ${fr(I,1)} A > 16 A. Solution : répartir sur deux circuits.`}</div></div>`;
    box.querySelectorAll('[data-pa]').forEach(b=>b.onclick=()=>{ st.on[b.dataset.pa]=!st.on[b.dataset.pa]; draw(); });
  };
  draw();
}

/* ---------- 2.2.10 : calcul de chute de tension ---------- */
function mountChute(root){
  const box=root.querySelector('#chute'), st=WS.chute||(WS.chute={tri:false,L:35,I:16,S:2.5,use:'light'});
  const html=()=>{
    const U=st.tri?400:230, k=st.tri?R3:2, dU=k*RHO*st.L*st.I/st.S, pc=dU/U*100, lim=st.use==='light'?3:5;
    return `<div class="grid g2"><div>
      <div class="seg">${[[false,'Monophasé 230 V'],[true,'Triphasé 400 V']].map(([v,l])=>`<button class="${st.tri===v?'on':''}" data-ct="${v}">${l}</button>`).join('')}</div>
      <div class="seg" style="margin-top:8px">${[['light','Éclairage (3 %)'],['other','Autres usages (5 %)']].map(([v,l])=>`<button class="${st.use===v?'on':''}" data-cu="${v}">${l}</button>`).join('')}</div>
      <label class="small" style="display:block;margin:10px 0"><b>Longueur L = ${st.L} m</b><input type="range" min="5" max="150" step="5" value="${st.L}" data-cl="L" style="width:100%"></label>
      <label class="small" style="display:block;margin:10px 0"><b>Courant I = ${st.I} A</b><input type="range" min="1" max="63" step="1" value="${st.I}" data-cl="I" style="width:100%"></label>
      <div class="kicker" style="margin:8px 0 6px">Section S</div><div class="seg">${[1.5,2.5,4,6,10,16].map(s=>`<button class="${st.S===s?'on':''}" data-cs="${s}">${fr(s,1)} mm²</button>`).join('')}</div>
    </div><div><div class="formula"><div class="f" style="font-size:15px">ΔU = ${st.tri?'√3':'2'} × 0,0225 × ${st.L} × ${st.I} ÷ ${fr(st.S,1)}</div><div class="f" style="font-size:22px;margin-top:6px">${fr(dU,2)} V · ${fr(pc,2)} %</div>
      <div class="small" style="margin-top:6px">${pc<=lim?`<b style="color:var(--ok)">Acceptable</b> : sous la limite de ${lim} %.`:`<b style="color:var(--bad)">Trop élevée</b> : au-dessus de ${lim} %. Augmente la section.`}</div></div>
      <p class="tiny muted">Le facteur 2 du monophasé : le courant fait l'aller et le retour. En triphasé, aucun conducteur ne fait l'aller et le retour : facteur √3.</p></div></div>`; };
  const draw=()=>{ box.innerHTML=html();
    box.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{ st.tri=b.dataset.ct==='true'; draw(); });
    box.querySelectorAll('[data-cu]').forEach(b=>b.onclick=()=>{ st.use=b.dataset.cu; draw(); });
    box.querySelectorAll('[data-cs]').forEach(b=>b.onclick=()=>{ st.S=+b.dataset.cs; draw(); });
    box.querySelectorAll('[data-cl]').forEach(inp=>inp.oninput=()=>{ st[inp.dataset.cl]=+inp.value; const y=document.createElement('div'); y.innerHTML=html();
      box.querySelector('.formula').innerHTML=y.querySelector('.formula').innerHTML; box.querySelectorAll('label b').forEach((b,i)=>b.textContent=y.querySelectorAll('label b')[i].textContent); });
  };
  draw();
}

/* ---------- 2.2.7 : continu et alternatif ---------- */
function acdcSVG(){
  const pts=[...Array(121).keys()].map(i=>{ const x=30+i*2.5, y=95-60*Math.sin(i/120*4*Math.PI); return `${x},${y}`; }).join(' ');
  return `<svg viewBox="0 0 360 190" role="img" aria-label="Tension continue constante et tension alternative sinusoïdale de 325 V crête">
    <line x1="30" y1="95" x2="340" y2="95" stroke="var(--line)" stroke-width="1.5"/><line x1="30" y1="20" x2="30" y2="170" stroke="var(--line)" stroke-width="1.5"/>
    <line x1="30" y1="52" x2="330" y2="52" stroke="var(--elec)" stroke-width="3" stroke-dasharray="7 5"/><text x="332" y="48" text-anchor="end" font-size="10" fill="var(--elec)">continu : toujours le même sens</text>
    <polyline points="${pts}" fill="none" stroke="var(--live)" stroke-width="3"/>
    <text x="36" y="30" font-size="10" fill="var(--live)">+325 V</text><text x="36" y="168" font-size="10" fill="var(--live)">–325 V</text>
    <text x="185" y="185" text-anchor="middle" font-size="10" fill="var(--muted)">temps → une alternance complète dure 1/50 s</text></svg>`;
}

const SW=c=>`<span style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-1px;margin-right:4px;background:${c};border:1px solid var(--line)"></span>`;

defChapter({
  num:'2.2', titre:'Les bases de l’électricité', tp:'É02',
  evalInfo:'L’évaluation formative 2.2 (50 points, seuil 35) se passe sur papier, en classe, avec ton prof.',
  Q:Q22,
  caps:[
    {id:'b1', sec:'2.2.1', t:'Qu’est-ce que l’électricité', pdf:23, quiz:['b1q1','b1q2'], ex:{keys:['b1sort'], lbl:'Conducteur ou isolant'},
     body:()=>`<p class="lead">Toute matière est faite d'atomes. Autour du noyau gravitent des <b>électrons</b>, minuscules particules chargées négativement.</p>
      <p>Dans la plupart des matériaux, ils restent fermement attachés à leur atome. Mais dans les métaux, une partie d'entre eux ne sont retenus que très faiblement : ils peuvent sauter d'un atome au voisin. Ce sont les <b>électrons libres</b>.</p>
      <div class="note"><b>Le courant électrique</b>C'est le déplacement d'ensemble de ces électrons libres dans une même direction. Tant qu'ils s'agitent au hasard, il ne se passe rien. Dès qu'on les pousse tous du même côté, il y a courant.</div>
      ${tbl(['','Ce que c’est et où on en trouve'],[['Conducteur','Matériau dans lequel les électrons circulent facilement. Les métaux : cuivre — le plus utilisé —, aluminium, argent, acier. Mais aussi l’eau salée, le corps humain, le graphite.'],['Isolant','Matériau dans lequel les électrons ne circulent pas. Le PVC des gaines, le caoutchouc, le verre, la porcelaine, la céramique, l’air sec, l’huile.']])}
      <div class="note warn" style="margin-top:14px"><b>Un isolant n'est jamais absolu</b>L'air sec isole, mais un arc électrique le traverse. Le bois sec isole, le bois humide non. Une gaine intacte isole, une gaine entaillée non. Et le corps humain, lui, est un conducteur — c'est tout le problème.</div>
      ${exbox('b1box','Conducteur ou isolant ?')}`,
     mount:root=>mountSortW(root.querySelector('#b1box'),'b1sort',{cats:[['c','Conducteur'],['i','Isolant']],items:[['Cuivre','c'],['PVC d’une gaine intacte','i'],['Eau salée','c'],['Porcelaine','i'],['Corps humain','c','C’est tout le problème du danger électrique.'],['Air sec','i'],['Graphite','c'],['Bois humide','c','Le bois sec isole, le bois humide non.'],['Huile','i']],ok:'Juste. Retiens surtout que le corps humain est un conducteur.'})},
    {id:'b2', sec:'2.2.2', t:'Le circuit et le court-circuit', pdf:24, quiz:['b2q1','b2q2'], ex:{keys:['b2sim'], lbl:'Les trois états du circuit'},
     body:()=>`<p class="lead">Pour qu'un courant circule : <b>quatre éléments et une condition</b>.</p>
      <ul class="ctrlq"><li>Une <b>source</b>, qui fournit l'énergie : une pile, une batterie, le réseau.</li><li>Un <b>conducteur d'aller</b>, qui amène le courant.</li><li>Un <b>récepteur</b>, qui transforme l'énergie : une lampe en lumière et en chaleur, un moteur en mouvement, une résistance en chaleur.</li><li>Un <b>conducteur de retour</b>, qui ramène le courant à la source.</li><li>La condition : le circuit doit être <b>fermé</b>. Ouvert en un seul point, rien ne circule nulle part.</li></ul>
      ${exbox('circsim','Ferme, ouvre, court-circuite','Essaie les trois situations.')}
      <div class="note bad"><b>Le court-circuit</b>L'accident le plus courant. Le courant trouve un chemin de retour vers la source sans passer par le récepteur : deux conducteurs nus qui se touchent, un brin qui dépasse d'une borne et touche la voisine, un tournevis oublié dans une armoire. Comme plus rien ne limite le courant, il devient énorme en une fraction de seconde.</div>`,
     mount:mountCircuit},
    {id:'b3', sec:'2.2.3 a-e', t:'Les trois grandeurs', pdf:25, quiz:['b3q1','b3q2','b3q3'], ex:{keys:['b3gr'], lbl:'Reconnaître les grandeurs'},
     body:()=>`${tbl(['Grandeur','Symbole et unité','Ce que c’est'],[['La tension','U, en volts (V)','La poussée qui met les électrons en mouvement : sans elle, rien ne bouge. Elle existe toujours ENTRE deux points.'],['Le courant','I, en ampères (A)','La quantité d’électrons qui passe par seconde en un point du circuit. Il TRAVERSE un composant : il entre par une borne et sort par l’autre.'],['La résistance','R, en ohms (Ω)','L’opposition qu’un matériau offre au passage du courant. Un conducteur court et épais résiste peu ; long et fin, davantage. Un isolant a une résistance énorme.']])}
      <div class="note" style="margin-top:14px"><b>Point de vocabulaire</b>On ne dit pas « la tension de ce fil », on dit « la tension entre ce fil et le neutre ». C'est pourquoi un appareil de mesure de tension a toujours deux pointes de touche.</div>
      <h3>Une image pour comprendre — et ses limites</h3>
      ${tbl(['Électricité','Image de l’eau','Ce que l’image explique'],[['Tension (V)','La pression dans le tuyau','Plus la pression est forte, plus l’eau est poussée fort'],['Courant (A)','Le débit qui passe','C’est ce qui circule réellement'],['Résistance (Ω)','Un étranglement dans le tuyau','Plus l’étranglement est serré, moins il passe d’eau']])}
      <p class="small">Cette image aide à démarrer, mais l'eau qui fuit tombe par terre, alors que l'électricité qui « fuit » cherche à revenir à sa source — et peut choisir de passer par vous.</p>
      <h3>Des ordres de grandeur à retenir</h3>
      ${tbl(['Tension','Courant','Résistance'],[['Pile bâton : 1,5 V','Une LED : 0,02 A','Un fil de câblage : moins de 0,1 Ω'],['Prise USB : 5 V','Une lampe 60 W : 0,26 A','Une bobine de relais : quelques centaines d’Ω'],['Batterie de voiture : 12 V','Une perceuse : 3 A','Une résistance chauffante : quelques dizaines d’Ω'],['Commande industrielle : 24 V','Un moteur d’atelier : 5 à 15 A','Le corps humain : 1 000 à 2 000 Ω'],['Prise domestique : 230 V','Un chauffage : 10 A','Un bon isolant : plus de 1 000 000 Ω'],['Réseau d’atelier : 400 V','Court-circuit : plusieurs milliers d’A','Circuit coupé : infini']])}
      ${exbox('b3box','Tension, courant ou résistance ?')}`,
     mount:root=>mountSortW(root.querySelector('#b3box'),'b3gr',{cats:[['u','Tension'],['i','Courant'],['r','Résistance']],items:[['Se mesure ENTRE deux points','u'],['TRAVERSE un composant','i'],['L’opposition au passage du courant','r'],['Image de l’eau : la pression dans le tuyau','u'],['Image de l’eau : le débit qui passe','i'],['Image de l’eau : un étranglement','r'],['Le corps humain : 1 000 à 2 000','r'],['Une perceuse : 3','i'],['Commande industrielle : 24','u']],ok:'Juste. Les trois grandeurs n’ont plus de secret pour toi.'})},
    {id:'b4', sec:'2.2.3 f-h', t:'Unités, conversions et quantité d’électricité', pdf:26, quiz:['b4q1','b4q2'], ex:{keys:['b4conv','b4q'], lbl:'Les deux séries de calculs'},
     body:()=>`<p class="lead">Quelques millièmes d'ampère dans un détecteur, plusieurs milliers dans un court-circuit : plutôt que d'aligner des zéros, on utilise des préfixes.</p>
      ${tbl(['Préfixe','Symbole','Ce qu’il vaut','Exemple'],[['Méga','M','Un million de fois plus','1 MΩ = 1 000 000 Ω'],['Kilo','k','Mille fois plus','1 kΩ = 1 000 Ω · 1 kW = 1 000 W'],['—','—','L’unité','1 A, 1 V, 1 Ω'],['Milli','m','Mille fois moins','30 mA = 0,030 A'],['Micro','µ','Un million de fois moins','10 µF = 0,000 010 F']])}
      <div class="note bad" style="margin-top:14px"><b>La règle absolue</b>Dans une formule, on n'introduit que des unités de base : volts, ampères, ohms, secondes. On convertit d'abord, on calcule ensuite. Écrire 230 ÷ 1,5 parce que la résistance vaut 1,5 kΩ donne 153 au lieu de 0,153 : l'erreur est d'un facteur mille.</div>
      ${exbox('b4c','Drill — les conversions','Écris le résultat dans l’unité demandée. Virgule ou point, comme tu veux.')}
      <h3>La quantité d'électricité</h3>
      ${window.capVideo('videos/ch06-quantite/capsule.mp4','La quantité d’électricité (2 min 21)',3)}
      <p>Le courant dit ce qui passe à chaque seconde. Pour savoir combien est passé en tout, il faut aussi la durée.</p>
      ${formula('Q = I × t','Q en coulombs (C) si t est en secondes, en ampères-heures (Ah) si t est en heures. 1 Ah = 3 600 C.')}
      <p class="small">C'est l'unité des batteries. Une batterie de 90 Ah alimente un circuit de secours de 1,5 A pendant 60 heures, ou un circuit de 3 A pendant 30 heures. C'est aussi ce qui fixe l'autonomie d'un onduleur ou d'une lampe de chantier.</p>
      ${exbox('b4qbox','Drill — la quantité d’électricité','Attention à l’unité du temps : secondes pour des coulombs, heures pour des ampères-heures.')}`,
     mount:root=>{
       (v=>mountDrillW(root.querySelector('#b4c'),'b4conv',{rows:[
         {q:`${fr(v.a,3)} A en mA`,unit:'mA',ans:v.a*1000},{q:`${v.b.toLocaleString('fr-BE')} mA en A`,unit:'A',ans:v.b/1000},{q:`${fr(v.c)} kΩ en Ω`,unit:'Ω',ans:v.c*1000},{q:`${v.d} Ω en kΩ`,unit:'kΩ',ans:v.d/1000},{q:`${fr(v.e,3)} A en mA`,unit:'mA',ans:v.e*1000},
         {q:`${v.f} kΩ en MΩ`,unit:'MΩ',ans:v.f/1000},{q:`${fr(v.g)} MΩ en kΩ`,unit:'kΩ',ans:v.g*1000},{q:`${v.h.toLocaleString('fr-BE')} mV en V`,unit:'V',ans:v.h/1000},{q:`${fr(v.i)} kV en V`,unit:'V',ans:v.i*1000},{q:`${v.j} mA en A`,unit:'A',ans:v.j/1000},
         {q:`Un multimètre affiche ${fr(v.k,1)} sur le calibre 200 mA. Le courant en ampères ?`,unit:'A',ans:v.k/1000,hint:`${fr(v.k,1)} mA ÷ 1 000.`}],
         hint:'De l’unité vers « milli » : × 1 000. Vers « kilo » : ÷ 1 000.'}))(vx('b4conv',{a:[0.25,0.35,0.15],b:[1800,1200,2500],c:[2.2,4.7,1.5],d:[470,330,680],e:[0.005,0.008,0.002],f:[68,47,82],g:[1.5,2.2,3.3],h:[24000,12000,48000],i:[0.4,0.23,0.69],j:[35,25,45],k:[47,63.5,125]}));
       (v=>mountDrillW(root.querySelector('#b4qbox'),'b4q',{rows:[
         {q:`I = ${v.a[0]} A · t = ${v.a[1]} s → Q`,unit:'C',ans:v.a[0]*v.a[1]},{q:`I = ${fr(v.b[0])} A · t = ${v.b[1]} min → Q`,unit:'C',ans:v.b[0]*v.b[1]*60,hint:`${v.b[1]} min = ${v.b[1]*60} s.`},{q:`I = ${v.c[0]} A · t = ${v.c[1]} h → Q`,unit:'Ah',ans:v.c[0]*v.c[1]},
         {q:`Q = ${v.d[0]} Ah · I = ${v.d[1]} A → t`,unit:'h',ans:v.d[0]/v.d[1],hint:'t = Q ÷ I.'},{q:`Q = ${v.e[0]} Ah · t = ${v.e[1]} h → I`,unit:'A',ans:v.e[0]/v.e[1],hint:'I = Q ÷ t.'},{q:`I = ${fr(v.f[0])} A · t = ${v.f[1]} h → Q`,unit:'Ah',ans:v.f[0]*v.f[1]},{q:'… la même quantité en coulombs',unit:'C',ans:v.f[0]*v.f[1]*3600,hint:'1 Ah = 3 600 C.'},
         {q:`Batterie ${v.g[0]} Ah, circuit de ${v.g[1]} A : autonomie théorique`,unit:'h',ans:v.g[0]/v.g[1]}]}))(vx('b4q',{a:[[2,30],[3,45],[4,60]],b:[[0.5,10],[0.25,5],[1.5,20]],c:[[3,8],[2,6],[5,4]],d:[[60,4],[48,3],[90,6]],e:[[45,10],[36,8],[72,12]],f:[[1.5,2],[2.5,3],[0.5,4]],g:[[74,5],[60,4],[95,8]]}));
     }},
    {id:'b5', sec:'2.2.4', t:'La loi d’Ohm', pdf:28, quiz:['b5q1','b5q2'], ex:{keys:['b5ohm'], lbl:'Drill de la loi d’Ohm'},
     body:()=>`${window.capVideo('videos/ch08-ohm/capsule.mp4','La loi d’Ohm (2 min 03)',2)}
      <p class="lead">Les trois grandeurs sont liées par une relation unique — la formule la plus utilisée du métier.</p>
      ${formula('U = R × I','La tension (en V) est égale à la résistance (en Ω) multipliée par le courant (en A)')}
      ${exbox('ohmlab','Le triangle de la loi d’Ohm','Choisis ce que tu cherches et fais varier les deux autres grandeurs.')}
      ${tbl(['','Énoncé','Résolution'],[['1','Une résistance chauffante de 100 Ω est branchée sur 230 V. Quel courant ?','I = U ÷ R = 230 ÷ 100 = 2,3 A'],['2','Un élément chauffant absorbe 10 A sous 230 V. Sa résistance ?','R = U ÷ I = 230 ÷ 10 = 23 Ω'],['3','Un long conducteur de 0,05 Ω transporte 20 A. Tension perdue ?','U = R × I = 0,05 × 20 = 1 V perdu en chaleur dans le câble']])}
      <div class="note bad" style="margin-top:14px"><b>Retour sur le danger électrique</b>Un corps aux mains sèches présente environ 1 500 Ω. Sous 230 V : I = 230 ÷ 1 500 = 0,153 A, soit 153 mA — trois fois le seuil de fibrillation. Peau humide : quelques centaines d'ohms, et un courant multiplié par cinq ou par dix.</div>
      <div class="note warn" style="margin-top:10px"><b>Une limite à connaître</b>La loi d'Ohm s'applique aux conducteurs, éléments chauffants, bobines vues en continu. Pas au courant d'un moteur ou d'un tube fluorescent : pour ceux-là, on lit la plaque signalétique.</div>
      ${terrain('Quel courant va absorber la résistance de chauffe que je remplace, et le calibre en place suffit-il ? Pourquoi cette borne desserrée a-t-elle brûlé ? Pourquoi la tension chute-t-elle en bout de ligne ? Et pourquoi 230 V est-il mortel ? C’est la formule qui transforme une mesure en diagnostic.')}
      ${labo('ohm','Le triangle de la loi d’Ohm avec n’importe quelles valeurs, l’analogie du barrage et un quiz qui génère des exercices à volonté.')}
      ${exbox('b5d','Drill — la loi d’Ohm','Convertis d’abord en unités de base, écris la forme utilisée, puis calcule.')}`,
     mount:root=>{ mountOhmLab(root);
       (v=>mountDrillW(root.querySelector('#b5d'),'b5ohm',{rows:[
         {q:`R = ${v.a[0]} Ω · U = ${v.a[1]} V → I`,unit:'A',ans:v.a[1]/v.a[0],hint:'I = U ÷ R. Garde trois décimales.'},{q:`R = ${fr(v.b[0])} kΩ · I = ${v.b[1]} mA → U`,unit:'V',ans:v.b[0]*v.b[1],hint:'kΩ en Ω, mA en A.'},{q:`U = 230 V · I = ${fr(v.c)} A → R`,unit:'Ω',ans:230/v.c},
         {q:`U = ${v.d[0]} V · I = ${v.d[1]} mA → R`,unit:'Ω',ans:v.d[0]/(v.d[1]/1000),hint:`${v.d[1]} mA = ${fr(v.d[1]/1000,3)} A.`},{q:`R = ${fr(v.e)} kΩ · U = 230 V → I`,unit:'A',ans:230/(v.e*1000),hint:'kΩ en Ω. Garde trois décimales.'},{q:`R = ${v.f[0]} Ω · I = ${fr(v.f[1])} A → U`,unit:'V',ans:v.f[0]*v.f[1]},
         {q:`U = 400 V · R = ${v.g} Ω → I`,unit:'A',ans:400/v.g},{q:`U = ${fr(v.h[0])} V · I = ${v.h[1]} mA → R`,unit:'Ω',ans:v.h[0]/(v.h[1]/1000),hint:`${v.h[1]} mA = ${fr(v.h[1]/1000,3)} A.`},
         {q:`Bobine de contacteur de ${v.i[0].toLocaleString('fr-BE')} Ω parcourue par ${v.i[1]} mA → U`,unit:'V',ans:v.i[0]*v.i[1]/1000},{q:`Corps mains mouillées, ${v.j} Ω sous 230 V → I`,unit:'mA',ans:230/v.j*1000,hint:'Calcule en A, puis convertis en mA.'}]}))(vx('b5ohm',{a:[[47,12],[33,9],[68,24]],b:[[1,24],[2.2,10],[4.7,5]],c:[0.5,2,4],d:[[24,40],[12,20],[24,60]],e:[2.2,1,4.7],f:[[8,1.5],[6,2.5],[12,3]],g:[80,50,100],h:[[5,2],[3.3,5],[12,4]],i:[[2400,96],[1800,80],[3000,100]],j:[500,400,1000]}));
     }},
    {id:'b6', sec:'2.2.5', t:'Série et parallèle', pdf:31, quiz:['b6q1','b6q2','b6q3'], ex:{keys:['b6sp'], lbl:'Drill série et parallèle'},
     body:()=>`${tbl(['','En série','En parallèle'],[['Le chemin','Un seul chemin, les composants se suivent','Plusieurs chemins, côte à côte'],['Le courant','Le même dans tous les composants','Il se partage entre les branches, puis se rassemble'],['La tension','Elle se répartit entre les composants','La même sur chaque branche'],['Un composant coupé','Tout s’arrête','Les autres continuent']])}
      ${exbox('spsim','R1 = 40 Ω et R2 = 80 Ω sous 24 V','Passe d’un montage à l’autre, puis fais griller R1.')}
      <ul class="ctrlq"><li>Les prises et luminaires d'un bâtiment sont en <b>parallèle</b> : chacun reçoit 230 V, et si l'un grille, les autres continuent.</li><li>Les organes de sécurité d'une machine — arrêt d'urgence, contacts de garde-corps, thermique — sont en <b>série</b> : si un seul s'ouvre, la machine s'arrête.</li><li>Les enroulements d'un moteur triphasé se couplent en étoile ou en triangle (chapitres 2.4 et 2.9).</li></ul>
      <h3 style="margin-top:16px">Pourquoi le voltmètre en parallèle et l'ampèremètre en série</h3>
      ${tbl(['Appareil','Le raisonnement'],[['Voltmètre','Il mesure une différence entre deux points : il se place à cheval, en parallèle. Sa résistance interne est très élevée — de l’ordre de 10 millions d’ohms — pour ne pas détourner de courant.'],['Ampèremètre','Il mesure ce qui passe : le courant doit le traverser, en série. Sa résistance interne est presque nulle pour ne pas freiner le courant.']])}
      <div class="note bad" style="margin-top:14px"><b>D'où le danger</b>Un ampèremètre à cheval sur une source, c'est une résistance presque nulle entre deux points de tension différente : un court-circuit franc. Exactement le cordon rouge oublié dans l'entrée 10 A.</div>
      <h3>Calculer une association de deux résistances</h3>
      ${tbl(['','En série','En parallèle'],[['Résistance','R = R1 + R2','R = (R1 × R2) ÷ (R1 + R2)'],['Courant','Le même dans les deux : I = U ÷ R','I = I1 + I2'],['Tension','U = U1 + U2','La même sur les deux branches'],['Vérification','R plus GRANDE que chacune des deux','R plus PETITE que la plus petite des deux']])}
      ${terrain('Une chaîne de sécurité est en série : quand une machine refuse de démarrer, on suit la branche organe par organe, à la continuité, jusqu’à trouver celui qui est ouvert. Un circuit de prises est en parallèle : si une seule prise est morte, le défaut est dans sa branche. Savoir dans quel montage on se trouve dit immédiatement où chercher.')}
      ${labo('montages','Construis ton propre circuit série, parallèle ou mixte : le schéma se dessine et chaque calcul est détaillé étape par étape.')}
      ${exbox('b6d','Drill — série et parallèle','En parallèle, vérifie que le résultat est plus petit que la plus petite des résistances.')}`,
     mount:root=>{ mountSP(root);
       (v=>{ const om=x=>x>=1000?fr(x/1000)+' kΩ':x+' Ω'; return mountDrillW(root.querySelector('#b6d'),'b6sp',{rows:[
         {q:`${v.a[0]} Ω et ${v.a[1]} Ω en série → R`,unit:'Ω',ans:v.a[0]+v.a[1]},{q:`${v.a[0]} Ω et ${v.a[1]} Ω en parallèle → R`,unit:'Ω',ans:v.a[0]*v.a[1]/(v.a[0]+v.a[1])},{q:`${v.b[0]} Ω et ${v.b[1]} Ω en série → R`,unit:'Ω',ans:v.b[0]+v.b[1]},
         {q:`${v.b[0]} Ω et ${v.b[1]} Ω en parallèle → R`,unit:'Ω',ans:v.b[0]*v.b[1]/(v.b[0]+v.b[1]),hint:`Le résultat doit être plus petit que ${Math.min(...v.b)} Ω.`},{q:`${om(v.c)} et ${om(v.c)} en parallèle → R`,unit:'Ω',ans:v.c/2},{q:`${v.d[0]} Ω, ${v.d[1]} Ω et ${v.d[2]} Ω en série → R`,unit:'Ω',ans:v.d[0]+v.d[1]+v.d[2]},
         {q:`${v.e[0]} Ω et ${v.e[1]} Ω en série sous ${v.e[2]} V → I`,unit:'A',ans:v.e[2]/(v.e[0]+v.e[1])},{q:`… tension aux bornes de ${v.e[0]} Ω → U1`,unit:'V',ans:v.e[0]*v.e[2]/(v.e[0]+v.e[1])},{q:`… tension aux bornes de ${v.e[1]} Ω → U2`,unit:'V',ans:v.e[1]*v.e[2]/(v.e[0]+v.e[1])},
         {q:`${v.f[0]} Ω et ${v.f[1]} Ω en parallèle sous 230 V → I1`,unit:'A',ans:230/v.f[0]},{q:`… courant dans ${v.f[1]} Ω → I2`,unit:'A',ans:230/v.f[1]},{q:'… courant total → I',unit:'A',ans:230/v.f[0]+230/v.f[1]}]}); })(vx('b6sp',{a:[[100,150],[120,180],[220,330]],b:[[470,330],[560,270],[680,390]],c:[1000,2200,470],d:[[10,20,30],[15,22,33],[12,18,27]],e:[[40,80,24],[30,90,12],[60,120,48]],f:[[230,115],[115,46],[230,46]]}));
     }},
    {id:'b7', sec:'2.2.6', t:'Puissance, énergie et effet Joule', pdf:34, quiz:['b7q1','b7q2'], ex:{keys:['b7p','b7w','b7j'], lbl:'Les trois drills'},
     body:()=>`<p class="lead">La puissance, notée P, se mesure en watts (W). Elle dit à quelle vitesse un appareil consomme de l'énergie.</p>
      ${formula('P = U × I','en monophasé — une lampe de 0,26 A sous 230 V : 230 × 0,26 ≈ 60 W')}
      ${labo('puissance','Calculateur de puissance à partir de deux grandeurs, et énergie consommée avec son coût en euros.')}
      ${exbox('passe','Est-ce que ça passe ?','On convertit chaque puissance en courant, on additionne, on compare au calibre de la protection.')}
      ${formula('P = √3 × U × I × cos φ','en triphasé, avec √3 ≈ 1,73 — le cos φ (facteur de puissance, entre 0 et 1) se lit sur la plaque du moteur')}
      <p class="small">Exemple : un moteur sous 400 V absorbe 5 A avec un cos φ de 0,85. P = 1,73 × 400 × 5 × 0,85 ≈ 2 940 W, soit environ 2,9 kW.</p>
      <div class="note warn"><b>Attention à ne pas confondre</b>La valeur calculée est la puissance absorbée au réseau. La puissance inscrite sur la plaque d'un moteur est la puissance mécanique fournie sur l'arbre, plus faible : une partie est perdue en chaleur (chapitre 2.9).</div>
      ${exbox('b7pd','Drill — la puissance','Monophasé : P = U × I. Triphasé : P = √3 × U × I × cos φ.')}
      <h3>L'énergie</h3>
      <p>La puissance dit combien on consomme à chaque instant ; l'énergie dit combien on a consommé au total. W = P × t, facturée en kilowattheures (kWh). Un appareil de 2 kW qui tourne 3 heures consomme 6 kWh.</p>
      ${terrain('Une fuite d’air comprimé, un moteur surdimensionné, un éclairage laissé allumé la nuit : tant que c’est une observation, rien ne bouge. Traduit en euros par an, cela devient une décision.')}
      ${exbox('b7wd','Drill — l’énergie et son coût','W = P × t avec P en kW et t en heures. Coût = énergie × 0,25 € le kWh.')}
      <h3>L'effet Joule</h3>
      <p>Tout conducteur parcouru par un courant s'échauffe : c'est ce qu'on recherche dans un chauffage, et ce qu'on redoute partout ailleurs.</p>
      ${formula('P = R × I²','W = R × I² × t — le courant intervient au carré : doubler le courant multiplie l’échauffement par quatre')}
      ${terrain('Une borne desserrée, un embout mal serti, un conducteur sous-dimensionné, des pastilles de contacteur piquées : une résistance parasite est apparue et transforme le courant en chaleur. C’est ce que cherche la caméra thermique : un point chaud, c’est un R × I² qui n’a rien à faire là.')}
      ${exbox('b7jd','Drill — l’effet Joule','Calcule d’abord I², puis multiplie par R.')}`,
     mount:root=>{ mountPasse(root);
       (v=>mountDrillW(root.querySelector('#b7pd'),'b7p',{rows:[
         {q:`U = 230 V · I = ${v.a} A → P`,unit:'W',ans:230*v.a},{q:`P = ${v.b} W · U = 230 V → I`,unit:'A',ans:v.b/230,hint:'I = P ÷ U. Garde trois décimales.'},{q:`P = ${v.c[0].toLocaleString('fr-BE')} W · I = ${v.c[1]} A → U`,unit:'V',ans:v.c[0]/v.c[1]},
         {q:`P = ${fr(v.d)} kW · U = 230 V → I`,unit:'A',ans:v.d*1000/230,hint:'kW en W : × 1 000.'},{q:`Triphasé 400 V · I = ${v.e[0]} A · cos φ ${fr(v.e[1])} → P`,unit:'W',ans:R3*400*v.e[0]*v.e[1]},
         {q:`Triphasé 400 V · I = ${fr(v.f[0])} A · cos φ ${fr(v.f[1])} → P`,unit:'W',ans:R3*400*v.f[0]*v.f[1]},{q:`Triphasé 400 V · P = ${v.g[0].toLocaleString('fr-BE')} W · cos φ ${fr(v.g[1])} → I`,unit:'A',ans:v.g[0]/(R3*400*v.g[1]),hint:'I = P ÷ (√3 × U × cos φ).'}]}))(vx('b7p',{a:[4,6,8],b:[60,40,100],c:[[2300,10],[1840,8],[4000,10]],d:[3.5,2.5,5],e:[[10,0.85],[8,0.8],[12,0.88]],f:[[6.4,0.82],[5.2,0.78],[7.5,0.86]],g:[[7500,0.85],[5500,0.83],[11000,0.87]]}));
       (v=>mountDrillW(root.querySelector('#b7wd'),'b7w',{rows:[
         {q:`${fr(v.a[0])} kW pendant ${v.a[1]} h → énergie`,unit:'kWh',ans:v.a[0]*v.a[1]},{q:'… coût',unit:'€',ans:v.a[0]*v.a[1]*0.25},
         {q:`${v.b[0]} W, ${v.b[1]} h par jour, 30 jours → énergie`,unit:'kWh',ans:v.b[0]/1000*v.b[1]*30,hint:'W en kW : ÷ 1 000.'},{q:'… coût',unit:'€',ans:v.b[0]/1000*v.b[1]*30*0.25},
         {q:`${fr(v.c[0])} kW, ${fr(v.c[1])} h par jour, ${v.c[2]} jours → énergie`,unit:'kWh',ans:v.c[0]*v.c[1]*v.c[2]},{q:'… coût',unit:'€',ans:v.c[0]*v.c[1]*v.c[2]*0.25},
         {q:`${v.d[0]} W, ${v.d[1]} h par jour, ${v.d[2]} jours → énergie`,unit:'kWh',ans:v.d[0]/1000*v.d[1]*v.d[2]},{q:'… coût',unit:'€',ans:v.d[0]/1000*v.d[1]*v.d[2]*0.25}]}))(vx('b7w',{a:[[2,5],[3,4],[1.5,6]],b:[[100,8],[60,10],[150,6]],c:[[3.5,2,250],[2.2,3,220],[4,1.5,200]],d:[[750,6,220],[550,8,250],[1100,4,200]]}));
       (v=>mountDrillW(root.querySelector('#b7jd'),'b7j',{rows:[v.a,v.b,v.c,v.d,v.e].map(([R,I])=>({q:`R = ${fr(R,3)} Ω · I = ${I} A → P`,unit:'W',ans:R*I*I}))}))(vx('b7j',{a:[[0.5,10],[0.4,8],[0.8,12]],b:[[0.02,32],[0.03,25],[0.05,40]],c:[[0.3,16],[0.2,20],[0.25,10]],d:[[0.1,63],[0.15,50],[0.05,40]],e:[[0.002,25],[0.005,32],[0.003,63]]}));
     }},
    {id:'b8', sec:'2.2.7-2.2.9', t:'Le réseau et ses couleurs', pdf:39, quiz:['b8q1','b8q2','b8q3','b8q4'], ex:{keys:['b8col','b8v'], lbl:'Couleurs et tensions'},
     body:()=>`${tbl(['','Description'],[['Courant continu (DC)','Toujours dans le même sens : une borne est le plus, l’autre le moins. Piles, batteries, alimentations 24 V des circuits de commande.'],['Courant alternatif (AC)','Il change de sens régulièrement : 50 fois par seconde en Belgique, la fréquence est de 50 hertz (Hz). Les deux conducteurs jouent alternativement les deux rôles.']])}
      <div class="figure">${acdcSVG()}<div class="figcap">Les 230 V du réseau sont une valeur <b>efficace</b> — celle qui produit le même échauffement que 230 V continus. La tension atteint en réalité 325 V à chaque sommet.</div></div>
      <p class="small">Le réseau est alternatif parce qu'un transformateur permet d'élever la tension pour le transport (moins de pertes), puis de la redescendre à 400 V et 230 V près du consommateur.</p>
      <h3>Le réseau belge : monophasé et triphasé</h3>
      <p><b>Monophasé</b> : une phase et un neutre, 230 V entre les deux. <b>Triphasé</b> : trois phases décalées dans le temps, plus un neutre. Entre deux phases : <b>400 V</b>, la tension composée des moteurs. Entre une phase et le neutre : <b>230 V</b>, la tension simple de l'éclairage et des prises.</p>
      <div class="note"><b>400 n'est pas deux fois 230</b>Les phases n'atteignent pas leur maximum au même instant. Le rapport n'est donc pas 2 mais √3 ≈ 1,73 : 230 × 1,73 ≈ 400.</div>
      ${terrain('Trois mesures pour vérifier une installation. 400 V entre chaque paire de phases et 230 V entre chaque phase et le neutre : tout va bien. 400, 400 et 0 entre phases : une phase est perdue — un moteur qui tourne dans cet état grille en quelques minutes. 230 entre phases au lieu de 400 : on n’est pas sur le réseau qu’on croyait.')}
      ${tbl(['Conducteur','Rôle'],[['Le neutre (N)','Conducteur de retour du courant, il fait partie du circuit normal. Bleu clair.'],['Le conducteur de protection (PE)','Relié à la terre. Aucun courant en fonctionnement normal. En cas de défaut, il évacue le courant vers la terre et fait déclencher la protection avant que quelqu’un ne touche la carcasse. Vert-jaune.']])}
      ${exbox('b8vd','Drill — tension simple et tension composée','Tension entre deux phases = √3 × tension entre une phase et le neutre, avec √3 ≈ 1,73.')}
      <h3>Les codes couleurs du RGIE</h3>
      <p>Une obligation réglementaire — et ce qui permet à quelqu'un d'autre, ou à toi dans dix ans, de dépanner sans tout démonter.</p>
      ${tbl(['Conducteur','Couleur','Règle'],[['Phases L1 · L2 · L3',`${SW('#7a4a21')}brun · ${SW('#141922')}noir · ${SW('#8e97a3')}gris`,'Les phases peuvent aussi être repérées par bagues numérotées'],['Neutre',`${SW('#7fb2e5')}bleu clair`,'Réservé au neutre : un bleu clair ne sert jamais à autre chose'],['Protection PE',`${SW('repeating-linear-gradient(45deg,#2f9e44 0 3px,#f2c200 3px 6px)')}vert-jaune`,'Strictement réservé. Jamais de vert seul, jamais de jaune seul, jamais de vert-jaune comme phase ou neutre — même provisoirement'],['Commande 24 V DC',`${SW('#d6332a')}rouge (+) · ${SW('#1b3f8b')}bleu foncé ou blanc (–)`,'Usage courant, à confirmer selon la convention de l’entreprise. Ne pas confondre avec le bleu clair du neutre']])}
      ${exbox('b8cbox','Quelle couleur pour chaque conducteur ?')}`,
     mount:root=>{
       mountDrillW(root.querySelector('#b8vd'),'b8v',{rows:[
         {q:'Tension simple 230 V → tension composée',unit:'V',ans:230*R3,tol:0.012},{q:'Tension composée 400 V → tension simple',unit:'V',ans:400/R3,tol:0.012},
         {q:'Tension simple 127 V → tension composée',unit:'V',ans:127*R3,tol:0.012},{q:'Tension composée 690 V → tension simple',unit:'V',ans:690/R3,tol:0.012}]});
       mountSortW(root.querySelector('#b8cbox'),'b8col',{cats:[['br',SW('#7a4a21')+'brun'],['no',SW('#141922')+'noir'],['gr',SW('#8e97a3')+'gris'],['bc',SW('#7fb2e5')+'bleu clair'],['vj',SW('repeating-linear-gradient(45deg,#2f9e44 0 3px,#f2c200 3px 6px)')+'vert-jaune'],['ro',SW('#d6332a')+'rouge'],['bf',SW('#1b3f8b')+'bleu foncé']],
         items:[['Phase L1','br'],['Phase L2','no'],['Phase L3','gr'],['Neutre','bc'],['Conducteur de protection','vj'],['+24 V de la commande','ro'],['0 V de la commande','bf','Bleu foncé ou blanc — jamais le bleu clair du neutre.']],ok:'Juste. Et souviens-toi : le bleu clair et le vert-jaune ne se remplacent par rien.'});
     }},
    {id:'b9', sec:'2.2.10', t:'Les conducteurs : section, Pouillet, chute de tension', pdf:42, quiz:['b9q1','b9q2','b9q3'], ex:{keys:['b9pou','b9du'], lbl:'Les deux drills'},
     body:()=>`<p class="lead">Une âme conductrice, presque toujours en cuivre, entourée d'un isolant. Rigide — un seul brin — ou souple — de nombreux brins fins.</p>
      ${tbl(['Type','Où on l’utilise'],[['Âme rigide','Installations fixes, encastrées ou en tube. Se tient tout seule, mais casse si on la plie plusieurs fois.'],['Âme souple','Armoires, câblage de machines, tout ce qui bouge ou vibre. Se plie sans casser, mais exige un embout dans les bornes à vis.']])}
      <h3 style="margin-top:16px">La section</h3>
      <p>En mm² : la surface de la coupe du cuivre — pas le diamètre du fil isolé. Sections courantes : 0,75 – 1 – 1,5 – 2,5 – 4 – 6 – 10 – 16 mm². Plus la section est grande, plus le conducteur transporte de courant sans chauffer.</p>
      ${tbl(['Section','Courant admissible indicatif','Usage typique'],[['0,25 mm²','Environ 2 A','Électronique, bus, signal'],['0,5 mm²','Environ 3 A','Signalisation, entrées/sorties d’automate'],['0,75 mm²','Environ 6 A','Circuits de commande'],['1 mm²','Environ 10 A','Commande, signalisation'],['1,5 mm²','Environ 16 A','Éclairage, petits circuits'],['2,5 mm²','Environ 20 A','Prises, petits départs moteurs'],['4 mm²','Environ 25 A','Départs de puissance'],['6 mm² et plus','Au-delà de 32 A','Alimentations, jeux de barres']])}
      <div class="note warn" style="margin-top:14px"><b>Valeurs indicatives</b>Le courant réellement admissible dépend du mode de pose, de la température et du groupement des câbles : on ne choisit pas une section de mémoire, on la vérifie dans les tables. Un câble sous-dimensionné ne coupe pas comme un fusible : il chauffe pendant des mois, l'isolant vieillit, puis un jour il y a un feu.</div>
      <h3>La loi de Pouillet</h3>
      ${window.capVideo('videos/ch07-pouillet/capsule.mp4','La loi de Pouillet (2 min 28)',2)}
      ${formula('R = ρ × L ÷ S','R en ohms · ρ la résistivité en Ω·mm²/m · L la longueur en mètres · S la section en mm²')}
      <p>Plus le câble est long, plus il résiste ; plus il est gros, moins il résiste ; à dimensions égales, tout dépend du métal : cuivre 0,018, aluminium 0,029, fer 0,10 Ω·mm²/m à 20 °C. Mais la résistivité <b>augmente avec la température</b> — loi de Matthiessen, Rt = R0 × (1 + α × t), avec α = 0,004 pour le cuivre. Pour les calculs d'installation, on retient donc <b>ρ = 0,0225</b> pour le cuivre et <b>0,036</b> pour l'aluminium.</p>
      ${terrain('Les trois enroulements d’un moteur : si l’un mesure nettement moins que les deux autres, c’est Pouillet qui parle — une spire en court-circuit raccourcit la longueur. Et une rallonge de 50 m en 1,5 mm² fait mal démarrer une meuleuse qui tourne parfaitement branchée au mur.')}
      ${exbox('b9pd','Drill — Pouillet et résistance à chaud','Cuivre ρ = 0,0225 · aluminium ρ = 0,036 · α = 0,004 par degré, R0 la résistance à 0 °C.')}
      <h3>La chute de tension</h3>
      ${formula('ΔU = 2 × ρ × L × I ÷ S','en monophasé — en triphasé : ΔU = √3 × ρ × L × I ÷ S')}
      <p class="small">Admissible, à titre indicatif : <b>3 %</b> pour l'éclairage (environ 7 V sur 230 V), <b>5 %</b> pour les autres usages dont les moteurs (11,5 V sur 230 V, 20 V sur 400 V). Si la chute dépasse, on augmente la section.</p>
      ${exbox('chute','Calcule une chute de tension','Choisis le réseau, la longueur, le courant et la section.')}
      ${terrain('Une machine en bout d’atelier démarre mal, cale, fait déclencher son thermique — et toutes les mesures à l’armoire sont parfaites. Au démarrage, le moteur absorbe six fois son courant nominal : la chute dans le câble est six fois plus grande. Le calcul se fait au démarrage, pas seulement en régime.')}
      ${exbox('b9dd','Drill — la chute de tension','Donne ΔU en volts, puis le pourcentage de la tension du réseau.')}`,
     mount:root=>{ mountChute(root);
       (v=>mountDrillW(root.querySelector('#b9pd'),'b9pou',{rows:[
         ...[v.a,v.b,v.c].map(([S,L])=>({q:`Cuivre · ${fr(S)} mm² · ${L} m → R`,unit:'Ω',ans:RHO*L/S})),
         {q:`Aluminium · ${v.d[0]} mm² · ${v.d[1]} m → R`,unit:'Ω',ans:RHO_AL*v.d[1]/v.d[0],hint:'Aluminium : ρ = 0,036.'},{q:`Cuivre · ${v.e[0]} mm² · ${v.e[1]} m → R`,unit:'Ω',ans:RHO*v.e[1]/v.e[0],hint:'Garde quatre décimales.'},
         ...[v.f,v.g,v.h].map(([R0,t])=>({q:`R0 = ${R0} Ω · t = ${t} °C → Rt`,unit:'Ω',ans:R0*(1+0.004*t)}))]}))(vx('b9pou',{a:[[1.5,20],[1,15],[2.5,30]],b:[[2.5,45],[4,35],[2.5,60]],c:[[6,100],[10,80],[6,120]],d:[[16,80],[25,60],[16,100]],e:[[4,25],[6,40],[4,30]],f:[[10,60],[12,50],[8,70]],g:[[5,80],[4,90],[6,75]],h:[[20,40],[15,30],[25,45]]}));
       const du=(k,L,I,S)=>k*RHO*L*I/S;
       (v=>mountDrillW(root.querySelector('#b9dd'),'b9du',{rows:[
         {q:`Mono 230 V · ${fr(v.a[0])} mm² · ${v.a[1]} m · ${v.a[2]} A → ΔU`,unit:'V',ans:du(2,v.a[1],v.a[2],v.a[0])},{q:'… en % de 230 V',unit:'%',ans:du(2,v.a[1],v.a[2],v.a[0])/230*100,tol:0.03},
         {q:`Mono 230 V · ${fr(v.b[0])} mm² · ${v.b[1]} m · ${v.b[2]} A → ΔU`,unit:'V',ans:du(2,v.b[1],v.b[2],v.b[0])},{q:'… en % de 230 V',unit:'%',ans:du(2,v.b[1],v.b[2],v.b[0])/230*100,tol:0.03},
         {q:`Tri 400 V · ${fr(v.c[0])} mm² · ${v.c[1]} m · ${v.c[2]} A → ΔU`,unit:'V',ans:du(R3,v.c[1],v.c[2],v.c[0]),hint:'Triphasé : facteur √3, pas 2.'},{q:'… en % de 400 V',unit:'%',ans:du(R3,v.c[1],v.c[2],v.c[0])/400*100,tol:0.03},
         {q:`Tri 400 V · ${fr(v.d[0])} mm² · ${v.d[1]} m · ${fr(v.d[2])} A → ΔU`,unit:'V',ans:du(R3,v.d[1],v.d[2],v.d[0])},{q:'… en % de 400 V',unit:'%',ans:du(R3,v.d[1],v.d[2],v.d[0])/400*100,tol:0.05}]}))(vx('b9du',{a:[[2.5,30,16],[4,25,20],[2.5,40,16]],b:[[1.5,20,10],[2.5,15,16],[1.5,25,10]],c:[[4,50,20],[6,40,25],[4,60,20]],d:[[2.5,40,6.4],[1.5,30,5.2],[2.5,50,8]]}));
     }},
    {id:'b10', sec:'2.2.11-2.2.13', t:'Câblage, contrôles et déchets', pdf:47, quiz:['b10q1','b10q2','b10q3'], ex:{keys:['b10ctl','b10dech'], lbl:'Contrôles et tri'},
     body:()=>`<h3 style="margin-top:0">Les techniques de câblage</h3>
      ${tbl(['Geste','Ce qu’il faut faire'],[['Dénuder','Longueur selon la notice de la borne ; pince réglée sur la section exacte ; ne jamais entailler le cuivre — une entaille crée un point chaud et une rupture des mois plus tard ; vérifier : aucun brin coupé.'],['Sertir un embout','Indispensable sur un conducteur souple dans une borne à vis. Embout à la section (couleur normalisée), tous les brins au fond, pince à cliquet, puis on tire fermement : il ne doit pas bouger.'],['Serrer une borne','Lame qui remplit l’empreinte ; couple prescrit au dynamométrique sur la puissance ; tirer sur le conducteur après serrage ; reprendre le serrage des grosses sections après quelques heures : le cuivre flue.'],['Repérer','Une bague numérotée aux deux extrémités, posée AVANT la connexion.'],['Ranger','Puissance et commande dans des goulottes séparées ; une longueur suffisante pour rouvrir une borne. Un câblage propre se dépanne, un câblage en vrac se refait.']])}
      ${tbl(['Erreur fréquente','Conséquence'],[['Cuivre entaillé au dénudage','Point chaud, rupture différée sous vibration'],['Brins non rassemblés dans l’embout','Un brin touche la borne voisine : court-circuit'],['Embout trop grand','Sertissage lâche, le conducteur ressort'],['Borne serrée trop faiblement','Échauffement, oxydation, borne brûlée'],['Fil non repéré','Dépannage impossible sans tout suivre'],['Vert-jaune utilisé comme phase','Danger mortel pour le prochain intervenant']])}
      <h3 style="margin-top:16px">Les contrôles hors tension</h3>
      ${tbl(['Contrôle','Comment','Résultat attendu'],[['Contrôle visuel','À l’œil, borne par borne','Aucun brin qui dépasse, vis serrées, fils repérés, aucun outil oublié'],['Continuité','Ohmmètre entre les deux extrémités d’un conducteur','Proche de 0 Ω, moins de 1 Ω cordons compris. OL : conducteur coupé'],['Absence de court-circuit','Ohmmètre entre conducteurs différents : L-N, L-PE, N-PE','OL dans tous les cas. Une valeur faible signale un contact anormal'],['Continuité du PE','Ohmmètre entre la borne PE et la carcasse','Moins de 1 Ω : la masse doit être reliée']])}
      <div class="note bad" style="margin-top:14px"><b>Puis seulement</b>On appelle le professeur pour la mise sous tension. Jamais avant.</div>
      ${exbox('b10c','Tes lectures, hors tension : bon ou défaut ?')}
      <h3>Les déchets de l'atelier</h3>
      <p class="small">Cuivre au bac cuivre (il se recycle intégralement) ; gaines et embouts ratés aux plastiques ; emballages au carton ; composants remplacés au bac DEEE ; tubes fluorescents en filière séparée (mercure : ne jamais les casser ni les jeter) ; piles en collecte spécifique ; chiffons souillés et huiles en déchets dangereux, jamais à l'évier. L'épreuve évalue que <b>les déchets sont triés</b> et que <b>le poste est rangé et nettoyé</b>.</p>
      ${exbox('b10d','Dans quel bac ?')}
      <div class="note" style="margin-top:14px"><b>★ Dessin</b>Passer du schéma au câblage et numéroter les fils : chapitre 3 du Cours de dessin électrique, avant le TP É02.</div>`,
     mount:root=>{
       mountSortW(root.querySelector('#b10c'),'b10ctl',{cats:[['ok','Bon'],['ko','Défaut']],items:[
         ['Continuité d’un conducteur : 0,3 Ω','ok'],['Continuité d’un conducteur : OL','ko','OL : le conducteur est coupé.'],['Entre L et N : OL','ok'],['Entre L et PE : 0,2 Ω','ko','Une valeur faible entre deux conducteurs différents : contact anormal.'],
         ['Borne PE ↔ carcasse : 0,4 Ω','ok'],['Borne PE ↔ carcasse : OL','ko','La masse n’est pas reliée au PE.'],['Contrôle visuel : un brin dépasse de la borne 3','ko']],ok:'Juste. Trois défauts à corriger avant d’appeler le prof.'});
       mountSortW(root.querySelector('#b10d'),'b10dech',{cats:[['cu','Cuivre'],['pl','Plastiques'],['ca','Carton'],['de','DEEE'],['sp','Filière spéciale']],items:[
         ['Chutes de conducteurs','cu'],['Gaines et embouts ratés','pl'],['Emballage du contacteur neuf','ca'],['Relais remplacé','de'],['Tube fluorescent','sp','Il contient du mercure.'],['Pile du multimètre','sp'],['Chiffon souillé d’huile','sp','Déchet dangereux, jamais à l’évier.']],ok:'Juste. Le tri est évalué à chaque épreuve.'});
     }},
  ],
  prereq:[
    {t:'Reconnaître la phase, le neutre et le conducteur de protection à leur couleur, et refuser un câblage qui ne les respecte pas.', cap:'b8'},
    {t:'Dénuder sans entailler le cuivre, sertir un embout et le contrôler en tirant dessus.', cap:'b10'},
    {t:'Serrer une borne correctement et vérifier la tenue du conducteur.', cap:'b10'},
    {t:'Poser une bague numérotée aux deux extrémités de chaque conducteur, avant de connecter.', cap:'b10'},
    {t:'Réaliser les quatre contrôles hors tension et interpréter les lectures.', cap:'b10'},
    {t:'Trier les déchets de la séance et ranger le poste.', cap:'b10'},
  ],
  controle:[
    ['Qu’est-ce qu’un électron libre ? Dans quel type de matériau en trouve-t-on ?','b1'],
    ['Citer trois conducteurs et trois isolants présents dans l’atelier.','b1'],
    ['Quels sont les quatre éléments d’un circuit ? Quelle condition doit être remplie pour qu’un courant circule ?','b2'],
    ['Qu’est-ce qu’un court-circuit et pourquoi le courant y devient-il énorme ?','b2'],
    ['Quelle grandeur se mesure ENTRE deux points ? Laquelle TRAVERSE un composant ?','b3'],
    ['Deux lampes sont en parallèle. L’une grille. Que se passe-t-il pour l’autre ? Pourquoi ?','b6'],
    ['Pourquoi un ampèremètre branché en parallèle provoque-t-il un court-circuit ?','b6'],
    ['Quelle est la fréquence du réseau belge ? Que signifie-t-elle ?','b8'],
    ['Quelle tension mesure-t-on entre deux phases ? Entre une phase et le neutre ? Pourquoi le rapport n’est-il pas de 2 ?','b8'],
    ['Quelle est la couleur du neutre ? Du conducteur de protection ? Que risque-t-on à utiliser du vert-jaune comme phase ?','b8'],
    ['Que représente la section d’un conducteur ? Que se passe-t-il si elle est trop faible ?','b9'],
    ['Pourquoi met-on un embout sur un conducteur souple ?','b10'],
    ['Citer les quatre contrôles à réaliser avant une mise sous tension.','b10'],
    ['Dans quel bac va une chute de conducteur en cuivre ? Un tube fluorescent ?','b10'],
    ['Pourquoi la chute de tension se calcule-t-elle avec un facteur 2 en monophasé et un facteur √3 en triphasé ?','b9'],
  ],
});
})();
