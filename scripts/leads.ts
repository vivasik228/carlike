import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
// Секреты читаются только серверным CLI, никогда не попадают в браузер.
if(existsSync('.env.local'))process.loadEnvFile('.env.local');else if(existsSync('.env'))process.loadEnvFile('.env');
if(!process.env.NODE_ENV)Object.assign(process.env,{NODE_ENV:process.env.ENABLE_DEV_STORAGE==='true'?'development':'production'});
async function main(){
 const {getStore}=await import('../src/lib/storage');const store=getStore();
 try{
  const [command='list',id,target]=process.argv.slice(2);
  if(command==='list'){console.log(JSON.stringify(store.pending(),null,2));}
  else if(command==='export'&&id&&target){writeFileSync(resolve(target),JSON.stringify(store.read(id),null,2),{mode:0o600,flag:'wx'});console.log('Заявка экспортирована. Файл содержит персональные данные; доступ только уполномоченным лицам.');}
  else if(command==='delete'&&id){store.remove(id);console.log('Заявка удалена из основной базы. Обработайте резервные копии по регламенту.');}
  else if(command==='notify'){
   const {RussianWebhookNotifier,flushNotifications}=await import('../src/lib/crm');
   if(!process.env.CRM_NOTIFY_ENDPOINT||!process.env.CRM_NOTIFY_TOKEN)throw Error('CRM_NOT_CONFIGURED');
   const count=await flushNotifications(store,new RussianWebhookNotifier(process.env.CRM_NOTIFY_ENDPOINT,process.env.CRM_NOTIFY_TOKEN));console.log(`Доставлено уведомлений: ${count}`);
  } else console.log('leads list | export <ID> <закрытый-файл.json> | delete <ID> | notify');
 }finally{store.close();}
}
main().catch(()=>{console.error('Операция не выполнена. Проверьте конфигурацию, права доступа и аргументы.');process.exitCode=1;});
