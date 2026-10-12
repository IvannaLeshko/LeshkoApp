import { fromCelsius, HEAT_MAX, HEAT_MIN, heatGradient } from '../utils/heat';
import { unitSymbol } from '../utils/format';

const TICKS_C = [-20, -10, 0, 10, 20, 30];

/** Легенда: пояснює, що означає колір термометра на картках. */
export default function ThermoLegend({ unit }) {
  return (
    <div className="legend" role="img" aria-label="Шкала кольорів: від синього для морозу до червоного для спеки">
      <div className="legend__bar" style={{ backgroundImage: heatGradient() }} />
      <div className="legend__ticks" aria-hidden="true">
        {TICKS_C.map((celsius) => (
          <span
            key={celsius}
            style={{ left: `${((celsius - HEAT_MIN) / (HEAT_MAX - HEAT_MIN)) * 100}%` }}
          >
            {Math.round(fromCelsius(celsius, unit)).toString().replace('-', '−')}
          </span>
        ))}
      </div>
      <span className="legend__unit" aria-hidden="true">{unitSymbol(unit)}</span>
    </div>
  );
}
