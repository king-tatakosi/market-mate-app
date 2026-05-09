export function BottomNav({ active, onChange, alertCount }) {
  const tabs = [
    { id: 'home',     icon: '🏠', label: 'Home' },
    { id: 'debts',    icon: '👥', label: 'Debts' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'alerts',   icon: '🔔', label: 'Alerts', badge: alertCount },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-tab${active === t.id ? ' nav-tab--active' : ''}`}
          onClick={() => onChange(t.id)}
          aria-label={t.label}
          aria-current={active === t.id ? 'page' : undefined}
        >
          <span className="nav-tab__icon">{t.icon}</span>
          <span className="nav-tab__label">{t.label}</span>
          {t.badge > 0 && (
            <span className="nav-badge" aria-label={`${t.badge} alerts`}>{t.badge}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
