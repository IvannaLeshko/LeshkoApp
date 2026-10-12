import { SORT_OPTIONS, UNIT_OPTIONS } from '../config';

export const DEFAULT_FILTERS = { country: '', unit: 'c', sort: 'relevance' };

const isOneOf = (options, value) => options.some((option) => option.value === value);

export function normalizeQuery(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

/** URL -> параметри каталогу. Усе недозволене (ручна правка адреси) замінюється значеннями за замовчуванням. */
export function readCatalogParams(searchParams) {
  const country = (searchParams.get('country') ?? '').toUpperCase();
  const unit = searchParams.get('unit');
  const sort = searchParams.get('sort');
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);

  return {
    q: normalizeQuery(searchParams.get('q')),
    country: /^[A-Z]{2}$/.test(country) ? country : DEFAULT_FILTERS.country,
    unit: isOneOf(UNIT_OPTIONS, unit) ? unit : DEFAULT_FILTERS.unit,
    sort: isOneOf(SORT_OPTIONS, sort) ? sort : DEFAULT_FILTERS.sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** Параметри каталогу -> URL. Значення за замовчуванням в адресу не потрапляють. */
export function toSearchParams(params) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.country && params.country !== DEFAULT_FILTERS.country) search.set('country', params.country);
  if (params.unit !== DEFAULT_FILTERS.unit) search.set('unit', params.unit);
  if (params.sort !== DEFAULT_FILTERS.sort) search.set('sort', params.sort);
  if (params.page > 1) search.set('page', String(params.page));
  return search;
}

export function catalogPath(params) {
  const query = toSearchParams({ q: '', page: 1, ...DEFAULT_FILTERS, ...params }).toString();
  return query ? `/catalog?${query}` : '/catalog';
}

/** Адреса сторінки міста; одиниці температури переносяться в адресу, щоб не губитися при переході. */
export function cityPath(id, unit) {
  return unit && unit !== DEFAULT_FILTERS.unit ? `/city/${id}?unit=${unit}` : `/city/${id}`;
}

/** Скільки фільтрів відрізняються від значень за замовчуванням (пошуковий текст не рахується). */
export function countActiveFilters(params) {
  return ['country', 'unit', 'sort'].filter((key) => params[key] !== DEFAULT_FILTERS[key]).length;
}

/**
 * Клієнтські фільтр і сортування над уже знайденими містами.
 * Країна — клієнтський фільтр: геокодер не вміє фільтрувати за країною разом з назвою.
 */
export function applyClientFilters(cities, { country, sort }) {
  const filtered = country ? cities.filter((city) => city.countryCode === country) : cities;
  if (sort === 'name') {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'uk'));
  }
  if (sort === 'population') {
    return [...filtered].sort((a, b) => (b.population ?? -1) - (a.population ?? -1));
  }
  return filtered; // «за збігом» — порядок, у якому віддав геокодер
}

/** Країни, що трапились серед знайдених міст, з кількістю міст у кожній. */
export function collectCountries(cities) {
  const map = new Map();
  cities.forEach((city) => {
    if (!city.countryCode) return;
    const entry = map.get(city.countryCode) ?? { value: city.countryCode, name: city.country || city.countryCode, count: 0 };
    entry.count += 1;
    map.set(city.countryCode, entry);
  });
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'uk'));
}
