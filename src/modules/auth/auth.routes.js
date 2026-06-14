const { register, login, logout, changeUserPassword, refresh } = require('./auth.controller')
const { authenticate } = require('../../middlewares/auth.middleware')
const { registerSchema, loginSchema, changePasswordSchema, refreshSchema } = require('./auth.schema')

const authRoutes = async (fastify, options) => {
  fastify.post('/register', {
    schema: { ...registerSchema, tags: ['Auth'] },
    preHandler: []
  }, register)

  fastify.post('/login', {
    schema: { ...loginSchema, tags: ['Auth'] },
    preHandler: []
  }, login)

  fastify.post('/logout', {
    schema: { tags: ['Auth'] },
    preHandler: [authenticate]
  }, logout)

  fastify.patch('/change-password', {
    schema: { ...changePasswordSchema, tags: ['Auth'] },
    preHandler: [authenticate]
  }, changeUserPassword)

  fastify.post('/refresh', {
    schema: { ...refreshSchema, tags: ['Auth'] },
    preHandler: []
  }, refresh)
}

module.exports = authRoutes