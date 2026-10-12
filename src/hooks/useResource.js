import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError } from '../api/errors';

const LOADING = { status: 'loading', data: null, error: null };
const IDLE = { status: 'idle', data: null, error: null };

/**
 * Універсальний хук завантаження: статус, дані, помилка, повтор.
 *
 *  key     — проста рядкова мітка запиту. Змінився key -> завантажуємо нові дані
 *            (у масив залежностей кладемо рядок, а не об'єкти, створені під час рендеру);
 *  peek    — повертає відповідь із кешу, якщо вона там є. Тоді дані показуються миттєво, без скелетона;
 *  load    — виклик функції шару API; отримує AbortSignal;
 *  enabled — false, поки не вистачає даних для запиту (наприклад, ще невідомий автор).
 */
export function useResource({ key, peek, load, enabled = true }) {
  const [state, setState] = useState({ key: null, ...LOADING });
  const [attempt, setAttempt] = useState(0);

  // Найновіші peek/load без зайвих перезапусків ефекту.
  const latest = useRef({ peek, load });
  useEffect(() => {
    latest.current = { peek, load };
  });

  const cached = enabled ? peek() : undefined;

  useEffect(() => {
    if (!enabled || latest.current.peek() !== undefined) return undefined;

    const controller = new AbortController();
    setState({ key, ...LOADING });

    latest.current
      .load(controller.signal)
      .then((data) => setState({ key, status: 'success', data, error: null }))
      .catch((error) => {
        // Скасований запит — нормальна ситуація (змінили параметри або пішли зі сторінки).
        if (isAbortError(error) || controller.signal.aborted) return;
        setState({ key, status: 'error', data: null, error });
      });

    // Cleanup: застарілий запит скасовується, тож його відповідь не перезапише новіші дані.
    return () => controller.abort();
  }, [key, enabled, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  let view;
  if (!enabled) view = IDLE;
  else if (cached !== undefined) view = { status: 'success', data: cached, error: null };
  else if (state.key === key) view = state;
  else view = LOADING;

  return { status: view.status, data: view.data, error: view.error, retry };
}
