/* Chapitre 11 — l'effet Joule (scènes locales) */
Object.assign(FIT,{j_intro:600,j_chaleur:540,j_w:600,j_p:600,j_carre:560,j_inc:520,j_fus:540,j_cc:540,j_app:540,j_ex:565,j_ex2:565,j_recap:600});
const coilJ=(p,x,y,w,h,col,n,glow)=>{let d=`M${x} ${y}`;const s=w/(n*2);for(let i=0;i<n*2;i++)d+=` L${x+s*(i+0.5)} ${y+(i%2?h/2:-h/2)}`;d+=` L${x+w} ${y}`;
  if(glow)el('path',{d,fill:'none',stroke:col,'stroke-width':18,opacity:glow*0.35,'stroke-linejoin':'round'},p);el('path',{d,fill:'none',stroke:col,'stroke-width':7,'stroke-linejoin':'round'},p);};
SCL.j_intro=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  T(g,640,230,'L’effet Joule',74,C.ink,{a:'middle',w:800});T(g,640,292,'Du courant à la chaleur',32,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  chip(g,280,360,220,'W = U . I . t',C.blueSoft,C.blue,26);chip(g,530,360,250,'W = R . I² . t',C.amberSoft,C.amber,26);chip(g,810,360,200,'P = R . I²',C.amberSoft,C.amber,26);
  g=grp(A(0,2.2));p.appendChild(g);coilJ(g,440,500,400,70,C.red,6,1);
};
SCL.j_chaleur=(p,A,ph)=>{
  let g=grp(A(0,0));p.appendChild(g);
  const gl=0.6+0.4*Math.sin(2*Math.PI*ph);
  box(g,200,130,880,300,C.panel,C.line,22);coilJ(g,300,330,680,80,C.red,8,gl);
  for(let k=0;k<5;k++){const x=360+k*140,o=((ph+k*0.2)%1);el('path',{d:`M${x} ${290-o*100} q18 -22 0 -44 q-18 -22 0 -44`,fill:'none',stroke:C.amber,'stroke-width':5,opacity:(1-o)*0.9,'stroke-linecap':'round'},g);}
  T(g,640,180,'courant I  →  chaleur',34,C.ink,{a:'middle',w:700});
  g=grp(A(0,2.4));p.appendChild(g);
  ['grille-pain','bouilloire','radiateur','chauffe-eau'].forEach((n,i)=>chip(g,150+i*270,470,240,n,C.amberSoft,C.amber,26));
};
SCL.j_w=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);fbig(g,260,130,760,140,'W = U . I . t',C.blue,84);
  g=grp(A(0,1.6));p.appendChild(g);T(g,640,330,'joules (J) · volts (V) · ampères (A) · secondes (s)',32,C.muted,{a:'middle',w:600});
  g=grp(A(1,0));p.appendChild(g);
  box(g,60,110,1160,470,C.panel,C.line,22);
  T(g,640,215,'U = R . I',44,C.ink,{a:'middle',w:800});
  g=grp(A(1,1.6));p.appendChild(g);T(g,640,300,'W = R . I . I . t',50,C.ink,{a:'middle',w:800});
  g=grp(A(1,3.6));p.appendChild(g);fbig(g,300,350,680,140,'W = R . I'+sup('2')+' . t',C.amber,80,C.amberSoft);
};
SCL.j_p=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,150,'La puissance Joule',48,C.ink,{a:'middle',w:800});fbig(g,330,180,620,140,'P = R . I'+sup('2'),C.amber,86,C.amberSoft);
  g=grp(A(0,2));p.appendChild(g);box(g,60,360,1160,220,C.panel,C.line,22);tri(g,260,385,170,'P','R','I'+sup('2'));
  T(g,560,460,'R = P / I'+sup('2'),46,C.ink,{w:800});T(g,560,545,'I = √( P / R )',46,C.blue,{w:800});
};
SCL.j_carre=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,150,'Une résistance de 10 Ω',44,C.ink,{a:'middle',w:800});
  g=grp(A(0,1.2));p.appendChild(g);box(g,150,190,460,330,C.panel,C.line,22);T(g,380,240,'I = 2 A',40,C.blue,{a:'middle',w:800});box(g,330,470-40,100,40,C.amber,'none',8);T(g,380,300,'P = 10 × 2² = 40 W',28,C.ink,{a:'middle',w:700});
  g=grp(A(0,3.4));p.appendChild(g);box(g,670,190,460,330,C.panel,C.line,22);T(g,900,240,'I = 4 A',40,C.blue,{a:'middle',w:800});box(g,850,470-160,100,160,C.red,'none',8);T(g,900,300,'P = 10 × 4² = 160 W',28,C.ink,{a:'middle',w:700});
  g=grp(A(0,5.6));p.appendChild(g);T(g,640,560,'I × 2  →  P × 4',46,C.green,{a:'middle',w:800});
};
SCL.j_inc=(p,A)=>{
  [['Bobinages','qui chauffent','→ ventilateurs',C.amber],['Mauvais contacts','résistance de contact','→ ça chauffe',C.amber],['Court-circuit','courant énorme','→ fil au rouge',C.red]].forEach(([a,b,c,col],k)=>{const x=60+k*390,g=grp(A(0,k*2));p.appendChild(g);
    box(g,x,150,370,330,C.panel,col,22);T(g,x+185,230,a,36,col,{a:'middle',w:800});T(g,x+185,310,b,28,C.ink,{a:'middle',w:600});T(g,x+185,400,c,32,C.muted,{a:'middle',w:700});});
};
SCL.j_fus=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,150,200,980,150,C.panel,C.line,22);el('line',{x1:200,y1:275,x2:420,y2:275,stroke:C.copper,'stroke-width':8},g);el('line',{x1:860,y1:275,x2:1080,y2:275,stroke:C.copper,'stroke-width':8},g);
  box(g,420,245,440,60,'#141922',C.ink,14);el('line',{x1:440,y1:275,x2:840,y2:275,stroke:C.amber,'stroke-width':3},g);
  T(g,640,235,'fil calibré',24,C.amber,{a:'middle',w:700});
  g=grp(A(0,2));p.appendChild(g);T(g,640,420,'Le fusible : le point faible prévu du circuit',36,C.ink,{a:'middle',w:700});
  g=grp(A(0,4.4));p.appendChild(g);box(g,240,460,800,90,'#3a1512',C.red,22);T(g,640,520,'✕  Ne jamais « ponter » un fusible',38,C.red,{a:'middle',w:800});
};
SCL.j_cc=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,60,150,560,340,C.panel,C.line,22);T(g,340,200,'Ampoule 40 W · 230 V',30,C.ink,{a:'middle',w:700});lampe(g,340,290,42,true);lcdBox(g,230,360,220,'0,17','A');T(g,340,460,'courant normal',24,C.muted,{a:'middle',w:600});
  g=grp(A(0,2.6));p.appendChild(g);
  box(g,660,150,560,340,C.panel,C.red,22);T(g,940,200,'Court-circuit · Rcc = 0,1 Ω',30,C.red,{a:'middle',w:700});coilJ(g,780,290,320,50,C.red,5,1);lcdBox(g,810,360,260,'2 300','A');T(g,940,460,'I = U / Rcc',24,C.muted,{a:'middle',w:600});
  g=grp(A(0,5));p.appendChild(g);T(g,640,550,'plus de 13 000 fois le courant normal',40,C.green,{a:'middle',w:800});
};
SCL.j_app=(p,A)=>{
  [['Chauffage','fer à repasser · chauffe-eau · bouilloire · radiateur',C.amber],['Incandescence','filament de tungstène, vers 2 500 °C',C.amber],['Fusible','un fil calibré qui fond si I est trop grand',C.green]].forEach(([a,b,col],k)=>{const g=grp(A(0,k*2.2));p.appendChild(g);
    box(g,100,150+k*130,1080,110,C.panel,col,20);T(g,140,215+k*130,a,38,col,{w:800});T(g,440,213+k*130,b,26,C.ink,{w:600});});
};
SCL.j_ex=(p,A)=>difs(p,A,0,{enonce:['Grille-pain : P = 1 500 W pendant 4 minutes','Quelle énergie Joule dégage-t-il ?'],d:['P = 1 500 W','t = 4 min = 240 s'],i:'W (J)',f:'W = P . t',s:['W = 1 500 × 240','W = 360 000 J']});
SCL.j_ex2=(p,A)=>difs(p,A,0,{one:true,enonce:['Élément de chauffe : R = 23 Ω, I = 10 A','Quelle puissance Joule ?'],d:['R = 23 Ω','I = 10 A'],i:'P (W)',f:'P = R . I²',s:['P = 23 × 10²','P = 2 300 W'],sAt:1.6});
SCL.j_recap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});fbig(g,330,200,620,120,'P = R . I'+sup('2'),C.amber,72,C.amberSoft);
  g=grp(A(0,1.8));p.appendChild(g);
  [['W = U . I . t',C.blue],['W = R . I² . t',C.amber],['P = R . I²',C.green]].forEach(([t,col],i)=>{const x=100+i*370;box(g,x,360,340,110,C.panel,col,20);T(g,x+170,430,t,38,col,{a:'middle',w:800});});
  g=grp(A(1,0));p.appendChild(g);
  box(g,170,520,940,70,C.green,'none',35);T(g,640,568,'À toi de jouer : court-circuit, tri et 3 exercices',30,'#0b2415',{a:'middle',w:800});
};
