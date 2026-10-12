'use client';
import { Photo } from '../ui/Photo';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Expand, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects,type Project } from '@/data/content';
const filters=['Все','Сервис','Детейлинг','Оклейка','Тюнинг'];
export function WorksGallery({full=false,items=projects}:{full?:boolean;items?:Project[]}){
  const [filter,setFilter]=useState('Все');
  const [current,setCurrent]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLElement|null>(null);
  const visible=items.filter(p=>filter==='Все'||p.category===filter);
  useEffect(()=>{if(current!==null) {dialog.current?.showModal();document.body.style.overflow='hidden';}else {dialog.current?.close();document.body.style.overflow='';}return()=>{document.body.style.overflow='';};},[current]);
  const close=()=>{setCurrent(null);opener.current?.focus();};
  const change=(direction:number)=>setCurrent(v=>v===null?null:(v+direction+items.length)%items.length);
  return <section className={`section container works ${full?'works-full':''}`} id="works">
    {!full&&<div className="section-heading"><h2>ПРОЕКТЫ<br/>И ФОТОГРАФИИ</h2><Link href="/works" className="text-link">Открыть все проекты<ArrowUpRight size={17}/></Link></div>}
    {items.some(p=>p.demo)&&<p className="demo-note"><span className="status-dot"/>{items.every(p=>p.demo)?`Демонстрационных примеров: ${items.length}. Фотографии тематические и не являются работами CarLike.`:'Демонстрационные примеры помечены «Демо-проект» и не являются работами CarLike.'}</p>}
    <div className="filters" role="group" aria-label="Категории работ">{filters.map(f=><button type="button" key={f} aria-pressed={f===filter} onClick={()=>setFilter(f)}>{f}</button>)}</div>
    <p className="gallery-count" role="status">{visible.length ? `Показано проектов: ${visible.length} из ${items.length}` : items.length ? 'В этой категории пока нет проектов.' : 'Проекты пока не опубликованы.'}</p>
    {!visible.length&&<div className="gallery-empty"><h3>{items.length?'ВЫБЕРИТЕ ДРУГУЮ КАТЕГОРИЮ':'ПЕРВЫЕ ПРОЕКТЫ ПОЯВЯТСЯ ЗДЕСЬ'}</h3><p>{items.length?'Показать проекты остальных направлений?':'Уточнить услуги и обсудить работы для своего автомобиля можно по телефону или через заявку.'}</p>{items.length?<button className="text-link" type="button" onClick={()=>setFilter('Все')}>Показать все проекты</button>:<Link className="text-link" href="/#booking">Оставить заявку<ArrowUpRight size={17}/></Link>}</div>}
    <div className="work-grid">{visible.map(p=><article className="work-card" key={p.slug}><div className="work-photo"><Photo src={p.image} alt={p.demo?`${p.title}: тематическая фотография для демонстрационного проекта`:`${p.vehicle}: ${p.title}`} sizes="(max-width: 700px) 100vw, 50vw"/>{p.demo&&<span className="demo-tag">Демо-проект</span>}<button className="expand-button" aria-label={`Увеличить фото: ${p.title}`} onClick={e=>{opener.current=e.currentTarget;setCurrent(items.indexOf(p));}}><Expand size={19}/></button></div><Link href={`/works/${p.slug}`} className="work-caption"><div><span>{p.category}</span><h3>{p.title}</h3></div><ArrowUpRight size={24}/></Link></article>)}</div>
    <dialog className="lightbox" ref={dialog} aria-label="Просмотр фотографий" onCancel={close} onKeyDown={e=>{if(e.key==='ArrowLeft')change(-1);if(e.key==='ArrowRight')change(1);}}>
      <button className="lightbox-close icon-button" autoFocus aria-label="Закрыть фотографию" onClick={close}><X/></button>
      {current!==null&&<><div className="lightbox-image"><Photo src={items[current].image} sizes="90vw" alt={`${items[current].demo?'Демо: ':''}${items[current].title}`}/></div><div className="lightbox-bottom"><button className="icon-button" aria-label="Предыдущее фото" onClick={()=>change(-1)}><ChevronLeft/></button><p>{items[current].title}<span>{items[current].demo?'Тематическое фото · ':''}{current+1} / {items.length}</span></p><button className="icon-button" aria-label="Следующее фото" onClick={()=>change(1)}><ChevronRight/></button></div></>}
    </dialog>
  </section>;
}
