/* =====================================================================
   PLATEFORME — connexion avec l'adresse de l'école et enregistrement en ligne
   ---------------------------------------------------------------------
   L'atelier est servi par la Plateforme technique (même adresse) : il reprend
   sa connexion (jeton « plateforme-jeton », js/api.js de la plateforme).
   Connecté, chaque planche est enregistrée sur le serveur de la plateforme
   (actions dessinListe / dessinGet / dessinPut / dessinDel) : l'élève la
   retrouve sur un autre appareil, et le prof voit les scores dans son carnet
   de cotes. Sans connexion, tout reste dans le navigateur, comme avant.
     #/dessin/voir/<adresse>/<planche>  (prof) ouvre une copie de la planche d'un élève
   ===================================================================== */
import { stockage, surEcriture, toast, esc } from './utils.js';

const CLE = 'planches', COURANTE = 'dao.courante';
const API_ = () => (typeof API !== 'undefined' ? API : null);
let moi = null, silence = false, file = new Map(), suppr = new Set(), minuterie = null, etat = 'ok';

/** Les nombres arrondis au millième : la planche prend deux à trois fois moins de place en ligne. */
const compacte = (pl) => JSON.parse(JSON.stringify(pl, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1000) / 1000 : v)));
const enLigne = (id) => !String(id).startsWith('voir-');
function ecrireSilence(cle, v) { silence = true; try { stockage.ecrire(cle, v); } finally { silence = false; } }

/* ---------- le petit indicateur en haut à droite ---------- */
function badge() {
  const zone = document.querySelector('.top-actions'); if (!zone) return;
  let b = document.getElementById('pf-compte');
  if (!b) { b = document.createElement('span'); b.id = 'pf-compte'; b.className = 'pf-compte'; zone.prepend(b); }
  if (!API_() || !API_().hasToken() || !moi) {
    b.innerHTML = `<button class="btn" type="button" id="pf-login" title="Avec ton adresse de l'école : tes planches sont enregistrées et ton prof voit tes scores">Se connecter</button>`;
    b.querySelector('#pf-login').onclick = () => API_() && API_().loginGoogle();
    return;
  }
  const txt = etat === 'cours' ? '⏳ enregistrement…' : etat === 'err' ? '⚠ pas enregistré en ligne' : '✓ enregistré';
  b.innerHTML = `<span class="pf-nom" title="${esc(moi.mail)}">${esc(moi.nom)}</span> <span class="pf-etat ${etat}" title="${etat === 'err' ? 'Tes planches restent dans ce navigateur ; nouvel essai à la prochaine modification' : 'Tes planches sont enregistrées en ligne'}">${txt}</span>`;
}
function setEtat(e) { etat = e; badge(); }

/* ---------- envoi des planches modifiées (regroupé toutes les 2 s) ---------- */
async function envoyer() {
  minuterie = null; if (!moi) return;
  const t = stockage.lire(CLE, {}) || {};
  const ids = [...file.keys()]; file.clear();
  const dels = [...suppr]; suppr.clear();
  if (!ids.length && !dels.length) return;
  setEtat('cours'); let ok = true;
  for (const id of dels) { const r = await API_().call('dessinDel', { id }); if (!r.ok) { ok = false; suppr.add(id); } }
  for (const id of ids) {
    if (!t[id]) continue;
    if (!t[id].exo && !(t[id].entites || []).length) continue;   // planche vide créée d'office : rien à garder en ligne
    const r = await API_().call('dessinPut', { id, pl: compacte(t[id]) });
    if (!r.ok) { ok = false; if (r.code === 'size') toast(r.msg, 6000); else file.set(id, 1); }
  }
  if (suppr.size) stockage.ecrire('sync.suppr.' + moi.mail, [...suppr]);
  else stockage.supprimer('sync.suppr.' + moi.mail);
  if (ok) stockage.ecrire('sync.last.' + moi.mail, Date.now());
  setEtat(ok ? 'ok' : 'err');
}
function planifier() { clearTimeout(minuterie); minuterie = setTimeout(envoyer, 2000); setEtat('cours'); }

/* ---------- au démarrage : réunir ce qui est dans le navigateur et ce qui est en ligne ---------- */
async function synchroniser() {
  const r = await API_().call('dessinListe');
  if (!r.ok) { moi = null; return; }
  moi = r.me; const srv = r.planches || {};
  /* planches d'un autre compte sur cet appareil (ordinateur partagé) : mises de côté, pas mélangées */
  const proprio = stockage.lire('sync.compte', '');
  let local = stockage.lire(CLE, {}) || {};
  if (proprio && proprio !== moi.mail) {
    ecrireSilence('archive.' + proprio, local); local = {}; ecrireSilence(CLE, local); stockage.supprimer(COURANTE);
    const mien = stockage.lire('archive.' + moi.mail, null);   // ses propres planches, mises de côté plus tôt sur cet appareil
    if (mien && typeof mien === 'object') { local = mien; ecrireSilence(CLE, local); stockage.supprimer('archive.' + moi.mail); }
  }
  stockage.ecrire('sync.compte', moi.mail);
  const last = stockage.lire('sync.last.' + moi.mail, 0) || 0;
  (stockage.lire('sync.suppr.' + moi.mail, []) || []).forEach((id) => suppr.add(id));
  const aLire = [];
  for (const id of Object.keys(srv)) {
    if (suppr.has(id)) continue;
    if (!local[id] || (srv[id] || 0) > (local[id].maj || 0)) aLire.push(id);
  }
  for (const id of Object.keys(local)) {
    if (!enLigne(id)) { delete local[id]; continue; }   // copies de consultation d'une visite précédente
    if (!(id in srv)) { if (!last || (local[id].maj || 0) > last) file.set(id, 1); else delete local[id]; }   // nouvelle ici, ou supprimée sur un autre appareil
    else if ((local[id].maj || 0) > (srv[id] || 0)) file.set(id, 1);
  }
  for (let i = 0; i < aLire.length; i += 20) {
    const g = await API_().call('dessinGet', { ids: aLire.slice(i, i + 20) });
    if (g.ok) Object.assign(local, g.planches);
  }
  ecrireSilence(CLE, local);
  if (file.size || suppr.size) await envoyer(); else stockage.ecrire('sync.last.' + moi.mail, Date.now());
}

/* ---------- le prof ouvre la planche d'un élève (copie locale, jamais renvoyée) ---------- */
async function ouvrirCopie(mail, id) {
  const r = await API_().call('dessinVoir', { mail, id });
  if (!r.ok) { toast(r.msg || 'Planche introuvable', 5000); location.replace('#/dessin'); return; }
  const t = stockage.lire(CLE, {}) || {}, k = 'voir-' + id;
  const pl = r.pl; pl.cartouche = { ...(pl.cartouche || {}), numero: 'consultation' };
  t[k] = { ...pl, maj: Date.now() }; ecrireSilence(CLE, t); stockage.ecrire(COURANTE, k);
  location.replace('#/dessin/libre');
  setTimeout(() => toast(`Planche de ${mail.split('@')[0].replace(/\.student$/, '').split('.').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} : copie de consultation (tes changements ne lui sont pas envoyés).`, 7000), 600);
}

export async function demarrerPlateforme() {
  const A = API_(); if (!A) return;
  A.readHash();                                   // retour de la connexion Google (#t=…)
  badge();
  if (!A.hasToken()) return;
  try { await Promise.race([synchroniser(), new Promise((res) => setTimeout(res, 8000))]); } catch (e) { console.warn(e); }
  badge();
  if (!moi) return;
  surEcriture((cle, ancien, nouveau) => {
    if (silence || cle !== CLE || !moi) return;
    const a = ancien || {}, n = nouveau || {};
    for (const id of Object.keys(n)) if (enLigne(id) && (!a[id] || (a[id].maj || 0) !== (n[id].maj || 0) || JSON.stringify(a[id].exo) !== JSON.stringify(n[id].exo))) file.set(id, 1);
    for (const id of Object.keys(a)) if (enLigne(id) && !n[id]) { suppr.add(id); file.delete(id); }
    if (file.size || suppr.size) planifier();
  });
  window.addEventListener('beforeunload', (e) => { if (minuterie) { e.preventDefault(); e.returnValue = ''; } });
  const v = /^#\/dessin\/voir\/([^/]+)\/([^/]+)$/.exec(location.hash);
  if (v && moi.role === 'prof') await ouvrirCopie(decodeURIComponent(v[1]), decodeURIComponent(v[2]));
}
