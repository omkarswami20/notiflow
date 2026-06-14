const { getNotifications, readNotification, readAllNotifications, removeNotification, broadcast, sendCustomNotification } = require('./notification.controller')
const { authenticate } = require('../../middlewares/auth.middleware')
const { role } = require('../../middlewares/role.middleware')
const { getNotificationsSchema, broadcastSchema } = require('./notification.schema')

const notificationRoutes = async (fastify, options) => {
  fastify.get('/', {
    schema: { ...getNotificationsSchema, tags: ['Notifications'] },
    preHandler: [authenticate]
  }, getNotifications)

  fastify.post('/send', {
    schema: { tags: ['Notifications'] },
    preHandler: [authenticate]
  }, sendCustomNotification)

  fastify.patch('/:id/read', {
    schema: { tags: ['Notifications'] },
    preHandler: [authenticate]
  }, readNotification)

  fastify.patch('/read-all', {
    schema: { tags: ['Notifications'] },
    preHandler: [authenticate]
  }, readAllNotifications)

  fastify.delete('/:id', {
    schema: { tags: ['Notifications'] },
    preHandler: [authenticate]
  }, removeNotification)

  fastify.post('/broadcast', {
    schema: { ...broadcastSchema, tags: ['Notifications'] },
    preHandler: [authenticate, role('admin')]
  }, broadcast)
}

module.exports = notificationRoutes