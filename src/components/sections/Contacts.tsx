'use client';
import { useState } from 'react';
import { MapPin, ArrowUpRight, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { business } from '@/config/business';
export function Contacts(){
 const [map,setMap]=useState(false);
 const approvedEmbed = business.mapEmbedUrl.startsWith('https://yandex.ru/map-widget/') ? business.mapEmbedUrl : '';
 return <section className="section contacts container" id="contacts"><div className="contact-copy"><h2>ЖДЁМ ВАС<br/>В CARLIKE</h2><div className="contact-detail"><MapPin size={20}/><div><span>Наш адрес</span><p>{business.address}</p></div></div><div className="contact-detail"><Phone size={20}/><div><span>На связи</span><a href={business.phoneHref} data-goal="click_phone">{business.phone}</a></div></div><p className="contact-hours">{business.hours||'Режим работы уточняйте по телефону.'}</p><div className="contact-buttons"><a className="button" href={business.routeUrl} target="_blank" rel="noopener noreferrer" data-goal="click_route">Построить маршрут<ArrowUpRight size={18}/></a><Link className="text-link" href="/#booking" data-goal="open_booking">Оставить заявку<ArrowRight size={17}/></Link></div></div><div className="map-panel">{map&&approvedEmbed?<iframe src={approvedEmbed} title="CarLike на Яндекс Картах" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/>:<><div className="map-pin"><MapPin size={40} strokeWidth={1.2}/></div><p className="map-city">КАЗАНЬ</p><p>Рахимова, 8<br/>корпус 63А</p>{approvedEmbed?<button className="text-link" onClick={()=>setMap(true)}>Загрузить Яндекс Карту<ArrowUpRight size={17}/></button>:<a className="text-link" href={business.mapsUrl} target="_blank" rel="noopener noreferrer" data-goal="click_route">Открыть Яндекс Карту<ArrowUpRight size={17}/></a>}<span className="map-caption">Официальная карточка CarLike</span></>}</div></section>;
}
