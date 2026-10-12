import test from 'node:test';
import assert from 'node:assert/strict';
import { wrapIndex, normalizePosition, WheelGesture, swipeDirection } from '../src/lib/service-roller';
test('both cycle boundaries and repeated loops preserve logical index',()=>{
 assert.equal(wrapIndex(-1,9),8);assert.equal(wrapIndex(9,9),0);assert.equal(wrapIndex(900,9),0);
 for(let p=-36;p<50;p++){const normalized=normalizePosition(p,9);assert.ok(normalized>=9&&normalized<18);assert.equal(wrapIndex(normalized,9),wrapIndex(p,9));}
});
test('wheel accumulates a deliberate gesture then absorbs its momentum',()=>{
 const gate=new WheelGesture();assert.equal(gate.feed(20,0,0,false),null);assert.equal(gate.feed(20,0,20,false),null);assert.equal(gate.feed(25,0,40,false),1);
 for(let t=60;t<=900;t+=20)assert.equal(gate.feed(30,0,t,false),null);
 assert.equal(gate.feed(80,0,1200,false),1);
});
test('wheel supports line/page deltas, reverse direction and animation locking',()=>{
 assert.equal(new WheelGesture().feed(-4,1,0,false),-1);assert.equal(new WheelGesture().feed(1,2,0,false),1);
 const gate=new WheelGesture();assert.equal(gate.feed(100,0,0,true),null);assert.equal(gate.feed(100,0,50,false),null);assert.equal(gate.feed(-80,0,300,false),-1);
});
test('short vertical swipes change services, long/horizontal gestures scroll normally',()=>{
 assert.equal(swipeDirection({x:20,y:200,at:0},{x:25,y:130,at:250}),1);
 assert.equal(swipeDirection({x:20,y:130,at:0},{x:25,y:200,at:250}),-1);
 assert.equal(swipeDirection({x:20,y:200,at:0},{x:25,y:170,at:250}),null);
 assert.equal(swipeDirection({x:20,y:300,at:0},{x:25,y:20,at:250}),null);
 assert.equal(swipeDirection({x:20,y:200,at:0},{x:170,y:130,at:250}),null);
 assert.equal(swipeDirection({x:20,y:200,at:0},{x:25,y:130,at:1000}),null);
});
