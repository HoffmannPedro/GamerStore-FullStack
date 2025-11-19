import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();

    // CARGAR CARRITO AL INICIAR
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!isAuthenticated()) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        const loadCart = async () => {
            try {
                const data = await api.getCart();
                setCartItems(mapAndSort(data.items));
                setLoading(false);
            } catch (err) {
                setError('No se pudo cargar el carrito');
                setLoading(false);
            }
        };
        loadCart();
    }, [isAuthenticated]);

    // AGREGAR AL CARRITO
    const addToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) return;  // ← NO LLAMA API, NO ERROR
        try {
            const data = await api.addItem(product.id, 1);
            setCartItems(mapAndSort(data.items));
        } catch (err) {
            setError('Error al agregar al carrito');
        }
    };

    // QUITAR UNA UNIDAD
    const removeOne = async (productId) => {
        try {
            const data = await api.removeOne(productId);
            setCartItems(mapAndSort(data.items));
        } catch (err) {
            setError('Error al quitar unidad');
        }
    };

    // QUITAR TODO
    const removeFromCart = async (productId) => {
        try {
            const data = await api.removeItem(productId);
            setCartItems(mapAndSort(data.items));
        } catch (err) {
            setError('Error al eliminar del carrito');
        }
    };

    const clearCart = async () => {
        try {
            await api.clearCart();
            setCartItems([]);
        } catch (err) {
            console.error("Error al vaciar el carrito:", err);
            setError("Error al vaciar el carrito");
        }
    }

    const mapAndSort = items => {
        const mapped = items.map(item => ({
            product: {
                id: item.productId,
                name: item.productName,
                price: item.price
            },
            quantity: item.quantity
        }));
        return mapped.sort((a, b) => a.product.id - b.product.id);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeOne,
                removeFromCart,
                clearCart,
                loading,
                error
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);