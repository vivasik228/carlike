import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check } from 'lucide-react';
import { services, directions } from '@/data/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Action } from '@/components/ui/Action';
import { Booking } from '@/components/sections/Booking';
import { metadata as makeMetadata } from '@/lib/seo';
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return services.map(s=>({slug:s.slug}));}
export async function generateMetadata({params}:Props){const {slug}=await params;const s=services.find(s=>s.slug===slug);return s?makeMetadata(`${s.name} в Казани`,`${s.description} ${s.name} в CarLike: ул. Рахимова, 8, корп. 63А. Обсудите объём работ и стоимость по телефону или оставьте заявку.`,`/services/${slug}`):{};}
export default async function ServicePage({params}:Props){const {slug}=await params;const s=services.find(s=>s.slug===slug);if(!s)notFound();const d=directions.find(d=>d.slug===s.direction)!;return <><div className="container page-intro"><Breadcrumbs items={[{label:'Услуги',href:'/services'},{label:d.name,href:`/directions/${d.slug}`},{label:s.name}]}/><h1>{s.name.toUpperCase()}<br/>В КАЗАНИ</h1><p>{s.description}</p><Action href="#booking" goal="open_booking">Оставить заявку</Action></div><div className="inner-banner"><Image src={d.image} alt={d.alt} fill sizes="100vw"/><p className="image-note">Тематическая фотография</p></div><section className="container service-detail"><div><h2>НАЧНЁМ С ВАШЕГО АВТОМОБИЛЯ</h2><p>{s.detail}</p><p>Перед визитом расскажите:</p><ul>{s.discuss.map(item=><li key={item}><Check size={16} aria-hidden="true"/>{item}</li>)}</ul></div><aside><h3>{s.price||'Стоимость по запросу'}</h3><p>Цена и сроки зависят от машины и нужных работ. Позвоните, чтобы уточнить детали.</p><Action href="#booking" goal="open_booking">Уточнить стоимость</Action></aside></section><Booking initialService={s.slug}/><section className="container related-services"><h2>ДРУГИЕ УСЛУГИ НАПРАВЛЕНИЯ</h2>{services.filter(item=>item.direction===s.direction&&item.slug!==s.slug).slice(0,3).map(item=><Link key={item.slug} href={`/services/${item.slug}`} className="service-list-link" data-goal="click_service"><h3>{item.name}</h3><ArrowUpRight size={23}/></Link>)}</section></>;}
