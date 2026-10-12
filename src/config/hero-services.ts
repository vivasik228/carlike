export type RollerService={id:string;title:string;description:string;image:string;href:string};
// image: локальный путь к подтверждённому фото. Пустое значение сохраняет основной фон.
export const heroServices:RollerService[]=[
 {id:'01',title:'АВТОСЕРВИС',description:'Выберите работы по обслуживанию и ремонту. Стоимость уточним по автомобилю.',image:'',href:'/directions/service'},
 {id:'02',title:'ДИАГНОСТИКА',description:'Разобраться в причине неисправности и определить дальнейшие работы.',image:'',href:'/services/diagnostika'},
 {id:'03',title:'РЕМОНТ ХОДОВОЙ',description:'Проверка и ремонт ходовой части по результатам диагностики.',image:'',href:'/services/remont-hodovoy'},
 {id:'04',title:'ЗАМЕНА МАСЛА',description:'Замена масла с учётом требований к вашему двигателю.',image:'',href:'/services/zamena-masla'},
 {id:'05',title:'ШИНОМОНТАЖ',description:'Работы с колёсами и шинами. Уточните состав работ перед визитом.',image:'',href:'/services/shinomontazh'},
 {id:'06',title:'ДЕТЕЙЛИНГ',description:'Уход за кузовом и салоном. Состав работ согласуем по состоянию автомобиля.',image:'',href:'/services/deteiling'},
 {id:'07',title:'ОКЛЕЙКА ПЛЁНКОЙ',description:'Защитная оклейка: обсудим зоны, материалы и объём подготовки.',image:'',href:'/services/okleyka-plenkoy'},
 {id:'08',title:'ШУМОИЗОЛЯЦИЯ',description:'Доработки для акустического комфорта в вашем автомобиле.',image:'',href:'/services/shumoizolyatsiya'},
 {id:'09',title:'ТЮНИНГ',description:'Индивидуальные доработки и оборудование под вашу задачу.',image:'',href:'/services/tyuning'},
];
