/* =========================================================
   Api.gs — logique de la plateforme
   Indépendante du stockage : le même code tourne dans Apps Script
   (stockage = Google Sheet) et dans les tests (stockage en mémoire).
   ========================================================= */
var PLAT = {
  DOMAIN: 'elmarche.be',
  TOKEN_DAYS: 30,
  CLASSES: ['3qem1','3qem2','3qem3','4eqem','4eqmm','5eqem','5eqmm','6eqem','6eqmm'],
  MAX_DOC: 45000
};

/* Crée l'API. store : {get(k), set(k,v,by), list(prefix), del(k)} · deps : {hmac(str), now()} */
function makeApi(store, deps) {

  /* ---------- jetons de connexion ---------- */
  function b64(s){ return deps.b64(s); }
  function unb64(s){ return deps.unb64(s); }
  function makeToken(mail){
    var body = b64(JSON.stringify({ e: mail, x: deps.now() + PLAT.TOKEN_DAYS*864e5 }));
    return body + '.' + deps.hmac(body);
  }
  function readToken(t){
    if (!t || typeof t !== 'string' || t.indexOf('.') < 0) throw err('auth', 'Connexion requise.');
    var p = t.split('.'); if (deps.hmac(p[0]) !== p[1]) throw err('auth', 'Connexion invalide : reconnecte-toi.');
    var o = JSON.parse(unb64(p[0])); if (!o.e || o.x < deps.now()) throw err('auth', 'Connexion expirée : reconnecte-toi.');
    return String(o.e).toLowerCase();
  }
  function err(code, msg){ var e = new Error(msg); e.code = code; return e; }

  /* ---------- documents ---------- */
  function doc(k, def){ var v = store.get(k); return v == null ? def : v; }
  function put(k, v, by){
    var s = JSON.stringify(v); if (s.length > PLAT.MAX_DOC) throw err('size', 'Données trop volumineuses (' + k + ').');
    store.set(k, v, by);
  }
  function cfg(){ return doc('cfg', { open: true, blocked: [] }); }
  function profs(){ return doc('profs', []); }

  /* ---------- qui est-ce ? ---------- */
  function identify(mail){
    mail = String(mail || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+$/.test(mail)) throw err('denied', 'Adresse invalide.');
    if (mail.slice(-(PLAT.DOMAIN.length + 1)) !== '@' + PLAT.DOMAIN) throw err('denied', 'Seules les adresses @' + PLAT.DOMAIN + ' peuvent se connecter.');
    var c = cfg();
    if ((c.blocked || []).indexOf(mail) >= 0) throw err('denied', 'Cette adresse est bloquée. Adresse-toi à ton professeur.');
    var p = profs().filter(function(x){ return x.mail === mail; })[0];
    if (p) return { mail: mail, role: 'prof', nom: p.nom, coord: p.role === 'Coordinateur' };
    if (/\.student@/.test(mail)) {
      var el = doc('eleve:' + mail, null);
      if (!el && c.open === false) throw err('denied', 'L’accès est limité aux élèves déjà inscrits. Adresse-toi à ton professeur.');
      return { mail: mail, role: 'eleve', nom: nameOf(mail), classe: el ? el.classe : null };
    }
    throw err('denied', 'Adresse de professeur non enregistrée : le coordinateur doit l’ajouter dans « Accès ».');
  }
  function nameOf(mail){
    var parts = mail.split('@')[0].replace(/\.student$/, '').split('.');
    return parts.map(function(w){ return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }

  /* ---------- utilitaires ---------- */
  function need(cond, msg){ if (!cond) throw err('bad', msg || 'Requête invalide.'); }
  function str(v, max){ v = v == null ? '' : String(v); return v.slice(0, max || 2000); }
  function listDocs(prefix){ var o = {}; store.list(prefix).forEach(function(r){ o[r.key.slice(prefix.length)] = r.value; }); return o; }
  /* ---------- évaluations formatives et corrigés (annexes H et I) ----------
     Stockés dans le classeur sous « fcor:<chapitre> » = {ch, titre, ev, cor}. Ils ne sont PAS dans le code public.
     Un élève voit l'évaluation et le corrigé d'un chapitre quand son évaluation est terminée :
     note encodée par un prof (carnet, évaluation « F<chapitre> »), ou évaluation passée dans la plateforme (2.3). */
  function fcorDone(mail){
    var done = {}, suf = '|' + mail;
    store.list('notes:').forEach(function(r){
      var o = (r.value && r.value.over) || {};
      Object.keys(o).forEach(function(k){ if (k.slice(-suf.length) === suf && k.charAt(0) === 'F' && o[k] !== '') done[k.slice(1, -suf.length)] = true; });
    });
    var pr = doc('prog:' + mail, null); if (pr && pr.test && pr.test.submitted) done['2.3'] = true;
    return done;
  }
  function fcorList(me){
    var done = me.role === 'eleve' ? fcorDone(me.mail) : null;
    return store.list('fcor:').map(function(r){ var v = r.value || {}; return { ch: v.ch, titre: v.titre, ok: !done || !!done[v.ch] }; })
      .sort(function(a, b){ var x = String(a.ch).split('.'), y = String(b.ch).split('.'); return (x[0] - y[0]) || (x[1] - y[1]); });
  }
  function fcorGet(me, p){
    var ch = str(p.ch, 10), v = doc('fcor:' + ch, null); need(v, 'Évaluation inconnue.');
    if (me.role === 'eleve') need(fcorDone(me.mail)[ch], 'Le corrigé s’ouvrira quand ton évaluation ' + ch + ' sera terminée.');
    return { ok: true, fcor: v };
  }
  function isProfOf(me, cl){ return me.coord || doc('affect', []).some(function(a){ return a.cl === cl && a.profs.indexOf(me.nom) >= 0; }); }

  /* ---------- démarrage : tout ce qu'il faut à l'écran ---------- */
  function boot(me){
    var out = { me: me, cfg: { open: cfg().open !== false }, modes: doc('modes', {}), affect: doc('affect', []), pdfs: doc('pdfs', {}) };
    out.stage = { periodes: doc('stage:periodes', null), lieux: doc('stage:lieux', []) };
    if (me.role === 'eleve') {
      var el = doc('eleve:' + me.mail, null);
      if (el) { el.last = deps.now(); put('eleve:' + me.mail, el, me.mail); }
      out.prog = doc('prog:' + me.mail, null);
      out.stage.mine = {}; out.stage.journal = {};
      store.list('stage:aff:').forEach(function(r){ var a = r.value && r.value[me.mail]; if (a) out.stage.mine[r.key.slice(10)] = a; });
      store.list('journal:').forEach(function(r){ var k = r.key.slice(8), i = k.lastIndexOf('|'); if (k.slice(i + 1) === me.mail) out.stage.journal[k.slice(0, i)] = r.value; });
      out.stage.lieux = out.stage.lieux.filter(function(l){ return Object.keys(out.stage.mine).some(function(k){ return out.stage.mine[k].lieu === l.id; }); });
      out.stage.tel = (doc('stage:tel', {}))[me.mail] || '';
      out.fcor = fcorList(me);
      return out;
    }
    out.profs = profs(); out.access = { open: cfg().open !== false, blocked: cfg().blocked || [] };
    out.eleves = listDocs('eleve:');
    out.progs = listDocs('prog:');
    out.periodes = doc('periodes', null);
    out.evals = listDocs('evals:');
    out.notes = listDocs('notes:');
    out.som = doc('som', {});
    out.signal = doc('signal', []);
    out.stage.aff = listDocs('stage:aff:');
    out.stage.tel = doc('stage:tel', {});
    out.stage.journal = listDocs('journal:');
    out.fcor = fcorList(me);
    return out;
  }

  /* ---------- actions élève ---------- */
  var ELEVE = {
    setClasse: function(me, p){
      need(PLAT.CLASSES.indexOf(p.classe) >= 0, 'Classe inconnue.');
      var el = doc('eleve:' + me.mail, null);
      need(!el || !el.classe, 'Ta classe est déjà choisie : demande à ton professeur pour la changer.');
      put('eleve:' + me.mail, { mail: me.mail, nom: me.nom, classe: p.classe, first: deps.now(), last: deps.now() }, me.mail);
      return { ok: true };
    },
    saveProg: function(me, p){
      need(p.prog && typeof p.prog === 'object', 'Progression manquante.');
      var old = doc('prog:' + me.mail, {}) || {}, n = p.prog;
      n.banc = !!old.banc;                                  // validé par le prof uniquement
      var ot = old.test || {}, nt = n.test || {};
      if (nt.submitted && ot.submitted && nt.sid && nt.sid === ot.sid) { nt.open = ot.open || {}; }  // notes du prof conservées
      else if (nt.submitted) { nt.open = {}; }
      n.test = nt; n.maj = deps.now();
      put('prog:' + me.mail, n, me.mail);
      return { ok: true, open: nt.open || {}, banc: n.banc };
    },
    journal: function(me, p){
      var per = str(p.per, 40), date = str(p.date, 10); need(/^\d{4}-\d{2}-\d{2}$/.test(date), 'Date invalide.');
      var k = 'journal:' + per + '|' + me.mail, J = doc(k, {}), e = J[date] || {};
      ['pres','h','act','appr','motif','just'].forEach(function(f){ if (p.f && f in p.f) e[f] = str(p.f[f], 3000); });
      e.vu = false; e.maj = deps.now(); J[date] = e; put(k, J, me.mail);
      return { ok: true, entry: e };
    },
    setTel: function(me, p){ var t = doc('stage:tel', {}); t[me.mail] = str(p.tel, 30); put('stage:tel', t, me.mail); return { ok: true }; },
    fcor: fcorGet
  };

  /* ---------- actions prof ---------- */
  var PROF = {
    grade: function(me, p){
      var k = 'prog:' + str(p.mail, 120), pr = doc(k, null); need(pr && pr.test && pr.test.submitted, 'Pas d’évaluation à corriger.');
      var v = +p.v; need(v >= 0 && v <= 20, 'Note invalide.');
      pr.test.open = pr.test.open || {}; pr.test.open[str(p.q, 10)] = v; put(k, pr, me.mail); return { ok: true };
    },
    setBanc: function(me, p){ var k = 'prog:' + str(p.mail, 120), pr = doc(k, {}) || {}; pr.banc = !!p.v; put(k, pr, me.mail); return { ok: true }; },
    setEleveClasse: function(me, p){
      need(PLAT.CLASSES.indexOf(p.classe) >= 0, 'Classe inconnue.');
      var k = 'eleve:' + str(p.mail, 120), el = doc(k, null); need(el, 'Élève inconnu.');
      el.classe = p.classe; put(k, el, me.mail); return { ok: true };
    },
    setEvals: function(me, p){ need(Array.isArray(p.evals), 'Liste invalide.'); put('evals:' + str(p.key, 60), p.evals.slice(0, 80), me.mail); return { ok: true }; },
    setNote: function(me, p){
      var k = 'notes:' + str(p.key, 60), N = doc(k, { over: {}, adj: {}, locked: {} });
      if (p.kind === 'over') { var kk = str(p.ev, 30) + '|' + str(p.mail, 120); if (p.v === '' || p.v == null) delete N.over[kk]; else N.over[kk] = str(p.v, 10); }
      else if (p.kind === 'adj') { var ka = str(p.per, 30) + '|' + str(p.mail, 120); if (p.v === '' || p.v == null) delete N.adj[ka]; else N.adj[ka] = str(p.v, 10); }
      else if (p.kind === 'lock') { N.locked[str(p.per, 30)] = !!p.v; }
      else need(false);
      put(k, N, me.mail); return { ok: true };
    },
    setSom: function(me, p){ var S = doc('som', {}); S[str(p.mail, 120) + '|' + str(p.uaa, 10)] = str(p.v, 20); put('som', S, me.mail); return { ok: true }; },
    setPeriodes: function(me, p){ need(Array.isArray(p.periodes) && p.periodes.length, 'Au moins une période.'); put('periodes', p.periodes.slice(0, 12), me.mail); return { ok: true }; },
    setStagePeriodes: function(me, p){ need(Array.isArray(p.periodes), 'Liste invalide.'); put('stage:periodes', p.periodes.slice(0, 20), me.mail); return { ok: true }; },
    setLieux: function(me, p){ need(Array.isArray(p.lieux), 'Liste invalide.'); put('stage:lieux', p.lieux.slice(0, 300), me.mail); return { ok: true }; },
    stageAff: function(me, p){
      var k = 'stage:aff:' + str(p.per, 40), A = doc(k, {}), m = str(p.mail, 120), a = A[m] || {};
      need(['lieu','conv','visite','app','prof'].indexOf(p.field) >= 0, 'Champ inconnu.');
      a[p.field] = typeof p.v === 'boolean' ? p.v : str(p.v, 120); A[m] = a; put(k, A, me.mail); return { ok: true };
    },
    stageTel: function(me, p){ var t = doc('stage:tel', {}); t[str(p.mail, 120)] = str(p.tel, 30); put('stage:tel', t, me.mail); return { ok: true }; },
    journalProf: function(me, p){
      var k = 'journal:' + str(p.per, 40) + '|' + str(p.mail, 120), J = doc(k, {}), d = str(p.date, 10), e = J[d] || {};
      if ('com' in p) e.com = str(p.com, 2000); if ('vu' in p) e.vu = !!p.vu; J[d] = e; put(k, J, me.mail); return { ok: true };
    },
    signal: function(me, p){ var L = doc('signal', []); L.unshift({ cap: str(p.cap, 20), txt: str(p.txt, 1000), who: me.nom, at: deps.now() }); put('signal', L.slice(0, 200), me.mail); return { ok: true }; },
    fcor: fcorGet,
    setPdf: function(me, p){ var P = doc('pdfs', {}); var c = str(p.course, 40); if (!p.url) delete P[c]; else P[c] = { url: str(p.url, 500), name: str(p.name, 120) }; put('pdfs', P, me.mail); return { ok: true }; }
  };

  /* ---------- actions coordinateur ---------- */
  var COORD = {
    setProfs: function(me, p){
      need(Array.isArray(p.profs), 'Liste invalide.');
      var L = p.profs.map(function(x){ return { nom: str(x.nom, 60), mail: str(x.mail, 120).toLowerCase(), role: x.role === 'Coordinateur' ? 'Coordinateur' : 'Professeur' }; })
        .filter(function(x){ return x.mail.slice(-(PLAT.DOMAIN.length + 1)) === '@' + PLAT.DOMAIN && !/\.student@/.test(x.mail); });
      need(L.some(function(x){ return x.role === 'Coordinateur'; }), 'Il faut garder au moins un coordinateur.');
      put('profs', L, me.mail); return { ok: true };
    },
    setAffect: function(me, p){ need(Array.isArray(p.affect), 'Liste invalide.'); put('affect', p.affect.filter(function(a){ return a && a.cl && a.c && a.profs && a.profs.length; }), me.mail); return { ok: true }; },
    setModes: function(me, p){ put('modes', p.modes || {}, me.mail); return { ok: true }; },
    setFcor: function(me, p){
      var L = Array.isArray(p.list) ? p.list : [p];
      L.forEach(function(x){
        var ch = str(x.ch, 10); need(/^\d+\.\d+$/.test(ch), 'Chapitre invalide.');
        if (x.del) { store.del('fcor:' + ch); return; }
        put('fcor:' + ch, { ch: ch, titre: str(x.titre, 200), ev: str(x.ev, 20000), cor: str(x.cor, 20000) }, me.mail);
      });
      return { ok: true, n: L.length };
    },
    setAccess: function(me, p){ var c = cfg(); if ('open' in p) c.open = !!p.open; if (Array.isArray(p.blocked)) c.blocked = p.blocked.map(function(x){ return String(x).toLowerCase(); }); put('cfg', c, me.mail); return { ok: true }; }
  };

  /* ---------- point d'entrée ---------- */
  function handle(req){
    try {
      var mail = readToken(req && req.t), me = identify(mail), a = req.a, p = req.p || {};
      if (a === 'boot') return { ok: true, data: boot(me) };
      if (a === 'checkMail') { try { var who = identify(p.mail); return { ok: true, res: { ok: true, role: who.role, nom: who.nom } }; } catch (e) { return { ok: true, res: { ok: false, msg: e.message } }; } }
      if (me.role === 'eleve') { need(ELEVE[a], 'Action non autorisée.'); return ELEVE[a](me, p); }
      if (PROF[a]) return PROF[a](me, p);
      if (COORD[a]) { need(me.coord, 'Réservé au coordinateur.'); return COORD[a](me, p); }
      need(false, 'Action inconnue.');
    } catch (e) {
      return { ok: false, code: e.code || 'error', msg: e.message || String(e) };
    }
  }

  /* ---------- installation : premier coordinateur ---------- */
  function install(adminMail, adminNom){
    if (!store.get('profs')) put('profs', [{ nom: adminNom, mail: adminMail.toLowerCase(), role: 'Coordinateur' }], 'install');
    if (!store.get('cfg')) put('cfg', { open: true, blocked: [] }, 'install');
  }

  return { handle: handle, makeToken: makeToken, readToken: readToken, identify: identify, install: install };
}
