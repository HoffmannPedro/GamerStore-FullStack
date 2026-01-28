import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!product) return null;

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const handleAdd = () => {
        if (!isAuthenticated()) {
            onClose();
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            {/* FIX: Quitamos bg-pixel-card y overflow-hidden del padre para evitar doble borde.
                Ahora cada mitad gestiona sus propias esquinas redondeadas.
            */}
            <div
                className="w-full max-w-4xl relative flex flex-col md:flex-row animate-scale-up max-h-[90vh] overflow-y-auto md:overflow-visible shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón Cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 bg-black/40 p-2 rounded-full text-gray-300 hover:text-pixel-bg hover:bg-pixel-teal transition-all backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* --- IMAGEN (Izquierda/Arriba) --- */}
                {/* rounded-t-2xl en móvil, rounded-l-2xl en desktop (y quitamos el top-right en desktop) */}
                <div className="w-full md:w-1/2 bg-pixel-bg flex items-center justify-center p-6 relative flex-shrink-0 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl border-l border-t border-r md:border-r-0 border-white/10">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl"
                        onError={(e) => e.target.src = "/img/placeholder.jpg"}
                    />

                    <span className={`absolute bottom-4 left-4 text-xs px-3 py-1 rounded font-bold shadow-sm backdrop-blur-md border border-white/10 ${product.stock > 0 ? 'bg-pixel-teal/20 text-pixel-teal' : 'bg-red-900/60 text-red-200'
                        }`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                    </span>
                </div>

                {/* --- INFO (Derecha/Abajo) --- */}
                {/* rounded-b-2xl en móvil, rounded-r-2xl en desktop (y quitamos el bottom-left en desktop) */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-pixel-card rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl border-l border-b border-r md:border-l-0 border-white/10">
                    <div className="mb-4">
                        <span className="text-pixel-purple font-bold text-xs tracking-[0.2em] uppercase mb-2 block">
                            {product.categoryName || "Colección"}
                        </span>
                        <h2 className="text-3xl font-bold text-white mt-1 leading-tight font-montserrat">
                            {product.name}
                        </h2>
                    </div>

                    <div className="text-pixel-muted text-sm leading-relaxed mb-8 flex-grow">
                        {product.description || "Sin descripción detallada disponible."}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Precio Final</p>
                                <p className="text-4xl font-bold text-pixel-teal font-mono tracking-tighter">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={!isAuthenticated() || product.stock === 0}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-widest transition-all transform active:scale-95 shadow-lg ${!isAuthenticated()
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                                    : product.stock === 0
                                        ? 'bg-red-900/20 text-red-300 cursor-not-allowed border border-red-900/50'
                                        : 'bg-pixel-teal text-pixel-bg hover:bg-white hover:shadow-pixel-teal/30'
                                }`}
                        >
                            {!isAuthenticated()
                                ? '🔒 Inicia sesión para comprar'
                                : product.stock === 0
                                    ? '🚫 Sin Stock'
                                    : 'Añadir al Carrito'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;