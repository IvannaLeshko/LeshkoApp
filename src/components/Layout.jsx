import { Suspense } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { API_ATTRIBUTION, APP_NAME } from '../config';
import { useFavorites } from '../hooks/useFavorites';
import { trackNavigation } from '../utils/navigation';
import { BrandMark } from './Icons';
import { Skeleton } from './StateViews';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/', label: 'Головна', end: true },
  { to: '/catalog', label: 'Каталог' },
  { to: '/about', label: 'Про застосунок' },
];

function PageFallback() {
  return (
    <div className="page-fallback" role="status">
      <Skeleton className="skeleton--title" />
      <Skeleton className="skeleton--meta" />
      <span className="visually-hidden">Завантаження сторінки…</span>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { count } = useFavorites();
  trackNavigation(pathname);

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        До основного вмісту
      </a>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label={`${APP_NAME}: на головну`}>
            <BrandMark />
            <span className="brand__name">{APP_NAME}</span>
          </Link>

          <nav className="site-nav" aria-label="Основна навігація">
            <ul className="site-nav__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className="nav-link">
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/favorites" className="nav-link nav-link--favorites">
                  Обране
                  <span className="counter" aria-hidden="true">
                    {count}
                  </span>
                  <span className="visually-hidden">, збережено: {count}</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="container main">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>
            Погода —{' '}
            <a href={API_ATTRIBUTION.url} target="_blank" rel="noopener noreferrer">
              {API_ATTRIBUTION.name}
            </a>{' '}
            (<a href={API_ATTRIBUTION.licenseUrl} target="_blank" rel="noopener noreferrer">{API_ATTRIBUTION.license}</a>), міста —{' '}
            <a href={API_ATTRIBUTION.geoUrl} target="_blank" rel="noopener noreferrer">
              {API_ATTRIBUTION.geoName}
            </a>
            . {APP_NAME} — незалежний застосунок, не пов’язаний з цими сервісами.
          </p>
          <Link to="/about">Про застосунок</Link>
        </div>
      </footer>

      <ScrollRestoration />
    </div>
  );
}
