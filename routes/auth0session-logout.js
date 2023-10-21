const express = require('express');
const router = express.Router();

// Auth0 Logout route
router.get('/', (req, res) => {
  // Add code here to end the Auth0 session

  const auth0Config = {
    domain: 'raah-poc.us.auth0.com', // Replace with your Auth0 domain
    clientId: 'sIKzinA6Ps8x7A3CEJP4Cc6H4VeRYRUr', // Replace with your Auth0 client ID
    returnTo: 'http://localhost:3000/localsession-logout', // Redirect to local-logout route
  };

  const logoutUrl = `https://${auth0Config.domain}/v2/logout?client_id=${auth0Config.clientId}&returnTo=${auth0Config.returnTo}`;

  // Redirect to Auth0 logout URL to end the Auth0 session
  res.redirect(logoutUrl);
});

module.exports = router;
