const pool = require('../../config/db')
const { hashPassword, comparePassword } = require('../../utils/hash.utils')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt.utils')
const { pushToQueue } = require('../notification/notification.queue')

const registerUser = async ({ name, email, password }) => {
  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  if (existingUser.rows.length > 0) {
    throw new Error('User with this email already exists')
  }

  const hashedPassword = await hashPassword(password)

  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role`,
    [name, email, hashedPassword]
  )

  // Fire and forget — API response wait nahi karega
  pushToQueue({
    userId: result.rows[0].id,
    name:   name,
    email:  email,
    type:   'WELCOME',
    title:  'Welcome to NotiFlow! 🎉',
    message: `Hi ${name}, your account has been created successfully.`
  }).catch(err => {
    console.error('❌ Queue push failed [WELCOME]:', err.message)
    console.error('   user:', result.rows[0].id, '|', email)
  })

  return result.rows[0]
}

const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password')
  }

  const user = result.rows[0]

  const isMatch = await comparePassword(
    password,
    user.password
  )

  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  const accessToken = signAccessToken({
    id: user.id,
    role: user.role
  })

  const refreshToken = signRefreshToken({
    id: user.id
  })

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
    [user.id, refreshToken]
  )

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}

const logoutUser = async ({ userId, refreshToken }) => {
  await pool.query(
    `UPDATE refresh_tokens
     SET is_revoked = true
     WHERE user_id = $1
     AND token = $2`,
    [userId, refreshToken]
  )
}

const changePassword = async ({
  userId,
  oldPassword,
  newPassword
}) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )

  if (result.rows.length === 0) {
    throw new Error('User not found')
  }

  const user = result.rows[0]

  const isMatch = await comparePassword(
    oldPassword,
    user.password
  )

  if (!isMatch) {
    throw new Error('Old password is incorrect')
  }

  const hashedPassword = await hashPassword(newPassword)

  await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashedPassword, userId]
  )

  // Fire and forget
  pushToQueue({
    userId:  userId,
    name:    user.name,
    email:   user.email,
    type:    'PASSWORD_CHANGE',
    title:   'Password Changed',
    message: 'Your NotiFlow password was recently changed. If this was not you, contact support immediately.'
  }).catch(err => {
    console.error('❌ Queue push failed [PASSWORD_CHANGE]:', err.message)
    console.error('   user:', userId, '|', user.email)
  })
}

const refreshAccessToken = async ({ refreshToken }) => {
  // 1. Verify token signature and expiry
  const decoded = verifyRefreshToken(refreshToken)

  // 2. Check token in Database (revocation & DB expiry check)
  const result = await pool.query(
    `SELECT rt.*, u.id as user_id, u.role, u.email 
     FROM refresh_tokens rt
     JOIN users u ON rt.user_id = u.id
     WHERE rt.token = $1 AND rt.is_revoked = false AND rt.expires_at > NOW()`,
    [refreshToken]
  )

  if (result.rows.length === 0) {
    throw new Error('Refresh token is invalid, revoked, or expired')
  }

  const user = result.rows[0]

  // 3. Generate new access token
  const accessToken = signAccessToken({
    id: user.user_id,
    role: user.role
  })

  return { accessToken }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  refreshAccessToken
}