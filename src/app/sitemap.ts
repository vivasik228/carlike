import type { MetadataRoute } from 'next';
import { business } from '@/config/business';
import { services,directions } from '@/data/services';
import { projects } from '@/data/content';
export default function sitemap():MetadataRoute.Sitemap{if(!business.siteUrl)return [];const real=projects.filter(p=>!p.demo);return ['/', '/services','/contacts','/privacy','/consent','/cookies',...directions.map(d=>`/directions/${d.slug}`),...services.map(s=>`/services/${s.slug}`),...(real.length?['/works',...real.map(p=>`/works/${p.slug}`)]:[])].map(path=>({url:new URL(path,business.siteUrl).href,changeFrequency:path==='/'?'monthly':'yearly',priority:path==='/'?1:path.startsWith('/services')?.8:.5}));}
