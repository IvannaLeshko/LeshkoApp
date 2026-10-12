/** Єдине місце, де живуть базові адреси API. Можна перевизначити змінними оточення. */
const trim = (url) => url.replace(/\/+$/, '');

export const GEOCODING_BASE_URL = trim(
  import.meta.env.VITE_GEOCODING_URL || 'https://geocoding-api.open-meteo.com/v1',
);
export const FORECAST_BASE_URL = trim(import.meta.env.VITE_FORECAST_URL || 'https://api.open-meteo.com/v1');
