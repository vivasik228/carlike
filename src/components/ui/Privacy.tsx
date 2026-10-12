'use client';
import Link from 'next/link';
import { useEffect, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
type Choice='accepted'|'declined'|null;
const key='carlike-analytics-v1';
function subscribe(callback:()=>void){window.addEventListener('storage',callback);window.addEventListener('carlike-privacy',callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener('carlike-privacy',callback);};}
function snapshot():Choice {try{const v=localStorage.getItem(key);return v==='accepted'||v==='declined'?v:null;}catch{return 'declined';}}
function save(value:Choice){try{if(value)localStorage.setItem(key,value);else localStorage.removeItem(key);}catch{}window.dispatchEvent(new Event('carlike-privacy'));}
declare global {interface Window {ym?: (...args:unknown[])=>void;}}
export function goal(name:string){const id=Number(process.env.NEXT_PUBLIC_METRIKA_ID);if(snapshot()==='accepted'&&id)window.ym?.(id,'reachGoal',name);}
export function CookieSettingsButton(){return <button className="text-button" onClick={()=>save(null)}>Настройки cookie</button>;}
export function Privacy(){
  const choice=useSyncExternalStore(subscribe,snapshot,()=> 'declined' as Choice);
  useEffect(()=>{
    const id=Number(process.env.NEXT_PUBLIC_METRIKA_ID);
    if(choice!=='accepted'||!Number.isSafeInteger(id)||id<=0){if(id)window.ym?.(id,'destruct');return;}
    const queue=(...args:unknown[])=>{((queue as unknown as {a:unknown[][]}).a??=[]).push(args);};
    window.ym??=queue;
    const script=document.createElement('script');script.src='https://mc.yandex.ru/metrika/tag.js';script.async=true;script.dataset.carlike='analytics';document.head.appendChild(script);
    window.ym(id,'init',{clickmap:false,trackLinks:false,accurateTrackBounce:true,webvisor:false,params:{site:'carlike'}});
    const click=(event:MouseEvent)=>{const target=(event.target as Element)?.closest('[data-goal]');const name=target?.getAttribute('data-goal');if(name&&snapshot()==='accepted')goal(name);};
    document.addEventListener('click',click);
    return()=>{document.removeEventListener('click',click);window.ym?.(id,'destruct');script.remove();};
  },[choice]);
  useEffect(()=>{if(choice!=='accepted'){document.cookie.split(';').forEach(cookie=>{const name=cookie.split('=')[0].trim();if(name.startsWith('_ym'))document.cookie=`${name}=; Max-Age=0; path=/; SameSite=Lax`;});}},[choice]);
  if(choice!==null)return null;
  return <aside className="cookie-banner" aria-label="Выбор аналитики"><div className="cookie-title">Ваш выбор cookie<button className="icon-button" onClick={()=>save('declined')} aria-label="Продолжить без аналитики"><X size={17}/></button></div><p>Необходимые настройки сохраняются в браузере. Яндекс Метрика подключается только с вашего разрешения. <Link href="/cookies">Подробнее</Link></p><div className="cookie-actions"><button onClick={()=>save('declined')}>Без аналитики</button><button onClick={()=>save('accepted')}>Разрешить аналитику</button></div></aside>;
}
