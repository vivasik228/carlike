import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingSchema } from '../src/lib/booking-schema';
const valid = {name:'Анна',phone:'+7 (993) 000-00-00',car:'Автомобиль',service:'diagnostika',date:'',comment:'',consent:true,consentHash:'a'.repeat(64),website:'',requestId:'9b2799c5-5df4-4a08-8abc-0887c65e9960'};
test('valid booking normalizes Russian phone',()=>{assert.equal(bookingSchema.parse(valid).phone,'+79930000000');});
test('consent is required and never coerced',()=>{for(const consent of [false,undefined,'true',1]) assert.equal(bookingSchema.safeParse({...valid,consent}).success,false);});
test('only configured services accepted',()=>{assert.equal(bookingSchema.safeParse({...valid,service:'hacked'}).success,false);});
test('reject invalid phone, long name, past and impossible dates',()=>{for(const changes of [{phone:'123'},{name:'A'.repeat(90)},{date:'2000-01-01'},{date:'2099-02-30'}]) assert.equal(bookingSchema.safeParse({...valid,...changes}).success,false);});
test('freeform optional fields are bounded',()=>{assert.equal(bookingSchema.safeParse({...valid,comment:'x'.repeat(2001)}).success,false);});
