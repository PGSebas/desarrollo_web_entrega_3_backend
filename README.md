# Noiré Perfumes — Backend API REST (Entrega 3)

API REST robusta, escalable y segura desarrollada con **Node.js**, **Express**, **TypeScript**, **Prisma ORM** y **PostgreSQL**, estructurada bajo una **arquitectura en 4 capas limpias** (Domain, Application, Infrastructure, Interface).


---

## 🌐 Enlaces de Despliegue en Producción

| Entorno / Servicio | Plataforma | Enlace Oficial |
| :--- | :--- | :--- |
| **Frontend (Cliente Next.js)** | Vercel | [https://desarrollo-web-entrega-3-frontend.vercel.app](https://desarrollo-web-entrega-3-frontend.vercel.app) |
| **Backend (API REST Express)** | Render / Railway | [https://desarrollo-web-entrega-3-backend.onrender.com](https://desarrollo-web-entrega-3-backend.onrender.com) |
| **Repositorio Frontend** | GitHub | [https://github.com/PGSebas/desarrollo_web_entrega_3_frontend](https://github.com/PGSebas/desarrollo_web_entrega_3_frontend) |

---

## 1. Arquitectura en 4 Capas

El backend separa estrictamente las responsabilidades del sistema garantizando desacoplamiento e independencia del framework:

```text
src/
├── domain/                  # Núcleo del negocio: entidades puras e interfaces de repositorios
│   ├── entities/            # User, Perfume, Pedido
│   └── repositories/        # IUserRepository, IPerfumeRepository, IPedidoRepository
├── application/             # Casos de uso y reglas de negocio (sin dependencias directas a Prisma)
│   ├── dtos/                # Data Transfer Objects validados (auth, perfume, pedido)
│   └── services/            # AuthService, PerfumeService, PedidoService
├── infrastructure/          # Detalles técnicos, drivers externos y persistencia
│   ├── database/            # Cliente de Prisma singleton
│   ├── security/            # PasswordHasher (bcryptjs salt 10) y JwtService
│   └── repositories/        # PrismaUserRepository, PrismaPerfumeRepository, PrismaPedidoRepository
└── interface/               # Capa de presentación HTTP
    ├── controllers/         # AuthController, PerfumeController, PedidoController
    ├── middlewares/         # auth.middleware (requireAuth, requireAdmin) y error.middleware
    └── routes/              # auth.routes, perfume.routes, pedido.routes
```

---

## 2. Requisitos y Ejecución Local

### Prerrequisitos
* Node.js v18+ (probado en v24)
* PostgreSQL v14+ (local o remoto como Neon / Supabase)

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/PGSebas/desarrollo_web_entrega_3_backend.git
cd desarrollo_web_entrega_3_backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

### Configuración del archivo `.env`
Edita `.env` con tus credenciales de PostgreSQL:
```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/noire_perfumes?schema=public"
JWT_SECRET="clave_secreta_jwt_noire_perfumes_2026_super_segura"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

### Migraciones y Seed Oficial
```bash
# Generar cliente de Prisma
npx prisma generate

# Sincronizar esquema con la base de datos
npx prisma db push
# O ejecutar migraciones
npx prisma migrate dev --name init

# Ejecutar el seed con los 8 perfumes reales y usuarios de prueba
npm run prisma:seed
```

### Iniciar en Desarrollo
```bash
npm run dev
# Servidor disponible en http://localhost:4000
```

---

## 3. Credenciales de Prueba (Entorno de Evaluación)

| Rol | Correo Electrónico | Contraseña | Permisos |
|---|---|---|---|
| **ADMIN** | `admin@noireperfumes.co` | `Admin123*` | CRUD total de perfumes, lectura de todas las órdenes |
| **USER** | `cliente@noireperfumes.co` | `Cliente123*` | Lectura de catálogo, creación de pedidos y consulta de sus órdenes |

---

## 4. Endpoints de la API REST

### Autenticación (`/api/auth`)
* `POST /api/auth/register` — Registro público. Valida email único (409 si existe), contraseña mínima de 6 caracteres. Retorna `{ user, token }`.
* `POST /api/auth/login` — Autenticación pública. Valida contraseña con bcrypt. Retorna JWT con payload `{ id, role }`. 401 genérico en error.
* `GET /api/auth/me` — Privado (`requireAuth`). Retorna el perfil del usuario autenticado.

### Catálogo de Perfumes (`/api/perfumes`)
* `GET /api/perfumes` — Público. Paginación `{ pagination: { page, limit, total, totalPages }, data: [...] }`. Soporta filtros por `categoria`, `tipo` y búsqueda textual `search`.
* `GET /api/perfumes/:id` — Público. Retorna detalle de la fragancia o 404.
* `POST /api/perfumes` — Protegido (`requireAuth`, `requireAdmin`). Crea una nueva fragancia.
* `PUT /api/perfumes/:id` — Protegido (`requireAuth`, `requireAdmin`). Edita una fragancia.
* `DELETE /api/perfumes/:id` — Protegido (`requireAuth`, `requireAdmin`). Elimina una fragancia. Responde 401 si no hay token y 403 si el rol es USER.

### Pedidos e Interacciones (`/api/pedidos`)
* `POST /api/pedidos` — Protegido (`requireAuth`). Crea un pedido. **`userId` se extrae del JWT, nunca del body**.
* `GET /api/pedidos/mias` — Protegido (`requireAuth`). Retorna únicamente los pedidos del usuario autenticado.
* `GET /api/pedidos` — Protegido (`requireAuth`, `requireAdmin`). Retorna todas las órdenes del sistema.

---

## 5. Decisiones Técnicas Justificadas

### ¿Cómo es el flujo completo de un login, desde el formulario hasta una ruta protegida?
1. **Envío de credenciales:** El frontend envía una petición `POST /api/auth/login` con `{ email, password }` en formato JSON.
2. **Recepción en controlador:** `AuthController` extrae el body y delega a `AuthService.login()`.
3. **Búsqueda y comparación:** El caso de uso consulta `PrismaUserRepository.findByEmail()`. Si no existe o la contraseña no coincide mediante `PasswordHasher.compare()` (bcrypt), se lanza un `AppError(401, 'Credenciales inválidas...')` genérico para no dar pistas a atacantes sobre qué campo falló.
4. **Emisión de JWT:** Con las credenciales verificadas, `JwtService.sign()` genera un token firmado con `JWT_SECRET` y expiración (`7d`), cuyo payload contiene únicamente `{ id: user.id, role: user.role }`.
5. **Consumo de ruta protegida:** El cliente almacena el token y lo adjunta en cabeceras subsiguientes como `Authorization: Bearer <token>`.
6. **Middleware de autenticación:** Al solicitar una ruta como `POST /api/pedidos`, el middleware `requireAuth` intercepta la petición, verifica la firma con `JwtService.verify()` y monta el usuario en `req.user`. Si el token es inválido o expiró, responde `401 Unauthorized` de inmediato antes de que el controlador sea ejecutado.

### ¿En qué caso la API responde 401 y en cuál 403? (Ejemplos reales del proyecto)
* **`401 Unauthorized` (Falta o invalidez de identidad):**
  * Ocurre cuando un usuario intenta acceder a una ruta protegida sin proporcionar el token en la cabecera `Authorization`, o cuando el token está mal formado o ha expirado.
  * *Ejemplo real:* Un cliente no autenticado envía una petición `POST /api/pedidos` para solicitar una fragancia. Como no hay token, la API responde `401 Unauthorized: Token de autenticación no proporcionado`.
* **`403 Forbidden` (Identidad válida, pero permisos insuficientes por rol):**
  * Ocurre cuando el usuario está correctamente autenticado (su token es legítimo), pero su rol no posee los privilegios requeridos para la operación solicitada.
  * *Ejemplo real:* El usuario autenticado con rol `USER` (`cliente@noireperfumes.co`) intenta eliminar una fragancia enviando `DELETE /api/perfumes/1`. El middleware `requireAuth` valida su token con éxito, pero a continuación el middleware `requireAdmin` detecta que su rol no es `ADMIN` y deniega la petición con `403 Forbidden: Acceso denegado: Se requieren permisos de Administrador`.

### ¿Para qué se usó la IA y qué se corrigió o adaptó del resultado?
La Inteligencia Artificial se utilizó como asistente de soporte para estructurar rápidamente el archivo de esquema de Prisma (`schema.prisma`) y generar los esqueletos de las interfaces de repositorio en TypeScript. Se corrigió y personalizó el modelo para asegurar que:
1. Las relaciones de llaves foráneas (`userId`, `perfumeId`) utilizaran restricciones seguras (`onDelete: Cascade` para usuarios y `onDelete: Restrict` para fragancias para evitar pedidos huérfanos).
2. Se eliminó la inyección de `userId` desde el cuerpo (`body`) en la creación de pedidos, forzando a que se extraiga estrictamente del token JWT verificado en `req.user.id`.
3. Se afinó el middleware de error para capturar códigos nativos de Prisma (`P2002` y `P2025`) y transformarlos en respuestas limpias `409 Conflict` y `404 Not Found` sin exponer jamás el stack trace en producción.
