'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { bookingSchema, formatPhone, todayInKazan, type BookingInput, type BookingData } from '@/lib/booking-schema';
import { services } from '@/data/services';
import { business } from '@/config/business';
import { goal } from '../ui/Privacy';
import { useConsent } from '../ui/useConsent';
import { requestJson } from '@/lib/client-request';
export function Booking({initialService='consultation'}:{initialService?:string}){
  const [success,setSuccess]=useState(false);
  const [serverError,setServerError]=useState('');
  const [conflict,setConflict]=useState(false);
  const form=useForm<BookingInput,unknown,BookingData>({resolver:zodResolver(bookingSchema),defaultValues:{name:'',phone:'+7',car:'',service:initialService,date:'',comment:'',consent:false,consentHash:'',website:'',requestId:''},mode:'onBlur'});
  const {register,setValue,handleSubmit,formState:{errors,isSubmitting}}=form;
  const submission=useRef<AbortController|null>(null);
  const updateHash=useCallback((hash:string)=>setValue('consentHash',hash,{shouldValidate:false}),[setValue]);
  const consent=useConsent(updateHash);
  useEffect(()=>{setValue('requestId',crypto.randomUUID());return()=>submission.current?.abort();},[setValue]);
  async function submit(data:BookingData){
    if(consent.state!=='ready'||conflict)return;
    setServerError('');
    const controller=new AbortController();submission.current=controller;
    try{
      const response=await requestJson('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
      const result=response.data;
      if(controller.signal.aborted)return;
      if(!response.ok){setServerError(typeof result.message==='string'?result.message:'Не удалось отправить заявку. Повторите отправку или позвоните.');if(result.code==='CONSENT_CHANGED'){setValue('consent',false);consent.reload();}else if(result.code==='IDEMPOTENCY_CONFLICT'){setConflict(true);}return;}
      if(result.ok!==true||!result.id){setServerError('Сервер не подтвердил сохранение заявки. Пожалуйста, позвоните.');return;}
      setSuccess(true);goal('submit_booking_success');
    }catch(error){if(!controller.signal.aborted)setServerError(error instanceof Error&&error.name==='TimeoutError'?'Ответ сервера не пришёл за 12 секунд. Повторите отправку с теми же данными или позвоните нам.':'Не удалось связаться с сервером. Проверьте соединение, повторите отправку или позвоните.');}
  }
  function fieldError(field:keyof BookingInput){return errors[field]?<p className="field-error" id={`error-${field}`}>{errors[field]?.message}</p>:null;}
  return <section className="booking" id="booking"><div className="container booking-grid"><div className="booking-copy"><h2>ОСТАВЬТЕ ЗАЯВКУ<br/>НА ОБСЛУЖИВАНИЕ</h2><p>Укажите автомобиль и нужные работы.<br/>Мы свяжемся, чтобы согласовать стоимость и дату визита.</p><a className="booking-phone" href={business.phoneHref} data-goal="click_phone"><Phone size={21}/>{business.phone}</a><span className="booking-call">Стоимость и время визита можно обсудить по телефону.</span></div>
    <form className="booking-form" onSubmit={event=>void handleSubmit(submit)(event)} noValidate aria-label="Заявка в CarLike" aria-busy={isSubmitting}>
      {success?<div className="form-success" role="status"><CheckCircle2 size={38} strokeWidth={1.5}/><h3>ЗАЯВКА ПОЛУЧЕНА</h3><p>CarLike получил заявку. Мы свяжемся по указанному телефону для уточнения работ.</p><p>Дата визита будет согласована отдельно.</p><button type="button" className="text-button" onClick={()=>{form.reset({...form.formState.defaultValues,requestId:crypto.randomUUID(),consentHash:form.getValues('consentHash')});setSuccess(false);setServerError('');}}>Отправить ещё одну заявку</button></div>:<>
        <p className="field-hint form-intro full-width">Поля со звёздочкой обязательны. Дата и комментарий необязательны.</p>
        <div className="form-field"><label htmlFor="name">Ваше имя *</label><input id="name" autoComplete="given-name" placeholder="Как к вам обращаться" maxLength={80} {...register('name')} aria-invalid={!!errors.name} aria-describedby={errors.name?'error-name':undefined}/>{fieldError('name')}</div>
        <div className="form-field"><label htmlFor="phone">Номер телефона *</label><input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" maxLength={18} {...register('phone',{onChange:e=>setValue('phone',formatPhone(e.target.value),{shouldValidate:!!errors.phone})})} aria-invalid={!!errors.phone} aria-describedby={errors.phone?'error-phone':undefined}/>{fieldError('phone')}</div>
        <div className="form-field"><label htmlFor="car">Марка и модель *</label><input id="car" placeholder="Ваш автомобиль" maxLength={120} {...register('car')} aria-invalid={!!errors.car} aria-describedby={errors.car?'error-car':undefined}/>{fieldError('car')}</div>
        <div className="form-field"><label htmlFor="service">Интересующая услуга *</label><select id="service" {...register('service')} aria-invalid={!!errors.service} aria-describedby={errors.service?'error-service':undefined}><option value="consultation">Нужна консультация</option>{services.map(s=><option value={s.slug} key={s.slug}>{s.name}</option>)}</select>{fieldError('service')}</div>
        <div className="form-field full-width"><label htmlFor="date">Желаемая дата <span className="text-muted">(необязательно)</span></label><input id="date" type="date" min={todayInKazan()} {...register('date')} aria-invalid={!!errors.date} aria-describedby={`${errors.date?'error-date ':''}date-hint`}/>{fieldError('date')}<p className="field-hint" id="date-hint">Это пожелание. Запись подтвердим после согласования.</p></div>
        <div className="form-field full-width"><label htmlFor="comment">Комментарий <span className="text-muted">(необязательно)</span></label><textarea id="comment" placeholder="Что требует внимания или что хотите улучшить?" maxLength={2000} {...register('comment')} aria-invalid={!!errors.comment} aria-describedby={errors.comment?'error-comment':undefined}/>{fieldError('comment')}</div>
        <div className="honeypot" aria-hidden="true"><label htmlFor="website">Сайт</label><input id="website" {...register('website')} tabIndex={-1} autoComplete="off"/></div><input type="hidden" {...register('requestId')}/><input type="hidden" {...register('consentHash')}/>
        <div className="full-width"><label className="form-consent"><input type="checkbox" {...register('consent')} disabled={consent.state!=='ready'||isSubmitting} aria-invalid={!!errors.consent} aria-describedby={errors.consent?'error-consent':undefined}/><span>Я даю <Link href="/consent" target="_blank" rel="noopener">согласие на обработку персональных данных</Link> для ответа на заявку. <Link href="/privacy" target="_blank" rel="noopener">Политика обработки данных</Link>.</span></label>{fieldError('consent')}{fieldError('requestId')}{fieldError('consentHash')}
        {consent.state==='loading'&&<p className="form-loading" role="status"><Loader2 className="spinner" size={16}/>Загружаем согласие на обработку данных…</p>}
        {consent.state==='error'&&<div className="form-status error consent-status" role="alert"><p>Не удалось загрузить согласие. Заполненные поля сохранены. Повторите загрузку или позвоните нам.</p><button type="button" className="text-link" onClick={()=>void consent.reload()}>Загрузить согласие ещё раз</button><a className="text-link" href={business.phoneHref} data-goal="click_phone">{business.phone}</a></div>}
        </div>
        {serverError&&<div className="form-status error full-width" role="alert"><p>{serverError}</p><a className="text-link" href={business.phoneHref} data-goal="click_phone">Позвонить: {business.phone}</a>{conflict&&<button type="button" className="text-link conflict-reset" onClick={()=>{setValue('requestId',crypto.randomUUID());setConflict(false);setServerError('');}}>Подготовить новую заявку с этими данными</button>}</div>}
        <div className="form-bottom full-width"><button className="button" type="submit" disabled={isSubmitting||conflict||consent.state!=='ready'}>{isSubmitting?'Отправляем заявку…':serverError?'Повторить отправку':'Отправить заявку'}{isSubmitting?<Loader2 className="spinner" size={18}/>:<ArrowUpRight size={18}/>}</button><p role={isSubmitting?'status':undefined}>{isSubmitting?'Дождитесь ответа сервера. Это может занять до 12 секунд.':'Запись подтвердим после согласования. Отправка формы оставляет заявку.'}</p></div>
      </>}
    </form></div></section>;
}
