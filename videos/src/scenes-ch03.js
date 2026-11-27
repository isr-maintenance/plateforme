/* Chapitre 3 — la matière (scènes locales) */
Object.assign(FIT,{mat_intro:600,mat_goutte:540,mat_mol:540,mat_etats:540,mat_atome:552,mat_lois:540,mat_couches:588,mat_libres:552,mat_ion:552,mat_cond:552,mat_isol:540,mat_moyens:540,mat_recap:600});
const atom=(g,cx,cy,sc,opt)=>{opt=opt||{};const rs=[60,100,140].map(r=>r*sc);rs.slice(0,opt.n||3).forEach(r=>el('circle',{cx,cy,r,fill:'none',stroke:C.line,'stroke-width':2},g));
  el('circle',{cx,cy,r:26*sc,fill:C.red,opacity:0.85},g);T(g,cx,cy+8*sc,(opt.p||'+')+'',24*sc,'#fff',{a:'middle',w:800});
  (opt.e||[[0,0],[1,2.2],[2,4.1]]).forEach(([k,a])=>{const r=rs[k];el('circle',{cx:cx+r*Math.cos(a),cy:cy+r*Math.sin(a),r:9*sc,fill:opt.ec||C.blue},g);});};
SCL.mat_intro=(p,A)=>introS(p,A,'La matière','Du courant électrique jusqu’à l’électron',[['molécules',170],['atomes',150],['électrons libres',250]],g=>atom(g,640,500,0.28,{}));
SCL.mat_goutte=(p,A)=>{
  [[1,60,'une goutte'],[2,38,'÷ 2'],[3,22,'÷ 2'],[4,12,'÷ 2 …']].forEach(([i,r,t],k)=>{const g=grp(A(0,k*1.7));p.appendChild(g);const x=190+k*270;el('circle',{cx:x,cy:300,r,fill:'#2d5a9b',stroke:C.blue,'stroke-width':3},g);el('path',{d:`M${x} ${300-r*1.9} L${x-r*0.85} ${300-r*0.55} L${x+r*0.85} ${300-r*0.55} Z`,fill:'#2d5a9b',stroke:C.blue,'stroke-width':3,'stroke-linejoin':'round'},g);T(g,x,420,t,28,C.muted,{a:'middle',w:700});if(k<3)T(g,x+135,310,'→',40,C.muted,{a:'middle',w:800});});
  let g=grp(A(0,7));p.appendChild(g);box(g,230,470,820,80,C.greenSoft||'#12301f',C.green,22);T(g,640,525,'la molécule : encore toutes les propriétés de l’eau',32,C.green,{a:'middle',w:800});
};
SCL.mat_mol=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('circle',{cx:640,cy:290,r:85,fill:C.red,opacity:0.85},g);T(g,640,305,'O',50,'#fff',{a:'middle',w:800});
  [[520,380],[760,380]].forEach(([x,y])=>{el('circle',{cx:x,cy:y,r:50,fill:C.blue,opacity:0.9},g);T(g,x,y+14,'H',36,'#fff',{a:'middle',w:800});el('line',{x1:640,y1:290,x2:x,y2:y,stroke:C.ink,'stroke-width':3,opacity:0.5},g);});
  g=grp(A(0,2));p.appendChild(g);T(g,640,175,'H₂O',60,C.ink,{a:'middle',w:800});T(g,230,300,'2 atomes d’hydrogène',28,C.blue,{a:'middle',w:700});T(g,1050,300,'1 atome d’oxygène',28,C.red,{a:'middle',w:700});
  g=grp(A(0,4));p.appendChild(g);T(g,640,520,'matière  →  molécules  →  atomes',40,C.green,{a:'middle',w:800});
};
SCL.mat_etats=(p,A,ph)=>{
  const pan=(g,x,t,fn)=>{box(g,x,130,370,330,C.panel,C.line,22);T(g,x+185,180,t,34,C.ink,{a:'middle',w:800});fn(x);};
  const dot=(x,y,i,amp)=>el('circle',{cx:x+amp*Math.sin(2*Math.PI*ph+i*1.9),cy:y+amp*Math.cos(2*Math.PI*ph*1+i*2.3),r:15,fill:C.blue},0);
  let g=grp(A(0,0));p.appendChild(g);
  pan(g,60,'Gazeux',x=>{[[110,250],[250,300],[170,380],[310,230],[120,420],[300,400]].forEach(([dx,dy],i)=>{const c=dot(x+dx-60,dy,i,16);g.appendChild(c);});});
  g=grp(A(0,2));p.appendChild(g);
  pan(g,455,'Liquide',x=>{for(let i=0;i<12;i++){const c=dot(x+70+(i%4)*75,260+Math.floor(i/4)*65+(i%3)*8,i,7);g.appendChild(c);}});
  g=grp(A(0,4));p.appendChild(g);
  pan(g,850,'Solide',x=>{for(let i=0;i<12;i++){const c=dot(x+70+(i%4)*75,260+Math.floor(i/4)*65,i,2);g.appendChild(c);}});
  g=grp(A(0,5.6));p.appendChild(g);T(g,640,525,'plus le corps est solide, plus les molécules sont serrées',32,C.green,{a:'middle',w:700});
};
SCL.mat_atome=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);atom(g,420,330,1.6,{});
  g=grp(A(0,1.6));p.appendChild(g);arrow(g,520,330,780,250,C.red,4);T(g,800,250,'noyau',34,C.red,{w:800});T(g,800,288,'protons (+) et neutrons',24,C.ink,{w:600});
  g=grp(A(0,3.4));p.appendChild(g);arrow(g,590,400,780,420,C.blue,4);T(g,800,420,'électrons (−)',34,C.blue,{w:800});T(g,800,458,'tournent autour du noyau',24,C.ink,{w:600});
};
SCL.mat_lois=(p,A)=>{
  const dc=(g,x,y,a,b,rep)=>{[[x-90,a],[x+90,b]].forEach(([cx,s])=>{el('circle',{cx,cy:y,r:36,fill:s=='+'?C.red:C.blue},g);T(g,cx,y+14,s=='+'?'+':'−',44,'#fff',{a:'middle',w:800});});
    if(rep){arrow(g,x-45,y,x-95,y,C.ink,3);arrow(g,x+45,y,x+95,y,C.ink,3);}else{arrow(g,x-95,y,x-45,y,C.ink,3);arrow(g,x+95,y,x+45,y,C.ink,3);}};
  let g=grp(A(0,0));p.appendChild(g);box(g,60,140,560,300,C.panel,C.red,22);dc(g,340,250,'+','+',true);T(g,340,350,'même signe',30,C.ink,{a:'middle',w:800});T(g,340,395,'se repoussent',34,C.red,{a:'middle',w:800});
  g=grp(A(0,2.2));p.appendChild(g);box(g,660,140,560,300,C.panel,C.green,22);dc(g,940,250,'+','−',false);T(g,940,350,'signes contraires',30,C.ink,{a:'middle',w:800});T(g,940,395,'s’attirent',34,C.green,{a:'middle',w:800});
  g=grp(A(0,4.6));p.appendChild(g);T(g,640,510,'atome neutre : autant d’électrons que de protons',36,C.amber,{a:'middle',w:800});
};
SCL.mat_couches=(p,A)=>{
  const L=[['K',2],['L',8],['M',18],['N',32],['O',18],['P',8],['Q',2]];
  L.forEach(([n,v],i)=>{const g=grp(A(0,i*0.9));p.appendChild(g);const y=140+i*58;T(g,200,y+38,n,34,C.amber,{a:'middle',w:800});box(g,260,y+6,v*20,44,C.blue,'none',22);T(g,260+v*20+20,y+40,String(v),32,C.ink,{w:800});});
  let g=grp(A(0,7.4));p.appendChild(g);T(g,640,578,'2 – 8 – 18 – 32 – 18 – 8 – 2',32,C.green,{a:'middle',w:800});
};
SCL.mat_libres=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);atom(g,420,340,1.7,{n:3,e:[[0,0.5],[1,2.5],[1,4.5],[2,1],[2,3.5],[2,5.4]]});
  g=grp(A(0,1.8));p.appendChild(g);
  [[2,1],[2,3.5],[2,5.4]].forEach(([k,a])=>{const r=[60,100,140][k]*1.7;el('circle',{cx:420+r*Math.cos(a),cy:340+r*Math.sin(a),r:18,fill:'none',stroke:C.amber,'stroke-width':5},g);});
  T(g,820,250,'couches extérieures',32,C.amber,{w:800});T(g,820,292,'électrons libres',30,C.ink,{w:700});T(g,820,330,'moins attirés par le noyau',24,C.muted,{w:600});
  g=grp(A(0,4));p.appendChild(g);T(g,820,420,'couches intérieures',32,C.blue,{w:800});T(g,820,462,'électrons internes',30,C.ink,{w:700});T(g,820,500,'quittent difficilement leur orbite',24,C.muted,{w:600});
};
SCL.mat_ion=(p,A)=>{
  const bx=(g,x,t,sub1,col,ex)=>{box(g,x,140,370,390,C.panel,col,22);T(g,x+185,190,t,30,col,{a:'middle',w:800});atom(g,x+185,340,1.0,{n:2,p:'3+',e:ex});T(g,x+185,490,sub1,26,C.ink,{a:'middle',w:700});};
  let g=grp(A(0,0));p.appendChild(g);bx(g,60,'Atome neutre','3 protons · 3 électrons',C.muted,[[0,0.5],[0,3.6],[1,2]]);
  g=grp(A(0,2));p.appendChild(g);bx(g,455,'Ion positif','il a perdu un électron',C.red,[[0,0.5],[0,3.6]]);
  g=grp(A(0,4.2));p.appendChild(g);bx(g,850,'Ion négatif','il a gagné un électron',C.blue,[[0,0.5],[0,3.6],[1,2],[1,4.4]]);
};
SCL.mat_cond=(p,A,ph)=>{
  const pan=(g,x,t,ord)=>{box(g,x,140,560,370,C.panel,C.line,22);T(g,x+280,190,t,32,C.ink,{a:'middle',w:800});
    for(let r=0;r<2;r++)for(let c=0;c<5;c++){el('circle',{cx:x+80+c*100,cy:260+r*130,r:24,fill:C.red,opacity:0.75},g);T(g,x+80+c*100,269+r*130,'+',26,'#fff',{a:'middle',w:800});}
    for(let i=0;i<8;i++){const a=2*Math.PI*ph+i*2.1;const bx=x+60+i*65,by=325;
      if(ord){const xx=x+40+((i*65+ph*65)%(8*65));el('circle',{cx:xx,cy:325,r:10,fill:C.blue},g);}else el('circle',{cx:bx+16*Math.sin(a),cy:by+40*Math.cos(a*1.3+i),r:10,fill:C.blue},g);}};
  let g=grp(A(0,0));p.appendChild(g);pan(g,60,'Au hasard : aucun courant',false);
  g=grp(A(0,2.6));p.appendChild(g);pan(g,660,'Dans un sens : le courant',true);
  g=grp(A(0,5));p.appendChild(g);T(g,640,550,'le courant = le déplacement des électrons libres',34,C.green,{a:'middle',w:800});
};
SCL.mat_isol=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);atom(g,260,320,1.1,{n:2,e:[[0,0.5],[0,3.6],[1,2],[1,4.4]]});T(g,260,500,'tous les électrons retenus',26,C.ink,{a:'middle',w:700});
  g=grp(A(0,1.8));p.appendChild(g);T(g,740,190,'Un isolant protège moins bien…',32,C.ink,{a:'middle',w:800});
  ['gaine entaillée','eau et sel','tension très haute','chaleur élevée'].forEach((t,i)=>{const gg=grp(A(0,2.6+i*1.2));p.appendChild(gg);chip(gg,560+(i%2)*270,250+Math.floor(i/2)*80,250,t,'#3a1512',C.red,24);});
  g=grp(A(0,7.6));p.appendChild(g);T(g,740,470,'on remplace un câble abîmé',32,C.green,{a:'middle',w:800});
};
SCL.mat_moyens=(p,A)=>{
  [['Choc','briquet piézo',C.amber],['Chaleur','thermocouple',C.red],['Frottement','électricité statique',C.blue],['Chimie','pile, accumulateur',C.green],['Magnétisme','dynamo',C.amber],['Lumière','cellule photovoltaïque',C.blue]].forEach(([a,b,col],i)=>{const g=grp(A(0,i*1.1));p.appendChild(g);const x=60+(i%3)*400,y=140+Math.floor(i/3)*210;box(g,x,y,370,190,C.panel,col,20);T(g,x+185,y+85,a,38,col,{a:'middle',w:800});T(g,x+185,y+135,b,26,C.ink,{a:'middle',w:600});});
};
SCL.mat_recap=(p,A)=>recapS(p,A,[['molécule|atome|noyau',C.amber],['électrons libres|ions',C.blue],['courant =|électrons libres|en mouvement',C.green]],'À toi de jouer : zoom, états, couches, atome, libres');
