import { resolve, relative, isAbsolute } from 'node:path';
import { LeadStore } from './lead-store';
import { legalReady } from './legal';
let store:LeadStore|undefined;
export function getStore(){
  if(store)return store;
  const production=process.env.NODE_ENV==='production';const key=process.env.LEAD_ENCRYPTION_KEY||'';const bytes=Buffer.from(key,'base64');
  if(bytes.length!==32 || bytes.toString('base64')!==key || !process.env.LEADS_DB_PATH)throw new Error('STORAGE_NOT_READY');
  if(production){if(process.env.STORAGE_REGION!=='RU'||!legalReady()||process.env.TRUST_PROXY!=='true'||!process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://'))throw new Error('STORAGE_NOT_READY');}
  else if(process.env.ENABLE_DEV_STORAGE!=='true')throw new Error('STORAGE_NOT_READY');
  const file=resolve(process.env.LEADS_DB_PATH);const publicRelative=relative(resolve('public'),file);
  if(!publicRelative.startsWith('..')&&!isAbsolute(publicRelative))throw new Error('UNSAFE_DB_PATH');
  store=new LeadStore(file,bytes);return store;
}
