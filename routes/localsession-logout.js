const express = require('express');
const router = express.Router();

// Import the activeSessions object from app.js
const { activeSessions } = require('../app');

// Local Logout route
router.get('/', (req, res) => {
  console.log('req.sessionID:', req.sessionID);
  console.log('activeSessions keys:', Object.keys(activeSessions));
  // Check if the user's session exists in activeSessions
  if (req.sessionID in activeSessions) {
    activeSessions[req.sessionID].destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log(`Session ${req.sessionID} destroyed locally.`);
        res.status(200).json({ message: 'Logged out locally.' });
      }
    });
  } else {
    res.status(200).json({ message: 'No active session found.' });
  }
});

module.exports = router;
