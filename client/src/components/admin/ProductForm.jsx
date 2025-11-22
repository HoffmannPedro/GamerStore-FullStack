import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../../services/api';

function ProductForm({ onSuccess, productToEdit, onCancel }) {
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false); // Estado para el loading de la imagen

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: '',
        description: ''
    });
    const [message, setMessage] = useState(null);

    // 1. Cargar categorías para el <select>
    useEffect(() => {
        api.getCategories()
            .then(setCategories)
            .catch(err => console.error("Error cargando categorías", err));
    }, []);

    // EFECTO MÁGICO: Si nos pasan un producto para editar, rellenamos el formulario
    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                price: productToEdit.price || '',
                stock: productToEdit.stock || '',
                imageUrl: productToEdit.imageUrl || '',
                categoryId: productToEdit.categoryId || '', // Asegúrate que el DTO traiga esto
                description: productToEdit.description || ''
            });
        } else {
            // Si no hay producto (modo crear), limpiamos
            setFormData({ name: '', price: '', stock: '', imageUrl: '', categoryId: '', description: '' });
        }
    }, [productToEdit]);

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

            if (productToEdit) {
                // MODO EDICIÓN: Usamos PUT y el ID del producto
                await api.updateProduct(productToEdit.id, productPayload);
                setMessage({ type: 'success', text: '¡Producto actualizado! 💾' });
            } else {
                // MODO CREACIÓN: Usamos POST
                await api.createProduct(productPayload);
                setMessage({ type: 'success', text: '¡Producto creado! 🎉' });
                // Solo limpiamos si creamos uno nuevo, si editamos dejamos los datos por si quiere corregir algo más
                setFormData({ name: '', price: '', stock: '', imageUrl: '', categoryId: '', description: '' });
            }

            // Esperar un poquito y volver a la lista
            setTimeout(() => {
                onSuccess();
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    // Función para manejar la selección de archivo
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadToast = toast.loading("Subiendo imagen...");

        try {
            // 1. Subimos al backend -> Cloudinary
            const data = await api.uploadImage(file);
            
            // 2. Ponemos la URL recibida en el formulario
            setFormData(prev => ({ ...prev, imageUrl: data.url }));
            
            toast.success("Imagen cargada correctamente", { id: uploadToast });
        } catch (error) {
            console.error(error);
            toast.error("Error al subir imagen", { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">
                    {productToEdit ? `Editando: ${productToEdit.name}` : 'Nuevo Producto'}
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white underline text-sm"
                >
                    Cancelar y volver
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded text-center font-bold ${message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
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
                        />
                    </div>
                    {/* Stock */}
                    <div>
                        <label className="block text-gray-300 mb-2">Stock</label>
                        <input
                            type="number" name="stock" required
                            value={formData.stock} onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none"
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

                {/* Descripción */}
                <div>
                    <label className="block text-gray-300 mb-2">Descripción</label>
                    <textarea
                        name="description" required rows="4"
                        value={formData.description} onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none resize-y"
                        placeholder="Detalles del producto..."
                    />
                </div>

                {/* Imagen URL */}
                <div>
                    <label className="block text-gray-300 mb-2">Imagen del Producto</label>
                    
                    <div className="flex gap-4 items-center">
                        {/* Input de Archivo */}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-btnGreen file:text-white
                                hover:file:bg-green-600
                                cursor-pointer"
                        />
                    </div>

                    {/* Input de Texto (Por si quieres pegar una URL externa a mano) */}
                    <input
                        type="text" name="imageUrl" required
                        value={formData.imageUrl} onChange={handleChange}
                        className="w-full mt-3 p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-btnGreen outline-none text-sm"
                        placeholder="URL de la imagen (se rellena sola al subir archivo)"
                        readOnly={uploading} // Bloquear mientras sube
                    />
                    
                    {/* Previsualización Pequeña */}
                    {formData.imageUrl && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                            <img src={formData.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded border border-gray-600" />
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-1/3 py-3 px-4 bg-gray-600 text-white font-bold rounded hover:bg-gray-500 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="w-2/3 py-3 px-4 bg-btnGreen text-white font-bold rounded hover:brightness-110 transition-all shadow-lg"
                    >
                        {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm;
