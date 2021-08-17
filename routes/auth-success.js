var express = require('express');
var router = express.Router();

//Handle users that are not authenticated.
function IsLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//Handle users that did not pass the 2f authentication.
function passed2fVerification(req, res, next) {
  if (req.user.verificationStatus == true) {
    return next();
  }
  res.redirect("/2f-authentication");
}

//GET handler for account-created page.
router.get('/', IsLoggedIn, passed2fVerification, function(req, res, next) {
  res.render('auth-success', { user: req.user });
});

module.exports = router;
