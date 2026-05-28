const { sendError } = require('../utils/response.utils')

const role = (requiredRole) => {
  return async (request, reply) => {
    if (request.user.role !== requiredRole) {
      return sendError(reply, 'Access denied', 403)
    }
  }
}

module.exports = { role }