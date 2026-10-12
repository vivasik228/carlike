import test from 'node:test';
import assert from 'node:assert/strict';
import { metadata } from '../src/lib/seo';
import { business } from '../src/config/business';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
test('unconfigured preview is explicitly noindex',()=>{assert.deepEqual(metadata('Title','Description','/').robots,{index:false,follow:false});assert.equal(sitemap().length,0);});
test('configured domain produces canonical and sitemap without demo cases',()=>{const previous=business.siteUrl;business.siteUrl='https://carlike.example.test';try{const m=metadata('Title','Description','/services/diagnostika');assert.deepEqual(m.alternates,{canonical:'/services/diagnostika'});assert.deepEqual(m.robots,{index:true,follow:true});assert.deepEqual(metadata('Demo','Description','/works/demo-service',{demo:true}).robots,{index:false,follow:true});const urls=sitemap().map(item=>item.url);assert.ok(urls.includes('https://carlike.example.test/services/diagnostika'));assert.ok(urls.every(url=>!url.includes('/works/')));assert.deepEqual(robots().rules,{userAgent:'*',allow:'/',disallow:['/api/']});}finally{business.siteUrl=previous;}});
