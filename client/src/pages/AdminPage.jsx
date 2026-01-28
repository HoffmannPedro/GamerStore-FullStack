import { useState } from 'react';
import ProductForm from '../components/admin/ProductForm';
import ProductTable from '../components/admin/ProductTable';
import OrderManagement from '../components/admin/OrderManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import { MdSell } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { BsFillBoxSeamFill } from "react-icons/bs";



function AdminPage() {
    // Estado Principal: 'products' | 'orders' | 'categories'
    const [activeSection, setActiveSection] = useState('products'); 

    // Estado Secundario (Productos)
    const [productMode, setProductMode] = useState('list'); 
    const [productToEdit, setProductToEdit] = useState(null);

    // --- MANEJADORES DE PRODUCTOS ---
    const handleCreateProduct = () => {
        setProductToEdit(null);
        setProductMode('form');
    };

    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setProductMode('form');
    };

    const handleBackToProductList = () => {
        setProductToEdit(null);
        setProductMode('list');
    };

    return (
        <div className="max-w-7xl mx-auto p-6 mt-6">
            <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-widest uppercase">
                Panel de <span className="text-pixel-teal">Administración</span>
            </h2>

            {/* --- MENÚ PRINCIPAL (PESTAÑAS) --- */}
            <div className="flex justify-center gap-4 mb-8 overflow-x-auto">
                {/* 1. PRODUCTOS */}
                <button
                    onClick={() => setActiveSection('products')}
                    className={`px-6 py-3 rounded-t-xl font-bold text-sm uppercase tracking-widest transition-all border-b-4 ${
                        activeSection === 'products'
                            ? 'bg-pixel-card border-pixel-teal text-white shadow-lg -translate-y-1'
                            : 'bg-transparent border-transparent text-pixel-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <span className='flex gap-2 items-center'><BsFillBoxSeamFill className='w-5 h-5' /> Productos</span>
                </button>

                {/* 2. CATEGORÍAS (¡Este faltaba!) */}
                <button
                    onClick={() => setActiveSection('categories')}
                    className={`px-6 py-3 rounded-t-xl font-bold text-sm uppercase tracking-widest transition-all border-b-4 ${
                        activeSection === 'categories'
                            ? 'bg-pixel-card border-yellow-400 text-white shadow-lg -translate-y-1'
                            : 'bg-transparent border-transparent text-pixel-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <span className='flex gap-2 items-center'><TbCategoryPlus className='w-5 h-5' /> Categorías</span>
                </button>

                {/* 3. VENTAS */}
                <button
                    onClick={() => setActiveSection('orders')}
                    className={`px-6 py-3 rounded-t-xl font-bold text-sm uppercase tracking-widest transition-all border-b-4 ${
                        activeSection === 'orders'
                            ? 'bg-pixel-card border-pixel-purple text-white shadow-lg -translate-y-1'
                            : 'bg-transparent border-transparent text-pixel-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <span className='flex gap-2 items-center'><MdSell className='w-5 h-5' /> Ventas</span>
                </button>
            </div>

            {/* --- CONTENIDO DINÁMICO --- */}
            <div className="bg-pixel-card/90 backdrop-blur-md rounded-b-xl rounded-tr-xl rounded-tl-xl shadow-2xl p-6 ring-1 ring-white/10 min-h-[500px]">
                
                {/* SECCIÓN PRODUCTOS */}
                {activeSection === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h3 className="text-xl font-bold text-white">Gestión de Inventario</h3>
                            {productMode === 'list' && (
                                <button
                                    onClick={handleCreateProduct}
                                    className="bg-pixel-teal text-pixel-bg px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-white transition-colors shadow-lg"
                                >
                                    + Nuevo Producto
                                </button>
                            )}
                        </div>

                        {productMode === 'list' ? (
                            <ProductTable onEdit={handleEditProduct} />
                        ) : (
                            <ProductForm 
                                productToEdit={productToEdit} 
                                onSuccess={handleBackToProductList} 
                                onCancel={handleBackToProductList}
                            />
                        )}
                    </div>
                )}

                {/* SECCIÓN CATEGORÍAS (¡Esta faltaba!) */}
                {activeSection === 'categories' && (
                    <CategoryManagement />
                )}

                {/* SECCIÓN VENTAS */}
                {activeSection === 'orders' && (
                    <OrderManagement />
                )}

            </div>
        </div>
    );
}

export default AdminPage;