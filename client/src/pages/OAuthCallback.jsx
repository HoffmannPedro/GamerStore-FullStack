import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const processed = useRef(false); // Para evitar doble ejecución en React StrictMode

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const token = searchParams.get('token');
        
        if (token) {
            loginWithGoogle(token);
            toast.success("¡Autenticado con Google! 🚀");
            navigate('/');
        } else {
            toast.error("Error al iniciar sesión con Google");
            navigate('/login');
        }
    }, [searchParams, loginWithGoogle, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <div className="text-white animate-pulse">Procesando ingreso... 🔄</div>
        </div>
    );
}

export default OAuthCallback;