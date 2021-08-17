var express = require("express");
var router = express.Router();
const User = require("../models/user");

//GET handler for sign up page.
router.get("/", function (req, res, next) {
  res.render("sign-up", { title: "Sign Up" });
});

//POST handler for sign up page.
router.post("/", function (req, res, next) {
  User.findOne({ username: req.body.username }, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      //Checks if the username already exists;
      if (docs == null) {
        //Checks if the username is empty;
        if (req.body.username != "") {
          //Checks if the phone number is empty;
          if (req.body.phonenumber != "") {
            //Checks if the password is empty;
            if (req.body.password != "") {
              //Checks if the passwords entered do not match.
              if (req.body.password === req.body.confirmpassword) {
                User.register(
                  new User({
                    username: req.body.username,
                    phoneNumber: req.body.phonenumber,
                  }),
                  //Sent separately for encryption
                  req.body.password,
                  (err, newUser) => {
                    if (err) {
                      console.log(err);
                    } else {
                      req.login(newUser, (err) => {
                        res.redirect("/account-created");
                      });
                    }
                  }
                );
              } else {
                res.render("sign-up", {
                  title: "Sign Up",
                  validation: "Passwords do not match!",
                  username: req.body.username,
                  phonenumber: req.body.phonenumber,
                  password: req.body.password,
                  confirmpassword: req.body.confirmpassword,
                });
              }
            } else {
              res.render("sign-up", {
                title: "Sign Up",
                validation: "Password cannot be empty!",
                username: req.body.username,
                phonenumber: req.body.phonenumber,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
              });
            }
          } else {
            res.render("sign-up", {
              title: "Sign Up",
              validation: "Phone Number cannot be empty!",
              username: req.body.username,
              phonenumber: req.body.phonenumber,
              password: req.body.password,
              confirmpassword: req.body.confirmpassword,
            });
          }
        } else {
          res.render("sign-up", {
            title: "Sign Up",
            validation: "Username cannot be empty!",
            username: req.body.username,
            phonenumber: req.body.phonenumber,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
          });
        }
      } else {
        res.render("sign-up", {
          title: "Sign Up",
          validation: "Username already exists!",
          username: req.body.username,
          phonenumber: req.body.phonenumber,
          password: req.body.password,
          confirmpassword: req.body.confirmpassword,
        });
      }
    }
  });
});

module.exports = router;
