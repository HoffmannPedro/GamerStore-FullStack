const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getToken = () => localStorage.getItem('token');

// ✨ LA CLAVE DEL ÉXITO: Esta función lee el JSON de error del backend
// y lo "pega" al objeto Error de Javascript para que el formulario lo pueda leer.
const handleResponse = async (response, defaultErrorMessage) => {
    if (!response.ok) {
        // Intentamos leer el JSON que viste en la consola (con los errores de stock, etc)
        const errorData = await response.json().catch(() => ({})); 
        
        // Creamos el error
        const error = new Error(errorData.message || defaultErrorMessage);
        
        // ¡IMPORTANTE! Guardamos la respuesta del backend dentro del error
        error.response = {
            status: response.status,
            data: errorData // Aquí viaja: { errors: { stock: "..." } }
        };
        
        throw error; // Lanzamos el error "enriquecido"
    }
    
    // Si no hay contenido (ej: delete exitoso), retornamos null
    if (response.status === 204) return null;
    
    return response.json();
};

const api = {
    // AUTH
    register: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Error al registrarse');
        return response.text();
    },

    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Usuario o contraseña inválidos.');
        return response.text();
    },

    // PRODUCTS
    getProducts: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.searchTerm) params.append('name', filters.searchTerm);
        if (filters.categoryId && filters.categoryId !== "Todas") params.append('categoryId', filters.categoryId);
        if (filters.sortOrder && filters.sortOrder !== "default") params.append('sortOrder', filters.sortOrder);
        if (filters.inStock) params.append('inStock', 'true');
        if (filters.active !== undefined) params.append('active', filters.active);

        const response = await fetch(`${API_URL}/products?${params.toString()}`, { method: 'GET' });
        return handleResponse(response, 'Error al obtener productos');
    },

    getCategories: async () => {
        const response = await fetch(`${API_URL}/categories`);
        return handleResponse(response, 'Error al obtener categorías');
    },

    createProduct: async (productData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        // Usamos handleResponse para no perder los errores de validación
        return handleResponse(response, 'Error al crear el producto');
    },

    updateProduct: async (id, productData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        // Usamos handleResponse aquí también
        return handleResponse(response, 'Error al actualizar el producto');
    },

    uploadImage: async (file) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/images/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return handleResponse(response, 'Error al subir imagen');
    },

    // CATEGORIES (ADMIN)
    createCategory: async (categoryData) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response, 'Error al crear categoría');
    },

    deleteCategory: async (id) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al eliminar categoría');
    },

    // CART
    getCart: async () => {
        const token = getToken();
        if (!token) return { items: [] };
        const response = await fetch(`${API_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al obtener carrito');
    },

    addItem: async (productId, quantity = 1) => {
        const token = getToken();
        if (!token) throw new Error('Debes iniciar sesión');
        const response = await fetch(`${API_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });
        return handleResponse(response, 'Error al agregar item');
    },

    removeOne: async (productId) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/items/${productId}/one`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al reducir cantidad');
    },

    removeItem: async (productId) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al eliminar item');
    },

    clearCart: async () => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al vaciar carrito');
    },

    // ORDERS
    createOrder: async (orderData) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        return handleResponse(response, 'Error al crear orden');
    },

    getMyOrders: async () => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al obtener historial');
    },

    getOrderById: async (id) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al obtener orden');
    },

    createPreference: async (orderId) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders/${orderId}/preference`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await handleResponse(response, 'Error al generar pago');
        return data.preferenceId;
    },

    processPayment: async (paymentData) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders/payment/process`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        return handleResponse(response, 'Error al procesar pago');
    },

    // ADMIN ORDERS
    getAllOrders: async () => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al cargar órdenes');
    },

    updateOrderStatus: async (id, newStatus) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        return handleResponse(response, 'Error al actualizar estado');
    },

    // USER PROFILE
    getProfile: async () => {
        const token = getToken();
        if (!token) throw new Error('No hay sesión iniciada');
        const response = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return handleResponse(response, 'Error al obtener perfil');
    },

    updateProfile: async (data) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response, 'Error al actualizar perfil');
    },

    updateProfilePicture: async (file) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_URL}/users/me/picture`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        return handleResponse(response, 'Error al subir foto');
    },

    changePassword: async (currentPassword, newPassword) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/users/me/password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        return handleResponse(response, 'Error al cambiar contraseña');
    }
};

export default api;