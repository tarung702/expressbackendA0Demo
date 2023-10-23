const MemoryStore = require('memorystore')(session);

const activeSessions = {};

module.exports = {
  activeSessions,
  sessionStore: new MemoryStore({
    checkPeriod: 86400000, // Prune expired entries every 24 hours
  }),
};
