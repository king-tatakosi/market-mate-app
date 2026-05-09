import { useState } from 'react';

export function DebtForm({ onSubmit, onCancel, mode = 'owe-me' }) {
  const isOweMe = mode === 'owe-me';
  const [form, setForm] = useState({ name: '', phone: '', amount: '', note: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter a name';
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) errs.amount = 'Enter a valid amount';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        amount: parseFloat(form.amount),
        note: form.note.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-field">
        <label className="form-label">
          {isOweMe ? "Customer's name" : "Supplier / person's name"} <span className="required">*</span>
        </label>
        <input
          className={`form-input${errors.name ? ' form-input--error' : ''}`}
          type="text"
          placeholder={isOweMe ? 'e.g. Ama Serwaa' : 'e.g. Kofi Supplies'}
          value={form.name}
          onChange={e => set('name', e.target.value)}
          autoFocus
          autoComplete="name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">
          {isOweMe ? 'Amount they owe you' : 'Amount you owe them'} <span className="required">*</span>
        </label>
        <div className="input-prefix-wrap">
          <span className="input-prefix">GH₵</span>
          <input
            className={`form-input form-input--prefixed${errors.amount ? ' form-input--error' : ''}`}
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
            min="0.01"
            step="0.01"
          />
        </div>
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      <div className="form-field">
        <label className="form-label">Phone number <span className="optional">(optional)</span></label>
        <input
          className="form-input"
          type="tel"
          inputMode="tel"
          placeholder="e.g. 0244123456"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          autoComplete="tel"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Note <span className="optional">(optional)</span></label>
        <textarea
          className="form-input form-textarea"
          placeholder={isOweMe ? 'e.g. Bought rice on credit' : 'e.g. For goods delivered last week'}
          value={form.note}
          onChange={e => set('note', e.target.value)}
          rows={2}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn--primary btn--full" type="submit" disabled={saving}>
          {saving ? 'Saving…' : isOweMe ? '✓ Save Debt Record' : '✓ Save What I Owe'}
        </button>
        <button className="btn btn--ghost btn--full" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
