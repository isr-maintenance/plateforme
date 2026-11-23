/* =========================================================
   PAGES — accueil, suivi, accès, administration
   ========================================================= */

/* ---------------- Accueil ---------------- */
function pagePresentation(){
  const eleve = S.role==='eleve';
  const head = `<div class="page-head"><div><div class="kicker">${esc(CONFIG.ECOLE)} · 2026-2027</div><h1>${eleve?`Bonjour ${esc(S.me.nom.split(' ')[0])}`:'Plateforme des cours techniques'}</h1>
    <p class="muted" style="max-width:780px;margin-top:6px">${eleve?'Tes cours, tes évaluations et ton stage au même endroit. Avance à ton rythme : chaque capsule se termine par une vérification, et ton prof voit où tu en es.':'Les cours de la 4e à la 6e EQEM et EQMM, plus la 3QEM jusqu’à sa disparition. Suivi des élèves, cotes du bulletin et stages.'}</p></div></div>`;
  if(eleve){
    const c=cls(S.eleveClass); const list=coursFor(c.fil,c.annee);
    return head+`<div class="grid g3">${list.map(courseCard).join('')}</div>
      <div class="grid g2" style="margin-top:18px"><button class="ccard tp" data-go="monstage"><span class="kicker">Stage</span><span class="t1">Mon stage et mon journal</span><span class="small muted">Lieu, dates, tuteur, et ce que tu fais chaque jour.</span></button>
      <button class="ccard" data-go="biblio"><span class="kicker">Bibliothèque</span><span class="t1">Les cours en PDF</span><span class="small muted">Rangés par année et par filière.</span></button></div>`;
  }
  const mine=myPairs();
  return head+`<div class="grid g4" style="margin-bottom:18px">
    <div class="card kpi"><div class="v">${Object.keys(S.eleves).length}</div><div class="l">élèves connectés au moins une fois</div></div>
    <div class="card kpi"><div class="v">${mine.length}</div><div class="l">cours qui te sont attribués</div></div>
    <div class="card kpi"><div class="v">${Object.values(S.progs).filter(p=>p&&p.test&&p.test.submitted&&TEST.some(q=>q.type==='open'&&(p.test.open||{})[q.id]==null)).length}</div><div class="l">évaluation(s) à corriger</div></div>
    <div class="card kpi"><div class="v">${S.access.profs.length}</div><div class="l">professeurs enregistrés</div></div></div>
  ${mine.length?'':`<div class="note warn" style="margin-bottom:16px"><b>Aucun cours ne t’est encore attribué.</b>${isCoord()?'Va dans Admin › « Qui donne quel cours ».':'Demande au coordinateur de t’attribuer tes cours.'}</div>`}
  <div class="card pad">
    <div class="row between wrap" style="margin-bottom:14px"><h2>La carte des cours</h2>
      <div class="legend"><span><i class="dot" style="color:var(--elec)"></i>Électricité</span><span><i class="dot" style="color:var(--meca)"></i>Mécanique</span><span><i class="dot" style="color:var(--tp)"></i>Pratique</span><span><span class="chip ok" style="padding:0 6px">en ligne</span> contenu disponible</span></div></div>
    <div class="map">
      <div></div><div class="kicker" style="color:var(--elec)">EQEM — ${fil('eqem').nom}</div><div class="kicker" style="color:var(--meca)">EQMM — ${fil('eqmm').nom}</div>
      <div class="yr">3e<small>jusqu'en 2028</small></div><div class="span2">${lane('3qem',3,'Électromécanique — 3 groupes de TP, 2 groupes de CT','dernière année : 2027-2028')}</div>
      <div class="yr">4e<small>socle commun</small></div>${lane('eqem',4,'Électricien MI')}${lane('eqmm',4,'Mécanicien MI')}
      <div class="yr">5e</div>${lane('eqem',5,'Électricien MI')}${lane('eqmm',5,'Mécanicien MI')}
      <div class="yr">6e</div>${lane('eqem',6,'Électricien MI')}${lane('eqmm',6,'Mécanicien MI')}
    </div></div>
  <div class="grid g4" style="margin-top:18px">
    <button class="ccard" data-try="dash"><span class="kicker">Suivi</span><span class="t1">Où en sont mes élèves</span><span class="small muted">Capsules, évaluations, feu vert TP.</span></button>
    <button class="ccard meca" data-try="carnet"><span class="kicker">Cotes</span><span class="t1">Carnet de cotes</span><span class="small muted">La cote du bulletin à partir des formatives.</span></button>
    <button class="ccard tp" data-try="stages"><span class="kicker">Stages</span><span class="t1">Lieux, visites, journaux</span><span class="small muted">Tes élèves en surbrillance.</span></button>
    <button class="ccard" data-try="relais"><span class="kicker">Aperçu élève</span><span class="t1">Chapitre 2.3 — Le relais</span><span class="small muted">Comme le voient les élèves.</span></button>
  </div>`;
}

/* ---------------- Suivi (prof) ---------------- */
function myPairs(){
  const order=c=>CLASSES.findIndex(x=>x.id===c);
  return AFFECT.filter(x=>x.profs.includes(ME) && coursDe(cls(x.cl)).some(co=>co.id===x.c)).sort((a,b)=>order(a.cl)-order(b.cl)).map(x=>[x.cl+'|'+x.c, `${cls(x.cl).nom} — ${(COURS.find(c=>c.id===x.c)||{titre:x.c}).titre}`]);
}
function noPairs(title){ return `<div class="page-head"><div><h1>${title}</h1></div></div><div class="card pad"><h3>Aucun cours ne t’est attribué</h3><p class="muted">${isCoord()?'Attribue-toi tes cours dans Admin › « Qui donne quel cours ».':'Demande au coordinateur de t’attribuer tes cours : ils apparaîtront ici.'}</p></div>`; }
function liveTest(){ const sc=testScore(); if(!sc) return null; return sc.pending? 'wait' : sc.total; }
function scoreCell(v,total,seuil){
  if(v==null||v==='') return `<span class="cell none">—</span>`;
  if(v==='wait') return `<span class="cell wait">à corriger</span>`;
  if(v==='A'||v==='D'||v==='NR') return `<span class="cell none">${v}</span>`;
  return `<span class="cell ${v>=seuil?'ok':'bad'}">${v>=seuil?'Réussi':'À revoir'} ${v}/${total}</span>`;
}
function capsCell(v){ if(!v) return `<span class="cell none">Pas commencé</span>`; if(v>=CAPS.length) return `<span class="cell ok">${CAPS.length}/${CAPS.length} capsules</span>`; return `<span class="cell run">${v}/${CAPS.length} capsules</span>`; }
const fmtAgo = t => { if(!t) return '—'; const d=Math.floor((Date.now()-t)/864e5); return d<=0?'aujourd’hui':d===1?'hier':`il y a ${d} jours`; };
/* coordinateur : toutes les classes et tous les cours qui ont du contenu sur la plateforme (ses cours d'abord) */
const coursSuivi = co => co.statut==='demo' || co.statut==='demo-tp' || co.statut==='app';
function allPairs(){
  const mine=new Set(myPairs().map(p=>p[0]));
  const L=CLASSES.flatMap(c=>coursDe(c).filter(coursSuivi).map(co=>({ k:c.id+'|'+co.id, cl:c.id, co:co.id, l:`${c.nom} — ${co.titre}`, profs:profsOf(c.id,co.id), mine:mine.has(c.id+'|'+co.id) })));
  return L.filter(x=>x.mine).concat(L.filter(x=>!x.mine));
}
/* chiffres d'un couple classe × cours, pour la vue d'ensemble */
function statsPair(cl, co){
  const studs=elevesOf(cl), sem=Date.now()-7*864e5;
  const o={ n:studs.length, actifs:studs.filter(s=>s.last&&s.last>=sem).length, last:Math.max(0,...studs.map(s=>s.last||0)) };
  const C=COURS.find(x=>x.id===co)||{};
  if(C.statut==='app'){ o.txt=`dans l’app ${esc((MODULES[C.module]||{}).t||'')}`; return o; }
  if(co==='4eqem-tpe'){ const r=studs.map(s=>rowOf(s.mail)); o.ok=r.filter(x=>x.fv.every(Boolean)).length; o.txt=`feu vert É03 : ${o.ok}/${o.n}`; o.pct=o.n?Math.round(o.ok/o.n*100):0; return o; }
  const ON=chapsOuverts(cl,co), OPEN=chapNums(co).filter(k=>ON.includes(k)), tot=OPEN.reduce((a,k)=>a+CHAPTERS[k].caps.length,0);
  const pct=m=>{ const r=chapRow(m,co); return tot?Math.round(OPEN.reduce((a,k)=>a+r.chaps[k],0)/tot*100):0; };
  const P=studs.map(s=>pct(s.mail));
  o.pct=P.length?Math.round(P.reduce((a,b)=>a+b,0)/P.length):0; o.ok=P.filter(x=>tot&&x===100).length; o.ouverts=OPEN.length; o.chaps=chapNums(co).length;
  if(co!=='4-elec') o.ex=studs.reduce((a,s)=>a+exDoneOf(s.mail,co),0);
  return o;
}
function dashTabs(){
  if(!isCoord()) return '';
  const m=S.dashMode||'mine';
  return `<div class="seg" style="margin-bottom:16px">${[['mine','Mes cours'],['all','Toutes les classes']].map(([k,l])=>`<button class="${m===k?'on':''}" data-dmode="${k}" type="button">${l}</button>`).join('')}</div>`;
}
function dashOverview(){
  const L=allPairs(), bar=v=>`<div class="bar ${v>=100?'ok':''}" style="min-width:90px"><i style="width:${v}%"></i></div>`;
  const rows=L.map(x=>{ const st=statsPair(x.cl,x.co);
    return `<tr class="${x.mine?'mine':''}"><td><b>${esc(cls(x.cl).nom)}</b>${x.mine?' <span class="chip ok" style="padding:0 6px">toi</span>':''}</td><td>${esc((COURS.find(c=>c.id===x.co)||{}).titre||x.co)}</td><td class="small">${x.profs.length?esc(x.profs.join(', ')):'<span class="muted">pas attribué</span>'}</td>
      <td>${st.n}</td><td>${st.n?`${st.actifs}/${st.n}`:'—'}</td>
      <td>${st.txt?`<span class="small muted">${st.txt}</span>`:st.n?`<div class="row" style="gap:8px">${bar(st.pct)}<b>${st.pct}%</b></div><div class="tiny muted">${st.ok}/${st.n} à jour · ${st.ouverts}/${st.chaps} chap. ouverts${st.ex!=null?` · ${st.ex} exercices réussis`:''}</div>`:'—'}</td>
      <td class="small">${fmtAgo(st.last)}</td>
      <td>${(COURS.find(c=>c.id===x.co)||{}).statut!=='app'?`<button class="btn sm" data-dopen="${x.k}" type="button">Voir</button>`:''}</td></tr>`; }).join('');
  return `<div class="page-head"><div><div class="kicker">Suivi · coordination</div><h1>Toutes les classes</h1><p class="small muted" style="margin-top:4px">Qui utilise la plateforme et qui y arrive. Tes cours sont en tête, sur fond coloré.</p></div></div>
    ${dashTabs()}
    <div class="card"><div class="scroll-x"><table class="t"><tr><th>Classe</th><th>Cours</th><th>Prof(s)</th><th>Élèves</th><th>Actifs 7 j</th><th>Progression</th><th>Dernière activité</th><th></th></tr>${rows}</table></div>
    <p class="tiny muted" style="padding:0 16px 12px;margin:0">Élèves : inscrits sur la plateforme dans ce groupe · Actifs 7 j : connectés ces 7 derniers jours · Progression : capsules validées dans les chapitres ouverts, en moyenne.</p></div>`;
}
function pageDash(){
  if(isCoord() && S.dashMode==='all') return dashOverview();
  const mine=myPairs(), others=isCoord()?allPairs().filter(x=>!x.mine && (COURS.find(c=>c.id===x.co)||{}).statut!=='app').map(x=>[x.k, x.l+(x.profs.length?' ('+x.profs.join(', ')+')':'')]):[];
  const pairs=mine.concat(others); if(!pairs.length) return noPairs('Suivi');
  if(!pairs.some(p=>p[0]===S.dashKey)) S.dashKey=pairs[0][0];
  const [cl,co]=S.dashKey.split('|'); const c=cls(cl), estMien=mine.some(p=>p[0]===S.dashKey);
  const opt=([k,l])=>`<option value="${k}" ${k===S.dashKey?'selected':''}>${esc(l)}</option>`;
  const sel=`<select data-dkey>${others.length?`<optgroup label="Mes cours">${mine.map(opt).join('')}</optgroup><optgroup label="Autres classes (consultation)">${others.map(opt).join('')}</optgroup>`:pairs.map(opt).join('')}</select>`;
  const studs=elevesOf(cl);
  let body;
  if(!studs.length) body=`<div class="card pad"><h3>Aucun élève inscrit en ${c.nom}</h3><p class="muted">Les élèves apparaissent ici dès leur première connexion, quand ils choisissent leur classe.</p></div>`;
  else if(co==='4-elec' || courseHasChaps(co)) body=dashChap(cl, studs, co);
  else if(co==='4eqem-tpe') body=dashTP(cl, studs);
  else if((COURS.find(x=>x.id===co)||{}).statut==='app'){ const M=MODULES[(COURS.find(x=>x.id===co)||{}).module]||{}; body=`<div class="card pad"><h3>${studs.length} élève(s) en ${c.nom}</h3><p class="muted">Ce cours se fait dans l’app ${esc(M.t||'')} : les énoncés, les rapports et leur suivi sont là-bas.</p><button class="btn primary" data-app="${M.app||''}" type="button">Ouvrir ${esc(M.t||'l’app')} ↗</button></div>`; }
  else body=`<div class="card pad"><h3>${studs.length} élève(s) en ${c.nom}</h3><p class="muted">Le contenu de ce cours n'est pas encore sur la plateforme : le suivi détaillé apparaîtra avec les premiers chapitres. En attendant, encode tes évaluations dans le carnet de cotes.</p></div>`;
  return `<div class="page-head"><div><div class="kicker">Suivi</div><h1>${c.nom}${co?' — '+(COURS.find(x=>x.id===co)||{titre:co}).titre:''}</h1>${co&&profsOf(cl,co).length>1?`<p class="small muted" style="margin-top:4px">Cours partagé : ${profsOf(cl,co).join(' et ')} voient le même suivi.</p>`:''}</div>
    <div class="row wrap">${sel}${estMien?'<button class="btn" data-go="carnet">Carnet de cotes →</button>':''}</div></div>${dashTabs()}
    ${estMien?'':`<div class="note warn" style="margin:0 0 16px"><b>Consultation : ce n’est pas ton cours${profsOf(cl,co).length?` (${esc(profsOf(cl,co).join(', '))})`:''}.</b>Comme coordinateur, tu peux aussi ouvrir des chapitres ou cocher : fais-le seulement en accord avec le collègue.</div>`}${body}`;
}
function rowOf(mail){ const pr=progOf(mail); return withProg(pr, ()=>({ mail, caps:capsDoneCount(), test:liveTest(), min:Math.round((pr.sec||0)/60), fv:FEUVERT.map(x=>feuVert(x.k)?1:0) })); }
function chapRow(mail, co='4-elec'){ const pr=progOf(mail); return withProg(pr, ()=>{ const o={}; chapNums(co).forEach(k=>o[k]=chapCapsDone(k)); return { chaps:o, test:co==='4-elec'?liveTest():null, min:Math.round((pr.sec||0)/60) }; }); }
function dashChap(cl, studs, co='4-elec'){
  const e4=co==='4-elec', plan=COURSE_PLANS[co]||{court:'Électricité 4e'};
  const ON=chapsOuverts(cl,co), NUMS=chapNums(co), OPEN=NUMS.filter(k=>ON.includes(k));
  const rows=studs.map(s=>Object.assign(chapRow(s.mail,co),{nom:s.nom,last:s.last,mail:s.mail}));
  const totCaps=OPEN.reduce((a,k)=>a+CHAPTERS[k].caps.length,0);
  const pct=r=>totCaps?Math.round(OPEN.reduce((a,k)=>a+r.chaps[k],0)/totCaps*100):0;
  const avgPct=rows.length?Math.round(rows.reduce((a,r)=>a+pct(r),0)/rows.length):0;
  const scores=rows.map(r=>r.test).filter(v=>typeof v==='number');
  const avg=scores.length?(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1).replace('.',','):'—';
  const errs=Object.keys(Q).filter(id=>{ const c=capById(Q[id].r); return c && ON.includes(c.chap); }).map(id=>{ const ans=studs.map(s=>(progOf(s.mail).quiz||{})[id]).filter(Boolean); return [id, ans.length? Math.round(ans.filter(a=>!a.first).length/ans.length*100):null, ans.length]; })
    .filter(x=>x[1]!=null && x[2]>=1).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const toGrade=e4?studs.filter(s=>{ const t=progOf(s.mail).test; return t.submitted && TEST.some(q=>q.type==='open' && (t.open||{})[q.id]==null); }):[];
  const cell=(d,n)=> !d?`<span class="cell none" style="min-width:0">·</span>`:d>=n?`<span class="cell ok" style="min-width:0">✓</span>`:`<span class="cell run" style="min-width:0">${d}/${n}</span>`;
  return `<div class="card pad" style="margin-bottom:16px"><h3 style="margin:0">Chapitres ouverts pour ${cls(cl).nom}</h3>
    <p class="small muted" style="margin:4px 0 10px">${e4?'Ouvre chaque chapitre au moment du TP correspondant':'Ouvre chaque chapitre quand vous y arrivez en classe'} : tes élèves ne voient pas les chapitres fermés. Clique pour ouvrir ou fermer.</p>
    <div class="chipset">${NUMS.map(k=>`<button class="chtog ${ON.includes(k)?'on':''}" data-ouv="${k}" data-ouvco="${co}" title="${esc(CHAPTERS[k].titre)}"><b>${chapLbl(k)}</b><span>${ON.includes(k)?'ouvert':'fermé'}</span></button>`).join('')}</div></div>
  <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="v">${avgPct}%</div><div class="l">des capsules ouvertes validées, en moyenne</div></div>
    <div class="card kpi"><div class="v">${rows.filter(r=>totCaps&&pct(r)===100).length}/${rows.length}</div><div class="l">élèves à jour</div></div>
    ${e4?`<div class="card kpi"><div class="v">${avg}<span class="muted" style="font-size:16px">/${TOTAL}</span></div><div class="l">moyenne de la formative 2.3 (en ligne)</div></div>
    <div class="card kpi"><div class="v" style="color:var(--warn)">${toGrade.length}</div><div class="l">évaluation(s) à corriger</div></div>`
    :`<div class="card kpi"><div class="v">${rows.reduce((a,r)=>a+exDoneOf(r.mail,co),0)}</div><div class="l">exercices réussis par la classe</div></div>
    <div class="card kpi"><div class="v">${OPEN.length}/${NUMS.length}</div><div class="l">chapitres ouverts</div></div>`}</div>
  <div class="card" style="margin-bottom:16px"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>${esc(plan.court)} — capsules validées par chapitre</h3>${e4?'':'<p class="small muted" style="margin:4px 0 0">Clique sur un élève pour voir ses tableaux d’exercices (données, inconnue, formule, solution).</p>'}</div>
  <div class="scroll-x"><table class="t"><tr><th>Élève</th>${OPEN.map(k=>`<th title="${esc(CHAPTERS[k].titre)}">${chapLbl(k)}</th>`).join('')}${e4?'<th>Formative 2.3</th>':''}<th>Temps</th><th>Dernière connexion</th></tr>
    ${rows.map(r=>`<tr><td>${e4?esc(r.nom):`<button class="linkbtn" data-voirex="${esc(r.mail)}|${co}" title="Voir ses tableaux d’exercices">${esc(r.nom)}</button>`}</td>${OPEN.map(k=>`<td>${cell(r.chaps[k],CHAPTERS[k].caps.length)}</td>`).join('')}${e4?`<td>${scoreCell(r.test,TOTAL,SEUIL)}</td>`:''}<td class="small muted">${r.min} min</td><td class="small muted">${fmtAgo(r.last)}</td></tr>`).join('')}
  </table></div><p class="tiny muted" style="padding:0 16px 12px;margin:0">✓ chapitre terminé · 3/8 capsules validées · « · » pas commencé.${e4?' Les formatives sur papier s’encodent dans le carnet de cotes.':''}</p></div>
  ${e4?'':atelCard(rows, OPEN)}
  <div class="grid g2">
    <div class="card pad"><h3>Les questions qui bloquent</h3><p class="small muted">% d'élèves qui se trompent au premier essai, dans les chapitres ouverts.</p>
      ${errs.length?errs.map(([id,p,n])=>`<div class="hbar"><span class="lbl">${Q[id].q} <span class="tiny muted">· ${capById(Q[id].r).sec} · ${n} rép.</span></span><span class="track"><i style="width:${p}%"></i></span><span class="pct">${p}%</span></div>`).join(''):'<p class="small muted">Pas encore assez de réponses.</p>'}</div>
    <div class="card pad">${e4?'<h3>À corriger</h3>':''}
      ${toGrade.length? toGrade.map(s=>{ const t=progOf(s.mail).test; return TEST.filter(q=>q.type==='open' && (t.open||{})[q.id]==null).map(q=>`<div class="q"><div class="tiny muted">${esc(s.nom)} · question ${TEST.indexOf(q)+1} (${q.pts} pts)</div><div class="qt">${q.q}</div>
        <div class="small" style="white-space:pre-wrap"><b>Réponse :</b> ${esc((t.texts||{})[q.id]||'')}</div><details class="small" style="margin:6px 0"><summary style="cursor:pointer">Corrigé</summary>${q.cor}</details>
        <div class="row wrap"><span class="small">Note :</span>${Array.from({length:q.pts+1},(_,i)=>`<button class="btn sm" data-grade="${esc(s.mail)}|${q.id}|${i}">${i}</button>`).join('')}</div></div>`).join(''); }).join('')
      : e4?`<p class="small muted">Rien à corriger.</p>`:''}
      <h3 style="${e4?'margin-top:16px':'margin-top:0'}">Signalements</h3>
      ${S.signal.length? S.signal.slice(0,10).map(s=>`<div class="small" style="padding:6px 0;border-bottom:1px solid var(--line-2)"><b>${esc(s.cap)}</b> — ${esc(s.txt)} <span class="tiny muted">· ${esc(s.who)}</span></div>`).join('') : `<p class="small muted">Aucun. Chaque capsule a un bouton « Signaler une erreur » pour les profs.</p>`}
    </div></div>`;
}
/* points « à l'atelier » des chapitres ouverts : le prof coche quand il a vu l'élève faire */
function atelCard(rows, OPEN){
  const pts=OPEN.flatMap(k=>(CHAPTERS[k].prereq||[]).filter(x=>x.atel).map(x=>({k:x.atel, t:x.t, ch:chapLbl(k)})));
  if(!pts.length) return '';
  return `<div class="card" style="margin-bottom:16px"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>À l’atelier — validé par toi</h3><p class="small muted" style="margin:4px 0 0">Coche quand tu as vu l’élève le faire. Le point se coche dans la synthèse du chapitre de l’élève, et lui seul ne peut pas le cocher.</p></div>
  <div class="scroll-x"><table class="t"><tr><th>Élève</th>${pts.map(x=>`<th title="${esc(x.t)}" style="white-space:normal;min-width:150px">Chap. ${x.ch} · ${esc(x.t)}</th>`).join('')}</tr>
  ${rows.map(r=>{ const a=progOf(r.mail).atel||{}; return `<tr><td>${esc(r.nom)}</td>${pts.map(x=>`<td><input type="checkbox" data-atel="${esc(r.mail)}|${x.k}" ${a[x.k]?'checked':''} aria-label="${esc(r.nom)} : ${esc(x.t)}" style="width:18px;height:18px;accent-color:var(--ok)"></td>`).join('')}</tr>`; }).join('')}</table></div></div>`;
}
function dashTP(cl, studs){
  const rows=studs.map(s=>Object.assign(rowOf(s.mail),{nom:s.nom}));
  const ready=rows.filter(r=>r.fv.every(Boolean)).length;
  return `<div class="grid g3" style="margin-bottom:16px">
    <div class="card kpi"><div class="v" style="color:var(--ok)">${ready}/${rows.length}</div><div class="l">ont le feu vert pour le TP É03</div></div>
    <div class="card kpi"><div class="v">${rows.filter(r=>!r.fv[2]).length}</div><div class="l">doivent encore montrer leur câblage d'auto-maintien</div></div>
    <div class="card kpi"><div class="v">2.3</div><div class="l">chapitre de théorie lié (cours d'Électricité)</div></div></div>
  <div class="card"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>Feu vert TP É03 — Relais, cinq exercices progressifs</h3><p class="small muted" style="margin:4px 0 0">Les prérequis viennent du chapitre de théorie. Coche « Câblage » quand l'élève a câblé l'auto-maintien sans modèle devant toi.</p></div>
  <div class="scroll-x"><table class="t"><tr><th>Élève</th>${['Pièces','Brochage','Câblage','6 étapes','Ohmmètre','Arrêt NF'].map(h=>`<th>${h}</th>`).join('')}<th>É03</th></tr>
    ${rows.map(r=>`<tr><td>${esc(r.nom)}</td>${r.fv.map((v,i)=> i===2 ? `<td><input type="checkbox" data-banc="${esc(r.mail)}" ${v?'checked':''} style="width:18px;height:18px;accent-color:var(--ok)"></td>` : `<td>${v?'<span class="cell ok" style="min-width:0">✓</span>':'<span class="cell none" style="min-width:0">·</span>'}</td>`).join('')}<td>${r.fv.every(Boolean)?'<span class="cell ok">Feu vert</span>':'<span class="cell bad">Pas prêt</span>'}</td></tr>`).join('')}
  </table></div></div>`;
}
function bindDash(m){
  m.querySelectorAll('[data-ouv]').forEach(b=>b.onclick=async()=>{ const cl=S.dashKey.split('|')[0], co=b.dataset.ouvco||'4-elec', k=b.dataset.ouv, cur=chapsOuverts(cl,co).slice(), key=ouvKey(cl,co);
    const i=cur.indexOf(k); if(i>=0) cur.splice(i,1); else cur.push(k); cur.sort((x,y)=>x.localeCompare(y,'fr',{numeric:true}));
    const avant=S.ouv[key]; S.ouv[key]=cur; const y=window.scrollY; render(); window.scrollTo(0,y);
    const r=await act('setOuv',{key,chaps:cur});
    if(!r){ if(avant) S.ouv[key]=avant; else delete S.ouv[key]; const y2=window.scrollY; render(); window.scrollTo(0,y2); } });
  m.querySelectorAll('[data-atel]').forEach(c=>c.onchange=async()=>{ const [mail,k]=c.dataset.atel.split('|'), v=c.checked, pr=(S.progs[mail]||(S.progs[mail]={})); pr.atel=pr.atel||{};
    if(v) pr.atel[k]=Date.now(); else delete pr.atel[k];
    const r=await act('setAtelier',{mail,k,v}); if(!r){ if(v) delete pr.atel[k]; else pr.atel[k]=Date.now(); const y=window.scrollY; render(); window.scrollTo(0,y); } });
  m.querySelectorAll('[data-voirex]').forEach(b=>b.onclick=()=>{ const [mail,co]=b.dataset.voirex.split('|'); voirExercices(mail,co); });
  const s=m.querySelector('[data-dkey]'); if(s) s.onchange=()=>{ S.dashKey=s.value; savePrefs(); render(); };
  m.querySelectorAll('[data-dmode]').forEach(b=>b.onclick=()=>{ S.dashMode=b.dataset.dmode; savePrefs(); render(); window.scrollTo(0,0); });
  m.querySelectorAll('[data-dopen]').forEach(b=>b.onclick=()=>{ S.dashKey=b.dataset.dopen; S.dashMode='mine'; savePrefs(); render(); window.scrollTo(0,0); });
  m.querySelectorAll('[data-grade]').forEach(b=>b.onclick=async()=>{ const [mail,q,v]=b.dataset.grade.split('|');
    const p=S.progs[mail]; p.test.open=p.test.open||{}; const avant=p.test.open[q]; p.test.open[q]=+v; const y=window.scrollY; render(); window.scrollTo(0,y);
    const r=await act('grade',{mail,q,v:+v});
    if(!r){ if(avant===undefined) delete p.test.open[q]; else p.test.open[q]=avant; render(); } });
  m.querySelectorAll('[data-banc]').forEach(c=>c.onchange=async()=>{ const mail=c.dataset.banc, v=c.checked, P=(S.progs[mail]||(S.progs[mail]={})); P.banc=v; const y=window.scrollY; render(); window.scrollTo(0,y);
    const r=await act('setBanc',{mail,v}); if(!r){ P.banc=!v; render(); } });
}
function signalForm(capId){
  const cap=capById(capId);
  const md=modal('Signaler une erreur', `<p class="small muted">Capsule ${cap.sec} — ${cap.t}</p><textarea data-sigtxt placeholder="Ce qui ne va pas, et la correction proposée"></textarea><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-sigok>Envoyer</button></div>`);
  md.querySelector('[data-sigok]').onclick=async()=>{ const v=md.querySelector('[data-sigtxt]').value.trim(); if(!v) return;
    const r=await act('signal',{cap:cap.sec,txt:v},'Signalement envoyé'); if(r){ S.signal.unshift({cap:cap.sec,txt:v,who:ME}); closeModal(); } };
}
function bindMonStage(m){
  m.querySelectorAll('[data-addlieu]').forEach(b=>b.onclick=()=>lieuForm(b.dataset.addlieu));
  const i=m.querySelector('[data-mytel]'); if(i && !isProf()) i.onchange=async()=>{ S.stage.tel[S.me.mail]=i.value.trim(); await act('setTel',{tel:i.value.trim()},'Numéro enregistré'); };
}

/* ---------------- Accès (coordinateur) ---------------- */
function pageAcces(){
  const all=Object.keys(S.eleves).map(m=>Object.assign({mail:m},S.eleves[m])).sort((a,b)=>(a.classe||'').localeCompare(b.classe||'')||a.nom.localeCompare(b.nom,'fr'));
  const D=PLAT.DOMAIN;
  return `<div class="page-head"><div><div class="kicker">Qui peut entrer dans la plateforme</div><h1>Accès</h1><p class="muted small">Connexion avec le compte Google de l'école : seules les adresses @${D} sont acceptées.</p></div></div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card pad"><h3>Les règles</h3><div class="stack small" style="margin-top:10px">
      <div class="row" style="align-items:flex-start"><span class="chip elec">Élève</span><span>Toute adresse <b>prenom.nom.student@${D}</b>. À la première connexion, l'élève choisit sa classe ; un prof peut la changer ci-dessous.</span></div>
      <div class="row" style="align-items:flex-start"><span class="chip meca">Prof</span><span>Une adresse <b>prenom.nom@${D}</b> enregistrée ci-dessous.</span></div>
      <div class="row" style="align-items:flex-start"><span class="chip amber">Coordinateur</span><span>Un prof qui gère en plus les accès, les classes et les attributions.</span></div>
      <div class="row" style="align-items:flex-start"><span class="chip bad">Refusé</span><span>Toute autre adresse, un prof non enregistré ou une adresse bloquée.</span></div></div>
      <label class="toggle ${S.access.open?'on':''}" data-aopen style="margin-top:14px;cursor:pointer"><span class="sw"></span>Ouvert à tous les élèves @${D}</label>
      <p class="tiny muted" style="margin-top:6px">${S.access.open?'Tout élève de l’école peut se connecter et choisir sa classe.':'Seuls les élèves déjà inscrits peuvent se connecter.'}</p></div>
    <div class="card pad"><h3>Tester une adresse</h3><p class="small muted">Pour vérifier ce qui se passe à la connexion.</p>
      <div class="row wrap"><input type="text" data-atest placeholder="prenom.nom.student@${D}" style="flex:1;min-width:220px"><button class="btn primary" data-atestgo>Tester</button></div><div id="atestres" style="margin-top:10px"></div></div>
  </div>
  <div class="card" style="margin-bottom:16px"><div class="pad row between wrap" style="border-bottom:1px solid var(--line)"><h3>Professeurs</h3>
    <div class="row wrap"><input type="text" data-pnom placeholder="Nom affiché (ex. P. Dachelet)" style="min-width:190px"><input type="text" data-pmail placeholder="prenom.nom@${D}" style="min-width:230px"><button class="btn" data-padd>+ Ajouter</button></div></div>
    <div class="scroll-x"><table class="t"><tr><th>Nom</th><th>Adresse</th><th>Rôle</th><th>Cours attribués</th><th></th></tr>
    ${S.access.profs.map((p,i)=>`<tr><td><b>${esc(p.nom)}</b></td><td class="small mono">${esc(p.mail)}</td>
      <td><select data-prole="${i}" ${p.mail===S.me.mail?'disabled':''}><option ${p.role==='Professeur'?'selected':''}>Professeur</option><option ${p.role==='Coordinateur'?'selected':''}>Coordinateur</option></select></td>
      <td class="small muted">${AFFECT.filter(x=>x.profs.includes(p.nom)).map(x=>`${cls(x.cl).nom} ${(COURS.find(c=>c.id===x.c)||{titre:''}).titre}`).join(' · ')||'—'}</td>
      <td>${p.mail===S.me.mail?'':`<button class="btn sm ghost" data-pdel="${i}">Retirer</button>`}</td></tr>`).join('')}
    </table></div></div>
  <div class="card"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>Élèves (${all.length})</h3><p class="small muted" style="margin:4px 0 0">Ils apparaissent à leur première connexion. Tu peux changer leur classe ou bloquer une adresse. En 3QEM, la classe est le groupe de TP ; le groupe de CT se règle dans sa colonne.</p></div>
    ${all.length?`<div class="scroll-x"><table class="t"><tr><th>Élève</th><th>Classe</th><th>Groupe de CT</th><th>Dernière connexion</th><th>Statut</th><th></th></tr>
    ${all.map(e=>{ const b=S.access.blocked.includes(e.mail);
      return `<tr><td>${esc(e.nom)}<div class="tiny muted mono">${esc(e.mail)}</div></td>
      <td><select data-ecl="${esc(e.mail)}">${CLASSES_ELEVE.map(c=>`<option value="${c.id}" ${c.id===e.classe?'selected':''}>${c.nom}</option>`).join('')}</select></td>
      <td>${/^3qem/.test(e.classe||'')?`<select data-ect="${esc(e.mail)}" ${e.ct?'':'style="border-color:var(--amber)"'}><option value="">— à placer —</option>${CT_GROUPES.map(c=>`<option value="${c.id}" ${c.id===e.ct?'selected':''}>${c.nom.replace('3QEM ','')}</option>`).join('')}</select>`:'<span class="muted small">—</span>'}</td>
      <td class="small muted">${fmtAgo(e.last)}</td><td>${b?'<span class="chip bad">Bloqué</span>':'<span class="chip ok">Actif</span>'}</td><td><button class="btn sm ghost" data-block="${esc(e.mail)}">${b?'Débloquer':'Bloquer'}</button></td></tr>`; }).join('')}
    </table></div>`:'<div class="pad"><p class="small muted" style="margin:0">Aucun élève connecté pour l’instant.</p></div>'}</div>`;
}
function bindAcces(m){
  const rer=()=>{ const y=window.scrollY; render(); window.scrollTo(0,y); };
  const go=m.querySelector('[data-atestgo]'), inp=m.querySelector('[data-atest]');
  const test=async()=>{ const r=await act('checkMail',{mail:inp.value}); if(!r) return; const x=r.res; m.querySelector('#atestres').innerHTML=`<div class="note ${x.ok?'ok':'bad'}"><b>${x.ok?'Accès accordé':'Accès refusé'}</b>${x.ok?(x.role==='prof'?'Professeur : '+esc(x.nom):'Élève : '+esc(x.nom)):esc(x.msg)}</div>`; };
  go.onclick=test; inp.onkeydown=e=>{ if(e.key==='Enter') test(); };
  const pushProfs=async()=>{ const r=await act('setProfs',{profs:S.access.profs},'Liste des profs enregistrée'); if(!r) await boot(); else rer(); };
  m.querySelector('[data-aopen]').onclick=async()=>{ S.access.open=!S.access.open; rer(); await act('setAccess',{open:S.access.open}); };
  m.querySelector('[data-padd]').onclick=()=>{ const v=m.querySelector('[data-pmail]').value.trim().toLowerCase(); let nom=m.querySelector('[data-pnom]').value.trim();
    if(!v.endsWith('@'+PLAT.DOMAIN) || /\.student@/.test(v)){ toast(`Adresse de prof @${PLAT.DOMAIN} attendue`); return; }
    if(S.access.profs.some(p=>p.mail===v)){ toast('Déjà enregistré'); return; }
    if(!nom){ const parts=v.split('@')[0].split('.'); nom = parts.length>1? `${parts[0][0].toUpperCase()}. ${parts.slice(1).join(' ').replace(/^./,c=>c.toUpperCase())}` : v; }
    S.access.profs.push({nom, mail:v, role:'Professeur'}); pushProfs(); };
  m.querySelectorAll('[data-prole]').forEach(s=>s.onchange=()=>{ S.access.profs[+s.dataset.prole].role=s.value; pushProfs(); });
  m.querySelectorAll('[data-pdel]').forEach(b=>b.onclick=()=>{ if(!confirm('Retirer ce professeur ? Il ne pourra plus se connecter.')) return; S.access.profs.splice(+b.dataset.pdel,1); pushProfs(); });
  m.querySelectorAll('[data-block]').forEach(b=>b.onclick=async()=>{ const k=b.dataset.block, i=S.access.blocked.indexOf(k); if(i>=0) S.access.blocked.splice(i,1); else S.access.blocked.push(k); rer(); await act('setAccess',{blocked:S.access.blocked}, i>=0?'Adresse débloquée':'Adresse bloquée'); });
  m.querySelectorAll('[data-ecl]').forEach(s=>s.onchange=async()=>{ const mail=s.dataset.ecl, E=S.eleves[mail], avant={classe:E.classe, ct:E.ct}; E.classe=s.value; if(!/^3qem/.test(s.value)) delete E.ct; rer();
    const r=await act('setEleveClasse',{mail, classe:s.value}); if(!r){ Object.assign(E,avant); rer(); } });
  m.querySelectorAll('[data-ect]').forEach(s=>s.onchange=async()=>{ const mail=s.dataset.ect, E=S.eleves[mail], avant=E.ct; if(s.value) E.ct=s.value; else delete E.ct; rer();
    const r=await act('setEleveCt',{mail, ct:s.value}); if(!r){ if(avant) E.ct=avant; else delete E.ct; rer(); } });
}

/* ---------------- Administration (coordinateur) ---------------- */
function pageAdmin(){
  const rows=CLASSES.flatMap(c=>coursDe(c).map(co=>({c,co})));
  const noms=S.access.profs.map(p=>p.nom);
  return `<div class="page-head"><div><div class="kicker">Réservé au coordinateur</div><h1>Administration</h1></div><span class="chip elec">Année scolaire 2026-2027</span></div>
  <div class="card" style="margin-bottom:16px"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>Classes</h3><p class="small muted" style="margin:4px 0 0">Chaque classe est liée à une année et une filière : l'élève choisit sa classe à la première connexion et voit automatiquement ses cours.</p></div>
  <div class="scroll-x"><table class="t"><tr><th>Classe</th><th>Année</th><th>Filière</th><th>Élèves</th><th>Chapitres ouverts (Électricité)</th><th>Profs</th></tr>
    ${CLASSES.map(c=>`<tr><td><b>${c.nom}</b>${c.fil==='3qem'?`<div class="tiny muted">${c.ct?'cours techniques · élèves placés dans Accès · ':'TP · '}dernière année : 2027-2028</div>`:''}</td><td>${c.annee}e</td><td class="small">${fil(c.fil).nom}</td><td>${elevesOf(c.id).length}</td>
      <td class="small">${c.annee===4?chapsOuverts(c.id).join(', ')+'<div class="tiny muted">ouverts par le prof dans Suivi</div>':'—'}</td>
      <td class="small muted">${[...new Set(AFFECT.filter(x=>x.cl===c.id).flatMap(x=>x.profs))].join(', ')||'—'}</td></tr>`).join('')}
  </table></div></div>
  <div class="card"><div class="pad" style="border-bottom:1px solid var(--line)"><h3>Qui donne quel cours</h3><p class="small muted" style="margin:4px 0 0">Un professeur par cours, ou deux pour les cours partagés. Chacun retrouve ses cours dans son suivi et son carnet de cotes ; à deux, ils voient et encodent les mêmes cotes.</p></div>
  <div class="scroll-x"><table class="t"><tr><th>Classe</th><th>Cours</th><th>Professeur</th><th>2e professeur <span style="text-transform:none;letter-spacing:0;font-weight:500">(facultatif)</span></th></tr>
    ${rows.map(({c,co})=>{ const ps=profsOf(c.id,co.id); const opts=(cur,none)=>[none,...noms].map(p=>`<option ${p===(cur||none)?'selected':''}>${esc(p)}</option>`).join('');
      return `<tr><td>${c.nom}</td><td>${esc(co.titre)}</td><td><select data-aff="${c.id}|${co.id}|0">${opts(ps[0],'à attribuer')}</select></td><td><select data-aff="${c.id}|${co.id}|1" ${ps[0]?'':'disabled'}>${opts(ps[1],'—')}</select></td></tr>`; }).join('')}
  </table></div></div>
  <p class="small muted" style="margin-top:14px">Toutes les données sont dans le Google Sheet « Plateforme technique – données » de l'école. En fin d'année, fais-en une copie (Fichier › Créer une copie) pour l'archiver.</p>`;
}
function bindAdmin(m){
  m.querySelectorAll('[data-cmode]').forEach(s=>s.onchange=async()=>{ S.modes[s.dataset.cmode]=s.value; await act('setModes',{modes:S.modes},`Mode ${s.value} pour ${cls(s.dataset.cmode).nom}`); });
  m.querySelectorAll('[data-aff]').forEach(s=>s.onchange=async()=>{ const [cl,co,slot]=s.dataset.aff.split('|'); let a=affOf(cl,co);
    if(!a){ a={cl,c:co,profs:[]}; AFFECT.push(a); }
    const v=(s.value==='à attribuer'||s.value==='—')?null:s.value;
    if(slot==='0'){ if(v) a.profs[0]=v; else a.profs=[]; } else { if(v && v!==a.profs[0]) a.profs[1]=v; else a.profs.length=Math.min(a.profs.length,1); if(v && v===a.profs[0]) toast('Ce prof est déjà le premier'); }
    a.profs=a.profs.filter(Boolean); if(!a.profs.length) AFFECT.splice(AFFECT.indexOf(a),1);
    const y=window.scrollY; render(); window.scrollTo(0,y); await act('setAffect',{affect:AFFECT},'Attribution enregistrée'); });
}

/* ---------------- Agenda de l'école (profs) ----------------
   Google Agenda intégré : Google n'affiche les événements qu'à un compte qui a accès à l'agenda. */
const agendas = () => CONFIG.AGENDAS || (CONFIG.AGENDA ? [{ id:CONFIG.AGENDA, nom:'Agenda de l’école', couleur:'#1f5fbf' }] : []);
function agendaSel(){ const L=agendas(), s=(S.agendaSel||[]).filter(id=>L.some(a=>a.id===id)); return S.agendaSel ? s : L.map(a=>a.id); }   // par défaut : tous cochés
function agendaSrc(mode, ids){
  const src = agendas().filter(a=>ids.includes(a.id)).map(a=>`src=${encodeURIComponent(a.id)}&color=${encodeURIComponent(a.couleur||'#1f5fbf')}`).join('&');
  return `https://calendar.google.com/calendar/embed?${src}&ctz=Europe%2FBrussels&hl=fr&wkst=2&mode=${mode}&showTitle=0&showPrint=0&showTz=0&showCalendars=0`; }
function pageAgenda(){
  const L=agendas();
  if(!L.length) return `<div class="page-head"><div><h1>Agenda</h1></div></div><div class="card pad"><p class="muted" style="margin:0">Aucun agenda n'est encore relié (CONFIG.AGENDAS).</p></div>`;
  const mode=S.agendaMode||'MONTH', sel=agendaSel(), ouvrir='https://calendar.google.com/calendar/u/0/r?cid='+encodeURIComponent((L.find(a=>sel.includes(a.id))||L[0]).id);
  const coches=`<div class="row wrap" style="gap:14px;margin:0 0 12px">${L.map(a=>`<label class="row small" style="gap:6px;cursor:pointer"><input type="checkbox" data-agsel="${esc(a.id)}" ${sel.includes(a.id)?'checked':''} style="width:18px;height:18px;accent-color:${a.couleur}"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${a.couleur}"></span><b>${esc(a.nom)}</b></label>`).join('')}</div>`;
  return `<div class="page-head"><div><div class="kicker">Réservé aux profs</div><h1>Agenda</h1>
      <p class="muted small" style="margin-top:4px">Les événements s'affichent si ton navigateur est connecté au compte Google de l'école (…@${PLAT.DOMAIN}).</p></div>
    <div class="row wrap"><div class="seg">${[['WEEK','Semaine'],['MONTH','Mois'],['AGENDA','Liste']].map(([k,l])=>`<button class="${k===mode?'on':''}" data-agm="${k}">${l}</button>`).join('')}</div>
      <a class="btn" href="${ouvrir}" target="_blank" rel="noopener">Ouvrir dans Google Agenda ↗</a></div></div>
  ${L.length>1?coches:''}
  ${sel.length?`<div class="card agenda"><iframe title="Agenda" src="${agendaSrc(mode, sel)}" loading="lazy"></iframe></div>`
    :`<div class="card pad"><p class="muted" style="margin:0">Coche au moins un agenda pour l’afficher.</p></div>`}`;
}
function bindAgenda(m){
  m.querySelectorAll('[data-agm]').forEach(b=>b.onclick=()=>{ S.agendaMode=b.dataset.agm; render(); });
  m.querySelectorAll('[data-agsel]').forEach(c=>c.onchange=()=>{ S.agendaSel=[...m.querySelectorAll('[data-agsel]')].filter(x=>x.checked).map(x=>x.dataset.agsel); savePrefs(); render(); });
}
