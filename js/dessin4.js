/* =========================================================
   DESSIN ÉLECTRIQUE — 4e (tronc commun électriciens et mécaniciens)
   Capsules « Dessin » ajoutées dans les chapitres 2.1 à 2.11 du cours d'Électricité 4e.
   Source : la fiche « Construire un schéma électrique » (méthode en 8 étapes, fil rouge du convoyeur
   à deux sens, repères au format -2S3E) et son cahier de cadrage (signalisation, bornier, implantation,
   régimes du neutre, électropneumatique, mise à jour « as built »).
   Les schémas interactifs (js/schema-elec.js) expliquent la matière par morceaux ; le schéma complet,
   l'élève le construit lui-même dans le Banc de câblage (défis à la fin des capsules).
   Les capsules sont ajoutées à la fin des chapitres existants : addDessin(num, caps, Q, prereq, controle).
   ========================================================= */
(function(){
function addDessin(num, caps, Qx, prereq, controle){
  const ch = CHAPTERS[num]; if(!ch) return;
  caps.forEach(c=>{ c.chap=num; ch.caps.push(c); });
  Object.assign(Q, Qx);
  if(prereq) ch.prereq = (ch.prereq||[]).concat(prereq);
  if(controle) ch.controle = (ch.controle||[]).concat(controle);
}
const box = (root, id) => root.querySelector('#'+id);
const bancRep = `<p class="tiny muted" style="margin:8px 0 0">Dans le Banc, les repères sont encore courts (S1, KM1…). Ton collègue prof les fait passer au format du cours (-2S3E). En attendant, câble avec les repères du Banc, et garde le format -2S3E sur tes feuilles.</p>`;
const defi = (root, id, defi, lvl, titre, consigne) => { mountDefiW(box(root,id), {app:'banc', defi, lvl, titre, consigne}); box(root,id).insertAdjacentHTML('beforeend', bancRep); };

/* ---------- les organes du convoyeur (repères de la fiche) ---------- */
const ct = (k,o,r,b,t,a,x) => Object.assign({k,o,r,b,t,a}, x||{});
const AU    = () => ct('nc','S3B','-2S3B',['11','12'],'Arrêt d’urgence','au');
const CORDE = () => ct('nc','S3C','-2S3C',['11','12'],'Arrêt à corde','corde');
const ARR   = () => ct('nc','S3D','-2S3D',['11','12'],'Arrêt','bp');
const MAR_D = () => ct('no','S3E','-2S3E',['13','14'],'Marche droite','bp');
const MAR_G = () => ct('no','S6E','-2S6E',['13','14'],'Marche gauche','bp');
const MT_D  = () => ct('no','KM3H','-2KM3H',['13','14'],'Auto-maintien','km');
const MT_G  = () => ct('no','KM6H','-2KM6H',['13','14'],'Auto-maintien','km');
const VR_D  = () => ct('nc','KM6H','-2KM6H',['21','22'],'Verrouillage','km',{lk:true});
const VR_G  = () => ct('nc','KM3H','-2KM3H',['21','22'],'Verrouillage','km',{lk:true});
const FC_D  = () => ct('nc','S3G','-2S3G',['11','12'],'Fin de course','fdc');
const FC_G  = () => ct('nc','S6G','-2S6G',['11','12'],'Fin de course','fdc');
const TH    = () => ct('nc','F4E','-3F4E',['95','96'],'Thermique','th');
const BOB_D = () => ({k:'bob',o:'KM3H',r:'-2KM3H',x:['2-E4','3-E4']});
const BOB_G = () => ({k:'bob',o:'KM6H',r:'-2KM6H',x:['2-E7','3-E7']});
const R24 = ['L+ 24 V (après -1Q7E)','0 V'];

/* ---------- figures fixes ---------- */
const earth = (x,y,c='#2e9b4e') => `<path d="M${x-9} ${y} h18 M${x-6} ${y+4} h12 M${x-3} ${y+8} h6" stroke="${c}" stroke-width="1.6"/>`;
function feuille1SVG(){
  const t=(x,y,s,o='')=>`<text x="${x}" y="${y}" font-size="10" ${o}>${s}</text>`, L='var(--live)', N='#2f6fd6', G='#2e9b4e';
  const arrow=(x,y)=>`<path d="M${x} ${y-5} l9 5 l-9 5 z" fill="none" stroke="var(--ink)" stroke-width="1.3"/>`;
  return `<svg viewBox="0 0 520 250" role="img" aria-label="Feuille 1 : l’arrivée et l’alimentation de la commande" style="max-width:560px;margin:0 auto">
  <rect x="10" y="20" width="96" height="120" rx="4" fill="none" stroke="var(--ink-2)" stroke-dasharray="6 4"/>${t(16,34,'Tableau divisionnaire','fill="var(--muted)" font-size="9"')}
  <rect x="34" y="70" width="46" height="34" rx="5" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.6"/>${t(40,92,'prise','font-size="9" fill="var(--muted)"')}
  ${t(112,66,'-1P2F','font-weight="800" font-size="11"')}
  ${[['L1',150,L],['L2',165,L],['L3',180,L],['N',195,N],['PE',210,G]].map(([n,y,c],i)=>`<line x1="80" y1="${74+i*6}" x2="120" y2="${y}" stroke="${c}" stroke-width="1.6" ${n==='PE'?'stroke-dasharray="6 3"':''}/><line x1="120" y1="${y}" x2="300" y2="${y}" stroke="${c}" stroke-width="2" ${n==='PE'?'stroke-dasharray="6 3"':''}/>${t(124,y-3,n,`font-size="9" font-weight="700" fill="${c}"`)}${arrow(300,y)}${t(314,y+4,n==='N'||n==='PE'?'vers f. 3':'vers f. 3','font-size="9" fill="var(--muted)"')}`).join('')}
  <circle cx="160" cy="150" r="2.6" fill="${L}"/><line x1="160" y1="150" x2="160" y2="44" stroke="${L}" stroke-width="2"/>
  <circle cx="190" cy="195" r="2.6" fill="${N}"/><line x1="190" y1="195" x2="190" y2="44" stroke="${N}" stroke-width="2"/>
  <line x1="160" y1="44" x2="380" y2="44" stroke="${L}" stroke-width="2"/><line x1="190" y1="52" x2="380" y2="52" stroke="${N}" stroke-width="2"/>
  <rect x="374" y="38" width="22" height="20" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.4"/>${t(370,32,'-1Q7C · 6 A','font-weight="800" font-size="10" text-anchor="middle"')}
  <line x1="396" y1="44" x2="420" y2="44" stroke="${L}" stroke-width="2"/><line x1="396" y1="52" x2="420" y2="52" stroke="${N}" stroke-width="2"/>
  <circle cx="432" cy="48" r="12" fill="none" stroke="var(--ink)" stroke-width="1.6"/><circle cx="448" cy="48" r="12" fill="none" stroke="var(--ink)" stroke-width="1.6"/>${t(440,76,'-1T7D','font-weight="800" text-anchor="middle"')}${t(440,88,'230 / 24 V','font-size="9" fill="var(--muted)" text-anchor="middle"')}
  <line x1="460" y1="44" x2="474" y2="44" stroke="${L}" stroke-width="2"/><line x1="460" y1="52" x2="500" y2="52" stroke="${N}" stroke-width="2"/>
  <rect x="474" y="38" width="16" height="12" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.4"/>${t(482,110,'-1Q7E · 2 A','font-weight="800" font-size="10" text-anchor="middle"')}<line x1="482" y1="50" x2="482" y2="100" stroke="var(--muted)" stroke-dasharray="2 2"/>
  <line x1="490" y1="44" x2="500" y2="44" stroke="${L}" stroke-width="2"/>${arrow(500,44)}${arrow(500,52)}${t(470,140,'L+ et 0 V vers f. 2','font-size="9" fill="var(--muted)" text-anchor="middle"')}
  ${t(240,230,'Feuille 1 · arrivée et alimentation de la commande','font-size="10" fill="var(--muted)" text-anchor="middle"')}
  </svg>`;
}
function lampesW(el){
  const st=WS.lampes||(WS.lampes={par:false});
  const draw=()=>{
    const U=st.par?230:115, P=st.par?1:0.25, glow=`rgba(255,200,40,${0.25+0.75*P})`;
    const lamp=(x,y)=>`<circle cx="${x}" cy="${y}" r="15" fill="${glow}" stroke="#e8a200" stroke-width="2"/><path d="M${x-10} ${y-10} L${x+10} ${y+10} M${x+10} ${y-10} L${x-10} ${y+10}" stroke="var(--ink)" stroke-width="1.4"/><text x="${x+22}" y="${y+4}" font-size="11" font-weight="800">${U} V</text>`;
    const svg = st.par
      ? `<line x1="20" y1="30" x2="300" y2="30" stroke="var(--live)" stroke-width="3"/><line x1="20" y1="170" x2="300" y2="170" stroke="#2f6fd6" stroke-width="3"/>
         <line x1="100" y1="30" x2="100" y2="85" stroke="var(--live)" stroke-width="2.4"/><line x1="100" y1="115" x2="100" y2="170" stroke="#2f6fd6" stroke-width="2.4"/>${lamp(100,100)}
         <line x1="220" y1="30" x2="220" y2="85" stroke="var(--live)" stroke-width="2.4"/><line x1="220" y1="115" x2="220" y2="170" stroke="#2f6fd6" stroke-width="2.4"/>${lamp(220,100)}`
      : `<line x1="20" y1="30" x2="300" y2="30" stroke="var(--live)" stroke-width="3"/><line x1="20" y1="170" x2="300" y2="170" stroke="#2f6fd6" stroke-width="3"/>
         <line x1="160" y1="30" x2="160" y2="50" stroke="var(--live)" stroke-width="2.4"/>${lamp(160,65)}<line x1="160" y1="80" x2="160" y2="120" stroke="var(--ink-2)" stroke-width="2"/>${lamp(160,135)}<line x1="160" y1="150" x2="160" y2="170" stroke="#2f6fd6" stroke-width="2.4"/>`;
    el.innerHTML=`<svg viewBox="0 0 320 190" style="max-width:360px;margin:0 auto" role="img" aria-label="Deux lampes ${st.par?'en parallèle':'en série'}"><text x="20" y="20" font-size="10" font-weight="700" fill="var(--live)">L · 230 V</text><text x="20" y="186" font-size="10" font-weight="700" fill="#2f6fd6">N</text>${svg}</svg>
      <div class="ctrls" style="justify-content:center"><div class="seg"><button class="${st.par?'':'on'}" data-lm="0">En série</button><button class="${st.par?'on':''}" data-lm="1">En parallèle</button></div></div>
      <p class="small" style="text-align:center;margin:8px 0 0">${st.par?'Chaque lampe reçoit les <b>230 V</b> complets : elle dissipe toute sa puissance et elle est indépendante de l’autre.':'Chaque lampe ne reçoit que <b>115 V</b>. Comme P = U² ÷ R, elle ne dissipe plus que le <b>quart</b> de sa puissance : les deux éclairent à peine.'}</p>`;
    el.querySelectorAll('[data-lm]').forEach(b=>b.onclick=()=>{ st.par=b.dataset.lm==='1'; draw(); });
  };
  draw();
}
function regimeSVG(t){
  const L='var(--live)', N='#2f6fd6', G='#2e9b4e', out=[];
  const ln=(x1,y1,x2,y2,c,d)=>out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2" ${d?'stroke-dasharray="6 3"':''}/>`);
  out.push(`<rect x="8" y="18" width="44" height="56" rx="4" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.4"/><text x="30" y="50" text-anchor="middle" font-size="9" fill="var(--muted)">source</text>`);
  ln(52,28,170,28,L); out.push(`<text x="58" y="24" font-size="8" font-weight="700" fill="${L}">L1 L2 L3</text>`);
  out.push(`<rect x="170" y="20" width="34" height="46" rx="3" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.4"/><rect x="166" y="16" width="42" height="54" rx="5" fill="none" stroke="var(--muted)" stroke-dasharray="3 2"/><text x="187" y="47" text-anchor="middle" font-size="8" fill="var(--muted)">masse</text>`);
  if(t==='TT'){ ln(52,46,170,46,N); out.push(`<text x="58" y="43" font-size="8" font-weight="700" fill="${N}">N</text>`); ln(30,74,30,92,G); out.push(earth(30,92)); ln(208,60,224,60,G,1); ln(224,60,224,92,G,1); out.push(earth(224,92)); }
  if(t==='TN-S'){ ln(52,46,170,46,N); ln(52,60,170,60,G,1); out.push(`<text x="58" y="43" font-size="8" font-weight="700" fill="${N}">N</text><text x="58" y="57" font-size="8" font-weight="700" fill="${G}">PE</text>`); ln(30,74,30,92,G); out.push(earth(30,92)); ln(40,74,40,82,G); ln(40,82,60,82,G); ln(60,82,60,60,G,1); }
  if(t==='TN-C'){ ln(52,52,170,52,'#7a4fc0'); out.push(`<text x="58" y="49" font-size="8" font-weight="700" fill="#7a4fc0">PEN</text>`); ln(30,74,30,92,G); out.push(earth(30,92)); ln(187,66,187,80,'#7a4fc0'); ln(187,80,150,80,'#7a4fc0'); ln(150,80,150,52,'#7a4fc0'); out.push(`<circle cx="150" cy="52" r="2.6" fill="#7a4fc0"/>`); }
  if(t==='TN-C-S'){ ln(52,52,110,52,'#7a4fc0'); out.push(`<text x="58" y="49" font-size="8" font-weight="700" fill="#7a4fc0">PEN</text><circle cx="110" cy="52" r="3" fill="#7a4fc0"/>`); ln(110,52,110,46,N); ln(110,46,170,46,N); ln(110,52,110,62,G,1); ln(110,62,170,62,G,1); out.push(`<text x="116" y="43" font-size="8" font-weight="700" fill="${N}">N</text><text x="116" y="72" font-size="8" font-weight="700" fill="${G}">PE</text>`); ln(30,74,30,92,G); out.push(earth(30,92)); }
  if(t==='IT'){ ln(52,46,170,46,N); out.push(`<text x="58" y="43" font-size="8" font-weight="700" fill="${N}">N</text>`); ln(30,74,30,80,'var(--ink)'); out.push(`<rect x="24" y="80" width="12" height="10" fill="none" stroke="var(--ink)"/><text x="40" y="89" font-size="8" fill="var(--muted)">isolé ou Z</text>`); out.push(`<rect x="96" y="70" width="30" height="16" rx="3" fill="var(--amber-soft)" stroke="var(--amber)"/><text x="111" y="81" text-anchor="middle" font-size="8" font-weight="700">CPI</text>`); ln(111,46,111,70,'var(--ink)'); ln(111,86,111,96,G); out.push(earth(111,96)); ln(208,60,224,60,G,1); ln(224,60,224,92,G,1); out.push(earth(224,92)); }
  return `<svg viewBox="0 0 240 112" role="img" aria-label="Schéma d’arrivée" style="max-width:250px;display:block">${out.join('')}</svg>`;
}
function implantSVG(){
  const b=(x,y,w,h,r,s='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.3"/><text x="${x+w/2}" y="${y+h/2+3}" text-anchor="middle" font-size="9" font-weight="800">${r}</text>${s?`<text x="${x+w/2}" y="${y+h+10}" text-anchor="middle" font-size="7.5" fill="var(--muted)">${s}</text>`:''}`;
  const rail=(y)=>`<rect x="24" y="${y}" width="232" height="8" fill="var(--grey-soft)" stroke="var(--line)"/>`;
  return `<svg viewBox="0 0 430 250" role="img" aria-label="Plan d’implantation : armoire et pupitre du convoyeur" style="max-width:520px;margin:0 auto">
   <rect x="10" y="10" width="260" height="230" rx="6" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="16" y="24" font-size="9" fill="var(--muted)">Armoire · vue de face, porte ouverte</text>
   ${rail(52)}${b(30,36,40,40,'-1Q7C','6 A')}${b(78,36,30,40,'-1Q7E','2 A')}${b(118,32,58,48,'-1T7D','230/24 V')}${b(186,36,58,40,'-3Q4C','disj.-moteur')}
   <rect x="24" y="96" width="232" height="10" fill="var(--grey-soft)" stroke="var(--line)" stroke-dasharray="4 2"/><text x="140" y="104" text-anchor="middle" font-size="7.5" fill="var(--muted)">goulotte</text>
   ${rail(136)}${b(34,120,54,40,'-2KM3H','sens droit')}${b(96,120,54,40,'-2KM6H','sens gauche')}${b(160,120,54,40,'-3F4E','thermique')}
   <rect x="24" y="182" width="232" height="10" fill="var(--grey-soft)" stroke="var(--line)" stroke-dasharray="4 2"/>
   ${[...Array(12)].map((_,i)=>`<rect x="${40+i*16}" y="204" width="12" height="22" fill="var(--surface)" stroke="var(--ink)"/><text x="${46+i*16}" y="219" text-anchor="middle" font-size="7">${i+1}</text>`).join('')}<text x="34" y="218" text-anchor="end" font-size="9" font-weight="800">-X1</text>
   <rect x="300" y="40" width="120" height="150" rx="6" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="306" y="54" font-size="9" fill="var(--muted)">Pupitre · vue de face</text>
   <circle cx="360" cy="86" r="16" fill="#e53935" stroke="var(--ink)"/><rect x="340" y="104" width="40" height="12" fill="#ffd400" stroke="var(--ink)" stroke-width=".8"/><text x="360" y="113" text-anchor="middle" font-size="8" font-weight="800">-2S3B</text>
   ${[['-2S6E',325,150],['-2S3D',360,150],['-2S3E',395,150]].map(([r,x,y])=>`<circle cx="${x}" cy="${y}" r="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.4"/><text x="${x}" y="${y+24}" text-anchor="middle" font-size="8" font-weight="800">${r}</text>`).join('')}
  </svg>`;
}

/* =========================================================
   2.1 — Dessin 1 · Commande, puissance et repères
   ========================================================= */
addDessin('2.1', [
 {id:'a9', sec:'Dessin 1', t:'Commande, puissance et repères', quiz:['a9q1','a9q2','a9q3'], ex:{keys:['a9cls'], lbl:'Classes de repère'},
  body:()=>`<p class="lead">Un schéma de machine se dessine toujours en <b>deux parties</b>, souvent sur deux feuilles : le circuit de <b>commande</b> et le circuit de <b>puissance</b>. Ce n’est pas une habitude de dessinateur : ce sont deux métiers demandés au même équipement.</p>
   ${tbl(['','Circuit de commande','Circuit de puissance'],[['Ce qu’il fait','Il décide quand le récepteur reçoit l’énergie.','Il porte l’énergie jusqu’au récepteur.'],['Ce qu’il contient','Boutons, contacts auxiliaires, contacts de sécurité, bobines, voyants.','Arrivée, sectionnement, protections, contacts principaux du contacteur, moteur.'],['Sa tension','230 V, ou 24 V par transformateur.','Celle du réseau : 400 V triphasé pour un moteur.'],['Son trait','Fin.','Plus épais.'],['Sa lecture','Branche par branche, chacune verticale, entre les deux lignes d’alimentation.','De haut en bas, de la source vers le récepteur.'],['Sa section de câble','Faible et constante : 1 ou 1,5 mm².','Calculée d’après le courant du moteur.']])}
   <h3>Le lien entre les deux : le repère</h3>
   <p>Un contacteur est <b>un seul appareil</b>, mais il apparaît sur les deux feuilles. Sa bobine est un récepteur de la commande. Ses contacts principaux sont des interrupteurs de la puissance. Rien ne les relie électriquement, mais tout les relie mécaniquement : quand la bobine colle, les contacts se ferment.</p>
   ${schbox('a9sch','Appuie sur la marche -2S3E (garde le doigt appuyé) : la bobine -2KM3H colle à gauche, ses trois contacts se ferment à droite. C’est le même appareil, avec le même repère.')}
   ${regle('<b>Un appareil, un repère, et ce repère apparaît partout où l’appareil se montre.</b> Un schéma dont les repères sont incomplets ou incohérents est illisible, même s’il est joliment dessiné.')}
   <h3>Comment se lit un repère : ${rp('-2S3E')}</h3>
   <p>Un repère n’est pas un nom choisi au hasard : c’est <b>une adresse</b>. Il se lit de gauche à droite.</p>
   ${tbl(['Morceau','Dans -2S3E','Ce qu’il dit'],[['-','le tiret de tête','Il annonce un repère d’appareil et il en fait partie : on écrit -2S3E, pas 2S3E.'],['2','le folio','La feuille du dossier où l’appareil est dessiné.'],['S','la classe','Ce qu’est l’appareil (voir le tableau ci-dessous).'],['3','la colonne','La colonne du quadrillage de la feuille.'],['E','la ligne','La ligne du quadrillage de la feuille.']])}
   <p><b>-2S3E se lit donc « feuille 2, colonne 3, ligne E »</b> : un bouton, et on sait exactement où le trouver.</p>
   ${tbl(['Classe','Appareil'],[['S','Organe de commande manuelle et de détection de position : bouton, arrêt d’urgence, interrupteur de position'],['KM','Contacteur'],['Q','Protection et sectionnement : disjoncteur, disjoncteur-moteur'],['F','Protection thermique : relais thermique'],['T','Transformateur'],['M','Moteur'],['P','Prise'],['H','Voyant (convention de l’école)']])}
   <p><b>Une bobine et ses contacts portent le même repère.</b> Les contacts de puissance de ${rp('-2KM3H')} sont dessinés sur la feuille 3, et ils s’appellent quand même -2KM3H : le repère donne l’adresse de l’<b>appareil</b>, c’est-à-dire celle de sa bobine. C’est pour cela que le schéma porte des <b>références croisées</b> : sous la bobine -2KM3H, les mentions <b>2-E4 · 3-E4</b> indiquent les cases où se trouvent ses contacts.</p>
   ${piege('Sur une machine de trente appareils, un nom ne dit rien de l’endroit où l’appareil est dessiné. Une adresse, si. À la latte, c’est toi qui la tiens à jour : on numérote le quadrillage et on réserve la place du cartouche <b>avant</b> de tracer.','Pourquoi une adresse plutôt qu’un nom')}
   <h3>Le fil rouge : le convoyeur de l’atelier</h3>
   <p>Toute la suite se construit sur une seule machine : un convoyeur à deux sens. Voici la demande telle qu’on pourrait la recevoir.</p>
   <div class="note"><b>Le cahier des charges</b>Un moteur triphasé 400 V entraîne un tapis qui avance dans les deux sens. L’installation est alimentée depuis le tableau divisionnaire de l’atelier, par une prise triphasée 400 V + N + PE. On demande : une marche dans chaque sens par bouton-poussoir ; l’impossibilité absolue d’enclencher les deux sens en même temps ; un arrêt normal par bouton-poussoir ; un arrêt d’urgence par coup-de-poing ; un arrêt de sécurité par interrupteur à corde ; un arrêt automatique en fin de course dans chaque sens ; une commande en 24 V par transformateur protégé des deux côtés ; une protection du moteur contre le court-circuit et la surcharge.</div>
   <p><b>Étape 1 :</b> avant de tracer quoi que ce soit, on lit le cahier des charges et on dresse la liste des appareils. Chacun reçoit son repère et sa feuille. Cette liste, c’est déjà la moitié du travail.</p>
   ${tbl(['Exigence','Appareil','Repère','Circuit · feuille'],[['Couper en urgence','Coup-de-poing à ouverture','-2S3B','commande · f. 2'],['Arrêter depuis n’importe quel point du tapis','Interrupteur de position à corde','-2S3C','commande · f. 2'],['Arrêter normalement','Bouton-poussoir à ouverture','-2S3D','commande · f. 2'],['Démarrer en sens droit / gauche','Boutons-poussoirs à fermeture','-2S3E · -2S6E','commande · f. 2'],['Arrêter en fin de course','Interrupteurs de position','-2S3G · -2S6G','commande · f. 2'],['Commander chaque sens','Contacteurs (bobines)','-2KM3H · -2KM6H','commande · f. 2'],['Alimenter la commande en 24 V','Disjoncteur 6 A, transformateur, disjoncteur 2 A','-1Q7C · -1T7D · -1Q7E','commande · f. 1'],['Alimenter l’installation','Prise 400 V + N + PE','-1P2F','arrivée · f. 1'],['Protéger le moteur du court-circuit','Disjoncteur-moteur','-3Q4C','puissance · f. 3'],['Protéger de la surcharge','Relais thermique','-3F4E','puissance · f. 3'],['Entraîner le tapis','Moteur asynchrone triphasé','-3M4H','puissance · f. 3']])}
   ${exbox('a9box','Quelle classe de repère ?','Pour chaque appareil, choisis la lettre de sa classe.')}
   ${verif('Chaque appareil a-t-il un repère, et un seul ? Le même repère est-il écrit partout où l’appareil apparaît ?')}`,
  mount:root=>{
    schemaW(box(root,'a9sch'), { c:[ARR(), MAR_D(), BOB_D()], rails:R24, puiss:{mode:'direct', km:['KM3H']}, hint:'Garde le doigt sur la marche : sans auto-maintien (tu le verras plus tard), le contacteur retombe dès que tu lâches.' });
    mountSortW(box(root,'a9box'),'a9cls',{cats:[['S','S'],['KM','KM'],['Q','Q'],['F','F'],['T','T'],['M','M']],items:[
      ['Coup-de-poing d’arrêt d’urgence','S'],['Interrupteur de position de fin de course','S'],['Contacteur du sens gauche','KM'],['Disjoncteur-moteur','Q'],['Relais thermique','F'],['Transformateur 230 / 24 V','T'],['Moteur du tapis','M'],['Disjoncteur 2 A du secondaire','Q']],ok:'Juste. La classe dit ce qu’est l’appareil ; le folio, la colonne et la ligne disent où il est dessiné.'});
  }},
], {
  a9q1:{q:'Que veut dire le repère -3F4E ?',o:['Le 3e relais thermique du dossier, au 4e étage','Un relais thermique dessiné feuille 3, colonne 4, ligne E','Un fusible de 3 A sur la ligne 4E'],g:1,e:'Folio 3, classe F (protection thermique), colonne 4, ligne E : c’est une adresse.',r:'a9'},
  a9q2:{q:'Les contacts principaux de -2KM3H sont dessinés sur la feuille 3. Comment s’appellent-ils ?',o:['-3KM3H','-2KM3H, comme la bobine','On ne les repère pas'],g:1,e:'Le repère est l’adresse de l’appareil, c’est-à-dire celle de sa bobine. Les références croisées font le trajet.',r:'a9'},
  a9q3:{q:'Sous la bobine -2KM3H, on lit « 2-E4 · 3-E4 ». À quoi cela sert-il ?',o:['À donner la tension de la bobine','À indiquer les cases où se trouvent les contacts de ce contacteur','À dater la feuille'],g:1,e:'Ce sont les références croisées : elles permettent de suivre un contact d’une feuille à l’autre en quelques secondes.',r:'a9'},
}, [{t:'Lire un repère d’appareil (-2S3E) et dire sur quelle feuille trouver l’appareil.', cap:'a9'}],
   [['Que signifie chacun des morceaux du repère -2S3E ?','a9']]);

/* =========================================================
   2.2 — Dessin 2 · Récepteurs en parallèle, coupures en série
   ========================================================= */
addDessin('2.2', [
 {id:'b11', sec:'Dessin 2', t:'Récepteurs en parallèle, coupures en série', quiz:['b11q1','b11q2'], ex:{keys:['b11dr','b11srt'], lbl:'Lampes en série · familles'},
  body:()=>`<p class="lead">Dans une branche de commande, les appareils ne jouent pas tous le même rôle, et cela détermine leur place sur le schéma.</p>
   ${tbl(['Famille','Ce qu’elle fait','Exemples','Où elle se place'],[['Récepteur','Consomme l’énergie et la transforme : en champ magnétique, en lumière, en chaleur.','Bobine de contacteur, voyant, électrovanne, moteur','Seul, en fin de branche, au plus près de N'],['Organe de coupure','Ouvre le circuit pour l’arrêter ou le sécuriser.','Arrêt d’urgence, arrêt à corde, arrêt, fins de course','En tête de branche, en série les uns derrière les autres'],['Organe de commande','Ferme le circuit pour donner un ordre.','Boutons de marche, contacts d’auto-maintien','Entre les coupures et le récepteur']])}
   <h3>Pourquoi on ne met jamais deux récepteurs en série</h3>
   <p>C’est l’erreur la plus fréquente chez les débutants. Prends deux lampes prévues pour 230 V et branche-les l’une derrière l’autre entre la phase et le neutre.</p>
   <div class="figure"><div id="b11lm"></div></div>
   <p>En série, les deux lampes se partagent la tension : chacune reçoit <b>115 V au lieu de 230 V</b>. Or la puissance vaut ${typeof fm==='function'?fm('P = U^2 / R'):'P = U² ÷ R'} : sous la moitié de la tension, chaque lampe ne dissipe plus que le <b>quart</b> de sa puissance.</p>
   <ul class="ctrlq"><li><b>La tension se partage.</b> Une bobine de contacteur sous la moitié de sa tension ne colle pas, ou pire : elle colle à moitié, vibre et brûle.</li><li><b>Les deux deviennent dépendants.</b> Si l’un est coupé ou grille, l’autre s’arrête aussi. Un voyant grillé qui empêche un moteur de démarrer, c’est une panne absurde à trouver.</li><li><b>Le dépannage devient impossible.</b> Chaque récepteur doit pouvoir être testé seul, entre ses deux bornes.</li></ul>
   ${regle('<b>Les récepteurs se branchent en parallèle, un seul par branche, en fin de branche. Les organes de coupure se branchent en série, en tête de branche.</b> Chaque fois que tu hésites sur la place d’un appareil, demande-toi d’abord : est-ce qu’il consomme, ou est-ce qu’il coupe ?')}
   ${piege('« Je veux un voyant qui s’allume quand le contacteur colle : je le mets en série avec la bobine. » C’est faux, deux fois. La bobine et le voyant se partageraient la tension, et un voyant grillé couperait la bobine. Le voyant se place <b>sur sa propre branche</b>, en parallèle, piloté par un contact auxiliaire libre du contacteur.','Le piège du voyant')}
   ${exbox('b11dbox','Deux lampes identiques en série','Calcule avec P = U² ÷ R. La lampe garde la même résistance.')}
   ${exbox('b11sbox','Récepteur, coupure ou commande ?')}`,
  mount:root=>{
    lampesW(box(root,'b11lm'));
    (v=>mountDrillW(box(root,'b11dbox'),'b11dr',{intro:`Deux lampes de ${v.P} W · 230 V sont montées en série sur le 230 V.`,rows:[
      {q:'Tension aux bornes d’une lampe',unit:'V',ans:230/2},
      {q:'Résistance d’une lampe (R = U² ÷ P, avec ses valeurs nominales)',unit:'Ω',ans:230*230/v.P,hint:'R = 230² ÷ P'},
      {q:'Puissance dissipée par une lampe en série',unit:'W',ans:(115*115)/(230*230/v.P),hint:'P = 115² ÷ R : le quart de la puissance nominale'}],ok:'Juste : chaque lampe ne fournit plus que le quart de sa puissance.'}))(vx('b11dr',{P:[40,60,75,100]}));
    mountSortW(box(root,'b11sbox'),'b11srt',{cats:[['r','Récepteur'],['c','Coupure'],['o','Commande']],items:[['Bobine du contacteur -2KM3H','r'],['Voyant de marche','r'],['Arrêt d’urgence -2S3B','c'],['Fin de course -2S3G','c'],['Bouton de marche -2S3E','o'],['Contact d’auto-maintien de -2KM3H','o'],['Arrêt à corde -2S3C','c'],['Bobine d’électrovanne','r']],ok:'Juste. Les récepteurs en bas, seuls ; les coupures en tête, en série ; les ordres entre les deux.'});
  }},
], {
  b11q1:{q:'Deux bobines de contacteur 24 V sont montées en série sur le 24 V. Que se passe-t-il ?',o:['Les deux collent normalement','Chacune reçoit environ 12 V : elles ne collent pas, ou collent mal, vibrent et chauffent','Elles collent plus vite'],g:1,e:'La tension se partage entre les deux récepteurs : aucun ne reçoit sa tension nominale.',r:'b11'},
  b11q2:{q:'Où se place l’arrêt d’urgence dans une branche de commande ?',o:['Juste au-dessus de la bobine','En tête de branche, en série avec les autres coupures','En parallèle sur le bouton de marche'],g:1,e:'Les organes de coupure se montent en série, en tête : chacun garde à lui seul le pouvoir de couper.',r:'b11'},
}, [{t:'Placer chaque appareil dans une branche : coupures en série en tête, récepteur seul en fin de branche.', cap:'b11'}]);

/* =========================================================
   2.4 — Dessin 3 à 7 : contacts, logique, branche, puissance, signalisation
   ========================================================= */
const LOG = {
  et:   {lbl:'2 NO en série · ET', c:()=>[ct('no','S1','-2S1B',['13','14'],'S1','bp'),ct('no','S2','-2S1D',['13','14'],'S2','bp'),{k:'lamp',o:'H1',r:'-2H1F'}], txt:'<b>Il faut les deux.</b> Le courant doit traverser le premier puis le second. C’est le montage de toute condition obligatoire : la commande bimanuelle d’une presse, par exemple, oblige l’opérateur à garder ses deux mains hors de la zone dangereuse.'},
  ou:   {lbl:'2 NO en parallèle · OU', c:()=>[{par:[[ct('no','S1','-2S1C',['13','14'],'S1','bp')],[ct('no','S2','-2S2C',['13','14'],'S2','bp')]]},{k:'lamp',o:'H1',r:'-2H1F'}], txt:'<b>Un seul suffit.</b> C’est le montage des ordres redondants : plusieurs boutons de marche à plusieurs endroits. C’est aussi celui de l’auto-maintien.'},
  nonou:{lbl:'2 NC en série · NON-OU', c:()=>[ct('nc','S1','-2S1B',['11','12'],'S1','bp'),ct('nc','S2','-2S1D',['11','12'],'S2','bp'),{k:'lamp',o:'H1',r:'-2H1F'}], txt:'<b>Un seul suffit pour couper.</b> C’est exactement ce qu’on attend d’une chaîne de sécurité : tous les organes de coupure se montent ainsi, en série, en tête de branche.'},
  nonet:{lbl:'2 NC en parallèle · NON-ET', c:()=>[{par:[[ct('nc','S1','-2S1C',['11','12'],'S1','bp')],[ct('nc','S2','-2S2C',['11','12'],'S2','bp')]]},{k:'lamp',o:'H1',r:'-2H1F'}], txt:'<b>Il faut les deux pour couper.</b> Si l’on en actionne un, l’autre court-circuite celui qu’on vient d’ouvrir. Le NON-ET a ses usages (une double confirmation), <b>mais jamais pour un arrêt</b>.'},
};
function logicW(el){
  const st=WS.logic||(WS.logic={m:'et'});
  const draw=()=>{
    el.innerHTML=`<div class="ctrls" style="margin:0 0 8px"><div class="seg">${Object.entries(LOG).map(([k,v])=>`<button class="${st.m===k?'on':''}" data-lg="${k}">${v.lbl}</button>`).join('')}</div></div><div data-lgw></div><p class="small" style="margin:8px 0 0">${LOG[st.m].txt}</p>`;
    schemaW(el.querySelector('[data-lgw]'), {c:LOG[st.m].c, rails:['L+ 24 V','0 V'], table:{in:['S1','S2'], out:'H1', lbl:['S1','S2','H1']}, hint:'Garde le doigt sur S1, sur S2, puis sur les deux (un doigt sur chaque nom sur tablette). La ligne de la table qui correspond s’allume. 1 = organe actionné, 0 = au repos.'});
    el.querySelectorAll('[data-lg]').forEach(b=>b.onclick=()=>{ st.m=b.dataset.lg; draw(); });
  };
  draw();
}
const ONEWAY = (o={}) => [ ...(o.noAU?[]:[AU()]), ...(o.corde?[CORDE()]:[]), ARR(), ...(o.th?[TH()]:[]),
  {par:[[MAR_D()],[MT_D()]]}, ...(o.fdc?[FC_D()]:[]), BOB_D() ];

addDessin('2.4', [
 {id:'d6', sec:'Dessin 3', t:'Contacts à fermeture et à ouverture', quiz:['d6q1','d6q2'], ex:{keys:['d6srt'], lbl:'NO ou NC ?'},
  body:()=>`<p class="lead">Un contact est un interrupteur commandé par autre chose : un doigt, un capot, une bobine, un bilame. Il n’existe que <b>deux types</b>, et la différence tient uniquement à ce qu’ils font <b>au repos</b>.</p>
   ${schbox('d6sch','À gauche, un contact à fermeture (NO) ; à droite, un contact à ouverture (NC). Garde le doigt sur chaque bouton et regarde les voyants.')}
   ${tbl(['','Contact à fermeture · NO','Contact à ouverture · NC'],[['Au repos','Ouvert : le courant ne passe pas.','Fermé : le courant passe.'],['Actionné','Fermé : le courant passe.','Ouvert : le courant ne passe pas.'],['Bornes','13-14, 23-24, 33-34, 43-44','11-12, 21-22, 31-32, 95-96'],['Sur le schéma au repos','Il apparaît ouvert.','Il apparaît fermé.'],['À quoi il sert','Donner un ordre : marche, validation, signalisation d’un état actif.','Couper : arrêt, arrêt d’urgence, sécurité, défaut.']])}
   ${regle('Le <b>second chiffre</b> de la borne dit le type : 3-4 pour un contact à fermeture, 1-2 pour un contact à ouverture. Le premier chiffre est le numéro d’ordre du contact sur l’appareil (1, 2, 3…). Les contacts du relais thermique portent 95-96 (NC) et 97-98 (NO).','Lire une borne')}
   ${regle('<b>Un schéma se dessine toujours au repos</b> : aucun bouton enfoncé, aucune bobine alimentée. C’est l’état de référence commun à tous les lecteurs.','La règle du repos')}
   ${exbox('d6box','À fermeture ou à ouverture ?','D’après ses bornes.')}`,
  mount:root=>{
    schemaW(box(root,'d6sch'),{c:[{par:[[ct('no','S1','-2S1B',['13','14'],'Bouton NO','bp'),{k:'lamp',o:'H1',r:'-2H1F'}],[ct('nc','S2','-2S3B',['11','12'],'Bouton NC','bp'),{k:'lamp',o:'H2',r:'-2H3F'}]]}], rails:['L+ 24 V','0 V']});
    mountSortW(box(root,'d6box'),'d6srt',{cats:[['no','NO · à fermeture'],['nc','NC · à ouverture']],items:[['13-14','no'],['21-22','nc'],['43-44','no'],['11-12','nc'],['95-96 du relais thermique','nc'],['23-24','no'],['31-32','nc'],['97-98 du relais thermique','no']],ok:'Juste. 3-4 : à fermeture ; 1-2 : à ouverture.'});
  }},
 {id:'d7', sec:'Dessin 4', t:'La logique à contacts : ET, OU, NON-OU, NON-ET', quiz:['d7q1','d7q2'], ex:{keys:['d7srt'], lbl:'Quelle fonction ?'},
  body:()=>`<p class="lead">Deux contacts peuvent se monter en série ou en parallèle, et ils peuvent être NO ou NC. Cela fait quatre combinaisons, et ce sont exactement les quatre fonctions logiques de la commande industrielle.</p>
   <div class="note"><b>La convention 0 / 1</b>Pour chaque organe : <b>1 = actionné</b> (bouton enfoncé, corde tirée, bilame déclenché), <b>0 = au repos</b>. Pour la sortie : <b>1 = récepteur alimenté</b>. Un contact NO laisse passer le courant quand son organe vaut 1 ; un contact NC quand il vaut 0 : il inverse.</div>
   <div class="figure"><div id="d7lg"></div></div>
   ${tbl(['Montage','Fonction','Symbole IEC','Comportement','Usage typique'],[['2 NO en série','ET','&','Il faut les deux.','Conditions obligatoires, commande bimanuelle'],['2 NO en parallèle','OU','≥ 1','Un seul suffit.','Plusieurs boutons de marche, auto-maintien'],['2 NC en série','NON-OU','≥ 1 avec rond','Un seul suffit pour couper.','Chaîne d’arrêts et de sécurités'],['2 NC en parallèle','NON-ET','& avec rond','Il faut les deux pour couper.','Double confirmation, jamais un arrêt']])}
   ${erreur('Deux arrêts en parallèle, ce sont deux boutons d’arrêt dont <b>aucun ne fonctionne tout seul</b>. On croit ajouter un second arrêt, on vient en réalité d’annuler le premier. C’est une faute grave.','Le montage à reconnaître pour le refuser')}
   ${regle('<b>En série, c’est ET</b> : il faut que tout soit passant. <b>En parallèle, c’est OU</b> : il suffit d’un chemin. <b>Un contact NC, c’est un NON</b> : il inverse ce que fait son organe. Avec ces trois phrases, tu retrouves les quatre fonctions sans rien apprendre par cœur. C’est aussi ce qu’exécute un automate programmé en schéma à contacts.','Les trois phrases à retenir')}
   ${exbox('d7box','Quelle fonction logique ?','Un montage ou un usage : à quelle fonction correspond-il ?')}`,
  mount:root=>{
    logicW(box(root,'d7lg'));
    mountSortW(box(root,'d7box'),'d7srt',{cats:[['et','ET'],['ou','OU'],['nou','NON-OU'],['net','NON-ET']],items:[['2 NO en série','et'],['2 NO en parallèle','ou'],['2 NC en série','nou'],['2 NC en parallèle','net'],['Commande bimanuelle de presse','et'],['Chaîne arrêt d’urgence + corde + arrêt','nou'],['Bouton de marche + contact d’auto-maintien','ou'],['Deux boutons de marche à deux endroits','ou']],ok:'Juste. Série = ET, parallèle = OU, et le NC inverse.'});
  }},
 {id:'d8', sec:'Dessin 5', t:'Une branche de commande et son auto-maintien', quiz:['d8q1','d8q2'], ex:{keys:['d8ord', defiKey('banc','r5',1)], lbl:'Ordre de la branche · Banc'},
  body:()=>`<p class="lead">La commande se dessine entre les deux lignes issues du secondaire 24 V. Les appareils s’y placent dans l’ordre imposé par la règle : <b>les coupures d’abord, les ordres ensuite, le récepteur en dernier</b>.</p>
   <ul class="ctrlq"><li>Les <b>coupures communes</b>, en série, en tête : l’arrêt d’urgence ${rp('-2S3B')}, l’arrêt à corde ${rp('-2S3C')}, l’arrêt ${rp('-2S3D')}. C’est un NON-OU : un seul suffit à tout couper.</li><li>L’<b>ordre de marche</b> ${rp('-2S3E')}, un contact à fermeture.</li><li>Le <b>contact d’auto-maintien</b> de ${rp('-2KM3H')} (13-14), en parallèle sur les deux bornes de -2S3E.</li><li>La <b>coupure propre à ce sens</b> : le fin de course ${rp('-2S3G')}.</li><li>La <b>bobine</b> ${rp('-2KM3H')}, seule, en fin de branche.</li></ul>
   ${schbox('d8sch','Appuie sur -2S3E puis lâche : le contacteur se tient tout seul. Essaie ensuite chaque coupure. Coche « l’erreur classique » et recommence.')}
   <h3>L’auto-maintien, en détail</h3>
   <p>Un bouton-poussoir ne reste pas enfoncé : son ressort le ramène dès qu’on le lâche. On utilise donc un contact <b>à fermeture</b> du contacteur lui-même, repéré 13-14, monté en parallèle avec le bouton de marche. Quand -2KM3H colle, ce contact se ferme et donne un second chemin au courant. C’est une fonction OU : le courant passe si l’on appuie sur marche <b>ou</b> si le contacteur est déjà collé.</p>
   ${regle('Si le réseau disparaît, la bobine retombe et le contact 13-14 s’ouvre. Au retour du courant, la machine <b>reste à l’arrêt</b> tant que personne n’a réappuyé sur marche. C’est la protection contre le redémarrage intempestif.','Pourquoi l’auto-maintien est aussi une sécurité')}
   ${erreur('Raccorder le contact d’auto-maintien en amont de l’arrêt -2S3D au lieu des bornes de la marche -2S3E. Le moteur démarre et reste en marche… mais le contact court-circuite le bouton d’arrêt, et la machine ne s’arrête plus. L’auto-maintien se raccorde <b>toujours</b> aux bornes d’un organe de commande, <b>jamais</b> à celles d’un organe de coupure.','L’erreur de câblage qui revient chaque année')}
   ${exbox('d8box','Remets la branche dans l’ordre','De la ligne L+ 24 V (en haut) vers le 0 V (en bas).')}
   ${exbox('d8banc','Au Banc de câblage : relais 5, marche-arrêt avec maintien','Niveau 1 : les composants sont en place, il reste à câbler.')}`,
  mount:root=>{
    schemaW(box(root,'d8sch'),{c:o=>o.err?[AU(),CORDE(),{par:[[ARR(),MAR_D()],[MT_D()]]},FC_D(),BOB_D()]:ONEWAY({corde:true,fdc:true}), rails:R24, toggles:[{id:'err',lbl:'L’erreur classique : maintien raccordé avant l’arrêt'}], status:st=>st.coil.KM3H?(st.opt.err?'<b>-2KM3H collé</b> — essaie l’arrêt -2S3D : <span style="color:var(--bad)">il ne sert plus à rien</span>.':'<b>-2KM3H collé</b> et maintenu.'):'<span class="muted">Contacteur au repos.</span>'});
    mountOrderW(box(root,'d8box'),'d8ord',{items:['Arrêt d’urgence -2S3B (NC)','Arrêt à corde -2S3C (NC)','Arrêt -2S3D (NC)','Marche -2S3E (NO) et son auto-maintien en parallèle','Fin de course -2S3G (NC)','Bobine -2KM3H'],ok:'Juste : coupures communes, ordre et maintien, coupure propre au sens, récepteur.'});
    defi(root,'d8banc','r5',1,'Relais 5 · marche-arrêt avec maintien');
  }},
 {id:'d9', sec:'Dessin 6', t:'De l’arrivée à la puissance : folios, 24 V et moteur', quiz:['d9q1','d9q2','d9q3'], ex:{keys:['d9srt','d9ord', defiKey('banc','direct',1)], lbl:'Commande, puissance · Banc'},
  body:()=>`<p class="lead">L’ordre dans lequel on dessine évite les ratures. On remonte le courant depuis sa source : d’abord l’<b>arrivée</b>, puis la <b>commande</b> (elle traduit le cahier des charges), et la <b>puissance</b> en dernier, car elle n’est que la conséquence de la commande.</p>
   <h3>Étapes 2 et 3 · l’arrivée et les reports de folio</h3>
   <ul class="ctrlq"><li>Sur la feuille 1, la prise ${rp('-1P2F')} raccordée au tableau divisionnaire, et cinq conducteurs repérés à leurs deux extrémités : L1, L2, L3, N, PE.</li><li>Le tableau est encadré en <b>trait interrompu</b> : c’est la convention qui délimite une enveloppe que l’on ne détaille pas ici.</li><li>Le conducteur de protection PE est tracé à part et ne traverse <b>aucun organe de coupure</b>, du début à la fin du dossier.</li><li>Les conducteurs quittent la feuille par des <b>reports de folio</b> (les petites flèches en bord de page). On retrouve la même flèche en entrée de la feuille suivante. C’est ce qui découpe le dossier : arrivée f. 1, commande f. 2, puissance f. 3. C’est aussi ce qui donne au repère son premier chiffre.</li></ul>
   <h3>Étape 4 · alimenter la commande en 24 V</h3>
   <div class="figure">${feuille1SVG()}</div>
   <p>La commande a sa propre alimentation, abaissée par le transformateur ${rp('-1T7D')} (230 V au primaire, 24 V au secondaire). L’opérateur ne manœuvre plus qu’une très basse tension, la commande reste indépendante de la puissance, et on peut la protéger pour elle-même : ${rp('-1Q7C')} (6 A) protège le <b>primaire</b>, ${rp('-1Q7E')} (2 A) protège le <b>secondaire</b>.</p>
   ${piege('Un seul disjoncteur ne suffirait pas. Celui du primaire est calibré pour le transformateur et ne verrait pas un défaut léger au secondaire ; celui du secondaire est calibré pour les quelques centaines de milliampères de la commande.','Une protection de chaque côté, deux calibres différents')}
   <h3>Étape 7 · le circuit de puissance</h3>
   <p>La puissance se lit de haut en bas et se trace d’un trait plus épais. Les organes s’y succèdent dans un ordre imposé : le disjoncteur-moteur ${rp('-3Q4C')} en tête (il sépare et protège du court-circuit tout ce qui suit), les contacts principaux du contacteur (1-2, 3-4, 5-6), le relais thermique ${rp('-3F4E')} au plus près du moteur (il surveille le courant que le moteur absorbe vraiment), puis le moteur ${rp('-3M4H')} avec ses bornes U1, V1, W1 et sa masse.</p>
   ${schbox('d9sch','Un seul sens. Démarre, puis fais déclencher le thermique -3F4E. Retire ensuite son contact 95-96 de la commande : le thermique déclenche, et le moteur continue à tourner.')}
   ${regle('Le relais thermique ne coupe pas la puissance lui-même : il agit par son <b>contact 95-96</b>, à ouverture, placé dans la chaîne de coupures de la commande. Oublie ce contact, et la surcharge n’arrête rien.','Le thermique agit par la commande')}
   ${exbox('d9sbox','Commande ou puissance ?')}
   ${exbox('d9obox','L’ordre des organes de puissance','De la ligne L1 L2 L3 vers le moteur.')}
   ${exbox('d9banc','Au Banc de câblage : démarrage direct avec auto-maintien','Niveau 1 : puissance puis commande.')}`,
  mount:root=>{
    schemaW(box(root,'d9sch'),{c:o=>[ARR(),...(o.noth?[]:[TH()]),{par:[[MAR_D()],[MT_D()]]},BOB_D()], rails:R24, puiss:{mode:'direct',km:['KM3H'],f:'F4E'}, toggles:[{id:'noth',lbl:'Oublier le contact 95-96 du thermique'}]});
    mountSortW(box(root,'d9sbox'),'d9srt',{cats:[['c','Commande'],['p','Puissance']],items:[['Trait fin','c'],['400 V triphasé','p'],['Bobine A1-A2 de -2KM3H','c'],['Contacts 1-2, 3-4, 5-6 de -2KM3H','p'],['Contact 13-14 d’auto-maintien','c'],['Disjoncteur-moteur -3Q4C','p'],['Contact 95-96 de -3F4E','c'],['Moteur -3M4H','p']],ok:'Juste. Le même contacteur est dans les deux : sa bobine et ses auxiliaires en commande, ses contacts principaux en puissance.'});
    mountOrderW(box(root,'d9obox'),'d9ord',{items:['Disjoncteur-moteur -3Q4C','Contacts principaux de -2KM3H','Relais thermique -3F4E','Moteur -3M4H'],ok:'Juste : protection contre le court-circuit, commutation, protection thermique, récepteur.'});
    defi(root,'d9banc','direct',1,'Démarrage direct avec auto-maintien');
  }},
 {id:'d10', sec:'Dessin 7', t:'La signalisation', quiz:['d10q1','d10q2'], ex:{keys:['d10srt', defiKey('banc','direct',2)], lbl:'Voyants · Banc niveau 2'},
  body:()=>`<p class="lead">Un voyant dit à l’opérateur ce que fait la machine : sous tension, en marche dans un sens, en défaut. Il se dessine dans le circuit de commande, avec les mêmes règles que n’importe quel récepteur.</p>
   <ul class="ctrlq"><li><b>Classe H</b> (convention de l’école) : ${rp('-2H5H')}. Ses bornes sont <b>X1-X2</b>.</li><li>Un voyant est un <b>récepteur</b> : seul, en fin de sa propre branche, en parallèle avec les autres.</li><li>Il est piloté par un <b>contact auxiliaire libre</b> : 23-24 du contacteur pour « marche », 97-98 du relais thermique pour « défaut ». Le voyant « sous tension » est simplement branché entre les deux lignes, après -1Q7E.</li><li>Chaque contact ajouté se reporte dans les <b>références croisées</b> sous la bobine : -2KM3H porte maintenant 2-E4, 2-x pour le contact 23-24, et 3-E4.</li></ul>
   ${schbox('d10sch','Un sens de marche avec ses voyants. Démarre, arrête, fais déclencher le thermique.')}
   ${erreur('Le voyant en série avec la bobine : la bobine et le voyant se partagent la tension, aucun ne fonctionne, et un voyant grillé arrête la machine. Coche l’option sous le schéma pour le voir.','L’erreur à repérer')}
   ${exbox('d10box','Bien placé ou fautif ?')}
   ${exbox('d10banc','Au Banc de câblage : démarrage direct avec voyants','Niveau 2 : les composants sont à disposer, puis à câbler.')}
   ${verif('Chaque voyant est-il seul sur sa branche ? Est-il piloté par un contact auxiliaire libre, et ce contact apparaît-il dans les références croisées sous la bobine ?')}`,
  mount:root=>{
    schemaW(box(root,'d10sch'),{c:o=>[{par:[
        [{k:'lamp',o:'H1',r:'-2H2H',t:'Sous tension'}],
        o.serie?[ARR(),TH(),{par:[[MAR_D()],[MT_D()]]},{k:'lamp',o:'H5',r:'-2H5H',t:'Marche'},BOB_D()]:[ARR(),TH(),{par:[[MAR_D()],[MT_D()]]},BOB_D()],
        ...(o.serie?[]:[[ct('no','KM3H','-2KM3H',['23','24'],'Signal marche','km'),{k:'lamp',o:'H5',r:'-2H5H',t:'Marche'}]]),
        [ct('no','F4E','-3F4E',['97','98'],'Signal défaut','km'),{k:'lamp',o:'H6',r:'-2H6H',t:'Défaut'}]]}],
      rails:R24, toggles:[{id:'serie',lbl:'Erreur : voyant de marche en série avec la bobine'}],
      status:st=>st.opt.serie&&st.rec.has('KM3H')?'<span style="color:var(--bad)"><b>Bobine et voyant en série</b> : chacun ne reçoit qu’une partie des 24 V. En vrai, rien ne fonctionne correctement.</span>':st.rec.size?[...st.rec].map(o=>({H1:'-2H2H sous tension',H5:'-2H5H marche',H6:'-2H6H défaut',KM3H:'-2KM3H collé'})[o]).filter(Boolean).join(' · '):''});
    mountSortW(box(root,'d10box'),'d10srt',{cats:[['b','Bien placé'],['f','Fautif']],items:[['Voyant de marche piloté par le contact 23-24 de -2KM3H, sur sa propre branche','b'],['Voyant de marche en série avec la bobine -2KM3H','f','La tension se partage et le voyant grillé arrête la machine.'],['Voyant de défaut piloté par le contact 97-98 de -3F4E','b'],['Voyant de défaut piloté par le contact 95-96 de -3F4E','f','95-96 est fermé au repos : le voyant « défaut » serait allumé sans défaut.'],['Voyant « sous tension » branché entre L+ 24 V et 0 V après -1Q7E','b'],['Voyant de marche piloté par le contact 13-14 déjà utilisé pour l’auto-maintien','f','On prend un contact auxiliaire libre : 23-24.']],ok:'Juste : un voyant, sa branche, son contact auxiliaire libre.'});
    defi(root,'d10banc','direct',2,'Démarrage direct, voyants de marche et de défaut');
  }},
], {
  d6q1:{q:'Sur le schéma au repos, comment apparaît un bouton d’arrêt ?',o:['Ouvert','Fermé, car c’est un contact à ouverture','Ça dépend de l’état de la machine'],g:1,e:'Le schéma est dessiné au repos : un contact à ouverture y apparaît fermé.',r:'d6'},
  d6q2:{q:'Un contact porte les bornes 43-44. Qu’est-ce que c’est ?',o:['Le 4e contact, à fermeture','Le 4e contact, à ouverture','Une bobine'],g:0,e:'Premier chiffre : numéro d’ordre (4). Second chiffre 3-4 : à fermeture.',r:'d6'},
  d7q1:{q:'Deux contacts NC en série : quand la bobine est-elle alimentée ?',o:['Quand les deux organes sont actionnés','Seulement quand les deux organes sont au repos','Quand un seul est actionné'],g:1,e:'NON-OU : un seul organe actionné suffit à couper. C’est la chaîne de sécurité.',r:'d7'},
  d7q2:{q:'Un collègue ajoute un second bouton d’arrêt en parallèle sur le premier. Qu’en penses-tu ?',o:['C’est bien : deux arrêts valent mieux qu’un','C’est une faute grave : aucun des deux n’arrête seul la machine','C’est égal'],g:1,e:'Deux NC en parallèle font un NON-ET : il faudrait appuyer sur les deux pour arrêter. Un second arrêt se monte en série.',r:'d7'},
  d8q1:{q:'Où se raccorde le contact d’auto-maintien ?',o:['En parallèle sur les bornes du bouton de marche','En parallèle sur le bouton d’arrêt','En série avec la bobine'],g:0,e:'Toujours aux bornes d’un organe de commande, jamais à celles d’un organe de coupure.',r:'d8'},
  d8q2:{q:'Le réseau disparaît, puis revient. Que fait la machine à auto-maintien ?',o:['Elle redémarre toute seule','Elle reste à l’arrêt jusqu’au prochain appui sur marche','Elle tourne dans l’autre sens'],g:1,e:'La bobine est retombée et le contact de maintien s’est ouvert : rien ne tient plus le circuit. C’est la protection contre le redémarrage intempestif.',r:'d8'},
  d9q1:{q:'Pourquoi protège-t-on le transformateur de commande des deux côtés ?',o:['Pour faire joli','Parce que la protection du primaire ne verrait pas un petit défaut au secondaire','Parce que la norme impose deux disjoncteurs identiques'],g:1,e:'Les deux calibres diffèrent parce qu’ils ne protègent pas la même chose : 6 A au primaire, 2 A au secondaire.',r:'d9'},
  d9q2:{q:'Que représente une petite flèche en bord de feuille ?',o:['Un report de folio : le potentiel continue sur une autre feuille','Le sens du courant','Une borne de terre'],g:0,e:'On retrouve la même flèche, au même endroit, en entrée de la feuille suivante.',r:'d9'},
  d9q3:{q:'Le conducteur PE peut-il passer par un contact du disjoncteur-moteur ?',o:['Oui, pour couper la terre en même temps','Non, il ne traverse aucun organe de coupure','Oui, s’il est vert-jaune'],g:1,e:'Une machine dont la terre est ouverte est dangereuse au premier défaut.',r:'d9'},
  d10q1:{q:'Quel contact pilote le voyant de défaut thermique ?',o:['95-96 de -3F4E','97-98 de -3F4E','13-14 de -2KM3H'],g:1,e:'97-98 est à fermeture : il se ferme quand le thermique déclenche. 95-96, lui, coupe la commande.',r:'d10'},
  d10q2:{q:'Quelle est la classe de repère d’un voyant ?',o:['H','V','L'],g:0,e:'Convention de l’école : H, avec ses bornes X1-X2.',r:'d10'},
}, [{t:'Tracer une branche de commande avec auto-maintien, puis la puissance d’un démarrage direct, au format -2S3E.', cap:'d8'},{t:'Ajouter la signalisation : un voyant par branche, piloté par un contact auxiliaire libre.', cap:'d10'}],
   [['Dans quel ordre place-t-on les appareils d’une branche de commande ?','d8'],['Pourquoi protège-t-on un transformateur de commande au primaire et au secondaire ?','d9']]);

/* =========================================================
   2.5 — Dessin 8 à 10 : sécurité positive, verrouillage, la feuille complète
   ========================================================= */
addDessin('2.5', [
 {id:'e8', sec:'Dessin 8', t:'La sécurité positive : tout ce qui arrête est à ouverture', quiz:['e8q1','e8q2'], ex:{keys:['e8srt', defiKey('banc','mn',1)], lbl:'NO ou NC · Banc'},
  body:()=>`<p class="lead">Un bouton d’arrêt est câblé en contact à ouverture : au repos il laisse passer le courant, et c’est l’appui qui l’interrompt. Cela paraît inversé la première fois. C’est pourtant le seul choix acceptable.</p>
   <p>Imagine que le fil du bouton d’arrêt se casse, ou que le contact s’oxyde. Avec un contact NC, le circuit s’ouvre : la machine s’arrête toute seule. On perd la production, on ne perd personne. Avec un contact NO, la même rupture rendrait le bouton d’arrêt totalement inopérant, et <b>personne ne s’en apercevrait tant que quelqu’un n’en aurait pas besoin</b>.</p>
   ${schbox('e8sch','Démarre, puis coche « fil cassé » : avec un arrêt à ouverture, la machine s’arrête d’elle-même. La panne se voit tout de suite.')}
   ${regle('Tout ce qui doit <b>arrêter</b> est câblé en contact à ouverture : arrêt d’urgence, arrêt normal, contacts de porte et de capot, fin de course de sécurité, contact de défaut du relais thermique (95-96). La défaillance du composant ou de son câblage doit conduire à l’arrêt, jamais au maintien en marche.','La règle de la sécurité positive')}
   <p>Les coupures se montent en série, en tête : c’est un NON-OU. <b>Chacune garde à elle seule le pouvoir de couper.</b></p>
   ${exbox('e8box','Contact à fermeture ou à ouverture ?','Pour chaque fonction, le bon type de contact.')}
   ${exbox('e8banc','Au Banc de câblage : disjoncteur-moteur avec bobine à minimum de tension','Niveau 1. La bobine MN, alimentée à travers l’arrêt d’urgence, est elle aussi une sécurité positive.')}`,
  mount:root=>{
    schemaW(box(root,'e8sch'),{c:[AU(),{...ARR(),brk:'casse'},TH(),{par:[[MAR_D()],[MT_D()]]},BOB_D()], rails:R24, toggles:[{id:'casse',lbl:'Fil cassé sur l’arrêt -2S3D'}], status:st=>st.opt.casse?'<b>Fil cassé</b> : la branche est ouverte, la machine ne peut pas tourner. C’est le bon sens de la panne.':st.coil.KM3H?'<b>-2KM3H collé</b>.':'<span class="muted">Au repos.</span>'});
    mountSortW(box(root,'e8box'),'e8srt',{cats:[['no','NO · à fermeture'],['nc','NC · à ouverture']],items:[['Arrêt d’urgence','nc'],['Arrêt normal','nc'],['Contact de capot de protection','nc'],['Fin de course de sécurité','nc'],['Défaut du relais thermique dans la commande (95-96)','nc'],['Bouton de marche','no'],['Contact d’auto-maintien','no'],['Contact qui allume le voyant de marche','no']],ok:'Juste. Ce qui arrête : NC. Ce qui donne un ordre : NO.'});
    defi(root,'e8banc','mn',1,'Disjoncteur-moteur avec bobine MN');
  }},
 {id:'e9', sec:'Dessin 9', t:'Le second sens et le verrouillage', quiz:['e9q1','e9q2','e9q3'], ex:{keys:['e9srt', defiKey('banc','inv',2)], lbl:'Deux sens · Banc niveau 2'},
  body:()=>`<p class="lead">Le tapis doit tourner dans les deux sens. On ajoute une seconde branche, construite exactement comme la première : marche ${rp('-2S6E')}, auto-maintien de ${rp('-2KM6H')}, fin de course ${rp('-2S6G')}, bobine ${rp('-2KM6H')}. Les coupures communes restent <b>en amont</b> de la dérivation : elles arrêtent les deux sens à la fois.</p>
   <p>Les deux contacteurs alimentent le moteur avec <b>deux phases croisées</b>. S’ils collaient en même temps, ils mettraient deux phases en court-circuit franc. On place donc, dans chaque branche, un <b>contact à ouverture de l’autre contacteur</b> : -2KM6H dans la branche du sens droit, -2KM3H dans celle du sens gauche, juste après le groupe marche / maintien et avant le fin de course. C’est le <b>verrouillage électrique</b>.</p>
   ${schbox('e9sch','Démarre dans un sens, puis essaie l’autre : il refuse. Coche « retirer le verrouillage », démarre un sens puis l’autre.')}
   ${regle('Parce qu’il doit <b>interdire</b>, pas autoriser. Tant que l’autre contacteur est retombé, la branche est libre ; dès qu’il colle, elle est coupée. Et si le fil du verrouillage se casse, la branche reste coupée : c’est encore la sécurité positive.','Pourquoi le verrouillage se fait par un contact à ouverture')}
   ${piege('Pour inverser le sens d’un moteur triphasé, il suffit de permuter <b>deux</b> phases ; en permuter trois revient à ne rien changer. Sur le schéma de puissance, on voit deux conducteurs se croiser entre les deux contacteurs : c’est exactement cela. Et c’est la raison pour laquelle ils ne doivent jamais coller ensemble.','Deux phases croisées, pas trois')}
   ${regle('Sur le convoyeur, -2S3B, -2S3C et -2S3D sont <b>avant</b> la dérivation : ils arrêtent les deux sens. Le fin de course -2S3G est <b>dans</b> la branche du sens droit : il n’arrête que ce sens. C’est la position dans le schéma, et elle seule, qui dit ce qu’un organe arrête, pas son nom.','Coupures communes et coupures propres')}
   ${exbox('e9box','Où se trouve chaque organe ?')}
   ${exbox('e9banc','Au Banc de câblage : inversion du sens de marche','Niveau 2 : dispose les composants, puis câble l’auto-maintien et le verrouillage.')}`,
  mount:root=>{
    schemaW(box(root,'e9sch'),{c:[AU(),CORDE(),ARR(),TH(),{par:[[{par:[[MAR_D()],[MT_D()]]},VR_D(),FC_D(),BOB_D()],[{par:[[MAR_G()],[MT_G()]]},VR_G(),FC_G(),BOB_G()]]}], rails:R24, puiss:{mode:'inv',km:['KM3H','KM6H'],f:'F4E'}, toggles:[{id:'nolock',lbl:'Retirer le verrouillage'}]});
    mountSortW(box(root,'e9box'),'e9srt',{cats:[['c','Commun aux deux sens'],['d','Sens droit'],['g','Sens gauche']],items:[['Arrêt d’urgence -2S3B','c'],['Arrêt -2S3D','c'],['Marche -2S6E','g'],['Fin de course -2S3G','d'],['Contact NC de -2KM6H (verrouillage)','d','Il interdit le sens droit quand le sens gauche est collé.'],['Contact NC de -2KM3H (verrouillage)','g'],['Contact 13-14 de -2KM6H (maintien)','g'],['Contact 95-96 du thermique -3F4E','c']],ok:'Juste : les coupures communes en amont de la dérivation, le reste dans chaque branche.'});
    defi(root,'e9banc','inv',2,'Inversion du sens de marche');
  }},
 {id:'e10', sec:'Dessin 10', t:'Numéroter, repérer, rendre une feuille complète', quiz:['e10q1','e10q2'], ex:{keys:['e10dr','e10srt'], lbl:'Potentiels · minimum'},
  body:()=>`<p class="lead">Le numéro de fil ne numérote pas un morceau de cuivre : il <b>numérote un potentiel</b>. Toutes les bornes reliées entre elles sans traverser aucun appareil portent le même numéro, écrit sur une bague à chaque extrémité de chaque conducteur concerné. C’est ce qui rend la machine dépannable.</p>
   ${schbox('e10sch','Clique sur un fil : tous les fils du même potentiel s’allument, et ils portent le même numéro. Les numéros sont un exemple de numérotation dans l’ordre du tracé.')}
   ${regle('Il n’existe pas de point de raccordement flottant au milieu d’un fil : <b>toute dérivation se fait sur une borne</b>. <b>Deux conducteurs par borne au maximum</b> ; au-delà, on passe par un bornier et une barrette de pontage. On numérote <b>quand le tracé est figé</b>, jamais avant.','Les règles de la numérotation')}
   <h3>Le minimum obligatoire sur une feuille</h3>
   ${tbl(['Élément','Ce qu’il contient','S’il manque…'],[['Le cartouche','Établissement, machine, objet de la feuille, auteur, classe, date, folio, indice','On ne sait pas de quelle machine il s’agit, ni si la feuille est à jour.'],['Le numéro de folio','« 2 / 3 » : la place de la feuille dans le dossier','Une feuille égarée ne retrouve jamais son dossier.'],['Les symboles normalisés','Ceux de la planche IEC de ton cours (point 2.1.8), et aucun autre','Chacun dessine son propre langage.'],['Les repères d’appareil','À gauche du symbole : -1Q7C, -2S3B, -2KM3H…','Impossible de relier la commande à la puissance.'],['Le repérage des bornes','À droite du symbole : 1-2, 13-14, 95-96, A1-A2, U-V-W','On sait quels appareils sont reliés, pas par quelles bornes.'],['Les numéros de fil','Un numéro par potentiel, sur une bague aux deux bouts','Un faisceau de quarante fils gris devient illisible.'],['L’alimentation et les protections','L’arrivée, sa tension, le calibre des protections','On ne peut ni dimensionner, ni vérifier, ni consigner.']])}
   <p>Le cartouche se place <b>en bas à droite</b> de chaque feuille et se remplit en entier : l’<b>indice</b> (A, B, C…) dit quelle version du schéma on a en main. Les feuilles se numérotent 1 / 3, 2 / 3, 3 / 3.</p>
   ${verif('<ol style="margin:4px 0 0 18px"><li>Chaque branche part-elle de L et arrive-t-elle à N ?</li><li>Un seul récepteur par branche, en fin de branche ?</li><li>Toutes les coupures en série et en tête ?</li><li>L’auto-maintien aux bornes de la marche, pas d’un arrêt ?</li><li>Tout ce qui arrête est-il à ouverture ?</li><li>Chaque appareil : repère à gauche, bornes à droite ?</li><li>Tous les fils numérotés, chaque dérivation sur une borne ?</li></ol>')}
   <div class="note"><b>Le test qui ne trompe pas</b>Donne ta feuille à un camarade qui n’a pas participé au dessin et demande-lui de câbler. S’il doit te poser une seule question, il manque une information sur le schéma.</div>
   ${exbox('e10dbox','Combien de potentiels ?','Sur le schéma ci-dessous (sans les numéros), compte les numéros de fil nécessaires.')}
   ${exbox('e10sbox','Recevable ou pas ?','Une feuille est rendue avec… ou sans… : est-ce obligatoire ?')}`,
  mount:root=>{
    schemaW(box(root,'e10sch'),{c:ONEWAY({corde:true,fdc:true,th:true}), rails:R24, num:true});
    const spec={c:[AU(),ARR(),TH(),{par:[[MAR_D()],[MT_D()]]},VR_D(),FC_D(),BOB_D()], rails:R24};
    const n=Object.keys(schemaSVG({...spec,num:true},null,{static:true}).nodes).filter(k=>k!=='L'&&k!=='N').length;
    const b=box(root,'e10dbox'); b.insertAdjacentHTML('beforebegin', `<div class="figure sch-mini" style="margin-top:0">${schemaSVG(spec,null,{static:true,fit:true}).svg}</div>`);
    mountDrillW(b,'e10dr',{rows:[{q:'Nombre de potentiels entre les deux lignes, sans compter L+ 24 V et 0 V',unit:'',ans:n,tol:0,abs:0.01,hint:'Un nouveau numéro après chaque appareil ; la marche et son maintien aboutissent au même potentiel.'}],ok:`Juste : ${n} potentiels, donc ${n} numéros de fil.`});
    mountSortW(box(root,'e10sbox'),'e10srt',{cats:[['o','Obligatoire'],['n','Pas obligatoire']],items:[['Le cartouche complet','o'],['Le numéro de folio « 2 / 3 »','o'],['Les numéros de borne à droite des symboles','o'],['Un numéro par potentiel','o'],['Le calibre des protections','o'],['La couleur du stylo','n'],['La marque du moteur','n'],['L’indice de révision dans le cartouche','o']],ok:'Juste. Sans un seul de ces éléments, ce n’est pas un schéma : c’est un croquis.'});
  }},
], {
  e8q1:{q:'Le fil du bouton d’arrêt (NC) se casse. Que se passe-t-il ?',o:['La machine s’arrête : on s’en aperçoit tout de suite','La machine continue et l’arrêt ne marche plus','Rien du tout'],g:0,e:'C’est la sécurité positive : la défaillance conduit à l’arrêt.',r:'e8'},
  e8q2:{q:'Pourquoi un arrêt câblé en contact à fermeture est-il dangereux ?',o:['Il use le bouton','Un fil cassé le rend inopérant, sans que personne ne s’en aperçoive','Il consomme plus'],g:1,e:'On découvrirait la panne le jour où quelqu’un a besoin d’arrêter la machine.',r:'e8'},
  e9q1:{q:'Comment inverse-t-on le sens d’un moteur triphasé ?',o:['En permutant deux phases','En permutant les trois phases','En inversant N et PE'],g:0,e:'Permuter trois phases revient à ne rien changer.',r:'e9'},
  e9q2:{q:'Dans la branche du sens droit, quel contact assure le verrouillage ?',o:['Un contact NO de -2KM3H','Un contact NC de -2KM6H','Un contact NC de -2KM3H'],g:1,e:'Le contact à ouverture de l’autre contacteur : dès que -2KM6H colle, il coupe la branche du sens droit.',r:'e9'},
  e9q3:{q:'Le fin de course -2S3G arrête…',o:['Les deux sens','Seulement le sens droit, car il est dans la branche du sens droit','Le transformateur'],g:1,e:'C’est sa position dans le schéma qui le dit : dans la branche, il n’arrête que ce sens.',r:'e9'},
  e10q1:{q:'Que numérote un numéro de fil ?',o:['Chaque morceau de câble','Un potentiel : toutes les bornes reliées sans traverser d’appareil','Chaque appareil'],g:1,e:'On lit le numéro sur le schéma et on cherche la bague correspondante dans le faisceau.',r:'e10'},
  e10q2:{q:'Quand numérote-t-on les fils ?',o:['En premier, avant de tracer','Quand le tracé est figé','Pendant le câblage'],g:1,e:'Sinon, chaque modification oblige à tout renuméroter.',r:'e10'},
}, [{t:'Dessiner la commande et la puissance d’un démarrage deux sens, avec verrouillage électrique.', cap:'e9'},{t:'Numéroter les fils par potentiel et rendre une feuille complète (cartouche, folio, repères, bornes).', cap:'e10'}],
   [['Pourquoi tout ce qui arrête est-il un contact à ouverture ?','e8'],['Expliquer le verrouillage électrique d’un démarrage deux sens.','e9'],['Citer les sept éléments obligatoires d’une feuille de schéma.','e10']]);

/* =========================================================
   2.6 — Dessin 11 et 12 : lire un schéma inconnu ; bornier et implantation
   ========================================================= */
const PERC = () => [
  ct('nc','S2B','-2S2B',['11','12'],'Arrêt d’urgence','au',{zone:'sec'}),
  ct('nc','S2C','-2S2C',['11','12'],'Capot fermé','fdc',{zone:'sec'}),
  ct('nc','S2D','-2S2D',['11','12'],'Arrêt','bp',{zone:'arr'}),
  ct('nc','F4E','-3F4E',['95','96'],'Thermique','th',{zone:'sec'}),
  {par:[[ct('no','S2E','-2S2E',['13','14'],'Marche','bp',{zone:'mar'})],[ct('no','KM2G','-2KM2G',['13','14'],'Maintien','km',{zone:'mar'})]]},
  ct('nc','S2F','-2S2F',['11','12'],'Fin de course broche','fdc',{zone:'aut'}),
  {k:'bob',o:'KM2G',r:'-2KM2G',x:['2-E2','3-C3'],zone:'bob'} ];
const ZONES=[['sec','Arrêt de sécurité'],['arr','Arrêt manuel'],['mar','Marche et auto-maintien'],['aut','Arrêt automatique'],['bob','Bobine et références croisées']];
addDessin('2.6', [
 {id:'f5', sec:'Dessin 11', t:'Lire un schéma que tu n’as pas dessiné', quiz:['f5q1'], ex:{keys:['f5ord','f5srt'], lbl:'Méthode · cinq zones'},
  body:()=>`<p class="lead">Devant une machine en panne, on a la feuille et on n’a pas le temps : il faut retrouver la fonction de chaque zone avant de chercher le défaut. Voici la méthode, sur une machine que tu ne connais pas : une perceuse à colonne.</p>
   <ol class="ctrlq"><li><b>Repérer l’alimentation</b> : d’où vient le courant, sous quelle tension, protégé par quoi. Toujours en tête de feuille.</li><li><b>Découper la branche en zones</b> : les coupures, les ordres, le récepteur. L’ordre est toujours le même.</li><li><b>Nommer chaque coupure</b> : arrêt d’urgence, arrêt de sécurité, arrêt manuel, arrêt automatique. Elles ne se dépannent pas de la même façon.</li><li><b>Suivre les repères</b> d’une feuille à l’autre, avec les références croisées.</li><li><b>Refaire le fonctionnement par la pensée</b>, une action à la fois, en partant du schéma au repos.</li></ol>
   <div class="figure"><div class="ctrls" style="margin:0 0 8px" id="f5z"></div><div id="f5sch"></div></div>
   ${tbl(['Zone','Ce qu’on y trouve','La question à se poser'],[['Arrêt de sécurité','L’arrêt d’urgence et les arrêts de sécurité, en tête et en série','Un seul d’entre eux coupe-t-il bien toute la branche ?'],['Arrêt manuel','Le bouton d’arrêt normal','Est-il à ouverture, et placé avant les ordres de marche ?'],['Marche et auto-maintien','Le bouton de marche et, en parallèle sur ses bornes, un contact du contacteur','L’auto-maintien est-il raccordé au bouton de marche, et pas à un arrêt ?'],['Arrêt automatique','Les coupures propres à une branche : fin de course','N’arrête-t-elle que sa branche, ou toutes ?'],['Bobine et références croisées','Le récepteur, seul, et la liste des cases où se trouvent ses contacts','Où sont ses contacts, et à quoi servent-ils ?']])}
   ${exbox('f5obox','La méthode, dans l’ordre')}
   ${exbox('f5sbox','À quelle zone appartient chaque organe de la perceuse ?')}`,
  mount:root=>{
    const st=schemaW(box(root,'f5sch'),{c:PERC(), rails:['L+ 24 V','0 V'], aria:'Schéma de commande de la perceuse à colonne'});
    const z=box(root,'f5z'); const drawZ=()=>{ z.innerHTML=`<span class="small muted">Montre la zone :</span> <div class="seg">${ZONES.map(([k,l])=>`<button class="${st.zone===k?'on':''}" data-zn="${k}">${l}</button>`).join('')}</div>`; z.querySelectorAll('[data-zn]').forEach(b=>b.onclick=()=>{ st.zone=st.zone===b.dataset.zn?null:b.dataset.zn; st.repaint(); drawZ(); }); }; drawZ();
    mountOrderW(box(root,'f5obox'),'f5ord',{items:['Repérer l’alimentation','Découper la branche en zones','Nommer chaque coupure','Suivre les repères d’une feuille à l’autre','Refaire le fonctionnement par la pensée'],ok:'Juste. Toujours dans cet ordre, sur n’importe quelle machine.'});
    mountSortW(box(root,'f5sbox'),'f5srt',{cats:ZONES.map(([k,l])=>[k,l]),items:[['-2S2B arrêt d’urgence','sec'],['-2S2C capot fermé','sec','Un capot ouvert doit arrêter : c’est un arrêt de sécurité.'],['-2S2D arrêt','arr'],['-2S2E marche','mar'],['-2KM2G 13-14','mar'],['-2S2F fin de course de la broche','aut'],['Bobine -2KM2G, 2-E2 · 3-C3','bob']],ok:'Juste : chaque zone a sa fonction, et sa manière de se dépanner.'});
  }},
 {id:'f6', sec:'Dessin 12', t:'Du schéma à l’armoire : bornier et implantation', quiz:['f6q1','f6q2'], ex:{keys:['f6srt','f6imp', defiKey('banc','porteb',1)], lbl:'Bornier, implantation · Banc'},
  body:()=>`<p class="lead">Le schéma dit ce qui est relié. Il reste à dire <b>où</b> : dans l’armoire, sur le pupitre, sur la machine. Deux documents s’en chargent : le plan de bornier et le plan d’implantation.</p>
   <h3>Le bornier</h3>
   <ul class="ctrlq"><li>Le bornier est un appareil comme un autre : <b>classe X</b>, repère ${rp('-X1')}. Une borne précise se note <b>-X1:5</b> (bornier -X1, borne 5).</li><li>Il sépare l’<b>armoire</b> de la <b>partie opérative</b>. Passent par le bornier tous les fils qui sortent de l’armoire : boutons en façade du pupitre, fins de course, interrupteur à corde, moteur. Les appareils posés sur le rail (contacteurs, relais thermique, disjoncteurs, transformateur) restent à l’intérieur.</li><li><b>Le numéro de fil ne change pas</b> en traversant le bornier : le potentiel est le même des deux côtés. La bague porte le numéro du fil ; la borne porte son propre numéro.</li></ul>
   ${tbl(['Borne','Fil','Côté armoire','Côté machine'],[['-X1:1','6','Sortie du groupe marche / maintien de -2KM3H','-2S3G borne 11 (fin de course, sur le tapis)'],['-X1:2','7','-2KM3H borne A1','-2S3G borne 12'],['-X1:3','U1','-3F4E borne 2','-3M4H borne U1'],['-X1:4','V1','-3F4E borne 4','-3M4H borne V1'],['-X1:5','W1','-3F4E borne 6','-3M4H borne W1'],['-X1:6','PE','Barre PE de l’armoire','Masse du moteur -3M4H']])}
   <p class="small muted">Exemple de plan de bornier pour le sens droit : les numéros 6 et 7 sont ceux du schéma de la capsule « Numéroter » (Dessin 10).</p>
   <h3>Le plan d’implantation</h3>
   <p>C’est une vue de face de l’armoire et du pupitre, avec chaque appareil placé et <b>repéré</b>, souvent à main levée. Il doit être cohérent avec le schéma : <b>le même repère relie le schéma, l’implantation et l’étiquette collée sur l’appareil</b>.</p>
   <div class="figure">${implantSVG()}<div class="figcap">Implantation du convoyeur : rails, goulottes et bornier -X1 dans l’armoire ; coup-de-poing et boutons sur le pupitre.</div></div>
   ${exbox('f6sbox','Ce fil passe-t-il par le bornier ?')}
   ${exbox('f6ibox','Où se trouve l’appareil ?')}
   ${exbox('f6banc','Au Banc de câblage : porte automatique, câblage du bornier','Niveau 1.')}`,
  mount:root=>{
    mountSortW(box(root,'f6sbox'),'f6srt',{cats:[['o','Par le bornier'],['n','Reste dans l’armoire']],items:[['Le fil vers le fin de course -2S3G','o'],['Les trois phases vers le moteur -3M4H','o'],['Le PE vers la masse du moteur','o'],['Le fil vers le bouton de marche en façade du pupitre','o'],['Le fil entre -2KM3H et -3F4E','n'],['Le fil entre -1T7D et -1Q7E','n'],['Le fil vers l’interrupteur à corde -2S3C','o'],['Le contact de maintien 13-14 vers la bobine A1 de -2KM3H','n']],ok:'Juste : tout ce qui sort de l’armoire passe par -X1.'});
    mountSortW(box(root,'f6ibox'),'f6imp',{cats:[['a','Armoire'],['p','Pupitre'],['m','Machine']],items:[['-2KM6H','a'],['-2S3B','p'],['-3M4H','m'],['-1T7D','a'],['-2S3E','p'],['-2S6G','m'],['-X1','a'],['-2S3C (corde)','m']],ok:'Juste. Le repère est le même sur le schéma, sur le plan et sur l’étiquette.'});
    defi(root,'f6banc','porteb',1,'Porte automatique · câblage du bornier');
  }},
], {
  f5q1:{q:'Devant un schéma inconnu, par quoi commences-tu ?',o:['Par chercher le moteur','Par repérer l’alimentation : d’où vient le courant, sous quelle tension, protégé par quoi','Par compter les fils'],g:1,e:'L’alimentation est toujours en tête de feuille. Ensuite seulement, on découpe en zones.',r:'f5'},
  f6q1:{q:'Que désigne -X1:5 ?',o:['Le 5e fil du schéma','La borne 5 du bornier -X1','Un contact de -X1 de 5 A'],g:1,e:'Classe X : bornier. Le numéro après les deux-points est celui de la borne.',r:'f6'},
  f6q2:{q:'Le fil 7 traverse le bornier. Quel numéro porte-t-il de l’autre côté ?',o:['8','7 : le potentiel ne change pas','Le numéro de la borne'],g:1,e:'Le numéro de fil désigne un potentiel. La borne a son propre numéro.',r:'f6'},
}, [{t:'Établir le plan de bornier et le plan d’implantation à partir du schéma.', cap:'f6'}],
   [['Quels fils passent par le bornier, et pourquoi ?','f6']]);

/* =========================================================
   2.7 — Dessin 13 : les schémas de liaison à la terre
   ========================================================= */
const REG=['TT','TN-S','TN-C','TN-C-S','IT'];
addDessin('2.7', [
 {id:'g7', sec:'Dessin 13', t:'Les schémas de liaison à la terre (régime du neutre)', quiz:['g7q1','g7q2'], ex:{keys:['g7srt'], lbl:'Identifier le régime'},
  body:()=>`<p class="lead">Le régime du neutre dit deux choses : comment le <b>neutre de la source</b> est relié à la terre, et comment les <b>masses</b> de l’installation sont reliées à la terre. La théorie (boucle de défaut, protection associée) est vue en électricité ; ici, on apprend à <b>le reconnaître en lisant le dessin de l’arrivée</b>.</p>
   ${tbl(['Lettre','Ce qu’elle dit'],[['1re lettre : T','Le neutre de la source est relié à la terre.'],['1re lettre : I','Le neutre est isolé de la terre, ou relié par une impédance.'],['2e lettre : T','Les masses sont reliées à une prise de terre locale.'],['2e lettre : N','Les masses sont reliées au neutre de la source, par le conducteur de protection.'],['C / S','En TN : conducteur PEN commun (C), ou N et PE séparés (S).']])}
   <div class="grid g2">${REG.map(r=>`<div class="figure" style="margin:6px 0"><b>${r}</b>${regimeSVG(r)}</div>`).join('')}<div class="figure" style="margin:6px 0"><b>Les symboles et les couleurs</b><p class="small" style="margin:6px 0 0">N : <b style="color:#2f6fd6">bleu</b>. PE : <b style="color:#2e9b4e">vert-jaune</b>, en trait interrompu. PEN : vert-jaune avec repères bleus aux extrémités. Terre : trois traits décroissants. CPI : contrôleur permanent d’isolement.</p></div></div>
   ${tbl(['Régime','Neutre','Masses','À retenir'],[['TT','À la terre côté réseau','Sur la prise de terre locale','N et PE séparés ; le PE part de la terre locale.'],['TN-S','À la terre','Au PE, qui vient de la source','Cinq conducteurs : L1 L2 L3 N PE.'],['TN-C','À la terre','Au PEN','Un seul conducteur PEN : on ne le coupe jamais.'],['TN-C-S','À la terre','Au PE, après la séparation','PEN, puis séparation en N et PE ; on ne les remélange jamais.'],['IT','Isolé ou par impédance','Sur la prise de terre locale','Un contrôleur permanent d’isolement surveille le premier défaut.']])}
   <div class="note"><b>Sur le convoyeur</b>L’arrivée de la feuille 1 est en 400 V + N + PE, avec N et PE séparés : c’est du TT ou du TN-S. C’est le <b>tableau divisionnaire</b> de l’atelier qui le dit, pas le convoyeur. Tant qu’on ne l’a pas vérifié, le schéma n’en impose aucun.</div>
   ${exbox('g7box','Quel régime ?','Regarde où va le neutre, et où vont les masses.')}`,
  mount:root=>{
    mountSortW(box(root,'g7box'),'g7srt',{cats:REG.map(r=>[r,r]),items:[[`Schéma A${regimeSVG('TN-C')}`,'TN-C','Un seul conducteur PEN jusqu’au récepteur.'],[`Schéma B${regimeSVG('IT')}`,'IT','Neutre isolé ou par impédance, CPI, masses sur une terre locale.'],[`Schéma C${regimeSVG('TT')}`,'TT','Neutre à la terre à la source, masses sur une autre prise de terre.'],[`Schéma D${regimeSVG('TN-C-S')}`,'TN-C-S','Le PEN se sépare en N et PE.'],[`Schéma E${regimeSVG('TN-S')}`,'TN-S','N et PE séparés depuis la source.']],ok:'Juste : tu sais identifier le régime en lisant l’arrivée.'});
  }},
], {
  g7q1:{q:'Que signifie la deuxième lettre T de « TT » ?',o:['Les masses sont reliées à une prise de terre locale','Le neutre est relié à la terre','La tension est triphasée'],g:0,e:'Première lettre : le neutre. Deuxième lettre : les masses.',r:'g7'},
  g7q2:{q:'Dans quel régime trouve-t-on un conducteur PEN ?',o:['TT','TN-C (et le début d’un TN-C-S)','IT'],g:1,e:'C pour « combiné » : la protection et le neutre dans un même conducteur.',r:'g7'},
}, [{t:'Identifier le régime du neutre (TT, TN-S, TN-C, TN-C-S, IT) en lisant le schéma d’arrivée.', cap:'g7'}]);

/* =========================================================
   2.8 — Dessin 14 : électrovanne et vérin dans le schéma électrique
   ========================================================= */
function verinSide(st){
  const r=st.rod||0, x=60+r*70;
  return `<svg viewBox="0 0 260 150" role="img" aria-label="Vérin et distributeur" style="max-width:300px;margin:0 auto">
    <text x="10" y="16" font-size="10" font-weight="700" fill="var(--muted)">Côté pneumatique</text>
    <rect x="20" y="40" width="110" height="36" rx="4" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/><rect x="${x-6}" y="42" width="8" height="32" fill="var(--steel)"/><rect x="${x+2}" y="54" width="${140-x+60}" height="8" fill="var(--iron)"/>
    <path d="M30 76 q-4 10 6 10" fill="none" stroke="var(--muted)"/><text x="75" y="96" text-anchor="middle" font-size="9" fill="var(--muted)">vérin simple effet</text>
    <rect x="198" y="34" width="22" height="16" fill="${(st.act.S6G)?'var(--amber-soft)':'var(--surface)'}" stroke="var(--ink)"/><text x="209" y="28" text-anchor="middle" font-size="9" font-weight="800">-2S6G</text>
    <rect x="30" y="110" width="44" height="26" fill="var(--surface)" stroke="var(--ink)"/><rect x="74" y="110" width="44" height="26" fill="var(--surface)" stroke="var(--ink)"/><rect x="118" y="114" width="16" height="18" fill="${st.coil.Y5H||st.rec&&st.rec.has('Y5H')?'var(--amber-soft)':'var(--surface)'}" stroke="var(--ink)"/><line x1="118" y1="132" x2="134" y2="114" stroke="var(--ink)"/>
    <text x="150" y="128" font-size="9" font-weight="800">-2Y5H</text><text x="150" y="140" font-size="8" fill="var(--muted)">distributeur 3/2</text>
    <line x1="52" y1="110" x2="40" y2="76" stroke="var(--muted)" stroke-dasharray="3 2"/>
  </svg>`;
}
addDessin('2.8', [
 {id:'h6', sec:'Dessin 14', t:'Électrovanne et vérin dans le schéma électrique', quiz:['h6q1','h6q2'], ex:{keys:['h6srt', defiKey('banc','e1',1)], lbl:'Classes Y, S, H · Banc'},
  body:()=>`<p class="lead">Une machine électropneumatique a deux schémas : le schéma pneumatique (vu dans un autre cours) et le schéma électrique. Ici, on dessine le <b>côté électrique</b>, et cette partie concerne <b>tous les élèves</b>.</p>
   <ul class="ctrlq"><li>La <b>bobine de distributeur</b> est un récepteur, comme une bobine de contacteur : <b>classe Y</b> (convention de l’école), ${rp('-2Y5H')}. Elle se place seule, en fin de branche, avec les mêmes règles.</li><li>Le <b>capteur de position</b> du vérin (fin de course) est un organe de commande ou de coupure, dans une branche de commande : ${rp('-2S6G')}.</li><li>Le <b>repère</b> fait le lien entre les deux schémas : la bobine -2Y5H du schéma électrique est celle du distributeur sur le schéma pneumatique. Même appareil, même repère.</li></ul>
   ${schbox('h6sch','Garde le doigt sur -2S5E : la bobine -2Y5H est alimentée, le distributeur bascule et le vérin sort. En fin de course, -2S6G se ferme et allume le voyant. Lâche : le ressort ramène le distributeur et la tige rentre.')}
   ${regle('Une bobine de distributeur est un récepteur : <b>jamais en série avec une autre bobine ou un voyant</b>. Elle porte ses références croisées comme une bobine de contacteur, et son repère se retrouve à l’identique sur le schéma pneumatique.','Mêmes règles qu’une bobine de contacteur')}
   ${exbox('h6box','Quelle classe de repère ?')}
   ${exbox('h6banc','Au Banc de câblage : électrovanne 3/2 et vérin simple effet','Niveau 1.')}`,
  mount:root=>{
    schemaW(box(root,'h6sch'),{c:[{par:[[ct('nc','S5D','-2S5D',['11','12'],'Arrêt','bp'),ct('no','S5E','-2S5E',['13','14'],'Sortie de tige','bp'),{k:'bob',o:'Y5H',r:'-2Y5H',y:true,x:['dist. 3/2']}],[ct('no','S6G','-2S6G',['13','14'],'Tige sortie','auto'),{k:'lamp',o:'H6',r:'-2H6H',t:'Tige sortie'}]]}], rails:['L+ 24 V','0 V'], side:verinSide,
      auto:(st,dt)=>{ const tg=st.rec&&st.rec.has('Y5H')?1:0, r0=st.rod||0; st.rod=Math.max(0,Math.min(1, r0+(tg?1:-1)*dt*0.9)); const a=st.rod>0.97; const ch=Math.abs(st.rod-r0)>1e-3 || a!==!!st.act.S6G; st.act.S6G=a; return ch; },
      status:st=>st.rec&&st.rec.has('Y5H')?'<b>-2Y5H alimentée</b> : la tige sort.':st.rod>0.02?'La tige rentre.':'<span class="muted">Tige rentrée.</span>'});
    mountSortW(box(root,'h6box'),'h6srt',{cats:[['Y','Y'],['KM','KM'],['S','S'],['H','H'],['X','X']],items:[['Bobine du distributeur 5/2','Y'],['Bobine de contacteur','KM'],['Fin de course « tige sortie »','S'],['Voyant « vérin en position »','H'],['Bornier de l’armoire','X'],['Bouton de sortie de tige','S']],ok:'Juste. Y pour la bobine de distributeur, S pour le capteur de position.'});
    defi(root,'h6banc','e1',1,'Électrovanne 3/2 et vérin simple effet');
  }},
], {
  h6q1:{q:'Où se place la bobine -2Y5H d’un distributeur dans la branche ?',o:['En tête de branche','Seule, en fin de branche, comme une bobine de contacteur','En série avec le voyant'],g:1,e:'C’est un récepteur : mêmes règles qu’une bobine de contacteur.',r:'h6'},
  h6q2:{q:'Comment sait-on que la bobine dessinée sur le schéma électrique est celle du distributeur du schéma pneumatique ?',o:['Par sa couleur','Par le repère : c’est le même sur les deux schémas','On ne peut pas le savoir'],g:1,e:'Un appareil, un repère, partout où il apparaît.',r:'h6'},
}, [{t:'Placer la bobine d’un distributeur (classe Y) et le capteur de position d’un vérin dans un schéma de commande.', cap:'h6'}]);

/* =========================================================
   2.9 — Dessin 15 : mettre à jour un schéma (as built), à main levée
   ========================================================= */
addDessin('2.9', [
 {id:'i6', sec:'Dessin 15', t:'Mettre à jour un schéma : « as built » et main levée', quiz:['i6q1','i6q2'], ex:{keys:['i6srt','i6ord'], lbl:'Où ajouter · marche à suivre'},
  body:()=>`<p class="lead">Le schéma « comme prévu » est celui du bureau d’études. Le schéma « <b>comme réalisé</b> » (as built) est celui qui décrit la machine telle qu’elle est, après tes modifications. Après une intervention, c’est toi qui le tiens à jour.</p>
   <h3>La marche à suivre</h3>
   <ul class="ctrlq"><li><b>Barrer proprement</b> ce qui disparaît : l’ancienne version doit rester lisible. On ne gomme jamais.</li><li><b>Ajouter</b> les nouveaux appareils avec leur repère, leurs bornes et leurs numéros de fil.</li><li><b>Renuméroter seulement ce qui change</b> : un nouveau potentiel reçoit un nouveau numéro, les autres gardent le leur.</li><li>Mettre à jour les <b>références croisées</b> sous les bobines concernées.</li><li>Changer l’<b>indice</b> et la <b>date</b> du cartouche (A → B), et transmettre au responsable.</li></ul>
   ${schbox('i6sch','Coche chaque modification : elle apparaît en vert, à sa place. Vérifie qu’elle fonctionne.')}
   ${regle('Même sans règle ni logiciel, un croquis de modification garde <b>tout ce qui rend un schéma lisible</b> : symboles normalisés, repères, numéros de borne et numéros de fil. Un croquis sans repères ne sert à rien au collègue qui passera après toi.','Le croquis à main levée')}
   ${tbl(['Modification sur le convoyeur','Comment on l’ajoute'],[['Un deuxième bouton d’arrêt','En série avec les autres coupures, en tête (NON-OU)'],['Un deuxième poste de marche','En parallèle sur la marche existante (OU)'],['Un voyant de défaut','Sur sa propre branche, piloté par 97-98 du thermique'],['Remplacer un fin de course NO par un NC','On barre l’ancien, on dessine le nouveau, on vérifie la sécurité positive']])}
   ${exbox('i6sbox','Comment ajouter cette modification ?')}
   ${exbox('i6obox','La mise à jour, dans l’ordre')}`,
  mount:root=>{
    schemaW(box(root,'i6sch'),{c:o=>[AU(),ARR(),...(o.arr2?[ct('nc','S4D','-2S4D',['11','12'],'Arrêt 2','bp',{nw:true})]:[]),TH(),
        {par:[[MAR_D()],[MT_D()],...(o.mar2?[[ct('no','S4E','-2S4E',['13','14'],'Marche 2','bp',{nw:true})]]:[])]},
        ...(o.fdc?[ct('no','S3G','-2S3G',['13','14'],'Fin de course (ancien)','fdc',{del:true}),ct('nc','S3G','-2S3G',['11','12'],'Fin de course NC','fdc',{nw:true})]:[FC_D()]), BOB_D()],
      rails:R24, toggles:[{id:'arr2',lbl:'2e arrêt'},{id:'mar2',lbl:'2e poste de marche'},{id:'fdc',lbl:'Fin de course remplacé'}],
      status:st=>`Indice du cartouche : <b>${['arr2','mar2','fdc'].some(k=>st.opt[k])?'B':'A'}</b>${st.coil.KM3H?' · <b>-2KM3H collé</b>':''}`});
    mountSortW(box(root,'i6sbox'),'i6srt',{cats:[['s','En série, en tête'],['p','En parallèle sur la marche'],['b','Sur sa propre branche']],items:[['Un deuxième arrêt d’urgence','s'],['Un deuxième bouton de marche, à l’autre bout du tapis','p'],['Un voyant « défaut thermique »','b'],['Un contact de porte de protection','s'],['Un voyant « marche »','b'],['Une marche depuis un second pupitre','p']],ok:'Juste : on coupe en série, on ordonne en parallèle, on signale sur sa propre branche.'});
    mountOrderW(box(root,'i6obox'),'i6ord',{items:['Barrer proprement ce qui disparaît','Dessiner les nouveaux appareils avec repères et bornes','Numéroter les nouveaux potentiels seulement','Mettre à jour les références croisées','Changer l’indice et la date du cartouche','Transmettre au responsable'],ok:'Juste : la feuille décrit maintenant la machine telle qu’elle est.'});
  }},
], {
  i6q1:{q:'Après une modification, que fais-tu de l’ancienne version du schéma ?',o:['Je la gomme','Je la barre proprement : elle doit rester lisible','Je la jette'],g:1,e:'On ne gomme jamais : on barre, on ajoute à côté, on date et on change l’indice.',r:'i6'},
  i6q2:{q:'Tu ajoutes un arrêt en série. Faut-il renuméroter tous les fils ?',o:['Oui, tous','Non : seul le nouveau potentiel reçoit un nouveau numéro','On ne numérote plus après une modification'],g:1,e:'Renuméroter tout le schéma obligerait à rebaguer toute l’armoire.',r:'i6'},
}, [{t:'Reporter une modification sur le schéma (as built), même à main levée, et mettre à jour l’indice.', cap:'i6'}],
   [['Comment met-on à jour un schéma après avoir ajouté un second arrêt ?','i6']]);

/* =========================================================
   2.11 — Dessin 16 : le schéma complet, de A à Z
   ========================================================= */
addDessin('2.11', [
 {id:'k5', sec:'Dessin 16', t:'Le schéma complet, de A à Z', quiz:['k5q1'], ex:{keys:['k5ord', defiKey('banc','bande',3)], lbl:'8 étapes · Banc page vierge'},
  body:()=>`<p class="lead">Tu as toutes les pièces. Il reste à construire le schéma complet <b>seul</b>, sur une page vierge, en suivant la méthode. C’est ce qu’on attend de toi pour l’UAA1.</p>
   ${exbox('k5obox','La méthode en huit étapes','Remets-les dans l’ordre.')}
   ${tbl(['Règle d’or','Pourquoi'],[['Un schéma se dessine toujours au repos.','C’est l’état de référence commun à tous les lecteurs.'],['Un seul récepteur par branche, en fin de branche.','Deux récepteurs en série se partagent la tension.'],['Les récepteurs en parallèle, les coupures en série.','Chaque récepteur reçoit sa tension ; chaque coupure garde son pouvoir d’arrêter.'],['Tout ce qui arrête est en contact à ouverture.','Un fil cassé doit arrêter la machine.'],['Un appareil, un repère, partout où il apparaît.','C’est le seul lien entre la commande et la puissance.'],['Le numéro de fil désigne un potentiel.','Toutes les bornes reliées sans traverser d’appareil portent le même numéro.'],['Toute dérivation se fait sur une borne ; deux conducteurs par borne au maximum.','Il n’y a pas de point flottant au milieu d’un fil.'],['Le PE ne traverse aucun organe de coupure.','Une machine dont la terre est ouverte est dangereuse au premier défaut.']])}
   ${erreur('<ul style="margin:4px 0 0 18px"><li>Deux récepteurs en série : aucun des deux ne fonctionne.</li><li>Un voyant en série avec la bobine : le voyant grillé arrête la machine.</li><li>Deux arrêts en parallèle : aucun des deux n’arrête.</li><li>L’auto-maintien raccordé sur l’arrêt : la machine ne s’arrête plus.</li><li>Un arrêt câblé en contact à fermeture : un fil cassé, et le bouton ne sert plus à rien.</li><li>Un schéma sans cartouche ni repères : ce n’est pas un schéma, c’est un croquis.</li></ul>','Les erreurs qui coûtent le plus')}
   ${exbox('k5banc','Au Banc de câblage : la bande transporteuse, page vierge','Niveau 3 : tu prends tout dans la bibliothèque et tu donnes les bons repères. Commande en 24 V, deux sens, verrouillage, fins de course, voyants, puissance.')}
   <div class="note warn"><b>L’UAA1</b>L’épreuve se passe <b>en atelier, sur la vraie bande transporteuse</b>. Le Banc te sert à t’entraîner : quand tu réussis la bande en page vierge, tu sais construire le schéma seul.</div>`,
  mount:root=>{
    mountOrderW(box(root,'k5obox'),'k5ord',{items:['Lire le cahier des charges, dresser la liste des organes et les répartir entre commande, puissance et folios','Tracer l’arrivée : la prise, le tableau divisionnaire, les cinq conducteurs repérés','Distribuer vers les autres feuilles par des reports de folio','Alimenter la commande : protection, transformateur 230 / 24 V, protection','Tracer une branche : coupures en série, marche et auto-maintien en parallèle, bobine en fin de branche','Ajouter le second sens et son verrouillage électrique','Tracer la puissance : disjoncteur-moteur, contacteurs, relais thermique, moteur ; le PE direct','Numéroter les fils, reporter les repères et les bornes, remplir le cartouche'],ok:'Juste : de l’arrivée au cartouche, sans ratures.'});
    defi(root,'k5banc','bande',3,'Bande transporteuse · page vierge');
  }},
], {
  k5q1:{q:'Dans quel ordre dessine-t-on ?',o:['La puissance, puis la commande, puis l’arrivée','L’arrivée, puis la commande, puis la puissance','Peu importe'],g:1,e:'On remonte le courant depuis sa source. La commande traduit le cahier des charges ; la puissance n’en est que la conséquence.',r:'k5'},
}, [{t:'Construire seul, sur une page vierge, le schéma complet d’un démarrage deux sens (Banc de câblage, niveau 3).', cap:'k5'}]);
})();
