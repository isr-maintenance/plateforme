/* Chapitre 12 — résistances séries (scènes locales) */
Object.assign(FIT,{s_intro:600,s_chemin:560,s_circ:552,s_prop:540,s_tab:540,s_ex:565,s_ex2:565,s_recap:600});
const RS=[['R1','100 Ω',400],['R2','200 Ω',640],['R3','300 Ω',880]];
const serieLoop=(g,ph,dots,volt)=>{
  el('path',{d:'M240 150 H1040 V260 H240 Z',fill:'none',stroke:C.ink,'stroke-width':4,'stroke-linejoin':'round'},g);
  box(g,185,170,110,70,C.panel,C.ink,12);T(g,240,196,'E',24,C.muted,{a:'middle',w:600});T(g,240,228,'12 V',28,C.blue,{a:'middle',w:800});
  RS.forEach(([n,v,x],i)=>{box(g,x-62,125,124,50,C.amberSoft,C.amber,10);T(g,x,157,n+' '+v,22,C.amber,{a:'middle',w:800});if(volt)T(g,x,215,volt[i],28,C.blue,{a:'middle',w:800});});
  if(dots){flow(g,260,1020,260,46,9,C.amber,1-dots,true);}
};
SCL.s_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'Les résistances séries',74,C.ink,{a:'middle',w:800});T(g,640,292,'Un seul chemin pour le courant',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  [90,330,570].forEach((x,i)=>box(g,330+i*210,380,150,50,C.amberSoft,C.amber,10));
  el('line',{x1:240,y1:405,x2:1040,y2:405,stroke:C.ink,'stroke-width':4},g);
  [0,1,2].forEach(i=>{box(g,380+i*210,380,110,50,C.amberSoft,C.amber,10);T(g,435+i*210,414,'R'+(i+1),26,C.amber,{a:'middle',w:800});});
  g=grp(A(0,2.2));p.appendChild(g);fbig(g,380,480,520,90,'R'+sub('T')+' = R'+sub('1')+' + R'+sub('2')+' + R'+sub('3'),C.amber,46,C.amberSoft);
};
SCL.s_chemin=(p,A,ph)=>{
  let g=grp(A(0,0));p.appendChild(g);serieLoop(g,ph,ph);
  [0,1,2].forEach(i=>{g=grp(A(0,1.4+i*0.6));p.appendChild(g);chip(g,RS[i][2]-60,300,120,'I',C.blueSoft,C.blue,28);});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,430,'I'+sub('1')+' = I'+sub('2')+' = I'+sub('3')+' = I'+sub('T'),60,C.green,{a:'middle',w:800});T(g,640,490,'le même courant partout',32,C.muted,{a:'middle',w:600});
};
SCL.s_circ=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);serieLoop(g,0,0);
  const rows=[['R'+sub('T')+' = 100 + 200 + 300 = 600 Ω',C.amber],['I = U / R'+sub('T')+' = 12 / 600 = 0,02 A = 20 mA',C.blue],['U'+sub('1')+' = R'+sub('1')+' . I = 2 V · U'+sub('2')+' = 4 V · U'+sub('3')+' = 6 V',C.ink],['U'+sub('T')+' = 2 + 4 + 6 = 12 V = E',C.green]];
  rows.forEach(([t,col],i)=>{ const gg=grp(A(i+1,0));p.appendChild(gg);box(gg,150,300+i*62,980,54,C.panel,C.line,12);T(gg,640,338+i*62,t,32,col,{a:'middle',w:800}); });
  g=grp(A(3,0));p.appendChild(g);['2 V','4 V','6 V'].forEach((v,i)=>T(g,RS[i][2],215,v,28,C.blue,{a:'middle',w:800}));
};
SCL.s_prop=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  [['R1 = 100 Ω','2 V',120],['R2 = 200 Ω','4 V',240],['R3 = 300 Ω','6 V',360]].forEach(([n,u,w],i)=>{const y=160+i*90;box(g,100,y,1080,76,C.panel,C.line,16);T(g,140,y+48,n,30,C.amber,{w:800});box(g,420,y+18,w*1.5,40,C.blue,'none',20);T(g,420+w*1.5+25,y+48,'U = '+u,32,C.ink,{w:800});});
  g=grp(A(0,2.4));p.appendChild(g);box(g,240,470,800,76,'#3a1512',C.red,22);T(g,640,522,'un élément coupé  →  I = 0 partout',36,C.red,{a:'middle',w:800});
};
SCL.s_tab=(p,A)=>{
  const R=[['Le courant I','I = U'+sub('T')+' / R'+sub('T')],['La tension totale','U'+sub('T')+' = R'+sub('T')+' . I'],['La tension d’un élément','U'+sub('1')+' = R'+sub('1')+' . I'],['La résistance totale','R'+sub('T')+' = R'+sub('1')+' + R'+sub('2')+' + R'+sub('3')],['Une résistance','R'+sub('1')+' = U'+sub('1')+' / I']];
  let g=grp(A(0,0));p.appendChild(g);box(g,140,120,420,52,C.blueSoft,C.line,0);T(g,350,155,'Je cherche…',28,C.blue,{a:'middle',w:700});box(g,560,120,580,52,C.blueSoft,C.line,0);T(g,850,155,'Je calcule…',28,C.blue,{a:'middle',w:700});
  R.forEach(([a,b],i)=>{const gg=grp(A(0,0.6+i*1.2));p.appendChild(gg);box(gg,140,172+i*70,420,70,C.panel,C.line,0);box(gg,560,172+i*70,580,70,C.panel,C.line,0);T(gg,350,216+i*70,a,28,C.ink,{a:'middle',w:700});T(gg,850,217+i*70,b,32,C.amber,{a:'middle',w:800});});
};
SCL.s_ex=(p,A)=>difs(p,A,0,{enonce:['Deux résistances en série sous 9 V','R1 = 3,3 kΩ et R2 = 1,2 kΩ : quel courant ?'],d:['U = 9 V','R1 = 3,3 kΩ','R2 = 1,2 kΩ'],i:'I (mA)',f:'I = U / (R1 + R2)',fs:24,s:['RT = 4,5 kΩ','I = 9 / 4,5','I = 2 mA']});
SCL.s_ex2=(p,A)=>difs(p,A,0,{one:true,enonce:['R1 = 1 kΩ et R2 = 2,2 kΩ en série','5 V aux bornes de R1 : courant dans R2 ?'],d:['U1 = 5 V','R1 = 1 kΩ'],i:'I (mA)',f:'I = U1 / R1',s:['I = 5 / 1 000','I = 5 mA'],sAt:1.6});
SCL.s_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,330,200,620,120,'R'+sub('T')+' = R'+sub('1')+' + R'+sub('2')+' + …',C.amber,60,C.amberSoft);
  g=grp(A(0,1.8));p.appendChild(g);
  [['I partout pareil',C.blue],['U s’additionnent',C.amber],['R s’additionnent',C.green]].forEach(([t,col],i)=>{const x=100+i*370;box(g,x,360,340,110,C.panel,col,20);T(g,x+170,428,t,32,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,170,520,940,70,C.green,'none',35);T(g,640,568,'À toi de jouer : vrai ou faux + 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
