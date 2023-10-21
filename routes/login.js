const express = require('express');
const passport = require('passport');
const router = express.Router();

// Login route
router.get(
  '/',
  passport.authenticate('auth0', { scope: 'openid email profile' })
);

module.exports = router;
