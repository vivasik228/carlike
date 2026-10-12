import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { business } from '@/config/business';
export function Breadcrumbs({items}:{items:{label:string;href?:string}[]}){
  const list=[{label:'Главная',href:'/'},...items];
  return <><nav className="breadcrumbs" aria-label="Хлебные крошки">{list.map((i,index)=><span key={i.label}>{index>0&&<ChevronRight size={12}/>} {i.href?<Link href={i.href}>{i.label}</Link>:<span aria-current="page">{i.label}</span>}</span>)}</nav>{business.siteUrl&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:list.map((i,index)=>({'@type':'ListItem',position:index+1,name:i.label,...(i.href?{item:new URL(i.href,business.siteUrl).href}:{})}))}).replace(/</g,'\\u003c')}}/>}</>;
}
