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

            <div className="glass-panel table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr className="table-header">
                            <th className="table-cell">Data</th>
                            <th className="table-cell">Produto</th>
                            <th className="table-cell">Qtd</th>
                            <th className="table-cell">Total Venda</th>
                            <th className="table-cell">Taxas (Shopee)</th>
                            <th className="table-cell">Lucro</th>
                            <th className="table-cell">Ações</th>
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
                                <tr key={sale.id} className="table-row">
                                    <td className="table-cell" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {formatDate(sale.date)}
                                    </td>
                                    <td className="table-cell" style={{ fontWeight: 600 }}>{sale.productName}</td>
                                    <td className="table-cell">{sale.quantity}</td>
                                    <td className="table-cell">{formatCurrency(sale.totalSoldPrice)}</td>
                                    <td className="table-cell" style={{ color: 'var(--warning-color)' }}>- {formatCurrency(sale.totalFees)}</td>
                                    <td className="table-cell" style={{ color: sale.netProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 'bold' }}>
                                        {formatCurrency(sale.netProfit)}
                                    </td>
                                    <td className="table-cell">
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
