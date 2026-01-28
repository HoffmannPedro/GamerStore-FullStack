import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Hero from './Hero';
import ProductModal from './ProductModal';
import Loader from './Loader';

function ProductList() {
    const { addToCart } = useCart();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ESTADOS DE FILTROS
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [sortOrder, setSortOrder] = useState("default");

    const [selectedProduct, setSelectedProduct] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await api.getCategories();
                setCategories(data);
            } catch (err) {
                console.log("Error al cargar categorías", err);
            }
        }
        loadCategories();
    }, []);

    useEffect(() => {
        const timerId = setTimeout(async () => {
            setLoading(true);
            try {
                const filters = {
                    searchTerm,
                    categoryId: selectedCategory,
                    sortOrder,
                    active: true
                };

                const data = await api.getProducts(filters);
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Error filtrando productos:", err);
                setError("No se pudieron cargar los productos.");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm, selectedCategory, sortOrder]);


    const handleAdd = (product) => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        addToCart(product);
    }

    const openModal = (product) => setSelectedProduct(product);
    const closeModal = () => setSelectedProduct(null);


    if (loading && products.length === 0) {
        return <Loader text="Cargando colección..." />;
    }

    if (error) {
        return (
            <div className="text-center mt-20 text-red-300 bg-red-900/20 p-6 rounded-lg max-w-md mx-auto border border-red-500/30">
                <p className="mb-4">Error: {error}</p>
                <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all">
                    Reintentar
                </button>
            </div>
        );
    }

    return (

        <div className="w-full"> {/* Quitamos el max-w-7xl y el padding del contenedor principal para que el Hero ocupe todo el ancho */}

            {/* 1. HERO SECTION (Solo se ve si no hay búsqueda activa, opcional) */}
            {!searchTerm && selectedCategory === "Todas" && (
                <Hero />
            )}
            <div className="max-w-7xl mx-auto p-6" id="catalogo">
                <h2 className="text-3xl font-bold mb-8 text-center text-white tracking-widest uppercase">
                    Colección <span className="text-pixel-teal">Exclusiva</span>
                </h2>

                {/* BARRA DE FILTROS */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 p-5 rounded-2xl bg-pixel-card/90 backdrop-blur-md border border-white/10 shadow-lg">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="w-full p-3 pl-4 rounded-xl bg-pixel-bg text-white border border-white/10 placeholder-gray-500 focus:ring-1 focus:ring-pixel-teal focus:border-pixel-teal outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute right-4 top-3.5 text-gray-500">🔍</span>
                    </div>
                    <select
                        className="p-3 rounded-xl bg-pixel-bg text-white border border-white/10 focus:ring-1 focus:ring-pixel-teal outline-none cursor-pointer hover:bg-white/5 transition-colors"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="Todas" className="bg-pixel-card text-white">Todas las Categorías</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-pixel-card text-white">{cat.name}</option>
                        ))}
                    </select>
                    <select
                        className="p-3 rounded-xl bg-pixel-bg text-white border border-white/10 focus:ring-1 focus:ring-pixel-teal outline-none cursor-pointer hover:bg-white/5 transition-colors"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="default" className="bg-pixel-card text-white">Orden por defecto</option>
                        <option value="price_asc" className="bg-pixel-card text-white">Precio: Menor a Mayor</option>
                        <option value="price_desc" className="bg-pixel-card text-white">Precio: Mayor a Menor</option>
                        <option value="alpha_asc" className="bg-pixel-card text-white">Nombre: A - Z</option>
                        <option value="alpha_desc" className="bg-pixel-card text-white">Nombre: Z - A</option>
                    </select>
                </div>

                {/* GRILLA DE PRODUCTOS */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <div
                                key={product.id}
                                /* FIX VISUAL:
                                    - 'isolate': Crea un nuevo contexto de apilamiento para que el border-radius se respete.
                                    - 'transform-gpu': Fuerza aceleración de hardware para evitar parpadeos.
                                    - quitamos el 'transform' genérico y usamos clases específicas.
                                */
                                className="group relative w-full bg-pixel-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pixel-teal/10 transition-all duration-500 ease-out hover:-translate-y-2 ring-1 ring-white/5 hover:ring-pixel-teal/30 cursor-pointer flex flex-col isolate transform-gpu"
                                onClick={() => openModal(product)}
                            >
                                {/* IMAGEN */}
                                <div className="relative h-64 overflow-hidden bg-pixel-bg">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                        onError={(e) => e.target.src = "/img/placeholder.jpg"}
                                    />
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border ${product.stock > 0
                                            ? 'bg-pixel-teal/60 text-slate-300 border-pixel-teal/80'
                                            : 'bg-red-900/60 text-red-200 border-red-500/30'
                                            }`}>
                                            {product.stock > 0 ? `STOCK: ${product.stock}` : 'AGOTADO'}
                                        </span>
                                    </div>
                                </div>

                                {/* INFO */}
                                <div className="p-5 flex flex-col flex-grow text-center relative z-20 bg-pixel-card">
                                    <p className="text-[10px] tracking-[0.2em] text-pixel-purple uppercase font-bold mb-2">
                                        {product.categoryName || "DECORACIÓN"}
                                    </p>
                                    <h3 className="text-lg text-white font-medium mb-1 font-montserrat leading-tight group-hover:text-pixel-teal transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="mt-auto pt-4 w-full">
                                        <p className="text-2xl text-pixel-teal font-mono font-bold mb-4 tracking-tighter">
                                            ${product.price.toFixed(2)}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAdd(product);
                                            }}
                                            disabled={!isAuthenticated() || product.stock === 0}
                                            className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-300 shadow-md ${isAuthenticated() && product.stock !== 0
                                                ? 'border-pixel-teal text-pixel-teal hover:bg-pixel-teal hover:text-slate-200 hover:shadow-pixel-teal/20'
                                                : 'border-gray-600 text-gray-500 cursor-not-allowed bg-transparent'
                                                }`}
                                        >
                                            {isAuthenticated() ? 'AGREGAR' : 'LOGIN'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl mb-4">No encontramos productos con esos filtros.</p>
                        <button className="text-pixel-teal hover:text-white underline font-bold tracking-wide" onClick={() => { setSearchTerm(""); setSelectedCategory("Todas"); }}>
                            Limpiar filtros y ver todo
                        </button>
                    </div>
                )}
                {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
            </div>
        </div>
    );
}

export default ProductList;