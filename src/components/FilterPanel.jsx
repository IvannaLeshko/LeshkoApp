import { SORT_OPTIONS, UNIT_OPTIONS } from '../config';
import ChipGroup from './ChipGroup';

export default function FilterPanel({ id, params, countries, open, onChange, onReset, canReset }) {
  // Якщо країна з адреси не трапилась у результатах, її все одно показуємо вибраною, щоб фільтр був видимим.
  const hasSelected = !params.country || countries.some((c) => c.value === params.country);

  return (
    <div id={id} className={`filter-panel${open ? ' is-open' : ''}`}>
      <div className="filter-panel__row">
        <div className="field">
          <label className="field__label" htmlFor={`${id}-country`}>
            Країна
          </label>
          <select
            id={`${id}-country`}
            className="field__select"
            value={params.country}
            onChange={(event) => onChange({ country: event.target.value })}
          >
            <option value="">Усі країни</option>
            {!hasSelected && <option value={params.country}>{params.country}</option>}
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.name} ({country.count})
              </option>
            ))}
          </select>
          <p className="field__hint">Серед знайдених міст</p>
        </div>

        <ChipGroup
          legend="Одиниці температури"
          options={UNIT_OPTIONS}
          value={params.unit}
          onChange={(unit) => onChange({ unit })}
        />

        <ChipGroup
          legend="Сортування"
          options={SORT_OPTIONS}
          value={params.sort}
          onChange={(sort) => onChange({ sort })}
        />
      </div>

      {canReset && (
        <button type="button" className="button button--ghost" onClick={onReset}>
          Скинути фільтри
        </button>
      )}
    </div>
  );
}
