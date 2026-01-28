/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext'; // ✨ Importamos Auth

export default function OrderModal({ order, onClose, onOrderUpdated }) {
    if (!order) return null;

    const navigate = useNavigate();
    const { user } = useAuth(); // ✨ Obtenemos usuario
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Detectamos si es admin para ocultar botones de pago
    const isAdmin = user?.role === 'ADMIN';

    // Bloquear el scroll del body
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // --- ACCIONES ---
    const handlePayNow = () => {
        onClose();
        navigate(`/checkout/${order.id}`);
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("¿Estás seguro que quieres cancelar esta compra?")) return;

        setIsProcessing(true);
        try {
            await api.updateOrderStatus(order.id, 'CANCELADO');
            toast.success("Orden cancelada correctamente");

            if (onOrderUpdated) onOrderUpdated();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo cancelar la orden");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDIENTE': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'PAGADO': return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'ENVIADO': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'ENTREGADO': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
            case 'CANCELADO': return 'bg-red-500/20 text-red-300 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-pixel-card border border-white/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">

                {/* --- HEADER --- */}
                <div className="sticky top-0 bg-pixel-card/95 backdrop-blur border-b border-white/10 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            🧾 Orden #{order.id}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Realizada el {formatDate(order.date)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* --- BODY (Scrollable) --- */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">

                    {/* COLUMNA IZQUIERDA: ITEMS */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold text-pixel-teal uppercase tracking-widest border-b border-white/10 pb-2">
                            Productos ({order.items?.length || 0})
                        </h3>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex gap-4 bg-black/20 p-3 rounded-lg border border-white/5">
                                    <img
                                        src={item.product?.imageUrl || "/placeholder.png"}
                                        alt={item.product?.name}
                                        className="w-16 h-16 object-cover rounded border border-white/10"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-white">{item.product?.name || "Producto Eliminado"}</p>
                                        <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-pixel-text">${item.price}</p>
                                        <p className="text-xs text-gray-500">Unitario</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: INFO Y TOTALES */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Estado</h3>
                            <span className={`px-3 py-1 rounded border text-xs font-bold ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        {order.user && (
                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h3 className="text-xs font-bold text-pixel-teal uppercase mb-2">Cliente</h3>
                                <p className="text-sm text-white font-bold">{order.user.username}</p>
                                <p className="text-xs text-gray-300">{order.user.email}</p>
                            </div>
                        )}

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h3 className="text-xs font-bold text-pixel-teal uppercase mb-2">Logística</h3>
                            <div className="mb-3">
                                <p className="text-xs text-gray-300 uppercase">Método</p>
                                <p className="text-sm text-white font-bold">
                                    {order.deliveryMethod === 'ENVIO' ? '🛵 Envío a Domicilio' : '🏢 Retiro en Local'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-300 uppercase">Dirección / Detalle</p>
                                <p className="text-sm text-gray-200 bg-black/30 p-2 rounded mt-1 border border-white/5">
                                    {order.shippingAddress || "Sin dirección especificada"}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold uppercase">Total</span>
                                <span className="text-3xl font-bold text-white font-mono">
                                    ${order.total}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER (Acciones) --- */}
                <div className="p-6 bg-black/20 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-4 items-center">
                    
                    {/* ✨ LÓGICA MEJORADA: Solo mostrar si es el dueño (NO admin) y está pendiente */}
                    {order.status === 'PENDIENTE' && !isAdmin && (
                        <>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isProcessing}
                                className="text-red-400 hover:text-red-300 text-sm font-bold uppercase tracking-wide hover:underline disabled:opacity-50"
                            >
                                {isProcessing ? 'Cancelando...' : 'Cancelar Orden'}
                            </button>

                            <button
                                onClick={handlePayNow}
                                className="bg-pixel-teal text-black px-6 py-2 rounded-lg font-bold uppercase shadow-lg shadow-pixel-teal/20 hover:bg-white transition-all transform hover:-translate-y-1"
                            >
                                Pagar Ahora
                            </button>
                        </>
                    )}

                    {/* Botón para Admin (Opcional, solo cerrar) */}
                    {isAdmin && (
                        <span className="text-xs text-gray-500 uppercase tracking-widest mr-auto">
                            Vista de Administrador
                        </span>
                    )}

                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white font-bold text-sm uppercase md:hidden"
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>,
        document.getElementById('modal-root')
    );
}