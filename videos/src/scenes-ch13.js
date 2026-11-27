/* Chapitre 13 — chute de tension en ligne (scènes locales) */
Object.assign(FIT,{l_intro:600,l_exp:552,l_res:540,l_tri:600,l_dens:540,l_moy:520,l_ex:565,l_ex2:565,l_recap:600});
SCL.l_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'La chute de tension en ligne',70,C.ink,{a:'middle',w:800});T(g,640,292,'Pourquoi la tension baisse le long d’un câble',30,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,280,360,200,'U'+sub('L')+' = R'+sub('L')+' . I'+sub('L'),C.blueSoft,C.blue,26);chip(g,510,360,260,'U'+sub('L')+' = ρ . L . J',C.amberSoft,C.amber,26);chip(g,800,360,200,'U'+sub('G')+' = U'+sub('L')+' + U'+sub('R'),C.blueSoft,C.blue,26);
  g=grp(A(0,2.2));p.appendChild(g);
  box(g,260,470,160,70,C.panel,C.ink,12);T(g,340,517,'6 V',32,C.blue,{a:'middle',w:800});el('line',{x1:420,y1:490,x2:860,y2:490,stroke:C.copper,'stroke-width':6},g);el('line',{x1:420,y1:525,x2:860,y2:525,stroke:C.copper,'stroke-width':6},g);box(g,860,470,160,70,C.panel,C.ink,12);T(g,940,517,'4,8 V',32,C.red,{a:'middle',w:800});
};
SCL.l_exp=(p,A,ph)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,100,230,170,130,C.panel,C.ink,14);T(g,185,285,'générateur',22,C.muted,{a:'middle',w:600});T(g,185,330,'UG',36,C.blue,{a:'middle',w:800});
  box(g,1010,230,170,130,C.panel,C.ink,14);T(g,1095,285,'récepteur',22,C.muted,{a:'middle',w:600});T(g,1095,330,'UR',36,C.red,{a:'middle',w:800});
  el('line',{x1:270,y1:255,x2:1010,y2:255,stroke:C.copper,'stroke-width':8},g);el('line',{x1:270,y1:335,x2:1010,y2:335,stroke:C.copper,'stroke-width':8},g);
  flow(g,285,995,255,50,8,C.amber,ph,true);flow(g,285,995,335,50,8,C.amber,1-ph,true);
  T(g,640,215,'ligne bifilaire',24,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.2));p.appendChild(g);lcdBox(g,75,130,220,'6','V');
  g=grp(A(0,2.8));p.appendChild(g);lcdBox(g,985,130,220,'4,8','V');
  g=grp(A(1,0));p.appendChild(g);
  T(g,640,440,'U'+sub('L')+' = U'+sub('G')+' − U'+sub('R')+' = 6 − 4,8 = 1,2 V',50,C.green,{a:'middle',w:800});
  g=grp(A(1,1.6));p.appendChild(g);T(g,640,505,'soit 20 % de la tension du générateur',34,C.amber,{a:'middle',w:700});
};
SCL.l_res=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,60,130,1160,260,C.panel,C.line,22);
  el('line',{x1:200,y1:210,x2:1080,y2:210,stroke:C.copper,'stroke-width':9},g);el('line',{x1:200,y1:320,x2:1080,y2:320,stroke:C.copper,'stroke-width':9},g);
  arrow(g,260,170,1020,170,C.blue,4);T(g,640,160,'aller : L/2',26,C.blue,{a:'middle',w:700});arrow(g,1020,360,260,360,C.amber,4);T(g,640,392-4,'retour : L/2',26,C.amber,{a:'middle',w:700});
  T(g,150,270,'R'+sub('L1'),30,C.blue,{a:'middle',w:800});T(g,1130,270,'R'+sub('L2'),30,C.amber,{a:'middle',w:800});
  g=grp(A(0,1.8));p.appendChild(g);fbig(g,300,430,680,100,'R'+sub('L')+' = R'+sub('L1')+' + R'+sub('L2'),C.blue,56);
  g=grp(A(1,0));p.appendChild(g);
  box(g,60,130,1160,430,C.panel,C.line,22);fbig(g,300,170,680,130,'R'+sub('L')+' = ρ . L / S',C.amber,76,C.amberSoft);
  T(g,640,370,'L = longueur des fils aller-retour',36,C.ink,{a:'middle',w:700});T(g,640,430,'pas la distance générateur – récepteur',30,C.muted,{a:'middle',w:600});
  g=grp(A(1,2));p.appendChild(g);chip(g,330,480,620,'ρ en Ω·mm²/m  ·  S en mm²  ·  L en m',C.blueSoft,C.blue,26);
};
SCL.l_tri=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,280,130,720,130,'U'+sub('L')+' = R'+sub('L')+' . I'+sub('L'),C.blue,74);
  g=grp(A(0,1.4));p.appendChild(g);box(g,60,300,1160,250,C.panel,C.line,22);tri(g,260,320,200,'UL','RL','IL');
  T(g,560,400,'R'+sub('L')+' = U'+sub('L')+' / I'+sub('L'),48,C.ink,{w:800});T(g,560,490,'I'+sub('L')+' = U'+sub('L')+' / R'+sub('L'),48,C.blue,{w:800});
  g=grp(A(1,0));p.appendChild(g);box(g,60,110,1160,470,C.panel,C.line,22);
  T(g,640,200,'générateur · ligne · récepteur : en série',36,C.ink,{a:'middle',w:700});
  T(g,640,300,'I'+sub('L')+' = I'+sub('G')+' = I'+sub('R'),64,C.green,{a:'middle',w:800});
  g=grp(A(1,1.8));p.appendChild(g);fbig(g,300,380,680,110,'U'+sub('G')+' = U'+sub('L')+' + U'+sub('R'),C.amber,60,C.amberSoft);
};
SCL.l_dens=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,180,'U'+sub('L')+' = ρ . L . I / S',66,C.ink,{a:'middle',w:800});T(g,640,230,'(Pouillet dans U = R . I)',28,C.muted,{a:'middle',w:500});
  g=grp(A(0,2.2));p.appendChild(g);box(g,300,280,680,90,C.blueSoft,C.blue,20);T(g,640,342,'J = I / S   (A/mm²)',46,C.blue,{a:'middle',w:800});T(g,640,410,'la densité de courant',30,C.muted,{a:'middle',w:600});
  g=grp(A(0,4.8));p.appendChild(g);fbig(g,300,440,680,110,'U'+sub('L')+' = ρ . L . J',C.amber,64,C.amberSoft);
};
SCL.l_moy=(p,A)=>{
  [['Faible résistivité','cuivre, ou aluminium|moins coûteux',C.blue],['Distance réduite','plus de cabines|près des maisons',C.amber],['J raisonnable','section adaptée|au courant',C.green]].forEach(([a,b,col],k)=>{const g=grp(A(0,k*2.2));p.appendChild(g);
    box(g,60+k*390,150,370,320,C.panel,col,22);T(g,245+k*390,240,a,34,col,{a:'middle',w:800});b.split('|').forEach((l,j)=>T(g,245+k*390,320+j*36,l,26,C.ink,{a:'middle',w:600}));T(g,245+k*390,430,'U'+sub('L')+' ↓',44,col,{a:'middle',w:800});});
};
SCL.l_ex=(p,A)=>difs(p,A,0,{enonce:['Ligne en cuivre : 25 m, soit 50 m aller-retour, 2,5 mm²','16 A sous 230 V : quelle chute de tension ?'],d:['L = 50 m · S = 2,5 mm²','ρ = 0,0175 Ω·mm²/m','I = 16 A'],i:'UL (V)',f:'UL = RL . I',s:['RL = 0,35 Ω','UL = 0,35 × 16','UL = 5,6 V']});
SCL.l_ex2=(p,A)=>difs(p,A,0,{one:true,enonce:['Même ligne : UG = 230 V et UL = 5,6 V','Quelle tension au récepteur ?'],d:['UG = 230 V','UL = 5,6 V'],i:'UR (V)',f:'UR = UG − UL',s:['UR = 230 − 5,6','UR = 224,4 V'],sAt:1.6});
SCL.l_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,330,200,620,120,'U'+sub('L')+' = R'+sub('L')+' . I'+sub('L'),C.blue,66);
  g=grp(A(0,1.8));p.appendChild(g);
  [['U'+sub('L')+' = ρ . L . J',C.amber],['U'+sub('G')+' = U'+sub('L')+' + U'+sub('R'),C.green],['L et S bien choisis',C.blue]].forEach(([t,col],i)=>{const x=100+i*370;box(g,x,360,340,110,C.panel,col,20);T(g,x+170,430,t,34,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,150,520,980,70,C.green,'none',35);T(g,640,568,'À toi de jouer : expérience, tri et 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
