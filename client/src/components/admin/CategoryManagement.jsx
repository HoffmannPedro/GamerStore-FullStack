import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data.sort((a, b) => a.id - b.id));
        } catch (error) {
            toast.error("Error al cargar categorías");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        const toastId = toast.loading("Creando...");
        try {
            await api.createCategory({ name: newCategory });
            toast.success("¡Categoría creada!", { id: toastId });
            setNewCategory("");
            fetchCategories(); // Recargar lista
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres borrar esta categoría?")) return;

        const toastId = toast.loading("Eliminando...");
        try {
            await api.deleteCategory(id);
            toast.success("Eliminada correctamente", { id: toastId });
            fetchCategories();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* --- FORMULARIO DE CREACIÓN --- */}
            <div className="bg-pixel-bg/50 p-6 rounded-xl border border-white/10 h-fit">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    Nueva Categoría
                </h3>
                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-bold text-pixel-muted uppercase tracking-widest mb-1 block">Nombre</label>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Ej: Periféricos"
                            className="w-full bg-pixel-card border border-white/10 rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-pixel-teal transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newCategory.trim()}
                        className="bg-pixel-teal text-pixel-bg font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
                    >
                        Crear Categoría
                    </button>
                </form>
            </div>

            {/* --- LISTA DE CATEGORÍAS --- */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Categorías Existentes ({categories.length})</h3>

                {loading ? (
                    <p className="text-pixel-muted animate-pulse">Cargando...</p>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex justify-between items-center bg-pixel-card p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all group">
                                <span className="font-medium text-gray-200 group-hover:text-white">{cat.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded">ID: {cat.id}</span>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded transition-colors"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}