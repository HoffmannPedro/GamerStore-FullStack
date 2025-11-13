const API_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');

const api = {
    // Auth
    register: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Error al registrarse');
        return response.text(); // Token como string
    },

    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Error al iniciar sesión. Usuario o contraseña inválidos.');
        return response.text(); // Token como string
    },

    // Products
    getProducts: async (filters = {}) => {
        const params = new URLSearchParams();

        // Mapeamos los filtros del front a los nombres que espera el Controller Java
        if (filters.searchTerm) params.append('name', filters.searchTerm);
        if (filters.categoryId && filters.categoryId !== "Todas") params.append('categoryId', filters.categoryId);
        if (filters.sortOrder && filters.sortOrder !== "default") params.append('sortOrder', filters.sortOrder);
        if (filters.inStock) params.append('inStock', 'true');

        const response = await fetch(`${API_URL}/products?${params.toString()}`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener los productos');
        return response.json();
    },

    getCategories: async () => {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Error al obtener las categorías');
        return response.json();
    },

    // Cart
    getCart: async () => {
        const token = getToken();
        if (!token) return { items: [] };  // ← DEVUELVE VACÍO
        const response = await fetch(`${API_URL}/cart`, {
            headers: { 'Authorization' : `Bearer ${token}`}
        });
        if (!response.ok) throw new Error('Error al obtener el carrito');
        return response.json();
    },

    addItem: async (productId, quantity = 1) => {
        const token = getToken();
        if (!token) throw new Error('Debes iniciar sesión');  // ← BLOQUEA
        const response = await fetch(`${API_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });
        if (!response.ok) throw new Error('Error al agregar el item al carrito');
        return response.json();
    },

    removeOne: async (productId) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/items/${productId}/one`, {
            method: 'DELETE',
            headers: {'Authorization' : `Bearer ${token}`}
        });
        if (!response.ok) throw new Error('Error al remover una unidad del item');
        return response.json();
    },

    removeItem: async (productId) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization' : `Bearer ${token}` } 
        });
        if (!response.ok) throw new Error('Error al remover el item del carrito');
        return response.json();
    },

    clearCart: async () => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: { 'Authorization' : `Bearer ${token}`}
        });
        if (!response.ok) throw new Error('Error, el carrito esta vacío');
        return response.json();
    }
};

export default api;