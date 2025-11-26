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
    const addToCart = async (product, showToast = true) => {
        if (!isAuthenticated()) {
            toast.error("Debes iniciar sesión para agregar productos al carrito");
            return;
        }

        const currentItem = cartItems.find(item => item.product.id === product.id);
        const currentQuantity = currentItem ? currentItem.quantity : 0;

        if (currentQuantity + 1 > product.stock) {
            toast.error("No hay stock suficiente para agregar este producto");
            return;
        }

        try {
            let data;
            
            if (showToast) {
                // Modo con notificación (para la Lista de Productos)
                data = await toast.promise(
                    api.addItem(product.id, 1),
                    {
                        loading: 'Agregando...',
                        success: <b>¡Agregado! 🛍️</b>,
                    }
                );
            } else {
                data = await api.addItem(product.id, 1);
            }
            setCartItems(mapAndSort(data.items));
            
        } catch (err) {
            console.error(err);
            if (!showToast) toast.error("Error al actualizar cantidad");
        }
    };

    // QUITAR UNA UNIDAD
    // 4. QUITAR UNA UNIDAD (Con Deshacer si llega a 0)
    const removeOne = async (productId) => {
        const item = cartItems.find(item => item.product.id === productId);
        if (!item) return;

        // CASO ESPECIAL: Es la última unidad (1) -> Se va a borrar
        if (item.quantity === 1) {
            const toastId = toast.loading("Eliminando...");

            try {
                // 1. UI Optimista: Lo sacamos de la lista visualmente ya
                setCartItems(prev => prev.filter(i => i.product.id !== productId));

                // 2. Llamada al Backend
                const data = await api.removeOne(productId);
                
                // 3. Confirmamos estado
                setCartItems(mapAndSort(data.items));
                toast.dismiss(toastId);

                // 4. Mostramos el Toast con botón DESHACER
                toast((t) => (
                    <div className="flex items-center gap-3">
                        <span>🗑️ Producto eliminado</span>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                undoDelete(item); // Restaura esa unidad
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded border border-gray-500 transition-colors"
                        >
                            Deshacer
                        </button>
                    </div>
                ), { duration: 4000 });

            } catch (err) {
                console.error("Error eliminando última unidad", err);
                toast.error("No se pudo eliminar", { id: toastId });
                // Si falla, revertimos recargando
                const data = await api.getCart();
                setCartItems(mapAndSort(data.items));
            }
        } 
        // CASO NORMAL: Tiene más de 1 unidad (ej: 5 -> 4)
        else {
            try {
                const data = await api.removeOne(productId);
                setCartItems(mapAndSort(data.items));
            } catch (err) {
                console.error("Error quitando unidad", err);
                toast.error("Error al actualizar cantidad");
            }
        }
    };

    // QUITAR TODO
    // 4. ELIMINAR ITEM CON DESHACER (Undo) ↩️
    const removeFromCart = async (productId) => {
        // 1. Buscamos el item antes de borrarlo para tener la "copia de seguridad"
        const itemToDelete = cartItems.find(item => item.product.id === productId);
        
        if (!itemToDelete) return;

        // Guardamos una referencia al toast para poder cerrarlo programáticamente
        const toastId = toast.loading("Eliminando...");

        try {
            // 2. Borramos visualmente (Optimistic UI)
            setCartItems(prev => prev.filter(item => item.product.id !== productId));

            // 3. Borramos en la base de datos
            const data = await api.removeItem(productId);
            setCartItems(mapAndSort(data.items));
            
            toast.dismiss(toastId); // Borramos el "Cargando..."

            // 4. Mostramos el mensaje de éxito con el botón DESHACER
            toast((t) => (
                <div className="flex items-center gap-3">
                    <span>🗑️ Producto eliminado</span>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id); // Cierra este toast
                            undoDelete(itemToDelete); // Llama a la función de restaurar
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded border border-gray-500 transition-colors"
                    >
                        Deshacer
                    </button>
                </div>
            ), { duration: 4000 }); // Dura 4 segundos

        } catch (err) {
            console.error("Error eliminando item", err);
            toast.error("No se pudo eliminar", { id: toastId });
            // Si falló, revertimos (volvemos a cargar el carro real)
            const data = await api.getCart();
            setCartItems(mapAndSort(data.items));
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

    // AUXILIARES
    const mapAndSort = items => {
        const mapped = items.map(item => ({
            product: {
                id: item.productId,
                name: item.productName,
                price: item.price,
                stock:item.stock,
                imageUrl: item.imageUrl
            },
            quantity: item.quantity
        }));
        return mapped.sort((a, b) => a.product.id - b.product.id);
    };

    // FUNCIÓN DE RESTAURAR (Deshacer) - Versión "Anti-Freeze" Móvil ❄️🔥
    const undoDelete = async (item) => {
        // 1. Limpiamos cualquier toast previo para que no se acumulen
        toast.dismiss(); 
        
        const toastId = toast.loading('Restaurando...');
        
        try {
            const data = await api.addItem(item.product.id, item.quantity);
            setCartItems(mapAndSort(data.items));

            // 2. Mostramos éxito
            toast.success('¡Producto recuperado! ♻️', { 
                id: toastId,
            });

            // 3. FUERZA BRUTA: Matamos el toast a los 3 segundos sí o sí
            // Esto ignora si el usuario tiene el dedo puesto encima
            setTimeout(() => {
                toast.dismiss(toastId);
            }, 4000);

        } catch (error) {
            console.error(error);
            toast.error('No se pudo restaurar', { id: toastId });
        }
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