/* Chapitre 20 — multiples et sous-multiples */
Object.assign(FIT,{pf_intro:600,pf_pref:560,pf_conv:540,pf_prod:540,pf_quot:540,pf_puiss:540,pf_ex:560,pf_recap:600});
SCL.pf_intro=(p,A)=>introS(p,A,'Multiples et sous-multiples','Préfixes et puissances de dix',[['k · M · G',170,C.blueSoft,C.blue],['m · µ · n',170,C.amberSoft,C.amber],['10ⁿ',90,C.blueSoft,C.green]],null);
SCL.pf_pref=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);['30 mA','2 To'].forEach((t,i)=>chip(g,420+i*250,150,200,t,C.panel,C.line,34));
  [['méga','M','10⁶',C.red],['kilo','k','10³',C.amber],['milli','m','10⁻³',C.blue],['micro','µ','10⁻⁶',C.green],['nano','n','10⁻⁹',C.copper]].forEach(([a,s,v,col],i)=>{const gg=grp(A(1,i*0.9));p.appendChild(gg);const x=60+i*235;box(gg,x,260,215,270,C.panel,col,18);T(gg,x+107,330,s,64,col,{a:'middle',w:800});T(gg,x+107,390,a,28,C.ink,{a:'middle',w:700});T(gg,x+107,480,v,44,col,{a:'middle',w:800});});
};
SCL.pf_conv=(p,A)=>{
  [['30 mA','0,03 A'],['2,2 kΩ','2 200 Ω'],['150 µA','0,000 15 A']].forEach(([a,b],i)=>{const g=grp(A(0,i*1.8));p.appendChild(g);const y=170+i*130;box(g,200,y,880,110,C.panel,C.line,18);T(g,420,y+72,a,46,C.amber,{a:'middle',w:800});T(g,640,y+72,'→',46,C.muted,{a:'middle',w:800});T(g,860,y+72,b,46,C.green,{a:'middle',w:800});});
};
SCL.pf_prod=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,160,150,960,110,C.panel,C.blue,20);T(g,640,225,'aᵐ . aⁿ = aᵐ⁺ⁿ',54,C.blue,{a:'middle',w:800});T(g,640,300,'on additionne les exposants',28,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,420,'3 . 10⁶ × 5 . 10³',52,C.ink,{a:'middle',w:800});
  g=grp(A(0,3.6));p.appendChild(g);T(g,640,510,'= 15 . 10⁹',60,C.green,{a:'middle',w:800});
};
SCL.pf_quot=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);box(g,160,150,960,110,C.panel,C.amber,20);T(g,640,225,'aᵐ / aⁿ = aᵐ⁻ⁿ',54,C.amber,{a:'middle',w:800});T(g,640,300,'on soustrait les exposants',28,C.muted,{a:'middle',w:600});
  g=grp(A(0,1.8));p.appendChild(g);T(g,640,420,'10⁶ / 10⁸',52,C.ink,{a:'middle',w:800});
  g=grp(A(0,3.4));p.appendChild(g);T(g,640,510,'= 10⁻²',60,C.green,{a:'middle',w:800});
};
SCL.pf_puiss=(p,A)=>{
  [['(aᵐ)ⁿ = aᵐ.ⁿ','on multiplie les exposants','(10³)² = 10⁶',C.blue],['√(aᵐ) = aᵐ/²','on divise l’exposant','√(10⁶) = 10³',C.green]].forEach(([f,t,e,col],i)=>{const g=grp(A(0,i*2.4));p.appendChild(g);const x=60+i*600;box(g,x,150,560,370,C.panel,col,22);T(g,x+280,250,f,48,col,{a:'middle',w:800});T(g,x+280,320,t,28,C.ink,{a:'middle',w:600});T(g,x+280,440,e,50,C.ink,{a:'middle',w:800});});
};
SCL.pf_ex=(p,A)=>{
  let g=grp(A(0,0));p.appendChild(g);T(g,640,150,'Tihange : trois réacteurs',34,C.ink,{a:'middle',w:800});
  ['870 MW','1 030 MW','1 200 MW'].forEach((t,i)=>{const gg=grp(A(0,0.8+i*0.9));p.appendChild(gg);chip(gg,200+i*300,200,260,t,C.amberSoft,C.amber,34);});
  g=grp(A(0,4));p.appendChild(g);T(g,640,370,'= 3 100 MW',50,C.blue,{a:'middle',w:800});
  g=grp(A(0,5.6));p.appendChild(g);box(g,260,420,760,110,C.panel,C.green,22);T(g,640,495,'3,1 . 10⁹ W',60,C.green,{a:'middle',w:800});
};
SCL.pf_recap=(p,A)=>recapS(p,A,[['préfixe =|puissance de 10',C.blue],['produit : exposants +|quotient : exposants −',C.amber],['(aᵐ)ⁿ : on multiplie|√ : on divise',C.green]],'À toi de jouer : conversions, puissances, trois exercices');
