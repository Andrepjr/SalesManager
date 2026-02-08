import { createContext, useState, useEffect, useContext } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    // Load initial state from localStorage
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : [];
    });

    const [sales, setSales] = useState(() => {
        const saved = localStorage.getItem('sales');
        return saved ? JSON.parse(saved) : [];
    });

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('settings');
        // Default: 14% commision + 6% free shipping = 20%, or configurable
        // Fixed fee per item is usually R$3 in Brazil for items < R$79? Let's keep it simple for now or detailed.
        return saved ? JSON.parse(saved) : {
            shopeeFeePercent: 20, // Example default
            fixedFee: 4 // Example fixed fee per item
        };
    });

    // Persistence effects
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('sales', JSON.stringify(sales));
    }, [sales]);

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    // Migration: Fix old fee (3) to new fee (4) automatically
    useEffect(() => {
        if (settings.fixedFee === 3) {
            setSettings(prev => ({ ...prev, fixedFee: 4 }));
        }
    }, [settings.fixedFee]);

    // Actions
    const addProduct = (product) => {
        setProducts(prev => [...prev, { ...product, id: crypto.randomUUID(), createdAt: new Date() }]);
    };

    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addSale = (saleData) => {
        // saleData: { productId, quantity, soldPrice, date }
        const product = products.find(p => p.id === saleData.productId);
        if (!product) return;

        // Calculate financials
        const totalSoldPrice = saleData.soldPrice * saleData.quantity;
        const totalCost = product.costPrice * saleData.quantity;

        // Shopee Fee Calculation
        // Fee = (Price * %/100) + FixedFee
        const feePerItem = (saleData.soldPrice * (settings.shopeeFeePercent / 100)) + settings.fixedFee;
        const totalFees = feePerItem * saleData.quantity;

        const netProfit = totalSoldPrice - totalFees - totalCost;

        const newSale = {
            id: crypto.randomUUID(),
            ...saleData,
            productName: product.name,
            totalSoldPrice,
            totalCost,
            totalFees,
            netProfit,
            date: new Date().toISOString()
        };

        setSales(prev => [...prev, newSale]);

        // Update stock
        updateProduct(product.id, { stock: product.stock - saleData.quantity });
    };

    const deleteSale = (saleId) => {
        const sale = sales.find(s => s.id === saleId);
        if (!sale) return;

        // Restore stock
        const product = products.find(p => p.id === sale.productId);
        if (product) {
            updateProduct(product.id, { stock: product.stock + sale.quantity });
        }

        setSales(prev => prev.filter(s => s.id !== saleId));
    };

    // Derived Stats
    const getStats = () => {
        const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalSoldPrice, 0);
        const totalProfit = sales.reduce((acc, sale) => acc + sale.netProfit, 0);
        const totalSalesCount = sales.reduce((acc, sale) => acc + sale.quantity, 0);
        const inventoryValue = products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0);

        return { totalRevenue, totalProfit, totalSalesCount, inventoryValue };
    };

    return (
        <StoreContext.Provider value={{
            products,
            sales,
            settings,
            addProduct,
            updateProduct,
            deleteProduct,
            addSale,
            deleteSale,
            setSettings,
            getStats
        }}>
            {children}
        </StoreContext.Provider>
    );
};
