/* =========================================================
   NOTES DES APPLICATIONS DANS LE CARNET DE COTES (en direct)
   Dossier TP et Banc de câblage ont leur propre serveur (Apps Script, dépôts olivier7887).
   Le navigateur du prof s'y connecte avec son compte de la plateforme (ticket ssoTicket → action « sso » de l'app,
   qui le fait vérifier par la plateforme et remet la clé de l'app), puis lit les résultats comme la vue prof de l'app :
     Dossier TP      : profEleves → par élève et par TP : remis, date de remise, grille de la correction publiée
     Banc de câblage : profDonnees → par élève et par défi : essais, réussi, note de la recherche de pannes (/20)
   Rien n'est recopié sur le serveur de la plateforme : le carnet relit les apps à l'ouverture, puis toutes les minutes.
   Le prof doit être inscrit comme prof dans l'app (onglet Profs de son Google Sheet), sinon l'app le voit comme élève.
   L'Atelier de dessin (même serveur que la plateforme) est relu aussi (action dessinRes).
   ========================================================= */
const APP_NOTES = {
  dossier: { nom:'Dossier TP', api:'https://script.google.com/macros/s/AKfycbygq4swq478-XIIcwafYAEEPflSJeO8ocO0ArUqx7NixK8ZO8XbAnC8tNITk9Yvm7UL/exec', liste:'https://olivier7887.github.io/dossier-tp/data.js' },
  banc:    { nom:'Banc de câblage', api:'https://script.google.com/macros/s/AKfycbwcEiD-t69me_16NUq0a87jlMjNtlnpxxckAeyh6jvi5AYcXMThXoLF2vWC90Vz2lMEaw/exec' },
};
/* grille de correction de Dossier TP (correction.js de l'app) : clé, critère, points maximum */
const DOSSIER_GRILLE = [['normes',40],['processus',80],['communication',50],['produit',45]];
const AN = { cle:{}, data:{}, t:{}, err:{}, charge:{}, tps:null, dessinsT:0 };
const AN_FRAIS = 60000;   // relu au plus toutes les minutes

async function appPost(app, body){
  const r = await fetch(APP_NOTES[app].api, { method:'POST', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:JSON.stringify(body), credentials:'omit', cache:'no-store' });
  return r.json();
}
async function appCle(app, neuve){
  const k='appcle-'+app+'-'+(S.me&&S.me.mail);
  if(!neuve){ if(AN.cle[app]) return AN.cle[app]; try{ const c=sessionStorage.getItem(k); if(c) return (AN.cle[app]=c); }catch(e){} }
  const t = await API.call('ssoTicket', { app });
  if(!t.ok) throw new Error(t.msg || 'Connexion à l’app refusée');
  const r = await appPost(app, { a:'sso', ticket:t.ticket });
  if(!r.ok || !r.data || !r.data.cle) throw new Error(r.erreur || 'Connexion à l’app refusée');
  AN.cle[app]=r.data.cle; try{ sessionStorage.setItem(k, r.data.cle); }catch(e){}
  return r.data.cle;
}
async function appAppel(app, a){
  let cle = await appCle(app), r = await appPost(app, { a, cle });
  if(!r.ok && r.auth){ cle = await appCle(app, true); r = await appPost(app, { a, cle }); }   // clé expirée : une nouvelle
  if(!r.ok) throw new Error(/professeur/i.test(r.erreur||'') ? `Tu n’es pas inscrit comme prof dans ${APP_NOTES[app].nom} (onglet Profs de son Google Sheet).` : (r.erreur || 'Erreur de l’app'));
  return r.data;
}
/* relit une app (ou l'atelier) ; à la fin, le carnet se redessine s'il est affiché et que rien n'est en cours de saisie */
async function appCharger(app, force){
  if(AN.charge[app] || (!force && AN.t[app] && Date.now()-AN.t[app] < AN_FRAIS)) return;
  AN.charge[app]=true; const avant=JSON.stringify(app==='dessin'?S.dessins:AN.data[app]||null);
  try{
    if(app==='dossier') AN.data.dossier = { eleves: await appAppel('dossier', 'profEleves') };
    else if(app==='banc'){ const d = await appAppel('banc', 'profDonnees'); AN.data.banc = { res: d.resultats || [] }; }
    else if(app==='dessin'){ const r = await API.call('dessinRes'); if(r.ok) S.dessins = r.dessins || {}; }
    AN.err[app]=''; AN.t[app]=Date.now();
  }catch(e){ AN.err[app]=e.message||String(e); AN.t[app]=Date.now(); }
  AN.charge[app]=false;
  const apres=JSON.stringify(app==='dessin'?S.dessins:AN.data[app]||null);
  if((avant!==apres || AN.err[app]) && S.tab==='carnet'){ const f=document.activeElement; if(!(f && /INPUT|SELECT|TEXTAREA/.test(f.tagName) && f.closest('#main'))){ const y=window.scrollY; render(); window.scrollTo(0,y); } }
}
/* la liste des TP de Dossier TP (titres), lue dans l'app publiée */
async function dossierTPs(){
  if(AN.tps) return AN.tps;
  const t = await fetch(APP_NOTES.dossier.liste, { cache:'no-store' }).then(r=>r.text());
  const L=[]; t.replace(/id:\s*'([^']+)',\s*num:\s*'([^']*)',\s*titre:\s*'((?:[^'\\]|\\.)*)'/g, (m,id,num,titre)=>{ L.push({ id, num, titre:titre.replace(/\\'/g,"'") }); return m; });
  return (AN.tps=L);
}

/* ---------- les notes, en % (la colonne est sur 100 à l'origine, ramenée au total choisi) ---------- */
function dossierPct(st){
  if(!st || !st.remis || !st.corrige || !st.grille) return null;
  let tot=0, max=0; DOSSIER_GRILLE.forEach(([k,m])=>{ const v=st.grille[k]; if(v==null || v==='') return; const x=parseFloat(String(v).replace(',','.')); tot+=isNaN(x)?0:x; max+=m; });
  return max ? { tot, max } : null;
}
function appScore(e, stud, key){
  const d=e.app||{};
  if(d.a==='dossier'){
    const D=AN.data.dossier; if(!D) return null;
    const el=(D.eleves||[]).find(x=>String(x.email).toLowerCase()===stud); if(!el) return null;
    if(d.k==='tp'){ const st=(el.ex||{})[d.id], n=dossierPct(st); if(n) return Math.round(n.tot/n.max*1000)/10; return st && st.remis ? 'wait' : null; }
    /* moyenne des TP remis pendant la période de la colonne (comme dans Dossier TP : points obtenus / total) */
    const P=periodes().find(p=>e.date>=p.debut && e.date<=p.fin); if(!P) return null;
    const deb=new Date(P.debut+'T00:00:00').getTime(), fin=new Date(P.fin+'T23:59:59').getTime();
    let tot=0, max=0, attente=false;
    Object.values(el.ex||{}).forEach(st=>{ if(!st.remis || !(st.remisLe>=deb && st.remisLe<=fin)) return; const n=dossierPct(st); if(n){ tot+=n.tot; max+=n.max; } else attente=true; });
    return max ? Math.round(tot/max*1000)/10 : attente ? 'wait' : null;
  }
  if(d.a==='banc'){
    const B=AN.data.banc; if(!B) return null;
    const R=B.res.filter(r=>String(r.adresse).toLowerCase()===stud);
    const un = id => { const [k,lvl]=String(id).split('|'); const L=R.filter(r=>r.k===k && (!lvl || (+r.lvl||0)>=(+lvl||0)));
      if(!L.length) return null; const ok=L.filter(r=>r.reussi); if(!ok.length) return 0;
      const notes=ok.filter(r=>r.note!=null).map(r=>r.note*5); return notes.length ? Math.max(...notes) : 100; };   // pannes : note sur 20
    if(d.k==='defi') return un(d.id);
    const v=(d.ids||[]).map(un); if(v.every(x=>x==null)) return null;
    return Math.round(v.reduce((a,x)=>a+(x||0),0)/v.length*10)/10;
  }
  return null;
}
function appDesc(e){ const d=e.app||{};
  if(d.a==='dossier') return d.k==='tp' ? 'Dossier TP : correction publiée de ce TP (points / 215)' : 'Dossier TP : moyenne des TP remis pendant la période (points obtenus / total)';
  if(d.a==='banc') return d.k==='defi' ? 'Banc de câblage : défi réussi = 100 %, pas réussi = 0 (pannes : la note /20)' : `Banc de câblage : moyenne de ${(d.ids||[]).length} défis (pas fait = 0)`;
  return ''; }

/* ---------- le carnet : quelles apps relire, et la petite ligne d'état au-dessus du tableau ---------- */
function appsDuCarnet(key){ const s=new Set(); evalsOf(key).forEach(e=>{ if(e.app) s.add(e.app.a); if(e.dessin) s.add('dessin'); }); return [...s]; }
function appEtat(key){
  const L=appsDuCarnet(key); if(!L.length) return '';
  L.forEach(a=>appCharger(a));
  const nom = a => a==='dessin' ? 'Atelier de dessin' : APP_NOTES[a].nom;
  return `<div class="small muted row wrap" style="gap:12px;margin:0 0 8px">${L.map(a=>AN.err[a]?`<span style="color:var(--bad)">⚠ ${esc(nom(a))} : ${esc(AN.err[a])}</span>`:AN.t[a]?`<span>✓ ${esc(nom(a))} lu à ${new Date(AN.t[a]).toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit'})}</span>`:`<span>⏳ lecture de ${esc(nom(a))}…</span>`).join('')}
    <button class="btn sm ghost" data-appmaj>↻ Relire maintenant</button><span class="tiny">relu tout seul chaque minute</span></div>`;
}
function bindAppNotes(m, key){
  const b=m.querySelector('[data-appmaj]'); if(b) b.onclick=()=>{ appsDuCarnet(key).forEach(a=>appCharger(a, true)); toast('Lecture des applications…'); };
  clearInterval(AN.timer); AN.timer=null;
  if(appsDuCarnet(key).length) AN.timer=setInterval(()=>{ if(S.tab!=='carnet' || document.visibilityState!=='visible'){ return; } appsDuCarnet(S.carnet.key).forEach(a=>appCharger(a)); }, AN_FRAIS);
}

/* ---------- « + Note d'une application » ---------- */
async function ajouterColonneApp(ev, date, apres, co){
  const meca=(COURS.find(x=>x.id===co)||{}).type==='meca';
  const md=modal('Note d’une application', `<p class="small muted" style="margin-top:0">La colonne se remplit toute seule avec les résultats de l’application, relus à chaque ouverture du carnet puis chaque minute. Tu peux toujours modifier une note à la main.</p>
    <div class="grid g3" style="gap:8px">
      <button class="card pad" style="text-align:left;cursor:pointer" data-capp="dossier"><b>Dossier TP</b><div class="small muted">la correction d’un TP, ou la moyenne des TP de la période</div></button>
      <button class="card pad" style="text-align:left;cursor:pointer" data-capp="banc"><b>Banc de câblage</b><div class="small muted">un défi, ou plusieurs défis (réussi ou pas, note des pannes)</div></button>
      <button class="card pad" style="text-align:left;cursor:pointer" data-capp="dessin"><b>Atelier de dessin</b><div class="small muted">un exercice, une série ou un examen${meca?'':' (cours de mécanique)'}</div></button>
    </div><div data-cappz style="margin-top:12px"></div>`, {wide:true});
  const z=md.querySelector('[data-cappz]');
  const ajouter=(lib, app)=>{ ev.push({ id:'Ap'+Date.now().toString(36).slice(-4), lib, app, src:'app', orig:100, total:20, seuil:10, poids:1, date }); closeModal(); apres(); toast('Colonne ajoutée : règle la date, les points et le poids'); };
  md.querySelector('[data-capp="dessin"]').onclick=()=>{ closeModal(); ajouterColonneDessin(ev, date, apres); };
  md.querySelector('[data-capp="dossier"]').onclick=async()=>{ z.innerHTML='<p class="small muted">Lecture de la liste des TP…</p>';
    let L=[]; try{ L=(await dossierTPs()).slice(); }catch(e){}
    await appCharger('dossier', true);   // + les TP créés dans l'app (onglet Exercices), vus dans les dossiers des élèves
    const vus=new Set(); ((AN.data.dossier||{}).eleves||[]).forEach(el=>Object.keys(el.ex||{}).forEach(id=>vus.add(id)));
    vus.forEach(id=>{ if(!L.some(t=>t.id===id)) L.push({ id, num:id.replace(/^tp/,''), titre:'(TP créé dans l’app)' }); });
    z.innerHTML=`<label class="row small" style="gap:8px;margin:6px 0"><input type="radio" name="dk" value="tp" checked> <b>Un TP</b> : la note de sa correction publiée</label>
      <select data-dtp style="width:100%;margin:0 0 10px 24px;max-width:calc(100% - 24px)">${L.map(t=>`<option value="${esc(t.id)}">TP ${esc(t.num)} · ${esc(t.titre)}</option>`).join('')||'<option value="">liste indisponible</option>'}</select>
      <label class="row small" style="gap:8px;margin:6px 0"><input type="radio" name="dk" value="moy"> <b>La moyenne des TP remis pendant la période</b> de la colonne (comme la colonne Moyenne de Dossier TP)</label>
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-dok>Ajouter la colonne</button></div>`;
    z.querySelector('[data-dok]').onclick=()=>{ const k=z.querySelector('[name="dk"]:checked').value;
      if(k==='tp'){ const id=z.querySelector('[data-dtp]').value; if(!id){ toast('Choisis un TP'); return; } const t=L.find(x=>x.id===id); ajouter(`TP ${t?t.num:id}${t?' · '+t.titre:''}`, {a:'dossier', k, id}); }
      else ajouter('Dossier TP : moyenne de la période', {a:'dossier', k}); }; };
  md.querySelector('[data-capp="banc"]').onclick=async()=>{ z.innerHTML='<p class="small muted">Lecture des défis dans le Banc de câblage…</p>';
    await appCharger('banc', true);
    if(AN.err.banc){ z.innerHTML=`<p class="small" style="color:var(--bad)">${esc(AN.err.banc)}</p>`; return; }
    const D=new Map(); (AN.data.banc.res||[]).forEach(r=>{ const id=r.k+'|'+(r.lvl||''); if(!D.has(id)) D.set(id, { id, titre:r.titre||r.k, lvl:r.lvl, type:r.type }); });
    const L=[...D.values()].sort((a,b)=>a.titre.localeCompare(b.titre,'fr',{numeric:true}));
    if(!L.length){ z.innerHTML='<p class="small muted">Aucun résultat dans le Banc de câblage pour l’instant : les défis apparaissent ici dès qu’un élève en a essayé un.</p>'; return; }
    z.innerHTML=`<p class="small muted" style="margin:0 0 6px">Coche un ou plusieurs défis (ceux qu’un élève a déjà essayés). Réussi = 100 %, essayé mais pas réussi = 0, pannes : la note sur 20. Plusieurs défis : la moyenne (pas fait = 0).</p>
      <div style="max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:6px 10px">${L.map(x=>`<label class="row small" style="gap:8px;padding:3px 0"><input type="checkbox" value="${esc(x.id)}"> ${esc(x.titre)}${x.lvl?` <span class="tiny muted">niveau ${esc(x.lvl)}</span>`:''}</label>`).join('')}</div>
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-dok>Ajouter la colonne</button></div>`;
    z.querySelector('[data-dok]').onclick=()=>{ const ids=[...z.querySelectorAll('input:checked')].map(i=>i.value); if(!ids.length){ toast('Coche au moins un défi'); return; }
      const t=D.get(ids[0]); if(ids.length===1) ajouter('Banc : '+t.titre, {a:'banc', k:'defi', id:ids[0]}); else ajouter(`Banc : ${ids.length} défis`, {a:'banc', k:'liste', ids}); }; };
}
