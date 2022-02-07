
const User = require('../models/user')
const path = require("path");
const fs = require("fs");
const hbs = require("handlebars");
const sgMail = require("@sendgrid/mail");


if (!process.env.SENDGRID_KEY) {
  throw new Error("SEND GRID KEY IS MISSING FROM ENV");
}

sgMail.setApiKey(process.env.SENDGRID_KEY);
const send_signup_email = async (userId) => {
  try {
    let fileName = "index.html" ;
  let user = await User.findOne({_id : userId})
  console.log(user)
    if (user) {
      let htmlPath = path.join(__dirname, `emailTemplate/${fileName}`);
      let readFile = fs.readFileSync(htmlPath, "utf-8");
      const template = hbs.compile(readFile);
      const html = template({
        name: user.name.toUpperCase(),
        email: user.email,
        msg : "Hello , this is signup email"
      });
      const msg = {
        to: user.email,
        from: process.env.EMAIL_NAME,
        subject: "SIGNUP-EMAIL",
        html: html,
      };
      await sgMail.send(msg);
    } else {
      console.log("User Not Found");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {send_signup_email}
