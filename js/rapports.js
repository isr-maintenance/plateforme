/* =========================================================
   RAPPORTS DE TP (4e : TP électricité, électromécanique, mécanique)
   Les trois feuilles papier de l'atelier, à remplir en ligne :
     travail     : « Rapport de travail » (fiche de travail n°…)
     fabrication : « Rapport de travail complémentaire — fiche de fabrication »
     depannage   : « Rapport de travail complémentaire — fiche de dépannage »
   Annexes : un dessin 3 vues de l'Atelier de dessin (bouton « Joindre au rapport » dans l'atelier),
   une capture du Banc de câblage (bouton « Joindre au rapport de TP » dans sa capture), une photo.
   L'élève remet ; le prof note (remarques, compétences NA/EV/ATT, critères, total /100), publie ou rend le rapport.
   Serveur : rapportSave, rapportJoindre, rapportProf, rapportNoter… (textes et annexes dans l'onglet « dessins »).
   ========================================================= */
const RAP_COURS = () => COURS.filter(c=>c.type==='tp' && c.statut!=='app' && c.pour.some(([,a])=>a===4)).map(c=>c.id);
const RAP_TYPES = {
  travail: { nom:'Rapport de travail', court:'Rapport de travail', titre:'Rapport de travail', entete:[['num','Fiche de travail n°',8],['du','Périodes de travail du',10],['au','au',10],['heures','Temps utilisé (h)',6]],
    champs:[ ['sujet','Sujet de la fiche de travail',3,''],
      ['objectifs','1) Objectifs de la fiche de travail (côté droit de l’énoncé), en vue de l’évaluation',5,'Un objectif par ligne : ils seront numérotés. Ton prof évalue chacun (NA · EV · ATT).'],
      ['competences','Liste des compétences exercées (voir la feuille d’énoncé)',2,''],
      ['outillage','2) Outillage utilisé pour réaliser le travail (brève description)',3,''],
      ['materiel','4) Matériel utilisé pour l’exercice (références catalogue si nécessaire)',5,''],
      ['problemes','5) Problèmes rencontrés lors du travail et remèdes utilisés (sois précis)',4,''],
      ['annexe','6) Calculs, schémas et réponses aux questions',5,'Sois clair, ordonné, complet, et garde toute la structure de l’énoncé. Ajoute tes schémas et dessins en annexe ci-dessous.'] ],
    criteres:false },
  fabrication: { nom:'Fiche de fabrication', court:'Fabrication', titre:'Rapport de travail complémentaire', sous:'Fiche de fabrication', entete:[['du','Périodes de travail du',10],['au','au',10],['heures','Temps utilisé (h)',6]],
    champs:[ ['description','1) Brève description de la pièce à réaliser (ou de l’ensemble)',4,''],
      ['utilite','2) Utilité ou application pratique de la pièce (ou de l’ensemble)',3,''],
      ['materiel','3) Matériel ou pièces apportées et/ou liste des matières premières',5,''],
      ['annexe','4) Plans, schémas ou croquis',3,'Ajoute le plan de la pièce (dessin 3 vues) et tes croquis en annexe ci-dessous.'],
      ['outillage','5) Outillage et/ou machines utilisés (brève description)',4,''],
      ['competences','6) Compétences exercées (à compléter ensemble) d’après la liste',2,'C/…'] ],
    criteres:true },
  depannage: { nom:'Fiche de dépannage', court:'Dépannage', titre:'Rapport de travail complémentaire', sous:'Fiche de dépannage', entete:[['du','Périodes de travail du',10],['au','au',10],['heures','Temps utilisé (h)',6]],
    champs:[ ['lieu','1) Lieu du dépannage et/ou nom de la machine',2,''],
      ['panne','2) Brève description de la panne',4,''],
      ['solution','3) Solution trouvée d’après le diagnostic',4,''],
      ['pieces','4) Matériel ou pièces remplacées',4,''],
      ['outillage','5) Outillage utilisé (brève description)',3,''],
      ['competences','6) Compétences exercées (à compléter ensemble) d’après la liste',2,'C…'],
      ['annexe','Schémas et mesures (facultatif)',3,'Tu peux joindre le schéma de la machine (Banc de câblage) ou une photo ci-dessous.'] ],
    criteres:true },
};
const RAP = { cur:null, timer:null, imgs:{}, joindre:null };
const rapStatut = x => x.pub ? `<span class="chip ok">corrigé${x.note!=null?' · '+fr(x.note,1)+'/100':''}</span>` : x.remis ? `<span class="chip">remis${isProf()&&x.note!=null?' · noté '+fr(x.note,1):''}</span>` : `<span class="chip warn">brouillon</span>`;
const rapTitre = x => (x.type==='travail' && x.num ? 'Fiche n° '+x.num+' · ' : '') + (x.t || 'Sans titre');
const jourFr = v => /^\d{4}-\d{2}-\d{2}$/.test(v||'') ? v.split('-').reverse().join('/') : (v||'');
const objectifsDe = r => String(r.objectifs||'').split('\n').map(s=>s.trim()).filter(Boolean);

/* ---------- l'élève : ses rapports d'un cours de TP ---------- */
function rapportsBlock(course){
  const L=Object.entries(S.rapports||{}).filter(([,x])=>x.course===course).sort((a,b)=>(b[1].maj||0)-(a[1].maj||0));
  return `<div class="card" style="margin-bottom:16px"><div class="pad row between wrap" style="border-bottom:1px solid var(--line)"><div><h3 style="margin:0">Mes rapports de TP</h3><p class="small muted" style="margin:4px 0 0">Les feuilles de rapport de l’atelier, à remplir ici. Ton prof les corrige en ligne.</p></div>
      <div class="row wrap" style="gap:6px">${Object.entries(RAP_TYPES).map(([k,t])=>`<button class="btn sm ${k==='travail'?'primary':''}" data-rapnew="${k}|${esc(course)}">+ ${esc(t.nom)}</button>`).join('')}</div></div>
    ${L.length?`<div class="chapters" style="padding:6px 12px">${L.map(([id,x])=>`<div class="chap avail"><span class="num">${x.type==='travail'?'📄':x.type==='fabrication'?'🔩':'🔧'}</span><div class="ti"><b>${esc(rapTitre(x))}</b><span class="tiny muted">${esc(RAP_TYPES[x.type]?RAP_TYPES[x.type].nom:'')} · modifié ${fmtAgo(x.maj)}</span></div>${rapStatut(x)}<button class="btn sm" data-rapopen="${esc(id)}|${esc(course)}">${x.remis?'Voir':'Ouvrir'}</button></div>`).join('')}</div>`
      :'<div class="pad"><p class="small muted" style="margin:0">Aucun rapport pour l’instant : choisis la feuille à remplir.</p></div>'}</div>`;
}
function pageRapports(){
  const c=COURS.find(x=>x.id===S.view.course)||{titre:'TP'};
  return `<div class="crumbs"><button data-back="home">Mes cours</button> › ${esc(c.titre)}</div>
    <div class="page-head"><div><div class="kicker">${esc(cls(S.eleveClass).nom||'')}</div><h1>${esc(c.titre)}</h1></div></div>${rapportsBlock(c.id)}`;
}
function bindRapportsListe(m){
  m.querySelectorAll('[data-rapnew]').forEach(b=>b.onclick=()=>{ const [type,course]=b.dataset.rapnew.split('|'); const id='r'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36);
    RAP.cur={ id, r:{ id, type, course, joints:[] }, neuf:true }; S.view={page:'rapport', id, course}; render(); window.scrollTo(0,0); });
  m.querySelectorAll('[data-rapopen]').forEach(b=>b.onclick=()=>{ const [id,course]=b.dataset.rapopen.split('|'); ouvrirRapport(id, course); });
}
async function ouvrirRapport(id, course, mail){
  RAP.cur=null; S.tab=mail?'contenus':'cours'; S.view={page:'rapport', id, course, mail:mail||''}; render(); window.scrollTo(0,0);
  const r = mail ? await act('rapportProf',{mail, id}) : await act('rapportGet',{id});
  if(!r){ S.view={page:mail?'home':'rapports', course}; render(); return; }
  RAP.cur={ id, r:r.r, mail:mail||'' }; if(S.view.page==='rapport' && S.view.id===id) render();
}

/* ---------- le rapport (élève : remplir ; prof : lire et noter) ---------- */
function pageRapport(){
  const C=RAP.cur, prof=!!S.view.mail, back=`<div class="crumbs"><button data-rapback>← ${prof?'Retour au suivi':'Mes rapports'}</button></div>`;
  if(!C || C.id!==S.view.id) return back+`<div class="card pad"><p class="muted" style="margin:0">Chargement…</p></div>`;
  const r=C.r, T=RAP_TYPES[r.type]||RAP_TYPES.travail, ro=prof || !!r.remis, nom=prof?nomEl(S.view.mail):S.me.nom, classe=prof?cls((S.eleves[S.view.mail]||{}).classe).nom:cls(S.me.classe).nom;
  const P=r.prof||{};
  const champ=([k,l,rows,aide])=>`<div class="rap-champ"><label class="rap-l" for="rap-${k}">${esc(l)}</label>${aide&&!ro?`<div class="tiny muted" style="margin-bottom:4px">${esc(aide)}</div>`:''}
      ${ro?`<div class="rap-ro">${k==='objectifs'?objectifsDe(r).map((o,i)=>`<div class="row between" style="gap:8px;padding:3px 0;border-bottom:1px dashed var(--line-2)"><span>${i+1}. ${esc(o)}</span>${prof?`<span class="row" style="gap:2px">${['NA','EV','ATT'].map(v=>`<button class="btn sm ${(P.comp||{})[i]===v?'primary':'ghost'}" data-rapcomp="${i}|${v}" title="${v==='NA'?'Non acquis':v==='EV'?'En voie':'Atteint'}">${v}</button>`).join('')}</span>`:(P.comp||{})[i]?`<b>${esc(P.comp[i])}</b>`:''}</div>`).join('')||'<span class="muted">—</span>':esc(r[k]||'')||'<span class="muted">—</span>'}</div>`
        :`<textarea id="rap-${k}" data-rapf="${k}" rows="${rows}" maxlength="3000" style="width:100%">${esc(r[k]||'')}</textarea>`}</div>`;
  const joints=(r.joints||[]).map(j=>`<figure class="rap-joint"><div class="rap-img" data-rapimg="${esc(j.id)}">${RAP.imgs[C.id+'|'+j.id]?`<img src="${RAP.imgs[C.id+'|'+j.id]}" alt="${esc(j.t)}">`:'<span class="tiny muted">chargement…</span>'}</div>
      <figcaption class="small row between" style="gap:6px"><span>${esc(j.t)}</span>${ro?'':`<button class="btn sm ghost" data-rapjdel="${esc(j.id)}">Retirer</button>`}</figcaption></figure>`).join('');
  const criteres=(P.criteres&&P.criteres.length?P.criteres:[['','','']]);
  const evalProf = prof ? `<div class="card pad" style="margin-top:14px;border-color:var(--meca)"><h3 style="margin-top:0">${T.criteres?'7) Critères d’évaluation globale':'7) Remarques et 8) évaluation'} <span class="tiny muted">(réservé au professeur)</span></h3>
      ${T.criteres?`<table class="t small" data-rapcrit><tr><th>Critère</th><th style="width:80px">Points</th><th style="width:80px">Sur</th><th></th></tr>${criteres.map((c,i)=>`<tr><td><input type="text" data-crit="${i}|0" value="${esc(c[0])}" style="width:100%"></td><td><input type="number" step="0.5" data-crit="${i}|1" value="${c[1]}" style="width:70px"></td><td><input type="number" step="0.5" data-crit="${i}|2" value="${c[2]}" style="width:70px"></td><td><button class="btn sm ghost" data-critdel="${i}">✕</button></td></tr>`).join('')}</table>
        <div class="row between wrap" style="margin:6px 0 10px"><button class="btn sm" data-critadd>+ Critère</button><span class="small" data-crittot></span></div>`:''}
      <label class="small"><b>Remarques générales</b><textarea data-rapprof="remarques" rows="3" style="width:100%">${esc(P.remarques||'')}</textarea></label>
      <div class="row wrap" style="gap:8px;margin-top:8px;align-items:center"><label class="small row" style="gap:6px"><b>TOTAL</b><input type="number" min="0" max="100" step="0.5" data-rapprof="total" value="${P.total??''}" style="width:80px"> / 100</label>
        <span class="grow"></span>${r.remis?`<button class="btn" data-raprendre title="L’élève peut de nouveau le modifier">Rendre à l’élève</button>`:''}<button class="btn" data-rapnoter="0">Enregistrer</button><button class="btn primary" data-rapnoter="1">${r.pub?'Enregistrer (publié)':'Enregistrer et publier'}</button></div>
      ${!r.remis?'<p class="tiny" style="color:var(--warn);margin:6px 0 0">Ce rapport n’est pas encore remis : l’élève peut encore le modifier.</p>':''}</div>`
    : r.pub ? `<div class="card pad" style="margin-top:14px;border-color:var(--ok)"><h3 style="margin-top:0">Évaluation de ton prof : ${P.total!==''&&P.total!=null?`<b>${fr(P.total,1)} / 100</b>`:'—'}</h3>
      ${T.criteres&&(P.criteres||[]).some(c=>c[0])?`<table class="t small"><tr><th>Critère</th><th>Points</th></tr>${P.criteres.filter(c=>c[0]).map(c=>`<tr><td>${esc(c[0])}</td><td>${c[1]===''?'—':fr(+c[1],1)}${c[2]!==''?' / '+fr(+c[2],1):''}</td></tr>`).join('')}</table>`:''}
      ${P.remarques?`<p style="white-space:pre-wrap;margin:8px 0 0">${esc(P.remarques)}</p>`:''}<p class="tiny muted" style="margin:6px 0 0">Corrigé par ${esc(P.by||'ton prof')}.</p></div>`
    : P.remarques && !r.remis ? `<div class="note warn"><b>Ton prof t’a rendu ce rapport</b><span style="white-space:pre-wrap">${esc(P.remarques)}</span></div>` : '';
  return `${back}<div class="page-head"><div><div class="kicker">${esc((COURS.find(x=>x.id===r.course)||{}).titre||'TP')} · Atelier électromécanique 4e année</div><h1>${esc(T.titre)}${T.sous?` <span class="muted" style="font-weight:500">— ${esc(T.sous)}</span>`:''}</h1></div>
      <div class="row wrap"><button class="btn" data-rapprint>🖨 Imprimer</button>${!ro&&!C.neuf?'<button class="btn ghost" data-rapdel>Supprimer</button>':''}</div></div>
    ${r.remis&&!prof&&!r.pub?'<div class="note" style="margin-top:0"><b>Rapport remis</b>Ton prof le corrige. Tu verras son évaluation ici.</div>':''}
    <div class="card pad"><div class="grid g3 small" style="gap:6px;margin-bottom:10px"><div><span class="muted">Nom :</span> <b>${esc(nom)}</b></div><div><span class="muted">Classe :</span> <b>${esc(classe||'—')}</b></div><div></div></div>
      <div class="row wrap" style="gap:10px">${T.entete.map(([k,l,w])=>`<label class="small row" style="gap:6px">${esc(l)} ${ro?`<b>${esc((k==='du'||k==='au'?jourFr(r[k]):r[k])||'…')}</b>`:`<input type="${k==='du'||k==='au'?'date':'text'}" data-rapf="${k}" value="${esc(r[k]||'')}" style="width:${k==='du'||k==='au'?'150px':w*12+'px'}">`}</label>`).join('')}</div></div>
    ${T.sous?`<h2 style="margin:16px 0 6px;text-align:center;text-decoration:underline;font-size:17px">${esc(T.sous.toUpperCase())}</h2>`:''}
    <div class="card pad rap-form">${T.champs.map(champ).join('')}
      <div class="rap-champ"><div class="rap-l">Annexes : dessins, schémas, photos</div>
        ${ro?'':`<div class="row wrap" style="gap:6px;margin-bottom:8px"><button class="btn" data-rapatelier>✏️ Dessin 3 vues (Atelier de dessin)</button><button class="btn" data-rapbanc>⚡ Schéma électrique (Banc de câblage)</button><label class="btn" style="cursor:pointer">🖼 Photo ou image<input type="file" accept="image/*" data-rapphoto hidden></label></div>
          <p class="tiny muted" style="margin:0 0 8px">L’atelier ou le banc s’ouvre : dessine, puis « Joindre au rapport » (dans le banc : 📷 Capture › « Joindre au rapport de TP »).</p>`}
        <div class="rap-joints">${joints||'<span class="small muted">Aucune annexe.</span>'}</div></div>
    </div>
    ${evalProf}
    ${ro?'':`<div class="card pad row between wrap" style="gap:10px;margin-top:14px"><span class="small muted" data-rapsave>${C.neuf?'Le rapport s’enregistre dès que tu écris.':'Enregistré au fur et à mesure.'}</span><button class="btn primary" data-rapremettre>Remettre au prof</button></div>`}`;
}
/* charge les images des annexes (une fois) */
function rapImages(m){
  const C=RAP.cur; if(!C) return;
  m.querySelectorAll('[data-rapimg]').forEach(async box=>{ const j=box.dataset.rapimg, k=C.id+'|'+j; if(RAP.imgs[k] || box.dataset.ld) return; box.dataset.ld='1';
    const r=await act('rapportJoint', Object.assign({id:C.id, j}, C.mail?{mail:C.mail}:{})); if(!r) return;
    RAP.imgs[k] = r.data.charAt(0)==='<' ? 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(r.data) : r.data;
    if(box.isConnected) box.innerHTML=`<img src="${RAP.imgs[k]}" alt="">`; });
}
async function rapEnregistrer(remettre){
  const C=RAP.cur; clearTimeout(RAP.timer); RAP.timer=null;
  const r=await act('rapportSave', Object.assign({id:C.id, r:C.r}, remettre?{remettre:true}:{}));
  const s=document.querySelector('[data-rapsave]'); if(s) s.textContent = r ? 'Enregistré.' : 'Non enregistré : vérifie ta connexion.';
  if(r){ C.neuf=false; C.r.maj=r.maj; if(remettre) C.r.remis=r.remis; S.rapports=S.rapports||{}; S.rapports[C.id]=Object.assign({}, S.rapports[C.id]||{}, { type:C.r.type, course:C.r.course, num:C.r.num||'', t:(C.r.sujet||C.r.description||C.r.panne||'').slice(0,80), maj:r.maj, remis:C.r.remis||0, pub:0 }); }
  return r;
}
function bindRapport(m){
  const C=RAP.cur;
  const bk=m.querySelector('[data-rapback]'); if(bk) bk.onclick=()=>{ if(RAP.timer) rapEnregistrer(); if(S.view.mail){ S.tab='dash'; S.view={page:'home'}; } else S.view={page:'rapports', course:S.view.course}; render(); window.scrollTo(0,0); };
  if(!C || C.id!==S.view.id) return;
  rapImages(m);
  const pr=m.querySelector('[data-rapprint]'); if(pr) pr.onclick=()=>imprimerRapport();
  if(S.view.mail){ bindRapportProf(m); return; }
  if(C.r.remis) return;
  const plus=()=>{ clearTimeout(RAP.timer); const s=m.querySelector('[data-rapsave]'); if(s) s.textContent='Modifications en attente…'; RAP.timer=setTimeout(()=>rapEnregistrer(), 1500); };
  m.querySelectorAll('[data-rapf]').forEach(t=>t.oninput=()=>{ C.r[t.dataset.rapf]=t.value; plus(); });
  const del=m.querySelector('[data-rapdel]'); if(del) del.onclick=async()=>{ if(!confirm('Supprimer ce rapport et ses annexes ?')) return; if(await act('rapportDel',{id:C.id},'Rapport supprimé')){ delete (S.rapports||{})[C.id]; S.view={page:'rapports', course:S.view.course}; render(); } };
  const rb=m.querySelector('[data-rapremettre]'); if(rb) rb.onclick=async()=>{
    if(!rb.dataset.sure){ rb.dataset.sure='1'; rb.textContent='Confirmer : je remets mon rapport'; rb.classList.add('danger'); setTimeout(()=>{ if(rb.isConnected){ delete rb.dataset.sure; rb.textContent='Remettre au prof'; rb.classList.remove('danger'); } }, 6000); return; }
    rb.disabled=true; if(await rapEnregistrer(true)){ toast('Rapport remis à ton prof'); render(); window.scrollTo(0,0); } else rb.disabled=false; };
  const avant=async()=>{ if(C.neuf || RAP.timer) return !!(await rapEnregistrer()); return true; };   // une annexe s'accroche à un rapport enregistré
  const titre = () => (C.r.sujet||C.r.description||C.r.panne||RAP_TYPES[C.r.type].nom).split('\n')[0].slice(0,40);
  const at=m.querySelector('[data-rapatelier]'); if(at) at.onclick=async()=>{ if(!await avant()) return; RAP.joindre=C.id; openPanel('Atelier de dessin — dessin du rapport', 'outils/atelier-dessin/index.html#/dessin/rapport/'+encodeURIComponent(C.id)+'/'+encodeURIComponent(titre())); };
  const bc=m.querySelector('[data-rapbanc]'); if(bc) bc.onclick=async()=>{ if(!await avant()) return; RAP.joindre=C.id; openApp('banc', { rapport:true }); };
  const ph=m.querySelector('[data-rapphoto]'); if(ph) ph.onchange=async()=>{ const f=ph.files[0]; ph.value=''; if(!f) return; if(!await avant()) return;
    try{ const img=await createImageBitmap(f), k=Math.min(1, 1600/Math.max(img.width,img.height)), c=document.createElement('canvas'); c.width=Math.round(img.width*k); c.height=Math.round(img.height*k);
      const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height);
      let q=0.85, data=c.toDataURL('image/jpeg',q); while(data.length>450000 && q>0.45){ q-=0.1; data=c.toDataURL('image/jpeg',q); }
      await rapJoindre(C.id, data, f.name.replace(/\.[^.]+$/,'').slice(0,60)||'Photo', 'photo');
    }catch(e){ toast('Image illisible'); } };
  m.querySelectorAll('[data-rapjdel]').forEach(b=>b.onclick=async()=>{ if(!confirm('Retirer cette annexe ?')) return; const j=b.dataset.rapjdel;
    if(await act('rapportJointDel',{id:C.id, j},'Annexe retirée')){ C.r.joints=C.r.joints.filter(x=>x.id!==j); const y=window.scrollY; render(); window.scrollTo(0,y); } });
}
async function rapJoindre(id, data, t, src){
  const C=RAP.cur; toast('Ajout de l’annexe…');
  const r=await act('rapportJoindre',{id, data, t, src}, 'Annexe ajoutée au rapport'); if(!r) return;
  if(C && C.id===id){ C.r.joints=(C.r.joints||[]).concat([r.joint]); RAP.imgs[id+'|'+r.joint.id] = data.charAt(0)==='<' ? 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(data) : data; if(S.view.page==='rapport'){ const y=window.scrollY; render(); window.scrollTo(0,y); } }
}
/* l'atelier (même adresse) et le banc envoient leur dessin : il va dans le rapport ouvert */
window.addEventListener('message', e=>{
  const d=e.data; if(!d || typeof d!=='object' || d.type!=='joindre' || !RAP.joindre) return;
  const okSrc = (d.src==='atelier' && e.origin===location.origin) || (d.src==='banc' && typeof appOrigin==='function' && appOrigin('banc')===e.origin);
  if(!okSrc || typeof d.data!=='string' || d.data.length>480000 || !/^(data:image\/(png|jpeg|webp);base64,|<svg)/.test(d.data)) return;
  const id=RAP.joindre; closePanel(); rapJoindre(id, d.data, String(d.t||'Annexe').slice(0,80), d.src);
});

/* ---------- le prof ---------- */
function bindRapportProf(m){
  const C=RAP.cur, P=C.r.prof=C.r.prof||{ remarques:'', comp:{}, criteres:[['','','']], total:'' };
  if(!P.criteres || !P.criteres.length) P.criteres=[['','','']];
  const tot=()=>{ const z=m.querySelector('[data-crittot]'); if(!z) return; const pts=P.criteres.reduce((a,c)=>a+(+c[1]||0),0), max=P.criteres.reduce((a,c)=>a+(+c[2]||0),0);
    z.innerHTML = max ? `Total : <b>${fr(pts,1)} / ${fr(max,1)}</b> → <b>${fr(Math.round(pts/max*1000)/10,1)} / 100</b> <button class="btn sm ghost" data-crituse>Reporter</button>` : '';
    const u=z.querySelector('[data-crituse]'); if(u) u.onclick=()=>{ P.total=Math.round(pts/max*1000)/10; m.querySelector('[data-rapprof="total"]').value=P.total; }; };
  m.querySelectorAll('[data-crit]').forEach(i=>i.oninput=()=>{ const [r,c]=i.dataset.crit.split('|'); P.criteres[+r][+c]=c==='0'?i.value:(i.value===''?'':+i.value); tot(); });
  m.querySelectorAll('[data-critdel]').forEach(b=>b.onclick=()=>{ P.criteres.splice(+b.dataset.critdel,1); if(!P.criteres.length) P.criteres=[['','','']]; const y=window.scrollY; render(); window.scrollTo(0,y); });
  const ca=m.querySelector('[data-critadd]'); if(ca) ca.onclick=()=>{ P.criteres.push(['','','']); const y=window.scrollY; render(); window.scrollTo(0,y); };
  m.querySelectorAll('[data-rapcomp]').forEach(b=>b.onclick=()=>{ const [i,v]=b.dataset.rapcomp.split('|'); P.comp=P.comp||{}; P.comp[i]=P.comp[i]===v?'':v; const y=window.scrollY; render(); window.scrollTo(0,y); });
  m.querySelectorAll('[data-rapprof]').forEach(i=>i.oninput=()=>{ P[i.dataset.rapprof]=i.dataset.rapprof==='total'?(i.value===''?'':+i.value):i.value; });
  tot();
  const maj=pub=>{ const R=((S.rapports||{})[C.mail]||{})[C.id]; if(R){ if(P.total!=='') R.note=+P.total; if(pub) R.pub=Date.now(); } };
  m.querySelectorAll('[data-rapnoter]').forEach(b=>b.onclick=async()=>{ const pub=b.dataset.rapnoter==='1';
    if(await act('rapportNoter', Object.assign({mail:C.mail, id:C.id, prof:{ remarques:P.remarques, comp:P.comp, criteres:P.criteres.filter(c=>c[0]||c[1]!==''), total:P.total }}, pub?{pub:true}:{}), pub?'Évaluation publiée : l’élève la voit':'Évaluation enregistrée')){ if(pub) C.r.pub=Date.now(); maj(pub); const y=window.scrollY; render(); window.scrollTo(0,y); } });
  const rd=m.querySelector('[data-raprendre]'); if(rd) rd.onclick=async()=>{ if(!confirm('Rendre ce rapport à l’élève ? Il pourra le compléter puis le remettre de nouveau. Tes remarques restent visibles pour lui.')) return;
    await act('rapportNoter',{mail:C.mail, id:C.id, prof:{ remarques:P.remarques, comp:P.comp, criteres:P.criteres, total:P.total }});
    if(await act('rapportNoter',{mail:C.mail, id:C.id, rendre:true},'Rapport rendu à l’élève')){ C.r.remis=0; C.r.pub=0; const R=((S.rapports||{})[C.mail]||{})[C.id]; if(R){ R.remis=0; R.pub=0; } render(); } };
}
/* la carte du Suivi (cours de TP de 4e) */
function rapportsDash(cl, co, studs){
  const R=S.rapports||{}, rows=studs.map(s=>({ s, L:Object.entries(R[s.mail]||{}).filter(([,x])=>x.course===co).sort((a,b)=>(a[1].cree||a[1].maj||0)-(b[1].cree||b[1].maj||0)) }));
  const aCorr=rows.reduce((a,x)=>a+x.L.filter(([,r])=>r.remis&&!r.pub).length,0);
  return `<div class="card" style="margin-bottom:16px"><div class="pad" style="border-bottom:1px solid var(--line)"><h3 style="margin:0">Rapports de TP — ${esc(cls(cl).nom)}${aCorr?` <span class="chip warn">${aCorr} à corriger</span>`:''}</h3>
      <p class="small muted" style="margin:4px 0 0">Les élèves remplissent leurs feuilles de rapport en ligne (rapport de travail, fiche de fabrication, fiche de dépannage) et les remettent. Clique un rapport pour le lire et le noter. Pour le carnet : « + Note d’une application » › Rapports de TP.</p></div>
    <div class="scroll-x"><table class="t">${rows.map(({s,L})=>`<tr><td style="white-space:nowrap">${esc(s.nom)}</td><td>${L.length?`<div class="row wrap" style="gap:4px">${L.map(([id,x])=>`<button class="btn sm ${x.remis&&!x.pub?'primary':''}" data-rapouv="${esc(s.mail)}|${esc(id)}" title="${esc(RAP_TYPES[x.type]?RAP_TYPES[x.type].nom:'')}">${esc(rapTitre(x).slice(0,34))} · ${x.pub?(x.note!=null?fr(x.note,1)+'/100':'corrigé'):x.remis?'à corriger':'brouillon'}</button>`).join('')}</div>`:'<span class="small muted">—</span>'}</td></tr>`).join('')}</table></div></div>`;
}
function bindRapportsDash(m){
  m.querySelectorAll('[data-rapouv]').forEach(b=>b.onclick=()=>{ const [mail,id]=b.dataset.rapouv.split('|'); S.tab='contenus'; ouvrirRapport(id, (S.dashKey||'').split('|')[1], mail); });
}
/* carnet : moyenne des rapports notés pendant la période de la colonne (remis dans la période), pour ce cours */
function rapportScore(e, stud, key){
  const co=key.split('|')[1], d=e.app||{}, P=periodes().find(p=>e.date>=p.debut && e.date<=p.fin); if(!P) return null;
  const deb=new Date(P.debut+'T00:00:00').getTime(), fin=new Date(P.fin+'T23:59:59').getTime();
  const L=Object.values((S.rapports||{})[stud]||{}).filter(x=>x.course===co && x.remis && x.remis>=deb && x.remis<=fin && (!d.type || x.type===d.type));
  if(!L.length) return null; const n=L.filter(x=>x.note!=null); if(!n.length) return 'wait';
  return Math.round(n.reduce((a,x)=>a+x.note,0)/n.length*10)/10;
}

/* ---------- impression : la feuille, comme sur papier ---------- */
async function imprimerRapport(){
  const C=RAP.cur; if(!C) return; const r=C.r, T=RAP_TYPES[r.type]||RAP_TYPES.travail, P=(S.view.mail||r.pub)?(r.prof||{}):{};
  for(const j of r.joints||[]){ const k=C.id+'|'+j.id; if(!RAP.imgs[k]){ const x=await act('rapportJoint', Object.assign({id:C.id, j:j.id}, C.mail?{mail:C.mail}:{})); if(x) RAP.imgs[k]=x.data.charAt(0)==='<'?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(x.data):x.data; } }
  const nom=S.view.mail?nomEl(S.view.mail):S.me.nom, classe=S.view.mail?cls((S.eleves[S.view.mail]||{}).classe).nom:cls(S.me.classe).nom;
  const txt=k=>esc(r[k]||'').replace(/\n/g,'<br>')||'&nbsp;';
  const corps=T.champs.map(([k,l])=>`<h4>${esc(l)}</h4><div class="rep">${k==='objectifs'?`<table class="obj"><tr><th></th><th>NA</th><th>EV</th><th>ATT</th></tr>${objectifsDe(r).map((o,i)=>`<tr><td>${i+1}. ${esc(o)}</td>${['NA','EV','ATT'].map(v=>`<td class="c">${(P.comp||{})[i]===v?'✗':''}</td>`).join('')}</tr>`).join('')}</table>`:txt(k)}</div>`).join('');
  const crit=T.criteres?`<h4>7) Critères d’évaluation globale</h4><table class="crit">${(P.criteres&&P.criteres.length?P.criteres:[['','',''],['','',''],['','',''],['','','']]).map(c=>`<tr><td>${esc(c[0])}</td><td class="c">${c[1]===''?'':fr(+c[1],1)}</td><td class="c">${c[2]===''?'':fr(+c[2],1)}</td></tr>`).join('')}</table>`:`<h4>7) Remarques générales (réservé au professeur)</h4><div class="rep">${esc(P.remarques||'').replace(/\n/g,'<br>')||'&nbsp;'}</div>`;
  const html=`<!doctype html><html lang="fr-BE"><head><meta charset="utf-8"><title>${esc(T.titre)} — ${esc(nom)}</title><style>
    @page{size:A4;margin:14mm}body{font:11pt/1.4 Arial,Helvetica,sans-serif;color:#000;margin:0}
    .cadre{border:3px double #000;text-align:center;font:italic 700 18pt Arial;margin:0 auto 10px;padding:4px 10px;width:fit-content;text-decoration:underline}
    .bande{border:3px double #000;text-align:center;font:italic 700 15pt Arial;padding:4px;margin-bottom:8px}.id{border:1px solid #000;padding:5px 8px;margin-bottom:8px;font-style:italic;font-weight:700;display:flex;gap:24px}
    .per{border:3px double #000;padding:5px;text-align:center;margin-bottom:10px}h3{text-align:center;text-decoration:underline;font-size:12pt;margin:10px 0}
    h4{font-size:11pt;margin:12px 0 3px}.rep{border-bottom:1px dotted #555;min-height:1.4em;padding:2px 0 4px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:4px 6px;font-size:10pt}
    .c{text-align:center;width:46px}.crit td{height:26px}.joint{page-break-inside:avoid;margin:10px 0;text-align:center}.joint img{max-width:100%;max-height:230mm;border:1px solid #999}
    .tot{border:3px double #000;padding:6px 14px;font-size:14pt;display:inline-block;margin-top:12px}.prof{margin-top:8px}</style></head><body>
    <div class="cadre">Atelier électromécanique 4è Année</div><div class="bande">${esc(T.titre)}</div>
    <div class="id"><span>Nom : ${esc(nom)}</span><span>Classe : ${esc(classe||'')}</span></div>
    <div class="per">${r.type==='travail'?`Fiche de travail N° ${esc(r.num||'……')} &nbsp; `:''}Périodes de travail du ${esc(jourFr(r.du)||'……')} au ${esc(jourFr(r.au)||'……')}<br>Temps utilisé : ${esc(r.heures||'……')} h</div>
    ${T.sous?`<h3>${esc(T.sous.toUpperCase())}</h3>`:''}${corps}${crit}
    ${T.criteres&&P.remarques?`<h4>Remarques du professeur</h4><div class="rep">${esc(P.remarques).replace(/\n/g,'<br>')}</div>`:''}
    <div class="tot">TOTAL : ${P.total!==''&&P.total!=null?fr(+P.total,1):'……'} / 100</div>${P.by?`<div class="prof">${esc(P.by)}</div>`:''}
    ${(r.joints||[]).length?`<h3 style="page-break-before:always">Annexes</h3>${r.joints.map(j=>`<div class="joint"><img src="${RAP.imgs[C.id+'|'+j.id]||''}"><div>${esc(j.t)}</div></div>`).join('')}`:''}
    </body></html>`;
  const f=document.createElement('iframe'); f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0'; document.body.appendChild(f);
  f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
  setTimeout(()=>{ try{ f.contentWindow.focus(); f.contentWindow.print(); }catch(e){ toast('Impression impossible ici'); } setTimeout(()=>f.remove(), 60000); }, 600);
}
