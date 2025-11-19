import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: ''
    });
    const [message, setMessage] = useState(null);

    // 1. Cargar categorías para el <select>
    useEffect(() => {
        api.getCategories()
            .then(setCategories)
            .catch(err => console.error("Error cargando categorías", err));
    }, []);

    // 2. Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertimos números
            const productPayload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId)
            };

            await api.createProduct(productPayload);
            
            setMessage({ type: 'success', text: '¡Producto creado con éxito! 🎉' });
            
            // Limpiar formulario
            setFormData({ name: '', price: '', stock: '', imageUrl: '', categoryId: '' });

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 mt-10 bg-terciary rounded-lg shadow-xl ring-1 ring-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Panel de Administración</h2>
            <p className="text-gray-400 text-center mb-8">Agregar nuevo producto al catálogo</p>

            {message && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nombre */}
                <div>
                    <label className="block text-gray-300 mb-2">Nombre del Producto</label>
                    <input 
                        type="text" name="name" required
                        value={formData.name} onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                        placeholder="Ej: Notebook Gamer..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Precio */}
                    <div>
                        <label className="block text-gray-300 mb-2">Precio</label>
                        <input 
                            type="number" name="price" step="0.01" required
                            value={formData.price} onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    {/* Stock */}
                    <div>
                        <label className="block text-gray-300 mb-2">Stock Inicial</label>
                        <input 
                            type="number" name="stock" required
                            value={formData.stock} onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-gray-300 mb-2">Categoría</label>
                    <select 
                        name="categoryId" required
                        value={formData.categoryId} onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                    >
                        <option value="">Seleccionar Categoría...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Imagen URL */}
                <div>
                    <label className="block text-gray-300 mb-2">URL de la Imagen</label>
                    <input 
                        type="text" name="imageUrl" required
                        value={formData.imageUrl} onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
                        placeholder="/img/tu-archivo.png o https://..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Tip: Usa rutas de la carpeta public (/img/...) o URLs externas.</p>
                </div>

                <button 
                    type="submit"
                    className="w-full py-3 px-4 bg-btnGreen text-white font-bold rounded hover:brightness-110 transition-all shadow-lg"
                >
                    Crear Producto
                </button>
            </form>
        </div>
    );
}

export default AdminPage;