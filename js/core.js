/* =========================================================
   CŒUR — état, données, navigation, connexion
   ========================================================= */
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = (sel,root=document)=>root.querySelector(sel);
const ck=(...a)=>a.join('|');

const DEF_PROG = ()=>({ quiz:{}, ex:{}, steps:[], ohm:{}, visited:[], banc:false, atel:{}, test:{submitted:false, ans:{}, pts:{}, open:{}, texts:{}}, sec:0 });
function normProg(p){ const d=DEF_PROG(); p=p||{}; const o=Object.assign(d,p); o.test=Object.assign(DEF_PROG().test, p.test||{}); ['quiz','ex','ohm','atel','tr'].forEach(k=>{ if(!o[k]||typeof o[k]!=='object') o[k]={}; }); ['steps','visited'].forEach(k=>{ if(!Array.isArray(o[k])) o[k]=[]; }); return o; }

const S = {
  me:null, booted:false, error:null,
  role:'eleve', tab:'presentation', eleveClass:null, dashKey:'', view:{ page:'home' }, lib:{ sel:'4|eqmm' },
  prog: DEF_PROG(), progs:{}, eleves:{}, modes:{}, signal:[], pdfs:{},
  carnet:{ key:'', per:'', som:{}, evals:{}, periodes:[], echelle:'%', arrondi:'1' }, notes:{},
  stage:{ cl:'4eqmm', per:'', periodes:[], lieux:[], aff:{}, tel:{}, journal:{}, mine:{}, colors:{}, onlyMine:false },
  access:{ blocked:[], profs:[], open:true },
};
let ME='';
const isProf = () => S.me && S.me.role==='prof';
const isInvite = () => !!(S.me && S.me.role==='invite');   // personne extérieure : consultation seule
const isCoord = () => S.me && S.me.coord;

/* ---------- préférences d'affichage (propres à ce navigateur) ---------- */
const PREF_KEY='plateforme-prefs';
function savePrefs(){ try{ localStorage.setItem(PREF_KEY, JSON.stringify({ dashKey:S.dashKey, dashMode:S.dashMode, agendaSel:S.agendaSel, ckey:S.carnet.key, cper:S.carnet.per, ech:S.carnet.echelle, arr:S.carnet.arrondi, scl:S.stage.cl, sper:S.stage.per, colors:S.stage.colors, onlyMine:S.stage.onlyMine, lib:S.lib.sel })); }catch(e){} }
function loadPrefs(){ try{ const p=JSON.parse(localStorage.getItem(PREF_KEY)||'{}'); if(p.dashKey) S.dashKey=p.dashKey; if(p.dashMode) S.dashMode=p.dashMode; if(Array.isArray(p.agendaSel)) S.agendaSel=p.agendaSel; if(p.ckey) S.carnet.key=p.ckey; if(p.cper) S.carnet.per=p.cper; if(p.ech) S.carnet.echelle=p.ech; if(p.arr) S.carnet.arrondi=p.arr; if(p.scl) S.stage.cl=p.scl; if(p.sper) S.stage.per=p.sper; if(p.colors) S.stage.colors=p.colors; S.stage.onlyMine=!!p.onlyMine; if(p.lib) S.lib.sel=p.lib; }catch(e){} }

/* ---------- envoi au serveur ---------- */
/* Les enregistrements partent en arrière-plan : l'écran est déjà à jour, l'indicateur en haut
   passe à « enregistrement… » puis au vert quand tout est arrivé. On peut donc enchaîner plusieurs
   changements sans attendre. Deux changements de la même donnée partent l'un après l'autre, dans l'ordre. */
const LECTURES = ['fcor','checkMail','boot','ssoTicket','bilan','bilanCopies','bilanReps'];
let PENDING = 0, PEND_ERR = '';
const CHAINS = {};
async function act(a, p, okMsg){
  if(LECTURES.includes(a)){
    const r = await API.call(a, p);
    if(!r.ok){ toast(r.msg || 'Erreur'); return null; }
    if(okMsg) toast(okMsg);
    return r;
  }
  const ck = a + '|' + (p && (p.key || p.per || p.mail) || '');
  PENDING++; PEND_ERR=''; setSync('cours');
  const run = (CHAINS[ck] || Promise.resolve()).then(() => API.call(a, p)).catch(e => ({ ok:false, msg: e && e.message }));
  CHAINS[ck] = run;
  const r = await run;
  if(CHAINS[ck] === run) delete CHAINS[ck];
  PENDING--;
  if(!r.ok){ PEND_ERR = r.msg || 'Erreur : non enregistré'; toast('Non enregistré : ' + PEND_ERR); }
  else if(okMsg && PENDING === 0) toast(okMsg);
  if(PENDING === 0) setSync(PEND_ERR ? 'err' : 'ok', PEND_ERR);
  else setSync('cours');
  return r.ok ? r : null;
}
window.addEventListener('beforeunload', e => { if(PENDING > 0){ e.preventDefault(); e.returnValue = ''; } });
/* la progression de l'élève part au serveur 1,5 s après le dernier changement */
let saveTimer=null, previewProg=null;
function save(){
  savePrefs();
  if(!S.me) return;
  if(isProf()) previewProg=S.prog;   // la progression d'un prof (en vue prof comme en aperçu élève) est gardée à part, hors suivi et carnet
  clearTimeout(saveTimer); saveTimer=setTimeout(pushProg, 1500); setSync('cours');
}
/* ---------- plusieurs onglets ou appareils ----------
   Un onglet resté ouvert (autre ordinateur, téléphone, PC de l'école) a une progression ancienne : s'il enregistrait,
   il écraserait le travail fait ailleurs. Donc : un onglet inactif n'enregistre rien (pas même le temps passé), et
   quand on y revient, il relit d'abord la progression du serveur et la fusionne à la sienne (rien ne se perd :
   ce qui est validé d'un côté ou de l'autre le reste). La fusion se fait dans l'objet existant (les exercices ouverts gardent leurs références). */
const IDLE_MS = 2*60*1000;
let lastAct = Date.now(), resyncing = null;
const actif = () => document.visibilityState==='visible' && Date.now()-lastAct < IDLE_MS;
function mergeInto(a, b){   // a : progression locale (modifiée sur place), b : progression du serveur
  if(!b || typeof b!=='object') return false;
  b = normProg(JSON.parse(JSON.stringify(b))); let ch=false;
  ['quiz','ex','ohm','atel'].forEach(k=>{ Object.keys(b[k]).forEach(x=>{ if(b[k][x] && !a[k][x]){ a[k][x]=b[k][x]; ch=true; } }); });
  if(!a.tr||typeof a.tr!=='object') a.tr={};
  Object.keys(b.tr||{}).forEach(x=>{ if((b.tr[x]||0) > (a.tr[x]||0)){ a.tr[x]=b.tr[x]; ch=true; } });
  ['steps','visited'].forEach(k=>{ b[k].forEach(x=>{ if(!a[k].includes(x)){ a[k].push(x); ch=true; } }); });
  if((b.sec||0) > (a.sec||0)){ a.sec=b.sec; ch=true; }
  if(b.dr && typeof b.dr==='object'){ if(!a.dr||typeof a.dr!=='object') a.dr={};
    const plein = d => d && typeof d==='object' && Object.keys(d).some(k=>k!=='r' && String(d[k]||'').trim());
    Object.keys(b.dr).forEach(x=>{ if(a.dr[x]==null){ a.dr[x]=b.dr[x]; ch=true; } else if(!plein(a.dr[x]) && plein(b.dr[x])){ Object.assign(a.dr[x], b.dr[x]); ch=true; } }); }
  if(b.test && b.test.submitted && !(a.test && a.test.submitted)){ a.test=b.test; ch=true; }
  Object.keys(b).forEach(k=>{ if(a[k]===undefined){ a[k]=b[k]; ch=true; } });
  return ch;
}
function resync(){
  if(resyncing || !S.booted || !S.me) return resyncing;
  resyncing = (async()=>{
    try{
      const r = await API.call('boot'); if(!r.ok) return;
      const d=r.data, loc = isProf() ? (previewProg||S.prog) : S.prog;
      const avant = JSON.stringify(loc), ch = mergeInto(loc, isProf() ? d.myProg : d.prog);
      if(isProf()){ S.eleves=d.eleves||S.eleves; S.progs=d.progs||S.progs; }
      else if(d.prog){ loc.banc=!!d.prog.banc; loc.atel=d.prog.atel||loc.atel; }
      if(ch){ const y=window.scrollY; render(); window.scrollTo(0,y); }
      if(JSON.stringify(loc)!==avant || ch) save();
    } finally { resyncing=null; }
  })();
  return resyncing;
}
['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev, ()=>{ const idle=Date.now()-lastAct; lastAct=Date.now(); if(idle>=IDLE_MS) resync(); }, { capture:true, passive:true }));
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && Date.now()-lastAct>=IDLE_MS) resync(); });

async function pushProg(){
  clearTimeout(saveTimer); saveTimer=null;
  if(resyncing){ PENDING++; setSync('cours'); try{ await resyncing; } finally { PENDING--; } }   // d'abord la progression des autres onglets
  PENDING++; setSync('cours');
  const taille=JSON.stringify(isProf()||isInvite()?(previewProg||S.prog):S.prog).length;   // le serveur refuse au-delà de 45 000 caractères
  if(taille>40000 && !pushProg.averti){ pushProg.averti=true; toast('Ta progression est presque pleine : préviens ton prof.'); }
  let r;
  if(isProf()||isInvite()) r = await API.call('saveMyProg', { prog: previewProg||S.prog });
  else { r = await API.call('saveProg', { prog: S.prog }); if(r.ok){ S.prog.test.open = r.open || S.prog.test.open; S.prog.banc = r.banc; S.prog.atel = r.atel || {}; } }
  PENDING--;
  if(!r.ok) PEND_ERR = r.msg || 'Non enregistré';
  if(saveTimer || PENDING > 0) setSync('cours'); else setSync(r.ok && !PEND_ERR ? 'ok' : 'err', PEND_ERR);
}
window.addEventListener('beforeunload', ()=>{ if(saveTimer && !LOCAL){ navigator.sendBeacon && navigator.sendBeacon(CONFIG.API_URL, JSON.stringify({ t: (()=>{try{return localStorage.getItem('plateforme-jeton')}catch(e){return null}})(), a:isProf()||isInvite()?'saveMyProg':'saveProg', p:{ prog:isProf()||isInvite()?(previewProg||S.prog):S.prog } })); } });
let SYNC_ST = { st:'ok', msg:'' };
function syncHTML(){ const {st,msg}=SYNC_ST;
  const txt = st==='ok' ? '✓ enregistré' : st==='cours' ? `⏳ enregistrement…${PENDING>1?' ('+PENDING+')':''}` : '⚠ non enregistré';
  return `<span class="sync ${st} tiny" id="sync" title="${esc(st==='ok'?'Tout est enregistré':st==='cours'?'Enregistrement en cours : attends le vert avant de fermer':(msg||'Non enregistré'))}">${txt}</span>`; }
/* onglets trop nombreux pour la largeur : ils passent sur une deuxième ligne au lieu d'être cachés */
function fitTabs(){ const t=$('#top .topbar-in'), n=t&&t.querySelector('.tabs'); if(!n) return; t.classList.remove('wrapnav'); if(n.scrollWidth>n.clientWidth+2) t.classList.add('wrapnav'); }
window.addEventListener('resize', ()=>{ clearTimeout(fitTabs.t); fitTabs.t=setTimeout(fitTabs,150); });
function setSync(st,msg){ SYNC_ST={ st, msg:msg||'' }; const el=$('#sync'); if(el) el.outerHTML=syncHTML(); }

/* ---------- élèves (vue prof) ---------- */
function elevesOf(cl){ const ct=!!(CLASSES.find(x=>x.id===cl)||{}).ct; return Object.keys(S.eleves).map(m=>Object.assign({mail:m},S.eleves[m])).filter(e=>ct? e.ct===cl : e.classe===cl).sort((a,b)=>a.nom.localeCompare(b.nom,'fr')); }
function nomEl(mail){ return (S.eleves[mail]||{}).nom || (S.me && S.me.mail===mail ? S.me.nom : String(mail).split('@')[0]); }
function progOf(mail){ return normProg(S.progs[mail]); }
function withProg(prog, fn){ const k=S.prog; S.prog=prog; try { return fn(); } finally { S.prog=k; } }

/* ---------- démarrage ---------- */
async function boot(){
  const r = await API.call('boot');
  if(!r.ok){ S.error=r.msg; S.booted=false; render(); return; }
  const d=r.data; S.me=d.me; ME=d.me.nom; S.booted=true; S.error=null;
  S.modes=Object.assign({}, ...CLASSES.map(c=>({[c.id]:c.mode})), d.modes||{});
  AFFECT=d.affect||[]; S.bilans=d.bilans||[]; S.bilanouv=d.bilanouv||{}; S.pdfs=d.pdfs||{}; S.fcor=d.fcor||[]; S.ouv=d.ouv||{};
  S.stage.periodes = d.stage.periodes || JSON.parse(JSON.stringify(STAGE_PER_DEF));
  S.stage.lieux = d.stage.lieux || [];
  if(isInvite()){
    S.role='eleve'; S.eleveClass = S.eleveClass || '4eqmm';
    previewProg = normProg(d.myProg); S.prog = previewProg;
    if(!['presentation','cours','biblio','outils'].includes(S.tab)) S.tab='presentation';
  } else if(S.me.role==='eleve'){
    S.role='eleve'; S.eleveClass=S.me.classe; S.prog=normProg(d.prog);
    S.stage.mine=d.stage.mine||{}; S.stage.tel={ [S.me.mail]: d.stage.tel||'' };
    S.stage.journal={}; Object.keys(d.stage.journal||{}).forEach(per=>S.stage.journal[ck(per,S.me.mail)]=d.stage.journal[per]);
    S.stage.aff={}; Object.keys(S.stage.mine).forEach(per=>S.stage.aff[per]={ [S.me.mail]: S.stage.mine[per] });
  } else {
    S.role='prof'; S.eleves=d.eleves||{}; S.progs=d.progs||{};
    S.access={ profs:d.profs||[], open:d.access.open, blocked:d.access.blocked||[] };
    S.carnet.periodes = d.periodes || JSON.parse(JSON.stringify(PERIODES_DEF));
    S.carnet.evals = d.evals||{}; S.notes=d.notes||{}; S.carnet.som=d.som||{}; S.signal=d.signal||[];
    S.stage.aff=d.stage.aff||{}; S.stage.tel=d.stage.tel||{}; S.stage.journal=d.stage.journal||{}; S.invites=d.invites||[];
    S.eleveClass = S.eleveClass || '4eqmm';
    previewProg = normProg(d.myProg); S.prog = previewProg;   // une seule progression pour le prof, en vue prof et en aperçu élève
    if(S.tab==='cours') S.tab='dash';
  }
  render();
}
async function refresh(){ await boot(); toast('Données mises à jour'); }

/* ---------- petits outils d'interface ---------- */
const fil = id => FILIERES.find(f=>f.id===id);
/* « 4EQEM », mais « 3QEM » (le code de la 3QEM contient déjà l'année) */
const clsCode = (filId, annee) => { const c=(fil(filId)||{code:filId}).code; return /^\d/.test(c)?c:annee+c; };
const cls = id => CLASSES.find(c=>c.id===id) || { id, nom:id, annee:0, fil:'' };
const coursFor = (filId, annee) => COURS.filter(c=>c.pour.some(([f,a])=>f===filId && a===annee));
const TYPE = { elec:{l:'Électricité',c:'var(--elec)',chip:'elec'}, meca:{l:'Mécanique',c:'var(--meca)',chip:'meca'}, tp:{l:'Pratique',c:'var(--tp)',chip:'tp'} };
function statutChip(c){
  if(c.statut==='demo') return `<span class="chip ok"><span class="dot"></span>${c.chip||'Chapitre 2.3 en ligne + PDF'}</span>`;
  if(c.statut==='demo-tp') return `<span class="chip ok"><span class="dot"></span>Feu vert TP É03</span>`;
  if(c.statut==='app') return `<span class="chip ok"><span class="dot"></span>${esc((MODULES[c.module]||{}).t||'App')} ↗</span>`;
  if(S.pdfs[c.id]) return `<span class="chip elec"><span class="dot"></span>PDF disponible</span>`;
  return `<span class="chip"><span class="dot"></span>Contenu en préparation</span>`;
}
function toast(msg){ document.querySelectorAll('.toast').forEach(x=>x.remove()); const t=document.createElement('div'); t.className='toast fade-in'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2600); }
function modal(title, body, opts={}){
  closeModal();
  const bg=document.createElement('div'); bg.className='modal-bg'; bg.id='modal';
  bg.innerHTML=`<div class="modal ${opts.wide?'wide':''}" role="dialog" aria-label="${esc(title)}"><div class="modal-h"><h3>${title}</h3><div class="row">${opts.actions||''}<button class="btn sm ghost" data-close aria-label="Fermer">✕</button></div></div><div class="modal-b">${body}</div></div>`;
  bg.addEventListener('click',e=>{ if(e.target===bg || e.target.closest('[data-close]')) closeModal(); });
  document.body.appendChild(bg);
  return bg;
}
function closeModal(){ const m=$('#modal'); if(m) m.remove(); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

/* ---------- PDF ---------- */
let PDF_URL=null;
function pdfUrl(key){
  if(key && S.pdfs[key]) return S.pdfs[key].url;
  if(key && key!=='4-elec' && COURS.some(c=>c.id===key)) return null;   // un autre cours : seulement son propre PDF
  if(S.pdfs['4-elec']) return S.pdfs['4-elec'].url;
  if(S.role==='prof' && CONFIG.PDF_ELEC4_PROF) return CONFIG.PDF_ELEC4_PROF;   // version avec corrigés (pas en aperçu élève)
  if(CONFIG.PDF_ELEC4) return CONFIG.PDF_ELEC4;
  if(!PDF_URL && typeof PDF_B64!=='undefined' && PDF_B64){
    const bin=atob(PDF_B64); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    PDF_URL=URL.createObjectURL(new Blob([u],{type:'application/pdf'}));
  }
  return PDF_URL;
}
function openPdf(page, key, title){
  const url=pdfUrl(key); if(!url){ toast('PDF pas encore lié : un prof peut l’ajouter dans la Bibliothèque'); return; }
  if(!url.startsWith('blob:')){ window.open(url,'_blank','noopener'); if(page) toast(`Va à la page ${page} du PDF`); return; }
  const full = url + (page?'#page='+page:'');
  modal(title||'Cours d’Électricité — 4e année' + (page?` · page ${page}`:''), `<iframe src="${full}" title="PDF"></iframe>`,
    {wide:true, actions:`<a class="btn sm" href="${full}" target="_blank" rel="noopener">Nouvel onglet</a>`});
}

/* ---------- évaluations formatives + corrigés (contenu servi par le serveur, jamais dans le code public) ---------- */
function fcorOpen(ch){
  const x=(S.fcor||[]).find(f=>f.ch===ch); if(!x) return false;
  if(S.role==='prof') return true;
  if(isProf()) return ch==='2.3' && !!(S.prog&&S.prog.test&&S.prog.test.submitted);   // aperçu élève : comme un élève qui débute
  return x.ok;
}
function fcorBlock(){
  const L=S.fcor||[]; if(!L.length) return '';
  const prof=S.role==='prof', nOk=L.filter(f=>fcorOpen(f.ch)).length;
  return `<div class="uaa"><h3>Évaluations formatives et corrigés <span class="tiny" style="font-weight:600">· ${prof?'les élèves voient chaque corrigé quand leur évaluation est terminée':`${nOk}/${L.length} disponible${nOk>1?'s':''}`}</span></h3>
    ${prof?'':`<p class="small muted" style="margin:0 0 8px">Quand ton évaluation d'un chapitre est terminée (corrigée par ton prof, ou passée ici dans la plateforme), tu peux relire les questions et le corrigé, avec les points du cours à revoir.</p>`}
    <div class="chapters">${L.map(f=>{ const o=fcorOpen(f.ch);
      return `<div class="chap ${o?'avail':''}"><span class="num">${f.ch}</span><div class="ti"><b>${esc(f.titre||'')}</b>${o?'':'<span class="tiny muted">🔒 s’ouvre quand ton évaluation est terminée</span>'}</div>
        ${o?`<button class="btn sm${prof?'':' primary'}" data-fcor="${f.ch}">Évaluation et corrigé</button>`:'<span class="chip">🔒</span>'}</div>`; }).join('')}</div></div>`;
}
async function openFcor(ch){
  if(!fcorOpen(ch)){ toast('Le corrigé s’ouvrira quand ton évaluation '+ch+' sera terminée'); return; }
  const r=await act('fcor',{ch}); if(!r) return;
  const f=r.fcor, fmt=t=>esc(t||'').replace(/^(\d+\. \([^)]*\) — revoir [^\n]*)$/gm,'<b>$1</b>').replace(/^(\d+\. )/gm,'<b>$1</b>');
  modal(`Évaluation formative ${esc(f.ch)} — ${esc(f.titre||'')}`,
    `<div class="note" style="margin-top:0">${S.role==='prof'?'<b>Vue prof.</b>Un élève voit cette page quand son évaluation '+esc(f.ch)+' est terminée.':'<b>Ton évaluation est terminée.</b>Compare tes réponses au corrigé. Une réponse équivalente sur le fond est acceptée, pas seulement la formulation exacte.'}</div>
     <h3 style="margin:14px 0 6px">Les questions</h3><div class="small" style="white-space:pre-wrap;line-height:1.55">${fmt(f.ev)}</div>
     <h3 style="margin:18px 0 6px">Le corrigé</h3><div class="small" style="white-space:pre-wrap;line-height:1.55">${fmt(f.cor)}</div>`);
}

/* ---------- navigation ---------- */
function go(tab, view){ S.tab=tab; S.view = view || {page:'home'}; render(); window.scrollTo(0,0); }
function openCourse(id){
  const c=COURS.find(x=>x.id===id);
  const viewTab = S.role==='prof'?'contenus':'cours';
  if(c.statut==='demo'){ S.tab=viewTab; S.view={page:'course',course:id}; render(); window.scrollTo(0,0); return; }
  if(c.statut==='demo-tp'){ S.tab=viewTab; S.view={page:'tp',course:id}; render(); window.scrollTo(0,0); return; }
  if(c.statut==='app'){ openApp(c.module); return; }   // ouvre l'app (connexion automatique), dans un nouvel onglet
  const filtxt = c.pour.map(([f,a])=>clsCode(f,a)).join(' · ');
  modal(esc(c.titre), `<p class="muted small">${filtxt}${c.per?` · ${c.per} périodes/semaine`:''}</p>
    <p>Ce cours fait partie de la plateforme : son contenu arrivera chapitre par chapitre.${S.pdfs[c.id]?' Le PDF est déjà disponible dans la Bibliothèque.':''}</p>`);
}
function openCap(cap){ const och=chapOf(cap); if(S.role==='eleve' && och && !chapOpen(och.num)){ toast(och.course==='4-elec'?'Ce chapitre n’est pas encore ouvert : ton prof l’ouvrira au moment du TP.':'Ce chapitre n’est pas encore ouvert : ton prof l’ouvrira quand vous y arriverez en classe.'); return; }
  if(S.tab!=='cours' && S.tab!=='contenus') S.tab = S.role==='prof'?'contenus':'cours';
  S.view={page:'player',course:och?och.course:'4-elec',cap}; if(!S.prog.visited.includes(cap) && capById(cap)){ S.prog.visited.push(cap); save(); } render(); window.scrollTo(0,0); }

/* =========================================================
   RENDU
   ========================================================= */
function render(){
  if(!S.booted){ renderLogin(); return; }
  if(S.me.role==='eleve' && !S.me.classe){ renderChooseClass(); return; }
  const tabs = isInvite() ? [['presentation','Accueil'],['cours','Les cours'],['biblio','Bibliothèque'],['outils','Outils']]
    : S.role==='eleve'
    ? [['presentation','Accueil'],['cours','Mes cours'],['monstage','Mon stage'],['biblio','Bibliothèque'],['outils','Outils']]
    : [['presentation','Accueil'],['agenda','Agenda'],['dash','Suivi'],['carnet','Cotes'],['stages','Stages'],['contenus','Contenus'],['biblio','Bibliothèque'],['outils','Outils']].concat(isCoord()?[['acces','Accès'],['admin','Admin']]:[]).concat(typeof histOk==='function'&&histOk()?[['histo','Historique']]:[]);
  if(S.view.page==='journal') S.tab = S.role==='prof'?'stages':'monstage';
  if(!tabs.some(t=>t[0]===S.tab)) S.tab='presentation';
  const ini = S.me.nom.split(/[\s.]+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const sub = isInvite() ? (S.me.org||'invité') : S.me.role==='eleve' ? cls(S.me.classe).nom+(S.me.ct?' · '+cls(S.me.ct).nom.replace('3QEM ',''):'') : (isCoord()?'coordinateur':'professeur');
  $('#top').innerHTML = `<div class="topbar-in">
    <div class="brand"><div class="brand-mark"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#fff"/></svg></div><div>Plateforme technique<small>${esc(CONFIG.ECOLE)}</small></div></div>
    ${LOCAL?'<span class="demo-badge" title="Les données restent dans ce navigateur">test local</span>':''}
    <nav class="tabs">${tabs.map(([k,l])=>`<button class="tab ${S.tab===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</nav>
    <div class="spacer"></div>
    ${syncHTML()}
    ${isProf()?`<div class="role-switch" role="group" aria-label="Changer de vue"><button class="${S.role==='prof'?'on':''}" data-role="prof">Prof</button><button class="${S.role==='eleve'?'on':''}" data-role="eleve" title="Faire les capsules comme un élève : ta progression est gardée pour toi seul, hors suivi et carnet, et repart à zéro chaque année scolaire">Aperçu élève</button></div>`:''}
    <button class="who" data-menu title="Mon compte" style="border:0;background:none;cursor:pointer"><div class="avatar">${ini}</div><div style="text-align:left"><b>${esc(S.me.nom)}</b><div class="tiny muted">${esc(sub)}</div></div></button>
  </div>`;
  fitTabs();
  $('#top').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>go(b.dataset.tab));
  $('#top').querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{
    S.role=b.dataset.role;
    S.prog=previewProg||S.prog; if(S.role==='eleve'){ S.tab='cours'; } else { S.tab='dash'; }
    S.view={page:'home'}; render(); });
  $('#top').querySelector('[data-menu]').onclick=()=>{ const md=modal('Mon compte', `<p><b>${esc(S.me.nom)}</b><br><span class="small muted">${isInvite()?'Accès invité · consultation des cours et des outils':esc(S.me.mail)}</span></p>
      <div class="row wrap"><button class="btn" data-refresh>↻ Recharger les données</button><button class="btn" data-logout>Se déconnecter</button>${LOCAL?'<button class="btn ghost" data-reset>Effacer les données de test</button>':''}</div>`);
    md.querySelector('[data-logout]').onclick=()=>API.logout();
    md.querySelector('[data-refresh]').onclick=()=>{ closeModal(); refresh(); };
    const rs=md.querySelector('[data-reset]'); if(rs) rs.onclick=()=>{ if(confirm('Effacer toutes les données de test de ce navigateur ?')){ API.resetLocal(); API.logout(); } };
  };
  const m=$('#main');
  const pages = { presentation:pagePresentation, cours:pageCours, monstage:pageMonStage, biblio:pageBiblio, outils:pageOutils, dash:pageDash, contenus:pageContenus, admin:pageAdmin, carnet:pageCarnet, acces:pageAcces, stages:pageStages, agenda:pageAgenda, histo:pageHisto };
  if(S.view.page==='journal'){ m.innerHTML=pageJournal(); bindCommon(m); bindJournal(m); return; }
  if((S.tab==='cours'||S.tab==='contenus') && S.view.page!=='home'){
    if(S.view.page==='course') m.innerHTML=pageCourse();
    else if(S.view.page==='player') { m.innerHTML=pagePlayer(); afterPlayer(); return; }
    else if(S.view.page==='tp') m.innerHTML=pageTP();
    else if(S.view.page==='bilan') { m.innerHTML=pageBilan(); bindCommon(m); bindBilan(m); return; }
  } else m.innerHTML = pages[S.tab]();
  bindCommon(m);
}
function bindCommon(m){
  m.querySelectorAll('[data-open-course]').forEach(b=>b.onclick=()=>openCourse(b.dataset.openCourse));
  m.querySelectorAll('[data-pdf]').forEach(b=>b.onclick=()=>openPdf(+b.dataset.pdf||null, b.dataset.pdfkey||null, b.dataset.pdftitle||null));
  m.querySelectorAll('[data-pdfurl]').forEach(b=>b.onclick=()=>window.open(b.dataset.pdfurl,'_blank','noopener'));
  m.querySelectorAll('[data-formulaire]').forEach(b=>b.onclick=()=>openFormulaire(b.dataset.formulaire));
  m.querySelectorAll('[data-fcor]').forEach(b=>b.onclick=()=>openFcor(b.dataset.fcor));
  m.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  m.querySelectorAll('[data-cap]').forEach(b=>b.onclick=()=>openCap(b.dataset.cap));
  m.querySelectorAll('[data-bilan]').forEach(b=>b.onclick=()=>openBilan(b.dataset.bilan));
  m.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{ const v=b.dataset.back; S.view = v==='home'?{page:'home'}:{page:v,course:S.view.course||'4-elec'}; render(); window.scrollTo(0,0); });
  m.querySelectorAll('[data-module]').forEach(b=>b.onclick=()=>moduleInfo(b.dataset.module));
  m.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>openApp(b.dataset.app, b.dataset.defi?{defi:b.dataset.defi}:{}));
  m.querySelectorAll('[data-journal]').forEach(b=>b.onclick=()=>{ const [per,...st]=b.dataset.journal.split('|'); openJournal(per, st.join('|')||S.me.mail); });
  const pageHooks = { cours:bindCours, biblio:bindBiblio, dash:bindDash, contenus:bindContenus, admin:bindAdmin, carnet:bindCarnet, acces:bindAcces, stages:bindStages, monstage:bindMonStage, agenda:bindAgenda, histo:bindHisto };
  if(S.view.page==='home' && pageHooks[S.tab]) pageHooks[S.tab](m);
  if(S.view.page==='tp') bindTP(m);
}

/* ---------------- Connexion ---------------- */
function renderLogin(){
  $('#top').innerHTML='';
  $('#main').innerHTML=`<div style="max-width:440px;margin:7vh auto 0">
    <div class="brand" style="justify-content:center;margin-bottom:22px"><div class="brand-mark" style="width:44px;height:44px"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#fff"/></svg></div><div style="font-size:20px">Plateforme technique<small style="display:block">${esc(CONFIG.ECOLE)}</small></div></div>
    <div class="card pad" style="padding:26px">
      <h2 style="margin-bottom:6px">Connexion</h2><p class="small muted">Avec ton compte Google de l'école (@${PLAT.DOMAIN}).</p>
      ${S.error?`<div class="note bad" style="margin:12px 0"><b>Accès refusé</b>${esc(S.error)}</div>`:''}
      ${LOCAL?`<div class="note warn" style="margin:12px 0"><b>Mode test local</b>Le serveur n'est pas encore configuré : tu peux essayer avec n'importe quelle adresse @${PLAT.DOMAIN}. Tout reste dans ce navigateur.</div>
        <label class="small" style="display:block;margin:14px 0 6px;font-weight:650">Adresse de l'école</label>
        <input type="text" id="lmail" placeholder="prenom.nom.student@${PLAT.DOMAIN}" style="width:100%">
        <button class="btn primary" id="lgo" style="width:100%;justify-content:center;margin-top:12px">Entrer</button>
        <div class="small muted" style="margin-top:10px">Comptes d'essai : <button class="btn sm ghost" data-try-mail="${PROFS_DEF[0].mail}">coordinateur</button> <button class="btn sm ghost" data-try-mail="eleve.essai.student@${PLAT.DOMAIN}">élève</button></div>`
      :`<button class="btn primary" id="lgo" style="width:100%;justify-content:center;margin-top:12px">Se connecter avec Google</button>
        ${S.error?`<p class="small muted" style="margin-top:10px">Mauvais compte ? Déconnecte-toi de Google dans ce navigateur, puis réessaie.</p>`:''}`}
    </div></div>`;
  const go=()=>{ if(LOCAL){ const v=$('#lmail').value; if(!v.trim()) return; API.loginLocal(v); boot(); } else API.loginGoogle(); };
  $('#lgo').onclick=go; const lm=$('#lmail'); if(lm) lm.onkeydown=e=>{ if(e.key==='Enter') go(); };
  document.querySelectorAll('[data-try-mail]').forEach(b=>b.onclick=()=>{ API.loginLocal(b.dataset.tryMail); boot(); });
}
function renderChooseClass(){
  $('#top').innerHTML='';
  $('#main').innerHTML=`<div style="max-width:460px;margin:8vh auto 0" class="card pad">
    <div class="kicker">Première connexion</div><h2 style="margin:4px 0 8px">Bienvenue, ${esc(S.me.nom)}</h2>
    <p class="small">Choisis ta classe. Tu verras ensuite les cours de cette classe. Si tu te trompes, demande à ton professeur de la changer.</p>
    <select id="lclass" style="width:100%;margin:8px 0 14px"><option value="">— ta classe —</option>${CLASSES_ELEVE.map(c=>`<option value="${c.id}">${c.nom}</option>`).join('')}</select>
    <button class="btn primary" id="lok" style="width:100%;justify-content:center">Valider</button></div>`;
  $('#lok').onclick=async()=>{ const v=$('#lclass').value; if(!v){ toast('Choisis ta classe'); return; }
    const r=await act('setClasse',{classe:v}); if(r){ S.me.classe=v; boot(); } };
}

/* ---------------- démarrage ---------------- */
function init(){
  document.body.innerHTML = `<header class="topbar" id="top"></header><main id="main"></main>`;
  loadPrefs(); API.readHash();
  document.body.addEventListener('click',e=>{ const t=e.target.closest('[data-try]'); if(!t) return;
    const k=t.dataset.try;
    if(k==='relais'){ if(isProf()){ S.role='eleve'; S.prog=previewProg||S.prog; } S.tab='cours'; openCap('c1'); }
    if(k==='tp'){ S.tab='cours'; S.view={page:'tp',course:'4eqem-tpe'}; render(); window.scrollTo(0,0); }
    if(k==='dash'||k==='carnet'||k==='stages'){ S.role='prof'; go(k); }
  });
  if(API.hasInvite()) { $('#main').innerHTML='<p class="muted" style="text-align:center;margin-top:20vh">Ouverture de ton invitation…</p>';
    API.useInvite().then(r=>{ if(r && r.ok){ S.tab='presentation'; boot(); } else { S.error=(r&&r.msg)||'Invitation refusée'; render(); } }); }
  else if(API.hasToken()) { $('#main').innerHTML='<p class="muted" style="text-align:center;margin-top:20vh">Chargement…</p>'; boot(); } else render();
  if('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});
}
