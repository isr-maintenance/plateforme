/* =========================================================
   SCHÉMAS À COMPLÉTER — « Indique les données et l'inconnue sur le dessin »
   Chaque dessin porte des emplacements numérotés (① ② …) ; l'élève choisit, pour chacun,
   la donnée ou l'inconnue qui va à cet endroit. Les dessins sont vierges : aucune valeur dessus.
   schema(type, p) → { svg, slots:[{id, n}] }   (id : court, unique dans l'exercice)
   mountPlaceW(box, key, { scenes:[{type,p}], tokens:[…], place:{id:indexDuToken} })  — entraînement, corrigé tout de suite
   placeHTML(…) / placeRead(…)                                                        — utilisés par le bilan (sans correction)
   ========================================================= */
const SC_W = 440;
/* un emplacement : pastille numérotée en (x, y), reliée par un pointillé à l'endroit visé (ax, ay) */
function scSlot(n, x, y, ax, ay){
  return `<g class="scslot">${ax!=null?`<line x1="${x}" y1="${y}" x2="${ax}" y2="${ay}" stroke="var(--meca)" stroke-width="1.6" stroke-dasharray="3 3"/>`:''}
    <circle cx="${x}" cy="${y}" r="12" fill="var(--meca)"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${n}</text></g>`;
}
const scLbl = (x, y, t, a='middle') => `<text x="${x}" y="${y}" text-anchor="${a}" font-size="11" fill="var(--muted)">${t}</text>`;
const scRot = (cx, cy, r, rev) => `<path d="M${cx+r*0.7} ${cy-r*0.7} A ${r} ${r} 0 0 ${rev?0:1} ${cx+r*0.7} ${cy+r*0.7}" fill="none" stroke="var(--ok)" stroke-width="2" marker-end="url(#mcar)"/>`;
const scWheel = (cx, cy, r, teeth) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="${teeth?6:3}" ${teeth?'stroke-dasharray="4 3"':''}/><circle cx="${cx}" cy="${cy}" r="4" fill="var(--ink)"/>`;
const scMotor = (x, y) => `<rect x="${x}" y="${y-22}" width="62" height="44" rx="6" fill="var(--meca-soft)" stroke="var(--ink-2)" stroke-width="2"/><text x="${x+31}" y="${y+4}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink-2)">M</text>`;

/* chaque dessin renvoie le SVG (sans pastilles) et ses emplacements : {id, x, y, ax, ay} */
const SCENES = {
  /* deux roues de friction : menante à gauche, menée à droite (grande = la plus lente) */
  friction(p){
    const r1=p.r1||38, r2=p.r2||66, c1=[150,112], c2=[150+r1+r2,112];
    return { h:230, svg:`${scWheel(c1[0],c1[1],r1)}${scWheel(c2[0],c2[1],r2)}${scRot(c1[0],c1[1],r1+10,false)}${scRot(c2[0],c2[1],r2+10,true)}
      ${scLbl(c1[0],c1[1]+r1+30,'roue menante')}${scLbl(c2[0],c2[1]+r2+24,'roue menée')}`,
      slots:[{id:'d',x:50,y:52,ax:c1[0]-r1*0.7,ay:c1[1]-r1*0.7},{id:'n',x:50,y:178,ax:c1[0],ay:c1[1]},{id:'dp',x:410,y:40,ax:c2[0]+r2*0.7,ay:c2[1]-r2*0.7},{id:'np',x:410,y:196,ax:c2[0],ay:c2[1]},{id:'gl',x:c1[0]+r1,y:28,ax:c1[0]+r1,ay:c1[1]}] };
  },
  /* deux poulies et une courroie ; p.motor : la poulie menante est sur un moteur */
  belt(p){
    const r1=p.r1||34, r2=p.r2||62, c1=[p.motor?150:110,118], c2=[340,118];
    return { h:236, svg:`${p.motor?`${scMotor(28,c1[1])}<line x1="90" y1="${c1[1]}" x2="${c1[0]}" y2="${c1[1]}" stroke="var(--ink-2)" stroke-width="5"/>${scLbl(59,c1[1]+40,'moteur')}`:''}
      <line x1="${c1[0]}" y1="${c1[1]-r1}" x2="${c2[0]}" y2="${c2[1]-r2}" stroke="var(--ink-2)" stroke-width="4"/><line x1="${c1[0]}" y1="${c1[1]+r1}" x2="${c2[0]}" y2="${c2[1]+r2}" stroke="var(--ink-2)" stroke-width="4"/>
      ${scWheel(c1[0],c1[1],r1)}${scWheel(c2[0],c2[1],r2)}${scLbl(c1[0],c1[1]+r1+20,'poulie menante')}${scLbl(c2[0],c2[1]+r2+16,'poulie menée')}`,
      slots:[{id:'d',x:c1[0]-20,y:26,ax:c1[0],ay:c1[1]-r1},{id:'n',x:c1[0]+28,y:212,ax:c1[0],ay:c1[1]},{id:'gl',x:240,y:40,ax:240,ay:(c1[1]-r1+c2[1]-r2)/2},{id:'dp',x:c2[0]+70,y:40,ax:c2[0]+r2*0.7,ay:c2[1]-r2*0.7},{id:'np',x:c2[0]+70,y:212,ax:c2[0],ay:c2[1]}] };
  },
  /* cônes de poulies à trois étages : menant en haut (D1 < D2 < D3), mené en bas (D’1 > D’2 > D’3) */
  cone(){
    const xs=[150,230,310], hTop=[36,64,92], hBot=[86,58,30], yT=100, yB=230;
    const step=(x,h,y)=>`<rect x="${x-34}" y="${y-h/2}" width="68" height="${h}" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2.5"/>`;
    const sl=[]; xs.forEach((x,i)=>{ sl.push({id:'d'+(i+1),x:x,y:yT-hTop[i]/2-22,ax:x,ay:yT-hTop[i]/2}); });
    sl.push({id:'n',x:420,y:yT,ax:378,ay:yT});
    xs.forEach((x,i)=>{ sl.push({id:'e'+(i+1),x:x-14,y:yB+hBot[i]/2+22,ax:x-14,ay:yB+hBot[i]/2}); sl.push({id:'m'+(i+1),x:x+16,y:yB+hBot[i]/2+50,ax:x+16,ay:yB+hBot[i]/2}); });
    sl.push({id:'gl',x:56,y:(yT+yB)/2,ax:150-30,ay:(yT+yB)/2});
    return { h:360, svg:`<line x1="90" y1="${yT}" x2="378" y2="${yT}" stroke="var(--ink-2)" stroke-width="5"/><line x1="90" y1="${yB}" x2="378" y2="${yB}" stroke="var(--ink-2)" stroke-width="5"/>
      ${xs.map((x,i)=>step(x,hTop[i],yT)).join('')}${xs.map((x,i)=>step(x,hBot[i],yB)).join('')}
      <line x1="${xs[0]-28}" y1="${yT+hTop[0]/2}" x2="${xs[0]-28}" y2="${yB-hBot[0]/2}" stroke="var(--meca)" stroke-width="4"/><line x1="${xs[0]+28}" y1="${yT+hTop[0]/2}" x2="${xs[0]+28}" y2="${yB-hBot[0]/2}" stroke="var(--meca)" stroke-width="4"/>
      ${scLbl(86,yT+4,'menant','end')}${scLbl(86,yB+4,'mené','end')}${scLbl(xs[0]+40,(yT+yB)/2,'courroie','start')}`, slots:sl };
  },
  /* pignon et roue reliés par une chaîne */
  chain(p){
    const r1=p.r1||30, r2=p.r2||52, c1=[120,112], c2=[330,112];
    return { h:220, svg:`<line x1="${c1[0]}" y1="${c1[1]-r1}" x2="${c2[0]}" y2="${c2[1]-r2}" stroke="var(--ink-2)" stroke-width="5" stroke-dasharray="7 3"/><line x1="${c1[0]}" y1="${c1[1]+r1}" x2="${c2[0]}" y2="${c2[1]+r2}" stroke="var(--ink-2)" stroke-width="5" stroke-dasharray="7 3"/>
      ${scWheel(c1[0],c1[1],r1,true)}${scWheel(c2[0],c2[1],r2,true)}${scLbl(c1[0],c1[1]+r1+22,'pignon')}${scLbl(c2[0],c2[1]+r2+18,'roue dentée')}${scLbl(225,c1[1]-r1-18,'chaîne')}`,
      slots:[{id:'z',x:44,y:44,ax:c1[0]-r1*0.7,ay:c1[1]-r1*0.7},{id:'n',x:44,y:180,ax:c1[0],ay:c1[1]},{id:'zp',x:412,y:36,ax:c2[0]+r2*0.7,ay:c2[1]-r2*0.7},{id:'np',x:412,y:196,ax:c2[0],ay:c2[1]}] };
  },
  /* deux roues dentées qui engrènent */
  gears(p){
    const r1=p.r1||34, r2=p.r2||60, c1=[170,112], c2=[170+r1+r2+4,112];
    return { h:220, svg:`${scWheel(c1[0],c1[1],r1,true)}${scWheel(c2[0],c2[1],r2,true)}${scRot(c1[0],c1[1],r1+10,false)}${scRot(c2[0],c2[1],r2+10,true)}${scLbl(c1[0],c1[1]+r1+30,'pignon')}${scLbl(c2[0],c2[1]+r2+24,'roue dentée')}`,
      slots:[{id:'z',x:60,y:48,ax:c1[0]-r1*0.7,ay:c1[1]-r1*0.7},{id:'n',x:60,y:178,ax:c1[0],ay:c1[1]},{id:'zp',x:412,y:40,ax:c2[0]+r2*0.7,ay:c2[1]-r2*0.7},{id:'np',x:412,y:196,ax:c2[0],ay:c2[1]}] };
  },
  /* un moteur, un pignon sur son arbre, une roue dentée */
  motorgear(p){
    const r1=p.r1||28, r2=p.r2||64, c1=[190,112], c2=[190+r1+r2+4,112];
    return { h:220, svg:`${scMotor(40,c1[1])}<line x1="102" y1="${c1[1]}" x2="${c1[0]}" y2="${c1[1]}" stroke="var(--ink-2)" stroke-width="5"/>${scLbl(71,c1[1]+40,'arbre moteur')}
      ${scWheel(c1[0],c1[1],r1,true)}${scWheel(c2[0],c2[1],r2,true)}${scLbl(c1[0],c1[1]+r1+22,'pignon')}${scLbl(c2[0],c2[1]+r2+18,'roue dentée')}`,
      slots:[{id:'n',x:71,y:44,ax:71,ay:c1[1]-22},{id:'z',x:c1[0],y:30,ax:c1[0],ay:c1[1]-r1},{id:'zp',x:412,y:40,ax:c2[0]+r2*0.7,ay:c2[1]-r2*0.7},{id:'np',x:412,y:196,ax:c2[0],ay:c2[1]}] };
  },
  /* une vis sans fin qui entraîne une roue ; p.roller : la roue entraîne un rouleau, p.motor : la vis est sur un moteur */
  worm(p){
    const cw=[230,70], cr=[230,160], r=62;
    const helix=[0,1,2,3,4,5,6].map(i=>`<line x1="${170+i*18}" y1="${cw[1]-16}" x2="${180+i*18}" y2="${cw[1]+16}" stroke="var(--ink-2)" stroke-width="2"/>`).join('');
    const sl=[];
    if(p.motor) sl.push({id:'n',x:52,y:28,ax:52,ay:cw[1]-22});
    sl.push({id:'z',x:p.motor?160:120,y:24,ax:180,ay:cw[1]-16});
    if(!p.motor) sl.push({id:'n',x:350,y:28,ax:296,ay:cw[1]});
    sl.push({id:'zp',x:110,y:200,ax:cr[0]-r*0.75,ay:cr[1]+r*0.5});
    sl.push(p.roller?{id:'np',x:420,y:200,ax:400,ay:cr[1]}:{id:'np',x:350,y:226,ax:cr[0],ay:cr[1]});
    return { h:250, svg:`${p.motor?`${scMotor(20,cw[1])}<line x1="82" y1="${cw[1]}" x2="160" y2="${cw[1]}" stroke="var(--ink-2)" stroke-width="5"/>${scLbl(51,cw[1]+40,'moteur')}`:`<line x1="120" y1="${cw[1]}" x2="160" y2="${cw[1]}" stroke="var(--ink-2)" stroke-width="5"/>`}
      <rect x="160" y="${cw[1]-16}" width="136" height="32" rx="10" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2.5"/>${helix}<line x1="296" y1="${cw[1]}" x2="330" y2="${cw[1]}" stroke="var(--ink-2)" stroke-width="5"/>
      ${scWheel(cr[0],cr[1],r,true)}${scLbl(cw[0],cw[1]-24,'vis sans fin')}${scLbl(cr[0]-r-8,cr[1]+r+6,'roue','end')}
      ${p.roller?`<line x1="${cr[0]}" y1="${cr[1]}" x2="362" y2="${cr[1]}" stroke="var(--ink-2)" stroke-width="5"/><rect x="362" y="${cr[1]-30}" width="56" height="60" rx="8" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2.5"/>${scLbl(390,cr[1]+46,'rouleau')}`:''}`, slots:sl };
  },
  /* un levier, l'appui à gauche ; p.kind : 'ir' (la charge entre l'appui et la force) ou 'im' (la force entre l'appui et la charge) */
  lever(p){
    const x0=60, x1=400, xm=x0+(x1-x0)*(p.k||0.25), y=120, ir=p.kind!=='im';
    const xq=ir?xm:x1, xf=ir?x1:xm;
    return { h:272, svg:`<rect x="${x0-6}" y="${y-6}" width="${x1-x0+12}" height="12" rx="4" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/>${mcPivot(x0,y+6)}
      ${mcArrow(xq,y-74,xq,y-10,'var(--bad)')}${ir?mcArrow(xf,y+74,xf,y+10,'var(--ok)'):mcArrow(xf,y+74,xf,y+10,'var(--ok)')}
      <line x1="${x0}" y1="${y+100}" x2="${xm}" y2="${y+100}" stroke="var(--muted)" stroke-width="1.5"/><line x1="${xm}" y1="${y+100}" x2="${x1}" y2="${y+100}" stroke="var(--muted)" stroke-width="1.5"/>
      ${[x0,xm,x1].map(x=>`<line x1="${x}" y1="${y+92}" x2="${x}" y2="${y+108}" stroke="var(--muted)" stroke-width="1.5"/>`).join('')}${scLbl(x0,y+50,'appui')}`,
      slots:[{id:'q',x:xq+(ir?-34:-30),y:y-80,ax:xq,ay:y-60},{id:'f',x:xf+(ir?-34:30),y:y+80,ax:xf,ay:y+60},{id:'a',x:(x0+xm)/2,y:y+124,ax:(x0+xm)/2,ay:y+100},{id:'b',x:(xm+x1)/2,y:y+124,ax:(xm+x1)/2,ay:y+100}] };
  },
  /* un plan incliné (rampe d'un plateau) avec un véhicule tiré par un câble */
  ramp(){
    const A=[40,200], B=[360,200], C=[360,90];
    const ang=Math.atan2(B[1]-C[1],B[0]-A[0]), mx=A[0]+(C[0]-A[0])*0.5, my=A[1]+(C[1]-A[1])*0.5;
    const car=`<g transform="translate(${mx} ${my}) rotate(${-ang*180/Math.PI})"><rect x="-34" y="-30" width="68" height="24" rx="6" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="2"/><circle cx="-20" cy="-4" r="6" fill="var(--ink-2)"/><circle cx="20" cy="-4" r="6" fill="var(--ink-2)"/></g>`;
    return { h:250, svg:`<path d="M${A[0]} ${A[1]} L${B[0]} ${B[1]} L${C[0]} ${C[1]} Z" fill="var(--meca-soft)" stroke="var(--ink-2)" stroke-width="2.5"/>${car}
      ${mcArrow(mx,my-18,mx,my+48,'var(--bad)')}${mcArrow(mx+34*Math.cos(ang),my-18-34*Math.sin(ang),mx+96*Math.cos(ang),my-18-96*Math.sin(ang),'var(--ok)')}
      <path d="M${A[0]+46} ${A[1]} A 46 46 0 0 0 ${A[0]+46*Math.cos(ang)} ${A[1]-46*Math.sin(ang)}" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>${scLbl(B[0]+8,B[1]+16,'plateau','end')}`,
      slots:[{id:'q',x:mx-44,y:my+70,ax:mx,ay:my+40},{id:'f',x:mx+120*Math.cos(ang),y:my-50-120*Math.sin(ang),ax:mx+90*Math.cos(ang),ay:my-18-90*Math.sin(ang)},{id:'l',x:A[0]+(C[0]-A[0])*0.25-12,y:A[1]+(C[1]-A[1])*0.25-34,ax:A[0]+(C[0]-A[0])*0.25,ay:A[1]+(C[1]-A[1])*0.25},{id:'h',x:410,y:150,ax:C[0],ay:150},{id:'al',x:120,y:228,ax:A[0]+52,ay:A[1]-8}] };
  },
  /* un treuil simple (tambour + manivelle) qui tire sur une poulie mobile */
  winch(){
    const c=[120,110], r=30, crank=[c[0]+70,c[1]-40], T=30;
    return { h:316, svg:`<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="var(--surface)" stroke="var(--ink-2)" stroke-width="3"/><circle cx="${c[0]}" cy="${c[1]}" r="4" fill="var(--ink)"/>
      <line x1="${c[0]}" y1="${c[1]}" x2="${crank[0]}" y2="${crank[1]}" stroke="var(--ink-2)" stroke-width="5"/><rect x="${crank[0]-4}" y="${crank[1]-16}" width="8" height="22" rx="3" fill="var(--ink-2)"/>
      ${mcArrow(crank[0]+40,crank[1]-14,crank[0]+6,crank[1]+6,'var(--ok)')}
      <line x1="${c[0]+r}" y1="${c[1]}" x2="${c[0]+r}" y2="${200+T}" stroke="var(--ink-2)" stroke-width="2.5"/><line x1="${c[0]+r+60}" y1="${200+T}" x2="${c[0]+r+60}" y2="${20+T}" stroke="var(--ink-2)" stroke-width="2.5"/>
      <line x1="${c[0]+r+40}" y1="${20+T}" x2="${c[0]+r+80}" y2="${20+T}" stroke="var(--ink-2)" stroke-width="5"/>
      <path d="M${c[0]+r} ${200+T} A 30 30 0 0 0 ${c[0]+r+60} ${200+T}" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/><circle cx="${c[0]+r+30}" cy="${200+T}" r="30" fill="none" stroke="var(--ink-2)" stroke-width="3"/><circle cx="${c[0]+r+30}" cy="${200+T}" r="4" fill="var(--ink)"/>
      ${mcArrow(c[0]+r+30,230+T,c[0]+r+30,266+T,'var(--bad)')}${scLbl(c[0],c[1]+r+18,'tambour')}${scLbl(c[0]+r+100,204+T,'poulie mobile','start')}`,
      slots:[{id:'d',x:40,y:40,ax:c[0]-r*0.7,ay:c[1]-r*0.7},{id:'lm',x:crank[0]-6,y:crank[1]-34,ax:(c[0]+crank[0])/2,ay:(c[1]+crank[1])/2},{id:'fm',x:crank[0]+70,y:crank[1]-10,ax:crank[0]+40,ay:crank[1]-14},{id:'qc',x:c[0]+r+100,y:256+T,ax:c[0]+r+30,ay:250+T}] };
  },
};
/* dessine une ou plusieurs scènes ; numérote les emplacements dans l'ordre */
function schemaHTML(scenes){
  let k=0; const ids=[];
  const svgs=(scenes||[]).map(sc=>{ const S=(SCENES[sc.type]||(()=>({h:60,svg:'',slots:[]})))(sc.p||{});
    const sl=S.slots.map(s=>{ k++; ids.push({id:s.id, n:k}); return scSlot(k, s.x, s.y, s.ax, s.ay); }).join('');
    return `<div class="sch"><svg viewBox="0 0 ${SC_W} ${S.h}" role="img" aria-label="Schéma à compléter">${MC_ARROW}${S.svg}${sl}</svg></div>`; }).join('');
  return { html:`<div class="schs">${svgs}</div>`, ids };
}
/* les listes de choix : une par emplacement, avec les données et inconnues mélangées pour chaque élève */
function placeSelects(key, ids, tokens, val, opts){
  const ord=melange(key+'|tok', tokens.length);
  return `<div class="plgrid">${ids.map(({id,n})=>{ const v=val[id]; const st=opts.check?(v===opts.place[id]?'good':'wrong'):'';
    return `<label class="plrow ${st}"><span class="pln">${n}</span><select data-pl="${id}" ${opts.ro?'disabled':''}><option value="">— choisis —</option>${ord.map(i=>`<option value="${i}" ${v===i?'selected':''}>${esc(tokens[i])}</option>`).join('')}</select>${opts.ro&&opts.show&&v!==opts.place[id]?`<span class="tiny" style="color:var(--ok)">→ ${esc(tokens[opts.place[id]])}</span>`:''}</label>`; }).join('')}</div>`;
}
/* exercice d'entraînement : placer les données, corrigé tout de suite (la clé key va dans ex.keys) */
function mountPlaceW(box, key, cfg){
  if(!box) return;
  box._w={key,cfg};
  const dr=DR(), val = dr[key] || (dr[key]={});
  const st = WS[key] || (WS[key]={ checked:false });
  const draw=()=>{
    const done=!!P().ex[key], S=schemaHTML(cfg.scenes);
    const all=S.ids.every(({id})=>val[id]!=null);
    box.innerHTML=`${cfg.intro?`<p class="small" style="margin-top:0">${cfg.intro}</p>`:''}${S.html}
      <p class="small" style="margin:6px 0">Pour chaque numéro du dessin, choisis la donnée ou l’inconnue qui va à cet endroit.</p>
      ${placeSelects(key, S.ids, cfg.tokens, done?cfg.place:val, {place:cfg.place, check:done||st.checked, ro:done})}
      ${done?`<div class="fb good" style="margin-top:10px"><b>Le dessin est complet.</b> ${cfg.ok||''}</div>`
        :`<div class="row" style="margin-top:10px"><button class="btn sm primary" data-plck ${all?'':'disabled'}>Vérifier</button><span class="small" data-plfb></span></div>`}`;
    if(done) return;
    box.querySelectorAll('[data-pl]').forEach(s=>s.onchange=()=>{ if(s.value==='') delete val[s.dataset.pl]; else val[s.dataset.pl]=+s.value; st.checked=false; save(); draw(); });
    const b=box.querySelector('[data-plck]'); if(b) b.onclick=()=>{
      const bad=S.ids.filter(({id})=>val[id]!==cfg.place[id]).map(x=>x.n);
      if(!bad.length){ exSet(key); draw(); return; }
      st.checked=true; draw(); box.querySelector('[data-plfb]').innerHTML=`<span style="color:var(--bad)">${bad.length} emplacement${bad.length>1?'s':''} à revoir (n° ${bad.join(', ')}).</span> ${cfg.hint||'Relis l’énoncé : qui est la roue menante, qui est la menée ?'}`; };
  };
  draw();
}
