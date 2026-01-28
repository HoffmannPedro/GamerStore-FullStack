import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // ✨ NUEVO IMPORT
import api from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import OrderModal from '../components/OrderModal';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // ✨ NUEVO: Para leer la URL que nos manda MercadoPago
    const [searchParams, setSearchParams] = useSearchParams();

    // Estados para formularios
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const { loginWithGoogle } = useAuth();

    // Función de carga de datos (Movida afuera para poder reusarla)
    const loadData = async () => {
        try {
            const [profileData, ordersData] = await Promise.all([
                api.getProfile(),
                api.getMyOrders()
            ]);

            setProfile(profileData);
            setNewName(profileData.username);
            setOrders(ordersData.sort((a, b) => b.id - a.id));
        } catch (error) {
            toast.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ✨ NUEVO EFECTO: Detectar retorno de MercadoPago
    useEffect(() => {
        const status = searchParams.get("collection_status");
        
        if (status) {
            if (status === "approved") {
                toast.success("¡Pago Exitoso! Gracias por tu compra 🎨", {
                    duration: 6000,
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                // Recargamos para ver si la orden ya cambió de estado (si el webhook fue rápido)
                loadData();
            } else if (status === "pending") {
                toast("El pago se está procesando...", { icon: '⏳' });
            } else if (status === "rejected") {
                toast.error("El pago fue rechazado. Intenta con otro medio.");
            }

            // Limpiamos la URL para que quede bonita y no se repita el toast al refrescar
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

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

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.updateProfile({ username: newName });
            setProfile(response.user);
            if (response.token) loginWithGoogle(response.token);
            setIsEditingName(false);
            toast.success("Nombre actualizado");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error("Las contraseñas no coinciden");
        try {
            await api.changePassword(passwords.current, passwords.new);
            toast.success("Contraseña cambiada");
            setIsChangingPassword(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            toast.error("Error: " + error.message);
        }
    };

    const handleOrderUpdate = () => {
        // Reutilizamos loadData para refrescar todo
        loadData();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDIENTE': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            case 'PAGADO': return 'text-green-400 border-green-400/30 bg-green-400/10';
            case 'ENVIADO': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            case 'ENTREGADO': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
            case 'CANCELADO': return 'text-red-400 border-red-400/30 bg-red-400/10';
            default: return 'text-gray-400 border-gray-400/30';
        }
    };

    if (loading) return <Loader text="Cargando perfil..." />;

    return (
        <div className="max-w-4xl mx-auto p-6 mt-8 animate-fade-in"> {/* Agregué animación de entrada */}
            <div className="bg-pixel-card rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden backdrop-blur-sm">

                {/* Header / Portada */}
                <div className="h-32 bg-gradient-to-r from-pixel-teal/70 via-violet-800 to-pixel-bg/80"></div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar Flotante */}
                    <div className="relative -mt-16 mb-8 flex justify-between items-end">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-pixel-card bg-pixel-bg overflow-hidden shadow-xl ring-2 ring-pixel-teal/50">
                                {profile?.profilePictureUrl ? (
                                    <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-pixel-teal select-none bg-black/40">
                                        {profile?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Botón Cámara */}
                            <label className="absolute bottom-1 right-1 bg-pixel-teal text-pixel-bg p-2 rounded-full cursor-pointer hover:bg-white shadow-lg transition-transform hover:scale-110 ring-2 ring-pixel-card">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div className="mb-2">
                            <span className="px-3 py-1 rounded bg-pixel-bg/80 text-pixel-muted text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                {profile?.role}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* COLUMNA IZQUIERDA: DATOS */}
                        <div className="space-y-6 lg:col-span-1">
                            {/* Nombre */}
                            <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xs font-bold text-pixel-muted uppercase tracking-wider">Usuario</h3>
                                    {!isEditingName && (
                                        <button onClick={() => setIsEditingName(true)} className="text-pixel-teal hover:text-white text-[10px] font-bold uppercase transition-colors">Editar</button>
                                    )}
                                </div>
                                {isEditingName ? (
                                    <form onSubmit={handleNameSubmit} className="flex flex-col gap-2">
                                        <input
                                            type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                                            className="bg-pixel-bg border border-white/20 rounded px-2 py-1 text-white text-sm focus:ring-1 focus:ring-pixel-teal outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-pixel-teal text-pixel-bg px-3 py-1 rounded text-xs font-bold hover:bg-white">Guardar</button>
                                            <button type="button" onClick={() => setIsEditingName(false)} className="text-gray-500 text-xs">Cancelar</button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="text-white font-medium truncate">{profile?.username}</p>
                                )}
                            </div>

                            {/* Seguridad */}
                            {profile?.provider === 'LOCAL' && (
                                <div className="bg-black/20 p-5 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xs font-bold text-pixel-muted uppercase tracking-wider">Contraseña</h3>
                                        {!isChangingPassword && (
                                            <button onClick={() => setIsChangingPassword(true)} className="text-pixel-teal hover:text-white text-[10px] font-bold uppercase transition-colors">Cambiar</button>
                                        )}
                                    </div>
                                    {isChangingPassword ? (
                                        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-2">
                                            <input type="password" placeholder="Actual" className="bg-pixel-bg border border-white/20 rounded px-2 py-1 text-white text-sm outline-none" onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                                            <input type="password" placeholder="Nueva" className="bg-pixel-bg border border-white/20 rounded px-2 py-1 text-white text-sm outline-none" onChange={e => setPasswords({ ...passwords, new: e.target.value })} />
                                            <input type="password" placeholder="Repetir" className="bg-pixel-bg border border-white/20 rounded px-2 py-1 text-white text-sm outline-none" onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-pixel-teal text-pixel-bg px-3 py-1 rounded text-xs font-bold hover:bg-white">Actualizar</button>
                                                <button type="button" onClick={() => setIsChangingPassword(false)} className="text-gray-500 text-xs">Cancelar</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="text-gray-500 text-xs tracking-widest">••••••••</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* COLUMNA DERECHA: HISTORIAL DE COMPRAS */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                Historial de Compras
                            </h3>

                            <div className="space-y-4 cursor-pointer">
                                {orders.length > 0 ? (
                                    orders.map(order => (
                                        <div key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-pixel-teal/30 transition-colors group relative overflow-hidden">
                                            
                                            {/* Efecto hover sutil */}
                                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors"></div>

                                            <div className="flex justify-between items-start mb-3 relative z-10">
                                                <div>
                                                    <span className="text-pixel-teal font-mono font-bold text-sm">#{order.id}</span>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        {new Date(order.date).toLocaleDateString()} • {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            {/* Items Resumidos */}
                                            <div className="space-y-2 mb-3 relative z-10">
                                                {order.items.slice(0, 3).map(item => ( // Solo mostramos los primeros 3 para no saturar
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span className="text-gray-300">
                                                            <span className="text-gray-500 font-bold mr-2">{item.quantity}x</span>
                                                            {item.product?.name || "Producto"}
                                                        </span>
                                                        <span className="text-gray-500 font-mono">${item.price.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <p className="text-xs text-gray-500 italic">+ {order.items.length - 3} productos más...</p>
                                                )}
                                            </div>

                                            <div className="border-t border-white/10 pt-3 flex justify-between items-center relative z-10">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">Total Pagado</span>
                                                <span className="text-xl font-mono font-bold text-white">${order.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-black/20 rounded-xl border border-white/5 border-dashed">
                                        <p className="text-gray-500 text-sm">Aún no has realizado compras.</p>
                                        <p className="text-xs text-pixel-teal mt-2">¡Explora la colección!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MODAL */}
                        {selectedOrder && (
                            <OrderModal
                                order={selectedOrder}
                                onClose={() => setSelectedOrder(null)}
                                onOrderUpdated={handleOrderUpdate}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}