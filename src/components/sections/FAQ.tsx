import { Plus } from 'lucide-react';
import { faq } from '@/data/content';
export function FAQ(){return <section className="section container faq"><h2>ОСТАЛИСЬ<br/>ВОПРОСЫ?</h2><div className="faq-list">{faq.map(([q,a])=><details key={q}><summary>{q}<Plus size={20} aria-hidden="true"/></summary><p>{a}</p></details>)}</div></section>;}
