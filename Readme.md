# NotiFlow — Auth & Notification Engine

A production-grade backend REST API built with **Node.js + Fastify**, featuring a complete authentication system and an asynchronous notification pipeline.

> Built manually from scratch — no auth libraries, no ORM, no boilerplate.

using fastify 

---

## 🚀 Live Demo

- **API Base URL:** _coming soon (Render)_
- **Swagger Docs:** `{base_url}/docs`
- **Health Check:** `{base_url}/health`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Fastify |
| Database | PostgreSQL (Neon) |
| Cache / Queue | Redis (ioredis) |
| Auth | JWT (access + refresh tokens) + BCrypt |
| Email | Brevo / Resend (API) |
| Validation | Fastify JSON Schema (built-in) |
| API Docs | @fastify/swagger + @fastify/swagger-ui |

---

## ✅ What's Done

### Project Setup
- [x] Fastify server with logger
- [x] PostgreSQL connection (Neon)
- [x] Swagger UI at `/docs`
- [x] Health check at `/health`
- [x] Environment variables via dotenv
- [x] `.gitignore` — `.env` and `node_modules` excluded

### Database
- [x] `users` table
- [x] `refresh_tokens` table
- [x] `notifications` table
- [x] `notification_queue_log` table

### Utils
- [x] `hash.utils.js` — BCrypt hash + compare
- [x] `jwt.utils.js` — sign + verify access/refresh tokens
- [x] `response.utils.js` — standard API response format

### Auth Module
- [x] `auth.schema.js` — Fastify JSON Schema validation
- [x] `auth.service.js` — register, login, logout, changePassword
- [x] `auth.controller.js` — request/response handling
- [x] `auth.middleware.js` — JWT verify + attach user to request
- [x] `auth.routes.js` — routes with preHandler middleware
- [x] Routes registered in `app.js` at `/api/auth`

---

## 🔄 Pending

### Auth Module
- [ ] Fix `response.utils.js` typos — `success`, `message` spelling
- [ ] Test all auth endpoints in Postman/Swagger
- [ ] `role.middleware.js` — admin role check

### Notification Module
- [ ] `notification.schema.js`
- [ ] `notification.service.js`
- [ ] `notification.controller.js`
- [ ] `notification.routes.js`
- [ ] `notification.queue.js` — Redis queue processor

### Redis
- [ ] `config/redis.js` — ioredis client setup
- [ ] Token blacklisting on logout
- [ ] Async notification queue

### Email
- [x] `config/mailer.js` — Resend setup (Render free tier fix)
- [ ] Welcome email on register
- [ ] Password change alert email

### Deploy
- [ ] Deploy backend on Render
- [ ] Update README with live URL

---

## 📁 Project Structure

```
notiflow/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── mailer.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.schema.js
│   │   └── notification/
│   │       ├── notification.routes.js
│   │       ├── notification.controller.js
│   │       ├── notification.service.js
│   │       ├── notification.schema.js
│   │       └── notification.queue.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── utils/
│   │   ├── jwt.utils.js
│   │   ├── hash.utils.js
│   │   └── response.utils.js
│   └── app.js
├── .env.example
├── README.md
└── package.json
```

---

## 🔐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns tokens |
| POST | `/logout` | JWT | Revoke refresh token |
| PATCH | `/change-password` | JWT | Change user password |

### Notifications — `/api/notifications` _(coming soon)_

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | JWT | Get my notifications (paginated) |
| PATCH | `/:id/read` | JWT | Mark as read |
| PATCH | `/read-all` | JWT | Mark all as read |
| DELETE | `/:id` | JWT | Delete notification |
| POST | `/broadcast` | Admin | Broadcast to all users |

---

## ⚙️ Setup & Run Locally

```bash
# Clone
git clone https://github.com/omkarswami20/notiflow.git
cd notiflow

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in your values in .env

# Run in development
npm run dev
```

---

## 🔑 Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
REDIS_URL=redis://localhost:6379
PORT=3000
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
# Production Email Option A (Brevo API - Free & No Domain Required)
BREVO_API_KEY=your_brevo_api_key
SMTP_FROM=your_verified_gmail@gmail.com

# Production Email Option B (Resend API - Requires Custom Domain)
RESEND_API_KEY=your_resend_api_key
SMTP_FROM=NotiFlow <onboarding@resend.dev>

# Local Development Email (SMTP Fallback)
# Leave BREVO_API_KEY and RESEND_API_KEY empty to fall back to SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
# SMTP_FROM=NotiFlow <your_email@gmail.com>
```

---

## 👨‍💻 Author

**Omkar Swami**
- GitHub: [@omkarswami20](https://github.com/omkarswami20)
- LinkedIn: [linkedin.com/in/omkarswami20](https://linkedin.com/in/omkarswami20)