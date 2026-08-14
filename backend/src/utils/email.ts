import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter with Hostinger SMTP settings
const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // false for port 587 (STARTTLS)
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER || 'info@beyondthesyllabus.org',
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
};

// Send email using SMTP
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    console.log(`📧 Attempting to send email to: ${options.to}`);
    console.log(`📧 Subject: ${options.subject}`);
    console.log(`📧 Using SMTP (port ${process.env.SMTP_PORT || '587'})`);

    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || 'info@beyondthesyllabus.org';
    const fromName = 'Beyond the Syllabus';

    // BCC the sender to see a copy
    const bcc = process.env.SMTP_USER || 'info@beyondthesyllabus.org';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
      bcc: bcc,
    });

    console.log(`✅ Email sent successfully to ${options.to}`);
    console.log(`✅ Message ID: ${info.messageId}`);
    console.log(`✅ Response: ${info.response}`);
    console.log(`📬 BCC copy sent to: ${bcc}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

// ============================================
// WELCOME EMAIL TEMPLATES
// ============================================

// Plain text version of welcome email
export const generateWelcomeEmailText = (
  fullName: string,
  admissionId: string,
  programName: string,
  frontendUrl: string
): string => {
  return `
Dear ${fullName},

Welcome to Beyond the Syllabus — your trusted Cambridge English Preparation Centre!

Your admission has been successfully processed.

Admission ID: ${admissionId}
Program: ${programName}

Please complete your registration using your Admission ID:
${frontendUrl}/student-register

After registration, you can login at:
${frontendUrl}/login

Need help? Contact us at info@beyondthesyllabus.org

© ${new Date().getFullYear()} Beyond the Syllabus. All rights reserved.
  `;
};

// HTML version of welcome email
export const generateWelcomeEmail = (
  fullName: string,
  admissionId: string,
  programName: string,
  frontendUrl: string
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Beyond the Syllabus</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a365d 0%, #0d9488 100%);
      padding: 32px 40px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .header .subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-top: 8px;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #1a365d;
      margin-bottom: 8px;
    }
    .message {
      color: #4a5568;
      font-size: 16px;
      margin-bottom: 24px;
    }
    .details-card {
      background: #f7fafc;
      border-radius: 12px;
      padding: 24px;
      margin: 20px 0;
      border-left: 4px solid #0d9488;
    }
    .details-card .label {
      font-size: 12px;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .details-card .value {
      font-size: 18px;
      font-weight: 600;
      color: #1a365d;
      margin-top: 2px;
    }
    .details-card .value.code {
      font-family: 'Courier New', monospace;
      background: #edf2f7;
      padding: 4px 12px;
      border-radius: 6px;
      display: inline-block;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #1a365d 0%, #0d9488 100%);
      color: #ffffff;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s ease;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .instruction {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .instruction .title {
      font-weight: 600;
      color: #92400e;
      font-size: 14px;
    }
    .instruction .steps {
      color: #78350f;
      font-size: 14px;
      margin-top: 4px;
      padding-left: 20px;
    }
    .instruction .steps li {
      margin: 4px 0;
    }
    .footer {
      background: #f7fafc;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #718096;
      font-size: 13px;
      margin: 4px 0;
    }
    .footer .brand {
      font-weight: 600;
      color: #1a365d;
    }
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    @media (max-width: 480px) {
      .content { padding: 24px; }
      .header { padding: 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Beyond the Syllabus</h1>
      <div class="subtitle">Cambridge English Preparation Centre</div>
    </div>

    <div class="content">
      <div class="greeting">Dear ${fullName},</div>

      <p class="message">
        Welcome to <strong>Beyond the Syllabus</strong> — your trusted Cambridge English Preparation Centre!
        We are thrilled to have you join our learning community.
      </p>

      <div class="details-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div>
            <div class="label">Admission ID</div>
            <div class="value code">${admissionId}</div>
          </div>
          <div style="text-align: right;">
            <div class="label">Program</div>
            <div class="value">${programName}</div>
          </div>
        </div>
      </div>

      <p style="color: #4a5568; font-size: 15px;">
        Your admission has been successfully processed. Please complete your registration using your Admission ID.
      </p>

      <div style="text-align: center;">
        <a href="${frontendUrl}/student-register" class="button">Register Now</a>
      </div>

      <div class="instruction">
        <div class="title">🔑 How to Register</div>
        <ul class="steps">
          <li>Visit: <strong>${frontendUrl}/student-register</strong></li>
          <li>Enter your <strong>Admission ID</strong>: ${admissionId}</li>
          <li>Enter your email and create a password</li>
          <li>After registration, login at: <strong>${frontendUrl}/login</strong></li>
        </ul>
      </div>

      <hr class="divider">

      <p style="color: #4a5568; font-size: 14px; text-align: center;">
        <strong>Need help?</strong> Contact us at <a href="mailto:info@beyondthesyllabus.org" style="color: #0d9488; text-decoration: none;">info@beyondthesyllabus.org</a>
      </p>
    </div>

    <div class="footer">
      <p class="brand">Beyond the Syllabus</p>
      <p>Cambridge English Preparation Centre</p>
      <p style="font-size: 12px; color: #a0aec0;">
        © ${new Date().getFullYear()} Beyond the Syllabus. All rights reserved.
      </p>
      <p style="font-size: 12px; color: #a0aec0;">
        This email was sent to you as a registered student of Beyond the Syllabus.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// ============================================
// PASSWORD RESET EMAIL TEMPLATES
// ============================================

// Plain text version of reset email
export const generateResetEmailText = (
  fullName: string,
  resetLink: string
): string => {
  return `
Hello ${fullName},

We received a request to reset the password for your Beyond the Syllabus account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour and can only be used once.

If you didn't request this, please ignore this email.

Need help? Contact us at info@beyondthesyllabus.org

© ${new Date().getFullYear()} Beyond the Syllabus. All rights reserved.
  `;
};

// HTML version of reset email
export const generateResetEmail = (
  fullName: string,
  resetLink: string,
  frontendUrl: string
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a365d 0%, #0d9488 100%);
      padding: 28px 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .header .subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 13px;
      margin-top: 4px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1a365d;
      margin-bottom: 6px;
    }
    .message {
      color: #4a5568;
      font-size: 15px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #1a365d 0%, #0d9488 100%);
      color: #ffffff !important;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .warning-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 16px 0;
    }
    .warning-box .title {
      font-weight: 600;
      color: #92400e;
      font-size: 13px;
    }
    .warning-box .text {
      color: #78350f;
      font-size: 13px;
      margin-top: 4px;
    }
    .link-box {
      background: #f7fafc;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0;
      word-break: break-all;
      font-size: 13px;
      color: #1a365d;
      font-family: 'Courier New', monospace;
      border: 1px solid #e2e8f0;
    }
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    .footer {
      background: #f7fafc;
      padding: 20px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #718096;
      font-size: 12px;
      margin: 3px 0;
    }
    .footer .brand {
      font-weight: 600;
      color: #1a365d;
    }
    @media (max-width: 480px) {
      .content { padding: 20px; }
      .header { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Reset Your Password</h1>
      <div class="subtitle">Beyond the Syllabus · Cambridge English Preparation Centre</div>
    </div>

    <div class="content">
      <div class="greeting">Hello ${fullName},</div>

      <p class="message">
        We received a request to reset the password for your Beyond the Syllabus account.
        Click the button below to create a new password.
      </p>

      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>

      <p style="color: #718096; font-size: 13px; text-align: center;">
        Or copy and paste this link into your browser:
      </p>
      <div class="link-box">${resetLink}</div>

      <div class="warning-box">
        <div class="title">⚠️ Important Security Information</div>
        <div class="text">
          • This link will expire in <strong>1 hour</strong><br>
          • This link can only be used <strong>once</strong><br>
          • If you didn't request this, please ignore this email<br>
          • Never share this link with anyone
        </div>
      </div>

      <hr class="divider">

      <p style="color: #4a5568; font-size: 14px; text-align: center;">
        Need help? Contact us at <a href="mailto:info@beyondthesyllabus.org" style="color: #0d9488; text-decoration: none;">info@beyondthesyllabus.org</a>
      </p>
    </div>

    <div class="footer">
      <p class="brand">Beyond the Syllabus</p>
      <p>Cambridge English Preparation Centre</p>
      <p style="font-size: 11px; color: #a0aec0;">
        © ${new Date().getFullYear()} Beyond the Syllabus. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};