import { FormatError, HttpError, NetworkError, NotFoundError, isAbortError } from './errors';

/**
 * Єдина точка, де викликається fetch.
 * fetch не відхиляє проміс на 404/500, тому статус перевіряємо тут і
 * перетворюємо на різні помилки: так сторінка може відрізнити «не знайдено» від «немає мережі».
 */
export async function getJson(url, { signal } = {}) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new NetworkError();
  }

  if (response.status === 404) throw new NotFoundError();
  if (!response.ok) throw new HttpError(response.status);

  try {
    return await response.json();
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new FormatError();
  }
}
