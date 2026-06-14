const { registerUser, loginUser, logoutUser, changePassword, refreshAccessToken } = require('./auth.service')
const { sendSuccess, sendError } = require('../../utils/response.utils')
///  for the register user also status code 201 for new user 
const register = async (request, reply) => {
  try {
    const user = await registerUser(request.body)
    return sendSuccess(reply, user, 'User registered successfully', 201)
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}

// for the login user also status code 200 for successful login

const login = async (request, reply) => {
  try {
    const data = await loginUser(request.body)
    return sendSuccess(reply, data, 'Login successful')
  } catch (err) {
    return sendError(reply, err.message, 401)
  }
}

// for the logout user also status code 200 for successful logout

const logout = async (request, reply) => {
  try {
    await logoutUser({
      userId: request.user.id,
      refreshToken: request.body.refreshToken
    })
    return sendSuccess(reply, null, 'Logged out successfully')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}


// for the change password also status code 200 for successful password change

const changeUserPassword = async (request, reply) => {
  try {
    await changePassword({
      userId: request.user.id,
      ...request.body
    })
    return sendSuccess(reply, null, 'Password changed successfully')
  } catch (err) {
    return sendError(reply, err.message, 400)
  }
}


const refresh = async (request, reply) => {
  try {
    const data = await refreshAccessToken({
      refreshToken: request.body.refreshToken
    })
    return sendSuccess(reply, data, 'Token refreshed successfully')
  } catch (err) {
    return sendError(reply, err.message, 401)
  }
}

// exports ()
module.exports = { register, login, logout, changeUserPassword, refresh }