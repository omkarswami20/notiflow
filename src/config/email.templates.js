'use strict'

const BRAND = {
  name: 'NotiFlow',
  color: '#8b5cf6', // Violet
  colorLight: '#c4b5fd',
  colorDark: '#6d28d9',
  footer: 'NotiFlow Inc. · Notification Engine',
  noreply: 'noreply@notiflow.com',
  tagline: 'Real-time Notifications, Delivered.'
}

// ─────────────────────────────────────
// Base layout wrapper (Vercel/Linear Dark Theme)
// ─────────────────────────────────────
const baseTemplate = ({ preheader = '', content = '' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>${BRAND.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" type="text/css">
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    
    /* Responsive styles */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 20px !important; }
      .card-body { padding: 32px 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;color:#e4e4e7;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090b;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card Container -->
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#121214;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2);">
          
          <!-- Top Gradient Accent Line -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%);"></td>
          </tr>

          <!-- ── HEADER ── -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;">
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.25);
                    border-radius:12px;
                    padding:8px 16px;
                    font-size:18px;
                    font-weight:800;
                    letter-spacing:-0.5px;
                    color:#a78bfa;
                  ">
                    ⚡ ${BRAND.name}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY CONTENT ── -->
          <tr>
            <td class="card-body" style="padding:0px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent);"></div>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#0d0d0f;padding:32px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.03);">
              <p style="margin:0 0 8px;font-size:12px;color:#71717a;font-weight:500;">
                ${BRAND.footer}
              </p>
              <p style="margin:0 0 16px;font-size:12px;color:#a1a1aa;">
                <span style="color:#8b5cf6;font-size:14px;vertical-align:middle;margin-right:4px;">✉️</span> ${BRAND.noreply}
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;line-height:1.5;">
                You received this transactional email because you have an account with ${BRAND.name}.<br/>
                Please do not reply to this email, as this inbox is unmonitored.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`

// ─────────────────────────────────────
// Reusable UI components
// ─────────────────────────────────────
const badge = (text, emoji) => `
  <div style="margin-bottom:20px;">
    <span style="
      display:inline-block;
      background:rgba(139, 92, 246, 0.08);
      border:1px solid rgba(139, 92, 246, 0.2);
      border-radius:999px;
      padding:6px 14px;
      font-size:11px;
      font-weight:600;
      color:#c4b5fd;
      letter-spacing:0.8px;
      text-transform:uppercase;
    ">${emoji}&nbsp;&nbsp;${text}</span>
  </div>
`

const heading = (text) => `
  <h1 style="
    margin:0 0 16px;
    font-size:24px;
    font-weight:800;
    color:#f4f4f5;
    line-height:1.3;
    letter-spacing:-0.5px;
  ">${text}</h1>
`

const paragraph = (text) => `
  <p style="
    margin:0 0 20px;
    font-size:14px;
    line-height:1.6;
    color:#a1a1aa;
  ">${text}</p>
`

const highlight = (text) => `
  <div style="
    background:rgba(139, 92, 246, 0.04);
    border-left:3px solid #8b5cf6;
    border-radius:0 8px 8px 0;
    padding:14px 18px;
    margin:20px 0;
  ">
    <p style="margin:0;font-size:13px;color:#c4b5fd;line-height:1.5;">${text}</p>
  </div>
`

const iconRow = (emoji, label, value) => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:top;width:28px;">
      <span style="font-size:16px;">${emoji}</span>
    </td>
    <td style="padding:12px 12px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle;">
      <span style="font-size:11px;color:#52525b;display:block;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:2px;">${label}</span>
      <span style="font-size:13px;color:#e4e4e7;font-weight:500;">${value}</span>
    </td>
  </tr>
`

// ─────────────────────────────────────
// TEMPLATE: WELCOME
// ─────────────────────────────────────
const welcomeTemplate = ({ name, email }) => {
  const content = `
    ${badge('Welcome', '✨')}
    ${heading(`Welcome to NotiFlow, ${name}! 👋`)}
    ${paragraph(`We're thrilled to have you join our developer platform. Your account is active and you are now fully equipped to construct robust, high-performance notification pipelines.`)}
    ${highlight(`Get started by checking out the Swagger API docs to send your first custom push, email, or webhook notifications.`)}

    <!-- Account Details Widget -->
    <div style="
      background:#18181b;
      border:1px solid rgba(255,255,255,0.04);
      border-radius:12px;
      padding:20px 24px;
      margin:24px 0;
    ">
      <p style="margin:0 0 10px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Account Details</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${iconRow('✉️', 'Email address', email)}
        ${iconRow('🔐', 'Status', 'Active & Verified')}
        ${iconRow('📅', 'Joined on', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}
      </table>
    </div>

    ${paragraph(`Need help? We've got you covered. Reach out to our developer support team at any time.`)}

    <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
      Cheers,<br/>
      <strong style="color:#a78bfa;font-weight:600;">The ${BRAND.name} Team ⚡</strong>
    </p>
  `
  return baseTemplate({
    preheader: `Welcome to ${BRAND.name}, ${name}! Your developer account is ready.`,
    content
  })
}

// ─────────────────────────────────────
// TEMPLATE: PASSWORD_CHANGE
// ─────────────────────────────────────
const passwordChangeTemplate = ({ name, email }) => {
  const time = new Date().toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
  })

  const content = `
    ${badge('Security Alert', '🔒')}
    ${heading(`Password Changed`)}
    ${paragraph(`Hi ${name}, the password for your <strong style="color:#c4b5fd;">${BRAND.name}</strong> account was recently updated.`)}

    <!-- Alert Box -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="
      background:rgba(239,68,68,0.03);
      border:1px solid rgba(239,68,68,0.15);
      border-radius:12px;
      margin:24px 0;
    ">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fca5a5;">⚠️ Wasn't you?</p>
          <p style="margin:0;font-size:12px;color:#f87171;line-height:1.6;">
            If you did not make this change, your account may be compromised. Please reset your password immediately and contact support.
          </p>
        </td>
      </tr>
    </table>

    <!-- Change details widget -->
    <div style="
      background:#18181b;
      border:1px solid rgba(255,255,255,0.04);
      border-radius:12px;
      padding:20px 24px;
      margin:24px 0;
    ">
      <p style="margin:0 0 10px;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Event Details</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${iconRow('✉️', 'Account', email)}
        ${iconRow('🕐', 'Timestamp', time)}
        ${iconRow('🛡️', 'Status', 'Secure & Closed')}
      </table>
    </div>

    ${paragraph(`For your safety, we have logged out all other sessions on other devices.`)}

    <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
      Stay secure,<br/>
      <strong style="color:#a78bfa;font-weight:600;">The ${BRAND.name} Security Team 🔐</strong>
    </p>
  `
  return baseTemplate({
    preheader: `Security alert: Your ${BRAND.name} password was changed.`,
    content
  })
}

// ─────────────────────────────────────
// TEMPLATE: ADMIN_BROADCAST
// ─────────────────────────────────────
const broadcastTemplate = ({ name, title, message }) => {
  const content = `
    ${badge('Announcement', '📢')}
    ${heading(title)}
    ${paragraph(`Hi ${name || 'there'},`)}
    ${highlight(message)}
    ${paragraph(`This is an official announcement regarding updates to the <strong style="color:#c4b5fd;">${BRAND.name}</strong> engine. Let us know if you have feedback.`)}
    
    <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
      Best regards,<br/>
      <strong style="color:#a78bfa;font-weight:600;">The ${BRAND.name} Team ⚡</strong>
    </p>
  `
  return baseTemplate({
    preheader: title,
    content
  })
}

// ─────────────────────────────────────
// Main resolver — pick template by type
// ─────────────────────────────────────
const getEmailTemplate = ({ type, name, email, title, message }) => {
  switch (type) {
    case 'WELCOME':
      return welcomeTemplate({ name, email })

    case 'PASSWORD_CHANGE':
      return passwordChangeTemplate({ name, email })

    case 'ADMIN_BROADCAST':
      return broadcastTemplate({ name, title, message })

    default:
      // Generic fallback
      return baseTemplate({
        preheader: title,
        content: `
          ${badge('Notification', '🔔')}
          ${heading(title)}
          ${paragraph(message)}
          <p style="margin:24px 0 0;font-size:13px;color:#71717a;line-height:1.5;">
            Regards,<br/>
            <strong style="color:#a78bfa;font-weight:600;">The ${BRAND.name} Team</strong>
          </p>
        `
      })
  }
}

module.exports = { getEmailTemplate }
