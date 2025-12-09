const nodemailer = require('nodemailer');

const isMailConfigured = Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS);

const transporter = isMailConfigured
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  : null;

const sendVerificationEmail = async (email, token) => {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  if (!transporter) {
    console.log('[mailer] Verification link:', verificationUrl);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@smartcampus.edu',
    to: email,
    subject: 'Verify your Smart Campus account',
    text: `Click on the link to verify your account: ${verificationUrl}`,
    html: `<p>Click on the link to verify your account:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  });
};

const sendResetPasswordEmail = async (email, token) => {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  if (!transporter) {
    console.log('[mailer] Reset password link:', resetUrl);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'no-reply@smartcampus.edu',
    to: email,
    subject: 'Reset your Smart Campus password',
    text: `Reset your password using this link: ${resetUrl}`,
    html: `<p>Reset your password using this link:</p><a href="${resetUrl}">${resetUrl}</a>`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
