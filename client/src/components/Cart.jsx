import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
    const { cartItems, addToCart, removeOne, removeFromCart, clearCart, loading, error } = useCart();

    if (loading) {
        return <div className="text-center mt-20 text-xl text-white animate-pulse">Cargando tu arsenal... 🕹️</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-20 text-red-400 bg-red-900/20 p-6 rounded-lg max-w-md mx-auto border border-red-800">
                <p className="mb-4">⚠️ Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const total = cartItems.reduce((sum, item) =>
        sum + item.product.price * item.quantity, 0
    );

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-20 flex flex-col items-center">
                <div className="bg-gray-800 p-6 rounded-full mb-6 animate-bounce">
                    <span className="text-6xl">🛒</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-400 mb-8">Parece que aún no has elegido tus armas.</p>
                <Link
                    to="/"
                    className="bg-btnGreen text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-transform hover:scale-105 shadow-lg shadow-green-900/20"
                >
                    Explorar Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 mt-8">
            <h2 className="text-4xl font-bold mb-8 text-center text-white flex items-center justify-center gap-3">
                <span>🛒</span> Tu Carrito
            </h2>

            <div className='bg-terciary rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-700 text-left'>
                {/* Lista de Items */}
                <div className="divide-y divide-gray-700">
                    {cartItems.map(item => (
                        <div
                            key={item.product.id}
                            className="flex flex-col sm:flex-row items-center justify-between p-6 hover:bg-white/5 transition-colors gap-6"
                        >
                            {/* Imagen y Detalles */}
                            <div className="flex items-center gap-6 flex-1 w-full sm:w-auto">
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={item.product.imageUrl} 
                                        alt={item.product.name} 
                                        className="w-24 h-24 object-cover rounded-xl shadow-lg bg-gray-800"
                                        onError={(e) => e.target.src = "/img/placeholder.jpg"} 
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.product.name}</h3>
                                    <p className="text-gray-400 text-sm">
                                        Unitario: <span className="text-btnGreen font-mono">${item.product.price.toFixed(2)}</span>
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Subtotal: <span className="text-gray-300 font-mono font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Controles de Cantidad y Acciones */}
                            <div className="flex items-center gap-6">
                                {/* Selector de Cantidad */}
                                <div className="flex items-center bg-gray-800 rounded-full p-1 ring-1 ring-gray-600">
                                    <button
                                        onClick={() => removeOne(item.product.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-yellow-600 transition-colors font-bold"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-mono font-bold text-white text-lg">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => addToCart(item.product, false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-btnGreen hover:text-black transition-colors font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Botón Eliminar */}
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="group p-2 rounded-full hover:bg-red-900/30 transition-colors"
                                    title="Eliminar del carrito"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer del Carrito: Total y Checkout */}
                <div className="bg-gray-900/50 p-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-center sm:text-left">
                        <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Total a Pagar</p>
                        <p className="text-4xl font-bold text-white font-mono tracking-tight">
                            ${total.toFixed(2)}
                        </p>
                    </div>
                    
                    <button 
                        className="bg-btnGreen text-white px-10 py-4 rounded-xl font-bold text-lg hover:brightness-110 shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
                        onClick={() => alert("¡Gracias por tu compra! 🎮 (Simulación)")}
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>

            {/* Botones de Navegación Inferior */}
            <div className="mt-8 flex justify-center items-center gap-6 text-sm font-medium">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors hover:underline"
                >
                    ← Seguir Comprando
                </Link>
                <span className="text-gray-700">|</span>
                <button
                    onClick={() => clearCart()} 
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 hover:underline"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Vaciar Carrito
                </button>
            </div>
        </div>
    );
}

export default Cart;