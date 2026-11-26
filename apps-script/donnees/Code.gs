/* =========================================================
   Code.gs — branchement Google (Sheet + connexion + API)
   Projet « Données » : à coller dans Extensions › Apps Script du Google Sheet
   « Plateforme technique – données », avec Api.gs.
   Déploiement : application Web · Exécuter en tant que : moi · Accès : tout le monde.
   ========================================================= */

/* ---- À REMPLIR AVANT D'EXÉCUTER « installer » ---- */
var CONFIG = {
  ADMIN_MAIL: 'olivier.lesenfants@elmarche.be',   // premier coordinateur
  ADMIN_NOM:  'O. Lesenfants'
};

var SHEET = 'donnees';

/* ---------- installation (à lancer une fois depuis l'éditeur) ---------- */
function installer() {
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SECRET')) props.setProperty('SECRET', Utilities.getUuid() + Utilities.getUuid());
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.getRange(1, 1, 1, 4).setValues([['cle', 'valeur (JSON)', 'mis à jour', 'par']]).setFontWeight('bold');
    sh.setFrozenRows(1); sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 600);
  }
  api_().install(CONFIG.ADMIN_MAIL, CONFIG.ADMIN_NOM);
  Logger.log('Installation terminée. Coordinateur : ' + CONFIG.ADMIN_MAIL);
  Logger.log('CLÉ SECRÈTE à recopier dans le projet « Connexion » : ' + props.getProperty('SECRET'));
}

/* ---------- stockage clé / valeur dans l'onglet « donnees » ---------- */
function sheetStore_(nom) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(nom || SHEET);
  if (!sh && nom) {   // onglet secondaire (« dessins ») : créé à la première planche
    sh = ss.insertSheet(nom); sh.getRange(1, 1, 1, 4).setValues([['cle', 'valeur (JSON)', 'mis à jour', 'par']]); sh.setFrozenRows(1);
  }
  if (!sh) throw new Error('Onglet « ' + SHEET + ' » introuvable : lance d’abord la fonction « installer ».');
  var n = sh.getLastRow(), rows = n > 1 ? sh.getRange(2, 1, n - 1, 2).getValues() : [], idx = {}, val = {};
  rows.forEach(function(r, i){ if (r[0]) { idx[r[0]] = i + 2; try { val[r[0]] = JSON.parse(r[1]); } catch (e) { val[r[0]] = null; } } });
  return {
    get: function(k){ return val.hasOwnProperty(k) ? val[k] : null; },
    set: function(k, v, by){
      var line = [k, JSON.stringify(v), new Date(), by || ''];
      if (idx[k]) sh.getRange(idx[k], 1, 1, 4).setValues([line]);
      else { sh.appendRow(line); idx[k] = sh.getLastRow(); }
      val[k] = v;
    },
    list: function(prefix){ return Object.keys(val).filter(function(k){ return k.indexOf(prefix) === 0; }).map(function(k){ return { key: k, value: val[k] }; }); },
    del: function(k){ if (idx[k]) { sh.deleteRow(idx[k]); delete val[k]; delete idx[k]; } }
  };
}

function api_() {
  var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
  return makeApi(sheetStore_(), {
    now: function(){ return Date.now(); },
    dessins: function(){ return sheetStore_('dessins'); },   // les planches de l'Atelier de dessin, à part (lourdes)
    hmac: function(s){ return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(s, secret)).replace(/=+$/, ''); },
    b64: function(s){ return Utilities.base64EncodeWebSafe(s, Utilities.Charset.UTF_8).replace(/=+$/, ''); },
    unb64: function(s){ while (s.length % 4) s += '='; return Utilities.newBlob(Utilities.base64DecodeWebSafe(s)).getDataAsString('UTF-8'); }
  });
}

function doGet() { return json_({ ok: true, app: 'Plateforme technique — données' }); }

/* ---------- API (déploiement « Données ») ----------
   Exécuter en tant que : moi · Accès : tout le monde */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return json_(api_().handle(req));
  } catch (err) {
    return json_({ ok: false, code: 'error', msg: 'Serveur occupé ou erreur : ' + err.message });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
