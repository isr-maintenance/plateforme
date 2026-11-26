/* =========================================================
   ATELIER DE DESSIN TECHNIQUE — côté prof (outils/atelier-dessin/)
   L'élève connecté avec son adresse de l'école enregistre ses planches en ligne (onglet « dessins » du Sheet).
   Le prof reçoit le résumé de chaque planche (S.dessins[mail][id] = { t, cat, mode, score, ex:{fini, fin, note}, maj })
   et s'en sert ici : colonnes « Dessin » du carnet de cotes, liste des planches dans le parcours de l'élève,
   et ouverture d'une copie de la planche dans l'atelier (#/dessin/voir/<mail>/<id>).
   Le score est celui de la correction automatique de l'atelier (calculé dans le navigateur de l'élève).
   ========================================================= */
const DESSIN_URL = 'outils/atelier-dessin/index.html';
let DESSIN_CAT = null;
/* le catalogue d'exercices de l'atelier (modules ES), chargé seulement quand le prof en a besoin */
function catalogueDessin(){
  if(!DESSIN_CAT) DESSIN_CAT = import(new URL('outils/atelier-dessin/js/dao/catalogue.js', location.href).href)
    .then(m=>({ SERIES:m.SERIES, EXERCICES:m.EXERCICES, MODES:m.NOMS_MODES||{} })).catch(e=>{ DESSIN_CAT=null; throw e; });
  return DESSIN_CAT;
}
const dessinsDe = mail => (S.dessins||{})[mail] || {};
const jourDe = t => { const d=new Date(t); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const MODES_DESSIN = { vues:'3 vues', cotes:'Cotation', coupe:'Coupe', demi:'Demi-coupe', section:'Section', locale:'Coupe locale', iso:'Isométrique', cav:'Cavalière', ancien:'Construction', completer:'Vues à compléter' };

/* note d'une colonne « Dessin » du carnet, en % (la colonne est sur 100 à l'origine, ramenée au total choisi) */
function dessinScore(e, stud){
  const P=Object.values(dessinsDe(stud)), d=e.dessin||{};
  const best = id => { const s=P.filter(x=>x.cat===id && typeof x.score==='number').map(x=>x.score); return s.length?Math.max(...s):null; };
  if(d.k==='exo') return best(d.id);
  if(d.k==='serie'){ const ids=d.ids||[]; if(!ids.length) return null; const v=ids.map(best); if(v.every(x=>x==null)) return null;
    return Math.round(v.reduce((a,x)=>a+(x||0),0)/ids.length*10)/10; }
  if(d.k==='examen'){ const L=P.filter(x=>x.ex && x.ex.fini && jourDe(x.ex.fin)===e.date).sort((a,b)=>b.ex.fin-a.ex.fin); if(!L.length) return null;
    return L[0].ex.note==null ? 'wait' : L[0].ex.note; }
  return null;
}
function dessinDesc(e){ const d=e.dessin||{};
  return d.k==='examen' ? 'examen rendu le jour de la colonne (note de l’atelier)' : d.k==='serie' ? `moyenne des meilleurs scores de la série (${(d.ids||[]).length} exercices ; pas fait = 0)` : 'meilleur score de l’exercice'; }

/* « + Dessin » dans l'éditeur du carnet : choisir un exercice, une série ou un examen de l'atelier */
async function ajouterColonneDessin(ev, date, apres){
  let C; try { C=await catalogueDessin(); } catch(e){ toast('Catalogue de l’atelier indisponible'); return; }
  const opt=C.SERIES.map(s=>`<optgroup label="${esc(s.titre)}">${s.exos.map(x=>`<option value="${esc(x.id)}">${esc(x.titre)} · ${esc(C.MODES[x.mode]||MODES_DESSIN[x.mode]||x.mode)}</option>`).join('')}</optgroup>`).join('');
  const md=modal('Colonne « Dessin » — Atelier de dessin technique', `<p class="small muted" style="margin-top:0">La note vient de la correction automatique de l’atelier, pour les élèves connectés avec leur adresse de l’école. Tu peux toujours la modifier à la main dans le carnet.</p>
    <label class="row small" style="gap:8px;margin:8px 0"><input type="radio" name="dk" value="exo" checked> <b>Un exercice</b> : son meilleur score</label>
    <select data-dexo style="width:100%;margin:0 0 10px 24px;max-width:calc(100% - 24px)">${opt}</select>
    <label class="row small" style="gap:8px;margin:8px 0"><input type="radio" name="dk" value="serie"> <b>Une série</b> : moyenne des meilleurs scores (pas fait = 0)</label>
    <select data-dserie style="width:100%;margin:0 0 10px 24px;max-width:calc(100% - 24px)">${C.SERIES.map(s=>`<option value="${esc(s.id)}">${esc(s.titre)} (${s.exos.length} exercices)</option>`).join('')}</select>
    <label class="row small" style="gap:8px;margin:8px 0"><input type="radio" name="dk" value="examen"> <b>Un examen</b> (mode examen de l’atelier) : la note de l’examen rendu le jour de la colonne</label>
    <div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" data-dok>Ajouter la colonne</button></div>`);
  md.querySelector('[data-dok]').onclick=()=>{ const k=md.querySelector('[name="dk"]:checked').value; let dessin, lib;
    if(k==='exo'){ const id=md.querySelector('[data-dexo]').value, x=C.EXERCICES.find(y=>y.id===id); dessin={k, id}; lib='Dessin : '+(x?x.titre:id); }
    else if(k==='serie'){ const id=md.querySelector('[data-dserie]').value, s=C.SERIES.find(y=>y.id===id); dessin={k, id, ids:s.exos.map(x=>x.id)}; lib='Dessin : série '+(s?s.titre:id); }
    else { dessin={k}; lib='Examen de dessin'; }
    ev.push({ id:'Ds'+Date.now().toString(36).slice(-4), lib, dessin, src:'dessin', orig:100, total:20, seuil:10, poids:1, date });
    closeModal(); apres(); toast('Colonne ajoutée : règle la date, les points et le poids'); };
}

/* les planches d'un élève, dans son parcours (vue prof) */
function dessinsBlock(mail){
  const L=Object.entries(dessinsDe(mail)).sort((a,b)=>(b[1].maj||0)-(a[1].maj||0));
  if(!L.length) return '';
  return `<h3 style="margin:16px 0 4px">Atelier de dessin technique (${L.length} planche${L.length>1?'s':''})</h3>
    <div class="scroll-x"><table class="t"><tr><th>Planche</th><th>Type</th><th>Score</th><th>Modifiée</th><th></th></tr>
    ${L.map(([id,x])=>`<tr><td>${esc(x.t||'Sans titre')}${x.cat?`<div class="tiny muted">exercice ${esc(x.cat)}</div>`:''}</td><td class="small">${x.ex?'<b>examen</b> · ':''}${esc(MODES_DESSIN[x.mode]||(x.mode?x.mode:'planche libre'))}</td>
      <td>${x.ex?(x.ex.fini?(x.ex.note!=null?`<b>${x.ex.note} %</b><div class="tiny muted">rendu le ${new Date(x.ex.fin).toLocaleDateString('fr-BE')}${x.ex.temps?` en ${x.ex.temps} min`:''}</div>`:'rendu, pas encore corrigé'):'en cours'):typeof x.score==='number'?`<b style="color:${x.score>=80?'var(--ok)':x.score>=50?'var(--amber, #b7791f)':'var(--bad)'}">${x.score} %</b>`:'—'}</td>
      <td class="small muted">${fmtAgo(x.maj)}</td><td><button class="btn sm" data-dvoir="${esc(mail)}|${esc(id)}">Voir</button></td></tr>`).join('')}
    </table></div><p class="tiny muted" style="margin:4px 0 0">Score : correction automatique de l’atelier (meilleur essai). « Voir » ouvre une copie de la planche : tu peux la corriger toi-même, tes changements ne sont pas envoyés à l’élève.</p>`;
}
function bindDessins(root){
  root.querySelectorAll('[data-dvoir]').forEach(b=>b.onclick=()=>{ const [mail,id]=b.dataset.dvoir.split('|'); closeModal();
    openPanel('Atelier de dessin — planche de '+nomEl(mail), DESSIN_URL+'#/dessin/voir/'+encodeURIComponent(mail)+'/'+encodeURIComponent(id)); });
}
