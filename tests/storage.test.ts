import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { randomBytes } from 'node:crypto';
import { LeadStore } from '../src/lib/lead-store';
const directory=mkdtempSync(join(tmpdir(),'carlike-test-'));
const secret=randomBytes(32);
const data={name:'ТЕСТОВОЕ_ИМЯ_ПЕРСОНАЛЬНЫХ_ДАННЫХ',phone:'+79930000000',car:'Тест',service:'diagnostika',date:'',comment:'',consent:true,consentHash:'a'.repeat(64),website:'',requestId:'9b2799c5-5df4-4a08-8abc-0887c65e9960'};
test('durable encrypted storage, consent evidence and idempotency',()=>{
 const path=join(directory,'leads.sqlite');const store=new LeadStore(path,secret);
 try{
  const first=store.save(data,'approved consent text','test-v1');
  assert.match(first.id,/^CL-/);
  const second=store.save(data,'approved consent text','test-v1');assert.equal(first.id,second.id);
  assert.throws(()=>store.save({...data,name:'Изменённое имя'},'approved consent text','test-v1'),/IDEMPOTENCY_CONFLICT/);
  const lead=store.read(first.id);assert.equal(lead.booking.name,data.name);assert.equal(lead.consent.text,'approved consent text');assert.equal(lead.consent.version,'test-v1');assert.ok(lead.consent.hash);
  const raw=readFileSync(path);assert.ok(!raw.includes(Buffer.from(data.name)));assert.ok(!raw.includes(Buffer.from(data.phone)));
  assert.equal(store.pending().length,1);
  assert.equal(store.allow('test-source',2,10000),true);assert.equal(store.allow('test-source',2,10000),true);assert.equal(store.allow('test-source',2,10000),false);
 }finally{store.close();}
 const reopen=new LeadStore(path,secret);try{assert.equal(reopen.pending().length,1);}finally{reopen.close();}
});
test.after(()=>{if(!resolve(directory).startsWith(resolve(tmpdir()))||!basename(directory).startsWith('carlike-test-'))throw Error('Unsafe test cleanup');rmSync(directory,{recursive:true,force:true});});
