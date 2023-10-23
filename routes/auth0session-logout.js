const express = require('express');
const router = express.Router();

// Auth0 Logout route
router.get('/', (req, res) => {
  // Add code here to end the Auth0 session

  const auth0Config = {
    domain: 'raah-poc.us.auth0.com', // Replace with your Auth0 domain
    clientId: 'sIKzinA6Ps8x7A3CEJP4Cc6H4VeRYRUr', // Replace with your Auth0 client ID
    returnTo: 'https://expressbackenda0demo.adaptable.app/localsession-logout', // Redirect to local-logout route
  };

  const logoutUrl = `https://raah-poc.us.auth0.com/v2/logout?client_id=sIKzinA6Ps8x7A3CEJP4Cc6H4VeRYRUr&returnTo=http://localhost:3000/localsession-logout`;

  // Redirect to Auth0 logout URL to end the Auth0 session
  res.redirect(logoutUrl);
});

module.exports = router;
