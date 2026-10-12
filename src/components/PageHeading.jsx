import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { userHasNavigated } from '../utils/navigation';

/**
 * Головний заголовок сторінки. Після переходу фокус ставиться на нього:
 * користувач екранного читача дізнається, що сторінка змінилась.
 * tabIndex=-1 дозволяє фокусувати заголовок програмно, не додаючи його в Tab-порядок.
 */
export default function PageHeading({ children, className = '' }) {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (userHasNavigated()) ref.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <h1 ref={ref} tabIndex={-1} className={`page-heading ${className}`.trim()}>
      {children}
    </h1>
  );
}
