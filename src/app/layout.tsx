import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Privacy } from '@/components/ui/Privacy';
import { business } from '@/config/business';
import './globals.css';
import '@/components/ui/states.css';
const manrope=localFont({src:'../../public/fonts/manrope.ttf',variable:'--font-body',display:'swap',weight:'200 800'});
const oswald=localFont({src:'../../public/fonts/oswald.ttf',variable:'--font-display',display:'swap',weight:'200 700'});
export const metadata:Metadata={metadataBase:business.siteUrl?new URL(business.siteUrl):undefined,title:{default:'CarLike — автосервис, детейлинг и тюнинг в Казани',template:'%s | CarLike'},description:'Диагностика, обслуживание, ремонт, детейлинг, защитная оклейка и тюнинг в Казани. CarLike: ул. Рахимова, 8, корп. 63А. Обсудите работы и оставьте заявку.',verification:{yandex:process.env.NEXT_PUBLIC_YANDEX_VERIFICATION||undefined},icons:{icon:'/favicon.svg'},robots:business.siteUrl?{index:true,follow:true}:{index:false,follow:false}};
export const viewport:Viewport={themeColor:'#08090B',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" className={`${manrope.variable} ${oswald.variable}`}><body><a className="skip-link" href="#main">Перейти к содержимому</a><Header/><main id="main">{children}</main><Footer/><Privacy/></body></html>;}
