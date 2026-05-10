import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { BottomNav } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { Home } from './pages/Home';
import { Debts } from './pages/Debts';
import { Products } from './pages/Products';
import { Alerts } from './pages/Alerts';
import { useDebts } from './hooks/useDebts';
import { useProducts } from './hooks/useProducts';
import { useSupplierDebts } from './hooks/useSupplierDebts';
import './App.css';

export default function App() {
  const [tab, setTab] = useState('home');

  const debts = useDebts();
  const products = useProducts();
  const supplierDebts = useSupplierDebts();

  const alertCount =
    products.expired.length + products.expiringSoon.length + products.lowStock.length;

  return (
    <ToastProvider>
    <div className="app">
      <InstallPrompt />
      <main className="app-main">
        {tab === 'home' && (
          <Home
            debts={debts}
            products={products}
            supplierDebts={supplierDebts}
            onNavigate={setTab}
          />
        )}
        {tab === 'debts' && (
          <Debts debts={debts} supplierDebts={supplierDebts} />
        )}
        {tab === 'products' && (
          <Products
            products={products.products}
            addProduct={products.addProduct}
            updateProduct={products.updateProduct}
            deleteProduct={products.deleteProduct}
          />
        )}
        {tab === 'alerts' && (
          <Alerts products={products} onNavigate={setTab} />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} alertCount={alertCount} />
    </div>
    </ToastProvider>
  );
}
