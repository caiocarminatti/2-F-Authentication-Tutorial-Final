var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

//Set up routers.
var indexRouter = require('./routes/index');
var accountCreatedRouter = require('./routes/account-created');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var signUpRouter = require('./routes/sign-up');
var authenticationRouter = require('./routes/2f-authentication');
var authSuccessRouter = require('./routes/auth-success');

//Import Passport and Session.
const passport = require('passport');
const session = require('express-session');

var app = express();

//View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Configure Passport.
app.use(session({
  secret: '2f-authentication-tutorial',
  resave: false,
  saveUninitialized: false
}));

//Initialize passport session and set express-session to passport to handle user sessions.
app.use(passport.initialize());
app.use(passport.session());

//Link Passport to the Users model
const User = require('./models/user');
passport.use(User.createStrategy());

//Passport to read and write information from the session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/sign-up', signUpRouter);
app.use('/account-created', accountCreatedRouter);
app.use('/2f-authentication', authenticationRouter);
app.use('/auth-success', authSuccessRouter);

//Mongoose connection
const connectionString =  'mongodb+srv://admin:JavascriptTutorial@cluster0.kw0hw.mongodb.net/2f-authentication-tutorial';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((message) => {
    console.log('Connected succesfully!');
  })
  .catch((err) => {
    console.log(err);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
