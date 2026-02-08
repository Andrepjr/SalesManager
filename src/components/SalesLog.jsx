import React from 'react';
import { useStore } from '../context/StoreContext';
import { FaTrash } from 'react-icons/fa';

const SalesLog = () => {
    const { sales, deleteSale } = useStore();

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta venda? O estoque será restaurado.')) {
            deleteSale(id);
        }
    };

    const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Registro de Vendas</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Histórico de todas as vendas realizadas.</p>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Data</th>
                            <th style={{ padding: '1rem' }}>Produto</th>
                            <th style={{ padding: '1rem' }}>Qtd</th>
                            <th style={{ padding: '1rem' }}>Total Venda</th>
                            <th style={{ padding: '1rem' }}>Taxas (Shopee)</th>
                            <th style={{ padding: '1rem' }}>Lucro</th>
                            <th style={{ padding: '1rem' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSales.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Nenhuma venda registrada ainda.
                                </td>
                            </tr>
                        ) : (
                            sortedSales.map(sale => (
                                <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {formatDate(sale.date)}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{sale.productName}</td>
                                    <td style={{ padding: '1rem' }}>{sale.quantity}</td>
                                    <td style={{ padding: '1rem' }}>{formatCurrency(sale.totalSoldPrice)}</td>
                                    <td style={{ padding: '1rem', color: 'var(--warning-color)' }}>- {formatCurrency(sale.totalFees)}</td>
                                    <td style={{ padding: '1rem', color: sale.netProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 'bold' }}>
                                        {formatCurrency(sale.netProfit)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => handleDelete(sale.id)}
                                            title="Excluir Venda"
                                            style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', borderRadius: '0.25rem' }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesLog;
