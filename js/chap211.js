/* =========================================================
   CHAPITRE 2.11 — SYNTHÈSE ET PRÉPARATION À L'ÉPREUVE
   Contenu repris du cours d'Électricité 4e, pages 132 à 134.
   ========================================================= */
(function(){
const Q211 = {
  k1q1:{q:"À l'épreuve, le diagnostic de la panne…",o:["Est à trouver par le candidat","Est donné : le candidat exécute le remplacement, le réglage et la remise en service","N'existe pas"],g:1,e:"La tâche : remettre en fonctionnement, compléter le rapport, sélectionner les pièces et justifier le choix.",r:'k1'},
  k1q2:{q:"Une intervention techniquement parfaite, mais réalisée sans consigner. L'UAA est-elle validée ?",o:["Oui, grâce à la moyenne","Non : chaque critère et chaque indicateur doit être atteint, il n'y a pas de moyenne","Oui, avec une remarque"],g:1,e:"Tous les indicateurs doivent être réussis.",r:'k1'},
  k2q1:{q:"Pourquoi « c'est la même » ne suffit-il pas pour justifier un choix de pièce ?",o:["C'est trop court","La justification attendue s'appuie sur les caractéristiques : tension, courant, IP, dimensions, fixation","Le jury n'aime pas cette phrase"],g:1,e:"Les pièces ne sont pas disponibles à l'identique : il faut un équivalent dans au moins trois catalogues de marques différentes.",r:'k2'},
  k2q2:{q:"Le rapport d'intervention, c'est…",o:["Une formalité après l'épreuve","Une partie de la tâche : un rapport incomplet coûte des indicateurs","Facultatif"],g:1,e:"Le rapport fait partie de la tâche, pas de l'après.",r:'k2'},
};
const AUTO=[['Énoncer les cinq règles d’or et les appliquer dans l’ordre','a2'],['Compléter une fiche ARDM correctement','a4'],['Consigner et déconsigner une installation sur les quatre énergies','a5'],['Utiliser un VAT selon la règle des trois temps','a6'],['Choisir la borne, la fonction et le calibre d’un multimètre','a7'],['Mesurer une tension, un courant, une continuité et une isolation','g1'],['Lire un schéma et localiser un composant sur la machine','f2'],['Repérer et documenter un câblage avant de le démonter','f3'],['Dénuder, sertir un embout, serrer une borne au couple, repérer un fil','b10'],['Lire une plaque signalétique et en déduire le couplage','d4'],['Réaliser un couplage étoile ou triangle','d4'],['Régler un relais thermique','e4'],['Sélectionner un composant équivalent et justifier mon choix','h5'],['Rédiger un bon de commande','h5'],['Réaliser tous les contrôles avant remise en service','i4'],['Mener la remise en service avec l’utilisateur','i5'],['Rédiger un rapport d’intervention complet','i5'],['Trier les déchets et laisser un poste propre','b10']];
function mountAuto(root){
  const box=root.querySelector('#autoev'), mem=DR().auto||(DR().auto={});
  const draw=()=>{
    const nOui=AUTO.filter((_,i)=>mem[i]==='oui').length, all=AUTO.every((_,i)=>mem[i]);
    box.innerHTML=`<div class="sortw">${AUTO.map(([t,cap],i)=>{ const c=capById(cap); return `<div class="srow ${mem[i]==='oui'?'good':mem[i]==='non'?'wrong':''}"><div class="lbl">${t}${mem[i]==='non'&&c?`<div class="tiny"><button class="revoir" data-goto="${cap}">Réviser : ${c.chap} · ${c.t}</button></div>`:''}</div>
      <div class="seg"><button class="${mem[i]==='oui'?'on':''}" data-au="${i}|oui">Oui</button><button class="${mem[i]==='non'?'on':''}" data-au="${i}|non">Pas encore</button></div></div>`; }).join('')}</div>
      <p class="small" style="margin-top:10px"><b>${nOui}/${AUTO.length}</b> « oui ». ${all?(nOui===AUTO.length?'Tu te sens prêt sur tous les points.':'Les points « pas encore » ont un lien de révision.'):'Réponds à chaque ligne, honnêtement.'}</p>`;
    box.querySelectorAll('[data-au]').forEach(b=>b.onclick=()=>{ const [i,v]=b.dataset.au.split('|'); mem[i]=v; save(); if(AUTO.every((_,j)=>mem[j])) exSet('k4auto'); draw(); });
    box.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>openCap(b.dataset.goto));
  };
  draw();
}
defChapter({
  num:'2.11', titre:'Synthèse et préparation à l’épreuve', tp:'certificatif UAA1', noEval:true,
  prereqTitle:'Le chemin de l’UAA1',
  Q:Q211,
  caps:[
    {id:'k1', sec:'2.11.1-2.11.2', t:'Ce que l’épreuve demande', pdf:132, quiz:['k1q1','k1q2'], ex:{keys:['k1sort'], lbl:'Vrai ou faux'},
     body:()=>`<p class="lead">L'épreuve est <b>pratique, en situation réelle</b>, de deux à quatre heures. Tu reçois un bon d'intervention et tu travailles en autonomie d'exécution et de décision.</p>
      ${tbl(['Élément','Contenu'],[['La tâche','Remettre en fonctionnement une installation pluritechnologique, compléter le rapport d’intervention, sélectionner les pièces de remplacement et justifier le choix'],['Ce qui est fourni','Documents techniques et notices, catalogues de pièces, schéma, fiche de travail avec le diagnostic, modèle de rapport, fiche ARDM, bon de commande'],['Le diagnostic','Il est donné. Tu ne cherches pas la panne : tu exécutes le remplacement, le réglage et la remise en service.'],['Les pièces','Pas disponibles à l’identique : un équivalent dans au moins trois catalogues de marques différentes, avec justification'],['L’installation','De type industriel, en fonctionnement, avec obligatoirement un moteur triphasé. Intervention hors tableau.']])}
      <h3 style="margin-top:16px">Les critères</h3>
      ${tbl(['Critère','Ce qui est regardé'],[['Conformité du résultat','L’installation fonctionne, les éléments sont remplacés, le délai est tenu, le rapport est complet, le choix des pièces est justifié'],['Cohérence de la démarche','Composants localisés sur le schéma et la machine, enchaînement logique, méthodes pertinentes, contrôles avant remise en service faits'],['Respect des règles','Environnement, RGIE, bien-être au travail, consignation et déconsignation']])}
      <div class="note bad" style="margin-top:14px"><b>Tous les indicateurs doivent être réussis</b>Il n'y a pas de moyenne. Une intervention techniquement parfaite mais réalisée sans consigner ne passe pas.</div>
      ${exbox('k1box','Vrai ou faux ?')}`,
     mount:root=>mountSortW(root.querySelector('#k1box'),'k1sort',{cats:[['v','Vrai'],['f','Faux']],items:[['Je dois trouver moi-même la panne','f','Le diagnostic est donné.'],['L’installation comporte toujours un moteur triphasé','v'],['La pièce d’origine est disponible au magasin','f','Il faut un équivalent, choisi dans au moins trois catalogues.'],['Un oubli de consignation peut faire échouer l’épreuve, même si tout fonctionne','v'],['Le rapport se rédige à la maison, après l’épreuve','f']],ok:'Juste.'})},
    {id:'k2', sec:'2.11.3', t:'Les erreurs qui coûtent le plus', pdf:132, quiz:['k2q1','k2q2'],
     body:()=>`${tbl(['Erreur','Pourquoi elle coûte cher'],[['Commencer sans compléter la fiche ARDM','Indicateur évalué, impossible à rattraper après coup'],['Consigner sans vérifier l’absence de tension','Le geste est vu, l’oubli aussi'],['Démonter sans repérer les conducteurs','Le remontage devient une reconstitution, le délai explose'],['Oublier le conducteur de protection','Non-conformité RGIE, indicateur manqué'],['Justifier un choix de pièce par « c’est la même »','La justification s’appuie sur les caractéristiques : tension, courant, IP, dimensions, fixation'],['Ne pas régler le composant remplacé','Le réglage est dans l’intitulé de l’UAA'],['Remettre sous tension sans contrôle et sans prévenir','Faute de sécurité'],['Laisser le poste en désordre et les déchets non triés','Deux indicateurs perdus pour dix minutes de rangement'],['Rendre un rapport incomplet','Le rapport fait partie de la tâche, pas de l’après']])}`},
    {id:'k3', sec:'2.11.4', t:'La chronologie type d’une intervention', pdf:133, quiz:[], ex:{keys:['k3ord'], lbl:'Les treize étapes'},
     body:()=>`<p class="lead">De la lecture du bon de travail à la remise du rapport : <b>treize étapes</b>, toujours dans le même ordre. Remets-les en place.</p>
      ${exbox('k3box','La chronologie d’une intervention')}`,
     mount:root=>mountOrderW(root.querySelector('#k3box'),'k3ord',{items:['Lire et comprendre le bon de travail ; poser les questions avant de commencer','Repérer les composants sur le schéma, puis sur la machine','Compléter la fiche ARDM sur place','Consigner, condamner, vérifier l’absence de tension, baliser','Relever les caractéristiques des composants à remplacer','Sélectionner les équivalents et rédiger le bon de commande','Documenter le câblage existant : photos, repérage des conducteurs','Déposer, nettoyer l’emplacement, reposer, raccorder, régler','Contrôler hors tension : continuité, court-circuit, PE, serrage','Prévenir le prof, déconsigner, remettre sous tension','Contrôler sous tension, vérifier avec l’utilisateur','Ranger, nettoyer, trier les déchets','Compléter le rapport d’intervention et le remettre'],shuffle:[7,2,11,0,9,4,12,1,6,3,10,5,8],ok:'La chronologie complète.',hint:'Sécurité d’abord, rapport en dernier.'})},
    {id:'k4', sec:'2.11.5', t:'Auto-évaluation avant l’épreuve', pdf:133, quiz:[], ex:{keys:['k4auto'], lbl:'Répondre à chaque ligne'},
     body:()=>`<p class="lead">Chaque ligne se coche « oui » seulement si tu es capable de le faire <b>seul, sans aide et sans notes</b>. Pour chaque « pas encore », un lien te ramène à la capsule à réviser.</p>
      <div class="figure exw" id="autoev"></div>
      <p class="small muted">Ton prof voit ta progression dans les capsules ; tes réponses ici servent d'abord à toi.</p>`,
     mount:mountAuto},
  ],
  prereq:[
    {t:'Sécurité : règles d’or, ARDM, consignation, VAT (chapitre 2.1).', cap:'a6'},
    {t:'Mesures et câblage de base (chapitres 2.1, 2.2 et 2.7).', cap:'g1'},
    {t:'Relais, contacteur, couplage et protections (chapitres 2.3 à 2.5).', cap:'e4'},
    {t:'Dossier, composants hors tableau et choix d’un équivalent (chapitres 2.6 et 2.8).', cap:'h5'},
    {t:'Remplacement du moteur, remise en service et rapport (chapitre 2.9).', cap:'i5'},
    {t:'Cadre légal et risques particuliers (chapitre 2.10).', cap:'j4'},
  ],
  controle:[
    ['Que fournit-on au candidat à l’épreuve, et que doit-il faire ?','k1'],
    ['Pourquoi n’y a-t-il pas de moyenne entre les critères ?','k1'],
    ['Citer cinq erreurs qui coûtent cher à l’épreuve.','k2'],
    ['Réciter la chronologie type d’une intervention.','k3'],
  ],
});
})();
