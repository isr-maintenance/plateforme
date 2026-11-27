/* Chapitre 9 — la loi de Mathiessen (scènes locales) */
Object.assign(FIT,{m_intro:600,m_agit:560,m_exp:560,m_signe:540,m_formule:560,m_alpha:530,m_ex:490,m_piege:560,m_recap:600});
const coil=(p,x,y,w,h,col,n)=>{let d=`M${x} ${y}`;const s=w/(n*2);for(let i=0;i<n*2;i++)d+=` L${x+s*(i+0.5)} ${y+(i%2?h/2:-h/2)}`;d+=` L${x+w} ${y}`;el('path',{d,fill:'none',stroke:col,'stroke-width':6,'stroke-linejoin':'round'},p);};
SCL.m_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'La loi de Mathiessen',74,C.ink,{a:'middle',w:800});T(g,640,292,'La résistance change avec la température',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,310,360,200,'métaux : α > 0',C.amberSoft,C.amber,26);chip(g,540,360,240,'carbone : α < 0',C.blueSoft,C.blue,26);chip(g,810,360,170,'t en °C',C.blueSoft,C.blue,26);
  g=grp(A(0,2.2));p.appendChild(g);fbig(g,320,450,640,110,'R'+sub('t')+' = R'+sub('0')+' . (1 + α . t)',C.amber,54,C.amberSoft);
};
SCL.m_agit=(p,A,ph)=>{
  const pan=(g,x,title,amp,col,lab)=>{
    box(g,x,130,560,330,C.panel,C.line,22);T(g,x+280,180,title,32,col,{a:'middle',w:800});
    for(let r=0;r<2;r++)for(let c=0;c<4;c++){const i=r*4+c,a=2*Math.PI*ph+i*1.7;
      el('circle',{cx:x+90+c*127+amp*Math.sin(a),cy:230+r*80+amp*Math.cos(a*1.3),r:26,fill:C.copper,stroke:'#8a4f20','stroke-width':3},g);}
    flow(g,x+30,x+530,395,amp>5?34:50,11,C.amber,ph,true);
    T(g,x+280,440,lab,28,C.ink,{a:'middle',w:700});};
  let g=grp(A(0,0));p.appendChild(g);pan(g,60,'À froid',2,C.blue,'peu de freinage : R faible');
  g=grp(A(0,2));p.appendChild(g);pan(g,660,'À chaud',13,C.red,'beaucoup de freinage : R plus grande');
  g=grp(A(0,4.4));p.appendChild(g);T(g,640,520,'température ↑  →  agitation ↑  →  résistance ↑',38,C.green,{a:'middle',w:800});
};
SCL.m_exp=(p,A)=>{
  const pan=(g,x,title,col,I)=>{box(g,x,130,560,300,C.panel,C.line,22);T(g,x+280,178,title,32,C.ink,{a:'middle',w:800});
    coil(g,x+60,260,440,50,col,6);T(g,x+280,350,'U = 6 V',30,C.blue,{a:'middle',w:700});lcdBox(g,x+170,370,220,I,'A');};
  let g=grp(A(0,0));p.appendChild(g);pan(g,60,'Au départ',C.copper,'6');
  g=grp(A(0,2.6));p.appendChild(g);pan(g,660,'Après 15 minutes',C.red,'5');
  g=grp(A(1,0));p.appendChild(g);
  T(g,340,490,'R = 6 / 6 = 1 Ω',40,C.ink,{a:'middle',w:800});
  g=grp(A(1,2.2));p.appendChild(g);T(g,940,490,'R = 6 / 5 = 1,2 Ω',40,C.amber,{a:'middle',w:800});
  g=grp(A(1,4.6));p.appendChild(g);T(g,640,550,'La résistance du cuivre a augmenté',34,C.green,{a:'middle',w:800});
};
SCL.m_signe=(p,A)=>{
  const gr=(g,x,col,up,title,items)=>{box(g,x,130,560,400,C.panel,C.line,22);
    el('path',{d:`M${x+70} 200 V440 H${x+500}`,fill:'none',stroke:C.muted,'stroke-width':3},g);
    T(g,x+60,200,'R',28,C.muted,{a:'end',w:700});T(g,x+500,478,'t (°C)',26,C.muted,{a:'end',w:600});
    el('path',{d:up?`M${x+90} 410 Q${x+300} 330 ${x+480} 230`:`M${x+90} 230 Q${x+300} 330 ${x+480} 410`,fill:'none',stroke:col,'stroke-width':7,'stroke-linecap':'round'},g);
    T(g,x+280,175,title,30,col,{a:'middle',w:800});T(g,x+280,512,items,22,C.muted,{a:'middle',w:500});};
  let g=grp(A(0,0));p.appendChild(g);gr(g,60,C.amber,true,'Métaux : α positif','cuivre · aluminium · tungstène · argent');
  g=grp(A(1,0));p.appendChild(g);gr(g,660,C.blue,false,'α négatif','carbone · électrolytes · semi-conducteurs');
};
SCL.m_formule=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,230,130,820,150,'R'+sub('t')+' = R'+sub('0')+' . (1 + α . t)',C.amber,80,C.amberSoft);
  const L=[['R'+sub('t'),'résistance à la température t',C.ink],['R'+sub('0'),'résistance à 0 °C',C.ink],['α','coefficient de température',C.amber],['t','variation de température (°C)',C.blue]];
  L.forEach(([a,b,col],i)=>{g=grp(A(1,i*1.3));p.appendChild(g);box(g,200,320+i*58,880,50,C.panel,C.line,12);T(g,290,357+i*58,a,32,col,{a:'middle',w:800});T(g,340,356+i*58,b,28,C.ink,{w:600});});
};
SCL.m_alpha=(p,A)=>{
  const R=[['Cuivre','3,93 . 10'+sup('−3')],['Aluminium','4,3 . 10'+sup('−3')],['Tungstène','6,5 . 10'+sup('−3')],['Argent','3,85 . 10'+sup('−3')],['Manganine','voisin de 0'],['Carbone','−0,4 . 10'+sup('−3')]];
  let g=grp(A(0,0));p.appendChild(g);
  box(g,260,120,760,52,C.blueSoft,C.line,0);T(g,420,155,'Matériau',28,C.blue,{a:'middle',w:700});T(g,780,155,'α',28,C.blue,{a:'middle',w:700});
  R.forEach(([m,a],i)=>{const gg=grp(A(0,0.5+i*0.8));p.appendChild(gg);box(gg,260,172+i*56,760,56,C.panel,C.line,0);T(gg,420,210+i*56,m,30,C.ink,{a:'middle',w:700});T(gg,780,210+i*56,a,30,i==5?C.blue:C.amber,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  el('rect',{x:252,y:168+4*56,width:776,height:64,rx:12,fill:'none',stroke:C.green,'stroke-width':5},g);
  T(g,640,556,'manganine : résistance stable',34,C.green,{a:'middle',w:800});
};
SCL.m_ex=(p,A)=>difs(p,A,0,{enonce:['Bobinage de cuivre : R0 = 200 Ω à 0 °C','Quelle résistance à 50 °C ?'],d:['R0 = 200 Ω','α = 3,93 . 10⁻³','t = 50 °C'],i:'Rt (Ω)',f:'Rt = R0 . (1 + α . t)',fs:26,s:['α . t = 0,1965','Rt = 200 × 1,1965','Rt = 239,3 Ω']});
SCL.m_piege=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,160,130,960,100,C.amberSoft,C.amber,22);T(g,640,195,'Résistance donnée à 20 °C, pas à 0 °C ?',40,C.amber,{a:'middle',w:800});
  g=grp(A(0,2.2));p.appendChild(g);T(g,640,300,'1. Calcule d’abord R0',34,C.ink,{a:'middle',w:700});fbig(g,260,330,760,100,'R'+sub('0')+' = R'+sub('20')+' / (1 + α . 20)',C.blue,46);
  g=grp(A(0,4.4));p.appendChild(g);T(g,640,490,'2. Puis applique la loi de Mathiessen',34,C.ink,{a:'middle',w:700});fbig(g,260,515,760,60,'R'+sub('t')+' = R'+sub('0')+' . (1 + α . t)',C.amber,36,C.amberSoft);
};
SCL.m_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,230,200,820,120,'R'+sub('t')+' = R'+sub('0')+' . (1 + α . t)',C.amber,66,C.amberSoft);
  g=grp(A(0,1.8));p.appendChild(g);
  [['Métal chaud',' R ↑',C.amber],['Carbone chaud',' R ↓',C.blue],['Manganine','R stable',C.green]].forEach(([a,b,col],i)=>{const x=100+i*370;box(g,x,360,340,110,C.panel,col,20);T(g,x+170,408,a,28,C.ink,{a:'middle',w:700});T(g,x+170,451,b,38,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,150,520,980,70,C.green,'none',35);T(g,640,568,'À toi de jouer : tableau, tri et 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
