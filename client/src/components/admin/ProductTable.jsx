// client/src/components/admin/ProductTable.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProductTable = ({ onEdit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar productos
    const fetchProducts = async () => {
        try {
            // Usamos el mismo endpoint, pero aquí mostraremos TODOS
            const data = await api.getProducts(); 
            // Ordenamos por ID ascendente para que no salten al editar
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

    // Función de "Eliminar" (Soft Delete)
    const toggleActive = async (product) => {
        try {
            // Enviamos el producto actualizado con el estado invertido
            const updatedData = { ...product, active: !product.active };
            
            // Necesitas asegurarte que tu API 'updateProduct' soporte PUT
            await api.updateProduct(product.id, updatedData);
            
            toast.success(`Producto ${updatedData.active ? 'activado' : 'ocultado'}`);
            fetchProducts(); // Recargar lista
        } catch (error) {
            toast.error("Error al actualizar estado");
        }
    };

    if (loading) return <div className="text-white text-center">Cargando inventario...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-200">
                    <tr>
                        <th className="px-4 py-3">Producto</th>
                        <th className="px-4 py-3">Precio</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-4 font-medium text-white flex items-center gap-3">
                                <img src={product.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                                {product.name}
                            </td>
                            <td className="px-4 py-4">${product.price}</td>
                            <td className="px-4 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 5 ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                                    {product.stock}
                                </span>
                            </td>
                            <td className="px-4 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${product.active ? 'bg-blue-900 text-blue-200' : 'bg-gray-600 text-gray-300'}`}>
                                    {product.active ? 'Visible' : 'Oculto'}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-center space-x-2">
                                {/* Botón Editar */}
                                <button 
                                    onClick={() => onEdit(product)}
                                    className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                                >
                                    Editar
                                </button>

                                {/* Botón Ocultar/Mostrar */}
                                <button 
                                    onClick={() => toggleActive(product)}
                                    className={`font-semibold text-sm ${product.active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                                >
                                    {product.active ? 'Ocultar' : 'Activar'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;