function downloadCSV(filename, headers, rows) {
  const escape = val => {
    if (val == null) return '';
    const s = String(val);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDebtsCSV(records, isOweMe) {
  const headers = [
    isOweMe ? 'Customer Name' : 'Supplier Name',
    'Phone', 'Total Amount (GH₵)', 'Amount Paid (GH₵)',
    'Balance (GH₵)', 'Status', 'Note', 'Date Added',
  ];
  const rows = records.map(d => [
    isOweMe ? d.name : (d.supplierName || d.name),
    d.phone || '',
    d.amount,
    d.paidAmount || 0,
    Math.max(0, d.amount - (d.paidAmount || 0)),
    d.paid ? 'Paid' : 'Unpaid',
    d.note || '',
    d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '',
  ]);
  const label = isOweMe ? 'customers-owe-me' : 'suppliers-i-owe';
  downloadCSV(`vendapal-${label}-${today()}.csv`, headers, rows);
}

export function exportProductsCSV(products) {
  const headers = ['Name', 'Stock Qty', 'Low Stock Alert', 'Expiry Date', 'Date Added'];
  const rows = products.map(p => [
    p.name,
    p.quantity ?? '',
    p.minStock ?? '',
    p.expiryDate ? new Date(p.expiryDate).toLocaleDateString() : 'No expiry',
    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
  ]);
  downloadCSV(`vendapal-products-${today()}.csv`, headers, rows);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
