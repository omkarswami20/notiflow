const { 
  getMyNotifications, 
  markAsRead, 
  markAllRead, 
  deleteNotification, 
  broadcastNotification 
} = require('./notification.service')
const { sendSuccess, sendError } = require('../../utils/response.utils')

const getNotifications = async (request, reply) => {
  try {
    const data = await getMyNotifications({
      userId: request.user.id,
      page: request.query.page,
      limit: request.query.limit
    })
    return sendSuccess(reply, data, 'Notifications fetched')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}

const readNotification = async (request, reply) => {
  try {
    await markAsRead({
      notificationId: request.params.id,
      userId: request.user.id
    })
    return sendSuccess(reply, null, 'Marked as read')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}

const readAllNotifications = async (request, reply) => {
  try {
    await markAllRead({ userId: request.user.id })
    return sendSuccess(reply, null, 'All marked as read')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}

const removeNotification = async (request, reply) => {
  try {
    await deleteNotification({
      notificationId: request.params.id,
      userId: request.user.id
    })
    return sendSuccess(reply, null, 'Notification deleted')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}

const broadcast = async (request, reply) => {
  try {
    await broadcastNotification(request.body)
    return sendSuccess(reply, null, 'Broadcast sent successfully')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}

module.exports = { 
  getNotifications, 
  readNotification, 
  readAllNotifications, 
  removeNotification, 
  broadcast 
}