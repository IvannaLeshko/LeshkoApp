import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ChipGroup from '../components/ChipGroup';
import CityCard from '../components/CityCard';
import PageHeading from '../components/PageHeading';
import { EmptyState } from '../components/StateViews';
import { UNIT_OPTIONS } from '../config';
import { useCurrentWeather } from '../hooks/useWeatherData';
import { readCatalogParams } from '../utils/catalogParams';
import { cardWeatherState } from '../utils/weatherState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFavorites } from '../hooks/useFavorites';

// Один запит містить координати всіх міст, тож його довжина обмежена.
const MAX_WITH_WEATHER = 40;

export default function FavoritesPage() {
  useDocumentTitle('Обране');
  const { items, count, clear } = useFavorites();
  const [confirming, setConfirming] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { unit } = readCatalogParams(searchParams);

  // Температура для обраних міст — один запит; погода не зберігається, щоб не показувати застарілу.
  const weather = useCurrentWeather(items.slice(0, MAX_WITH_WEATHER), unit);

  return (
    <div className="favorites">
      <header className="page-header">
        <PageHeading>Обране</PageHeading>
        <p className="page-header__lead">
          Список зберігається в цьому браузері. Температура щоразу береться свіжа.
        </p>
      </header>

      {count === 0 ? (
        <EmptyState
          title="Тут поки порожньо"
          action={
            <Link className="button" to="/catalog">
              Знайти місто
            </Link>
          }
        >
          Натисніть зірку на картці міста, і воно з’явиться тут.
        </EmptyState>
      ) : (
        <>
          <div className="favorites__bar">
            <p className="favorites__count" role="status">
              Збережено: {count}
            </p>
            {confirming ? (
              <div className="favorites__confirm" role="group" aria-label="Підтвердження очищення">
                <span>Видалити все з обраного?</span>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => {
                    clear();
                    setConfirming(false);
                  }}
                >
                  Так, очистити
                </button>
                <button type="button" className="button button--ghost" onClick={() => setConfirming(false)}>
                  Скасувати
                </button>
              </div>
            ) : (
              <button type="button" className="button button--ghost" onClick={() => setConfirming(true)}>
                Очистити все
              </button>
            )}
          </div>

          <ChipGroup
            legend="Одиниці температури"
            options={UNIT_OPTIONS}
            value={unit}
            onChange={(next) => setSearchParams(next === 'c' ? {} : { unit: next }, { replace: true })}
          />

          <ul className="card-grid favorites__grid">
            {items.map((city) => (
              <li key={city.id}>
                <CityCard
                  city={city}
                  unit={unit}
                  from="/favorites"
                  weather={cardWeatherState(weather.status)}
                  current={weather.data?.[city.id]}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
