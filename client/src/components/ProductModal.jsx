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
        document.body.style.overflow = 'hidden'; // Bloquear scroll del body
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
            <div 
                // max-h-[90vh] y overflow-y-auto aseguran que si el modal es muy alto, puedas scrollear DENTRO del modal en el celular
                className="bg-terciary w-full max-w-4xl rounded-2xl shadow-2xl ring-1 ring-gray-700 relative flex flex-col md:flex-row animate-scale-up max-h-[90vh] overflow-y-auto md:overflow-visible"
                onClick={(e) => e.stopPropagation()} 
            >
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 bg-black/40 p-2 rounded-full text-gray-300 hover:text-white hover:bg-black/60 transition-all backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* --- IMAGEN --- */}
                {/* MÓVIL: h-72 (Altura fija) -> Evita que el modal salte si la imagen es rara.
                    DESKTOP: md:h-auto (Altura automática) -> Se adapta a la imagen real.
                    md:min-h-[400px] -> Para que no quede muy bajito en escritorio si la foto es apaisada.
                */}
                <div className="w-full md:w-1/2 h-72 md:h-auto md:min-h-[400px] flex items-center justify-center p-6 relative flex-shrink-0">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover drop-shadow-xl"
                        onError={(e) => e.target.src = "/img/placeholder.jpg"}
                    />
                    
                    <span className={`absolute bottom-4 left-4 text-xs px-3 py-1 rounded-full font-bold shadow-sm ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                    </span>
                </div>

                {/* --- INFO --- */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="mb-4">
                        <span className="text-btnGreen font-bold text-xs tracking-widest uppercase">
                            {product.categoryName || "Producto"}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 leading-tight">
                            {product.name}
                        </h2>
                    </div>

                    <div className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                        {product.description || "Sin descripción detallada disponible."}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-700">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-semibold">Precio Final</p>
                                <p className="text-3xl md:text-4xl font-bold text-white font-mono">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={!isAuthenticated() || product.stock === 0}
                            className={`w-full py-3.5 px-6 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
                                !isAuthenticated() 
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : product.stock === 0
                                        ? 'bg-red-900/50 text-red-200 cursor-not-allowed border border-red-900'
                                        : 'bg-btnGreen text-white hover:brightness-110 hover:shadow-green-500/20'
                            }`}
                        >
                            {!isAuthenticated() 
                                ? '🔒 Iniciá sesión para comprar' 
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