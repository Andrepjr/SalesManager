import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ProductForm = ({ onSave, initialData = null }) => {
    const { addProduct, updateProduct, settings } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        costPrice: '',
        sellingPrice: '',
        stock: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            costPrice: Number(formData.costPrice),
            sellingPrice: Number(formData.sellingPrice),
            stock: Number(formData.stock)
        };

        if (initialData) {
            updateProduct(initialData.id, productData);
        } else {
            addProduct(productData);
        }
        onSave();
    };

    // Profit Simulation
    const cost = Number(formData.costPrice) || 0;
    const price = Number(formData.sellingPrice) || 0;
    const fees = (price * (settings.shopeeFeePercent / 100)) + settings.fixedFee;
    const estimatedProfit = price - fees - cost;
    const margin = price > 0 ? (estimatedProfit / price) * 100 : 0;

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={onSave} style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    <FaArrowLeft />
                </button>
                <h2>{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <label>Nome do Produto</label>
                    <input
                        className="glass-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Camiseta Básica"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <label>SKU (Opcional)</label>
                        <input
                            className="glass-input"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="Ex: CAM-001"
                        />
                    </div>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <label>Estoque Inicial</label>
                        <input
                            className="glass-input"
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <label>Preço de Custo (R$)</label>
                        <input
                            className="glass-input"
                            type="number"
                            step="0.01"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <label>Preço de Venda (R$)</label>
                        <input
                            className="glass-input"
                            type="number"
                            step="0.01"
                            name="sellingPrice"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                </div>

                {/* Simulation Card */}
                <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-accent)' }}>Simulação de Lucro (Shopee)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                        <div>
                            <small style={{ color: 'var(--text-secondary)' }}>Taxas ({settings.shopeeFeePercent}% + R${settings.fixedFee})</small>
                            <p style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>- R$ {fees.toFixed(2)}</p>
                        </div>
                        <div>
                            <small style={{ color: 'var(--text-secondary)' }}>Custo</small>
                            <p style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>- R$ {cost.toFixed(2)}</p>
                        </div>
                        <div>
                            <small style={{ color: 'var(--text-secondary)' }}>Lucro Líquido</small>
                            <p style={{ color: estimatedProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                R$ {estimatedProfit.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <small style={{ color: 'var(--text-secondary)' }}>Margem</small>
                            <p>{margin.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaSave /> Salvar Produto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
