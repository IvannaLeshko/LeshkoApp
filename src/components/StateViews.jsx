import { Link } from 'react-router-dom';
import { describeError } from '../utils/errorMessages';

/** Спільні стани для всіх сторінок: скелетон, помилка, порожній результат, «не знайдено». */

export function Skeleton({ className = '' }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

/** Скелетон повторює форму CityCard: термометр ліворуч, текст посередині, градуси праворуч. */
export function CardSkeleton() {
  return (
    <div className="card-skeleton" aria-hidden="true">
      <div className="card-skeleton__rail" />
      <div className="card-skeleton__body">
        <Skeleton className="skeleton--chip" />
        <Skeleton className="skeleton--title" />
        <Skeleton className="skeleton--meta" />
      </div>
      <div className="card-skeleton__temp">
        <Skeleton className="skeleton--degrees" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }) {
  return (
    <ul className="card-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <CardSkeleton />
        </li>
      ))}
    </ul>
  );
}

export function ErrorState({ error, onRetry, compact = false }) {
  const { title, message } = describeError(error);
  return (
    <div className={`state state--error${compact ? ' state--compact' : ''}`} role="alert">
      <p className="state__title">{title}</p>
      <p className="state__text">{message}</p>
      {onRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Спробувати ще раз
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, children, action, compact = false }) {
  return (
    <div className={`state state--empty${compact ? ' state--compact' : ''}`}>
      <p className="state__title">{title}</p>
      {children && <p className="state__text">{children}</p>}
      {action}
    </div>
  );
}

/** Елемента не існує (404): це інша ситуація, ніж «немає мережі», тож і повідомлення інше. */
export function NotFoundState({ title, children, to = '/catalog', linkLabel = 'До каталогу' }) {
  return (
    <div className="state state--not-found">
      <p className="state__code" aria-hidden="true">404</p>
      <p className="state__title">{title}</p>
      {children && <p className="state__text">{children}</p>}
      <Link className="button" to={to}>
        {linkLabel}
      </Link>
    </div>
  );
}
