export function DashboardCard({ icon, label, value, color = 'green', onClick }) {
  const isPath = typeof icon === 'string' && (icon.includes('/') || icon.includes('.'));
  return (
    <button
      className={`dash-card dash-card--${color}${onClick ? ' dash-card--clickable' : ''}`}
      onClick={onClick}
      disabled={!onClick}
      aria-label={`${label}: ${value}`}
    >
      {isPath
        ? <img className="dash-card__icon dash-card__icon--img" src={icon} alt={label} />
        : <span className="dash-card__icon">{icon}</span>
      }
      <span className="dash-card__value">{value}</span>
      <span className="dash-card__label">{label}</span>
    </button>
  );
}
