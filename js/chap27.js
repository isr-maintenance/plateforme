/* =========================================================
   CHAPITRE 2.7 — LES MESURES AVANCÉES ET LA PROTECTION DES PERSONNES
   Contenu repris du cours d'Électricité 4e, pages 96 à 104.
   ========================================================= */
(function(){
const Q27 = {
  g1q1:{q:"Pourquoi ne mesure-t-on pas une isolation au multimètre ?",o:["Il n'applique que quelques volts : un isolant dégradé peut paraître parfait sous 3 V et laisser passer le courant sous 400 V","Il n'a pas la fonction Ω","Il est trop précis"],g:0,e:"Le mégohmmètre produit lui-même une haute tension d'essai — 250, 500 ou 1000 V — et mesure le courant de fuite.",r:'g1'},
  g1q2:{q:"Pourquoi décharge-t-on le circuit après la mesure ?",o:["Pour remettre l'appareil à zéro","Un long câble reste chargé comme un condensateur","Pour économiser la pile"],g:1,e:"Après la mesure, le circuit reste chargé à la tension d'essai.",r:'g1'},
  g1q3:{q:"Sur un moteur, qu'est-ce qui annonce le mieux la panne ?",o:["Une seule valeur, comparée à un seuil","La tendance : la comparaison avec les mesures précédentes","La couleur du vernis"],g:1,e:"D'où l'importance de noter les valeurs au rapport, avec la tension d'essai et la date.",r:'g1'},
  g2q1:{q:"Pourquoi retire-t-on les barrettes pour mesurer entre enroulements ?",o:["Les barrettes relient les enroulements entre eux : sans les retirer, on mesurerait un court-circuit","Pour les nettoyer","Ce n'est pas nécessaire"],g:0,e:"On note le couplage avant, et on replace les barrettes selon le couplage noté après.",r:'g2'},
  g3q1:{q:"Comment mesure-t-on une pointe de démarrage à la pince ?",o:["On regarde vite l'afficheur","Avec le mode de capture de la valeur maximale, activé avant le démarrage","C'est impossible"],g:1,e:"La pointe ne dure que quelques instants : l'afficheur n'a pas le temps de la montrer.",r:'g3'},
  g3q2:{q:"Quand une pince TRMS est-elle indispensable ?",o:["Toujours en continu","Dès qu'un variateur de vitesse ou une alimentation à découpage déforme le courant","Jamais en atelier"],g:1,e:"Une pince à valeur moyenne se trompe largement sur un courant qui n'est plus sinusoïdal.",r:'g3'},
  g4q1:{q:"Plus le différentiel est sensible, la résistance de terre tolérée est…",o:["Plus faible","Plus élevée","La même"],g:1,e:"R ≤ 50 ÷ IΔn : un 30 mA se contente d'une terre médiocre, un 300 mA en exige une bonne.",r:'g4'},
  g4q2:{q:"Pendant la mesure de terre, la barrette de mesure est ouverte. Conséquence ?",o:["Aucune","L'installation n'a plus de terre : personne ne travaille dessus et la barrette est refermée avant toute remise sous tension","Le différentiel déclenche"],g:1,e:"Refermer la barrette.",r:'g4'},
  g5q1:{q:"Comment inverse-t-on le sens de rotation d'un moteur triphasé ?",o:["En permutant deux des trois phases, installation consignée","En permutant une phase et le PE","En retournant le moteur"],g:0,e:"Le conducteur de protection, lui, ne se touche jamais.",r:'g5'},
  g5q2:{q:"« 230 » est-il une mesure ?",o:["Oui","Non : une mesure a une unité et dit entre quels points — « 230 V entre L1 et N »","Oui, si c'est écrit au rapport"],g:1,e:"On note ce que l'on a mesuré, entre quels points, avec quel appareil et dans quelles conditions.",r:'g5'},
  g6q1:{q:"Un différentiel protège-t-il d'un contact direct entre phase et neutre ?",o:["Oui, toujours","Non : le courant reste équilibré, l'appareil ne voit rien","Oui, s'il est de 300 mA"],g:1,e:"C'est pourquoi l'isolation et les capots restent la première barrière. Le 30 mA n'agit en complément que si le courant s'échappe vers la terre.",r:'g6'},
};
defChapter({
  num:'2.7', titre:'Les mesures avancées et la protection des personnes', tp:'É07',
  evalInfo:'L’évaluation formative 2.7 (39 points, seuil 28) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant le TP É07',
  Q:Q27,
  caps:[
    {id:'g1', sec:'2.7.1 a-d', t:'Le mégohmmètre', pdf:96, quiz:['g1q1','g1q2','g1q3'], ex:{keys:['g1ord','g1sort'], lbl:'La procédure et la lecture'},
     body:()=>`<p class="lead">Le mégohmmètre produit lui-même une <b>haute tension d'essai</b> — 250, 500 ou 1000 V — et mesure le courant de fuite qui en résulte.</p>
      ${exbox('g1o','La procédure, dans l’ordre')}
      ${tbl(['Circuit mesuré','Exemples','Tension d’essai'],[['Très basse tension de sécurité ou de protection','Circuit de commande 24 V','250 V'],['Jusqu’à 500 V','Prises et éclairage 230 V, moteur 230/400 V','500 V'],['Au-delà de 500 V','Réseau 690 V','1 000 V']])}
      <p class="small">Assez haute pour révéler un isolant affaibli, pas au point de l'abîmer.</p>
      ${tbl(['Lecture','Interprétation'],[['Plusieurs centaines de MΩ','Isolation en excellent état — valeur typique d’un matériel neuf'],['Quelques MΩ','Correcte mais qui se dégrade : à surveiller et à noter au dossier'],['Autour de 1 MΩ ou moins','Insuffisante : humidité, poussière conductrice, vernis dégradé. On ne remet pas sous tension.'],['Proche de zéro','Défaut franc : conducteur en contact avec la masse']])}
      <p class="small muted">Valeurs indicatives : le RGIE et la notice du constructeur font foi.</p>
      ${exbox('g1s','Lis la mesure','Que fais-tu de chaque résultat ?')}`,
     mount:root=>{
       mountOrderW(root.querySelector('#g1o'),'g1ord',{items:['Consigner l’installation : la mesure se fait hors tension','Déconnecter le circuit du reste de l’installation','Débrancher ou court-circuiter les composants électroniques','Choisir la tension d’essai selon la tension de service','Raccorder les pointes, porter les gants isolants, lancer la mesure','Décharger le circuit après la mesure'],shuffle:[3,5,0,4,1,2],ok:'La procédure de mesure d’isolement.',hint:'Hors tension d’abord ; on décharge à la fin.'});
       mountSortW(root.querySelector('#g1s'),'g1sort',{cats:[['ok','Bon'],['su','À surveiller'],['ko','On ne remet pas sous tension']],items:[['Moteur neuf : 450 MΩ','ok'],['Câble ancien : 4 MΩ','su'],['Moteur d’une machine à laver industrielle : 0,8 MΩ','ko'],['Enroulement vers masse : 0,02 MΩ','ko','Défaut franc : conducteur en contact avec la masse.'],['Circuit de commande : 300 MΩ','ok']],ok:'Juste.'});
     }},
    {id:'g2', sec:'2.7.1 e', t:'Mesurer l’isolement d’un moteur', pdf:96, quiz:['g2q1'], ex:{keys:['g2ord','g2sort'], lbl:'Les six mesures'},
     body:()=>`<p class="lead"><b>Six mesures</b> : trois entre chaque enroulement et la masse, trois entre enroulements — qui demandent de retirer les barrettes.</p>
      ${exbox('g2o','La procédure sur un moteur, dans l’ordre')}
      ${exbox('g2s','Un moteur, sous 500 V : ton verdict pour chaque mesure ?','U1–masse 250 MΩ · V1–masse 240 MΩ · W1–masse 0,6 MΩ · U1–V1 300 MΩ · V1–W1 280 MΩ · W1–U1 290 MΩ')}`,
     mount:root=>{
       mountOrderW(root.querySelector('#g2o'),'g2ord',{items:['Consigner, puis débrancher les câbles d’alimentation de la plaque à bornes','Noter le couplage, puis retirer les barrettes','Mesurer U1, V1 puis W1 vers la borne de terre du moteur','Mesurer U1–V1, V1–W1, W1–U1','Noter les six valeurs au rapport, avec la tension d’essai et la date','Décharger, replacer les barrettes selon le couplage noté, rebrancher'],shuffle:[2,4,0,5,3,1],ok:'Les six mesures, dans l’ordre.'});
       mountSortW(root.querySelector('#g2s'),'g2sort',{cats:[['ok','Bon'],['ko','Défaut']],items:[['U1–masse : 250 MΩ','ok'],['V1–masse : 240 MΩ','ok'],['W1–masse : 0,6 MΩ','ko','L’enroulement W est en défaut vers la masse : le moteur ne repart pas, on prévient le responsable.'],['Entre enroulements : 280 à 300 MΩ','ok']],ok:'Juste : un seul enroulement en défaut, vers la masse. Le moteur ne repart pas.'});
     }},
    {id:'g3', sec:'2.7.2', t:'La pince ampèremétrique en charge', pdf:97, quiz:['g3q1','g3q2'], ex:{keys:['g3sort'], lbl:'Interpréter les courants'},
     body:()=>`${tbl(['Mesure','Ce qu’elle révèle'],[['Courant en fonctionnement','À comparer au nominal de la plaque. Un dépassement durable annonce une surcharge mécanique.'],['Courant à vide','Environ un tiers à la moitié du nominal sur un moteur sain. Anormalement élevé : problème dans le moteur lui-même.'],['Équilibre entre les trois phases','Les trois courants doivent être très proches. Un écart marqué : phase perdue, enroulement en défaut ou mauvais serrage.']])}
      <p class="small" style="margin-top:12px">La <b>pointe de démarrage</b> se mesure avec le mode de capture de la valeur maximale, activé avant le démarrage. Dès qu'un variateur ou une alimentation à découpage est présent, il faut une pince <b>TRMS</b>, à valeur efficace vraie.</p>
      ${exbox('g3box','Moteur de plaque 6,4 A : que conclus-tu ?')}`,
     mount:root=>mountSortW(root.querySelector('#g3box'),'g3sort',{cats:[['ok','Normal'],['sc','Surcharge mécanique'],['de','Défaut électrique']],items:[['6,1 · 6,2 · 6,0 A en charge','ok'],['8,1 A en continu sur les trois phases','sc','Le thermique ne déclenche pas encore : on cherche la cause mécanique avant qu’il ne le fasse.'],['6,2 · 6,3 · 4,1 A','de','Un écart marqué : borne mal serrée, phase anormale, enroulement en défaut. On vérifie d’abord les serrages.'],['À vide : 2,6 A','ok','Un tiers à la moitié du nominal à vide.'],['À vide : 6,0 A','de','Courant à vide anormalement élevé : le problème est dans le moteur.']],ok:'Juste.'})},
    {id:'g4', sec:'2.7.3', t:'La prise de terre', pdf:98, quiz:['g4q1','g4q2'], ex:{keys:['g4dr','g4ord'], lbl:'La règle des 50 V et la mesure'},
     body:()=>`<p class="lead">La prise de terre donne au courant de défaut un <b>chemin de retour franc</b>. Sans elle, une carcasse touchée par un conducteur actif reste sous tension et attend la première personne qui la touchera. Avec elle, le courant s'écoule, le différentiel voit le déséquilibre et coupe.</p>
      ${formula('R × IΔn ≤ 50 V','La résistance de terre multipliée par la sensibilité du différentiel reste sous la tension de contact admissible')}
      <p class="small">Avec un différentiel de 300 mA : R ≤ 50 ÷ 0,3 ≈ 166 Ω. Indépendamment, le RGIE fixe des valeurs maximales — 30 Ω pour une habitation. On vérifie les deux conditions et on retient la plus contraignante.</p>
      ${terrain('« Cette terre est-elle bonne ? » On relève la sensibilité du différentiel, on divise 50 par cette valeur, on compare à la mesure. Plus le différentiel est sensible, plus la terre tolérée est élevée — remplacer un différentiel par un plus sensible est parfois la solution la plus rapide sur une installation ancienne.')}
      ${exbox('g4d','Drill — la règle des 50 V','R ≤ 50 ÷ IΔn, avec IΔn en ampères. Arrondis à l’ohm inférieur.')}
      <h3>La mesure : trois piquets</h3>
      ${exbox('g4o','Remets la méthode des trois piquets dans l’ordre','Installation consignée, au mesureur de terre.')}
      <div class="note bad"><b>Refermer la barrette</b>Tant qu'elle est ouverte, l'installation n'a plus de terre. Personne ne travaille dessus pendant la mesure, et elle est refermée avant toute remise sous tension.</div>`,
     mount:root=>{
       mountDrillW(root.querySelector('#g4d'),'g4dr',{rows:[[30,1666],[100,500],[300,166],[500,100]].map(([ma,r])=>({q:`IΔn = ${ma} mA → R maximale`,unit:'Ω',ans:r,tol:0,abs:1.01,hint:`${ma} mA = ${fr(ma/1000,3)} A.`})).concat([{q:'Différentiel 300 mA, terre mesurée 120 Ω : marge restante sous la limite',unit:'Ω',ans:46,tol:0,abs:1.01,hint:'166 − 120.'}])});
       mountOrderW(root.querySelector('#g4o'),'g4ord',{items:['Ouvrir la barrette de mesure pour séparer la prise de terre E','Planter le piquet de courant H à une vingtaine de mètres','Planter le piquet de potentiel S sur la même ligne, à 62 % de la distance','Raccorder E, S et H au mesureur et lancer la mesure','Déplacer S d’un mètre de part et d’autre : la valeur doit rester stable','Refermer la barrette'],shuffle:[3,0,5,2,4,1],ok:'La méthode des trois piquets.'});
     }},
    {id:'g5', sec:'2.7.4-2.7.5', t:'Les autres appareils, les unités et la précision', pdf:99, quiz:['g5q1','g5q2'], ex:{keys:['g5sort','g5dr'], lbl:'Choisir l’appareil, calculer la précision'},
     body:()=>`${tbl(['Appareil','Mesure','Usage typique'],[['Contrôleur de phases','L’ordre de succession des phases','Avant de remettre un moteur en service : le sens de rotation, sans faire tourner'],['Caméra thermique','La température de surface, sans contact','Borne mal serrée, moteur qui chauffe — sous tension, sans ouvrir le circuit'],['Contrôleur d’installation','Continuité du PE, boucle de défaut, différentiels','Contrôle périodique réglementaire'],['Thermomètre à contact ou infrarouge','La température d’un point précis','Bornes, contacteurs, carcasse d’un moteur'],['Manomètre et débitmètre','Pression et débit','Circuits pneumatiques et hydrauliques']])}
      ${exbox('g5s','Quel appareil pour…')}
      <h3>Les unités et la précision</h3>
      <p class="small">Aucun appareil n'est exact : sa précision s'exprime en <b>% de la lecture, plus quelques digits</b> — des unités du dernier chiffre affiché. Exemple : ± (0,5 % + 2 digits) sur 230,0 V → 1,15 V + 0,2 V = ± 1,35 V. La tension réelle est entre 228,65 V et 231,35 V.</p>
      ${exbox('g5d','Drill — la précision d’un appareil','Valeur basse = lecture − incertitude ; valeur haute = lecture + incertitude.')}`,
     mount:root=>{
       mountSortW(root.querySelector('#g5s'),'g5sort',{cats:[['ph','Contrôleur de phases'],['ca','Caméra thermique'],['ci','Contrôleur d’installation'],['me','Mégohmmètre']],items:[['Vérifier le sens de rotation avant la remise en service','ph'],['Trouver une borne desserrée sans arrêter l’armoire','ca'],['Mesurer le temps de déclenchement d’un différentiel','ci'],['Contrôler l’isolement d’un bobinage','me']],ok:'Juste.'});
       const rows=[[230.0,0.5,2,0.1,'230,0 V · ± (0,5 % + 2 digits)','V'],[12.00,1,3,0.01,'12,00 V · ± (1 % + 3 digits)','V'],[6.40,2,5,0.01,'6,40 A · ± (2 % + 5 digits)','A'],[400,0.8,2,1,'400 V · ± (0,8 % + 2 digits)','V']];
       mountDrillW(root.querySelector('#g5d'),'g5dr',{rows:rows.flatMap(([L,p,d,u,lbl,un])=>{ const inc=L*p/100+d*u; return [{q:`${lbl} : valeur basse`,unit:un,ans:L-inc,tol:0,abs:0.006},{q:'… valeur haute',unit:un,ans:L+inc,tol:0,abs:0.006}]; }),hint:'Un digit = une unité du dernier chiffre affiché : 0,1 sur 230,0 ; 0,01 sur 12,00.'});
     }},
    {id:'g6', sec:'2.7.6', t:'Contacts directs et indirects', pdf:99, quiz:['g6q1'], ex:{keys:['g6sort'], lbl:'Direct ou indirect'},
     body:()=>`${tbl(['','Définition et protections'],[['Contact direct','Toucher une pièce normalement sous tension : un conducteur dénudé, une borne. Protections : isolation, enveloppes et capots, écrans, barrières, éloignement, et en dernier recours la très basse tension.'],['Contact indirect','Toucher une masse mise accidentellement sous tension par un défaut d’isolement. Protections : mise à la terre des masses + coupure automatique (différentiel ou surintensité selon le régime de neutre). Aussi : double isolation, transformateur de séparation.']])}
      <div class="note warn" style="margin-top:14px"><b>La distinction détermine la protection</b>Un différentiel ne protège pas d'un contact direct entre phase et neutre : le courant reste équilibré. L'isolation et les capots restent la première barrière. Le 30 mA agit en complément si la personne touche une phase en étant en contact avec la terre — c'est pourquoi il est imposé sur les prises et les salles d'eau.</div>
      ${exbox('g6box','Contact direct ou indirect ?')}`,
     mount:root=>mountSortW(root.querySelector('#g6box'),'g6sort',{cats:[['d','Direct'],['i','Indirect']],items:[['Toucher la borne L1 d’un contacteur, capot retiré','d'],['Toucher la carcasse d’un moteur dont un enroulement touche la masse','i'],['Saisir un câble dont la gaine est entaillée jusqu’au cuivre','d'],['Toucher le bâti d’une machine mis sous tension par un fil desserré','i']],ok:'Juste. Direct : isolation et capots d’abord. Indirect : terre des masses et coupure automatique.'})},
  ],
  prereq:[
    {t:'Choisir la tension d’essai et mesurer une résistance d’isolement en sécurité, et l’interpréter.', cap:'g1'},
    {t:'Mesurer l’isolement d’un moteur.', cap:'g2'},
    {t:'Mesurer un courant en charge et une pointe de démarrage.', cap:'g3'},
    {t:'Expliquer le rôle de la prise de terre, la règle qui fixe sa valeur et sa mesure.', cap:'g4'},
    {t:'Choisir l’appareil adapté et contrôler l’ordre des phases.', cap:'g5'},
    {t:'Distinguer contact direct et contact indirect et citer les protections de chacun.', cap:'g6'},
  ],
  controle:[
    ['Pourquoi ne mesure-t-on pas une isolation au multimètre ?','g1'],
    ['Pourquoi faut-il déconnecter le circuit avant de mesurer son isolement ?','g1'],
    ['Quelle tension d’essai pour un circuit de commande 24 V ? Pour un moteur 230/400 V ?','g1'],
    ['Citer les six mesures d’isolement d’un moteur triphasé. Que fait-on des barrettes ?','g2'],
    ['Quelles sont les trois mesures utiles à la pince sur un moteur ?','g3'],
    ['Énoncer la règle qui lie la résistance de terre et la sensibilité du différentiel.','g4'],
    ['Mesure de terre : où place-t-on les piquets S et H ? Comment vérifie-t-on la mesure ?','g4'],
    ['À quoi sert un contrôleur de phases ?','g5'],
    ['Quelle est la différence entre un contact direct et un contact indirect ?','g6'],
  ],
});
})();
