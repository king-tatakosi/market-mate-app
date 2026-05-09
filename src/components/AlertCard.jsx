import { formatExpiryDate, daysUntilExpiry } from '../utils/format';

export function AlertCard({ product, type }) {
  const daysLeft = daysUntilExpiry(product.expiryDate);

  if (type === 'expired') {
    return (
      <div className="alert-card alert-card--danger">
        <div className="alert-card__icon">❌</div>
        <div className="alert-card__info">
          <p className="alert-card__name">{product.name}</p>
          <p className="alert-card__detail">
            Expired on {formatExpiryDate(product.expiryDate)} · {product.quantity} {product.unit || 'pcs'} remaining
          </p>
        </div>
      </div>
    );
  }

  if (type === 'expiring') {
    return (
      <div className="alert-card alert-card--warning">
        <div className="alert-card__icon">⚠️</div>
        <div className="alert-card__info">
          <p className="alert-card__name">{product.name}</p>
          <p className="alert-card__detail">
            Expires {formatExpiryDate(product.expiryDate)}
            {daysLeft === 0 ? ' (Today!)' : daysLeft === 1 ? ' (Tomorrow)' : ` (${daysLeft} days)`}
          </p>
        </div>
      </div>
    );
  }

  if (type === 'low-stock') {
    return (
      <div className="alert-card alert-card--info">
        <div className="alert-card__icon">📉</div>
        <div className="alert-card__info">
          <p className="alert-card__name">{product.name}</p>
          <p className="alert-card__detail">
            Only {product.quantity} {product.unit || 'pcs'} left · Minimum is {product.minStock}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
