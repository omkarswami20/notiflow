const nodemailer = require('nodemailer')
require('dotenv').config()

const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM']
const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`❌ Missing SMTP env vars: ${missing.join(', ')}`)
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,        // false = STARTTLS on port 587 (correct for Gmail)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true  // enforce valid cert
  }
})

const verifyTransporter = async () => {
  console.log('🔍 Verifying SMTP connection...')
  try {
    await transporter.verify()
    console.log(`✅ SMTP ready — ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} as ${process.env.SMTP_USER}`)
  } catch (err) {
    console.error('❌ SMTP verify failed:', err.message)
    if (err.code) console.error('   code:', err.code)
    if (err.response) console.error('   response:', err.response)
    throw err
  }
}

const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error('sendEmail: missing "to" address')

  const mailOptions = {
    from:    process.env.SMTP_FROM,
    replyTo: 'noreply@notiflow.com',
    to,
    subject,
    html
  }

  console.log(`📤 Sending email → ${to} | subject: ${subject}`)

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`📧 Email sent to ${to} — ${info.messageId}`)
    return info
  } catch (err) {
    console.error(`❌ Email send failed → ${to}:`, err.message)
    if (err.code) console.error('   code:', err.code)
    if (err.response) console.error('   response:', err.response)
    if (err.command) console.error('   command:', err.command)
    throw err
  }
}

module.exports = { sendEmail, verifyTransporter, transporter }
