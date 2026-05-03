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

//health check route
fastify.get('/health', async (request, reply) => {
    return {status: 'Okay', message: 'NotiFlow API is up and running'}

}) 


//start server 
const start = async () => {
    try{
        await fastify.listen({port: 3000, host: '0.0.0.0'})
        console.log('Server is running on port 3000')
        console.log('Swagger UI available at http://localhost:3000/docs')
        console.log('Health check  http://localhost:3000/health')
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
} 


start()