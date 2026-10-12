import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { featuredCities } from '../api/weather';
import CityCard from '../components/CityCard';
import PageHeading from '../components/PageHeading';
import { ErrorState } from '../components/StateViews';
import ThermoLegend from '../components/ThermoLegend';
import { HOME_LINKS, MIN_QUERY_LENGTH, SEARCH_EXAMPLES } from '../config';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useCurrentWeather } from '../hooks/useWeatherData';
import { catalogPath, normalizeQuery } from '../utils/catalogParams';
import { cardWeatherState } from '../utils/weatherState';

const FEATURED = featuredCities();

export default function HomePage() {
  useDocumentTitle('');
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const weather = useCurrentWeather(FEATURED, 'c');

  const submit = (event) => {
    event.preventDefault();
    const q = normalizeQuery(text);
    navigate(q.length >= MIN_QUERY_LENGTH ? catalogPath({ q }) : '/catalog');
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__copy">
          <PageHeading className="hero__title">Погода в будь‑якому місті на тиждень уперед</PageHeading>
          <p className="hero__lead">
            Знайдіть місто, перегляньте прогноз на 7 днів і по годинах на сьогодні. Переходьте між градусами
            Цельсія й Фаренгейта, а потрібні міста зберігайте в обране.
          </p>

          <form className="hero__search" onSubmit={submit} role="search">
            <label className="visually-hidden" htmlFor="home-search">
              Назва міста
            </label>
            <input
              id="home-search"
              className="hero__input"
              type="search"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Наприклад: Одеса"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="button button--large">
              Знайти
            </button>
          </form>
          <p className="hero__examples">
            Спробуйте:{' '}
            {SEARCH_EXAMPLES.map((example, index) => (
              <span key={example}>
                <Link to={catalogPath({ q: example })}>{example}</Link>
                {index < SEARCH_EXAMPLES.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </div>

        <nav className="hero__picks" aria-label="Швидкі добірки">
          <p className="hero__picks-title">Швидкі добірки</p>
          <ul className="picks">
            {HOME_LINKS.map((link) => (
              <li key={link.label}>
                <Link className="pick" to={catalogPath(link.params)}>
                  <span className="pick__label">{link.label}</span>
                  <span className="pick__description">{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="section__head">
          <h2 id="featured-title" className="section__title">
            Зараз у великих містах
          </h2>
          <ThermoLegend unit="c" />
        </div>

        {weather.status === 'error' && <ErrorState compact error={weather.error} onRetry={weather.retry} />}
        <ul className="card-grid">
          {FEATURED.map((city) => (
            <li key={city.id}>
              <CityCard
                city={city}
                unit="c"
                from="/"
                weather={cardWeatherState(weather.status)}
                current={weather.data?.[city.id]}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
