# Ecommerce Template

Template modular para ecommerce con React + Tailwind v4 (frontend), Spring Boot + JPA (backend), PostgreSQL (DB).

## Template Base
- Rama: template-base
- Estado: Listado de productos (cards Tailwind), carrito con agregar/remover/remover-uno/total (tabla Tailwind), persistencia en DB.
- Reutilización: Clona `template-base`. Ajusta DB, copia `CartContext`, entidades `Cart`/`CartItem`, usa Tailwind para estilos.

## Prerrequisitos
- Node.js 20+ (frontend)
- JDK 21 (backend)
- PostgreSQL 17 (crea DB `ecommerce_db`)

## Setup
1. Clona: `git clone <url> .`
2. Frontend: `cd client && npm install && npm run dev` (localhost:5173)
3. Backend: Edita `server/src/main/resources/application.properties` (DB password), luego `cd server && ./mvnw spring-boot:run` (localhost:8080)

## Modelos de Datos
- Entidades: `Category` (id, name), `Product` (id, name, price, category_id).
- Relación: 1:N (una categoría, muchos productos).
- JPA: Tablas creadas automáticamente (`spring.jpa.hibernate.ddl-auto=update`).

## Troubleshooting
- Frontend: Si Tailwind no aplica, verifica `index.css` en `main.jsx` y `@tailwindcss/postcss` en `postcss.config.js`.
- Backend: Si falla, verifica Postgres (`psql -U postgres -d ecommerce_db`) y usa `./mvnw spring-boot:run -e -X`.

## Reutilización
- Clona repo.
- Ajusta DB en `application.properties`.
- Personaliza Tailwind en `tailwind.config.js` (opcional).
- Expande entidades en `com.example.demo.model`.

Basado en arquitectura en capas: UI (React), lógica (Spring), datos (JPA/Postgres).
