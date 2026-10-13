'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback,useEffect,useRef,useState } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { business } from '@/config/business';
import { heroServices } from '@/config/hero-services';
import { directions } from '@/data/services';
import { Action } from '../ui/Action';
import { HeroMotion } from '../ui/HeroMotion';
import { ServiceRoller } from '../ui/ServiceRoller';
export function Hero(){
 const [images,setImages]=useState({current:business.hero,previous:business.hero});
 const fade=useRef<gsap.core.Tween|null>(null);
 useEffect(()=>()=>{fade.current?.kill();},[]);
 const select=useCallback((index:number)=>{const image=heroServices[index]?.image||business.hero;setImages(previous=>previous.current===image?previous:{previous:previous.current,current:image});},[]);
 return <section className="hero hero-roller" id="top">
  <div className="hero-image"><Image src={business.hero} alt="Спортивный автомобиль в студийном освещении — тематическая фотография" fill priority sizes="100vw" quality={85}/>
   {images.previous!==business.hero&&<Image key={`previous-${images.previous}`} src={images.previous} alt="" aria-hidden="true" fill loading="eager" sizes="100vw" quality={85}/>}
   {images.current!==images.previous&&<Image key={`current-${images.current}`} src={images.current} alt="" aria-hidden="true" fill loading="eager" sizes="100vw" quality={85} style={{opacity:0}} onLoad={event=>{const element=event.currentTarget;if(!element.isConnected)return;fade.current?.kill();if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.set(element,{opacity:1});return;}fade.current=gsap.to(element,{opacity:1,duration:.48,ease:'power2.inOut'});}}/>}
   {business.heroVideo&&<video autoPlay muted loop playsInline preload="none" poster={business.hero} aria-hidden="true"><source src={business.heroVideo} type="video/mp4"/></video>}
  </div>
  <div className="hero-shade"/>
  <div className="container hero-content"><div className="hero-copy"><div className="hero-location"><span className="status-dot"/> KAZAN / {business.name.toUpperCase()} AUTO SERVICE</div><h1 className="sr-only">{business.name} — автосервис, детейлинг и тюнинг в Казани</h1><span className="hero-brand" aria-hidden="true">{business.name.toUpperCase()}</span><p className="hero-intro">Автосервис, детейлинг и тюнинг в Казани.</p><ServiceRoller services={heroServices} onActiveChange={select}/><div className="hero-buttons"><Action href="#booking" goal="open_booking">Оставить заявку</Action><Action href="#services" secondary>Выбрать услугу</Action></div></div>
    <div className="hero-bottom"><a href="#services" className="scroll-cue"><span className="scroll-circle"><ArrowDown size={18}/></span>Посмотреть услуги</a><span className="hero-address">{business.streetAddress} <span>{business.city}, Россия</span></span><span className="photo-caption">Тематическое фото / Unsplash</span></div>
  </div><HeroMotion/>
  <div className="hero-index">{directions.map(d=><Link key={d.slug} href={`/directions/${d.slug}`} data-goal="click_service"><span>{d.number}</span>{d.name}<ArrowUpRight size={18}/></Link>)}</div>
</section>;}
