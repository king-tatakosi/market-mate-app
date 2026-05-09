export function DashboardCard({ icon, label, value, color = 'green', onClick }) {
  return (
    <button
      className={`dash-card dash-card--${color}${onClick ? ' dash-card--clickable' : ''}`}
      onClick={onClick}
      disabled={!onClick}
      aria-label={`${label}: ${value}`}
    >
      <img className="dash-card__icon" src={icon} alt={label} />
      <span className="dash-card__value">{value}</span>
      <span className="dash-card__label">{label}</span>
    </button>
  );
}
