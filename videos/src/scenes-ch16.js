/* Chapitre 16 — appareils de mesures : voltmètre et shunt */
Object.assign(FIT,{vm_intro:600,vm_cadre:560,vm_mult:560,vm_sens:540,vm_shunt:560,vm_gam:560,vm_comp:540,vm_recap:600});
const rbox=(g,x,y,w,h,t,col)=>{box(g,x,y,w,h,C.panel,col,10);T(g,x+w/2,y+h/2+9,t,26,col,{a:'middle',w:800});};
SCL.vm_intro=(p,A)=>introS(p,A,'Les appareils de mesures','Du cadre mobile au voltmètre et à l’ampèremètre',[['cadre mobile',210,C.blueSoft,C.blue],['multiplicateur',230,C.amberSoft,C.amber],['shunt',140,C.blueSoft,C.green]],null);
SCL.vm_cadre=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,100,150,500,400,C.panel,C.line,22);cadran(g,350,420,170,1,'50 µA');T(g,350,200,'cadre mobile',32,C.ink,{a:'middle',w:800});
  g=grp(A(0,1.6));p.appendChild(g);T(g,700,260,'Im = 50 µA',40,C.blue,{w:800});T(g,700,300,'courant de déviation maximum',24,C.muted,{w:600});
  g=grp(A(0,3.2));p.appendChild(g);T(g,700,380,'Rm = 2 kΩ',40,C.amber,{w:800});T(g,700,420,'résistance du cadre',24,C.muted,{w:600});
  g=grp(A(0,4.8));p.appendChild(g);box(g,680,470,520,80,C.panel,C.green,16);T(g,940,525,'Vm = Rm × Im = 0,1 V',36,C.green,{a:'middle',w:800});
};
SCL.vm_mult=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M180 260 H300 M520 260 H640 M860 260 H1100',fill:'none',stroke:C.ink,'stroke-width':4},g);
  rbox(g,300,225,220,70,'cadre · Rm',C.blue);rbox(g,640,225,220,70,'Ra (série)',C.amber);
  T(g,640,175,'voltmètre : calibre Vt',30,C.ink,{a:'middle',w:800});T(g,410,325,'Vm',26,C.blue,{a:'middle',w:700});T(g,750,325,'Va = Vt − Vm',26,C.amber,{a:'middle',w:700});
  g=grp(A(1,0));p.appendChild(g);T(g,640,400,'Ra = (Vt − Vm) / Im',38,C.green,{a:'middle',w:800});
  [['1 V','18 kΩ'],['10 V','198 kΩ'],['100 V','≈ 2 MΩ']].forEach(([a,b],i)=>{const gg=grp(A(1,1.6+i*1.4));p.appendChild(gg);const x=160+i*340;box(gg,x,440,300,110,C.panel,C.line,16);T(gg,x+150,485,'calibre '+a,26,C.muted,{a:'middle',w:700});T(gg,x+150,530,b,40,C.amber,{a:'middle',w:800});});
};
SCL.vm_sens=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,210,'(Ra + Rm) / Vt = 1 / Im',46,C.ink,{a:'middle',w:800});
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,300,'= 1 / 50 µA',44,C.blue,{a:'middle',w:800});
  g=grp(A(0,3.4));p.appendChild(g);box(g,340,360,600,130,C.panel,C.green,22);T(g,640,445,'20 kΩ/V',72,C.green,{a:'middle',w:800});T(g,640,530,'la sensibilité du voltmètre',28,C.muted,{a:'middle',w:600});
};
SCL.vm_shunt=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);el('path',{d:'M140 315 H300 M300 220 V410 M300 220 H400 M300 410 H400 M720 220 H820 M720 410 H820 M820 220 V410 M820 315 H1140',fill:'none',stroke:C.ink,'stroke-width':4},g);
  rbox(g,400,190,320,60,'cadre · Rm',C.blue);rbox(g,400,380,320,60,'shunt · Rs',C.amber);
  T(g,200,285,'IT',30,C.ink,{a:'middle',w:800});T(g,560,178,'Im',28,C.blue,{a:'middle',w:800});T(g,560,470,'Is',28,C.amber,{a:'middle',w:800});
  T(g,640,140,'ampèremètre : le shunt est en parallèle',30,C.ink,{a:'middle',w:800});
  g=grp(A(1,0));p.appendChild(g);T(g,640,515,'IT = Im + Is   ·   Um = Us   ·   Rm . Im = Rs . Is',26,C.muted,{a:'middle',w:700});T(g,640,562,'Rs = (Rm × Im) / (IT − Im)',38,C.green,{a:'middle',w:800});
};
SCL.vm_gam=(p,A)=>{
  [['1 mA','105 Ω',420],['10 mA','10 Ω',240],['100 mA','1 Ω',110],['1 A','0,1 Ω',50]].forEach(([c,r,w],i)=>{const g=grp(A(0,i*1.3));p.appendChild(g);const y=150+i*90;T(g,360,y+42,'calibre '+c,30,C.ink,{a:'end',w:700});box(g,390,y+8,w,50,C.amber,'none',25);T(g,390+w+20,y+45,r,34,C.amber,{w:800});});
  let g=grp(A(1,0));p.appendChild(g);T(g,640,550,'plus le calibre est grand, plus le shunt est petit',34,C.green,{a:'middle',w:800});
};
SCL.vm_comp=(p,A)=>{
  [['Voltmètre','cadre + résistance en SÉRIE','le calibre augmente : Ra augmente',C.blue],['Ampèremètre','cadre + shunt en PARALLÈLE','le calibre augmente : Rs diminue',C.amber]].forEach(([a,b,c,col],i)=>{const g=grp(A(0,i*2.2));p.appendChild(g);const x=60+i*600;box(g,x,150,560,370,C.panel,col,22);T(g,x+280,230,a,44,col,{a:'middle',w:800});T(g,x+280,330,b,28,C.ink,{a:'middle',w:700});T(g,x+280,410,c,26,C.muted,{a:'middle',w:600});});
};
SCL.vm_recap=(p,A)=>recapS(p,A,[['voltmètre|multiplicateur|en série',C.blue],['ampèremètre|shunt|en parallèle',C.amber],['20 kΩ/V|sensibilité',C.green]],'À toi de jouer : les exemples du cours, trois exercices');
