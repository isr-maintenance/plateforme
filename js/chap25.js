/* =========================================================
   CHAPITRE 2.5 — LES PROTECTIONS ET LA SÉCURITÉ POSITIVE
   Contenu repris du cours d'Électricité 4e, pages 73 à 90.
   ========================================================= */
(function(){
const Q25 = {
  e1q1:{q:"Un roulement grippe : le moteur absorbe 30 % de plus que son nominal, pendant des minutes. Quel défaut, quel organe ?",o:["Court-circuit — fusible","Surcharge — relais thermique, action retardée","Défaut d'isolement — différentiel"],g:1,e:"La surcharge dépasse le nominal de 10 à 50 %, pendant des minutes. Le thermique la voit ; un disjoncteur réglé aussi bas déclencherait à chaque démarrage.",r:'e1'},
  e1q2:{q:"Pourquoi un départ moteur comporte-t-il toujours plusieurs organes de protection ?",o:["Par sécurité supplémentaire, sans raison technique","Aucun appareil ne protège des trois défauts à la fois : chacun surveille ce que l'autre ne peut pas voir","Pour respecter les couleurs"],g:1,e:"Le thermique est bien trop lent pour un court-circuit ; un magnétique réglé pour la surcharge déclencherait à chaque démarrage.",r:'e1'},
  e2q1:{q:"Sur un départ moteur, on remplace un fusible aM par un gG du même calibre. Que se passe-t-il ?",o:["Rien de particulier","Le gG fond au premier démarrage","Le moteur est mieux protégé"],g:1,e:"Le aM supporte la pointe de démarrage ; il ne protège que du court-circuit et doit être associé à un relais thermique.",r:'e2'},
  e2q2:{q:"Un fusible « saute tout le temps ». On met un calibre au-dessus ?",o:["Oui, c'est la solution","Non : on supprime la protection au lieu de chercher la cause","Oui, si c'est un gG"],g:1,e:"Un fusible fond parce qu'il a vu un défaut. On cherche la cause — par exemple au mégohmmètre (chapitre 2.7).",r:'e2'},
  e3q1:{q:"Qu'est-ce qui distingue les courbes B, C et D d'un disjoncteur ?",o:["Uniquement la position du seuil magnétique","Le calibre","La partie thermique"],g:0,e:"B : 3 à 5 In. C : 5 à 10 In. D : 10 à 20 In. La partie thermique est commune.",r:'e3'},
  e3q2:{q:"Pourquoi ne met-on jamais de courbe B sur un moteur à démarrage direct ?",o:["Elle est trop chère","Le démarrage (5 à 8 In) dépasse son seuil magnétique (3 à 5 In) : elle déclencherait à chaque mise en marche","Elle ne protège pas du court-circuit"],g:1,e:"On choisit C ou D selon la puissance et le type de démarrage.",r:'e3'},
  e4q1:{q:"Un moteur « 11,0 A Δ / 6,4 A Y » est couplé en étoile. Sur quoi règles-tu le relais thermique ?",o:["11,0 A","6,4 A","8,7 A, la moyenne"],g:1,e:"On règle sur le courant nominal de la plaque, pour le couplage réellement réalisé.",r:'e4'},
  e4q2:{q:"Le relais thermique coupe-t-il lui-même le courant du moteur ?",o:["Oui, par ses six bornes de puissance","Non : son contact 95-96 fait retomber le contacteur, c'est le contacteur qui coupe","Seulement en cas de court-circuit"],g:1,e:"Le thermique est un organe de détection, pas de coupure.",r:'e4'},
  e4q3:{q:"Pourquoi choisit-on le réarmement manuel en atelier ?",o:["Parce qu'il est plus rapide","Une machine qui repart seule après un défaut est dangereuse","Parce que l'automatique use le bilame"],g:1,e:"Sélecteur H/A sur H. En manuel, le bilame doit d'abord refroidir.",r:'e4'},
  e4q4:{q:"Un collègue veut supprimer le contacteur parce qu'il vient de poser un disjoncteur-moteur. Le circuit a un auto-maintien. D'accord ?",o:["Oui, le disjoncteur-moteur fait tout","Non : le disjoncteur-moteur protège mais ne commande pas à distance — c'est la bobine du contacteur que pilote la commande","Oui, si on garde le relais thermique"],g:1,e:"Dès qu'il faut un auto-maintien, des boutons-poussoirs ou un automate, le contacteur reste indispensable.",r:'e4'},
  e5q1:{q:"De quoi un différentiel ne protège-t-il pas ?",o:["D'une fuite à la terre","Du court-circuit et de la surcharge","D'un contact d'une personne avec une phase"],g:1,e:"Il ne voit qu'une fuite : il est toujours associé à un disjoncteur ou à des fusibles.",r:'e5'},
  e5q2:{q:"Pourquoi le bouton de test d'un différentiel ne suffit-il pas ?",o:["Il prouve que le mécanisme fonctionne, pas le courant ni le délai de déclenchement, ni que la fuite passe par le PE","Il use l'appareil","Il ne fonctionne qu'en continu"],g:0,e:"Pour cela, on utilise un testeur de différentiel, en aval, sur une prise ou sur les bornes L, N et PE.",r:'e5'},
  e6q1:{q:"Énonce la sécurité positive.",o:["Quand quelque chose casse, la machine s'arrête","Quand quelque chose casse, la machine continue pour ne pas perdre la production","Les boutons d'arrêt sont verts"],g:0,e:"Tous les organes d'arrêt en contacts à ouverture, placés en série.",r:'e6'},
  e6q2:{q:"On déverrouille un arrêt d'urgence et la machine redémarre seule. Conclusion ?",o:["Normal","Circuit mal conçu : le déverrouillage doit seulement rétablir la possibilité de démarrer","Le bouton est usé"],g:1,e:"Le redémarrage exige une action volontaire sur marche. La machine reste consignée et le responsable est prévenu.",r:'e6'},
  e6q3:{q:"Pendant l'essai, un contact de carter fait perdre du temps. On le ponte ?",o:["Oui, juste pour l'essai","Jamais : on ne ponte pas un contact de sécurité ; la machine reste à l'arrêt tant qu'un organe ne fonctionne pas","Oui, si on le note dans le rapport"],g:1,e:"Un essai, pas un pontage.",r:'e6'},
  e7q1:{q:"Pourquoi la référence RT-6,3 ne convient-elle pas pour un moteur à régler sur 6,4 A ?",o:["Sa plage s'arrête à 6,30 A : 6,4 A est en dehors","Elle est de classe 20","Elle se monte sous un contacteur taille 1"],g:0,e:"On choisit un relais dont la plage contient le courant, et pas seulement le frôle.",r:'e7'},
};

/* ---------- 2.5.3 : le seuil magnétique ---------- */
const CRB={B:[3,5],C:[5,10],D:[10,20]};
function mountTrip(root){
  const box=root.querySelector('#trip'), st=WS.trip||(WS.trip={c:'C',In:16,k:3});
  const html=()=>{
    const [a,b]=CRB[st.c], I=st.k*st.In, X=k=>30+Math.log10(k)/Math.log10(30)*290, Y=t=>20+(1-Math.log10(t*10)/5)*140;
    const pts=[]; for(let k=1.13;k<=b;k*=1.06){ const t=Math.min(9999,400/((k-1)**2)); pts.push(`${X(k).toFixed(1)},${Y(Math.max(0.2,t)).toFixed(1)}`); }
    const zone = st.k<=1.05?['Pas de déclenchement','Le courant ne dépasse pas le calibre.','ok']:st.k<a?['Zone thermique','Déclenchement retardé : plus le dépassement est faible, plus c’est long — plusieurs minutes à 1,5 In.','amber']:st.k<b?['Zone incertaine','Entre les deux bornes du seuil, le déclenchement peut être instantané… ou thermique. On ne peut rien affirmer.','amber']:['Instantané — magnétique','Au-delà du seuil haut, le déclenchement est immédiat, en quelques millisecondes.','bad'];
    return `<div class="grid g2"><div>
      <div class="kicker" style="margin-bottom:6px">Courbe</div><div class="seg">${['B','C','D'].map(c=>`<button class="${st.c===c?'on':''}" data-tc="${c}">${c} · ${CRB[c][0]} à ${CRB[c][1]} In</button>`).join('')}</div>
      <div class="kicker" style="margin:10px 0 6px">Calibre In</div><div class="seg">${[6,10,16,20,25,32].map(v=>`<button class="${st.In===v?'on':''}" data-ti="${v}">${v} A</button>`).join('')}</div>
      <label class="small" style="display:block;margin:12px 0"><b data-tlbl>Courant : ${fr(I,0)} A = ${fr(st.k,1)} × In</b><input type="range" min="0.8" max="25" step="0.1" value="${st.k}" data-tk style="width:100%"></label>
      <div class="note ${zone[2]==='bad'?'bad':zone[2]==='ok'?'ok':'warn'}" data-tz><b>${zone[0]}</b>${zone[1]}<div class="small" style="margin-top:4px">Seuil magnétique de ce disjoncteur : ${fr(a*st.In,0)} à ${fr(b*st.In,0)} A.</div></div>
    </div><div><svg viewBox="0 0 330 190" role="img" aria-label="Courbe de déclenchement ${st.c}"><line x1="30" y1="160" x2="320" y2="160" stroke="var(--line)"/><line x1="30" y1="10" x2="30" y2="160" stroke="var(--line)"/>
      ${[1,2,5,10,20].map(k=>`<line x1="${X(k)}" y1="160" x2="${X(k)}" y2="164" stroke="var(--muted)"/><text x="${X(k)}" y="176" text-anchor="middle" font-size="9" fill="var(--muted)">${k} In</text>`).join('')}
      <text x="34" y="18" font-size="9" fill="var(--muted)">temps ↑</text>
      <rect x="${X(a)}" y="20" width="${X(b)-X(a)}" height="140" fill="var(--amber-soft)"/>
      <polyline points="${pts.join(' ')}" fill="none" stroke="var(--elec)" stroke-width="3"/><line x1="${X(b)}" y1="${Y(400/((b-1)**2))}" x2="${X(b)}" y2="158" stroke="var(--elec)" stroke-width="3"/>
      <line x1="${X(Math.min(st.k,29))}" y1="12" x2="${X(Math.min(st.k,29))}" y2="160" stroke="var(--live)" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="${X(a)+4}" y="32" font-size="9" fill="var(--warn)">seuil magnétique</text></svg>
      <p class="tiny muted">Axe horizontal en multiples du calibre (échelle logarithmique). La partie courbe est la zone thermique, la chute verticale le seuil magnétique.</p></div></div>`; };
  const draw=()=>{ box.innerHTML=html();
    box.querySelectorAll('[data-tc]').forEach(b=>b.onclick=()=>{ st.c=b.dataset.tc; draw(); });
    box.querySelectorAll('[data-ti]').forEach(b=>b.onclick=()=>{ st.In=+b.dataset.ti; draw(); });
    box.querySelector('[data-tk]').oninput=e=>{ st.k=+e.target.value; const y=document.createElement('div'); y.innerHTML=html();
      ['[data-tlbl]','[data-tz]','svg'].forEach(sel=>box.querySelector(sel).outerHTML=y.querySelector(sel).outerHTML); };
  };
  draw();
}

/* ---------- 2.5.6 : le fil cassé ---------- */
function mountPos(root){
  const box=root.querySelector('#possim'), st=WS.pos||(WS.pos={A:{cut:false,stop:false},B:{cut:false,stop:false}}), mem=DR().pos||(DR().pos={});
  const runs=k=>{ const s=st[k]; return k==='A' ? !(s.cut||s.stop) : !(s.stop && !s.cut); };
  const draw=()=>{
    if(st.A.cut) mem.a=true; if(st.B.cut && st.B.stop) mem.b=true;
    if(mem.a && mem.b && !P().ex.e6sim){ save(); exSet('e6sim'); }
    const col=(k,title,sub)=>{ const on=runs(k), s=st[k];
      return `<div class="card pad"><b>${title}</b><div class="small muted">${sub}</div>
        <div class="bigflag ${on?'':'ok'}" style="margin:10px 0"><span class="lamp" style="${on?'background:var(--live)':''}"></span><div><b>${on?'La machine tourne':'La machine est à l’arrêt'}</b></div></div>
        <div class="row wrap"><button class="btn sm" data-pc="${k}">${s.cut?'Réparer le fil':'Casser le fil du bouton d’arrêt'}</button><button class="btn sm ${s.stop?'primary':''}" data-ps="${k}">${s.stop?'Relâcher arrêt':'Appuyer sur arrêt'}</button></div>
        <p class="small" style="margin:8px 0 0">${k==='A'?(s.cut?'<b style="color:var(--ok)">Le fil cassé ouvre la branche : la machine s’arrête d’elle-même.</b> Le défaut se signale.':''):(s.cut&&s.stop?'<b style="color:var(--bad)">On appuie sur arrêt… et rien ne se passe.</b> Le fil cassé a rendu le bouton inopérant, sans que personne ne s’en aperçoive.':s.cut?'Le fil est cassé, mais la machine tourne : rien ne le signale.':'')}</p></div>`; };
    box.innerHTML=`<div class="grid g2">${col('A','Arrêt à ouverture, en série','Sécurité positive')}${col('B','Arrêt à fermeture, qui commande un relais d’arrêt','Ce qu’il ne faut pas faire')}</div>
      <div class="tiny muted" style="margin-top:8px">${mem.a?'✓':'○'} casser le fil à gauche · ${mem.b?'✓':'○'} casser le fil à droite, puis appuyer sur arrêt</div>`;
    box.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{ const s=st[b.dataset.pc]; s.cut=!s.cut; draw(); });
    box.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>{ const s=st[b.dataset.ps]; s.stop=!s.stop; draw(); });
  };
  draw();
}

/* ---------- 2.5.7 : choisir dans le catalogue ---------- */
const RT=[['RT-0,63',0.40,0.63,10],['RT-1,6',1.00,1.60,10],['RT-4',2.50,4.00,10],['RT-6,3',4.00,6.30,10],['RT-10',6.00,10.0,10],['RT-13',9.00,13.0,10],['RT-18',12.0,18.0,20]];
const DJ=[['DJ-1P-10B','10 A','1P+N','B','6 kA','Éclairage, longues lignes — déclenche vite'],['DJ-1P-16C','16 A','1P+N','C','6 kA','Prises et petits récepteurs'],['DJ-2P-6C','6 A','2P','C','6 kA','Primaire d’un transformateur de commande'],['DJ-3P-10C','10 A','3P','C','10 kA','Petit moteur, démarrage à vide'],['DJ-3P-10D','10 A','3P','D','10 kA','Moteur à démarrage direct'],['DJ-3P-16D','16 A','3P','D','10 kA','Moteur à démarrage direct, plus puissant'],['DJ-3P-25D','25 A','3P','D','10 kA','Forte inertie, démarrage long']];
function mountCata(root){
  const box=root.querySelector('#cata'), st=WS.cata||(WS.cata={rt:null,reg:'',dj:null,fb:''});
  const draw=()=>{
    const done=!!P().ex.e7cat;
    box.innerHTML=`<div class="note"><b>Le départ du TP</b>Moteur « 230 V Δ / 400 V Y » et « 11,0 A Δ / 6,4 A Y », raccordé sur le réseau 400 V de l'atelier, démarrage direct. Court-circuit possible à cet endroit : 6 kA.</div>
      <h3 style="margin-top:14px">1. Le relais thermique</h3><div class="scroll-x"><table class="t"><tr><th></th><th>Référence</th><th>Plage de réglage</th><th>Classe</th></tr>
        ${RT.map(([r,a,b,c])=>`<tr><td><input type="radio" name="rt" data-rt="${r}" ${st.rt===r?'checked':''} ${done?'disabled':''}></td><td><b>${r}</b></td><td>${fr(a,2)} – ${fr(b,2)} A</td><td>${c}</td></tr>`).join('')}</table></div>
      <label class="small" style="display:block;margin:8px 0"><b>Réglage de la molette :</b> <input type="text" inputmode="decimal" data-reg value="${esc(st.reg)}" style="width:80px" ${done?'disabled':''}> A</label>
      <h3 style="margin-top:14px">2. Le disjoncteur</h3><div class="scroll-x"><table class="t"><tr><th></th><th>Référence</th><th>In</th><th>Pôles</th><th>Courbe</th><th>PdC</th><th>Usage conseillé</th></tr>
        ${DJ.map(([r,...c])=>`<tr><td><input type="radio" name="dj" data-dj="${r}" ${st.dj===r?'checked':''} ${done?'disabled':''}></td><td><b>${r}</b></td>${c.map(x=>`<td class="small">${x}</td>`).join('')}</tr>`).join('')}</table></div>
      ${done?`<div class="fb good" style="margin-top:10px"><b>Bon choix : RT-10 réglé sur 6,4 A, et DJ-3P-10D.</b> Le courant de 6,4 A est dans la plage du RT-10 ; calibre 10 A ≥ 6,4 A ; courbe D, car la pointe de démarrage (32 à 51 A) atteindrait le seuil d'une courbe C (50 à 100 A) ; 10 kA &gt; 6 kA.</div>`:`<div class="row" style="margin-top:10px"><button class="btn sm primary" data-cok>Vérifier mon choix</button></div>${st.fb}`}`;
    if(done) return;
    box.querySelectorAll('[data-rt]').forEach(i=>i.onchange=()=>{ st.rt=i.dataset.rt; st.fb=''; });
    box.querySelectorAll('[data-dj]').forEach(i=>i.onchange=()=>{ st.dj=i.dataset.dj; st.fb=''; });
    box.querySelector('[data-reg]').oninput=e=>{ st.reg=e.target.value; };
    box.querySelector('[data-cok]').onclick=()=>{
      const m=[], reg=num(st.reg);
      if(st.rt!=='RT-10') m.push(st.rt==='RT-6,3'?'RT-6,3 : sa plage s’arrête à 6,30 A, le courant de 6,4 A est en dehors.':st.rt==='RT-13'?'RT-13 : sa plage commence à 9 A, impossible de le régler sur 6,4 A — le moteur ne serait pas protégé de la surcharge.':'Relais thermique : choisis celui dont la plage contient le courant nominal du couplage réalisé.');
      if(Math.abs(reg-6.4)>0.01) m.push(reg===11?'Réglage : 11 A, c’est le courant du triangle. Le moteur est couplé en étoile sur 400 V.':'Réglage : le courant nominal de la plaque, pour le couplage réalisé (étoile sur 400 V).');
      if(st.dj!=='DJ-3P-10D') m.push(st.dj==='DJ-3P-10C'?'DJ-3P-10C : la pointe de démarrage (5 à 8 × 6,4 = 32 à 51 A) touche le seuil d’une courbe C 10 A (50 à 100 A). Courbe D.':/^DJ-(1P|2P)/.test(st.dj||'')?'Disjoncteur : un moteur triphasé demande un tripolaire (3P).':st.dj==='DJ-3P-10B'||!st.dj?'Disjoncteur : tripolaire, courbe adaptée au démarrage direct.':'Disjoncteur : le calibre doit être au moins égal au courant nominal, sans être surdimensionné : 10 A suffit.');
      if(!m.length){ exSet('e7cat'); draw(); return; }
      st.fb=`<div class="fb wrong" style="margin-top:10px"><b>Pas encore.</b><ul style="margin:6px 0 0 18px">${m.map(x=>`<li>${x}</li>`).join('')}</ul></div>`; draw(); };
  };
  draw();
}

defChapter({
  num:'2.5', titre:'Les protections et la sécurité positive', tp:'É05',
  evalInfo:'L’évaluation formative 2.5 (34 points, seuil 24) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant le TP É05',
  Q:Q25,
  caps:[
    {id:'e1', sec:'2.5.1', t:'De quoi faut-il protéger ?', pdf:73, quiz:['e1q1','e1q2'], ex:{keys:['e1sort'], lbl:'Reconnaître le défaut'},
     body:()=>`<p class="lead">Une installation n'a pas un seul risque, mais <b>trois</b> — et aucun appareil ne protège des trois à la fois.</p>
      ${tbl(['Défaut','Ce qui se passe','Ce qui protège'],[['Court-circuit','Deux conducteurs se touchent. Le courant devient énorme en quelques millisecondes.','Fusible ou disjoncteur — action instantanée'],['Surcharge','Le moteur force, un roulement grippe, la machine est trop chargée. Le courant dépasse le nominal de 10 à 50 %, pendant des minutes.','Relais thermique — action retardée'],['Défaut d’isolement','Un conducteur actif touche une masse métallique. La carcasse devient dangereuse au toucher.','Différentiel, associé au conducteur de protection']])}
      <div class="note warn" style="margin-top:14px"><b>Pourquoi un seul appareil ne suffit pas</b>Un disjoncteur réglé assez bas pour voir une surcharge de 20 % déclencherait à chaque démarrage, où le courant atteint cinq à huit fois le nominal. Un relais thermique est bien trop lent pour un court-circuit. Chacun surveille ce que l'autre ne peut pas voir.</div>
      ${exbox('e1box','Quel défaut ?')}`,
     mount:root=>mountSortW(root.querySelector('#e1box'),'e1sort',{cats:[['cc','Court-circuit'],['sc','Surcharge'],['di','Défaut d’isolement']],items:[['Un brin dépasse et touche la borne voisine','cc'],['La bande transporteuse est surchargée depuis le matin','sc'],['Une phase frotte contre la carcasse du moteur','di'],['Un tournevis tombe sur le jeu de barres','cc'],['Un roulement grippé fait forcer le moteur','sc'],['Un câble à l’isolant abîmé touche le bâti de la machine','di']],ok:'Juste : trois défauts, trois protections.'})},
    {id:'e2', sec:'2.5.2', t:'Le fusible', pdf:75, quiz:['e2q1','e2q2'], ex:{keys:['e2ord'], lbl:'Remplacer un fusible'},
     body:()=>`<p class="lead">Un fil calibré dans une cartouche remplie de sable. Au-delà du courant prévu, le fil fond — d'autant plus vite que le courant est élevé — et le sable étouffe l'arc.</p>
      ${tbl(['Type','Ce qu’il protège','Conséquence pratique'],[['gG','Usage général : surcharge et court-circuit','Éclairage, prises, commande'],['aM','Accompagnement moteur : court-circuit uniquement','Ne protège PAS de la surcharge : toujours associé à un relais thermique. Supporte la pointe de démarrage sans fondre.']])}
      <p class="small" style="margin-top:12px">Sur une cartouche on lit : le <b>calibre</b> (courant supporté en permanence), la <b>tension d'emploi</b> (au moins celle du circuit), le <b>type</b> et la taille, et le <b>pouvoir de coupure</b> en kA — le court-circuit maximal qu'elle peut interrompre sans exploser.</p>
      <div class="note bad"><b>Deux fautes graves</b>Mettre un calibre supérieur « parce qu'il saute tout le temps » : on supprime la protection au lieu de chercher la cause. Remplacer un aM par un gG sur un départ moteur : le gG fond au premier démarrage.</div>
      ${exbox('e2box','Remplacer un fusible, dans l’ordre','La plupart des cartouches industrielles sont opaques : un fusible fondu ne se devine pas à l’œil.')}
      <p class="small">Une cartouche saine affiche une résistance quasi nulle ; une cartouche fondue affiche OL. Certaines portent un voyant de fusion : il aide à la repérer, mais ne remplace pas la mesure.</p>`,
     mount:root=>mountOrderW(root.querySelector('#e2box'),'e2ord',{items:['Consigner le départ — sur un sectionneur porte-fusibles, ouvrir d’abord la poignée','Contrôler la cartouche sortie de son support, à l’ohmmètre','Remplacer à l’identique : type, calibre, taille, tension et pouvoir de coupure au moins égaux','Chercher la cause du défaut avant de remettre sous tension'],shuffle:[2,3,0,1],ok:'Consigner, contrôler, remplacer à l’identique, chercher la cause.',hint:'Jamais de cartouche retirée sous charge.'})},
    {id:'e3', sec:'2.5.3 a-d', t:'Le disjoncteur et ses courbes', pdf:76, quiz:['e3q1','e3q2'], ex:{keys:['e3dr'], lbl:'Drill des seuils magnétiques'},
     body:()=>`${tbl(['Déclencheur','Fonctionnement'],[['Thermique','Un bilame — deux métaux collés qui se dilatent différemment — chauffe et se courbe, puis libère le mécanisme. Déclenchement retardé, d’autant plus long que le dépassement est faible.'],['Magnétique','Une bobine attire une palette dès que le courant dépasse un seuil élevé. Instantané, en quelques millisecondes : c’est ce qui traite le court-circuit.']])}
      ${exbox('trip','Lis la courbe de déclenchement','Choisis la courbe et le calibre, puis fais monter le courant.')}
      ${tbl(['Courbe','Seuil magnétique','Usage'],[['B','3 à 5 In','Circuits résistifs, éclairage, longues lignes. Déclenche vite : inadapté à un moteur.'],['C','5 à 10 In','Usage général et petits moteurs. La plus répandue.'],['D','10 à 20 In','Charges à forte pointe : moteurs, transformateurs. Laisse passer le démarrage direct.']])}
      <p class="small" style="margin-top:12px">Le <b>pouvoir de coupure</b>, en kA, doit dépasser le court-circuit possible à l'endroit où l'appareil est installé. En atelier, 6 kA ou 10 kA sont courants.</p>
      ${exbox('e3box','Drill — le seuil magnétique','Calcule les deux bornes du déclenchement instantané.')}`,
     mount:root=>{ mountTrip(root);
       (v=>mountDrillW(root.querySelector('#e3box'),'e3dr',{rows:v.L.flatMap(([In,c])=>[{q:`${In} A courbe ${c} : borne basse`,unit:'A',ans:CRB[c][0]*In},{q:'… borne haute',unit:'A',ans:CRB[c][1]*In}])}))(vx('e3dr',{L:[[[10,'B'],[16,'C'],[6,'D'],[25,'C'],[32,'B'],[20,'D']],[[16,'B'],[10,'C'],[20,'D'],[32,'C'],[25,'B'],[6,'D']],[[20,'B'],[25,'C'],[10,'D'],[16,'C'],[40,'B'],[32,'D']]]})); }},
    {id:'e4', sec:'2.5.3 e-2.5.4', t:'Disjoncteur-moteur et relais thermique', pdf:79, quiz:['e4q1','e4q2','e4q3','e4q4'], ex:{keys:['e4reg','e4ctl'], lbl:'Régler et vérifier'},
     body:()=>`<h3 style="margin-top:0">Le disjoncteur-moteur</h3>
      ${tbl(['Ce qu’il contient','Ce que cela fait','Ce que cela remplace'],[['Un déclencheur magnétique','Coupe instantanément en cas de court-circuit','Le disjoncteur ou les fusibles aM'],['Un déclencheur thermique réglable','Surveille la surcharge ; molette réglée sur le courant nominal du moteur','Le relais thermique'],['Une poignée ou deux boutons','Ouvre et ferme le départ à la main','—']])}
      <div class="note warn" style="margin-top:12px"><b>Ce qu'il ne remplace pas</b>Il protège, mais il ne commande pas à distance. Dès qu'il faut un auto-maintien, des boutons-poussoirs ou un automate, le contacteur reste indispensable.</div>
      <h3>Le relais thermique</h3>
      <p>Il <b>ne coupe pas</b> le courant. Il surveille les trois phases et, sur une surcharge prolongée, actionne son contact 95-96 qui fait retomber le contacteur. D'où sa place : entre le contacteur et le moteur.</p>
      <div class="note"><b>La règle de réglage</b>Sur le courant nominal de la plaque, pour le couplage réalisé. Un moteur « 11,0 A Δ / 6,4 A Y » couplé en étoile se règle sur 6,4 A, pas sur 11 A.</div>
      ${tbl(['Classe','Temps toléré à 7,2 fois le réglage','Usage'],[['10','4 à 10 s','Démarrages normaux, machines à vide — la plus courante'],['20','6 à 20 s','Démarrages en charge, forte inertie'],['30','9 à 30 s','Démarrages longs : grands ventilateurs, centrifugeuses']])}
      <ul class="ctrlq" style="margin-top:12px"><li><b>95-96</b>, à ouverture : en série dans la commande, fait retomber le contacteur.</li><li><b>97-98</b>, à fermeture : voyant de défaut ou information automate.</li><li><b>TEST</b> simule un déclenchement pour vérifier le câblage.</li><li><b>H/A</b> : réarmement manuel ou automatique — en atelier, toujours manuel.</li></ul>
      ${exbox('e4r','Sur quoi règles-tu le thermique ?','Lis la plaque et le couplage réalisé.')}
      <h3>Vérifier un relais thermique</h3>
      ${tbl(['Contrôle','Comment','Résultat attendu'],[['Le réglage','Lire la molette, comparer à la plaque, pour le couplage réalisé','Le courant nominal du moteur'],['Les contacts, hors tension','Ohmmètre sur 95-96 puis 97-98 : au repos, après TEST, après réarmement','Au repos : 95-96 fermé, 97-98 ouvert (OL). Après TEST : l’inverse.'],['Le courant, en marche','Pince sur chacune des trois phases, en charge normale','Trois courants voisins, tous inférieurs au réglage']])}
      ${exbox('e4c','Tes mesures : normal ou anormal ?')}`,
     mount:root=>{
       (v=>mountDrillW(root.querySelector('#e4r'),'e4reg',{rows:[[11.0,6.4],[4.6,2.65],[8.5,4.9],[15.2,8.8]].map(([d,y],i)=>{ const et=v.c[i]; return {q:`Plaque « ${fr(d,2)} A Δ / ${fr(y,2)} A Y » — couplé en ${et?'étoile':'triangle'}`,unit:'A',ans:et?y:d,tol:0.001}; }),hint:'Étoile : le plus petit courant. Triangle : le plus grand.'}))(vx('e4reg',{c:[[1,0,1,0],[0,1,1,0],[1,1,0,0],[0,0,1,1],[1,0,0,1]]}));
       mountSortW(root.querySelector('#e4c'),'e4ctl',{cats:[['ok','Normal'],['ko','Anormal']],items:[
         ['Au repos, 95-96 : 0,1 Ω','ok'],['Au repos, 97-98 : OL','ok'],['Au repos, 95-96 : OL','ko','Le relais est déclenché ou le contact est défectueux : on réarme, puis on remesure.'],['Après TEST, 95-96 : OL','ok'],
         ['En marche : 6,1 A · 6,2 A · 6,0 A, réglage 6,4 A','ok'],['En marche : 6,1 A · 6,2 A · 9,5 A, réglage 6,4 A','ko','Une phase absorbe nettement plus : borne mal serrée, tension anormale, enroulement abîmé.'],['En marche : 7,0 A · 0 A · 7,2 A','ko','Une phase à zéro : le moteur tourne sur deux phases et chauffe. On l’arrête.']],ok:'Juste. Le défaut n’est pas dans le relais : il le signale.'});
     }},
    {id:'e5', sec:'2.5.5', t:'Le différentiel', pdf:80, quiz:['e5q1','e5q2'], ex:{keys:['e5sort'], lbl:'Lire un test de différentiel'},
     body:()=>`<p class="lead">Le différentiel <b>compare ce qui entre et ce qui sort</b> du circuit. Normalement, tout ce qui part par la phase revient par le neutre : la somme est nulle. Si une partie part ailleurs — par la terre, ou par une personne —, la somme n'est plus nulle et l'appareil coupe.</p>
      <p class="small">C'est exactement la pince ampèremétrique qui enserre tous les conducteurs d'un circuit (chapitre 2.1).</p>
      ${tbl(['Sensibilité','Ce qu’elle protège','Où'],[['30 mA','Les personnes','Prises, salles d’eau, matériel portatif, chantier'],['300 mA','Le matériel et le risque d’incendie','Protection générale d’une installation ou d’un départ']])}
      <p class="small" style="margin-top:12px">Le bouton de test crée une petite fuite interne : à actionner une fois par mois, car un différentiel qui ne manœuvre jamais peut se gripper. Mais il ne prouve ni le courant, ni le délai de déclenchement. Pour cela : le <b>testeur de différentiel</b>, raccordé en aval, qui fait passer une fuite croissante vers le PE.</p>
      ${tbl(['Mesure','Valeur attendue','Pour un 30 mA'],[['Courant de déclenchement','Entre la moitié de la sensibilité et la sensibilité','Entre 15 et 30 mA'],['Temps, à la sensibilité','300 ms au plus','En pratique, quelques dizaines de ms']])}
      ${exbox('e5box','Différentiels 30 mA au testeur : ton verdict ?')}`,
     mount:root=>mountSortW(root.querySelector('#e5box'),'e5sort',{cats:[['ok','Bon'],['sens','Trop sensible'],['ko','Ne protège plus']],items:[['Déclenche à 22 mA, en 28 ms','ok'],['Ne déclenche pas à 30 mA','ko','Il est remplacé, et le circuit n’est pas remis en service avant.'],['Déclenche à 9 mA','sens','Sous la moitié de sa sensibilité : coupures sans raison apparente.'],['Déclenche à 27 mA, en 45 ms','ok'],['Déclenche à 30 mA, en 600 ms','ko','Trop lent : plus de 300 ms.']],ok:'Juste.'})},
    {id:'e6', sec:'2.5.6', t:'La sécurité positive', pdf:81, quiz:['e6q1','e6q2','e6q3'], ex:{keys:['e6sim','e6sort'], lbl:'Le fil cassé et la chaîne d’arrêt'},
     body:()=>`<p class="lead">Un dispositif est à <b>sécurité positive</b> quand sa défaillance conduit d'elle-même à l'état sûr : <b>quand quelque chose casse, la machine s'arrête</b>.</p>
      <p>Dans un circuit de commande : tous les organes d'arrêt en <b>contacts à ouverture, placés en série</b>. Au repos ils laissent passer le courant ; c'est l'action de l'opérateur — ou la rupture d'un fil — qui l'interrompt.</p>
      ${exbox('possim','Le même fil cassé, deux câblages')}
      ${exbox('e6box','Dans la chaîne d’arrêt, en série ?','Chacun de ces contacts peut, à lui seul, couper la branche.')}
      ${tbl(['L’arrêt d’urgence','Pourquoi'],[['Champignon rouge sur fond jaune','Actionnable sans réfléchir, même par quelqu’un qui ne connaît pas la machine'],['Accrochage mécanique','Il reste enfoncé : la machine ne repart pas tant qu’on ne l’a pas déverrouillé'],['Déverrouillage par rotation ou par clé','Le geste doit être délibéré'],['Contact à ouverture forcée','Il s’ouvre même si ses pastilles sont soudées'],['Accessible sans obstacle','Atteignable depuis le poste de travail']])}
      <div class="note bad" style="margin-top:14px"><b>Après un arrêt d'urgence</b>Le déverrouillage ne redémarre jamais la machine : il rétablit seulement la possibilité de la démarrer. Une machine qui repart au déverrouillage est un circuit mal conçu.</div>
      <h3>L'essai fonctionnel de la chaîne d'arrêt</h3>
      <ul class="ctrlq"><li>Hors tension : à l'ohmmètre, chaque contact affiche une résistance quasi nulle au repos, OL quand on l'actionne.</li><li>Sous tension — zone balisée, utilisateur prévenu, à vide si possible : chaque organe, un par un.</li><li>Chaque arrêt d'urgence, chaque bouton d'arrêt, chaque contact de carter et le thermique (bouton TEST), sans exception.</li><li>Les résultats sont notés dans le rapport d'intervention (chapitre 2.9).</li></ul>
      <div class="note warn" style="margin-top:12px"><b>Un essai, pas un pontage</b>On ne ponte jamais un contact de sécurité pour gagner du temps. Une machine dont un organe de la chaîne d'arrêt ne fonctionne pas reste à l'arrêt, consignée, et le responsable est prévenu.</div>`,
     mount:root=>{ mountPos(root);
       mountSortW(root.querySelector('#e6box'),'e6sort',{cats:[['oui','En série'],['non','Non']],items:[['Le bouton d’arrêt d’urgence','oui'],['Le contact 95-96 du relais thermique','oui'],['Le bouton de marche','non','La marche est en parallèle avec l’auto-maintien, pas dans la chaîne d’arrêt.'],['Le contact de position du carter','oui'],['Le contact 97-98 du relais thermique','non','Le 97-98 sert au voyant de défaut.'],['Le fin de course de sécurité','oui'],['Le voyant « en marche »','non']],ok:'Juste. Organes d’arrêt : à ouverture, en série.'}); }},
    {id:'e7', sec:'2.5.7', t:'Choisir une protection dans un catalogue', pdf:83, quiz:['e7q1'], ex:{keys:['e7cat'], lbl:'Équiper le départ du TP'},
     body:()=>`<p class="lead">Le choix ne s'improvise pas, il se lit — dans la plaque du moteur d'abord, dans le catalogue ensuite.</p>
      <ol class="ctrlq"><li>Lire la plaque et relever le courant nominal <b>du couplage réellement réalisé</b>. C'est cette valeur qui commande tout le reste.</li><li>Choisir le <b>relais thermique</b> dont la plage contient ce courant — et pas seulement le frôle.</li><li>Choisir le <b>disjoncteur</b> : calibre au moins égal au courant nominal, courbe dont le seuil magnétique est franchement au-dessus de la pointe de démarrage.</li><li>Vérifier le <b>pouvoir de coupure</b>, supérieur au court-circuit possible à cet endroit.</li></ol>
      <p class="small muted">Les références ci-dessous sont inventées pour l'exercice, avec des valeurs types. Sur une commande réelle, on travaille sur le catalogue du fournisseur retenu.</p>
      ${exbox('cata','Équipe le départ moteur du TP')}
      <div class="note" style="margin-top:14px"><b>★ Dessin</b>La sécurité positive, le second sens et son verrouillage, la feuille complète : <button class="revoir" data-goto="e9">Dessin 9 →</button>, à la fin de ce chapitre, avant le TP É05.</div>`,
     mount:mountCata},
  ],
  prereq:[
    {t:'Distinguer un court-circuit d’une surcharge et d’un défaut d’isolement.', cap:'e1'},
    {t:'Expliquer le rôle du fusible, du disjoncteur, du relais thermique et du différentiel, et ce que chacun ne protège pas.', cap:'e5'},
    {t:'Lire une courbe de déclenchement et choisir une courbe adaptée à un moteur.', cap:'e3'},
    {t:'Régler un relais thermique à partir de la plaque signalétique.', cap:'e4'},
    {t:'Expliquer et appliquer le principe de la sécurité positive.', cap:'e6'},
    {t:'Contrôler un fusible, un relais thermique et un différentiel.', cap:'e2'},
    {t:'Câbler une chaîne d’arrêt d’urgence et en réaliser l’essai fonctionnel.', cap:null},
  ],
  controle:[
    ['Citer les trois types de défaut et l’organe qui protège de chacun.','e1'],
    ['Quelle est la différence entre un fusible gG et un fusible aM ?','e2'],
    ['Décrire le fonctionnement du déclencheur thermique d’un disjoncteur. Pourquoi son action est-elle retardée ?','e3'],
    ['Pourquoi ne met-on pas de courbe B sur un départ moteur ?','e3'],
    ['Sur quelle valeur règle-t-on un relais thermique ? Où la trouve-t-on ?','e4'],
    ['Que signifie la classe 10 d’un relais thermique ?','e4'],
    ['Qu’est-ce que surveille un différentiel ? De quoi ne protège-t-il pas ?','e5'],
    ['Citer quatre organes câblés en série dans la chaîne d’arrêt.','e6'],
    ['Que doit-il se passer quand on déverrouille un arrêt d’urgence ?','e6'],
    ['Un thermique déclenche trois fois par jour depuis une semaine. Citer trois causes possibles et l’ordre dans lequel les vérifier.','e4'],
  ],
});
})();
