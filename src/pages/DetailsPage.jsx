import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { NotFoundError } from '../api/errors';
import ChipGroup from '../components/ChipGroup';
import DailyForecast from '../components/DailyForecast';
import FavoriteButton from '../components/FavoriteButton';
import HourlyChart from '../components/HourlyChart';
import { ChevronLeftIcon, PinIcon } from '../components/Icons';
import PageHeading from '../components/PageHeading';
import { EmptyState, ErrorState, NotFoundState, Skeleton } from '../components/StateViews';
import WeatherIcon from '../components/WeatherIcon';
import { UNIT_OPTIONS } from '../config';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useCity, useForecast, useHourly } from '../hooks/useWeatherData';
import { readCatalogParams } from '../utils/catalogParams';
import {
  formatClock,
  formatPercent,
  formatPopulation,
  formatTemperature,
  formatWind,
  unitSymbol,
} from '../utils/format';
import { heatStyle } from '../utils/heat';

function CurrentConditions({ forecast, unit }) {
  const { current, days } = forecast;
  if (!current) {
    return (
      <EmptyState compact title="Поточної погоди немає">
        Сервіс не повернув дані про погоду зараз. Прогноз на тиждень нижче.
      </EmptyState>
    );
  }
  const today = days[0];
  return (
    <section className="now has-heat" style={heatStyle(current.temperature, unit)} aria-labelledby="now-title">
      <h2 id="now-title" className="visually-hidden">
        Погода зараз
      </h2>
      <div className="now__main">
        <WeatherIcon kind={current.kind} isDay={current.isDay} size={64} />
        <p className="now__temp">
          <span className="now__degrees">{formatTemperature(current.temperature)}</span>
          <span className="now__unit">{unitSymbol(unit).slice(1)}</span>
        </p>
        <p className="now__label">{current.label}</p>
      </div>
      <dl className="now__facts">
        <div>
          <dt>Відчувається</dt>
          <dd>{formatTemperature(current.feelsLike)}</dd>
        </div>
        <div>
          <dt>Вологість</dt>
          <dd>{formatPercent(current.humidity)}</dd>
        </div>
        <div>
          <dt>Вітер</dt>
          <dd>{formatWind(current.wind)}</dd>
        </div>
        {today?.sunrise && (
          <div>
            <dt>Схід сонця</dt>
            <dd>{formatClock(today.sunrise)}</dd>
          </div>
        )}
        {today?.sunset && (
          <div>
            <dt>Захід сонця</dt>
            <dd>{formatClock(today.sunset)}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

function Hourly({ hourly }) {
  return (
    <section className="hourly" aria-labelledby="hourly-title">
      <h2 id="hourly-title" className="section__title section__title--small">
        Сьогодні по годинах
      </h2>

      {hourly.status === 'loading' && (
        <div className="hourly__skeleton" aria-hidden="true">
          <Skeleton className="skeleton--chart" />
        </div>
      )}
      {hourly.status === 'error' && <ErrorState compact error={hourly.error} onRetry={hourly.retry} />}
      {hourly.status === 'success' && hourly.data.hours.length === 0 && (
        <EmptyState compact title="Погодинного прогнозу немає">
          Сервіс не повернув дані по годинах для цього міста.
        </EmptyState>
      )}
      {hourly.status === 'success' && hourly.data.hours.length > 0 && (
        <HourlyChart hours={hourly.data.hours} utcOffsetSeconds={hourly.data.utcOffsetSeconds} />
      )}
    </section>
  );
}

export default function DetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { unit } = readCatalogParams(searchParams);

  const backTo = location.state?.from ?? '/catalog';
  const backLabel = backTo.startsWith('/favorites')
    ? 'Назад до обраного'
    : backTo === '/'
      ? 'На головну'
      : 'Назад до каталогу';

  // Три послідовні кроки: місто -> (прогноз на 7 днів || погодинний прогноз). Останні два незалежні:
  // вони стартують, щойно відомі координати, і мають власні скелетони та помилки.
  const city = useCity(id);
  const forecast = useForecast(city.data, unit);
  const hourly = useHourly(city.data, unit);

  const isNotFound = city.status === 'error' && city.error instanceof NotFoundError;

  let title = 'Місто';
  if (city.status === 'success') title = `${city.data.name}: прогноз на 7 днів`;
  if (isNotFound) title = 'Не знайдено';
  else if (city.status === 'error') title = 'Помилка';
  useDocumentTitle(title);

  const changeUnit = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === 'c') params.delete('unit');
    else params.set('unit', next);
    setSearchParams(params, { replace: true, state: location.state });
  };

  const data = city.data;

  return (
    <article className="details">
      <Link className="back-link" to={backTo}>
        <ChevronLeftIcon />
        {backLabel}
      </Link>

      <header className="details__head">
        <div>
          <PageHeading className="details__title">
            {city.status === 'loading' && (
              <>
                <Skeleton className="skeleton--heading" />
                <span className="visually-hidden">Завантаження міста…</span>
              </>
            )}
            {city.status === 'success' && data.name}
            {isNotFound && 'Місто не знайдено'}
            {city.status === 'error' && !isNotFound && 'Не вдалося завантажити'}
          </PageHeading>
          {city.status === 'success' && (
            <p className="details__region">
              <PinIcon />
              <span>{data.region}</span>
              {data.population ? <span className="details__population">{formatPopulation(data.population)}</span> : null}
            </p>
          )}
        </div>

        {city.status === 'success' && (
          <div className="details__actions">
            <ChipGroup legend="Одиниці" options={UNIT_OPTIONS} value={unit} onChange={changeUnit} />
            <FavoriteButton item={data} withLabel />
          </div>
        )}
      </header>

      {isNotFound && (
        <NotFoundState title={`Міста з номером ${id} не існує`} to={backTo} linkLabel={backLabel}>
          Перевірте адресу або знайдіть місто в каталозі.
        </NotFoundState>
      )}

      {city.status === 'error' && !isNotFound && <ErrorState error={city.error} onRetry={city.retry} />}

      {city.status === 'success' && (
        <div className="details__layout">
          <div className="details__main">
            {forecast.status === 'loading' && (
              <div className="details__skeleton" aria-hidden="true">
                <Skeleton className="skeleton--now" />
                <Skeleton className="skeleton--days" />
              </div>
            )}
            {forecast.status === 'error' && <ErrorState error={forecast.error} onRetry={forecast.retry} />}
            {forecast.status === 'success' && (
              <>
                <CurrentConditions forecast={forecast.data} unit={unit} />
                <section aria-labelledby="days-title">
                  <h2 id="days-title" className="section__title section__title--small">
                    Прогноз на 7 днів
                  </h2>
                  {forecast.data.days.length > 0 ? (
                    <DailyForecast days={forecast.data.days} unit={unit} />
                  ) : (
                    <EmptyState compact title="Прогнозу немає">
                      Сервіс не повернув денний прогноз для цього міста.
                    </EmptyState>
                  )}
                </section>
              </>
            )}
          </div>

          <Hourly hourly={hourly} />
        </div>
      )}
    </article>
  );
}
