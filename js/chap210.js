/* =========================================================
   CHAPITRE 2.10 — LE CADRE LÉGAL, LES RISQUES PARTICULIERS ET L'HYGIÈNE
   Contenu repris du cours d'Électricité 4e, pages 125 à 131.
   ========================================================= */
(function(){
const Q210 = {
  j1q1:{q:"Qui délivre l'habilitation BA4 ou BA5 ?",o:["L'école, avec le diplôme","L'employeur, par écrit, pour des travaux et un domaine de tension précis","Le RGIE, automatiquement"],g:1,e:"Ce n'est ni un diplôme, ni définitif : elle se révise, notamment au changement de fonction.",r:'j1'},
  j1q2:{q:"La loi sur le bien-être au travail impose-t-elle quelque chose au travailleur ?",o:["Non, seulement à l'employeur","Oui : utiliser les équipements de protection et signaler ce qu'il constate","Seulement s'il est BA5"],g:1,e:"L'employeur analyse les risques, prévient, informe, forme et fournit les EPI ; le travailleur les utilise et signale.",r:'j1'},
  j2q1:{q:"Qu'impose un permis de feu ?",o:["Un extincteur dans le véhicule","Une surveillance pendant et après le travail par point chaud","Le port d'un harnais"],g:1,e:"Soudage, meulage, tronçonnage, décapage thermique.",r:'j2'},
  j3q1:{q:"Un collègue te demande de retirer le capot d'une découpe laser « juste deux secondes » pour observer le faisceau. Ta réponse ?",o:["D'accord, mais vite","Non : on ne neutralise jamais un capot de sécurité pour observer le faisceau","D'accord avec des lunettes de soleil"],g:1,e:"Rayonnement laser : le capot est la protection.",r:'j3'},
  j3q2:{q:"Pourquoi une simple étincelle suffit-elle à créer un danger en zone ATEX ?",o:["Parce que l'atmosphère contient des gaz, vapeurs ou poussières inflammables","Parce que le matériel est plus fragile","Ce n'est pas le cas"],g:0,e:"Le matériel doit être certifié pour la zone, et toute intervention exige un permis spécifique.",r:'j3'},
  j4q1:{q:"Une échelle est-elle un poste de travail ?",o:["Oui, pour de courts travaux","Non : c'est un moyen d'accès, pour monter et descendre","Oui, si elle est bien calée"],g:1,e:"On ne travaille pas perché, les deux mains occupées.",r:'j4'},
  j4q2:{q:"Peut-on déplacer un échafaudage roulant avec quelqu'un dessus ?",o:["Oui, lentement","Jamais","Oui, si les stabilisateurs sont relevés"],g:1,e:"Roues bloquées, stabilisateurs déployés, plancher complet, garde-corps sur les quatre côtés, accès par l'intérieur.",r:'j4'},
  j5q1:{q:"Pourquoi compte-t-on les outils avant et après une intervention sur une ligne alimentaire ?",o:["Pour l'inventaire du magasin","Un outil perdu dans une ligne devient un corps étranger dans le produit","Pour éviter le vol"],g:1,e:"Les règles d'hygiène visent la protection du produit — un manquement peut détruire un lot entier.",r:'j5'},
};
defChapter({
  num:'2.10', titre:'Le cadre légal, les risques particuliers et l’hygiène', tp:'É11',
  evalInfo:'L’évaluation formative 2.10 (37 points, seuil 26) se passe sur papier, en classe, avec ton prof.',
  prereqTitle:'Les objectifs du chapitre, avant l’épreuve blanche É11',
  Q:Q210,
  caps:[
    {id:'j1', sec:'2.10.1-2.10.2', t:'Les textes et les habilitations', pdf:125, quiz:['j1q1','j1q2'], ex:{keys:['j1sort'], lbl:'Qui impose quoi'},
     body:()=>`${tbl(['Texte','Ce qu’il impose'],[['Le RGIE','Le Règlement Général sur les Installations Électriques : conception, réalisation et contrôle des installations en Belgique — sections, protections, mise à la terre, code couleur, contrôles périodiques par un organisme agréé. Depuis 2020, trois livres ; le livre 1 traite de la basse et très basse tension.'],['La loi du 4 août 1996 sur le bien-être au travail','L’employeur analyse les risques, prend les mesures de prévention, informe, forme et fournit les équipements de protection. Le travailleur les utilise et signale ce qu’il constate.'],['Le Code du bien-être au travail','Le détail par thème : équipements de travail, travail en hauteur, produits dangereux, signalisation, ambiances.'],['Les normes','Pas des lois, mais l’état de l’art : les respecter est la façon la plus simple de prouver qu’on a fait ce qu’il fallait.']])}
      <h3 style="margin-top:16px">Les habilitations</h3>
      ${tbl(['Niveau','Ce qu’il recouvre'],[['BA4 — personne avertie','Information suffisante sur le risque électrique pour éviter les dangers. Intervient sur instruction et sous la surveillance d’une personne qualifiée.'],['BA5 — personne qualifiée','Formation technique et expérience pour évaluer elle-même le risque et intervenir en autonomie.']])}
      <p class="small">L'habilitation est délivrée par l'employeur, pour des travaux et un domaine de tension précis. Elle n'est ni un diplôme, ni définitive. En atelier scolaire, tu travailles toujours sous la responsabilité de ton prof.</p>
      ${exbox('j1box','D’où vient cette obligation ?')}`,
     mount:root=>mountSortW(root.querySelector('#j1box'),'j1sort',{cats:[['rg','RGIE'],['lo','Loi bien-être'],['co','Code bien-être']],items:[['Le code couleur des conducteurs','rg'],['L’employeur doit former et informer les travailleurs','lo'],['Les règles détaillées du travail en hauteur','co'],['Le contrôle périodique de l’installation par un organisme agréé','rg'],['Le travailleur doit utiliser ses EPI et signaler ce qu’il constate','lo'],['Les règles de signalisation de sécurité','co']],ok:'Juste.'})},
    {id:'j2', sec:'2.10.3', t:'Les autorisations de travail', pdf:125, quiz:['j2q1'], ex:{keys:['j2sort'], lbl:'Quelle autorisation ?'},
     body:()=>`${tbl(['Autorisation','Quand elle est requise'],[['Bon ou permis de travail','Le document de base : travail, zone, risques, mesures. Signé avant le début.'],['Permis de feu','Tout travail par point chaud : soudage, meulage, tronçonnage, décapage thermique. Surveillance pendant et après.'],['Permis d’espace confiné','Cuve, silo, fosse, gaine : atmosphère appauvrie ou toxique, évacuation difficile. Surveillance extérieure obligatoire.'],['Autorisation de travail en hauteur','Au-delà d’une certaine hauteur ou sans protection collective.'],['Permis de fouille','Avant toute excavation, à cause des canalisations enterrées.'],['VCA','Certification de sécurité demandée par les entreprises donneuses d’ordre : le personnel intervenant doit en être titulaire.']])}
      ${exbox('j2box','Quelle autorisation pour…')}`,
     mount:root=>mountSortW(root.querySelector('#j2box'),'j2sort',{cats:[['fe','Permis de feu'],['ec','Espace confiné'],['ha','Travail en hauteur'],['fo','Permis de fouille']],items:[['Meuler un support de moteur dans l’atelier de peinture','fe'],['Remplacer un détecteur de niveau à l’intérieur d’un silo','ec'],['Remplacer un luminaire sous la toiture, sans garde-corps','ha'],['Creuser pour passer un câble enterré vers un abri','fo'],['Souder une patte de fixation sur un châssis','fe']],ok:'Juste.'})},
    {id:'j3', sec:'2.10.4', t:'Les environnements à risque particulier', pdf:126, quiz:['j3q1','j3q2'], ex:{keys:['j3atex','j3bruit'], lbl:'Zones ATEX et bruit'},
     body:()=>`${tbl(['Environnement','Ce qui change'],[['Atmosphères explosibles','Gaz, vapeurs ou poussières inflammables. Matériel certifié pour la zone, permis spécifique. Une étincelle de contact suffit.'],['Émanations toxiques','Ventilation, détection portative, protection respiratoire, travail à deux.'],['Rayonnement laser','Découpe, marquage. Ne jamais neutraliser un capot de sécurité pour observer le faisceau.'],['Rayonnements ionisants','Contrôle d’épaisseur, radiographie. Zones balisées, accès réglementé, dosimètre.'],['Bruit','Au-delà des seuils, protection auditive obligatoire et zone signalée.'],['Compatibilité électromagnétique','Choix des câbles, cheminement et blindage.']])}
      <h3 style="margin-top:16px">Les zones ATEX</h3>
      <p>Une zone à atmosphère explosible est classée <b>selon la fréquence</b> à laquelle l'atmosphère explosive y apparaît. Le classement est établi par l'exploitant et reporté sur un plan ; l'entrée de chaque zone est signalée par un triangle jaune marqué <b>EX</b>. Pour les gaz et vapeurs :</p>
      ${tbl(['Zone','L’atmosphère explosive est présente…'],[['Zone 0','En permanence, pendant de longues périodes ou fréquemment — par exemple à l’intérieur d’une cuve'],['Zone 1','Occasionnellement, en fonctionnement normal — autour des ouvertures et des points de remplissage'],['Zone 2','Rarement, et pour une courte durée, en cas d’anomalie — autour de la zone 1']])}
      <p class="small">Les poussières suivent le même principe, avec les zones 20, 21 et 22. Plus l'atmosphère explosive est fréquente, plus le matériel admis est exigeant.</p>
      ${exbox('j3a','Quelle zone ?','Autour d’une cuve de solvant.')}
      <h3>Le bruit, en chiffres</h3>
      ${tbl(['Exposition quotidienne','Ce qui est imposé'],[['80 dB(A)','Protecteurs auditifs mis à disposition ; travailleurs informés'],['85 dB(A)','Port obligatoire ; zone signalée, accès limité'],['87 dB(A)','Valeur limite, à ne jamais dépasser — protecteurs compris']])}
      ${exbox('j3b','Ce qui s’applique')}`,
     mount:root=>{
       mountSortW(root.querySelector('#j3a'),'j3atex',{cats:[['0','Zone 0'],['1','Zone 1'],['2','Zone 2']],items:[['L’intérieur de la cuve, au-dessus du liquide','0'],['Autour de l’ouverture de remplissage, utilisée chaque jour','1'],['Un peu plus loin, où le solvant n’arrive qu’en cas de fuite accidentelle','2']],ok:'Juste : plus c’est fréquent, plus le numéro est bas.'});
       mountSortW(root.querySelector('#j3b'),'j3bruit',{cats:[['d','Mis à disposition'],['o','Port obligatoire'],['x','Interdit : au-delà de la limite']],items:[['Exposition de 82 dB(A) sur la journée','d'],['Exposition de 86 dB(A)','o'],['88 dB(A) au tympan, protecteurs portés','x','87 dB(A) est la valeur limite, protecteurs compris.']],ok:'Juste.'});
     }},
    {id:'j4', sec:'2.10.5', t:'Les travaux en hauteur', pdf:127, quiz:['j4q1','j4q2'], ex:{keys:['j4ord','j4dr','j4ech'], lbl:'Priorités, échelle et échafaudage'},
     body:()=>`${exbox('j4o','L’ordre des priorités','La réglementation impose un ordre : on ne choisit pas librement son moyen d’accès.')}
      ${tbl(['Équipement','Ce qu’il faut savoir'],[['Échelle','Moyen d’accès, pas poste de travail. Angle d’environ 75° — le pied s’écarte du mur d’un quart de la hauteur —, dépassement d’au moins 1 m au-dessus du point d’accès, pieds stables.'],['Escabeau et marchepied','Courte durée, faible hauteur. Jamais sur la dernière marche.'],['Échafaudage roulant','Roues bloquées, stabilisateurs déployés, plancher complet, garde-corps sur les quatre côtés, accès par l’intérieur. Jamais déplacé avec quelqu’un dessus.'],['Nacelle élévatrice','Formation spécifique obligatoire. Harnais attaché au point d’ancrage de la nacelle.'],['Harnais','Contrôle avant chaque usage, ancrage vérifié, longe adaptée. Inutile sans un ancrage capable de tenir.']])}
      ${exbox('j4d','Drill — placer une échelle','Un pied pour quatre : la distance entre le pied et le mur vaut le quart de la hauteur d’appui.')}
      ${exbox('j4e','Avant de monter sur l’échafaudage roulant : tu montes ou pas ?')}`,
     mount:root=>{
       mountOrderW(root.querySelector('#j4o'),'j4ord',{items:['Éviter le travail en hauteur, si la tâche peut se faire au sol','Privilégier la protection collective : plateforme, garde-corps, échafaudage','En dernier recours : la protection individuelle, harnais et point d’ancrage'],shuffle:[2,0,1],ok:'Éviter, protéger collectivement, et seulement ensuite individuellement.'});
       mountDrillW(root.querySelector('#j4d'),'j4dr',{rows:[[4],[6],[3.2],[2.4]].map(([h])=>({q:`Accès à ${fr(h,1)} m → distance du pied au mur`,unit:'m',ans:h/4,tol:0.001})).concat([{q:'Accès à 4 m → longueur minimale au-dessus du point d’accès',unit:'m',ans:1,tol:0.001},{q:'Pied posé à 0,75 m du mur → hauteur d’appui',unit:'m',ans:3,tol:0.001}])});
       mountSortW(root.querySelector('#j4e'),'j4ech',{cats:[['ok','Conforme'],['ko','Je ne monte pas']],items:[['Fiche de contrôle présente, à jour et signée','ok'],['Une planche du plancher manque','ko'],['Garde-corps et plinthes sur les quatre côtés','ok'],['Stabilisateurs repliés pour passer la porte','ko'],['Diagonales de contreventement montées','ok'],['Charge admissible : 150 kg ; deux techniciens et leur outillage','ko','La charge admissible se respecte outillage compris.']],ok:'Juste : un seul point non conforme, et on ne monte pas.'});
     }},
    {id:'j5', sec:'2.10.6-2.10.7', t:'Pictogrammes et hygiène', pdf:128, quiz:['j5q1'], ex:{keys:['j5sort'], lbl:'Lire un pictogramme'},
     body:()=>`${tbl(['Forme et couleur','Signification','Exemples'],[['Rond, fond rouge barré','Interdiction','Défense de fumer, interdit aux piétons'],['Triangle jaune, bord noir','Danger, avertissement','Risque électrique, matière inflammable, charges suspendues, laser'],['Rond bleu','Obligation','Protection oculaire, casque, chaussures, harnais'],['Carré ou rectangle vert','Sauvetage et secours','Issue de secours, point de rassemblement, douche oculaire'],['Carré ou rectangle rouge','Matériel de lutte contre l’incendie','Extincteur, alarme, robinet d’incendie armé']])}
      <p class="small">La forme et la couleur portent le sens : un pictogramme se comprend même sans connaître le symbole, vite et dans n'importe quelle langue.</p>
      ${exbox('j5box','Que dit ce pictogramme ?')}
      <h3>L'hygiène selon les secteurs</h3>
      ${tbl(['Secteur','Contraintes propres à l’intervenant'],[['Agroalimentaire','Tenue et chaussures dédiées, charlotte, parfois un sas. Outillage propre et dénombré avant et après. Ni bois, ni verre. Lubrifiants de qualité alimentaire. Nettoyage et désinfection après.'],['Pharmaceutique, salle blanche','Habillage complet, matériel dédié, particules limitées. Perçage et meulage sur autorisation.'],['Chimie','Fiches de données de sécurité, protections adaptées, décontamination, douches de sécurité repérées.'],['Métallurgie et fonderie','Chaleur, projections, poussières : protections thermiques et respiratoires.']])}
      <div class="note" style="margin-top:14px"><b>Le point commun</b>L'intervenant de maintenance apporte de l'extérieur ce qui ne devrait pas y entrer : poussière, graisse, outils, particules. Les règles protègent le produit — et la sanction d'un manquement est un lot entier détruit.</div>`,
     mount:root=>mountSortW(root.querySelector('#j5box'),'j5sort',{cats:[['in','Interdiction'],['da','Danger'],['ob','Obligation'],['se','Secours'],['fe','Incendie']],items:[['Un rond bleu avec un casque','ob'],['Un triangle jaune avec un éclair','da'],['Un rectangle vert avec une flèche et une porte','se'],['Un rond rouge barré sur une cigarette','in'],['Un carré rouge avec un extincteur','fe'],['Un triangle jaune avec une charge suspendue','da']],ok:'Juste : forme et couleur d’abord.'})},
  ],
  prereq:[
    {t:'Citer les textes qui encadrent le métier et ce que chacun impose ; expliquer BA4 et BA5.', cap:'j1'},
    {t:'Identifier les travaux exigeant une autorisation écrite.', cap:'j2'},
    {t:'Reconnaître les environnements à risque supplémentaire et lire le classement des zones ATEX.', cap:'j3'},
    {t:'Utiliser un équipement de travail en hauteur et contrôler un échafaudage avant usage.', cap:'j4'},
    {t:'Reconnaître les pictogrammes ; appliquer les règles d’hygiène d’un secteur.', cap:'j5'},
  ],
  controle:[
    ['Citer trois textes qui encadrent le métier et ce que chacun impose.','j1'],
    ['Quelle est la différence entre une personne BA4 et une personne BA5 ? Qui délivre l’habilitation ?','j1'],
    ['Citer quatre autorisations de travail et la situation qui les rend nécessaires.','j2'],
    ['Citer quatre environnements à risque particulier et ce qui y change pour l’intervenant.','j3'],
    ['À partir de quel niveau de bruit les protecteurs sont-ils obligatoires ? Que se passe-t-il à 80 dB(A) ?','j3'],
    ['Énoncer dans l’ordre les trois priorités du travail en hauteur.','j4'],
    ['Citer sept points à vérifier avant de monter sur un échafaudage roulant.','j4'],
    ['À quoi correspondent un pictogramme rond bleu, un triangle jaune et un carré vert ?','j5'],
    ['Citer quatre contraintes propres à une intervention en agroalimentaire.','j5'],
  ],
});
})();
