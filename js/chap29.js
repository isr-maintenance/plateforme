/* =========================================================
   CHAPITRE 2.9 — LE MOTEUR, LA REMISE EN SERVICE ET LE RAPPORT
   Contenu repris du cours d'Électricité 4e, pages 115 à 124.
   ========================================================= */
(function(){
const Q29 = {
  i1q1:{q:"Pourquoi le rotor ne peut-il jamais tourner à la vitesse du champ ?",o:["Les roulements le freinent","À la même vitesse, plus de variation, plus de courant induit, plus de couple","Le réseau ne le permet pas"],g:1,e:"Il tourne toujours un peu moins vite : c'est le glissement, d'où le mot asynchrone.",r:'i1'},
  i1q2:{q:"Un moteur tourne à 1 435 tr/min. Combien a-t-il de pôles ?",o:["2","4","6"],g:1,e:"La seule vitesse de synchronisme juste au-dessus est 1 500 tr/min : quatre pôles.",r:'i1'},
  i1q3:{q:"On monte un deux pôles à la place d'un quatre pôles. Conséquence ?",o:["Aucune","La vitesse de la machine entraînée double","Le moteur chauffe un peu"],g:1,e:"Le nombre de pôles est une caractéristique à respecter absolument.",r:'i1'},
  i2q1:{q:"Quelle mention lit-on en premier sur une plaque ?",o:["La masse","Les tensions avec les deux couplages","Le cos φ"],g:1,e:"Elles décident du couplage à réaliser en fonction du réseau.",r:'i2'},
  i3q1:{q:"Le conducteur de protection : dans quel ordre le déconnecte-t-on et le reconnecte-t-on ?",o:["Premier déconnecté, dernier reconnecté","Dernier déconnecté, premier reconnecté","Peu importe"],g:1,e:"La masse du moteur reste reliée à la terre le plus longtemps possible.",r:'i3'},
  i3q2:{q:"Pourquoi mesure-t-on l'isolement d'un moteur neuf avant de le poser ?",o:["C'est obligatoire pour la garantie","Un moteur stocké longtemps dans un local humide peut être hors service à la sortie du carton","Pour le roder"],g:1,e:"Mieux vaut le savoir avant de le monter.",r:'i3'},
  i4q1:{q:"Le moteur remplacé tourne à l'envers. Que fais-tu ?",o:["Je permute les trois phases","Consigné, je permute deux phases quelconques au bornier du moteur — jamais en amont du thermique","Je permute une phase et le PE"],g:1,e:"Et on ne fait le test de rotation qu'après s'être assuré qu'une rotation inverse ne casse rien : pompe, vis sans fin, compresseur.",r:'i4'},
  i4q2:{q:"Après remplacement, la pince indique 7,1 A, 7,0 A et 5,2 A. Conclusion ?",o:["Normal","Déséquilibre : on vérifie les serrages, les tensions des phases et le bobinage","Le moteur est trop puissant"],g:1,e:"Les trois courants doivent être très proches.",r:'i4'},
  i5q1:{q:"Pourquoi remettre l'utilisateur dans la boucle ?",o:["Par politesse","Il connaît le comportement normal de la machine et entend un bruit inhabituel avant tout appareil de mesure","Pour qu'il signe"],g:1,e:"C'est une source d'information.",r:'i5'},
  i5q2:{q:"Le même contacteur a été remplacé trois fois en un an. Que révèle l'historique ?",o:["Trois pannes sans lien","Un appareil sous-dimensionné pour sa cadence de manœuvres","Un mauvais technicien"],g:1,e:"Ce qui n'est pas encodé n'existe pas.",r:'i5'},
};
function mountAsync(root){
  const box=root.querySelector('#asyn'), st=WS.asyn||(WS.asyn={p:4,n:1435});
  const html=()=>{ const pp=st.p/2, ns=60*50/pp, g=(ns-st.n)/ns*100;
    return `<div class="grid g2"><div><div class="kicker" style="margin-bottom:6px">Nombre de pôles</div><div class="seg">${[2,4,6,8].map(p=>`<button class="${st.p===p?'on':''}" data-ap="${p}">${p} pôles</button>`).join('')}</div>
      <label class="small" style="display:block;margin:12px 0"><b data-anl>Vitesse réelle du rotor : ${st.n} tr/min</b><input type="range" min="${Math.round(ns*0.85)}" max="${ns}" step="5" value="${Math.min(st.n,ns)}" data-an style="width:100%"></label></div>
      <div data-ares><div class="formula"><div class="f" style="font-size:15px">ns = 60 × 50 ÷ ${pp} = ${fr(ns,0)} tr/min</div><div class="f" style="font-size:15px;margin-top:6px">g = (${fr(ns,0)} − ${st.n}) ÷ ${fr(ns,0)} = ${fr(g,1)} %</div></div>
      <p class="small">${g<=0.01?'<b style="color:var(--bad)">À la vitesse du champ, plus de courant induit, plus de couple : impossible en fonctionnement.</b>':g<8?'Un glissement de quelques pour cent : un moteur normalement chargé.':'Glissement élevé : le moteur est très chargé, ou en difficulté.'}</p></div></div>`; };
  const draw=()=>{ const ns=60*50/(st.p/2); if(st.n>ns||st.n<ns*0.85) st.n=Math.round(ns*0.957/5)*5; box.innerHTML=html();
    box.querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>{ st.p=+b.dataset.ap; st.n=Math.round(60*50/(st.p/2)*0.957/5)*5; draw(); });
    box.querySelector('[data-an]').oninput=e=>{ st.n=+e.target.value; const y=document.createElement('div'); y.innerHTML=html(); box.querySelector('[data-ares]').innerHTML=y.querySelector('[data-ares]').innerHTML; box.querySelector('[data-anl]').textContent=y.querySelector('[data-anl]').textContent; };
  };
  draw();
}
defChapter({
  num:'2.9', titre:'Le moteur, la remise en service et le rapport', tp:'É10',
  evalInfo:'L’évaluation formative 2.9 (42 points, seuil 30) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant le TP É10',
  Q:Q29,
  caps:[
    {id:'i1', sec:'2.9.1', t:'Le principe du moteur asynchrone', pdf:115, quiz:['i1q1','i1q2','i1q3'], ex:{keys:['i1ns','i1g'], lbl:'Synchronisme et glissement'},
     body:()=>`<p class="lead">Les trois enroulements du stator, à 120° les uns des autres et alimentés par trois courants décalés dans le temps, produisent un <b>champ magnétique qui tourne</b> à vitesse constante.</p>
      <p>Le rotor est une cage de barres conductrices. Le champ tournant y induit des courants, qui créent leur propre champ : les deux champs s'attirent, le rotor est entraîné. Mais il ne peut jamais rattraper le champ — sinon plus de variation, plus de courant induit, plus de couple. Ce retard, c'est le <b>glissement</b>, d'où le mot <b>asynchrone</b>.</p>
      ${formula('ns = 60 × f ÷ p','ns en tr/min · f la fréquence du réseau en Hz · p le nombre de paires de pôles (la moitié du nombre de pôles)')}
      ${tbl(['Pôles','Paires','Synchronisme à 50 Hz','En charge, typiquement'],[['2','1','3 000 tr/min','≈ 2 850 tr/min'],['4','2','1 500 tr/min','≈ 1 435 tr/min'],['6','3','1 000 tr/min','≈ 950 tr/min'],['8','4','750 tr/min','≈ 715 tr/min']])}
      ${formula('g = (ns − n) ÷ ns','n la vitesse réelle du rotor — le résultat s’exprime en pour cent')}
      ${exbox('asyn','Synchronisme et glissement')}
      ${terrain('Plaque illisible après quinze ans en milieu humide ? La vitesse mesurée au tachymètre donne le nombre de pôles — à respecter absolument : un deux pôles à la place d’un quatre pôles double la vitesse de la machine entraînée. Et un moteur prévu pour 60 Hz tourne 20 % moins vite sur notre réseau.')}
      ${exbox('i1a','Drill — la vitesse de synchronisme')}
      ${exbox('i1b','Drill — le glissement','Trouve d’abord ns, puis g = (ns − n) ÷ ns, en pour cent.')}`,
     mount:root=>{ mountAsync(root);
       mountDrillW(root.querySelector('#i1a'),'i1ns',{rows:[2,4,6,8].map(p=>({q:`${p} pôles · 50 Hz → ns`,unit:'tr/min',ans:3000/(p/2),tol:0.001})).concat([{q:'6 pôles · 60 Hz → ns',unit:'tr/min',ans:1200,tol:0.001,hint:'60 × 60 ÷ 3.'}])});
       (v=>mountDrillW(root.querySelector('#i1b'),'i1g',{rows:[[4,v.a],[2,v.b],[6,v.c],[4,v.d],[2,v.e],[6,v.f]].map(([p,n])=>{ const ns=3000/(p/2); return {q:`${p} pôles · ${n.toLocaleString('fr-BE')} tr/min → g`,unit:'%',ans:(ns-n)/ns*100,tol:0,abs:0.051}; }),hint:'Exemple : (1 500 − 1 440) ÷ 1 500 = 0,04, soit 4 %.'}))(vx('i1g',{a:[1440,1425,1460],b:[2880,2900,2860],c:[960,950,970],d:[1455,1410,1470],e:[2850,2830,2910],f:[940,955,925]}));
     }},
    {id:'i2', sec:'2.9.2', t:'La plaque signalétique', pdf:116, quiz:['i2q1'], ex:{keys:['i2sort'], lbl:'Lire la plaque'},
     body:()=>`${tbl(['Mention','Ce qu’elle sert à décider'],[['kW','La puissance mécanique sur l’arbre — pas la puissance absorbée au réseau'],['V, avec les deux couplages','Le couplage à réaliser selon le réseau. La première chose à lire.'],['A, avec les deux valeurs','Le réglage du relais thermique, pour le couplage réalisé'],['Hz','La fréquence prévue. Un moteur 60 Hz en 50 Hz tourne plus lentement et chauffe.'],['tr/min','La vitesse en charge : le nombre de pôles, la compatibilité avec la transmission'],['cos φ','Le facteur de puissance, pour calculer la puissance absorbée'],['Classe d’isolation','La température maximale que l’isolant des bobinages supporte'],['IP et IK','L’étanchéité et la résistance aux chocs — à respecter au remplacement'],['Classe de rendement IE','Un moteur de remplacement ne descend jamais sous la classe d’origine'],['Masse','Elle conditionne le moyen de levage à prévoir']])}
      ${exbox('i2box','Quelle mention de la plaque lis-tu pour…')}`,
     mount:root=>mountSortW(root.querySelector('#i2box'),'i2sort',{cats:[['v','V (couplages)'],['a','A'],['n','tr/min'],['c','cos φ'],['ie','Classe IE'],['m','Masse']],items:[['Choisir étoile ou triangle sur le réseau 400 V','v'],['Régler le relais thermique','a'],['Trouver le nombre de pôles','n'],['Calculer la puissance absorbée au réseau','c'],['Vérifier que le moteur de remplacement n’est pas moins efficace','ie'],['Prévoir le moyen de levage','m']],ok:'Juste.'})},
    {id:'i3', sec:'2.9.3', t:'Remplacer un moteur', pdf:117, quiz:['i3q1','i3q2'], ex:{keys:['i3ord'], lbl:'La repose, dans l’ordre'},
     body:()=>`<h3 style="margin-top:0">Préparer</h3>
      <ul class="ctrlq"><li>Analyse de risques de dernière minute, sur place.</li><li>Consigner électriquement, et vérifier que la partie mécanique est immobilisée si la charge peut redescendre ou tourner par inertie.</li><li>Relever la plaque du moteur défectueux et sélectionner l'équivalent au catalogue.</li><li>S'assurer que le moyen de levage est disponible avant de commencer.</li></ul>
      <h3>Déposer</h3>
      <ul class="ctrlq"><li>Photographier : boîte à bornes ouverte, position des barrettes, orientation du moteur.</li><li>Repérer les conducteurs avant de les déconnecter.</li><li>Déconnecter, en terminant par le <b>conducteur de protection</b>.</li><li>Faire libérer la liaison mécanique (cours de Mécanique).</li><li>Déposer le moteur en le soutenant avant de retirer la dernière fixation.</li></ul>
      <h3>Reposer</h3>
      ${exbox('i3box','Remets la repose dans l’ordre','Le conducteur de protection est le dernier déconnecté et le premier reconnecté.')}`,
     mount:root=>mountOrderW(root.querySelector('#i3box'),'i3ord',{items:['Vérifier que le nouveau moteur correspond : puissance, vitesse, tensions, courants, IP, IK, IE, hauteur d’axe, bout d’arbre','Mesurer l’isolement du moteur neuf','Positionner et fixer le moteur','Réaliser le couplage selon la plaque et le réseau','Raccorder le PE en premier, puis les trois phases sur U1, V1, W1','Régler le relais thermique pour le couplage réalisé','Refermer la boîte à bornes et contrôler le presse-étoupe'],shuffle:[3,6,1,4,0,5,2],ok:'La repose, dans l’ordre.'})},
    {id:'i4', sec:'2.9.4', t:'Les contrôles avant remise en service', pdf:118, quiz:['i4q1','i4q2'], ex:{keys:['i4sort'], lbl:'Hors tension ou sous tension'},
     body:()=>`${tbl(['Contrôle','Comment','Attendu'],[['Visuel','Outils retirés, carters remontés, zone dégagée','Rien ne traîne'],['Serrage','Chaque borne au couple prescrit','Aucune borne ne bouge à la traction'],['Isolement','Mégohmmètre, moteur déconnecté','Valeur conforme à la notice'],['Continuité du PE','Ohmmètre entre la barrette de terre et la carcasse','Bien moins de 1 Ω'],['Ordre des phases','Contrôleur de phases','Ordre correct avant de faire tourner'],['Rotation manuelle','À la main, moteur consigné','L’arbre tourne librement, sans point dur'],['Sous tension, à vide','Pince ampèremétrique','Courant à vide cohérent, phases équilibrées, bon sens de rotation'],['Sous tension, en charge','Pince et thermomètre','Courant sous le nominal, pas d’échauffement anormal']])}
      <div class="note warn" style="margin-top:14px"><b>Le sens de rotation</b>S'il est inversé, on permute deux phases quelconques sur le bornier du moteur — jamais trois, jamais en amont du thermique. Et on ne teste qu'après s'être assuré qu'une rotation à l'envers ne casse rien : pompe, vis sans fin ou compresseur peuvent être détruits en quelques secondes.</div>
      ${exbox('i4box','Hors tension ou sous tension ?','On ne met sous tension qu’une fois tous les contrôles hors tension réussis.')}`,
     mount:root=>mountSortW(root.querySelector('#i4box'),'i4sort',{cats:[['h','Hors tension'],['s','Sous tension']],items:[['Mesure d’isolement au mégohmmètre','h'],['Continuité du PE','h'],['Rotation à la main','h'],['Ordre des phases au contrôleur','h','Le contrôleur se raccorde au plus près du moteur, avant de le faire tourner.'],['Courant à vide et équilibre des phases','s'],['Courant en charge et échauffement','s'],['Reprise du serrage des bornes','h']],ok:'Juste : six contrôles hors tension, puis deux sous tension.'})},
    {id:'i5', sec:'2.9.5-2.9.6', t:'L’utilisateur et le rapport d’intervention', pdf:119, quiz:['i5q1','i5q2'], ex:{keys:['i5sort'], lbl:'Remplir un rapport'},
     body:()=>`<p class="lead">Celui qui conduit la machine tous les jours sait comment elle se comporte normalement. Le remettre dans la boucle n'est pas une politesse : <b>c'est une source d'information</b>.</p>
      <ul class="ctrlq"><li>Comment la machine se comportait-elle avant la panne ? Depuis combien de temps ?</li><li>Y avait-il des signes annonciateurs : bruit, odeur, vibration, ralentissement, déclenchements ?</li><li>La panne survient-elle toujours dans les mêmes conditions ?</li><li>Quelque chose a-t-il changé récemment : produit, cadence, réglage, autre intervention ?</li><li>Après remise en service : est-ce que cela se comporte comme d'habitude ?</li></ul>
      <p class="small">Puis on contrôle le bon fonctionnement : analyse fonctionnelle étape par étape, appareils intégrés comparés aux consignes, capteurs sur l'interface homme-machine, boucles de régulation — et on accompagne la machine jusqu'à la production optimale.</p>
      ${tbl(['Rubrique','Contenu'],[['Identification','Date, heures de début et de fin, machine et repère, n° du bon de travail, intervenant'],['Constat','Ce qui a été observé à l’arrivée, et ce que l’utilisateur a signalé'],['Diagnostic','La cause retenue, et sur quels éléments on l’a fondée'],['Intervention','Ce qui a été fait, dans l’ordre ; références ancienne et nouvelle'],['Mesures','Les valeurs avant et après, avec leurs unités'],['Réglages','Les valeurs de réglage appliquées'],['Consommables','Pièces, fluides, fournitures'],['Temps','Durée d’intervention et durée d’arrêt de la machine'],['Suites à donner','Ce qui reste à faire, à surveiller, ce qui a été constaté sans être traité']])}
      <p class="small" style="margin-top:12px">En gestion informatisée de la maintenance, l'historique révèle les pannes qui reviennent, les temps justifient les investissements, les consommables déclenchent le réapprovisionnement. <b>Ce qui n'est pas encodé n'existe pas.</b> Un défaut de sécurité, une pièce manquante, une dégradation qui va provoquer un nouvel arrêt : on les signale immédiatement et oralement au responsable, en plus de les écrire.</p>
      ${exbox('i5box','Dans quelle rubrique du rapport ?','Remplacement d’un moteur de convoyeur dont l’enroulement était en défaut.')}
      <div class="note" style="margin-top:14px"><b>★ Dessin</b>Le croquis à main levée et la mise à jour du schéma (as built) : <button class="revoir" data-goto="i6">Dessin 15 →</button>, à la fin de ce chapitre, avant le TP É10.</div>`,
     mount:root=>mountSortW(root.querySelector('#i5box'),'i5sort',{cats:[['co','Constat'],['di','Diagnostic'],['me','Mesures'],['re','Réglages'],['te','Temps'],['su','Suites à donner']],items:[['Relais thermique déclenché ; l’utilisateur signale une odeur de brûlé depuis deux jours','co'],['Isolement W1–masse 0,4 MΩ sous 500 V : enroulement W en défaut','di'],['Continuité du PE : 0,08 Ω ; courants en charge 6,0 / 6,1 / 6,0 A','me'],['Couplage étoile ; thermique réglé sur 6,4 A, réarmement manuel','re'],['Intervention 2 h 30 ; arrêt de la machine 3 h 15','te'],['Contrôler les courants dans un mois','su']],ok:'Juste : chaque information à sa place, chaque mesure avec son unité.'})},
  ],
  prereq:[
    {t:'Expliquer le principe du moteur asynchrone, calculer sa vitesse de synchronisme et son glissement.', cap:'i1'},
    {t:'Lire intégralement une plaque signalétique.', cap:'i2'},
    {t:'Conduire le remplacement d’un moteur du début à la fin.', cap:'i3'},
    {t:'Réaliser les contrôles avant remise en service.', cap:'i4'},
    {t:'Mener la remise en service avec l’utilisateur ; rédiger un rapport d’intervention.', cap:'i5'},
  ],
  controle:[
    ['Expliquer pourquoi le rotor d’un moteur asynchrone ne peut jamais tourner à la vitesse du champ.','i1'],
    ['Un moteur tourne à 2 850 tr/min en charge. Combien a-t-il de pôles ?','i1'],
    ['Sur une plaque, à quoi sert la mention des deux tensions ? Et celle des deux courants ?','i2'],
    ['Dans quel ordre déconnecte-t-on et reconnecte-t-on le conducteur de protection ? Pourquoi ?','i3'],
    ['Citer huit contrôles à réaliser avant la remise en service d’un moteur remplacé.','i4'],
    ['Citer cinq questions à poser à l’utilisateur lors de la remise en service.','i5'],
    ['Citer les neuf rubriques d’un rapport d’intervention.','i5'],
  ],
});
})();
