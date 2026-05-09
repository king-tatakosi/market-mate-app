import { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { ProductForm } from '../components/ProductForm';

export function Products({ products, addProduct, updateProduct, deleteProduct }) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const handleAdd = async data => {
    await addProduct(data);
    setShowAdd(false);
  };

  const noResult = search.trim() && filtered.length === 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Products</h1>
        <span className="page-count">{products.length} item{products.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="page-body">
        {products.length > 7 && (
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products…"
          />
        )}

        <div className="card-list">
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
            />
          ))}
        </div>

        {noResult && (
          <EmptyState
            icon="🔍"
            title="Product not found"
            subtitle={`No match for "${search}"`}
            action="+ Add Product"
            onAction={() => { setSearch(''); setShowAdd(true); }}
          />
        )}

        {products.length === 0 && (
          <EmptyState
            icon="📦"
            title="No products yet"
            subtitle="Add the items you sell or stock so you can track them"
            action="+ Add First Product"
            onAction={() => setShowAdd(true)}
          />
        )}
      </div>

      <button className="fab" onClick={() => setShowAdd(true)} aria-label="Add product">
        +
      </button>

      {showAdd && (
        <Modal title="Add New Product" onClose={() => setShowAdd(false)}>
          <ProductForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
    </div>
  );
}
