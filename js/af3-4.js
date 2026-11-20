/* =========================================================
   ÉLECTRICITÉ 3QEM — CHAPITRES 17 À 20
   17 Les piles · 18 Les accumulateurs · 19 Couplage des générateurs
   20 Multiples et sous-multiples
   ========================================================= */
(function(){

/* =================== CHAPITRE 17 — LES PILES =================== */
defAF(17, {
  Q:{
    A17aq1:{q:"La force électromotrice (f.é.m.) d’un générateur se mesure…",o:["à vide, quand il ne débite aucun courant","en charge, pendant qu’il alimente un moteur","hors tension, à l’ohmmètre"],g:0,e:"La f.é.m. est toujours mesurée circuit ouvert. La résistance interne, elle, représente les pertes dans le générateur.",r:'A17a'},
    A17aq2:{q:"Quelle est la grande différence entre une pile et un accumulateur ?",o:["La pile est plus grosse","La réaction chimique de la pile est irréversible ; l’accumulateur se recharge","L’accumulateur ne contient pas d’électrolyte"],g:1,e:"La pile est un générateur primaire ; l’accumulateur, un générateur secondaire, rechargeable.",r:'A17a'},
    A17bq1:{q:"Une pile cuivre-zinc s’arrête après un moment. Pourquoi ?",o:["Le cuivre a fondu","Des bulles d’hydrogène isolent la lame de cuivre de l’électrolyte : la pile est polarisée","L’électrolyte s’est évaporé"],g:1,e:"On ajoute à l’électrolyte un dépolarisant, un corps avide d’hydrogène.",r:'A17b'},
    A17bq2:{q:"Quelles sont les deux caractéristiques principales d’une pile ?",o:["Sa couleur et sa marque","Sa tension en volts et sa capacité en ampères-heures","Sa longueur et son poids"],g:1,e:"La tension, et la quantité d’électricité qu’elle peut restituer (Ah).",r:'A17b'},
  },
  caps:[
    {id:'A17a', sec:'17.1', t:'Générateurs électrochimiques : piles et accumulateurs', quiz:['A17aq1','A17aq2'], ex:{keys:['A17fam'], lbl:'Les familles'},
     body:()=>`${progRef(['Énoncer le principe élémentaire d’une pile','Relever les caractéristiques d’une pile (f.é.m., résistance interne, capacité)'],'p. 27')}
      <p class="lead">L’automobile, les navires, les avions, les jouets… ne peuvent pas se brancher sur le réseau : ils utilisent des piles, des batteries d’accumulateurs, des dynamos ou des alternateurs.</p>
      <p>Tout générateur est caractérisé par deux paramètres :</p>
      ${defBox('La force électromotrice (f.é.m.)','Elle caractérise la possibilité qu’a le générateur de fournir de l’énergie aux électrons pour qu’ils se déplacent en bon ordre dans le circuit. Elle se mesure toujours <b>à vide</b>, quand le générateur ne débite aucun courant.')}
      ${defBox('La résistance interne (r)','Elle caractérise la perte d’énergie (sous forme de chaleur, par exemple) que subissent les électrons en traversant le générateur.')}
      <p>Les piles et les accumulateurs produisent de l’énergie électrique à partir d’énergie chimique : deux électrodes (une positive, une négative) baignent dans un <b>électrolyte</b>, un conducteur ionique. Si l’on relie les électrodes par un fil, un courant y passe.</p>
      <ul><li>Les <b>piles</b> (générateurs primaires) : la réaction chimique est <b>irréversible</b>.</li><li>Les <b>accumulateurs</b> (générateurs secondaires) : ils se <b>rechargent</b> si on leur apporte de l’énergie électrique, avec un courant de sens opposé au courant de décharge.</li></ul>
      ${tbl(['Générateur','Repères du cours'],[['Pile de Volta (1800)','Zinc, feutre, cuivre et acide sulfurique : 1 V'],['Pile Leclanché (vers 1868)','Bioxyde de manganèse et zinc : 1,5 V, faibles courants'],['Pile à l’oxyde de mercure-zinc','Petit disque : prothèses auditives, photographie'],['Accumulateur au plomb (Planté, 1859)','Courants intenses (100 à 500 A), durée de vie d’environ quatre ans'],['Accumulateur nickel-cadmium, nickel-fer','1,25 V, grands courants, durée de vie assez courte'],['Accumulateur argent-zinc (1941)','1,5 V, 120 Wh/kg, mais coûteux']])}
      ${exbox('a17fam','Pile ou accumulateur ?')}`,
     mount:root=>mountSortW(root.querySelector('#a17fam'),'A17fam',{cats:[['p','Pile (primaire)'],['a','Accumulateur (secondaire)']],items:[['Pile Leclanché','p'],['Batterie au plomb d’une voiture','a'],['Pile alcaline','p'],['Élément nickel-cadmium','a'],['Pile bouton à l’oxyde d’argent','p'],['Élément argent-zinc','a']],ok:'Juste : seul l’accumulateur se recharge.'})},
    {id:'A17b', sec:'17.2 — 17.3', t:'La pile sèche et la pile bouton', quiz:['A17bq1','A17bq2'], ex:{keys:['A17pol','A17sec'], lbl:'La pile, dans l’ordre et en coupe'},
     body:()=>`<p>Deux électrodes de natures différentes plongées dans un électrolyte forment un générateur : la pile transforme l’énergie chimique en énergie électrique. Sa d.d.p. dépend de la nature de l’électrolyte et des électrodes, pas de leur taille ni de leur écartement.</p>
      <p>Dans de l’eau mélangée à de l’acide sulfurique, on plonge une lame de cuivre (pôle +) et une lame de zinc (pôle –) : une f.é.m. d’environ <b>1,08 V</b> apparaît.</p>
      ${exbox('a17pol','Que se passe-t-il quand la pile débite ?','Remets dans l’ordre.')}
      ${defBox('Définition','La <b>polarisation</b> d’une pile est la formation d’une couche de gaz (hydrogène) sur une électrode, qui isole celle-ci de l’électrolyte et fait chuter la f.é.m. Un <b>dépolarisant</b>, ajouté à l’électrolyte, neutralise ce gaz.')}
      <h3>La pile sèche saline (zinc-carbone)</h3>
      <p>L’électrode négative est le <b>récipient en zinc</b>. Dedans, l’électrolyte (sels acides et eau) est mélangé à un gel : il n’est pas liquide, d’où le nom de pile « sèche ». L’électrode positive est un <b>crayon de charbon</b> microporeux entouré du dépolarisant, terminé par une capsule en laiton nickelé (le pôle +). Le tout est protégé par un conteneur en acier.</p>
      <p>La pile <b>alcaline</b> garde le couple zinc/carbone, mais dans un électrolyte à base d’hydroxyde de potassium ; le zinc, en poudre, est au centre de la pile.</p>
      <p>On trouve des piles de 1,5 – 3 – 4,5 – 6 – 9 – 15 et 22,5 V, en de nombreuses formes. Une pile est caractérisée par sa <b>tension</b> (V) et par sa <b>capacité</b> (Ah).</p>
      <p><b>Les piles bouton</b> (au mercure ou à l’argent) ont un très petit volume : la CR 2032 mesure 20 mm de diamètre et 3,2 mm d’épaisseur. L’hydrogène qui se forme sur la cathode est aussitôt neutralisé par l’oxygène de l’oxyde de mercure (ou d’argent) : il n’y a pas de polarisation.</p>
      ${exbox('a17sec','Dans une pile sèche saline, c’est…')}`,
     mount:root=>{
       mountOrderW(root.querySelector('#a17pol'),'A17pol',{items:['On branche une charge entre les bornes','Le courant circule du + vers le – à l’extérieur de la pile','De l’hydrogène se dégage sur la lame de cuivre et la lame de zinc s’use','Les bulles isolent la lame de cuivre de l’électrolyte','La f.é.m. tombe : la pile est polarisée'],shuffle:[3,0,4,2,1],ok:'D’où l’intérêt du dépolarisant.'});
       mountSortW(root.querySelector('#a17sec'),'A17sec',{cats:[['m','le pôle –'],['p','le pôle +'],['e','l’électrolyte'],['d','le dépolarisant']],items:[['Le récipient en zinc','m'],['Le crayon de charbon et sa capsule en laiton','p'],['Les sels acides et l’eau, en gel','e'],['Le mélange enfermé dans un sac en toile autour du charbon','d']],ok:'Juste.'}); }},
  ],
  prereq:[{t:'Distinguer force électromotrice et résistance interne d’un générateur',cap:'A17a'},{t:'Expliquer le fonctionnement chimique d’une pile (électrodes, électrolyte, polarisation)',cap:'A17b'},{t:'Décrire la constitution d’une pile sèche saline, alcaline et bouton',cap:'A17b'},{t:'Lire les caractéristiques d’une pile (tension, capacité en Ah)',cap:'A17b'}],
});

/* =================== CHAPITRE 18 — LES ACCUMULATEURS =================== */
defAF(18, {
  Q:{
    A18aq1:{q:"Pendant la charge d’un accumulateur au plomb, on raccorde…",o:["le + du chargeur au – de l’accumulateur","le + du chargeur au + de l’accumulateur, et le – au –","n’importe comment, en alternatif"],g:1,e:"Le pôle + du générateur se raccorde au + de l’accumulateur, le – au –, en courant continu.",r:'A18a'},
    A18aq2:{q:"Pourquoi faut-il ajouter de l’eau distillée dans une batterie à électrolyte liquide ?",o:["Pour la refroidir","Parce que l’eau se décompose en gaz pendant la charge, la décharge et l’arrêt","Pour augmenter la tension"],g:1,e:"Avec un électrolyte gélifié, la production de gaz est pratiquement nulle : plus d’entretien.",r:'A18a'},
    A18bq1:{q:"En dessous de quelle tension par élément ne faut-il jamais décharger un accumulateur au plomb ?",o:["2,4 V","1,8 V","0,5 V"],g:1,e:"En dessous de 1,8 V par élément, les plaques se détériorent.",r:'A18b'},
  },
  caps:[
    {id:'A18a', sec:'18.1 — 18.2', t:'Le fonctionnement de l’accumulateur', quiz:['A18aq1','A18aq2'], ex:{keys:['A18ch','A18org'], lbl:'La charge et les organes'},
     body:()=>`${progRef(['Expliquer la différence entre pile et accumulateur (réversibilité du phénomène chimique) (CM2D)'],'p. 27')}
      <p class="lead">Pendant la charge, un courant continu transforme chimiquement deux matières : l’accumulateur emmagasine de l’énergie. À l’utilisation, la transformation inverse restitue cette énergie sous forme de courant.</p>
      <p>On l’utilise pour le démarrage et l’alimentation des automobiles, mais aussi pour la traction de véhicules et d’engins spéciaux. Sa capacité, en ampères-heures, peut atteindre 200 Ah.</p>
      <p>Dans un bac d’eau et d’acide sulfurique, on plonge deux électrodes en plomb et on les soumet à un courant continu :</p>
      ${exbox('a18ch','La charge puis la décharge, dans l’ordre')}
      <h3>Les organes d’un accumulateur</h3>
      <ul><li><b>Le bac</b>, en matière plastique résistant aux acides.</li><li><b>L’électrolyte</b> : eau et acide sulfurique (24 à 28 degrés Baumé). Peu cher, mais la batterie doit rester horizontale, l’eau se décompose en gaz (il faut rajouter de l’eau distillée) et les vapeurs acides corrodent ce qui est autour. Les batteries à <b>électrolyte gélifié</b> (gel de silice) n’ont plus ces inconvénients : pas d’entretien, des soupapes de sûreté à la place des bouchons.</li><li><b>Les électrodes</b> : des grilles de plomb antimonié (plus dur), garnies d’oxyde de plomb (plaques +) et de plomb spongieux (plaques –).</li><li><b>Les séparateurs</b>, en plastique microporeux ou en fibres, entre les plaques + et –.</li></ul>
      ${exbox('a18org','À quel organe correspond chaque description ?')}`,
     mount:root=>{
       mountOrderW(root.querySelector('#a18ch'),'A18ch',{items:['On fait passer un courant continu entre les deux électrodes de plomb','L’hydrogène va sur l’électrode reliée au – (la cathode)','L’oxygène va sur l’électrode reliée au + (l’anode) et forme de l’oxyde de plomb','Les électrodes, maintenant différentes, ont une f.é.m. entre elles','On branche un récepteur : l’accumulateur se décharge et les électrodes reprennent leur aspect initial'],shuffle:[2,4,0,3,1],ok:'La réaction est réversible : c’est toute la différence avec une pile.'});
       mountSortW(root.querySelector('#a18org'),'A18org',{cats:[['b','Bac'],['e','Électrolyte'],['p','Électrodes'],['s','Séparateurs']],items:[['Eau et acide sulfurique','e'],['Plastique résistant aux acides','b'],['Grilles de plomb antimonié garnies de matière active','p'],['Feuilles microporeuses entre les plaques + et –','s'],['Gel de silice, sans entretien','e']],ok:'Juste.'}); }},
    {id:'A18b', sec:'18.3 — 18.5', t:'Tensions, capacité et état de charge', quiz:['A18bq1'], ex:{keys:['A18v','A18ind'], lbl:'Les calculs et les indices'},
     body:()=>`<p>Chaque élément produit, en pleine charge, une tension de <b>2,4 V</b>. Une batterie en compte généralement 3, 6, 12 ou 24, d’où 7,2 – 14,4 – 28,8 et 57,6 V en pleine charge. Au seuil de décharge minimum, chaque élément n’a plus que <b>1,8 V</b>.</p>
      <div class="note bad"><b>Important</b>Ne jamais laisser un accumulateur se décharger en dessous de 1,8 V par élément, sous peine de détériorer les plaques.</div>
      <p>Un accumulateur est caractérisé par sa <b>tension moyenne</b> (6, 12, 24 ou 48 V) et par sa <b>capacité nominale</b> en ampères-heures. Ces valeurs sont indiquées sur l’accumulateur.</p>
      ${exbox('a18v','Une batterie de 6 éléments')}
      ${tbl(['Indice','Fin de charge','Fin de décharge'],[['Tension par élément','2,7 V à 2,8 V','1,7 V à 1,8 V'],['Électrolyte','Bouillonne (enlever les bouchons)','—'],['Plaques positives','Brun prononcé','Brun pâle'],['Plaques négatives','Gris marqué','Gris pâle'],['Densité de l’électrolyte','28° Baumé','20° Baumé']])}
      <p class="small muted">Pendant la décharge, la tension varie peu : elle reste voisine de 2 V par élément.</p>
      ${exbox('a18ind','Fin de charge ou fin de décharge ?')}`,
     mount:root=>{
       mountDrillW(root.querySelector('#a18v'),'A18v',{rows:[{q:'Tension en pleine charge (2,4 V par élément)',unit:'V',ans:6*2.4},{q:'Tension au seuil de décharge minimum (1,8 V par élément)',unit:'V',ans:6*1.8},{q:'Tension moyenne pendant la décharge (environ 2 V par élément)',unit:'V',ans:6*2}],ok:'C’est la batterie « 12 V » d’une voiture.'});
       mountSortW(root.querySelector('#a18ind'),'A18ind',{cats:[['c','Fin de charge'],['d','Fin de décharge']],items:[['L’électrolyte bouillonne','c'],['1,8 V par élément','d'],['Plaques positives brun pâle','d'],['Densité de 28° Baumé','c'],['Plaques négatives gris marqué','c'],['Densité de 20° Baumé','d']],ok:'Juste.'}); }},
  ],
  prereq:[{t:'Distinguer pile et accumulateur et justifier le choix de l’un ou l’autre selon l’usage',cap:'A18a'},{t:'Citer les tensions de charge et de décharge d’un élément au plomb',cap:'A18b'}],
});

/* =================== CHAPITRE 19 — COUPLAGE DES GÉNÉRATEURS =================== */
defAF(19, {
  Q:{
    A19aq1:{q:"Dans I = E / (R + r), que représente r ?",o:["La résistance extérieure","La résistance interne du générateur","Le rendement"],g:1,e:"R est la résistance du circuit extérieur, r celle du générateur lui-même.",r:'A19a'},
    A19bq1:{q:"Comment relie-t-on des piles en série ?",o:["Tous les + ensemble et tous les – ensemble","Le – de la 1re au + de la 2e, le – de la 2e au + de la 3e…","Peu importe"],g:1,e:"C’est le couplage en tension : les f.é.m. s’additionnent.",r:'A19b'},
    A19bq2:{q:"Une pile plate de 4,5 V contient…",o:["un élément de 4,5 V","trois éléments de 1,5 V en série","trois éléments de 1,5 V en parallèle"],g:1,e:"f.é.m. = n . E = 3 × 1,5 V = 4,5 V.",r:'A19b'},
    A19cq1:{q:"Peut-on coupler en parallèle deux piles de f.é.m. différentes ?",o:["Oui, sans problème","Non : la plus forte débite dans la plus faible, qui s’use sans rien alimenter","Oui, si elles ont la même taille"],g:1,e:"En parallèle, on ne couple que des éléments de même f.é.m.",r:'A19c'},
  },
  caps:[
    {id:'A19a', sec:'19.1', t:'Un générateur réel', quiz:['A19aq1'], ex:null,
     body:()=>`${progRef(['Appliquer la loi d’Ohm à un générateur (f.é.m. à vide / d.d.p. en charge) (CM2D)','Groupements de générateurs (CM2D)'],'p. 27')}
      <p class="lead">Une pile ou un accumulateur possède une <b>résistance interne r</b>. En charge, le courant traverse à la fois la résistance extérieure R et la résistance interne r.</p>
      ${fbox('I = E / (R + r)','le courant débité par un générateur de f.é.m. E et de résistance interne r')}
      ${terrain('C’est pour ça qu’une batterie fatiguée affiche encore 12 V au voltmètre (à vide), mais s’effondre dès qu’on démarre : sa résistance interne a augmenté.')}`},
    {id:'A19b', sec:'19.2', t:'Le couplage en série', quiz:['A19bq1','A19bq2'], ex:{keys:['A19se'], lbl:'Les tensions à vide'},
     body:()=>`<p>On relie le – du 1er élément au + du 2e, le – du 2e au + du 3e, et ainsi de suite.</p>
      <h3>À vide</h3>
      ${tbl(['Nombre de piles','Tension mesurée','Relation'],[['1 pile','1,5 V','E'],['2 piles','3 V','2 . 1,5 V = 2 E'],['3 piles','4,5 V','3 . 1,5 V = 3 E']])}
      <div class="tri-row">${fbox('f.é.m. = n . E','n éléments identiques en série — éléments différents : f.é.m. = E1 + E2 + E3 + …')}${triangle('f.é.m.','n','E')}</div>
      <h3>En charge</h3>
      <p>On ajoute des piles sans rien changer au circuit extérieur : 50 mA avec une pile, 98 mA avec deux, 135 mA avec trois. Le courant traverse tous les éléments : leurs résistances internes s’additionnent aussi (n . r).</p>
      ${tbl(['1 pile','2 piles','n piles'],[[fm('I = E / (R + r)'),fm('I = 2 . E / (R + 2 . r)'),fm('I = n . E / (R + n . r)')]])}
      ${exbox('a19se','Combien de volts à vide ?','Éléments de 1,5 V en série.')}`,
     mount:root=>mountDrillW(root.querySelector('#a19se'),'A19se',{rows:[{q:'4 éléments de 1,5 V',unit:'V',ans:4*1.5},{q:'6 éléments de 1,5 V',unit:'V',ans:6*1.5},{q:'Combien d’éléments de 1,5 V pour obtenir 12 V ?',unit:'éléments',ans:12/1.5,tol:0},{q:'Un élément de 1,5 V, un de 3 V et un de 4,5 V en série',unit:'V',ans:1.5+3+4.5}],ok:'En série, les f.é.m. s’additionnent.'})},
    {id:'A19c', sec:'19.3', t:'Le couplage en parallèle', quiz:['A19cq1'], ex:{keys:['A19sp'], lbl:'Série ou parallèle ?'},
     body:()=>`<p>On relie les bornes négatives ensemble et les bornes positives entre elles.</p>
      <p><b>À vide</b> : 1, 2 ou 3 piles de 1,5 V donnent toujours <b>1,5 V</b>. Pour des éléments de même f.é.m., la tension à vide reste E, quel que soit le nombre d’éléments.</p>
      <div class="note warn"><b>Remarque</b>Pour des éléments de f.é.m. différentes, le couplage n’est pas réalisable : les piles les plus fortes débitent dans les plus faibles, qui s’usent sans être utilisées.</div>
      <p><b>En charge</b> : 50 mA avec une pile, 50,4 mA avec deux, 50,5 mA avec trois. La f.é.m. reste E, mais la résistance interne équivalente diminue, puisque les résistances internes sont en parallèle : r / n.</p>
      ${tbl(['2 piles','3 piles','n piles'],[[fm('I = E / (R + r / 2)'),fm('I = E / (R + r / 3)'),fm('I = E / (R + r / n)')]])}
      ${exbox('a19sp','Série ou parallèle ?')}`,
     mount:root=>mountSortW(root.querySelector('#a19sp'),'A19sp',{cats:[['s','Série'],['p','Parallèle']],items:[['Les f.é.m. s’additionnent','s'],['La tension à vide reste celle d’un seul élément','p'],['Les résistances internes s’additionnent','s'],['La résistance interne équivalente vaut r / n','p'],['La pile plate de 4,5 V','s'],['Seulement avec des éléments de même f.é.m.','p']],ok:'Série pour plus de tension ; parallèle pour un générateur qui s’essouffle moins.'})},
  ],
  prereq:[{t:'Appliquer la loi d’Ohm à un générateur réel',cap:'A19a'},{t:'Calculer le courant et la tension d’un groupement de générateurs en série',cap:'A19b'},{t:'Calculer le courant et la tension d’un groupement de générateurs en parallèle',cap:'A19c'}],
});

/* =================== CHAPITRE 20 — MULTIPLES ET SOUS-MULTIPLES =================== */
defAF(20, {
  Q:{
    A20aq1:{q:"Que vaut le préfixe « micro » (µ) ?",o:["10⁻³","10⁻⁶","10⁶"],g:1,e:"Milli = 10⁻³, micro = 10⁻⁶, nano = 10⁻⁹. Méga = 10⁶.",r:'A20a'},
    A20bq1:{q:"10⁴ . 10³ = ?",o:["10⁷","10¹²","10¹"],g:0,e:"Produit de puissances de même base : on additionne les exposants.",r:'A20b'},
    A20bq2:{q:"10⁶ / 10⁸ = ?",o:["10²","10⁻²","10¹⁴"],g:1,e:"Quotient de puissances de même base : on soustrait les exposants, 6 − 8 = −2.",r:'A20b'},
  },
  caps:[
    {id:'A20a', sec:'20.1 — 20.2', t:'Les multiples et sous-multiples', quiz:['A20aq1'], ex:{keys:['A20conv'], lbl:'Les conversions'},
     body:()=>`${progRef(['Compétence transversale — outil de calcul, en lien avec le cours de mathématique (Méthodologie, p. 24)'],'p. 24')}
      <p class="lead">Pour simplifier l’écriture des nombres très grands ou très petits, on utilise des préfixes : on parle d’un différentiel de trente milliampères, d’un disque dur de deux téraoctets… Ces abréviations facilitent les calculs et limitent les erreurs.</p>
      ${tbl(['Préfixe','Symbole','Puissance de 10','Valeur'],[['Exa','E','10¹⁸','1 000 000 000 000 000 000'],['Péta','P','10¹⁵','1 000 000 000 000 000'],['Téra','T','10¹²','1 000 000 000 000'],['Giga','G','10⁹','1 000 000 000'],['Méga','M','10⁶','1 000 000'],['Kilo','k','10³','1 000'],['Unité','—','10⁰','1'],['Milli','m','10⁻³','0,001'],['Micro','µ','10⁻⁶','0,000 001'],['Nano','n','10⁻⁹','0,000 000 001'],['Pico','p','10⁻¹²','0,000 000 000 001'],['Femto','f','10⁻¹⁵','—'],['Atto','a','10⁻¹⁸','—']])}
      <p class="small muted">Dans les réponses, tu peux écrire une puissance de dix avec ^ : <code>3 . 10^-2</code> ou <code>0,03</code>, c’est accepté.</p>
      ${exbox('a20conv','Convertis dans l’unité demandée')}`,
     mount:root=>mountDrillW(root.querySelector('#a20conv'),'A20conv',{rows:[{q:'30 mA en A',unit:'A',ans:0.03},{q:'4,7 kΩ en Ω',unit:'Ω',ans:4700},{q:'680 µA en A',unit:'A',ans:680e-6},{q:'1,2 GW en W',unit:'W',ans:1.2e9},{q:'0,5 MΩ en kΩ',unit:'kΩ',ans:500}].map(r=>Object.assign(r,{tol:0.005})),ok:'Prêt pour les puissances de dix.'})},
    {id:'A20b', sec:'20.3', t:'Les propriétés des puissances', quiz:['A20bq1','A20bq2'], ex:{keys:['A20pw'], lbl:'Calculs avec les puissances'},
     body:()=>`${tbl(['Propriété','Formule','En mots'],[
        ['Puissance d’un produit',fm('(a . b)^n = a^n . b^n'),'on élève chaque facteur à cette puissance'],
        ['Puissance d’un quotient',fm('(a / b)^n = a^n / b^n'),'on élève le dividende et le diviseur'],
        ['Produit de même base',fm('a^m . a^n = a^(m+n)'),'on additionne les exposants'],
        ['Quotient de même base',fm('a^m / a^n = a^(m−n)'),'on soustrait les exposants'],
        ['Puissance d’une puissance',fm('(a^m)^n = a^(m.n)'),'on multiplie les exposants'],
        ['Racine d’une puissance',fm('√(a^m) = a^(m/2)'),'on divise l’exposant par l’indice de la racine']])}
      <div class="note"><b>Exemples du cours</b>${fm('3.10^6 . 5.10^3 = 15.10^9')} · ${fm('6.10^3 . 2.10^-6 = 12.10^-3')} · ${fm('(10^3)^2 = 10^6')} · ${fm('√(10^6) = 10^3')}</div>
      ${exbox('a20pw','À toi','Donne le résultat, par exemple 8 . 10^5.')}`,
     mount:root=>mountDrillW(root.querySelector('#a20pw'),'A20pw',{rows:[{q:'2 . 10³ × 4 . 10²',unit:'',ans:8e5},{q:'6 . 10⁻³ ÷ (2 . 10³)',unit:'',ans:3e-6},{q:'(10²)³',unit:'',ans:1e6},{q:'√(10⁸)',unit:'',ans:1e4},{q:'5 . 10⁴ × 3 . 10⁻²',unit:'',ans:1.5e3}].map(r=>Object.assign(r,{tol:0.005})),ok:'Les exposants n’ont plus de secret pour toi.'})},
    {id:'A20c', sec:'20.4', t:'Exercices', quiz:[], ex:{keys:['A20x1','A20x2','A20x3'], lbl:'Les trois exercices'},
     body:()=>`<p class="lead">Écris tes résultats en puissances de dix dans la colonne « Solution ». Dans la case résultat, <code>24 . 10^8</code> ou <code>2,4 . 10^9</code>, c’est la même valeur : les deux sont acceptés.</p>
      ${AX(20,'A20x1',1,'Une installation photovoltaïque a une puissance crête de 2,4 MWc et produit en moyenne 1 000 kWh par kWc installé chaque année. Calculer sa production annuelle, en Wh, et l’exprimer sous la forme d’un produit d’un nombre entier et d’une puissance de 10.',[{lbl:'Production annuelle',unit:'Wh',ans:2.4e3*1000*1e3,tol:0.005}],{hint:'2,4 MWc = 2 400 kWc ; 1 kWh = 10³ Wh.'})}
      ${AX(20,'A20x2',2,'La centrale nucléaire de Tihange possède trois réacteurs nucléaires dont la puissance est respectivement de 870 MW, 1 030 MW et 1 200 MW. Exprimer en watts la puissance totale des trois réacteurs.',[{lbl:'Puissance totale',unit:'W',ans:(870+1030+1200)*1e6,tol:0.005}])}
      ${AX(20,'A20x3',3,'Une box internet domestique atteint un débit descendant de 900 Mbit/s en 4G/5G, tandis qu’un abonnement fibre optique annonce 8 Gbit/s. Exprimer ces deux débits en bit/s, sous la forme d’un produit d’un nombre entier et d’une puissance de 10.',[{lbl:'Box 4G/5G',unit:'bit/s',ans:900e6,tol:0.005},{lbl:'Fibre optique',unit:'bit/s',ans:8e9,tol:0.005}])}`},
  ],
  prereq:[{t:'Utiliser les préfixes et puissances de dix pour exprimer des grandeurs électriques',cap:'A20a'},{t:'Appliquer les propriétés des puissances dans un contexte électrique',cap:'A20b'},{t:'Passer d’une écriture décimale à une écriture scientifique et inversement',cap:'A20c'}],
});
})();
