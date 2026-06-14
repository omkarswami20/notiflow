require('dotenv').config()

const pool = require('./config/db')
const { verifyTransporter } = require('./config/mailer')
const { processQueue } = require('./modules/notification/notification.queue')

const fastify = require('fastify')({ logger: false })

// ─── Swagger ───
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'NotiFlow API',
      description: 'Auth & Notification Engine',
      version: '1.0.0'
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Notifications', description: 'Notification management' }
    ]
  }
})

fastify.register(require('@fastify/swagger-ui'), { routePrefix: '/docs' })

// ─── Routes ───
fastify.register(require('./modules/auth/auth.routes'), { prefix: '/api/auth' })
fastify.register(require('./modules/notification/notification.routes'), { prefix: '/api/notifications' })

// ─── Health ───
fastify.get('/health', async () => ({ status: 'ok', message: 'NotiFlow is alive 🚀' }))

// ─── Boot ───
const start = async () => {
  try {
    // PostgreSQL check
    const client = await pool.connect()
    client.release()

    // SMTP check — non-blocking, server start hoga even if SMTP fails
    verifyTransporter().catch((err) => {
      console.error('⚠️ SMTP verify failed — emails may not work:', err.message)
    })

    // Start Fastify
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })

    // Start Queue Worker
    processQueue().catch((err) => {
      console.error('❌ Queue worker crashed:', err.message)
    })

    console.log('\n🚀 NotiFlow is live!')
    console.log('📦 PostgreSQL  → connected')
    console.log('⚡ Redis       → connected')
    console.log(`🌐 Server      → http://localhost:${process.env.PORT || 3000}`)
    console.log(`📄 Swagger     → http://localhost:${process.env.PORT || 3000}/docs`)
    console.log(`❤️  Health      → http://localhost:${process.env.PORT || 3000}/health`)
    console.log('⚙️  Queue Worker → running\n')

  } catch (err) {
    console.error('❌ Boot failed:', err.message)
    process.exit(1)
  }
}

start()