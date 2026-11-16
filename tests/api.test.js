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
