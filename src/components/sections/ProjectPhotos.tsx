'use client';
import { useEffect,useRef,useState } from 'react';
import { Photo } from '../ui/Photo';
import { X,ChevronLeft,ChevronRight,Expand } from 'lucide-react';
export function ProjectPhotos({images,label}:{images:string[];label:string}){
 const [selected,setSelected]=useState<number|null>(null);const dialog=useRef<HTMLDialogElement>(null);const opener=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(selected!==null){dialog.current?.showModal();document.body.style.overflow='hidden';}else{dialog.current?.close();document.body.style.overflow='';}return()=>{document.body.style.overflow='';};},[selected]);
 const close=()=>{setSelected(null);opener.current?.focus();};
 const change=(direction:number)=>setSelected(v=>v===null?null:(v+direction+images.length)%images.length);
 return <><div className="project-photos">{images.map((src,index)=><button className="project-photo" key={`${src}-${index}`} aria-label={`Открыть фото: ${label}, ${index+1}`} onClick={e=>{opener.current=e.currentTarget;setSelected(index);}}><Photo retryable={false} src={src} alt={`${label}: фотография ${index+1}`} sizes="(max-width: 700px) 100vw, 35vw"/><Expand size={18}/></button>)}</div><dialog className="lightbox" ref={dialog} aria-label={label} onCancel={close} onKeyDown={e=>{if(e.key==='ArrowLeft')change(-1);if(e.key==='ArrowRight')change(1);}}><button className="icon-button lightbox-close" autoFocus aria-label="Закрыть фотографию" onClick={close}><X/></button>{selected!==null&&<><div className="lightbox-image"><Photo src={images[selected]} alt={`${label}: фото ${selected+1}`} sizes="90vw"/></div><div className="lightbox-bottom"><button className="icon-button" aria-label="Предыдущее фото" onClick={()=>change(-1)}><ChevronLeft/></button><p>{label}<span>{selected+1} / {images.length}</span></p><button className="icon-button" aria-label="Следующее фото" onClick={()=>change(1)}><ChevronRight/></button></div></>}</dialog></>;
}
