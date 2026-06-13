const redis = require('../../config/redis')
const pool = require('../../config/db')
const { sendEmail } = require('../../config/mailer')
const { getEmailTemplate } = require('../../config/email.templates')

const QUEUE_KEY = 'notiflow:queue'
const BRPOP_TIMEOUT = 5

const logError = (label, err) => {
  console.error(`❌ ${label}:`, err.message)
  if (err.code) console.error('   code:', err.code)
  if (err.stack) console.error(err.stack)
}

const pushToQueue = async (job) => {
  if (!job?.userId || !job?.email || !job?.type) {
    throw new Error(`Invalid queue job — missing fields: ${JSON.stringify(job)}`)
  }

  await redis.lpush(QUEUE_KEY, JSON.stringify(job))
  console.log(`📬 Job pushed to queue: ${job.type} → ${job.email}`)
}

const processQueue = async () => {
  console.log('⚙️  Notification queue processor started')

  while (true) {
    let job = null
    let notificationId = null

    try {
      const result = await redis.brpop(QUEUE_KEY, BRPOP_TIMEOUT)

      if (!result) {
        continue  // timeout — no job yet, loop again
      }

      // brpop returns [queueKey, payload]
      const raw = Array.isArray(result) ? result[1] : result
      if (!raw) {
        console.error('❌ brpop returned empty payload:', result)
        continue
      }

      try {
        job = JSON.parse(raw)
      } catch (parseErr) {
        logError('Queue job JSON parse failed', parseErr)
        console.error('   raw payload:', raw)
        continue
      }

      if (!job?.userId || !job?.email || !job?.type) {
        console.error('❌ Invalid job payload — skipping:', JSON.stringify(job))
        continue
      }

      console.log(`⚙️  Processing job: ${job.type} → ${job.email} (userId: ${job.userId})`)

      const notif = await pool.query(
        `INSERT INTO notifications (user_id, type, title, message)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [job.userId, job.type, job.title, job.message]
      )
      notificationId = notif.rows[0].id
      console.log(`💾 Notification saved to DB — id: ${notificationId}`)

      try {
        console.log(`📤 Attempting email send → ${job.email}`)
        const html = getEmailTemplate({
          type:    job.type,
          name:    job.name || job.email.split('@')[0],
          email:   job.email,
          title:   job.title,
          message: job.message
        })
        await sendEmail({
          to:      job.email,
          subject: job.title,
          html
        })

        await pool.query(
          `INSERT INTO notification_queue_log (notification_id, status, processed_at)
           VALUES ($1, $2, NOW())`,
          [notificationId, 'sent']
        )
        console.log(`✅ Job complete: ${job.type} → ${job.email}`)
      } catch (emailErr) {
        logError(`Email failed for ${job.email}`, emailErr)

        try {
          await pool.query(
            `INSERT INTO notification_queue_log (notification_id, status, processed_at, error_message)
             VALUES ($1, $2, NOW(), $3)`,
            [notificationId, 'failed', emailErr.message]
          )
        } catch (logErr) {
          logError('Failed to write email failure log to DB', logErr)
        }
      }
    } catch (err) {
      logError('Queue processing error', err)
      if (job) {
        console.error('   failed job:', JSON.stringify(job))
      }
      // small delay to prevent CPU spinning on repeated errors
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}

module.exports = { pushToQueue, processQueue }
