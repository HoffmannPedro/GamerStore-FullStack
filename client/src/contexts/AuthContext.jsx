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
            setUser({ username });  // o pedir info al backend
        }
    }, []);

    // LOGIN
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const token = await api.login(username, password);
            localStorage.setItem('token', token);  // Guardamos el JWT en localStorage
            localStorage.setItem('username', username);
            setUser({ username });                 // Estado: Usuario logueado
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
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
                isAuthenticated,
                loading,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);