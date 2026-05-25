const pool = require('../../config/db')

const getMyNotifications = async ({ userId, page, limit }) => {
  const offset = (page - 1) * limit

  const result = await pool.query(
    `SELECT id, type, title, message, is_read, created_at 
     FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  )

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM notifications WHERE user_id = $1',
    [userId]
  )

  const total = parseInt(countResult.rows[0].count)

  return {
    data: result.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

const markAsRead = async ({ notificationId, userId }) => {
  const result = await pool.query(
    `UPDATE notifications 
     SET is_read = true 
     WHERE id = $1 AND user_id = $2 
     RETURNING id`,
    [notificationId, userId]
  )

  if (result.rows.length === 0) {
    throw new Error('Notification not found')
  }
}

const markAllRead = async ({ userId }) => {
  await pool.query(
    'UPDATE notifications SET is_read = true WHERE user_id = $1',
    [userId]
  )
}  // ✅ markAllRead yahan band hua

const deleteNotification = async ({ notificationId, userId }) => {
  const result = await pool.query(
    `DELETE FROM notifications 
     WHERE id = $1 AND user_id = $2 
     RETURNING id`,
    [notificationId, userId]
  )

  if (result.rows.length === 0) {
    throw new Error('Notification not found')
  }
}  // ✅ deleteNotification yahan band hua

const broadcastNotification = async ({ title, message }) => {
  const users = await pool.query('SELECT id FROM users')

  for (const user of users.rows) {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message) 
       VALUES ($1, $2, $3, $4)`,
      [user.id, 'ADMIN_BROADCAST', title, message]
    )
  }
}  // ✅ broadcastNotification yahan band hua

module.exports = { 
  getMyNotifications, 
  markAsRead, 
  markAllRead, 
  deleteNotification, 
  broadcastNotification 
}   






