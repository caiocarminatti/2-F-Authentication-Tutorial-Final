var express = require("express");
var router = express.Router();

//Import user model into router
const User = require("../models/user");

//Import passport
const passport = require("passport");

//GET handler for login page.
router.get('/', function(req, res, next) {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { messages: messages });
});

//POST handler for login page.
router.post("/", passport.authenticate('local', {
  successRedirect: "/2f-authentication",
  failureRedirect: "/login",
  failureMessage: "Username and/or Password are not valid!"
})); 

module.exports = router;