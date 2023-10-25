const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Import the session manager module
const sessionManager = require('../sessionManager').default;

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
          console.error('Invalid logout token to BCL endpoint:', err);
          return res.status(400).json({
            error: 'Invalid logout token',
            logoutToken: logoutToken,
          });
        } else {
          // Loop through all active sessions and destroy the Auth0 sessions
          sessionManager.destroyAuth0Sessions((sessionID) => {
            console.log(
              `Auth0 Session ${sessionID} destroyed via BCL endpoint.`
            );
          });

          console.log('All Auth0 sessions destroyed via BCL endpoint.');

          // Now, destroy the local session
          sessionManager.destroyLocalSession(req.sessionID, (err) => {
            if (err) {
              console.error('Error destroying local session:', err);
            }
            console.log(
              `Local session ${req.sessionID} destroyed via BCL endpoint.`
            );
          });

          console.log('Local session destroyed via BCL endpoint.');

          return res.status(200).json({
            message:
              'All user sessions destroyed successfully via BCL endpoint',
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
