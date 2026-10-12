import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requestJson } from '../src/lib/client-request';

test('keeps structured server failures for actionable form messages',async()=>{
 const result=await requestJson('/api/booking',{},1000,async()=>Response.json({ok:false,message:'Повторите позже'},{status:503}));
 assert.equal(result.status,503);assert.equal(result.ok,false);assert.equal(result.data.message,'Повторите позже');
});
test('returns durable acknowledgement without inventing success',async()=>{
 const result=await requestJson('/api/booking',{},1000,async()=>Response.json({ok:true,id:'saved-1'}));
 assert.equal(result.data.id,'saved-1');assert.equal(result.ok,true);
});
test('invalid JSON is a recoverable request failure',async()=>{
 await assert.rejects(requestJson('/api/booking',{},1000,async()=>new Response('<html>Error</html>',{status:502})));
});
test('slow requests time out and parent cancellation aborts immediately',async()=>{
 const pending:typeof fetch=(_url,options)=>new Promise((_resolve,reject)=>{
  const signal=options?.signal;signal?.addEventListener('abort',()=>reject(signal.reason),{once:true});
  if(signal?.aborted)reject(signal.reason);
 });
 await assert.rejects(requestJson('/api/consent',{},10,pending),error=>(error as Error).name==='TimeoutError');
 const controller=new AbortController();controller.abort();
 await assert.rejects(requestJson('/api/consent',{signal:controller.signal},1000,pending),error=>(error as Error).name==='AbortError');
});
