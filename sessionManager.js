import session from 'express-session';
const MemoryStore = require('memorystore')(session);

const activeSessions = {};

export default {
  activeSessions,
  sessionStore: new MemoryStore({
    checkPeriod: 86400000, // Prune expired entries every 24 hours
  }),
};
