'use client';
import { useCallback,useEffect,useState } from 'react';
import { requestJson } from '@/lib/client-request';
export function useConsent(onHash:(hash:string)=>void){
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 const [version,setVersion]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();
  void requestJson('/api/consent',{cache:'no-store',signal:controller.signal}).then(result=>{
   if(!result.ok||typeof result.data.hash!=='string'||!/^[a-f0-9]{64}$/.test(result.data.hash))throw Error('Invalid consent');
   if(controller.signal.aborted)return;
   onHash(result.data.hash);setState('ready');
  }).catch(()=>{if(!controller.signal.aborted)setState('error');});
  return()=>controller.abort();
 },[version,onHash]);
 const reload=useCallback(()=>{
  setState('loading');onHash('');setVersion(value=>value+1);
 },[onHash]);
 return {state,reload};
}
