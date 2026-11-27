/* Chapitre 15 — résistances mixtes (scènes locales) */
Object.assign(FIT,{x_intro:600,x_def:540,x_regles:540,x_methode:540,x_red:560,x_piege:520,x_recap:600});
const rb=(g,x,y,w,h,t,col)=>{box(g,x,y,w,h,C.amberSoft,col||C.amber,10);T(g,x+w/2,y+h/2+9,t,24,col||C.amber,{a:'middle',w:800});};
SCL.x_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'Les résistances mixtes',74,C.ink,{a:'middle',w:800});T(g,640,292,'Réduire un circuit pas à pas',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,190,360,280,'série : on ajoute',C.amberSoft,C.amber,26);chip(g,495,360,340,'parallèle : les inverses',C.blueSoft,C.blue,26);chip(g,860,360,230,'+ redessiner',C.blueSoft,C.green,26);
  g=grp(A(0,2.2));p.appendChild(g);rb(g,330,470,120,60,'R1');rb(g,500,445,120,50,'R2');rb(g,500,505,120,50,'R3');el('line',{x1:450,y1:500,x2:500,y2:470,stroke:C.ink,'stroke-width':3},g);el('line',{x1:450,y1:500,x2:500,y2:530,stroke:C.ink,'stroke-width':3},g);
  T(g,700,515,'→',50,C.muted,{a:'middle',w:800});rb(g,760,470,160,60,'Réqu',C.green);
};
SCL.x_def=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  ['R1','R2','R3'].forEach((n,i)=>rb(g,150+i*160,200,130,70,n));
  T(g,340,330,'plusieurs résistances',32,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.6));p.appendChild(g);T(g,640,245,'=',80,C.ink,{a:'middle',w:800});rb(g,760,190,300,90,'Réqu',C.green);T(g,910,330,'une seule, mêmes effets',32,C.muted,{a:'middle',w:600});
  g=grp(A(0,3.4));p.appendChild(g);box(g,160,400,960,130,C.panel,C.line,22);T(g,640,462,'mêmes effets sur l’intensité',36,C.ink,{a:'middle',w:700});T(g,640,508,'et sur le dégagement de chaleur',36,C.ink,{a:'middle',w:700});
};
SCL.x_regles=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,100,150,520,380,C.panel,C.amber,22);T(g,360,215,'Série',40,C.amber,{a:'middle',w:800});rb(g,200,260,90,50,'R1');rb(g,330,260,90,50,'R2');rb(g,460,260,90,50,'R3');el('line',{x1:160,y1:285,x2:560,y2:285,stroke:C.ink,'stroke-width':3,opacity:0.5},g);
  fbig(g,150,370,420,110,'R'+sub('équ')+' = R'+sub('1')+' + R'+sub('2')+' + R'+sub('3'),C.amber,34,C.amberSoft);
  g=grp(A(0,2.2));p.appendChild(g);box(g,660,150,520,380,C.panel,C.blue,22);T(g,920,215,'Parallèle',40,C.blue,{a:'middle',w:800});rb(g,860,250,120,44,'R1',C.blue);rb(g,860,310,120,44,'R2',C.blue);
  fbig(g,700,390,440,110,'1/R'+sub('équ')+' = 1/R'+sub('1')+' + 1/R'+sub('2'),C.blue,34);
};
SCL.x_methode=(p,A)=>{
  const S=[['Circuit mixte','R1 + R2 ∥ R3'],['Redessiner','R1 + R23'],['Redessiner','Réqu']];
  S.forEach(([a,b],i)=>{const g=grp(A(0,i*2));p.appendChild(g);const x=70+i*410;box(g,x,200,360,250,C.panel,i==2?C.green:C.line,22);T(g,x+180,260,a,30,C.muted,{a:'middle',w:700});T(g,x+180,360,b,44,i==2?C.green:C.amber,{a:'middle',w:800});if(i<2)T(g,x+385,335,'→',50,C.muted,{a:'middle',w:800});});
  let g=grp(A(0,5));p.appendChild(g);T(g,640,530,'une étape = un nouveau schéma',40,C.ink,{a:'middle',w:700});
};
SCL.x_red=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,50,120,400,200,C.panel,C.line,18);rb(g,80,195,70,46,'5 Ω');rb(g,230,150,100,42,'20 Ω');rb(g,230,250,100,42,'30 Ω');
  el('path',{d:'M150 218 H190 V171 H230 M190 218 V271 H230 M330 171 H370 V271 H330 M370 221 H410',fill:'none',stroke:C.ink,'stroke-width':3},g);T(g,250,142,'34 V',26,C.blue,{a:'middle',w:800});
  g=grp(A(1,0));p.appendChild(g);box(g,470,120,370,200,C.panel,C.line,18);rb(g,500,195,70,46,'5 Ω');rb(g,640,195,120,46,'12 Ω',C.blue);el('path',{d:'M570 218 H640 M760 218 H810',fill:'none',stroke:C.ink,'stroke-width':3},g);T(g,520,170,'R1',22,C.muted,{w:700});T(g,700,170,'R2 ∥ R3',22,C.blue,{a:'middle',w:700});T(g,450,222,'→',34,C.muted,{a:'middle',w:800});
  g=grp(A(2,0));p.appendChild(g);box(g,860,120,370,200,C.panel,C.green,18);rb(g,930,195,230,46,'17 Ω',C.green);T(g,1045,170,'Réqu',22,C.green,{a:'middle',w:700});T(g,845,222,'→',34,C.muted,{a:'middle',w:800});
  const rows=[['R'+sub('23')+' = 20 × 30 / 50 = 12 Ω',C.blue],['R'+sub('équ')+' = 5 + 12 = 17 Ω',C.green],['I = 34 / 17 = 2 A',C.amber],['U'+sub('1')+' = 5 × 2 = 10 V   ·   U'+sub('23')+' = 34 − 10 = 24 V',C.ink],['I'+sub('2')+' = 24 / 20 = 1,2 A   ·   I'+sub('3')+' = 24 / 30 = 0,8 A',C.ink]];
  rows.forEach(([t,col],i)=>{const gg=grp(A(i+1,0.1));p.appendChild(gg);box(gg,150,345+i*44,980,40,C.panel,C.line,10);T(gg,640,374+i*44,t,28,col,{a:'middle',w:800});});
};
SCL.x_piege=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,160,150,960,130,C.amberSoft,C.amber,22);T(g,640,230,'Sans le schéma : série ou parallèle ?',46,C.amber,{a:'middle',w:800});
  g=grp(A(0,2));p.appendChild(g);T(g,640,370,'On ne peut pas deviner.',42,C.ink,{a:'middle',w:700});
  g=grp(A(0,3.8));p.appendChild(g);box(g,200,430,880,90,C.panel,C.green,22);T(g,640,490,'Dessine chaque étape de la réduction',40,C.green,{a:'middle',w:800});
};
SCL.x_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});
  [['1. Réduire pas à pas',C.amber],['2. I total = U / Réqu',C.blue],['3. Redescendre',C.green]].forEach(([t,col],i)=>{const gg=grp(A(0,0.8+i*1.2));p.appendChild(gg);const x=100+i*370;box(gg,x,230,340,150,C.panel,col,20);T(gg,x+170,315,t,32,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,100,470,1080,90,C.green,'none',40);T(g,640,527,'À toi de jouer : réduction pas à pas + 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
