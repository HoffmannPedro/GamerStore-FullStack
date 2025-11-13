import React from 'react'

import { useAuth } from '../contexts/AuthContext';
import { Outlet, Link } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <div>
            {/* NAVBAR */}
            <nav className="bg-secondary text-white p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex space-x-6">
                        <Link to="/" className="px-4 py-2 rounded bg-primary hover:brightness-125 transition duration-100 ease-in">
                            Productos
                        </Link>
                        <Link to="/cart" className="px-4 py-2 rounded bg-primary hover:brightness-125 transition duration-100 ease-in">
                            Carrito
                        </Link>
                    </div>

                    <div>
                        {user ? (
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded bg-primary hover:brightness-125 transition duration-100 ease-in"
                            >
                                 Cerrar sesión {/* ({user.username}) */}
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* CONTENIDO DINÁMICO */}
            <main className="max-w-6xl mx-auto p-6">
                <Outlet />
            </main>
        </div>
    )
}
