/* =========================================================
   API — connexion et échanges avec le Google Sheet
   ========================================================= */
const LOCAL = !CONFIG.API_URL;
const API = (() => {
  const TK = 'plateforme-jeton';
  let token = null;
  try { token = localStorage.getItem(TK); } catch (e) {}

  /* ---- mode test local : le même backend (Api.gs), stocké dans le navigateur ---- */
  let local = null;
  function localApi(){
    if (local) return local;
    const KEY = 'plateforme-local-db';
    let db = {}; try { db = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
    const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} };
    const store = {
      get: k => k in db ? JSON.parse(JSON.stringify(db[k])) : null,
      set: (k, v) => { db[k] = JSON.parse(JSON.stringify(v)); persist(); },
      list: p => Object.keys(db).filter(k => k.indexOf(p) === 0).map(k => ({ key: k, value: JSON.parse(JSON.stringify(db[k])) })),
      del: k => { delete db[k]; persist(); }
    };
    const enc = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    const dec = s => { s = s.replace(/-/g,'+').replace(/_/g,'/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); };
    const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
    local = makeApi(store, { now: () => Date.now(), hmac: s => hash('local:' + s), b64: enc, unb64: dec });
    if (!db.profs) {   // données d'exemple pour essayer
      store.set('profs', PROFS_DEF); store.set('cfg', { open: true, blocked: [] });
      store.set('affect', AFFECT_DEF); store.set('stage:lieux', LIEUX_DEF);
    }
    local._reset = () => { db = {}; persist(); local = null; };
    return local;
  }

  async function call(a, p) {
    let res;
    if (LOCAL) res = localApi().handle({ t: token, a, p });
    else {
      try {
        const r = await fetch(CONFIG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ t: token, a, p }) });
        res = await r.json();
      } catch (e) { res = { ok: false, code: 'net', msg: 'Pas de connexion au serveur. Vérifie ta connexion internet.' }; }
    }
    if (!res.ok && res.code === 'auth') { logout(true); }
    return res;
  }
  function readHash() {
    const m = location.hash.match(/[#&]t=([^&]+)/);
    if (m) { token = decodeURIComponent(m[1]); try { localStorage.setItem(TK, token); } catch (e) {} history.replaceState(null, '', location.pathname + location.search); }
  }
  function loginGoogle() { location.href = CONFIG.LOGIN_URL + '?ret=' + encodeURIComponent(location.href.split('#')[0]); }
  function loginLocal(mail) { token = localApi().makeToken(mail.trim().toLowerCase()); try { localStorage.setItem(TK, token); } catch (e) {} }
  function logout(silent) { token = null; try { localStorage.removeItem(TK); } catch (e) {} if (!silent) location.reload(); }
  return { call, readHash, loginGoogle, loginLocal, logout, hasToken: () => !!token, resetLocal: () => localApi()._reset() };
})();
