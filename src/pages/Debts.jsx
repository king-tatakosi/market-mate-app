import { useState, useMemo } from 'react';
import { DebtCard } from '../components/DebtCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { DebtForm } from '../components/DebtForm';
import { formatCurrency } from '../utils/format';

export function Debts({ debts, supplierDebts }) {
  const [tab, setTab] = useState('owe-me');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showPaid, setShowPaid] = useState(false);

  const isOweMe = tab === 'owe-me';
  const source = isOweMe ? debts : supplierDebts;
  const allRecords = source.supplierDebts ?? source.debts;
  const total = source.totalOwed ?? source.totalIOwe;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const nameKey = isOweMe ? 'name' : 'supplierName';
    const list = allRecords || [];
    const unpaid = list.filter(d => !d.paid);
    const shown = showPaid ? list : unpaid;
    if (!q) return shown;
    return shown.filter(d => (d[nameKey] || d.name || '').toLowerCase().includes(q));
  }, [allRecords, search, showPaid, isOweMe]);

  const unpaidCount = (isOweMe ? debts.unpaid : supplierDebts.unpaid)?.length ?? 0;

  const handleAdd = async data => {
    const payload = isOweMe ? data : { ...data, supplierName: data.name };
    if (isOweMe) await debts.addDebt(payload);
    else await supplierDebts.addSupplierDebt(payload);
    setShowAdd(false);
  };

  const handleRecordPayment = isOweMe ? debts.recordPayment : supplierDebts.recordPayment;
  const handleMarkPaid = isOweMe ? debts.markAsPaid : supplierDebts.markAsPaid;
  const handleDelete = isOweMe ? debts.deleteDebt : supplierDebts.deleteSupplierDebt;

  const patchName = record => isOweMe ? record : { ...record, name: record.supplierName || record.name };

  const noResultsFromSearch = search.trim() && filtered.length === 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Debts</h1>
      </div>

      <div className="sub-tabs">
        <button
          className={`sub-tab${isOweMe ? ' sub-tab--active' : ''}`}
          onClick={() => { setTab('owe-me'); setSearch(''); }}
        >
          👥 Owe Me
          {debts.unpaid?.length > 0 && (
            <span className="sub-tab-badge">{debts.unpaid.length}</span>
          )}
        </button>
        <button
          className={`sub-tab${!isOweMe ? ' sub-tab--active' : ''}`}
          onClick={() => { setTab('i-owe'); setSearch(''); }}
        >
          💸 I Owe
          {supplierDebts.unpaid?.length > 0 && (
            <span className="sub-tab-badge sub-tab-badge--orange">{supplierDebts.unpaid.length}</span>
          )}
        </button>
      </div>

      {total > 0 && (
        <div className={`total-banner${!isOweMe ? ' total-banner--orange' : ''}`}>
          <span>{isOweMe ? 'Total owed to you' : 'Total you owe'}</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      )}

      <div className="page-body">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={isOweMe ? 'Search people who owe you…' : 'Search suppliers…'}
        />

        {(allRecords || []).some(d => d.paid) && (
          <button
            className="toggle-paid"
            onClick={() => setShowPaid(x => !x)}
          >
            {showPaid ? '👁 Hide paid records' : '👁 Show paid records'}
          </button>
        )}

        <div className="card-list">
          {filtered.map(d => (
            <DebtCard
              key={d.id}
              debt={patchName(d)}
              onRecordPayment={handleRecordPayment}
              onMarkPaid={handleMarkPaid}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {noResultsFromSearch && (
          <EmptyState
            icon="🔍"
            title="No customer found"
            subtitle={`No match for "${search}"`}
            action="+ Add New Customer"
            onAction={() => { setSearch(''); setShowAdd(true); }}
          />
        )}

        {!search && (allRecords || []).filter(d => !d.paid).length === 0 && (
          <EmptyState
            icon={isOweMe ? '🤝' : '📋'}
            title={isOweMe ? 'No debt records yet' : 'Nothing recorded yet'}
            subtitle={isOweMe ? 'Add the first person who owes you money' : 'Add a supplier you owe money to'}
            action={isOweMe ? '+ Add Debt Record' : '+ Add What I Owe'}
            onAction={() => setShowAdd(true)}
          />
        )}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)} aria-label="Add new record">
        +
      </button>

      {showAdd && (
        <Modal
          title={isOweMe ? 'New Debt Record' : 'Add What I Owe'}
          onClose={() => setShowAdd(false)}
        >
          <DebtForm
            mode={tab}
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}
    </div>
  );
}
