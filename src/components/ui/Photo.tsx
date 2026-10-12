'use client';
import Image from 'next/image';
import { useState,useSyncExternalStore } from 'react';
import { Loader2,ImageOff } from 'lucide-react';
export function Photo({src,alt,sizes,retryable=true}:{src:string;alt:string;sizes:string;retryable?:boolean}){
 const [attempt,setAttempt]=useState(0);
 return <PhotoAttempt key={`${src}-${attempt}`} src={attempt?`${src}${src.includes('?')?'&':'?'}retry=${attempt}`:src} alt={alt} sizes={sizes} retry={retryable?()=>setAttempt(value=>value+1):undefined}/>;
}
function PhotoAttempt({src,alt,sizes,retry}:{src:string;alt:string;sizes:string;retry?:()=>void}){
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 const hydrated=useSyncExternalStore(subscribe,()=>true,()=>false);
 return <>
  <Image src={src} alt={alt} fill sizes={sizes} onLoad={()=>setState('ready')} onError={()=>setState('error')}/>
  {hydrated&&state!=='ready'&&<div className={`photo-state photo-${state}`} role={state==='error'?'alert':'status'}>
   {state==='loading'?<><Loader2 className="spinner" size={20}/><span>Загружаем фото…</span></>:<>
    <ImageOff size={26}/><p>Не удалось загрузить фото.</p>
    {retry?<button className="text-link" type="button" onClick={retry}>Загрузить ещё раз</button>:<span>Откройте фото, чтобы повторить загрузку.</span>}
   </>}
  </div>}
 </>;
}
function subscribe(){return()=>{};}
