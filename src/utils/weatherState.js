/** Статус запиту погоди -> стан температури на картці міста. */
export function cardWeatherState(status) {
  if (status === 'success') return 'ready';
  if (status === 'error' || status === 'idle') return 'none';
  return 'loading';
}
