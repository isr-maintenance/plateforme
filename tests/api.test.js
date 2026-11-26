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

// points « à l'atelier » validés par le prof
{ const st9 = memStore(), a9 = ctx.makeApi(st9, deps); a9.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a9.handle({ t: a9.makeToken(m), a, p }), co='olivier.lesenfants@elmarche.be', pd='philippe.dachelet@elmarche.be', e9='tom.x.student@elmarche.be';
  H(co,'setProfs',{profs:[{nom:'O. Lesenfants',mail:co,role:'Coordinateur'},{nom:'P. Dachelet',mail:pd,role:'Professeur'}]});
  H(e9,'setClasse',{classe:'3qem1'}); H(co,'setEleveCt',{mail:e9,ct:'3qemct1'});
  ok(H(pd,'setAtelier',{mail:e9,k:'A1at3',v:true}).ok===false, 'un prof qui n’a pas l’élève ne peut pas cocher');
  H(co,'setAffect',{affect:[{cl:'3qemct1',c:'3em-elec',profs:['P. Dachelet']}]});
  ok(H(pd,'setAtelier',{mail:e9,k:'A1at3',v:true}).ok, 'le prof du groupe de CT coche le point');
  ok(H(pd,'setAtelier',{mail:e9,k:'a b',v:true}).ok===false, 'clé invalide refusée');
  ok(H(e9,'setAtelier',{mail:e9,k:'A1at3',v:true}).ok===false, 'élève ne peut pas cocher lui-même');
  let r9 = H(e9,'saveProg',{prog:{quiz:{},atel:{A1at9:1}}});
  ok(r9.ok && r9.atel.A1at3 && !r9.atel.A1at9, 'la sauvegarde de l’élève garde la case du prof et ignore la sienne');
  ok(H(e9,'boot').data.prog.atel.A1at3, 'l’élève reçoit la case cochée');
  ok(H(co,'boot').data.progs[e9].atel.A1at3, 'le prof la voit dans le suivi');
  H(pd,'setAtelier',{mail:e9,k:'A1at3',v:false}); ok(!H(e9,'boot').data.prog.atel.A1at3, 'le prof peut décocher');
  console.log(`✓ ${n} vérifications réussies (avec points à l’atelier)`); }

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
  ok(H(co, 'ssoTicket', { app: 'inconnue' }).ok === false, 'app inconnue refusée');
  const ta = H(co, 'ssoTicket', { app: 'arduino' }).ticket; ok(a7.handle({ a: 'ssoCheck', p: { ticket: ta, app: 'arduino' } }).ok === true, 'Labo Arduino : ticket accepté');
  ok(!a7.handle({ a: 'ssoCheck', p: { ticket: ta, app: 'banc' } }).ok, 'ticket du Labo refusé pour le Banc');
  const tp = H(co, 'ssoTicket', { app: 'banc' }).ticket; ok(a7.handle({ a: 'ssoCheck', p: { ticket: tp, app: 'banc' } }).role === 'prof', 'prof : rôle prof');
  H(co, 'setAccess', { blocked: [e7] }); ok(!a7.handle({ a: 'ssoCheck', p: { ticket: tk, app: 'dossier' } }).ok, 'élève bloqué entre-temps : refusé');
  console.log(`✓ ${n} vérifications réussies (avec connexion unique)`); }

// 3QEM : groupe de TP (classe) + groupe de CT (placé par un prof)
{ const st8 = memStore(), a8 = ctx.makeApi(st8, deps); a8.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a8.handle({ t: a8.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', e8 = 'nina.r.student@elmarche.be', e9 = 'paul.z.student@elmarche.be';
  H(e8, 'setClasse', { classe: '3qem2' }); H(e9, 'setClasse', { classe: '4eqem' });
  ok(H(e8, 'setClasse', { classe: '3qemct1' }).ok === false, 'un élève ne choisit pas un groupe de CT comme classe');
  ok(H(e8, 'setEleveCt', { mail: e8, ct: '3qemct1' }).ok === false, 'l’élève ne se place pas lui-même en CT');
  ok(H(co, 'setEleveCt', { mail: e8, ct: '3qemct1' }).ok, 'le prof place l’élève en CT groupe 1');
  ok(st8.get('eleve:' + e8).classe === '3qem2' && st8.get('eleve:' + e8).ct === '3qemct1', 'groupe de TP et groupe de CT gardés tous les deux');
  ok(H(e8, 'boot').data.me.ct === '3qemct1', 'l’élève connaît son groupe de CT');
  ok(H(co, 'setEleveCt', { mail: e9, ct: '3qemct2' }).ok === false, 'pas de groupe de CT hors 3QEM');
  ok(H(co, 'setEleveCt', { mail: e8, ct: '3qemct9' }).ok === false, 'groupe inconnu refusé');
  H(co, 'setEleveClasse', { mail: e8, classe: '4eqmm' }); ok(st8.get('eleve:' + e8).ct === undefined, 'changement vers une autre classe : groupe de CT effacé');
  H(co, 'setAffect', { affect: [{ cl: '3qemct1', c: '3em-elec', profs: ['O. Lesenfants'] }] });
  ok(H(co, 'setOuv', { key: '3qemct1|3em-elec', chaps: ['1.1'] }).ok, 'un groupe de CT est une classe reconnue');
  console.log(`✓ ${n} vérifications réussies (avec groupes TP et CT)`); }

// Bilan verrouillé : définition côté serveur, ouverture par classe, copie, remise, note publiée par le prof
{ const st9 = memStore(), a9 = ctx.makeApi(st9, deps); a9.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a9.handle({ t: a9.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', pr = 'gregory.baudson@elmarche.be';
  const e1 = 'lea.a.student@elmarche.be', e2 = 'tom.b.student@elmarche.be';
  H(co, 'setProfs', { profs: [{ nom: 'O. Lesenfants', mail: co, role: 'Coordinateur' }, { nom: 'G. Baudson', mail: pr, role: 'Professeur' }] });
  H(e1, 'setClasse', { classe: '4eqmm' }); H(e2, 'setClasse', { classe: '4eqem' });
  const def = { id: 'test-bilan', course: '4-meca', titre: 'Bilan test', ex: [{ enonce: 'Q ?', place: { 1: 0 }, tokens: ['D = 95 mm'], res: [{ lbl: 'D’', unit: 'mm', ans: 503.3, tol: 0.01 }] }] };
  ok(H(pr, 'bilanSet', { def }).ok === false, 'seul le coordinateur dépose un bilan');
  ok(H(co, 'bilanSet', { def }).ok, 'le coordinateur dépose le bilan');
  let b = H(e1, 'boot').data.bilans; ok(b.length === 1 && b[0].open === false && !('ex' in b[0]), 'l’élève voit le bilan verrouillé, sans son contenu');
  ok(H(e1, 'bilan', { id: 'test-bilan' }).ok === false, 'bilan verrouillé : contenu refusé');
  ok(H(e1, 'bilanSave', { id: 'test-bilan', d: {} }).ok === false, 'bilan verrouillé : pas de copie');
  ok(H(pr, 'bilanOuvrir', { id: 'test-bilan', cl: '4eqmm', open: true }).ok === false, 'un prof qui ne donne pas cours dans la classe ne l’ouvre pas');
  ok(H(co, 'bilanOuvrir', { id: 'test-bilan', cl: '4eqmm', open: true }).ok, 'le prof ouvre pour la 4EQMM');
  let r = H(e1, 'bilan', { id: 'test-bilan' });
  ok(r.ok && r.def.ex[0].res[0].ans === undefined && r.def.ex[0].place === undefined, 'l’élève reçoit les énoncés sans les réponses');
  ok(H(e2, 'bilan', { id: 'test-bilan' }).ok === false, 'une autre classe reste verrouillée');
  ok(H(e1, 'bilanSave', { id: 'test-bilan', d: { 0: { d: 'D = 95 mm', i: 'D’ = ?', f: 'D’ = D . N / N’', s: '503', r: ['503'], pl: { 1: 0 } } } }).ok, 'copie enregistrée');
  ok(H(e1, 'bilanSave', { id: 'test-bilan', d: { 0: { s: 'x'.repeat(5000) } }, remettre: true }).ok && st9.get('bilanrep:test-bilan|' + e1).d[0].s.length === 1500, 'copie remise, cases bornées');
  ok(H(e1, 'bilanSave', { id: 'test-bilan', d: {} }).ok === false, 'copie remise : plus modifiable');
  r = H(co, 'bilanCopies', { id: 'test-bilan' }); ok(r.ok && r.def.ex[0].res[0].ans === 503.3 && r.reps[e1].remis, 'le prof voit les réponses et la copie');
  ok(H(e1, 'bilanNoter', { id: 'test-bilan', mail: e1, pts: { 0: 2 } }).ok === false, 'l’élève ne se note pas');
  ok(H(co, 'bilanNoter', { id: 'test-bilan', mail: e1, pts: { 0: 2 }, com: 'Bien' }).ok, 'le prof note');
  r = H(e1, 'bilan', { id: 'test-bilan' }); ok(r.rep.note === null && r.def.ex[0].res[0].ans === undefined, 'note pas encore publiée : invisible');
  H(co, 'bilanNoter', { id: 'test-bilan', mail: e1, pts: { 0: 2 }, com: 'Bien', pub: true });
  r = H(e1, 'bilan', { id: 'test-bilan' }); ok(r.rep.note.pts[0] === 2 && r.def.ex[0].res[0].ans === 503.3, 'note publiée : l’élève voit sa note et la correction');
  H(co, 'bilanOuvrir', { id: 'test-bilan', cl: '4eqmm', open: false });
  ok(H(e1, 'bilan', { id: 'test-bilan' }).ok, 'bilan refermé : l’élève garde l’accès à sa note publiée');
  ok(H(co, 'bilanNoter', { id: 'test-bilan', mail: e1, rouvrir: true }).ok && !st9.get('bilanrep:test-bilan|' + e1).remis, 'le prof peut rendre la copie');
  ok(H(co, 'boot').data.bilanouv && H(co, 'boot').data.bilans.length === 1, 'le prof reçoit la liste et les ouvertures');
  console.log(`✓ ${n} vérifications réussies (avec bilan verrouillé)`); }

// Formatives en ligne : corrigé caché, réponse longue, sorties de page notées, copies par cours
{ const s10 = memStore(), a10 = ctx.makeApi(s10, deps); a10.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a10.handle({ t: a10.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', e1 = 'zoe.c.student@elmarche.be';
  H(e1, 'setClasse', { classe: '4eqmm' });
  const def = { id: 'f4e-2-1', course: '4-elec', kind: 'formative', ch: '2.1', titre: 'Formative 2.1', ex: [{ kind: 'texte', enonce: 'Q ?', pts: 4, cor: 'Le corrigé' }, { kind: 'calc', enonce: 'Calcule', pts: 3, res: [{ lbl: 'I', unit: 'A', ans: 0.153 }] }] };
  H(co, 'bilanSet', { def }); H(co, 'bilanOuvrir', { id: 'f4e-2-1', cl: '4eqmm', open: true });
  let r = H(e1, 'bilan', { id: 'f4e-2-1' }); ok(r.ok && r.def.ex[0].cor === undefined && r.def.ex[1].res[0].ans === undefined, 'formative : ni corrigé ni réponses avant publication');
  ok(H(e1, 'boot').data.bilans[0].kind === 'formative' && H(e1, 'boot').data.bilans[0].ch === '2.1', 'la liste dit que c’est une formative et son chapitre');
  H(e1, 'bilanSave', { id: 'f4e-2-1', d: { 0: { s: 'y'.repeat(2000) } } }); ok(s10.get('bilanrep:f4e-2-1|' + e1).d[0].s.length === 1500, 'réponse ouverte jusqu’à 1 500 caractères');
  ok(H(e1, 'bilanSave', { id: 'f4e-2-1', sortie: { t: clock, dur: 12, quoi: 'onglet' } }).ok, 'sortie de page envoyée');
  ok(s10.get('bilanrep:f4e-2-1|' + e1).sorties.length === 1 && s10.get('bilanrep:f4e-2-1|' + e1).d[0].s.length === 1500, 'sortie notée, copie intacte');
  r = H(co, 'bilanReps', { course: '4-elec' }); ok(r.ok && r.reps['f4e-2-1'][e1].sorties[0].dur === 12, 'le prof voit les copies du cours et les sorties');
  ok(H(e1, 'bilanReps', { course: '4-elec' }).ok === false, 'un élève ne voit pas les copies');
  H(co, 'bilanNoter', { id: 'f4e-2-1', mail: e1, pts: { 0: 3, 1: 3 }, pub: true });
  ok(H(e1, 'bilan', { id: 'f4e-2-1' }).def.ex[0].cor === 'Le corrigé', 'après publication : le corrigé est visible');
  console.log(`✓ ${n} vérifications réussies (avec formatives en ligne)`); }

// Personnes extérieures : lien d'invitation, consultation seule, accès fermé dès la désactivation
{ const s11 = memStore(), a11 = ctx.makeApi(s11, deps); a11.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a11.handle({ t: a11.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', e1 = 'zoe.c.student@elmarche.be';
  H(e1, 'setClasse', { classe: '4eqmm' });
  const code = 'Abcdefghijklmnop1234_-xyz';
  ok(H(e1, 'inviteSet', { inv: { id: 'x1y2', nom: 'J. Dupont', code } }).ok === false, 'un élève ne crée pas d’invitation');
  ok(H(co, 'inviteSet', { inv: { id: 'x1y2', nom: 'J. Dupont', org: 'Entreprise X', type: 'stage', code } }).ok, 'le coordinateur crée l’invitation');
  ok(!('h' in H(co, 'boot').data.invites[0]) && H(co, 'boot').data.invites[0].nom === 'J. Dupont', 'la liste du coordinateur ne contient pas le code');
  ok(a11.handle({ a: 'inviteLogin', p: { code: 'mauvaiscodemauvaiscode' } }).ok === false, 'mauvais code refusé');
  let r = a11.handle({ a: 'inviteLogin', p: { code } }); ok(r.ok && r.t, 'le lien donne un jeton');
  const I = (a, p) => a11.handle({ t: r.t, a, p });
  let b = I('boot'); ok(b.ok && b.data.me.role === 'invite' && !b.data.eleves && !b.data.progs && !b.data.notes && b.data.stage.lieux.length === 0, 'l’invité ne reçoit aucune donnée d’élève, de cote ni de stage');
  ok(I('saveMyProg', { prog: { visited: ['a1'] } }).ok && I('boot').data.myProg.visited[0] === 'a1', 'l’invité garde sa propre progression');
  ok(I('checkMail', { mail: co }).ok === false && I('bilanReps', { course: '4-elec' }).ok === false && I('ssoTicket', { app: 'banc' }).ok === false && I('saveProg', { prog: {} }).ok === false, 'toute autre action est refusée');
  H(co, 'inviteSet', { inv: { id: 'x1y2', actif: false } }); ok(I('boot').ok === false && a11.handle({ a: 'inviteLogin', p: { code } }).ok === false, 'désactivée : accès fermé tout de suite');
  H(co, 'inviteSet', { inv: { id: 'x1y2', actif: true, expire: clock - 1000 } }); ok(I('boot').ok === false, 'expirée : accès fermé');
  H(co, 'inviteSet', { inv: { id: 'x1y2', expire: 0, code: 'Nouveau_code_1234567890' } }); ok(a11.handle({ a: 'inviteLogin', p: { code } }).ok === false && a11.handle({ a: 'inviteLogin', p: { code: 'Nouveau_code_1234567890' } }).ok, 'nouveau lien : l’ancien ne marche plus');
  H(co, 'inviteDel', { id: 'x1y2' }); ok(I('boot').ok === false && H(co, 'boot').data.invites.length === 0, 'invitation supprimée');
  console.log(`✓ ${n} vérifications réussies (avec invitations)`); }

// Atelier de dessin : planches à part, résumé pour le carnet, prof qui regarde
{ const s12 = memStore(), d12 = memStore(), a12 = ctx.makeApi(s12, Object.assign({}, deps, { dessins: () => d12 })); a12.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a12.handle({ t: a12.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', e1 = 'zoe.c.student@elmarche.be', e2 = 'max.d.student@elmarche.be';
  H(e1, 'setClasse', { classe: '4eqmm' }); H(e2, 'setClasse', { classe: '4eqmm' });
  const pl = { v: 1, entites: [{ t: 'l', x1: 0, y1: 0, x2: 10, y2: 0, s: 'f' }], cartouche: { titre: 'Ma pièce' }, exo: { cat: 'coupes-1', mode: 'coupe', titre: 'Semelle percée', score: 87.4 }, maj: clock };
  ok(H(e1, 'dessinPut', { id: 'pabc1', pl }).ok, 'l’élève enregistre sa planche');
  ok(d12.get('dessin:' + e1 + '|pabc1') && !s12.get('dessin:' + e1 + '|pabc1'), 'la planche va dans l’onglet des dessins, pas dans les données');
  ok(s12.get('dessinres:' + e1).pabc1.score === 87 && s12.get('dessinres:' + e1).pabc1.cat === 'coupes-1', 'résumé : exercice et score');
  let r = H(e1, 'dessinListe'); ok(r.ok && r.planches.pabc1 === clock && r.me.classe === '4eqmm', 'liste de ses planches');
  ok(H(e1, 'dessinGet', { ids: ['pabc1'] }).planches.pabc1.exo.score === 87.4, 'il retrouve sa planche (autre appareil)');
  ok(Object.keys(H(e2, 'dessinGet', { ids: ['pabc1'] }).planches).length === 0, 'un autre élève ne la voit pas');
  ok(H(e2, 'dessinVoir', { mail: e1, id: 'pabc1' }).ok === false, 'un élève ne regarde pas la planche d’un autre');
  ok(H(co, 'dessinVoir', { mail: e1, id: 'pabc1' }).pl.cartouche.titre === 'Ma pièce', 'le prof regarde la planche');
  ok(H(co, 'boot').data.dessins[e1].pabc1.score === 87, 'le prof reçoit les résumés (carnet)');
  const ex = { v: 1, entites: [], exo: { piece: 'x', mode: 'vues', examen: { fini: true, fin: clock, note: 64, temps: 40, duree: 50 } }, maj: clock };
  H(e1, 'dessinPut', { id: 'pexam', pl: ex }); ok(s12.get('dessinres:' + e1).pexam.ex.note === 64, 'note d’examen dans le résumé');
  ok(H(e1, 'dessinPut', { id: 'pbig', pl: { v: 1, entites: [{ t: 'x'.repeat(46000) }] } }).ok === false, 'planche trop grande refusée');
  ok(H(co, 'dessinRes').dessins[e1].pexam.ex.note === 64 && H(e1, 'dessinRes').ok === false, 'le carnet relit les résumés (prof seulement)');
  ok(H(e1, 'dessinDel', { id: 'pabc1' }).ok && !d12.get('dessin:' + e1 + '|pabc1') && !s12.get('dessinres:' + e1).pabc1, 'planche supprimée partout');
  console.log(`✓ ${n} vérifications réussies (avec Atelier de dessin)`); }

// Rapports de TP : l'élève remplit et remet, annexes découpées, le prof note et publie
{ const s13 = memStore(), d13 = memStore(), a13 = ctx.makeApi(s13, Object.assign({}, deps, { dessins: () => d13 })); a13.install('olivier.lesenfants@elmarche.be','O. Lesenfants');
  const H = (m, a, p) => a13.handle({ t: a13.makeToken(m), a, p }), co = 'olivier.lesenfants@elmarche.be', e1 = 'zoe.c.student@elmarche.be', e2 = 'max.d.student@elmarche.be';
  H(e1, 'setClasse', { classe: '4eqem' }); H(e2, 'setClasse', { classe: '4eqem' });
  ok(H(e1, 'rapportSave', { id: 'r1abc', r: { type: 'fabrication', course: '4eqem-tpem', description: 'Support de moteur', prof: { total: 100 } } }).ok, 'l’élève enregistre son rapport');
  ok(!d13.get('rapport:' + e1 + '|r1abc').prof && s13.get('rapres:' + e1).r1abc.t === 'Support de moteur', 'pas de note venue de l’élève ; résumé dans les données');
  const img = 'data:image/jpeg;base64,' + 'A'.repeat(90000);
  let r = H(e1, 'rapportJoindre', { id: 'r1abc', data: img, t: 'Schéma du Banc', src: 'banc' }); ok(r.ok && r.joint.n === 3, 'annexe découpée en 3 morceaux');
  ok(H(e1, 'rapportJoint', { id: 'r1abc', j: r.joint.id }).data === img, 'annexe relue entière');
  ok(H(e1, 'rapportJoindre', { id: 'r1abc', data: 'javascript:alert(1)' }).ok === false, 'annexe qui n’est pas une image refusée');
  ok(H(e2, 'rapportGet', { id: 'r1abc' }).ok === false && H(e2, 'rapportJoint', { mail: e1, id: 'r1abc', j: r.joint.id }).ok === false, 'un autre élève ne voit rien');
  ok(H(e1, 'rapportNoter', { mail: e1, id: 'r1abc', prof: { total: 100 } }).ok === false, 'l’élève ne se note pas');
  ok(H(e1, 'rapportSave', { id: 'r1abc', r: { type: 'fabrication', course: '4eqem-tpem', description: 'Support de moteur', joints: d13.get('rapport:' + e1 + '|r1abc').joints }, remettre: true }).remis > 0, 'rapport remis');
  ok(H(e1, 'rapportSave', { id: 'r1abc', r: { description: 'x' } }).ok === false && H(e1, 'rapportDel', { id: 'r1abc' }).ok === false, 'remis : plus modifiable ni supprimable');
  ok(H(co, 'boot').data.rapports[e1].r1abc.remis > 0, 'le prof voit le rapport remis');
  ok(H(co, 'rapportJoint', { mail: e1, id: 'r1abc', j: r.joint.id }).data.length === img.length, 'le prof voit l’annexe');
  ok(H(co, 'rapportNoter', { mail: e1, id: 'r1abc', prof: { remarques: 'Bon travail', criteres: [['Cotes respectées', 18, 20]], total: 84, comp: { 0: 'ATT' } } }).ok, 'le prof note');
  ok(H(e1, 'rapportGet', { id: 'r1abc' }).r.prof === undefined && s13.get('rapres:' + e1).r1abc.note === 84, 'note pas publiée : l’élève ne la voit pas');
  H(co, 'rapportNoter', { mail: e1, id: 'r1abc', prof: { remarques: 'Bon travail', total: 84 }, pub: true });
  ok(H(e1, 'rapportGet', { id: 'r1abc' }).r.prof.total === 84, 'note publiée : l’élève la voit');
  ok(H(co, 'rapportNoter', { mail: e1, id: 'r1abc', rendre: true }).ok && H(e1, 'rapportSave', { id: 'r1abc', r: { type: 'fabrication', description: 'Support corrigé' } }).ok, 'rapport rendu : l’élève peut le compléter');
  console.log(`✓ ${n} vérifications réussies (avec rapports de TP)`); }
