/* Chapitre 14 — résistances parallèles (scènes locales) */
Object.assign(FIT,{par_intro:600,par_circ:552,par_form:560,par_plus:520,par_maison:520,par_am:560,par_ex:565,par_ex2:565,par_recap:600});
const rpar=(g,x,y,lab,col)=>{box(g,x-34,y,68,120,C.amberSoft,col||C.amber,10);T(g,x,y+55,lab[0],24,col||C.amber,{a:'middle',w:800});T(g,x,y+88,lab[1],24,col||C.amber,{a:'middle',w:800});};
SCL.par_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'Les résistances parallèles',72,C.ink,{a:'middle',w:800});T(g,640,292,'Une seule tension, les courants s’additionnent',30,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  el('path',{d:'M400 380 H880 M400 540 H880 M520 380 V540 M760 380 V540',fill:'none',stroke:C.ink,'stroke-width':4},g);
  [520,760].forEach(x=>{box(g,x-30,420,60,80,C.amberSoft,C.amber,10);});
  g=grp(A(0,2.2));p.appendChild(g);T(g,1000,470,'1/Réqu = 1/R1 + 1/R2',32,C.amber,{a:'middle',w:800});
};
SCL.par_circ=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M230 190 H1050 M230 440 H1050 M500 190 V440 M800 190 V440 M230 190 V230 M230 400 V440',fill:'none',stroke:C.ink,'stroke-width':4},g);
  box(g,170,230,120,170,C.panel,C.ink,12);T(g,230,290,'E',24,C.muted,{a:'middle',w:600});T(g,230,340,'12 V',30,C.blue,{a:'middle',w:800});
  rpar(g,500,255,['R1','60 Ω']);rpar(g,800,255,['R2','30 Ω']);
  [500,800].forEach(x=>{const gg=grp(A(0,1.2));p.appendChild(gg);chip(gg,x-80,125,160,'U = 12 V',C.blueSoft,C.blue,24);});
  g=grp(A(1,0));p.appendChild(g);T(g,545,325,'I1 = 0,2 A',32,C.green,{w:800});T(g,845,325,'I2 = 0,4 A',32,C.green,{w:800});
  g=grp(A(2,0));p.appendChild(g);T(g,395,265,'IT = 0,6 A',30,C.amber,{a:'middle',w:800});arrow(g,310,215,430,215,C.amber,5);
  g=grp(A(3,0));p.appendChild(g);box(g,230,480,820,80,C.panel,C.amber,20);T(g,640,535,'Réqu = 12 / 0,6 = 20 Ω',46,C.amber,{a:'middle',w:800});
};
SCL.par_form=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,150,140,980,140,'1 / R'+sub('équ')+' = 1/R'+sub('1')+' + 1/R'+sub('2')+' + … + 1/R'+sub('n'),C.amber,60,C.amberSoft);
  g=grp(A(0,2.4));p.appendChild(g);T(g,640,350,'Pour deux résistances : le produit sur la somme',34,C.ink,{a:'middle',w:700});fbig(g,200,380,880,110,'R'+sub('équ')+' = R'+sub('1')+' . R'+sub('2')+' / (R'+sub('1')+' + R'+sub('2')+')',C.blue,52);
  g=grp(A(0,4.6));p.appendChild(g);T(g,640,540,'60 × 30 / 90 = 20 Ω',38,C.green,{a:'middle',w:800});
};
SCL.par_plus=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  [['R1',60,C.amber,0],['R2',30,C.amber,1.2],['Réqu',20,C.green,3]].forEach(([n,v,col,d],i)=>{const gg=grp(A(0,d));p.appendChild(gg);const y=150+i*110;box(gg,100,y,1080,90,C.panel,C.line,16);T(gg,150,y+58,n,34,col,{w:800});box(gg,300,y+22,v*11,46,col,'none',23);T(gg,300+v*11+25,y+58,v+' Ω',34,C.ink,{w:800});});
  g=grp(A(0,4.4));p.appendChild(g);T(g,640,520,'Réqu < la plus petite des résistances',42,C.green,{a:'middle',w:800});
};
SCL.par_maison=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M250 180 H1030 M250 430 H1030 M250 180 V430',fill:'none',stroke:C.ink,'stroke-width':4},g);
  [450,700,950].forEach((x,i)=>{el('line',{x1:x,y1:180,x2:x,y2:250,stroke:C.ink,'stroke-width':4},g);el('line',{x1:x,y1:350,x2:x,y2:430,stroke:C.ink,'stroke-width':4},g);lampe(g,x,300,48,i!=1);});
  T(g,170,310,'230 V',34,C.blue,{a:'middle',w:800});
  g=grp(A(0,1.8));p.appendChild(g);T(g,700,395,'grillée',26,C.red,{a:'middle',w:700});
  g=grp(A(0,3));p.appendChild(g);T(g,640,520,'les autres continuent de fonctionner',40,C.green,{a:'middle',w:800});
};
SCL.par_am=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M230 190 H1050 M230 440 H1050 M230 190 V230 M230 400 V440 M560 190 V440 M860 190 V440',fill:'none',stroke:C.ink,'stroke-width':4},g);
  box(g,170,230,120,170,C.panel,C.ink,12);T(g,230,300,'12 V',30,C.blue,{a:'middle',w:800});
  box(g,500,270,120,90,C.amberSoft,C.amber,12);T(g,560,310,'appareil',22,C.amber,{a:'middle',w:700});T(g,560,342,'5 A',26,C.amber,{a:'middle',w:800});
  g=grp(A(0,1.6));p.appendChild(g);
  el('circle',{cx:860,cy:315,r:50,fill:C.panel,stroke:C.red,'stroke-width':6},g);T(g,860,332,'A',44,C.red,{a:'middle',w:800});T(g,925,322,'0,1 Ω',28,C.red,{w:800});
  g=grp(A(0,3.2));p.appendChild(g);box(g,240,480,800,80,'#3a1512',C.red,22);T(g,640,535,'plus de 100 A : ✕ jamais en parallèle',38,C.red,{a:'middle',w:800});
};
SCL.par_ex=(p,A)=>difs(p,A,0,{enonce:['Deux résistances en parallèle : 90 Ω et 45 Ω','Quelle résistance équivalente ?'],d:['R1 = 90 Ω','R2 = 45 Ω'],i:'Réqu (Ω)',f:'Réqu = R1 . R2 / (R1+R2)',fs:22,s:['P = 90 × 45 = 4 050','S = 90 + 45 = 135','Réqu = 30 Ω']});
SCL.par_ex2=(p,A)=>difs(p,A,0,{one:true,enonce:['Trois résistances égales de 12 Ω en parallèle','Quelle résistance équivalente ?'],d:['R1 = R2 = R3 = 12 Ω'],i:'Réqu (Ω)',f:'Réqu = R / 3',s:['Réqu = 12 / 3','Réqu = 4 Ω'],sAt:1.6});
SCL.par_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,200,200,880,120,'R'+sub('équ')+' = R'+sub('1')+' . R'+sub('2')+' / (R'+sub('1')+' + R'+sub('2')+')',C.amber,52,C.amberSoft);
  g=grp(A(0,1.8));p.appendChild(g);
  [['U partout pareil',C.blue],['I s’additionnent',C.amber],['Réqu plus petite',C.green]].forEach(([t,col],i)=>{const x=100+i*370;box(g,x,360,340,110,C.panel,col,20);T(g,x+170,428,t,32,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,150,520,980,70,C.green,'none',35);T(g,640,568,'À toi de jouer : vrai ou faux, ampèremètre et 3 exercices',28,'#0b2415',{a:'middle',w:800});
};
