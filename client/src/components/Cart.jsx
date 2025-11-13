import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
    const { cartItems, addToCart, removeOne, removeFromCart, clearCart, loading, error } = useCart();

    if (loading) {
        return <div className="text-center mt-8">Cargando carrito...</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-red-600">
                Error: {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
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
            <div className="text-center mt-8">
                <p className="text-xl mb-4 text-white">Tu carrito está vacío</p>
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Ir a Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Tu Carrito</h2>

            <div className='bg-slate-700 p-3 rounded-lg shadow-lg'>
                <div className="bg-white rounded-lg shadow overflow-hidden text-left">
                    {cartItems.map(item => (
                        <div
                            key={item.product.id}
                            className="flex justify-between items-center p-4 border-b"
                        >
                            <div className="flex mr-4 min-w-96">
                                <h3 className="font-semibold mr-5">{item.product.name}</h3>
                                <p className="text-gray-600">${item.product.price.toFixed(2)} c/u</p>
                            </div>

                            <div className='flex'>
                                <button
                                    onClick={() => removeOne(item.product.id)}
                                    className="bg-yellow-500 text-white w-6 h-6 rounded-full hover:brightness-110 mr-2"
                                >
                                    −
                                </button>
                                <button
                                    onClick={() => addToCart(item.product)}
                                    className="bg-btnGreen text-white w-6 h-6 rounded-full hover:brightness-125"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="font-medium w-8 text-center border-slate-300 border rounded">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="bg-btnRed text-white w-6 h-6 rounded-full hover:brightness-125"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="p-4 bg-gray-50">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link
                    to="/"
                    className="bg-gray-600 text-white px-6 py-2.5 rounded mr-4 hover:bg-gray-700"
                >
                    Seguir Comprando
                </Link>
                <button
                    onClick={() => clearCart()} // Refresca para limpiar (próximo paso: limpiar carrito)
                    className="bg-btnRed text-white px-6 py-2 rounded hover:brightness-125"
                >
                    Limpiar Carrito
                </button>
            </div>
        </div>
    );
}

export default Cart;