import { Link } from 'react-router-dom';
import { formatPopulation, formatTemperature, unitSymbol } from '../utils/format';
import { cityPath } from '../utils/catalogParams';
import { heatStyle } from '../utils/heat';
import FavoriteButton from './FavoriteButton';
import { PinIcon } from './Icons';
import { Skeleton } from './StateViews';
import WeatherIcon from './WeatherIcon';

/**
 * Картка міста. Ліворуч — «термометр»: висота заливки й колір залежать від температури.
 * Температура приходить окремим запитом, тому картка має три стани погоди:
 * 'loading' (скелетон), 'ready' (дані) і 'none' (даних немає або запит не вдався).
 * Вся картка клікабельна через розтягнуте посилання на назві.
 */
export default function CityCard({ city, unit, from, weather: requested = 'none', current = null, rank }) {
  // Запит успішний, але для цього міста даних немає (наприклад, воно поза межами запиту) -> «немає даних».
  const weather = requested === 'ready' && !current ? 'none' : requested;
  const ready = weather === 'ready' && current && current.temperature !== null;
  const style = ready ? heatStyle(current.temperature, unit) : undefined;
  const population = formatPopulation(city.population);

  return (
    <article className={`city-card${ready ? ' has-heat' : ''}`} style={style}>
      <div className="city-card__rail" aria-hidden="true">
        <span className="city-card__mercury" />
      </div>

      <div className="city-card__body">
        <p className="city-card__region">
          <PinIcon />
          <span>{city.region}</span>
        </p>
        <h3 className="city-card__name">
          <Link to={cityPath(city.id, unit)} state={{ from }} className="city-card__link">
            {rank != null && <span className="visually-hidden">{rank}. </span>}
            {city.name}
          </Link>
        </h3>
        {weather === 'loading' && <Skeleton className="skeleton--meta" />}
        {ready && (
          <p className="city-card__condition">
            <WeatherIcon kind={current.kind} isDay={current.isDay} size={22} />
            <span>{current.label}</span>
          </p>
        )}
        {weather === 'none' && <p className="city-card__condition city-card__condition--muted">Погода недоступна</p>}
        {population && <p className="city-card__meta">{population}</p>}
      </div>

      <div className="city-card__temp">
        {weather === 'loading' ? (
          <Skeleton className="skeleton--degrees" />
        ) : (
          <>
            <span className="city-card__degrees" aria-label={ready ? `${formatTemperature(current.temperature)} ${unitSymbol(unit)}` : 'немає даних'}>
              {ready ? formatTemperature(current.temperature) : '—'}
            </span>
            {ready && current.feelsLike !== null && (
              <span className="city-card__feels">відчувається {formatTemperature(current.feelsLike)}</span>
            )}
          </>
        )}
      </div>

      <FavoriteButton item={city} className="city-card__favorite" />
    </article>
  );
}
