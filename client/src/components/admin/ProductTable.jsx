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

    if (loading) return <div className="text-pixel-teal text-center py-20 animate-pulse font-bold tracking-widest">CARGANDO BASE DE DATOS...</div>;

    return (
        <div>
            {/* --- VISTA DE ESCRITORIO (TABLA) --- */}
            <div className="hidden md:block overflow-x-auto rounded-xl shadow-xl ring-1 ring-white/10">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs font-bold uppercase tracking-widest bg-pixel-bg text-pixel-muted border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-pixel-card">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-pixel-teal/50 transition-colors">
                                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => e.target.src = "/img/placeholder.jpg"} />
                                    </div>
                                    <span className="group-hover:text-pixel-teal transition-colors font-bold text-sm">{product.name}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-pixel-teal tracking-tighter">${product.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${product.stock < 5 ? 'bg-red-900/30 text-red-200 border-red-500/30' : 'bg-green-900/30 text-green-200 border-green-500/30'}`}>
                                        {product.stock} u.
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${product.active ? 'bg-blue-900/30 text-blue-200 border-blue-500/30' : 'bg-gray-700/30 text-gray-400 border-gray-600/30'}`}>
                                        {product.active ? 'Visible' : 'Oculto'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <button onClick={() => onEdit(product)} className="px-3 py-1 rounded border border-white/20 hover:border-pixel-teal hover:text-pixel-teal hover:bg-pixel-teal/10 transition-all text-xs font-bold uppercase">
                                        Editar
                                    </button>
                                    <button onClick={() => toggleActive(product)} className={`px-3 py-1 rounded border transition-all text-xs font-bold uppercase ${product.active ? 'border-red-500/30 text-red-400 hover:bg-red-900/20' : 'border-green-500/30 text-green-400 hover:bg-green-900/20'}`}>
                                        {product.active ? 'Ocultar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- VISTA MÓVIL (TARJETAS) --- */}
            <div className="md:hidden space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-pixel-card p-4 rounded-xl shadow-lg ring-1 ring-white/10 flex flex-col gap-4">

                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => e.target.src = "/img/placeholder.jpg"} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base leading-tight mb-1">{product.name}</h3>
                                <p className="text-pixel-teal font-mono text-lg font-bold">${product.price}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${product.stock < 5 ? 'bg-red-900/30 text-red-200 border-red-500/30' : 'bg-green-900/30 text-green-200 border-green-500/30'}`}>
                                    Stock: {product.stock}
                                </span>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${product.active ? 'bg-blue-900/30 text-blue-200 border-blue-500/30' : 'bg-gray-700/30 text-gray-400 border-gray-600/30'}`}>
                                    {product.active ? 'Visible' : 'Oculto'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => onEdit(product)}
                                className="bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors border border-white/10"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => toggleActive(product)}
                                className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors border ${product.active ? 'bg-red-900/10 text-red-400 border-red-500/20' : 'bg-green-900/10 text-green-400 border-green-500/20'}`}
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