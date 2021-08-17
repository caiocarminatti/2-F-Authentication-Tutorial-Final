var express = require("express");
var router = express.Router();

//GET handler for logout page.
router.get("/", function (req, res, next) {
  req.user.verificationAttempts = 0;
  req.user.verificationStatus = false;
  req.user.save();
  req.logout();
  res.redirect("login");
});

module.exports = router;
