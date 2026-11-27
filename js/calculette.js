/* =========================================================
   CALCULATRICE SCIENTIFIQUE (disposition proche de la calculatrice de classe) — fenêtre flottante, déplaçable
   Bouton « 🧮 Calculatrice » dans les capsules, les tableaux d'exercices et les évaluations : openCalc().
   Calcul sans eval : analyse de l'expression (priorités, parenthèses, multiplication implicite « 2π », « 3(4+1) »).
   Degrés par défaut (DEG), comme la calculatrice de classe ; SHIFT donne les fonctions inverses.
   « ENG » écrit le résultat en puissances de 10 multiples de 3 (milli, kilo…) ; « Insérer » le recopie
   dans la dernière case d'exercice où l'élève a cliqué, avec une virgule.
   ========================================================= */
const CALC = { expr:'', res:null, ans:0, shift:false, eng:false, rad:false, hist:[], hi:-1, el:null, cible:null, err:'' };
document.addEventListener('focusin', e=>{ const t=e.target; if(t && t.matches && t.matches('#main input[type=text], #main input:not([type]), #main input[inputmode], #main textarea') ) CALC.cible=t; });

/* ---------- le calcul ---------- */
function calcEval(src, ans, rad){
  const s=String(src).replace(/,/g,'.').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/\s+/g,'');
  const toks=[]; let i=0;
  const FN=['asin','acos','atan','sin','cos','tan','sqrt','cbrt','log','ln','exp10','exp','inv'];
  while(i<s.length){
    const c=s[i];
    if(/[0-9.]/.test(c)){ let j=i; while(j<s.length && /[0-9.]/.test(s[j])) j++; const n=s.slice(i,j); if((n.match(/\./g)||[]).length>1) throw new Error('Nombre mal écrit'); toks.push({t:'n', v:parseFloat(n)}); i=j; continue; }
    if(s.startsWith('E',i)){ toks.push({t:'op', v:'E'}); i++; continue; }            // ×10^x
    if(s.startsWith('π',i)){ toks.push({t:'n', v:Math.PI}); i++; continue; }
    if(s.startsWith('ℯ',i)){ toks.push({t:'n', v:Math.E}); i++; continue; }
    if(s.startsWith('Ans',i)){ toks.push({t:'n', v:ans}); i+=3; continue; }
    if(s.startsWith('²',i)){ toks.push({t:'post', v:'sq'}); i++; continue; }
    if(s.startsWith('³',i)){ toks.push({t:'post', v:'cube'}); i++; continue; }
    if(s.startsWith('⁻¹',i)){ toks.push({t:'post', v:'inv'}); i+=2; continue; }
    if(s.startsWith('!',i)){ toks.push({t:'post', v:'fact'}); i++; continue; }
    if(s.startsWith('%',i)){ toks.push({t:'post', v:'pct'}); i++; continue; }
    if(s.startsWith('√(',i) || s.startsWith('∛(',i)){ toks.push({t:'fn', v:s[i]==='√'?'sqrt':'cbrt'}); i++; continue; }
    const f=FN.find(f=>s.startsWith(f+'(',i)); if(f){ toks.push({t:'fn', v:f}); i+=f.length; continue; }
    if('+-*/^()'.includes(c)){ toks.push({t:c==='('||c===')'?c:'op', v:c}); i++; continue; }
    throw new Error('Erreur de syntaxe');
  }
  /* multiplication implicite : 2π, 3(…), )(, 2sin(…) */
  const T=[]; toks.forEach((k,j)=>{ const p=T[T.length-1]; if(p && (p.t==='n'||p.t===')'||p.t==='post') && (k.t==='n'||k.t==='('||k.t==='fn')) T.push({t:'op',v:'*'}); T.push(k); });
  let p=0; const peek=()=>T[p], next=()=>T[p++];
  const deg = x => rad ? x : x*Math.PI/180, undeg = x => rad ? x : x*180/Math.PI;
  const fact = n => { if(n<0 || n!==Math.floor(n) || n>170) throw new Error('Erreur math'); let r=1; for(let k=2;k<=n;k++) r*=k; return r; };
  function prim(){
    const k=next(); if(!k) throw new Error('Erreur de syntaxe');
    if(k.t==='n') return k.v;
    if(k.t==='op' && (k.v==='-'||k.v==='+')){ const v=unaire(); return k.v==='-'?-v:v; }
    if(k.t==='('){ const v=expr(); if(peek() && peek().t===')') next(); return v; }      // parenthèse fermante oubliée en fin : acceptée, comme sur la Casio
    if(k.t==='fn'){ next(); const a=expr(); if(peek() && peek().t===')') next();
      switch(k.v){ case 'sin': return arr(Math.sin(deg(a))); case 'cos': return arr(Math.cos(deg(a))); case 'tan': { if(!rad && Math.abs(((a%180)+180)%180-90)<1e-12) throw new Error('Erreur math'); return arr(Math.tan(deg(a))); }
        case 'asin': if(Math.abs(a)>1) throw new Error('Erreur math'); return undeg(Math.asin(a)); case 'acos': if(Math.abs(a)>1) throw new Error('Erreur math'); return undeg(Math.acos(a)); case 'atan': return undeg(Math.atan(a));
        case 'sqrt': if(a<0) throw new Error('Erreur math'); return Math.sqrt(a); case 'cbrt': return Math.cbrt(a);
        case 'log': if(a<=0) throw new Error('Erreur math'); return Math.log10(a); case 'ln': if(a<=0) throw new Error('Erreur math'); return Math.log(a);
        case 'exp10': return Math.pow(10,a); case 'exp': return Math.exp(a); case 'inv': if(a===0) throw new Error('Erreur math'); return 1/a; } }
    throw new Error('Erreur de syntaxe');
  }
  const arr = v => Math.abs(v)<1e-15 ? 0 : v;
  function post(){ let v=prim(); while(peek() && peek().t==='post'){ const o=next().v; v = o==='sq'?v*v : o==='cube'?v*v*v : o==='fact'?fact(v) : o==='pct'?v/100 : (v===0?(()=>{throw new Error('Erreur math');})():1/v); } return v; }
  function puis(){ const b=post(); if(peek() && peek().t==='op' && peek().v==='^'){ next(); const e=unaire(); const r=Math.pow(b,e); if(isNaN(r)) throw new Error('Erreur math'); return r; } return b; }   // à droite d'abord : 2^3^2 = 2^9
  function unaire(){ const k=peek(); if(k && k.t==='op' && (k.v==='-'||k.v==='+')){ next(); const v=unaire(); return k.v==='-'?-v:v; } return puis(); }
  function sci(){ let v=unaire(); while(peek() && peek().t==='op' && peek().v==='E'){ next(); v=v*Math.pow(10, unaire()); } return v; }
  function terme(){ let v=sci(); while(peek() && peek().t==='op' && (peek().v==='*'||peek().v==='/')){ const o=next().v, w=sci(); if(o==='/' && w===0) throw new Error('Erreur math'); v = o==='*'?v*w:v/w; } return v; }
  function expr(){ let v=terme(); while(peek() && peek().t==='op' && (peek().v==='+'||peek().v==='-')){ const o=next().v, w=terme(); v = o==='+'?v+w:v-w; } return v; }
  if(!T.length) throw new Error('');
  const v=expr(); if(p<T.length) throw new Error('Erreur de syntaxe');
  if(!isFinite(v)) throw new Error('Erreur math');
  return v;
}
/* affichage : 10 chiffres significatifs, virgule ; notation scientifique hors de 10^-9 … 10^10 ; ENG : exposant multiple de 3 */
function calcFmt(v, eng){
  if(v===0) return '0';
  const a=Math.abs(v);
  if(eng){ const e=Math.floor(Math.log10(a)/3)*3, m=v/Math.pow(10,e); return `${+m.toPrecision(10)}`.replace('.',',')+(e?`×10<sup>${e}</sup>`:''); }
  if(a>=1e10 || a<1e-9){ const e=Math.floor(Math.log10(a)), m=v/Math.pow(10,e); return `${+m.toPrecision(10)}`.replace('.',',')+`×10<sup>${e}</sup>`; }
  return `${+v.toPrecision(10)}`.replace('.',',');
}
const calcBrut = v => `${+v.toPrecision(10)}`.replace('.',',').replace(/e\+?/,'E');   // pour « Insérer » : 0,0047 ou 4,7E-12

/* ---------- la fenêtre ---------- */
const CALC_TOUCHES = [
  [['SHIFT','shift','fn sh'],['DEG','mode','fn'],['ENG','eng','fn'],['▲','hist','fn'],['⤵','ins','fn ins']],
  [['x²','²','fn','x³','³'],['√','sqrt(','fn','∛','cbrt('],['xʸ','^','fn','ⁿ√ (écris x^(1/n))','^(1/'],['x⁻¹','⁻¹','fn','x!','!'],['log','log(','fn','10ˣ','exp10(']],
  [['sin','sin(','fn','sin⁻¹','asin('],['cos','cos(','fn','cos⁻¹','acos('],['tan','tan(','fn','tan⁻¹','atan('],['ln','ln(','fn','eˣ','exp('],['(−)','-','fn']],
  [['(','(','fn'],[')',')','fn'],['π','π','fn'],['%','%','fn'],['e','ℯ','fn']],
  [['7','7'],['8','8'],['9','9'],['DEL','del','del'],['AC','ac','ac']],
  [['4','4'],['5','5'],['6','6'],['×','×','op'],['÷','÷','op']],
  [['1','1'],['2','2'],['3','3'],['+','+','op'],['−','−','op']],
  [['0','0'],[',',','],['×10ˣ','E','op'],['Ans','Ans','op'],['=','eq','eq']],
];
function openCalc(){
  if(CALC.el){ CALC.el.hidden=false; CALC.el.focus(); return; }
  const w=document.createElement('div'); w.className='calc'; w.tabIndex=-1; w.setAttribute('role','dialog'); w.setAttribute('aria-label','Calculatrice');
  w.innerHTML=`<div class="calc-h"><span class="calc-marque">CALCULATRICE</span><span class="calc-mod">scientifique</span><button class="calc-x" data-cx type="button" aria-label="Fermer">✕</button></div>
    <div class="calc-ecran"><div class="calc-ind"><span data-ci-s></span><span data-ci-m>D</span><span data-ci-e></span></div><div class="calc-expr" data-cexpr></div><div class="calc-res" data-cres></div></div>
    <p class="calc-aide">▲ calculs précédents · ⤵ recopie le résultat dans la case où tu étais</p>
    <div class="calc-k">${CALC_TOUCHES.map(r=>r.map(([l,v,cl,sl,sv])=>`<button type="button" class="calc-b ${cl||'ch'}" data-ck="${esc(v)}" ${sv?`data-sk="${esc(sv)}"`:''}>${sl?`<small>${esc(sl.split(' ')[0])}</small>`:''}${esc(l)}</button>`).join('')).join('')}</div>`;
  document.body.appendChild(w); CALC.el=w;
  /* position gardée d'une fois à l'autre */
  let pos=null; try{ pos=JSON.parse(localStorage.getItem('plateforme-calc')||'null'); }catch(e){}
  const place=(x,y)=>{ const r=w.getBoundingClientRect(); x=Math.max(4, Math.min(window.innerWidth-r.width-4, x)); y=Math.max(4, Math.min(window.innerHeight-r.height-4, y)); w.style.left=x+'px'; w.style.top=y+'px'; return [x,y]; };
  if(window.innerWidth>600) place(pos?pos[0]:window.innerWidth-w.offsetWidth-24, pos?pos[1]:90);
  const h=w.querySelector('.calc-h');
  h.addEventListener('pointerdown', e=>{ if(e.target.closest('button') || window.innerWidth<=600) return; const r=w.getBoundingClientRect(), dx=e.clientX-r.left, dy=e.clientY-r.top; h.setPointerCapture(e.pointerId);
    const mv=ev=>{ place(ev.clientX-dx, ev.clientY-dy); }, up=ev=>{ h.removeEventListener('pointermove',mv); h.removeEventListener('pointerup',up); const r2=w.getBoundingClientRect(); try{ localStorage.setItem('plateforme-calc', JSON.stringify([r2.left, r2.top])); }catch(e){} };
    h.addEventListener('pointermove',mv); h.addEventListener('pointerup',up); });
  w.querySelector('[data-cx]').onclick=()=>{ w.hidden=true; };
  w.querySelector('.calc-k').addEventListener('pointerdown', e=>e.preventDefault());   // le clic ne vole pas le focus de la case d'exercice
  w.querySelector('.calc-k').addEventListener('click', e=>{ const b=e.target.closest('[data-ck]'); if(!b) return; calcTouche(CALC.shift && b.dataset.sk ? b.dataset.sk : b.dataset.ck, b.dataset.ck); });
  w.addEventListener('keydown', e=>{
    const k=e.key, map={'*':'×','/':'÷','-':'−','.':',','Enter':'eq','=':'eq','Backspace':'del','Escape':'ac','Delete':'ac','p':'π'};
    if(/^[0-9+(),^%!]$/.test(k)) calcTouche(k); else if(map[k]) calcTouche(map[k]); else if(k==='ArrowUp') calcHist(); else return;
    e.preventDefault(); e.stopPropagation(); });
  calcAff(); w.focus();
}
function calcTouche(v, base){
  const C=CALC; if(v!=='shift') C.shift=false;   // SHIFT ne vaut que pour la touche suivante
  if(v==='shift'){ C.shift=!C.shift; return calcAff(); }
  if(v==='mode'){ C.rad=!C.rad; return calcAff(); }
  if(v==='eng'){ C.eng=!C.eng; return calcAff(); }
  if(v==='ac'){ C.expr=''; C.res=null; C.err=''; return calcAff(); }
  if(v==='del'){ if(C.res!=null && !C.err){ C.res=null; } else { const m=C.expr.match(/(asin\(|acos\(|atan\(|sqrt\(|cbrt\(|exp10\(|exp\(|sin\(|cos\(|tan\(|log\(|ln\(|Ans|⁻¹|.)$/); C.expr=m?C.expr.slice(0,-m[0].length):''; } C.err=''; return calcAff(); }
  if(v==='hist') return calcHist();
  if(v==='ins') return calcInserer();
  if(v==='eq'){
    if(!C.expr.trim()) return;
    try{ C.res=calcEval(C.expr, C.ans, C.rad); C.err=''; C.ans=C.res; C.hist.unshift([C.expr, C.res]); C.hist=C.hist.slice(0,20); C.hi=-1; }
    catch(e){ C.err=e.message||'Erreur'; C.res=null; }
    return calcAff();
  }
  if(C.res!=null && !C.err){ C.expr = /^[×÷+−^²³%!]|^⁻¹|^E/.test(v) ? 'Ans' : ''; C.res=null; }   // après « = » : une opération continue avec Ans, un nombre recommence
  C.err=''; C.expr+=v; calcAff();
}
const calcJoli = s => esc(s).replace(/asin\(/g,'sin⁻¹(').replace(/acos\(/g,'cos⁻¹(').replace(/atan\(/g,'tan⁻¹(').replace(/sqrt\(/g,'√(').replace(/cbrt\(/g,'∛(').replace(/exp10\(/g,'10^(').replace(/exp\(/g,'e^(').replace(/E/g,'×10^').replace(/\^/g,'<span class="calc-pow">^</span>');
function calcAff(){
  const w=CALC.el; if(!w) return;
  w.querySelector('[data-cexpr]').innerHTML = calcJoli(CALC.expr) + '<span class="calc-cur">▏</span>';
  w.querySelector('[data-cres]').innerHTML = CALC.err ? `<span class="calc-err">${esc(CALC.err)}</span>` : CALC.res!=null ? calcFmt(CALC.res, CALC.eng) : '';
  w.querySelector('[data-ci-s]').textContent = CALC.shift ? 'S' : '';
  w.querySelector('[data-ci-m]').textContent = CALC.rad ? 'R' : 'D';
  w.querySelector('[data-ci-e]').textContent = CALC.eng ? 'ENG' : '';
  w.classList.toggle('sh', CALC.shift);
}
function calcInserer(){
  const v = CALC.res!=null && !CALC.err ? CALC.res : CALC.hist.length ? CALC.hist[0][1] : null;
  if(v==null){ toast('Calcule d’abord un résultat (touche =)'); return; }
  const t=CALC.cible; if(!t || !t.isConnected){ toast('Clique d’abord dans la case où tu veux le résultat'); return; }
  const txt=calcBrut(v), a=t.selectionStart??t.value.length, b=t.selectionEnd??t.value.length;
  t.value = /textarea/i.test(t.tagName) ? t.value.slice(0,a)+txt+t.value.slice(b) : txt;
  t.dispatchEvent(new Event('input', {bubbles:true})); t.dispatchEvent(new Event('change', {bubbles:true}));
  toast('Résultat recopié : '+txt);
}
function calcHist(){
  const C=CALC; if(!C.hist.length){ toast('Pas encore de calcul'); return; }
  C.hi=(C.hi+1)%C.hist.length; const [e,r]=C.hist[C.hi]; C.expr=e; C.res=r; C.err=''; calcAff();
}
/* un bouton « 🧮 Calculatrice » n'importe où (data-calc) l'ouvre */
document.addEventListener('click', e=>{ const b=e.target.closest && e.target.closest('[data-calc]'); if(b){ e.preventDefault(); openCalc(); } });
const calcBtn = (sm=true) => `<button class="btn ${sm?'sm':''}" type="button" data-calc title="Calculatrice scientifique">🧮 Calculatrice</button>`;
