/* =====================================================================
   ATELIER DE DESSIN TECHNIQUE — démarrage et navigation (#/dessin…)
   ---------------------------------------------------------------------
   Outil autonome de la Plateforme technique (outils/atelier-dessin/).
   Le travail de l'élève est dans son navigateur (localStorage, préfixe
   « atelier-dessin. », js/utils.js) et, s'il est connecté avec son adresse
   de l'école, enregistré aussi sur le serveur de la plateforme
   (js/plateforme.js : autre appareil, carnet de cotes du prof).
     #/dessin            catalogue des exercices (js/vues/atelier.js)
     #/dessin/libre[/…]  planche de dessin (js/vues/planche-libre.js)
   Le dessin lui-même (pièces, vues, coupes, perspectives, cotation,
   correction) est dans js/dao/.
   Origine : atelier de l'appli « Révisions » de Logan Degossely.
   ===================================================================== */
import { esc } from './utils.js';
import { definirRetouches } from './dao/retouches.js';
import { RETOUCHES } from './dao/retouches-data.js';
import { vueAtelier } from './vues/atelier.js';
import { demarrerPlateforme } from './plateforme.js';

definirRetouches(RETOUCHES);
const vue = document.getElementById('vue');
let nettoyer = null;

async function router() {
  const route = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const [page, ...params] = route;
  if (page !== 'dessin') { location.replace('#/dessin'); return; }
  if (typeof nettoyer === 'function') nettoyer();
  nettoyer = null;
  const zone = document.createElement('div');
  vue.replaceChildren(zone);
  try {
    nettoyer = await vueAtelier(zone, params);
  } catch (err) {
    console.error(err);
    zone.innerHTML = `<div class="error-box"><b>Oups.</b> ${esc(err.message)}</div><p><a class="btn" href="#/dessin">Retour à l'atelier</a></p>`;
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', router);
demarrerPlateforme().catch((e) => console.warn(e)).finally(router);   // d'abord la connexion et les planches en ligne

/* thème : clair / sombre / automatique (bouton en haut à droite) */
const CLE = 'atelier-dessin.theme';
const lireTheme = () => { try { return localStorage.getItem(CLE) || 'auto'; } catch { return 'auto'; } };
function appliquer(t) {
  if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  const b = document.getElementById('btn-theme');
  b.textContent = { auto: 'Thème auto', light: 'Thème clair', dark: 'Thème sombre' }[t];
  b.title = `Thème : ${{ auto: 'automatique', light: 'clair', dark: 'sombre' }[t]}`;
}
document.getElementById('btn-theme').addEventListener('click', () => {
  const t = { auto: 'light', light: 'dark', dark: 'auto' }[lireTheme()];
  try { localStorage.setItem(CLE, t); } catch { /* stockage bloqué */ }
  appliquer(t);
});
appliquer(lireTheme());
