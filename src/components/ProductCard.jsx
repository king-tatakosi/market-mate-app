import { useState } from 'react';
import { formatCurrency, formatExpiryDate, daysUntilExpiry } from '../utils/format';
import { Modal } from './Modal';

function UpdateStockModal({ product, onClose, onUpdate }) {
  const [qty, setQty] = useState(String(product.quantity));
  const [err, setErr] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const val = parseInt(qty);
    if (isNaN(val) || val < 0) { setErr('Enter a valid number'); return; }
    onUpdate(val);
  };

  return (
    <Modal title="Update Stock" onClose={onClose}>
      <p className="modal-hint">Current stock: <strong>{product.quantity} {product.unit || 'pcs'}</strong></p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label className="form-label">New quantity</label>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            value={qty}
            onChange={e => { setQty(e.target.value); setErr(''); }}
            min="0"
            autoFocus
          />
          {err && <span className="form-error">{err}</span>}
        </div>
        <button className="btn btn--primary btn--full" type="submit">Update Stock</button>
      </form>
    </Modal>
  );
}

export function ProductCard({ product, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const daysLeft = daysUntilExpiry(product.expiryDate);
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  const isLowStock = product.minStock !== undefined && +product.quantity <= +product.minStock;

  const statusClass = isExpired ? 'product-card--expired'
    : isExpiringSoon ? 'product-card--expiring'
    : isLowStock ? 'product-card--low'
    : '';

  const handleDelete = () => {
    if (confirmDelete) onDelete(product.id);
    else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <>
      <div className={`product-card ${statusClass}`}>
        <div className="product-card__row" onClick={() => setExpanded(x => !x)}>
          <div className="product-card__icon">📦</div>
          <div className="product-card__info">
            <p className="product-card__name">{product.name}</p>
            <p className="product-card__stock">
              {product.quantity} {product.unit || 'pcs'} in stock
            </p>
          </div>
          <div className="product-card__right">
            {isExpired && <span className="badge badge--danger">Expired</span>}
            {!isExpired && isExpiringSoon && (
              <span className="badge badge--warning">{daysLeft}d left</span>
            )}
            {!isExpired && !isExpiringSoon && isLowStock && (
              <span className="badge badge--info">Low Stock</span>
            )}
            <span className={`chevron${expanded ? ' chevron--up' : ''}`}>›</span>
          </div>
        </div>

        {expanded && (
          <div className="product-card__body">
            {product.price && (
              <div className="product-card__detail-row">
                <span className="detail-label">Selling price</span>
                <span className="detail-value">{formatCurrency(product.price)}</span>
              </div>
            )}
            {product.minStock !== undefined && (
              <div className="product-card__detail-row">
                <span className="detail-label">Alert below</span>
                <span className="detail-value">{product.minStock} {product.unit || 'pcs'}</span>
              </div>
            )}
            {product.expiryDate && (
              <div className="product-card__detail-row">
                <span className="detail-label">Best before</span>
                <span className={`detail-value${isExpired ? ' text-danger' : isExpiringSoon ? ' text-warning' : ''}`}>
                  {formatExpiryDate(product.expiryDate)}
                  {daysLeft !== null && daysLeft >= 0 && ` (${daysLeft} days)`}
                  {isExpired && ' (Expired)'}
                </span>
              </div>
            )}

            <div className="product-card__actions">
              <button className="btn btn--primary" onClick={() => setShowStock(true)}>
                📊 Update Stock
              </button>
            </div>

            <button
              className={`btn btn--ghost btn--sm${confirmDelete ? ' btn--danger' : ''}`}
              onClick={handleDelete}
            >
              {confirmDelete ? '⚠️ Tap again to delete' : '🗑 Remove Product'}
            </button>
          </div>
        )}
      </div>

      {showStock && (
        <UpdateStockModal
          product={product}
          onClose={() => setShowStock(false)}
          onUpdate={qty => { onUpdate(product.id, { quantity: qty }); setShowStock(false); }}
        />
      )}
    </>
  );
}
