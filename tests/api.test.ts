import test from 'node:test';
import assert from 'node:assert/strict';
import { handleBooking } from '../src/lib/booking-handler';
import { consentRecord } from '../src/lib/legal';
function request(body:unknown,origin='http://localhost:3000'){return new Request('http://localhost:3000/api/booking',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});}
const valid={name:'Тест',phone:'+79930000000',car:'Тест',service:'diagnostika',date:'',comment:'',consent:true,consentHash:consentRecord().hash,website:'',requestId:'9b2799c5-5df4-4a08-8abc-0887c65e9960'};
test('foreign origins rejected',async()=>assert.equal((await handleBooking(request(valid,'https://external.invalid'))).status,403));
test('server rejects missing consent',async()=>assert.equal((await handleBooking(request({...valid,consent:false}))).status,400));
test('unconfigured storage never reports success',async()=>{const result=await handleBooking(request(valid));assert.equal(result.status,503);assert.equal((await result.json()).ok,false);});
test('honeypot rejected',async()=>assert.equal((await handleBooking(request({...valid,website:'spam'}))).status,400));
test('oversize bodies rejected',async()=>assert.equal((await handleBooking(request({...valid,comment:'x'.repeat(9000)}))).status,400));
test('changed consent has a distinct recovery code before saving',async()=>{const response=await handleBooking(request({...valid,consentHash:'0'.repeat(64)}));assert.equal(response.status,409);assert.equal((await response.json()).code,'CONSENT_CHANGED');});
test('preview origin uses browser Host despite internal localhost URL',async()=>{const req=new Request('http://localhost:3000/api/booking',{method:'POST',headers:{'Content-Type':'application/json',Host:'127.0.0.1:3000',Origin:'http://127.0.0.1:3000'},body:JSON.stringify(valid)});assert.equal((await handleBooking(req)).status,503);});
