
'use strict'

const BRAND = {
  name: 'NotiFlow',
  color: '#7c3aed',
  colorLight: '#a78bfa',
  colorDark: '#5b21b6',
  footer: 'NotiFlow · Notification Engine',
  noreply: 'noreply@notiflow.com',
  tagline: 'Real-time Notifications, Delivered.'
}

// ─────────────────────────────────────
// Base layout wrapper
// ─────────────────────────────────────
const baseTemplate = ({ preheader = '', content = '' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>${BRAND.name}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0d0d1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d1a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%);
              border-radius:16px 16px 0 0;
              padding:36px 40px 32px;
              text-align:center;
            ">
              <!-- Logo mark -->
              <div style="margin-bottom:14px;">
                <span style="
                  display:inline-block;
                  background:rgba(255,255,255,0.15);
                  border:2px solid rgba(255,255,255,0.3);
                  border-radius:14px;
                  padding:10px 18px;
                  font-size:22px;
                  font-weight:800;
                  letter-spacing:-0.5px;
                  color:#ffffff;
                ">⚡ ${BRAND.name}</span>
              </div>
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:1.5px;text-transform:uppercase;">${BRAND.tagline}</p>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="
              background:#1a1a2e;
              padding:40px 40px 32px;
              border-left:1px solid rgba(124,58,237,0.2);
              border-right:1px solid rgba(124,58,237,0.2);
            ">
              ${content}
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="
              background:#1a1a2e;
              padding:0 40px;
              border-left:1px solid rgba(124,58,237,0.2);
              border-right:1px solid rgba(124,58,237,0.2);
            ">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(124,58,237,0.5),transparent);"></div>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="
              background:#141428;
              border-radius:0 0 16px 16px;
              border:1px solid rgba(124,58,237,0.2);
              border-top:none;
              padding:24px 40px;
              text-align:center;
            ">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">
                ${BRAND.footer}
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#4b5563;">
                <span style="color:#7c3aed;">📧</span> ${BRAND.noreply}
              </p>
              <p style="margin:0;font-size:11px;color:#374151;">
                You received this email because you have an account with ${BRAND.name}.<br/>
                Do not reply — this mailbox is not monitored.
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
// Reusable inner blocks
// ─────────────────────────────────────
const badge = (text, emoji) => `
  <div style="margin-bottom:24px;">
    <span style="
      display:inline-block;
      background:rgba(124,58,237,0.15);
      border:1px solid rgba(124,58,237,0.4);
      border-radius:999px;
      padding:6px 16px;
      font-size:12px;
      font-weight:600;
      color:#a78bfa;
      letter-spacing:0.5px;
      text-transform:uppercase;
    ">${emoji} ${text}</span>
  </div>
`

const heading = (text) => `
  <h1 style="
    margin:0 0 16px;
    font-size:26px;
    font-weight:800;
    color:#f1f5f9;
    line-height:1.3;
    letter-spacing:-0.5px;
  ">${text}</h1>
`

const paragraph = (text) => `
  <p style="
    margin:0 0 20px;
    font-size:15px;
    line-height:1.7;
    color:#94a3b8;
  ">${text}</p>
`

const highlight = (text) => `
  <div style="
    background:rgba(124,58,237,0.08);
    border-left:3px solid #7c3aed;
    border-radius:0 8px 8px 0;
    padding:14px 18px;
    margin:20px 0;
  ">
    <p style="margin:0;font-size:14px;color:#c4b5fd;line-height:1.6;">${text}</p>
  </div>
`

const iconRow = (emoji, label, value) => `
  <tr>
    <td style="padding:8px 0;vertical-align:top;">
      <span style="font-size:18px;">${emoji}</span>
    </td>
    <td style="padding:8px 0 8px 12px;vertical-align:top;">
      <span style="font-size:12px;color:#6b7280;display:block;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
      <span style="font-size:14px;color:#e2e8f0;font-weight:500;">${value}</span>
    </td>
  </tr>
`

// ─────────────────────────────────────
// TEMPLATE: WELCOME
// ─────────────────────────────────────
const welcomeTemplate = ({ name, email }) => {
  const content = `
    ${badge('New Account', '🎉')}
    ${heading(`Welcome aboard, ${name}! 👋`)}
    ${paragraph(`We're thrilled to have you as part of the <strong style="color:#c4b5fd;">${BRAND.name}</strong> community. Your account has been created and you're all set to go.`)}
    ${highlight(`Your account is active and ready. Start exploring the NotiFlow dashboard and stay on top of every notification that matters.`)}

    <!-- Account details box -->
    <div style="
      background:#0f0f1f;
      border:1px solid rgba(124,58,237,0.25);
      border-radius:12px;
      padding:20px 24px;
      margin:24px 0;
    ">
      <p style="margin:0 0 14px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Account Details</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${iconRow('✉️', 'Email', email)}
        ${iconRow('🔐', 'Status', 'Active & Verified')}
        ${iconRow('📅', 'Member since', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}
      </table>
    </div>

    ${paragraph(`If you have any questions or need help getting started, our team is always here for you.`)}

    <p style="margin:8px 0 0;font-size:14px;color:#64748b;">Cheers,<br/><strong style="color:#a78bfa;">The ${BRAND.name} Team ⚡</strong></p>
  `
  return baseTemplate({
    preheader: `Welcome to ${BRAND.name}, ${name}! Your account is ready.`,
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
    ${paragraph(`Hi <strong style="color:#e2e8f0;">${name}</strong>, your <strong style="color:#c4b5fd;">${BRAND.name}</strong> account password was recently updated.`)}

    <!-- Alert box -->
    <div style="
      background:rgba(239,68,68,0.06);
      border:1px solid rgba(239,68,68,0.25);
      border-radius:12px;
      padding:20px 24px;
      margin:24px 0;
    ">
      <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#fca5a5;">⚠️ Wasn't you?</p>
      <p style="margin:0;font-size:13px;color:#f87171;line-height:1.6;">
        If you did <strong>not</strong> make this change, your account may be compromised. 
        Please reset your password immediately and contact support.
      </p>
    </div>

    <!-- Change details -->
    <div style="
      background:#0f0f1f;
      border:1px solid rgba(124,58,237,0.25);
      border-radius:12px;
      padding:20px 24px;
      margin:24px 0;
    ">
      <p style="margin:0 0 14px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Change Details</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${iconRow('✉️', 'Account', email)}
        ${iconRow('🕐', 'Time', time)}
        ${iconRow('✅', 'Action', 'Password Updated Successfully')}
      </table>
    </div>

    ${paragraph(`For security, all other sessions may have been signed out. If this was you, no further action is needed.`)}

    <p style="margin:8px 0 0;font-size:14px;color:#64748b;">Stay secure,<br/><strong style="color:#a78bfa;">The ${BRAND.name} Security Team 🔐</strong></p>
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
    ${paragraph(`Hi <strong style="color:#e2e8f0;">${name || 'there'}</strong>,`)}
    ${highlight(message)}
    ${paragraph(`This is an official announcement from the <strong style="color:#c4b5fd;">${BRAND.name}</strong> team. Stay tuned for more updates.`)}
    <p style="margin:8px 0 0;font-size:14px;color:#64748b;">Best regards,<br/><strong style="color:#a78bfa;">The ${BRAND.name} Team ⚡</strong></p>
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
          <p style="margin:8px 0 0;font-size:14px;color:#64748b;">— <strong style="color:#a78bfa;">The ${BRAND.name} Team</strong></p>
        `
      })
  }
}

module.exports = { getEmailTemplate }
