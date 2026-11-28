/* =========================================================
   CHAPITRE 2.6 — LE DOSSIER TECHNIQUE ET LA DOCUMENTATION D'UNE INTERVENTION
   Contenu repris du cours d'Électricité 4e, pages 91 à 95.
   ========================================================= */
(function(){
const Q26 = {
  f1q1:{q:"Tu cherches un relais thermique repéré –1F3B. Que fais-tu en premier ?",o:["J'ouvre l'armoire et je cherche","Je le trouve sur le schéma, je lis son repère, je le localise sur le plan d'implantation, puis j'ouvre","Je demande à l'opérateur"],g:1,e:"On ne cherche jamais un composant en ouvrant l'armoire au hasard.",r:'f1'},
  f1q2:{q:"Pourquoi commande-t-on une pièce sur sa référence et pas sur sa désignation ?",o:["La désignation « relais thermique » correspond à des dizaines de modèles : seule la référence désigne l'appareil exact","C'est plus court","Le magasin ne lit pas les désignations"],g:0,e:"C'est la référence qu'on recopie sur le bon de commande.",r:'f1'},
  f2q1:{q:"Le câblage réel ne correspond pas au schéma. Que fais-tu ?",o:["Je corrige le câblage pour qu'il suive le schéma","Je corrige le schéma pour qu'il suive le câblage","Je ne modifie rien : je note l'écart et je préviens le responsable"],g:2,e:"Le schéma peut être périmé, mais c'est peut-être aussi le câblage qui est faux.",r:'f2'},
  f3q1:{q:"Quand documente-t-on un câblage ?",o:["Avant de le démonter","Après le remontage","Seulement si le schéma manque"],g:0,e:"Après, il est trop tard. Une photo prend dix secondes et sauve une heure de reconstitution.",r:'f3'},
  f3q2:{q:"À quoi reconnaît-on une bonne fiche de relevé ?",o:["Elle est propre","Un collègue peut rebrancher et régler le nouvel appareil avec la seule fiche, sans toi","Elle tient sur une page"],g:1,e:"Si une ligne lui manque, la fiche est incomplète.",r:'f3'},
  f4q1:{q:"Le schéma que tu as en main porte l'indice B ; le dossier officiel est à l'indice D. Que penser ?",o:["Peu importe","Ton schéma décrit une machine qui n'existe plus : il faut le dernier indice","L'indice B est plus fiable car plus ancien"],g:1,e:"Avant d'intervenir, on vérifie que le schéma en main porte bien le dernier indice.",r:'f4'},
  f4q2:{q:"Qu'est-ce qu'un schéma « as-built » ?",o:["Le schéma tel que construit, mis à jour après les modifications","Le schéma du constructeur, avant installation","Un schéma provisoire"],g:0,e:"C'est ce que devient le dossier quand le responsable y intègre tes annotations.",r:'f4'},
};
defChapter({
  num:'2.6', titre:'Le dossier technique et la documentation d’une intervention', tp:'É06 · É08',
  evalInfo:'L’évaluation formative 2.6 (20 points, seuil 14) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant les TP É06 et É08',
  Q:Q26,
  caps:[
    {id:'f1', sec:'2.6.1', t:'Les documents d’un dossier technique', pdf:91, quiz:['f1q1','f1q2'], ex:{keys:['f1sort'], lbl:'Quel document ?'},
     body:()=>`${tbl(['Document','Ce qu’il montre'],[['Schéma de puissance','Le chemin de l’énergie, de l’arrivée jusqu’aux récepteurs'],['Schéma de commande','La logique de fonctionnement : ce qui déclenche quoi'],['Plan d’implantation','La position réelle des appareils dans l’armoire, sur les rails et dans les goulottes'],['Plan de bornier','Le contenu de chaque bornier, borne par borne, avec les fils entrants et sortants'],['Nomenclature','La liste des appareils : repère, désignation, référence constructeur, quantité'],['Notices constructeur','Le détail de chaque appareil : caractéristiques, réglages, brochage']])}
      <div class="note" style="margin-top:14px"><b>Le réflexe</b>On ne cherche jamais un composant en ouvrant l'armoire au hasard. On le trouve d'abord sur le schéma, on lit son repère, on le localise sur le plan d'implantation, et alors seulement on ouvre.</div>
      <h3>La nomenclature</h3>
      <p class="small">Elle fait le lien entre le schéma et le magasin.</p>
      ${tbl(['Repère','Désignation','Référence','Qté','Remarque'],[['–1Q1B','Disjoncteur tripolaire 10 A, courbe D','DJ-3P-10D','1','—'],['–1KM2B','Contacteur tripolaire, bobine 24 V','CT-9','1','—'],['–1F3B','Relais thermique, plage 6 à 10 A','RT-10','1','Réglé sur 6,4 A'],['–1X5D','Bornier de puissance','—','6','Bornes à vis 4 mm²']])}
      ${exbox('f1box','Où trouves-tu la réponse ?')}`,
     mount:root=>mountSortW(root.querySelector('#f1box'),'f1sort',{cats:[['pu','Schéma de puissance'],['co','Schéma de commande'],['im','Plan d’implantation'],['bo','Plan de bornier'],['no','Nomenclature'],['ns','Notice']],items:[
       ['Sur quel rail se trouve le contacteur –1KM2B ?','im'],['Quelle référence commander pour remplacer –1F3B ?','no'],['Quel bouton fait coller KM2 ?','co'],['Quels fils arrivent sur la borne 4 du bornier X5 ?','bo'],['Par quels appareils passe le courant du moteur ?','pu'],['Quelle est la plage de réglage exacte et le brochage du relais ?','ns']],ok:'Juste. Chaque document répond à une question que les autres laissent sans réponse.'})},
    {id:'f2', sec:'2.6.2', t:'Du schéma à la machine', pdf:92, quiz:['f2q1'], ex:{keys:['f2ord'], lbl:'La méthode, dans l’ordre'},
     body:()=>`<p class="lead">Savoir lire un schéma ne sert que si l'on sait retrouver ce qu'on y a lu sur l'installation réelle. <b>Le repère est le fil conducteur</b> : on le lit sur le schéma, on le retrouve sur le plan, sur l'étiquette de l'appareil, puis dans la nomenclature.</p>
      ${exbox('f2box','Remets la méthode dans l’ordre')}
      <div class="note warn"><b>En cas de divergence</b>Entre le schéma et la réalité, on ne modifie rien : on note l'écart et on prévient le responsable. Le schéma peut être périmé, mais c'est peut-être aussi le câblage qui est faux.</div>`,
     mount:root=>mountOrderW(root.querySelector('#f2box'),'f2ord',{items:['Sur le schéma, identifier le composant et relever son repère','Sur le plan d’implantation, trouver sa position : rail, rangée, place','Ouvrir l’armoire consignée et repérer l’étiquette portant ce repère','Vérifier que le composant est bien du type annoncé par la nomenclature','Relever les numéros des fils raccordés et les comparer au schéma','En cas de divergence : ne rien modifier, noter l’écart, prévenir le responsable'],shuffle:[3,0,5,1,4,2],ok:'Schéma, plan, étiquette, nomenclature, fils — et on signale les écarts.'})},
    {id:'f3', sec:'2.6.3', t:'Documenter avant d’intervenir', pdf:92, quiz:['f3q1','f3q2'], ex:{keys:['f3sort'], lbl:'Compléter une fiche de relevé'},
     body:()=>`<p class="lead">Le meilleur moment pour documenter un câblage, c'est <b>avant de le démonter</b>. Après, il est trop tard.</p>
      ${tbl(['Geste','Pourquoi'],[['Photographier la zone sous plusieurs angles','Une photo prend dix secondes et sauve une heure de reconstitution'],['Étiqueter chaque conducteur avant de le déconnecter','Les bagues d’origine peuvent être absentes, illisibles ou fausses'],['Noter la position des barrettes, des sélecteurs et des réglages','Un réglage effacé ne se retrouve pas'],['Annoter le schéma au crayon avec ce qu’on observe','C’est le point de départ de la mise à jour du dossier'],['Se poser la question du remontage','Ma documentation permettrait-elle à quelqu’un d’autre de remonter à l’identique ?']])}
      <h3 style="margin-top:16px">La fiche de relevé</h3>
      <p class="small">Avant de remplacer le relais thermique –1F3B :</p>
      ${tbl(['Borne ou réglage','Ce qui y arrive','Observation'],[['1/L1 · 3/L2 · 5/L3','Trois conducteurs venant de –1KM2B','Serrés, sans trace d’échauffement'],['2/T1 · 4/T2 · 6/T3','Trois conducteurs vers le bornier –1X5D, puis le moteur','Ordre des phases à respecter'],['95 – 96','Fils 2 et 3','Contact NF dans la chaîne d’arrêt'],['97 – 98','Fils 2 et 8','Voyant de défaut'],['Molette','Réglée sur 6,4 A','À reproduire sur le nouvel appareil'],['Sélecteur de réarmement','Position manuelle','À reproduire']])}
      ${exbox('f3box','Tu remplaces un contacteur : qu’est-ce qui doit figurer dans ta fiche ?','Un collègue doit pouvoir tout rebrancher et régler avec la seule fiche.')}`,
     mount:root=>mountSortW(root.querySelector('#f3box'),'f3sort',{cats:[['oui','Dans la fiche'],['non','Inutile']],items:[['Les numéros des fils sur A1 et A2','oui'],['L’ordre des trois phases en sortie 2/T1 · 4/T2 · 6/T3','oui'],['La tension de bobine inscrite sur l’appareil','oui'],['La couleur de la porte de l’armoire','non'],['Les fils raccordés sur le contact 13-14','oui'],['La marque de ton tournevis','non'],['La présence d’un bloc de contacts additionnel','oui']],ok:'Juste : tout ce qu’il faut pour remonter à l’identique, rien de plus.'})},
    {id:'f4', sec:'2.6.4', t:'Mettre à jour le dossier', pdf:93, quiz:['f4q1','f4q2'], ex:{keys:['f4sort'], lbl:'Bonnes et mauvaises pratiques'},
     body:()=>`<p class="lead">Un dossier qui ne reflète plus l'installation est <b>pire qu'un dossier absent</b> : il donne une fausse confiance.</p>
      <ul class="ctrlq"><li>Annoter le schéma : nouveau repère, nouvelle référence, nouvelle valeur de réglage.</li><li>Mettre à jour la nomenclature si la référence a changé.</li><li>Reporter le croquis à main levée des modifications de câblage.</li><li>Dater et signer la modification.</li><li>Transmettre au responsable pour intégration au dossier officiel — le schéma <b>as-built</b>, tel que construit.</li></ul>
      <h3 style="margin-top:16px">L'indice de révision</h3>
      <p>Chaque schéma porte dans son cartouche une lettre : A pour la première version, puis B, C, D… à chaque modification. Un petit tableau garde la trace de chaque indice : date, objet, auteur.</p>
      <div class="note warn"><b>Avant d'intervenir</b>On vérifie que le schéma en main porte le dernier indice : un schéma à l'indice dépassé décrit une machine qui n'existe plus. <b>Après</b>, on ne gomme jamais : on barre l'ancienne valeur pour qu'elle reste lisible, on écrit la nouvelle à côté, on date et on signe.</div>
      ${exbox('f4box','Bonne ou mauvaise pratique ?')}
      <div class="note" style="margin-top:14px"><b>★ Dessin</b>Le plan de bornier et le plan d’implantation : <button class="revoir" data-goto="f6">Dessin 12 →</button>, à la fin de ce chapitre, avant les TP É06 et É08.</div>`,
     mount:root=>mountSortW(root.querySelector('#f4box'),'f4sort',{cats:[['b','Bonne'],['m','Mauvaise']],items:[['Gommer l’ancien réglage et écrire le nouveau','m','On barre pour que l’ancienne valeur reste lisible.'],['Barrer l’ancienne référence, écrire la nouvelle à côté, dater et signer','b'],['Vérifier l’indice du schéma avant d’intervenir','b'],['Garder la modification « dans sa tête » pour la prochaine fois','m'],['Remettre le schéma annoté au responsable','b'],['Travailler avec un schéma à l’indice B quand le dossier est à l’indice D','m']],ok:'Juste.'})},
  ],
  prereq:[
    {t:'Citer les documents d’un dossier technique et dire à quoi sert chacun.', cap:'f1'},
    {t:'Lire une nomenclature.', cap:'f1'},
    {t:'Localiser sur la machine un composant repéré sur le plan.', cap:'f2'},
    {t:'Documenter l’état d’un câblage avant de le démonter.', cap:'f3'},
    {t:'Mettre à jour un dossier après intervention et en vérifier l’indice de révision.', cap:'f4'},
  ],
  controle:[
    ['Citer six documents d’un dossier technique et le rôle de chacun.','f1'],
    ['Décrire les six étapes pour retrouver sur la machine un composant vu sur le schéma.','f2'],
    ['Que fait-on lorsque le schéma ne correspond pas au câblage réel ?','f2'],
    ['Citer cinq gestes de documentation à réaliser avant de démonter un câblage.','f3'],
    ['Quelle différence y a-t-il entre un schéma de commande et un plan d’implantation ?','f1'],
    ['Qu’est-ce que l’indice de révision d’un schéma ? Pourquoi le vérifie-t-on avant d’intervenir ?','f4'],
  ],
});
})();
