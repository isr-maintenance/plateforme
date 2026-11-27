/* Chapitre 8 — la loi d'Ohm (scènes locales) */
Object.assign(FIT,{o_intro:600,o_circuit:560,o_tab:600,o_9v:560,o_loi:600,o_def:560,o_inv:560,o_ex:565,o_ex2:565,o_recap:600});
SCL.o_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'La loi d’Ohm',74,C.ink,{a:'middle',w:800});T(g,640,292,'Tension · résistance · courant',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,300,360,200,'U en volts',C.blueSoft,C.blue,28);chip(g,530,360,230,'R en ohms',C.amberSoft,C.amber,28);chip(g,790,360,230,'I en ampères',C.blueSoft,C.blue,28);
  g=grp(A(0,2.2));p.appendChild(g);fbig(g,380,460,520,120,'U = R . I',C.amber,64,C.amberSoft);
};
SCL.o_circuit=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M300 200 H980 V420 H300 Z',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linejoin':'round'},g);
  // générateur
  box(g,230,260,140,100,C.panel,C.ink,14);T(g,300,305,'générateur',22,C.muted,{a:'middle',w:600});T(g,300,342,'4,5 V',34,C.blue,{a:'middle',w:800});
  g=grp(A(0,1.4));p.appendChild(g);
  box(g,560,172,160,56,C.amberSoft,C.amber,10);T(g,640,210,'R  20 Ω',30,C.amber,{a:'middle',w:800});
  g=grp(A(0,3));p.appendChild(g);
  el('circle',{cx:980,cy:310,r:46,fill:C.panel,stroke:C.green,'stroke-width':5},g);T(g,980,322,'A',40,C.green,{a:'middle',w:800});T(g,980,390,'ampèremètre',24,C.muted,{a:'middle',w:600});
  lcdBox(g,1020,160,220,'0,225','A');
  g=grp(A(0,5));p.appendChild(g);T(g,640,500,'On note le courant I pour chaque résistance',36,C.ink,{a:'middle',w:700});
};
SCL.o_tab=(p,A)=>{
  const X=[[60,280,'Générateur'],[340,260,'R (Ω)'],[600,300,'I (A)'],[900,320,'R × I (V)']];
  let g=grp(A(0,0));p.appendChild(g);
  X.slice(0,3).forEach(([x,w,n])=>{box(g,x,130,w,56,C.blueSoft,C.line,0);T(g,x+w/2,167,n,26,C.blue,{a:'middle',w:700});});
  const R=[[20,'0,225','4,5'],[50,'0,09','4,5'],[100,'0,045','4,5']];
  R.forEach((r,i)=>{ const y=186+i*70,gg=grp(A(0,0.6+i*1.8));p.appendChild(gg);
    [[60,280],[340,260],[600,300]].forEach(([x,w])=>box(gg,x,y,w,70,C.panel,C.line,0));
    T(gg,200,y+46,'4,5 V',32,C.ink,{a:'middle',w:700});T(gg,470,y+46,String(r[0]),34,C.amber,{a:'middle',w:800});T(gg,750,y+46,r[1],34,C.ink,{a:'middle',w:800}); });
  g=grp(A(1,0));p.appendChild(g);
  box(g,900,130,320,56,C.blueSoft,C.line,0);T(g,1060,167,'R × I (V)',26,C.blue,{a:'middle',w:700});
  R.forEach((r,i)=>{ const y=186+i*70,gg=grp(A(1,0.2+i*(i==2?2.6:1.6)));p.appendChild(gg);box(gg,900,y,320,70,C.panel,C.line,0);T(gg,1060,y+46,r[2],36,C.green,{a:'middle',w:800}); });
  g=grp(A(2,0));p.appendChild(g);
  box(g,60,430,1160,110,C.amberSoft,C.amber,22);T(g,640,500,'R . I = constante = U du générateur',46,C.amber,{a:'middle',w:800});
};
SCL.o_9v=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,150,'Générateur de 9 V',48,C.ink,{a:'middle',w:800});
  [['20','0,45'],['50','0,18'],['100','0,09']].forEach(([r,i],k)=>{ const y=200+k*90; box(g,200,y,880,76,C.panel,C.line,16);T(g,260,y+50,'R = '+r+' Ω',34,C.amber,{w:800});T(g,640,y+50,'I = '+i+' A',34,C.ink,{a:'middle',w:800}); });
  g=grp(A(0,1.6));p.appendChild(g);
  [0,1,2].forEach(k=>{ T(g,900,250+k*90,'R × I = 9 V',34,C.green,{w:800}); });
};
SCL.o_loi=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,300,130,680,140,'U = R . I',C.blue,86);
  g=grp(A(0,1.4));p.appendChild(g);T(g,640,330,'volt (V) = ohm (Ω) × ampère (A)',36,C.muted,{a:'middle',w:600});
  g=grp(A(1,0));p.appendChild(g);
  box(g,60,380,1160,200,C.panel,C.line,22);tri(g,260,400,160,'U','R','I');
  T(g,560,470,'R = U / I',50,C.ink,{w:800});T(g,560,550,'I = U / R',50,C.blue,{w:800});
};
SCL.o_def=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,170,'Le volt',54,C.ink,{a:'middle',w:800});
  box(g,140,220,1000,130,C.blueSoft,C.blue,22);T(g,640,305,'1 V = 1 Ω × 1 A',76,C.blue,{a:'middle',w:800});
  g=grp(A(0,2));p.appendChild(g);
  T(g,640,430,'la tension qui fait circuler 1 A',36,C.ink,{a:'middle',w:700});T(g,640,480,'dans une résistance de 1 Ω',36,C.ink,{a:'middle',w:700});
};
SCL.o_inv=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,150,'Même tension U',44,C.ink,{a:'middle',w:800});
  box(g,100,200,1080,110,C.panel,C.line,18);T(g,150,268,'R',44,C.amber,{w:800});box(g,300,235,560,40,C.blue,'none',20);T(g,890,268,'I',44,C.blue,{w:800});
  g=grp(A(0,2.4));p.appendChild(g);
  box(g,100,330,1080,110,C.panel,C.line,18);T(g,150,398,'2 R',44,C.amber,{w:800});box(g,300,365,280,40,C.blue,'none',20);T(g,610,398,'I ÷ 2',44,C.blue,{w:800});
  g=grp(A(0,4.8));p.appendChild(g);
  T(g,640,510,'R × 2  →  I ÷ 2',48,C.green,{a:'middle',w:800});
};
SCL.o_ex=(p,A)=>difs(p,A,0,{enonce:['Chauffe-eau : R = 50 Ω, I = 4,6 A','Quelle tension à ses bornes ?'],d:['R = 50 Ω','I = 4,6 A'],i:'U (V)',f:'U = R . I',s:['U = 50 × 4,6','U = 230 V']});
SCL.o_ex2=(p,A)=>difs(p,A,0,{one:true,enonce:['Radiateur : R = 115 Ω sous U = 230 V','Quel courant ?'],d:['U = 230 V','R = 115 Ω'],i:'I (A)',f:'I = U / R',s:['I = 230 / 115','I = 2 A'],sAt:1.6});
SCL.o_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,330,200,620,120,'U = R . I',C.blue,72);
  g=grp(A(0,1.8));p.appendChild(g);
  [['U = R . I',C.blue],['R = U / I',C.amber],['I = U / R',C.green]].forEach(([t,col],i)=>{ const x=100+i*370; box(g,x,360,340,110,C.panel,col,20);T(g,x+170,432,t,44,col,{a:'middle',w:800}); });
  g=grp(A(1,0));p.appendChild(g);
  box(g,260,520,760,70,C.green,'none',35);T(g,640,568,'À toi de jouer : tableau + 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
