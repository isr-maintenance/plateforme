/* =========================================================
   BILANS EN LIGNE (verrouillés)
   Le contenu et les réponses sont sur le serveur (« bilan:<id> »), jamais dans ce code.
   Élève : la carte du bilan dans son cours (🔒 tant que le prof n'a pas ouvert), sa copie, la remise,
           puis sa note et la correction quand le prof publie.
   Prof  : dans Suivi, ouvrir / fermer pour sa classe, corriger chaque copie (aide : ce qui est juste
           d'après les réponses), publier. Aperçu du bilan depuis la page du cours.
   ========================================================= */
const BIL = { cur:null, cop:{}, timer:null };            // cur : {id, def, rep} de l'élève ; cop : copies chargées par le prof
const bilPts = x => x.pts!=null ? x.pts : 1 + (x.res||[]).length;      // points d'un exercice : le dessin + chaque résultat
const bilMax = def => (def.ex||[]).reduce((a,x)=>a+bilPts(x),0);
const bilOkVal = (r, v) => r.ans!=null && okVal(r, v);
/* ce que le serveur pourrait proposer comme points : dessin complet et juste = 1, chaque résultat juste = 1 */
function bilAuto(x, d){
  d=d||{}; const pl=d.pl||{}, ids=x.place?Object.keys(x.place):[];
  const plOk = ids.length>0 && ids.every(id=>pl[id]===x.place[id]);
  const rOk = (x.res||[]).map((r,i)=>bilOkVal(r,(d.r||[])[i]));
  return { plOk, nPl: ids.filter(id=>pl[id]===x.place[id]).length, nIds: ids.length, rOk, pts: (plOk?1:0) + rOk.filter(Boolean).length };
}

/* ---------- la carte du bilan, dans la page du cours ---------- */
function bilanBlock(course){
  const L=(S.bilans||[]).filter(b=>b.course===course); if(!L.length) return '';
  const prof=isProf();
  return `<div class="uaa"><h3>Bilan</h3><div class="chapters">${L.map(b=>{
    if(prof) return `<div class="chap avail"><span class="num">📝</span><div class="ti"><b>${esc(b.titre)}</b><span class="tiny muted">Tu l’ouvres pour ta classe dans Suivi. Les élèves ne voient rien avant.</span></div><button class="btn sm" data-bilan="${esc(b.id)}">Aperçu</button></div>`;
    const st = b.pub?`<span class="chip ok">✓ corrigé</span>`:b.remis?`<span class="chip">remis · en correction</span>`:b.open?`<span class="chip elec">ouvert</span>`:`<span class="chip warn">🔒 verrouillé</span>`;
    return `<div class="chap ${b.open||b.pub?'avail':'locked'}"><span class="num">📝</span><div class="ti"><b>${esc(b.titre)}</b><span class="tiny muted">${b.open||b.pub?'':'Ton prof l’ouvrira le moment venu.'}</span></div>${st}${b.open||b.pub?`<button class="btn sm primary" data-bilan="${esc(b.id)}">${b.pub?'Voir ma note':b.remis?'Voir ma copie':'Commencer'}</button>`:''}</div>`; }).join('')}</div></div>`;
}
function openBilan(id){ const b=(S.bilans||[]).find(x=>x.id===id)||{}; BIL.cur=null; S.tab=isProf()?'contenus':'cours'; S.view={page:'bilan', id, course:b.course||S.view.course}; render(); window.scrollTo(0,0); loadBilan(id); }
async function loadBilan(id){
  const prof=isProf();
  const r = await API.call(prof?'bilanCopies':'bilan', {id});
  if(!r.ok){ BIL.cur={ id, err:r.msg||'Bilan indisponible' }; }
  else BIL.cur = prof ? { id, def:r.def, rep:{d:{}, remis:0, pub:0}, apercu:true } : { id, def:r.def, rep:r.rep };
  if(S.view.page==='bilan' && S.view.id===id){ const y=window.scrollY; render(); window.scrollTo(0,y); }
}

/* ---------- la copie (élève) ou l'aperçu (prof) ---------- */
function pageBilan(){
  const id=S.view.id, B=BIL.cur, back=`<div class="crumbs"><button data-back="course">← Retour au cours</button></div>`;
  if(!B || B.id!==id) return back+`<div class="card pad"><p class="muted" style="margin:0">Chargement du bilan…</p></div>`;
  if(B.err) return back+`<div class="card pad"><h3>🔒 ${esc(B.err)}</h3></div>`;
  const def=B.def, rep=B.rep, ro=!!(rep.remis||rep.pub||B.apercu), pub=!!rep.pub, note=rep.note||null;
  let tot=0;
  const parts=[]; (def.ex||[]).forEach((x,i)=>{ const p=x.part||''; if(!parts.length||parts[parts.length-1].t!==p) parts.push({t:p, ex:[]}); parts[parts.length-1].ex.push(i); });
  const exHTML=i=>{ const x=def.ex[i], d=(rep.d||{})[i]||{}, sch=schemaHTML(x.scenes||[]), max=bilPts(x);
    const pts=note&&note.pts?note.pts[i]:null; if(pts!=null) tot+=+pts;
    const show=pub||B.apercu;
    const res=(x.res||[]).map((r,k)=>{ const v=(d.r||[])[k]||'', good=pub&&r.ans!=null?bilOkVal(r,v):null;   // en aperçu : la réponse seule, sans rouge
      return `<div class="drow ${good===true?'good':good===false?'wrong':''}"><span class="dn">${k+1}</span><span class="dq">${esc(r.lbl||'Résultat')}</span>
        <span class="din"><input type="text" inputmode="decimal" data-br="${i}|${k}" value="${esc(B.apercu?'':v)}" ${ro?'disabled':''} aria-label="${esc(r.lbl||'Résultat')}"><span class="u">${esc(r.unit||'')}</span></span>
        ${show&&r.ans!=null?`<span class="dh">Réponse : ${frN(r.ans)} ${esc(r.unit||'')}</span>`:''}</div>`; }).join('');
    return `<div class="bil-ex" data-bex="${i}"><div class="row between wrap" style="gap:8px"><div class="row" style="gap:8px"><span class="exn">${i+1}</span><b>Exercice ${i+1}</b></div>
        <span class="chip ${pts!=null?(pts>=max?'ok':'amber'):''}">${pts!=null?`${fr(pts,1)} / ${max}`:`${max} point${max>1?'s':''}`}</span></div>
      <div class="difs-en">${x.enonce}</div>
      ${(x.scenes||[]).length?`${sch.html}<p class="small" style="margin:6px 0">Indique les données et l’inconnue sur le dessin : pour chaque numéro, choisis ce qui va à cet endroit.</p>
        ${placeSelects('bil|'+def.id+'|'+i, sch.ids, x.tokens||[], (B.apercu?x.place:d.pl)||{}, {place:x.place||{}, check:show&&!!x.place, ro, show:show&&!!x.place})}`:''}
      ${(x.schemas||0)?`<p class="small muted">${x.schemas}</p>`:''}
      <div class="difs ${ro?'done':''}" style="margin-top:10px">${DIFS_COLS.map(([c,l,ph])=>`<div class="difs-col"><div class="difs-h">${l}</div><div class="mcell ${ro?'ro':''}">${ro?'':`<textarea data-bt="${i}|${c}" maxlength="400" rows="4" placeholder="${esc(ph)}" spellcheck="false" aria-label="${l}">${esc(d[c]||'')}</textarea>`}<div class="mview" data-bv="${i}|${c}">${String(d[c]||'').trim()?fmath(d[c]):`<span class="muted tiny">${ro?'—':''}</span>`}</div></div></div>`).join('')}</div>
      ${res?`<div class="difs-res"><div class="tiny muted" style="margin:6px 0">${ro?'Tes résultats':'Recopie ici tes résultats finaux, avec l’unité attendue.'}</div><div class="drill">${res}</div></div>`:''}
      ${pub&&note&&note.com&&i===def.ex.length-1?'':''}</div>`; };
  const head=`${back}<div class="page-head"><div><div class="kicker">${B.apercu?'Aperçu du prof · avec les réponses':'Bilan'}</div><h1>${esc(def.titre)}</h1>${def.sous?`<p class="muted small" style="margin-top:4px">${esc(def.sous)}</p>`:''}</div>
      <div class="row wrap"><button class="btn" data-formulaire="${esc(def.course||'')}">📐 Formulaire</button></div></div>
    ${pub?`<div class="card pad" style="margin-bottom:14px;border-color:var(--ok)"><h3 style="margin:0">Ta note : ${fr(Object.values((note&&note.pts)||{}).reduce((a,b)=>a+(+b||0),0),1)} / ${bilMax(def)}</h3>${note&&note.com?`<p style="margin:6px 0 0">${esc(note.com)}</p>`:''}<p class="tiny muted" style="margin:6px 0 0">Corrigé par ${esc(note&&note.by||'ton prof')}. Les bonnes réponses sont affichées sous chaque exercice.</p></div>`
      :rep.remis&&!B.apercu?`<div class="note" style="margin-top:0"><b>Copie remise</b>Ton prof la corrige. Tu verras ta note ici quand il l’aura publiée.</div>`
      :B.apercu?`<div class="note" style="margin-top:0"><b>Aperçu</b>Voici le bilan tel que les élèves le verront, avec le dessin complété et les réponses. Ouvre-le pour ta classe dans Suivi.</div>`
      :`<div class="note" style="margin-top:0"><b>Consignes</b>${def.consignes||'Pour chaque exercice : la ou les formules, le calcul et la réponse, sans oublier les unités.'} Ta copie s’enregistre au fur et à mesure ; tu peux t’arrêter et reprendre. Quand tu as fini, remets-la : tu ne pourras plus la modifier.</div>`}`;
  const body=parts.map(p=>`${p.t?`<h2 style="margin:18px 0 8px">${esc(p.t)}</h2>`:''}${p.ex.map(exHTML).join('')}`).join('');
  const foot = ro ? '' : `<div class="card pad row between wrap" style="gap:10px"><span class="small muted" data-bsave>Enregistré au fur et à mesure.</span><span class="row" style="gap:8px"><button class="btn primary" data-bremet>Remettre ma copie</button></span></div>`;
  return head+body+foot;
}
function bindBilan(m){
  const B=BIL.cur; if(!B||!B.def||B.apercu) return;
  const rep=B.rep; if(rep.remis||rep.pub) return;
  const D=rep.d||(rep.d={});
  const ex=i=>D[i]||(D[i]={d:'',i:'',f:'',s:'',r:[],pl:{}});
  const later=()=>{ clearTimeout(BIL.timer); const s=m.querySelector('[data-bsave]'); if(s) s.textContent='Modifications en attente…';
    BIL.timer=setTimeout(async()=>{ const r=await act('bilanSave',{id:B.id, d:D}); const s2=m.querySelector('[data-bsave]'); if(s2) s2.textContent=r?'Enregistré.':'Non enregistré : vérifie ta connexion.'; }, 1500); };
  m.querySelectorAll('[data-bt]').forEach(t=>{ const [i,c]=t.dataset.bt.split('|'); t.oninput=()=>{ ex(i)[c]=t.value; const v=m.querySelector(`[data-bv="${i}|${c}"]`); if(v) v.innerHTML=t.value.trim()?fmath(t.value):''; later(); }; });
  m.querySelectorAll('[data-br]').forEach(t=>{ const [i,k]=t.dataset.br.split('|'); t.oninput=()=>{ const e=ex(i); e.r=e.r||[]; e.r[+k]=t.value; later(); }; });
  m.querySelectorAll('[data-bex]').forEach(box=>{ const i=box.dataset.bex; box.querySelectorAll('[data-pl]').forEach(s=>s.onchange=()=>{ const e=ex(i); e.pl=e.pl||{}; if(s.value==='') delete e.pl[s.dataset.pl]; else e.pl[s.dataset.pl]=+s.value; later(); }); });
  const rb=m.querySelector('[data-bremet]'); if(rb) rb.onclick=async()=>{
    if(!rb.dataset.sure){ rb.dataset.sure='1'; rb.textContent='Confirmer : je remets ma copie'; rb.classList.add('danger'); setTimeout(()=>{ if(rb.isConnected){ delete rb.dataset.sure; rb.textContent='Remettre ma copie'; rb.classList.remove('danger'); } },6000); return; }
    clearTimeout(BIL.timer); rb.disabled=true;
    const r=await act('bilanSave',{id:B.id, d:D, remettre:true});
    if(!r){ rb.disabled=false; return; }
    rep.remis=r.remis||Date.now(); const b=(S.bilans||[]).find(x=>x.id===B.id); if(b) b.remis=rep.remis;
    toast('Copie remise'); render(); window.scrollTo(0,0);
  };
}

/* ---------- Suivi (prof) : ouvrir, corriger, publier ---------- */
function bilanDash(cl, co, studs){
  const L=(S.bilans||[]).filter(b=>b.course===co); if(!L.length) return '';
  return L.map(b=>{ const k=b.id+'|'+cl, open=!!(S.bilanouv||{})[k], C=BIL.cop[b.id];
    if(!C && !BIL.cop['_'+b.id]){ BIL.cop['_'+b.id]=1; act('bilanCopies',{id:b.id}).then(r=>{ if(r){ BIL.cop[b.id]={def:r.def, reps:r.reps}; const y=window.scrollY; render(); window.scrollTo(0,y); } delete BIL.cop['_'+b.id]; }); }
    const max=C?bilMax(C.def):0;
    const rows=studs.map(s=>{ const R=C&&C.reps[s.mail]; const pts=R&&R.note&&R.note.pts?Object.values(R.note.pts).reduce((a,x)=>a+(+x||0),0):null;
      const st=!R?'<span class="cell none">pas commencé</span>':R.pub?`<span class="cell ok">publié</span>`:R.note?`<span class="cell run">corrigé, pas publié</span>`:R.remis?`<span class="cell wait">remis : à corriger</span>`:'<span class="cell run">en cours</span>';
      return `<tr><td>${esc(s.nom)}</td><td>${st}</td><td>${pts!=null?`<b>${fr(pts,1)}</b> / ${max}`:'—'}</td><td>${R?`<button class="btn sm" data-bcor="${esc(b.id)}|${esc(s.mail)}">${R.note?'Revoir':'Corriger'}</button>`:''}</td></tr>`; }).join('');
    const nPub=C?studs.filter(s=>{ const R=C.reps[s.mail]; return R&&R.note&&!R.pub; }).length:0;
    return `<div class="card" style="margin-bottom:16px;${open?'border-color:var(--meca)':''}"><div class="pad row between wrap" style="gap:10px;border-bottom:1px solid var(--line)">
      <div><h3 style="margin:0">📝 ${esc(b.titre)}</h3><p class="small muted" style="margin:4px 0 0">${open?`<b style="color:var(--meca)">Ouvert</b> pour ${esc(cls(cl).nom)} : les élèves peuvent le faire et le remettre.`:`<b>Verrouillé</b> pour ${esc(cls(cl).nom)} : les élèves ne voient que le cadenas.`}</p></div>
      <div class="row wrap" style="gap:6px"><button class="btn sm" data-bilan="${esc(b.id)}">Aperçu</button>${nPub?`<button class="btn sm" data-bpuball="${esc(b.id)}">Publier les ${nPub} copie${nPub>1?'s':''} corrigée${nPub>1?'s':''}</button>`:''}<button class="btn sm ${open?'':'primary'}" data-bouv="${esc(b.id)}|${esc(cl)}|${open?0:1}">${open?'Verrouiller':'Déverrouiller pour la classe'}</button></div></div>
      ${C?`<div class="scroll-x"><table class="t"><tr><th>Élève</th><th>Copie</th><th>Note</th><th></th></tr>${rows||'<tr><td colspan="4" class="muted">Aucun élève.</td></tr>'}</table></div>`:'<p class="small muted pad" style="margin:0">Chargement des copies…</p>'}</div>`; }).join('');
}
function bindBilanDash(m){
  m.querySelectorAll('[data-bouv]').forEach(b=>b.onclick=async()=>{ const [id,cl,o]=b.dataset.bouv.split('|'); const k=id+'|'+cl;
    S.bilanouv=S.bilanouv||{}; const avant=S.bilanouv[k]; if(o==='1') S.bilanouv[k]=Date.now(); else delete S.bilanouv[k];
    const y=window.scrollY; render(); window.scrollTo(0,y);
    const r=await act('bilanOuvrir',{id, cl, open:o==='1'}, o==='1'?'Bilan déverrouillé pour la classe':'Bilan verrouillé');
    if(!r){ if(avant) S.bilanouv[k]=avant; else delete S.bilanouv[k]; const y2=window.scrollY; render(); window.scrollTo(0,y2); } });
  m.querySelectorAll('[data-bcor]').forEach(b=>b.onclick=()=>{ const [id,mail]=b.dataset.bcor.split('|'); corrigerBilan(id, mail); });
  m.querySelectorAll('[data-bpuball]').forEach(b=>b.onclick=async()=>{ const id=b.dataset.bpuball, C=BIL.cop[id]; if(!C) return;
    const L=Object.keys(C.reps).filter(mail=>{ const R=C.reps[mail]; return R.note&&!R.pub; });
    L.forEach(mail=>{ const R=C.reps[mail]; R.pub=Date.now(); act('bilanNoter',{id, mail, pts:R.note.pts, com:R.note.com, pub:true}); });
    toast(`${L.length} copie${L.length>1?'s':''} publiée${L.length>1?'s':''}`); const y=window.scrollY; render(); window.scrollTo(0,y); });
}
function corrigerBilan(id, mail){
  const C=BIL.cop[id]; if(!C) return; const def=C.def, R=C.reps[mail]||{}, note=R.note||{};
  const ex=(def.ex||[]).map((x,i)=>{ const d=(R.d||{})[i]||{}, a=bilAuto(x,d), max=bilPts(x), sch=schemaHTML(x.scenes||[]);
    const pts=note.pts&&note.pts[i]!=null?note.pts[i]:a.pts;
    return `<div class="bil-ex"><div class="row between wrap" style="gap:8px"><b>Exercice ${i+1}</b><label class="row small" style="gap:6px">Points <input type="number" min="0" max="${max}" step="0.5" value="${pts}" data-cpts="${i}" style="width:70px"> / ${max}</label></div>
      <div class="small muted" style="margin:4px 0 8px">${x.enonce}</div>
      ${(x.scenes||[]).length?`<div class="small" style="margin-bottom:4px"><b>Dessin :</b> ${a.nPl}/${a.nIds} emplacements justes</div>${sch.html}${placeSelects('cor|'+i, sch.ids, x.tokens||[], d.pl||{}, {place:x.place||{}, check:true, ro:true, show:true})}`:''}
      <div class="difs done" style="margin-top:8px">${DIFS_COLS.map(([c,l])=>`<div class="difs-col"><div class="difs-h">${l}</div><div class="mcell ro"><div class="mview">${String(d[c]||'').trim()?fmath(d[c]):'<span class="muted tiny">vide</span>'}</div></div></div>`).join('')}</div>
      <div class="small" style="margin-top:6px">${(x.res||[]).map((r,k)=>{ const v=(d.r||[])[k]||''; return `${esc(r.lbl)} : <b style="color:${v===''?'var(--muted)':a.rOk[k]?'var(--ok)':'var(--bad)'}">${v===''?'—':esc(v)} ${esc(r.unit||'')}</b> <span class="tiny muted">(attendu ${frN(r.ans)})</span>`; }).join(' · ')}</div></div>`; }).join('');
  const md=modal(`${esc(def.titre)} — ${esc(nomEl(mail))}`, `<div class="vx-sheet">
    <p class="small muted" style="margin-top:0">${R.remis?'Copie remise.':'<b>Copie pas encore remise</b> : l’élève peut encore la modifier.'} Les points proposés viennent de la correction automatique (dessin entièrement juste : 1 point ; chaque résultat juste : 1 point). Ajuste-les selon la démarche.</p>
    ${ex}
    <label class="small" style="display:block;margin-top:8px"><b>Commentaire pour l’élève</b><textarea data-ccom rows="3" style="width:100%">${esc(note.com||'')}</textarea></label>
    <div class="row wrap" style="gap:8px;margin-top:10px;justify-content:flex-end"><span class="small" data-ctot></span>
      ${R.remis?'<button class="btn" data-crouv>Rendre la copie à l’élève</button>':''}<button class="btn" data-csave>Enregistrer</button><button class="btn primary" data-cpub>${R.pub?'Enregistrer (déjà publié)':'Enregistrer et publier'}</button></div></div>`, {wide:true});
  const tot=()=>{ const s=[...md.querySelectorAll('[data-cpts]')].reduce((a,x)=>a+(+x.value||0),0); md.querySelector('[data-ctot]').innerHTML=`Total : <b>${fr(s,1)} / ${bilMax(def)}</b>`; };
  md.querySelectorAll('[data-cpts]').forEach(x=>x.oninput=tot); tot();
  const send=async pub=>{ const pts={}; md.querySelectorAll('[data-cpts]').forEach(x=>pts[x.dataset.cpts]=Math.max(0,+x.value||0)); const com=md.querySelector('[data-ccom]').value;
    R.note={pts, com, at:Date.now(), by:ME}; if(pub) R.pub=Date.now(); C.reps[mail]=R; closeModal(); const y=window.scrollY; render(); window.scrollTo(0,y);
    await act('bilanNoter', Object.assign({id, mail, pts, com}, pub?{pub:true}:{}), pub?'Note publiée':'Correction enregistrée'); };
  md.querySelector('[data-csave]').onclick=()=>send(false);
  md.querySelector('[data-cpub]').onclick=()=>send(true);
  const rv=md.querySelector('[data-crouv]'); if(rv) rv.onclick=async()=>{ R.remis=0; R.pub=0; C.reps[mail]=R; closeModal(); const y=window.scrollY; render(); window.scrollTo(0,y); await act('bilanNoter',{id, mail, rouvrir:true},'Copie rendue à l’élève'); };
}
