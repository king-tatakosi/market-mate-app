import { AlertCard } from '../components/AlertCard';
import { EmptyState } from '../components/EmptyState';

export function Alerts({ products, onNavigate }) {
  const { expired, expiringSoon, lowStock } = products;
  const total = expired.length + expiringSoon.length + lowStock.length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Alerts</h1>
        {total > 0 && (
          <span className="page-count page-count--danger">{total} issue{total !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="page-body">
        {total === 0 && (
          <EmptyState
            icon="✅"
            title="All good!"
            subtitle="No expired products, no low stock alerts right now."
            action="Go to Products"
            onAction={() => onNavigate('products')}
          />
        )}

        {expired.length > 0 && (
          <div className="section">
            <div className="alert-section-header alert-section-header--danger">
              <span>❌ Expired Products ({expired.length})</span>
            </div>
            <div className="card-list">
              {expired.map(p => <AlertCard key={p.id} product={p} type="expired" />)}
            </div>
          </div>
        )}

        {expiringSoon.length > 0 && (
          <div className="section">
            <div className="alert-section-header alert-section-header--warning">
              <span>⚠️ Expiring Soon ({expiringSoon.length})</span>
            </div>
            <div className="card-list">
              {expiringSoon.map(p => <AlertCard key={p.id} product={p} type="expiring" />)}
            </div>
          </div>
        )}

        {lowStock.length > 0 && (
          <div className="section">
            <div className="alert-section-header alert-section-header--info">
              <span>📉 Low Stock ({lowStock.length})</span>
            </div>
            <div className="card-list">
              {lowStock.map(p => <AlertCard key={p.id} product={p} type="low-stock" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
