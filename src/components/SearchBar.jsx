export function SearchBar({ value, onChange, placeholder = 'Search...', autoFocus = false }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        aria-label={placeholder}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">✕</button>
      )}
    </div>
  );
}
