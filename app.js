const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const ejs = require('ejs');
const path = require('path');
const fetch = require('isomorphic-fetch');
const jwt = require('jsonwebtoken');
const MemoryStore = require('memorystore')(session);

const app = express();
const port = process.env.PORT || 3000;

const activeSessions = {};

// Configure Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Express session
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24 hours
    }),
    secret: 'your-session-secret', // Set your session secret here
    resave: false,
    saveUninitialized: true,
  })
);

// Configure Passport with Auth0 strategy
const auth0Config = {
  domain: 'raah-poc.us.auth0.com',
  clientID: 'sIKzinA6Ps8x7A3CEJP4Cc6H4VeRYRUr',
  clientSecret:
    'rBvqCEyHFoo0gu4uEPq83zkuPfGVpQxOaVxnjvSH9jxXrpNyXDOOMOzda2VF1zBn',
  callbackURL: 'https://expressbackenda0demo.adaptable.app/callback', // Update with your callback URL
};

// Inside the Auth0 authentication callback
passport.use(
  new Auth0Strategy(
    {
      ...auth0Config,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, extraParams, profile, done) => {
      // Store user information in session for use in the app
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        idToken: extraParams.id_token,
        accessToken: accessToken,
        auth0Session: req.session, // Store Auth0 Session
        refreshToken: refreshToken,
      };

      // Store the session in the centralized storage
      activeSessions[req.sessionID] = req.session;

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Define routes
const indexRoute = require('./routes/index');
const loginRoute = require('./routes/login');
const callbackRoute = require('./routes/callback');
const localLogoutRoute = require('./routes/localsession-logout'); // Local Logout route
const auth0LogoutRoute = require('./routes/auth0session-logout'); // Auth0 Logout route
const profileRoute = require('./routes/profile');
const backchannelLogoutRoute = require('./routes/backchannel-logout'); // OIDC backchannel-logout route

// Use routes for specific functionalities
app.use('/', indexRoute); // Home page
app.use('/login', loginRoute); // Login route
app.use('/callback', callbackRoute); // Callback route
app.use('/localsession-logout', localLogoutRoute); // Local Logout route
app.use('/auth0session-logout', auth0LogoutRoute); // Auth0 Logout route
app.use('/profile', profileRoute); // Profile route
app.use('/backchannel-logout', backchannelLogoutRoute); // Backchannel Logout route

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
