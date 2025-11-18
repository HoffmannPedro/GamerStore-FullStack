# 🎮 GamerStore - Full Stack E-commerce

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

GamerStore es una plataforma de comercio electrónico robusta y escalable
diseñada para la venta de hardware y periféricos gaming. Implementa una
arquitectura Full Stack moderna con seguridad JWT, filtrado en servidor
y diseño completamente responsivo (en proceso).

🔗 **Demo en Vivo:**\
https://gamerstore-fullstack-production.up.railway.app

------------------------------------------------------------------------

## 📸 Preview

![Home Page](./client/public/img/screenshot-home.png)

------------------------------------------------------------------------

## 📂 Estructura del Proyecto

    GamerStore-FullStack/
    ├── client/
    │   ├── public/img/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── contexts/
    │   │   ├── pages/
    │   │   └── services/
    │   └── package.json
    │
    ├── server/
    │   ├── src/main/java/com/ecommerce/template/
    │   │   ├── config/
    │   │   ├── controller/
    │   │   ├── dto/
    │   │   ├── model/
    │   │   ├── repository/
    │   │   ├── security/
    │   │   └── service/
    │   ├── Dockerfile
    │   └── pom.xml
    │
    └── README.md

------------------------------------------------------------------------

## 🚀 Tecnologías

### Backend

-   Java 21
-   Spring Boot 3
-   Spring Security 6
-   JPA/Hibernate

### Frontend

-   React 18
-   Vite
-   Tailwind CSS
-   Context API

### Base de Datos

-   PostgreSQL 12+

### Infraestructura

-   Docker
-   Railway CI/CD

### Seguridad

-   JWT (HS512)
-   BCrypt para contraseñas

------------------------------------------------------------------------

## ⚙️ Configuración y Variables de Entorno

### Backend (Spring Boot)

  Variable                     Descripción
  ---------------------------- -------------
  SPRING_DATASOURCE_URL        URL JDBC
  SPRING_DATASOURCE_USERNAME   Usuario
  SPRING_DATASOURCE_PASSWORD   Contraseña
  PORT                         Puerto

> La clave JWT se autogenera en cada inicio.

------------------------------------------------------------------------

### Frontend (React)

Crear archivo `.env`:

    VITE_API_URL=http://localhost:8080/api

------------------------------------------------------------------------

## 🛠️ Instalación Local

### Prerrequisitos

-   Java 21\
-   Node.js 20+\
-   PostgreSQL

------------------------------------------------------------------------

### 1. Clonar repositorio

``` bash
git clone https://github.com/HoffmannPedro/GamerStore-FullStack.git
cd GamerStore-FullStack
```

### 2. Iniciar Backend

``` bash
cd server
./mvnw spring-boot:run
```

### 3. Iniciar Frontend

``` bash
cd ../client
npm install
npm run dev
```

------------------------------------------------------------------------

## 📡 API Endpoints Principales

  Método   Endpoint             Acceso    Descripción
  -------- -------------------- --------- -------------------
  POST     /api/auth/register   Público   Registrar usuario
  POST     /api/auth/login      Público   Login + token
  GET      /api/products        Público   Listar productos
  POST     /api/products        Auth      Crear producto
  GET      /api/cart            Auth      Ver carrito
  POST     /api/cart/items      Auth      Agregar item

------------------------------------------------------------------------

## 👤 Autor

**Pedro Hoffmann**\
GitHub: https://github.com/HoffmannPedro\
LinkedIn: Pedro Hoffmann
