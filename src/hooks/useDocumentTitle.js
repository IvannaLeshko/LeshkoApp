import { useEffect } from 'react';
import { APP_NAME } from '../config';

/** Кожна сторінка встановлює свій заголовок вкладки: «Каталог — Обрій». */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${APP_NAME}` : APP_NAME;
  }, [title]);
}
