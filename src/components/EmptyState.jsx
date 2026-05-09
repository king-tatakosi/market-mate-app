export function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {subtitle && <p className="empty-state__subtitle">{subtitle}</p>}
      {action && onAction && (
        <button className="btn btn--primary" onClick={onAction}>{action}</button>
      )}
    </div>
  );
}
