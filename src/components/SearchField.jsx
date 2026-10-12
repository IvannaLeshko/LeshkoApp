export default function SearchField({ id, label, value, onChange, placeholder, hint }) {
  const hintId = `${id}-hint`;

  return (
    <div className="search-field">
      <label className="search-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="search-field__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        aria-describedby={hint ? hintId : undefined}
      />
      {hint && (
        <p id={hintId} className="search-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
