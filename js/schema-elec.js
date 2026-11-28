/* =========================================================
   SCHÉMAS ÉLECTRIQUES INTERACTIFS — dessin électrique (Électricité 4e)
   ---------------------------------------------------------
   schemaW(box, spec)  : un circuit de commande tracé comme sur la feuille (branches verticales entre
                         les deux lignes d'alimentation), que l'élève fait fonctionner.
   schemaSVG(spec, st) : le même dessin, figé (pour une figure ou une question).

   Le schéma est toujours DESSINÉ AU REPOS : seules la position des lames et la couleur changent.
   Fil rouge = relié à la ligne L, fil bleu = relié à N à travers un récepteur alimenté.

   spec.c : la branche, liste d'éléments en série, du haut vers le bas (ou fonction (opt) => liste)
     contact  {k:'no'|'nc', o:'S3E', r:'-2S3E', b:['13','14'], t:'Marche', a:'bp'|'au'|'corde'|'fdc'|'th'|'km'|'int'}
              a:'bp' bouton-poussoir (actionné tant qu'on appuie) ; 'au','corde','fdc','th','int' : clic = actionné / relâché ;
              a:'km' : contact d'un contacteur ou d'un relais (o = repère de la bobine) ; a:'auto' : actionné par spec.auto
     bobine   {k:'bob', o:'KM3H', r:'-2KM3H', x:['2-E4','3-E4'], y:true (bobine de distributeur)}
     voyant   {k:'lamp', o:'H5H', r:'-2H5H', t:'Marche'}
     dérivation {par:[[…],[…]]} : plusieurs chemins entre les deux mêmes points.
     options d'un élément : lk:true (contact de verrouillage), brk:'id' (fil cassé quand l'option id est cochée),
              nw:true (ajouté, en vert), del:true (barré : ne compte plus), hl:'texte' (zone, voir spec.zones)
   spec.rails  : ['L+ 24 V','0 V']           spec.puiss : {mode:'direct'|'inv', km:['KM3H','KM6H'], f:'F4E', r:{…}}
   spec.table  : {in:['S1','S2'], out:'H1'}   spec.toggles : [{id, lbl}]   spec.num : numéros de fil par potentiel
   spec.side   : (st) => html (figure à côté, par exemple un vérin) ; spec.auto : (st, dt) => change st (animation)
   spec.status : (st) => texte sous la figure
   ========================================================= */
(function(){
const COL=118, ROW=62, LX=100, TOPY=40;
const isRec = e => e && (e.k==='bob' || e.k==='lamp');
const isCt  = e => e && (e.k==='no' || e.k==='nc');
const esc2  = s => String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- taille d'un morceau de schéma (en colonnes et en lignes) ---------- */
function sz(n){
  if(Array.isArray(n)){ let w=1,h=0; n.forEach(x=>{ const s=sz(x); w=Math.max(w,s.w); h+=s.h; }); return {w,h:Math.max(h,0)}; }
  if(n.par){ let w=0,h=0; n.par.forEach(s=>{ const z=sz(s); w+=z.w; h=Math.max(h,z.h); }); return {w,h}; }
  return {w:1,h:1};
}
function walk(n, f){ if(Array.isArray(n)) n.forEach(x=>walk(x,f)); else if(n.par) n.par.forEach(s=>walk(s,f)); else f(n); }

/* ---------- logique : quel contact est fermé, quel récepteur est alimenté ---------- */
function actuated(o, st){ return !!(st.act[o] || st.coil[o]); }
function passes(e, st){
  if(e.del) return true;                                   // barré : remplacé, plus dans le circuit
  if(e.brk && st.opt[e.brk]) return false;                 // fil cassé
  if(e.lk && st.opt.nolock) return true;                   // verrouillage retiré : simple fil
  if(e.k==='no') return actuated(e.o, st);
  if(e.k==='nc') return !actuated(e.o, st);
  return true;
}
function evalSeq(seq, pin, st, on){
  for(const e of seq){
    if(e.par){ let out=false; e.par.forEach(s=>{ if(evalSeq(s, pin, st, on)) out=true; }); pin=out; continue; }
    if(isRec(e)){ if(pin && !e.del) on.add(e.o); continue; }
    pin = pin && passes(e, st);
  }
  return pin;
}
function coilsOf(seq){ const s=new Set(); walk(seq, e=>{ if(e.k==='bob') s.add(e.o); }); return [...s]; }
/* les bobines changent d'état une à la fois : quand deux ordres arrivent ensemble, le premier gagne (comme en vrai) */
function solve(seq, st){
  const coils=coilsOf(seq);
  for(let i=0;i<30;i++){
    const on=new Set(); if(!st.trip) evalSeq(seq, true, st, on);
    const ch=coils.find(o=>!!st.coil[o] !== on.has(o));
    if(!ch){ st.rec=on; return; }
    st.coil[ch]=on.has(ch);
  }
  const on=new Set(); evalSeq(seq, true, st, on); st.rec=on;
}

/* ---------- dessin ---------- */
const C = { L:'var(--live)', N:'#2f6fd6', off:'var(--ink-2)', hl:'var(--amber)' };
const wcol = p => p==='L'?C.L:p==='N'?C.N:C.off;

function makeCtx(st, spec){ return { st, spec, out:[], nd:0, ndMap:{}, next:3, hl:st.hl }; }
function newNd(ctx){ return 'n'+(++ctx.nd); }
function wire(ctx, x1,y1,x2,y2, p, nd){
  const on = ctx.hl!=null && nd===ctx.hl;
  ctx.out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on?C.hl:wcol(p)}" stroke-width="${on?5:p?2.6:1.8}" stroke-linecap="round"${nd&&ctx.spec.num?` data-nd="${nd}" style="cursor:pointer"`:''}/>`);
  if(nd && ctx.spec.num) ctx.out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="transparent" stroke-width="14" data-nd="${nd}" style="cursor:pointer"/>`);
}
function numLbl(ctx, nd, x, y){
  if(!ctx.spec.num || !nd) return;
  if(!(nd in ctx.ndMap)) ctx.ndMap[nd] = nd==='L' ? 1 : nd==='N' ? 2 : ctx.next++;
  const on = ctx.hl!=null && nd===ctx.hl;
  ctx.out.push(`<g data-nd="${nd}" style="cursor:pointer"><rect x="${x-25}" y="${y-8}" width="20" height="14" rx="3" fill="${on?'var(--amber-soft)':'var(--surface)'}" stroke="${on?C.hl:'var(--line)'}"/><text x="${x-15}" y="${y+3}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--ink)">${ctx.ndMap[nd]}</text></g>`);
}
function actGlyph(a, x, cy, col){
  const d=`<line x1="${x-6}" y1="${cy}" x2="${x-20}" y2="${cy}" stroke="${col}" stroke-width="1.4" stroke-dasharray="3 2"/>`;
  if(a==='bp') return d+`<path d="M${x-20} ${cy-7} h-4 v14 h4" fill="none" stroke="${col}" stroke-width="1.6"/>`;
  if(a==='au') return d+`<path d="M${x-21} ${cy-9} a9 9 0 0 0 0 18 z" fill="${col}" stroke="${col}" stroke-width="1.2"/>`;
  if(a==='corde') return d+`<path d="M${x-20} ${cy} q-3 -6 -6 0 t-6 0" fill="none" stroke="${col}" stroke-width="1.6"/>`;
  if(a==='fdc') return `<path d="M${x-4} ${cy+2} l-12 0 l6 -9 z" fill="none" stroke="${col}" stroke-width="1.5"/>`;
  if(a==='th') return d+`<path d="M${x-22} ${cy+5} h4 v-10 h5 v10 h4" fill="none" stroke="${col}" stroke-width="1.5" transform="translate(-6 0)"/>`;
  if(a==='int') return d+`<path d="M${x-20} ${cy-6} v12 M${x-20} ${cy} h-6" fill="none" stroke="${col}" stroke-width="1.6"/>`;
  if(a==='auto') return `<circle cx="${x-12}" cy="${cy}" r="4" fill="none" stroke="${col}" stroke-width="1.4"/><line x1="${x-8}" y1="${cy}" x2="${x-5}" y2="${cy}" stroke="${col}" stroke-width="1.4"/>`;
  return '';
}
function labels(ctx, e, x, cy, col){
  const r=e.r?`<text x="${x-30}" y="${cy-2}" text-anchor="end" font-size="11" font-weight="800" fill="${col}">${esc2(e.r)}</text>`:'';
  const t=e.t?`<text x="${x-30}" y="${cy+10}" text-anchor="end" font-size="8.5" fill="var(--muted)">${esc2(e.t)}</text>`:'';
  const b=e.b?`<text x="${x+9}" y="${cy-13}" font-size="8.5" fill="var(--muted)">${esc2(e.b[0])}</text><text x="${x+9}" y="${cy+21}" font-size="8.5" fill="var(--muted)">${esc2(e.b[1])}</text>`:'';
  ctx.out.push(r+t+b);
}
function drawEl(ctx, e, x, y, pin, ndIn, forceNd){
  const st=ctx.st, cy=y+ROW/2, col=e.nw?'var(--ok)':e.del?'var(--muted)':'var(--ink)';
  let pout, ndOut;
  if(isRec(e)){
    const on=st.rec.has(e.o) && !e.del; pout = on ? 'N' : null; ndOut='N';
    wire(ctx, x, y, x, cy-10, pin, ndIn);
    if(e.k==='bob'){
      ctx.out.push(`<rect x="${x-12}" y="${cy-9}" width="24" height="18" fill="${on?'var(--amber-soft)':'var(--surface)'}" stroke="${on?'var(--amber)':col}" stroke-width="${on?2.4:1.6}"/>`);
      if(e.y) ctx.out.push(`<line x1="${x-12}" y1="${cy+9}" x2="${x+12}" y2="${cy-9}" stroke="${col}" stroke-width="1.2"/>`);
      ctx.out.push(`<text x="${x+15}" y="${cy-11}" font-size="8.5" fill="var(--muted)">A1</text><text x="${x+15}" y="${cy+18}" font-size="8.5" fill="var(--muted)">A2</text>`);
      if(e.x) ctx.out.push(`<text x="${x-30}" y="${cy+21}" text-anchor="end" font-size="8.5" fill="var(--elec)">${esc2([].concat(e.x).join(' · '))}</text>`);
    } else {
      ctx.out.push(`<circle cx="${x}" cy="${cy}" r="10" fill="${on?'#ffd54a':'var(--surface)'}" stroke="${on?'#e8a200':col}" stroke-width="${on?2.4:1.6}"/><path d="M${x-7} ${cy-7} L${x+7} ${cy+7} M${x+7} ${cy-7} L${x-7} ${cy+7}" stroke="${col}" stroke-width="1.3"/>`);
      ctx.out.push(`<text x="${x+15}" y="${cy-11}" font-size="8.5" fill="var(--muted)">X1</text><text x="${x+15}" y="${cy+18}" font-size="8.5" fill="var(--muted)">X2</text>`);
    }
    wire(ctx, x, cy+10, x, y+ROW, pout, ndOut);
    labels(ctx, {...e, b:null}, x, cy, col);
  } else {
    const act=actuated(e.o, st), ok=passes(e, st), broken=e.brk&&st.opt[e.brk], killed=e.lk&&st.opt.nolock;
    pout = pin==='L' && ok ? 'L' : null; ndOut=forceNd||newNd(ctx);
    wire(ctx, x, y, x, cy-12, pin, ndIn);
    wire(ctx, x, cy+12, x, y+ROW, pout, ndOut);
    if(killed){ ctx.out.push(`<line x1="${x}" y1="${cy-12}" x2="${x}" y2="${cy+12}" stroke="${wcol(pout)}" stroke-width="2.6"/><text x="${x+9}" y="${cy+4}" font-size="8.5" fill="var(--bad)">retiré</text>`); labels(ctx,{...e,b:null},x,cy,'var(--muted)'); }
    else {
      const closed = e.k==='no' ? act : !act;
      let blade;
      if(e.k==='no') blade = closed ? [x-1, cy-12] : [x-12, cy-9];
      else { ctx.out.push(`<line x1="${x}" y1="${cy-12}" x2="${x+9}" y2="${cy-12}" stroke="${col}" stroke-width="1.6"/>`); blade = closed ? [x+11, cy-15] : [x-12, cy-9]; }
      ctx.out.push(`<line x1="${x}" y1="${cy+12}" x2="${blade[0]}" y2="${blade[1]}" stroke="${col}" stroke-width="2"/><circle cx="${x}" cy="${cy+12}" r="1.8" fill="${col}"/>`);
      ctx.out.push(actGlyph(e.a, x-2, cy, col));
      if(e.del) ctx.out.push(`<path d="M${x-26} ${cy-16} L${x+20} ${cy+16} M${x+20} ${cy-16} L${x-26} ${cy+16}" stroke="var(--bad)" stroke-width="1.8"/>`);
      if(broken) ctx.out.push(`<g><circle cx="${x}" cy="${y+8}" r="7" fill="var(--bad-soft)" stroke="var(--bad)"/><path d="M${x-3} ${y+5} l6 6 M${x+3} ${y+5} l-6 6" stroke="var(--bad)" stroke-width="1.6"/></g>`);
      labels(ctx, e, x, cy, col);
    }
    const man = e.a && e.a!=='km' && e.a!=='auto' && !e.del;
    if(man && !ctx.static) ctx.out.push(`<rect x="${x-62}" y="${cy-19}" width="80" height="38" fill="transparent" data-org="${e.o}" data-mom="${e.a==='bp'?1:0}" style="cursor:pointer"><title>${esc2((e.r||'')+' '+(e.t||''))}</title></rect>`);
  }
  if(e.zone && ctx.st.zone===e.zone) ctx.out.push(`<rect x="${x-66}" y="${y+3}" width="${COL-4}" height="${ROW-6}" rx="8" fill="none" stroke="var(--amber)" stroke-width="2" stroke-dasharray="5 3"/>`);
  numLbl(ctx, ndOut!=='N'?ndOut:null, x, y+ROW-6);
  return {pin:pout, nd:ndOut};
}
function drawSeq(ctx, seq, col, y, pin, ndIn, term, endY, endNd){
  const x=LX+col*COL; let nd=ndIn;
  seq.forEach((e,i)=>{
    if(e.par){
      const s=sz(e), last=i===seq.length-1, terminal=term&&last, bot=y+s.h*ROW, ndO=terminal?'N':(last&&endNd)?endNd:newNd(ctx);
      let c=col, xs=[], outs=[];
      e.par.forEach(sub=>{ xs.push(LX+c*COL); const r=drawSeq(ctx, sub, c, y, pin, nd, terminal, terminal?endY:bot, ndO); outs.push(r.pin); c+=sz(sub).w; });
      wire(ctx, x, y, xs[xs.length-1], y, pin, nd);
      ctx.out.push(`<circle cx="${x}" cy="${y}" r="2.6" fill="${wcol(pin)}"/>`);
      const out = outs.includes('L') ? 'L' : outs.includes('N') ? 'N' : null;
      if(!terminal){ wire(ctx, x, bot, xs[xs.length-1], bot, out, ndO); ctx.out.push(`<circle cx="${x}" cy="${bot}" r="2.6" fill="${wcol(out)}"/>`); }
      pin=out; nd=ndO; y=bot;
    } else { const r=drawEl(ctx, e, x, y, pin, nd, (!term && i===seq.length-1 && !isRec(e)) ? endNd : null); pin=r.pin; nd=r.nd; y+=ROW; }
  });
  if(endY>y) wire(ctx, x, y, x, endY, pin, term?'N':(endNd||nd));
  return {pin, y};
}
function seqOf(spec, st){ return typeof spec.c==='function' ? spec.c(st.opt||{}) : spec.c; }
function schemaSVG(spec, st0, opts={}){
  const st = Object.assign({act:{}, coil:{}, opt:{}, rec:new Set()}, st0||{});
  const seq = seqOf(spec, st);
  if(!st0 || !st0.rec) solve(seq, st);
  const s=sz(seq), W=LX+(s.w-1)*COL+70, H=TOPY+s.h*ROW+34, ctx=makeCtx(st, spec); ctx.static=!!opts.static;
  const yN=TOPY+s.h*ROW+12;
  drawSeq(ctx, seq, 0, TOPY, 'L', 'L', true, yN);
  const body=ctx.out.join('');
  const rails = spec.rails || ['L', 'N'];
  const top=`<line x1="8" y1="${TOPY}" x2="${W-8}" y2="${TOPY}" stroke="${C.L}" stroke-width="3"/><text x="8" y="${TOPY-8}" font-size="10" font-weight="700" fill="${C.L}">${esc2(rails[0])}</text>`;
  const bot=`<line x1="8" y1="${yN}" x2="${W-8}" y2="${yN}" stroke="${C.N}" stroke-width="3"/><text x="8" y="${yN+16}" font-size="10" font-weight="700" fill="${C.N}">${esc2(rails[1])}</text>`;
  const nums = spec.num ? `<g data-nd="L" style="cursor:pointer"><rect x="${W-34}" y="${TOPY-17}" width="20" height="14" rx="3" fill="${st.hl==='L'?'var(--amber-soft)':'var(--surface)'}" stroke="var(--line)"/><text x="${W-24}" y="${TOPY-6}" text-anchor="middle" font-size="9.5" font-weight="700">1</text></g><g data-nd="N" style="cursor:pointer"><rect x="${W-34}" y="${yN+3}" width="20" height="14" rx="3" fill="${st.hl==='N'?'var(--amber-soft)':'var(--surface)'}" stroke="var(--line)"/><text x="${W-24}" y="${yN+14}" text-anchor="middle" font-size="9.5" font-weight="700">2</text></g>` : '';
  const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc2(spec.aria||'Schéma de commande')}" style="${W>380&&!opts.fit?`min-width:${Math.round(W*0.78)}px;`:''}max-width:${Math.min(W*1.15, 600)}px;margin:0 auto">${top}${bot}${body}${nums}</svg>`;
  return { svg: W>380&&!opts.fit ? `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch">${svg}</div>` : svg, st, nodes:ctx.ndMap };
}

/* ---------- circuit de puissance piloté par les bobines ---------- */
function puissSVG(P, st){
  const k1=P.km[0], k2=P.km[1], inv=P.mode==='inv', r=P.r||{};
  const on1=!!st.coil[k1], on2=inv&&!!st.coil[k2], tripF=!!st.act[P.f], q=!st.trip;
  const X=[78,108,138], W=inv?300:200, H=338, ph=['L1','L2','L3'];
  const live = y => q;            // en amont des contacteurs : sous tension si Q fermé
  const out=[], col='var(--ink)';
  const ln=(x1,y1,x2,y2,on)=>out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on?C.L:C.off}" stroke-width="${on?3:2}"/>`);
  const pole=(x,y,closed)=>{ out.push(`<line x1="${x}" y1="${y+14}" x2="${closed?x-1:x-11}" y2="${closed?y-14:y-10}" stroke="${col}" stroke-width="2.2"/>`); };
  X.forEach((x,i)=>{ out.push(`<text x="${x}" y="14" text-anchor="middle" font-size="10" font-weight="800" fill="${C.L}">${ph[i]}</text>`); ln(x,20,x,52,true); });
  /* -3Q4C disjoncteur-moteur */
  X.forEach(x=>{ pole(x,66,q); out.push(`<path d="M${x-4} ${52} l8 8 M${x+4} ${52} l-8 8" stroke="${col}" stroke-width="1.4"/>`); });
  out.push(`<line x1="${X[0]-6}" y1="66" x2="${X[2]-6}" y2="66" stroke="${col}" stroke-dasharray="3 2"/><text x="${X[0]-14}" y="70" text-anchor="end" font-size="10.5" font-weight="800" fill="${col}">${esc2(r.Q||'-3Q4C')}</text>`);
  const yA=80, yK=124;
  X.forEach(x=>ln(x,yA,x,yK-14,q));
  /* contacteur(s) */
  X.forEach(x=>pole(x,yK,on1));
  out.push(`<line x1="${X[0]-6}" y1="${yK}" x2="${X[2]-6}" y2="${yK}" stroke="${col}" stroke-dasharray="3 2"/><text x="${X[0]-14}" y="${yK+4}" text-anchor="end" font-size="10.5" font-weight="800" fill="${col}">${esc2(r.K1||'-2KM3H')}</text>`);
  out.push(`<text x="${X[0]+4}" y="${yK-6}" font-size="8" fill="var(--muted)">1</text><text x="${X[0]+4}" y="${yK+14}" font-size="8" fill="var(--muted)">2</text>`);
  const yJ=170;
  X.forEach(x=>ln(x,yK+14,x,yJ,q&&on1));
  if(inv){
    const XB=[196,226,256], ty=[92,98,104];  // L1 → 3e pôle, L2 → 2e, L3 → 1er : deux phases croisées
    [[X[0],XB[2],ty[0]],[X[1],XB[1],ty[1]],[X[2],XB[0],ty[2]]].forEach(([xa,xb,yy])=>{ ln(xa,yy,xb,yy,q); out.push(`<circle cx="${xa}" cy="${yy}" r="2.6" fill="${q?C.L:C.off}"/>`); ln(xb,yy,xb,yK-14,q); });
    XB.forEach(x=>pole(x,yK,on2));
    out.push(`<line x1="${XB[0]-6}" y1="${yK}" x2="${XB[2]-6}" y2="${yK}" stroke="${col}" stroke-dasharray="3 2"/><text x="${XB[1]}" y="${yK-22}" text-anchor="middle" font-size="10.5" font-weight="800" fill="${col}">${esc2(r.K2||'-2KM6H')}</text>`);
    [[XB[0],X[0],yJ-12],[XB[1],X[1],yJ-6],[XB[2],X[2],yJ]].forEach(([xb,xa,yy])=>{ ln(xb,yK+14,xb,yy,q&&on2); ln(xb,yy,xa,yy,q&&on2); out.push(`<circle cx="${xa}" cy="${yy}" r="2.6" fill="${q&&on2?C.L:C.off}"/>`); });
    out.push(`<text x="${(X[2]+XB[0])/2+6}" y="86" text-anchor="middle" font-size="8" fill="var(--bad)">L1 ↔ L3</text>`);
  }
  const run=q&&(on1||on2)&&!(on1&&on2), yF=206;
  X.forEach(x=>ln(x,yJ,x,yF-12,run));
  /* -3F4E relais thermique */
  X.forEach(x=>{ out.push(`<path d="M${x} ${yF-12} v4 h-6 v12 h6 v4" fill="none" stroke="${tripF?'var(--bad)':col}" stroke-width="1.8"/>`); ln(x,yF+8,x,252,run); });
  out.push(`<rect x="${X[0]-12}" y="${yF-10}" width="${X[2]-X[0]+24}" height="20" fill="none" stroke="${tripF?'var(--bad)':col}" stroke-dasharray="3 2"/><text x="${X[0]-16}" y="${yF+4}" text-anchor="end" font-size="10.5" font-weight="800" fill="${tripF?'var(--bad)':col}">${esc2(r.F||'-3F4E')}</text>`);
  /* -3M4H moteur, U1 V1 W1, PE direct */
  const mx=X[1], my=280, turn=run ? (on2?-1:1) : 0;
  out.push(`<circle cx="${mx}" cy="${my}" r="24" fill="var(--surface)" stroke="${col}" stroke-width="2"/><text x="${mx}" y="${my-2}" text-anchor="middle" font-size="12" font-weight="800" fill="${col}">M</text><text x="${mx}" y="${my+12}" text-anchor="middle" font-size="10" fill="${col}">3~</text>`);
  out.push(`<text x="${X[0]}" y="258" text-anchor="middle" font-size="8" fill="var(--muted)">U1</text><text x="${X[1]+9}" y="258" font-size="8" fill="var(--muted)">V1</text><text x="${X[2]}" y="258" text-anchor="middle" font-size="8" fill="var(--muted)">W1</text>`);
  out.push(`<text x="${mx-32}" y="${my+4}" text-anchor="end" font-size="10.5" font-weight="800" fill="${col}">${esc2(r.M||'-3M4H')}</text>`);
  out.push(`<line x1="10" y1="20" x2="10" y2="${my+30}" stroke="#2e9b4e" stroke-width="2" stroke-dasharray="7 3"/><line x1="10" y1="${my+30}" x2="${mx}" y2="${my+30}" stroke="#2e9b4e" stroke-width="2" stroke-dasharray="7 3"/><line x1="${mx}" y1="${my+30}" x2="${mx}" y2="${my+24}" stroke="#2e9b4e" stroke-width="2"/><text x="14" y="30" font-size="9" font-weight="800" fill="#2e9b4e">PE</text>`);
  if(turn) out.push(`<g><path d="M${mx+30} ${my-16} a20 20 0 0 1 0 32" fill="none" stroke="var(--ok)" stroke-width="2.4" marker-end="url(#fl)"/><animateTransform attributeName="transform" type="rotate" from="0 ${mx} ${my}" to="${turn*360} ${mx} ${my}" dur="1.6s" repeatCount="indefinite"/></g>`);
  out.push(`<text x="${W/2}" y="${H-2}" text-anchor="middle" font-size="10" font-weight="700" fill="${st.trip||tripF&&turn?'var(--bad)':turn?'var(--ok)':'var(--muted)'}">${st.trip?'Court-circuit : -3Q4C a déclenché':tripF&&turn?'Surcharge… et le moteur tourne encore !':tripF?'Surcharge : le thermique a fait retomber le contacteur':turn>0?'Moteur : sens droit':turn<0?'Moteur : sens gauche':'Moteur à l’arrêt'}</text>`);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Circuit de puissance" style="max-width:${W+30}px;margin:0 auto"><defs><marker id="fl" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--ok)"/></marker></defs>${out.join('')}</svg>`;
}

/* ---------- table de vérité d'une sortie ---------- */
function truthTable(spec, st){
  const T=spec.table, seq=seqOf(spec, st), rows=[];
  for(let a=0;a<2;a++) for(let b=0;b<2;b++){
    const s={act:Object.assign({}, st.act, {[T.in[0]]:!!a, [T.in[1]]:!!b}), coil:{}, opt:st.opt||{}};
    solve(seq, s); rows.push([a,b,s.rec.has(T.out)?1:0]);
  }
  const cur=[+!!st.act[T.in[0]], +!!st.act[T.in[1]]];
  return `<table class="t tv"><tr><th>${esc2(T.lbl?T.lbl[0]:T.in[0])}</th><th>${esc2(T.lbl?T.lbl[1]:T.in[1])}</th><th>${esc2(T.lbl?T.lbl[2]:T.out)}</th></tr>${rows.map(r=>`<tr class="${r[0]===cur[0]&&r[1]===cur[1]?'cur':''}"><td>${r[0]}</td><td>${r[1]}</td><td><b>${r[2]}</b></td></tr>`).join('')}</table>`;
}

/* ---------- le widget ---------- */
let styled=false;
function injectCSS(){
  if(styled) return; styled=true;
  const s=document.createElement('style');
  s.textContent=`.schw{min-width:0;max-width:100%}.schw .sch-grid{display:grid;gap:10px;align-items:start;grid-template-columns:minmax(0,1fr)}.schw .sch-grid>div{min-width:0}
  .schw .sch-grid.two{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)}
  @media (max-width:640px){.schw .sch-grid.two{grid-template-columns:1fr}}
  .schw .sch-org{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
  .schw .sch-org button{border:1px solid var(--line);background:var(--surface);border-radius:99px;padding:5px 11px;font-size:13px;touch-action:none;user-select:none;-webkit-user-select:none}
  .schw .sch-org button.on{background:var(--amber-soft);border-color:var(--amber);font-weight:700}
  .schw .sch-st{font-size:13px;margin-top:8px;min-height:1.4em}
  .schw .sch-tg{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:13px}
  .schw svg{touch-action:manipulation;user-select:none;-webkit-user-select:none}
  .t.tv{width:auto;margin:0 auto}.t.tv td,.t.tv th{text-align:center;padding:4px 12px}.t.tv tr.cur td{background:var(--amber-soft)}
  .sch-mini svg{max-width:260px!important}`;
  document.head.appendChild(s);
}
const RNAME = {bp:'appuie', au:'enfonce', corde:'tire', fdc:'actionne', th:'fais déclencher', int:'bascule'};
function schemaW(box, spec){
  injectCSS();
  const st = { act:{}, coil:{}, opt:{}, rec:new Set(), hl:null };
  (spec.toggles||[]).forEach(t=>{ if(t.on) st.opt[t.id]=true; });
  Object.assign(st.act, spec.init||{});
  let held=null, timer=null;
  const manual = () => { const m=[], seen=new Set(); walk(seqOf(spec, st), e=>{ if(e.a && e.a!=='km' && e.a!=='auto' && !e.del && !seen.has(e.o)){ seen.add(e.o); m.push(e); } }); if(spec.puiss&&spec.puiss.f&&!seen.has(spec.puiss.f)) m.push({o:spec.puiss.f, a:'th', r:(spec.puiss.r||{}).F||'-3F4E', t:'Surcharge'}); return m; };
  const paint = ()=>{
    const seq=seqOf(spec, st); solve(seq, st);
    if(spec.puiss && spec.puiss.mode==='inv'){ const [a,b]=spec.puiss.km; if(st.coil[a]&&st.coil[b]){ st.trip=true; st.coil={}; solve(seq, st); } }
    const r=schemaSVG(spec, st);
    const side = spec.puiss ? puissSVG(spec.puiss, st) : spec.side ? spec.side(st) : '';
    const tv = spec.table ? truthTable(spec, st) : '';
    const sideHtml = side||tv ? `<div>${side}${tv?`<div style="margin-top:${side?10:0}px">${tv}</div>`:''}</div>` : '';
    box.innerHTML = `<div class="schw"><div class="sch-grid ${sideHtml?'two':''}"><div>${r.svg}</div>${sideHtml}</div>
      <div class="sch-org">${manual().map(e=>`<button type="button" data-org="${e.o}" data-mom="${e.a==='bp'?1:0}" class="${st.act[e.o]?'on':''}">${esc2(e.r||e.o)}${e.t?` · ${esc2(e.t)}`:''}</button>`).join('')}${st.trip?`<button type="button" data-reset class="on">Réarmer ${esc2((spec.puiss.r||{}).Q||'-3Q4C')}</button>`:''}</div>
      ${(spec.toggles||[]).length?`<div class="sch-tg">${spec.toggles.map(t=>`<label><input type="checkbox" data-tg="${t.id}" ${st.opt[t.id]?'checked':''}> ${t.lbl}</label>`).join('')}</div>`:''}
      <div class="sch-st">${spec.status?spec.status(st):defStatus(seq, st)}</div>
      <div class="tiny muted">${spec.hint||'Bouton-poussoir : garde le doigt appuyé (sur le symbole ou sur son nom). Arrêt d’urgence, corde, fin de course, thermique : un clic actionne, un autre clic relâche.'}${spec.num?' Clique sur un fil : tous les fils du même potentiel s’allument.':''}</div></div>`;
    box.querySelectorAll('[data-org]').forEach(el=>{
      const o=el.dataset.org, mom=el.dataset.mom==='1';
      if(mom){
        el.addEventListener('pointerdown', ev=>{ ev.preventDefault(); held=o; st.act[o]=true; paint(); });
        el.addEventListener('click', ev=>{ if(ev.detail===0){ st.act[o]=true; paint(); setTimeout(()=>{ st.act[o]=false; paint(); }, 700); } });
        el.addEventListener('contextmenu', ev=>ev.preventDefault());
      } else el.addEventListener('click', ()=>{ st.act[o]=!st.act[o]; paint(); });
    });
    box.querySelectorAll('[data-tg]').forEach(c=>c.onchange=()=>{ st.opt[c.dataset.tg]=c.checked; st.coil={}; st.trip=false; paint(); });
    box.querySelectorAll('[data-nd]').forEach(el=>el.addEventListener('click', ()=>{ const n=el.dataset.nd; st.hl = st.hl===n ? null : n; paint(); }));
    const rs=box.querySelector('[data-reset]'); if(rs) rs.onclick=()=>{ st.trip=false; st.coil={}; paint(); };
    if(spec.onPaint) spec.onPaint(st, box);
  };
  const release=()=>{ if(held){ st.act[held]=false; held=null; paint(); } };
  document.addEventListener('pointerup', release); document.addEventListener('pointercancel', release);
  if(spec.auto){ let t0=performance.now(); timer=setInterval(()=>{ if(!document.body.contains(box)){ clearInterval(timer); document.removeEventListener('pointerup', release); return; } const t=performance.now(); if(spec.auto(st,(t-t0)/1000)) paint(); t0=t; }, 120); }
  st.repaint=paint;
  paint();
  return st;
}
function defStatus(seq, st){
  const names={}; walk(seq, e=>{ if(isRec(e)) names[e.o]=e; });
  const on=[...st.rec].map(o=>names[o]).filter(Boolean);
  if(!on.length) return '<span class="muted">Aucun récepteur alimenté : c’est le schéma au repos.</span>';
  return on.map(e=>`<b>${esc2(e.r)}</b> ${e.k==='bob'?(e.y?'alimentée':'collé'):'allumé'}`).join(' · ');
}

/* ---------- petits blocs pour le texte ---------- */
const rp = s => `<span style="white-space:nowrap;font-weight:700">${s}</span>`;     // un repère, sans coupure de ligne
const regle = (t, h='La règle') => `<div class="note ok"><b>${h}</b>${t}</div>`;
const piege = (t, h='Le piège') => `<div class="note warn"><b>${h}</b>${t}</div>`;
const erreur = (t, h='L’erreur classique') => `<div class="note bad"><b>${h}</b>${t}</div>`;
const verif = t => `<div class="note"><b>Avant de rendre ta feuille</b>${t}</div>`;
const schbox = (id, cap) => `<div class="figure"><div id="${id}"></div>${cap?`<div class="figcap">${cap}</div>`:''}</div>`;

Object.assign(window, { schemaW, schemaSVG, puissSVG, rp, regle, piege, erreur, verif, schbox, schSize:sz });
})();
