/**
 * Кеш відповідей у пам'яті: Map, де ключ — адреса запиту.
 * Разом зі значенням зберігається час запису: запис старший за ttlMs вважається застарілим.
 * У кеш потрапляють лише успішні відповіді (помилки кидаються до виклику set).
 */
export function createCache({ ttlMs = 5 * 60 * 1000, maxEntries = 100 } = {}) {
  const store = new Map();

  return {
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (Date.now() - entry.savedAt > ttlMs) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      store.delete(key);
      store.set(key, { value, savedAt: Date.now() });
      while (store.size > maxEntries) {
        store.delete(store.keys().next().value);
      }
    },
  };
}
