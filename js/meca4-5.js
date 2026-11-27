/* =========================================================
   MÉCANIQUE 4e — CHAPITRE 20
   20 L'outillage du mécanicien de maintenance : les outils de mesure
   Contenu : « Les outils de mesure » et « La lecture du pied à coulisse à vernier » (M. Baudson, M. Caprasse).
   Dessin du pied à coulisse : js/pied.js (plans Solidworks de M. Baudson). Les réponses sont calculées dans le code.
   ========================================================= */
(function(){

/* ---------- styles propres au chapitre (dessins du pied à coulisse et du micromètre) ---------- */
if(!document.getElementById('m20css')){ const st=document.createElement('style'); st.id='m20css'; st.textContent=`
.m20fig{max-width:640px;margin:8px auto}.m20fig.mic{max-width:480px}
.drow .dq .m20fig{margin:6px 0 4px;max-width:520px}
.mc-bar{fill:var(--surface);stroke:var(--line);stroke-width:1.5}.mc-plate{fill:var(--paper,var(--surface));stroke:var(--line);stroke-width:1.5}
.mc-tk{stroke:var(--ink);stroke-width:1.3}.mc-refl{stroke:var(--ink);stroke-width:1.6}
.mc-lab{fill:var(--ink);font:600 15px var(--font,system-ui)}.mc-labs{fill:var(--muted);font:500 12px var(--font,system-ui)}
.m20lab{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0}.m20lab input[type=range]{flex:1;min-width:160px}
.m20steps{margin:8px 0 0;padding:0;list-style:none;display:grid;gap:6px}.m20steps li{border:1px solid var(--line);border-left:4px solid var(--meca);border-radius:8px;padding:6px 10px;background:var(--surface)}
.m20steps li.res{border-left-color:var(--ok)}
.m20seg button[aria-pressed=true]{background:var(--meca);color:#fff}`;
  document.head.appendChild(st); }

const nf = (v,d=2) => fr(v,d);
const PREC = {10:0.1, 20:0.05, 50:0.02};
const figPied = (v,n,vue,alt) => `<div class="m20fig">${piedSVG(v,n,{vue,alt})}</div>`;

/* lecture d'un vernier : mm entiers, trait qui coïncide, total */
function lecture(v,n){ const p=PREC[n], u=Math.round(v/p), k=u%n, whole=Math.floor(u/n); return {whole,k,frac:k*p,p}; }

/* ---------- micromètre (dessin repris du Labo de mesure) ---------- */
function micParts(value){ const v100=Math.round(value*100), d=v100%50, b=v100-d; return {v100, base:b/100, d, half:b%100===50}; }
function micSVG(value, ans){
  const P=micParts(value), pxm=34, yr=100, xr=34+8.5*pxm, tw=175, val=P.v100/100;
  let s='<svg viewBox="0 0 520 200" role="img" aria-label="Micromètre : douille graduée en mm et demi-mm, tambour gradué en centièmes" style="width:100%;height:auto;display:block">';
  s+=`<rect x="10" y="${yr-34}" width="${(xr-10).toFixed(1)}" height="68" class="mc-bar"/>`;
  for(let h=Math.ceil(Math.max(0,val-8.5)*2); h/2<=val+1e-9; h++){
    const sv=h/2, x=(xr-(val-sv)*pxm).toFixed(1);
    if(h%2===0){ const mm=h/2, len=mm%5===0?28:20;
      s+=`<line x1="${x}" x2="${x}" y1="${yr}" y2="${yr-len}" class="mc-tk"/>`;
      if(mm%5===0 && +x<xr-16) s+=`<text x="${x}" y="${yr-42}" text-anchor="middle" class="mc-lab">${mm}</text>`;
    } else s+=`<line x1="${x}" x2="${x}" y1="${yr}" y2="${yr+16}" class="mc-tk"/>`;
  }
  s+=`<line x1="10" x2="${xr.toFixed(1)}" y1="${yr}" y2="${yr}" class="mc-refl"/><rect x="${xr.toFixed(1)}" y="${yr-78}" width="${tw}" height="156" class="mc-plate"/>`;
  for(let m=-7;m<=7;m++){ const L=(((P.d+m)%50)+50)%50, y=yr+m*10, major=L%5===0;
    s+=`<line x1="${xr.toFixed(1)}" x2="${(xr+(major?22:13)).toFixed(1)}" y1="${y}" y2="${y}" class="mc-tk"/>`;
    if(major) s+=`<text x="${(xr+34).toFixed(1)}" y="${y+5}" class="mc-lab">${L}</text>`; }
  if(ans){ s+=`<line x1="${(xr-6).toFixed(1)}" x2="${(xr+28).toFixed(1)}" y1="${yr}" y2="${yr}" stroke="var(--meca)" stroke-width="2.6"/>`;
    s+=`<line x1="${(xr-(val-P.base)*pxm).toFixed(1)}" x2="${(xr-(val-P.base)*pxm).toFixed(1)}" y1="${yr-34}" y2="${yr+34}" stroke="var(--meca)" stroke-width="2.6"/>`; }
  return s+'</svg>';
}
const figMic = (v,ans) => `<div class="m20fig mic">${micSVG(v,ans)}</div>`;

/* ---------- laboratoire : lire un vernier en déplaçant le bec mobile ---------- */
function mountVernierLab(root){
  const box=root.querySelector('#m20lab'); if(!box) return;
  let n=10, val=6.6;
  box.innerHTML=`<div class="m20lab"><div class="seg m20seg" id="m20n" role="group" aria-label="Précision du vernier"><button data-n="10" aria-pressed="true">1/10 · 0,1 mm</button><button data-n="20" aria-pressed="false">1/20 · 0,05 mm</button><button data-n="50" aria-pressed="false">1/50 · 0,02 mm</button></div></div>
    <div id="m20f"></div><div class="m20lab"><label for="m20sl"><b>Ouverture</b></label><input type="range" id="m20sl" min="0" max="600" step="1" value="66"><span class="num" id="m20v"></span></div><ol class="m20steps" id="m20st"></ol>`;
  const draw=()=>{ const L=lecture(val,n), p=PREC[n];
    box.querySelector('#m20f').innerHTML=figPied(val,n,'vernier','Pied à coulisse à vernier');
    box.querySelector('#m20v').textContent=nf(val,n===10?1:2)+' mm';
    box.querySelector('#m20st').innerHTML=
      `<li><b>La règle</b> : le zéro du vernier a dépassé <b>${L.whole} mm</b> (le trait situé à sa gauche).</li>
       <li><b>Le vernier</b> : le trait n° <b>${L.k}</b> coïncide avec un trait de la règle, donc ${L.k} × ${nf(p,2)} = <b>${nf(L.frac,2)} mm</b>.</li>
       <li class="res"><b>Lecture</b> : ${L.whole} + ${nf(L.frac,2)} = <b>${nf(val,n===10?1:2)} mm</b></li>`; };
  const setN=k=>{ n=k; const sl=box.querySelector('#m20sl'); sl.step=PREC[n]*10; sl.max=600; val=Math.round(val/PREC[n])*PREC[n]; sl.value=val*10; };
  box.querySelector('#m20n').onclick=e=>{ const b=e.target.closest('button'); if(!b) return; box.querySelectorAll('#m20n button').forEach(x=>x.setAttribute('aria-pressed',x===b)); setN(+b.dataset.n); draw(); };
  box.querySelector('#m20sl').oninput=e=>{ val=Math.round(+e.target.value/PREC[n]/10)*PREC[n]; val=Math.round(val*100)/100; draw(); };
  draw();
}

/* ---------- laboratoire : micromètre ---------- */
function mountMicLab(root){
  const box=root.querySelector('#m20mic'); if(!box) return; let val=7.38;
  box.innerHTML=`<div id="m20mf"></div><div class="m20lab"><label for="m20ms"><b>Ouverture</b></label><input type="range" id="m20ms" min="300" max="2450" step="1" value="738"><span class="num" id="m20mv"></span></div><ol class="m20steps" id="m20ms2"></ol>`;
  const draw=()=>{ const P=micParts(val);
    box.querySelector('#m20mf').innerHTML=figMic(val,true); box.querySelector('#m20mv').textContent=nf(val,2)+' mm';
    box.querySelector('#m20ms2').innerHTML=`<li><b>La douille</b> : le dernier trait visible indique <b>${nf(P.base,2)} mm</b> (${P.half?'un trait de demi-millimètre est visible : on ajoute 0,5 mm':'pas de trait de demi-millimètre visible'}).</li>
      <li><b>Le tambour</b> : le trait de la douille est en face de la graduation <b>${P.d}</b>, donc ${P.d} × 0,01 = <b>${nf(P.d/100,2)} mm</b>.</li>
      <li class="res"><b>Lecture</b> : ${nf(P.base,2)} + ${nf(P.d/100,2)} = <b>${nf(val,2)} mm</b></li>`; };
  box.querySelector('#m20ms').oninput=e=>{ val=+e.target.value/100; draw(); }; draw();
}

/* ---------- séries de lectures : des valeurs propres à chaque élève ---------- */
function candidats(i, n){ const p=PREC[n], out=[]; for(let j=0;j<4;j++){ const whole=2+i*9+j*3, k=(i*7+j*5+3)%n; out.push(Math.round((whole+k*p)*100)/100); } return out; }
function seriePied(box,key,n){
  const choix={}; for(let i=0;i<6;i++) choix['v'+i]=candidats(i,n);
  const v=vx(key,choix), p=PREC[n];
  mountDrillW(box,key,{ intro:`Lis chaque pied à coulisse au 1/${n} (${nf(p,2)} mm). Réponds en mm, avec la virgule.`, hint:`Zéro du vernier : les mm entiers. Trait qui coïncide : × ${nf(p,2)} mm. Puis additionne.`,
    rows:[0,1,2,3,4,5].map(i=>({ q:figPied(v['v'+i],n,'vernier','Lecture d’un pied à coulisse au 1/'+n), unit:'mm', ans:v['v'+i], tol:0, abs:0.006,
      hint:`Zéro du vernier après ${lecture(v['v'+i],n).whole} mm ; le trait n° ${lecture(v['v'+i],n).k} coïncide : ${lecture(v['v'+i],n).k} × ${nf(p,2)} = ${nf(lecture(v['v'+i],n).frac,2)} mm.` })) });
}
function serieMic(box,key){
  const choix={}; for(let i=0;i<4;i++){ const L=[]; for(let j=0;j<4;j++) L.push(Math.round((3+i*5+j*1.5+((i*13+j*17)%50)/100)*100)/100); choix['v'+i]=L; }
  const v=vx(key,choix);
  mountDrillW(box,key,{ intro:'Lis chaque micromètre : douille (mm et demi-mm) + tambour (centièmes). Réponds en mm.', hint:'Douille : le dernier trait visible. Tambour : la graduation en face du trait horizontal × 0,01 mm.',
    rows:[0,1,2,3].map(i=>({ q:figMic(v['v'+i],false), unit:'mm', ans:v['v'+i], tol:0, abs:0.006, hint:`Douille : ${nf(micParts(v['v'+i]).base,2)} mm ; tambour : ${micParts(v['v'+i]).d} × 0,01 = ${nf(micParts(v['v'+i]).d/100,2)} mm.` })) });
}

/* =================== CHAPITRE 20 — L'OUTILLAGE : LES OUTILS DE MESURE =================== */
defMC(20, {
  Q:{
    M20aq1:{q:"Quelle pièce du pied à coulisse porte le vernier ?",o:["Le bec fixe","Le coulisseau (bec mobile)","La règle"],g:1,e:"Le vernier est l’échelle gravée sur la partie mobile, qui glisse le long de la règle.",r:'M20a'},
    M20aq2:{q:"À quoi sert la vis de serrage ?",o:["À régler le zéro","À bloquer le bec mobile pour lire la mesure","À mesurer la profondeur"],g:1,e:"On bloque le coulisseau pour retirer l’instrument de la pièce sans que la mesure change.",r:'M20a'},
    M20aq3:{q:"Quel instrument mesure la profondeur d’un alésage ?",o:["Le micromètre d’extérieur","La jauge de profondeur (ou la queue du pied à coulisse)","Le comparateur seul"],g:1,e:"La jauge de profondeur se lit comme un pied à coulisse ; la queue du pied à coulisse sert aussi pour de petites profondeurs.",r:'M20a'},
    M20bq1:{q:"Sur la règle, le nombre « 5 » correspond à…",o:["5 mm","50 mm","5 cm de plus que le zéro du vernier"],g:1,e:"Les nombres de la règle indiquent des centimètres : 5 correspond à 50 mm.",r:'M20b'},
    M20bq2:{q:"Que lit-on d’abord sur un instrument à vernier ?",o:["Le trait du vernier qui coïncide","Les mm entiers, à gauche du zéro du vernier","Les centièmes sur le tambour"],g:1,e:"La lecture se fait en deux temps : d’abord les mm entiers sur la règle, ensuite la fraction de mm sur le vernier.",r:'M20b'},
    M20bq3:{q:"Un vernier au 1/20 permet de lire…",o:["0,1 mm","0,05 mm","0,02 mm"],g:1,e:"1/20 de mm = 0,05 mm. Le 1/10 donne 0,1 mm et le 1/50 donne 0,02 mm.",r:'M20b'},
    M20cq1:{q:"Au 1/10, le 7e trait du vernier coïncide avec un trait de la règle. La fraction est…",o:["0,07 mm","0,7 mm","7 mm"],g:1,e:"7 × 0,1 mm = 0,7 mm.",r:'M20c'},
    M20cq2:{q:"Le zéro du vernier est entre 12 et 13 mm, et le 4e trait coïncide (1/10). La mesure est…",o:["12,4 mm","12,04 mm","13,4 mm"],g:0,e:"12 + 4 × 0,1 = 12,4 mm.",r:'M20c'},
    M20dq1:{q:"Au 1/20, le 5e trait du vernier coïncide. La fraction est…",o:["0,5 mm","0,25 mm","0,05 mm"],g:1,e:"5 × 0,05 mm = 0,25 mm.",r:'M20d'},
    M20dq2:{q:"Le zéro du vernier est entre 7 et 8 mm, et le 13e trait coïncide (1/20). La mesure est…",o:["7,13 mm","7,65 mm","8,65 mm"],g:1,e:"13 × 0,05 = 0,65 mm, donc 7 + 0,65 = 7,65 mm.",r:'M20d'},
    M20eq1:{q:"Au 1/50, le 29e trait du vernier coïncide. La fraction est…",o:["0,29 mm","0,58 mm","2,9 mm"],g:1,e:"29 × 0,02 mm = 0,58 mm.",r:'M20e'},
    M20eq2:{q:"Zéro du vernier entre 54 et 55 mm, le 29e trait coïncide (1/50). La mesure est…",o:["54,29 mm","54,58 mm","55,58 mm"],g:1,e:"54 + 29 × 0,02 = 54 + 0,58 = 54,58 mm.",r:'M20e'},
    M20fq1:{q:"Un micromètre se lit au…",o:["Dixième de mm","Centième de mm","Millimètre"],g:1,e:"Le tambour est gradué en 0,01 mm : un tour de tambour = 0,5 mm, 50 graduations.",r:'M20f'},
    M20fq2:{q:"Pourquoi utiliser le bouton à friction ?",o:["Pour mesurer plus vite","Pour exercer toujours la même pression et ne rien déformer","Pour lire le tambour"],g:1,e:"Le bouton à friction limite l’effort de serrage : pression constante, pas de déformation de la pièce ou des touches.",r:'M20f'},
    M20fq3:{q:"Quand faut-il vérifier l’étalonnage d’un micromètre ?",o:["Une fois par an","Avant chaque utilisation, avec une cale étalon","Jamais, c’est un instrument précis"],g:1,e:"On contrôle le zéro avec une cale étalon avant chaque utilisation.",r:'M20f'},
    M20gq1:{q:"Que mesure un comparateur ?",o:["Une cote absolue","Un écart par rapport à une valeur de référence (le point zéro)","Un angle"],g:1,e:"Le comparateur indique seulement l’écart par rapport à la valeur réglée au zéro, par exemple avec une cale étalon.",r:'M20g'},
    M20gq2:{q:"Pour mesurer une ovalisation, on…",o:["fait pivoter la pièce et on repère le maximum de l’aiguille","écarte les becs de la pièce","mesure deux fois au pied à coulisse"],g:0,e:"Le comparateur est fixe, réglé sur le plus petit rayon ; la pièce tourne et l’aiguille passe par un maximum.",r:'M20g'},
    M20hq1:{q:"Une bavure sur la pièce est une erreur due…",o:["à la pièce","à l’instrument","à l’opérateur"],g:0,e:"Bavures, chocs, copeaux, huile : ce sont des éléments parasites sur la pièce.",r:'M20h'},
    M20hq2:{q:"À quelle température les instruments de mesure sont-ils étalonnés ?",o:["15 °C","20 °C","25 °C"],g:1,e:"20 °C. Un écart de température dilate ou rétracte la pièce et l’instrument.",r:'M20h'},
    M20hq3:{q:"L’erreur de parallaxe vient…",o:["de l’opérateur qui lit de travers","de l’environnement","de l’usure du lardon"],g:0,e:"En regardant l’échelle sous un angle, on décale la lecture : c’est une erreur de lecture de l’opérateur.",r:'M20h'},
    M20iq1:{q:"Une cote de 25,00 mm à ± 0,01 mm. Quel instrument choisis-tu ?",o:["Un pied à coulisse au 1/10","Un micromètre","Une règle graduée"],g:1,e:"Il faut lire le centième : le micromètre (0,01 mm). Un pied à coulisse au 1/50 lit 0,02 mm seulement.",r:'M20i'},
  },
  caps:[
    {id:'M20a', sec:'20.1 — 20.2', t:'Le pied à coulisse et la jauge de profondeur', quiz:['M20aq1','M20aq2','M20aq3'], ex:{keys:['M20use'], lbl:'Quelle mesure ?'},
     body:()=>`<p class="lead">Le pied à coulisse est un instrument à <b>mesure directe</b> : on lit la cote sur l’instrument, puis on la compare aux cotes maxi et mini imposées par la tolérance.</p>
      ${figPied(0,10,'complet','Pied à coulisse : bec fixe, bec mobile, règle, vernier, vis de serrage')}
      ${tbl(['Pièce','Rôle'],[['Bec fixe','touche fixe de la pièce, solidaire de la règle'],['Bec mobile','touche mobile, solidaire du coulisseau'],['Règle','graduée en mm (les nombres indiquent les cm)'],['Échelle du vernier','gravée sur le coulisseau : donne la fraction de mm'],['Vis de serrage','bloque le coulisseau pour lire sans que la mesure bouge'],['Coulisseau','partie mobile qui porte le vernier']])}
      <p><b>Précision</b> : au 1/50 de mm (0,02 mm) pour les modèles à vernier, au 1/100 de mm (0,01 mm) pour l’affichage numérique. <b>Étendue</b> : 150 mm, 200 mm, … jusqu’à 2000 mm.</p>
      <h3>Que mesure-t-on ?</h3>
      ${tbl(['Mesure','Comment'],[['Extérieure','la pièce entre les grands becs'],['Intérieure','les petits becs dans l’alésage'],['De profondeur','la queue du coulisseau au fond du trou'],['De gorge','les becs ouverts dans la gorge']])}
      <h3>La jauge de profondeur</h3>
      <p>Elle se lit <b>exactement comme le pied à coulisse</b> (règle + vernier). Précision : 1/50 de mm, ou 1/100 en affichage numérique. Étendue : 100, 150, 250, 300 ou 500 mm. Elle sert à mesurer la profondeur des alésages, des gorges…</p>
      ${terrain('Avant de mesurer, ferme les becs et vérifie que le zéro du vernier est bien en face du zéro de la règle. Si ce n’est pas le cas, l’instrument est faussé : signale-le.')}
      ${exbox('m20use','Mesure extérieure, intérieure ou profondeur ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m20use'),'M20use',{cats:[['ex','Extérieure'],['in','Intérieure'],['pr','Profondeur']],items:[
       ['Le diamètre d’un arbre','ex','Les grands becs enserrent la pièce.'],['Le diamètre d’un alésage','in','Les petits becs s’écartent contre les parois.'],['La profondeur d’un trou borgne','pr','La queue du coulisseau descend jusqu’au fond.'],['La largeur d’une clavette','ex',''],['La longueur d’une pièce plate','ex',''],['Le diamètre intérieur d’un tube','in',''],['La hauteur d’un épaulement','pr','On pose la queue sur le niveau bas.'],['La profondeur d’une rainure de clavette','pr','']]})},
    {id:'M20b', sec:'20.3', t:'Lire un vernier', quiz:['M20bq1','M20bq2','M20bq3'], ex:{keys:['M20ord'], lbl:'Les trois temps de la lecture'},
     body:()=>`<p class="lead">La règle donne les millimètres entiers. Le vernier donne la fraction de millimètre.</p>
      <p>La règle est graduée en <b>mm</b> ; les nombres indiquent les <b>cm</b> (le « 5 » correspond à 50 mm). Le vernier est la partie mobile munie d’une petite échelle, sous la règle.</p>
      ${tbl(['Échelle','Divisions du vernier','Chaque division','Exemple de valeurs'],[['1/10','10','0,1 mm','0 ; 0,1 ; 0,2 ; 0,3 …'],['1/20','20','0,05 mm','0 ; 0,05 ; 0,1 ; 0,15 …'],['1/50','50','0,02 mm','0 ; 0,02 ; 0,04 ; 0,06 …']])}
      ${mcDef('Les trois temps','<b>1.</b> Repère le zéro du vernier : le trait de la règle à sa gauche donne les mm entiers. <b>2.</b> Repère le trait du vernier qui coïncide avec un trait de la règle : multiplie son numéro par la précision. <b>3.</b> Additionne.')}
      <h3>Essaie : déplace le bec mobile</h3><div id="m20lab"></div>
      ${exbox('m20ord','Remets la lecture dans l’ordre','')}`,
     mount:root=>{ mountVernierLab(root); mountOrderW(root.querySelector('#m20ord'),'M20ord',{items:['Je repère le zéro du vernier et je lis les mm entiers sur la règle','Je cherche le trait du vernier qui coïncide avec un trait de la règle','Je multiplie le numéro de ce trait par la précision (0,1 ; 0,05 ou 0,02 mm)','J’additionne les mm entiers et la fraction'],shuffle:[2,0,3,1]}); }},
    {id:'M20c', sec:'20.4', t:'Lire le vernier au 1/10', quiz:['M20cq1','M20cq2'], ex:{keys:['M20x1'], lbl:'Les six lectures au 1/10'},
     body:()=>`<p class="lead">Au 1/10, chaque trait du vernier vaut 0,1 mm.</p>
      ${mcDef('Exemple','Le zéro est après <b>6 mm</b> ; le <b>6e</b> trait coïncide : 6 × 0,1 = 0,6 mm. Lecture : <b>6 + 0,6 = 6,6 mm</b>.')}
      ${figPied(6.6,10,'vernier','Exemple au 1/10 : 6,6 mm')}
      ${exbox('m20x1','Lis les six pieds à coulisse au 1/10','Des valeurs différentes pour chaque élève.')}`,
     mount:root=>seriePied(root.querySelector('#m20x1'),'M20x1',10)},
    {id:'M20d', sec:'20.5', t:'Lire le vernier au 1/20', quiz:['M20dq1','M20dq2'], ex:{keys:['M20x2'], lbl:'Les six lectures au 1/20'},
     body:()=>`<p class="lead">Au 1/20, chaque trait du vernier vaut 0,05 mm. On lit donc 0,05 ; 0,10 ; 0,15 ; 0,20…</p>
      ${mcDef('Exemple','Le zéro est après <b>3 mm</b> ; le trait qui coïncide correspond à <b>0,65 mm</b> (13 × 0,05). Lecture : <b>3 + 0,65 = 3,65 mm</b>.')}
      ${figPied(3.65,20,'vernier','Exemple au 1/20 : 3,65 mm')}
      ${exbox('m20x2','Lis les six pieds à coulisse au 1/20','Des valeurs différentes pour chaque élève.')}`,
     mount:root=>seriePied(root.querySelector('#m20x2'),'M20x2',20)},
    {id:'M20e', sec:'20.6', t:'Lire le vernier au 1/50', quiz:['M20eq1','M20eq2'], ex:{keys:['M20x3'], lbl:'Les six lectures au 1/50'},
     body:()=>`<p class="lead">Au 1/50, chaque trait du vernier vaut 0,02 mm. C’est le modèle le plus courant à l’atelier.</p>
      ${mcDef('Exemple','Le zéro est après <b>54 mm</b> ; le trait qui coïncide correspond à <b>0,58 mm</b> (29 × 0,02). Lecture : <b>54 + 0,58 = 54,58 mm</b>.')}
      ${figPied(54.58,50,'vernier','Exemple au 1/50 : 54,58 mm')}
      ${mcRem('Au 1/50, les numéros gravés sur le vernier (0, 1, 2 … 10) valent 0,1 mm chacun : le trait situé entre deux numéros vaut 0,02 mm de plus par trait.')}
      ${exbox('m20x3','Lis les six pieds à coulisse au 1/50','Des valeurs différentes pour chaque élève.')}`,
     mount:root=>seriePied(root.querySelector('#m20x3'),'M20x3',50)},
    {id:'M20f', sec:'20.7', t:'Le micromètre', quiz:['M20fq1','M20fq2','M20fq3'], ex:{keys:['M20x4'], lbl:'Les quatre lectures'},
     body:()=>`<p class="lead">Le micromètre (ou palmer) mesure les dimensions linéaires extérieures ou intérieures, au centième de millimètre.</p>
      <p>Il a un corps en U avec une <b>touche fixe</b> et une <b>touche mobile</b> actionnée par un tambour (système vis-écrou). Le <b>bouton à friction</b> assure une pression constante. Précision : 0,01 à 0,001 mm.</p>
      ${terrain('Vérifie l’étalonnage avec la cale étalon prévue, avant chaque utilisation.')}
      <h3>Méthode de mesure</h3>
      <ol><li>Place la pièce entre les touches, puis serre avec le <b>bouton à friction</b> (jamais avec le tambour).</li><li>Sur la <b>douille</b>, lis les mm entiers et les demi-mm découverts par le tambour.</li><li>Sur le <b>tambour</b>, lis les centièmes : la graduation en face du trait horizontal × 0,01 mm.</li><li>Additionne.</li></ol>
      <h3>Essaie</h3><div id="m20mic"></div>
      ${exbox('m20x4','Lis les quatre micromètres','Des valeurs différentes pour chaque élève.')}`,
     mount:root=>{ mountMicLab(root); serieMic(root.querySelector('#m20x4'),'M20x4'); }},
    {id:'M20g', sec:'20.8', t:'Le comparateur', quiz:['M20gq1','M20gq2'], ex:{keys:['M20x5'], lbl:'Ovalisation et faux-rond'},
     body:()=>`<p class="lead">Le comparateur ne donne pas une cote : il indique un <b>écart</b> par rapport à une valeur de référence.</p>
      <p>Il est formé d’un cadran gradué avec une aiguille, d’un palpeur (une tige et une touche) et d’une lunette avec un index pour matérialiser le zéro. Un totaliseur compte les tours de l’aiguille : pour une course de 10 mm, un tour = 1 mm.</p>
      ${mcDef('Principe','La tige se déplace en translation ; un mécanisme transforme ce déplacement en rotation de l’aiguille. L’angle est proportionnel au déplacement. On fait le zéro avec une cale étalon, puis on place la pièce : le comparateur indique la différence.')}
      <h3>Ovalisation</h3><p>Le comparateur, fixe, est placé sur le plus petit rayon : c’est le zéro. On fait pivoter la pièce : l’aiguille passe par un <b>maximum</b>, qui est l’ovalisation. On termine le tour pour vérifier que l’aiguille revient au zéro.</p>
      <h3>Faux-rond</h3><p>Sans chercher le zéro : sur un tour complet, le faux-rond est la <b>moitié de la différence</b> entre la plus grande et la plus petite valeur lues.</p>
      <h3>Parallélisme</h3><p>La face de référence est posée sur un marbre. Le comparateur, fixe sur une potence, se déplace sur la face à contrôler : l’aiguille indique l’écart de parallélisme.</p>
      ${exbox('m20x5','Ovalisation et faux-rond','Des valeurs différentes pour chaque élève.')}`,
     mount:root=>{ const v=vx('M20x5',{o:[0.12,0.18,0.24,0.31],a:[0.36,0.42,0.28,0.5],b:[-0.12,-0.2,-0.08,-0.3],c:[0.45,0.38,0.52,0.6],d:[-0.15,-0.22,-0.1,-0.3]});
       mountDrillW(root.querySelector('#m20x5'),'M20x5',{intro:'Réponds en mm. Le zéro du comparateur est réglé sur le plus petit rayon pour l’ovalisation.',hint:'Faux-rond = (plus grande lecture − plus petite lecture) ÷ 2.',rows:[
        {q:`Ovalisation : le zéro est réglé sur le plus petit rayon ; l’aiguille passe par un maximum de <b>+${nf(v.o)} mm</b>. Quelle est l’ovalisation ?`,unit:'mm',ans:v.o,tol:0,abs:0.004,hint:'L’ovalisation est la valeur maximale lue.'},
        {q:`Faux-rond : sur un tour complet, la plus grande lecture est <b>+${nf(v.a)} mm</b> et la plus petite <b>${nf(v.b)} mm</b>. Quel est le faux-rond ?`,unit:'mm',ans:(v.a-v.b)/2,tol:0,abs:0.004,hint:'(plus grande − plus petite) ÷ 2.'},
        {q:`Faux-rond : plus grande lecture <b>+${nf(v.c)} mm</b>, plus petite <b>${nf(v.d)} mm</b>. Quel est le faux-rond ?`,unit:'mm',ans:(v.c-v.d)/2,tol:0,abs:0.004,hint:'(plus grande − plus petite) ÷ 2.'}]}); }},
    {id:'M20h', sec:'20.9', t:'Les erreurs de mesurage', quiz:['M20hq1','M20hq2','M20hq3'], ex:{keys:['M20err'], lbl:'D’où vient l’erreur ?'},
     body:()=>`<p class="lead">Il y a toujours une part d’erreur dans un mesurage : l’important est de la minimiser.</p>
      ${mcDef('Vocabulaire','<b>Dimension réelle</b> : la valeur exacte, une notion idéale qu’on ne peut jamais connaître exactement. <b>Erreur</b> : l’écart entre la dimension mesurée et la dimension réelle.')}
      ${tbl(['Origine','Exemples','Précaution'],[['A — La pièce','bavures, chocs, copeaux, huile de coupe','nettoyer les surfaces de contact'],['B — L’instrument','becs déformés ou usés, graduations illisibles, vis de réglage trop serrée, jeu du lardon','choisir un instrument adapté ; l’étalonner'],['C — L’opérateur','erreur de lecture (parallaxe, concordance) ; pièce mal alignée ; pression trop forte','aligner pièce et appareil ; pression constante et modérée'],['D — L’environnement','température : les instruments sont étalonnés à 20 °C, la dilatation fausse la mesure','température de la pièce et de l’appareil proche de 20 °C']])}
      ${exbox('m20err','Pièce, instrument, opérateur ou environnement ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m20err'),'M20err',{cats:[['pi','Pièce'],['in','Instrument'],['op','Opérateur'],['en','Environnement']],items:[
       ['Une bavure sur l’arête mesurée','pi',''],['Des copeaux sur les faces de contact','pi',''],['Des becs déformés après une chute','in',''],['Des graduations usées, illisibles','in',''],['Une vis de serrage trop serrée qui frotte','in',''],['Une erreur de parallaxe à la lecture','op','Regarde l’échelle de face.'],['Une pression de contact trop forte','op',''],['La pièce mal alignée entre les becs','op',''],['Une pièce encore chaude sortie de machine','en','Elle est dilatée : on mesure trop grand.'],['Un atelier à 35 °C','en','']]})},
    {id:'M20i', sec:'20.10', t:'Choisir le bon instrument', quiz:['M20iq1'], ex:{keys:['M20choix'], lbl:'Le bon instrument'},
     body:()=>`<p class="lead">Le bon instrument, c’est celui dont la précision est adaptée à la tolérance de la cote.</p>
      ${tbl(['Instrument','Précision','Pour mesurer…'],[['Pied à coulisse','0,1 – 0,05 – 0,02 mm','longueurs, diamètres, profondeurs (cotes courantes)'],['Jauge de profondeur','0,02 mm','profondeurs, gorges'],['Micromètre','0,01 mm','dimensions précises (arbres, épaisseurs)'],['Comparateur','écart seulement','ovalisation, faux-rond, parallélisme']])}
      ${terrain('Règle simple : l’instrument doit lire au moins dix fois plus fin que la tolérance. Pour ± 0,01 mm, on prend un micromètre ; pour ± 0,5 mm, un pied à coulisse suffit.')}
      ${exbox('m20choix','Quel instrument ?','')}`,
     mount:root=>mountSortW(root.querySelector('#m20choix'),'M20choix',{cats:[['pc','Pied à coulisse'],['mi','Micromètre'],['co','Comparateur']],items:[
       ['Une longueur de 120 mm à ± 0,2 mm','pc',''],['Le diamètre extérieur d’un arbre à ± 0,01 mm','mi','Il faut lire le centième.'],['L’épaisseur d’une cale ou d’une tôle fine, au centième','mi',''],['Le faux-rond d’un arbre monté sur le tour','co',''],['L’écart de parallélisme d’une face sur le marbre','co',''],['La profondeur d’un trou borgne à ± 0,1 mm','pc',''],['Le diamètre intérieur d’un alésage ébauché','pc',''],['L’ovalisation d’une portée','co','']]})},
  ],
  prereq:[{t:'Nommer les parties du pied à coulisse et choisir le type de mesure',cap:'M20a'},{t:'Expliquer le principe de lecture d’un vernier',cap:'M20b'},{t:'Lire un pied à coulisse au 1/10',cap:'M20c'},{t:'Lire un pied à coulisse au 1/20',cap:'M20d'},{t:'Lire un pied à coulisse au 1/50',cap:'M20e'},{t:'Lire un micromètre',cap:'M20f'},{t:'Utiliser un comparateur (ovalisation, faux-rond)',cap:'M20g'},{t:'Identifier les origines des erreurs de mesurage',cap:'M20h'},{t:'Choisir l’instrument adapté à la tolérance',cap:'M20i'}],
});

})();
