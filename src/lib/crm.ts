import type { LeadStore } from './lead-store';
// Расширяемый адаптер. Первичное сохранение всегда предшествует уведомлению.
export interface CrmNotifier { notify(leadId:string):Promise<void>; }
export class RussianWebhookNotifier implements CrmNotifier {
 constructor(private endpoint:string,private token:string){const url=new URL(endpoint);if(url.protocol!=='https:'||process.env.CRM_REGION!=='RU')throw Error('CRM_NOT_APPROVED');}
 async notify(leadId:string){const response=await fetch(this.endpoint,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:`Bearer ${this.token}`},body:JSON.stringify({leadId}),signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('CRM_DELIVERY_FAILED');}
}
export async function flushNotifications(store:LeadStore,notifier:CrmNotifier){let sent=0;for(const lead of store.pending().slice(0,100)){await notifier.notify(lead.id);store.delivered(lead.id);sent++;}return sent;}
