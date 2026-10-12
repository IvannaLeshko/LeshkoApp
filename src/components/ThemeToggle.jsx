import { useTheme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from './Icons';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Темна тема"
      title={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
