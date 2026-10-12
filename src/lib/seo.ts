import type { Metadata } from 'next';
import { business } from '@/config/business';
export function metadata(title:string,description:string,path:string,options:{demo?:boolean}={}):Metadata{
 return {title,description,alternates:business.siteUrl?{canonical:path}:undefined,robots:options.demo||!business.siteUrl?{index:false,follow:!!business.siteUrl}:{index:true,follow:true},openGraph:{title,description,type:'website',locale:'ru_RU',siteName:business.name,url:business.siteUrl?new URL(path,business.siteUrl).href:undefined,images:business.siteUrl?[{url:'/images/hero.webp',width:2400,height:1418,alt:'CarLike — автосервис, детейлинг и тюнинг в Казани'}]:[]}};
}
