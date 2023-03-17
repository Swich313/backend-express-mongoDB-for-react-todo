const nodemailer = require('nodemailer');

require('dotenv/config');
const sendEmail = (email, mailOptions) => {
    const smtpConfig = {
        host: 'smtp.ukr.net',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_UKR_NET,
            pass: process.env.PASS_UKR_NET_IMAP,
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    transporter.sendMail(mailOptions,
        (err, info) => {
            err ? console.log(err) : console.log(`Email sent to: ${email}, response: ${info.response}`);
        })
};

exports.sendEmail = sendEmail;





