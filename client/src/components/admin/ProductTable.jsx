import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProductTable = ({ onEdit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts(); 
            const sortedData = data.sort((a, b) => a.id - b.id);
            setProducts(sortedData);
        } catch (error) {
            toast.error("Error cargando productos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleActive = async (product) => {
        try {
            const updatedData = { ...product, active: !product.active };
            await api.updateProduct(product.id, updatedData);
            toast.success(`Producto ${updatedData.active ? 'activado' : 'ocultado'}`);
            fetchProducts(); 
        } catch (error) {
            toast.error("Error al actualizar estado");
        }
    };

    if (loading) return <div className="text-white text-center py-10 animate-pulse">Cargando inventario...</div>;

    return (
        <div>
            {/* --- VISTA DE ESCRITORIO (TABLA) --- */}
            {/* Se oculta en móviles (hidden) y aparece en pantallas medianas (md:block) */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-xl ring-1 ring-gray-700">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-800 text-gray-200">
                        <tr>
                            <th className="px-4 py-3">Producto</th>
                            <th className="px-4 py-3">Precio</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-terciary">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 font-medium text-white flex items-center gap-3">
                                    <img src={product.imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-gray-700" onError={(e) => e.target.src = "/img/placeholder.jpg"}/>
                                    {product.name}
                                </td>
                                <td className="px-4 py-4 font-mono text-btnGreen">${product.price}</td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 5 ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.active ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-400'}`}>
                                        {product.active ? 'Visible' : 'Oculto'}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-center space-x-3">
                                    <button onClick={() => onEdit(product)} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                        Editar
                                    </button>
                                    <button onClick={() => toggleActive(product)} className={`font-medium transition-colors ${product.active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                                        {product.active ? 'Ocultar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- VISTA MÓVIL (TARJETAS) --- */}
            {/* Se muestra solo en móviles (md:hidden) */}
            <div className="md:hidden space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-terciary p-4 rounded-lg shadow-md ring-1 ring-gray-700 flex flex-col gap-3">
                        
                        {/* Cabecera: Imagen y Nombre */}
                        <div className="flex items-center gap-3 border-b border-gray-700 pb-3 text-left">
                            <img src={product.imageUrl} alt="" className="w-12 h-12 rounded object-cover bg-gray-700" onError={(e) => e.target.src = "/img/placeholder.jpg"}/>
                            <div>
                                <h3 className="text-white font-bold text-sm">{product.name}</h3>
                                <p className="text-btnGreen font-mono text-sm">${product.price}</p>
                            </div>
                        </div>

                        {/* Detalles: Stock y Estado */}
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.stock < 5 ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                                    Stock: {product.stock}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.active ? 'bg-blue-900/50 text-blue-200' : 'bg-gray-700 text-gray-400'}`}>
                                    {product.active ? 'Visible' : 'Oculto'}
                                </span>
                            </div>
                        </div>

                        {/* Botones de Acción (Grandes para el dedo) */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button 
                                onClick={() => onEdit(product)} 
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium transition-colors"
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => toggleActive(product)} 
                                className={`py-2 rounded text-sm font-medium transition-colors ${product.active ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-green-900/30 text-green-300 hover:bg-green-900/50'}`}
                            >
                                {product.active ? 'Ocultar' : 'Activar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductTable;