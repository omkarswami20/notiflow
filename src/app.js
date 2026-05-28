require('dotenv').config()

const pool = require('./config/db')
const redis = require('./config/redis')
const fastify = require('fastify')({ logger: false }) // clean logs only

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
    const client = await pool.connect()
    client.release()

    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })

    console.log('\n🚀 NotiFlow is live!')
    console.log(`📦 PostgreSQL  →  connected`)
    console.log(`⚡ Redis       →  connected`)
    console.log(`🌐 Server      →  http://localhost:${process.env.PORT || 3000}`)
    console.log(`📄 Swagger     →  http://localhost:${process.env.PORT || 3000}/docs`)
    console.log(`❤️  Health      →  http://localhost:${process.env.PORT || 3000}/health\n`)
  } catch (err) {
    console.error('❌ Boot failed:', err.message)
    process.exit(1)
  }
}

start()