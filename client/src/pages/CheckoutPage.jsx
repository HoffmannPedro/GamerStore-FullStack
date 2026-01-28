import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initMercadoPago, Payment, Wallet } from '@mercadopago/sdk-react';
import toast from 'react-hot-toast';
import { FaCreditCard } from "react-icons/fa";
import api from '../services/api';

// TU PUBLIC KEY
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

export default function CheckoutPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('DIRECT'); // 'DIRECT' | 'WALLET'

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Cargar la orden
                const orderData = await api.getOrderById(orderId);
                setOrder(orderData);

                // 2. Generar la preferencia para el botón de MP (Wallet)
                try {
                    const prefId = await api.createPreference(orderId);
                    setPreferenceId(prefId);
                } catch (err) {
                    console.error("No se pudo generar el botón de MP", err);
                }

            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("Error al cargar la orden.");
                navigate('/cart');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) loadData();
    }, [orderId, navigate]);

    // --- CONFIGURACIÓN 1: PAGO DIRECTO (Brick de Tarjeta) ---
    const directInitialization = {
        amount: order ? order.total : 0,
        payer: { email: 'test_user_123@testuser.com' },
    };

    const directCustomization = {
        paymentMethods: {
            ticket: "all",
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
        },
        visual: {
            style: {
                theme: 'dark',
                customVariables: {
                    baseColor: '#A4D8D8',
                    formBackgroundColor: '#1a1a1a',
                    inputBackgroundColor: '#333333',
                    successColor: '#00A650',
                    errorColor: '#FF4444',
                }
            }
        }
    };

    const onDirectSubmit = async ({ selectedPaymentMethod, formData }) => {
        return new Promise((resolve, reject) => {
            const payload = {
                ...formData,
                orderId: orderId,
                transactionAmount: order.total,
                description: `Orden #${orderId}`,
                payer: { email: formData.payer.email || 'email@test.com' }
            };

            api.processPayment(payload)
                .then((response) => {
                    if (response.status === 'approved' || response.status === 'in_process') {
                        resolve();
                        toast.success("¡Pago procesado!");
                        navigate('/profile');
                    } else {
                        resolve();
                        toast.error(`Pago rechazado: ${response.status_detail}`);
                    }
                })
                .catch((error) => {
                    reject();
                    toast.error("Error de conexión");
                });
        });
    };

    // --- CONFIGURACIÓN 2: BOTÓN MP (Wallet) ---
    // NOTA: Wallet permite menos personalización visual que Payment
    const walletCustomization = {
        visual: {
            // Puedes probar 'valueProp' para cambiar el texto secundario
        },
        texts: {
            action: 'pay', // Dice "Pagar"
        },
    };

    if (loading) return <div className="text-center text-white mt-20 animate-pulse">Cargando checkout...</div>;
    if (!order) return null;

    return (
        <div className="max-w-6xl mx-auto p-6 mt-10 pb-20 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-widest uppercase">
                Finalizar <span className="text-pixel-teal">Compra</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- IZQUIERDA: RESUMEN (Fijo) --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-pixel-card p-6 rounded-xl border border-white/10 shadow-lg sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">
                            Tu Pedido
                        </h3>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm text-gray-300">
                                    <span>{item.quantity}x {item.product.name}</span>
                                    <span className="text-white font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                            <span>Total:</span>
                            <span className="text-pixel-teal">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* --- DERECHA: PESTAÑAS DE PAGO --- */}
                <div className="lg:col-span-2">

                    {/* Selector de Pestañas */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('DIRECT')}
                            className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${activeTab === 'DIRECT'
                                ? 'bg-pixel-teal/20 border-pixel-teal text-pixel-teal'
                                : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            <span className="text-5xl text-pixel-text"><FaCreditCard /></span>
                            <span className="text-md text-pixel-text">Tarjeta</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('WALLET')}
                            className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${activeTab === 'WALLET'
                                ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            <span className="w-32 sm:w-48"><img src="/logo-mp-horizontal-pluma.png" alt="" /></span>
                        </button>
                    </div>

                    {/* Contenedor del Método de Pago */}
                    <div className="bg-slate-300 p-1 rounded-2xl shadow-2xl overflow-hidden min-h-[400px]">

                        {/* 1. FORMULARIO DIRECTO */}
                        {activeTab === 'DIRECT' && (
                            <div className="p-4 animate-slide-up">
                                <div className="mb-2 text-center">
                                    <p className="text-gray-800 text-xs uppercase tracking-widest font-bold">Pago rápido y seguro</p>
                                </div>
                                <Payment
                                    initialization={directInitialization}
                                    customization={directCustomization}
                                    onSubmit={onDirectSubmit}
                                />
                            </div>
                        )}

                        {/* 2. BOTÓN REDIRECCIÓN (WALLET) */}
                        {activeTab === 'WALLET' && (
                            <div className="flex flex-col items-center justify-center h-full py-20 animate-slide-up px-6 text-center bg-slate-300">
                                {/* LOGO CORREGIDO */}
                                <img
                                    src="/logo-mp.png"
                                    alt="Mercado Pago"
                                    className="h-24 w-40 object-cover"
                                />
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">Pagar con Mercado Pago</h3>
                                <p className="text-gray-800 mb-8 max-w-md">
                                    Usa dinero en cuenta, tarjetas guardadas o genera cupón de pago (Rapipago/PagoFácil). Serás redirigido al sitio oficial.
                                </p>

                                {preferenceId ? (
                                    <div className="w-full max-w-xs transform hover:scale-105 transition-transform duration-200">
                                        <Wallet
                                            initialization={{ preferenceId: preferenceId }}
                                            customization={walletCustomization}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-blue-500 font-bold">
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        Generando link...
                                    </div>
                                )}

                                <p className="mt-8 text-xs text-gray-800">
                                    🔒 Transacción protegida por Mercado Pago Standard.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}