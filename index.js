// Package imports
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

// Create the express app
const app = express()

// define middleware functions
const LoginPage = {

  /**
   * Sets the session for express.
   */
  session: (options) => {

    return session({
      secret: options.sessionName || 'loginCredentials',
      resave: false,
      saveUninitialized: true,
      unset: 'destroy',
      name: options.sessionName || 'loginCredentials',
      cookie: {
        maxAge: (options.sessionMaxAge) ?
                 options.sessionMaxAge :
                 (1000 * 60 * 60 * 24)
      }
    })
  },

  /**
   * Configures the express session and sets one
   * if one doesn't exist.
   */
  configure: (options) => {
    return (req, res, next) => {
      if (!req.session.LoginPage) req.session.LoginPage = { loggedIn: false }
      next();
    }
  },

  /**
   * Login functionality that checks whether the user
   * has access, or needs to login.
   */
  login: (req, res, next, options) => {

    // Determine the template to use
    let loginPage = `${__dirname}/templates/login.html`;
    if (options.loginPage) loginPage = options.loginPage;

    // If logged in, continue.
    if (req.session.LoginPage && req.session.LoginPage.loggedIn) return next();

    // This is a login attempt, let's check everything.
    if (req.body && req.body.LoginPage__Username && req.body.LoginPage__Password) {

      // Make sure users is an array.
      if (!Array.isArray(options.users)) return next();

      // Find the user index
      const userIndex = options.users.findIndex(u => u.username === req.body.LoginPage__Username);

      // If it wasn't found, stop here
      if (userIndex === -1) return res.sendFile(loginPage);

      // Check if the password matches that user.
      if (options.users[userIndex].password !== req.body.LoginPage__Password) return res.sendFile(loginPage);

      // Set logged in to true.
      req.session.LoginPage.loggedIn = true;

      // Determine the redirect path
      let redirectPath = '/';
      if (options.redirectPath) redirectPath = options.redirectPath;

      // Redirect to the correct path
      res.redirect(redirectPath);
    }

    // Show the login page if we get here.
    res.sendFile(loginPage);
  }
}

module.exports = function(options) {
  return [
    bodyParser.urlencoded({
      extended: true
    }),
    LoginPage.session(options),
    LoginPage.configure(options),

    // Pass options to login as well.
    (req, res, next) => LoginPage.login(req, res, next, options)
  ]
}
