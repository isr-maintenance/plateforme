/* Chapitre 5 — appareils de mesures (scènes locales) */
Object.assign(FIT,{a_intro:600,a_volt:552,a_avant:540,a_classe:540,a_calibre:552,a_etapes:552,a_amp:552,a_secu:540,a_ohm:552,a_fus:540,a_recap:600});
const cadran=(g,cx,cy,r,ang,lbl)=>{el('path',{d:`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`,fill:'none',stroke:C.muted,'stroke-width':4},g);for(let i=0;i<=10;i++){const a=Math.PI*(1-i/10);el('line',{x1:cx+r*Math.cos(a),y1:cy-r*Math.sin(a),x2:cx+(r-14)*Math.cos(a),y2:cy-(r-14)*Math.sin(a),stroke:C.muted,'stroke-width':3},g);}
  const a=Math.PI*(1-ang);el('line',{x1:cx,y1:cy,x2:cx+(r-10)*Math.cos(a),y2:cy-(r-10)*Math.sin(a),stroke:C.red,'stroke-width':5,'stroke-linecap':'round'},g);el('circle',{cx,cy,r:9,fill:C.ink},g);if(lbl)T(g,cx,cy+44,lbl,28,C.ink,{a:'middle',w:800});};
SCL.a_intro=(p,A)=>introS(p,A,'Les appareils de mesures','Voltmètre · ampèremètre · aummètre',[['V en parallèle',230,C.blueSoft,C.blue],['A en série',200,C.amberSoft,C.amber],['Ω hors tension',250,C.blueSoft,C.green]],null);
SCL.a_volt=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M300 190 H980 V430 H300 Z',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linejoin':'round'},g);batt(g,245,240,110,140);box(g,900,270,160,80,C.amberSoft,C.amber,12);T(g,980,322,'récepteur',24,C.amber,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);el('path',{d:'M980 230 H1160 V264 M1160 356 V390 H980',fill:'none',stroke:C.blue,'stroke-width':4,'stroke-dasharray':'8 6'},g);meter(g,1160,310,'V',C.blue);
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,540,'voltmètre : en parallèle, aux bornes à mesurer',34,C.blue,{a:'middle',w:800});
};
SCL.a_avant=(p,A)=>{
  [['Le genre','tension alternative (AC)|ou continue (DC)',C.amber],['La classe','précision de l’appareil',C.blue],['Le calibre','toujours supérieur|à la tension mesurée',C.green]].forEach(([a,b,col],i)=>{const g=grp(A(0,i*1.9));p.appendChild(g);const x=60+i*400;box(g,x,150,370,330,C.panel,col,22);T(g,x+185,250,a,40,col,{a:'middle',w:800});b.split('|').forEach((l,j)=>T(g,x+185,340+j*40,l,26,C.ink,{a:'middle',w:600}));});
};
SCL.a_classe=(p,A)=>{
  [['Classe 0,1 · 0,2 · 0,5','mesures précises','laboratoire',C.blue],['Classe 1 · 1,5','mesures courantes','installations',C.amber]].forEach(([a,b,c,col],i)=>{const g=grp(A(0,i*2.2));p.appendChild(g);const x=60+i*600;box(g,x,150,560,310,C.panel,col,22);T(g,x+280,240,a,36,col,{a:'middle',w:800});T(g,x+280,330,b,34,C.ink,{a:'middle',w:700});T(g,x+280,380,c,30,C.muted,{a:'middle',w:600});});
  let g=grp(A(0,5));p.appendChild(g);T(g,640,530,'plus le chiffre est petit, plus l’appareil est précis',34,C.green,{a:'middle',w:800});
};
SCL.a_calibre=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'Tension à mesurer : 230 V',46,C.ink,{a:'middle',w:800});
  [[3,'3 V'],[30,'30 V'],[300,'300 V'],[600,'600 V']].forEach(([v,t],i)=>{const gg=grp(A(0,1.2+i*0.6));p.appendChild(gg);chip(gg,160+i*250,260,200,'calibre '+t,C.panel,C.muted,24);});
  g=grp(A(0,4));p.appendChild(g);[0,1].forEach(i=>{el('line',{x1:165+i*250,y1:285,x2:355+i*250,y2:285,stroke:C.red,'stroke-width':5},g);});
  g=grp(A(0,5.2));p.appendChild(g);el('rect',{x:652,y:254,width:216,height:62,rx:31,fill:'none',stroke:C.green,'stroke-width':5},g);T(g,760,380,'calibre 300 V : supérieur à 230 V',30,C.green,{a:'middle',w:800});
  g=grp(A(0,7));p.appendChild(g);box(g,160,440,960,90,C.panel,C.amber,22);T(g,640,498,'tension inconnue : on commence par le plus élevé',34,C.amber,{a:'middle',w:800});
};
SCL.a_etapes=(p,A)=>{
  ['Placer l’appareil dans la bonne position','Vérifier le zéro de l’aiguille','Raccorder en parallèle','Choisir l’échelle selon le calibre','Lire en face du cadran'].forEach((t,i)=>{const g=grp(A(0,i*1.7));p.appendChild(g);box(g,160,140+i*82,960,70,C.panel,C.line,16);el('circle',{cx:215,cy:175+i*82,r:24,fill:C.amber},g);T(g,215,185+i*82,String(i+1),28,'#0b0b0b',{a:'middle',w:800});T(g,270,186+i*82,t,32,C.ink,{w:700});});
};
SCL.a_amp=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M300 190 H560 M720 190 H980 V430 H300 V190',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linejoin':'round'},g);batt(g,245,240,110,140);box(g,880,270,200,80,C.amberSoft,C.amber,12);T(g,980,322,'récepteur',26,C.amber,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);meter(g,640,190,'A',C.green);T(g,640,125,'dans le circuit',26,C.green,{a:'middle',w:700});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,540,'ampèremètre : en série, tout le courant le traverse',34,C.green,{a:'middle',w:800});
};
SCL.a_secu=(p,A)=>{
  [['Vérifier le raccordement','avant la mise sous tension',C.green],['Vérifier le calibre','',C.green],['Respecter la polarité','en courant continu',C.green],['Jamais en haute tension','avec un appareil d’atelier',C.red]].forEach(([a,b,col],i)=>{const g=grp(A(0,i*1.9));p.appendChild(g);const x=60+(i%2)*600,y=140+Math.floor(i/2)*200;box(g,x,y,560,180,C.panel,col,20);T(g,x+280,y+85,a,34,col,{a:'middle',w:800});if(b)T(g,x+280,y+135,b,26,C.ink,{a:'middle',w:600});});
};
SCL.a_ohm=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,60,130,1160,100,'#3a1512',C.red,22);T(g,640,195,'toujours hors tension',44,C.red,{a:'middle',w:800});
  g=grp(A(0,1.8));p.appendChild(g);box(g,100,260,500,290,C.panel,C.line,22);cadran(g,350,470,120,1,'∞');T(g,350,305,'pointes séparées',28,C.ink,{a:'middle',w:700});
  g=grp(A(0,3.6));p.appendChild(g);box(g,680,260,500,290,C.panel,C.line,22);cadran(g,930,470,120,0,'0');T(g,930,305,'pointes en contact',28,C.ink,{a:'middle',w:700});
};
SCL.a_fus=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,360,150,560,110,C.panel,C.line,22);box(g,430,185,420,40,'#141922',C.ink,10);el('line',{x1:450,y1:205,x2:830,y2:205,stroke:C.amber,'stroke-width':3},g);T(g,640,305,'un fusible qui a l’air bon',32,C.ink,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);box(g,100,350,500,190,C.panel,C.green,22);T(g,350,410,'≈ 0',60,C.green,{a:'middle',w:800});T(g,350,470,'il est bon',30,C.green,{a:'middle',w:700});
  g=grp(A(0,3.6));p.appendChild(g);box(g,680,350,500,190,C.panel,C.red,22);T(g,930,410,'∞',72,C.red,{a:'middle',w:800});T(g,930,470,'il est coupé',30,C.red,{a:'middle',w:700});
};
SCL.a_recap=(p,A)=>recapS(p,A,[['voltmètre|en parallèle',C.blue],['ampèremètre|en série',C.amber],['aummètre|hors tension',C.green]],'À toi de jouer : classe, sécurité, quel appareil');
