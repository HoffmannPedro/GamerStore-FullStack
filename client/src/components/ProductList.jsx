import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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
    // const [inStock, setInStock] = useState(false); // Si quieres agregar el checkbox después

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 1. CARGAR CATEGORÍAS (Corregido: Agregado [] para ejecutar solo una vez)
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await api.getCategories();
                setCategories(data);
            } catch (err) {
                console.log("error al cargar categorías");
            }
        }
        loadCategories();
    }, []); // <--- Importante: array vacío

    // 2. CARGAR PRODUCTOS CON FILTROS (Server-Side Filtering)
    // Este efecto reemplaza al fetch inicial, ya que se ejecuta al montar el componente
    useEffect(() => {
        const timerId = setTimeout(async () => {
            setLoading(true);
            try {
                const filters = {
                    searchTerm,
                    categoryId: selectedCategory,
                    sortOrder
                };

                const data = await api.getProducts(filters);
                setProducts(data);
                setError(null); // Limpiamos error si hubo éxito
            } catch (error) {
                console.error("Error filtrando productos:", error);
                setError("No se pudieron cargar los productos.");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm, selectedCategory, sortOrder]);

    if (loading && products.length === 0) {
        return <div className="text-center mt-8">Cargando productos...</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-red-600">
                Error: {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const handleAdd = (product) => {
        if (!isAuthenticated()) {
            alert('Iniciá sesión para agregar al carrito');
            navigate('/login');
            return;
        }
        addToCart(product);
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-4xl font-bold mb-6 text-center text-white">Productos</h2>

            {/* --- BARRA DE FILTROS (Nueva sección) --- */}
            {/* Diseñada oscura para combinar con tu tema */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 rounded-lg bg-gray-800/50 border border-gray-700">

                {/* Buscador */}
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-btnGreen outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filtro Categoría */}
                <select
                    className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="Todas">Todas las Categorías</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Ordenamiento */}
                <select
                    className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="default">Orden por defecto</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="alpha_asc">Nombre: A - Z</option>
                    <option value="alpha_desc">Nombre: Z - A</option>
                </select>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="relative w-full bg-terciary p-6 rounded-lg shadow hover:shadow-lg ring-1 ring-gray-600 card-hover inline-grid group">
                            {/* Badge de Stock (Nuevo) */}
                            <div className="absolute bottom-1/4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.stock > 0 ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
                                    }`}>
                                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                                </span>
                            </div>

                            <h3 className="text-lg text-white font-medium shadow-xl mb-2">{product.name}</h3>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-64 object-cover py-4" // object-cover es clave para que no se deformen
                                onError={(e) => e.target.src = "/img/placeholder.jpg"}
                            />
                            <p className="text-gray-200 mb-4 font-semibold">${product.price.toFixed(2)}</p>

                            <button
                                onClick={() => handleAdd(product)}
                                disabled={!isAuthenticated()}
                                className={`w-full py-2 px-4 rounded ${isAuthenticated()
                                    ? 'bg-btnGreen text-white hover:brightness-125'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Agregar al carrito
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">No encontramos productos con esos filtros. 🔍</p>
                    <button
                        className="mt-4 text-btnGreen hover:text-white underline"
                        onClick={() => { setSearchTerm(""); setSelectedCategory("Todas"); }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

        </div>
    );
}

export default ProductList;