const express = require('express');
const router = express.Router();

// Local Logout route
router.get('/', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Redirect to the home page or any other desired route after local logout
      res.redirect('/');
    }
  });
});

module.exports = router;
