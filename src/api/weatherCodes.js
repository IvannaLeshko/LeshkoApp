/** Коди WMO, якими Open-Meteo описує стан погоди -> підпис і тип значка. */
const CONDITIONS = {
  0: { label: 'Ясно', kind: 'clear' },
  1: { label: 'Переважно ясно', kind: 'partly' },
  2: { label: 'Мінлива хмарність', kind: 'partly' },
  3: { label: 'Похмуро', kind: 'cloudy' },
  45: { label: 'Туман', kind: 'fog' },
  48: { label: 'Паморозний туман', kind: 'fog' },
  51: { label: 'Легка мряка', kind: 'drizzle' },
  53: { label: 'Мряка', kind: 'drizzle' },
  55: { label: 'Сильна мряка', kind: 'drizzle' },
  56: { label: 'Крижана мряка', kind: 'drizzle' },
  57: { label: 'Сильна крижана мряка', kind: 'drizzle' },
  61: { label: 'Невеликий дощ', kind: 'rain' },
  63: { label: 'Дощ', kind: 'rain' },
  65: { label: 'Сильний дощ', kind: 'rain' },
  66: { label: 'Крижаний дощ', kind: 'rain' },
  67: { label: 'Сильний крижаний дощ', kind: 'rain' },
  71: { label: 'Невеликий сніг', kind: 'snow' },
  73: { label: 'Сніг', kind: 'snow' },
  75: { label: 'Сильний сніг', kind: 'snow' },
  77: { label: 'Снігова крупа', kind: 'snow' },
  80: { label: 'Невеликі зливи', kind: 'rain' },
  81: { label: 'Зливи', kind: 'rain' },
  82: { label: 'Сильні зливи', kind: 'rain' },
  85: { label: 'Снігопад', kind: 'snow' },
  86: { label: 'Сильний снігопад', kind: 'snow' },
  95: { label: 'Гроза', kind: 'thunder' },
  96: { label: 'Гроза з градом', kind: 'thunder' },
  99: { label: 'Сильна гроза з градом', kind: 'thunder' },
};

export function describeWeather(code) {
  if (code === null || code === undefined) return { label: 'Дані про погоду відсутні', kind: 'unknown' };
  return CONDITIONS[code] ?? { label: 'Невідомі погодні умови', kind: 'unknown' };
}
