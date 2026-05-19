const sendSuccess = (
  reply,
  data,
  message = 'Success',
  statusCode = 200
) => {
  return reply.code(statusCode).send({
    success: true,
    message,
    data
  })
}

const sendError = (
  reply,
  message = 'Something went wrong',
  statusCode = 500
) => {
  return reply.code(statusCode).send({
    success: false,
    message,
    data: null
  })
}

module.exports = {
  sendSuccess,
  sendError
}