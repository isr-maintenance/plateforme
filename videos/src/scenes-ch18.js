/* Chapitre 18 — les accumulateurs */
Object.assign(FIT,{ac_intro:600,ac_princ:560,ac_charge:560,ac_organes:540,ac_gel:540,ac_tens:560,ac_danger:540,ac_cap:540,ac_ind:560,ac_recap:600});
const accu=(g,x,y,w,h,cells)=>{box(g,x,y,w,h,C.panel,C.ink,14);box(g,x+w*0.12,y-26,36,26,C.red,'none',4);box(g,x+w*0.78,y-26,36,26,C.blue,'none',4);T(g,x+w*0.12+18,y-34,'+',26,C.red,{a:'middle',w:800});T(g,x+w*0.78+18,y-34,'−',30,C.blue,{a:'middle',w:800});
  for(let i=0;i<cells;i++){const cw=(w-20)/cells;box(g,x+10+i*cw,y+h*0.35,cw-6,h*0.55,'#10243a',C.blue,6);}};
SCL.ac_intro=(p,A)=>introS(p,A,'Les accumulateurs','Charge · décharge · tensions · état de charge',[['réversible',170,C.blueSoft,C.blue],['2,4 V par élément',270,C.amberSoft,C.amber],['indices',140,C.blueSoft,C.green]],null);
SCL.ac_princ=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,60,170,560,340,C.panel,C.red,22);T(g,340,240,'CHARGE',42,C.red,{a:'middle',w:800});T(g,340,330,'énergie électrique',30,C.ink,{a:'middle',w:700});T(g,340,380,'↓',50,C.red,{a:'middle',w:800});T(g,340,450,'énergie chimique stockée',30,C.ink,{a:'middle',w:700});
  g=grp(A(0,2.6));p.appendChild(g);box(g,660,170,560,340,C.panel,C.green,22);T(g,940,240,'DÉCHARGE',42,C.green,{a:'middle',w:800});T(g,940,330,'énergie chimique',30,C.ink,{a:'middle',w:700});T(g,940,380,'↓',50,C.green,{a:'middle',w:800});T(g,940,450,'courant restitué',30,C.ink,{a:'middle',w:700});
};
SCL.ac_charge=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,140,250,260,200,C.panel,C.amber,18);T(g,270,330,'chargeur',34,C.amber,{a:'middle',w:800});T(g,270,375,'courant continu',24,C.muted,{a:'middle',w:600});T(g,190,285,'+',34,C.red,{a:'middle',w:800});T(g,350,285,'−',38,C.blue,{a:'middle',w:800});
  accu(g,800,260,300,190,3);
  el('path',{d:'M190 250 V190 H845 V234 M350 250 V170 H1045 V234',fill:'none',stroke:C.ink,'stroke-width':4},g);
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,540,'+ sur +   ·   − sur −',44,C.green,{a:'middle',w:800});
};
SCL.ac_organes=(p,A)=>{
  [['Le bac','plastique résistant aux acides',C.blue],['L’électrolyte','eau + acide sulfurique',C.amber],['Les électrodes','grilles de plomb',C.red],['Les séparateurs','feuilles microporeuses',C.green]].forEach(([a,b,col],i)=>{const g=grp(A(0,i*1.7));p.appendChild(g);const x=60+(i%2)*600,y=140+Math.floor(i/2)*205;box(g,x,y,560,185,C.panel,col,20);T(g,x+280,y+78,a,40,col,{a:'middle',w:800});T(g,x+280,y+130,b,26,C.ink,{a:'middle',w:600});});
};
SCL.ac_gel=(p,A)=>{
  [['Électrolyte liquide','garder la batterie horizontale','rajouter de l’eau distillée','vapeurs acides',C.red],['Électrolyte gélifié','gel de silice','pas d’entretien','soupapes de sécurité',C.green]].forEach(([a,b,c,d,col],i)=>{const g=grp(A(0,i*2.4));p.appendChild(g);const x=60+i*600;box(g,x,150,560,370,C.panel,col,22);T(g,x+280,225,a,38,col,{a:'middle',w:800});[b,c,d].forEach((t,j)=>T(g,x+280,320+j*55,t,28,C.ink,{a:'middle',w:600}));});
};
SCL.ac_tens=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);accu(g,100,230,360,220,6);T(g,280,500,'6 éléments',30,C.ink,{a:'middle',w:800});
  g=grp(A(0,1.4));p.appendChild(g);box(g,560,170,620,140,C.panel,C.green,20);T(g,870,235,'pleine charge',28,C.muted,{a:'middle',w:600});T(g,870,290,'6 × 2,4 V = 14,4 V',44,C.green,{a:'middle',w:800});
  g=grp(A(0,3.4));p.appendChild(g);box(g,560,340,620,140,C.panel,C.red,20);T(g,870,405,'seuil minimum',28,C.muted,{a:'middle',w:600});T(g,870,460,'6 × 1,8 V = 10,8 V',44,C.red,{a:'middle',w:800});
};
SCL.ac_danger=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,160,230,960,200,'#3a1512',C.red,26);T(g,640,320,'jamais en dessous de',38,C.ink,{a:'middle',w:700});T(g,640,390,'1,8 V par élément',64,C.red,{a:'middle',w:800});
  g=grp(A(0,2));p.appendChild(g);T(g,640,500,'les plaques se détériorent',34,C.muted,{a:'middle',w:700});
};
SCL.ac_cap=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,170,'Tension moyenne',36,C.ink,{a:'middle',w:800});
  ['6 V','12 V','24 V','48 V'].forEach((t,i)=>{const gg=grp(A(0,0.8+i*0.6));p.appendChild(gg);chip(gg,160+i*250,220,200,t,C.amberSoft,C.amber,34);});
  g=grp(A(0,4));p.appendChild(g);box(g,300,340,680,170,C.panel,C.green,22);T(g,640,420,'Capacité nominale',38,C.green,{a:'middle',w:800});T(g,640,475,'en ampères-heures : jusqu’à 200 Ah',28,C.ink,{a:'middle',w:600});
};
SCL.ac_ind=(p,A)=>{
  [['Fin de charge',['2,7 à 2,8 V par élément','électrolyte qui bouillonne','plaques + brun prononcé','28° Baumé'],C.green],['Fin de décharge',['1,7 à 1,8 V par élément','plaques + brun pâle','plaques − gris pâle','20° Baumé'],C.red]].forEach(([a,L,col],i)=>{const g=grp(A(0,i*2.4));p.appendChild(g);const x=60+i*600;box(g,x,140,560,400,C.panel,col,22);T(g,x+280,210,a,40,col,{a:'middle',w:800});L.forEach((t,j)=>T(g,x+280,290+j*62,t,28,C.ink,{a:'middle',w:600}));});
};
SCL.ac_recap=(p,A)=>recapS(p,A,[['réaction réversible|+ sur + · − sur −',C.blue],['2,4 V en pleine charge|jamais sous 1,8 V',C.amber],['bouillonne = charge|28° Baumé',C.green]],'À toi de jouer : ordre, organes, tensions, indices');
