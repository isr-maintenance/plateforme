/* =========================================================
   PAGES — reprises de la démo, branchées sur les vraies données
   ========================================================= */
/* ---------------- Présentation ---------------- */
function pill(c){
  const t=TYPE[c.type]; const live = c.statut==='demo'||c.statut==='demo-tp';
  return `<button class="cpill ${live?'live':''}" data-open-course="${c.id}"><span class="bullet" style="background:${t.c}"></span><span>${esc(c.titre)}${c.per?` <span class="st">${c.per}p</span>`:''}${c.commun?` <span class="st">· commun</span>`:''}</span>${live?'<span class="chip ok" style="padding:0 6px">en ligne</span>':''}</button>`;
}
function lane(filId, annee, title, note){
  const f=fil(filId);
  return `<div class="lane"><h4><span class="chip ${TYPE[f.type].chip}">${annee}${f.code}</span>${title||f.nom}${note?` <span class="chip warn">${note}</span>`:''}</h4><div class="courses">${coursFor(filId,annee).map(pill).join('')}</div></div>`;
}
/* ---------- évaluation formative du chapitre ---------- */
function calcPts(a){
  if(!a) return 0; const num=v=>parseFloat(String(v||'').replace(',','.'));
  let p=0; const i=num(a.i), u=a.u||'A';
  const mA = u==='mA'? i : i*1000;
  if(Math.abs(mA-50)<1.5) p+=2;
  if(a.n==='oui') p+=1;
  return p;
}
function testHTML(){
  const t=S.prog.test, sc=testScore();
  if(t.submitted) return `<div class="cap-body"><div class="kicker">Évaluation formative 2.3 · Annexe H</div><h2>Résultat</h2>
    <div class="grid g3" style="margin:14px 0">
      <div class="card kpi"><div class="v">${sc.auto}<span class="muted" style="font-size:16px">/${AUTO}</span></div><div class="l">questions corrigées automatiquement</div></div>
      <div class="card kpi"><div class="v">${sc.pending?'…':sc.open}<span class="muted" style="font-size:16px">/${TOTAL-AUTO}</span></div><div class="l">${sc.pending?`${sc.pending} réponse(s) chez le prof`:'questions ouvertes, corrigées par le prof'}</div></div>
      <div class="card kpi"><div class="v" style="color:${sc.pending?'var(--muted)':sc.total>=SEUIL?'var(--ok)':'var(--bad)'}">${sc.pending?'en attente':sc.total+'/'+TOTAL}</div><div class="l">seuil de maîtrise : ${SEUIL}/${TOTAL}</div></div></div>
    ${sc.pending?`<div class="note"><b>Tes réponses ouvertes sont chez ton prof.</b>En attendant, compare-les au corrigé ci-dessous. ${S.role==='eleve'?'':''}</div>`:''}
    ${TEST.map(q=>{ const got=t.pts[q.id]; let res='';
      if(q.type==='open'){ res=`<div class="small" style="margin-top:6px"><b>Ta réponse :</b> ${esc(t.texts[q.id]||'—')}</div><div class="fb good" style="background:var(--elec-soft)"><b>Corrigé :</b> ${q.cor}</div>${t.open[q.id]!=null?`<div class="small"><b>Note du prof : ${t.open[q.id]}/${q.pts}</b></div>`:''}`; }
      else { const ok=got===q.pts; res=`<div class="fb ${ok?'good':'wrong'}"><b>${got}/${q.pts}</b> ${q.type==='calc'?'— I = U ÷ R = 24 ÷ 480 = 0,05 A, soit 50 mA. Valeur normale (200 à 700 Ω pour une bobine 24 V DC).':''} ${ok?'':`— <button class="revoir" data-goto="${q.r}">revoir ${q.rv}</button>`}</div>`; }
      return `<div class="q"><div class="qt">${q.q} <span class="tiny muted">(${q.pts} pt${q.pts>1?'s':''})</span></div>${res}</div>`; }).join('')}
    <button class="btn" data-retest>Recommencer</button></div>`;
  return `<div class="cap-body"><div class="kicker">Évaluation formative 2.3 · ${TOTAL} points · seuil de maîtrise ${SEUIL} · 35 min</div><h2>Le relais électromécanique</h2>
    <p class="muted">Reprise de l'annexe H du cours. Les questions fermées sont corrigées tout de suite ; les deux questions ouvertes partent chez ton prof. Le résultat compte dans la cote formative du bulletin.</p>
    ${TEST.map((q,n)=>`<div class="q" data-tq="${q.id}"><div class="qt">${n+1}. ${q.q} <span class="tiny muted">(${q.pts} pt${q.pts>1?'s':''})</span></div>
      ${q.type==='open'?`<textarea data-open="${q.id}" placeholder="Écris ta réponse…">${esc(t.texts[q.id]||'')}</textarea>`
      : q.type==='qcm'?`<div class="opts">${q.o.map((o,i)=>`<button class="opt ${t.ans[q.id]===i?'sel':''}" data-tans="${q.id}" data-i="${i}"><span class="l">${'ABC'[i]}</span><span>${o}</span></button>`).join('')}</div>`
      : q.type==='calc'?`<div class="row wrap"><label class="small"><b>I =</b> <input type="text" inputmode="decimal" data-tcalc="i" value="${esc((t.ans.t7||{}).i||'')}" style="width:90px"></label><select data-tcalc="u"><option ${((t.ans.t7||{}).u||'A')==='A'?'selected':''}>A</option><option ${((t.ans.t7||{}).u)==='mA'?'selected':''}>mA</option></select>
          <label class="small" style="margin-left:12px"><b>480 Ω, c'est…</b> <select data-tcalc="n"><option value="">—</option><option value="oui" ${((t.ans.t7||{}).n)==='oui'?'selected':''}>normal</option><option value="non" ${((t.ans.t7||{}).n)==='non'?'selected':''}>anormal</option></select></label></div>`
      : `<div class="stack">${[0,1,2].map(pos=>`<div class="row"><b style="width:22px">${pos+1}.</b><select data-tord="${q.id}" data-pos="${pos}" style="flex:1;max-width:100%"><option value="">— choisir —</option>${q.shuf.map(k=>`<option value="${k}" ${(t.ans[q.id]||[])[pos]===k?'selected':''}>${q.items[k]}</option>`).join('')}</select></div>`).join('')}</div>`}
    </div>`).join('')}
    <div class="row between wrap"><span class="small muted" id="testhint"></span><button class="btn primary" data-submit>Remettre mon évaluation</button></div></div>`;
}
function bindTest(m){
  const t=S.prog.test;
  m.querySelectorAll('[data-tans]').forEach(b=>b.onclick=()=>{ t.ans[b.dataset.tans]=+b.dataset.i; b.parentElement.querySelectorAll('.opt').forEach(o=>o.classList.toggle('sel',o===b)); save(); });
  m.querySelectorAll('[data-open]').forEach(a=>a.oninput=()=>{ t.texts[a.dataset.open]=a.value; save(); });
  m.querySelectorAll('[data-tord]').forEach(s=>s.onchange=()=>{ const a=t.ans[s.dataset.tord]||[null,null,null]; a[+s.dataset.pos]=s.value===''?null:+s.value; t.ans[s.dataset.tord]=a; save(); });
  m.querySelectorAll('[data-tcalc]').forEach(s=>{ const f=()=>{ const a=t.ans.t7||(t.ans.t7={}); a[s.dataset.tcalc]=s.value; save(); }; s.oninput=f; s.onchange=f; });
  const sub=m.querySelector('[data-submit]'); if(sub) sub.onclick=()=>{
    const missing=TEST.filter(q=> q.type==='open' ? !(t.texts[q.id]||'').trim() : q.type==='qcm' ? t.ans[q.id]==null : q.type==='calc' ? !((t.ans.t7||{}).i && (t.ans.t7||{}).n) : !(t.ans[q.id]||[]).every(x=>x!=null));
    if(missing.length){ $('#testhint').innerHTML=`<span style="color:var(--bad)">Il manque ${missing.length} réponse(s).</span>`; return; }
    TEST.forEach(q=>{ if(q.type==='qcm') t.pts[q.id] = t.ans[q.id]===q.g ? q.pts : 0;
      if(q.type==='order') t.pts[q.id] = (t.ans[q.id]||[]).filter((v,i)=>v===i).length;
      if(q.type==='calc') t.pts[q.id] = calcPts(t.ans.t7); });
    t.submitted=true; t.open={}; t.sid=Date.now().toString(36); save(); if(!isProf()) pushProg(); render(); window.scrollTo(0,0); };
  m.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>openCap(b.dataset.goto));
  const re=m.querySelector('[data-retest]'); if(re) re.onclick=()=>{ S.prog.test={submitted:false,ans:{},pts:{},open:{},texts:{}}; save(); render(); };
}

/* ---------------- TP électricité (4EQMM) ---------------- */
function pageTP(){
  const fvN=FEUVERT.filter(x=>feuVert(x.k)).length;
  return `<div class="crumbs"><button data-back="home">${S.role==='prof'?'Contenus':'Mes cours'}</button> › TP électricité</div>
  <div class="page-head"><div><div class="kicker">4EQEM · 4 p./sem.</div><h1>TP électricité</h1><p class="muted small">Chaque TP a son feu vert : les prérequis de théorie sont vérifiés avant d'entrer à l'atelier.</p></div></div>
  <div class="chapters">${TP_E.map(([k,t])=>{
    const demo=k==='É03';
    return `<div class="chap ${demo?'avail':''}"><span class="num">${k}</span><div class="ti"><b>${t}</b><span class="tiny muted">${demo?'Théorie : chapitre 2.3 du cours d’Électricité':'Feu vert en préparation'}</span></div>
      ${demo?`<span class="chip ${fvN===6?'ok':'warn'}">${fvN===6?'Feu vert':`${fvN}/6 prérequis`}</span><button class="btn sm primary" data-cap="fv">Voir le feu vert</button>`:`<span class="chip">En préparation</span>`}</div>`; }).join('')}</div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card pad"><div class="kicker" style="color:var(--tp)">Module Dossier TP</div><h3 style="margin:6px 0">Schémas, bon de commande, outillage</h3><p class="small muted">Le dossier de chaque TP se prépare dans le module Dossier TP, avec la même connexion.</p><button class="btn sm" data-module="dossier">En savoir plus</button></div>
    <div class="card pad"><div class="kicker" style="color:var(--tp)">Module Banc de câblage</div><h3 style="margin:6px 0">Câbler avant l'atelier</h3><p class="small muted">Les exercices du TP peuvent d'abord être câblés et testés sur le simulateur.</p><button class="btn sm" data-module="banc">En savoir plus</button></div>
  </div>`;
}
function bindTP(m){ m.querySelectorAll('[data-cap]').forEach(b=>b.onclick=()=>openCap(b.dataset.cap)); }

/* ---------------- Bibliothèque ---------------- */
function libGroups(){
  return [
    ['3e', [['3qem',3,'3QEM Électromécanique']]],
    ['4e', [['eqem',4,'4EQEM'],['eqmm',4,'4EQMM']]],
    ['5e', [['eqem',5,'5EQEM'],['eqmm',5,'5EQMM']]],
    ['6e', [['eqem',6,'6EQEM'],['eqmm',6,'6EQMM']]],
  ];
}
function pageBiblio(){
  const sel=S.lib.sel||'4|eqmm';
  const [an,fl]=sel.split('|');
  const f=fil(fl), list=coursFor(fl,+an);
  return `<div class="page-head"><div><div class="kicker">Tous les cours en PDF</div><h1>Bibliothèque</h1><p class="muted small">Rangée par année et par filière. Un cours commun (Électricité et Mécanique de 4e) apparaît dans les deux filières.</p></div></div>
  <div class="lib">
    <aside class="card tree" style="padding:8px">${libGroups().map(([y,items])=>`<div class="grp">${y} année</div>${items.map(([fi,a,l])=>`<button class="${an==a&&fl===fi?'on':''}" data-lib="${a}|${fi}">${l}</button>`).join('')}`).join('')}</aside>
    <section class="card">
      <div class="pad" style="border-bottom:1px solid var(--line)"><div class="kicker">${an}${f.code}</div><h2>${f.nom}</h2></div>
      ${list.map(c=>{
        const has = S.pdfs[c.id] || (c.pdf && (CONFIG.PDF_ELEC4 || typeof PDF_B64!=='undefined'));
        return `<div class="doc"><div class="ic ${has?'':'empty'}">PDF</div><div class="meta"><b>${esc(c.titre)}</b>${c.sous?` <span class="small muted">— ${esc(c.sous)}</span>`:''}
          <div class="small muted">${S.pdfs[c.id]?esc(S.pdfs[c.id].name||'PDF sur Google Drive'):c.pdf?(S.role==='prof'?'Cours d’Électricité — 4e année · version prof complète, avec les évaluations formatives et les corrigés (annexes E, H et I) · les élèves ont la version sans':'Cours d’Électricité — 4e année · version révisée · annexes et évaluations formatives'):'Pas encore de PDF'}</div></div>
          ${has?`<button class="btn sm" data-pdf="1" ${S.pdfs[c.id]?`data-pdfkey="${c.id}" data-pdftitle="${esc(c.titre)}"`:''}>Ouvrir</button>`:''}
          ${S.role==='prof'?`<button class="btn sm" data-pdflink="${c.id}">${S.pdfs[c.id]?'Changer le lien':'Lier un PDF'}</button>`:''}</div>`; }).join('')}
      ${an==='4'&&S.role==='prof'&&CONFIG.PDF_ELEC4_EVAL?`<div class="doc"><div class="ic">PDF</div><div class="meta"><b>Évaluations formatives — Électricité 4e</b> <span class="small muted">— 🔒 réservé aux profs</span><div class="small muted">Annexe H à imprimer : 19 évaluations, une par chapitre. Les élèves ne la voient pas.</div></div><button class="btn sm" data-pdfurl="${esc(CONFIG.PDF_ELEC4_EVAL)}">Ouvrir</button></div>`:''}
      ${an==='4'&&(S.fcor||[]).length?`<div class="pad" style="border-top:1px solid var(--line)">${fcorBlock()}</div>`:''}
      ${an==='4'?`<div class="pad" style="border-top:1px solid var(--line)"><div class="kicker" style="margin-bottom:8px">Accès direct — Électricité 4e</div><div class="row wrap">${ELEC4.flatMap(u=>u.chaps).map(([n,t,p])=>`<button class="btn sm" data-pdf="${p}" title="${esc(t)}">${n}</button>`).join('')}${elec4Annexes().map(([t,p,pr])=>`<button class="btn sm" data-pdf="${p}"${pr?' title="Réservée aux profs"':''}>${pr?'🔒 ':''}${t.split(' — ')[0]}</button>`).join('')}</div></div>`:''}
    </section>
  </div>`;
}
function bindBiblio(m){
  m.querySelectorAll('[data-lib]').forEach(b=>b.onclick=()=>{ S.lib.sel=b.dataset.lib; render(); });
  m.querySelectorAll('[data-pdflink]').forEach(b=>b.onclick=()=>{ const id=b.dataset.pdflink, c=COURS.find(x=>x.id===id), cur=S.pdfs[id]||{};
    const md=modal('PDF — '+esc(c.titre), `<p class="small">Dépose le PDF dans Google Drive avec ton compte de l'école, partage-le avec <b>${PLAT.DOMAIN} (lecteur)</b>, puis colle son lien ici. Seules les personnes connectées avec un compte de l'école pourront l'ouvrir.</p>
      <label class="small"><b>Lien Google Drive</b><input type="text" data-pu value="${esc(cur.url||'')}" placeholder="https://drive.google.com/…" style="width:100%;margin:4px 0 10px"></label>
      <label class="small"><b>Description</b><input type="text" data-pn value="${esc(cur.name||'')}" placeholder="ex. Cours complet, version 2026" style="width:100%;margin-top:4px"></label>
      <div class="row" style="justify-content:flex-end;margin-top:14px">${cur.url?'<button class="btn ghost" data-pdel>Retirer</button>':''}<button class="btn primary" data-pok>Enregistrer</button></div>`);
    const savePdf=async(url,name)=>{ const r=await act('setPdf',{course:id,url,name}); if(r){ if(url) S.pdfs[id]={url,name}; else delete S.pdfs[id]; closeModal(); render(); toast('Bibliothèque mise à jour'); } };
    md.querySelector('[data-pok]').onclick=()=>{ const u=md.querySelector('[data-pu]').value.trim(); if(!/^https:\/\//.test(u)){ toast('Colle un lien qui commence par https://'); return; } savePdf(u, md.querySelector('[data-pn]').value.trim()); };
    const dl=md.querySelector('[data-pdel]'); if(dl) dl.onclick=()=>savePdf('','');
  });
}
/* ---------------- Mes cours (élève) ---------------- */
function pageCours(){
  const c=cls(S.eleveClass), f=fil(c.fil), list=coursFor(c.fil,c.annee);
  return `<div class="page-head"><div><div class="kicker">${c.nom} · ${f.nom}</div><h1>Mes cours</h1></div>
    ${isProf()?`<label class="small row" style="gap:8px"><span class="muted">Aperçu comme un élève de</span><select data-eclass>${CLASSES.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${x.nom}</option>`).join('')}</select></label>`:''}</div>
  <div class="grid g3">${list.map(courseCard).join('')}</div>
  ${list.every(x=>!x.statut.startsWith('demo'))?`<div class="note" style="margin-top:18px"><b>Le contenu arrive bientôt.</b>Tes cours sont en place : les chapitres seront ajoutés au fil de l'année. En attendant, les PDF sont dans la Bibliothèque.</div>`:''}`;
}
function courseCard(c){
  const t=TYPE[c.type]; let prog='';
  if(c.statut==='demo'){ const ON=chapNums().filter(chapOpen), ALL=ON.flatMap(k=>CHAPTERS[k].caps), n=ALL.filter(capDone).length; prog=`<div class="small muted">${ON.length>1?`Chapitres ${ON[0]} à ${ON[ON.length-1]}`:`Chapitre ${ON[0]||'—'}`} · ${n}/${ALL.length} capsules</div><div class="bar ${n===ALL.length?'ok':''}"><i style="width:${n/ALL.length*100}%"></i></div>`; }
  if(c.statut==='demo-tp'){ const n=FEUVERT.filter(x=>feuVert(x.k)).length; prog=`<div class="small muted">Feu vert É03 · ${n}/${FEUVERT.length} prérequis</div><div class="bar ${n===6?'ok':''}"><i style="width:${n/6*100}%"></i></div>`; }
  return `<button class="ccard ${c.type}" data-open-course="${c.id}"><div class="row between"><span class="chip ${t.chip}">${t.l}</span>${c.per?`<span class="tiny muted">${c.per} p./sem.</span>`:''}</div>
    <span class="t1">${esc(c.titre)}</span>${c.sous?`<span class="small muted">${esc(c.sous)}</span>`:''}
    ${prog || `<span class="small muted">${c.confirmer?'Intitulé à confirmer · ':''}Contenu en préparation</span>`}
    <div>${statutChip(c)}${c.commun?' <span class="chip">commun Élec + Méca</span>':''}</div></button>`;
}
function bindCours(m){
  const sel=m.querySelector('[data-eclass]'); if(sel) sel.onchange=()=>{ S.eleveClass=sel.value; render(); };
}

/* ---------------- Page du cours Électricité 4e ---------------- */
function pageCourse(){
  const c=COURS.find(x=>x.id===S.view.course);
  const mode = S.modes[S.eleveClass]||'strict';
  const sc=testScore(); const passed = sc && sc.pending===0 && sc.total>=SEUIL;
  const n=capsDoneCount();
  return `<div class="crumbs"><button data-back="home">${S.role==='prof'?'Contenus':'Mes cours'}</button> › Électricité 4e</div>
  <div class="page-head"><div><div class="kicker">4EQEM + 4EQMM · socle commun · 3 p./sem. · version révisée</div><h1>Cours d'Électricité — 4e année</h1>
    <p class="muted small" style="margin-top:4px">Référentiel SeGEC — Électricien de maintenance industrielle · UAA1 entière, début UAA2 et UAA3</p></div>
    <div class="row wrap"><button class="btn" data-pdf="1">📄 Cours complet (PDF)</button>${(()=>{ const ON=chapNums().filter(chapOpen), nx=ON.find(k=>chapCapsDone(k)<CHAPTERS[k].caps.length)||ON[ON.length-1]||'2.1'; return `<button class="btn primary" data-cap="${chapResume(nx)}">Continuer le chapitre ${nx} →</button>`; })()}</div></div>
  <div class="note"><b>Chaque chapitre prépare un TP précis.</b>La théorie est vue avant la séance de TP correspondante : c'est le principe de verrouillage théorie / TP du cours. ${S.role==='prof'?'Tu ouvres les chapitres pour ta classe dans <b>Suivi</b>.':'Ton prof ouvre chaque chapitre au moment du TP correspondant.'}</div>
  ${ELEC4.map(u=>`<div class="uaa"><h3>${u.uaa} <span class="tiny" style="font-weight:600">· ${u.vol}</span></h3><div class="chapters">${u.chaps.map(([num,t,pg,tp])=>{
    const CH=CHAPTERS[num], open = !!CH && chapOpen(num), avail = open;
    let st;
    if(CH && !open) st = `<span class="chip warn">🔒 pas encore ouvert</span>`;
    else if(num==='2.3' && passed) st = `<span class="chip ok">Réussi ${sc.total}/${TOTAL}</span>`;
    else if(CH){ const d=chapCapsDone(num); st = `<span class="chip ${d===CH.caps.length?'ok':'elec'}">${d===CH.caps.length?'✓ ':''}${d}/${CH.caps.length} capsules</span>`; }
    else st = `<span class="chip">En préparation</span>`;
    return `<div class="chap ${avail?'avail':''} ${CH&&!open?'locked':''}"><span class="num">${num}</span><div class="ti"><b>${t}</b><span class="tiny muted">${tp?`TP alimenté : ${tp} · `:''}PDF p. ${pg}</span></div>
      ${st}<button class="btn sm" data-pdf="${pg}" title="Ouvrir le PDF à la page ${pg}">PDF</button>${avail?`<button class="btn sm primary" data-cap="${chapResume(num)}">Ouvrir</button>`:''}</div>`; }).join('')}</div></div>`).join('')}
  <div class="uaa"><h3>Annexes</h3><div class="chapters">${elec4Annexes().map(([t,p,pr])=>`<div class="chap"><span class="num">${pr?'🔒':'—'}</span><div class="ti"><b>${t}</b>${pr?'<span class="tiny muted">Réservée aux profs : les élèves ne la voient pas</span>':''}</div><button class="btn sm" data-pdf="${p}">PDF p. ${p}</button></div>`).join('')}</div></div>
  ${fcorBlock()}`;
}

/* ---------------- Lecteur de chapitre ---------------- */
function pagePlayer(){
  const capId=S.view.cap, ch=chapOf(capId)||CHAPTERS['2.3'];
  if(!ch.legacy) return pagePlayerD(ch, capId);
  const tocItems = CAPS.map((c,i)=>`<button class="item ${capId===c.id?'on':''}" data-cap="${c.id}"><span class="ck ${capDone(c)?'done':capPart(c)?'part':''}" data-ck="${c.id}">${capDone(c)?'✓':''}</span><span><span class="tiny muted">${c.sec}</span><br>${c.t}</span></button>`).join('');
  const sc=testScore();
  const fvN=FEUVERT.filter(x=>feuVert(x.k)).length;
  return `<div class="crumbs"><button data-back="home">${S.role==='prof'?'Contenus':'Mes cours'}</button> › <button data-back="course">Électricité 4e</button> › 2.3 Le relais électromécanique</div>
  <div class="player">
    <aside class="card toc" style="padding:10px">
      <div style="padding:6px 10px 10px"><div class="kicker">Chapitre 2.3</div><b>Le relais électromécanique</b>
        <div class="bar ${capsDoneCount()===CAPS.length?'ok':''}" style="margin-top:8px"><i id="tocbar" style="width:${capsDoneCount()/CAPS.length*100}%"></i></div>
        <div class="tiny muted" id="toccount" style="margin-top:4px">${capsDoneCount()}/${CAPS.length} capsules validées</div></div>
      ${tocItems}
      <div class="sep">Évaluer</div>
      <button class="item ${capId==='test'?'on':''}" data-cap="test"><span class="ck ${sc&&sc.pending===0&&sc.total>=SEUIL?'done':sc?'part':''}">${sc&&sc.pending===0&&sc.total>=SEUIL?'✓':''}</span><span>Test du chapitre<br><span class="tiny muted">${sc?(sc.pending?`${sc.auto}/${AUTO} auto · ${sc.pending} en correction`:`${sc.total}/${TOTAL}`):`${TOTAL} points · seuil ${SEUIL}`}</span></span></button>
      <button class="item ${capId==='fv'?'on':''}" data-cap="fv"><span class="ck ${fvN===6?'done':fvN?'part':''}">${fvN===6?'✓':''}</span><span>Feu vert TP É03<br><span class="tiny muted">${fvN}/6 prérequis</span></span></button>
    </aside>
    <section class="card cap fade-in" id="capcard">${capId==='test'?testHTML():capId==='fv'?fvHTML():capHTML(capId)}</section>
  </div>`;
}
function capHTML(id){
  const ch=chapOf(id)||CHAPTERS['2.3'], L=ch.caps;
  const i=L.findIndex(c=>c.id===id), cap=L[i];
  const prev=L[i-1], next=L[i+1];
  const exLbl = cap.ex && typeof cap.ex==='object' ? cap.ex.lbl : {parts:'Défi des pièces',coil:'Faire coller puis retomber le relais',pins:'Les deux exercices de brochage',steps:'Les six étapes de la simulation',ohm:'Les quatre diagnostics',calc:'Le calcul de la bobine'}[cap.ex];
  const pdfPg = ch.legacy ? ch.pdf[i] : cap.pdf;
  return `<div class="cap-body">
    <div class="row between wrap"><div class="kicker">${cap.sec} · capsule ${i+1}/${L.length}</div>
      <div class="row">${S.role==='prof'?`<button class="btn sm" data-signal="${cap.id}">⚑ Signaler une erreur</button>`:''}<button class="btn sm ghost" data-pdf="${pdfPg}">Voir dans le PDF</button></div></div>
    <h2>${cap.t}</h2>
    <div id="capbody">${capBody(id)}</div>
    <div class="hr"></div>
    <div class="row between wrap"><h3>Vérifie ce que tu as compris</h3>${exLbl?`<span class="chip ${exOk(cap)?'ok':''}" id="exchip">${exOk(cap)?'✓ ':''}${exLbl}</span>`:''}</div>
    <div id="quizzes">${cap.quiz.map(quizHTML).join('')}</div>
  </div>
  <div class="cap-foot">
    ${prev?`<button class="btn" data-cap="${prev.id}">← ${prev.t}</button>`:'<span></span>'}
    <span class="small" id="capstatus">${capDone(cap)?'<b style="color:var(--ok)">✓ Capsule validée</b>':'<span class="muted">Réponds juste à toutes les questions'+(exLbl?' et termine l’exercice':'')+'</span>'}</span>
    ${next?`<button class="btn primary" data-cap="${next.id}">${next.t} →</button>`:ch.legacy?`<button class="btn primary" data-cap="test">Passer au test →</button>`:`<button class="btn primary" data-cap="syn:${ch.num}">Synthèse et évaluation →</button>`}
  </div>`;
}
function afterPlayer(){
  const m=$('#main'); bindCommon(m);
  m.querySelectorAll('[data-qopt]').forEach(b=>b.onclick=()=>answerQuiz(b.dataset.qopt,+b.dataset.i));
  m.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>openCap(b.dataset.goto));
  m.querySelectorAll('[data-signal]').forEach(b=>b.onclick=()=>signalForm(b.dataset.signal));
  const cap=S.view.cap;
  if(cap==='test') bindTest(m); else if(cap==='fv') bindFV(m); else if(cap.startsWith('syn:')) m.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>openCap(b.dataset.goto)); else mountCap(cap);
  startClock();
}
function renderPlayer(keepScroll){
  const y=window.scrollY;
  const card=$('#capcard'); if(!card){ render(); return; }
  const vc=capById(S.view.cap);
  if(vc && $('#quizzes')){ $('#quizzes').innerHTML = vc.quiz.map(quizHTML).join('');
    $('#quizzes').querySelectorAll('[data-qopt]').forEach(b=>b.onclick=()=>answerQuiz(b.dataset.qopt,+b.dataset.i));
    $('#quizzes').querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>openCap(b.dataset.goto));
    updateTocChecks();
  } else render();
  if(keepScroll) window.scrollTo(0,y);
}
function updateTocChecks(){
  const CH=chapOf(S.view.cap)||CHAPTERS['2.3'], CAPS=CH.caps, capsDoneCount=()=>CAPS.filter(capDone).length;
  CAPS.forEach(c=>{ const el=document.querySelector(`[data-ck="${c.id}"]`); if(el){ el.className='ck '+(capDone(c)?'done':capPart(c)?'part':''); el.textContent=capDone(c)?'✓':''; } });
  const b=$('#tocbar'); if(b) b.style.width=capsDoneCount()/CAPS.length*100+'%';
  const t=$('#toccount'); if(t) t.textContent=`${capsDoneCount()}/${CAPS.length} capsules validées`;
  const cap=CAPS.find(c=>c.id===S.view.cap);
  if(cap){ const st=$('#capstatus'); if(st) st.innerHTML = capDone(cap)?'<b style="color:var(--ok)">✓ Capsule validée</b>':'<span class="muted">Réponds juste à toutes les questions'+(cap.ex?' et termine l’exercice':'')+'</span>';
    const ch=$('#exchip'); if(ch){ ch.classList.toggle('ok',exOk(cap)); ch.textContent=(exOk(cap)?'✓ ':'')+ch.textContent.replace(/^✓ /,''); } }
}
let clock=null;
function startClock(){ clearInterval(clock); clock=setInterval(()=>{ if(S.view.page==='player'){ S.prog.sec+=10; if(S.prog.sec%60===0) save(); } else clearInterval(clock); },10000); }

/* ---------- feu vert ---------- */
function fvHTML(){
  const all=FEUVERT.every(x=>feuVert(x.k));
  return `<div class="cap-body"><div class="kicker">Avant d'entrer à l'atelier</div><h2>Feu vert pour le TP É03 — Relais, cinq exercices progressifs</h2>
    <p class="muted">La liste « Ce que l'élève doit maîtriser avant d'entrer au TP É03 » du cours. Chaque point se valide tout seul quand l'activité correspondante est réussie.</p>
    <div class="bigflag ${all?'ok':''}" style="margin:14px 0"><span class="lamp"></span><div><b style="font-size:17px">${all?'Feu vert : tu es prêt pour le TP É03':'Pas encore prêt'}</b><div class="small muted">${FEUVERT.filter(x=>feuVert(x.k)).length}/6 prérequis validés · ton prof le voit dans son tableau de bord</div></div></div>
    <div class="fv">${FEUVERT.map(x=>`<div class="it ${feuVert(x.k)?'ok':''}"><span class="lamp"></span><span>${x.t}</span><span class="src">${x.src}${x.cap&&!feuVert(x.k)?`<br><button class="revoir btn sm ghost" style="padding:2px 0" data-goto="${x.cap}">y aller →</button>`:''}</span></div>`).join('')}</div>
    <div class="card pad" style="margin-top:16px;border-color:var(--tp)"><div class="row between wrap"><div><div class="kicker" style="color:var(--tp)">Module Banc de câblage</div><b>Exercice : câbler le circuit à auto-maintien de la figure 2.25, sans modèle</b>
      <div class="small muted">Entraîne-toi sur le Banc de câblage ou sur le panneau de l'atelier : c'est ton prof qui valide ce point quand ton câblage fonctionne.</div></div>
      ${S.prog.banc?`<span class="chip ok">✓ Validé par ton prof</span>`:`<button class="btn" data-banc style="border-color:var(--tp);color:var(--tp)">Voir le schéma à câbler</button>`}</div></div></div>`;
}
function bindFV(m){
  m.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>openCap(b.dataset.goto));
  const b=m.querySelector('[data-banc]'); if(b) b.onclick=()=>{
    modal('Schéma à câbler — circuit à auto-maintien', `<p>S0, S1, S2, KA1 et son contact 13-14, fils 1 à 5. Câble-le sans modèle, puis montre-le à ton prof.</p><div class="figure">${staticSchema()}</div>`);
  };
}

/* ---------------- Outils ---------------- */
const MODULES = {
  cours:{t:'Cours',k:'Ce que tu vois ici',d:'Capsules animées, vérifications, tests, feu vert TP et suivi du prof.',c:'var(--elec)'},
  dossier:{t:'Dossier TP',k:'Module existant',d:'Schéma de principe, unifilaire et de câblage, bon de commande avec catalogue, liste d’outillage, photo du schéma fait à la main.',c:'var(--tp)'},
  banc:{t:'Banc de câblage',k:'Module existant',d:'Simulateur de câblage : l’élève câble un schéma et le teste. Un chapitre peut l’ouvrir avec un exercice préchargé, et le résultat remonte au tableau de bord.',c:'var(--amber)'},
  arduino:{t:'Labo Arduino',k:'Module existant',d:'Simulateur d’électronique et d’Arduino, pour les parties électronique et programmation.',c:'var(--meca)'},
};
function pageOutils(){
  return `<div class="page-head"><div><div class="kicker">Une seule connexion</div><h1>Outils</h1><p class="muted small">Chaque module reste un projet séparé : on peut le modifier sans toucher aux autres, et il ne se charge que quand on l'ouvre.</p></div></div>
  <div class="grid g2">${Object.entries(MODULES).map(([k,m])=>`<div class="card pad" style="border-top:4px solid ${m.c}"><div class="kicker">${m.k}</div><h2 style="margin:4px 0 8px">${m.t}</h2><p class="small">${m.d}</p>${k==='cours'?'':`<button class="btn sm" data-module="${k}">Comment il s'intègre</button>`}</div>`).join('')}</div>`;
}
function moduleInfo(k){
  const m=MODULES[k];
  modal(m.t, `<p>${m.d}</p><div class="stack small">
    <div><b>Même connexion</b> — l'élève se connecte une fois avec son compte de l'école et passe d'un module à l'autre.</div>
    <div><b>Résultats partagés</b> — les exercices réussis dans le module apparaissent dans le tableau de bord du prof, à côté des tests.</div>
    <div><b>Projet séparé</b> — le module garde son propre code. Il peut évoluer, ou être proposé à d'autres écoles, indépendamment du reste.</div></div>
    <p class="small muted" style="margin-top:12px">Les modules seront branchés un par un sur la plateforme.</p>`);
}

/* ---------------- Carnet de cotes ---------------- */
const fmtD = d => d ? d.split('-').reverse().join('/') : '—';
const fmtDs = d => d ? d.slice(8,10)+'/'+d.slice(5,7) : '—';
function periodes(){ return S.carnet.periodes; }
function perOf(date){ if(!date) return null; return periodes().find(p=>date>=p.debut && date<=p.fin) || null; }
function evalsOf(key){ if(!S.carnet.evals[key]) S.carnet.evals[key]=JSON.parse(JSON.stringify(EVALS_DEF[key]||[])); return S.carnet.evals[key]; }
function epreuves(key, per){ return evalsOf(key).filter(e=>{ const p=perOf(e.date); return p && p.id===per; }); }
function carnetEleves(key){ return elevesOf(key.split('|')[0]).map(e=>e.mail); }
function rawAuto(key, ep, stud){
  const co=key.split('|')[1];
  if(co==='4-elec' && ep==='F2.3') return withProg(progOf(stud), liveTest);   // seule évaluation faite sur la plateforme pour l'instant
  return null;
}
function autoScore(key, ep, stud){
  const v=rawAuto(key,ep,stud); const e=evalsOf(key).find(x=>x.id===ep);
  if(typeof v==='number' && e && e.orig && +e.total!==+e.orig) return Math.round(v*e.total/e.orig*10)/10;
  return v;
}
function notesOf(key){ return S.notes[key] || (S.notes[key]={over:{},adj:{},locked:{}}); }
const getOver=(key,ep,stud)=>notesOf(key).over[ck(ep,stud)];
const getAdj=(key,per,stud)=>notesOf(key).adj[ck(per,stud)]||'';
const isLocked=(key,per)=>!!notesOf(key).locked[per];
function effScore(key,per,ep,stud){ const o=getOver(key,ep,stud); return (o!==undefined && o!=='') ? o : autoScore(key,ep,stud); }
function rowCalc(key,per,stud){
  const eps=epreuves(key,per); let sw=0, sv=0, passed=0, counted=0;
  eps.forEach(e=>{ let v=effScore(key,per,e.id,stud); const w=+e.poids||0;
    if(v==null||v===''||v==='wait'||v==='A'||v==='D') return;
    if(v==='NR') v=0; v=+String(v).replace(',','.'); if(isNaN(v)||!+e.total) return;
    sw+=w; sv+=w*Math.min(v,e.total)/e.total; counted++; if(v>=+e.seuil) passed++; });
  if(!sw) return {pct:null, fin:null, passed, counted};
  const pct=sv/sw*100; const adj=+(getAdj(key,per,stud)||0);
  const fin=Math.max(0,Math.min(100,pct+adj));
  return {pct, adj, fin, passed, counted};
}
function coteTxt(fin){
  if(fin==null) return '—';
  const sc=S.carnet.echelle, step=+S.carnet.arrondi;
  const max = sc==='%'?100:+sc; const raw=fin/100*max; const v=Math.round(raw/step)*step;
  const s=(step<1? v.toFixed(step===0.5?1:1) : String(Math.round(v))).replace('.',',').replace(/,0$/,'');
  return sc==='%' ? `${s} %` : `${s}/${sc}`;
}
function pageCarnet(){
  const pairs=myPairs(); if(!pairs.length) return noPairs('Carnet de cotes'); if(!pairs.some(p=>p[0]===S.carnet.key)) S.carnet.key=pairs[0][0];
  if(!periodes().some(p=>p.id===S.carnet.per)) S.carnet.per=(periodes()[0]||{}).id;
  const key=S.carnet.key, per=S.carnet.per, [cl,co]=key.split('|');
  const P=periodes().find(p=>p.id===per);
  const eps=P?epreuves(key,per):[], studs=carnetEleves(key), locked=isLocked(key,per);
  const rows=studs.map(s=>({s, r:rowCalc(key,per,s)}));
  const fins=rows.map(x=>x.r.fin).filter(v=>v!=null);
  const moy=fins.length? fins.reduce((a,b)=>a+b,0)/fins.length:null;
  const all=evalsOf(key);
  const inp=(k,v,ph)=>`<input type="text" class="cin" data-over="${esc(k)}" value="${v==null||v==='wait'?'':esc(String(v).replace('.',','))}" placeholder="${ph}" ${locked?'disabled':''} style="width:58px;padding:4px 6px;text-align:center">`;
  const thSub='class="tiny" style="text-transform:none;letter-spacing:0;font-weight:600"';
  return `<div class="page-head"><div><div class="kicker">Cotes du bulletin · calculées à partir des évaluations formatives</div><h1>Carnet de cotes</h1></div>
    <div class="row wrap"><select data-ckey>${pairs.map(([k,l])=>`<option value="${k}" ${k===key?'selected':''}>${l}</option>`).join('')}</select>
    <select data-cper>${periodes().map(p=>`<option value="${p.id}" ${p.id===per?'selected':''}>${esc(p.nom)} · ${fmtDs(p.debut)} → ${fmtDs(p.fin)}</option>`).join('')}</select></div></div>
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="v">${eps.length}</div><div class="l">évaluation(s) dans cette période</div></div>
    <div class="card kpi"><div class="v">${moy==null?'—':coteTxt(moy)}</div><div class="l">moyenne de la classe</div></div>
    <div class="card kpi"><div class="v" style="color:var(--bad)">${fins.filter(v=>v<50).length}</div><div class="l">élève(s) sous 50 %</div></div>
    <div class="card kpi"><div class="v" style="font-size:18px;line-height:1.5;color:${locked?'var(--ok)':'var(--warn)'}">${locked?'Clôturée':'En cours'}</div><div class="l">${locked?'les cotes sont figées pour le bulletin':'les cotes se mettent à jour toutes seules'}</div></div></div>
  <div class="card"><div class="pad row between wrap" style="border-bottom:1px solid var(--line)"><div><h3>${cls(cl).nom} — ${COURS.find(x=>x.id===co).titre} · ${P?esc(P.nom):''}</h3><div class="small muted">${profsOf(cl,co).length>1?'Cours partagé : ':'Prof : '}${profsOf(cl,co).join(' et ')} · cote affichée ${S.carnet.echelle==='%'?'en %':'sur '+S.carnet.echelle}</div></div>
    <div class="row wrap"><button class="btn" data-ccsv ${eps.length?'':'disabled'}>⬇ Exporter pour le bulletin</button><button class="btn ${locked?'':'primary'}" data-clock>${locked?'Rouvrir la période':'Clôturer la période'}</button></div></div>
  ${eps.length?`<div class="scroll-x"><table class="t"><tr><th>Élève</th>${eps.map(e=>`<th style="text-align:center">${esc(e.id)}<div ${thSub}>/${String(e.total).replace('.',',')} · seuil ${String(e.seuil).replace('.',',')}${+e.poids!==1?` · ×${String(e.poids).replace('.',',')}`:''}</div><div class="tiny" style="text-transform:none;letter-spacing:0">${fmtDs(e.date)}</div></th>`).join('')}<th>Formatives</th><th>Ajust.</th><th>Bulletin</th><th>Réussies</th></tr>
    ${rows.length?'':`<tr><td colspan="${eps.length+5}" class="muted small" style="padding:18px 10px">Aucun élève dans cette classe pour l’instant : les élèves apparaissent ici à leur première connexion.</td></tr>`}
    ${rows.map(({s,r})=>`<tr><td>${esc(nomEl(s))}</td>
      ${eps.map(e=>{ const a=autoScore(key,e.id,s), o=getOver(key,e.id,s), v=effScore(key,per,e.id,s); const changed=o!==undefined&&o!==''&&String(o)!==String(a);
        return `<td style="text-align:center">${inp(ck(key,e.id,s), v, a==='wait'?'à corr.':'—')}${changed&&a!=null?`<div class="tiny" style="color:var(--warn)">modifié · auto : ${String(a).replace('.',',')}</div>`:''}</td>`; }).join('')}
      <td><b>${r.pct==null?'—':r.pct.toFixed(1).replace('.',',')+' %'}</b></td>
      <td><input type="text" data-adj="${esc(ck(key,per,s))}" value="${getAdj(key,per,s)}" placeholder="±" ${locked?'disabled':''} style="width:46px;padding:4px 6px;text-align:center"></td>
      <td>${r.fin==null?'<span class="cell none">—</span>':`<span class="cell ${r.fin>=50?'ok':'bad'}">${coteTxt(r.fin)}</span>`}</td>
      <td class="small">${r.counted?`${r.passed}/${r.counted}`:'—'}</td></tr>`).join('')}
  </table></div>`:`<div class="pad"><p class="muted small" style="margin:0">Aucune évaluation datée dans cette période. Ajoute-en une ou change les dates dans « Évaluations et barème » ci-dessous.</p></div>`}</div>

  <div class="card" style="margin-top:16px"><div class="pad row between wrap" style="border-bottom:1px solid var(--line)"><div><h3>Évaluations et barème — ${cls(cl).nom} ${COURS.find(x=>x.id===co).titre}</h3><p class="small muted" style="margin:4px 0 0">La date range chaque évaluation dans sa période. Si tu changes les points d'une évaluation faite sur la plateforme, les notes sont recalculées à la même proportion.</p></div>
    <button class="btn" data-eadd>+ Ajouter une évaluation</button></div>
    <div class="scroll-x"><table class="t"><tr><th>Évaluation</th><th>Date</th><th>Période</th><th>Points</th><th>Seuil</th><th>Poids</th><th>Origine</th><th></th></tr>
    ${all.map((e,i)=>{ const p=perOf(e.date); return `<tr><td><input type="text" data-ev="${i}|lib" value="${esc(e.lib)}" style="width:190px"></td>
      <td><input type="date" data-ev="${i}|date" value="${e.date||''}" style="padding:5px 6px"></td>
      <td class="small">${p?esc(p.nom):'<span class="chip warn">hors période</span>'}</td>
      <td><input type="text" data-ev="${i}|total" value="${String(e.total).replace('.',',')}" style="width:56px;text-align:center"></td>
      <td><input type="text" data-ev="${i}|seuil" value="${String(e.seuil).replace('.',',')}" style="width:56px;text-align:center"></td>
      <td><input type="text" data-ev="${i}|poids" value="${String(e.poids).replace('.',',')}" style="width:48px;text-align:center"></td>
      <td class="small">${e.src==='plateforme'?`<span class="chip elec">plateforme</span>${e.orig&&+e.orig!==+e.total?`<div class="tiny muted">sur ${e.orig} à l'origine</div>`:''}`:'<span class="chip">encodée par le prof</span>'}</td>
      <td>${e.src==='plateforme'?'':`<button class="btn sm ghost" data-edel="${i}">Supprimer</button>`}</td></tr>`; }).join('')}
    </table></div></div>

  <div class="grid g2" style="margin-top:16px">
    <div class="card pad"><div class="row between wrap"><h3>Périodes du bulletin</h3><button class="btn sm" data-padd>+ Ajouter une période</button></div>
      <p class="small muted">Communes à toute l'école : nombre, noms et dates au choix.</p>
      ${periodes().map((p,i)=>`<div class="row wrap" style="padding:6px 0;border-bottom:1px solid var(--line-2)"><input type="text" data-pe="${i}|nom" value="${esc(p.nom)}" style="width:120px"><input type="date" data-pe="${i}|debut" value="${p.debut}" style="padding:5px 6px"><span class="muted">→</span><input type="date" data-pe="${i}|fin" value="${p.fin}" style="padding:5px 6px">${p.fin<p.debut?'<span class="chip bad">dates inversées</span>':''}<button class="btn sm ghost" data-pdel="${i}" ${periodes().length<2?'disabled':''}>✕</button></div>`).join('')}
      <h3 style="margin-top:18px">Cote du bulletin</h3>
      <div class="row wrap" style="margin-top:8px"><label class="small">Afficher <select data-ech><option value="%" ${S.carnet.echelle==='%'?'selected':''}>en %</option><option value="10" ${S.carnet.echelle==='10'?'selected':''}>sur 10</option><option value="20" ${S.carnet.echelle==='20'?'selected':''}>sur 20</option></select></label>
      <label class="small">arrondi <select data-arr><option value="1" ${S.carnet.arrondi==='1'?'selected':''}>à l'unité</option><option value="0.5" ${S.carnet.arrondi==='0.5'?'selected':''}>au demi-point</option><option value="0.1" ${S.carnet.arrondi==='0.1'?'selected':''}>au dixième</option></select></label></div>
      <ul class="small" style="padding-left:18px;margin:14px 0 0">
      <li>La cote = <b>moyenne pondérée</b> des évaluations de la période (+ ajustement éventuel du prof, en points de %).</li>
      <li><b>A</b> (absent justifié) et <b>D</b> (dispensé) : ne comptent pas. <b>NR</b> (non remis) : compte 0.</li>
      <li>Une évaluation pas encore passée, ou dont les questions ouvertes ne sont pas corrigées, n'entre pas dans le calcul.</li></ul></div>
    ${co==='4-elec'?`<div class="card pad"><h3>Sommatif — validation des UAA</h3><p class="small muted">Encodé par les professeurs après l'épreuve. N'entre pas dans la cote formative.</p>
      ${studs.length?`<div class="scroll-x"><table class="t"><tr><th>Élève</th><th>UAA1<div ${thSub}>juin 4e</div></th><th>UAA2<div ${thSub}>en 5e</div></th><th>UAA3<div ${thSub}>en 5e</div></th></tr>
      ${studs.map(s=>`<tr><td class="small">${esc(nomEl(s))}</td>${['UAA1','UAA2','UAA3'].map(u=>{ const v=S.carnet.som[ck(s,u)]||''; return `<td><select data-som="${esc(ck(s,u))}" style="padding:3px 6px;font-size:13px"><option value="">—</option><option ${v==='Validée'?'selected':''}>Validée</option><option ${v==='Non validée'?'selected':''}>Non validée</option></select></td>`; }).join('')}</tr>`).join('')}
      </table></div>`:'<p class="small muted">Aucun élève dans cette classe pour l’instant.</p>'}</div>`:`<div class="card pad"><h3>À propos des TP</h3><p class="small muted">Les évaluations de TP sont encodées par le prof : barème, seuil et poids se règlent dans le tableau « Évaluations et barème ». Le feu vert reste une condition d'entrée à l'atelier, il n'est pas coté.</p></div>`}
  </div>`;
}
function bindCarnet(m){
  const rer=()=>{ const s=window.scrollY; savePrefs(); render(); window.scrollTo(0,s); };
  const num=v=>+String(v).trim().replace(',','.');
  const key=S.carnet.key;
  const k=m.querySelector('[data-ckey]'); if(k) k.onchange=()=>{ S.carnet.key=k.value; rer(); };
  const p=m.querySelector('[data-cper]'); if(p) p.onchange=()=>{ S.carnet.per=p.value; rer(); };
  m.querySelectorAll('[data-over]').forEach(i=>i.onchange=async()=>{ let v=i.value.trim().toUpperCase().replace(',','.');
    if(v!=='' && !['A','D','NR'].includes(v) && isNaN(+v)){ toast('Une note, ou A, D, NR'); i.value=''; return; }
    v = v===''? '' : (['A','D','NR'].includes(v)? v : String(+v));
    const [kk,cc,ev,mail]=i.dataset.over.split('|'), N=notesOf(key);
    if(v==='') delete N.over[ck(ev,mail)]; else N.over[ck(ev,mail)]=v; rer();
    await act('setNote',{key, kind:'over', ev, mail, v}); });
  m.querySelectorAll('[data-adj]').forEach(i=>i.onchange=async()=>{ const v=i.value.trim().replace(',','.'); if(v!==''&&isNaN(+v)){ toast('Ajustement : un nombre, par exemple +3 ou -2'); return; }
    const parts=i.dataset.adj.split('|'), mail=parts.pop(), per=parts.pop(), N=notesOf(key);
    if(v==='') delete N.adj[ck(per,mail)]; else N.adj[ck(per,mail)]=v; rer();
    await act('setNote',{key, kind:'adj', per, mail, v}); });
  m.querySelectorAll('[data-som]').forEach(s=>s.onchange=async()=>{ S.carnet.som[s.dataset.som]=s.value; const [mail,uaa]=s.dataset.som.split('|'); await act('setSom',{mail,uaa,v:s.value},'Validation enregistrée'); });
  const lk=m.querySelector('[data-clock]'); if(lk) lk.onclick=async()=>{ const N=notesOf(key), per=S.carnet.per; N.locked[per]=!N.locked[per]; rer(); await act('setNote',{key, kind:'lock', per, v:N.locked[per]}, N.locked[per]?'Période clôturée : les cotes sont figées':'Période rouverte'); };
  const ex=m.querySelector('[data-ccsv]'); if(ex) ex.onclick=exportCarnet;
  const ev=evalsOf(key); const pushEvals=()=>act('setEvals',{key, evals:ev});
  m.querySelectorAll('[data-ev]').forEach(i=>i.onchange=()=>{ const [idx,f]=i.dataset.ev.split('|'); const e=ev[+idx];
    if(['total','seuil','poids'].includes(f)){ const v=num(i.value); if(isNaN(v)||v<0||(f==='total'&&v===0)){ toast('Nombre invalide'); i.value=e[f]; return; } e[f]=v; if(f==='total'&&+e.seuil>v) e.seuil=v; }
    else e[f]=i.value;
    rer(); pushEvals(); });
  m.querySelectorAll('[data-edel]').forEach(b=>b.onclick=()=>{ if(!confirm('Supprimer cette évaluation et ses notes ?')) return; ev.splice(+b.dataset.edel,1); rer(); pushEvals(); });
  m.querySelector('[data-eadd]').onclick=()=>{ const P=periodes().find(x=>x.id===S.carnet.per); const today=new Date().toISOString().slice(0,10);
    const d = P && today>=P.debut && today<=P.fin ? today : (P?P.debut:today);
    ev.push({ id:'Év'+Date.now().toString(36).slice(-4), lib:'Nouvelle évaluation', total:20, seuil:10, poids:1, date:d, src:'manuel' }); rer(); pushEvals(); toast('Évaluation ajoutée : encode les notes dans le tableau'); };
  const pushPer=()=>act('setPeriodes',{periodes:periodes()});
  m.querySelectorAll('[data-pe]').forEach(i=>i.onchange=()=>{ const [idx,f]=i.dataset.pe.split('|'); periodes()[+idx][f]=i.value; rer(); pushPer(); });
  m.querySelectorAll('[data-pdel]').forEach(b=>b.onclick=()=>{ const ps=periodes(); if(ps.length<2) return; const [x]=ps.splice(+b.dataset.pdel,1); if(S.carnet.per===x.id) S.carnet.per=ps[0].id; rer(); pushPer(); });
  m.querySelector('[data-padd]').onclick=()=>{ const ps=periodes(); const last=ps[ps.length-1]; const id='p'+Date.now().toString(36);
    ps.push({ id, nom:'Période '+(ps.length+1), debut:last?last.fin:'', fin:last?last.fin:'' }); rer(); pushPer(); };
  m.querySelector('[data-ech]').onchange=e=>{ S.carnet.echelle=e.target.value; rer(); };
  m.querySelector('[data-arr]').onchange=e=>{ S.carnet.arrondi=e.target.value; rer(); };
}
function exportCarnet(){
  const key=S.carnet.key, per=S.carnet.per, eps=epreuves(key,per), [cl,co]=key.split('|'), P=periodes().find(p=>p.id===per);
  const head=['Élève','Adresse',...eps.map(e=>`${e.id} /${e.total}`),'Formatives %','Ajustement',`Cote bulletin (${S.carnet.echelle==='%'?'%':'/'+S.carnet.echelle})`];
  const rows=carnetEleves(key).map(s=>{ const r=rowCalc(key,per,s); return [nomEl(s),s,...eps.map(e=>{ const v=effScore(key,per,e.id,s); return v==null||v==='wait'?'':String(v).replace('.',','); }), r.pct==null?'':r.pct.toFixed(1).replace('.',','), getAdj(key,per,s), r.fin==null?'':coteTxt(r.fin).replace(/\s?%|\/\d+$/,'')]; });
  const txt='﻿'+[head].concat(rows).map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/csv'})); a.download=`cotes-${cls(cl).nom}-${COURS.find(x=>x.id===co).titre}-${P.nom}.csv`.replace(/\s+/g,'-'); a.click();
  toast('Cotes exportées pour le bulletin');
}

/* ---------------- Stages ---------------- */
const weeksOf=(a,b)=>{ if(!a||!b) return 0; const d=(new Date(b)-new Date(a))/864e5+1; return Math.round((d+2)/7); };
const HL_COLORS=['#1d5fc4','#25844f','#e8a200','#c9372c','#7a4fc0','#0e8a8a'];
function myHL(){ return (S.stage.colors||{})[ME] || HL_COLORS[2]; }
function stagePers(annee){ return S.stage.periodes.filter(p=>p.annee===annee); }
function stageEleves(clId){ return elevesOf(clId).map(e=>e.mail); }
function affOf_(per,mail){ return (S.stage.aff[per]||{})[mail]||{}; }
function lieu(id){ return S.stage.lieux.find(l=>l.id===id); }
function pageStages(){
  const st=S.stage; const c=cls(st.cl); const pers=stagePers(c.annee);
  if(!pers.some(p=>p.id===st.per)) st.per=(pers[0]||{}).id;
  const P=pers.find(p=>p.id===st.per); const studs=stageEleves(c.id);
  const A=s=>affOf_(st.per,s);
  const placed=studs.filter(s=>A(s).lieu).length, conv=studs.filter(s=>A(s).conv).length, vis=studs.filter(s=>A(s).visite).length;
  return `<div class="page-head"><div><div class="kicker">4e : 1 × 2 semaines · 5e : 2 × 2 semaines · 6e : 2 × 3 semaines</div><h1>Stages</h1></div>
    <div class="row wrap"><select data-scl>${CLASSES.filter(x=>x.annee>=4).map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${x.nom}</option>`).join('')}</select>
    <select data-sper>${pers.map(p=>`<option value="${p.id}" ${p.id===st.per?'selected':''}>${esc(p.nom)} · ${fmtDs(p.debut)} → ${fmtDs(p.fin)}</option>`).join('')}</select></div></div>
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="v">${studs.length?placed+'/'+studs.length:'—'}</div><div class="l">élèves avec un lieu de stage</div></div>
    <div class="card kpi"><div class="v">${studs.length?conv+'/'+studs.length:'—'}</div><div class="l">conventions signées</div></div>
    <div class="card kpi"><div class="v">${studs.length?vis+'/'+studs.length:'—'}</div><div class="l">visites planifiées · dont <b>${studs.filter(s=>A(s).prof===ME).length}</b> pour toi</div></div>
    <div class="card kpi"><div class="v">${st.lieux.length}</div><div class="l">lieux de stage enregistrés</div></div></div>
  <div class="card"><div class="pad row between wrap" style="border-bottom:1px solid var(--line)"><div><h3>${c.nom} — ${P?esc(P.nom):''}</h3><p class="small muted" style="margin:4px 0 0">${P?`Du ${fmtD(P.debut)} au ${fmtD(P.fin)} · ${weeksOf(P.debut,P.fin)} semaines`:''}</p></div><button class="btn" data-scsv ${studs.length?'':'disabled'}>⬇ Exporter la liste</button></div>
    ${studs.length?`<div class="pad row wrap" style="gap:14px;border-bottom:1px solid var(--line);padding-top:10px;padding-bottom:10px">
      <span class="small"><b>Mes élèves</b> (visites attribuées à ${ME}) en surbrillance :</span>
      <span class="row" style="gap:6px">${HL_COLORS.map(c=>`<button class="swatch ${c===myHL()?'on':''}" data-hl="${c}" style="background:${c}" aria-label="Couleur ${c}"></button>`).join('')}<label class="swatch" style="background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red);cursor:pointer" title="Autre couleur"><input type="color" data-hlpick value="${myHL()}" style="opacity:0;width:0;height:0;border:0;padding:0"></label></span>
      <label class="chk small"><input type="checkbox" data-mine ${st.onlyMine?'checked':''}>Afficher seulement mes élèves</label>
      <span class="small muted">${studs.filter(x=>A(x).prof===ME).length} élève(s) pour toi</span></div>
    <div class="scroll-x"><table class="t"><tr><th>Élève</th><th>Tél. élève</th><th>Lieu de stage</th><th>Tuteur</th><th>Tél. entreprise</th><th>Prof visiteur</th><th>Convention</th><th>Date de visite</th><th>Appréciation</th><th>Journal</th></tr>
    ${studs.filter(s=>!st.onlyMine||A(s).prof===ME).map(s=>{ const a=A(s), l=lieu(a.lieu); const ok=l && (!l.fil.length || l.fil.includes(c.fil)); const mine=a.prof===ME;
      return `<tr class="${mine?'mine':''}" ${mine?`style="--hl:${myHL()}"`:''}><td style="white-space:nowrap">${esc(nomEl(s))}${mine?'<div class="tiny" style="color:var(--hl);font-weight:700">ma visite</div>':''}</td>
      <td><input type="tel" data-stel="${esc(s)}" value="${esc((st.tel||{})[s]||'')}" placeholder="04.. .. .. .." style="width:120px"></td>
      <td><select data-saff="${esc(ck(st.per,s))}|lieu" style="max-width:230px"><option value="">— à trouver —</option>${st.lieux.map(x=>`<option value="${x.id}" ${x.id===a.lieu?'selected':''}>${esc(x.nom)} (${esc(x.localite)})</option>`).join('')}</select>${l&&!ok?'<div class="tiny" style="color:var(--warn)">ce lieu n’accueille pas cette filière</div>':''}</td>
      <td class="small">${l?esc(l.tuteur):'—'}</td>
      <td class="small" style="white-space:nowrap">${l?(l.tel?`<a href="tel:${esc(l.tel.replace(/\s/g,''))}">${esc(l.tel)}</a>`:'<span class="muted">à compléter</span>'):'—'}</td>
      <td><select data-saff="${esc(ck(st.per,s))}|prof"><option value="">— à attribuer —</option>${S.access.profs.map(p=>`<option ${a.prof===p.nom?'selected':''}>${esc(p.nom)}</option>`).join('')}</select></td>
      <td><input type="checkbox" data-saff="${esc(ck(st.per,s))}|conv" ${a.conv?'checked':''} style="width:18px;height:18px;accent-color:var(--ok)"></td>
      <td><input type="date" data-saff="${esc(ck(st.per,s))}|visite" value="${a.visite||''}" style="padding:4px 6px"></td>
      <td><select data-saff="${esc(ck(st.per,s))}|app"><option value="">—</option>${['Très bien','Bien','Satisfaisant','Insuffisant'].map(v=>`<option ${a.app===v?'selected':''}>${v}</option>`).join('')}</select></td>
      <td style="white-space:nowrap">${(()=>{ const js=journalStats(st.per,s); return `<button class="btn sm" data-journal="${esc(ck(st.per,s))}">${js.filled}/${js.days.length} jours</button>${js.unseen?` <span class="chip warn">${js.unseen} à lire</span>`:''}`; })()}</td></tr>`; }).join('')}
    </table></div>`:`<div class="pad"><p class="small muted" style="margin:0">Aucun élève dans cette classe pour l’instant : ils apparaissent à leur première connexion.</p></div>`}</div>

  <div class="card" style="margin-top:16px"><div class="pad row between wrap" style="border-bottom:1px solid var(--line)"><div><h3>Lieux de stage</h3><p class="small muted" style="margin:4px 0 0">Le carnet d'adresses de la section, partagé par tous les profs.</p></div><button class="btn" data-ladd>+ Ajouter un lieu</button></div>
    <div class="scroll-x"><table class="t"><tr><th>Entreprise</th><th>Localité</th><th>Secteur</th><th>Tuteur</th><th>Téléphone</th><th>Adresse mail</th><th>Filières</th><th>Élèves</th><th></th></tr>
    ${st.lieux.map((l,i)=>{ const n=Object.values(st.aff).reduce((t,per)=>t+Object.values(per).filter(a=>a.lieu===l.id).length,0); const f=(k,w)=>`<input type="text" data-lieu="${i}|${k}" value="${esc(l[k]||'')}" style="width:${w}px">`;
      return `<tr><td>${f('nom',170)}${l.note?`<div class="tiny muted">${esc(l.note)}</div>`:''}</td><td>${f('localite',120)}</td><td>${f('secteur',170)}</td><td>${f('tuteur',130)}</td><td>${f('tel',110)}</td><td>${f('mail',170)}</td>
      <td class="small" style="white-space:nowrap">${['eqem','eqmm'].map(x=>`<label style="margin-right:8px"><input type="checkbox" data-lfil="${i}|${x}" ${l.fil.includes(x)?'checked':''}> ${fil(x).code}</label>`).join('')}</td>
      <td class="small">${n}</td><td><button class="btn sm ghost" data-ldel="${i}" ${n?'disabled title="Des élèves y sont placés"':''}>Supprimer</button></td></tr>`; }).join('')}
    </table></div></div>

  <div class="card" style="margin-top:16px"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>Périodes de stage</h3><p class="small muted" style="margin:4px 0 0">Les dates se règlent ici pour toute l'année. La durée est vérifiée par rapport à la règle de chaque année.</p></div>
    <div class="scroll-x"><table class="t"><tr><th>Année</th><th>Stage</th><th>Début</th><th>Fin</th><th>Durée</th><th>Règle</th></tr>
    ${[4,5,6].flatMap(an=>stagePers(an).map(p=>{ const i=st.periodes.indexOf(p), w=weeksOf(p.debut,p.fin), R=STAGE_REGLE[an];
      return `<tr><td><b>${an}e</b></td><td><input type="text" data-sp="${i}|nom" value="${esc(p.nom)}" style="width:150px"></td><td><input type="date" data-sp="${i}|debut" value="${p.debut}" style="padding:4px 6px"></td><td><input type="date" data-sp="${i}|fin" value="${p.fin}" style="padding:4px 6px"></td>
      <td>${w===R.sem?`<span class="chip ok">${w} semaines</span>`:`<span class="chip warn">${w} semaine${w>1?'s':''} — attendu ${R.sem}</span>`}</td><td class="small muted">${R.n} × ${R.sem} semaines</td></tr>`; })).join('')}
    </table></div></div>`;
}
function bindStages(m){
  const st=S.stage; const rer=()=>{ const y=window.scrollY; savePrefs(); render(); window.scrollTo(0,y); };
  m.querySelector('[data-scl]').onchange=e=>{ st.cl=e.target.value; st.per=null; rer(); };
  const sp=m.querySelector('[data-sper]'); if(sp) sp.onchange=e=>{ st.per=e.target.value; rer(); };
  m.querySelectorAll('[data-saff]').forEach(i=>i.onchange=async()=>{ const parts=i.dataset.saff.split('|'); const field=parts.pop(); const mail=parts.pop(); const per=parts.join('|');
    const v = i.type==='checkbox'? i.checked : i.value; const P=st.aff[per]||(st.aff[per]={}); const a=P[mail]||(P[mail]={}); a[field]=v; rer();
    await act('stageAff',{per, mail, field, v}); });
  const pushLieux=()=>act('setLieux',{lieux:st.lieux});
  m.querySelectorAll('[data-lieu]').forEach(i=>i.onchange=()=>{ const [idx,f]=i.dataset.lieu.split('|'); st.lieux[+idx][f]=i.value; if(f!=='note') st.lieux[+idx].note=''; rer(); pushLieux(); });
  m.querySelectorAll('[data-lfil]').forEach(i=>i.onchange=()=>{ const [idx,f]=i.dataset.lfil.split('|'); const L=st.lieux[+idx]; L.fil = i.checked? [...new Set([...L.fil,f])] : L.fil.filter(x=>x!==f); rer(); pushLieux(); });
  m.querySelectorAll('[data-ldel]').forEach(b=>b.onclick=()=>{ if(!confirm('Supprimer ce lieu de stage ?')) return; st.lieux.splice(+b.dataset.ldel,1); rer(); pushLieux(); });
  m.querySelector('[data-ladd]').onclick=()=>{ st.lieux.push({ id:'l'+Date.now().toString(36), nom:'Nouvelle entreprise', localite:'', secteur:'', tuteur:'', tel:'', mail:'', fil:['eqem','eqmm'], note:'' }); rer(); pushLieux(); toast('Lieu ajouté : complète la ligne'); };
  m.querySelectorAll('[data-sp]').forEach(i=>i.onchange=()=>{ const [idx,f]=i.dataset.sp.split('|'); st.periodes[+idx][f]=i.value; rer(); act('setStagePeriodes',{periodes:st.periodes}); });
  m.querySelectorAll('[data-hl]').forEach(b=>b.onclick=()=>{ (st.colors||(st.colors={}))[ME]=b.dataset.hl; rer(); });
  const hp=m.querySelector('[data-hlpick]'); if(hp) hp.onchange=()=>{ (st.colors||(st.colors={}))[ME]=hp.value; rer(); };
  const mi=m.querySelector('[data-mine]'); if(mi) mi.onchange=()=>{ st.onlyMine=mi.checked; rer(); };
  m.querySelectorAll('[data-stel]').forEach(i=>i.onchange=async()=>{ (st.tel||(st.tel={}))[i.dataset.stel]=i.value.trim(); await act('stageTel',{mail:i.dataset.stel, tel:i.value.trim()},'Numéro enregistré'); });
  const ex=m.querySelector('[data-scsv]'); if(ex) ex.onclick=()=>{ const c=cls(st.cl), P=st.periodes.find(p=>p.id===st.per);
    const rows=[['Élève','Adresse','Tél. élève','Classe','Stage','Du','Au','Entreprise','Localité','Tuteur','Tél. entreprise','Mail entreprise','Prof visiteur','Convention','Date de visite','Appréciation']].concat(stageEleves(c.id).map(s=>{ const a=affOf_(st.per,s), l=lieu(a.lieu)||{};
      return [nomEl(s),s,(st.tel||{})[s]||'',c.nom,P.nom,fmtD(P.debut),fmtD(P.fin),l.nom||'',l.localite||'',l.tuteur||'',l.tel||'',l.mail||'',a.prof||'',a.conv?'signée':'',a.visite?fmtD(a.visite):'',a.app||'']; }));
    const txt='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/csv'})); a.download=`stages-${c.nom}-${P.nom}.csv`.replace(/\s+/g,'-'); a.click(); toast('Liste des stages exportée'); };
}
function pageMonStage(){
  const c=cls(S.eleveClass); const pers=stagePers(c.annee); const me=S.me.mail;
  const head=`<div class="page-head"><div><div class="kicker">${c.nom}${STAGE_REGLE[c.annee]?` · ${STAGE_REGLE[c.annee].n} × ${STAGE_REGLE[c.annee].sem} semaines`:''}</div><h1>Mon stage</h1></div></div>`;
  if(!pers.length) return head+`<div class="card pad"><p class="muted" style="margin:0">Pas de stage prévu pour ta classe.</p></div>`;
  return head+`<div class="stack">${pers.map(p=>{ const a=affOf_(p.id,isProf()?'':me), l=lieu(a.lieu); const js=journalStats(p.id,me);
    return `<div class="card pad"><div class="row between wrap"><div><h3>${esc(p.nom)}</h3><div class="small muted">du ${fmtD(p.debut)} au ${fmtD(p.fin)} · ${weeksOf(p.debut,p.fin)} semaines</div></div>
      <button class="btn primary" data-journal="${p.id}" ${isProf()?'disabled title="Disponible pour les élèves"':''}>Mon journal de stage · ${js.filled}/${js.days.length} jours</button></div>
      <div class="grid g2" style="margin-top:12px">
        <div class="small">${l?`<div class="kicker">Lieu de stage</div><b>${esc(l.nom)}</b> · ${esc(l.localite)}<div class="muted">${esc(l.secteur||'')}</div><div style="margin-top:6px">Tuteur : <b>${esc(l.tuteur||'—')}</b>${l.tel?` · <a href="tel:${esc(l.tel.replace(/\s/g,''))}">${esc(l.tel)}</a>`:''}${l.mail?` · ${esc(l.mail)}`:''}</div>`:'<span class="chip warn">lieu de stage à trouver</span>'}</div>
        <div class="small"><div class="kicker">Suivi</div>${a.conv?'<span class="chip ok">convention signée</span>':'<span class="chip warn">convention à signer</span>'}${a.prof?`<div style="margin-top:6px">Visite : <b>${esc(a.prof)}</b>${a.visite?' le '+fmtD(a.visite):''}</div>`:''}</div></div></div>`; }).join('')}
    <div class="card pad"><label class="small"><b>Mon numéro de téléphone</b> <span class="muted">(pour que l'école puisse te joindre pendant le stage)</span><br>
      <input type="tel" data-mytel value="${esc((S.stage.tel||{})[me]||'')}" placeholder="04.. .. .. .." style="width:200px;margin-top:6px" ${isProf()?'disabled':''}></label></div></div>`;
}
/* ---------------- Journal de stage ---------------- */
const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
function workDays(a,b){ const out=[]; if(!a||!b) return out; const d=new Date(a+'T12:00:00'), e=new Date(b+'T12:00:00');
  while(d<=e){ const w=d.getDay(); if(w>0&&w<6) out.push(d.toISOString().slice(0,10)); d.setDate(d.getDate()+1); } return out; }
function dayDone(e){ if(!e) return false; if(e.pres==='ferie') return true; if(e.pres==='absent') return !!(e.motif && (e.just||'').trim()); return !!(e.act||'').trim(); }
const MOTIFS=['Maladie (certificat médical)','Raison familiale','Rendez-vous médical','Entreprise fermée','Autre'];
function journalOf(per,stud){ const J=S.stage.journal||(S.stage.journal={}); const k=ck(per,stud); return J[k]||(J[k]={}); }
function journalStats(per,stud){ const P=S.stage.periodes.find(p=>p.id===per); const days=P?workDays(P.debut,P.fin):[]; const J=(S.stage.journal||{})[ck(per,stud)]||{};
  const filled=days.filter(d=>dayDone(J[d])).length; const unseen=days.filter(d=>dayDone(J[d]) && J[d].pres!=='ferie' && !J[d].vu).length;
  return {days, filled, unseen}; }
function openJournal(per,stud){ S.view={page:'journal', per, stud: stud||S.me.mail}; render(); window.scrollTo(0,0); }
function pageJournal(){
  const {per, stud}=S.view; const P=S.stage.periodes.find(p=>p.id===per); const prof=S.role==='prof';
  const a=affOf_(per,stud), l=lieu(a.lieu); const J=journalOf(per,stud); const {days,filled,unseen}=journalStats(per,stud);
  const hours=days.reduce((t,d)=>t+((J[d]||{}).pres==='present'||!(J[d]||{}).pres? (+String((J[d]||{}).h||0).replace(',','.')||0):0),0);
  const lbl=d=>{ const x=new Date(d+'T12:00:00'); return `${JOURS[x.getDay()]} ${fmtD(d)}`; };
  return `<div class="crumbs"><button data-jback>${prof?'Stages':'Mon stage'}</button> › Journal de stage</div>
  <div class="page-head"><div><div class="kicker">${esc(P.nom)} · du ${fmtD(P.debut)} au ${fmtD(P.fin)}</div><h1>Journal de stage${prof?' — '+esc(nomEl(stud)):''}</h1>
    <p class="muted small" style="margin-top:4px">${l?`${esc(l.nom)} · ${esc(l.localite)} · tuteur : ${esc(l.tuteur)}`:'Lieu de stage pas encore attribué'}${a.prof?` · visite : ${esc(a.prof)}`:''}</p></div>
    ${prof?`<button class="btn" data-jcsv>⬇ Exporter le journal</button>`:''}</div>
  <div class="grid g3" style="margin-bottom:16px">
    <div class="card kpi"><div class="v">${filled}/${days.length}</div><div class="l">jours remplis</div><div class="bar ${filled===days.length?'ok':''}" style="margin-top:8px"><i style="width:${days.length?filled/days.length*100:0}%"></i></div></div>
    <div class="card kpi"><div class="v">${String(hours).replace('.',',')} h</div><div class="l">heures encodées</div></div>
    <div class="card kpi"><div class="v" style="color:${unseen?'var(--warn)':'var(--ok)'}">${unseen}</div><div class="l">${prof?'jour(s) pas encore lus':'jour(s) pas encore lus par ton prof'}</div></div></div>
  ${prof?'':`<div class="note" style="margin-bottom:14px"><b>Chaque jour, note ce que tu as fait.</b>Les tâches, le matériel, les machines sur lesquelles tu as travaillé, ce que tu as appris ou ce qui t'a posé problème. Ton prof le lit et peut te répondre.</div>`}
  <div class="stack">${days.map((d,i)=>{ const e=J[d]||{}; const pres=e.pres||'present'; const done=dayDone(e); const week=i%5===0?`<div class="kicker" style="margin:${i?'10px':'0'} 0 0">Semaine ${i/5+1}</div>`:'';
    const status = pres==='ferie' ? '<span class="chip">congé / férié</span>' : done?(e.vu?'<span class="chip ok">✓ lu par le prof</span>':'<span class="chip warn">pas encore lu</span>'):'<span class="chip">à remplir</span>';
    let body='';
    if(prof){
      if(pres==='absent') body=`<div class="note bad" style="margin-top:10px"><b>Absent — ${e.motif?esc(e.motif):'motif non indiqué'}</b>${(e.just||'').trim()?esc(e.just):'<span class="muted">Pas encore de justification.</span>'}</div>`;
      else if(pres==='present') body=`<div class="grid g2" style="margin-top:10px"><div><div class="kicker">Ce que j'ai fait</div><p style="white-space:pre-wrap;margin:4px 0">${(e.act||'').trim()?esc(e.act):'<span class="muted">—</span>'}</p></div><div><div class="kicker">Appris / difficultés</div><p style="white-space:pre-wrap;margin:4px 0">${(e.appr||'').trim()?esc(e.appr):'<span class="muted">—</span>'}</p></div></div>`;
      if(pres!=='ferie') body+=`<div class="row wrap" style="margin-top:8px;align-items:flex-start"><textarea data-jf="${d}|com" placeholder="Commentaire pour l'élève (facultatif)" style="flex:1;min-height:44px">${esc(e.com||'')}</textarea><label class="chk small" style="margin-top:8px"><input type="checkbox" data-jvu="${d}" ${e.vu?'checked':''} ${done?'':'disabled'}>Lu</label></div>`;
    } else {
      if(pres==='absent') body=`<div class="grid g2" style="margin-top:10px"><label class="small"><b>Motif de l'absence</b><br><select data-jf="${d}|motif" style="width:100%;margin-top:4px"><option value="">— choisir —</option>${MOTIFS.map(x=>`<option ${e.motif===x?'selected':''}>${x}</option>`).join('')}</select></label>
          <label class="small"><b>Justification</b><textarea data-jf="${d}|just" placeholder="Explique ton absence. Si tu as un certificat, remets-le à ton prof.">${esc(e.just||'')}</textarea></label></div>
          <p class="tiny muted" style="margin:6px 0 0">Préviens aussi ton tuteur en entreprise et l'école le jour même.</p>`;
      else if(pres==='present') body=`<div class="grid g2" style="margin-top:10px"><label class="small"><b>Ce que j'ai fait</b><textarea data-jf="${d}|act" placeholder="Tâches, machines, matériel, avec qui…">${esc(e.act||'')}</textarea></label>
          <label class="small"><b>Ce que j'ai appris / ce qui m'a posé problème</b><textarea data-jf="${d}|appr" placeholder="Facultatif">${esc(e.appr||'')}</textarea></label></div>`;
      if((e.com||'').trim()) body+=`<div class="note" style="margin-top:8px"><b>Commentaire de ${esc(a.prof||'ton prof')}</b>${esc(e.com)}</div>`;
    }
    return `${week}<div class="card"><div class="pad" style="padding:14px 18px">
      <div class="row between wrap"><b style="text-transform:capitalize">${lbl(d)}</b>
        <div class="row wrap">${prof?`<span class="chip ${pres==='absent'?'bad':pres==='ferie'?'':'ok'}">${pres==='absent'?'Absent':pres==='ferie'?'Congé / férié':'Présent'}</span>${pres==='present'&&e.h?`<span class="chip">${esc(e.h)} h</span>`:''}`
          :`<select data-jf="${d}|pres"><option value="present" ${pres==='present'?'selected':''}>Présent</option><option value="absent" ${pres==='absent'?'selected':''}>Absent</option><option value="ferie" ${pres==='ferie'?'selected':''}>Congé / férié</option></select>
            ${pres==='present'?`<label class="small">Heures <input type="text" inputmode="decimal" data-jf="${d}|h" value="${esc(e.h||'')}" placeholder="8" style="width:52px;text-align:center"></label>`:''}`}
          ${status}</div></div>
      ${body}
    </div></div>`; }).join('')}</div>`;
}
function bindJournal(m){
  const {per, stud}=S.view; const J=journalOf(per,stud);
  m.querySelector('[data-jback]').onclick=()=>{ S.view={page:'home'}; render(); window.scrollTo(0,0); };
  const prof=S.role==='prof';
  m.querySelectorAll('[data-jf]').forEach(i=>{ i.onchange=()=>{ const [d,f]=i.dataset.jf.split('|'); const e=J[d]||(J[d]={});
    e[f]=i.value; if(!prof) e.vu=false; const y=window.scrollY; render(); window.scrollTo(0,y);
    if(prof) act('journalProf',{per, mail:stud, date:d, com:i.value},'Commentaire enregistré');
    else if(isProf()) toast('Aperçu : rien n’est enregistré');
    else act('journal',{per, date:d, f:{[f]:i.value}},'Journal enregistré'); }; });
  m.querySelectorAll('[data-jvu]').forEach(c=>c.onchange=()=>{ const e=J[c.dataset.jvu]||(J[c.dataset.jvu]={}); e.vu=c.checked; const y=window.scrollY; render(); window.scrollTo(0,y); act('journalProf',{per, mail:stud, date:c.dataset.jvu, vu:c.checked}); });
  const ex=m.querySelector('[data-jcsv]'); if(ex) ex.onclick=()=>{ const P=S.stage.periodes.find(p=>p.id===per);
    const rows=[['Date','Présence','Heures','Ce que j\'ai fait','Appris / difficultés','Motif d\'absence','Justification','Commentaire du prof','Lu']].concat(workDays(P.debut,P.fin).map(d=>{ const e=J[d]||{}; const ab=e.pres==='absent'; return [fmtD(d), ab?'Absent':e.pres==='ferie'?'Congé':'Présent', ab?'':(e.h||''), ab?'':(e.act||''), ab?'':(e.appr||''), ab?(e.motif||''):'', ab?(e.just||''):'', e.com||'', e.vu?'oui':'']; }));
    const txt='﻿'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/csv'})); a.download=`journal-${nomEl(stud)}-${P.nom}.csv`.replace(/\s+/g,'-'); a.click(); toast('Journal exporté'); };
}

/* ---------------- Contenus (prof) ---------------- */
function pageContenus(){
  const seen=new Set();
  const order=[['3qem',3],['eqem',4],['eqmm',4],['eqem',5],['eqmm',5],['eqem',6],['eqmm',6]];
  return `<div class="page-head"><div><div class="kicker">Suivi de la transformation des cours</div><h1>Contenus</h1><p class="muted small">Où en est chaque cours : ressources reçues, chapitres transformés, relecture.</p></div></div>
  <div class="card"><div class="scroll-x"><table class="t"><tr><th>Année</th><th>Cours</th><th>Classe(s)</th><th>Périodes</th><th>Chapitres animés</th><th>Statut</th><th></th></tr>
  ${order.flatMap(([f,a])=>coursFor(f,a)).filter(c=>{ if(seen.has(c.id)) return false; seen.add(c.id); return true; }).map(c=>{
    const cl=c.pour.map(([f,a])=>a+fil(f).code).join(' + ');
    const anim = c.statut==='demo'? `1 / 20 <span class="tiny muted">(2.3)</span>` : c.statut==='demo-tp'? `feu vert É03` : '—';
    return `<tr><td><b>${c.pour[0][1]}e</b></td><td><b>${esc(c.titre)}</b>${c.pour[0][0]==='3qem'?' <span class="chip warn">jusqu’en 2028</span>':''}</td><td class="small">${esc(cl)}</td><td>${c.per||'—'}</td><td class="small">${anim}</td><td>${statutChip(c)}</td><td>${c.statut.startsWith('demo')?`<button class="btn sm" data-open-course="${c.id}">Ouvrir</button>`:''}</td></tr>`; }).join('')}
  </table></div></div>
  <div class="grid g3" style="margin-top:16px">
    <div class="card pad"><div class="kicker">Étape 1</div><h3 style="margin:4px 0">Les ressources</h3><p class="small">Chaque prof transmet ses notes, évaluations, corrigés et photos de l'atelier au coordinateur.</p></div>
    <div class="card pad"><div class="kicker">Étape 2</div><h3 style="margin:4px 0">La transformation</h3><p class="small">Chapitre par chapitre : capsules, animations, vérifications, évaluation formative, feu vert TP.</p></div>
    <div class="card pad"><div class="kicker">Étape 3</div><h3 style="margin:4px 0">La relecture</h3><p class="small">Le prof du cours relit en vue prof et signale les erreurs. Rien n'est publié sans son accord.</p></div></div>`;
}
function bindContenus(){}


/* ---------- lecteur des chapitres décrits par données (2.1, 2.2…) ---------- */
function pagePlayerD(ch, capId){
  const L=ch.caps, n=L.filter(capDone).length, syn='syn:'+ch.num, open=typeof fcorOpen==='function'&&fcorOpen(ch.num);
  const toc=L.map(c=>`<button class="item ${capId===c.id?'on':''}" data-cap="${c.id}"><span class="ck ${capDone(c)?'done':capPart(c)?'part':''}" data-ck="${c.id}">${capDone(c)?'✓':''}</span><span><span class="tiny muted">${c.sec}</span><br>${c.t}</span></button>`).join('');
  return `<div class="crumbs"><button data-back="home">${S.role==='prof'?'Contenus':'Mes cours'}</button> › <button data-back="course">Électricité 4e</button> › ${ch.num} ${ch.titre}</div>
  <div class="player">
    <aside class="card toc" style="padding:10px">
      <div style="padding:6px 10px 10px"><div class="kicker">Chapitre ${ch.num}</div><b>${ch.titre}</b>
        <div class="bar ${n===L.length?'ok':''}" style="margin-top:8px"><i id="tocbar" style="width:${n/L.length*100}%"></i></div>
        <div class="tiny muted" id="toccount" style="margin-top:4px">${n}/${L.length} capsules validées</div></div>
      ${toc}
      <div class="sep">Terminer</div>
      <button class="item ${capId===syn?'on':''}" data-cap="${syn}"><span class="ck ${open?'done':''}">${open?'✓':''}</span><span>Synthèse et évaluation<br><span class="tiny muted">prérequis du TP ${ch.tp} · formative ${ch.num}</span></span></button>
    </aside>
    <section class="card cap fade-in" id="capcard">${capId===syn?synHTML(ch.num):capHTML(capId)}</section>
  </div>`;
}
