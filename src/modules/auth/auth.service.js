const pool = require('../../config/db');

const { hashPassword, comparePassword } = require('../../utils/hash.utils');
const { signAccessToken, signRefreshToken } = require('../../utils/jwt.utils');


const registerUser = async ({ name, email, password }) => {

    //check if user with the same email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists')
    }

    //hash the password before storing it in the database
    const hashedPassword = await hashPassword(password);

    //store the user in the database (insert the user into the database and return the inserted user)
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, hashedPassword]
    )

    return result.rows[0]


}

const loginUser = async ({ email, password }) => {
  // 1. Check if user exists
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password')
  }

  const user = result.rows[0]

  // 2. Compare password
  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  // 3. Generate tokens
  const accessToken = signAccessToken({ id: user.id, role: user.role })
  const refreshToken = signRefreshToken({ id: user.id })

  // 4. Store refresh token in DB
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
    [user.id, refreshToken]
  )

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  }
} 

const logoutUser = async ({ userId, refreshToken }) => {
  // Revoke refresh token in DB
  await pool.query(
    'UPDATE refresh_tokens SET is_revoked = true WHERE user_id = $1 AND token = $2',
    [userId, refreshToken]
  )
}

const changePassword = async ({ userId, oldPassword, newPassword }) => {
  // 1. Get user from DB
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )

  if (result.rows.length === 0) {
    throw new Error('User not found')
  }

  const user = result.rows[0]

  // 2. Verify old password
  const isMatch = await comparePassword(oldPassword, user.password)
  if (!isMatch) {
    throw new Error('Old password is incorrect')
  }

  // 3. Hash new password and update
  const hashedPassword = await hashPassword(newPassword)
  await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashedPassword, userId]
  )
} 


module.exports = { registerUser, loginUser, logoutUser, changePassword }