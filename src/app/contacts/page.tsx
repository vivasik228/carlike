import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Contacts } from '@/components/sections/Contacts';
import { Booking } from '@/components/sections/Booking';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata('Контакты CarLike в Казани','CarLike: Казань, ул. Рахимова, 8, корп. 63А. Телефон +7 (993) 614-35-51. Постройте маршрут, позвоните или оставьте заявку.','/contacts');
export default function ContactsPage(){return <><div className="container page-intro"><Breadcrumbs items={[{label:'Контакты'}]}/><h1>БУДЕМ НА СВЯЗИ</h1><p>Обсудите работы, уточните режим работы и согласуйте визит.</p></div><Contacts/><Booking/></>;}
