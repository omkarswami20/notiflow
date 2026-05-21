require('dotenv').config()

const pool = require('./config/db')
const redis = require('./config/redis')
const fastify = require('fastify')({logger:true})


// plugin register 

fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'NotiFlow API',
      description: 'Auth & Notification Engine',
      version: '1.0.0'
    }
  }
})

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs'
})  

//routes 
fastify.register(require('./modules/auth/auth.routes'),{
  prefix:'/api/auth'
})

//health check route
fastify.get('/health', async (request, reply) => {
    return {status: 'Okay', message: 'NotiFlow API is up and running'}

}) 


//start server 
const start = async () => {
  try {
    // DB connection check
    const client = await pool.connect()
    client.release()
    console.log('✅ PostgreSQL connected')

    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' })
    console.log('✅ Server is running on port', process.env.PORT || 3000)
    console.log('📄 Swagger UI: http://localhost:3000/docs')
    console.log('❤️  Health check: http://localhost:3000/health')
  } catch (err) {
    console.error('❌ Startup failed:', err.message)
    fastify.log.error(err)
    process.exit(1)
  }
}


start()