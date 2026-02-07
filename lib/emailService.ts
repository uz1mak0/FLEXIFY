import nodemailer from 'nodemailer';

// Configure your email service
// For Gmail, you need to generate an App Password
// For other services, adjust the configuration accordingly

const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 * @returns {Promise} Email sending result
 */
export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@flexify.com',
    to: email,
    subject: 'Password Reset OTP - FLEXIFY',
    html: getOTPEmailTemplate(otp)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Get HTML template for OTP email
 * @param {string} otp - OTP code
 * @returns {string} HTML email template
 */
const getOTPEmailTemplate = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
                color: #ffffff;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                letter-spacing: 2px;
            }
            .content {
                padding: 30px;
            }
            .message {
                color: #333333;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            .otp-box {
                background-color: #f0f9ff;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-label {
                color: #666666;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #3b82f6;
                letter-spacing: 2px;
                font-family: 'Courier New', monospace;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666666;
                font-size: 12px;
                border-top: 1px solid #e0e0e0;
            }
            .warning {
                color: #dc3545;
                font-size: 12px;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>FLEXIFY</h1>
            </div>
            <div class="content">
                <p class="message">
                    Hello,
                </p>
                <p class="message">
                    You have requested to reset your password. Use the OTP below to proceed with resetting your password.
                </p>
                <div class="otp-box">
                    <p class="otp-label">Your One-Time Password (OTP)</p>
                    <p class="otp-code">${otp}</p>
                </div>
                <p class="message">
                    This OTP will expire in 10 minutes. If you did not request this, please ignore this email.
                </p>
                <p class="warning">
                    <strong>Security Notice:</strong> Never share this code with anyone. FLEXIFY staff will never ask for your OTP.
                </p>
            </div>
            <div class="footer">
                <p>© 2024 FLEXIFY. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
