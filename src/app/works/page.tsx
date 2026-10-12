import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { WorksGallery } from '@/components/sections/WorksGallery';
import { Booking } from '@/components/sections/Booking';
import { metadata as makeMetadata } from '@/lib/seo';
import { projects } from '@/data/content';
export const metadata=makeMetadata('Наши работы','Проекты сервиса, детейлинга, защиты и тюнинга CarLike. Демонстрационные примеры отмечены отдельно.','/works',{demo:projects.every(p=>p.demo)});
export default function WorksPage(){return <><div className="container page-intro"><Breadcrumbs items={[{label:'Наши работы'}]}/><h1>ПРОЕКТЫ<br/>И ФОТОГРАФИИ</h1><p>Выберите категорию или откройте фотографию. Демонстрационные примеры помечены отдельно.</p></div><WorksGallery full/><Booking/></>;}
