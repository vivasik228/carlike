'use client';
import { useCallback,useEffect,useLayoutEffect,useRef,useState,type RefObject } from 'react';
import { gsap } from 'gsap';
import { normalizePosition,wrapIndex,WheelGesture,swipeDirection,type Step,type TouchPoint } from '@/lib/service-roller';
export function useServiceRoller(count:number,viewportRef:RefObject<HTMLDivElement|null>,trackRef:RefObject<HTMLDivElement|null>,onActiveChange?: (index:number)=>void){
 const [state,setState]=useState({index:0,moving:false});
 const indexRef=useRef(0);const stepRef=useRef<(direction:Step)=>void>(()=>{});const callbackRef=useRef(onActiveChange);
 useEffect(()=>{callbackRef.current=onActiveChange;},[onActiveChange]);
 useLayoutEffect(()=>{
  const viewport=viewportRef.current,track=trackRef.current;if(!viewport||!track||count<1)return;
  const rows=Array.from(track.querySelectorAll<HTMLElement>('.roller-item'));
  const labels=rows.map(row=>row.querySelector<HTMLElement>('.roller-item-title')!);
  if(!rows.length)return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let position=count+wrapIndex(indexRef.current,count),height=rows[0].getBoundingClientRect().height;
  let moving=false,disposed=false,timeline:gsap.core.Timeline|null=null,completionTimer:ReturnType<typeof setTimeout>|undefined;
  const context=gsap.context(()=>{},viewport);
  const opacity=(i:number)=>i===position?1:Math.abs(i-position)===1?.3:.08;
  function place(){gsap.set(track,{y:(1-position)*height});gsap.set(rows,{opacity:(i:number)=>opacity(i)});gsap.set(labels,{scale:(i:number)=>i===position?1:.84,transformOrigin:'left center'});}
  context.add('initialise',place)(); // Начальная раскладка собирается в scope для revert.
  function finish(){
   if(disposed)return;
   clearTimeout(completionTimer);completionTimer=undefined;
   position=normalizePosition(position,count);place();moving=false;track!.style.willChange='';
   setState(previous=>({...previous,moving:false}));
  }
  function step(direction:Step){
   if(moving||disposed||count===1)return;
   position+=direction;const index=wrapIndex(indexRef.current+direction,count);indexRef.current=index;
   setState({index,moving:!preference.matches});callbackRef.current?.(index);
   timeline?.kill();
   if(preference.matches){finish();return;}
   moving=true;track!.style.willChange='transform';
   timeline=gsap.timeline({defaults:{duration:.56,ease:'power3.inOut'},onComplete:finish})
    .to(track,{y:(1-position)*height},0)
    .to(rows,{opacity:(i:number)=>opacity(i)},0)
    .to(labels,{scale:(i:number)=>i===position?1:.84},0);
   // В скрытом webview rAF может приостановиться. Управление не должно оставаться заблокированным.
   completionTimer=setTimeout(()=>{if(moving&&!disposed){timeline?.progress(1);if(moving)finish();}},700);
  }
  stepRef.current=step;
  const wheel=new WheelGesture();
  const onWheel=(event:WheelEvent)=>{
   if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.deltaY===0||count===1)return;
   // Перехватывается только эта область; все остальные участки страницы прокручиваются нативно.
   event.preventDefault();
   const direction=wheel.feed(event.deltaY,event.deltaMode,event.timeStamp,moving,window.innerHeight);
   if(direction)step(direction);
  };
  let touch:({id:number}&TouchPoint)|null=null;
  const onTouchStart=(event:TouchEvent)=>{const point=event.touches[0];touch=event.touches.length===1?{id:point.identifier,x:point.clientX,y:point.clientY,at:event.timeStamp}:null;};
  const onTouchEnd=(event:TouchEvent)=>{if(!touch)return;const point=Array.from(event.changedTouches).find(p=>p.identifier===touch?.id);if(point){const direction=swipeDirection(touch,{x:point.clientX,y:point.clientY,at:event.timeStamp});if(direction)step(direction);}touch=null;};
  const cancelTouch=()=>{touch=null;};
  viewport.addEventListener('wheel',onWheel,{passive:false});
  viewport.addEventListener('touchstart',onTouchStart,{passive:true});viewport.addEventListener('touchend',onTouchEnd,{passive:true});viewport.addEventListener('touchcancel',cancelTouch,{passive:true});
  const onPreference=()=>{if(timeline?.isActive())timeline.progress(1);};preference.addEventListener('change',onPreference);
  const resize=new ResizeObserver(()=>{if(disposed)return;height=rows[0].getBoundingClientRect().height;if(timeline?.isActive())timeline.progress(1);place();});resize.observe(viewport);
  return()=>{disposed=true;clearTimeout(completionTimer);stepRef.current=()=>{};timeline?.kill();resize.disconnect();preference.removeEventListener('change',onPreference);viewport.removeEventListener('wheel',onWheel);viewport.removeEventListener('touchstart',onTouchStart);viewport.removeEventListener('touchend',onTouchEnd);viewport.removeEventListener('touchcancel',cancelTouch);context.revert();gsap.set(track,{clearProps:'willChange'});};
 },[count,viewportRef,trackRef]);
 const step=useCallback((direction:Step)=>stepRef.current(direction),[]);
 return {...state,index:wrapIndex(state.index,count),step};
}
