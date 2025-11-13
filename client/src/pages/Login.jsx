import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login()  {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login (username, password);
        if (success) {
            login(username);
            navigate('/');  // Redirige a la página principal tras login exitoso
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-center mb.6">Iniciar Sesión</h2>

            {error && (
                <p className="text-red-600 text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label  className="block text-gray-700 mb-1">Usuario</label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                    />
                </div>

                <div className="mb-6">
                    <label  className="block text-gray-700 mb-1">Contraseña</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                ¿No tenés cuenta?{' '}
                <Link to='/register' className="text-blue-600 hover:underline">
                    Registrate
                </Link>
            </p>
        </div>
    )
}