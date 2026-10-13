import { bookingSchema } from './booking-schema';
import { consentRecord } from './legal';
import { business } from '@/config/business';
import { getStore } from './storage';
const earlyRate=new Map<string,{until:number;count:number}>();
function temporaryRate(source:string){const now=Date.now();for(const [key,value]of earlyRate)if(value.until<now)earlyRate.delete(key);if(earlyRate.size>10000)return false;const current=earlyRate.get(source)||{until:now+60000,count:0};current.count++;earlyRate.set(source,current);return current.count<=30;}
function reply(status:number,message:string,extra:Record<string,unknown>={}){return Response.json({ok:status===200,message,...extra},{status,headers:{'Cache-Control':'no-store'}});}
async function limitedBody(request:Request){
  const reader=request.body?.getReader();if(!reader)throw Error('EMPTY_BODY');let size=0;const chunks:Uint8Array[]=[];
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();throw Error('BODY_TOO_LARGE');}chunks.push(value);}}finally{reader.releaseLock();}
  const joined=new Uint8Array(size);let at=0;for(const chunk of chunks){joined.set(chunk,at);at+=chunk.length;}return new TextDecoder('utf-8',{fatal:true}).decode(joined);
}
export async function handleBooking(request:Request){
  const origin=request.headers.get('origin');const requestUrl=new URL(request.url);
  // Next standalone может использовать localhost во внутреннем URL.
  // В preview сверяем с HTTP Host; в production всегда с настроенным доменом.
  const expected=business.siteUrl?new URL(business.siteUrl).origin:`${requestUrl.protocol}//${request.headers.get('host')||requestUrl.host}`;
  if(!origin||origin!==expected)return reply(403,'Отправьте заявку с сайта CarLike.');
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,'Не удалось прочитать заявку. Обновите страницу и попробуйте ещё раз.');
  const source=process.env.TRUST_PROXY==='true'?(request.headers.get('x-real-ip')||'global').slice(0,64):'global';
  if(!temporaryRate(source))return reply(429,'Слишком много попыток. Попробуйте позже или позвоните.');
  let body:unknown;try{body=JSON.parse(await limitedBody(request));}catch{return reply(400,'Не удалось прочитать заявку. Проверьте данные и повторите отправку.');}
  const parsed=bookingSchema.safeParse(body);if(!parsed.success)return reply(400,'Проверьте поля формы и согласие на обработку данных.');
  if(parsed.data.website)return reply(400,'Не удалось отправить заявку. Пожалуйста, позвоните.');
  const consent=consentRecord();
  if(parsed.data.consentHash!==consent.hash)return reply(409,'Согласие обновилось. Прочитайте новую редакцию и отметьте согласие ещё раз.',{code:'CONSENT_CHANGED'});
  try{const store=getStore();if(!store.allow(source))return reply(429,'Слишком много заявок. Попробуйте через 10 минут или позвоните.');const result=store.save(parsed.data,consent.text,consent.version);return reply(200,'Спасибо! Заявка у нас. Позвоним и обсудим работы.',{id:result.id});}
  catch(error){if(error instanceof Error&&error.message==='IDEMPOTENCY_CONFLICT')return reply(409,'Первая заявка могла уже дойти, а теперь данные изменились. Позвоните, чтобы проверить её, или создайте новую заявку.',{code:'IDEMPOTENCY_CONFLICT'});return reply(503,'Заявку на сайте сейчас не отправить. Позвоните в CarLike.');}
}
