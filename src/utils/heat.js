/**
 * Колір температури. Єдина шкала для смужок на картках, діапазонів у прогнозі й легенди.
 * Пороги задані в градусах Цельсія, тому значення у °F спершу переводяться.
 */
const STOPS = [
  [-25, 238],
  [-10, 218],
  [0, 196],
  [10, 166],
  [18, 120],
  [24, 52],
  [30, 26],
  [38, 6],
];

export const HEAT_MIN = STOPS[0][0];
export const HEAT_MAX = STOPS[STOPS.length - 1][0];

export const toCelsius = (value, unit) => (unit === 'f' ? ((value - 32) * 5) / 9 : value);
export const fromCelsius = (value, unit) => (unit === 'f' ? (value * 9) / 5 + 32 : value);

export function heatHue(celsius) {
  if (celsius <= HEAT_MIN) return STOPS[0][1];
  if (celsius >= HEAT_MAX) return STOPS[STOPS.length - 1][1];
  for (let i = 1; i < STOPS.length; i += 1) {
    const [t1, h1] = STOPS[i];
    if (celsius <= t1) {
      const [t0, h0] = STOPS[i - 1];
      return Math.round(h0 + ((h1 - h0) * (celsius - t0)) / (t1 - t0));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/** Де температура лежить на шкалі: від 0 (дуже холодно) до 1 (дуже спекотно). */
export function heatLevel(celsius) {
  return Math.min(1, Math.max(0, (celsius - HEAT_MIN) / (HEAT_MAX - HEAT_MIN)));
}

/** CSS-колір з відтінком зі шкали; насиченість і яскравість беруться з токенів теми. */
export const hueColor = (hue) => `hsl(${hue} var(--heat-s) var(--heat-l))`;

/** CSS-змінні для елемента, що фарбується за температурою. */
export function heatStyle(value, unit) {
  if (value === null || value === undefined) return {};
  const celsius = toCelsius(value, unit);
  return { '--heat-h': heatHue(celsius), '--level': heatLevel(celsius) };
}

export function heatGradient() {
  const stops = STOPS.map(([celsius, hue]) => `${hueColor(hue)} ${Math.round(heatLevel(celsius) * 100)}%`);
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}
