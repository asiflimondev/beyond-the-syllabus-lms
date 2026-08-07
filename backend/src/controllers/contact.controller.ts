import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const sendContactEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required',
      });
      return;
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Beyond the Syllabus" <${process.env.EMAIL_USER}>`,
      to: 'info@beyondthesyllabus.org, beyondthesyllabus121@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f1592a, #df481c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { padding: 8px 12px; background: white; border-radius: 4px; border: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📬 New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">📱 Phone</div>
                <div class="value">${phone || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="label">📝 Subject</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error: any) {
    console.error('Send contact email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};