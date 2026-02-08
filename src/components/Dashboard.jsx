import React from 'react';
import { useStore } from '../context/StoreContext';
import { FaDollarSign, FaBoxOpen, FaChartPie, FaShoppingCart } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            background: `rgba(${color}, 0.2)`,
            color: `rgb(${color})`,
            padding: '1rem',
            borderRadius: '50%',
            fontSize: '1.5rem',
            display: 'flex'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{title}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { getStats } = useStore();
    const stats = getStats();

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Visão geral do seu negócio</p>
            </div>

            <div className="dashboard-grid">
                <StatCard
                    title="Faturamento Total"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={<FaDollarSign />}
                    color="56, 189, 248" // sky-400
                />
                <StatCard
                    title="Lucro Líquido"
                    value={formatCurrency(stats.totalProfit)}
                    icon={<FaChartPie />}
                    color="16, 185, 129" // emerald-500
                />
                <StatCard
                    title="Vendas Realizadas"
                    value={stats.totalSalesCount}
                    icon={<FaShoppingCart />}
                    color="245, 158, 11" // amber-500
                />
                <StatCard
                    title="Valor em Estoque"
                    value={formatCurrency(stats.inventoryValue)}
                    icon={<FaBoxOpen />}
                    color="99, 102, 241" // indigo-500
                />
            </div>

            {/* Placeholder for future charts or recent activity */}
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '300px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Atividade Recente</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Nenhuma venda recente registrada.</p>
            </div>
        </div>
    );
};

export default Dashboard;
