import { z } from 'zod';
import { services } from '../data/services';
export function todayInKazan() {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const get=(type:string)=>parts.find(p=>p.type===type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function normalizePhone(value:string) {
  const digits=value.replace(/\D/g,'');
  return digits.length===11 && /^[78]/.test(digits)?`+7${digits.slice(1)}`:digits.length===10?`+7${digits}`:value;
}
export function formatPhone(value:string) {
  let digits=value.replace(/\D/g,'');
  if(digits.startsWith('7')||digits.startsWith('8')) digits=digits.slice(1);
  digits=digits.slice(0,10);
  if(!digits) return '+7';
  return '+7 ('+digits.slice(0,3)+(digits.length>=3?') ':'')+digits.slice(3,6)+(digits.length>6?'-':'')+digits.slice(6,8)+(digits.length>8?'-':'')+digits.slice(8,10);
}
export const bookingSchema = z.object({
  name:z.string().trim().min(2,'Укажите имя, не меньше двух символов').max(80,'Имя слишком длинное'),
  phone:z.string().max(30).transform(normalizePhone).refine(v=>/^\+7\d{10}$/.test(v),'Укажите номер +7 и 10 цифр'),
  car:z.string().trim().min(2,'Укажите марку и модель').max(120,'Не больше 120 символов'),
  service:z.string().refine(v=>services.some(s=>s.slug===v)||v==='consultation','Выберите услугу'),
  date:z.string().max(10).refine(v=>!v||(/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v && v>=todayInKazan()),'Выберите существующую дату не раньше сегодняшней'),
  comment:z.string().trim().max(2000,'Комментарий: не больше 2000 символов'),
  consent:z.boolean().refine(v=>v===true,'Нужно ваше согласие на обработку данных'),
  consentHash:z.string().regex(/^[a-f0-9]{64}$/,'Не удалось загрузить условия. Обновите страницу или позвоните.'),
  website:z.string().max(200),
  requestId:z.uuid('Обновите страницу и повторите отправку'),
});
export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;
