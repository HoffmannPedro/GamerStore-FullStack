import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!product) return null;

    // Cerrar al presionar ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Manejador para agregar al carrito desde el modal
    const handleAdd = () => {
        if (!isAuthenticated()) {
            onClose(); // Cerramos el modal antes de navegar
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        // Fondo oscuro (Backdrop) con blur
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" 
            onClick={onClose}
        >
            {/* Contenedor del Modal */}
            <div
                className="bg-terciary w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-700 relative flex flex-col md:flex-row animate-scale-up"
                onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
            >
                {/* Botón Cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black/20 p-2 rounded-full hover:bg-black/50 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Columna Izquierda: Imagen */}
                <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center p-8 relative">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-500 rounded-lg"
                        onError={(e) => e.target.src = "/img/placeholder.jpg"}
                    />
                    {/* Badge de Stock dentro del modal */}
                    <span className={`absolute bottom-4 left-4 text-xs px-3 py-1 rounded-full font-bold shadow-sm ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                    </span>
                </div>

                {/* Columna Derecha: Información */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    {/* Categoría */}
                    <span className="text-btnGreen font-bold text-sm tracking-wider uppercase mb-2">
                        {product.categoryName || "Producto"}
                    </span>

                    {/* Título */}
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                        {product.name}
                    </h2>

                    {/* Descripción (Con scroll si es muy larga) */}
                    <div className="text-gray-300 text-base leading-relaxed mb-6 flex-grow overflow-y-auto max-h-60 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {product.description
                            ? product.description
                            : "Sin descripción detallada disponible para este producto."}
                    </div>

                    {/* Footer del modal: Precio y Botón */}
                    <div className="mt-auto pt-6 border-t border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-4xl font-bold text-white">
                                ${product.price.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={!isAuthenticated() || product.stock === 0}
                            className={`w-full py-3.5 px-6 rounded-lg font-bold text-lg transition-all transform active:scale-95 ${!isAuthenticated()
                                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    : product.stock === 0
                                        ? 'bg-red-900/50 text-red-200 cursor-not-allowed'
                                        : 'bg-btnGreen text-white hover:brightness-110 hover:shadow-lg hover:shadow-green-900/20'
                                }`}
                        >
                            {!isAuthenticated()
                                ? 'Iniciá sesión para comprar'
                                : product.stock === 0
                                    ? 'Sin Stock'
                                    : 'Añadir al Carrito 🛒'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;