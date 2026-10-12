import { useId } from 'react';

/** Група перемикачів-«чіпів» на справжніх radio: працює з клавіатури (стрілки), читається екранним читачем. */
export default function ChipGroup({ legend, options, value, onChange }) {
  const name = useId();

  return (
    <fieldset className="chip-group">
      <legend className="chip-group__legend">{legend}</legend>
      <div className="chip-group__options">
        {options.map((option) => (
          <label key={option.value} className="chip">
            <input
              className="chip__input"
              type="radio"
              name={name}
              value={String(option.value)}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span className="chip__label">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
