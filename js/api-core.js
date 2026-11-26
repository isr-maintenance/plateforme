/* =========================================================
   Api.gs — logique de la plateforme
   Indépendante du stockage : le même code tourne dans Apps Script
   (stockage = Google Sheet) et dans les tests (stockage en mémoire).
   ========================================================= */
var PLAT = {
  DOMAIN: 'elmarche.be',
  TOKEN_DAYS: 30,
  CLASSES: ['3qem1','3qem2','3qem3','4eqem','4eqmm','5eqem','5eqmm','6eqem','6eqmm'],   // en 3QEM : groupes de TP
  CT: ['3qemct1','3qemct2'],                                                             // groupes de CT des 3QEM (placés par un prof)
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

  /* ---------- connexion unique vers les autres apps (Dossier TP, Banc de câblage, Labo Arduino) ----------
     La plateforme remet un ticket valable 2 minutes, pour une app précise. L'app l'envoie à son propre
     script, qui le fait vérifier ici (ssoCheck) avant de délivrer sa clé habituelle. Le ticket est signé
     différemment des jetons : il ne peut pas servir à se connecter à la plateforme. */
  var SSO_APPS = ['dossier', 'banc', 'arduino'], SSO_MS = 120000;
  function makeTicket(mail, app){
    var body = b64(JSON.stringify({ s: 'sso', e: mail, app: app, x: deps.now() + SSO_MS }));
    return body + '.' + deps.hmac('sso.' + body);
  }
  function ssoCheck(p){
    try {
      var t = String(p.ticket || ''), app = String(p.app || ''), i = t.indexOf('.');
      if (i < 0 || deps.hmac('sso.' + t.slice(0, i)) !== t.slice(i + 1)) throw err('auth', 'Ticket de connexion invalide.');
      var o = JSON.parse(unb64(t.slice(0, i)));
      if (o.s !== 'sso' || o.app !== app) throw err('auth', 'Ticket prévu pour une autre application.');
      if (o.x < deps.now()) throw err('auth', 'Ticket expiré : rouvre l’application depuis la plateforme.');
      var me = identify(o.e);                              // compte toujours autorisé (pas bloqué, etc.)
      return { ok: true, mail: me.mail, nom: me.nom, role: me.role };
    } catch (e) { return { ok: false, code: e.code || 'error', msg: e.message || String(e) }; }
  }

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
    if (/^invite:[a-z0-9]{4,20}$/.test(mail)) return inviteMe(mail.slice(7));
    if (!/^[^@\s]+@[^@\s]+$/.test(mail)) throw err('denied', 'Adresse invalide.');
    if (mail.slice(-(PLAT.DOMAIN.length + 1)) !== '@' + PLAT.DOMAIN) throw err('denied', 'Seules les adresses @' + PLAT.DOMAIN + ' peuvent se connecter.');
    var c = cfg();
    if ((c.blocked || []).indexOf(mail) >= 0) throw err('denied', 'Cette adresse est bloquée. Adresse-toi à ton professeur.');
    var p = profs().filter(function(x){ return x.mail === mail; })[0];
    if (p) return { mail: mail, role: 'prof', nom: p.nom, coord: p.role === 'Coordinateur' };
    if (/\.student@/.test(mail)) {
      var el = doc('eleve:' + mail, null);
      if (!el && c.open === false) throw err('denied', 'L’accès est limité aux élèves déjà inscrits. Adresse-toi à ton professeur.');
      return { mail: mail, role: 'eleve', nom: nameOf(mail), classe: el ? el.classe : null, ct: el && el.ct || '' };
    }
    throw err('denied', 'Adresse de professeur non enregistrée : le coordinateur doit l’ajouter dans « Accès ».');
  }
  /* ---------- personnes extérieures à l'école (invitations) ----------
     Le coordinateur crée une invitation ; la personne reçoit de lui un lien personnel (#invite=code).
     Le code n'est gardé que signé (on ne peut pas le relire). En entrant par le lien, la personne reçoit un jeton
     au nom « invite:<id> » ; elle consulte les cours et les outils, sans aucune donnée d'élève ni de cote.
     Désactiver, supprimer ou laisser expirer l'invitation lui ferme l'accès tout de suite. */
  var INV_TYPES = ['prof', 'stage', 'invite'];
  function invites(){ return doc('invites', []); }
  function inviteMe(id){
    var v = invites().filter(function(x){ return x.id === id; })[0];
    if (!v || !v.actif) throw err('denied', 'Cette invitation n’est plus active. Demande un nouveau lien à l’école.');
    if (v.expire && v.expire < deps.now()) throw err('denied', 'Cette invitation a expiré. Demande un nouveau lien à l’école.');
    return { mail: 'invite:' + id, role: 'invite', nom: v.nom, org: v.org || '', type: v.type };
  }
  function inviteLogin(p){
    try {
      var code = String(p.code || ''); need(/^[A-Za-z0-9_-]{16,64}$/.test(code), 'Lien d’invitation incomplet.');
      var h = deps.hmac('inv.' + code), L = invites(), v = L.filter(function(x){ return x.h === h; })[0];
      if (!v) throw err('denied', 'Lien d’invitation inconnu ou remplacé. Demande un nouveau lien à l’école.');
      inviteMe(v.id);                                         // active, pas expirée
      v.vu = deps.now(); put('invites', L, 'invite:' + v.id);
      return { ok: true, t: makeToken('invite:' + v.id) };
    } catch (e) { return { ok: false, code: e.code || 'error', msg: e.message || String(e) }; }
  }
  var INVITE_OK = ['boot', 'saveMyProg'];
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

  /* ---------- bilans (évaluations en ligne verrouillées) ----------
     « bilan:<id> » = la définition (énoncés, emplacements des dessins, réponses) : jamais dans le code public.
     « bilanouv » = { '<id>|<classe>': date d'ouverture } : le prof déverrouille pour sa classe.
     « bilanrep:<id>|<mail> » = la copie de l'élève { d, remis, note:{pts, com, at, by}, pub }.
     L'élève ne reçoit jamais les réponses ; il voit sa note et la correction quand le prof publie. */
  function bilanMeta(){ return store.list('bilan:').map(function(r){ var v = r.value || {}; return { id: v.id, titre: v.titre, course: v.course, kind: v.kind || 'bilan', ch: v.ch || '' }; }); }
  function bilanOuvert(id, me){ var O = doc('bilanouv', {}), el = doc('eleve:' + me.mail, {}) || {};
    return !!(O[id + '|' + el.classe] || (el.ct && O[id + '|' + el.ct])); }
  function bilanEleve(def, pub){          // la définition sans les réponses (avec, une fois la note publiée)
    var d = JSON.parse(JSON.stringify(def));
    (d.ex || []).forEach(function(x){ (x.res || []).forEach(function(r){ if (!pub) { delete r.ans; delete r.tol; delete r.alt; } }); if (!pub) { delete x.place; delete x.cor; } });
    return d;
  }
  function bilanRepKey(id, mail){ return 'bilanrep:' + id + '|' + mail; }
  function bilanData(d){                  // la copie envoyée par l'élève, nettoyée et bornée
    var o = {}; if (!d || typeof d !== 'object') return o;
    Object.keys(d).slice(0, 40).forEach(function(k){ var x = d[k] || {}, y = {};
      ['d', 'i', 'f', 's'].forEach(function(c){ y[c] = str(x[c], c === 's' ? 1500 : 400); });
      y.r = (Array.isArray(x.r) ? x.r : []).slice(0, 12).map(function(v){ return str(v, 40); });
      y.pl = {}; if (x.pl && typeof x.pl === 'object') Object.keys(x.pl).slice(0, 20).forEach(function(s){ y.pl[str(s, 4)] = Number(x.pl[s]); });
      o[str(k, 4)] = y; });
    return o;
  }

  /* ---------- démarrage : tout ce qu'il faut à l'écran ---------- */
  function boot(me){
    if (me.role === 'invite') {
      var pd = doc('pdfs', {}), pdfs = {};
      Object.keys(pd).forEach(function(k){ if (!/prof|cor|eval/i.test(k)) pdfs[k] = pd[k]; });   // seulement les versions élèves
      var mp0 = doc('profprog:' + me.mail, null);
      return { me: me, cfg: { open: true }, modes: {}, affect: [], pdfs: pdfs, ouv: {}, stage: { periodes: null, lieux: [] }, bilans: [], fcor: [],
        myProg: mp0 && mp0.annee === anneeSco(deps.now()) ? mp0.prog : null };
    }
    var out = { me: me, cfg: { open: cfg().open !== false }, modes: doc('modes', {}), affect: doc('affect', []), pdfs: doc('pdfs', {}), ouv: doc('ouv', {}) };
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
      out.bilans = bilanMeta().map(function(b){ var R = doc(bilanRepKey(b.id, me.mail), null) || {};
        b.open = bilanOuvert(b.id, me); b.remis = R.remis || 0; b.pub = R.pub || 0; return b; });
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
    out.bilans = bilanMeta(); out.bilanouv = doc('bilanouv', {});
    if (me.coord) out.invites = invites().map(function(x){ var y = {}; Object.keys(x).forEach(function(k){ if (k !== 'h') y[k] = x[k]; }); return y; });
    var mp = doc('profprog:' + me.mail, null);                 // la progression du prof dans les capsules, remise à zéro chaque année scolaire
    out.myProg = mp && mp.annee === anneeSco(deps.now()) ? mp.prog : null;
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
      n.atel = old.atel || {};                              // points « à l'atelier » : cochés par le prof uniquement
      var ot = old.test || {}, nt = n.test || {};
      if (nt.submitted && ot.submitted && nt.sid && nt.sid === ot.sid) { nt.open = ot.open || {}; }  // notes du prof conservées
      else if (nt.submitted) { nt.open = {}; }
      n.test = nt; n.maj = deps.now();
      put('prog:' + me.mail, n, me.mail);
      return { ok: true, open: nt.open || {}, banc: n.banc, atel: n.atel };
    },
    journal: function(me, p){
      var per = str(p.per, 40), date = str(p.date, 10); need(/^\d{4}-\d{2}-\d{2}$/.test(date), 'Date invalide.');
      var k = 'journal:' + per + '|' + me.mail, J = doc(k, {}), e = J[date] || {};
      ['pres','h','act','appr','motif','just'].forEach(function(f){ if (p.f && f in p.f) e[f] = str(p.f[f], 3000); });
      e.vu = false; e.maj = deps.now(); J[date] = e; put(k, J, me.mail);
      return { ok: true, entry: e };
    },
    setTel: function(me, p){ var t = doc('stage:tel', {}); t[me.mail] = str(p.tel, 30); put('stage:tel', t, me.mail); return { ok: true }; },
    /* l'élève encode lui-même son entreprise de stage : elle est ajoutée au carnet d'adresses (à vérifier par un prof) et lui est attribuée */
    addLieu: function(me, p){
      var per = str(p.per, 40); need(/^[\w-]+$/.test(per), 'Stage inconnu.');
      var el = doc('eleve:' + me.mail, null); need(el && el.classe, 'Choisis d’abord ta classe.');
      var k = 'stage:aff:' + per, A = doc(k, {}), a = A[me.mail] || {};
      var L = doc('stage:lieux', []), cur = a.lieu ? L.filter(function(l){ return l.id === a.lieu; })[0] : null;
      need(!a.lieu || (cur && cur.by === me.mail && cur.verif), 'Ton lieu de stage est déjà encodé par ton professeur : demande-lui pour le changer.');
      var f = p.lieu || {}, v = {};
      LIEU_F.forEach(function(x){ v[x] = str(f[x], x === 'adresse' ? 200 : 120).trim(); });
      need(v.nom.length >= 2, 'Indique le nom de l’entreprise.'); need(v.localite.length >= 2, 'Indique la localité.');
      need(v.tuteur.length >= 2, 'Indique le nom de ton tuteur.'); need(v.tel || v.mail, 'Indique au moins un téléphone ou une adresse mail de l’entreprise.');
      var same = L.filter(function(l){ return norm(l.nom) === norm(v.nom) && norm(l.localite) === norm(v.localite) && (!cur || l.id !== cur.id); })[0];
      var note = 'Ajouté par ' + me.nom + ' (élève) — à vérifier', id, lieu;
      if (same) {                                              // entreprise déjà connue : on la réutilise telle quelle
        id = same.id; lieu = same;
        if (cur && !lieuUsed(cur.id, per, me.mail)) L = L.filter(function(l){ return l.id !== cur.id; });
      } else if (cur) {                                        // l'élève corrige sa propre fiche, pas encore vérifiée
        LIEU_F.forEach(function(x){ cur[x] = v[x]; }); cur.note = note; id = cur.id; lieu = cur;
      } else {
        var fl = el.classe.slice(1); fl = (fl === 'eqem' || fl === 'eqmm') ? [fl] : ['eqem', 'eqmm'];
        id = 'l' + deps.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
        lieu = { id: id, fil: fl, note: note, by: me.mail, verif: true };
        LIEU_F.forEach(function(x){ lieu[x] = v[x]; });
        need(L.length < 300, 'Le carnet d’adresses est plein : demande à ton professeur.');
        L.push(lieu);
      }
      put('stage:lieux', L, me.mail);
      a.lieu = id; A[me.mail] = a; put(k, A, me.mail);
      return { ok: true, lieu: lieu };
    },
    fcor: fcorGet,
    bilan: function(me, p){
      var id = str(p.id, 40), def = doc('bilan:' + id, null); need(def, 'Bilan inconnu.');
      var R = doc(bilanRepKey(id, me.mail), null) || {};
      need(bilanOuvert(id, me) || R.pub, 'Ce bilan est verrouillé : ton prof l’ouvrira le moment venu.');
      var pub = !!R.pub;
      return { ok: true, def: bilanEleve(def, pub), rep: { d: R.d || {}, remis: R.remis || 0, pub: R.pub || 0, note: pub ? R.note || null : null } };
    },
    bilanSave: function(me, p){
      var id = str(p.id, 40); need(doc('bilan:' + id, null), 'Bilan inconnu.'); need(bilanOuvert(id, me), 'Ce bilan est verrouillé.');
      var k = bilanRepKey(id, me.mail), R = doc(k, null) || {}; need(!R.remis, 'Ta copie est déjà remise.');
      if (p.d) R.d = bilanData(p.d);
      if (p.sortie && typeof p.sortie === 'object') {      // l'élève a quitté la page pendant l'évaluation : on le note, le prof le voit
        R.sorties = (R.sorties || []).concat([{ t: Number(p.sortie.t) || deps.now(), dur: Math.max(0, Math.round(Number(p.sortie.dur) || 0)), quoi: str(p.sortie.quoi, 20) }]).slice(-60);
      }
      R.maj = deps.now(); if (p.remettre) R.remis = deps.now();
      put(k, R, me.mail); return { ok: true, remis: R.remis || 0 };
    }
  };
  var LIEU_F = ['nom', 'adresse', 'localite', 'secteur', 'tuteur', 'tel', 'mail'];
  function norm(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
  /* ce lieu est-il attribué à quelqu'un d'autre que (per, mail) ? */
  function lieuUsed(id, per, mail){
    return store.list('stage:aff:').some(function(r){ var P = r.value || {}, pk = r.key.slice(10);
      return Object.keys(P).some(function(m){ return P[m] && P[m].lieu === id && !(pk === per && m === mail); }); });
  }

  /* année scolaire « 2026-2027 » : elle change le 15 août, avant la rentrée de fin août */
  function anneeSco(t){ var d = new Date(t), y = d.getUTCFullYear(), m = d.getUTCMonth();
    return (m > 7 || (m === 7 && d.getUTCDate() >= 15)) ? y + '-' + (y + 1) : (y - 1) + '-' + y; }

  /* ---------- actions prof ---------- */
  var PROF = {
    /* le prof qui fait les capsules (aperçu élève) retrouve où il s'est arrêté ; rien ne va dans le suivi ni dans le carnet */
    saveMyProg: function(me, p){
      need(p.prog && typeof p.prog === 'object', 'Progression manquante.');
      var n = p.prog; n.maj = deps.now();
      put('profprog:' + me.mail, { annee: anneeSco(deps.now()), prog: n }, me.mail);
      return { ok: true };
    },
    grade: function(me, p){
      var k = 'prog:' + str(p.mail, 120), pr = doc(k, null); need(pr && pr.test && pr.test.submitted, 'Pas d’évaluation à corriger.');
      var v = +p.v; need(v >= 0 && v <= 20, 'Note invalide.');
      pr.test.open = pr.test.open || {}; pr.test.open[str(p.q, 10)] = v; put(k, pr, me.mail); return { ok: true };
    },
    /* point « à l'atelier » d'un chapitre, validé par un prof de l'élève (classe ou groupe de CT) */
    setAtelier: function(me, p){
      var mail = str(p.mail, 120), k = str(p.k, 20); need(/^[\w.-]+$/.test(k), 'Point inconnu.');
      var el = doc('eleve:' + mail, null); need(el, 'Élève inconnu.');
      need(isProfOf(me, el.classe) || (el.ct && isProfOf(me, el.ct)), 'Tu ne donnes pas cours à cet élève.');
      var key = 'prog:' + mail, pr = doc(key, {}) || {}; pr.atel = pr.atel || {};
      if (p.v) pr.atel[k] = deps.now(); else delete pr.atel[k];
      put(key, pr, me.mail); return { ok: true };
    },
    setBanc: function(me, p){ var k = 'prog:' + str(p.mail, 120), pr = doc(k, {}) || {}; pr.banc = !!p.v; put(k, pr, me.mail); return { ok: true }; },
    setEleveClasse: function(me, p){
      need(PLAT.CLASSES.indexOf(p.classe) >= 0, 'Classe inconnue.');
      var k = 'eleve:' + str(p.mail, 120), el = doc(k, null); need(el, 'Élève inconnu.');
      el.classe = p.classe; if (!/^3qem/.test(p.classe)) delete el.ct; put(k, el, me.mail); return { ok: true };
    },
    /* groupe de CT d'un élève de 3QEM ('' = à placer) */
    setEleveCt: function(me, p){
      var ct = str(p.ct, 20); need(ct === '' || PLAT.CT.indexOf(ct) >= 0, 'Groupe inconnu.');
      var k = 'eleve:' + str(p.mail, 120), el = doc(k, null); need(el, 'Élève inconnu.');
      need(/^3qem/.test(el.classe || ''), 'Les groupes de CT ne concernent que les 3QEM.');
      if (ct) el.ct = ct; else delete el.ct; put(k, el, me.mail); return { ok: true };
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
    /* la liste envoyée par le prof remplace le carnet, sauf les lieux attribués à un élève qui n'y figurent pas
       (ajoutés par un élève pendant que la page du prof était ouverte) */
    setLieux: function(me, p){
      need(Array.isArray(p.lieux), 'Liste invalide.');
      var inc = p.lieux.slice(0, 300), ids = {}; inc.forEach(function(l){ if (l) ids[l.id] = 1; });
      var cur = doc('stage:lieux', []), extra = cur.filter(function(l){ return !ids[l.id] && lieuUsed(l.id, '', ''); });
      inc = inc.concat(extra); put('stage:lieux', inc, me.mail);
      return { ok: true, lieux: inc, added: extra.length };
    },
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
    /* chapitres ouverts pour une classe et un cours, par un prof de cette classe : {key:'4eqmm|4-elec', chaps:['2.1',…]} */
    setOuv: function(me, p){
      var key = str(p.key, 60), cl = key.split('|')[0];
      need(PLAT.CLASSES.concat(PLAT.CT).indexOf(cl) >= 0, 'Classe inconnue.'); need(isProfOf(me, cl), 'Tu ne donnes pas cours dans cette classe.');
      need(Array.isArray(p.chaps), 'Liste invalide.');
      var O = doc('ouv', {}); O[key] = p.chaps.map(function(c){ return str(c, 10); }).filter(function(c){ return /^\d+\.\d+$/.test(c); }).slice(0, 60);
      put('ouv', O, me.mail); return { ok: true, chaps: O[key] };
    },
    fcor: fcorGet,
    bilanOuvrir: function(me, p){
      var id = str(p.id, 40), cl = str(p.cl, 20); need(doc('bilan:' + id, null), 'Bilan inconnu.');
      need(PLAT.CLASSES.concat(PLAT.CT).indexOf(cl) >= 0, 'Classe inconnue.'); need(isProfOf(me, cl), 'Tu ne donnes pas cours dans cette classe.');
      var O = doc('bilanouv', {}); if (p.open) O[id + '|' + cl] = deps.now(); else delete O[id + '|' + cl];
      put('bilanouv', O, me.mail); return { ok: true, ouv: O };
    },
    bilanCopies: function(me, p){
      var id = str(p.id, 40), def = doc('bilan:' + id, null); need(def, 'Bilan inconnu.');
      return { ok: true, def: def, reps: listDocs('bilanrep:' + id + '|') };
    },
    bilanReps: function(me, p){             // toutes les copies des évaluations d'un cours (Suivi, carnet)
      var co = str(p.course, 40), out = {};
      store.list('bilan:').forEach(function(r){ var v = r.value || {}; if (v.course === co) out[v.id] = listDocs('bilanrep:' + v.id + '|'); });
      return { ok: true, reps: out };
    },
    bilanNoter: function(me, p){
      var id = str(p.id, 40), mail = str(p.mail, 120), k = bilanRepKey(id, mail), R = doc(k, null); need(R, 'Pas de copie pour cet élève.');
      var el = doc('eleve:' + mail, {}) || {}; need(isProfOf(me, el.classe) || (el.ct && isProfOf(me, el.ct)), 'Cet élève n’est pas dans ta classe.');
      if (p.rouvrir) { R.remis = 0; R.pub = 0; }
      else {
        var pts = {}; if (p.pts && typeof p.pts === 'object') Object.keys(p.pts).slice(0, 40).forEach(function(x){ var v = Number(p.pts[x]); if (isFinite(v)) pts[str(x, 4)] = v; });
        R.note = { pts: pts, com: str(p.com, 1000), at: deps.now(), by: me.nom };
        if ('pub' in p) R.pub = p.pub ? deps.now() : 0;
      }
      put(k, R, me.mail); return { ok: true, rep: R };
    },
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
    bilanSet: function(me, p){
      var d = p.def; need(d && typeof d === 'object' && /^[a-z0-9-]{3,40}$/.test(d.id || ''), 'Définition invalide.');
      need(Array.isArray(d.ex) && d.ex.length, 'Aucun exercice.');
      if (p.del) { store.del('bilan:' + d.id); return { ok: true }; }
      put('bilan:' + d.id, d, me.mail); return { ok: true, n: d.ex.length };
    },
    inviteSet: function(me, p){
      var x = p.inv || {}, L = invites(), id = str(x.id, 20);
      var v = L.filter(function(y){ return y.id === id; })[0];
      if (!v) { need(/^[a-z0-9]{4,20}$/.test(id), 'Identifiant invalide.'); need(x.code, 'Code manquant.'); v = { id: id, cree: deps.now(), par: me.nom, actif: true }; L.push(v); }
      if ('nom' in x) { v.nom = str(x.nom, 80).trim(); need(v.nom, 'Nom manquant.'); }
      if ('org' in x) v.org = str(x.org, 120);
      if ('mail' in x) v.mail = str(x.mail, 120).toLowerCase();
      if ('type' in x) v.type = INV_TYPES.indexOf(x.type) >= 0 ? x.type : 'invite';
      if ('expire' in x) v.expire = +x.expire || 0;
      if ('actif' in x) v.actif = !!x.actif;
      if (x.code) { need(/^[A-Za-z0-9_-]{16,64}$/.test(String(x.code)), 'Code invalide.'); v.h = deps.hmac('inv.' + x.code); v.lien = deps.now(); }
      need(L.length <= 200, 'Trop d’invitations.');
      put('invites', L, me.mail); return { ok: true };
    },
    inviteDel: function(me, p){ put('invites', invites().filter(function(x){ return x.id !== p.id; }), me.mail); store.del('profprog:invite:' + str(p.id, 20)); return { ok: true }; },
    setAccess: function(me, p){ var c = cfg(); if ('open' in p) c.open = !!p.open; if (Array.isArray(p.blocked)) c.blocked = p.blocked.map(function(x){ return String(x).toLowerCase(); }); put('cfg', c, me.mail); return { ok: true }; }
  };

  /* ---------- point d'entrée ---------- */
  function handle(req){
    try {
      if (req && req.a === 'ssoCheck') return ssoCheck(req.p || {});     // appelé par le script d'une autre app, sans jeton
      if (req && req.a === 'inviteLogin') return inviteLogin(req.p || {}); // lien d'invitation d'une personne extérieure, sans jeton
      var mail = readToken(req && req.t), me = identify(mail), a = req.a, p = req.p || {};
      if (me.role === 'invite') { need(INVITE_OK.indexOf(a) >= 0, 'Action non autorisée pour une personne invitée.'); if (a === 'boot') return { ok: true, data: boot(me) }; return PROF[a](me, p); }
      if (a === 'ssoTicket') { need(SSO_APPS.indexOf(p.app) >= 0, 'Application inconnue.'); return { ok: true, ticket: makeTicket(me.mail, p.app) }; }
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
