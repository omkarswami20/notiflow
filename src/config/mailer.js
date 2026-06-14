const nodemailer = require('nodemailer')
const { Resend } = require('resend')
require('dotenv').config()

let resend = null
let transporter = null
const useResend = !!process.env.RESEND_API_KEY
const useBrevo = !!process.env.BREVO_API_KEY

if (useResend) {
  resend = new Resend(process.env.RESEND_API_KEY)
} else if (!useBrevo) {
  // Fallback to Nodemailer SMTP for local development (only if Resend and Brevo are not configured)
  transporter = nodemailer.createTransport({
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
}

const verifyTransporter = async () => {
  if (useResend) {
    console.log('🔍 Verifying Resend API configuration...')
    try {
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
  } else if (useBrevo) {
    console.log('🔍 Verifying Brevo API configuration...')
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is defined but empty')
    }
    console.log('✅ Brevo API configuration ready')
  } else {
    console.log('🔍 Verifying SMTP connection...')
    try {
      await transporter.verify()
      console.log(`✅ SMTP ready — ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} as ${process.env.SMTP_USER}`)
    } catch (err) {
      console.error('❌ SMTP verify failed:', err.message)
      throw err
    }
  }
}

const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error('sendEmail: missing "to" address')

  const from = process.env.SMTP_FROM || (useResend ? 'onboarding@resend.dev' : 'NotiFlow <noreply@notiflow.com>')

  if (useResend) {
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

      console.log(`📧 Email sent via Resend to ${to} — ${data.id}`)
      return { messageId: data.id }
    } catch (err) {
      console.error(`❌ Resend Email send failed → ${to}:`, err.message)
      throw err
    }
  } else if (useBrevo) {
    console.log(`📤 Sending email via Brevo API → ${to} | subject: ${subject}`)
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'NotiFlow',
            email: from.includes('<') ? from.split('<')[1].replace('>', '').trim() : from
          },
          to: [{ email: to }],
          subject,
          htmlContent: html
        })
      })

      const responseBody = await response.json()
      if (!response.ok) {
        throw new Error(responseBody.message || JSON.stringify(responseBody))
      }

      console.log(`📧 Email sent via Brevo to ${to} — ${responseBody.messageId}`)
      return { messageId: responseBody.messageId }
    } catch (err) {
      console.error(`❌ Brevo Email send failed → ${to}:`, err.message)
      throw err
    }
  } else {
    console.log(`📤 Sending email via SMTP → ${to} | subject: ${subject}`)
    const mailOptions = {
      from,
      replyTo: 'noreply@notiflow.com',
      to,
      subject,
      html
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      console.log(`📧 Email sent via SMTP to ${to} — ${info.messageId}`)
      return info
    } catch (err) {
      console.error(`❌ SMTP Email send failed → ${to}:`, err.message)
      throw err
    }
  }
}

module.exports = { sendEmail, verifyTransporter, resend, transporter }

