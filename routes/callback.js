// routes/callback.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Callback route
router.get(
  '/',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  (req, res, next) => {
    // Redirect to the profile page
    res.redirect('/profile');
  }
);

module.exports = router;
