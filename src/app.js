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

    const port = process.env.PORT || 3000
    const mailProvider = process.env.RESEND_API_KEY 
      ? 'Resend API ✉️' 
      : (process.env.BREVO_API_KEY ? 'Brevo API ✉️' : 'SMTP (Gmail/Local) 📧')

    const localUrl = `http://localhost:${port}`
    const docsUrl = `${localUrl}/docs`
    const healthUrl = `${localUrl}/health`

    console.log('\n┌──────────────────────────────────────────────────────────────┐')
    console.log('│   ⚡   N O T I F L O W   S E R V I C E   O N L I N E   🚀    │')
    console.log('├──────────────────────────────────────────────────────────────┤')
    console.log('│  🟢 Server Status    ::  Online & Listening                  │')
    console.log('│  🐘 Database (Postgres)::  Connected                         │')
    console.log('│  🔑 Cache & Queue    ::  Redis Connected                     │')
    console.log(`│  📧 Email Provider   ::  ${mailProvider.padEnd(28)} │`)
    console.log('│  ⚙️  Queue Worker     ::  Running in Background               │')
    console.log('├──────────────────────────────────────────────────────────────┤')
    console.log(`│  🌐 Local Server     ::  ${localUrl.padEnd(36)} │`)
    console.log(`│  📄 Swagger API Docs ::  ${docsUrl.padEnd(36)} │`)
    console.log(`│  ❤️  Health Endpoint ::  ${healthUrl.padEnd(36)} │`)
    console.log('└──────────────────────────────────────────────────────────────┘\n')

  } catch (err) {
    console.error('❌ Boot failed:', err.message)
    process.exit(1)
  }
}

start()