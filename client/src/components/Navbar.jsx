import { useState } from 'react'; // <--- Importar useState
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const location = useLocation();
    
    // Estado para el menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const isActive = (path) => {
        return location.pathname === path 
            ? "text-btnGreen font-bold" 
            : "text-gray-400 hover:text-white transition-colors";
    };

    // Función para cerrar menú al hacer clic en un link
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="sticky top-0 z-40 w-full bg-terciary/95 backdrop-blur-md border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        
                        {/* 1. IZQUIERDA: LOGO + HAMBURGUESA */}
                        <div className="flex items-center gap-4">
                            {/* Botón Hamburguesa (Solo Móvil) */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> // X
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> // Hamburguesa
                                    )}
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                                <span className="text-2xl group-hover:rotate-12 transition-transform">🎮</span>
                                <span className="text-xl font-extrabold text-white tracking-tight group-hover:text-btnGreen transition-colors">
                                    Gamer<span className="text-btnGreen">Store</span>
                                </span>
                            </Link>
                        </div>

                        {/* 2. CENTRO: LINKS (Solo Desktop) */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={`text-sm ${isActive('/')}`}>
                                Productos
                            </Link>
                            {user && user.role === 'ADMIN' && (
                                <Link to="/admin" className={`flex items-center gap-1 text-sm ${isActive('/admin')}`}>
                                    <span>🛡️</span> Admin
                                </Link>
                            )}
                        </div>

                        {/* 3. DERECHA: CARRITO + PERFIL */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            
                            {/* Carrito */}
                            <Link to="/cart" className="relative group" onClick={closeMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-btnGreen text-black text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-green-500/50">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* Separador (Solo Desktop) */}
                            <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>

                            {/* User / Login */}
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-white leading-none">{user.username}</p>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                                            {user.role}
                                        </span>
                                    </div>
                                    <button onClick={logout} className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                        Ingresar
                                    </Link>
                                    <Link to="/register" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-transform hover:scale-105 shadow-lg">
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
                {/* Solo visible cuando isMobileMenuOpen es true y en pantallas chicas (md:hidden) */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-terciary border-t border-gray-800 animate-fade-in">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {user && (
                                <div className="px-3 py-2 text-gray-500 text-xs uppercase font-bold tracking-widest border-b border-gray-700 mb-2">
                                    Hola, {user.username}
                                </div>
                            )}
                            
                            <Link 
                                to="/" 
                                onClick={closeMenu}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
                            >
                                Productos
                            </Link>

                            <Link 
                                to="/cart" 
                                onClick={closeMenu}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                            >
                                Carrito ({totalItems})
                            </Link>

                            {user && user.role === 'ADMIN' && (
                                <Link 
                                    to="/admin" 
                                    onClick={closeMenu}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin')}`}
                                >
                                    🛡️ Panel Admin
                                </Link>
                            )}

                            {!user && (
                                <Link 
                                    to="/login" 
                                    onClick={closeMenu}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-grow w-full">
                <Outlet />
            </main>
            
            <footer className="bg-terciary border-t border-gray-800 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2025 GamerStore. Desarrollado por Pedro Hoffmann.</p>
                </div>
            </footer>
        </div>
    );
}