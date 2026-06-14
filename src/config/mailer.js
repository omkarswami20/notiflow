const { Resend } = require('resend')
require('dotenv').config()

const required = ['RESEND_API_KEY']
const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`❌ Missing Resend env vars: ${missing.join(', ')}`)
}

// Instantiate Resend conditionally to prevent constructor crash on boot if key is empty
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const verifyTransporter = async () => {
  console.log('🔍 Verifying Resend API configuration...')
  if (!resend) {
    console.error('❌ RESEND_API_KEY is not defined in environment variables.')
    throw new Error('RESEND_API_KEY is missing')
  }

  try {
    // Attempt to list domains to verify API key validity.
    // If the key only has restricted sending-only permissions, it might return a 403 Forbidden.
    // That is still an authentication success, so we handle it.
    const { error } = await resend.domains.list()
    if (error) {
      if (error.statusCode === 403 || error.message?.includes('Forbidden') || error.message?.includes('permission')) {
        console.log('✅ Resend API key verified (sending permissions only)')
        return
      }
      throw new Error(error.message || JSON.stringify(error))
    }
    console.log('✅ Resend API connection ready (domains verified)')
  } catch (err) {
    console.error('❌ Resend API verification failed:', err.message)
    throw err
  }
}

const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error('sendEmail: missing "to" address')
  if (!resend) {
    throw new Error('Cannot send email: RESEND_API_KEY is not configured')
  }

  // Resend free tier requires sending from onboarding@resend.dev by default,
  // or a verified custom domain if configured in SMTP_FROM.
  const from = process.env.SMTP_FROM || 'onboarding@resend.dev'

  console.log(`📤 Sending email via Resend → ${to} | subject: ${subject}`)

  try {
    const { data, error } = await resend.emails.send({
      from,
      replyTo: 'noreply@notiflow.com',
      to,
      subject,
      html
    })

    if (error) {
      throw new Error(error.message || JSON.stringify(error))
    }

    console.log(`📧 Email sent to ${to} — ${data.id}`)
    return { messageId: data.id }
  } catch (err) {
    console.error(`❌ Email send failed → ${to}:`, err.message)
    throw err
  }
}

module.exports = { sendEmail, verifyTransporter, resend }

