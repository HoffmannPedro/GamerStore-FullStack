# 🎮 GamerStore - Full Stack E-commerce

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Plataforma de comercio electrónico robusta y escalable diseñada para la venta de hardware gaming. Desarrollada con una arquitectura Full Stack moderna, implementando seguridad JWT, gestión de imágenes en la nube y despliegue continuo.

🔗 **Demo en Vivo:** [https://gamerstore.up.railway.app/](https://gamerstore.up.railway.app/)

---

## 🧪 Credenciales de Acceso (Demo)

Para probar la funcionalidad completa (incluido el Panel de Administración):

| Rol | Usuario | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin` | `1475963` | ABM de Productos, Subir Imágenes, Ver Todo |
| **USER** | `cliente` | `123` | Comprar, Ver Carrito |

*(Siéntete libre de registrar un nuevo usuario para probar el flujo desde cero)*

---

## 📸 Preview

![Home Page](https://res.cloudinary.com/dlvxoftyv/image/upload/v1764198956/chrome_EmSTtyps1S_nnjrms.png)
*(Vista principal de la tienda con listado de productos y filtros)*

---

## 📂 Estructura del Proyecto

El proyecto está organizado como un monorrepo:

```text
GamerStore-FullStack/
├── client/                 # 🎨 Frontend (React + Vite)
│   ├── public/             # Assets estáticos
│   ├── src/
│   │   ├── components/     # Componentes (Navbar, Cart, AdminTable)
│   │   ├── contexts/       # Estado Global (Auth, Cart)
│   │   ├── pages/          # Vistas (Home, Login, AdminPage)
│   │   └── services/       # Cliente HTTP (api.js)
│   └── package.json
│
├── server/                 # ⚙️ Backend (Spring Boot)
│   ├── src/main/java/com/ecommerce/template/
│   │   ├── config/         # Configuración (CORS, Cloudinary)
│   │   ├── controller/     # API REST Controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── model/          # Entidades JPA
│   │   ├── repository/     # Repositorios JPA
│   │   ├── security/       # JWT, Filtros y SecurityConfig
│   │   └── service/        # Lógica de Negocio
│   └── pom.xml             # Dependencias Maven
│
├── Dockerfile              # Configuración de despliegue
└── README.md               # Documentación