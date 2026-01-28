import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaRegEye} from "react-icons/fa6";
import { LuEyeClosed } from "react-icons/lu";

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden ❌");
            return;
        }
        await register(formData.email, formData.password);
        navigate('/');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-pixel-card rounded-2xl shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-center mb-8 text-pixel-text tracking-tight font-montserrat">
                    Únete a la <span className="text-pixel-teal">Comunidad</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-pixel-muted mb-2 text-xs font-bold uppercase tracking-widest">Correo Electrónico</label>
                        <input
                            type="email" name="email"
                            value={formData.email} onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-pixel-bg text-pixel-text border border-gray-600 focus:ring-2 focus:ring-pixel-teal focus:border-transparent outline-none transition-all placeholder-gray-500"
                            placeholder="tu@email.com" required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-pixel-muted mb-2 text-xs font-bold uppercase tracking-widest">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"} name="password"
                            value={formData.password} onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-pixel-bg text-pixel-text border border-gray-600 focus:ring-2 focus:ring-pixel-teal outline-none transition-all pr-10"
                            placeholder="••••••••" required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-white">
                            {showPassword ? <FaRegEye className='mt-1 w-5 h-5' /> : <LuEyeClosed className='mt-1 w-5 h-5' />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-pixel-muted mb-2 text-xs font-bold uppercase tracking-widest">Confirmar Contraseña</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                            value={formData.confirmPassword} onChange={handleChange}
                            className={`w-full p-3 rounded-lg bg-pixel-bg text-pixel-text border outline-none transition-all pr-10 ${
                                formData.confirmPassword && formData.password !== formData.confirmPassword
                                ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-pixel-teal'
                            }`}
                            placeholder="Repite la contraseña" required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-400 hover:text-white">
                            {showConfirmPassword ? <FaRegEye className='mt-1 w-5 h-5' /> : <LuEyeClosed className='mt-1 w-5 h-5' />}
                        </button>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-pixel-teal to-pixel-purple text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:brightness-110 transform hover:-translate-y-0.5"
                    >
                        {loading ? 'Creando cuenta...' : 'CREAR CUENTA'}
                    </button>
                </form>

                <p className="mt-8 text-center text-pixel-muted text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-pixel-teal hover:text-pixel-purple transition-colors font-bold underline decoration-2 underline-offset-4">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}