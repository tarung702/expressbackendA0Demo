const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const jwt = require('jsonwebtoken');

// Backchannel Logout Endpoint
router.post('/', async (req, res) => {
  const logoutToken = req.body.logout_token;

  // Extract kid from the header and fetch the JWKS
  const header = JSON.parse(
    Buffer.from(logoutToken.split('.')[0], 'base64').toString('utf-8')
  );
  const kid = header.kid;
  const jwksUrl = `https://${auth0Config.domain}/.well-known/jwks.json`; // Replace with your Auth0 domain
  const jwksResponse = await fetch(jwksUrl);
  const jwks = await jwksResponse.json();

  // Find the public key based on kid
  const publicKey = jwks.keys.find((key) => key.kid === kid);

  if (!publicKey) {
    return res.status(400).json({ error: 'Invalid kid in the logout token' });
  }

  // Verify the logout token signature
  const verifyToken = (token, publicKey) => {
    try {
      jwt.verify(token, publicKey);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isValidToken = verifyToken(logoutToken, publicKey);

  if (!isValidToken) {
    return res.status(400).json({ error: 'Invalid logout token signature' });
  }

  // Get the session ID from the token and destroy the session
  const sid = JSON.parse(
    Buffer.from(logoutToken.split('.')[1], 'base64').toString('utf-8')
  ).sid;

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ message: 'User logged out successfully' });
  });
});

module.exports = router;
