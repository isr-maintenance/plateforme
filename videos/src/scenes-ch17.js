/* Chapitre 17 — les piles */
Object.assign(FIT,{pl_intro:600,pl_gen:540,pl_elec:560,pl_fam:540,pl_pol:560,pl_seche:560,pl_bouton:540,pl_carac:540,pl_recap:600});
const becher=(g,x,y,w,h,pol,bub)=>{box(g,x,y,w,h,'#10243a',C.blue,18);el('rect',{x:x+w*0.2,y:y-60,width:36,height:h*0.8+60,fill:C.copper,rx:4},g);el('rect',{x:x+w*0.8-36,y:y-60,width:36,height:h*0.8+60,fill:'#9aa3b2',rx:4},g);
  T(g,x+w*0.2+18,y-74,'+ cuivre',26,C.copper,{a:'middle',w:800});T(g,x+w*0.8-18,y-74,'− zinc',26,C.muted,{a:'middle',w:800});
  if(bub)for(let i=0;i<9;i++)el('circle',{cx:x+w*0.2+18+(i%3-1)*16,cy:y+h*0.7-Math.floor(i/3)*38-(i%2)*8,r:7,fill:'#bfe3ff',opacity:0.9},g);};
SCL.pl_intro=(p,A)=>introS(p,A,'Les piles','Générateurs électrochimiques',[['f.é.m.',130,C.blueSoft,C.blue],['électrodes',170,C.amberSoft,C.amber],['polarisation',190,C.blueSoft,C.green]],null);
SCL.pl_gen=(p,A)=>{
  [['f.é.m.','force électromotrice','mesurée à vide, sans courant',C.blue],['r','résistance interne','les pertes dans le générateur',C.amber]].forEach(([a,b,c,col],i)=>{const g=grp(A(0,i*2.4));p.appendChild(g);const x=60+i*600;box(g,x,150,560,370,C.panel,col,22);T(g,x+280,260,a,90,col,{a:'middle',w:800});T(g,x+280,340,b,34,C.ink,{a:'middle',w:800});T(g,x+280,400,c,26,C.muted,{a:'middle',w:600});});
};
SCL.pl_elec=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);becher(g,160,250,420,260);T(g,370,548,'électrolyte : eau + acide sulfurique',24,C.blue,{a:'middle',w:600});
  g=grp(A(0,1.8));p.appendChild(g);meter(g,860,330,'V',C.green);T(g,860,420,'≈ 1,08 V',44,C.green,{a:'middle',w:800});T(g,860,470,'ne dépend pas de la taille des électrodes',22,C.muted,{a:'middle',w:600});
};
SCL.pl_fam=(p,A)=>{
  [['Pile','générateur primaire','réaction irréversible','→',C.amber],['Accumulateur','générateur secondaire','se recharge','⇄',C.green]].forEach(([a,b,c,s,col],i)=>{const g=grp(A(0,i*2.2));p.appendChild(g);const x=60+i*600;box(g,x,150,560,370,C.panel,col,22);T(g,x+280,230,a,46,col,{a:'middle',w:800});T(g,x+280,310,b,30,C.ink,{a:'middle',w:700});T(g,x+280,400,s,90,col,{a:'middle',w:800});T(g,x+280,470,c,28,C.ink,{a:'middle',w:700});});
};
SCL.pl_pol=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);becher(g,160,250,420,260,0,true);T(g,370,548,'bulles d’hydrogène sur le cuivre',24,C.blue,{a:'middle',w:600});
  g=grp(A(0,1.8));p.appendChild(g);T(g,860,300,'pile polarisée',44,C.red,{a:'middle',w:800});T(g,860,350,'la f.é.m. chute',28,C.ink,{a:'middle',w:700});
  g=grp(A(1,0));p.appendChild(g);box(g,680,420,360,100,C.panel,C.green,18);T(g,860,462,'dépolarisant',32,C.green,{a:'middle',w:800});T(g,860,500,'avide d’hydrogène',24,C.ink,{a:'middle',w:600});
};
SCL.pl_seche=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,230,200,260,340,'#222a36','#5a6577',16);box(g,250,220,220,300,'#2a303b',C.muted,12);box(g,300,235,120,270,'#0d0f12',C.ink,10);box(g,340,150,40,60,C.amber,'none',6);T(g,360,138,'+',34,C.red,{a:'middle',w:800});
  el('rect',{x:310,y:245,width:100,height:250,fill:'#2b2214',opacity:0.9},g);el('rect',{x:343,y:215,width:34,height:280,fill:'#0b0b0b'},g);
  [['conteneur en acier',470,230,'#9aa3b2'],['zinc : pôle −',470,300,C.muted],['électrolyte en gel',470,370,C.blue],['dépolarisant',470,440,C.amber],['crayon de charbon',470,510,C.ink]].forEach(([t,x,y,col],i)=>{const gg=grp(A(0,0.8+i*1.3));p.appendChild(gg);T(gg,x+260,y,t,28,col,{w:700});el('line',{x1:x-60+(i*8),y1:y-8,x2:x+245,y2:y-8,stroke:col,'stroke-width':2,opacity:0.6},gg);});
  T(g,360,580,'capsule en laiton : pôle +',24,C.red,{a:'middle',w:700});
};
SCL.pl_bouton=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('ellipse',{cx:420,cy:340,rx:150,ry:150,fill:'#9aa3b2'},g);el('ellipse',{cx:420,cy:340,rx:128,ry:128,fill:'#c9ced8'},g);T(g,420,355,'CR 2032',36,'#222',{a:'middle',w:800});
  g=grp(A(0,1.8));p.appendChild(g);arrow(g,270,520,570,520,C.amber,3);arrow(g,570,520,270,520,C.amber,3);T(g,420,560,'20 mm',30,C.amber,{a:'middle',w:800});
  box(g,780,300,220,36,'#9aa3b2','none',8);arrow(g,1050,300,1050,336,C.amber,3);arrow(g,1050,336,1050,300,C.amber,3);T(g,1075,326,'3,2 mm',26,C.amber,{w:800});
  g=grp(A(0,3.6));p.appendChild(g);T(g,780,420,'au mercure ou à l’argent',28,C.ink,{w:700});T(g,780,470,'l’oxygène de l’oxyde neutralise',26,C.muted,{w:600});T(g,780,508,'l’hydrogène : pas de polarisation',26,C.green,{w:700});
};
SCL.pl_carac=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'Tensions courantes',36,C.ink,{a:'middle',w:800});
  ['1,5 V','3 V','4,5 V','6 V','9 V'].forEach((t,i)=>{const gg=grp(A(0,0.8+i*0.6));p.appendChild(gg);chip(gg,140+i*210,220,180,t,C.amberSoft,C.amber,34);});
  g=grp(A(0,4.4));p.appendChild(g);box(g,240,360,360,140,C.panel,C.blue,20);T(g,420,430,'tension',34,C.blue,{a:'middle',w:800});T(g,420,475,'en volts (V)',26,C.ink,{a:'middle',w:600});
  box(g,680,360,360,140,C.panel,C.green,20);T(g,860,430,'capacité',34,C.green,{a:'middle',w:800});T(g,860,475,'en ampères-heures (Ah)',26,C.ink,{a:'middle',w:600});
};
SCL.pl_recap=(p,A)=>recapS(p,A,[['f.é.m. à vide|résistance interne r',C.blue],['pile irréversible|accumulateur|rechargeable',C.amber],['dépolarisant|contre la polarisation',C.green]],'À toi de jouer : pile ou accumulateur, ordre, pile sèche');
