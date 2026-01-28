import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye} from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    // --- LÓGICA DE GOOGLE (INTACTA) ---
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
    const backendUrl = apiUrl.replace(/\/api$/, '');
    const googleLoginUrl = `${backendUrl}/oauth2/authorization/google`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            {/* Tarjeta con estilo PixelArt Luxury */}
            <div className="w-full max-w-md p-8 bg-pixel-card rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-white/10 backdrop-blur-sm">
                
                <h2 className="text-3xl font-bold text-center mb-8 text-pixel-text tracking-tight font-montserrat">
                    Bienvenido
                </h2>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-pixel-muted mb-2 text-xs font-bold uppercase tracking-widest">Correo Electrónico</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-3 rounded-lg bg-pixel-bg text-pixel-text border border-gray-600 focus:ring-2 focus:ring-pixel-teal focus:border-transparent outline-none transition-all placeholder-gray-500'
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-pixel-muted mb-2 text-xs font-bold uppercase tracking-widest">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 rounded-lg bg-pixel-bg text-pixel-text border border-gray-600 focus:ring-2 focus:ring-pixel-teal focus:border-transparent outline-none transition-all pr-10 placeholder-gray-500'
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <FaRegEye className='mt-1 w-5 h-5' /> : <LuEyeClosed className='mt-1 w-5 h-5' />}
                        </button>
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pixel-teal to-pixel-teal/80 hover:to-pixel-purple text-slate-200 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-pixel-teal/20 transform hover:-translate-y-0.5"
                    >
                        {loading ? 'Ingresando...' : 'INICIAR SESIÓN'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                        <span className="px-4 bg-pixel-card text-gray-400">O accede con</span>
                    </div>
                </div>

                {/* BOTÓN DE GOOGLE ESTILIZADO */}
                <a
                    href={googleLoginUrl}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-0.5"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </a>

                <p className="mt-8 text-center text-pixel-muted text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link to='/register' className="text-pixel-teal hover:text-pixel-purple transition-colors font-bold underline decoration-2 underline-offset-4">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}