'use strict';
const nodemailer = require('nodemailer');
const config = require('../../config').Auth.nodemailer;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    pool: true,
    auth: {
        user: config.user,
        pass: config.password
    }
});

module.exports = function(to, subject = 'empty', html = '', text = '') {

    const mailOptions = {
        from: '"No Reply" <noreply@example.com>', // sender address
        to: to, // list of receivers, Can Be arry of emails or coma seperated list of emails(as string)..
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };

    // send mail with defined transport object
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                console.log('Message %s sent: %s', info.messageId, info.response);
                resolve(info);
            }
        });
    });

};
