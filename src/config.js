export const APP_NAME = 'Обрій';

/** Джерела даних для підвалу та сторінки «Про застосунок» (посилання для людей, не адреси запитів). */
export const API_ATTRIBUTION = {
  name: 'Open-Meteo.com',
  url: 'https://open-meteo.com/',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  geoName: 'GeoNames',
  geoUrl: 'https://www.geonames.org/',
};

export const STORAGE_KEYS = {
  favorites: 'obrii:favorites',
  theme: 'obrii:theme',
};

export const SEARCH_DELAY_MS = 400;
export const MIN_QUERY_LENGTH = 2;
export const PAGE_SIZE = 12;

export const UNIT_OPTIONS = [
  { value: 'c', label: '°C', api: 'celsius', symbol: '°C' },
  { value: 'f', label: '°F', api: 'fahrenheit', symbol: '°F' },
];

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'За збігом' },
  { value: 'name', label: 'За назвою' },
  { value: 'population', label: 'За населенням' },
];

/** Приклади запитів для порожнього стану каталогу. */
export const SEARCH_EXAMPLES = ['Київ', 'Львів', 'Лондон', 'Springfield'];

/**
 * Добірка для головної. Дані міст (id GeoNames, координати) зашиті, щоб головна не залежала
 * від геокодера: погода для всіх шести завантажується одним запитом.
 */
export const FEATURED_CITIES = [
  { id: '703448', name: 'Київ', country: 'Україна', countryCode: 'UA', admin1: 'Київ', latitude: 50.45466, longitude: 30.5238, population: 2797553, timezone: 'Europe/Kyiv' },
  { id: '702550', name: 'Львів', country: 'Україна', countryCode: 'UA', admin1: 'Львівська область', latitude: 49.83826, longitude: 24.02324, population: 717803, timezone: 'Europe/Kyiv' },
  { id: '756135', name: 'Варшава', country: 'Польща', countryCode: 'PL', admin1: 'Мазовецьке воєводство', latitude: 52.22977, longitude: 21.01178, population: 1702139, timezone: 'Europe/Warsaw' },
  { id: '2950159', name: 'Берлін', country: 'Німеччина', countryCode: 'DE', admin1: 'Берлін', latitude: 52.52437, longitude: 13.41053, population: 3426354, timezone: 'Europe/Berlin' },
  { id: '2643743', name: 'Лондон', country: 'Велика Британія', countryCode: 'GB', admin1: 'Англія', latitude: 51.50853, longitude: -0.12574, population: 7556900, timezone: 'Europe/London' },
  { id: '1850147', name: 'Токіо', country: 'Японія', countryCode: 'JP', admin1: 'Токіо', latitude: 35.6895, longitude: 139.69171, population: 8336599, timezone: 'Asia/Tokyo' },
];

/** Швидкі добірки на головній: кожна веде в каталог із уже застосованими фільтрами. */
export const HOME_LINKS = [
  {
    label: 'Springfield у США',
    description: 'Скільки їх насправді — фільтр за країною',
    params: { q: 'Springfield', country: 'US' },
  },
  {
    label: 'Берлін у фаренгейтах',
    description: 'Той самий прогноз в інших одиницях',
    params: { q: 'Берлін', unit: 'f' },
  },
  {
    label: 'Найбільші Парижі',
    description: 'Сортування за населенням',
    params: { q: 'Париж', sort: 'population' },
  },
  {
    label: 'Міста Львівщини',
    description: 'Львів і його сусіди, лише Україна',
    params: { q: 'Львів', country: 'UA' },
  },
];
