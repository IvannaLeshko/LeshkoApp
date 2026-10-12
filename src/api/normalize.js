/**
 * Адаптери: сирі відповіді Open-Meteo -> власні структури застосунку з безпечними значеннями.
 * Компоненти працюють лише з результатом цих функцій і не знають імен полів API.
 */
import { FormatError } from './errors';
import { describeWeather } from './weatherCodes';

const numberOrNull = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const text = (value) => (typeof value === 'string' ? value.trim() : '');

/* ------------------------------ міста ------------------------------ */

function isValidPlace(place) {
  return (
    typeof place === 'object' &&
    place !== null &&
    (typeof place.id === 'number' || typeof place.id === 'string') &&
    Number.isFinite(place.latitude) &&
    Number.isFinite(place.longitude)
  );
}

export function normalizeCity(place) {
  const admin1 = text(place.admin1);
  const country = text(place.country);
  return {
    id: String(place.id),
    name: text(place.name) || 'Місто без назви',
    admin1,
    country,
    countryCode: text(place.country_code).toUpperCase(),
    region: [admin1, country].filter(Boolean).join(', ') || 'Країна невідома',
    latitude: place.latitude,
    longitude: place.longitude,
    population: numberOrNull(place.population),
    timezone: text(place.timezone),
  };
}

/** Відповідь геокодера -> список міст. Порожній результат API передає відсутністю поля `results`. */
export function parseCities(raw) {
  if (typeof raw !== 'object' || raw === null) throw new FormatError();
  if (raw.results === undefined || raw.results === null) return [];
  if (!Array.isArray(raw.results)) throw new FormatError();

  const seen = new Set();
  return raw.results
    .filter(isValidPlace)
    .map(normalizeCity)
    .filter((city) => !seen.has(city.id) && seen.add(city.id));
}

/** Відповідь `/get?id=` -> одне місто. Відсутній об'єкт або позначка помилки — це «не знайдено». */
export function parseCity(raw) {
  if (typeof raw !== 'object' || raw === null) throw new FormatError();
  if (raw.error === true || !isValidPlace(raw)) return null;
  return normalizeCity(raw);
}

/* ------------------------------ погода ------------------------------ */

function normalizeCurrent(current) {
  if (!current || typeof current !== 'object') return null;
  const code = numberOrNull(current.weather_code);
  const condition = describeWeather(code);
  return {
    time: text(current.time),
    temperature: numberOrNull(current.temperature_2m),
    feelsLike: numberOrNull(current.apparent_temperature),
    humidity: numberOrNull(current.relative_humidity_2m),
    wind: numberOrNull(current.wind_speed_10m),
    isDay: current.is_day !== 0,
    label: condition.label,
    kind: condition.kind,
  };
}

/** Для кількох координат Open-Meteo повертає масив, для однієї — об'єкт. */
function toList(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object' && raw !== null) return [raw];
  throw new FormatError();
}

/** Поточна погода для кількох міст -> { [cityId]: current }. */
export function parseCurrentForCities(cities, raw) {
  const list = toList(raw);
  const result = {};
  cities.forEach((city, index) => {
    result[city.id] = normalizeCurrent(list[index]?.current);
  });
  return result;
}

function zip(daily, key) {
  const values = daily?.[key];
  return Array.isArray(values) ? values : [];
}

/** Прогноз на 7 днів + поточна погода. */
export function parseForecast(raw) {
  if (typeof raw !== 'object' || raw === null || !raw.daily || !Array.isArray(raw.daily.time)) {
    throw new FormatError();
  }
  const { daily } = raw;
  const days = daily.time.map((date, index) => {
    const condition = describeWeather(numberOrNull(zip(daily, 'weather_code')[index]));
    return {
      date: String(date),
      label: condition.label,
      kind: condition.kind,
      max: numberOrNull(zip(daily, 'temperature_2m_max')[index]),
      min: numberOrNull(zip(daily, 'temperature_2m_min')[index]),
      precipitation: numberOrNull(zip(daily, 'precipitation_sum')[index]),
      precipitationChance: numberOrNull(zip(daily, 'precipitation_probability_max')[index]),
      windMax: numberOrNull(zip(daily, 'wind_speed_10m_max')[index]),
      sunrise: text(zip(daily, 'sunrise')[index]),
      sunset: text(zip(daily, 'sunset')[index]),
    };
  });
  return {
    current: normalizeCurrent(raw.current),
    days,
    utcOffsetSeconds: numberOrNull(raw.utc_offset_seconds) ?? 0,
  };
}

/** Погодинний прогноз на сьогодні (24 години за місцевим часом міста). */
export function parseHourly(raw) {
  if (typeof raw !== 'object' || raw === null || !raw.hourly || !Array.isArray(raw.hourly.time)) {
    throw new FormatError();
  }
  const { hourly } = raw;
  const hours = hourly.time.map((time, index) => {
    const condition = describeWeather(numberOrNull(zip(hourly, 'weather_code')[index]));
    return {
      time: String(time),
      temperature: numberOrNull(zip(hourly, 'temperature_2m')[index]),
      precipitationChance: numberOrNull(zip(hourly, 'precipitation_probability')[index]),
      isDay: zip(hourly, 'is_day')[index] !== 0,
      label: condition.label,
      kind: condition.kind,
    };
  });
  return { hours, utcOffsetSeconds: numberOrNull(raw.utc_offset_seconds) ?? 0 };
}
