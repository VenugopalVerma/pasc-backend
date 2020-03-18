const User = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
// ===PASSWORD RECOVER AND RESET

function validateRecover(data) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
  });
  return schema.validate(data);
}

async function sendMail(user,link) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // let link =
    

  const mailOptions = {
    from: process.env.EMAIL, // sender address
    to: user.email, // list of receivers
    subject: "Password change request", // Subject line
    text: `Hi ${user.displayName} \n 
                Please click on the following link ${link} to reset your password. \n\n 
               If you did not request this, please ignore this email and your password will remain unchanged.\n`
    // html: "<b>Hello world?</b>" // html body
  };

  //   let info = await transporter.sendMail(mailOptions);

  
try {
  const promise = await transporter.sendMail(mailOptions);
  // const promise = Promise.reject({msg : "Venugopal"});
  console.log("sending mail", promise);
  return promise;
} catch (error) {
  console.log("sending mail error", error);
  return error;
}
  
}

module.exports = {
  sendMail
};
module.exports.validateRecover = validateRecover;
