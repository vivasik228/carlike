// Abort both network and response parsing; release the timer and parent listener on every exit.
export async function requestJson<T=Record<string,unknown>>(url:string,options:RequestInit={},timeout=12000,fetcher:typeof fetch=fetch){
 const controller=new AbortController();
 const cancel=()=>controller.abort(options.signal?.reason);
 if(options.signal?.aborted)cancel();else options.signal?.addEventListener('abort',cancel,{once:true});
 const timer=setTimeout(()=>controller.abort(new DOMException('Request timed out','TimeoutError')),timeout);
 try{
  const response=await fetcher(url,{...options,signal:controller.signal});
  const data:T=await response.json();
  return {ok:response.ok,status:response.status,data};
 }finally{clearTimeout(timer);options.signal?.removeEventListener('abort',cancel);}
}
