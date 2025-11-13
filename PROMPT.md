**PROYECTO: Ecommerce Template Reutilizable (Aprendizaje y Escalabilidad)**

**Mi perfil**: Pedro Hoffmann, de Buenos Aires, Argentina. Estudiante de Licenciatura en Sistemas (2023-presente, UNSAM). Conocimientos básicos: HTML, CSS, JavaScript, Bootstrap, Tailwind, jQuery, Responsive Web Design, React JS, Algoritmos y estructuras de datos (JavaScript, Java). Conocimientos intermedios: React (hooks, Context API, state management). Conocimientos iniciales: Java, Spring Boot (JPA, REST APIs, DTOs), PostgreSQL. Estoy usando este proyecto para aprender Spring Boot (JPA, servicios, controladores, seguridad) y React (hooks, routing, context, fetch). Mi objetivo es crear un template reusable que pueda replicar, modificar y expandir para futuros proyectos, con énfasis en buenas prácticas: arquitectura limpia (separación de concerns), seguridad, mantenibilidad, escalabilidad.

**Repositorio**: https://github.com/HoffmannPedro/ecommerce-template/tree/template-base  
**Estado actual**:  
- **Frontend (client)**: React + Vite + Tailwind CSS + React Router + Context API. Estructura:  
  - src/App.jsx: Layout principal con navbar (Productos, Carrito, Login/Logout).  
  - src/components/ProductList.jsx: Lista de productos con fetch a `/api/products`, cards responsive, botón "Agregar al Carrito" (disabled si no logueado).  
  - src/components/Cart.jsx: Tabla con ítems, botones +/−, eliminar, total con reduce.  
  - src/contexts/CartContext.jsx: Context para carrito, con `addToCart`, `removeOne`, `removeFromCart`, loading/error.  
  - src/hooks/useAuth.js: Hook para login/register/logout, isAuthenticated, localStorage para token JWT.  
  - src/pages/Login.jsx y Register.jsx: Formularios con useAuth, error handling, redirigir a '/' tras éxito.  
  - src/services/api.js: Fetch centralizado para auth (login/register), cart (getCart, addItem, removeOne, removeItem).  
  - src/main.jsx: BrowserRouter, Routes para / (ProductList), /cart (Cart), /login, /register.  
- **Backend (server)**: Spring Boot + JPA + PostgreSQL + Spring Security + JWT. Paquetes: `com.ecommerce.template`.  
  - Model: Product, Category, Cart (con userId Long), CartItem, User (UserDetails).  
  - Repository: JpaRepository para cada modelo, con findByUserId en CartRepository.  
  - Service: ProductService, CategoryService, CartService (addItem, removeOne, removeItem, getCartByUserId), AuthService.  
  - Controller: ProductController, CategoryController, CartController (GET/POST/DELETE /api/cart/{userId}), AuthController (/api/auth/login/register).  
  - Config: SecurityConfig (permitAll para /api/auth/**, /api/products/**, /api/cart/**), JwtUtil, JwtAuthenticationFilter.  
  - DTOs: ProductDTO, CategoryDTO, CartDTO, CartItemDTO.  
  - application.properties: PostgreSQL, logging, ddl-auto=update.  
- **Funcionalidades**: Login/register con JWT, carrito persistente (add/remove, total), fetch desde React, CORS configurado.  
- **Errores pendientes**:  
  1. Al iniciar, login fallido redirige sin error (useAuth no maneja catch correctamente).  
  2. Botón "Iniciar sesión" sigue después de login (useAuth no actualiza estado global).  
  3. Error persiste en carrito después de login (no se limpia setError).  
  4. No se ve que se agregó al carrito (falta contador en navbar).  
  5. Register sin feedback (redirige sin éxito/error).  
  6. Ítems reordenan al −1 (key incorrecto en map).  

**Objetivo**: Resolver los 6 errores pendientes, paso a paso, archivo por archivo, sin abrumar. Enfocarse en buenas prácticas: arquitectura limpia (separación concerns), seguridad (JWT), mantenibilidad (hooks/contexts), escalabilidad (services), UX (loading/error, responsive). Explicar cada línea, razonar alternativas, verificar comprensión con 1 pregunta por paso. No avanzar hasta "listo". Al final, commit claro y push a template-base.

**Reglas**:
- Paso a paso: 1 archivo, 1 concepto, 1 pregunta.
- Explicar React: hooks (useState, useEffect, useContext), JSX, inmutabilidad (spread/map/filter).
- Explicar Spring: JPA (entidades, relaciones), Service/Controller, DTOs.
- Buenas prácticas: arquitectura limpia, escalabilidad (lazy loading), mantenibilidad (modularidad).
- Formato: bloques código claros, explicaciones detalladas.
- No copiar/pegar: explicar cada línea, conectar con mi conocimiento.
- Si no entiendo, parar y explicar de nuevo.