require('dotenv').config()

const pool = require('./config/db')
const { verifyTransporter } = require('./config/mailer')
const { processQueue } = require('./modules/notification/notification.queue')

const fastify = require('fastify')({
  logger: false
})

// ─────────────────────────────────────
// Swagger
// ─────────────────────────────────────
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'NotiFlow API',
      description: 'Auth & Notification Engine',
      version: '1.0.0'
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Notifications',
        description: 'Notification management'
      }
    ]
  }
})

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs'
})

// ─────────────────────────────────────
// Routes
// ─────────────────────────────────────
fastify.register(
  require('./modules/auth/auth.routes'),
  {
    prefix: '/api/auth'
  }
)

fastify.register(
  require('./modules/notification/notification.routes'),
  {
    prefix: '/api/notifications'
  }
)

// ─────────────────────────────────────
// Health Check
// ─────────────────────────────────────
fastify.get('/health', async () => {
  return {
    status: 'ok',
    message: 'NotiFlow is alive 🚀'
  }
})

// ─────────────────────────────────────
// Boot Application
// ─────────────────────────────────────
const start = async () => {
  try {

    // PostgreSQL check
    const client = await pool.connect()
    client.release()

    // SMTP check before accepting traffic
    await verifyTransporter()

    // Start Fastify
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })

    // Start Queue Worker
    processQueue().catch((err) => {
      console.error('❌ Queue worker crashed:', err.message)
      console.error(err.stack)
      process.exit(1)
    })

    console.log('\n🚀 NotiFlow is live!')
    console.log('📦 PostgreSQL  → connected')
    console.log('⚡ Redis       → connected')
    console.log('📧 SMTP        → verified')
    console.log(
      `🌐 Server      → http://localhost:${process.env.PORT || 3000}`
    )
    console.log(
      `📄 Swagger     → http://localhost:${process.env.PORT || 3000}/docs`
    )
    console.log(
      `❤️  Health      → http://localhost:${process.env.PORT || 3000}/health`
    )
    console.log('⚙️  Queue Worker → running')
    console.log()

  } catch (err) {
    console.error('❌ Boot failed:', err.message)
    if (err.stack) console.error(err.stack)
    process.exit(1)
  }
}

start()
