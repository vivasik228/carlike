import { ArrowUpRight } from 'lucide-react';
import { business } from '@/config/business';
export function Reviews(){return <section className="reviews container"><h2>ОТЗЫВЫ О CARLIKE</h2><p>Прочитайте отзывы владельцев автомобилей в официальной карточке CarLike.</p><a className="text-link" href={business.mapsUrl+'?tab=reviews'} target="_blank" rel="noopener noreferrer">Читать отзывы на Яндекс Картах<ArrowUpRight size={19}/></a></section>;}
