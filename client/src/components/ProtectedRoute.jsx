import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    // 1. Mientras verificamos el token, mostramos un loader
    if (loading) return <Loader text="Verificando permisos..." />;

    // 2. Si no está logueado, lo mandamos al login
    if (!isAuthenticated() && !user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si tiene rol, pero no es el permitido (ej: User intentando entrar a Admin)
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Lo mandamos al Home
    }

    // 4. Si pasa todo, mostramos la ruta solicitada (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;