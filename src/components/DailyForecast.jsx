import { formatDay, formatPercent, formatPrecipitation, formatTemperature } from '../utils/format';
import { heatHue, hueColor, toCelsius } from '../utils/heat';
import { DropIcon } from './Icons';
import WeatherIcon from './WeatherIcon';

/**
 * Прогноз на 7 днів. Кожен рядок має смугу «від мінімуму до максимуму» на спільній шкалі тижня:
 * так за формою смуг одразу видно, коли потепліє, а коли похолоднішає. Колір смуги — зі шкали температур.
 */
export default function DailyForecast({ days, unit }) {
  const mins = days.map((d) => d.min).filter((v) => v !== null);
  const maxs = days.map((d) => d.max).filter((v) => v !== null);
  const low = Math.min(...mins);
  const high = Math.max(...maxs);
  const span = high - low || 1;

  return (
    <ol className="days">
      {days.map((day, index) => {
        const { primary, secondary } = formatDay(day.date, index);
        const hasRange = day.min !== null && day.max !== null;
        const left = hasRange ? ((day.min - low) / span) * 100 : 0;
        const width = hasRange ? Math.max(((day.max - day.min) / span) * 100, 4) : 0;
        const gradient = hasRange
          ? `linear-gradient(90deg, ${hueColor(heatHue(toCelsius(day.min, unit)))}, ${hueColor(heatHue(toCelsius(day.max, unit)))})`
          : undefined;

        return (
          <li key={day.date} className="day">
            <div className="day__name">
              <span className="day__weekday">{primary}</span>
              <time className="day__date" dateTime={day.date}>
                {secondary}
              </time>
            </div>

            <div className="day__condition">
              <WeatherIcon kind={day.kind} size={26} />
              <span className="day__label">{day.label}</span>
            </div>

            <p className="day__rain" title="Імовірність опадів">
              <DropIcon />
              <span>{formatPercent(day.precipitationChance)}</span>
              {day.precipitation ? <small>{formatPrecipitation(day.precipitation)}</small> : null}
            </p>

            <div className="day__range">
              <span className="day__min" aria-label={`мінімум ${formatTemperature(day.min)}`}>
                {formatTemperature(day.min)}
              </span>
              <span className="day__track" aria-hidden="true">
                {hasRange && <span className="day__bar" style={{ left: `${left}%`, width: `${width}%`, backgroundImage: gradient }} />}
              </span>
              <span className="day__max" aria-label={`максимум ${formatTemperature(day.max)}`}>
                {formatTemperature(day.max)}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
