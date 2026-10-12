import { useEffect, useRef } from 'react';
import { formatClock, formatPercent, formatTemperature, localHourPrefix } from '../utils/format';
import WeatherIcon from './WeatherIcon';

const CELL = 60; // ширина однієї години, px
const HEIGHT = 96;
const PAD = 16;

/**
 * Погодинний прогноз на сьогодні: крива температури (SVG, декор) і під нею колонки з годинами.
 * Усі значення продубльовані текстом у колонках, тому крива для екранного читача прихована.
 */
export default function HourlyChart({ hours, utcOffsetSeconds }) {
  const scrollRef = useRef(null);
  const nowPrefix = localHourPrefix(utcOffsetSeconds);
  const nowIndex = hours.findIndex((hour) => hour.time.startsWith(nowPrefix));

  useEffect(() => {
    // Прокручуємо до поточної години, щоб не починати з опівночі.
    if (scrollRef.current && nowIndex > 1) scrollRef.current.scrollLeft = (nowIndex - 1) * CELL;
  }, [nowIndex]);

  const temps = hours.map((h) => h.temperature).filter((t) => t !== null);
  const low = Math.min(...temps);
  const high = Math.max(...temps);
  const span = high - low || 1;
  const width = hours.length * CELL;

  const points = hours.map((hour, index) => ({
    x: index * CELL + CELL / 2,
    y: hour.temperature === null ? null : PAD + (1 - (hour.temperature - low) / span) * (HEIGHT - PAD * 2),
  }));
  const drawn = points.filter((p) => p.y !== null);
  const line = drawn.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = drawn.length
    ? `${line} L${drawn[drawn.length - 1].x.toFixed(1)} ${HEIGHT} L${drawn[0].x.toFixed(1)} ${HEIGHT} Z`
    : '';

  return (
    <div
      ref={scrollRef}
      className="hourly__scroll"
      tabIndex={0}
      role="region"
      aria-label="Погодинний прогноз на сьогодні (прокручується)"
    >
      <div className="hourly__inner" style={{ width }}>
        <svg className="hourly__curve" width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} aria-hidden="true" focusable="false">
          {area && <path className="hourly__area" d={area} />}
          {line && <path className="hourly__line" d={line} />}
          {points.map((p, index) =>
            p.y === null ? null : (
              <circle key={hours[index].time} className={`hourly__dot${index === nowIndex ? ' is-now' : ''}`} cx={p.x} cy={p.y} r={index === nowIndex ? 5 : 3} />
            ),
          )}
        </svg>

        <ol className="hourly__cells" style={{ gridTemplateColumns: `repeat(${hours.length}, ${CELL}px)` }}>
          {hours.map((hour, index) => (
            <li key={hour.time} className={`hour${index === nowIndex ? ' is-now' : ''}`} aria-current={index === nowIndex ? 'time' : undefined}>
              <span className="hour__time">{index === nowIndex ? 'Зараз' : formatClock(hour.time)}</span>
              <WeatherIcon kind={hour.kind} isDay={hour.isDay} size={24} />
              <span className="hour__temp">{formatTemperature(hour.temperature)}</span>
              <span className="hour__rain">{formatPercent(hour.precipitationChance)}</span>
              <span className="visually-hidden">{hour.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
