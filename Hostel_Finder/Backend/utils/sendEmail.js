const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Debug: log the email being used (not password for security)
    console.log('Sending email using:', process.env.SMTP_EMAIL);
    console.log('To:', options.email);

    // Use Gmail service directly for better compatibility
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            // Remove spaces from App Password if any
            pass: process.env.SMTP_PASSWORD?.replace(/\s/g, '')
        }
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email send error:', error.message);
        console.error('Full error:', error);
        throw error;
    }
};

module.exports = sendEmail;
