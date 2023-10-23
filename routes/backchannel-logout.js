const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa'); // Add jwks-rsa module

// Backchannel Logout Endpoint
router.post('/', async (req, res) => {
  const logoutToken = req.body.logout_token;

  // Create a JWKS client
  const client = jwksClient({
    jwksUri: 'https://raah-poc.us.auth0.com/.well-known/jwks.json',
  });

  try {
    // Verify and decode the logout token
    jwt.verify(
      logoutToken,
      (header, callback) => {
        // Use the JWKS client to get the public key
        client.getSigningKey(header.kid, (err, key) => {
          if (err) {
            return callback(err);
          }
          const signingKey = key.publicKey || key.rsaPublicKey;
          callback(null, signingKey);
        });
      },
      (err, decoded) => {
        if (err) {
          console.error('Invalid logout token:', err);
          return res.status(400).json({
            error: 'Invalid logout token',
            logoutToken: logoutToken,
          });
        } else {
          // Extract session ID from the decoded token
          const sid = decoded.sid;

          // Session cleanup logic here
          req.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            console.log(`Session ${sid} destroyed.`);
            return res
              .status(200)
              .json({ message: 'User logged out successfully' });
          });
        }
      }
    );
  } catch (error) {
    console.error('Error handling backchannel-logout:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
