const { register, login, logout, changeUserPassword } = require('./auth.controller')
const { authenticate } = require('../../middlewares/auth.middleware')
const { registerSchema, loginSchema, changePasswordSchema } = require('./auth.schema')

const authRoutes = async (fastify, options) => {
  fastify.post('/register', { 
    schema: registerSchema,
    preHandler: [] 
  }, register)

  fastify.post('/login', { 
    schema: loginSchema,
    preHandler: [] 
  }, login)

  fastify.post('/logout', { 
    preHandler: [authenticate] 
  }, logout)

  fastify.patch('/change-password', { 
    schema: changePasswordSchema,
    preHandler: [authenticate] 
  }, changeUserPassword)
}

module.exports = authRoutes