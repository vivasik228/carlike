export type RollerService={id:string;title:string;description:string;image:string;href:string};
// image: локальный путь к подтверждённому фото. Пустое значение сохраняет основной фон.
export const heroServices:RollerService[]=[
 {id:'01',title:'АВТОСЕРВИС',description:'ТО и ремонт автомобиля. Позвоните, чтобы обсудить работы и стоимость.',image:'',href:'/directions/service'},
 {id:'02',title:'ДИАГНОСТИКА',description:'Проверим машину и обсудим, что нужно ремонтировать.',image:'',href:'/services/diagnostika'},
 {id:'03',title:'РЕМОНТ ХОДОВОЙ',description:'Проверим подвеску и ходовую. Ремонт обсудим после диагностики.',image:'',href:'/services/remont-hodovoy'},
 {id:'04',title:'ЗАМЕНА МАСЛА',description:'Замена масла по требованиям производителя.',image:'',href:'/services/zamena-masla'},
 {id:'05',title:'ШИНОМОНТАЖ',description:'Работы с колёсами и шинами. Позвоните перед визитом.',image:'',href:'/services/shinomontazh'},
 {id:'06',title:'ДЕТЕЙЛИНГ',description:'Уход за кузовом и салоном. Подберём работы по состоянию машины.',image:'',href:'/services/deteiling'},
 {id:'07',title:'ОКЛЕЙКА ПЛЁНКОЙ',description:'Обсудим, какие детали оклеить, какой плёнкой и как подготовить кузов.',image:'',href:'/services/okleyka-plenkoy'},
 {id:'08',title:'ШУМОИЗОЛЯЦИЯ',description:'Шумоизоляция для более тихой поездки.',image:'',href:'/services/shumoizolyatsiya'},
 {id:'09',title:'ТЮНИНГ',description:'Расскажите, что хотите изменить в машине. Обсудим, как это сделать.',image:'',href:'/services/tyuning'},
];
