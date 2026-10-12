import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';
import { business, navigation } from '@/config/business';
import { CookieSettingsButton } from '../ui/Privacy';
export function Footer(){return <>
  <footer className="footer container">
    <div className="footer-top"><Link href="/" className="logo" aria-label="CarLike — главная">{business.logo?<Image src={business.logo} alt="CarLike" width={138} height={40}/>:<>CarLike<span className="logo-dot">.</span></>}</Link><p>Сервис. Внешний вид. Характер.</p><a href={business.phoneHref} data-goal="click_phone">{business.phone}<ArrowUpRight size={19}/></a></div>
    <div className="footer-grid"><nav aria-label="Навигация в подвале">{navigation.slice(1).map(n=><Link href={n.href} key={n.href}>{n.label}</Link>)}</nav><p>{business.address}<br/><span>{business.hours||'Режим работы уточняйте по телефону'}</span></p><div className="legal-links"><Link href="/privacy">Политика обработки данных</Link><Link href="/consent">Согласие на обработку данных</Link><Link href="/cookies">Использование cookie</Link><CookieSettingsButton/></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} CarLike</span><span>Казань, Россия</span><Link href="/#top">Наверх ↑</Link></div>
  </footer>
  <nav className="mobile-actions" aria-label="Быстрые действия"><a href={business.phoneHref} data-goal="click_phone"><Phone size={19}/>Позвонить</a><Link href="/#booking" data-goal="open_booking"><CalendarDays size={19}/>Записаться</Link><a href={business.routeUrl} target="_blank" rel="noopener noreferrer" data-goal="click_route"><MapPin size={19}/>Маршрут</a></nav>
</>;}
