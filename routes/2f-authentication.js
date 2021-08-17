var express = require("express");
var router = express.Router();

//Import speakeasy
const speakeasy = require("speakeasy");

//Import nodemailer
var nodemailer = require("nodemailer");

//Import user model into router
const User = require("../models/user");

//Handle users that are not authenticated.
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//GET handler for 2f authentication page.
router.get("/", IsLoggedIn, function (req, res, next) {
  res.render("2f-authentication", {
    title: "Authentication Step",
    user: req.user,
  });
});

//POST handler for 2f authentication page.
router.post("/", IsLoggedIn, function (req, res, next) {
  User.find(
    {
      username: req.user.username,
    },
    //Callback function
    async (err, goals) => {
      console.log(speakeasy.totp({secret: req.user.verificationCode, encoding: "base32"}));
      if (err) {
        console.log(err);
      } 
      else if (speakeasy.totp.verify({secret: req.user.verificationCode, encoding: "base32", token: req.body.verificationCode, window: 0})) {
        req.user.verificationAttempts += 1;
        try {
          await req.user.save();
        } catch (err) {
          console.log(err);
        }
        if (req.user.verificationAttempts >= 3) {
          req.user.verificationAttempts = 0;
          req.user.save();
          req.logout();
          res.redirect("/login");
        } else {
          res.render("2f-authentication", {
            failureValidation: "The code entered is not valid!",
            title: "Authentication Step",
            user: req.user,
          });
        }
      } else {
        res.render("auth-success", {
          title: "Congratulations!",
          user: req.user,
        });
      }
    }
  );
});

//GET handler for 2f authentication page/email.
router.get("/email", IsLoggedIn, function (req, res, next) {
  req.user.verificationCode = speakeasy.generateSecret({ length: 20 }).base32;
  req.user.save();
  console.log(speakeasy.totp({
    secret: req.user.verificationCode,
    encoding: "base32"}));

  //Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2f.auth.tutorial@gmail.com",
      pass: "Javascript*",
    },
    //Enables Node to accept self signed certificates.
    tls: {
      rejectUnauthorized: false,
    },
  });
  //Set up email options
  const mailOptions = {
    from: '"2F Auth"<2f.auth.tutorial@gmail.com>',
    to: req.user.username,
    subject: "2-F Authentication Tutorial",
    text: "Your validation code is "+speakeasy.totp({secret: req.user.verificationCode, encoding: "base32"}),
  };
  //Send email
  transporter.sendMail(mailOptions, function (err, info) {
    if (error) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.redirect("/2f-authentication");
});

//GET handler for 2f authentication page/sms.
router.get("/sms", IsLoggedIn, function (req, res, next) {
  res.redirect("/2f-authentication");
});

module.exports = router;
