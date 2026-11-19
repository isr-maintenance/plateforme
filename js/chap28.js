/* =========================================================
   CHAPITRE 2.8 — LES COMPOSANTS HORS TABLEAU ET LEUR REMPLACEMENT
   Contenu repris du cours d'Électricité 4e, pages 105 à 114.
   ========================================================= */
(function(){
const Q28 = {
  h1q1:{q:"Quel détecteur pour surveiller le niveau de granulés en plastique dans une trémie ?",o:["Inductif","Capacitif","Interrupteur de position"],g:1,e:"Le capacitif détecte presque tout : métal, plastique, liquide, granulés — même à travers une paroi.",r:'h1'},
  h2q1:{q:"Un détecteur inductif détecte-t-il une pièce en plastique ?",o:["Oui","Non : il ne voit que le métal, qui absorbe l'énergie de son champ","Seulement de près"],g:1,e:"Et pour l'aluminium, le cuivre ou l'inox, la distance est plus faible que pour l'acier doux : facteur de correction dans la notice.",r:'h2'},
  h2q2:{q:"On monte un NPN à la place d'un PNP. Que se passe-t-il ?",o:["Le détecteur grille","Rien ne casse, mais l'entrée d'automate ne verra jamais le signal","Il fonctionne à l'envers"],g:1,e:"Même filetage, même connecteur, mais pas interchangeables. On lit la notice ou le marquage avant de commander.",r:'h2'},
  h2q3:{q:"Sortie PNP : où se raccorde la charge ?",o:["Entre la sortie et le moins","Entre le plus et la sortie","Entre le plus et le moins"],g:0,e:"PNP : la sortie fournit le plus quand elle est active. NPN : elle fournit le moins, charge entre le plus et la sortie.",r:'h2'},
  h3q1:{q:"Le levier arrive en butée à chaque passage de la came. Conséquence et correction ?",o:["Aucune","L'organe d'attaque force et s'use : on règle pour garder une course résiduelle après commutation","Il faut changer la came"],g:1,e:"Après commutation, la came doit pouvoir continuer sa course sans forcer sur l'organe d'attaque.",r:'h3'},
  h3q2:{q:"Qu'est-ce qu'un contact à ouverture forcée ?",o:["Un contact qui s'ouvre par contrainte mécanique, même si ses pastilles sont soudées","Un contact qu'on ouvre au tournevis","Un contact NO"],g:0,e:"On l'exige sur les organes de sécurité.",r:'h3'},
  h4q1:{q:"Que signifie IP 55 ?",o:["Étanche à l'immersion","Protégé contre la poussière (5) et contre les jets d'eau à la lance (5)","Résistance aux chocs de 5 J"],g:1,e:"L'indice courant en atelier. IP 65 ajoute l'étanchéité complète à la poussière.",r:'h4'},
  h4q2:{q:"Le thermostat de remplacement a un contact « chaud » au lieu de « froid ». Conséquence ?",o:["Aucune","Le fonctionnement de la machine s'inverse","Il chauffe plus"],g:1,e:"Contact froid : se ferme au refroidissement. Chaud : se ferme à l'échauffement.",r:'h4'},
  h4q3:{q:"On monte un débitmètre à l'envers de la flèche gravée. Résultat ?",o:["Il fonctionne quand même","Lecture fausse ou nulle","Il mesure la pression"],g:1,e:"Il se monte en ligne, dans le sens indiqué par la flèche.",r:'h4'},
  h5q1:{q:"Qu'est-ce qui est évalué à l'épreuve dans le choix d'un équivalent ?",o:["La marque choisie","La justification écrite, caractéristique par caractéristique","Le prix"],g:1,e:"On distingue les caractéristiques critiques des secondaires, et on vérifie aussi l'encombrement.",r:'h5'},
};
defChapter({
  num:'2.8', titre:'Les composants hors tableau et leur remplacement', tp:'É09',
  evalInfo:'L’évaluation formative 2.8 (35 points, seuil 25) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant le TP É09',
  Q:Q28,
  caps:[
    {id:'h1', sec:'2.8.1', t:'Les familles de capteurs', pdf:105, quiz:['h1q1'], ex:{keys:['h1sort'], lbl:'Quelle famille ?'},
     body:()=>`${tbl(['Famille','Ce qu’elle détecte','Exemples d’emploi'],[['Position à contact','La présence physique d’une pièce qui vient appuyer','Fin de course d’un chariot, position d’un carter'],['Proximité inductif','Un métal, sans contact','Position d’une came, comptage de dents'],['Proximité capacitif','Presque tout : métal, plastique, liquide, granulés','Niveau dans une trémie, présence à travers une paroi'],['Photoélectrique','La coupure ou le retour d’un faisceau lumineux','Colis sur convoyeur, barrière'],['Température','Un seuil ou une valeur de température','Thermostat de sécurité, sonde de bobinage'],['Pression','Un seuil de pression','Pressostat pneumatique ou hydraulique'],['Débit','La circulation d’un fluide','Contrôle de refroidissement, sécurité de pompe']])}
      ${exbox('h1box','Quelle famille de capteur pour…')}`,
     mount:root=>mountSortW(root.querySelector('#h1box'),'h1sort',{cats:[['po','Position'],['in','Inductif'],['ca','Capacitif'],['ph','Photoélectrique'],['pr','Pression'],['de','Débit']],items:[['Savoir si le carter de la scie est fermé','po'],['Compter les dents d’un pignon en acier','in'],['Détecter le niveau d’eau à travers un réservoir en plastique','ca'],['Détecter des cartons sur un convoyeur','ph'],['Arrêter le compresseur à 8 bar','pr'],['Vérifier que l’eau de refroidissement circule','de']],ok:'Juste.'})},
    {id:'h2', sec:'2.8.2', t:'Les détecteurs de proximité', pdf:105, quiz:['h2q1','h2q2','h2q3'], ex:{keys:['h2fil','h2diag'], lbl:'Fils et diagnostic'},
     body:()=>`<p class="lead">Une bobine crée un champ magnétique alternatif. Quand un métal y entre, il absorbe de l'énergie ; le détecteur mesure cette absorption et bascule sa sortie. <b>Aucun contact, donc aucune usure.</b></p>
      <h3>Ce qui limite la portée</h3>
      <ul class="ctrlq"><li>La distance nominale est donnée pour l'acier doux ; pour l'aluminium, le cuivre ou l'inox, elle est plus faible (facteur de correction dans la notice).</li><li>Plus le détecteur est gros, plus il détecte loin.</li><li>À diamètre égal, un détecteur <b>noyable</b> (monté affleurant dans un support métallique) porte moins loin qu'un <b>non noyable</b>, qui doit dépasser.</li><li>On règle la distance mécaniquement, puis on bloque avec les deux écrous.</li></ul>
      ${tbl(['Type','Raccordement'],[['Deux fils','En série avec la charge, comme un interrupteur. Simple, mais il laisse passer un petit courant résiduel.'],['Trois fils','Deux fils d’alimentation, un fil de sortie. Le plus répandu en industrie.'],['Sortie PNP','Fournit le plus quand elle est active : charge entre la sortie et le moins.'],['Sortie NPN','Fournit le moins quand elle est active : charge entre le plus et la sortie.']])}
      ${exbox('h2f','Le rôle de chaque fil','Couleurs normalisées sur câble ; numéros de broches sur connecteur M12.')}
      <p class="small">Au remplacement, ne jamais confondre : le type de sortie (PNP ou NPN), sa fonction (NO : active quand la cible est présente ; NF : désactivée) et la tension d'alimentation.</p>
      <h3>Diagnostiquer un détecteur trois fils</h3>
      <ol class="ctrlq"><li>Le voyant : allumé quand la sortie est active. Cible présente et voyant éteint : le détecteur ne la voit pas.</li><li>L'alimentation entre marron et bleu : 24 V. Sinon, défaut en amont — câble, connecteur, alimentation.</li><li>La sortie : sur un PNP à fermeture, entre noir et bleu, environ 24 V cible présente, 0 V cible absente. Sur un NPN, entre marron et noir.</li><li>Alimentation présente, cible en face, sortie qui ne bascule pas : contrôler la distance, puis remplacer.</li></ol>
      ${exbox('h2d','Détecteur PNP à fermeture, cible bien en face : ton diagnostic ?')}`,
     mount:root=>{
       mountSortW(root.querySelector('#h2f'),'h2fil',{cats:[['p','+24 V'],['m','0 V'],['s','Sortie'],['s2','2e sortie']],items:[['Fil marron','p'],['Fil bleu','m'],['Fil noir','s'],['Fil blanc','s2'],['Broche M12 n° 1','p'],['Broche M12 n° 3','m'],['Broche M12 n° 4','s']],ok:'Juste : marron +, bleu −, noir sortie.'});
       mountSortW(root.querySelector('#h2d'),'h2diag',{cats:[['am','Défaut en amont'],['ds','Distance ou détecteur'],['ok','Tout va bien']],items:[['Marron–bleu : 0 V','am','Pas d’alimentation : câble, connecteur, alimentation.'],['Marron–bleu : 24 V · noir–bleu : 0 V · voyant éteint','ds','Alimenté mais ne bascule pas : distance de réglage, puis remplacement.'],['Marron–bleu : 24 V · noir–bleu : 23,8 V · voyant allumé','ok','Le détecteur fonctionne : le défaut est plus loin, vers l’entrée d’automate.']],ok:'Juste.'});
     }},
    {id:'h3', sec:'2.8.3', t:'L’interrupteur de position', pdf:107, quiz:['h3q1','h3q2'], ex:{keys:['h3ord'], lbl:'Remplacer et régler'},
     body:()=>`<ul class="ctrlq"><li>Un <b>corps</b> qui contient les contacts : un inverseur ou deux contacts indépendants.</li><li>Une <b>tête</b> interchangeable avec l'organe d'attaque : poussoir, galet, levier à galet, tige souple.</li><li>Un ou plusieurs <b>presse-étoupes</b>.</li><li>Sur les modèles de sécurité, un mécanisme à <b>ouverture forcée</b>.</li></ul>
      ${exbox('h3box','Remplacer et régler, dans l’ordre')}
      <div class="note"><b>Point de commutation et course résiduelle</b>Le contact bascule au point de commutation, qu'on entend et qu'on vérifie à la continuité. Il reste ensuite une réserve de course : le levier ne doit jamais arriver en butée.</div>`,
     mount:root=>mountOrderW(root.querySelector('#h3box'),'h3ord',{items:['Consigner, photographier la position de l’appareil et de sa came','Repérer les conducteurs sur les bornes avant de les déconnecter','Déposer l’appareil sans modifier le support ni la came','Monter le nouvel appareil dans la même position, orientation de la tête comprise','Régler en approchant l’organe d’attaque jusqu’au point de commutation','Vérifier la course résiduelle après commutation','Bloquer, refermer, contrôler le presse-étoupe, tester en fonctionnement'],shuffle:[4,1,6,0,3,5,2],ok:'Les sept étapes.'})},
    {id:'h4', sec:'2.8.4-2.8.5', t:'Thermostats, pressostats, indices IP et IK', pdf:108, quiz:['h4q1','h4q2','h4q3'], ex:{keys:['h4ip'], lbl:'Le bon indice'},
     body:()=>`${tbl(['Composant','Ce qu’il faut savoir'],[['Thermostat','Une plage de réglage et un différentiel — l’écart entre le seuil d’enclenchement et celui de déclenchement. Contact « froid » s’il se ferme au refroidissement, « chaud » s’il se ferme à l’échauffement.'],['Pressostat','Seuil réglé par une vis de tarage, souvent avec un réglage du différentiel. Contrôle au manomètre, en montant puis en descendant lentement.'],['Débitmètre, contrôleur de débit','En ligne, dans le sens de la flèche gravée sur le corps.']])}
      <h3 style="margin-top:16px">L'indice de protection IP</h3>
      ${tbl(['Chiffre','1er — solides','2e — liquides'],[['0','Aucune protection','Aucune protection'],['1 à 3','Corps solides de taille décroissante, jusqu’à l’outil et au fil','Gouttes, pluie inclinée'],['4','Corps de plus de 1 mm','Projections de toutes directions'],['5','Protégé contre la poussière','Jets d’eau à la lance'],['6','Étanche à la poussière','Jets puissants'],['7 et 8','—','Immersion temporaire, puis prolongée']])}
      <p class="small">IP 55 : l'indice courant en atelier. IP 65 : étanche à la poussière, nécessaire en agroalimentaire où l'on nettoie au jet. Un X signale un chiffre non testé (IPX4).</p>
      <h3>L'indice IK</h3>
      ${tbl(['Indice','Énergie du choc','L’équivalent'],[['IK 06','1 J','0,25 kg tombant de 40 cm'],['IK 07','2 J','0,5 kg de 40 cm'],['IK 08','5 J','1,7 kg de 30 cm'],['IK 09','10 J','5 kg de 20 cm'],['IK 10','20 J','5 kg de 40 cm']])}
      <div class="note warn" style="margin-top:14px"><b>La règle de remplacement</b>Un indice au moins égal à celui d'origine. Remplacer un IP 65 par un IP 54 dans une zone de lavage revient à programmer la panne suivante.</div>
      ${exbox('h4box','Ce remplacement convient-il ?')}`,
     mount:root=>mountSortW(root.querySelector('#h4box'),'h4ip',{cats:[['oui','Convient'],['non','Ne convient pas']],items:[['Zone de lavage : un IP 65 remplacé par un IP 54','non','Les deux chiffres sont plus faibles.'],['Un IP 66 remplacé par un IP 67','oui'],['Couloir des chariots : un IK 08 remplacé par un IK 06','non','5 J d’origine, seulement 1 J pour le nouveau.'],['Atelier : un IP 55 remplacé par un IP 65','oui'],['Un IK 09 remplacé par un IK 10','oui']],ok:'Juste : au moins égal, chiffre par chiffre.'})},
    {id:'h5', sec:'2.8.6', t:'Choisir un équivalent et commander', pdf:109, quiz:['h5q1'], ex:{keys:['h5crit','h5voc'], lbl:'Justifier et traduire'},
     body:()=>`<ol class="ctrlq"><li>Relever toutes les caractéristiques d'origine : type, fonction, tension, courant, IP et IK, dimensions et fixation, raccordement, plage de réglage.</li><li>Distinguer les caractéristiques <b>critiques</b> — qui empêchent le fonctionnement si elles diffèrent — des secondaires.</li><li>Chercher un composant dont toutes les critiques sont au moins équivalentes.</li><li>Vérifier l'encombrement et la compatibilité mécanique.</li><li>Justifier le choix par écrit, caractéristique par caractéristique — c'est évalué à l'épreuve.</li><li>Rédiger le bon de commande : désignation exacte, marque et référence, quantité et unité, repère de la machine et du composant, demandeur, date, urgence.</li></ol>
      ${exbox('h5c','Interrupteur de position à remplacer : chaque proposition convient-elle ?','Origine : 1 NF à ouverture forcée + 1 NO · 240 V – 3 A · levier à galet réglable · entraxe 30 mm · IP 66 · entrée M20 · corps gris.')}
      <p class="small">Un catalogue se lit par filtres successifs : famille, fonction, caractéristique principale, options. Le code de la référence encode souvent les caractéristiques — la table de lecture est en début de chapitre.</p>
      ${tbl(['Français','Anglais','Néerlandais','Allemand'],[['tension','voltage','spanning','Spannung'],['courant','current','stroom','Strom'],['contact à fermeture','normally open','maakcontact','Schließer'],['contact à ouverture','normally closed','verbreekcontact','Öffner'],['bobine','coil','spoel','Spule'],['mise à la terre','earthing / grounding','aarding','Erdung'],['avertissement','warning','waarschuwing','Warnung'],['mise hors tension','de-energize','spanningsloos maken','spannungsfrei schalten']])}
      ${exbox('h5v','Que veut dire…','Les schémas, tableaux et valeurs sont universels ; le vocabulaire essentiel s’apprend.')}`,
     mount:root=>{
       mountSortW(root.querySelector('#h5c'),'h5crit',{cats:[['oui','Convient'],['non','Ne convient pas']],items:[['Contacts : 1 NF simple (sans ouverture forcée) + 1 NO','non','Organe de sécurité : l’ouverture forcée est critique.'],['Tension et courant : 240 V – 6 A','oui','Supérieur : convient.'],['Fixation : entraxe 40 mm','non','Ne rentre pas sur le support existant.'],['Indice : IP 67','oui'],['Corps jaune au lieu de gris','oui','Caractéristique sans importance.'],['Tête : poussoir au lieu de levier à galet','non','L’organe d’attaque doit correspondre à la came.']],ok:'Juste : on justifie caractéristique par caractéristique.'});
       mountSortW(root.querySelector('#h5v'),'h5voc',{cats:[['f','Contact à fermeture'],['o','Contact à ouverture'],['h','Mise hors tension'],['t','Mise à la terre']],items:[['normally closed','o'],['Schließer','f'],['spanningsloos maken','h'],['Erdung','t'],['maakcontact','f'],['Öffner','o']],ok:'Juste.'});
     }},
  ],
  prereq:[
    {t:'Citer les familles de capteurs et dire ce que chacune détecte.', cap:'h1'},
    {t:'Distinguer un capteur à contact d’un détecteur de proximité, raccorder un détecteur trois fils.', cap:'h2'},
    {t:'Reconnaître les fils d’un détecteur et en faire le diagnostic.', cap:'h2'},
    {t:'Régler un interrupteur de position et vérifier sa course.', cap:'h3'},
    {t:'Décoder un indice IP et un indice IK.', cap:'h4'},
    {t:'Choisir un composant équivalent et justifier son choix ; rédiger un bon de commande.', cap:'h5'},
  ],
  controle:[
    ['Citer sept familles de capteurs et ce que chacune détecte.','h1'],
    ['Expliquer le principe d’un détecteur inductif. Détecte-t-il le plastique ?','h2'],
    ['Quelle est la différence entre une sortie PNP et une sortie NPN ? Que se passe-t-il si on les confond ?','h2'],
    ['Quelles sont les couleurs des trois fils d’un détecteur, et le rôle de chacun ?','h2'],
    ['Qu’est-ce qu’un contact à ouverture forcée et pourquoi l’exige-t-on sur un organe de sécurité ?','h3'],
    ['Qu’est-ce que le différentiel d’un thermostat ?','h4'],
    ['Que signifie IP 55 ? Et IK 08 ?','h4'],
    ['Citer les six étapes du choix d’un composant équivalent. Que doit contenir un bon de commande ?','h5'],
  ],
});
})();
