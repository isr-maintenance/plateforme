/* Chapitre 2 — le circuit électrique (scènes locales) */
Object.assign(FIT,{c2_intro:600,c2_def:560,c2_elem:540,c2_ener:540,c2_sch:552,c2_ouvf:540,c2_tv:540,c2_recap:600});
const symSrc=(g,x,y)=>{el('line',{x1:x,y1:y-34,x2:x,y2:y+34,stroke:C.ink,'stroke-width':5},g);el('line',{x1:x+22,y1:y-18,x2:x+22,y2:y+18,stroke:C.ink,'stroke-width':8},g);};
const symFus=(g,x,y)=>{box(g,x-34,y-14,68,28,'none',C.ink,3);el('line',{x1:x-34,y1:y,x2:x+34,y2:y,stroke:C.ink,'stroke-width':3},g);};
const symSw=(g,x,y,cl)=>{el('circle',{cx:x-35,cy:y,r:5,fill:C.ink},g);el('circle',{cx:x+35,cy:y,r:5,fill:C.ink},g);el('line',{x1:x-35,y1:y,x2:cl?x+35:x+28,y2:cl?y:y-34,stroke:C.ink,'stroke-width':4},g);};
const symLamp=(g,x,y)=>{el('circle',{cx:x,cy:y,r:30,fill:'none',stroke:C.ink,'stroke-width':4},g);el('path',{d:`M${x-21} ${y-21} L${x+21} ${y+21} M${x+21} ${y-21} L${x-21} ${y+21}`,stroke:C.ink,'stroke-width':4},g);};
SCL.c2_intro=(p,A)=>introS(p,A,'Le circuit électrique','Éléments · schéma · ouvert ou fermé',[['symboles normalisés',300],['circuit ouvert',210],['circuit fermé',210]],g=>{symSrc(g,420,500);symFus(g,560,470);symSw(g,720,470,true);symLamp(g,860,500);el('path',{d:'M420 466 V470 H526 M594 470 H685 M755 470 H860 V470 M860 530 V545 H420 V534',fill:'none',stroke:C.ink,'stroke-width':3},g);});
SCL.c2_def=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M300 200 H980 V420 H300 Z',fill:'none',stroke:C.ink,'stroke-width':5,'stroke-linejoin':'round'},g);
  box(g,230,260,140,100,C.panel,C.red,14);T(g,300,302,'générateur',22,C.muted,{a:'middle',w:600});T(g,300,334,'bornes + / −',22,C.red,{a:'middle',w:700});
  box(g,910,260,140,100,C.panel,C.amber,14);T(g,980,318,'récepteur',22,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.6));p.appendChild(g);T(g,640,245,'conducteurs',30,C.copper,{a:'middle',w:800});box(g,560,171,160,60,'none','none',0);
  g=grp(A(0,3.2));p.appendChild(g);box(g,540,380,200,56,C.blueSoft,C.blue,10);T(g,640,417,'interrupteur',26,C.blue,{a:'middle',w:800});
  g=grp(A(0,4.8));p.appendChild(g);T(g,640,520,'ouvert ou fermé à l’aide d’un interrupteur',36,C.green,{a:'middle',w:700});
};
SCL.c2_elem=(p,A)=>{
  const E=[['Source','produit l’électricité',C.red],['Conducteurs','amènent le courant',C.copper],['Isolants','bloquent le courant',C.blue],['Récepteurs','transforment l’énergie',C.amber],['Commande','ouvre ou ferme',C.green],['Sécurité','protège le circuit',C.red]];
  E.forEach(([a,b,col],i)=>{const g=grp(A(Math.floor(i/3),(i%3)*1.8));p.appendChild(g);const x=60+(i%3)*400,y=130+Math.floor(i/3)*210;box(g,x,y,370,190,C.panel,col,20);T(g,x+185,y+80,a,38,col,{a:'middle',w:800});T(g,x+185,y+130,b,28,C.ink,{a:'middle',w:600});});
};
SCL.c2_ener=(p,A)=>{
  [['Lampe','lumineuse',C.amber],['Radiateur','thermique',C.red],['Moteur','mécanique',C.blue],['Accumulateur','chimique',C.green]].forEach(([a,b,col],i)=>{const g=grp(A(0,i*1.8));p.appendChild(g);const x=60+i*300;box(g,x,160,280,320,C.panel,col,22);T(g,x+140,250,a,32,C.ink,{a:'middle',w:800});T(g,x+140,310,'énergie',24,C.muted,{a:'middle',w:600});T(g,x+140,370,b,34,col,{a:'middle',w:800});});
};
SCL.c2_sch=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  el('path',{d:'M240 200 H350 M450 200 H560 M630 200 H700 M760 200 H980 V300 M980 360 V430 H240 V330 M240 270 V200',fill:'none',stroke:C.ink,'stroke-width':3},g);
  symSrc(g,230,300);symFus(g,400,200);symSw(g,665,200,true);symLamp(g,980,330);
  [['source',140,300],['fusible',400,160],['interrupteur',665,155],['lampe',980,395]].forEach(([n,x,y])=>T(g,x,y,n,24,C.muted,{a:'middle',w:600}));
  T(g,208,262,'+',28,C.red,{a:'end',w:800});T(g,208,342,'−',28,C.blue,{a:'end',w:800});
  g=grp(A(1,0));p.appendChild(g);
  [['1','borne +',240,260,C.red],['2','fusible',400,240,C.amber],['3','interrupteur',665,240,C.amber],['4','lampe',1040,330,C.amber],['5','borne −',240,470,C.blue]].forEach(([n,t,x,y,col])=>{el('circle',{cx:x,cy:y,r:20,fill:col},g);T(g,x,y+8,n,24,'#0b0b0b',{a:'middle',w:800});});
  T(g,640,520,'+  →  fusible  →  interrupteur  →  lampe  →  −',34,C.green,{a:'middle',w:800});
};
SCL.c2_ouvf=(p,A)=>{
  [['Circuit ouvert','interrupteur ouvert','lampe éteinte',false,C.red,60],['Circuit fermé','interrupteur fermé','lampe allumée',true,C.green,660]].forEach(([t,a,b,cl,col,x],k)=>{const g=grp(A(0,k*2.6));p.appendChild(g);box(g,x,140,560,400,C.panel,col,22);T(g,x+280,200,t,38,col,{a:'middle',w:800});
    symSw(g,x+170,300,cl);lampOn(g,x+400,300,34,cl);el('line',{x1:x+205,y1:300,x2:x+366,y2:300,stroke:C.ink,'stroke-width':3,opacity:cl?1:0.4},g);
    T(g,x+280,420,a,28,C.ink,{a:'middle',w:700});T(g,x+280,470,b,28,C.ink,{a:'middle',w:700});});
};
SCL.c2_tv=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);
  box(g,200,140,880,60,C.blueSoft,C.line,0);T(g,420,180,'interrupteur simple',28,C.blue,{a:'middle',w:700});T(g,860,180,'lampe',28,C.blue,{a:'middle',w:700});
  [['0 (ouvert)','0 (éteinte)',C.red],['1 (fermé)','1 (allumée)',C.green]].forEach(([a,b,col],i)=>{const gg=grp(A(0,1.2+i*1.8));p.appendChild(gg);box(gg,200,200+i*100,880,100,C.panel,C.line,0);T(gg,420,265+i*100,a,40,col,{a:'middle',w:800});T(gg,860,265+i*100,b,40,col,{a:'middle',w:800});});
  g=grp(A(0,5));p.appendChild(g);T(g,640,480,'table de vérité',34,C.muted,{a:'middle',w:600});
};
SCL.c2_recap=(p,A)=>recapS(p,A,[['source · conducteurs|récepteur|commande · sécurité',C.amber],['symboles|normalisés',C.blue],['0 = ouvert = éteinte|1 = fermé = allumée',C.green]],'À toi de jouer : classer, schéma, table de vérité');
