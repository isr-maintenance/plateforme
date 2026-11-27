/* Chapitre 4 — notions générales (scènes locales) */
Object.assign(FIT,{g_intro:600,g_gen:600,g_ddp:540,g_ten:540,g_sens:552,g_recep:540,g_I:540,g_R:540,g_lampes:540,g_synth:540,g_recap:600});
const batt=(g,x,y,w,h)=>{box(g,x,y,w,h,C.panel,C.ink,14);T(g,x+w/2,y+44,'+',40,C.red,{a:'middle',w:800});T(g,x+w/2,y+h-22,'−',48,C.blue,{a:'middle',w:800});};
const meter=(g,cx,cy,L,col)=>{el('circle',{cx,cy,r:46,fill:C.panel,stroke:col,'stroke-width':5},g);T(g,cx,cy+14,L,40,col,{a:'middle',w:800});};
SCL.g_intro=(p,A)=>introS(p,A,'Notions générales','Générateur · tension · courant · résistance',[['U en volts',190],['I en ampères',230],['R en aums',200]],null);
SCL.g_gen=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);batt(g,200,150,200,320);
    g=grp(A(0,1.4));p.appendChild(g);for(let i=0;i<6;i++)el('circle',{cx:230+(i%3)*58,cy:395+Math.floor(i/3)*34,r:12,fill:C.blue},g);T(g,640,400,'borne − : excès d’électrons',32,C.blue,{w:800});
  g=grp(A(0,3.2));p.appendChild(g);T(g,640,250,'borne + : manque d’électrons',32,C.red,{w:800});
  g=grp(A(0,5));p.appendChild(g);['pile','accumulateur','dynamo','alternateur'].forEach((t,i)=>chip(g,500+(i%2)*250,440+Math.floor(i/2)*60,230,t,C.amberSoft,C.amber,26));
};
SCL.g_ddp=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);batt(g,200,160,180,300);
  g=grp(A(0,1.6));p.appendChild(g);meter(g,640,310,'V',C.blue);el('path',{d:'M380 215 H640 V264 M380 405 H640 V356',fill:'none',stroke:C.ink,'stroke-width':4},g);T(g,640,440,'voltmètre : directement aux bornes',26,C.blue,{a:'middle',w:700});
  g=grp(A(0,3.4));p.appendChild(g);T(g,950,250,'tension U',40,C.ink,{a:'middle',w:800});T(g,950,305,'unité : le volt (V)',32,C.blue,{a:'middle',w:700});
};
SCL.g_ten=(p,A)=>{
  [['Pile plate','4,5 V',C.amber],['Batterie de voiture','12 V',C.blue],['Prise de courant','230 V',C.red]].forEach(([a,b,col],i)=>{const g=grp(A(0,i*1.9));p.appendChild(g);const x=60+i*400;box(g,x,150,370,340,C.panel,col,22);T(g,x+185,240,a,32,C.ink,{a:'middle',w:800});T(g,x+185,380,b,80,col,{a:'middle',w:800});});
};
const loopC=(g)=>{el('path',{d:'M300 190 H980 V430 H300 Z',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linejoin':'round'},g);batt(g,245,240,110,140);lampOn(g,980,310,44,true);};
SCL.g_sens=(p,A,ph)=>{
  let g=grp(A(0,0));p.appendChild(g);loopC(g);flow(g,320,960,190,46,9,C.blue,1-ph,false);flow(g,320,960,430,46,9,C.blue,1-ph,false);
  T(g,640,150,'électrons : de − vers +',34,C.blue,{a:'middle',w:800});arrow(g,860,540,420,540,C.blue,6);T(g,640,580,'sens des électrons',26,C.blue,{a:'middle',w:700});
  g=grp(A(1,0));p.appendChild(g);arrow(g,420,505,860,505,C.amber,6);T(g,640,482,'sens conventionnel : de + vers −',30,C.amber,{a:'middle',w:800});
};
SCL.g_recep=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M300 200 H980 V420 H300 Z',fill:'none',stroke:C.red,'stroke-width':6},g);batt(g,245,240,110,140);T(g,640,310,'sans récepteur',34,C.red,{a:'middle',w:800});T(g,640,355,'court-circuit',34,C.red,{a:'middle',w:800});
  g=grp(A(0,2.4));p.appendChild(g);box(g,160,470,960,80,C.panel,C.green,22);T(g,640,525,'le récepteur limite le passage des électrons',34,C.green,{a:'middle',w:800});
};
SCL.g_I=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,180,'Intensité I',54,C.ink,{a:'middle',w:800});T(g,640,235,'nombre d’électrons par seconde',32,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.8));p.appendChild(g);el('path',{d:'M240 330 H520 M760 330 H1040',stroke:C.ink,'stroke-width':5},g);meter(g,640,330,'A',C.green);T(g,640,430,'ampèremètre : en série',28,C.green,{a:'middle',w:700});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,520,'unité : l’ampère (A)',38,C.blue,{a:'middle',w:800});
};
SCL.g_R=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,180,'Résistance R',54,C.ink,{a:'middle',w:800});T(g,640,235,'difficulté offerte au passage du courant',32,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.8));p.appendChild(g);box(g,540,300,200,60,C.amberSoft,C.amber,10);T(g,640,342,'R',32,C.amber,{a:'middle',w:800});meter(g,380,330,'Ω',C.green);arrow(g,430,330,535,330,C.green,3);T(g,380,420,'aummètre : hors tension',26,C.green,{a:'middle',w:700});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,520,'unité : l’aum (Ω)',38,C.blue,{a:'middle',w:800});
};
SCL.g_lampes=(p,A)=>{
  [['25 W',0.109,'plus grande résistance',C.red,60],['100 W',0.435,'plus petite résistance',C.green,330]].forEach(([w,i,t,col,x],k)=>{const g=grp(A(0,k*2.4));p.appendChild(g);const X=60+k*600;box(g,X,140,560,360,C.panel,col,22);lampOn(g,X+280,250,k?50:30,true);T(g,X+280,350,'lampe de '+w,32,C.ink,{a:'middle',w:800});T(g,X+280,405,t,30,col,{a:'middle',w:800});T(g,X+280,455,k?'beaucoup de courant':'peu de courant',26,C.muted,{a:'middle',w:600});});
};
SCL.g_synth=(p,A)=>{
  const R=[['Tension','U','volt (V)','voltmètre','en parallèle'],['Intensité','I','ampère (A)','ampèremètre','en série'],['Résistance','R','aum (Ω)','aummètre','hors tension']];
  let g=grp(A(0,0));p.appendChild(g);[['',60,200],['Symbole',260,130],['Unité',390,230],['Appareil',620,260],['Branchement',880,340]].forEach(([n,x,w])=>{box(g,x,130,w,50,C.blueSoft,C.line,0);T(g,x+w/2,163,n,24,C.blue,{a:'middle',w:700});});
  R.forEach((r,i)=>{const gg=grp(A(0,0.8+i*1.6));p.appendChild(gg);const y=180+i*90;[[60,200],[260,130],[390,230],[620,260],[880,340]].forEach(([x,w],j)=>{box(gg,x,y,w,90,C.panel,C.line,0);T(gg,x+w/2,y+55,r[j],j<2?32:26,j==1?C.amber:C.ink,{a:'middle',w:j<2?800:600});});});
};
SCL.g_recap=(p,A)=>recapS(p,A,[['générateur|d.d.p. en volts',C.amber],['électrons libres|− vers +|conv. : + vers −',C.blue],['U · I · R|volt · ampère · aum',C.green]],'À toi de jouer : tensions, ordre, grandeurs, définitions');
