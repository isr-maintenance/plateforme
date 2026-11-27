#!/usr/bin/env python3
"""Rend une capsule vidéo à partir d'un scénario JSON (voir ch06.json) et de scene.html.
Usage : render.py scenario.json sortie_dir [dossier_voix]
 - sans dossier_voix : aperçu muet, durées estimées d'après le nombre de mots ;
 - avec dossier_voix : un WAV par segment (<cle>.wav) ; chaque phrase commence 0,3 s après le début du segment.
Les images de chaque segment sont rendues une seule fois (cache dans sortie_dir/frames) ;
changer les durées ne redessine rien, cela réencode seulement."""
import json,sys,os,asyncio,subprocess,shutil,math
from playwright.async_api import async_playwright
HERE=os.path.dirname(os.path.abspath(__file__))
FPS=30; LOOP=15; LEAD=0.3; TAIL=0.5
FLOW={'analogie','formule'}
def run(*a): subprocess.run(a,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
def wavdur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).strip())
async def frames(data,out):
    fr=os.path.join(out,'frames'); os.makedirs(fr,exist_ok=True)
    meta={}
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1280,'height':720})
        await pg.goto('file://'+HERE+'/scene.html')
        for i,s in enumerate(data['segments']):
            mx=await pg.evaluate('([i,d])=>window.draw(i,0,d)',[i,data])
            # on balaie jusqu'à la fin des apparitions, puis un cycle de boucle si la scène a un flux
            n=math.ceil((mx+0.6)*FPS); loop=LOOP if s['scene'] in FLOW else 0
            for f in range(n+loop):
                fn=f'{fr}/{s["cle"]}_{f:04d}.jpg'
                if not os.path.exists(fn):
                    await pg.evaluate('([i,t,d])=>window.draw(i,t,d)',[i,f/FPS,data])
                    await pg.screenshot(path=fn,type='jpeg',quality=92)
            meta[s['cle']]=(n,loop)
        await b.close()
    return meta
def main():
    scen,out=sys.argv[1],sys.argv[2]; voix=sys.argv[3] if len(sys.argv)>3 else None
    data=json.load(open(scen)); os.makedirs(out,exist_ok=True)
    meta=asyncio.run(frames(data,out))
    tmp=os.path.join(out,'seg'); shutil.rmtree(tmp,ignore_errors=True); os.makedirs(tmp)
    durs={}
    for s in data['segments']:
        w=os.path.join(voix,s['cle']+'.wav') if voix else None
        durs[s['cle']]=(wavdur(w)+LEAD+TAIL) if w and os.path.exists(w) else len(s['voix'].split())/2.6+LEAD+TAIL+0.4
    lst=[]
    for s in data['segments']:
        k=s['cle']; n,loop=meta[k]; D=durs[k]; N=round(D*FPS); seq=os.path.join(tmp,k+'_seq'); os.makedirs(seq)
        for f in range(N):
            j=f if f<n+loop and f<n else (n+((f-n)%loop) if loop else n-1)
            os.symlink(f'{out}/frames/{k}_{j:04d}.jpg',f'{seq}/{f:05d}.jpg')
        o=f'{tmp}/{k}.mp4'
        run('ffmpeg','-y','-framerate',str(FPS),'-i',seq+'/%05d.jpg','-c:v','libx264','-crf','20','-preset','veryfast','-pix_fmt','yuv420p','-r',str(FPS),'-g','60',o+'.tmp.mp4')
        os.rename(o+'.tmp.mp4',o); lst.append(f"file '{o}'")
    open(tmp+'/liste.txt','w').write('\n'.join(lst))
    muet=out+'/muet.mp4'
    run('ffmpeg','-y','-f','concat','-safe','0','-i',tmp+'/liste.txt','-c','copy',muet+'.tmp.mp4'); os.rename(muet+'.tmp.mp4',muet)
    final=muet
    if voix:
        # une piste son : chaque phrase calée à 0,3 s après le début de son segment
        ins=[];flt=[]
        for i,s in enumerate(data['segments']):
            k=s['cle']; w=os.path.join(voix,k+'.wav'); ins+=['-i',w]
            flt.append(f'[{i}:a]aresample=24000,adelay={int(LEAD*1000)}:all=1,apad=whole_dur={durs[k]:.3f},atrim=0:{durs[k]:.3f}[a{i}]')
        flt.append(''.join(f'[a{i}]' for i in range(len(data["segments"])))+f'concat=n={len(data["segments"])}:v=0:a=1[out]')
        son=out+'/voix.m4a'
        run('ffmpeg','-y',*ins,'-filter_complex',';'.join(flt),'-map','[out]','-c:a','aac','-b:a','128k',son)
        final=out+'/capsule.mp4'
        run('ffmpeg','-y','-i',muet,'-i',son,'-map','0:v','-map','1:a','-c:v','copy','-c:a','copy','-movflags','+faststart',final+'.tmp.mp4'); os.rename(final+'.tmp.mp4',final)
    json.dump(durs,open(out+'/durees.json','w'),indent=1)
    print('total',round(sum(durs.values()),1),'s ->',final)
main()
