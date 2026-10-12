'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { business, navigation } from '@/config/business';
export function Header() {
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>36);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
  useEffect(()=>{if(open){dialog.current?.showModal();document.body.style.overflow='hidden';}else {dialog.current?.close();document.body.style.overflow='';}return()=>{document.body.style.overflow='';};},[open]);
  function close(){setOpen(false);trigger.current?.focus();}
  return <>
    <header className={`header ${scrolled?'header-scrolled':''}`}>
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="CarLike — главная">{business.logo?<Image src={business.logo} alt="CarLike" width={138} height={40}/>:<>CarLike<span className="logo-dot">.</span></>}</Link>
        <nav className="desktop-nav" aria-label="Основная навигация">{navigation.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>
        <div className="header-actions"><a className="header-phone" href={business.phoneHref} data-goal="click_phone">{business.phone}</a><Link href="/#booking" className="header-book" data-goal="open_booking">Записаться<ArrowUpRight size={16}/></Link></div>
        <button ref={trigger} className="menu-button" aria-label="Открыть меню" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(true)}><Menu/></button>
      </div>
    </header>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label="Меню сайта" onCancel={close}>
      <div className="mobile-menu-top"><Link href="/" className="logo" onClick={close}>CarLike<span className="logo-dot">.</span></Link><button autoFocus className="icon-button" aria-label="Закрыть меню" onClick={close}><X/></button></div>
      <nav aria-label="Мобильная навигация">{navigation.map(n=><Link key={n.href} href={n.href} onClick={close}>{n.label}<ArrowUpRight/></Link>)}</nav>
      <a className="mobile-menu-phone" href={business.phoneHref} data-goal="click_phone"><Phone size={20}/>{business.phone}</a><p>{business.address}</p>
    </dialog>
  </>;
}
