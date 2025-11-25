import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-terciary rounded-xl shadow-2xl ring-1 ring-gray-700">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Bienvenido de nuevo</h2>

                {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Usuario</label>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
                            placeholder="Tu usuario"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10'
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    ¿No tenés cuenta?{' '}
                    <Link to='/register' className="text-blue-400 hover:underline font-semibold">
                        Registrate
                    </Link>
                </p>
            </div>
        </div>
    )
}