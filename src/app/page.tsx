import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Advantages } from '@/components/sections/Advantages';
import { WorksGallery } from '@/components/sections/WorksGallery';
import { Booking } from '@/components/sections/Booking';
import { Reviews } from '@/components/sections/Reviews';
import { FAQ } from '@/components/sections/FAQ';
import { Contacts } from '@/components/sections/Contacts';
import { business } from '@/config/business';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata('CarLike — автосервис, детейлинг и тюнинг в Казани','Автосервис, диагностика, ремонт ходовой, шиномонтаж, детейлинг, оклейка и тюнинг в Казани. CarLike на Рахимова, 8, корп. 63А. Запись по телефону и на сайте.','/');
export default function Home(){const schema={'@context':'https://schema.org','@type':['AutoRepair','LocalBusiness'],name:business.name,telephone:business.phone,address:{'@type':'PostalAddress',streetAddress:business.streetAddress,addressLocality:business.city,addressRegion:business.region,addressCountry:'RU'},sameAs:[business.mapsUrl],...(business.siteUrl?{url:business.siteUrl}: {})};return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Hero/><Services/><About/><Advantages/><WorksGallery/><Booking/><Reviews/><FAQ/><Contacts/></>;}
