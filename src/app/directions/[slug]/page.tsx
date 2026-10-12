import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { directions, services } from '@/data/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Action } from '@/components/ui/Action';
import { Booking } from '@/components/sections/Booking';
import { metadata as makeMetadata } from '@/lib/seo';
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return directions.map(d=>({slug:d.slug}));}
export async function generateMetadata({params}:Props){const {slug}=await params;const d=directions.find(d=>d.slug===slug);return d?makeMetadata(`${d.name} в Казани`,`${d.description} CarLike в Казани, ул. Рахимова, 8, корп. 63А. Стоимость и состав работ уточняются при обращении.`,`/directions/${slug}`):{};}
export default async function DirectionPage({params}:Props){const {slug}=await params;const d=directions.find(d=>d.slug===slug);if(!d)notFound();return <><div className="container page-intro"><Breadcrumbs items={[{label:'Услуги',href:'/services'},{label:d.name}]}/><h1>{d.name.toUpperCase()}<br/>В КАЗАНИ</h1><p>{d.headline}. {d.description}</p><Action href="#booking" goal="open_booking">Обсудить работы</Action></div><div className="inner-banner"><Image src={d.image} alt={d.alt} fill sizes="100vw" priority/><p className="image-note">Тематическая фотография / не работы CarLike</p></div><section className="container service-directory"><div className="service-group"><h2>Выберите услугу</h2><div className="service-links">{services.filter(s=>s.direction===slug).map(s=><Link href={`/services/${s.slug}`} className="service-list-link" key={s.slug} data-goal="click_service"><div><h3>{s.name}</h3><p>{s.description}</p></div><ArrowUpRight size={23}/></Link>)}</div></div></section><Booking/></>;}
