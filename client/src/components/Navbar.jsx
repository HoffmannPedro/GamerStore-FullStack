import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Footer from './Footer';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const location = useLocation();

    // Estado para el menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-pixel-teal font-bold drop-shadow-sm"
            : "text-pixel-muted hover:text-pixel-text transition-colors";
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex flex-col min-h-screen">
            <nav className="sticky top-0 z-40 w-full bg-pixel-card/90 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* 1. IZQUIERDA: LOGO + HAMBURGUESA */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-pixel-muted hover:text-pixel-teal focus:outline-none transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>

                            <Link to="/" className="flex items-center gap-2 sm:gap-3 group font-good" onClick={closeMenu}>
                                <span className="w-12 sm:w-20 filter drop-shadow-lg transition-all">
                                    <img src="/logo-sin-fondo.png" alt="logo" />
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-xl font-ethno tracking-widest sm:tracking-[0.25em] text-white brightness-75 transition-all duration-500 group-hover:scale-110 group-hover:brightness-150">
                                        GamerStore
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* 2. CENTRO: LINKS (Solo Desktop) */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={`text-sm tracking-wide ${isActive('/')}`}>
                                COLECCIÓN
                            </Link>
                            {user && user.role === 'ADMIN' && (
                                <Link to="/admin" className={`flex items-center gap-1 text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 hover:opacity-80 transition-opacity`}>
                                    <span>🛡️</span> PANEL ADMIN
                                </Link>
                            )}
                        </div>

                        {/* 3. DERECHA: CARRITO + PERFIL */}
                        <div className="flex items-center gap-2 sm:gap-6">
                            {/* Carrito */}
                            <Link to="/cart" className="relative group p-1" onClick={closeMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pixel-muted group-hover:text-pixel-teal transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-pixel-purple text-white text-[9px] sm:text-[10px] font-bold h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-pixel-purple/50">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                            {/* PERFIL */}
                            {user ? (
                                <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-transparent md:border-white/10">
                                    <Link to="/profile" className="group flex items-center gap-3 hover:bg-white/5 p-1 rounded-full transition-all" onClick={closeMenu}>
                                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border border-pixel-teal/50 group-hover:border-pixel-teal shadow-lg shadow-pixel-teal/10 transition-all relative bg-pixel-bg">
                                            {user.imageUrl ? (
                                                <img src={user.imageUrl} alt={user.username} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-pixel-teal font-bold text-xs sm:text-sm">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="hidden md:flex flex-col items-start">
                                            <p className="text-sm font-bold text-pixel-text leading-none group-hover:text-pixel-teal transition-colors">{user.username}</p>
                                            <span className="text-[9px] font-bold text-pixel-muted/70 uppercase tracking-widest">{user.role}</span>
                                        </div>
                                    </Link>

                                    {/* LOGOUT (SOLO DESKTOP) */}
                                    <button 
                                        onClick={logout} 
                                        className="hidden md:block p-2 text-pixel-muted hover:text-red-400 hover:bg-red-900/10 rounded-full transition-all"
                                        title="Cerrar Sesión"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link to="/login" className="hidden sm:block text-xs font-bold text-pixel-muted hover:text-pixel-text uppercase tracking-widest">Ingresar</Link>
                                    <Link to="/register" className="text-[10px] sm:text-xs font-bold bg-pixel-teal text-slate-200 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full hover:bg-white hover:text-black transition-all shadow-lg tracking-wide">
                                        REGISTRO
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-pixel-card border-t border-white/10 animate-fade-in shadow-2xl">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {user && (
                                <div className="flex items-center justify-between px-3 py-3 mb-4 bg-pixel-bg/50 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-pixel-teal/20 text-pixel-teal flex items-center justify-center font-bold border border-pixel-teal/30">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-pixel-text text-sm font-bold">Hola, {user.username}</p>
                                            <Link to="/profile" onClick={closeMenu} className="text-xs text-pixel-teal hover:underline">Ver perfil</Link>
                                        </div>
                                    </div>
                                    
                                    {/* LOGOUT (SOLO MÓVIL - DENTRO DEL MENÚ) */}
                                    <button 
                                        onClick={() => { logout(); closeMenu(); }} 
                                        className="text-red-400 text-xs font-bold border border-red-900/30 bg-red-900/10 px-3 py-1.5 rounded hover:bg-red-900/20 flex items-center gap-1"
                                    >
                                        <span>Salir</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            
                            <Link to="/" onClick={closeMenu} className={`block px-3 py-3 rounded-lg text-sm font-bold ${isActive('/')} hover:bg-white/5`}>COLECCIÓN</Link>
                            <Link to="/cart" onClick={closeMenu} className="block px-3 py-3 rounded-lg text-sm font-bold text-pixel-muted hover:text-pixel-text hover:bg-white/5">TU CARRITO ({totalItems})</Link>
                            {user && user.role === 'ADMIN' && (
                                <Link to="/admin" onClick={closeMenu} className="block px-3 py-3 rounded-lg text-sm font-bold text-yellow-200 border border-yellow-500/20">🛡️ PANEL ADMIN</Link>
                            )}
                            
                            {!user && (
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <Link to="/login" onClick={closeMenu} className="text-center py-2 rounded-lg border border-gray-600 text-pixel-muted font-bold text-sm">Ingresar</Link>
                                    <Link to="/register" onClick={closeMenu} className="text-center py-2 rounded-lg bg-pixel-teal text-pixel-bg font-bold text-sm">Registrarse</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-grow w-full">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}