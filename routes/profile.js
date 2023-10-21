// routes/profile.js

const express = require('express');
const router = express.Router();

// Profile route
router.get('/', (req, res) => {
  const idToken = req.user ? req.user.idToken : null; // Get ID Token
  const accessToken = req.user ? req.user.accessToken : null; // Get Access Token
  const auth0Session = req.user ? req.user.auth0Session : null; // Get Auth0 session
  const localSession = req.session ? req.session : null; // Get Local session

  res.render('profile', {
    user: req.user,
    idToken,
    accessToken,
    auth0Session,
    localSession,
  });
});

module.exports = router;
