const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/User'); // Assuming you have a User model for MongoDB

const app = express();

app.use(
  session({
    secret: 'your_session_secret', // Add your own session secret
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const discordConfig = {
    clientID: 'Y1116067357941579787',
    clientSecret: 'i-eRSdMnCBeqbE95TSyeLYB1EupEDgl7',
    callbackURL: 'http://localhost:3000/auth/discord/callback',
  };  

passport.use(
  new DiscordStrategy(discordConfig, (accessToken, refreshToken, profile, done) => {
    User.findOne({ discordId: profile.id }).then((existingUser) => {
      if (existingUser) {
        done(null, existingUser);
      } else {
        const newUser = new User({
          discordId: profile.id,
          username: profile.username,
          // Add any additional user properties here
        });
        newUser.save().then((savedUser) => {
          done(null, savedUser);
        });
      }
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

const PORT = 3000; // Replace with your desired port number

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
