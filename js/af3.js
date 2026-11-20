/* =========================================================
   COURS D'ÉLECTRICITÉ 3QEM — « AMPÈRE & FILS »
   Partie 1 « Électricité fondamentale », 20 chapitres.
   Contenu original : M. Evrard (Institut Saint-Roch), remanié « Ampère & Fils ».
   Ce fichier : le formulaire du cours et l'outil commun des chapitres (af3-1 à af3-4).
   Clé interne d'un chapitre : « 0.N » ; il s'affiche « N ».
   Identifiants : capsules « A6a », questions « A6aq1 », exercices « A6x1 » (A = Ampère & Fils).
   Les réponses des exercices sont calculées dans le code, jamais recopiées.
   ========================================================= */
const AF_COURSE='3em-elec';
/* déclare un chapitre du cours 3QEM : chaque capsule monte aussi ses tableaux et ses triangles */
function defAF(n, ch){
  (ch.prereq||[]).forEach((x,i)=>{ if(!x.cap && !x.atel) x.atel='A'+n+'at'+i; });   // point « à l'atelier » : case cochée par le prof dans Suivi
  ch.caps.forEach(c=>{ const m=c.mount; c.mount=root=>{ if(m) m(root); mountAllDIFS(root); mountTriangles(root); }; });
  defChapter(Object.assign({ num:'0.'+n, lbl:String(n), course:AF_COURSE, titre:AF3[n-1][0], tp:'', noEval:true,
    synT:'Synthèse du chapitre', synSub:'ce que tu sais faire maintenant',
    prereqTitle:'Ce que tu sais faire à la fin de ce chapitre',
    prereqNote:'Les compétences du chapitre. Chaque point se coche quand la capsule correspondante est validée.' }, ch));
}
/* exercice en quatre colonnes du chapitre n */
const AX = (n, key, num, enonce, res, more) => DX(key, Object.assign({ course:AF_COURSE, chap:'0.'+n, n:num, enonce, res }, more||{}));
/* encadré « référence programme » en tête de chapitre */
const progRef = (refs, page) => `<details class="note" style="margin-top:0"><summary style="cursor:pointer"><b style="display:inline">📘 Référence programme</b> <span class="tiny muted">programme FESeC Électromécanique, ${page}</span></summary><ul class="small" style="margin:6px 0 0 18px">${refs.map(r=>`<li>${r}</li>`).join('')}</ul></details>`;
const defBox = (t, txt) => `<div class="note"><b>${t||'Définition'}</b>${txt}</div>`;
const labo = (tab, txt) => `<div class="note" style="margin:14px 0"><b>Pour t'entraîner encore : le labo des lois de base</b>${txt} <a class="btn sm" style="margin-left:6px" href="outils/lois-electricite.html#${tab}" target="_blank" rel="opener">Ouvrir le labo ↗</a></div>`;

/* ---------- le formulaire général du cours (bouton 📐 Formulaire) ---------- */
FORMULAIRES[AF_COURSE] = {
  titre:'Formulaire — Électricité 3QEM',
  intro:'Toutes les lois du cours, dans l’ordre des chapitres. Cherche celle qu’il te faut, puis <b>recopie-la toi-même</b> dans ton tableau : l’écrire t’aide à la retenir.',
  lois:[
    ['Loi de Coulomb','Q = I . t',['I = Q / t','t = Q / I'],'Q : Cb ou Ah — I : A — t : s ou h · 1 Ah = 3 600 Cb','6'],
    ['Loi de Pouillet','R = ρ . L / S',['L = R . S / ρ','S = ρ . L / R','ρ = R . S / L'],'R : Ω — ρ : Ω·mm²/m — L : m — S : mm²','7'],
    ['Section d’un conducteur rond','S = π . d^2 / 4',['S = π . r^2','d = √(4 . S / π)'],'S : mm² — d (diamètre), r (rayon) : mm','7'],
    ['Loi d’Ohm','U = R . I',['R = U / I','I = U / R'],'U : V — R : Ω — I : A','8'],
    ['Loi de Mathiessen','Rt = R0 . (1 + α . t)',['R0 = Rt / (1 + α . t)','α = (Rt − R0) / (R0 . t)','t = (Rt − R0) / (R0 . α)'],'R : Ω — α : /°C — t : °C · R0 = résistance à 0 °C','9'],
    ['Puissance électrique','P = U . I',['U = P / I','I = P / U'],'P : W — U : V — I : A','10'],
    ['Énergie électrique','W = P . t',['W = U . I . t','P = W / t','t = W / P'],'W : J (si t en s) ou Wh (si t en h) · 1 kWh = 3 600 000 J','10-11'],
    ['Loi de Joule (énergie)','W = R . I^2 . t',['R = W / (I^2 . t)','I = √(W / (R . t))','t = W / (R . I^2)'],'W : J — R : Ω — I : A — t : s','11'],
    ['Puissance Joule','P = R . I^2',['R = P / I^2','I = √(P / R)'],'P : W — R : Ω — I : A','11'],
    ['Résistances en série','RT = R1 + R2 + R3 + …',['IT = I1 = I2 = I3 = …','UT = U1 + U2 + U3 + …','U1 = R1 . I'],'R : Ω — U : V — I : A','12'],
    ['Chute de tension en ligne','UL = UG − UR',['UL = RL . IL','RL = ρ . L / S','UL = ρ . L . J','J = I / S'],'U : V — RL : Ω — L : m (aller-retour) — S : mm² — J : A/mm²','13'],
    ['Résistances en parallèle','1 / Réqu = 1/R1 + 1/R2 + 1/R3 + …',['Réqu = R1 . R2 / (R1 + R2)','UT = U1 = U2 = U3 = …','IT = I1 + I2 + I3 + …','I1 = U / R1'],'R : Ω — U : V — I : A','14'],
    ['Voltmètre : résistance additionnelle','Ra = (Vt − Vm) / Im',['Vm = Rm . Im'],'Vt : calibre voulu (V) — Vm, Im, Rm : tension, courant et résistance du cadre mobile à pleine échelle','16'],
    ['Ampèremètre : shunt','Rs = (Rm . Im) / (IT − Im)',['Is = IT − Im'],'IT : calibre voulu (A) — Im, Rm : courant et résistance du cadre mobile','16'],
    ['Générateur en charge','I = E / (R + r)',[],'E : f.é.m. (V) — R : résistance extérieure, r : résistance interne (Ω)','19'],
    ['Piles identiques en série','I = n . E / (R + n . r)',['f.é.m. = n . E','f.é.m. = E1 + E2 + E3 + …'],'n : nombre d’éléments','19'],
    ['Piles identiques en parallèle','I = E / (R + r / n)',['f.é.m. = E'],'n : nombre d’éléments','19'],
    ['Puissances de dix','a^m . a^n = a^(m+n)',['a^m / a^n = a^(m−n)','(a^m)^n = a^(m.n)','(a . b)^n = a^n . b^n'],'utile pour les multiples et sous-multiples','20'],
  ],
  valeurs:[
    ['Résistivité ρ à 20 °C',['Matériau','ρ (Ω·mm²/m)'],[['Argent','0,016'],['Cuivre','0,01725 (souvent 0,0175 dans les exercices)'],['Aluminium','0,028'],['Tungstène','0,056'],['Bronze','0,067'],['Laiton','0,07'],['Fer','0,1'],['Maillechort','0,25'],['Manganine','0,42'],['Ferro-nickel','0,8'],['Mercure','0,958'],['Nickel-chrome','1']]],
    ['Coefficient de température α',['Matériau','α (/°C)'],[['Cuivre','3,93 . 10⁻³'],['Argent','3,85 . 10⁻³'],['Aluminium','4,3 . 10⁻³'],['Tungstène','6,5 . 10⁻³'],['Manganine','voisin de 0'],['Carbone','−0,4 . 10⁻³']]],
    ['Multiples et sous-multiples',['Préfixe','Symbole','Valeur'],[['Téra','T','10¹²'],['Giga','G','10⁹'],['Méga','M','10⁶'],['Kilo','k','10³'],['Milli','m','10⁻³'],['Micro','µ','10⁻⁶'],['Nano','n','10⁻⁹'],['Pico','p','10⁻¹²']]],
  ],
};
