const config = require('../config.json');

const nodemailer = require('nodemailer');

async function  sendmail({to,subject,text,from = config.emailFrom}){
    const transpoter = nodemailer.createTransport(config.smtpOptions);

    return await transpoter.sendMail({from,to,subject,text}); 
}

module.exports = sendmail;