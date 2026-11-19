/* Tests du backend (Api.gs) avec un stockage en mémoire */
const fs = require('fs'), vm = require('vm'), crypto = require('crypto'), assert = require('assert');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../apps-script/donnees/Api.gs', 'utf8') + '\nthis.makeApi = makeApi;', ctx);

function memStore(){ const m = {}; return {
  get: k => k in m ? JSON.parse(JSON.stringify(m[k])) : null,
  set: (k, v) => { m[k] = JSON.parse(JSON.stringify(v)); },
  list: p => Object.keys(m).filter(k => k.startsWith(p)).map(k => ({ key: k, value: JSON.parse(JSON.stringify(m[k])) })),
  del: k => { delete m[k]; }, _m: m }; }
let clock = Date.UTC(2026, 10, 16);
const SECRET = 'test-secret';
const deps = {
  now: () => clock,
  hmac: s => crypto.createHmac('sha256', SECRET).update(s).digest('base64url'),
  b64: s => Buffer.from(s, 'utf8').toString('base64url'),
  unb64: s => Buffer.from(s, 'base64url').toString('utf8'),
};
const store = memStore(), api = ctx.makeApi(store, deps);
api.install('olivier.lesenfants@elmarche.be', 'O. Lesenfants');
const T = m => api.makeToken(m);
const call = (m, a, p) => api.handle({ t: T(m), a, p });
let n = 0; const ok = (c, msg) => { assert.ok(c, msg); n++; };

// --- connexion
ok(api.handle({ t: 'x.y', a: 'boot' }).code === 'auth', 'jeton invalide refusé');
ok(call('jean@gmail.com', 'boot').code === 'denied', 'autre domaine refusé');
ok(call('inconnu.prof@elmarche.be', 'boot').code === 'denied', 'prof non enregistré refusé');
const coord = call('olivier.lesenfants@elmarche.be', 'boot');
ok(coord.ok && coord.data.me.role === 'prof' && coord.data.me.coord, 'coordinateur reconnu');
// jeton expiré
const old = T('olivier.lesenfants@elmarche.be'); clock += 31 * 864e5;
ok(api.handle({ t: old, a: 'boot' }).code === 'auth', 'jeton expiré refusé'); clock -= 31 * 864e5;
// jeton falsifié
const [b] = old.split('.'); const forged = deps.b64(JSON.stringify({ e: 'olivier.lesenfants@elmarche.be', x: clock + 1e9 })) + '.' + 'AAAA';
ok(api.handle({ t: forged, a: 'boot' }).code === 'auth', 'signature falsifiée refusée');

// --- élève
const el = 'paul.martin.student@elmarche.be';
let r = call(el, 'boot'); ok(r.ok && r.data.me.role === 'eleve' && r.data.me.classe === null && r.data.me.nom === 'Paul Martin', 'élève reconnu, pas de classe');
ok(call(el, 'setClasse', { classe: 'xx' }).ok === false, 'classe inconnue refusée');
ok(call(el, 'setClasse', { classe: '4eqmm' }).ok, 'classe choisie');
ok(call(el, 'setClasse', { classe: '4eqem' }).ok === false, 'élève ne peut pas changer seul sa classe');
ok(call(el, 'setNote', { key: '4eqmm|4-elec', kind: 'over', ev: 'F2.3', mail: el, v: '20' }).ok === false, 'élève ne peut pas encoder de note');
ok(call(el, 'setProfs', { profs: [] }).ok === false, 'élève ne peut pas modifier les profs');
// progression + évaluation
r = call(el, 'saveProg', { prog: { quiz: { c1q1: { ok: true } }, banc: true, test: { submitted: true, sid: 's1', open: { t1: 3 } } } });
ok(r.ok && r.banc === false && Object.keys(r.open).length === 0, 'banc et notes ouvertes ignorés venant de l’élève');
// prof corrige
call('olivier.lesenfants@elmarche.be', 'setAffect', { affect: [{ cl: '4eqmm', c: '4-elec', profs: ['O. Lesenfants'] }] });
ok(call('olivier.lesenfants@elmarche.be', 'grade', { mail: el, q: 't1', v: 2 }).ok, 'prof corrige');
r = call(el, 'saveProg', { prog: { quiz: {}, test: { submitted: true, sid: 's1', open: {} } } });
ok(r.open.t1 === 2, 'la note du prof survit à une sauvegarde de l’élève');
r = call(el, 'saveProg', { prog: { quiz: {}, test: { submitted: true, sid: 's2', open: {} } } });
ok(Object.keys(r.open).length === 0, 'nouvelle évaluation : notes ouvertes remises à zéro');
// journal
ok(call(el, 'journal', { per: 's4', date: '2027-03-01', f: { act: 'Accueil', com: 'pirate', vu: true } }).ok, 'journal encodé');
let J = store.get('journal:s4|' + el)['2027-03-01'];
ok(J.act === 'Accueil' && !J.com && J.vu === false, 'élève ne peut pas écrire le commentaire ni marquer lu');
call('olivier.lesenfants@elmarche.be', 'journalProf', { per: 's4', mail: el, date: '2027-03-01', com: 'Bien', vu: true });
J = store.get('journal:s4|' + el)['2027-03-01']; ok(J.com === 'Bien' && J.vu === true, 'prof commente et marque lu');
call(el, 'journal', { per: 's4', date: '2027-03-01', f: { act: 'Accueil + EPI' } });
J = store.get('journal:s4|' + el)['2027-03-01']; ok(J.com === 'Bien' && J.vu === false, 'modif élève : repasse en non lu, commentaire gardé');
ok(call(el, 'journal', { per: 's4', date: 'n’importe', f: {} }).ok === false, 'date invalide refusée');

// --- stages : l'élève ne voit que son lieu
call('olivier.lesenfants@elmarche.be', 'setLieux', { lieux: [{ id: 'l1', nom: 'A' }, { id: 'l2', nom: 'B' }] });
call('olivier.lesenfants@elmarche.be', 'setStagePeriodes', { periodes: [{ id: 's4', annee: 4, nom: 'Stage', debut: '2027-03-01', fin: '2027-03-12' }] });
call('olivier.lesenfants@elmarche.be', 'stageAff', { per: 's4', mail: el, field: 'lieu', v: 'l2' });
r = call(el, 'boot');
ok(r.data.stage.lieux.length === 1 && r.data.stage.lieux[0].id === 'l2' && r.data.stage.mine.s4.lieu === 'l2', 'élève : uniquement son lieu de stage');
ok(!r.data.progs && !r.data.eleves && !r.data.notes, 'élève : aucune donnée des autres');
ok(r.data.stage.journal.s4['2027-03-01'].act === 'Accueil + EPI', 'élève retrouve son journal');

// --- notes & carnet
ok(call('olivier.lesenfants@elmarche.be', 'setNote', { key: '4eqmm|4-elec', kind: 'over', ev: 'F2.1', mail: el, v: '18' }).ok, 'note encodée');
ok(call('olivier.lesenfants@elmarche.be', 'setNote', { key: '4eqmm|4-elec', kind: 'lock', per: 'p1', v: true }).ok, 'période clôturée');
const N = store.get('notes:4eqmm|4-elec'); ok(N.over['F2.1|' + el] === '18' && N.locked.p1 === true, 'carnet enregistré');

// --- coordinateur
const P = call('olivier.lesenfants@elmarche.be', 'boot').data;
ok(P.eleves[el].classe === '4eqmm' && P.progs[el] && P.journal === undefined, 'prof voit élèves et progressions');
ok(call('olivier.lesenfants@elmarche.be', 'setProfs', { profs: [{ nom: 'X', mail: 'x.y@elmarche.be', role: 'Professeur' }] }).ok === false, 'impossible de retirer le dernier coordinateur');
ok(call('olivier.lesenfants@elmarche.be', 'setProfs', { profs: [{ nom: 'O. Lesenfants', mail: 'olivier.lesenfants@elmarche.be', role: 'Coordinateur' }, { nom: 'P. Dachelet', mail: 'philippe.dachelet@elmarche.be', role: 'Professeur' }, { nom: 'Pirate', mail: 'pirate@gmail.com' }] }).ok, 'profs enregistrés');
ok(store.get('profs').length === 2, 'adresse hors domaine filtrée');
ok(call('philippe.dachelet@elmarche.be', 'boot').data.me.role === 'prof', 'nouveau prof peut entrer');
ok(call('philippe.dachelet@elmarche.be', 'setAccess', { open: false }).ok === false, 'prof simple : pas d’accès admin');
ok(call('olivier.lesenfants@elmarche.be', 'setAccess', { blocked: [el] }).ok, 'élève bloqué');
ok(call(el, 'boot').code === 'denied', 'élève bloqué refusé');
call('olivier.lesenfants@elmarche.be', 'setAccess', { blocked: [], open: false });
ok(call('nouveau.venu.student@elmarche.be', 'boot').code === 'denied', 'accès fermé aux nouveaux élèves');
ok(call(el, 'boot').ok, 'élève déjà inscrit toujours accepté');
ok(call('olivier.lesenfants@elmarche.be', 'checkMail', { mail: 'nouveau.venu.student@elmarche.be' }).res.ok === false, 'test d’adresse');
// taille max
ok(call(el, 'saveProg', { prog: { x: 'a'.repeat(50000) } }).code === 'size', 'document trop gros refusé');

console.log(`✓ ${n} vérifications réussies`);
// régression : l'élève retrouve son stage même si les périodes n'ont jamais été enregistrées
{ const st2 = memStore(), a2 = ctx.makeApi(st2, deps); a2.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const e2='zoe.x.student@elmarche.be'; a2.handle({t:a2.makeToken(e2),a:'setClasse',p:{classe:'4eqmm'}});
  a2.handle({t:a2.makeToken('olivier.lesenfants@elmarche.be'),a:'setLieux',p:{lieux:[{id:'l1',nom:'A'}]}});
  a2.handle({t:a2.makeToken('olivier.lesenfants@elmarche.be'),a:'stageAff',p:{per:'s4',mail:e2,field:'lieu',v:'l1'}});
  a2.handle({t:a2.makeToken(e2),a:'journal',p:{per:'s4',date:'2027-03-01',f:{act:'x'}}});
  const d=a2.handle({t:a2.makeToken(e2),a:'boot'}).data;
  ok(d.stage.mine.s4.lieu==='l1' && d.stage.lieux.length===1 && d.stage.journal.s4['2027-03-01'].act==='x', 'stage et journal retrouvés sans périodes enregistrées');
  console.log(`✓ ${n} vérifications réussies (avec régression)`); }

// évaluations formatives + corrigés : visibles par l'élève quand son évaluation est terminée
{ const st3 = memStore(), a3 = ctx.makeApi(st3, deps); a3.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const C = m => a3.makeToken(m), co = 'olivier.lesenfants@elmarche.be', e3 = 'lea.x.student@elmarche.be';
  const H = (m, a, p) => a3.handle({ t: C(m), a, p });
  H(e3, 'setClasse', { classe: '4eqmm' });
  ok(H(co, 'setFcor', { list: [{ ch:'2.1', titre:'Sécu', ev:'Q1', cor:'R1' }, { ch:'2.3', titre:'Relais', ev:'Q3', cor:'R3' }, { ch:'2.10', titre:'Cadre', ev:'Q10', cor:'R10' }] }).ok, 'coordinateur charge les corrigés');
  ok(H(e3, 'setFcor', { ch:'2.1', ev:'x', cor:'y' }).ok === false, 'élève ne peut pas charger de corrigé');
  let d = H(e3, 'boot').data; ok(d.fcor.length === 3 && d.fcor.every(x => !x.ok) && !('cor' in d.fcor[0]), 'élève : liste sans contenu, tout verrouillé');
  ok(d.fcor.map(x=>x.ch).join() === '2.1,2.3,2.10', 'ordre des chapitres');
  ok(H(e3, 'fcor', { ch:'2.1' }).ok === false, 'corrigé refusé avant évaluation');
  H(co, 'setNote', { key:'4eqmm|4-elec', kind:'over', ev:'F2.1', mail:e3, v:'20' });
  d = H(e3, 'boot').data; ok(d.fcor.find(x=>x.ch==='2.1').ok && !d.fcor.find(x=>x.ch==='2.3').ok, '2.1 ouvert après la note, pas 2.3');
  ok(H(e3, 'fcor', { ch:'2.1' }).fcor.cor === 'R1', 'élève lit le corrigé 2.1');
  ok(H(e3, 'fcor', { ch:'2.10' }).ok === false, '2.10 toujours fermé (pas confondu avec 2.1)');
  H(e3, 'saveProg', { prog: { test: { submitted: true, sid: 'z' } } });
  ok(H(e3, 'fcor', { ch:'2.3' }).fcor.cor === 'R3', '2.3 ouvert après l’évaluation passée dans la plateforme');
  ok(H('autre.y.student@elmarche.be', 'fcor', { ch:'2.1' }).ok === false, 'un autre élève reste verrouillé');
  ok(H(co, 'fcor', { ch:'2.10' }).fcor.cor === 'R10' && H(co, 'boot').data.fcor.every(x=>x.ok), 'prof : tout ouvert');
  console.log(`✓ ${n} vérifications réussies (avec corrigés formatifs)`); }

// chapitres ouverts par le prof de la classe
{ const st4 = memStore(), a4 = ctx.makeApi(st4, deps); a4.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a4.handle({ t: a4.makeToken(m), a, p });
  H('olivier.lesenfants@elmarche.be','setProfs',{profs:[{nom:'O. Lesenfants',mail:'olivier.lesenfants@elmarche.be',role:'Coordinateur'},{nom:'P. Dachelet',mail:'philippe.dachelet@elmarche.be',role:'Professeur'}]});
  H('olivier.lesenfants@elmarche.be','setAffect',{affect:[{cl:'4eqmm',c:'4-elec',profs:['P. Dachelet']}]});
  ok(H('philippe.dachelet@elmarche.be','setOuv',{key:'4eqmm|4-elec',chaps:['2.1','2.2','x','2.4']}).chaps.join()==='2.1,2.2,2.4', 'prof de la classe ouvre des chapitres (valeurs invalides filtrées)');
  ok(H('philippe.dachelet@elmarche.be','setOuv',{key:'4eqem|4-elec',chaps:['2.1']}).ok===false, 'pas dans une classe où il ne donne pas cours');
  ok(H('zz.y.student@elmarche.be','setOuv',{key:'4eqmm|4-elec',chaps:['2.9']}).ok===false, 'élève ne peut pas ouvrir de chapitre');
  H('zz.y.student@elmarche.be','setClasse',{classe:'4eqmm'});
  ok(H('zz.y.student@elmarche.be','boot').data.ouv['4eqmm|4-elec'].length===3, 'élève reçoit les chapitres ouverts');
  console.log(`✓ ${n} vérifications réussies (avec chapitres ouverts)`); }

// l'élève encode son entreprise de stage : ajoutée au carnet et attribuée automatiquement
{ const st5 = memStore(), a5 = ctx.makeApi(st5, deps); a5.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a5.handle({ t: a5.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be';
  const e1 = 'tom.a.student@elmarche.be', e2 = 'luc.b.student@elmarche.be', e3 = 'max.c.student@elmarche.be';
  [e1, e2, e3].forEach(e => H(e, 'setClasse', { classe: '4eqem' }));
  H(co, 'setLieux', { lieux: [{ id: 'l1', nom: 'Carmeuse', localite: 'Aye', fil: ['eqem'] }] });
  const F = { nom: 'Électro Famenne', adresse: 'Rue du Parc 3', localite: 'Marche-en-Famenne', secteur: 'Maintenance', tuteur: 'J. Dupont', tel: '084 11 22 33', mail: '' };
  ok(H(e1, 'addLieu', { per: 's4', lieu: Object.assign({}, F, { tuteur: '' }) }).ok === false, 'tuteur obligatoire');
  let r = H(e1, 'addLieu', { per: 's4', lieu: F });
  ok(r.ok && r.lieu.by === e1 && r.lieu.verif && r.lieu.fil.join() === 'eqem' && /à vérifier/.test(r.lieu.note), 'lieu ajouté, marqué à vérifier, filière de l’élève');
  const id = r.lieu.id; ok(st5.get('stage:aff:s4')[e1].lieu === id, 'attribué automatiquement à l’élève');
  let d = H(e1, 'boot').data; ok(d.stage.lieux.length === 1 && d.stage.lieux[0].id === id && d.stage.mine.s4.lieu === id, 'l’élève voit son entreprise');
  r = H(e1, 'addLieu', { per: 's4', lieu: Object.assign({}, F, { tel: '084 99 99 99' }) });
  ok(r.ok && r.lieu.id === id && st5.get('stage:lieux').length === 2 && st5.get('stage:lieux')[1].tel === '084 99 99 99', 'l’élève corrige sa fiche non vérifiée');
  r = H(e2, 'addLieu', { per: 's4', lieu: Object.assign({}, F, { nom: 'electro  FAMENNE', tel: 'x' }) });
  ok(r.ok && r.lieu.id === id && st5.get('stage:lieux').length === 2, 'même entreprise reconnue (casse, accents) : pas de doublon');
  r = H(e3, 'addLieu', { per: 's4', lieu: { nom: 'carmeuse', localite: 'AYE', tuteur: 'X Y', tel: '1' } });
  ok(r.ok && r.lieu.id === 'l1' && r.lieu.verif === undefined, 'entreprise du carnet réutilisée sans modification');
  ok(H(e3, 'addLieu', { per: 's4', lieu: F }).ok === false, 'lieu encodé par le prof : l’élève ne peut plus le changer');
  // un prof enregistre une liste ancienne (sans le nouveau lieu) : le lieu attribué est conservé
  r = H(co, 'setLieux', { lieux: [{ id: 'l1', nom: 'Carmeuse', localite: 'Aye', fil: ['eqem'] }] });
  ok(r.added === 1 && st5.get('stage:lieux').some(l => l.id === id), 'liste du prof périmée : le lieu de l’élève n’est pas perdu');
  // le prof vérifie : l'élève ne peut plus modifier
  const L = st5.get('stage:lieux').map(l => l.id === id ? Object.assign({}, l, { verif: false, note: '' }) : l);
  H(co, 'setLieux', { lieux: L });
  ok(H(e1, 'addLieu', { per: 's4', lieu: F }).ok === false, 'fiche vérifiée par le prof : verrouillée pour l’élève');
  // un lieu non attribué peut toujours être supprimé par le prof
  H(co, 'stageAff', { per: 's4', mail: e1, field: 'lieu', v: '' }); H(co, 'stageAff', { per: 's4', mail: e2, field: 'lieu', v: '' });
  H(co, 'setLieux', { lieux: [{ id: 'l1', nom: 'Carmeuse' }] }); ok(st5.get('stage:lieux').length === 1, 'suppression d’un lieu libre');
  ok(H(co, 'addLieu', { per: 's4', lieu: F }).ok === false, 'action réservée aux élèves');
  console.log(`✓ ${n} vérifications réussies (avec lieux encodés par les élèves)`); }

// progression du prof (aperçu élève) : enregistrée à part, remise à zéro à la nouvelle année scolaire
{ const st6 = memStore(), a6 = ctx.makeApi(st6, deps); a6.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a6.handle({ t: a6.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', save = clock;
  ok(H(co, 'boot').data.myProg === null, 'prof : pas encore de progression');
  clock = Date.UTC(2026, 10, 19);
  ok(H(co, 'saveMyProg', { prog: { visited: ['a1','b5'], quiz: { a1q1: { sel: 1, ok: true } } } }).ok, 'prof enregistre sa progression');
  let d = H(co, 'boot').data; ok(d.myProg.visited.join() === 'a1,b5' && !d.progs[co], 'prof retrouve sa progression, absente du suivi des élèves');
  ok(H('x.y.student@elmarche.be', 'saveMyProg', { prog: {} }).ok === false, 'action réservée aux profs');
  clock = Date.UTC(2027, 7, 14); ok(H(co, 'boot').data.myProg.visited.length === 2, 'le 14 août, toujours la même année scolaire');
  clock = Date.UTC(2027, 7, 15); ok(H(co, 'boot').data.myProg === null, 'le 15 août : nouvelle année, progression remise à zéro');
  H(co, 'saveMyProg', { prog: { visited: ['c1'] } }); ok(H(co, 'boot').data.myProg.visited.join() === 'c1', 'nouvelle progression pour la nouvelle année');
  clock = save; console.log(`✓ ${n} vérifications réussies (avec progression du prof)`); }

// connexion unique vers Dossier TP et le Banc
{ const st7 = memStore(), a7 = ctx.makeApi(st7, deps); a7.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a7.handle({ t: a7.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', e7 = 'sam.k.student@elmarche.be';
  H(e7, 'setClasse', { classe: '3qem1' });
  const tk = H(e7, 'ssoTicket', { app: 'dossier' }).ticket; ok(!!tk, 'élève reçoit un ticket');
  let r = a7.handle({ a: 'ssoCheck', p: { ticket: tk, app: 'dossier' } });
  ok(r.ok && r.mail === e7 && r.role === 'eleve', 'ticket vérifié sans jeton : adresse et rôle');
  ok(!a7.handle({ a: 'ssoCheck', p: { ticket: tk, app: 'banc' } }).ok, 'ticket refusé pour une autre app');
  ok(a7.handle({ t: tk, a: 'boot' }).code === 'auth', 'un ticket ne sert pas de jeton pour la plateforme');
  ok(!a7.handle({ a: 'ssoCheck', p: { ticket: tk.slice(0, -2) + 'xx', app: 'dossier' } }).ok, 'ticket falsifié refusé');
  ok(!a7.handle({ a: 'ssoCheck', p: { ticket: a7.makeToken(e7), app: 'dossier' } }).ok, 'un jeton de plateforme n’est pas un ticket');
  const save = clock; clock += 121000; ok(/expiré/.test(a7.handle({ a: 'ssoCheck', p: { ticket: tk, app: 'dossier' } }).msg), 'ticket expiré après 2 minutes'); clock = save;
  ok(H(co, 'ssoTicket', { app: 'arduino' }).ok === false, 'app inconnue refusée');
  const tp = H(co, 'ssoTicket', { app: 'banc' }).ticket; ok(a7.handle({ a: 'ssoCheck', p: { ticket: tp, app: 'banc' } }).role === 'prof', 'prof : rôle prof');
  H(co, 'setAccess', { blocked: [e7] }); ok(!a7.handle({ a: 'ssoCheck', p: { ticket: tk, app: 'dossier' } }).ok, 'élève bloqué entre-temps : refusé');
  console.log(`✓ ${n} vérifications réussies (avec connexion unique)`); }
