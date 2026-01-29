# 🎮 GamerStore - Full Stack E-commerce

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Plataforma de comercio electrónico profesional diseñada para la venta de hardware gaming. Desarrollada con una arquitectura Full Stack moderna, integra pagos en tiempo real con MercadoPago, autenticación segura vía Google OAuth2 y JWT, gestión de imágenes en la nube, despliegue continuo y diseño completamente responsivo.

🔗 **Demo en Vivo:**\
https://gamer-store-teal.vercel.app/

---

## 📸 Preview

![Home Page](https://res.cloudinary.com/dlvxoftyv/image/upload/v1769645257/ascreenshot_xxywc0.jpg)

---

## 🧪 Credenciales de Acceso (Demo)

Para probar la funcionalidad completa (incluido el Panel de Administración):

| Rol | Email | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@admin.com` | `1475963` | ABM de Productos, Ver Todo |
| **USER** | `cliente@cliente.com` | `1234` | Comprar, Ver Carrito |

*(Siéntete libre de registrar un nuevo usuario para probar el flujo desde cero)*

---

## 📂 Estructura del Proyecto

    GamerStore-FullStack/
    ├── client/                 # 🎨 Frontend (React + Vite)
    │   ├── public/             # Assets estáticos
    │   ├── src/
    │   │   ├── components/     # UI (Navbar, Cart, WalletBrick, ProductCard)
    │   │   │   └── admin/      # Panel de Administración
    │   │   ├── contexts/       # Estado Global (AuthContext, CartContext)
    │   │   ├── pages/          # Vistas (Checkout, Profile, Home, Auth)
    │   │   └── services/       # Cliente HTTP (api.js)
    │   └── vercel.json         # Configuración de rutas SPA
    │
    ├── server/                 # ⚙️ Backend (Spring Boot)
    │   ├── src/main/java/com/ecommerce/template/
    │   │   ├── config/         # Configuración (Security, CORS, Cloudinary)
    │   │   ├── controller/     # Endpoints REST (Orders, Auth, Products)
    │   │   ├── model/          # Entidades JPA (User, Order, Payment)
    │   │   ├── service/        # Lógica de Negocio (Integration MP, OAuth)
    │   │   └── security/       # JWT Filters & OAuth2 Handlers
    │   └── pom.xml             # Dependencias Maven
    │
    └── README.md               # Documentación

------------------------------------------------------------------------

## 🚀 Tecnologías

### Backend

-   Java 21 & Spring Boot 3
-   Spring Security 6 (OAuth2 Client + JWT)
-   MercadoPago SDK (Integración de pagos y webhooks)
-   Hibernate / JPA (Persistencia de datos)

### Frontend

-   React 18 & Vite
-   Tailwind CSS (Diseño responsivo)
-   MercadoPago React SDK (Bricks y Wallet)
-   React Router DOM & Context API

### Base de Datos

-   PostgreSQL 12+

### Infraestructura & Cloud

-   Base de Datos: PostgreSQL (Neon Tech)
-   Backend Hosting: Render
-   Frontend Hosting: Vercel
-   Media Storage: Cloudinary

---

## ⚙️ Configuración y Variables de Entorno

### Backend (Spring Boot)

| Variable | Descripción |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | URL JDBC (jdbc:postgresql://host:port/db) |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la BD |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña de la BD |
| `JWT_SECRET` | Clave secreta para firmar tokens (mínimo 64 chars) |
| `CLOUDINARY_CLOUD_NAME` | Nombre del Cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
| `MP_ACCESS_TOKEN` | Token de acceso de MercadoPago |
| `ID_CLIENT_GOOGLE` | Client ID (Google Cloud Console) |
| `SECRET_CLIENT_GOOGLE` | Client Secret (Google Cloud Console) |
| `FRONTEND_URL` | URL del cliente (ej: https://mi-app.vercel.app) |

---

### Frontend (React)

Crear archivo `.env`:

    VITE_API_URL = URL del Backend (ej: https://mi-api.onrender.com/api)
    VITE_MP_PUBLIC_KEY = Public Key de MercadoPago

---

## 🛠️ Instalación Local

### Prerrequisitos

- Java 21
- Node.js 20+
- PostgreSQL
- Maven

---

### 1. Clonar repositorio

```bash
git clone https://github.com/HoffmannPedro/GamerStore-FullStack.git
cd GamerStore-FullStack
```

### 2. Iniciar Backend

```bash
cd server
mvn spring-boot:run
```

### 3. Iniciar Frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 📡 API Endpoints Principales

| Módulo | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Auth** | **POST** | `/api/auth/register` | Registrar usuario |
| **Auth** | **POST** | `/api/auth/login` | Login tradicional (JWT) |
| **Auth** | **GET** | `/login/oauth2/code/google` | Callback OAuth2 Google |
| **Productos** | **GET** | `/api/products` | Catálogo con filtros y paginación |
| **Productos** | **POST** | `/api/products` | (Admin) Crear nuevo producto |
| **Checkout** | **POST** | `/api/orders` | Iniciar orden de compra |
| **Checkout** | **POST** | `/api/orders/{id}/preference` | Generar link de pago MP |
| **Checkout** | **POST** | `/api/orders/webhook` | Recepción de notificaciones de pago |
| **Usuarios** | **GET** | `/api/orders/my-orders` | Historial de compras personal |

---

## 👤 Autor

**Pedro Hoffmann**
GitHub: https://github.com/HoffmannPedro
LinkedIn: [Pedro Hoffmann](https://www.linkedin.com/in/hoffmannpedro/)

---

Desarrollado con fines académicos y profesionales.