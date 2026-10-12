import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { business } from '@/config/business';
import { consentText } from '@/lib/legal';
import { metadata as makeMetadata } from '@/lib/seo';
export const metadata=makeMetadata('Согласие на обработку персональных данных','Самостоятельный текст согласия на обработку данных для ответа на заявку в CarLike.','/consent');
export const dynamic='force-dynamic';
export default function ConsentPage(){return <><div className="container page-intro"><Breadcrumbs items={[{label:'Согласие на обработку данных'}]}/><h1>СОГЛАСИЕ НА ОБРАБОТКУ<br/>ПЕРСОНАЛЬНЫХ ДАННЫХ</h1></div><article className="container legal-page">{!business.legal.approved&&<div className="legal-draft"><p>Проект для юридической проверки. Фактические реквизиты и срок хранения должны быть заполнены до включения коммерческого сбора заявок.</p></div>}{consentText().split('\n').map((paragraph,index)=><p key={index}>{paragraph}</p>)}</article></>;}
