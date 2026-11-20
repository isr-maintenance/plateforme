/* =========================================================
   CATALOGUE — structure des filières, classes et cours
   (le contenu fixe ; les données vivantes sont dans le Google Sheet)
   ========================================================= */

const FILIERES = [
  { id:'3qem', code:'3QEM', nom:'Électromécanique', annees:[3], type:'elec', fin:'dernière année : 2027-2028' },
  { id:'eqem', code:'EQEM', nom:'Électricien(ne) de maintenance industrielle', court:'Électricien MI', annees:[4,5,6], type:'elec' },
  { id:'eqmm', code:'EQMM', nom:'Mécanicien(ne) de maintenance industrielle', court:'Mécanicien MI', annees:[4,5,6], type:'meca' },
];

/* statut : demo = chapitre animé disponible · attente = ressources attendues */
const COURS = [
  // --- 3QEM (grille de la brochure) — disparaît à la rentrée 2028
  { id:'3em-elec', titre:'Électricité', sous:'électricité, dessin, technologie', type:'elec', per:3, pour:[['3qem',3]], statut:'attente' },
  { id:'3em-meca', titre:'Mécanique', sous:'mécanique, dessin', type:'meca', per:3, pour:[['3qem',3]], statut:'attente' },
  { id:'3em-tpe',  titre:'TP électricité', type:'tp', per:4, pour:[['3qem',3]], statut:'attente', module:'dossier' },
  { id:'3em-tpm',  titre:'TP mécanique', type:'tp', per:4, pour:[['3qem',3]], statut:'attente' },
  // --- 4e : Électricité et Mécanique communes aux deux filières
  { id:'4-elec', titre:'Électricité', sous:'UAA1 · début UAA2 · début UAA3', type:'elec', per:3, pour:[['eqem',4],['eqmm',4]], statut:'demo', pdf:'elec4', commun:true },
  { id:'4-meca', titre:'Mécanique', type:'meca', per:3, pour:[['eqem',4],['eqmm',4]], statut:'attente', commun:true },
  { id:'4eqem-tpe', titre:'TP électricité', type:'tp', per:4, pour:[['eqem',4]], statut:'demo-tp', tps:true, module:'dossier' },
  { id:'4eqem-tpem', titre:'TP électromécanique', type:'tp', per:4, pour:[['eqem',4]], statut:'attente' },
  { id:'4eqmm-tpm', titre:'TP mécanique', type:'tp', per:4, pour:[['eqmm',4]], statut:'attente' },
  { id:'4eqmm-tpem', titre:'TP électromécanique', type:'tp', per:4, pour:[['eqmm',4]], statut:'attente' },
  // --- 5e et 6e
  ...[5,6].flatMap(a => ['eqem','eqmm'].flatMap(f => [
    { id:a+f+'-tpt', titre:'Traitement de problème technique', type:f==='eqem'?'elec':'meca', per:8, pour:[[f,a]], statut:'attente', src:'cours 4-5-6 du collègue' },
    { id:a+f+'-tp',  titre:'Travaux pratiques', type:'tp', per:8, pour:[[f,a]], statut:'attente', src:'cours 4-5-6 du collègue' },
  ])),
];

/* profs d'exemple, utilisés seulement en mode test local */
const PROFS_DEF = [
  { nom:'O. Lesenfants', mail:'olivier.lesenfants@elmarche.be', role:'Coordinateur' },
  { nom:'P. Dachelet', mail:'philippe.dachelet@elmarche.be', role:'Professeur' },
  { nom:'G. Baudson', mail:'gregory.baudson@elmarche.be', role:'Professeur' },
  { nom:'L. Degossly', mail:'logan.degossly@elmarche.be', role:'Professeur' },
];

const CLASSES = [
  // 3QEM : la classe de l'élève est son groupe de TP (cours de TP) ; son groupe de CT (cours techniques) est réglé par un prof
  { id:'3qem1', nom:'3QEM TP groupe 1', fil:'3qem', annee:3, mode:'souple' },
  { id:'3qem2', nom:'3QEM TP groupe 2', fil:'3qem', annee:3, mode:'souple' },
  { id:'3qem3', nom:'3QEM TP groupe 3', fil:'3qem', annee:3, mode:'souple' },
  { id:'3qemct1', nom:'3QEM CT groupe 1', fil:'3qem', annee:3, mode:'souple', ct:true },
  { id:'3qemct2', nom:'3QEM CT groupe 2', fil:'3qem', annee:3, mode:'souple', ct:true },
  { id:'4eqem', nom:'4EQEM', fil:'eqem', annee:4, mode:'strict' },
  { id:'4eqmm', nom:'4EQMM', fil:'eqmm', annee:4, mode:'strict' },
  { id:'5eqem', nom:'5EQEM', fil:'eqem', annee:5, mode:'souple' },
  { id:'5eqmm', nom:'5EQMM', fil:'eqmm', annee:5, mode:'souple' },
  { id:'6eqem', nom:'6EQEM', fil:'eqem', annee:6, mode:'souple' },
  { id:'6eqmm', nom:'6EQMM', fil:'eqmm', annee:6, mode:'souple' },
];
const CLASSES_ELEVE = CLASSES.filter(c=>!c.ct);   // ce qu'on choisit comme classe (en 3QEM : le groupe de TP)
const CT_GROUPES = CLASSES.filter(c=>c.ct);
/* cours donnés à un groupe : en 3QEM, les TP vont aux groupes de TP et les cours techniques aux groupes de CT */
function coursDe(c){ const L=coursFor(c.fil,c.annee); if(c.fil!=='3qem') return L; return L.filter(co=> c.ct ? co.type!=='tp' : co.type==='tp'); }
/* exemple d'attributions, utilisé seulement en mode test local */
const AFFECT_DEF = [
  { cl:'3qem1', c:'3em-tpe', profs:['O. Lesenfants'] },
  { cl:'3qem2', c:'3em-tpe', profs:['O. Lesenfants'] },
  { cl:'3qem3', c:'3em-tpe', profs:['G. Baudson'] },
  { cl:'4eqmm', c:'4-elec', profs:['O. Lesenfants'] },
  { cl:'4eqem', c:'4eqem-tpe', profs:['O. Lesenfants','P. Dachelet'] },
];
let AFFECT = [];
const affOf = (cl,c) => AFFECT.find(x=>x.cl===cl && x.c===c);
const profsOf = (cl,c) => (affOf(cl,c)||{profs:[]}).profs;

/* Cours d'Électricité 4e — version révisée (pages du PDF de la plateforme) */
const ELEC4 = [
  { uaa:'UAA1 — Remplacer des composants électriques défectueux dans la partie opérative des machines et hors tableau', vol:'33 h · épreuve certificative en juin', chaps:[
    ['2.1','Sécurité électrique et appareils de mesure de base',8,'É01'],
    ['2.2',"Les bases de l'électricité",23,'É02'],
    ['2.3','Le relais électromécanique',53,'É03'],
    ['2.4','Le contacteur et le démarrage direct',63,'É04'],
    ['2.5','Les protections et la sécurité positive',73,'É05'],
    ['2.6',"Le dossier technique et la documentation d'une intervention",91,'É06 · É08'],
    ['2.7','Les mesures avancées et la protection des personnes',96,'É07'],
    ['2.8','Les composants hors tableau et leur remplacement',105,'É09'],
    ['2.9','Le moteur, la remise en service et le rapport',115,'É10'],
    ['2.10','Le cadre légal, les risques particuliers et l’hygiène',125,'É11'],
    ['2.11',"Synthèse et préparation à l'épreuve",132,'Épreuve certificative UAA1'],
  ]},
  { uaa:'UAA2 (début) — Remplacer des éléments électriques défectueux dans les tableaux', vol:'24 h · validation en 5e', chaps:[
    ['3.1','Préparer une intervention en tableau électrique',135,null],
    ['3.2','Remplacer des composants sans réglage particulier',138,null],
    ['3.3','Remplacer des composants nécessitant un paramétrage',141,null],
    ['3.4','Actualiser le dossier et synthèse',145,null],
  ]},
  { uaa:'UAA3 (début) — Composants électriques, électropneumatiques et électrohydrauliques', vol:'24 h · validation en 5e', chaps:[
    ['4.1','Préparer une intervention pluritechnologique',147,null],
    ['4.2','Les composants électriques simples hors tableau',149,null],
    ['4.3',"L'électropneumatique",151,null],
    ['4.4',"L'électrohydraulique",154,null],
    ['4.5','Remise en service pluritechnologique et synthèse',158,null],
  ]},
];
/* Annexes : [titre, page dans la version prof (complète), page dans la version élèves ou null si réservée aux profs]
   La version élèves est la version complète sans les annexes E (corrigés), H (évaluations formatives) et I (leurs corrigés).
   Les élèves retrouvent chaque évaluation et son corrigé dans la plateforme, quand leur évaluation est terminée. */
const ELEC4_ANNEXES_ALL = [
  ['Annexe A — Couverture des acquis de l’UAA1',161,161],
  ['Annexe B — Formulaire et valeurs à retenir',162,162],
  ['Annexe C — Glossaire',165,165],
  ['Annexe D — Problèmes de métier',167,167],
  ['Annexe E — Corrigés',184,null],
  ['Annexe F — Fiche de suivi de l’élève',214,184],
  ['Annexe G — Fiche méthode : tracer un schéma',218,188],
  ['Annexe H — Évaluations formatives',218,null],
  ['Annexe I — Corrigés des évaluations formatives',259,null],
];
/* Annexes visibles selon la vue (prof ou élève / aperçu élève) : [titre, page, réservée aux profs] */
function elec4Annexes(){
  const prof = typeof S!=='undefined' && S.role==='prof';
  return ELEC4_ANNEXES_ALL.filter(a=>prof || a[2]!=null).map(([t,pp,pe])=>[t, prof?pp:pe, pe==null]);
}

/* Évaluations formatives de l'annexe H : [chapitre, total, seuil] */
const FORMATIVES = [
  ['2.1',25,18],['2.2',50,35],['2.3',23,17],['2.4',26,19],['2.5',34,24],['2.6',20,14],['2.7',39,28],['2.8',35,25],['2.9',42,30],['2.10',37,26],
  ['3.1',18,13],['3.2',30,21],['3.3',36,26],['3.4',20,14],['4.1',17,12],['4.2',24,17],['4.3',40,28],['4.4',36,26],['4.5',25,18],
];

const TP_E = [
  ['É01','Outillage électricien, VAT, multimètre, pince'],
  ['É02','Premier câblage monophasé, code couleur'],
  ['É03','Relais, cinq exercices progressifs'],
  ['É04','Circuit avec contacteur, démarrage direct d’un moteur'],
  ['É05','Marche/Arrêt avec auto-maintien et relais thermique'],
];

/* Périodes du bulletin par défaut (modifiables dans le carnet de cotes) */
const PERIODES_DEF = [
  { id:'p1', nom:'Période 1', debut:'2026-08-31', fin:'2026-10-16' },
  { id:'p2', nom:'Période 2', debut:'2026-11-02', fin:'2026-12-18' },
  { id:'p3', nom:'Période 3', debut:'2027-01-04', fin:'2027-03-26' },
  { id:'p4', nom:'Période 4', debut:'2027-04-12', fin:'2027-06-30' },
];
/* Évaluations par défaut (modifiables : barème, seuil, poids, date) */
const EVAL_DATES = {'2.1':'2026-10-02','2.2':'2026-10-14','2.3':'2026-11-20','2.4':'2026-12-04','2.5':'2026-12-16','2.6':'2027-01-22','2.7':'2027-02-05','2.8':'2027-02-26','2.9':'2027-03-19','2.10':'2027-04-23'};
const EVALS_DEF = {
  '4eqmm|4-elec': FORMATIVES.map(([ch,t,s])=>({ id:'F'+ch, lib:'Formative '+ch, orig:t, total:t, seuil:s, poids:1, date:EVAL_DATES[ch]||'', src:'plateforme' })),
  '4eqem|4eqem-tpe': [['É01','2026-09-25'],['É02','2026-10-09'],['É03','2026-11-27'],['É04','2027-01-15'],['É05','2027-02-12']].map(([e,dt])=>({ id:e, lib:'TP '+e, total:20, seuil:12, poids:1, date:dt, src:'manuel' })),
};

/* Stages : 4e = 1 × 2 semaines · 5e = 2 × 2 semaines · 6e = 2 × 3 semaines */
const STAGE_REGLE = { 4:{n:1,sem:2}, 5:{n:2,sem:2}, 6:{n:2,sem:3} };
const STAGE_PER_DEF = [
  { id:'s4',  annee:4, nom:'Stage de 4e',  debut:'2027-03-01', fin:'2027-03-12' },
  { id:'s5a', annee:5, nom:'Stage 1 de 5e', debut:'2026-12-07', fin:'2026-12-18' },
  { id:'s5b', annee:5, nom:'Stage 2 de 5e', debut:'2027-05-03', fin:'2027-05-14' },
  { id:'s6a', annee:6, nom:'Stage 1 de 6e', debut:'2026-11-16', fin:'2026-12-04' },
  { id:'s6b', annee:6, nom:'Stage 2 de 6e', debut:'2027-03-08', fin:'2027-03-26' },
];
/* lieux d'exemple, utilisés seulement en mode test local */
const LIEUX_DEF = [
  { id:'l1', nom:'Entreprise exemple 1', localite:'Marche-en-Famenne', secteur:'Maintenance industrielle', tuteur:'Nom du tuteur', tel:'', mail:'', fil:['eqem','eqmm'], note:'Exemple à remplacer' },
  { id:'l2', nom:'Entreprise exemple 2', localite:'Aye', secteur:'Agroalimentaire — ligne de production', tuteur:'Nom du tuteur', tel:'', mail:'', fil:['eqem'], note:'Exemple à remplacer' },
  { id:'l3', nom:'Entreprise exemple 3', localite:'Hotton', secteur:'Atelier mécanique', tuteur:'Nom du tuteur', tel:'', mail:'', fil:['eqmm'], note:'Exemple à remplacer' },
];

