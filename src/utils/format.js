import { UNIT_OPTIONS } from '../config';

const pluralRules = new Intl.PluralRules('uk-UA');

/** Українська множина: 1 місто, 2 міста, 5 міст. */
export function pluralize(count, forms) {
  const category = pluralRules.select(count);
  if (category === 'one') return forms.one;
  if (category === 'few') return forms.few;
  return forms.many;
}

export const CITIES_FORMS = { one: 'місто', few: 'міста', many: 'міст' };

export function formatCount(count) {
  return Number(count).toLocaleString('uk-UA');
}

export const unitSymbol = (unit) => (UNIT_OPTIONS.find((o) => o.value === unit) ?? UNIT_OPTIONS[0]).symbol;

/** «12°», «−3°», «0°»; значення без даних -> тире. Справжній мінус (−), а не дефіс. */
export function formatTemperature(value) {
  if (value === null || value === undefined) return '—';
  const rounded = Math.round(value);
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  return `${normalized < 0 ? '−' : ''}${Math.abs(normalized)}°`;
}

export function formatPopulation(value) {
  if (!value) return '';
  return `${formatCount(value)} мешканців`;
}

export function formatPercent(value) {
  return value === null || value === undefined ? '—' : `${Math.round(value)}%`;
}

export function formatWind(value) {
  return value === null || value === undefined ? '—' : `${Math.round(value)} км/год`;
}

export function formatPrecipitation(value) {
  if (value === null || value === undefined) return '—';
  return `${value.toLocaleString('uk-UA', { maximumFractionDigits: 1 })} мм`;
}

/** Дата 'YYYY-MM-DD' від API — це місцева дата міста; форматуємо в UTC, щоб пояс браузера її не зсунув. */
export function formatDay(date, index) {
  if (index === 0) return { primary: 'Сьогодні', secondary: formatShortDate(date) };
  if (index === 1) return { primary: 'Завтра', secondary: formatShortDate(date) };
  const parsed = new Date(`${date}T12:00:00Z`);
  const weekday = Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('uk-UA', { weekday: 'long', timeZone: 'UTC' });
  return { primary: weekday.charAt(0).toUpperCase() + weekday.slice(1), secondary: formatShortDate(date) };
}

function formatShortDate(date) {
  const parsed = new Date(`${date}T12:00:00Z`);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

/** '2025-06-01T14:00' -> '14:00' */
export function formatClock(iso) {
  return typeof iso === 'string' && iso.length >= 16 ? iso.slice(11, 16) : '—';
}

/** Година за місцевим часом міста: UTC-мить + зсув пояса. Повертає префікс 'YYYY-MM-DDTHH'. */
export function localHourPrefix(utcOffsetSeconds, now = Date.now()) {
  return new Date(now + utcOffsetSeconds * 1000).toISOString().slice(0, 13);
}
