import { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estados para formularios
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const { loginWithGoogle } = useAuth();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await api.getProfile();
            setProfile(data);
            setNewName(data.username);
        } catch (error) {
            toast.error("Error al cargar perfil");
        } finally {
            setLoading(false);
        }
    };

    // Subir Foto
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Actualizando foto...");
        try {
            const updatedUser = await api.updateProfilePicture(file);
            setProfile(updatedUser);
            toast.success("¡Foto actualizada!", { id: toastId });
        } catch (error) {
            toast.error("Error al subir imagen", { id: toastId });
        }
    };

    // Cambiar Nombre
    const handleNameSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.updateProfile({ username: newName });
            
            // 1. Actualizar datos en pantalla
            setProfile(response.user);
            
            // 2. Si hay token nuevo, actualizamos el contexto global
            if (response.token) {
                // Usamos la función del contexto para actualizar todo (LS + Estado de usuario)
                loginWithGoogle(response.token); 
            }

            setIsEditingName(false);
            toast.success("Nombre actualizado");
            
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Cambiar Contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return toast.error("Las contraseñas nuevas no coinciden");
        }
        try {
            await api.changePassword(passwords.current, passwords.new);
            toast.success("Contraseña cambiada correctamente");
            setIsChangingPassword(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            toast.error("Error: " + error.message);
        }
    };

    if (loading) return <Loader text="Cargando perfil..." />;

    return (
        <div className="max-w-3xl mx-auto p-6 mt-8">
            <div className="bg-terciary rounded-2xl shadow-2xl ring-1 ring-gray-700 overflow-hidden">
                
                {/* Header / Portada */}
                <div className="h-32 bg-gradient-to-r from-green-900 to-gray-900"></div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar Flotante */}
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-terciary bg-gray-800 overflow-hidden shadow-xl">
                                {profile.profilePictureUrl ? (
                                    <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-500 select-none">
                                        {profile.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            
                            {/* Botón de Cámara (Overlay) */}
                            <label className="absolute bottom-0 right-0 bg-btnGreen p-2 rounded-full cursor-pointer hover:brightness-110 shadow-lg transition-transform hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div className="mb-2">
                            <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-bold uppercase tracking-widest border border-gray-600">
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    {/* Sección de Datos */}
                    <div className="space-y-8">
                        
                        {/* 1. Nombre de Usuario */}
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Información Personal</h3>
                                {!isEditingName && (
                                    <button onClick={() => setIsEditingName(true)} className="text-btnGreen hover:underline text-sm font-medium">
                                        Editar Nombre
                                    </button>
                                )}
                            </div>
                            
                            {isEditingName ? (
                                <form onSubmit={handleNameSubmit} className="flex gap-3">
                                    <input 
                                        type="text" 
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-btnGreen outline-none"
                                    />
                                    <button type="submit" className="bg-btnGreen text-white px-4 py-2 rounded hover:brightness-110">Guardar</button>
                                    <button type="button" onClick={() => setIsEditingName(false)} className="text-gray-400 hover:text-white px-3">Cancelar</button>
                                </form>
                            ) : (
                                <p className="text-gray-300 text-lg">{profile.username}</p>
                            )}
                        </div>

                        {/* 2. Seguridad (Contraseña) - Solo si es LOCAL */}
                        {profile.provider === 'LOCAL' && (
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-white">Seguridad</h3>
                                    {!isChangingPassword && (
                                        <button onClick={() => setIsChangingPassword(true)} className="text-btnGreen hover:underline text-sm font-medium">
                                            Cambiar Contraseña
                                        </button>
                                    )}
                                </div>

                                {isChangingPassword && (
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                                        <input 
                                            type="password" placeholder="Contraseña Actual" required
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-btnGreen outline-none"
                                            onChange={e => setPasswords({...passwords, current: e.target.value})}
                                        />
                                        <input 
                                            type="password" placeholder="Nueva Contraseña" required
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-btnGreen outline-none"
                                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                                        />
                                        <input 
                                            type="password" placeholder="Repetir Nueva Contraseña" required
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-btnGreen outline-none"
                                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                        />
                                        <div className="flex gap-3 pt-2">
                                            <button type="submit" className="bg-btnGreen text-white px-4 py-2 rounded hover:brightness-110">Actualizar Clave</button>
                                            <button type="button" onClick={() => setIsChangingPassword(false)} className="text-gray-400 hover:text-white px-3">Cancelar</button>
                                        </div>
                                    </form>
                                )}
                                {!isChangingPassword && <p className="text-gray-500 text-sm">••••••••••••••</p>}
                            </div>
                        )}

                        {/* Aviso para usuarios Google */}
                        {profile.provider === 'GOOGLE' && (
                            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg flex items-center gap-3 text-blue-200 text-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                                Tu cuenta está gestionada por Google. La contraseña y la foto (si no la cambias aquí) provienen de allí.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}