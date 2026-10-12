'use client';
import Link from 'next/link';
import { useId,useRef } from 'react';
import { ArrowUp,ArrowDown,ArrowUpRight,Mouse,MoveVertical } from 'lucide-react';
import type { RollerService } from '@/config/hero-services';
import { useServiceRoller } from './useServiceRoller';
import './ServiceRoller.css';
export function ServiceRoller({services,onActiveChange}:{services:RollerService[];onActiveChange?:(index:number)=>void}){
 if(!services.length)return null;
 return <Roller services={services} onActiveChange={onActiveChange}/>;
}
function Roller({services,onActiveChange}:{services:RollerService[];onActiveChange?:(index:number)=>void}){
 const viewport=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),detail=useRef<HTMLAnchorElement>(null),instruction=useId();
 const {index,moving,step}=useServiceRoller(services.length,viewport,track,onActiveChange);
 const active=services[index],total=String(services.length).padStart(2,'0');
 return <div className="service-roller" data-active-service={active.id} data-moving={moving}>
  <div className="roller-top"><span className="roller-counter" aria-hidden="true"><strong>{String(index+1).padStart(2,'0')}</strong><span>/ {total}</span></span><span className="roller-instruction" id={instruction}><Mouse size={13}/><span className="roller-desktop-hint">Колесо мыши / ↑ ↓</span><MoveVertical size={13}/><span className="roller-touch-hint">Короткий свайп / ↑ ↓</span></span><div className="roller-controls"><button type="button" aria-label="Предыдущая услуга" aria-disabled={moving||services.length===1} onClick={()=>step(-1)}><ArrowUp size={18}/></button><button type="button" aria-label="Следующая услуга" aria-disabled={moving||services.length===1} onClick={()=>step(1)}><ArrowDown size={18}/></button></div></div>
  <div ref={viewport} className="roller-viewport" role="group" tabIndex={0} aria-label="Барабан услуг CarLike" aria-describedby={instruction} onKeyDown={event=>{if(event.target!==event.currentTarget||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();step(event.key==='ArrowDown'?1:-1);}else if(event.key==='Enter'){event.preventDefault();detail.current?.click();}}}>
   <span className="roller-selection" aria-hidden="true"/>
   <div ref={track} className="roller-track" aria-hidden="true" style={{transform:`translate3d(0, calc(${1-services.length} * var(--roller-row)), 0)`}}>
    {[0,1,2].flatMap(copy=>services.map((service,i)=><div className="roller-item" key={`${copy}-${service.id}`} data-physical-index={copy*services.length+i} style={{opacity:copy===1&&i===0?1:.3}}><span className="roller-item-title" style={{transform:`scale(${copy===1&&i===0?1:.84})`}}>{service.title}</span></div>))}
   </div>
  </div>
  <div className="roller-metadata"><div className="roller-live" aria-live="polite" aria-atomic="true"><span className="sr-only">Услуга {index+1} из {services.length}: {active.title}. </span><p className="roller-description">{active.description}</p></div><Link ref={detail} href={active.href} className="roller-detail" data-goal="click_service">Состав работ<ArrowUpRight size={17}/></Link></div>
 </div>;
}
