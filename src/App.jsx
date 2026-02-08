import { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import ProductForm from './components/ProductForm';
import SalesLog from './components/SalesLog';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <InventoryList />;
      case 'add-product': return <ProductForm onSave={() => setActiveTab('inventory')} />;
      case 'sales': return <SalesLog />;
      default: return <Dashboard />;
    }
  };

  return (
    <StoreProvider>
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </StoreProvider>
  );
}

export default App;
