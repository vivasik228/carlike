const city='Казань';
const streetAddress='ул. Рахимова, 8, корп. 63А';
export const business = {
  name: 'CarLike', city, streetAddress, region:'Республика Татарстан',
  phone: '+7 (993) 614-35-51', phoneHref: 'tel:+79936143551',
  address: `${city}, ${streetAddress}`,
  mapsUrl: 'https://yandex.ru/maps/org/karlayk/107539442341/',
  routeUrl: `https://yandex.ru/maps/?mode=routes&rtext=~${encodeURIComponent(`${city}, ${streetAddress}`)}&rtt=auto`,
  hours: '', // Только подтвержденный владельцем режим работы.
  logo: '', // Локальный путь к официальному логотипу.
  hero: '/images/hero.webp', heroVideo: '',
  social: [] as {name:string;url:string}[],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL || '', // Получить из «Поделиться → Код карты» официальной карточки.
  legal: {
    operator: process.env.LEGAL_OPERATOR || '[Наименование оператора]',
    inn: process.env.LEGAL_INN || '[ИНН]',
    ogrn: process.env.LEGAL_OGRN || '[ОГРН / ОГРНИП]',
    address: process.env.LEGAL_ADDRESS || '[Юридический адрес оператора]',
    email: process.env.LEGAL_EMAIL || '[Email для обращений о персональных данных]',
    retention: process.env.LEGAL_RETENTION || '[Утвержденный срок хранения заявок]',
    approved: process.env.LEGAL_APPROVED === 'true',
    version: '2026-10-12-v1',
  },
};
export const navigation = [
  {label:'Главная', href:'/'}, {label:'Услуги', href:'/services'},
  {label:'Детейлинг', href:'/directions/detailing'}, {label:'Тюнинг', href:'/directions/tuning'},
  {label:'Наши работы', href:'/works'}, {label:'Контакты', href:'/contacts'},
];
