import {
  getCity,
  getCurrentWeather,
  getForecast,
  getHourly,
  peekCities,
  peekCity,
  peekCurrentWeather,
  peekForecast,
  peekHourly,
  searchCities,
} from '../api/weather';
import { useResource } from './useResource';

/** Каталог, крок 1: міста за назвою. Без запиту (менше 2 символів) хук стоїть у стані idle. */
export function useCitySearch(query) {
  return useResource({
    key: `cities:${query}`,
    enabled: query !== '',
    peek: () => peekCities(query),
    load: (signal) => searchCities(query, { signal }),
  });
}

/** Крок 2: температура для міст, що показані на поточній сторінці, одним запитом. Окремі стани. */
export function useCurrentWeather(cities, unit) {
  const ids = cities.map((city) => city.id).join(',');
  return useResource({
    key: `current:${unit}:${ids}`,
    enabled: cities.length > 0,
    peek: () => peekCurrentWeather(cities, unit),
    load: (signal) => getCurrentWeather(cities, unit, { signal }),
  });
}

/** Деталі, крок 1: місто за id з адреси. id входить у key, тому перехід між містами завантажує нове. */
export function useCity(id) {
  return useResource({
    key: `city:${id}`,
    peek: () => peekCity(id),
    load: (signal) => getCity(id, { signal }),
  });
}

/** Деталі, крок 2 (основний вміст): прогноз на 7 днів. Стартує, коли відомі координати міста. */
export function useForecast(city, unit) {
  return useResource({
    key: `forecast:${city?.id}:${unit}`,
    enabled: Boolean(city),
    peek: () => peekForecast(city, unit),
    load: (signal) => getForecast(city, unit, { signal }),
  });
}

/** Пов'язані дані: погодинний прогноз на сьогодні. Окремий запит, не чекає на основний. */
export function useHourly(city, unit) {
  return useResource({
    key: `hourly:${city?.id}:${unit}`,
    enabled: Boolean(city),
    peek: () => peekHourly(city, unit),
    load: (signal) => getHourly(city, unit, { signal }),
  });
}
