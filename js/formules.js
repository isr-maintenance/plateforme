/* =========================================================
   FORMULES — écriture et affichage des formules, tableau d'exercice
   en quatre colonnes (Données · Inconnue · Formule · Solution),
   formulaire du cours, triangle mnémotechnique.
   Utilisé par le cours d'Électricité 3QEM (Ampère & Fils), réutilisable
   par n'importe quel cours.
   ========================================================= */

/* ---------- 1. Affichage d'une formule écrite au clavier ----------
   L'élève écrit en ligne, la plateforme affiche en « vrai » :
     R = ρ . L / S        → fraction ρ·L sur S
     (Rm . Im) / (IT - Im) → fraction, sans les parenthèses extérieures
     I^2  10^-3  R_équ  R1  → exposants et indices (R1 s'affiche R₁)
     √(P / R)              → racine
   Le « . » entre deux grandeurs s'affiche comme un point de multiplication. */
const FM_SUP = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
const FM_SUB = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const FM_UNITS = ['mm','cm','km','m','dm'];
function fmTokens(src){
  const T=[]; let i=0; const s=String(src);
  const isL = c => /[A-Za-zÀ-ÖØ-öø-ÿΑ-Ωα-ωµμΩ°%€]/.test(c);
  while(i<s.length){
    const c=s[i];
    if(c===' '||c==='\t'){ T.push({t:'sp'}); while(i<s.length && (s[i]===' '||s[i]==='\t')) i++; continue; }
    if(/[0-9]/.test(c)){ let j=i; while(j<s.length && /[0-9,]/.test(s[j]) && !(s[j]===','&&!/[0-9]/.test(s[j+1]||''))) j++; T.push({t:'num',v:s.slice(i,j)}); i=j; continue; }
    if(c in FM_SUP){ let j=i, v=''; while(j<s.length && s[j] in FM_SUP){ v+=FM_SUP[s[j]]; j++; } T.push({t:'supraw',v}); i=j; continue; }
    if(c in FM_SUB){ let j=i, v=''; while(j<s.length && s[j] in FM_SUB){ v+=FM_SUB[s[j]]; j++; } T.push({t:'subraw',v}); i=j; continue; }
    { const ab=/^(?:[a-zà-ÿ]\.){2,}(?![a-zà-ÿ0-9])/.exec(s.slice(i)); if(ab && (i===0 || !isL(s[i-1]))){ T.push({t:'id',v:ab[0]}); i+=ab[0].length; continue; } }   // abréviations : f.é.m., d.d.p.
    if(isL(c)){ let j=i; while(j<s.length && isL(s[j])) j++; T.push({t:'id',v:s.slice(i,j)}); i=j; continue; }
    if(s.startsWith('sqrt',i)){ T.push({t:'op',v:'√'}); i+=4; continue; }
    if(c==='-'&&s[i+1]==='>'){ T.push({t:'op',v:'→'}); i+=2; continue; }
    if(c==='='&&s[i+1]==='>'){ T.push({t:'op',v:'⇒'}); i+=2; continue; }
    T.push({t:'op',v:c}); i++;
  }
  return T;
}
const FM_BOUND = new Set(['=','+','-','−','±','≈','⇒','→','<','>','≤','≥',';',':','?']);
const FM_PROD = new Set(['.','×','*','·']);
function fmParse(T){
  let p=0;
  const group = close => {            // jusqu'à « ) » ou la fin
    const out=[];
    while(p<T.length){
      const k=T[p];
      if(k.t==='op' && k.v===')' && close){ p++; return out; }
      if(k.t==='op' && k.v==='('){ p++; const g=group(true); out.push({k:'par',c:g}); postfix(out); continue; }
      if(k.t==='op' && k.v==='√'){ p++; const a=atom(); out.push({k:'sqrt',c:a?stripPar([a]):[]}); continue; }
      if(k.t==='op' && k.v==='/'){ p++;
        let j=out.length; while(j>0){ const n=out[j-1]; if(n.k==='op' && FM_BOUND.has(n.v)) break; if(n.k==='sp' && j>=2 && out[j-2].k==='op' && FM_BOUND.has(out[j-2].v)) break; j--; }
        while(j<out.length && out[j].k==='sp') j++;
        const num=out.splice(j); while(num.length && num[num.length-1].k==='sp') num.pop();
        while(p<T.length && T[p].t==='sp') p++;
        const den=atom(); out.push({k:'frac',n:stripPar(num),d:den?stripPar([den]):[]}); continue; }
      p++;
      if(k.t==='sp') out.push({k:'sp'});
      else if(k.t==='num'){ out.push({k:'num',v:k.v}); postfix(out); }
      else if(k.t==='id'){ out.push(idNode(k.v)); postfix(out); }
      else if(k.t==='supraw'){ out.push({k:'sup',c:[{k:'num',v:k.v}]}); }
      else if(k.t==='subraw'){ out.push({k:'sub',c:[{k:'num',v:k.v}]}); }
      else if(k.t==='op' && (k.v==='^'||k.v==='_')){ p--; postfix(out,true); }
      else out.push({k:'op',v:k.v});
    }
    return out;
  };
  const atom = () => {                // un élément (avec ses exposants / indices)
    while(p<T.length && T[p].t==='sp') p++;
    if(p>=T.length) return null;
    const k=T[p], tmp=[];
    if(k.t==='op' && k.v==='('){ p++; tmp.push({k:'par',c:group(true)}); }
    else if(k.t==='op' && k.v==='√'){ p++; const a=atom(); tmp.push({k:'sqrt',c:a?stripPar([a]):[]}); }
    else if(k.t==='op' && (k.v==='-'||k.v==='−') && T[p+1] && T[p+1].t==='num'){ p+=2; tmp.push({k:'num',v:'−'+T[p-1].v}); }
    else if(k.t==='num'){ p++; tmp.push({k:'num',v:k.v}); }
    else if(k.t==='id'){ p++; tmp.push(idNode(k.v)); }
    else return null;
    postfix(tmp);
    return tmp.length===1 ? tmp[0] : {k:'seq',c:tmp};
  };
  const postfix = (out, force) => {   // ^… et _… collés à l'élément précédent
    while(p<T.length && T[p].t==='op' && (T[p].v==='^'||T[p].v==='_')){
      const kind=T[p].v==='^'?'sup':'sub'; p++;
      let a=null;
      if(p<T.length && T[p].t==='op' && (T[p].v==='-'||T[p].v==='−') && T[p+1] && T[p+1].t==='num'){ a={k:'num',v:'−'+T[p+1].v}; p+=2; }
      else a=atom();
      out.push({k:kind,c:a?stripPar([a]):[]});
    }
    while(p<T.length && (T[p].t==='supraw'||T[p].t==='subraw')){ out.push({k:T[p].t==='supraw'?'sup':'sub',c:[{k:'num',v:T[p].v}]}); p++; }
  };
  const idNode = v => {               // R1 → R₁ ; mm2 → mm²
    const m=/^(.*?)$/.exec(v); return {k:'id',v:m[1]};
  };
  return group(false);
}
function stripPar(L){ if(L.length===1 && L[0].k==='par') return L[0].c; if(L.length===1 && L[0].k==='seq' && L[0].c[0].k==='par' && L[0].c.length===1) return L[0].c[0].c; return L; }
function fmHTML(L, prev){
  let h='';
  L.forEach((n,i)=>{
    const before=L[i-1], after=L[i+1];
    switch(n.k){
      case 'sp': h+=' '; break;
      case 'num': h+=`<span class="fm-n">${esc(n.v)}</span>`; break;
      case 'id': h+=`<i class="fm-v">${esc(n.v)}</i>`; break;
      case 'op': {
        const v=n.v;
        if(v==='.'){ const dig=b=>b&&(b.k==='num'); h+= dig(before)&&dig(after) ? '.' : '<span class="fm-o">·</span>'; break; }
        if(v==='*'||v==='×'||v==='·'){ h+='<span class="fm-o">·</span>'; break; }
        if(v==='-'){ h+='<span class="fm-o">−</span>'; break; }
        if(['=','+','−','≈','⇒','→','±','<','>','≤','≥'].includes(v)){ h+=`<span class="fm-o">${esc(v)}</span>`; break; }
        h+=esc(v); break; }
      case 'par': h+=`<span class="fm-p">(</span>${fmHTML(n.c)}<span class="fm-p">)</span>`; break;
      case 'seq': h+=fmHTML(n.c); break;
      case 'sup': h+=`<sup>${fmHTML(n.c)}</sup>`; break;
      case 'sub': h+=`<sub>${fmHTML(n.c)}</sub>`; break;
      case 'sqrt': h+=`<span class="fm-sq"><span class="fm-rad">√</span><span class="fm-und">${fmHTML(n.c)}</span></span>`; break;
      case 'frac': h+=`<span class="fm-fr"><span class="fm-nu">${fmHTML(n.n)||'&nbsp;'}</span><span class="fm-de">${fmHTML(n.d)||'&nbsp;'}</span></span>`; break;
    }
  });
  return h;
}
/* indices automatiques : une lettre suivie de chiffres (R1, U2, IT…), pas les unités (mm2 → mm²) */
function fmAutoSub(src){
  return String(src).replace(/\b([A-Za-zΑ-Ωα-ωρµ]{1,2})(\d+)\b/g, (m,a,d)=> FM_UNITS.includes(a) ? (d==='2'?a+'²':d==='3'?a+'³':m) : a+'_'+d)
                    .replace(/(^|[^A-Za-zÀ-ÿ_])(R|U|I|E|P|W|V)(T|t|équ|equ|eq|cc|ch|L|G|R|m|s|a|J)(?=\s*(?:[=)+\-−/.*×·,;^\]]|$))/g, (m,pre,a,b)=>pre+a+'_'+b);
}
function fmath(src){
  const lines=String(src==null?'':src).split('\n');
  return lines.map(l=>{ if(!l.trim()) return '<div class="fm-l">&nbsp;</div>'; try { return `<div class="fm-l">${fmHTML(fmParse(fmTokens(fmAutoSub(l))))}</div>`; } catch(e){ return `<div class="fm-l">${esc(l)}</div>`; } }).join('');
}
/* une formule sur une ligne (dans un texte) */
const fm = src => `<span class="fm-in">${fmath(src).replace(/<\/?div[^>]*>/g,'')}</span>`;
/* encadré-formule du cours, rendu avec les fractions */
const fbox = (f, leg) => `<div class="formula"><div class="f fm-big">${fm(f)}</div>${leg?`<div class="tiny muted">${leg}</div>`:''}</div>`;

/* ---------- 2. Lire un nombre tapé par l'élève ----------
   « 28 800 », « 0,0525 », « 2,4.10^9 », « 24 . 10⁸ », « 2,4×10^9 », « 2.4e9 » */
function parseVal(v){
  if(v==null) return NaN;
  let s=String(v).trim().replace(/[\s  ]/g,'').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m=>'^'+[...m].map(c=>FM_SUP[c]).join('')).replace(/−/g,'-');
  if(!s) return NaN;
  let m=/^(-?[0-9]+(?:[.,][0-9]+)?)(?:[.·x×*]?10\^?\(?(-?[0-9]+)\)?)$/i.exec(s);
  if(m && /10\^|[.·x×*]10/.test(s)) return parseFloat(m[1].replace(',','.'))*Math.pow(10,+m[2]);
  m=/^10\^\(?(-?[0-9]+)\)?$/.exec(s); if(m) return Math.pow(10,+m[1]);
  m=/^(-?[0-9]+(?:[.,][0-9]+)?)e(-?[0-9]+)$/i.exec(s); if(m) return parseFloat(m[1].replace(',','.'))*Math.pow(10,+m[2]);
  if(/^-?[0-9]+(?:[.,][0-9]+)?$/.test(s)) return parseFloat(s.replace(',','.'));
  return NaN;
}
const okVal = (r, v) => { const x=parseVal(v); if(isNaN(x)) return false; const tol=r.tol!=null?r.tol:0.02; return [r.ans].concat(r.alt||[]).some(a=>Math.abs(x-a) <= Math.max(Math.abs(a)*tol, r.abs||1e-12)); };   // alt : autre réponse admise (énoncé qui permet deux lectures)
/* affichage d'un nombre : 0,0525 · 28 800 · 2,4 · 10⁹ */
function frN(x, d=4){
  if(!isFinite(x)) return '—';
  const a=Math.abs(x);
  if(a!==0 && (a>=1e7 || a<1e-4)){ const e=Math.floor(Math.log10(a)), m=x/Math.pow(10,e); return `${fr(m,3)} · 10${String(e).split('').map(c=>({'-':'⁻'})[c]||'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')}`; }
  return (Math.round(x*10**d)/10**d).toLocaleString('fr-BE',{maximumFractionDigits:d});
}

/* ---------- 3. Barre d'outils de l'éditeur ---------- */
const FM_TOOLS = [
  ['frac','<span class="fm-fr tb"><span class="fm-nu">a</span><span class="fm-de">b</span></span>','Fraction : écris (numérateur) / (dénominateur)'],
  ['sq','x²','Au carré'], ['pow','xⁿ','Exposant'], ['sub','x₁','Indice (R₁, U_L…)'], ['sqrt','√','Racine carrée'],
  ['mul','·','Multiplier (le point)'], ['e10','·10ⁿ','Puissance de dix'], ['par','( )','Parenthèses'],
  ['s:ρ','ρ'], ['s:Ω','Ω'], ['s:α','α'], ['s:π','π'], ['s:µ','µ'], ['s:Δ','Δ'], ['s:°','°'], ['s:⇒','⇒'], ['s:≈','≈'],
];
function fmToolbar(){
  return `<div class="fm-tools" role="toolbar" aria-label="Outils pour écrire une formule">${FM_TOOLS.map(([k,l,t])=>`<button type="button" data-fmt="${k}" title="${esc(t||l)}">${l}</button>`).join('')}
    <span class="fm-help tiny muted">Une fraction s'écrit avec <b>/</b> : <code>(ρ . L) / S</code>. Le point <code>.</code> veut dire « fois ».</span></div>`;
}
function fmInsert(ta, k){
  const a=ta.selectionStart, b=ta.selectionEnd, v=ta.value, sel=v.slice(a,b);
  let ins, caret;
  const put=(txt,c)=>{ ins=txt; caret=c; };
  if(k==='frac') sel? put(`(${sel}) / ()`, sel.length+6) : put('() / ()', 1);
  else if(k==='sq') put('^2',2);
  else if(k==='pow') put('^()',2);
  else if(k==='sub') put('_',1);
  else if(k==='sqrt') sel? put(`√(${sel})`, sel.length+3) : put('√()',2);
  else if(k==='mul') put(' . ',3);
  else if(k==='e10') put(' . 10^',6);
  else if(k==='par') sel? put(`(${sel})`, sel.length+2) : put('()',1);
  else if(k.startsWith('s:')) put(k.slice(2), k.length-2);
  else return;
  const max=+ta.getAttribute('maxlength')||1e9; if((v.length-sel.length+ins.length)>max){ toast('Cette case est pleine'); return; }
  ta.value=v.slice(0,a)+ins+v.slice(b); ta.focus(); ta.setSelectionRange(a+caret,a+caret);
  ta.dispatchEvent(new Event('input',{bubbles:true}));
}
function bindToolbar(root, getTa){
  root.querySelectorAll('[data-fmt]').forEach(b=>{
    b.addEventListener('mousedown', e=>e.preventDefault());       // garder le curseur dans la case
    b.onclick=()=>{ const ta=getTa(); if(!ta){ toast('Clique d’abord dans une case du tableau'); return; } fmInsert(ta, b.dataset.fmt); };
  });
}

/* ---------- 3 bis. Données variables : chaque élève a ses propres valeurs ----------
   vx('A6x1', {I:[2,3,4,5], t:[3,4,5,6]}) tire une valeur dans chaque liste, toujours la même pour un élève
   (graine = son adresse + la clé), souvent différente de celle de son voisin. Les réponses se calculent à partir de ces valeurs.
   Vue prof : VARY_MAIL donne les valeurs d'un élève précis (voirExercices). */
let VARY_MAIL = null;
function vx(key, choix){
  const mail = VARY_MAIL || (S.me && S.me.mail) || '', r = hasard(graine(mail+'|v|'+key)), o = {};
  Object.keys(choix).forEach(k=>{ const L=choix[k]; o[k]=L[Math.floor(r()*L.length)]; });
  return o;
}

/* ---------- 4. Le tableau d'exercice en quatre colonnes ---------- */
const DIFS_REG = {};      // clé → { course, chap, n, enonce, res, sans }
const DIFS_COLS = [['d','Données','ex. U = 230 V'],['i','Inconnue(s)','ex. I = ? A'],['f','Formule(s)','ex. I = P / U'],['s','Solution','le calcul, puis le résultat avec son unité']];
const DIFS_MAX = 250;   // par case : la progression d'un élève doit rester sous la limite du serveur (45 000 caractères)
/* déclare un exercice et renvoie son cadre (monté par mountAllDIFS) */
function DX(key, cfg){ DIFS_REG[key]=cfg; return `<div class="figure exw difs-wrap" data-difs="${key}"></div>`; }
function difsData(key){ const dr=DR(); let d=dr[key]; if(!d||typeof d!=='object'||Array.isArray(d)) d=dr[key]={d:'',i:'',f:'',s:'',r:[]}; if(!Array.isArray(d.r)) d.r=[]; return d; }
const difsFilled = d => DIFS_COLS.every(([k])=>String(d[k]||'').trim().length>0);
/* colonnes d'un exercice : les quatre colonnes, ou une seule case « Ta réponse » pour une question à justifier (texte:true) */
const DIFS_TXT = [['s','Ta réponse','explique avec tes mots, en phrases complètes']];
const difsCols = cfg => cfg && cfg.texte ? DIFS_TXT : DIFS_COLS;
/* le registre se remplit quand une capsule s'affiche : la vue prof le remplit d'un coup pour tout le cours */
function fillDIFS(course, mail){ VARY_MAIL=mail||null; try { Object.values(CHAPTERS).filter(ch=>ch.course===course).forEach(ch=>ch.caps.forEach(c=>{ try{ if(c.body) c.body(); }catch(e){} })); } finally { VARY_MAIL=null; } }
function mountAllDIFS(root){ root.querySelectorAll('[data-difs]').forEach(b=>mountDIFS(b, b.dataset.difs)); }
function mountDIFS(box, key){
  const cfg=DIFS_REG[key]; if(!cfg){ box.textContent='Exercice introuvable'; return; }
  const st = WS[key] || (WS[key]={ checked:false, act:null });
  const done=()=>!!P().ex[key];
  const draw=()=>{
    const d=difsData(key), ok=done(), auto=(cfg.res||[]).length>0;
    const cols=difsCols(cfg);
    const cells=cols.map(([k,l,ph])=>`<div class="difs-col"><div class="difs-h">${l}</div>
        <div class="mcell ${ok?'ro':''}" data-mc="${k}">${ok?'':`<textarea data-mta="${k}" maxlength="${DIFS_MAX}" rows="${cfg.texte?6:4}" placeholder="${esc(ph)}" spellcheck="false" aria-label="${l}">${esc(d[k]||'')}</textarea>`}
        <div class="mview" data-mv="${k}">${String(d[k]||'').trim()?fmath(d[k]):`<span class="muted tiny">${ok?'—':'Clique pour écrire'}</span>`}</div></div></div>`).join('');
    const res=(cfg.res||[]).map((r,i)=>{ const v=d.r[i]||'', good=ok||okVal(r,v), show=ok||st.checked&&v!=='';
      return `<div class="drow ${show?(good?'good':'wrong'):''}"><span class="dn">${r.lbl?'':i+1}</span><span class="dq">${r.lbl||'Résultat'}</span>
        <span class="din"><input type="text" inputmode="decimal" data-rv="${i}" value="${esc(ok&&!okVal(r,v)?frN(r.ans):v)}" ${ok?'disabled':''} aria-label="${esc(r.lbl||'Résultat '+(i+1))}"><span class="u">${r.unit||''}</span></span>
        ${show&&!good&&r.hint?`<span class="dh">${r.hint}</span>`:''}</div>`; }).join('');
    box.innerHTML=`<div class="row between wrap" style="gap:8px"><div class="row" style="gap:8px"><span class="exn">${cfg.n}</span><b>${cfg.nom||'Exercice'} ${cfg.n}</b></div>
        <div class="row" style="gap:6px">${ok?'<span class="chip ok">✓ réussi</span>':'<span class="chip amber">exercice</span>'}<button class="btn sm" data-formulaire="${cfg.course}" type="button">📐 Formulaire</button></div></div>
      <div class="difs-en">${cfg.enonce}</div>
      ${ok||cfg.texte?'':fmToolbar()}
      <div class="difs ${cfg.texte?'one':''} ${ok?'done':''}">${cells}</div>
      ${auto?`<div class="difs-res"><div class="tiny muted" style="margin:2px 0 6px">${ok?'Tes résultats':'Recopie ici ton résultat final : il est vérifié tout de suite.'}${!ok&&cfg.tip?' '+cfg.tip:''}</div><div class="drill">${res}</div></div>`
        :`<div class="note warn" style="margin-top:10px"><b>Pas de correction automatique pour ${cfg.texte?'cette question':'cet exercice'}.</b>${cfg.sans||'Ton prof vérifiera ton tableau.'}</div>`}
      ${ok?`<div class="fb good"><b>${auto?'Bravo, c’est juste.':cfg.texte?'Réponse enregistrée.':'Tableau complété.'}</b> ${cfg.ok||''}</div>`
        :`<div class="row" style="margin-top:10px"><button class="btn sm primary" data-dck type="button">${auto?'Vérifier':'J’ai terminé'}</button><span class="small" data-dfb></span></div>`}`;
    box.querySelectorAll('[data-formulaire]').forEach(b=>b.onclick=()=>openFormulaire(b.dataset.formulaire));
    if(ok) return;
    const tas=[...box.querySelectorAll('[data-mta]')];
    tas.forEach(ta=>{
      const cell=ta.closest('.mcell'), view=cell.querySelector('.mview');
      const live=()=>{ d[ta.dataset.mta]=ta.value; view.innerHTML = ta.value.trim()?fmath(ta.value):''; };
      ta.addEventListener('focus',()=>{ st.act=ta.dataset.mta; box.querySelectorAll('.mcell').forEach(c=>c.classList.toggle('edit', c===cell)); live(); });
      ta.addEventListener('input',()=>{ live(); st.checked=false; save(); });
      ta.addEventListener('blur',()=>{ setTimeout(()=>{ if(document.activeElement && document.activeElement.closest && document.activeElement.closest('.fm-tools')) return; if(document.activeElement!==ta){ cell.classList.remove('edit'); view.innerHTML = ta.value.trim()?fmath(ta.value):'<span class="muted tiny">Clique pour écrire</span>'; } },120); });
    });
    box.querySelectorAll('.mcell').forEach(c=>c.addEventListener('click',e=>{ if(e.target.tagName==='TEXTAREA') return; const ta=c.querySelector('textarea'); if(ta){ c.classList.add('edit'); ta.focus(); ta.setSelectionRange(ta.value.length,ta.value.length); } }));
    bindToolbar(box, ()=> box.querySelector(`[data-mta="${st.act}"]`) || null);
    box.querySelectorAll('[data-rv]').forEach(inp=>inp.oninput=()=>{ d.r[+inp.dataset.rv]=inp.value; st.checked=false; inp.closest('.drow').className='drow'; save(); });
    box.querySelector('[data-dck]').onclick=()=>{
      const fb=box.querySelector('[data-dfb]'), miss=cols.filter(([k])=>!String(d[k]||'').trim()).map(c=>c[1]);
      if(miss.length){ fb.innerHTML=`<span style="color:var(--bad)">Complète d'abord : ${miss.join(', ')}.</span> Le tableau entier compte, pas seulement le résultat.`; return; }
      if(!cfg.texte && !/=/.test(d.f)){ fb.innerHTML=`<span style="color:var(--bad)">Dans « Formule(s) », écris la formule avec son signe = (par exemple <b>I = P / U</b>).</span>`; return; }
      if(!auto){ exSet(key); save(); draw(); return; }
      const n=cfg.res.filter((r,i)=>okVal(r,d.r[i])).length; save();
      if(n===cfg.res.length){ exSet(key); draw(); return; }
      exRate(key); st.checked=true; draw();
      box.querySelector('[data-dfb]').innerHTML = `<b>${n}/${cfg.res.length}</b> juste${n>1?'s':''}. <span style="color:var(--bad)">Revois ${cfg.res.length-n>1?'les résultats':'le résultat'} en rouge : une unité à convertir ? une formule retournée ?</span> ${cfg.hint||''}`;
    };
  };
  draw();
}

/* ---------- 5. Le formulaire du cours (lecture seule) ---------- */
const FORMULAIRES = {};   // cours → { titre, lois:[[loi, formule, [dérivées], unités, chapitre]], valeurs:[[titre, entêtes, lignes]] }
function openFormulaire(course){
  const F=FORMULAIRES[course]; if(!F){ toast('Pas de formulaire pour ce cours'); return; }
  modal('📐 '+esc(F.titre), `<div class="fm-sheet" oncopy="return false">
    <p class="small muted" style="margin-top:0">${F.intro}</p>
    <div class="fm-grid">${F.lois.map(([loi,f,der,u,ch])=>`<div class="fm-card"><div class="row between"><b>${loi}</b>${ch?`<span class="tiny muted">chap. ${ch}</span>`:''}</div>
      <div class="fm-main">${fm(f)}</div>${der&&der.length?`<div class="fm-der">${der.map(x=>`<span>${fm(x)}</span>`).join('')}</div>`:''}<div class="tiny muted">${u}</div></div>`).join('')}</div>
    ${(F.valeurs||[]).map(([t,h,rows])=>`<h3 style="margin:16px 0 6px">${t}</h3>${tbl(h,rows)}`).join('')}</div>`, {wide:true});
}

/* ---------- 6. Triangle mnémotechnique interactif ----------
   haut = gauche × droite. On clique la grandeur à cacher : il reste l'opération. */
function triangle(top, left, right, id){
  return `<div class="tri" data-tri="${esc([top,left,right].join('|'))}" id="${id||''}"><div class="tri-fig"><svg viewBox="0 0 240 170" role="img" aria-label="Triangle : ${esc(top)} = ${esc(left)} · ${esc(right)}">
    <path d="M120 8 L232 162 L8 162 Z" fill="var(--elec-soft)" stroke="var(--elec)" stroke-width="2.5"/><line x1="64" y1="86" x2="176" y2="86" stroke="var(--elec)" stroke-width="2"/><line x1="120" y1="86" x2="120" y2="162" stroke="var(--elec)" stroke-width="2"/>
    <text x="120" y="122" text-anchor="middle" font-size="17" fill="var(--muted)">·</text></svg>
    <button class="tri-b tri-t" data-trik="0" aria-label="Cacher ${esc(top)}">${fm(top)}</button><button class="tri-b tri-l" data-trik="1" aria-label="Cacher ${esc(left)}">${fm(left)}</button><button class="tri-b tri-r" data-trik="2" aria-label="Cacher ${esc(right)}">${fm(right)}</button></div>
    <div class="tri-out small"><span class="muted">Clique la grandeur que tu cherches.</span></div></div>`;
}
function mountTriangles(root){
  root.querySelectorAll('[data-tri]').forEach(t=>{
    const [a,b,c]=t.dataset.tri.split('|'), par=x=>/[ .+\-]/.test(x.trim())&&!/^\(.*\)$/.test(x.trim())?`(${x})`:x;
    const out=t.querySelector('.tri-out');
    t.querySelectorAll('[data-trik]').forEach(btn=>btn.onclick=()=>{
      const k=+btn.dataset.trik; t.querySelectorAll('[data-trik]').forEach(x=>x.classList.toggle('hid', x===btn));
      const f = k===0 ? `${a} = ${b} . ${c}` : k===1 ? `${b} = ${par(a)} / ${par(c)}` : `${c} = ${par(a)} / ${par(b)}`;
      out.innerHTML = `<b>${k===0?'Le produit des deux du bas':'Le haut divisé par l’autre'}</b> <span class="fm-in-big">${fm(f)}</span>`;
    });
  });
}

/* ---------- 7. Vue prof : les tableaux d'un élève ---------- */
function exDoneOf(mail, course){ fillDIFS(course); const p=progOf(mail); return Object.keys(DIFS_REG).filter(k=>DIFS_REG[k].course===course && p.ex[k]).length; }
function voirExercices(mail, course, focus){
  fillDIFS(course, mail);   // les valeurs de CET élève (données variables)
  const p=progOf(mail), dr=(p.dr&&typeof p.dr==='object')?p.dr:{};
  const keys=Object.keys(DIFS_REG).filter(k=>DIFS_REG[k].course===course);
  const byCh={}; keys.forEach(k=>{ const c=DIFS_REG[k].chap; (byCh[c]=byCh[c]||[]).push(k); });
  const body=Object.keys(byCh).sort((a,b)=>a.localeCompare(b,'fr',{numeric:true})).map(ch=>{
    const rows=byCh[ch].map(k=>{ const cfg=DIFS_REG[k], d=dr[k]||{}, ok=!!p.ex[k], any=difsCols(cfg).some(([c])=>String(d[c]||'').trim());
      if(!any && !ok) return `<div class="small muted" style="padding:4px 0" data-vk="${k}">${cfg.nom||'Exercice'} ${cfg.n} — pas commencé</div>`;
      return `<details class="vx" data-vk="${k}" ${!ok||k===focus?'open':''}><summary><b>${cfg.nom||'Exercice'} ${cfg.n}</b> ${ok?'<span class="chip ok">✓ réussi</span>':'<span class="chip warn">en cours</span>'}</summary>
        <div class="small muted" style="margin:6px 0">${cfg.enonce}</div>
        <div class="difs done ${cfg.texte?'one':''}">${difsCols(cfg).map(([c,l])=>`<div class="difs-col"><div class="difs-h">${l}</div><div class="mcell ro"><div class="mview">${String(d[c]||'').trim()?fmath(d[c]):'<span class="muted tiny">vide</span>'}</div></div></div>`).join('')}</div>
        ${(cfg.res||[]).length?`<div class="small" style="margin-top:6px">${cfg.res.map((r,i)=>{ const v=(d.r||[])[i]||''; return `${r.lbl||'Résultat'} : <b style="color:${v===''?'var(--muted)':okVal(r,v)?'var(--ok)':'var(--bad)'}">${v===''?'—':esc(v)} ${r.unit||''}</b> <span class="tiny muted">(attendu ${frN(r.ans)} ${r.unit||''})</span>`; }).join(' · ')}</div>`:''}</details>`; }).join('');
    return `<h3 style="margin:14px 0 4px">Chapitre ${chapLbl(ch)} — ${esc(CHAPTERS[ch]?CHAPTERS[ch].titre:'')}</h3>${rows}`; }).join('');
  const md=modal(`Exercices — ${esc(nomEl(mail))}`, `<div class="vx-sheet">${body||'<p class="muted">Aucun exercice dans ce cours.</p>'}</div>`, {wide:true});
  const f=focus&&md&&[...md.querySelectorAll('[data-vk]')].find(x=>x.dataset.vk===focus);   // ouvert depuis le parcours : directement sur cet exercice
  if(f){ f.style.outline='2px solid var(--accent, #2563eb)'; f.style.borderRadius='8px'; setTimeout(()=>f.scrollIntoView({block:'center'}),50); }
}
