import homeIcon from '../assets/home.svg';
import debtsIcon from '../assets/debts.svg';
import stockIcon from '../assets/stock.svg';
import notificationIcon from '../assets/notification.svg';

export function BottomNav({ active, onChange, alertCount }) {
  const tabs = [
    { id: 'home',     icon: homeIcon,  label: 'Home' },
    { id: 'debts',    icon: debtsIcon, label: 'Debts' },
    { id: 'products', icon: stockIcon, label: 'Products' },
    { id: 'alerts',   icon: notificationIcon, label: 'Alerts', badge: alertCount },
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
          <span className="nav-tab__icon">
            <img src={t.icon} alt={t.label} width="24" height="24" />
          </span>
          <span className="nav-tab__label">{t.label}</span>
          {t.badge > 0 && (
            <span className="nav-badge" aria-label={`${t.badge} alerts`}>{t.badge}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
