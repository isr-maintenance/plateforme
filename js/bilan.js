/* =========================================================
   ÉVALUATIONS EN LIGNE (bilans et formatives, verrouillées)
   Le contenu et les réponses sont sur le serveur (« bilan:<id> »), jamais dans ce code.
   Élève : l'évaluation dans son cours (🔒 tant que le prof n'a pas ouvert), sa copie, la remise,
           puis sa note et le corrigé quand le prof publie. S'il quitte la page, c'est noté et le prof le voit.
   Prof  : dans Suivi, la carte « Évaluations en ligne » : ouvrir / fermer pour sa classe, les copies,
           les sorties de page, la correction (points proposés), la publication. Aperçu depuis la page du cours.
   Types de question (x.kind) : 'texte' (réponse ouverte, corrigée par le prof), sinon tableau en quatre
           colonnes + résultats autocorrigés, avec ou sans dessin à compléter (x.scenes).
   ========================================================= */
const BIL = { cur:null, cop:{}, reps:{}, timer:null, mon:null, poll:null, vus:{} };
const bilTexte = x => x.kind==='texte';
const bilPts = x => x.pts!=null ? +x.pts : 1 + (x.res||[]).length;      // points d'une question : donnés, sinon le dessin + chaque résultat
const bilMax = def => (def.ex||[]).reduce((a,x)=>a+bilPts(x),0);
const bilOkVal = (r, v) => r.ans!=null && okVal(r, v);
const bilNom = def => def.kind==='formative' ? 'Question' : 'Exercice';
const hhmm = t => { const d=new Date(t); return d.toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit'}); };
const dureeTxt = s => s<60 ? `${s} s` : `${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')}`;
/* points proposés : questions ouvertes = au prof ; sinon le dessin juste (1 point) + les résultats justes, ramenés aux points de la question */
function bilAuto(x, d){
  d=d||{}; const pl=d.pl||{}, ids=x.place?Object.keys(x.place):[];
  const plOk = ids.length>0 && ids.every(id=>pl[id]===x.place[id]);
  const rOk = (x.res||[]).map((r,i)=>bilOkVal(r,(d.r||[])[i]));
  if(bilTexte(x)) return { manuel:true, plOk, nPl:0, nIds:0, rOk, pts:null };
  const brut = (ids.length?(plOk?1:0):0) + rOk.filter(Boolean).length, max = (ids.length?1:0) + rOk.length;
  const pts = x.pts!=null && max ? Math.round(bilPts(x)*brut/max*2)/2 : brut;
  return { plOk, nPl: ids.filter(id=>pl[id]===x.place[id]).length, nIds: ids.length, rOk, pts };
}

/* ---------- dans la page du cours ---------- */
function bilanBlock(course){
  const prof=isProf();
  const L=(S.bilans||[]).filter(b=>b.course===course && (prof || b.kind!=='formative' || b.open || b.remis || b.pub))
    .sort((a,b)=>String(a.ch||a.id).localeCompare(String(b.ch||b.id),'fr',{numeric:true}));
  if(!L.length) return '';
  return `<div class="uaa"><h3>${L.every(b=>b.kind==='formative')?'Évaluations formatives en ligne':'Évaluations en ligne'}</h3><div class="chapters">${L.map(b=>{
    if(prof) return `<div class="chap avail"><span class="num">📝</span><div class="ti"><b>${esc(b.titre)}</b><span class="tiny muted">Tu l’ouvres pour ta classe dans Suivi. Les élèves ne voient rien avant.</span></div><button class="btn sm" data-bilan="${esc(b.id)}">Aperçu</button></div>`;
    const st = b.pub?`<span class="chip ok">✓ corrigé</span>`:b.remis?`<span class="chip">remis · en correction</span>`:b.open?`<span class="chip elec">ouvert</span>`:`<span class="chip warn">🔒 verrouillé</span>`;
    return `<div class="chap ${b.open||b.pub?'avail':'locked'}"><span class="num">📝</span><div class="ti"><b>${esc(b.titre)}</b><span class="tiny muted">${b.open||b.pub?'':'Ton prof l’ouvrira le moment venu.'}</span></div>${st}${b.open||b.pub?`<button class="btn sm primary" data-bilan="${esc(b.id)}">${b.pub?'Voir ma note':b.remis?'Voir ma copie':'Commencer'}</button>`:''}</div>`; }).join('')}</div></div>`;
}
function openBilan(id){ const b=(S.bilans||[]).find(x=>x.id===id)||{}; BIL.cur=null; S.tab=isProf()?'contenus':'cours'; S.view={page:'bilan', id, course:b.course||S.view.course}; render(); window.scrollTo(0,0); loadBilan(id); }
async function loadBilan(id){
  const prof=isProf();
  const r = await API.call(prof?'bilanCopies':'bilan', {id});
  if(!r.ok){ BIL.cur={ id, err:r.msg||'Évaluation indisponible' }; }
  else BIL.cur = prof ? { id, def:r.def, rep:{d:{}, remis:0, pub:0}, apercu:true } : { id, def:r.def, rep:r.rep };
  if(S.view.page==='bilan' && S.view.id===id){ const y=window.scrollY; render(); window.scrollTo(0,y); }
}

/* ---------- la copie (élève) ou l'aperçu (prof) ---------- */
function pageBilan(){
  const id=S.view.id, B=BIL.cur, back=`<div class="crumbs"><button data-back="course">← Retour au cours</button></div>`;
  if(!B || B.id!==id) return back+`<div class="card pad"><p class="muted" style="margin:0">Chargement…</p></div>`;
  if(B.err) return back+`<div class="card pad"><h3>🔒 ${esc(B.err)}</h3></div>`;
  const def=B.def, rep=B.rep, ro=!!(rep.remis||rep.pub||B.apercu), pub=!!rep.pub, note=rep.note||null, show=pub||B.apercu;
  const parts=[]; (def.ex||[]).forEach((x,i)=>{ const p=x.part||''; if(!parts.length||parts[parts.length-1].t!==p) parts.push({t:p, ex:[]}); parts[parts.length-1].ex.push(i); });
  const exHTML=i=>{ const x=def.ex[i], d=(rep.d||{})[i]||{}, max=bilPts(x);
    const pts=note&&note.pts?note.pts[i]:null;
    const head=`<div class="row between wrap" style="gap:8px"><div class="row" style="gap:8px"><span class="exn">${i+1}</span><b>${bilNom(def)} ${i+1}</b></div>
        <span class="chip ${pts!=null?(pts>=max?'ok':'amber'):''}">${pts!=null?`${fr(pts,1)} / ${fr(max,1)}`:`${fr(max,1)} point${max>1?'s':''}`}</span></div><div class="difs-en">${x.enonce}</div>`;
    const cor = show&&x.cor?`<div class="note" style="margin:10px 0 0"><b>Corrigé</b><span style="white-space:pre-wrap">${esc(x.cor)}</span></div>`:'';
    if(bilTexte(x)) return `<div class="bil-ex" data-bex="${i}">${head}
      ${ro?`<div class="mcell ro" style="padding:10px;white-space:pre-wrap">${B.apercu?'<span class="muted tiny">Réponse de l’élève</span>':String(d.s||'').trim()?esc(d.s):'<span class="muted tiny">—</span>'}</div>`
        :`<textarea data-bt="${i}|s" maxlength="1500" rows="5" style="width:100%" placeholder="Ta réponse, en phrases complètes" aria-label="Ta réponse">${esc(d.s||'')}</textarea>`}${cor}</div>`;
    const sch=schemaHTML(x.scenes||[]);
    const res=(x.res||[]).map((r,k)=>{ const v=(d.r||[])[k]||'', good=pub&&r.ans!=null?bilOkVal(r,v):null;
      return `<div class="drow ${good===true?'good':good===false?'wrong':''}"><span class="dn">${k+1}</span><span class="dq">${esc(r.lbl||'Résultat')}</span>
        <span class="din"><input type="text" inputmode="decimal" data-br="${i}|${k}" value="${esc(B.apercu?'':v)}" ${ro?'disabled':''} aria-label="${esc(r.lbl||'Résultat')}"><span class="u">${esc(r.unit||'')}</span></span>
        ${show&&r.ans!=null?`<span class="dh">Réponse : ${frN(r.ans)} ${esc(r.unit||'')}</span>`:''}</div>`; }).join('');
    return `<div class="bil-ex" data-bex="${i}">${head}
      ${(x.scenes||[]).length?`${sch.html}<p class="small" style="margin:6px 0">Indique les données et l’inconnue sur le dessin : pour chaque numéro, choisis ce qui va à cet endroit.</p>
        ${placeSelects('bil|'+def.id+'|'+i, sch.ids, x.tokens||[], (B.apercu?x.place:d.pl)||{}, {place:x.place||{}, check:show&&!!x.place, ro, show:show&&!!x.place})}`:''}
      <div class="difs ${ro?'done':''}" style="margin-top:10px">${DIFS_COLS.map(([c,l,ph])=>`<div class="difs-col"><div class="difs-h">${l}</div><div class="mcell ${ro?'ro':''}">${ro?'':`<textarea data-bt="${i}|${c}" maxlength="400" rows="4" placeholder="${esc(ph)}" spellcheck="false" aria-label="${l}">${esc(d[c]||'')}</textarea>`}<div class="mview" data-bv="${i}|${c}">${String(d[c]||'').trim()?fmath(d[c]):`<span class="muted tiny">${ro?'—':''}</span>`}</div></div></div>`).join('')}</div>
      ${res?`<div class="difs-res"><div class="tiny muted" style="margin:6px 0">${ro?'Tes résultats':'Recopie ici tes résultats finaux, avec l’unité attendue.'}</div><div class="drill">${res}</div></div>`:''}${cor}</div>`; };
  const so=rep.sorties||[];
  const head=`${back}<div class="page-head"><div><div class="kicker">${B.apercu?'Aperçu du prof · avec les réponses':def.kind==='formative'?'Évaluation formative':'Bilan'}</div><h1>${esc(def.titre)}</h1>${def.sous?`<p class="muted small" style="margin-top:4px">${esc(def.sous)}</p>`:''}</div>
      <div class="row wrap"><button class="btn" data-formulaire="${esc(def.course||'')}">📐 Formulaire</button>${!ro&&document.fullscreenEnabled?`<button class="btn" data-bfull>⛶ Plein écran</button>`:''}</div></div>
    ${pub?`<div class="card pad" style="margin-bottom:14px;border-color:var(--ok)"><h3 style="margin:0">Ta note : ${fr(Object.values((note&&note.pts)||{}).reduce((a,b)=>a+(+b||0),0),1)} / ${fr(bilMax(def),1)}</h3>${note&&note.com?`<p style="margin:6px 0 0">${esc(note.com)}</p>`:''}<p class="tiny muted" style="margin:6px 0 0">Corrigé par ${esc(note&&note.by||'ton prof')}. Le corrigé est affiché sous chaque ${bilNom(def).toLowerCase()}.</p></div>`
      :rep.remis&&!B.apercu?`<div class="note" style="margin-top:0"><b>Copie remise</b>Ton prof la corrige. Tu verras ta note ici quand il l’aura publiée.</div>`
      :B.apercu?`<div class="note" style="margin-top:0"><b>Aperçu</b>Voici l’évaluation telle que les élèves la verront, avec les réponses${(def.ex||[]).some(x=>x.cor)?' et le corrigé':''}. Ouvre-la pour ta classe dans Suivi.</div>`
      :`<div class="note" style="margin-top:0"><b>Consignes</b>${def.consignes||'Pour chaque question : la ou les formules, le calcul et la réponse, sans oublier les unités.'} Ta copie s’enregistre au fur et à mesure. Quand tu as fini, remets-la : tu ne pourras plus la modifier.<br><b>Reste sur cette page</b> jusqu’à la remise : si tu la quittes (autre onglet, autre application), c’est noté et ton prof le voit.</div>`}
    ${!B.apercu&&so.length?`<div class="note bad" style="margin-top:8px"><b>Tu as quitté la page ${so.length} fois</b>${so.map(x=>`${hhmm(x.t)} (${dureeTxt(x.dur||0)})`).join(' · ')} — ton prof le voit.</div>`:''}`;
  const body=parts.map(p=>`${p.t?`<h2 style="margin:18px 0 8px">${esc(p.t)}</h2>`:''}${p.ex.map(exHTML).join('')}`).join('');
  const foot = ro ? '' : `<div class="card pad row between wrap" style="gap:10px"><span class="small muted" data-bsave>Enregistré au fur et à mesure.</span><span class="row" style="gap:8px"><button class="btn primary" data-bremet>Remettre ma copie</button></span></div>`;
  return head+body+foot;
}
/* surveillance : quitter la page (onglet caché, fenêtre quittée, sortie du plein écran) pendant une copie ouverte */
function bilanSurveiller(){
  if(BIL.mon) return;
  const actif = () => S.view.page==='bilan' && BIL.cur && BIL.cur.def && !BIL.cur.apercu && !BIL.cur.rep.remis && !BIL.cur.rep.pub;
  const sortie = quoi => { if(!actif() || BIL.out) return; BIL.out={t:Date.now(), quoi}; };
  const retour = () => { const o=BIL.out; if(!o) return; BIL.out=null; if(!actif()) return;
    const dur=Math.round((Date.now()-o.t)/1000); if(o.quoi==='fenêtre' && dur<2) return;     // un clic hors de la page, aussitôt revenu : on ignore
    const s={t:o.t, dur, quoi:o.quoi}; const R=BIL.cur.rep; R.sorties=(R.sorties||[]).concat([s]);
    act('bilanSave',{id:BIL.cur.id, sortie:s}); toast('Sortie de la page notée : ton prof le verra');
    const y=window.scrollY; render(); window.scrollTo(0,y); };
  BIL.mon = {
    vis:()=>{ if(document.visibilityState==='hidden') sortie('onglet'); else retour(); },
    blur:()=>sortie('fenêtre'), focus:()=>retour(),
    fs:()=>{ if(!document.fullscreenElement && BIL.plein){ BIL.plein=false; if(actif()){ const s={t:Date.now(), dur:0, quoi:'plein écran'}; const R=BIL.cur.rep; R.sorties=(R.sorties||[]).concat([s]); act('bilanSave',{id:BIL.cur.id, sortie:s}); const y=window.scrollY; render(); window.scrollTo(0,y); } } else if(document.fullscreenElement) BIL.plein=true; },
  };
  document.addEventListener('visibilitychange', BIL.mon.vis); window.addEventListener('blur', BIL.mon.blur); window.addEventListener('focus', BIL.mon.focus); document.addEventListener('fullscreenchange', BIL.mon.fs);
}
function bindBilan(m){
  const B=BIL.cur; if(!B||!B.def||B.apercu) return;
  const rep=B.rep; if(rep.remis||rep.pub) return;
  bilanSurveiller();
  const D=rep.d||(rep.d={});
  const ex=i=>D[i]||(D[i]={d:'',i:'',f:'',s:'',r:[],pl:{}});
  const later=()=>{ clearTimeout(BIL.timer); const s=m.querySelector('[data-bsave]'); if(s) s.textContent='Modifications en attente…';
    BIL.timer=setTimeout(async()=>{ const r=await act('bilanSave',{id:B.id, d:D}); const s2=m.querySelector('[data-bsave]'); if(s2) s2.textContent=r?'Enregistré.':'Non enregistré : vérifie ta connexion.'; }, 1500); };
  m.querySelectorAll('[data-bt]').forEach(t=>{ const [i,c]=t.dataset.bt.split('|'); t.oninput=()=>{ ex(i)[c]=t.value; const v=m.querySelector(`[data-bv="${i}|${c}"]`); if(v) v.innerHTML=t.value.trim()?fmath(t.value):''; later(); }; });
  m.querySelectorAll('[data-br]').forEach(t=>{ const [i,k]=t.dataset.br.split('|'); t.oninput=()=>{ const e=ex(i); e.r=e.r||[]; e.r[+k]=t.value; later(); }; });
  m.querySelectorAll('[data-bex]').forEach(box=>{ const i=box.dataset.bex; box.querySelectorAll('[data-pl]').forEach(s=>s.onchange=()=>{ const e=ex(i); e.pl=e.pl||{}; if(s.value==='') delete e.pl[s.dataset.pl]; else e.pl[s.dataset.pl]=+s.value; later(); }); });
  const fsb=m.querySelector('[data-bfull]'); if(fsb) fsb.onclick=()=>{ document.documentElement.requestFullscreen().then(()=>{ BIL.plein=true; }).catch(()=>toast('Le plein écran n’est pas disponible ici')); };
  const rb=m.querySelector('[data-bremet]'); if(rb) rb.onclick=async()=>{
    if(!rb.dataset.sure){ rb.dataset.sure='1'; rb.textContent='Confirmer : je remets ma copie'; rb.classList.add('danger'); setTimeout(()=>{ if(rb.isConnected){ delete rb.dataset.sure; rb.textContent='Remettre ma copie'; rb.classList.remove('danger'); } },6000); return; }
    clearTimeout(BIL.timer); rb.disabled=true;
    const r=await act('bilanSave',{id:B.id, d:D, remettre:true});
    if(!r){ rb.disabled=false; return; }
    rep.remis=r.remis||Date.now(); const b=(S.bilans||[]).find(x=>x.id===B.id); if(b) b.remis=rep.remis;
    if(document.fullscreenElement){ BIL.plein=false; document.exitFullscreen().catch(()=>{}); }
    toast('Copie remise'); render(); window.scrollTo(0,0);
  };
}

/* ---------- Suivi (prof) : la carte « Évaluations en ligne » ---------- */
function bilChargerReps(co){
  if(BIL.reps['_'+co]) return; BIL.reps['_'+co]=1;
  act('bilanReps',{course:co}).then(r=>{ delete BIL.reps['_'+co]; if(!r) return;
    const avant=BIL.reps[co]; BIL.reps[co]=r.reps||{};
    Object.keys(BIL.reps[co]).forEach(id=>{ if(BIL.cop[id]) BIL.cop[id].reps=BIL.reps[co][id];
      Object.keys(BIL.reps[co][id]).forEach(mail=>{ const n=(BIL.reps[co][id][mail].sorties||[]).length, k=id+'|'+mail, vu=BIL.vus[k];
        if(avant && vu!=null && n>vu){ const b=(S.bilans||[]).find(x=>x.id===id)||{}; toast(`⚠ ${nomEl(mail)} a quitté la page (${b.titre||id})`); }
        BIL.vus[k]=n; }); });
    if(JSON.stringify(avant)!==JSON.stringify(BIL.reps[co]) && ['dash','carnet'].includes(S.tab)){ const y=window.scrollY; render(); window.scrollTo(0,y); } });
}
function bilanDash(cl, co, studs){
  const L=(S.bilans||[]).filter(b=>b.course===co).sort((a,b)=>String(a.ch||a.id).localeCompare(String(b.ch||b.id),'fr',{numeric:true}));
  if(!L.length) return '';
  const R=BIL.reps[co]; if(!R) bilChargerReps(co);
  const mails=studs.map(s=>s.mail);
  const lignes=L.map(b=>{ const open=!!(S.bilanouv||{})[b.id+'|'+cl], reps=(R&&R[b.id])||{}, mine=mails.filter(m=>reps[m]);
    const nRem=mine.filter(m=>reps[m].remis).length, nCor=mine.filter(m=>reps[m].remis&&!reps[m].note).length, nNonPub=mine.filter(m=>reps[m].note&&!reps[m].pub).length, nSort=mine.reduce((a,m)=>a+(reps[m].sorties||[]).length,0);
    const exp=BIL.exp===b.id;
    return `<tr class="${open?'mine':''}"><td><b>${esc(b.titre)}</b></td><td>${open?'<span class="cell ok" style="min-width:0">ouvert</span>':'<span class="cell none" style="min-width:0">🔒 verrouillé</span>'}</td>
      <td class="small">${R?`${nRem}/${studs.length} remises${nCor?` · <b style="color:var(--warn)">${nCor} à corriger</b>`:''}${nSort?` · <b style="color:var(--bad)">⚠ ${nSort} sortie${nSort>1?'s':''}</b>`:''}`:'…'}</td>
      <td><div class="row wrap" style="gap:4px;justify-content:flex-end"><button class="btn sm" data-bilan="${esc(b.id)}">Aperçu</button><button class="btn sm" data-bexp="${esc(b.id)}">${exp?'Fermer':'Copies'}</button>${nNonPub?`<button class="btn sm" data-bpuball="${esc(b.id)}">Publier ${nNonPub}</button>`:''}<button class="btn sm ${open?'':'primary'}" data-bouv="${esc(b.id)}|${esc(cl)}|${open?0:1}">${open?'Verrouiller':'Déverrouiller'}</button></div></td></tr>
      ${exp?`<tr><td colspan="4" style="background:var(--surface-2,transparent)">${bilCopiesTable(b, studs, reps)}</td></tr>`:''}`; }).join('');
  return `<div class="card" style="margin-bottom:16px"><div class="pad" style="border-bottom:1px solid var(--line)"><h3 style="margin:0">📝 Évaluations en ligne — ${esc(cls(cl).nom)}</h3>
      <p class="small muted" style="margin:4px 0 0">Déverrouille une évaluation pour la classe le jour où vous la faites. Les sorties de page des élèves (autre onglet, autre application) apparaissent ici en rouge ; la page se met à jour toute seule.</p></div>
    <div class="scroll-x"><table class="t">${lignes}</table></div></div>`;
}
function bilCopiesTable(b, studs, reps){
  const C=BIL.cop[b.id], max=C?bilMax(C.def):null;
  const rows=studs.map(s=>{ const R=reps[s.mail]; const pts=R&&R.note&&R.note.pts?Object.values(R.note.pts).reduce((a,x)=>a+(+x||0),0):null, so=(R&&R.sorties)||[];
    const st=!R?'<span class="cell none">pas commencé</span>':R.pub?`<span class="cell ok">publié</span>`:R.note?`<span class="cell run">corrigé, pas publié</span>`:R.remis?`<span class="cell wait">remis : à corriger</span>`:'<span class="cell run">en cours</span>';
    return `<tr><td>${esc(s.nom)}</td><td>${st}</td><td>${so.length?`<span style="color:var(--bad)" title="${esc(so.map(x=>hhmm(x.t)+' · '+dureeTxt(x.dur||0)+' · '+(x.quoi||'')).join('\n'))}">⚠ ${so.length} · ${so.slice(-2).map(x=>hhmm(x.t)).join(', ')}</span>`:'—'}</td><td>${pts!=null?`<b>${fr(pts,1)}</b>${max!=null?` / ${fr(max,1)}`:''}`:'—'}</td><td>${R?`<button class="btn sm" data-bcor="${esc(b.id)}|${esc(s.mail)}">${R.note?'Revoir':'Corriger'}</button>`:''}</td></tr>`; }).join('');
  return `<table class="t"><tr><th>Élève</th><th>Copie</th><th>Sorties de page</th><th>Note</th><th></th></tr>${rows||'<tr><td colspan="5" class="muted">Aucun élève.</td></tr>'}</table>`;
}
function bindBilanDash(m){
  m.querySelectorAll('[data-bexp]').forEach(b=>b.onclick=()=>{ const id=b.dataset.bexp; BIL.exp = BIL.exp===id?null:id; const y=window.scrollY; render(); window.scrollTo(0,y);
    if(BIL.exp && !BIL.cop[id]) act('bilanCopies',{id}).then(r=>{ if(r){ BIL.cop[id]={def:r.def, reps:r.reps}; const y2=window.scrollY; render(); window.scrollTo(0,y2); } }); });
  m.querySelectorAll('[data-bouv]').forEach(b=>b.onclick=async()=>{ const [id,cl,o]=b.dataset.bouv.split('|'); const k=id+'|'+cl;
    S.bilanouv=S.bilanouv||{}; const avant=S.bilanouv[k]; if(o==='1') S.bilanouv[k]=Date.now(); else delete S.bilanouv[k];
    const y=window.scrollY; render(); window.scrollTo(0,y);
    const r=await act('bilanOuvrir',{id, cl, open:o==='1'}, o==='1'?'Évaluation déverrouillée pour la classe':'Évaluation verrouillée');
    if(!r){ if(avant) S.bilanouv[k]=avant; else delete S.bilanouv[k]; const y2=window.scrollY; render(); window.scrollTo(0,y2); } });
  m.querySelectorAll('[data-bcor]').forEach(b=>b.onclick=async()=>{ const [id,mail]=b.dataset.bcor.split('|');
    if(!BIL.cop[id]){ const r=await act('bilanCopies',{id}); if(!r) return; BIL.cop[id]={def:r.def, reps:r.reps}; }
    corrigerBilan(id, mail); });
  m.querySelectorAll('[data-bpuball]').forEach(b=>b.onclick=async()=>{ const id=b.dataset.bpuball, co=(S.bilans.find(x=>x.id===id)||{}).course, reps=(BIL.reps[co]||{})[id]||{};
    const L=Object.keys(reps).filter(mail=>{ const R=reps[mail]; return R.note&&!R.pub; });
    L.forEach(mail=>{ const R=reps[mail]; R.pub=Date.now(); act('bilanNoter',{id, mail, pts:R.note.pts, com:R.note.com, pub:true}); });
    toast(`${L.length} copie${L.length>1?'s':''} publiée${L.length>1?'s':''}`); const y=window.scrollY; render(); window.scrollTo(0,y); });
  /* une évaluation est ouverte pour cette classe : on relit les copies toutes les 30 secondes (sorties, remises) */
  const [cl,co]=(S.dashKey||'').split('|'), ouvert=(S.bilans||[]).some(b=>b.course===co && (S.bilanouv||{})[b.id+'|'+cl]);
  clearInterval(BIL.poll); BIL.poll=null;
  if(ouvert) BIL.poll=setInterval(()=>{ if(S.tab!=='dash' || S.dashKey!==cl+'|'+co || document.visibilityState!=='visible'){ return; } bilChargerReps(co); }, 30000);
}
function corrigerBilan(id, mail){
  const C=BIL.cop[id]; if(!C) return; const def=C.def, co=def.course, R=((BIL.reps[co]||{})[id]||{})[mail]||C.reps[mail]||{}, note=R.note||{};
  const so=R.sorties||[];
  const ex=(def.ex||[]).map((x,i)=>{ const d=(R.d||{})[i]||{}, a=bilAuto(x,d), max=bilPts(x);
    const pts=note.pts&&note.pts[i]!=null?note.pts[i]:(a.pts!=null?a.pts:'');
    const top=`<div class="row between wrap" style="gap:8px"><b>${bilNom(def)} ${i+1}</b><label class="row small" style="gap:6px">Points <input type="number" min="0" max="${max}" step="0.5" value="${pts}" placeholder="?" data-cpts="${i}" style="width:70px"> / ${fr(max,1)}</label></div>
      <div class="small muted" style="margin:4px 0 8px">${x.enonce}</div>`;
    const cor=x.cor?`<details class="small" style="margin-top:6px" ${bilTexte(x)?'open':''}><summary style="cursor:pointer"><b>Corrigé</b></summary><div style="white-space:pre-wrap;margin-top:4px">${esc(x.cor)}</div></details>`:'';
    if(bilTexte(x)) return `<div class="bil-ex">${top}<div class="mcell ro" style="padding:10px;white-space:pre-wrap">${String(d.s||'').trim()?esc(d.s):'<span class="muted tiny">pas de réponse</span>'}</div>${cor}</div>`;
    const sch=schemaHTML(x.scenes||[]);
    return `<div class="bil-ex">${top}
      ${(x.scenes||[]).length?`<div class="small" style="margin-bottom:4px"><b>Dessin :</b> ${a.nPl}/${a.nIds} emplacements justes</div>${sch.html}${placeSelects('cor|'+i, sch.ids, x.tokens||[], d.pl||{}, {place:x.place||{}, check:true, ro:true, show:true})}`:''}
      <div class="difs done" style="margin-top:8px">${DIFS_COLS.map(([c,l])=>`<div class="difs-col"><div class="difs-h">${l}</div><div class="mcell ro"><div class="mview">${String(d[c]||'').trim()?fmath(d[c]):'<span class="muted tiny">vide</span>'}</div></div></div>`).join('')}</div>
      <div class="small" style="margin-top:6px">${(x.res||[]).map((r,k)=>{ const v=(d.r||[])[k]||''; return `${esc(r.lbl)} : <b style="color:${v===''?'var(--muted)':a.rOk[k]?'var(--ok)':'var(--bad)'}">${v===''?'—':esc(v)} ${esc(r.unit||'')}</b> <span class="tiny muted">(attendu ${frN(r.ans)})</span>`; }).join(' · ')}</div>${cor}</div>`; }).join('');
  const md=modal(`${esc(def.titre)} — ${esc(nomEl(mail))}`, `<div class="vx-sheet">
    ${so.length?`<div class="note bad" style="margin-top:0"><b>A quitté la page ${so.length} fois</b>${so.map(x=>`${hhmm(x.t)} · ${dureeTxt(x.dur||0)} (${esc(x.quoi||'')})`).join('<br>')}</div>`:''}
    <p class="small muted" style="margin-top:0">${R.remis?'Copie remise.':'<b>Copie pas encore remise</b> : l’élève peut encore la modifier.'} Points proposés : calculs autocorrigés (et dessin juste pour un bilan) ; les questions ouvertes sont à noter par toi, corrigé en dessous.</p>
    ${ex}
    <label class="small" style="display:block;margin-top:8px"><b>Commentaire pour l’élève</b><textarea data-ccom rows="3" style="width:100%">${esc(note.com||'')}</textarea></label>
    <div class="row wrap" style="gap:8px;margin-top:10px;justify-content:flex-end"><span class="small" data-ctot></span>
      ${R.remis?'<button class="btn" data-crouv>Rendre la copie à l’élève</button>':''}<button class="btn" data-csave>Enregistrer</button><button class="btn primary" data-cpub>${R.pub?'Enregistrer (déjà publié)':'Enregistrer et publier'}</button></div></div>`, {wide:true});
  const tot=()=>{ const ins=[...md.querySelectorAll('[data-cpts]')], s=ins.reduce((a,x)=>a+(+x.value||0),0), vides=ins.filter(x=>x.value==='').length;
    md.querySelector('[data-ctot]').innerHTML=`Total : <b>${fr(s,1)} / ${fr(bilMax(def),1)}</b>${vides?` · <span style="color:var(--warn)">${vides} question${vides>1?'s':''} sans points</span>`:''}`; };
  md.querySelectorAll('[data-cpts]').forEach(x=>x.oninput=tot); tot();
  const send=async pub=>{ const pts={}; md.querySelectorAll('[data-cpts]').forEach(x=>pts[x.dataset.cpts]=Math.max(0,+x.value||0)); const com=md.querySelector('[data-ccom]').value;
    R.note={pts, com, at:Date.now(), by:ME}; if(pub) R.pub=Date.now(); C.reps[mail]=R; if(BIL.reps[co]&&BIL.reps[co][id]) BIL.reps[co][id][mail]=R; closeModal(); const y=window.scrollY; render(); window.scrollTo(0,y);
    await act('bilanNoter', Object.assign({id, mail, pts, com}, pub?{pub:true}:{}), pub?'Note publiée':'Correction enregistrée'); };
  md.querySelector('[data-csave]').onclick=()=>send(false);
  md.querySelector('[data-cpub]').onclick=()=>send(true);
  const rv=md.querySelector('[data-crouv]'); if(rv) rv.onclick=async()=>{ R.remis=0; R.pub=0; C.reps[mail]=R; closeModal(); const y=window.scrollY; render(); window.scrollTo(0,y); await act('bilanNoter',{id, mail, rouvrir:true},'Copie rendue à l’élève'); };
}
/* la note d'une copie pour le carnet de cotes : la note du prof si elle existe, « à corriger » si la copie est remise */
function bilanScore(id, mail, co){
  const R=((BIL.reps[co]||{})[id]||{})[mail]; if(!R) return null;
  if(R.note&&R.note.pts) return Math.round(Object.values(R.note.pts).reduce((a,x)=>a+(+x||0),0)*10)/10;
  return R.remis ? 'wait' : null;
}
