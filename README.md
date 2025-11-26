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
| **ADMIN** | `admin` | `1475963` | ABM de Productos, Ver Todo |
| **USER** | `cliente` | `1234` | Comprar, Ver Carrito |

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
│   │   ├── components/     # Componentes (Navbar, Cart, Loader, ProductList, ProductModal)
│   │   │   └── admin/      # Componentes (ProductForm, ProductTable)
│   │   ├── contexts/       # Estado Global (Auth, Cart)
│   │   ├── pages/          # Vistas (Register, Login, AdminPage)
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


---

## 🚀 Tecnologías

### Backend
- Java 21
- Spring Boot 3
- Spring Security 6
- JPA / Hibernate

### Frontend
- React 18
- Vite
- Tailwind CSS
- Context API

### Base de Datos
- PostgreSQL 17+

### Infraestructura
- Docker
- Railway CI/CD

### Seguridad
- JWT (HS512)
- BCrypt para contraseñas

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

---

## Frontend (React)

Crear archivo `.env`:

VITE_API_URL=http://localhost:8080/api

---

## 🛠️ Instalación Local

### Prerrequisitos

- Java 21
- Node.js 20+
- PostgreSQL

---

### 1. Clonar repositorio

```bash
git clone https://github.com/HoffmannPedro/GamerStore-FullStack.git
cd GamerStore-FullStack
```

### 2. Iniciar Backend

```bash
cd server
./mvnw spring-boot:run
```

### 3. Iniciar Frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 📡 API Endpoints Principales

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Público | Registrar usuario |
| **POST** | `/api/auth/login` | Público | Login + token |
| **GET** | `/api/products` | Público | Listar productos (Filtros: nombre, categoría, stock) |
| **POST** | `/api/products` | Admin | Crear producto |
| **GET** | `/api/cart` | User/Admin | Ver carrito |
| **POST** | `/api/cart/items` | User/Admin | Agregar item |
| **POST** | `/api/images/upload` | Admin | Subir imagen a Cloudinary |

---

## 👤 Autor

**Pedro Hoffmann**  
GitHub: https://github.com/HoffmannPedro  
LinkedIn: Pedro Hoffmann

---

Desarrollado con fines académicos y profesionales.
