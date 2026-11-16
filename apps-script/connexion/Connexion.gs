/* =========================================================
   Connexion.gs — projet Apps Script séparé, très petit.
   Il lit seulement l'adresse @elmarche.be de la personne connectée
   et lui remet un jeton signé. Il n'a accès à rien d'autre.
   Déploiement : application Web · Exécuter en tant que : l'utilisateur qui accède
                 · Accès : tous les utilisateurs de elmarche.be
   ========================================================= */
var SECRET  = 'COLLE_ICI_LA_CLE_SECRETE';                        // donnée par « installer » dans le projet Données
var APP_URL = 'https://isr-maintenance.github.io/plateforme/';   // adresse publique de l'app
var DOMAIN  = 'elmarche.be';
var TOKEN_DAYS = 30;

function doGet(e) {
  var p = (e && e.parameter) || {};
  var ret = p.ret && p.ret.indexOf(APP_URL) === 0 ? p.ret.split('#')[0] : APP_URL;
  var mail = '';
  try { mail = Session.getActiveUser().getEmail().toLowerCase(); } catch (x) {}
  if (!mail || mail.slice(-(DOMAIN.length + 1)) !== '@' + DOMAIN)
    return out_('Connexion impossible', 'Connecte-toi avec ton compte <b>@' + DOMAIN + '</b>, puis réessaie.', ret, 'Retour', false);
  var body = b64_(JSON.stringify({ e: mail, x: Date.now() + TOKEN_DAYS * 864e5 }));
  var sig = Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(body, SECRET)).replace(/=+$/, '');
  return out_('Connecté', 'Connecté en tant que <b>' + mail + '</b>.', ret + '#t=' + body + '.' + sig, 'Ouvrir la plateforme', true);
}
function b64_(s) { return Utilities.base64EncodeWebSafe(s, Utilities.Charset.UTF_8).replace(/=+$/, ''); }
function out_(title, msg, url, btn, auto) {
  var h = '<div style="font-family:system-ui,sans-serif;max-width:420px;margin:12vh auto;padding:24px;border:1px solid #ddd;border-radius:12px;text-align:center">' +
    '<h2 style="margin:0 0 8px">' + title + '</h2><p style="color:#444">' + msg + '</p>' +
    '<p><a href="' + url + '" target="_top" style="display:inline-block;background:#1d5fc4;color:#fff;padding:10px 18px;border-radius:9px;text-decoration:none;font-weight:600">' + btn + '</a></p></div>' +
    (auto ? '<script>try{window.top.location.href=' + JSON.stringify(url) + ';}catch(e){}</script>' : '');
  return HtmlService.createHtmlOutput(h).setTitle('Plateforme technique').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
