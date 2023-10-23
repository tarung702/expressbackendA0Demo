const express = require('express');
const router = express.Router();

// Local Logout route
router.get('/', (req, res) => {
  console.log('req.sessionID:', req.sessionID);
  // Check if the user's local session exists
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log(`Local session ${req.sessionID} destroyed.`);
        res.status(200).json({ message: 'Logged out locally.' });
      }
    });
  } else {
    res.status(200).json({ message: 'No active local session found.' });
  }
});

module.exports = router;
