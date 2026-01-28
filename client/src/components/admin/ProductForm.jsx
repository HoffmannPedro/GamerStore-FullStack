import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function ProductForm({ onSuccess, productToEdit, onCancel }) {
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);

    // ✨ NUEVO: Estado para guardar los errores de validación del backend
    const [fieldErrors, setFieldErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: '',
        description: ''
    });

    useEffect(() => {
        api.getCategories()
            .then(setCategories)
            .catch(err => console.error("Error cargando categorías", err));
    }, []);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                price: productToEdit.price || '',
                stock: productToEdit.stock || '',
                imageUrl: productToEdit.imageUrl || '',
                categoryId: productToEdit.categoryId || '',
                description: productToEdit.description || ''
            });
        } else {
            setFormData({ name: '', price: '', stock: '', imageUrl: '', categoryId: '', description: '' });
        }
        // Limpiamos errores al cambiar de modo (editar/crear)
        setFieldErrors({});
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // ✨ Opcional: Limpiar el error de un campo cuando el usuario empieza a escribir en él
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({}); // Limpiar errores previos

        let toastId; // ✨ DECLARAMOS AQUÍ para que el catch lo vea

        try {
            const productPayload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId)
            };

            toastId = toast.loading("Guardando..."); // Asignamos el ID

            if (productToEdit) {
                await api.updateProduct(productToEdit.id, productPayload);
                toast.success('¡Producto actualizado!', { id: toastId });
            } else {
                await api.createProduct(productPayload);
                toast.success('¡Producto creado!', { id: toastId });
                setFormData({ name: '', price: '', stock: '', imageUrl: '', categoryId: '', description: '' });
            }

            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (error) {
            console.error("Error submit:", error);
            
            if (error.response && error.response.status === 400 && error.response.data.errors) {
                // Ahora api.js SÍ nos pasa error.response.data.errors
                setFieldErrors(error.response.data.errors);
                toast.error("Por favor, corrige los errores marcados.", { id: toastId }); // ✨ Cerramos el loading
            } else {
                const msj = error.response?.data?.message || error.message || "Error al guardar";
                toast.error(msj, { id: toastId }); // ✨ Cerramos el loading con el mensaje real
            }
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadToast = toast.loading("Subiendo imagen...");

        try {
            const data = await api.uploadImage(file);
            setFormData(prev => ({ ...prev, imageUrl: data.url }));
            
            // Limpiar error de imagen si existía
            if (fieldErrors.imageUrl) {
                setFieldErrors(prev => ({ ...prev, imageUrl: null }));
            }
            
            toast.success("Imagen lista", { id: uploadToast });
        } catch (error) {
            console.error(error);
            toast.error("Error al subir", { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    // --- LÓGICA PARA LA VISTA PREVIA ---
    const selectedCategoryName = categories.find(c => c.id == formData.categoryId)?.name || "CATEGORÍA";

    // ✨ MODIFICADO: Helper para obtener clases condicionales si hay error
    const getInputClass = (fieldName) => {
        const baseClass = "w-full p-3 rounded-lg bg-pixel-bg text-white border outline-none transition-all placeholder-gray-600";
        // Si hay error: Borde rojo. Si no: Borde gris/transparente normal
        if (fieldErrors[fieldName]) {
            return `${baseClass} border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClass} border-white/10 focus:ring-1 focus:ring-pixel-teal focus:border-pixel-teal`;
    };

    const labelClass = "block text-pixel-muted mb-2 text-xs font-bold uppercase tracking-widest";

    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {productToEdit ? '✏️ Editando Producto' : '➕ Nuevo Producto'}
                </h3>
                <button onClick={onCancel} className="text-pixel-muted hover:text-white text-sm font-medium transition-colors">
                    ✕ Cancelar
                </button>
            </div>

            {/* LAYOUT PRINCIPAL */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">

                {/* --- COLUMNA 1: FORMULARIO --- */}
                <form onSubmit={handleSubmit} className="space-y-6 order-2 xl:order-1">
                    
                    {/* Nombre */}
                    <div>
                        <label className={labelClass}>Nombre del Producto</label>
                        <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                            className={getInputClass('name')} // ✨ Usamos el helper
                            placeholder="Ej: Lámpara Cyberpunk..."
                        />
                        {/* ✨ Mensaje de error debajo */}
                        {fieldErrors.name && <p className="text-red-400 text-xs mt-1 font-bold">⚠️ {fieldErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Precio */}
                        <div>
                            <label className={labelClass}>Precio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <input
                                    type="number" name="price" step="0.01" required
                                    value={formData.price} onChange={handleChange}
                                    className={`${getInputClass('price')} pl-8`}
                                />
                            </div>
                            {fieldErrors.price && <p className="text-red-400 text-xs mt-1 font-bold">⚠️ {fieldErrors.price}</p>}
                        </div>
                        {/* Stock */}
                        <div>
                            <label className={labelClass}>Stock</label>
                            <input
                                type="number" name="stock" required
                                value={formData.stock} onChange={handleChange}
                                className={getInputClass('stock')}
                            />
                            {fieldErrors.stock && <p className="text-red-400 text-xs mt-1 font-bold">⚠️ {fieldErrors.stock}</p>}
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className={labelClass}>Categoría</label>
                        <select
                            name="categoryId" required
                            value={formData.categoryId} onChange={handleChange}
                            className={getInputClass('categoryId')}
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {fieldErrors.categoryId && <p className="text-red-400 text-xs mt-1 font-bold">⚠️ {fieldErrors.categoryId}</p>}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className={labelClass}>Descripción</label>
                        <textarea
                            name="description" required rows="4"
                            value={formData.description} onChange={handleChange}
                            className={getInputClass('description')}
                            placeholder="Detalles técnicos y características..."
                        />
                        {fieldErrors.description && <p className="text-red-400 text-xs mt-1 font-bold">⚠️ {fieldErrors.description}</p>}
                    </div>

                    {/* Imagen Input */}
                    <div>
                        <label className={labelClass}>Imagen</label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all group ${
                                    fieldErrors.imageUrl ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:border-pixel-teal/50 hover:bg-white/5'
                                }`}>
                                    <div className="text-center">
                                        <span className={`text-sm transition-colors ${fieldErrors.imageUrl ? 'text-red-400' : 'text-gray-400 group-hover:text-pixel-teal'}`}>
                                            {uploading ? 'Subiendo...' : 'Click para subir imagen'}
                                        </span>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                                
                                <input
                                    type="text" name="imageUrl" required
                                    value={formData.imageUrl} onChange={handleChange}
                                    className={`${getInputClass('imageUrl')} mt-3 text-xs`}
                                    placeholder="O pega una URL externa aquí..."
                                    readOnly={uploading}
                                />
                                {fieldErrors.imageUrl && <p className="text-red-400 text-xs mt-1 font-bold">⚠️ {fieldErrors.imageUrl}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                        <button type="button" onClick={onCancel} className="w-1/3 py-3 px-4 bg-transparent border border-gray-600 text-gray-300 font-bold rounded-lg hover:bg-white/5 transition-all text-sm uppercase tracking-wide">
                            Cancelar
                        </button>
                        <button type="submit" className="w-2/3 py-3 px-4 bg-pixel-teal text-pixel-bg font-bold rounded-lg hover:bg-white transition-all shadow-lg hover:shadow-pixel-teal/20 text-sm uppercase tracking-wide">
                            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>
                </form>

                {/* --- COLUMNA 2: VISTA PREVIA (Sin cambios mayores) --- */}
                <div className="order-1 xl:order-2 xl:sticky xl:top-6 space-y-4">
                    <h4 className="text-xs font-bold text-pixel-teal uppercase tracking-widest text-center border-b border-pixel-teal/20 pb-2">
                        👁️ Vista Previa del Cliente
                    </h4>

                    {/* Simulación del ProductModal */}
                    <div className="w-full bg-pixel-card rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col">
                        
                        {/* IMAGEN PREVIEW */}
                        <div className="w-full bg-pixel-bg flex items-center justify-center p-6 relative min-h-[250px]">
                            {formData.imageUrl ? (
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-full h-64 object-contain drop-shadow-2xl"
                                    onError={(e) => e.target.src = "/placeholder.png"}
                                />
                            ) : (
                                <div className="text-gray-600 flex flex-col items-center">
                                    <span className="text-4xl mb-2">📷</span>
                                    <span className="text-xs uppercase">Sin Imagen</span>
                                </div>
                            )}

                            {/* Badge de Stock */}
                            <span className={`absolute bottom-4 left-4 text-xs px-3 py-1 rounded font-bold shadow-sm backdrop-blur-md border border-white/10 ${
                                (parseInt(formData.stock) || 0) > 0 ? 'bg-pixel-teal/20 text-pixel-teal' : 'bg-red-900/60 text-red-200'
                            }`}>
                                {(parseInt(formData.stock) || 0) > 0 ? `Stock: ${formData.stock}` : 'Agotado'}
                            </span>
                        </div>

                        {/* INFO PREVIEW */}
                        <div className="p-6 md:p-8 flex flex-col border-t border-white/10">
                            <div className="mb-4">
                                <span className="text-pixel-purple font-bold text-xs tracking-[0.2em] uppercase mb-2 block">
                                    {selectedCategoryName}
                                </span>
                                <h2 className="text-2xl font-bold text-white mt-1 leading-tight font-montserrat break-words">
                                    {formData.name || "Nombre del Producto"}
                                </h2>
                            </div>

                            <div className="text-pixel-muted text-sm leading-relaxed mb-8 min-h-[80px] whitespace-pre-wrap">
                                {formData.description || "Aquí aparecerá la descripción detallada del producto..."}
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10">
                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Precio Final</p>
                                        <p className="text-3xl font-bold text-pixel-teal font-mono tracking-tighter">
                                            ${formData.price ? parseFloat(formData.price).toFixed(2) : "0.00"}
                                        </p>
                                    </div>
                                </div>

                                {/* Botón Falso */}
                                <button disabled className="w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-pixel-teal text-pixel-bg opacity-50 cursor-default">
                                    Añadir al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProductForm;