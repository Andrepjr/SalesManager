import React from 'react';
import { FaHome, FaBox, FaChartLine, FaCog, FaPlusCircle } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
        { id: 'inventory', label: 'Estoque', icon: <FaBox /> },
        { id: 'sales', label: 'Vendas Log', icon: <FaChartLine /> },
        { id: 'add-product', label: 'Novo Produto', icon: <FaPlusCircle /> },
        // { id: 'settings', label: 'Configurações', icon: <FaCog /> },
    ];

    return (
        <aside className="glass-panel" style={{
            width: '250px',
            height: 'calc(100vh - 2rem)',
            margin: '1rem',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <div className="logo" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h2 style={{
                    background: 'linear-gradient(to right, #38bdf8, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    SalesManager
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            background: activeTab === item.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                            transition: 'all 0.2s ease',
                            textAlign: 'left'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                v1.0.0
            </div>
        </aside>
    );
};

export default Sidebar;
