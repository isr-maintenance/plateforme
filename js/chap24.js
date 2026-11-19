/* =========================================================
   CHAPITRE 2.4 — LE CONTACTEUR ET LE DÉMARRAGE DIRECT
   Contenu repris du cours d'Électricité 4e, pages 63 à 72.
   ========================================================= */
(function(){
const R3=Math.sqrt(3);
const Q24 = {
  d1q1:{q:"Qu'est-ce qui distingue vraiment un contacteur d'un gros relais ?",o:["Il est construit pour éteindre l'arc de coupure : contacts massifs en alliage d'argent, chambre de coupure, ressorts de pression","Il n'a pas de bobine","Il fonctionne sans ressort de rappel"],g:0,e:"Le principe est le même que le relais. Ce qui change, c'est l'arc : sur 15 A en triphasé, il peut faire fondre le métal des contacts.",r:'d1'},
  d1q2:{q:"On fait passer le courant d'un moteur par un contact auxiliaire. Conséquence ?",o:["Rien, tous les contacts se valent","Le contact est détruit en quelques secondes","Le moteur tourne plus lentement"],g:1,e:"Les contacts auxiliaires ne supportent que de faibles courants : ils sont faits pour le circuit de commande.",r:'d1'},
  d2q1:{q:"Sur un contacteur, la borne 4/T2 est…",o:["L'entrée du deuxième pôle","La sortie du deuxième pôle","Une borne de bobine"],g:1,e:"Chiffres impairs en entrée (en haut, côté réseau), chiffres pairs en sortie (en bas, vers le récepteur).",r:'d2'},
  d2q2:{q:"Un schéma montre un contact 95-96. Où le cherches-tu ?",o:["Sur le contacteur","Sur le relais thermique : le rang 9 est réservé aux protections contre les surcharges","Sur le bouton d'arrêt"],g:1,e:"Un contacteur ne porte jamais de 95-96 ni de 97-98.",r:'d2'},
  d2q3:{q:"Pourquoi peut-on se fier au repérage d'un contacteur, et pas à celui d'un relais enfichable ?",o:["Le repérage des contacteurs est normalisé, identique chez tous les constructeurs","Les contacteurs sont plus récents","On ne peut pas s'y fier non plus"],g:0,e:"Le brochage d'un relais varie d'un fabricant à l'autre ; celui d'un contacteur est normalisé.",r:'d2'},
  d3q1:{q:"Pourquoi le relais thermique F1 est-il placé après le contacteur, au plus près du moteur ?",o:["Pour surveiller le courant que le moteur absorbe réellement","Parce qu'il coupe le court-circuit","Pour être plus facile à régler"],g:0,e:"Q1 en tête pour consigner et protéger du court-circuit, KM1 pour commander, F1 au plus près du moteur.",r:'d3'},
  d3q2:{q:"Le circuit de commande d'un démarrage direct, par rapport à l'auto-maintien du 2.3, c'est…",o:["Un circuit totalement différent","Le même schéma, avec la bobine KM1, l'auto-maintien par le 13-14 du contacteur et le 95-96 du thermique en série","Le même schéma sans bouton d'arrêt"],g:1,e:"Trois différences seulement. Le 95-96 est NF pour la même raison que le bouton d'arrêt : si le fil casse, la machine s'arrête.",r:'d3'},
  d3q3:{q:"Pourquoi le circuit de commande a-t-il sa propre alimentation ?",o:["Pour que l'opérateur manœuvre en basse tension et que la commande reste opérationnelle quand la puissance est coupée","Pour consommer moins","Parce que la bobine est en 400 V"],g:0,e:"Souvent 230 V ou 24 V, par un transformateur de commande.",r:'d3'},
  d4q1:{q:"Un moteur porte « 230 V Δ / 400 V Y ». Sur le réseau 400 V de l'atelier, quelle tension reçoit chaque enroulement en étoile ?",o:["400 V","230 V : 400 ÷ √3","115 V"],g:1,e:"En étoile, chaque enroulement reçoit la tension entre phases divisée par √3.",r:'d4'},
  d4q2:{q:"Pourquoi la rangée du haut est-elle W2, U2, V2 et pas U2, V2, W2 ?",o:["C'est une fantaisie du constructeur","Ce décalage permet de réaliser le triangle avec trois barrettes droites","Pour que les fils soient plus courts"],g:1,e:"U1-W2, V1-U2, W1-V2 : trois barrettes bien verticales.",r:'d4'},
  d4q3:{q:"Un moteur prévu pour le triangle sur 400 V est couplé en étoile. Il tourne, mais cale dès qu'on le charge, et le thermique ne déclenche pas. Pourquoi ?",o:["Le thermique est défectueux","Chaque enroulement ne reçoit que 230 V : le couple tombe au tiers, et le courant reste faible","Une phase manque"],g:1,e:"Le couple dépend du carré de la tension : (230/400)² ≈ un tiers. On cherche la panne partout sauf à la plaque à bornes.",r:'d4'},
  d5q1:{q:"Un moteur a un courant nominal de 10 A. Que peut-il absorber au démarrage direct ?",o:["10 A","15 à 20 A","50 à 80 A"],g:2,e:"De cinq à huit fois le courant nominal, pendant quelques centaines de millisecondes à quelques secondes.",r:'d5'},
  d5q2:{q:"Une protection déclenche à chaque mise en marche, jamais en fonctionnement. Où regardes-tu d'abord ?",o:["La pointe de courant au démarrage, et le choix de la protection","La machine entraînée","Le bouton d'arrêt"],g:0,e:"C'est cette pointe qu'il faut regarder : elle explique les courbes C ou D, les fusibles aM, la classe du thermique.",r:'d5'},
};

/* ---------- 2.4.5 : les barrettes de la plaque à bornes ---------- */
const PL_LINKS={ h1:[60,50,130,50], h2:[130,50,200,50], v1:[60,50,60,120], v2:[130,50,130,120], v3:[200,50,200,120] };
const PL_MOT=[
  {k:'A', plaque:'230 V Δ / 400 V Y', ue:230},
  {k:'B', plaque:'400 V Δ / 690 V Y', ue:400},
];
function plaqueSVG(on){
  const B=[['W2',60,50],['U2',130,50],['V2',200,50],['U1',60,120],['V1',130,120],['W1',200,120]];
  return `<svg viewBox="0 0 260 190" role="img" aria-label="Plaque à bornes : barrettes ${Object.keys(on).filter(k=>on[k]).join(', ')||'aucune'}">
    <rect x="20" y="20" width="220" height="130" rx="10" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>
    ${Object.entries(PL_LINKS).map(([k,[x1,y1,x2,y2]])=>{ const h=y1===y2; const x=Math.min(x1,x2)+(h?12:-9), y=Math.min(y1,y2)+(h?-9:12), w=h?Math.abs(x2-x1)-24:18, hh=h?18:Math.abs(y2-y1)-24;
      return `<g data-plk="${k}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="5" fill="${on[k]?'var(--copper)':'transparent'}" stroke="${on[k]?'var(--copper)':'var(--line)'}" stroke-width="2" ${on[k]?'':'stroke-dasharray="4 4"'}/></g>`; }).join('')}
    ${B.map(([l,x,y])=>`<circle cx="${x}" cy="${y}" r="12" fill="#c9ccd2" stroke="var(--ink-2)" stroke-width="2"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="10" font-weight="800" fill="#141922">${l}</text>`).join('')}
    ${[['L1',60],['L2',130],['L3',200]].map(([l,x])=>`<line x1="${x}" y1="132" x2="${x}" y2="176" stroke="var(--live)" stroke-width="4"/><text x="${x+8}" y="176" font-size="10" font-weight="800" fill="var(--live)">${l}</text>`).join('')}
  </svg>`;
}
function mountPlaque(root){
  const box=root.querySelector('#plaque'), st=WS.plaque||(WS.plaque={m:0,on:{},res:null}), mem=DR().plaque||(DR().plaque={});
  const draw=()=>{
    const M=PL_MOT[st.m];
    box.innerHTML=`<div class="grid g2"><div><div class="figure" style="margin:0"><div style="max-width:340px;margin:0 auto">${plaqueSVG(st.on)}</div></div>
      <p class="tiny muted" style="text-align:center">Clique sur un emplacement pointillé pour poser ou retirer une barrette.</p></div>
      <div><div class="kicker" style="margin-bottom:6px">Moteur à raccorder sur le réseau 400 V</div>
      <div class="tasklist">${PL_MOT.map((x,i)=>`<button class="${mem[x.k]?'ok':''} ${i===st.m?'on':''}" data-plm="${i}">${mem[x.k]?'✓ ':''}Plaque « ${x.plaque} »</button>`).join('')}</div>
      <div class="row" style="margin-top:12px"><button class="btn primary sm" data-plok>Mettre sous tension</button><button class="btn sm ghost" data-plclr>Retirer les barrettes</button></div>
      ${st.res?`<div class="fb ${st.res.ok?'good':'wrong'}" style="margin-top:10px">${st.res.msg}</div>`:''}
      ${PL_MOT.every(x=>mem[x.k])?'<div class="fb good" style="margin-top:10px"><b>Les deux moteurs sont correctement couplés.</b></div>':''}</div></div>`;
    box.querySelectorAll('[data-plk]').forEach(g=>g.onclick=()=>{ st.on[g.dataset.plk]=!st.on[g.dataset.plk]; st.res=null; draw(); });
    box.querySelectorAll('[data-plm]').forEach(b=>b.onclick=()=>{ st.m=+b.dataset.plm; st.on={}; st.res=null; draw(); });
    box.querySelector('[data-plclr]').onclick=()=>{ st.on={}; st.res=null; draw(); };
    box.querySelector('[data-plok]').onclick=()=>{
      const on=Object.keys(PL_LINKS).filter(k=>st.on[k]).sort().join(','), star=on==='h1,h2', delta=on==='v1,v2,v3';
      if(!star && !delta){ st.res={ok:false,msg:on?'<b>Ni étoile, ni triangle.</b> L’étoile : une seule barrette qui relie les trois bornes du haut. Le triangle : trois barrettes verticales. Tout autre montage met des phases en court-circuit ou laisse un enroulement en l’air.':'Aucune barrette : les enroulements ne sont pas couplés.'}; draw(); return; }
      const ue = star ? 400/R3 : 400;
      if(Math.abs(ue-M.ue)<5){ mem[M.k]=true; save(); if(PL_MOT.every(x=>mem[x.k])) exSet('d4cpl');
        st.res={ok:true,msg:`<b>${star?'Étoile':'Triangle'} : correct.</b> Chaque enroulement reçoit ${star?'400 ÷ √3 ≈ 230':'400'} V, exactement la tension pour laquelle il est prévu.`}; }
      else if(delta) st.res={ok:false,msg:'<b>Le moteur est détruit !</b> En triangle sur 400 V, chaque enroulement prévu pour 230 V reçoit 400 V. Le courant s’emballe, l’isolant brûle en quelques minutes — souvent avant que le thermique ne déclenche.'};
      else st.res={ok:false,msg:'<b>Rien ne brûle, mais…</b> En étoile, chaque enroulement prévu pour 400 V ne reçoit que 230 V. Le moteur tourne avec un tiers de son couple : il cale dès qu’on le charge, et le thermique ne déclenche pas.'};
      draw(); };
  };
  draw();
}

defChapter({
  num:'2.4', titre:'Le contacteur et le démarrage direct', tp:'É04',
  evalInfo:'L’évaluation formative 2.4 (26 points, seuil 19) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant le TP É04',
  Q:Q24,
  caps:[
    {id:'d1', sec:'2.4.1', t:'Du relais au contacteur', pdf:63, quiz:['d1q1','d1q2'], ex:{keys:['d1sort'], lbl:'Contact principal ou auxiliaire'},
     body:()=>`<p class="lead">Le contacteur fonctionne <b>exactement comme le relais</b> du chapitre 2.3 : bobine A1-A2, noyau, armature, ressort de rappel, contacts qui basculent tous ensemble. Tout ce que tu sais du relais s'applique.</p>
      <h3>Ce qui change : l'arc de coupure</h3>
      <p>Quand on ouvre un circuit parcouru par du courant, celui-ci ne s'arrête pas net : il continue un court instant à travers l'air, sous forme d'<b>arc électrique</b>. Sur un relais qui commute un demi-ampère, l'arc est invisible. Sur un contacteur qui coupe quinze ampères en triphasé, il peut atteindre plusieurs millimètres et faire fondre le métal des contacts. Le contacteur est construit pour l'éteindre.</p>
      ${tbl(['Dispositif','Ce qu’il fait'],[['Contacts massifs en alliage d’argent','Résistent à l’échauffement et à l’érosion de l’arc'],['Chambre de coupure','Étire l’arc, le fractionne et le refroidit pour l’éteindre au plus vite'],['Ressorts de pression de contact','Force importante sur chaque contact fermé : moins d’échauffement'],['Coupure simultanée des trois phases','Les trois contacts principaux sont solidaires de la même armature']])}
      <h3 style="margin-top:16px">Les deux familles de contacts</h3>
      ${tbl(['','Rôle'],[['Contacts principaux','Trois, parfois quatre. Ils alimentent le récepteur : c’est par eux que passe le courant du moteur. Circuit de puissance.'],['Contacts auxiliaires','Petits contacts pour le circuit de commande : auto-maintien, signalisation, verrouillage, information vers un automate. Faibles courants seulement.']])}
      <div class="note bad" style="margin-top:14px"><b>Ne jamais confondre</b>Faire passer le courant d'un moteur par un contact auxiliaire le détruit en quelques secondes. Utiliser un contact principal pour une signalisation fonctionne, mais gaspille un contact précieux.</div>
      ${exbox('d1box','Contact principal ou auxiliaire ?','Quel contact du contacteur utilises-tu pour chaque usage ?')}`,
     mount:root=>mountSortW(root.querySelector('#d1box'),'d1sort',{cats:[['p','Principal'],['a','Auxiliaire']],items:[['Alimenter les trois phases du moteur','p'],['Assurer l’auto-maintien','a'],['Allumer le voyant « en marche »','a'],['Empêcher un second contacteur de coller','a'],['Alimenter une résistance chauffante de 4 kW','p'],['Informer l’automate que la machine tourne','a']],ok:'Juste. Le courant du récepteur passe toujours par les contacts principaux.'})},
    {id:'d2', sec:'2.4.2', t:'Le repérage des bornes', pdf:64, quiz:['d2q1','d2q2','d2q3'], ex:{keys:['d2rep'], lbl:'Lire les repères'},
     body:()=>`<p class="lead">Contrairement au relais enfichable, le contacteur suit un <b>repérage normalisé</b>, identique chez tous les constructeurs.</p>
      ${tbl(['Pôle','Entrée','Sortie'],[['Premier pôle','1 — ou 1/L1','2 — ou 2/T1'],['Deuxième pôle','3 — ou 3/L2','4 — ou 4/T2'],['Troisième pôle','5 — ou 5/L3','6 — ou 6/T3']])}
      <p class="small">Chiffres <b>impairs en entrée</b>, chiffres <b>pairs en sortie</b>. L'alimentation arrive par le haut, le départ vers le récepteur sort par le bas. La bobine : <b>A1 et A2</b>, sa tension est inscrite sur l'appareil (24 V continu, 230 V ou 400 V alternatif).</p>
      <h3>Les contacts auxiliaires</h3>
      <p class="small">La règle des deux chiffres : les <b>dizaines</b> donnent le numéro d'ordre du contact, les <b>unités</b> sa fonction — 3-4 pour une fermeture, 1-2 pour une ouverture.</p>
      ${tbl(['Repère','Type','Lecture'],[['13 – 14','Fermeture','Premier contact auxiliaire, à fermeture : celui de l’auto-maintien'],['21 – 22','Ouverture','Deuxième contact, à ouverture : verrouillage entre deux contacteurs'],['31 – 32','Ouverture','Troisième contact, à ouverture'],['43 – 44','Fermeture','Quatrième contact, à fermeture : souvent le voyant « en marche »']])}
      <div class="note warn" style="margin-top:14px"><b>Le rang 9 n'appartient pas au contacteur</b>Un contacteur ne porte jamais de 95-96 ni de 97-98 : le rang 9 est réservé aux relais de protection contre les surcharges. Et c'est bien le 95-96 du thermique qui vient couper la bobine du contacteur au déclenchement.</div>
      <p class="small">Quand les contacts intégrés ne suffisent pas, on clipse un <b>bloc additionnel</b>, frontal ou latéral — il existe aussi des blocs temporisés.</p>
      ${exbox('d2box','Lis chaque repère','Que désigne-t-il ?')}`,
     mount:root=>mountSortW(root.querySelector('#d2box'),'d2rep',{cats:[['pe','Puissance entrée'],['ps','Puissance sortie'],['bo','Bobine'],['no','Aux. NO'],['nf','Aux. NF'],['th','Relais thermique']],items:[
       ['3/L2','pe'],['6/T3','ps'],['A2','bo'],['13 – 14','no'],['21 – 22','nf'],['53 – 54','no','Unités 3-4 : fermeture. Le 5 n’est que le numéro d’ordre.'],['61 – 62','nf','Unités 1-2 : ouverture.'],['95 – 96','th','Rang 9 : protection contre les surcharges.']],ok:'Juste. Les unités donnent la fonction, les dizaines le numéro d’ordre.'})},
    {id:'d3', sec:'2.4.3-2.4.4', t:'Circuit de puissance et circuit de commande', pdf:66, quiz:['d3q1','d3q2','d3q3'], ex:{keys:['d3ord'], lbl:'L’ordre des organes'},
     body:()=>`<p class="lead">Entre l'arrivée du réseau et le moteur, on trouve toujours les mêmes fonctions, <b>toujours dans le même ordre</b>.</p>
      ${tbl(['Organe','Fonction','Pourquoi à cette place'],[['Q1 — sectionneur ou disjoncteur','Séparer l’installation et la protéger du court-circuit','En tête, pour consigner tout le départ et protéger tout ce qui suit'],['KM1 — contacteur','Établir et couper l’alimentation du moteur sur commande','Après la protection : il ne doit jamais être le dernier rempart en cas de défaut'],['F1 — relais thermique','Protéger le moteur de la surcharge prolongée','Au plus près du moteur, pour surveiller le courant qu’il absorbe réellement'],['M1 — moteur','Transformer l’énergie électrique en mouvement','En fin de chaîne']])}
      ${exbox('d3box','Remets les organes dans l’ordre','Du réseau vers le moteur.')}
      <div class="note bad"><b>Règle absolue</b>Le conducteur de protection va directement de la barrette de terre à la borne de masse du moteur. Il ne traverse ni sectionneur, ni contacteur, ni thermique, ni fusible : une machine dont la terre est ouverte devient dangereuse au premier défaut d'isolement.</div>
      <h3>Ce qu'on soigne au câblage</h3>
      <ul class="ctrlq"><li>La section des conducteurs de puissance est calculée pour le courant du moteur.</li><li>Les bornes de puissance se serrent au couple prescrit, au tournevis dynamométrique.</li><li>Chaque conducteur est repéré à ses deux extrémités avant d'être connecté.</li><li>Puissance et commande dans des goulottes séparées.</li><li>Les sorties du thermique vers le moteur sont repérées U, V et W, dans l'ordre : c'est cet ordre qui fixe le sens de rotation.</li></ul>
      <h3>Le circuit de commande</h3>
      <p>Il a <b>sa propre alimentation</b>, souvent 230 V ou 24 V par un transformateur de commande. Son schéma est celui de l'auto-maintien du chapitre 2.3, à trois différences près :</p>
      <ul class="ctrlq"><li>la bobine est celle du contacteur <b>KM1</b> ;</li><li>le contact d'auto-maintien est le contact auxiliaire <b>13-14</b> du contacteur ;</li><li>le contact de défaut du relais thermique, <b>95-96</b>, de type NF, est inséré en série dans la branche.</li></ul>
      ${tbl(['Usage','Contact employé'],[['Auto-maintien','Un contact NO, typiquement 13-14'],['Voyant « machine en marche »','Un second contact NO, par exemple 43-44'],['Voyant « machine à l’arrêt »','Un contact NF, par exemple 21-22'],['Verrouillage d’un autre contacteur','Un contact NF'],['Information vers un automate','Un contact NO ou NF libre']])}
      <p class="small">Le relais thermique a deux contacts : le <b>95-96</b> (NF) en série dans la commande, qui fait retomber le contacteur au déclenchement, et le <b>97-98</b> (NO) pour un voyant de défaut ou un automate.</p>`,
     mount:root=>mountOrderW(root.querySelector('#d3box'),'d3ord',{items:['Q1 — sectionneur ou disjoncteur','KM1 — contacteur','F1 — relais thermique','M1 — moteur'],shuffle:[2,3,0,1],ok:'Q1 → KM1 → F1 → M1.',hint:'La protection en tête, le thermique au plus près du moteur.'})},
    {id:'d4', sec:'2.4.5', t:'La plaque à bornes : étoile ou triangle', pdf:67, quiz:['d4q1','d4q2','d4q3'], ex:{keys:['d4cpl'], lbl:'Coupler deux moteurs'},
     body:()=>`<p class="lead">Trois enroulements, deux extrémités chacun : <b>six bornes</b>, U1, V1, W1 pour les débuts et U2, V2, W2 pour les fins.</p>
      <p>La rangée du bas porte U1, V1, W1 ; celle du haut porte <b>W2, U2, V2</b> — dans cet ordre décalé, qui permet de faire le triangle avec trois barrettes bien droites.</p>
      ${tbl(['','Étoile (Y)','Triangle (Δ)'],[['Les barrettes','Une seule barrette relie les trois bornes du haut : W2, U2 et V2','Trois barrettes verticales : U1-W2, V1-U2 et W1-V2'],['L’alimentation','Sur U1, V1, W1','Sur U1, V1, W1'],['Tension par enroulement','400 ÷ √3 = 230 V sur un réseau 400 V','400 V sur un réseau 400 V']])}
      <h3 style="margin-top:16px">La plaque signalétique commande</h3>
      <p>Elle indique toujours deux tensions : <b>la plus faible pour le triangle, la plus élevée pour l'étoile</b>. La tension prévue pour chaque enroulement, c'est celle du triangle.</p>
      ${tbl(['Plaque','Sur un réseau 400 V','Pourquoi'],[['230 V Δ / 400 V Y','Étoile','Enroulements prévus pour 230 V : en étoile sur 400 V, ils reçoivent bien 230 V'],['400 V Δ / 690 V Y','Triangle','Enroulements prévus pour 400 V : en triangle sur 400 V, ils reçoivent bien 400 V']])}
      ${exbox('plaque','Pose les barrettes','Pour chaque moteur, lis la plaque, pose les barrettes, puis mets sous tension.')}
      ${terrain('Le rapport √3 entre les deux couplages décide, à chaque remplacement de moteur, entre une machine qui repart et une machine détruite. L’erreur inverse est plus sournoise : un moteur prévu pour le triangle, couplé en étoile, tourne… avec un tiers de son couple. Il cale dès qu’on le charge et le thermique ne déclenche pas.')}
      <h3>Les gestes de raccordement</h3>
      <ol class="ctrlq"><li>Consigner avant d'ouvrir la boîte à bornes.</li><li>Photographier la position des barrettes avant de toucher à quoi que ce soit.</li><li>Lire la plaque signalétique et déterminer le couplage requis.</li><li>Placer et serrer les barrettes, puis raccorder les trois phases sur U1, V1 et W1.</li><li>Raccorder le conducteur de protection sur la borne de masse.</li><li>Vérifier le serrage, refermer, contrôler l'étanchéité du presse-étoupe.</li></ol>`,
     mount:mountPlaque},
    {id:'d5', sec:'2.4.6', t:'Le démarrage direct', pdf:69, quiz:['d5q1','d5q2'], ex:{keys:['d5dr'], lbl:'Calculs du démarrage'},
     body:()=>`<p class="lead">Démarrer en direct, c'est appliquer <b>d'un seul coup la pleine tension</b> au moteur à l'arrêt : un contacteur, et rien d'autre.</p>
      <p>À l'instant du démarrage, le rotor est immobile et le moteur absorbe <b>de cinq à huit fois son courant nominal</b>, pendant quelques centaines de millisecondes à quelques secondes. Un moteur de 10 A nominal peut absorber 60 à 80 A au démarrage.</p>
      ${tbl(['Conséquence','Effet concret'],[['Chute de tension sur le réseau','Les autres machines voient leur tension baisser un instant ; l’éclairage cligne'],['Contrainte mécanique','Couple appliqué brutalement : à-coup sur la transmission'],['Contrainte sur les protections','Elles doivent laisser passer la pointe sans déclencher, tout en protégeant réellement en cas de défaut']])}
      ${terrain('Ce facteur de cinq à huit est derrière la moitié des choix d’un départ moteur : courbe C ou D et jamais B, fusible aM et non gG, classe du relais thermique, éclairage qui cligne, câble qui ne tient pas au démarrage. Quand une protection déclenche à la mise en marche mais jamais en fonctionnement, c’est cette pointe qu’il faut regarder — pas la machine.')}
      <p class="small">Le démarrage direct convient aux moteurs de faible et moyenne puissance, sur des machines qui démarrent à vide ou sous faible charge. Au-delà : étoile-triangle, démarreur progressif, variateur — vus les années suivantes. Le réglage du thermique et la courbe du disjoncteur sont traités au chapitre 2.5.</p>
      ${exbox('d5box','Drill — le démarrage direct','Courant de démarrage : de 5 à 8 fois le courant nominal. Puissance triphasée : P = √3 × U × I × cos φ.')}
      <div class="note" style="margin-top:14px"><b>★ Dessin</b>Tracer le schéma de puissance d'un démarrage direct : chapitre 5 du Cours de dessin électrique, avant le TP É04.</div>`,
     mount:root=>mountDrillW(root.querySelector('#d5box'),'d5dr',{rows:[
       ...[4,6.4,11,2.5,8.2].flatMap(In=>[{q:`In = ${fr(In,1)} A : pointe minimale (5 × In)`,unit:'A',ans:5*In},{q:'… pointe maximale (8 × In)',unit:'A',ans:8*In}]),
       {q:'Moteur 400 V · 12 A · cos φ 0,85 : puissance absorbée',unit:'W',ans:R3*400*12*0.85},
       {q:'Moteur 400 V · 3,5 A · cos φ 0,78 : puissance absorbée',unit:'W',ans:R3*400*3.5*0.78}]})},
  ],
  prereq:[
    {t:'Expliquer pourquoi un contacteur n’est pas un simple gros relais.', cap:'d1'},
    {t:'Lire le repérage normalisé des bornes de puissance et des contacts auxiliaires.', cap:'d2'},
    {t:'Décrire l’ordre des organes d’un circuit de puissance et le rôle de chacun.', cap:'d3'},
    {t:'Tracer et câbler le circuit de puissance d’un démarrage direct.', cap:null},
    {t:'Reconnaître les six bornes d’un moteur et réaliser le couplage selon la plaque et le réseau.', cap:'d4'},
    {t:'Expliquer ce qu’est le courant de démarrage et ses conséquences.', cap:'d5'},
  ],
  controle:[
    ['Pourquoi un contacteur ne se réduit-il pas à un relais de grande taille ? Citer deux dispositifs propres au contacteur.','d1'],
    ['Quelle est la différence entre un contact principal et un contact auxiliaire ?','d1'],
    ['Citer dans l’ordre les quatre organes d’un circuit de puissance de démarrage direct et le rôle de chacun.','d3'],
    ['Pourquoi le relais thermique est-il placé après le contacteur et non avant ?','d3'],
    ['Pourquoi le conducteur de protection ne traverse-t-il aucun organe de coupure ?','d3'],
    ['À quoi servent respectivement les contacts 95-96 et 97-98 d’un relais thermique ?','d3'],
    ['Combien un moteur triphasé possède-t-il d’enroulements et de bornes ? Comment sont-elles repérées ?','d4'],
    ['Sur un contacteur, il reste libres les contacts 43-44 et 21-22. Quel contact pour un voyant « en marche », lequel pour un voyant « à l’arrêt » ?','d3'],
  ],
});
})();
