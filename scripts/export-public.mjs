import { cp,mkdir,mkdtemp,readFile,readdir,writeFile,symlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname,join,resolve,relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Build a separate public showcase. The Node/SQLite application in this checkout is untouched.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const flag=name=>args[args.indexOf(name)+1];
if(!args.includes('--output'))throw Error('Use --output <empty directory> [--base-path /carlike]');
const output=resolve(root,flag('--output'));
const basePath=args.includes('--base-path')?flag('--base-path'):'';
if(basePath&&!/^\/[a-zA-Z0-9_-]+$/.test(basePath))throw Error('Invalid base path');
if(output===root||output.startsWith(root+'/src')||existsSync(output))throw Error('Output must be a new directory');
await mkdir(dirname(output),{recursive:true});
const stage=await mkdtemp(join(dirname(output),'carlike-export-'));
for(const name of ['src','public','tests','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','tsconfig.json','postcss.config.mjs']){
 await cp(join(root,name),join(stage,name),{recursive:true,filter:source=>!relative(root,source).replaceAll('\\','/').startsWith('src/app/api')});
}
await symlink(join(root,'node_modules'),join(stage,'node_modules'),process.platform==='win32'?'junction':'dir');
await writeFile(join(stage,'next-env.d.ts'),'/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n');
await writeFile(join(stage,'next.config.ts'),`import type { NextConfig } from 'next';\nconst config:NextConfig={output:'export',basePath:${JSON.stringify(basePath)},trailingSlash:true,images:{unoptimized:true,qualities:[75,85]},poweredByHeader:false};\nexport default config;\n`);

async function transform(directory){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const path=join(directory,entry.name);
  if(entry.isDirectory()){await transform(path);continue;}
  if(!/\.(tsx?|css)$/.test(entry.name))continue;
  let source=await readFile(path,'utf8');
  source=source.replace(/(['"])\/images\//g,`$1${basePath}/images/`)
   .replace(/(['"])\/favicon\.svg/g,`$1${basePath}/favicon.svg`)
   .replace(/export const dynamic='force-dynamic';/g,"export const dynamic='force-static';")
   .replace(/<a href="\/#/g,`<a href="${basePath}/#`)
   .replaceAll('>Оставить заявку<','>О демоверсии<')
   .replaceAll('>Записаться<','>Демоверсия<')
   .replaceAll('>Уточнить стоимость<','>О демоверсии<');
  if(/[/\\](robots|sitemap)\.ts$/.test(path))source+="\nexport const dynamic='force-static';\n";
  if(path.includes('[slug]'))source+='\nexport const dynamicParams=false;\n';
  await writeFile(path,source);
 }
}
await transform(join(stage,'src'));

// The preview cannot accept requests or transmit form data; only the full server build has a form.
await writeFile(join(stage,'src/components/sections/Booking.tsx'),`import { ArrowUpRight } from 'lucide-react';
export function Booking(_props:{initialService?:string}){return <section className="booking" id="booking"><div className="container booking-grid"><div className="booking-copy"><h2>ДЕМОВЕРСИЯ<br/>САЙТА</h2><p>Здесь можно посмотреть услуги, полистать фотографии и проверить, как работает сайт.</p></div><div className="public-preview-copy"><h3>Форма записи пока не работает</h3><p>Это версия для просмотра. Заявки здесь не отправляются и не сохраняются. Полная версия с формой есть в исходниках.</p><p>Для записи через сайт владельцу ещё нужно настроить приём заявок и заполнить данные компании.</p><a className="button button-secondary" href="https://github.com/vivasik228/carlike" target="_blank" rel="noopener noreferrer">Открыть исходники<ArrowUpRight size={18}/></a></div></div></section>;}
`);
let layout=await readFile(join(stage,'src/app/layout.tsx'),'utf8');
layout=layout.replace("import './globals.css';","import './globals.css';\nimport './public-preview.css';");
layout=layout.replace('<body>','<body><div className="public-preview-banner" role="note">Демоверсия CarLike · Форма записи пока не работает</div>');
await writeFile(join(stage,'src/app/layout.tsx'),layout);
await writeFile(join(stage,'src/app/public-preview.css'),`.public-preview-banner{position:fixed;inset:0 0 auto;z-index:80;height:44px;display:flex;align-items:center;justify-content:center;padding:4px 12px;background:var(--accent);color:var(--background);text-align:center;font-size:12px;font-weight:650;line-height:1.4}body{padding-top:44px}.header{top:44px}.hero{height:calc(100svh - 44px)}html{scroll-padding-top:154px}.public-preview-copy h3{font-size:24px;line-height:1.3}.public-preview-copy p{margin-top:16px;max-width:500px;font-size:14px}.public-preview-copy .button{margin-top:24px}@media(max-width:700px){.public-preview-banner{font-size:10px}html{scroll-padding-top:132px}.page-intro{padding-top:96px}}\n`);

const env={...process.env,NEXT_PUBLIC_SITE_URL:'',NEXT_PUBLIC_METRIKA_ID:'',NEXT_PUBLIC_YANDEX_VERIFICATION:'',NEXT_PUBLIC_MAP_EMBED_URL:'',LEGAL_APPROVED:'false'};
for(const name of Object.keys(env))if(/^(LEAD_|LEADS_|LEGAL_(?!APPROVED)|CRM_|ENABLE_DEV_STORAGE)/.test(name))delete env[name];
const status=await new Promise((resolveStatus,reject)=>{
 const child=spawn(process.execPath,[join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],{cwd:stage,env,stdio:'inherit'});
 child.on('error',reject);child.on('exit',code=>resolveStatus(code));
});
if(status!==0)throw Error(`Public build failed: ${status}`);
await cp(join(stage,'out'),output,{recursive:true});
await writeFile(join(output,'.nojekyll'),'');
console.log(`PUBLIC_EXPORT=${output}`);
