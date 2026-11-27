/* Chapitre 1 — éclairage d'un local (scènes locales) + aides communes aux chapitres 1 à 5 */
Object.assign(FIT,{e_intro:600,e_besoin:560,e_elem:540,e_ferme:552,e_ouvert:552,e_court:552,e_cond:540,e_tri:540,e_recap:600});
function introS(p,A,title,subt,chips,extra){
  let g=grp(A(0,0));p.appendChild(g);T(g,640,230,title,70,C.ink,{a:'middle',w:800});T(g,640,292,subt,30,C.muted,{a:'middle',w:500});
  g=grp(A(0,0.8));p.appendChild(g);
  const tot=chips.reduce((s,c)=>s+c[1]+30,-30);let x=640-tot/2;chips.forEach(([t,w,f,col])=>{chip(g,x,360,w,t,f||C.blueSoft,col||C.blue,26);x+=w+30;});
  if(extra){g=grp(A(0,2.2));p.appendChild(g);extra(g);}
}
function recapS(p,A,cards,btn,top){
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'À retenir',50,C.ink,{a:'middle',w:800});
  cards.forEach(([t,col],i)=>{const gg=grp(A(0,0.8+i*1.2));p.appendChild(gg);const x=100+i*370;box(gg,x,230,340,190,C.panel,col,20);
    t.split('|').forEach((l,j,arr)=>T(gg,x+170,330-(arr.length-1)*19+j*38,l,27,col,{a:'middle',w:800}));});
  g=grp(A(1,0));p.appendChild(g);box(g,100,470,1080,90,C.green,'none',40);T(g,640,527,btn,29,'#0b2415',{a:'middle',w:800});
}
const lampOn=(g,cx,cy,r,on)=>{if(on)el('circle',{cx,cy,r:r*1.6,fill:'#f5b82e',opacity:0.2},g);el('circle',{cx,cy,r,fill:on?'#5a4410':C.panel,stroke:C.amber,'stroke-width':5},g);el('path',{d:`M${cx-r*0.6} ${cy-r*0.6} L${cx+r*0.6} ${cy+r*0.6} M${cx+r*0.6} ${cy-r*0.6} L${cx-r*0.6} ${cy+r*0.6}`,stroke:on?'#ffe08a':C.amber,'stroke-width':4},g);};
function lampCirc(g,st,ph){
  const col=st.closed?C.ink:C.muted;
  el('path',{d:'M300 190 H560 M700 190 H980 V270 M980 350 V430 H300 V370 M300 250 V190',fill:'none',stroke:col,'stroke-width':5,'stroke-linejoin':'round'},g);
  box(g,245,250,110,120,C.panel,C.ink,12);T(g,300,290,'+',34,C.red,{a:'middle',w:800});T(g,300,345,'−',40,C.blue,{a:'middle',w:800});
  el('circle',{cx:560,cy:190,r:7,fill:C.ink},g);el('circle',{cx:700,cy:190,r:7,fill:C.ink},g);
  if(st.closed)el('line',{x1:560,y1:190,x2:700,y2:190,stroke:C.ink,'stroke-width':5},g);else el('line',{x1:560,y1:190,x2:690,y2:135,stroke:C.muted,'stroke-width':5},g);
  T(g,630,235,'interrupteur',22,C.muted,{a:'middle',w:600});
  if(st.short){el('path',{d:'M980 270 H1110 V350 H980',fill:'none',stroke:C.copper,'stroke-width':7},g);T(g,1120,315,'fil de cuivre',22,C.red,{w:700});}
  lampOn(g,980,310,44,st.closed&&!st.short);T(g,980,385,'lampe',22,C.muted,{a:'middle',w:600});
  if(st.closed&&ph!=null){flow(g,320,540,190,46,8,C.amber,ph,false);flow(g,720,960,190,46,8,C.amber,ph,false);flow(g,320,960,430,46,8,C.amber,1-ph,false);}
}
SCL.e_intro=(p,A)=>introS(p,A,'Éclairage d’un local','Allumer une lampe d’un seul endroit',[['circuit fermé',230],['court-circuit',230],['conducteurs · isolants',330]],g=>{const h=el('g',{transform:'translate(300 372) scale(0.5)'},g);lampCirc(h,{closed:true},null);});
SCL.e_besoin=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,260,130,760,360,C.panel,C.line,12);T(g,640,175,'La chaufferie',32,C.ink,{a:'middle',w:800});
  box(g,960,300,60,190,C.bg,C.muted,6);T(g,990,285,'porte',24,C.muted,{a:'middle',w:600});
  lampOn(g,640,250,34,true);T(g,640,320,'une lampe',26,C.amber,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);box(g,880,240,42,60,C.panel,C.ink,8);el('line',{x1:901,y1:255,x2:901,y2:285,stroke:C.amber,'stroke-width':5},g);T(g,901,335,'interrupteur',22,C.muted,{a:'end',w:600});
  g=grp(A(0,3.4));p.appendChild(g);T(g,640,550,'allumer la lampe d’un seul endroit',38,C.green,{a:'middle',w:800});
};
SCL.e_elem=(p,A)=>{
  const C4=[['Alimentation','source 230 V',C.red],['Conducteur','le fil',C.copper],['Récepteur','la lampe',C.amber],['Commande','l’interrupteur simple',C.blue]];
  C4.forEach(([a,b,col],i)=>{const g=grp(A(Math.floor(i/2),(i%2)*1.6));p.appendChild(g);const x=60+i*295;box(g,x,160,270,300,C.panel,col,22);T(g,x+135,250,a,32,col,{a:'middle',w:800});T(g,x+135,330,b,24,C.ink,{a:'middle',w:600});
    if(i==0){box(g,x+80,360,110,60,C.panel,C.ink,10);T(g,x+135,402,'230 V',28,C.blue,{a:'middle',w:800});}
    if(i==1)el('path',{d:`M${x+45} 395 H${x+225}`,stroke:C.copper,'stroke-width':10,'stroke-linecap':'round'},g);
    if(i==2)lampOn(g,x+135,395,32,true);
    if(i==3){box(g,x+105,370,60,50,C.panel,C.ink,8);el('line',{x1:x+125,y1:385,x2:x+125,y2:410,stroke:C.amber,'stroke-width':5},g);}});
};
SCL.e_ferme=(p,A,ph)=>{let g=grp(A(0,0));p.appendChild(g);lampCirc(g,{closed:true},ph);g=grp(A(0,1.8));p.appendChild(g);T(g,640,520,'circuit fermé  →  la lampe éclaire',44,C.green,{a:'middle',w:800});};
SCL.e_ouvert=(p,A)=>{let g=grp(A(0,0));p.appendChild(g);lampCirc(g,{closed:false},null);g=grp(A(0,1.8));p.appendChild(g);T(g,640,520,'circuit ouvert  →  la lampe s’éteint',44,C.red,{a:'middle',w:800});};
SCL.e_court=(p,A,ph)=>{let g=grp(A(0,0));p.appendChild(g);lampCirc(g,{closed:true,short:true},ph);g=grp(A(0,2));p.appendChild(g);box(g,240,480,800,80,'#3a1512',C.red,22);T(g,640,535,'DANGER : court-circuit',44,C.red,{a:'middle',w:800});};
SCL.e_cond=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('circle',{cx:380,cy:290,r:130,fill:'#2d3f66',stroke:C.blue,'stroke-width':5},g);el('circle',{cx:380,cy:290,r:70,fill:C.copper},g);
  T(g,380,470,'câble en coupe',24,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.4));p.appendChild(g);arrow(g,500,290,640,290,C.copper,4);T(g,660,282,'cuivre',38,C.copper,{w:800});T(g,660,322,'bon conducteur',26,C.ink,{w:600});
  g=grp(A(0,3.4));p.appendChild(g);arrow(g,420,215,640,400,C.blue,4);T(g,660,420,'plastique',38,C.blue,{w:800});T(g,660,460,'isolant : protège l’utilisateur',26,C.ink,{w:600});
};
SCL.e_tri=(p,A)=>{
  const cols=[['Conducteurs',['Cuivre','Aluminium','Or','Argent'],C.amber],['Isolants',['PVC','Caoutchouc','Verre','Porcelaine','Air sec','Papier'],C.blue]];
  cols.forEach(([t,L,col],k)=>{const g=grp(A(0,k*2.4));p.appendChild(g);const x=60+k*600;box(g,x,130,560,420,C.panel,col,22);T(g,x+280,190,t,38,col,{a:'middle',w:800});
    L.forEach((n,i)=>chip(g,x+(i%2?290:40),230+Math.floor(i/2)*84,230,n,col==C.amber?C.amberSoft:C.blueSoft,col,28));});
};
SCL.e_recap=(p,A)=>recapS(p,A,[['alimentation|conducteur|récepteur|commande',C.amber],['fermé : éclaire|ouvert : éteint',C.blue],['court-circuit :|DANGER',C.red]],'À toi de jouer : éléments, 3 situations, tri');
