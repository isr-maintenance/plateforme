/* éléments de dessin communs aux chapitres (ch07, ch08…) ; les scènes « locales » (SCL) numérotent leurs étapes à partir de 0 */
function fbig(p,x,y,w,h,txt,col,size,soft){box(p,x,y,w,h,soft||C.blueSoft,col||C.blue,22);T(p,x+w/2,y+h/2+size*0.34,txt,size||64,col||C.blue,{a:'middle',w:800});}
function tri(p,cx,top,h,hi,l,r){ // triangle mnémotechnique : haut = gauche × droite
  const w=h*1.1, yb=top+h, ym=top+h*0.58;
  el('path',{d:`M${cx-w/2} ${yb} L${cx} ${top} L${cx+w/2} ${yb} Z`,fill:'none',stroke:C.ink,'stroke-width':3,'stroke-linejoin':'round'},p);
  el('line',{x1:cx-w*0.27,y1:ym,x2:cx+w*0.27,y2:ym,stroke:C.ink,'stroke-width':3},p);
  el('line',{x1:cx,y1:ym,x2:cx,y2:yb,stroke:C.ink,'stroke-width':3},p);
  T(p,cx,ym-h*0.1,hi,h*0.2,C.amber,{a:'middle',w:800});T(p,cx-w*0.14,yb-h*0.1,l,h*0.2,C.ink,{a:'middle',w:800});T(p,cx+w*0.14,yb-h*0.1,r,h*0.2,C.ink,{a:'middle',w:800});}
function lcdBox(p,x,y,w,txt,unit){box(p,x,y,w,70,'#0b1a12','#2f6b49',12);T(p,x+w-20,y+49,txt+' '+unit,36,'#5ef0a0',{a:'end',w:700,extra:{'font-family':'DejaVu Sans Mono, monospace'}});}
/* tableau d'exercice en quatre colonnes ; étapes base, base+1, base+2 */
function difs(p,A,base,c){
  const S=(i,at)=>c.one?A(base,[0,1.5,3.2][i]+at):A(base+i,at);
  let g=grp(S(0,0));p.appendChild(g);
  box(g,60,120,1160,110,C.panel,C.line,22);T(g,100,170,c.enonce[0],36,C.ink,{w:700});T(g,100,212,c.enonce[1],28,C.muted,{w:500});
  const cols=[['Données',60,380],['Inconnue',440,170],['Formule',610,300],['Solution',910,310]];
  g=grp(S(1,0));p.appendChild(g);
  cols.forEach(([n,x,w])=>{box(g,x,260,w,56,C.blueSoft,C.line,0);T(g,x+w/2,297,n,26,C.blue,{a:'middle',w:700});box(g,x,316,w,170,C.panel,C.line,0);});
  c.d.forEach((l,i)=>T(g,80,362+i*46,l,32,C.ink,{w:700}));
  T(g,525,410,c.i,34,C.amber,{a:'middle',w:700});
  g=grp(S(2,0));p.appendChild(g);T(g,760,410,c.f,c.fs||34,C.ink,{a:'middle',w:700});
  g=grp(S(2,c.sAt||1.4));p.appendChild(g);
  c.s.forEach((l,i)=>T(g,1065,370+i*46,l,i==c.s.length-1?38:30,i==c.s.length-1?C.green:C.ink,{a:'middle',w:i==c.s.length-1?800:700}));
}
