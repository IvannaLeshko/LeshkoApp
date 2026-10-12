import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

/** 1 … 4 [5] 6 … 20 */
function buildRange(page, totalPages) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const numbers = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  const result = [];
  numbers.forEach((n, index) => {
    if (index > 0 && n - numbers[index - 1] > 1) result.push('gap');
    result.push(n);
  });
  return result;
}

/** Номер сторінки живе в URL, тому кожна кнопка — справжнє посилання (працює «Назад» і «Копіювати адресу»). */
export default function Pagination({ page, totalPages, getTo }) {
  if (totalPages <= 1) return null;

  const items = buildRange(page, totalPages);

  return (
    <nav className="pagination" aria-label="Сторінки результатів">
      {page > 1 ? (
        <Link className="pagination__step" to={getTo(page - 1)} aria-label="Попередня сторінка">
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span className="pagination__step is-disabled" aria-hidden="true">
          <ChevronLeftIcon />
        </span>
      )}

      <p className="pagination__summary">
        Сторінка {page} з {totalPages}
      </p>

      <ul className="pagination__list">
        {items.map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className="pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                className={`pagination__page${item === page ? ' is-current' : ''}`}
                to={getTo(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Сторінка ${item}`}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      {page < totalPages ? (
        <Link className="pagination__step" to={getTo(page + 1)} aria-label="Наступна сторінка">
          <ChevronRightIcon />
        </Link>
      ) : (
        <span className="pagination__step is-disabled" aria-hidden="true">
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  );
}
