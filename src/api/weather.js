/**
 * Шар доступу до даних. Усе, що стосується адрес, параметрів і формату відповідей Open-Meteo,
 * живе лише тут. Функції повертають нормалізовані дані; помилки розрізняються за типом:
 * NotFoundError, NetworkError, HttpError, FormatError.
 */
import { FEATURED_CITIES, UNIT_OPTIONS } from '../config';
import { createCache } from './cache';
import { FORECAST_BASE_URL, GEOCODING_BASE_URL } from './config';
import { HttpError, NotFoundError } from './errors';
import { getJson } from './http';
import { normalizeCity, parseCities, parseCity, parseCurrentForCities, parseForecast, parseHourly } from './normalize';

// Міста майже не змінюються — кеш довгий. Погода змінюється, тож відповіді старші за 10 хвилин вважаються застарілими.
const geoCache = createCache({ ttlMs: 60 * 60 * 1000, maxEntries: 100 });
const weatherCache = createCache({ ttlMs: 10 * 60 * 1000, maxEntries: 150 });

async function cachedGet(cache, url, parse, signal) {
  const cached = cache.get(url);
  if (cached !== undefined) return cached;

  const data = parse(await getJson(url, { signal }));
  cache.set(url, data);
  return data;
}

const unitParam = (unit) => (UNIT_OPTIONS.find((option) => option.value === unit) ?? UNIT_OPTIONS[0]).api;

/* ------------------------- довідник міст ------------------------- */

// Усі міста, які застосунок уже бачив (результати пошуку, добірка). Сторінка деталей бере місто звідси
// й не робить зайвого запиту; для прямого переходу за адресою місто завантажується окремо.
const cityIndex = new Map(FEATURED_CITIES.map((city) => [city.id, normalizeCity({ ...city, country_code: city.countryCode })]));

function remember(cities) {
  cities.forEach((city) => {
    cityIndex.delete(city.id);
    cityIndex.set(city.id, city);
  });
  while (cityIndex.size > 500) cityIndex.delete(cityIndex.keys().next().value);
  return cities;
}

export const featuredCities = () => FEATURED_CITIES.map((city) => cityIndex.get(city.id));

/* ------------------------- пошук міст ------------------------- */

export const MAX_RESULTS = 100;

function buildSearchUrl(query) {
  const params = new URLSearchParams({
    name: query, // URLSearchParams сам кодує пробіли, кирилицю та спецсимволи
    count: String(MAX_RESULTS),
    language: 'uk',
    format: 'json',
  });
  return `${GEOCODING_BASE_URL}/search?${params.toString()}`;
}

/** Міста за назвою (до 100). Порожній результат — не помилка, а порожній масив. */
export async function searchCities(query, { signal } = {}) {
  const cities = await cachedGet(geoCache, buildSearchUrl(query), parseCities, signal);
  return remember(cities);
}

export function peekCities(query) {
  return geoCache.get(buildSearchUrl(query));
}

/* ------------------------- одне місто ------------------------- */

function buildCityUrl(id) {
  return `${GEOCODING_BASE_URL}/get?id=${encodeURIComponent(id)}`;
}

export function peekCity(id) {
  return cityIndex.get(String(id));
}

/** Місто за id. Невідоме місто -> NotFoundError. */
export async function getCity(id, { signal } = {}) {
  if (!/^\d+$/.test(String(id))) throw new NotFoundError();
  const known = cityIndex.get(String(id));
  if (known) return known;

  let city;
  try {
    city = parseCity(await getJson(buildCityUrl(id), { signal }));
  } catch (error) {
    // Для неіснуючого id геокодер може відповісти 400 з позначкою помилки — для нас це теж «не знайдено».
    if (error instanceof HttpError && error.status === 400) throw new NotFoundError();
    throw error;
  }
  if (!city) throw new NotFoundError();
  remember([city]);
  return city;
}

/* ------------------------- поточна погода для списку ------------------------- */

function buildCurrentUrl(cities, unit) {
  const params = new URLSearchParams({
    latitude: cities.map((city) => city.latitude).join(','),
    longitude: cities.map((city) => city.longitude).join(','),
    current: 'temperature_2m,apparent_temperature,weather_code,is_day',
    temperature_unit: unitParam(unit),
    timezone: 'auto',
  });
  return `${FORECAST_BASE_URL}/forecast?${params.toString()}`;
}

/** Температура для кількох міст ОДНИМ запитом (кілька координат через кому). Повертає { [cityId]: current }. */
export function getCurrentWeather(cities, unit, { signal } = {}) {
  if (cities.length === 0) return Promise.resolve({});
  return cachedGet(weatherCache, buildCurrentUrl(cities, unit), (raw) => parseCurrentForCities(cities, raw), signal);
}

export function peekCurrentWeather(cities, unit) {
  if (cities.length === 0) return {};
  return weatherCache.get(buildCurrentUrl(cities, unit));
}

/* ------------------------- прогноз на 7 днів (деталі) ------------------------- */

function buildForecastUrl(city, unit) {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
    ].join(','),
    forecast_days: '7',
    temperature_unit: unitParam(unit),
    timezone: 'auto',
  });
  return `${FORECAST_BASE_URL}/forecast?${params.toString()}`;
}

export function getForecast(city, unit, { signal } = {}) {
  return cachedGet(weatherCache, buildForecastUrl(city, unit), parseForecast, signal);
}

export function peekForecast(city, unit) {
  return weatherCache.get(buildForecastUrl(city, unit));
}

/* ------------------------- погодинний прогноз на сьогодні (пов'язані дані) ------------------------- */

function buildHourlyUrl(city, unit) {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    hourly: 'temperature_2m,precipitation_probability,weather_code,is_day',
    forecast_days: '1',
    temperature_unit: unitParam(unit),
    timezone: 'auto',
  });
  return `${FORECAST_BASE_URL}/forecast?${params.toString()}`;
}

export function getHourly(city, unit, { signal } = {}) {
  return cachedGet(weatherCache, buildHourlyUrl(city, unit), parseHourly, signal);
}

export function peekHourly(city, unit) {
  return weatherCache.get(buildHourlyUrl(city, unit));
}

