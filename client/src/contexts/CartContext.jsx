import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

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
            setLoading(true);
            try {
                const data = await api.getCart();
                setCartItems(mapAndSort(data.items));
                setLoading(false);
                setError(null);
            } catch (err) {
                console.error("Error cargando el carrito:", err)
                setError('No se pudo cargar el carrito');
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, [isAuthenticated]);

    // AGREGAR AL CARRITO
    const addToCart = async (product) => {
        if (!isAuthenticated()) {
            toast.error("Debes iniciar sesión para agregar productos al carrito");
        }

        const currentItem = cartItems.find(item => item.product.id === product.id);
        const currentQuantity = currentItem ? currentItem.quantity : 0;
        if (currentQuantity + 1 > product.stock) {
            toast.error("No hay stock suficiente para agregar este producto");
            return;
        }

        try {
            const data = await toast.promise(
                api.addItem(product.id, 1),
                {
                    loading: 'Agregando...',
                    success: <b>¡Agregado al carrito! 🛍️</b>,
                    error: <b>No se pudo agregar</b>,
                }
            );
            setCartItems(mapAndSort(data.items));
        } catch (err) {
            console.error(err);
        }
    };

    // QUITAR UNA UNIDAD
    const removeOne = async (productId) => {
        const itemExists = cartItems.some(item => item.product.id === productId);
        if (!itemExists) return;
        try {
            const data = await api.removeOne(productId);
            setCartItems(mapAndSort(data.items));
        } catch (err) {
            console.error("Error quitando unidad",err);
            toast.error("Hubo un error al actualizar la cantidad");
        }
    };

    // QUITAR TODO
    const removeFromCart = async (productId) => {
        const itemExists = cartItems.some(item => item.product.id === productId);
        if (!itemExists) return;
        try {
            const previousCart = [...cartItems];
            setCartItems(prev => prev.filter(item => item.product.id != productId));

            const data = await api.removeItem(productId);
            setCartItems(mapAndSort(data.items));
            toast.success("Producto eliminado");
        } catch (err) {
            console.error("Error eliminando item", err)
            toast.error("No se pudo eliminar");
        }
    };

    const clearCart = async () => {
        try {
            await api.clearCart();
            setCartItems([]);
            toast.success("Carrito vaciado");
        } catch (err) {
            console.error(err);
            toast.error("Error al vaciar el carrito");
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