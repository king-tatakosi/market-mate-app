import { useState } from 'react';
import { formatCurrency, formatExpiryDate, daysUntilExpiry } from '../utils/format';
import { Modal } from './Modal';

function StockModal({ product, mode, onClose, onUpdate }) {
  const isAdd = mode === 'add';
  const [qty, setQty] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const val = parseInt(qty);
    if (isNaN(val) || val <= 0) { setErr('Enter a valid number greater than 0'); return; }
    if (!isAdd && val > product.quantity) {
      setErr(`Cannot remove more than current stock (${product.quantity})`);
      return;
    }
    const newQty = isAdd ? product.quantity + val : product.quantity - val;
    onUpdate(newQty);
  };

  return (
    <Modal title={isAdd ? 'Add Stock' : 'Remove Stock'} onClose={onClose}>
      <p className="modal-hint">
        Current stock: <strong>{product.quantity} {product.unit || 'pcs'}</strong>
      </p>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label className="form-label">
            {isAdd ? 'How many are you adding?' : 'How many are you removing?'}
          </label>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={qty}
            onChange={e => { setQty(e.target.value); setErr(''); }}
            min="1"
            autoFocus
          />
          {err && <span className="form-error">{err}</span>}
        </div>
        {qty && !err && parseInt(qty) > 0 && (
          <p className="stock-preview">
            New stock will be:{' '}
            <strong>
              {isAdd
                ? product.quantity + parseInt(qty)
                : product.quantity - parseInt(qty)
              } {product.unit || 'pcs'}
            </strong>
          </p>
        )}
        <button
          className={`btn btn--full${isAdd ? ' btn--primary' : ' btn--danger-fill'}`}
          type="submit"
        >
          {isAdd ? '+ Confirm Add Stock' : '− Confirm Remove Stock'}
        </button>
      </form>
    </Modal>
  );
}

export function ProductCard({ product, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [stockMode, setStockMode] = useState(null); // 'add' | 'remove' | null
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
              <button className="btn btn--primary" onClick={() => setStockMode('add')}>
                + Add Stock
              </button>
              <button className="btn btn--outline-danger" onClick={() => setStockMode('remove')}>
                − Remove Stock
              </button>
            </div>

            <button
              className={`btn btn--ghost btn--sm text-danger${confirmDelete ? ' btn--danger' : ''}`}
              onClick={handleDelete}
            >
              {confirmDelete ? '⚠️ Tap again to delete' : '🗑 Remove Product'}
            </button>
          </div>
        )}
      </div>

      {stockMode && (
        <StockModal
          product={product}
          mode={stockMode}
          onClose={() => setStockMode(null)}
          onUpdate={newQty => {
            onUpdate(product.id, { quantity: newQty });
            setStockMode(null);
          }}
        />
      )}
    </>
  );
}
