import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            const decoded = parseJwt(token);

            if (decoded.exp * 1000 < Date.now()) {
                logout();
            } else {
                setUser({
                    username: decoded.sub,
                    role: decoded.role
                });
            }
        }
        setLoading(false);
    }, []);

    // LOGIN
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.login(username, password);
            localStorage.setItem('token', token);  // Guardamos el JWT en localStorage
            localStorage.setItem('username', username);

            const decoded = parseJwt(token);

            setUser({
                username: decoded.sub,
                role: decoded.role
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
                role: decoded.role
            });
        }
    };

    // REGISTER
    const register = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.register(username, password);
            localStorage.setItem('token', token);
            setUser({ username});
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = () => {
        console.log("Cerrando sesión...");
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
        console.log("Sesión cerrada");
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