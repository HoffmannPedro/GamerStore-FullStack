import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = parseJwt(token);
            // Verificamos que el token sea válido y no haya expirado
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setUser({
                    username: decoded.sub,
                    role: decoded.role,
                    imageUrl: decoded.imageUrl
                });
            } else {
                logout(); // Si expiró, limpiamos
            }
        }
        setLoading(false);
    }, []);

    // LOGIN
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.login(email, password);
            localStorage.setItem('token', token);  // Guardamos el JWT en localStorage

            const decoded = parseJwt(token);

            setUser({
                username: decoded.sub,
                role: decoded.role,
                imageUrl: decoded.imageUrl
            });                 // Estado: Usuario logueado
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    };

    // LOGIN CON GOOGLE
    const loginWithGoogle = (token) => {
        localStorage.setItem('token', token);
        
        const decoded = parseJwt(token);
        if (decoded) {
            setUser({
                username: decoded.sub,
                role: decoded.role,
                imageUrl: decoded.imageUrl
            });
        }
    };

    // REGISTER
    const register = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.register(email, password);
            localStorage.setItem('token', token);
            const decoded = parseJwt(token);
            setUser({ 
                username: decoded.sub,
                role: decoded.role,
            });
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login'; 
    };

    // ESTÁ AUTENTICADO ?
    const isAuthenticated = () => !!localStorage.getItem('token');

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                loginWithGoogle,
                isAuthenticated,
                loading,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Decodifica el payload del JWT (la parte del medio)
function parseJwt (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export const useAuth = () => useContext(AuthContext);