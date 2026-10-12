import { FormatError, HttpError, NetworkError } from '../api/errors';

/** Людські повідомлення про помилки: що сталося й що робити. */
export function describeError(error) {
  if (error instanceof NetworkError) {
    return {
      title: 'Немає з’єднання',
      message: 'Перевірте інтернет і спробуйте ще раз.',
    };
  }
  if (error instanceof HttpError && error.status === 429) {
    return {
      title: 'Забагато запитів',
      message: 'Сервіс просить зачекати. Спробуйте через хвилину.',
    };
  }
  if (error instanceof HttpError && error.status >= 500) {
    return {
      title: 'Сервіс не відповідає',
      message: 'Помилка на боці сервісу. Спробуйте за кілька хвилин.',
    };
  }
  if (error instanceof FormatError) {
    return {
      title: 'Незрозуміла відповідь',
      message: 'Сервіс повернув дані в несподіваному вигляді. Спробуйте ще раз.',
    };
  }
  return {
    title: 'Щось пішло не так',
    message: 'Не вдалося завантажити дані. Спробуйте ще раз.',
  };
}
