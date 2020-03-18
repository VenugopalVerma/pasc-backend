var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_SENDER_EMAIL,
        pass: process.env.MAIL_SENDER_EMAIL_PASSWORD
    }
});

verificationMail = function(receiver, verifyurl) {
    var mailOptions = {
        from: process.env.MAIL_SENDER_EMAIL,
        to: 'pradyumnaraje.patil@gmail.com',
        subject: 'Verification email',
        html: `<p>You Can verfiy your account by clicking on the <a href="${verifyurl}">Link</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent:' + info.response);
        }
    });
}


var options = {
    mongodb: process.env.MONGODB_URL,
    googleAuth: {
        id: 'tera google CLIENTID',
        secret: 'TERA GOOGLE SECRET',
    },
    recapcha: {
        secretKey: 'this is where your secret key goes'
    }
}

module.exports = {
    verificationMail,
    options
}