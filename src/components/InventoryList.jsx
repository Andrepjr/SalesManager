import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FaEdit, FaTrash, FaShoppingCart } from 'react-icons/fa';
import ProductForm from './ProductForm';

const SaleModal = ({ product, onClose, addSale }) => {
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(product.sellingPrice);

    const handleSale = (e) => {
        e.preventDefault();
        addSale({
            productId: product.id,
            quantity: Number(qty),
            soldPrice: Number(price)
        });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Registrar Venda: {product.name}</h3>
                <form onSubmit={handleSale} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label>Quantidade</label>
                        <input className="glass-input" type="number" min="1" max={product.stock} value={qty} onChange={e => setQty(e.target.value)} required />
                    </div>
                    <div>
                        <label>Preço de Venda (Unidade)</label>
                        <input className="glass-input" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>Cancelar</button>
                        <button type="submit" className="glass-button">Confirmar Venda</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InventoryList = () => {
    const { products, deleteProduct, addSale } = useStore();
    const [editingId, setEditingId] = useState(null);
    const [saleModalProduct, setSaleModalProduct] = useState(null);

    if (editingId) {
        const product = products.find(p => p.id === editingId);
        return <ProductForm key={product.id} initialData={product} onSave={() => setEditingId(null)} />;
    }

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            deleteProduct(id);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 className="page-title">Estoque</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus produtos e registre vendas.</p>
            </div>

            <div className="glass-panel table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr className="table-header">
                            <th className="table-cell">Produto</th>
                            <th className="table-cell">Estoque</th>
                            <th className="table-cell">Custo</th>
                            <th className="table-cell">Preço Venda</th>
                            <th className="table-cell">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Nenhum produto cadastrado.
                                </td>
                            </tr>
                        ) : (
                            products.map(p => (
                                <tr key={p.id} className="table-row">
                                    <td className="table-cell">
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.sku}</div>
                                    </td>
                                    <td className="table-cell" style={{ color: p.stock < 5 ? 'var(--warning-color)' : 'inherit' }}>
                                        {p.stock}
                                    </td>
                                    <td className="table-cell">{formatCurrency(p.costPrice)}</td>
                                    <td className="table-cell">{formatCurrency(p.sellingPrice)}</td>
                                    <td className="table-cell">
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => setSaleModalProduct(p)}
                                                title="Registrar Venda"
                                                style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)', borderRadius: '0.25rem' }}
                                            >
                                                <FaShoppingCart />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(p.id)}
                                                title="Editar"
                                                style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-color)', borderRadius: '0.25rem' }}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                title="Excluir"
                                                style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)', borderRadius: '0.25rem' }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {saleModalProduct && (
                <SaleModal product={saleModalProduct} onClose={() => setSaleModalProduct(null)} addSale={addSale} />
            )}
        </div>
    );
};

export default InventoryList;
