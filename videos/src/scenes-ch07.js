/* Chapitre 7 — la loi de Pouillet (scènes locales : étapes numérotées à partir de 0) */
Object.assign(FIT,{p_intro:600,p_exp:560,p_long:560,p_sec:560,p_mat:560,p_conc:560,p_formule:600,p_rho:600,p_ex:565,p_terrain:560,p_recap:600});
const CU='#c4783a';
function ohmBox(p,x,y,txt){ lcdBox(p,x,y,250,txt,'Ω'); }
SCL.p_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'La loi de Pouillet',74,C.ink,{a:'middle',w:800});
  T(g,640,292,'De quoi dépend la résistance d’un fil ?',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,250,360,250,'la longueur',C.blueSoft,C.blue,28);chip(g,530,360,230,'la section',C.amberSoft,C.amber,28);chip(g,790,360,230,'la matière',C.blueSoft,C.blue,28);
  g=grp(A(0,2.2));p.appendChild(g);
  fbig(g,360,460,560,120,'R = ρ . L / S',C.amber,60,C.amberSoft);
};
SCL.p_exp=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('circle',{cx:230,cy:290,r:26,fill:C.panel,stroke:C.ink,'stroke-width':4},g);T(g,230,300,'A',30,C.ink,{a:'middle',w:800});
  el('circle',{cx:1050,cy:290,r:26,fill:C.panel,stroke:C.ink,'stroke-width':4},g);T(g,1050,300,'B',30,C.ink,{a:'middle',w:800});
  tube(g,256,276,768,28,'#4a2a12',CU);T(g,640,262,'conducteur à tester',26,C.muted,{a:'middle',w:500});
  g=grp(A(0,1.2));p.appendChild(g);
  el('path',{d:'M230 316 V420 H500',fill:'none',stroke:C.muted,'stroke-width':3},g);el('path',{d:'M1050 316 V420 H780',fill:'none',stroke:C.muted,'stroke-width':3},g);
  box(g,500,385,280,90,C.panel,C.line,16);lcdBox(g,515,395,250,'?','Ω');T(g,640,505,'ohmmètre',28,C.muted,{a:'middle',w:600});
  g=grp(A(0,3.4));p.appendChild(g);
  T(g,640,150,'On change un seul critère à la fois',44,C.ink,{a:'middle',w:800});
};
function rows3(p,A,rows,title,at0){ // rows : [{lab,len,th,col,r}]
  rows.forEach((r,i)=>{ const g=grp(A(0,at0[i]));p.appendChild(g); const y=150+i*120;
    box(g,60,y-40,1160,100,C.panel,C.line,18);T(g,110,y+14,r.lab,38,C.ink,{w:800});
    box(g,r.x0||330,y-r.th/2+10,r.len,r.th,r.col,'none',r.th/2);
    lcdBox(g,930,y-22,250,r.r,'Ω'); });
}
SCL.p_long=(p,A)=>{
  rows3(p,A,[{lab:'1 m',len:150,th:26,col:CU,r:'1'},{lab:'2 m',len:300,th:26,col:CU,r:'2'},{lab:'3 m',len:450,th:26,col:CU,r:'3'}],'',[0,2.2,4.4]);
  const g=grp(A(0,6));p.appendChild(g);T(g,640,550,'Longueur × 2  →  R × 2',44,C.blue,{a:'middle',w:800});
};
SCL.p_sec=(p,A)=>{
  rows3(p,A,[{lab:'1 mm²',len:300,th:20,col:CU,r:'1'},{lab:'2 mm²',len:300,th:40,col:CU,r:'0,5'}],'',[0,2.2]);
  const g=grp(A(0,4.4));p.appendChild(g);T(g,640,450,'Section × 2  →  R ÷ 2',44,C.amber,{a:'middle',w:800});
};
SCL.p_mat=(p,A)=>{
  rows3(p,A,[{lab:'Chrome-nickel',x0:470,len:200,th:28,col:'#8b95a3',r:'1'},{lab:'Ferro-nickel',x0:470,len:200,th:28,col:'#a99a7b',r:'0,8'},{lab:'Cuivre',x0:470,len:200,th:28,col:CU,r:'0,017'}],'',[0,2.4,4.8]);
  const g=grp(A(0,6.4));p.appendChild(g);T(g,640,550,'1 m · 1 mm² : la matière change tout',36,C.muted,{a:'middle',w:700});
};
SCL.p_conc=(p,A)=>{
  [[C.blueSoft,C.blue,'R ∝ L','proportionnelle à la longueur',0],[C.amberSoft,C.amber,'R ∝ 1 / S','inversement proportionnelle à la section',2.6],[C.panel,C.green,'R dépend de la matière','la résistivité ρ',5.2]].forEach(([soft,col,big,small,at],i)=>{
    const g=grp(A(0,at));p.appendChild(g);const y=130+i*140;box(g,100,y,1080,120,soft,col,22);T(g,150,y+58,big,48,col,{w:800});T(g,150,y+100,small,28,C.muted,{w:500}); });
};
SCL.p_formule=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,200,120,880,120,'R = ρ . L / S',C.amber,76,C.amberSoft);
  g=grp(A(0,1.2));p.appendChild(g);
  [['R','résistance','Ω'],['ρ','résistivité','Ω·mm²/m'],['L','longueur','m'],['S','section','mm²']].forEach(([s,n,u],i)=>{ const x=60+i*290; box(g,x,270,270,110,C.panel,C.line,18);T(g,x+135,322,s+' : '+n,26,C.ink,{a:'middle',w:700});T(g,x+135,362,u,26,C.amber,{a:'middle',w:600}); });
  g=grp(A(1,0));p.appendChild(g);
  box(g,60,410,1160,200,C.panel,C.line,22);tri(g,260,430,160,'ρ . L','R','S');
  T(g,560,490,'L = R . S / ρ',48,C.ink,{w:800});T(g,560,570,'S = ρ . L / R',48,C.blue,{w:800});
};
SCL.p_rho=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,60,120,560,330,C.panel,C.line,22);T(g,340,172,'ρ à 20 °C (Ω·mm²/m)',28,C.muted,{a:'middle',w:600});
  [['Argent','0,016',C.green],['Cuivre','0,01725',C.amber],['Aluminium','0,028',C.ink],['Fer','0,1',C.ink]].forEach(([n,v,col],i)=>{ T(g,100,224+i*54,n,34,col,{w:700});T(g,580,224+i*54,v,34,col,{a:'end',w:800}); });
  T(g,340,436,'plus ρ est petit, mieux ça conduit',24,C.muted,{a:'middle',w:500});
  g=grp(A(1,0));p.appendChild(g);
  box(g,660,120,560,330,C.panel,C.line,22);
  el('circle',{cx:820,cy:290,r:80,fill:'#4a2a12',stroke:CU,'stroke-width':4},g);el('line',{x1:740,y1:290,x2:900,y2:290,stroke:C.ink,'stroke-width':3,'stroke-dasharray':'6 5'},g);T(g,820,282,'d',34,C.ink,{a:'middle',w:800});
  T(g,1040,265,'S = π . d² / 4',40,C.amber,{a:'middle',w:800});T(g,1040,320,'fil rond',26,C.muted,{a:'middle',w:500});
  g=grp(A(2,0));p.appendChild(g);
  box(g,60,480,1160,100,C.blueSoft,C.blue,22);T(g,640,545,'L en m  ·  S en mm²  ·  ρ en Ω·mm²/m',40,C.ink,{a:'middle',w:800});
};
SCL.p_ex=(p,A)=>difs(p,A,0,{enonce:['Câble de cuivre : 30 m de long, 1,5 mm² de section','Quelle est sa résistance ?'],d:['ρ = 0,0175 Ω·mm²/m','L = 30 m','S = 1,5 mm²'],i:'R (Ω)',f:'R = ρ . L / S',s:['R = 0,0175 × 30 / 1,5','R = 0,35 Ω'],fs:32});
SCL.p_terrain=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,60,230,230,160,C.panel,C.line,18);T(g,175,318,'Source',34,C.ink,{a:'middle',w:700});
  box(g,990,230,230,160,C.panel,C.line,18);T(g,1105,318,'Récepteur',34,C.ink,{a:'middle',w:700});
  tube(g,290,300,700,20,'#4a2a12',CU);T(g,640,270,'câble trop long ou trop fin',30,C.copper,{a:'middle',w:700});
  g=grp(A(0,2.6));p.appendChild(g);
  box(g,420,150,440,70,C.amberSoft,C.amber,18);T(g,640,198,'= une résistance de trop',30,C.amber,{a:'middle',w:800});
  g=grp(A(0,5.2));p.appendChild(g);
  [0,1,2].forEach(i=>{ el('path',{d:`M${470+i*130} 400 q 20 -30 0 -60 q -20 -30 0 -60`,fill:'none',stroke:C.red,'stroke-width':5,'stroke-linecap':'round'},g); });
  T(g,640,470,'le câble chauffe',38,C.red,{a:'middle',w:800});
  g=grp(A(0,7.4));p.appendChild(g);T(g,640,530,'et la tension n’arrive pas entière au récepteur',34,C.ink,{a:'middle',w:700});
};
SCL.p_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,260,210,760,120,'R = ρ . L / S',C.blue,72);
  g=grp(A(0,1.8));p.appendChild(g);
  box(g,120,360,500,120,C.panel,C.line,22);T(g,370,415,'plus long',34,C.ink,{a:'middle',w:700});T(g,370,462,'R monte ↑',34,C.red,{a:'middle',w:800});
  box(g,660,360,500,120,C.panel,C.line,22);T(g,910,415,'plus gros',34,C.ink,{a:'middle',w:700});T(g,910,462,'R baisse ↓',34,C.green,{a:'middle',w:800});
  g=grp(A(1,0));p.appendChild(g);
  box(g,260,520,760,70,C.green,'none',35);T(g,640,568,'À toi de jouer : tableau + 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
