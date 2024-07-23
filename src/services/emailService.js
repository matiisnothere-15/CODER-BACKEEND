const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

const sendEmail = (to, subject, text, html = null) => {
    const mailOptions = {
        from: config.emailUser,
        to,
        subject,
        text, 
        html
    };

    return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = (userEmail, token) => {
    const resetLink = `${config.baseUrl}/reset-password?token=${token}`;
    const emailText = `Click ${resetLink} to reset your password. This link will expire in 1 hour.`;
    const emailHtml = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`; 

    return sendEmail(userEmail, 'Password Reset', emailText, emailHtml);
};

module.exports = {
    sendPasswordResetEmail,
    sendEmail
};
