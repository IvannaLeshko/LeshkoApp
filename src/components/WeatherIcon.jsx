const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const CLOUD = 'M7.5 18.5h9.2a3.8 3.8 0 0 0 .6-7.55A5.5 5.5 0 0 0 6.7 9.9 4.3 4.3 0 0 0 7.5 18.5Z';
const SMALL_CLOUD = 'M8 19h8.4a3.3 3.3 0 0 0 .4-6.57A4.8 4.8 0 0 0 7.6 11.4 3.8 3.8 0 0 0 8 19Z';

function Sun({ x = 12, y = 12, r = 4, rays = true }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      <circle cx={x} cy={y} r={r} />
      {rays &&
        angles.map((a) => {
          const rad = (a * Math.PI) / 180;
          const x1 = x + Math.cos(rad) * (r + 2.4);
          const y1 = y + Math.sin(rad) * (r + 2.4);
          const x2 = x + Math.cos(rad) * (r + 4.4);
          const y2 = y + Math.sin(rad) * (r + 4.4);
          return <path key={a} d={`M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`} />;
        })}
    </g>
  );
}

const MOON = 'M19 14.6A7.5 7.5 0 0 1 9.4 5a7.5 7.5 0 1 0 9.6 9.6Z';

/** Власні значки погоди. Декоративні: стан погоди завжди дублюється текстом поруч. */
export default function WeatherIcon({ kind, isDay = true, size = 28 }) {
  let body;
  switch (kind) {
    case 'clear':
      body = isDay ? <Sun /> : <path d={MOON} />;
      break;
    case 'partly':
      body = (
        <>
          {isDay ? <Sun x={8} y={8} r={3} /> : <path d="M10.5 6.2A4.2 4.2 0 0 1 5.4 1.1a4.2 4.2 0 1 0 5.1 5.1Z" transform="translate(2 3)" />}
          <path d={SMALL_CLOUD} transform="translate(1.5 0)" />
        </>
      );
      break;
    case 'cloudy':
      body = <path d={CLOUD} />;
      break;
    case 'fog':
      body = (
        <>
          <path d="M7.5 12.5h9.2a3.8 3.8 0 0 0 .6-7.55A5.5 5.5 0 0 0 6.7 3.9 4.3 4.3 0 0 0 7.5 12.5Z" transform="translate(0 1)" />
          <path d="M4 17h16M7 20.5h10" />
        </>
      );
      break;
    case 'drizzle':
      body = (
        <>
          <path d={CLOUD} transform="translate(0 -3)" />
          <path d="M9 17.5v1.2M13 17.5v1.2M17 17.5v1.2M11 20.4v1.2M15 20.4v1.2" />
        </>
      );
      break;
    case 'rain':
      body = (
        <>
          <path d={CLOUD} transform="translate(0 -3)" />
          <path d="M8.5 17.5 7.5 20.5M12.5 17.5l-1 3M16.5 17.5l-1 3" />
        </>
      );
      break;
    case 'snow':
      body = (
        <>
          <path d={CLOUD} transform="translate(0 -3)" />
          <path d="M8.5 18v3M7 19.5h3M15.5 18v3M14 19.5h3M12 20v2.4M10.8 21.2h2.4" />
        </>
      );
      break;
    case 'thunder':
      body = (
        <>
          <path d={CLOUD} transform="translate(0 -3)" />
          <path d="m12.8 15-2.6 3.6h2.8l-1.2 3.4" />
        </>
      );
      break;
    default:
      body = (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 16.5v.01M9.8 9.6a2.3 2.3 0 1 1 3.3 2.1c-.7.4-1.1.9-1.1 1.7" />
        </>
      );
  }

  return (
    <svg
      className={`weather-icon weather-icon--${kind}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...stroke}
    >
      {body}
    </svg>
  );
}
