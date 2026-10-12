import type { MetadataRoute } from 'next';
import { business } from '@/config/business';
export default function robots():MetadataRoute.Robots{return business.siteUrl?{rules:{userAgent:'*',allow:'/',disallow:['/api/']},sitemap:new URL('/sitemap.xml',business.siteUrl).href}:{rules:{userAgent:'*',disallow:'/'}};}
