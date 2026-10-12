export type Step = -1 | 1;
export function wrapIndex(index:number,count:number){return count>0?((index%count)+count)%count:0;}
export function normalizePosition(position:number,count:number){return count+wrapIndex(position,count);}
/** Один поток wheel-событий, включая хвост инерции, даёт одну смену. */
export class WheelGesture {
 private last=-Infinity;private sum=0;private consumed=false;
 feed(delta:number,mode:number,at:number,locked:boolean,pageSize=800):Step|null{
  if(!Number.isFinite(delta)||delta===0)return null;
  if(at-this.last>180){this.sum=0;this.consumed=false;}
  this.last=at;
  if(locked){this.consumed=true;this.sum=0;return null;}
  if(this.consumed)return null;
  const pixels=delta*(mode===1?16:mode===2?pageSize:1);
  if(Math.sign(pixels)!==Math.sign(this.sum))this.sum=0;
  this.sum+=pixels;
  if(Math.abs(this.sum)<60)return null;
  this.consumed=true;return this.sum>0?1:-1;
 }
}
export type TouchPoint={x:number;y:number;at:number};
export function swipeDirection(start:TouchPoint,end:TouchPoint):Step|null{
 const dx=end.x-start.x,dy=end.y-start.y,distance=Math.abs(dy),elapsed=end.at-start.at;
 if(distance<44||distance>180||Math.abs(dx)*1.3>distance||elapsed>800||elapsed<0)return null;
 return dy<0?1:-1;
}
