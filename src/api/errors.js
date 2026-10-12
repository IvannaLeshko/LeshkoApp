/** Запит не дійшов до сервера: немає мережі, збій DNS тощо. */
export class NetworkError extends Error {
  constructor() {
    super('Network error');
    this.name = 'NetworkError';
  }
}

/** Сервер відповів, що елемента немає (404). Це не те саме, що «немає мережі». */
export class NotFoundError extends Error {
  constructor() {
    super('Not found');
    this.name = 'NotFoundError';
  }
}

/** Будь-який інший неуспішний статус (429, 500 тощо). */
export class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Відповідь прийшла, але її не вдалося прочитати. */
export class FormatError extends Error {
  constructor() {
    super('Unexpected response format');
    this.name = 'FormatError';
  }
}

/** Скасований через AbortController запит — не помилка для користувача. */
export function isAbortError(error) {
  return error instanceof DOMException && error.name === 'AbortError';
}
