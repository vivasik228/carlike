'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="container error-page"><h1>НЕ УДАЛОСЬ<br/>ОТКРЫТЬ СТРАНИЦУ</h1><p>Попробуйте загрузить её ещё раз.</p><button className="button" onClick={reset}>Попробовать снова</button></div>;}
