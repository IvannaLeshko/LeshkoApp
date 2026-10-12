import { useEffect, useState } from 'react';

/**
 * Повертає value із затримкою: нове значення з'являється лише тоді,
 * коли value не змінювалось протягом delay мс. Cleanup скасовує таймер.
 */
export function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timerId);
  }, [value, delay]);

  return debounced;
}
