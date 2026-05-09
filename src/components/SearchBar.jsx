import searchIcon from '../assets/search.svg';
export function SearchBar({ value, onChange, placeholder = 'Search...', autoFocus = false }) {
  return (
    <div className="search-bar">
      <img className="search-icon" src={searchIcon} alt="Search" />
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
