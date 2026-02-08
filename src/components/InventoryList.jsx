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
        return <ProductForm initialData={product} onSave={() => setEditingId(null)} />;
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
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Estoque</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Gerencie seus produtos e registre vendas.</p>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Produto</th>
                            <th style={{ padding: '1rem' }}>Estoque</th>
                            <th style={{ padding: '1rem' }}>Custo</th>
                            <th style={{ padding: '1rem' }}>Preço Venda</th>
                            <th style={{ padding: '1rem' }}>Ações</th>
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
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.sku}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: p.stock < 5 ? 'var(--warning-color)' : 'inherit' }}>
                                        {p.stock}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{formatCurrency(p.costPrice)}</td>
                                    <td style={{ padding: '1rem' }}>{formatCurrency(p.sellingPrice)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
