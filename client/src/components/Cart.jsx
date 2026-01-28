/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

function Cart() {
    const { cartItems, addToCart, removeOne, removeFromCart, clearCart, loading, error } = useCart();
    const navigate = useNavigate();

    // --- ESTADOS DE LOGÍSTICA ---
    const [deliveryMethod, setDeliveryMethod] = useState('RETIRO'); // 'RETIRO' | 'ENVIO'

    // Estado unificado para el formulario de envío
    const [shippingData, setShippingData] = useState({
        street: '',
        number: '',
        floor: '', // Opcional
        city: '',
        zipCode: '',
        province: 'Buenos Aires' // Valor por defecto o vacío
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        // Validación Lógica
        if (deliveryMethod === 'ENVIO') {
            if (!shippingData.street || !shippingData.number || !shippingData.city || !shippingData.zipCode) {
                toast.error("Por favor completa los campos obligatorios del envío 📝");
                return;
            }
        }

        const toastId = toast.loading("Procesando orden...");
        try {
            // 1. Formatear la dirección para el Backend
            // El backend espera un String único, así que lo armamos bonito aquí.
            let finalAddress = 'Retiro en Local';

            if (deliveryMethod === 'ENVIO') {
                finalAddress = `${shippingData.street} ${shippingData.number}`;
                if (shippingData.floor) finalAddress += ` (Piso/Depto: ${shippingData.floor})`;
                finalAddress += `, ${shippingData.city}, ${shippingData.province} - CP: ${shippingData.zipCode}`;
            }

            // 2. Preparamos el objeto para la API
            const orderData = {
                deliveryMethod: deliveryMethod,
                shippingAddress: finalAddress
            };

            // 3. Enviamos
            const response = await api.createOrder(orderData);
            const order = response.order;

            await clearCart();
            toast.success("¡Orden creada!", { id: toastId });

            navigate(`/checkout/${order.id}`);

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error al procesar", { id: toastId });
        }
    };

    // Calcular total
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <div className="max-w-6xl mx-auto p-6 mt-10 pb-20 text-white animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center tracking-widest uppercase">
                Tu <span className="text-pixel-teal">Carrito</span>
            </h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-black/20 rounded-xl border border-white/5">
                    <p className="text-xl text-gray-400 mb-6">Tu inventario está vacío.</p>
                    <Link to="/" className="inline-block bg-pixel-teal text-slate-200 px-8 py-3 rounded-lg font-bold hover:brightness-125 transition-colors">
                        VOLVER A LA TIENDA
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LISTA DE ITEMS (Izquierda) --- */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-pixel-card p-6 rounded-xl border border-white/10 shadow-lg">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex flex-col sm:flex-row items-center gap-4 mb-6 last:mb-0 border-b border-white/5 last:border-0 pb-6 last:pb-0">
                                    <img
                                        src={item.product.imageUrl || "/placeholder.png"}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg border border-white/10"
                                    />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-lg text-white">{item.product.name}</h3>
                                        <p className="text-pixel-teal font-mono">${item.product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/10">
                                        <button onClick={() => removeOne(item.product.id)} className="w-8 h-8 text-2xl flex items-center justify-center hover:bg-btnRed/70 rounded text-white">-</button>
                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                        <button onClick={() => addToCart(item.product)} className="w-8 h-8 text-xl flex items-center justify-center hover:bg-btnGreen/80 rounded text-white">+</button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="text-red-500 hover:text-red-400 p-2 opacity-60 hover:opacity-100 transition-opacity"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- SIDEBAR: ENVÍO Y TOTAL (Derecha) --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* 1. SELECCIÓN DE ENVÍO */}
                        <div className="bg-pixel-card p-6 rounded-xl border border-white/10 shadow-lg">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                Método de Entrega 🚚
                            </h3>

                            {/* Switches de Selección */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setDeliveryMethod('RETIRO')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-all ${deliveryMethod === 'RETIRO'
                                        ? 'bg-pixel-teal text-slate-50 border-pixel-teal'
                                        : 'bg-transparent border-white/20 text-gray-400 hover:border-white/50'
                                        }`}
                                >
                                    Retiro
                                </button>
                                <button
                                    onClick={() => setDeliveryMethod('ENVIO')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-all ${deliveryMethod === 'ENVIO'
                                        ? 'bg-pixel-teal text-black border-pixel-teal'
                                        : 'bg-transparent border-white/20 text-gray-400 hover:border-white/50'
                                        }`}
                                >
                                    Envío
                                </button>
                            </div>

                            {/* --- FORMULARIO DE ENVÍO --- */}
                            {deliveryMethod === 'ENVIO' && (
                                <div className="space-y-3 animate-slide-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="text-xs uppercase text-gray-200 font-bold ml-1">Calle</label>
                                            <input type="text" name="street" placeholder="Ej: Av. Siempreviva"
                                                value={shippingData.street} onChange={handleInputChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white text-sm outline-none focus:border-pixel-teal"
                                            />
                                        </div>
                                        <div className="sm:col-span-1">
                                            <label className="text-xs uppercase text-gray-200 font-bold ml-1">Altura</label>
                                            <input type="text" name="number" placeholder="123"
                                                value={shippingData.number} onChange={handleInputChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white text-sm outline-none focus:border-pixel-teal"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs uppercase text-gray-200 font-bold ml-1">Piso/Depto</label>
                                            <input type="text" name="floor" placeholder="(Opcional)"
                                                value={shippingData.floor} onChange={handleInputChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white text-sm outline-none focus:border-pixel-teal"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase text-gray-200 font-bold ml-1">C. Postal</label>
                                            <input type="text" name="zipCode" placeholder="CP"
                                                value={shippingData.zipCode} onChange={handleInputChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white text-sm outline-none focus:border-pixel-teal"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase text-gray-200 font-bold ml-1">Localidad</label>
                                        <input type="text" name="city" placeholder="Ej: José C. Paz"
                                            value={shippingData.city} onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white text-sm outline-none focus:border-pixel-teal"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase text-gray-200 font-bold ml-1">Provincia</label>
                                        <select name="province"
                                            value={shippingData.province} onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white text-sm outline-none focus:border-pixel-teal appearance-none cursor-pointer"
                                        >
                                            <option value="Buenos Aires" className='bg-pixel-bg'>Buenos Aires</option>
                                            <option value="CABA" className='bg-pixel-bg'>CABA</option>
                                            <option value="Córdoba" className='bg-pixel-bg'>Córdoba</option>
                                            <option value="Santa Fe" className='bg-pixel-bg'>Santa Fe</option>
                                            {/* Agrega más si quieres */}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Info de Retiro */}
                            {deliveryMethod === 'RETIRO' && (
                                <div className="p-4 bg-pixel-teal/10 border border-pixel-teal/30 rounded-lg animate-fade-in">
                                    <p className="text-sm text-pixel-teal font-bold mb-1">📍 Punto de Retiro:</p>
                                    <p className="text-sm text-gray-300">Calle Falsa 123, José C. Paz.</p>
                                    <p className="text-xs text-gray-200 mt-2">Horarios: Lun a Vie de 9 a 18hs.</p>
                                </div>
                            )}
                        </div>

                        {/* 2. RESUMEN DE PAGO */}
                        <div className="bg-pixel-card p-6 rounded-xl border border-white/10 shadow-lg">
                            <h3 className="text-lg font-bold text-white mb-4">Resumen</h3>
                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Envío:</span>
                                    <span>{deliveryMethod === 'RETIRO' ? 'Gratis' : '$0.00'}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
                                    <span>TOTAL:</span>
                                    <span className="text-pixel-teal">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-pixel-teal text-slate-50 py-3 rounded-lg font-bold hover:brightness-125 disabled:opacity-50 transition-all"
                            >
                                {loading ? "Procesando..." : "FINALIZAR COMPRA"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;