/* =========================================================
   MOTEUR DES CHAPITRES
   Le 2.3 (relais.js) garde son code propre ; les autres chapitres
   (2.1, 2.2…) sont décrits par des données : capsules, texte,
   questions rapides et exercices interactifs génériques.
   ========================================================= */
const CHAPTERS = {};
function defChapter(ch){ ch.course=ch.course||'4-elec'; ch.caps.forEach(c=>{ c.chap=ch.num; }); CHAPTERS[ch.num]=ch; if(ch.Q) Object.assign(Q, ch.Q); }
/* numéro affiché : « 2.3 » en 4e ; en 3QEM la clé interne « 0.6 » s'affiche « 6 » */
const chapLbl = num => { const ch=CHAPTERS[num]; return ch&&ch.lbl ? ch.lbl : num; };
const courseOfChap = num => (CHAPTERS[num]||{}).course || '4-elec';
function chapOf(capId){
  if(!capId) return null;
  if(capId.startsWith('syn:')) return CHAPTERS[capId.slice(4)]||null;
  if(capId==='test'||capId==='fv') return CHAPTERS['2.3'];
  return Object.values(CHAPTERS).find(ch=>ch.caps.some(c=>c.id===capId))||null;
}
function capById(id){ for(const ch of Object.values(CHAPTERS)){ const c=ch.caps.find(x=>x.id===id); if(c) return c; } return null; }
function chapCapsDone(num){ const ch=CHAPTERS[num]; return ch ? ch.caps.filter(capDone).length : 0; }
function chapResume(num){ const ch=CHAPTERS[num]; const c=ch.caps.find(x=>!capDone(x)); return c?c.id:(ch.legacy?'test':'syn:'+num); }
/* point « à l'atelier » : coché par le prof (stocké côté serveur, l'élève ne peut pas le changer) */
const atelOk = x => !!(x.atel && P().atel && P().atel[x.atel]);
function exSet(k){ const p=P(); if(!p.ex[k]){ p.ex[k]=true; save(); } updateTocChecks(); }
function DR(){ const p=P(); if(!p.dr||typeof p.dr!=='object') p.dr={}; return p.dr; }

/* chapitres ouverts : le prof les ouvre pour sa classe et son cours (Suivi). Par défaut : les trois premiers.
   En 3QEM, les cours techniques sont donnés aux groupes de CT : c'est le groupe de CT de l'élève qui compte. */
const OUV_DEF={ '4-elec':['2.1','2.2','2.3'], '3em-elec':['0.1','0.2','0.3'] };
function classeDuCours(course){
  const co=COURS.find(c=>c.id===course);
  if(S.me && S.me.role==='eleve' && co && co.type!=='tp' && /^3qem/.test(S.me.classe||'') && S.me.ct) return S.me.ct;
  return S.eleveClass;
}
const ouvKey = (cl, course='4-elec') => (cl||classeDuCours(course))+'|'+course;
function chapsOuverts(cl, course='4-elec'){ const o=(S.ouv||{})[ouvKey(cl,course)]; return Array.isArray(o)?o:(OUV_DEF[course]||[]); }
function chapOpen(num){ return S.role==='prof' || chapsOuverts(null, courseOfChap(num)).includes(num); }
const chapNums = (course='4-elec') => Object.keys(CHAPTERS).filter(k=>CHAPTERS[k].course===course).sort((a,b)=>a.localeCompare(b,'fr',{numeric:true}));
/* cours dont les chapitres sont dans la plateforme */
const courseHasChaps = id => Object.values(CHAPTERS).some(ch=>ch.course===id);

/* le 2.3 dans le registre (ses capsules, ses pages PDF) */
defChapter({ num:'2.3', titre:'Le relais électromécanique', tp:'É03', caps:CAPS, legacy:true, pdf:[53,53,54,54,55,57,59,61] });

/* ---------- petits outils ---------- */
const num = v => { if(v==null) return NaN; const s=String(v).trim().replace(/\s| | /g,'').replace(',','.'); return s===''?NaN:+s; };
const fr = (x,d=2) => (Math.round(x*10**d)/10**d).toLocaleString('fr-BE',{maximumFractionDigits:d});
const WS = {};  // état d'écran des exercices (non enregistré)
function wDone(box, html){ box.innerHTML = `<div class="fb good">${html}</div>`; }

/* ---------- exercice : remettre dans l'ordre ---------- */
function mountOrderW(box, key, cfg){
  box._w={key,cfg};
  const st = WS[key] || (WS[key]={ slots:[], fb:'' });
  const order = cfg.shuffle || cfg.items.map((_,i)=>i).reverse();
  const draw = ()=>{
    if(P().ex[key]){ wDone(box, `<b>${cfg.ok||'Ordre correct.'}</b><ol style="margin:6px 0 0 18px">${cfg.items.map(x=>`<li>${x}</li>`).join('')}</ol>`); return; }
    const n=cfg.items.length;
    box.innerHTML = `<div class="ordw">${cfg.items.map((_,i)=>`<button class="slot" data-oslot="${i}"><span class="n">${i+1}</span>${st.slots[i]!=null?cfg.items[st.slots[i]]:'<span class="muted">…</span>'}</button>`).join('')}</div>
      <div class="order-pool" style="margin-top:10px">${order.filter(i=>!st.slots.includes(i)).map(i=>`<button data-opool="${i}">${cfg.items[i]}</button>`).join('')}</div>
      <div class="row" style="margin-top:10px"><button class="btn sm primary" data-ock ${st.slots.filter(x=>x!=null).length<n?'disabled':''}>Vérifier</button><button class="btn sm ghost" data-oclr>Tout reprendre</button><span class="small">${st.fb}</span></div>`;
    box.querySelectorAll('[data-opool]').forEach(b=>b.onclick=()=>{ const i=[...Array(n).keys()].find(i=>st.slots[i]==null); st.slots[i]=+b.dataset.opool; st.fb=''; draw(); });
    box.querySelectorAll('[data-oslot]').forEach(b=>b.onclick=()=>{ st.slots[+b.dataset.oslot]=null; draw(); });
    box.querySelector('[data-oclr]').onclick=()=>{ st.slots=[]; st.fb=''; draw(); };
    const ck=box.querySelector('[data-ock]'); ck.onclick=()=>{
      const bad=st.slots.map((v,i)=>v===i?null:i+1).filter(x=>x!=null);
      if(!bad.length){ exSet(key); }
      else st.fb=`<span style="color:var(--bad)">${bad.length} position${bad.length>1?'s':''} à revoir (n° ${bad.join(', ')}). ${cfg.hint||''}</span>`;
      draw(); };
  };
  draw();
}

/* ---------- exercice : classer chaque élément dans une catégorie ---------- */
function mountSortW(box, key, cfg){
  box._w={key,cfg};
  const st = WS[key] || (WS[key]={ sel:{}, checked:false });
  const draw = ()=>{
    const done=!!P().ex[key];
    box.innerHTML = `${cfg.intro?`<p class="small" style="margin-top:0">${cfg.intro}</p>`:''}<div class="sortw">${cfg.items.map(([lbl,good,why],i)=>{
      const s=done?good:st.sel[i], ok=s===good;
      return `<div class="srow ${done||st.checked&&s!=null?(ok?'good':'wrong'):''}"><div class="lbl">${lbl}${(done||st.checked&&!ok&&s!=null)&&why?`<div class="tiny muted">${why}</div>`:''}</div>
        <div class="seg">${cfg.cats.map(([k,l])=>`<button class="${s===k?'on':''}" data-sit="${i}" data-sc="${k}" ${done?'disabled':''}>${l}</button>`).join('')}</div></div>`; }).join('')}</div>
      ${done?`<div class="fb good" style="margin-top:10px"><b>${cfg.ok||'Tout est juste.'}</b></div>`:`<div class="row" style="margin-top:10px"><button class="btn sm primary" data-sck ${Object.keys(st.sel).length<cfg.items.length?'disabled':''}>Vérifier</button><span class="small" data-sfb></span></div>`}`;
    if(done) return;
    box.querySelectorAll('[data-sit]').forEach(b=>b.onclick=()=>{ st.sel[+b.dataset.sit]=b.dataset.sc; st.checked=false; draw(); });
    box.querySelector('[data-sck]').onclick=()=>{
      const bad=cfg.items.filter(([,g],i)=>st.sel[i]!==g).length;
      if(!bad){ exSet(key); draw(); return; }
      st.checked=true; draw(); box.querySelector('[data-sfb]').innerHTML=`<span style="color:var(--bad)">${bad} réponse${bad>1?'s':''} à revoir (en rouge). ${cfg.hint||''}</span>`; };
  };
  draw();
}

/* ---------- exercice : série de calculs corrigés ---------- */
/* rows : [{q, unit, ans, tol (relative, défaut 2 %), hint}] — les réponses sont calculées dans le code, pas recopiées */
function mountDrillW(box, key, cfg){
  box._w={key,cfg};
  const dr=DR(), vals = dr[key] || (dr[key]={});
  const st = WS[key] || (WS[key]={ checked:false });
  const okRow=(r,i)=>{ let v=num(vals[i]); if(isNaN(v) && typeof parseVal==='function') v=parseVal(vals[i]); if(isNaN(v)) return false; const tol=r.tol!=null?r.tol:0.02; return Math.abs(v-r.ans) <= Math.max(Math.abs(r.ans)*tol, r.abs||1e-9); };
  const draw=()=>{
    const done=!!P().ex[key];
    box.innerHTML = `${cfg.intro?`<p class="small" style="margin-top:0">${cfg.intro}</p>`:''}<div class="drill">${cfg.rows.map((r,i)=>{
      const ok=okRow(r,i), show=done||st.checked&&vals[i]!=null&&vals[i]!=='';
      return `<div class="drow ${show?(ok||done?'good':'wrong'):''}"><span class="dn">${i+1}</span><span class="dq">${r.q}</span>
        <span class="din"><input type="text" inputmode="decimal" data-dv="${i}" value="${esc(done&&!ok?fr(r.ans,4):vals[i]||'')}" ${done?'disabled':''} aria-label="Réponse ${i+1}"><span class="u">${r.unit||''}</span></span>
        ${show&&!ok&&!done&&r.hint?`<span class="dh">${r.hint}</span>`:''}</div>`; }).join('')}</div>
      ${done?`<div class="fb good" style="margin-top:10px"><b>${cfg.ok||'Toutes les réponses sont justes.'}</b></div>`
        :`<div class="row" style="margin-top:10px"><button class="btn sm primary" data-dck>Vérifier</button><span class="small" data-dfb></span></div>`}`;
    if(done) return;
    box.querySelectorAll('[data-dv]').forEach(inp=>inp.oninput=()=>{ vals[+inp.dataset.dv]=inp.value; st.checked=false; inp.closest('.drow').className='drow'; });
    box.querySelector('[data-dck]').onclick=()=>{
      const n=cfg.rows.filter(okRow).length; save();
      if(n===cfg.rows.length){ exSet(key); draw(); return; }
      st.checked=true; draw(); box.querySelector('[data-dfb]').innerHTML=`<b>${n}/${cfg.rows.length}</b> juste${n>1?'s':''}. <span style="color:var(--bad)">Corrige les lignes en rouge.</span> ${cfg.hint||''}`; };
  };
  draw();
}

/* ---------- blocs de texte réutilisables ---------- */
const terrain = t => `<div class="note terrain"><b>Sur le terrain — à quoi ça sert vraiment</b>${t}</div>`;
const formula = (f, leg) => `<div class="formula"><div class="f">${f}</div>${leg?`<div class="tiny muted">${leg}</div>`:''}</div>`;
const tbl = (head, rows) => `<div class="scroll-x"><table class="t"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((c,i)=>`<td>${i===0?`<b>${c}</b>`:c}</td>`).join('')}</tr>`).join('')}</table></div>`;
const exbox = (id, title, sub) => `<div class="figure exw"><div class="row between wrap"><b>${title}</b><span class="chip amber">exercice</span></div>${sub?`<div class="small muted" style="margin:4px 0 10px">${sub}</div>`:'<div style="height:10px"></div>'}<div id="${id}"></div></div>`;

/* ---------- page de fin de chapitre : synthèse, évaluation, prérequis du TP ---------- */
function synHTML(num){
  const ch=CHAPTERS[num], open=typeof fcorOpen==='function' && fcorOpen(num), f=(S.fcor||[]).find(x=>x.ch===num);
  const pre=ch.prereq||[], nOk=pre.filter(x=>x.cap&&capDone(capById(x.cap))).length;
  return `<div class="cap-body"><div class="kicker">Fin du chapitre ${chapLbl(num)}</div><h2>Synthèse et évaluation</h2>
    ${ch.noEval?'':`<div class="card pad" style="margin:12px 0"><div class="row between wrap"><div><div class="kicker">Évaluation formative ${num}</div>
      <b>${f?esc(f.titre):esc(ch.titre)}</b><div class="small muted">${ch.evalInfo||'Elle se passe sur papier, en classe, avec ton prof.'} ${open?'Elle est terminée : tu peux relire les questions et le corrigé.':'Quand elle sera corrigée, tu pourras relire ici les questions et le corrigé.'}</div></div>
      ${open?`<button class="btn primary" data-fcor="${num}">Évaluation et corrigé</button>`:'<span class="chip">🔒 après l’évaluation</span>'}</div></div>`}
    <h3>${ch.prereqTitle||`Ce que tu dois maîtriser avant d'entrer au TP ${ch.tp}`}</h3>
    <p class="small muted">${ch.prereqNote||'Chaque point se coche quand la capsule correspondante est validée. Le geste lui-même se vérifie à l’atelier, avec ton prof.'}</p>
    <div class="fv">${pre.map(x=>{ const c=x.cap&&capById(x.cap), ok=c?capDone(c):atelOk(x); return `<div class="it ${ok?'ok':''}"><span class="lamp"></span><span>${x.t}</span><span class="src">${c?`${c.sec} · ${c.t}${ok?'':`<br><button class="revoir btn sm ghost" style="padding:2px 0" data-goto="${c.id}">y aller →</button>`}`:x.atel?(ok?'à l’atelier · ✓ validé par ton prof':'à l’atelier : ton prof le valide quand il t’a vu faire'):'à l’atelier'}</span></div>`; }).join('')}</div>
    <div class="small muted" style="margin-top:6px">${nOk}/${pre.filter(x=>x.cap).length} points de théorie validés${pre.some(x=>x.atel)?` · ${pre.filter(x=>x.atel&&atelOk(x)).length}/${pre.filter(x=>x.atel).length} à l’atelier`:''}</div>
    ${(ch.controle||[]).length?`<h3 style="margin-top:20px">Questions de contrôle</h3>
    <p class="small muted">Les questions de la synthèse du cours. Réponds-y de tête ou dans ton cahier : si une réponse ne vient pas, relis la capsule indiquée.</p>`:''}
    <ol class="ctrlq">${(ch.controle||[]).map(([q,cap])=>`<li>${q}${cap?` <button class="revoir" data-goto="${cap}">${capById(cap).sec}</button>`:''}</li>`).join('')}</ol>
  </div>
  <div class="cap-foot"><button class="btn" data-cap="${ch.caps[ch.caps.length-1].id}">← ${ch.caps[ch.caps.length-1].t}</button><span></span><button class="btn primary" data-back="course">Retour au cours</button></div>`;
}
