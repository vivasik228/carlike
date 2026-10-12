'use client';
import { useEffect, useRef } from 'react';
import { animate } from 'motion';
export function HeroMotion(){
  const marker=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    const hero=marker.current?.closest('.hero');if(!hero)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const video=hero.querySelector<HTMLVideoElement>('video');
    if(reduced.matches){video?.pause();return;}
    const text=hero.querySelector('.hero-copy');
    const animation=text?animate(text,{opacity:[0.4,1],transform:['translateY(14px)','translateY(0)']},{duration:0.65,ease:[0.16,1,0.3,1]}):null;
    const media=hero.querySelector<HTMLElement>('.hero-image');let raf=0;
    const update=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{if(media&&window.innerWidth>900&&!reduced.matches)media.style.transform=`translateY(${Math.min(window.scrollY*0.12,100)}px)`;});};
    window.addEventListener('scroll',update,{passive:true});return()=>{animation?.stop();cancelAnimationFrame(raf);window.removeEventListener('scroll',update);};
  },[]);
  return <span ref={marker} aria-hidden="true"/>;
}
