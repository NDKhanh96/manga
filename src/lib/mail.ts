import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const htmlContent = (header: string, content: string, link: string, text: string) => {
    return `
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
        <h1>${header}</h1>
        <p>${content}:</p>
        <a class="confirm-link" href="${link}">${text}</a>
    </div>
    </body>
    </html>
    `;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const forgotPasswordLink = `${process.env.DOMAIN}/auth/new-password?token=${token}`;
    
    await resend.emails.send({
        from: 'Awesome manga by NDK <onboarding@resend.dev>',
        to: email,
        subject: "Reset your password",
        html: htmlContent('Hello', 'To confirm registration', forgotPasswordLink, 'Please click the link below to reset your password')
    });
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.DOMAIN}/auth/new-verification?token=${token}`;
    
    await resend.emails.send({
        from: 'Awesome manga by NDK <onboarding@resend.dev>',
        to: email,
        subject: "Please verify your email",
        html: htmlContent('Hello', 'Thank you for registering. Please click the link below to confirm your registration', confirmLink, 'To reset your password')
    });

};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: 'Awesome manga by NDK <onboarding@resend.dev>',
        to: email,
        subject: "Two factor authentication token",
        html: htmlContent('Two factor authentication token', 'Token', '', token)
    });
};