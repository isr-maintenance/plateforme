/* Chapitre 19 — couplage des générateurs */
Object.assign(FIT,{cg_intro:600,cg_reel:560,cg_terrain:540,cg_serie:560,cg_serie2:540,cg_para:560,cg_diff:560,cg_comp:540,cg_recap:600});
const cell=(g,x,y,t,col)=>{el('line',{x1:x,y1:y-30,x2:x,y2:y+30,stroke:C.ink,'stroke-width':4},g);el('line',{x1:x+20,y1:y-18,x2:x+20,y2:y+18,stroke:C.ink,'stroke-width':9},g);if(t)T(g,x+10,y+62,t,24,col||C.amber,{a:'middle',w:800});};
SCL.cg_intro=(p,A)=>introS(p,A,'Couplage des générateurs','Piles en série et en parallèle',[['en série',150,C.blueSoft,C.blue],['en parallèle',190,C.amberSoft,C.amber],['résistance interne',250,C.blueSoft,C.green]],null);
SCL.cg_reel=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M300 230 H640 M780 230 H1000 V470 H300 V290',fill:'none',stroke:C.ink,'stroke-width':4},g);cell(g,290,260,'',C.red);T(g,245,268,'E',30,C.red,{a:'middle',w:800});rbox(g,430,200,200,60,'r',C.amber);rbox(g,900,300,200,100,'R',C.blue);
  T(g,640,150,'générateur réel : E et r',30,C.ink,{a:'middle',w:800});el('rect',{x:240,y:170,width:420,height:120,fill:'none',stroke:C.muted,'stroke-width':2,'stroke-dasharray':'8 6',rx:14},g);
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,550,'I = E / (R + r)',52,C.green,{a:'middle',w:800});
};
SCL.cg_terrain=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,160,170,960,340,C.panel,C.amber,24);T(g,640,240,'Sur le terrain',30,C.amber,{a:'middle',w:800});
  T(g,640,330,'à vide : 12 V au voltmètre',38,C.ink,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,410,'au démarrage : la tension s’effondre',38,C.red,{a:'middle',w:700});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,480,'r a augmenté',34,C.green,{a:'middle',w:800});
};
SCL.cg_serie=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M110 300 H200 M240 300 H400 M440 300 H600 M640 300 H740',fill:'none',stroke:C.ink,'stroke-width':4},g);
  [[200,'1,5 V'],[400,'1,5 V'],[600,'1,5 V']].forEach(([x,t])=>cell(g,x,300,t,C.amber));T(g,160,250,'−',32,C.blue,{a:'middle',w:800});T(g,700,250,'+',32,C.red,{a:'middle',w:800});
  g=grp(A(0,1.8));p.appendChild(g);[['1 pile','1,5 V'],['2 piles','3 V'],['3 piles','4,5 V']].forEach(([a,b],i)=>{const x=260+i*300;box(g,x-120,420,240,110,C.panel,C.line,16);T(g,x,462,a,24,C.muted,{a:'middle',w:600});T(g,x,508,b,44,C.green,{a:'middle',w:800});});
  T(g,880,330,'n . E',64,C.green,{w:800});
};
SCL.cg_serie2=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,220,'les résistances internes s’additionnent aussi',32,C.ink,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,320,'I = n . E / (R + n . r)',66,C.green,{a:'middle',w:800});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,430,'50 mA · 98 mA · 135 mA',40,C.amber,{a:'middle',w:800});T(g,640,480,'avec 1, 2 puis 3 piles',26,C.muted,{a:'middle',w:600});
};
SCL.cg_para=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M200 190 H700 M200 300 H700 M200 410 H700 M200 190 V410 M700 190 V410 M700 300 H800',fill:'none',stroke:C.ink,'stroke-width':4},g);
  [190,300,410].forEach(y=>{el('rect',{x:410,y:y-34,width:80,height:68,fill:'#0f131a'},g);cell(g,430,y,'',C.amber);});T(g,160,300,'+',32,C.red,{a:'middle',w:800});
  box(g,860,240,260,120,C.panel,C.green,20);T(g,990,300,'1,5 V',50,C.green,{a:'middle',w:800});T(g,990,342,'comme une seule pile',22,C.muted,{a:'middle',w:600});
  g=grp(A(1,0));p.appendChild(g);T(g,640,520,'I = E / (R + r / n)',46,C.green,{a:'middle',w:800});T(g,640,562,'50 mA · 50,4 mA · 50,5 mA',26,C.amber,{a:'middle',w:700});
};
SCL.cg_diff=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M300 230 H980 M300 380 H980 M300 230 V380 M980 230 V380',fill:'none',stroke:C.ink,'stroke-width':4},g);
  [[230,'4,5 V',C.red],[380,'1,5 V',C.amber]].forEach(([y,t,col])=>{el('rect',{x:600,y:y-34,width:80,height:68,fill:'#0f131a'},g);cell(g,620,y,'',col);T(g,720,y-14,t,34,col,{w:800});});
  g=grp(A(0,1.8));p.appendChild(g);arrow(g,820,255,820,355,C.red,6);T(g,870,320,'courant',24,C.red,{w:700});
  g=grp(A(0,3.6));p.appendChild(g);box(g,160,470,960,90,'#3a1512',C.red,20);T(g,640,527,'même f.é.m. obligatoire',38,C.red,{a:'middle',w:800});
};
SCL.cg_comp=(p,A)=>{
  [['Série','les f.é.m. s’additionnent','les r s’additionnent','plus de tension',C.blue],['Parallèle','tension d’un seul élément','r divisée par n','s’essouffle moins',C.amber]].forEach(([a,b,c,d,col],i)=>{const g=grp(A(0,i*2.2));p.appendChild(g);const x=60+i*600;box(g,x,150,560,370,C.panel,col,22);T(g,x+280,230,a,46,col,{a:'middle',w:800});[b,c,d].forEach((t,j)=>T(g,x+280,320+j*60,t,28,C.ink,{a:'middle',w:600}));});
};
SCL.cg_recap=(p,A)=>recapS(p,A,[['I = E / (R + r)|générateur réel',C.blue],['série : n . E|r : n . r',C.amber],['parallèle : E|r / n|même f.é.m.',C.green]],'À toi de jouer : tensions à vide, série ou parallèle');
