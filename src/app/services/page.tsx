import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { directions, services } from '@/data/services';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Booking } from '@/components/sections/Booking';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata('Услуги автосервиса, детейлинга и тюнинга в Казани','Все услуги CarLike в Казани: диагностика, ТО, ходовая, тормоза, замена масла, шиномонтаж, детейлинг, защитная оклейка, шумоизоляция, тюнинг и запчасти.','/services');
export default function ServicesPage(){return <><div className="container page-intro"><Breadcrumbs items={[{label:'Услуги'}]}/><h1>ВСЁ, ЧТО НУЖНО<br/>ВАШЕМУ АВТОМОБИЛЮ</h1><p>Техническое состояние, внешний вид и индивидуальные доработки. Выберите нужную услугу или начните с консультации.</p></div><div className="service-directory container">{directions.map(d=><section className="service-group" key={d.slug}><div><h2>{d.name}</h2><Link className="text-link" href={`/directions/${d.slug}`} data-goal="click_service">О направлении<ArrowUpRight size={17}/></Link></div><div className="service-links">{services.filter(s=>s.direction===d.slug).map(s=><Link href={`/services/${s.slug}`} className="service-list-link" key={s.slug} data-goal="click_service"><div><h3>{s.name}</h3><p>{s.description}</p></div><ArrowUpRight size={23}/></Link>)}</div></section>)}</div><Booking/></>;}
