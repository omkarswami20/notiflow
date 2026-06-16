# NotiFlow — Auth & Notification Engine

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A production-grade backend REST API combining a secure authentication system with an asynchronous notification pipeline.**

[Live API](https://notiflow-1.onrender.com) • [Swagger Docs](https://notiflow-1.onrender.com/docs) • [Health Check](https://notiflow-1.onrender.com/health)

</div>

---

## 🧠 What is NotiFlow?

NotiFlow is a **pure backend API engine** built from scratch — no auth libraries, no ORM, no boilerplate. It solves two real-world backend problems:

1. **Secure Authentication** — JWT-based auth with access + refresh token rotation, BCrypt password hashing, and role-based access control (RBAC)
2. **Async Notification Delivery** — Redis queue-based pipeline that decouples event triggers from delivery, ensuring API responses are never blocked by email processing

> Built manually to demonstrate deep backend fundamentals — not vibe-coded, not copied.

---

## 🎯 Project Scope

| Area | What was built |
|---|---|
| **Auth System** | Register, Login, Logout, Change Password — manually implemented |
| **JWT Strategy** | Dual-token — short-lived access token (15m) + long-lived refresh token (7d) |
| **Security** | BCrypt hashing, refresh token revocation, RBAC middleware, IDOR prevention |
| **Notification Engine** | In-app notifications with read/unread state, pagination, admin broadcast |
| **Async Queue** | Redis-based job queue — events push jobs, background worker processes them |
| **Email Delivery** | Nodemailer SMTP — triggered on register and password change |
| **API Docs** | Auto-generated Swagger UI from Fastify JSON Schema |
| **Deployment** | Live on Render + Neon (PostgreSQL) + Upstash (Redis) |

### Intentionally excluded:
- No frontend (pure backend API — consumed by any client)
- No ORM (raw SQL — real database knowledge)
- No Passport.js (JWT implemented manually)

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js | Async-first, event-driven |
| Framework | Fastify | Built-in JSON Schema validation, faster than Express |
| Database | PostgreSQL (Neon) | Relational schema, strong SQL |
| Cache / Queue | Redis (Upstash) | Token blacklisting + async notification queue |
| Auth | JWT + BCrypt | Manual — no passport.js |
| Email | Nodemailer | SMTP email delivery |
| Validation | Fastify JSON Schema | Built-in — no Zod/Joi needed |
| API Docs | @fastify/swagger | Auto-generated from route schemas |
| Deploy | Render | Auto-deploy on git push |

---

## 🗄️ Database Schema

```sql
users (id, name, email, password, role, created_at)
refresh_tokens (id, user_id, token, expires_at, is_revoked)
notifications (id, user_id, type, title, message, is_read, created_at)
notification_queue_log (id, notification_id, status, processed_at, error_message)
```

**4 normalized tables. Raw SQL. Parameterized queries (SQL injection safe).**

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register — triggers WELCOME notification |
| `POST` | `/login` | ❌ | Login — returns access + refresh token |
| `POST` | `/logout` | ✅ JWT | Revoke refresh token |
| `PATCH` | `/change-password` | ✅ JWT | Change password — triggers ALERT notification |

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ JWT | Get my notifications (paginated) |
| `PATCH` | `/:id/read` | ✅ JWT | Mark single notification as read |
| `PATCH` | `/read-all` | ✅ JWT | Mark all as read |
| `DELETE` | `/:id` | ✅ JWT | Delete a notification |
| `POST` | `/broadcast` | ✅ Admin | Broadcast to all users (async queued) |

---

## ⚙️ How the Async Queue Works

```
User registers
      ↓
API pushes job to Redis → returns 201 instantly
      ↓
Background worker (BRPOP) picks up job
      ↓
Inserts notification into PostgreSQL
      ↓
Sends email via Nodemailer SMTP
      ↓
Logs result in notification_queue_log
```

**Why queue?** — Email delivery is slow. Queue decouples the concern — API stays fast, email goes in background.

---

## 🔐 Security Highlights

- **Dual JWT tokens** — different secrets for access and refresh. Compromise of one doesn't affect the other.
- **BCrypt hashing** — 10 salt rounds. Passwords never stored in plain text.
- **IDOR Prevention** — all notification queries check `user_id` — users can never touch another user's data.
- **User Enumeration Prevention** — login returns same error for wrong email and wrong password.
- **Parameterized Queries** — all SQL uses `$1, $2` placeholders. SQL injection not possible.

---

## 📁 Project Structure

```
notiflow/
├── src/
│   ├── config/
│   │   ├── db.js              → PostgreSQL pool (Neon)
│   │   ├── redis.js           → ioredis client (Upstash)
│   │   └── mailer.js          → Nodemailer SMTP
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
└── package.json
```

---

## 🚀 Run Locally

```bash
git clone https://github.com/omkarswami20/notiflow.git
cd notiflow
npm install
cp .env.example .env
# Fill in your values
npm run dev
```

---

## 🔑 Environment Variables

```env
DATABASE_URL=your_neon_postgresql_connection_string
REDIS_URL=your_upstash_redis_connection_string
PORT=3000
JWT_ACCESS_SECRET=your_strong_access_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=NotiFlow <your_gmail@gmail.com>
```

---

## 🌐 Live Demo

| Resource | URL |
|---|---|
| API Base | https://notiflow-1.onrender.com |
| Swagger UI | https://notiflow-1.onrender.com/docs |
| Health Check | https://notiflow-1.onrender.com/health |

```bash
# Register
curl -X POST https://notiflow-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://notiflow-1.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 👨‍💻 Author

**Omkar Swami** — Full-Stack Software Engineer

[![GitHub](https://img.shields.io/badge/GitHub-omkarswami20-181717?style=flat&logo=github)](https://github.com/omkarswami20)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-omkarswami20-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/omkarswami20)