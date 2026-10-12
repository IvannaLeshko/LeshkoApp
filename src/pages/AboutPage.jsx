import PageHeading from '../components/PageHeading';
import { API_ATTRIBUTION, APP_NAME } from '../config';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const TECH = [
  ['React 19', 'інтерфейс і хуки'],
  ['React Router', 'сторінки, параметри адреси, відновлення прокрутки'],
  ['Context + localStorage', 'обрані міста й тема, що переживають перезавантаження'],
  ['fetch + AbortController', 'запити до API й скасування застарілих'],
  ['Vite і SCSS', 'збірка та стилі на дизайн-токенах'],
];

export default function AboutPage() {
  useDocumentTitle('Про застосунок');

  return (
    <div className="about">
      <header className="page-header">
        <PageHeading>Про застосунок</PageHeading>
        <p className="page-header__lead">
          {APP_NAME} показує погоду в містах світу: зараз, по годинах на сьогодні та на тиждень уперед.
        </p>
      </header>

      <div className="about__grid">
        <section className="about__block" aria-labelledby="about-data">
          <h2 id="about-data" className="section__title section__title--small">
            Звідки дані
          </h2>
          <p>
            Прогнози погоди надає{' '}
            <a href={API_ATTRIBUTION.url} target="_blank" rel="noopener noreferrer">
              {API_ATTRIBUTION.name}
            </a>{' '}
            за ліцензією{' '}
            <a href={API_ATTRIBUTION.licenseUrl} target="_blank" rel="noopener noreferrer">
              {API_ATTRIBUTION.license}
            </a>
            . Назви й координати міст геокодер бере з{' '}
            <a href={API_ATTRIBUTION.geoUrl} target="_blank" rel="noopener noreferrer">
              {API_ATTRIBUTION.geoName}
            </a>
            . Ключ доступу не потрібен.
          </p>
          <p>
            Каталог знаходить до 100 міст за назвою й фільтрує їх за країною вже в браузері. Одиниці
            температури передаються в запит до сервера. Сторінка міста завантажує прогноз на 7 днів, а
            погодинний прогноз на сьогодні — окремим запитом.
          </p>
          <p>{APP_NAME} — незалежний застосунок, не пов’язаний з Open-Meteo чи GeoNames.</p>
        </section>

        <section className="about__block" aria-labelledby="about-tech">
          <h2 id="about-tech" className="section__title section__title--small">
            З чого зроблено
          </h2>
          <ul className="tech-list">
            {TECH.map(([name, description]) => (
              <li key={name}>
                <strong>{name}</strong>
                <span>{description}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
