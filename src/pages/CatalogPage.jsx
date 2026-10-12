import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import CityCard from '../components/CityCard';
import { FilterIcon } from '../components/Icons';
import FilterPanel from '../components/FilterPanel';
import PageHeading from '../components/PageHeading';
import Pagination from '../components/Pagination';
import SearchField from '../components/SearchField';
import { CardSkeletonGrid, EmptyState, ErrorState } from '../components/StateViews';
import ThermoLegend from '../components/ThermoLegend';
import { MIN_QUERY_LENGTH, PAGE_SIZE, SEARCH_DELAY_MS, SEARCH_EXAMPLES } from '../config';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useCitySearch, useCurrentWeather } from '../hooks/useWeatherData';
import {
  DEFAULT_FILTERS,
  applyClientFilters,
  catalogPath,
  collectCountries,
  countActiveFilters,
  normalizeQuery,
  readCatalogParams,
  toSearchParams,
} from '../utils/catalogParams';
import { CITIES_FORMS, formatCount, pluralize } from '../utils/format';
import { cardWeatherState } from '../utils/weatherState';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // URL — єдине джерело правди: пошук, країна, одиниці, сортування й сторінка читаються звідси.
  const params = readCatalogParams(searchParams);
  const { q, country, unit, sort, page } = params;
  const query = q.length >= MIN_QUERY_LENGTH ? q : '';

  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ---------- поле пошуку: текст -> (пауза) -> URL, і назад (кнопка «Назад») ---------- */
  const [text, setText] = useState(q);
  const typed = normalizeQuery(text);
  const debounced = useDebouncedValue(typed, typed === '' ? 0 : SEARCH_DELAY_MS);

  useEffect(() => {
    setText((current) => (normalizeQuery(current) === q ? current : q));
  }, [q]);

  useEffect(() => {
    // У адресу потрапляє лише «заспокоєний» текст; replace, щоб кожна літера не засмічувала історію.
    // Нова назва міста скидає країну (вона належала попередньому пошуку) і сторінку.
    if (debounced !== typed || debounced === q) return;
    setSearchParams(toSearchParams({ unit, sort, q: debounced, country: '', page: 1 }), { replace: true });
  }, [debounced, typed, q, unit, sort, setSearchParams]);

  /* ---------- фільтри: зміна будь-якого повертає на першу сторінку ---------- */
  const updateFilters = (patch) => setSearchParams(toSearchParams({ ...params, ...patch, page: 1 }));
  const resetFilters = () => setSearchParams(toSearchParams({ ...DEFAULT_FILTERS, q, page: 1 }));
  const getPageTo = (nextPage) => ({ search: `?${toSearchParams({ ...params, page: nextPage })}` });

  /* ---------- крок 1: міста (геокодер, до 100), клієнтські країна й сортування, сторінка ---------- */
  const search = useCitySearch(query);
  const found = search.data ?? [];
  const countries = useMemo(() => collectCountries(found), [found]);
  const filtered = useMemo(() => applyClientFilters(found, { country, sort }), [found, country, sort]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageCities = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  /* ---------- крок 2: температура лише для міст поточної сторінки ---------- */
  const weather = useCurrentWeather(pageCities, unit);
  const cardState = cardWeatherState(weather.status);

  const activeFilters = countActiveFilters(params);
  const from = `${location.pathname}${location.search}`;

  useDocumentTitle(query ? `Пошук: ${query}` : 'Каталог');

  let summary = '';
  if (search.status === 'loading') summary = 'Шукаємо міста…';
  if (search.status === 'success' && filtered.length > 0) {
    summary = `Знайдено ${formatCount(filtered.length)} ${pluralize(filtered.length, CITIES_FORMS)}`;
    if (country && found.length !== filtered.length) summary += ` (із ${formatCount(found.length)} за назвою)`;
    summary += '.';
  }

  return (
    <div className="catalog">
      <header className="page-header">
        <PageHeading>Каталог міст</PageHeading>
        <p className="page-header__lead">
          Введіть назву міста: покажемо до 100 збігів із температурою зараз. Країну можна уточнити фільтром.
        </p>
      </header>

      <div className="catalog__controls">
        <SearchField
          id="catalog-search"
          label="Назва міста"
          value={text}
          onChange={setText}
          placeholder="Наприклад: Харків, Paris, Springfield"
          hint={typed.length === 1 ? 'Для пошуку потрібно щонайменше 2 символи.' : undefined}
        />

        <button
          type="button"
          className="button button--ghost catalog__filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <FilterIcon />
          Фільтри
          {activeFilters > 0 && <span className="counter">{activeFilters}</span>}
        </button>

        <FilterPanel
          id="catalog-filters"
          params={params}
          countries={countries}
          open={filtersOpen}
          onChange={updateFilters}
          onReset={resetFilters}
          canReset={activeFilters > 0}
        />
      </div>

      <section className="results" aria-live="polite" aria-busy={search.status === 'loading'} aria-label="Результати">
        {/* Стан очікування: поки немає запиту, нічого не завантажуємо */}
        {search.status === 'idle' && (
          <EmptyState title="Введіть назву міста">
            Прогноз з’явиться після першого пошуку. Спробуйте:{' '}
            {SEARCH_EXAMPLES.map((example, index) => (
              <span key={example}>
                <Link to={catalogPath({ q: example, unit, sort })}>{example}</Link>
                {index < SEARCH_EXAMPLES.length - 1 ? ', ' : ''}
              </span>
            ))}
            .
          </EmptyState>
        )}

        {search.status !== 'idle' && (
          <div className="results__bar">
            <p className="results__summary">{summary}</p>
            {search.status === 'success' && filtered.length > 0 && <ThermoLegend unit={unit} />}
          </div>
        )}

        {search.status === 'loading' && <CardSkeletonGrid count={PAGE_SIZE} />}

        {search.status === 'error' && <ErrorState error={search.error} onRetry={search.retry} />}

        {search.status === 'success' && found.length === 0 && (
          <EmptyState title="Міст не знайдено">
            За запитом «{query}» геокодер нічого не знайшов. Перевірте написання або спробуйте назву
            іншою мовою.
          </EmptyState>
        )}

        {search.status === 'success' && found.length > 0 && filtered.length === 0 && (
          <EmptyState
            title="Немає міст для цього фільтра"
            action={
              <button type="button" className="button" onClick={resetFilters}>
                Скинути фільтри
              </button>
            }
          >
            Серед знайдених за назвою міст немає жодного з вибраної країни.
          </EmptyState>
        )}

        {search.status === 'success' && filtered.length > 0 && pageCities.length === 0 && (
          <EmptyState
            title="Такої сторінки немає"
            action={
              <Link className="button" to={getPageTo(1)}>
                На першу сторінку
              </Link>
            }
          >
            У вибірки лише {totalPages} {totalPages === 1 ? 'сторінка' : 'сторінок'}.
          </EmptyState>
        )}

        {pageCities.length > 0 && (
          <>
            {weather.status === 'error' && <ErrorState compact error={weather.error} onRetry={weather.retry} />}
            <ul className="card-grid">
              {pageCities.map((city) => (
                <li key={city.id}>
                  <CityCard city={city} unit={unit} from={from} weather={cardState} current={weather.data?.[city.id]} />
                </li>
              ))}
            </ul>
            <Pagination page={page} totalPages={totalPages} getTo={getPageTo} />
          </>
        )}
      </section>
    </div>
  );
}
