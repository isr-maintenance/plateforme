/* =========================================================
   HISTORIQUE DES VERSIONS (réservé au propriétaire de la plateforme)
   Toutes les modifications du dépôt GitHub (le site), lues dans l'API publique de GitHub :
   qui (le compte qui a envoyé ou la pull request), quoi (le message, les fichiers, le détail sur GitHub), quand.
   Seul le compte dont l'empreinte est HIST_OWNER voit l'onglet. L'historique du dépôt est public de toute façon :
   ce filtre sert à garder l'onglet hors de la vue des autres profs, pas à protéger un secret.
   ========================================================= */
const HIST_REPO = 'isr-maintenance/plateforme';
const HIST_OWNER = 'adee7c3950719524507cbdbf2cbb40e72f77df1196da3b19b5acfbb9416977a3';   // SHA-256 de l'adresse du propriétaire
const HIST_MOI = ['isr-maintenance','olivier7887'];                                      // ses comptes GitHub
const HIST_KEY = 'plateforme-histo';
const H = { commits:null, pulls:null, prc:{}, det:{}, err:'', charge:false, ouvert:{}, qui:'tous', q:'', plus:false };

/* l'onglet : seulement pour le propriétaire */
function histOk(){
  if(!S.me || S.me.role==='eleve') return false;
  if(S.histOk===undefined && window.crypto && crypto.subtle){ S.histOk=false;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(S.me.mail||'').trim().toLowerCase())).then(b=>{
      const h=Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
      if(h===HIST_OWNER){ S.histOk=true; render(); } }).catch(()=>{}); }
  return !!S.histOk;
}

/* mémoire locale : réglages (noms, dernière visite) et cache des réponses de GitHub (une modification envoyée ne change plus) */
function histMem(){ try{ return JSON.parse(localStorage.getItem(HIST_KEY))||{}; }catch(e){ return {}; } }
function histSave(m){ try{ localStorage.setItem(HIST_KEY, JSON.stringify(m)); }catch(e){ /* plein : on vide le cache des détails */ try{ m.det={}; localStorage.setItem(HIST_KEY, JSON.stringify(m)); }catch(e2){} } }
async function gh(path){
  const r = await fetch('https://api.github.com/repos/'+HIST_REPO+path, { headers:{ Accept:'application/vnd.github+json' } });
  if(r.status===403 || r.status===429) throw new Error('GitHub limite les lectures à 60 par heure depuis une même connexion : réessaie un peu plus tard.');
  if(!r.ok) throw new Error('GitHub ne répond pas ('+r.status+').');
  return r.json();
}
async function histCharger(force){
  if(H.charge) return; H.charge=true; H.err='';
  const M=histMem(); M.prc=M.prc||{}; M.det=M.det||{};
  try{
    const frais = M.t && Date.now()-M.t < 120000 && !force;
    if(frais){ H.commits=M.commits; H.pulls=M.pulls; }
    else {
      const [c, p] = await Promise.all([ gh('/commits?sha=main&per_page=100'), gh('/pulls?state=all&per_page=100') ]);
      let L=c; if(H.plus && c.length===100) L=L.concat(await gh('/commits?sha=main&per_page=100&page=2'));
      H.commits = L.map(x=>({ sha:x.sha, msg:x.commit.message, date:x.commit.author.date, nom:x.commit.author.name, login:(x.author||{}).login||'', clog:(x.committer||{}).login||'', url:x.html_url, par:(x.parents||[]).length }));
      H.pulls = p.map(x=>({ n:x.number, titre:x.title, login:(x.user||{}).login||'', etat:x.merged_at?'fusionnée':x.state==='open'?'ouverte':'fermée', merged:x.merged_at, cree:x.created_at, url:x.html_url, sha:x.merge_commit_sha, corps:String(x.body||'').slice(0,600) }));
      M.t=Date.now(); M.commits=H.commits; M.pulls=H.pulls;
    }
    /* les commits de chaque pull request fusionnée (une lecture par PR, gardée pour toujours) */
    for(const p of H.pulls.filter(x=>x.etat==='fusionnée' && !M.prc[x.n])){ M.prc[p.n]=(await gh('/pulls/'+p.n+'/commits?per_page=100')).map(x=>x.sha); }
    H.prc=M.prc; H.det=M.det; histSave(M);
  }catch(e){ H.err=e.message; if(!H.commits && M.commits){ H.commits=M.commits; H.pulls=M.pulls; H.prc=M.prc; H.det=M.det; } }
  H.charge=false; if(S.tab==='histo'){ const y=window.scrollY; render(); window.scrollTo(0,y); }
}
async function histDetail(sha){
  const M=histMem(); M.det=M.det||{};
  if(!M.det[sha]){ try{ const d=await gh('/commits/'+sha);
      M.det[sha]=(d.files||[]).map(f=>[f.filename, f.status, f.additions, f.deletions]);
      const ks=Object.keys(M.det); if(ks.length>150) ks.slice(0,ks.length-150).forEach(k=>delete M.det[k]); histSave(M);
    }catch(e){ toast(e.message); return; } }
  H.det=M.det; if(S.tab==='histo'){ const y=window.scrollY; render(); window.scrollTo(0,y); }
}

/* qui a fait la modification : l'auteur de la pull request ; sinon le compte GitHub de l'auteur ;
   sinon (Claude, sans compte) l'envoi direct sur main, permis seulement au compte administrateur */
function histPR(c){ return (H.pulls||[]).find(p=>p.sha===c.sha || (H.prc[p.n]||[]).includes(c.sha)); }
function histQui(c){
  const pr=histPR(c); if(pr) return pr.login;
  if(c.login && c.login!=='claude') return c.login;
  return 'isr-maintenance';
}
const histClaude = c => c.login==='claude' || /^Claude$/i.test(c.nom) || /Co-Authored-By: Claude/i.test(c.msg);
function histNom(login){ const M=histMem(), a=(M.noms||{})[login]; if(a) return a; return HIST_MOI.includes(login) ? 'Toi' : login; }
const histMoi = login => HIST_MOI.includes(login);

/* fichiers : un nom parlant pour chaque partie de la plateforme */
function histFichier(f){
  let m;
  if(f.startsWith('apps-script/')) return 'Serveur (Apps Script) — à redéployer';
  if(f==='js/api-core.js') return 'Serveur, copie pour le mode test';
  if((m=/^js\/chap2(\d+)\.js$/.exec(f))) return 'Électricité 4e · chapitre 2.'+m[1];
  if(f==='js/relais.js') return 'Électricité 4e · chapitre 2.3 (relais)';
  if(f==='js/af3-series.js') return 'Électricité 3QEM · séries d’exercices';
  if((m=/^js\/af3-(\d)\.js$/.exec(f))) return 'Électricité 3QEM · chapitres '+['','1 à 5','6 à 11','12 à 16','17 à 20'][+m[1]];
  if(f==='js/af3.js') return 'Électricité 3QEM · formulaire et outils';
  if(f==='js/meca4-ent.js') return 'Mécanique 4e · entraînement « Comme au bilan »';
  if((m=/^js\/meca4-(\d)\.js$/.exec(f))) return 'Mécanique 4e · chapitres '+(['','1 à 4','5 et 6','7 à 9','10 à 12'][+m[1]]||'(partie '+m[1]+')');
  if(f==='js/meca4.js') return 'Mécanique 4e · plan, formulaire, labos';
  const T={ 'js/bilan.js':'Évaluations en ligne (bilans, formatives)', 'js/schemas.js':'Dessins des bilans', 'js/pages-prof.js':'Pages des profs (Suivi, Admin, Agenda)', 'js/pages.js':'Pages (cours, carnet de cotes, bibliothèque, outils)',
    'js/core.js':'Moteur de la plateforme (connexion, enregistrement)', 'js/chapitres.js':'Moteur des chapitres et exercices', 'js/formules.js':'Formules et tableau en quatre colonnes', 'js/catalog.js':'Plans des cours', 'js/config.js':'Réglages (liens, agendas)',
    'js/api.js':'Liaison avec le serveur', 'js/historique.js':'Cette page d’historique', 'index.html':'Page principale (liste des fichiers chargés)', 'sw.js':'Mise en cache (hors ligne, mises à jour)', 'CLAUDE.md':'Mode d’emploi pour Claude', 'README.md':'Présentation du dépôt',
    'outils/simulateur-plc.html':'Outil : Simulateur PLC', 'manifest.webmanifest':'Installation sur téléphone', '.github/CODEOWNERS':'Qui valide les pull requests' };
  if(T[f]) return T[f];
  if(f.startsWith('css/')) return 'Apparence (couleurs, mise en page)';
  if(f.startsWith('tests/')) return 'Tests automatiques';
  if((m=/^outils\/([^/]+)/.exec(f))) return 'Outil : '+m[1].replace(/\.html$/,'').replace(/-/g,' ');
  if(f.startsWith('icons/')) return 'Icônes';
  return f;
}
const histTitre = msg => String(msg).split('\n')[0];
const histCorps = msg => String(msg).split('\n').slice(1).filter(l=>!/^(Co-Authored-By|Claude-Session|Signed-off-by):/i.test(l.trim())).join('\n').trim();
const histJour = d => { const t=new Date(d).toLocaleDateString('fr-BE',{weekday:'long', day:'numeric', month:'long', year:'numeric'}); return t.charAt(0).toUpperCase()+t.slice(1); };
const histHeure = d => new Date(d).toLocaleTimeString('fr-BE',{hour:'2-digit', minute:'2-digit'});

function pageHisto(){
  if(!histOk()) return `<div class="card pad"><p class="muted" style="margin:0">Page réservée.</p></div>`;
  if(!H.commits && !H.err) histCharger();
  if(H.vuAvant===undefined) H.vuAvant = histMem().vu || null;
  const vu=H.vuAvant;
  const head=`<div class="page-head"><div><div class="kicker">Rien que pour toi</div><h1>Historique des versions</h1><p class="muted small" style="margin-top:4px">Chaque modification du site : qui, quoi, quand. Lu sur GitHub (dépôt ${HIST_REPO}).</p></div>
    <div class="row wrap"><button class="btn" data-hrefresh ${H.charge?'disabled':''}>${H.charge?'Lecture…':'↻ Actualiser'}</button><a class="btn" href="https://github.com/${HIST_REPO}/commits/main" target="_blank" rel="noopener">Sur GitHub ↗</a></div></div>`;
  if(!H.commits) return head+`<div class="card pad">${H.err?`<p style="margin:0;color:var(--bad)">${esc(H.err)}</p>`:'<p class="muted" style="margin:0">Lecture de l’historique sur GitHub…</p>'}</div>`;
  const C=H.commits.filter(c=>!(c.par>1 && /^Merge (pull request|branch)/.test(histTitre(c.msg))));   // les commits de fusion : la PR est déjà affichée sur ses commits
  const qui=[...new Set(C.map(histQui))];
  const iVu = vu ? C.findIndex(c=>c.sha===vu) : -1, neufs = iVu<0 ? (vu?C.length:0) : iVu;
  const neufsAutres = C.slice(0,neufs).filter(c=>!histMoi(histQui(c))).length;
  const semaine = C.filter(c=>Date.now()-new Date(c.date)<7*864e5);
  const ouvertes=(H.pulls||[]).filter(p=>p.etat==='ouverte');
  const kpi=`<div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="v">${C.length}${H.commits.length>=100&&!H.plus?'+':''}</div><div class="l">versions en tout</div></div>
    <div class="card kpi"><div class="v">${semaine.length}</div><div class="l">ces 7 derniers jours</div></div>
    <div class="card kpi"><div class="v" style="color:${neufsAutres?'var(--warn)':'inherit'}">${vu?neufs:'—'}</div><div class="l">${vu?`depuis ta dernière visite${neufsAutres?` · <b>${neufsAutres} par d’autres</b>`:''}`:'première visite'}</div></div>
    <div class="card kpi"><div class="v" style="color:${ouvertes.length?'var(--warn)':'inherit'}">${ouvertes.length}</div><div class="l">pull request${ouvertes.length>1?'s':''} en attente de toi</div></div></div>`;
  const pr=ouvertes.length?`<div class="card" style="margin-bottom:16px;border-color:var(--warn)"><div class="pad" style="border-bottom:1px solid var(--line)"><h3 style="margin:0">En attente de ta validation</h3></div>
    ${ouvertes.map(p=>`<div class="pad row between wrap" style="gap:8px;border-bottom:1px solid var(--line-2)"><div><b>#${p.n} · ${esc(p.titre)}</b><div class="small muted">par <b>${esc(histNom(p.login))}</b> · ouverte le ${histJour(p.cree)} à ${histHeure(p.cree)}</div>${p.corps?`<div class="small" style="white-space:pre-wrap;margin-top:4px">${esc(p.corps.slice(0,300))}${p.corps.length>300?'…':''}</div>`:''}</div><a class="btn sm primary" href="${esc(p.url)}" target="_blank" rel="noopener">Relire sur GitHub ↗</a></div>`).join('')}</div>`:'';
  const filtres=`<div class="row wrap" style="gap:8px;margin-bottom:12px"><select data-hqui><option value="tous" ${H.qui==='tous'?'selected':''}>Tout le monde</option><option value="autres" ${H.qui==='autres'?'selected':''}>Tout sauf moi</option>${qui.map(l=>`<option value="${esc(l)}" ${H.qui===l?'selected':''}>${esc(histNom(l))}${histNom(l)!==l?` (${esc(l)})`:''}</option>`).join('')}</select>
    <input type="search" data-hq value="${esc(H.q)}" placeholder="Chercher (chapitre, mot, fichier…)" style="flex:1;min-width:180px">
    ${qui.filter(l=>!histMoi(l)).length?`<button class="btn sm ghost" data-hnoms title="Donner un nom lisible aux comptes GitHub des collègues">Noms des comptes</button>`:''}</div>`;
  const q=H.q.trim().toLowerCase();
  const L=C.filter(c=>{ const w=histQui(c); if(H.qui==='autres' && histMoi(w)) return false; if(H.qui!=='tous' && H.qui!=='autres' && w!==H.qui) return false;
    if(q){ const fs=(H.det[c.sha]||[]).map(f=>f[0]+' '+histFichier(f[0])).join(' '); if(!(c.msg+' '+histNom(w)+' '+w+' '+fs).toLowerCase().includes(q)) return false; } return true; });
  let jour='', html='';
  L.forEach(c=>{ const j=histJour(c.date); if(j!==jour){ if(jour) html+='</div>'; jour=j; html+=`<h3 style="margin:18px 0 6px">${j}</h3><div class="card">`; }
    const w=histQui(c), p=histPR(c), neuf=neufs && C.indexOf(c)<neufs, ouv=!!H.ouvert[c.sha], det=H.det[c.sha], corps=histCorps(c.msg);
    html+=`<div class="pad" style="border-bottom:1px solid var(--line-2);${neuf?'background:color-mix(in srgb, var(--warn) 7%, transparent)':''}">
      <div class="row between wrap" style="gap:8px;align-items:flex-start"><div style="flex:1;min-width:220px">
        <div class="small muted">${histHeure(c.date)} · <b style="color:${histMoi(w)?'inherit':'var(--warn)'}">${esc(histNom(w))}</b>${p?` · <a href="${esc(p.url)}" target="_blank" rel="noopener">pull request #${p.n}</a>`:histMoi(w)?' · envoi direct':''}${histClaude(c)?' · <span class="chip" style="font-size:11px;padding:1px 6px">avec Claude</span>':''}${neuf?' · <span class="chip warn" style="font-size:11px;padding:1px 6px">nouveau</span>':''}</div>
        <div style="margin-top:2px"><b>${esc(histTitre(c.msg))}</b></div></div>
        <div class="row" style="gap:4px"><button class="btn sm" data-hdet="${c.sha}">${ouv?'Masquer':'Quoi ?'}</button><a class="btn sm ghost" href="${esc(c.url)}" target="_blank" rel="noopener" title="Le détail ligne par ligne sur GitHub">↗</a></div></div>
      ${ouv?`<div style="margin-top:8px">${corps?`<div class="small" style="white-space:pre-wrap;margin-bottom:8px">${esc(corps)}</div>`:''}
        ${det?`<table class="t small"><tr><th>Partie modifiée</th><th>Fichier</th><th style="text-align:right">Lignes</th></tr>${det.map(([f,st,a,d])=>`<tr><td>${esc(histFichier(f))}${st==='added'?' <span class="chip ok" style="font-size:11px;padding:1px 6px">nouveau</span>':st==='removed'?' <span class="chip warn" style="font-size:11px;padding:1px 6px">supprimé</span>':st==='renamed'?' <span class="chip" style="font-size:11px;padding:1px 6px">renommé</span>':''}</td><td class="tiny muted" style="word-break:break-all">${esc(f)}</td><td style="text-align:right;white-space:nowrap"><span style="color:var(--ok)">+${a}</span> <span style="color:var(--bad)">−${d}</span></td></tr>`).join('')}</table>
          ${det.some(f=>f[0].startsWith('apps-script/'))?'<p class="tiny" style="color:var(--warn);margin:6px 0 0">Le serveur a changé : la modification n’est active qu’après un redéploiement du script.</p>':''}`:'<p class="small muted" style="margin:0">Lecture des fichiers…</p>'}</div>`:''}
    </div>`; });
  if(jour) html+='</div>';
  const suite = H.commits.length>=100 && !H.plus ? `<div class="row" style="justify-content:center;margin-top:14px"><button class="btn" data-hplus>Voir les versions plus anciennes</button></div>` : '';
  return head+(H.err?`<div class="note bad" style="margin-top:0"><b>GitHub</b>${esc(H.err)} Affichage de la dernière lecture.</div>`:'')+kpi+pr+filtres+(html||'<div class="card pad"><p class="muted" style="margin:0">Aucune version ne correspond.</p></div>')+suite;
}
function bindHisto(m){
  if(!histOk()) return;
  /* la visite est notée : la prochaine fois, ce qui est arrivé entre-temps est marqué « nouveau » */
  if(H.commits && H.commits.length && !H.vuNote){ H.vuNote=true; const M=histMem(); M.vu=H.commits[0].sha; histSave(M); }
  const rf=m.querySelector('[data-hrefresh]'); if(rf) rf.onclick=()=>{ histCharger(true); const y=window.scrollY; render(); window.scrollTo(0,y); };
  const pl=m.querySelector('[data-hplus]'); if(pl) pl.onclick=()=>{ H.plus=true; histCharger(true); };
  const s=m.querySelector('[data-hqui]'); if(s) s.onchange=()=>{ H.qui=s.value; render(); };
  const q=m.querySelector('[data-hq]'); if(q) q.oninput=()=>{ H.q=q.value; clearTimeout(H.tq); H.tq=setTimeout(()=>{ render(); const q2=document.querySelector('[data-hq]'); if(q2){ q2.focus(); q2.setSelectionRange(q2.value.length,q2.value.length); } },300); };
  m.querySelectorAll('[data-hdet]').forEach(b=>b.onclick=()=>{ const sha=b.dataset.hdet; H.ouvert[sha]=!H.ouvert[sha]; const y=window.scrollY; render(); window.scrollTo(0,y); if(H.ouvert[sha] && !H.det[sha]) histDetail(sha); });
  const nb=m.querySelector('[data-hnoms]'); if(nb) nb.onclick=()=>{ const M=histMem(); M.noms=M.noms||{};
    const L=[...new Set(H.commits.map(histQui).concat((H.pulls||[]).map(p=>p.login)))].filter(l=>l && !histMoi(l));
    const md=modal('Noms des comptes GitHub', `<p class="small muted" style="margin-top:0">Donne un nom lisible au compte GitHub de chaque collègue. Ces noms restent sur cet appareil.</p>
      ${L.map(l=>`<label class="row between" style="gap:8px;margin:6px 0"><span class="small"><b>${esc(l)}</b></span><input type="text" data-hnom="${esc(l)}" value="${esc(M.noms[l]||'')}" placeholder="par exemple Prénom Nom" style="width:200px"></label>`).join('')}
      <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-hnok>Enregistrer</button></div>`);
    md.querySelector('[data-hnok]').onclick=()=>{ md.querySelectorAll('[data-hnom]').forEach(i=>{ const v=i.value.trim(); if(v) M.noms[i.dataset.hnom]=v; else delete M.noms[i.dataset.hnom]; }); histSave(M); closeModal(); render(); }; };
}
