/* Chapitre 10 — la puissance électrique (scènes locales) */
Object.assign(FIT,{q_intro:600,q_mes:550,q_lampes:490,q_formule:600,q_comp:500,q_kw:520,q_ex:565,q_ex2:565,q_recap:600});
const lampe=(p,cx,cy,r,on)=>{if(on)el('circle',{cx,cy,r:r*1.5,fill:'#f5b82e',opacity:0.18},p);el('circle',{cx,cy,r,fill:on?'#3a2f12':C.panel,stroke:C.amber,'stroke-width':5},p);el('path',{d:`M${cx-r*0.6} ${cy-r*0.6} L${cx+r*0.6} ${cy+r*0.6} M${cx+r*0.6} ${cy-r*0.6} L${cx-r*0.6} ${cy+r*0.6}`,stroke:C.amber,'stroke-width':4},p);};
SCL.q_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'La puissance électrique',74,C.ink,{a:'middle',w:800});T(g,640,292,'Tension · courant · watt',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,300,360,200,'U en volts',C.blueSoft,C.blue,28);chip(g,530,360,230,'I en ampères',C.blueSoft,C.blue,28);chip(g,790,360,230,'P en watts',C.amberSoft,C.amber,28);
  g=grp(A(0,2.2));p.appendChild(g);fbig(g,380,460,520,120,'P = U . I',C.amber,64,C.amberSoft);
};
SCL.q_mes=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M300 200 H980 V420 H300 Z',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linejoin':'round'},g);
  box(g,230,260,140,100,C.panel,C.ink,14);T(g,300,318,'230 V',34,C.blue,{a:'middle',w:800});
  lampe(g,980,310,44,true);T(g,925,318,'récepteur',24,C.muted,{a:'end',w:600});
  g=grp(A(0,1.4));p.appendChild(g);
  el('circle',{cx:640,cy:200,r:44,fill:C.panel,stroke:C.green,'stroke-width':5},g);T(g,640,214,'A',40,C.green,{a:'middle',w:800});T(g,640,150,'ampèremètre en série',24,C.green,{a:'middle',w:700});
  g=grp(A(0,3));p.appendChild(g);
  el('path',{d:'M980 200 H1150 V266 M1150 354 V420 H980',fill:'none',stroke:C.ink,'stroke-width':5},g);
  el('circle',{cx:1150,cy:310,r:44,fill:C.panel,stroke:C.blue,'stroke-width':5},g);T(g,1150,324,'V',40,C.blue,{a:'middle',w:800});T(g,1240,455,'voltmètre en parallèle',24,C.blue,{a:'end',w:700});
  g=grp(A(1,0));p.appendChild(g);
  lcdBox(g,260,480,200,'230','V');T(g,490,528,'×',44,C.ink,{a:'middle',w:800});lcdBox(g,520,480,220,'0,261','A');
  g=grp(A(1,1.6));p.appendChild(g);T(g,790,528,'≈',44,C.ink,{a:'middle',w:800});lcdBox(g,830,480,200,'60','W');
};
SCL.q_lampes=(p,A)=>{
  [[0.109,'0,109','25'],[0.261,'0,261','60'],[0.435,'0,435','100']].forEach(([i,I,P],k)=>{const x=100+k*370,g=grp(A(0,k*1.9));p.appendChild(g);
    box(g,x,150,340,340,C.panel,C.line,22);lampe(g,x+170,235,48,true);T(g,x+170,330,'U = 230 V',30,C.blue,{a:'middle',w:700});T(g,x+170,372,'I = '+I+' A',30,C.ink,{a:'middle',w:700});
    T(g,x+170,445,'P ≈ '+P+' W',48,C.amber,{a:'middle',w:800});});
};
SCL.q_formule=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,300,130,680,140,'P = U . I',C.amber,86,C.amberSoft);
  g=grp(A(0,1.4));p.appendChild(g);T(g,640,330,'watt (W) = volt (V) × ampère (A)',36,C.muted,{a:'middle',w:600});
  g=grp(A(1,0));p.appendChild(g);
  box(g,60,380,1160,200,C.panel,C.line,22);tri(g,260,400,160,'P','U','I');
  T(g,560,470,'U = P / I',50,C.ink,{w:800});T(g,560,550,'I = P / U',50,C.blue,{w:800});
};
SCL.q_comp=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,150,'Même tension : 230 V',44,C.ink,{a:'middle',w:800});
  box(g,100,200,1080,110,C.panel,C.line,18);T(g,150,268,'25 W',40,C.amber,{w:800});box(g,330,235,120,40,C.blue,'none',20);T(g,480,268,'I = 0,109 A',34,C.blue,{w:800});
  g=grp(A(0,2.2));p.appendChild(g);
  box(g,100,330,1080,110,C.panel,C.line,18);T(g,150,398,'100 W',40,C.amber,{w:800});box(g,330,365,478,40,C.blue,'none',20);T(g,838,398,'I = 0,435 A',34,C.blue,{w:800});
  g=grp(A(0,4.4));p.appendChild(g);T(g,640,500,'4 × plus de puissance  →  4 × plus de courant',40,C.green,{a:'middle',w:800});
};
SCL.q_kw=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'Les multiples',54,C.ink,{a:'middle',w:800});box(g,190,220,900,130,C.blueSoft,C.blue,22);T(g,640,305,'1 kW = 1 000 W',76,C.blue,{a:'middle',w:800});
  g=grp(A(0,2.2));p.appendChild(g);box(g,190,390,900,110,C.amberSoft,C.amber,22);T(g,640,462,'7,36 kW = 7 360 W',60,C.amber,{a:'middle',w:800});
};
SCL.q_ex=(p,A)=>difs(p,A,0,{enonce:['Four électrique : P = 2,3 kW sous 230 V','Quel courant absorbe-t-il ?'],d:['P = 2,3 kW = 2 300 W','U = 230 V'],i:'I (A)',f:'I = P / U',s:['I = 2 300 / 230','I = 10 A']});
SCL.q_ex2=(p,A)=>difs(p,A,0,{one:true,enonce:['Bouilloire : I = 9 A sous U = 230 V','Quelle puissance ?'],d:['U = 230 V','I = 9 A'],i:'P (W)',f:'P = U . I',s:['P = 230 × 9','P = 2 070 W'],sAt:1.6});
SCL.q_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,330,200,620,120,'P = U . I',C.amber,72,C.amberSoft);
  g=grp(A(0,1.8));p.appendChild(g);
  [['P = U . I',C.amber],['U = P / I',C.blue],['I = P / U',C.green]].forEach(([t,col],i)=>{const x=100+i*370;box(g,x,360,340,110,C.panel,col,20);T(g,x+170,432,t,44,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,200,520,880,70,C.green,'none',35);T(g,640,568,'À toi de jouer : mesures + 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
