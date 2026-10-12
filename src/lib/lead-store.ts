import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomBytes, randomUUID, createCipheriv, createDecipheriv, createHash, createHmac } from 'node:crypto';
import type { BookingData } from './booking-schema';
type Evidence={accepted:true;at:string;version:string;hash:string;text:string};
export type StoredLead={booking:Omit<BookingData,'website'|'requestId'>;consent:Evidence};
export class LeadStore {
  private db:DatabaseSync;
  constructor(file:string,private key:Buffer){
    if(key.length!==32)throw new Error('INVALID_KEY');
    mkdirSync(dirname(file),{recursive:true,mode:0o700});this.db=new DatabaseSync(file);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY, created_at TEXT NOT NULL, request_key TEXT UNIQUE NOT NULL, payload_hash TEXT NOT NULL, encrypted BLOB NOT NULL);
      CREATE TABLE IF NOT EXISTS outbox(lead_id TEXT PRIMARY KEY, created_at TEXT NOT NULL, delivered_at TEXT);
      CREATE TABLE IF NOT EXISTS rate_limits(source TEXT PRIMARY KEY, window INTEGER NOT NULL, count INTEGER NOT NULL);`);
    chmodSync(file,0o600);
  }
  private hash(value:string){return createHmac('sha256',this.key).update(value).digest('hex');}
  private encrypt(value:StoredLead){const iv=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',this.key,iv);const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]);}
  private decrypt(buffer:Uint8Array):StoredLead{const bytes=Buffer.from(buffer);const decipher=createDecipheriv('aes-256-gcm',this.key,bytes.subarray(0,12));decipher.setAuthTag(bytes.subarray(12,28));return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));}
  save(data:BookingData,text:string,version:string){
    if(!data.consent)throw new Error('CONSENT_REQUIRED');
    const {website:_website,requestId,...booking}=data;void _website;
    const requestKey=this.hash(requestId);const payloadHash=this.hash(JSON.stringify(booking));this.db.exec('BEGIN IMMEDIATE');
    try{
      const existing=this.db.prepare('SELECT id,payload_hash FROM leads WHERE request_key=?').get(requestKey) as {id:string;payload_hash:string}|undefined;
      if(existing){if(existing.payload_hash!==payloadHash)throw new Error('IDEMPOTENCY_CONFLICT');this.db.exec('COMMIT');return {id:existing.id};}
      const id=`CL-${randomUUID()}`;const at=new Date().toISOString();
      const payload:StoredLead={booking,consent:{accepted:true,at,version,hash:createHash('sha256').update(text).digest('hex'),text}};
      this.db.prepare('INSERT INTO leads VALUES(?,?,?,?,?)').run(id,at,requestKey,payloadHash,this.encrypt(payload));this.db.prepare('INSERT INTO outbox(lead_id,created_at) VALUES(?,?)').run(id,at);
      this.db.exec('COMMIT');return {id};
    }catch(error){this.db.exec('ROLLBACK');throw error;}
  }
  read(id:string){const row=this.db.prepare('SELECT encrypted FROM leads WHERE id=?').get(id) as {encrypted:Uint8Array}|undefined;if(!row)throw new Error('NOT_FOUND');return this.decrypt(row.encrypted);}
  pending(){return this.db.prepare('SELECT lead_id AS id,created_at FROM outbox WHERE delivered_at IS NULL ORDER BY created_at').all() as {id:string;created_at:string}[];}
  delivered(id:string){this.db.prepare('UPDATE outbox SET delivered_at=? WHERE lead_id=?').run(new Date().toISOString(),id);}
  remove(id:string){this.db.exec('BEGIN IMMEDIATE');try{this.db.prepare('DELETE FROM outbox WHERE lead_id=?').run(id);this.db.prepare('DELETE FROM leads WHERE id=?').run(id);this.db.exec('COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e;}}
  allow(source:string,max=5,windowMs=600000){const key=this.hash(source);const window=Math.floor(Date.now()/windowMs);this.db.prepare('DELETE FROM rate_limits WHERE window < ?').run(window-1);const row=this.db.prepare(`INSERT INTO rate_limits(source,window,count) VALUES(?,?,1) ON CONFLICT(source) DO UPDATE SET count=CASE WHEN window=excluded.window THEN count+1 ELSE 1 END, window=excluded.window RETURNING count`).get(key,window) as {count:number};return row.count<=max;}
  close(){this.db.close();}
}
