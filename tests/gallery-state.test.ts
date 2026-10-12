import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WorksGallery } from '../src/components/sections/WorksGallery';
import { Photo } from '../src/components/ui/Photo';

test('empty gallery offers a useful next step without invented demo items',()=>{
 const html=renderToStaticMarkup(createElement(WorksGallery,{items:[]}));
 assert.match(html,/Проекты пока не опубликованы/);
 assert.match(html,/Оставить заявку/);
 assert.doesNotMatch(html,/work-card|Демо-проект/);
});
test('server-rendered photos remain visible without JavaScript loading overlays',()=>{
 const html=renderToStaticMarkup(createElement(Photo,{src:'/images/service.webp',alt:'Тематическое фото',sizes:'50vw'}));
 assert.match(html,/<img/);assert.match(html,/Тематическое фото/);assert.doesNotMatch(html,/photo-state/);
});
