import { useState } from 'react';


import ProductForm from '../components/admin/ProductForm';
import ProductTable from '../components/admin/ProductTable';

function AdminPage() {
    const [activeTab, setActiveTab] = useState('list'); // 'list' o 'create'
    const [productToEdit, setProductToEdit] = useState(null); // Estado para guardar el producto seleccionado

    // Función para ir al modo "Crear" (Limpia la edición)
    const handleCreateMode = () => {
        setProductToEdit(null);
        setActiveTab('form');
    };

    // Función para ir al modo "Editar" (Carga el producto)
    const handleEditMode = (product) => {
        setProductToEdit(product);
        setActiveTab('form');
    };

    // Cuando termina (éxito o cancelar), volvemos a la lista
    const handleBackToList = () => {
        setProductToEdit(null);
        setActiveTab('list');
    };

    return (
        <div className="max-w-7xl mx-auto p-6 mt-10">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Panel de Control</h2>

            {/* --- TABS DE NAVEGACIÓN --- */}
            <div className="flex justify-center mb-8 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 ${
                        activeTab === 'list' 
                            ? 'border-btnGreen text-btnGreen' 
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    📦 Gestionar Productos
                </button>
                <button
                    onClick={handleCreateMode}
                    className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 ${
                        activeTab === 'form' 
                            ? 'border-btnGreen text-btnGreen' 
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    {/* Cambia el texto según el modo */}
                    {productToEdit ? '✏️ Editar Producto' : '➕ Crear Nuevo'}
                </button>
            </div>

            {/* --- CONTENIDO --- */}
            <div className="bg-terciary rounded-xl shadow-xl p-6 ring-1 ring-gray-700">
                {activeTab === 'list' ? (
                    <ProductTable onEdit={handleEditMode} />
                ) : (
                    // Le pasamos el producto a editar (puede ser null)
                    <ProductForm 
                        productToEdit={productToEdit} 
                        onSuccess={handleBackToList} 
                        onCancel={handleBackToList}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminPage;