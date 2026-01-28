import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fontsource/montserrat';
import './index.css';
import './styles/globals.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AdminPage from './pages/AdminPage.jsx';
import Profile from './pages/Profile.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // ✨ IMPORTANTE

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* App contiene el Navbar y el Outlet, así que envuelve a todo */}
            <Route path="/" element={<App />}>
              
              {/* 1. RUTAS PÚBLICAS (Accesibles para todos) */}
              <Route index element={<ProductList />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="oauth/callback" element={<OAuthCallback />} />

              {/* 2. RUTAS PROTEGIDAS PARA USUARIOS (Requieren estar logueado) */}
              {/* Aquí usamos el 'allowedRoles' para dejar pasar a USER y ADMIN */}
              <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
                <Route path="cart" element={<Cart />} />
                <Route path="profile" element={<Profile />} />
                <Route path="checkout/:orderId" element={<CheckoutPage />} />
              </Route>

              {/* 3. EL MURO INVISIBLE (Solo Admins) */}
              {/* Si un usuario normal intenta entrar a /admin, será rechazado */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="admin" element={<AdminPage />} />
              </Route>

            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);