import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
const directory=mkdtempSync(join(tmpdir(),'carlike-api-test-'));
process.env.ENABLE_DEV_STORAGE='true';process.env.LEADS_DB_PATH=join(directory,'leads.sqlite');process.env.LEAD_ENCRYPTION_KEY=randomBytes(32).toString('base64');
test('configured API confirms durable saving, retry and stored consent',async()=>{
 const {handleBooking}=await import('../src/lib/booking-handler');const {getStore}=await import('../src/lib/storage');const {consentRecord}=await import('../src/lib/legal');
 const data={name:'Тестовый клиент',phone:'+7 (993) 000-00-00',car:'Синтетический автомобиль',service:'diagnostika',date:'',comment:'Тестовая заявка, не клиент',consent:true,consentHash:consentRecord().hash,website:'',requestId:randomUUID()};
 const make=()=>new Request('http://localhost:3000/api/booking',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000'},body:JSON.stringify(data)});
 try{
  const first=await handleBooking(make());assert.equal(first.status,200);const result=await first.json();assert.equal(result.ok,true);
  const stored=getStore().read(result.id);assert.equal(stored.booking.phone,'+79930000000');assert.equal(stored.consent.hash,data.consentHash);assert.equal(stored.consent.text,consentRecord().text);
  const retry=await handleBooking(make());assert.equal(retry.status,200);assert.equal((await retry.json()).id,result.id);assert.equal(getStore().pending().length,1);
  data.name='Изменённое имя';
  const conflict=await handleBooking(make());assert.equal(conflict.status,409);assert.equal((await conflict.json()).code,'IDEMPOTENCY_CONFLICT');assert.equal(getStore().pending().length,1);
  data.requestId=randomUUID();
  const fresh=await handleBooking(make());assert.equal(fresh.status,200);assert.notEqual((await fresh.json()).id,result.id);assert.equal(getStore().pending().length,2);
 }finally{getStore().close();}
});
test.after(()=>{if(!resolve(directory).startsWith(resolve(tmpdir()))||!basename(directory).startsWith('carlike-api-test-'))throw Error('Unsafe test cleanup');rmSync(directory,{recursive:true,force:true});});
