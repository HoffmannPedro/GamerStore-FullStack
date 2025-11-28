const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getToken = () => localStorage.getItem('token');

const api = {
    // AUTH
    register: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Error al registrarse');
        return response.text(); // Token como string
    },

    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Error al iniciar sesión. Usuario o contraseña inválidos.');
        return response.text(); // Token como string
    },

    // PRODUCTS
    getProducts: async (filters = {}) => {
        const params = new URLSearchParams();

        // Mapeamos los filtros del front a los nombres que espera el Controller Java
        if (filters.searchTerm) params.append('name', filters.searchTerm);
        if (filters.categoryId && filters.categoryId !== "Todas") params.append('categoryId', filters.categoryId);
        if (filters.sortOrder && filters.sortOrder !== "default") params.append('sortOrder', filters.sortOrder);
        if (filters.inStock) params.append('inStock', 'true');
        if (filters.active !== undefined) params.append('active', filters.active);

        const response = await fetch(`${API_URL}/products?${params.toString()}`, {
            method: 'GET'
        });
        if (!response.ok) throw new Error('Error al obtener los productos');
        return response.json();
    },

    getCategories: async () => {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Error al obtener las categorías');
        return response.json();
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

        if (!response.ok) {
            if (response.status === 403) throw new Error('No tienes permisos de Administrador');
            throw new Error('Error al crear el producto');
        }
        return response.json();
    }
    ,
    updateProduct: async (id, productData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT', // <--- Importante que sea PUT
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) {
            if (response.status === 403) throw new Error('No tienes permisos de Administrador');
            throw new Error('Error al actualizar el producto');
        }
        return response.json();
    },

    uploadImage: async (file) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/images/upload`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`
                // OJO: NO poner Content-Type aquí, el navegador lo pone solo con el boundary correcto al usar FormData
            },
            body: formData
        });

        if (!response.ok) throw new Error('Error al subir la imagen');
        return response.json(); // Retorna { url: "https://..." }
    },

    // CART
    getCart: async () => {
        const token = getToken();
        if (!token) return { items: [] };  // ← DEVUELVE VACÍO
        const response = await fetch(`${API_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al remover una unidad del item');
        return response.json();
    },

    removeItem: async (productId) => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/items/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al remover el item del carrito');
        return response.json();
    },

    clearCart: async () => {
        const token = getToken();
        const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error, el carrito esta vacío');
        return response.json();
    },

    // USER PROFILE
    getProfile: async () => {
        const token = getToken();
        if(!token) throw new Error('No hay sesión iniciada');

        const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        });

        if (!response.ok) throw new Error('Error al obtener perfil');
        return response.json();
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
        if (!response.ok) throw new Error("Error al actualizar el perfil");
        return response.json();
    },

    updateProfilePicture: async (file) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/users/me/picture`, {
            method: 'POST',
            headers: {'Authorization': `Bearer ${token}`},
            body: formData
        });
        if (!response.ok) throw new Error("Error al subir la foto de perfil");
        return response.json();
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

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Error al cambiar contraseña');
        }
        return response.json();
    }
};

export default api;