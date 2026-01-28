import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import OrderModal from '../OrderModal';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // ✨ MEJORA: useCallback para poder usarlo en el botón y en el intervalo
    const fetchOrders = useCallback(async (showLoader = true) => {
        if (showLoader) setIsRefreshing(true);
        try {
            const data = await api.getAllOrders();
            // Ordenamos: Nuevas primero
            setOrders(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error(error);
            if (showLoader) toast.error("Error de conexión");
        } finally {
            setLoading(false);
            if (showLoader) setIsRefreshing(false);
        }
    }, []);

    // Carga inicial + Auto-Refresh cada 30 segundos
    useEffect(() => {
        fetchOrders(true); // Primera carga visual

        const interval = setInterval(() => {
            fetchOrders(false); // Carga silenciosa en segundo plano
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        const toastId = toast.loading("Actualizando...");
        try {
            await api.updateOrderStatus(orderId, newStatus);
            
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            toast.success(`Estado actualizado`, { id: toastId });
        } catch (error) {
            toast.error("Error al actualizar", { id: toastId });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDIENTE': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
            case 'PAGADO': return 'text-green-400 border-green-500/30 bg-green-500/10'; // Verde más suave
            case 'ENVIADO': return 'text-blue-400 border-blue-500/30 bg-blue-900/20';
            case 'ENTREGADO': return 'text-purple-400 border-purple-500/30 bg-purple-900/20';
            case 'CANCELADO': return 'text-red-400 border-red-500/30 bg-red-900/20';
            default: return 'text-gray-400 border-gray-600 bg-gray-800';
        }
    };

    return (
        <div className="text-white animate-fade-in w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    📊 Gestión de Ventas
                </h3>
                
                {/* ✨ BOTÓN REFRESCAR */}
                <button 
                    onClick={() => fetchOrders(true)} 
                    disabled={isRefreshing}
                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 active:bg-white/10 transition-all flex items-center gap-2 text-pixel-muted hover:text-white"
                >
                    <span className={isRefreshing ? "animate-spin" : ""}>↻</span>
                    {isRefreshing ? "Cargando..." : "Refrescar"}
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin h-8 w-8 border-4 border-pixel-teal border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10 shadow-2xl bg-black/20">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-pixel-muted text-[10px] uppercase tracking-[0.2em] border-b border-white/10 bg-white/5">
                                <th className="p-4 whitespace-nowrap">ID</th>
                                <th className="p-4 whitespace-nowrap">Fecha</th>
                                <th className="p-4 whitespace-nowrap">Cliente</th>
                                <th className="p-4 whitespace-nowrap">Total</th>
                                <th className="p-4 text-center whitespace-nowrap">Estado Actual</th>
                                <th className="p-4 text-center whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group text-sm">
                                    <td className="p-4 font-mono text-pixel-teal/80">#{order.id}</td>
                                    <td className="p-4 text-gray-400">
                                        {new Date(order.date).toLocaleDateString()} <span className="text-xs opacity-50">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-200">{order.user?.username || 'Invitado'}</div>
                                        <div className="text-xs text-gray-500 font-mono">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4 font-bold font-mono text-white">
                                        ${order.total.toLocaleString()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-md text-[10px] font-bold border outline-none cursor-pointer transition-all hover:brightness-110 focus:ring-1 focus:ring-white/50 text-center uppercase tracking-wider ${getStatusColor(order.status)}`}
                                                style={{ backgroundImage: 'none' }} // Hack para quitar flecha nativa si molesta
                                            >
                                                <option value="PENDIENTE" className="bg-gray-900">Pendiente</option>
                                                <option value="PAGADO" className="bg-gray-900">Pagado</option>
                                                <option value="ENVIADO" className="bg-gray-900">Enviado</option>
                                                <option value="ENTREGADO" className="bg-gray-900">Entregado</option>
                                                <option value="CANCELADO" className="bg-gray-900">Cancelado</option>
                                            </select>
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-xs font-bold bg-pixel-teal text-pixel-bg px-4 py-2 rounded shadow-lg shadow-pixel-teal/20 hover:bg-white hover:scale-105 transition-all"
                                        >
                                            VER DETALLES
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {orders.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p>No hay ventas registradas aún.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}