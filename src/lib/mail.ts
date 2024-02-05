import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.DOMAIN}/auth/new-verification?token=${token}`;
    
    const htmlContent = `
    <html>
    <head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
        }
        .email-content {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
        }
        .email-content h1 {
            color: #333333;
        }
        .email-content p {
            color: #666666;
        }
        .confirm-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            color: #ffffff;
            background-color: #3498db;
            text-decoration: none;
            border-radius: 3px;
        }
    </style>
    </head>
    <body>
    <div class="email-content">
        <h1>Hello / Xin chào,</h1>
        <p>Thank you for registering. Please click the link below to confirm your registration / Cảm ơn bạn đã đăng ký. Vui lòng nhấp vào liên kết dưới đây để xác nhận đăng ký của bạn:</p>
        <a class="confirm-link" href="${confirmLink}">Confirm Registration / Xác nhận đăng ký</a>
    </div>
    </body>
    </html>
    `;
    
    await resend.emails.send({
        from: 'Awesome manga by NDK <onboarding@resend.dev>',
        to: email,
        subject: "Please verify your email / Vui lòng xác nhận email của bạn",
        html: htmlContent
    });

};