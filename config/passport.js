const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const config = require('../config/config');

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false);
    console.log("Passowrd, hashed password" , password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log({isMatch})
    if (!isMatch) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: "/auth/google-redirect",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }
    const userByEmail = await User.findOne({email: profile.emails[0].value});
    if(userByEmail) {
      // Add googleId to user data
      userByEmail.googleId = profile.id;
      await userByEmail.save();
      return done(null, userByEmail);
    }
    const newUser = await User.create({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value
    });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

// Serialization and Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = User.findById(id);
    done(null, user);
  } catch (error) {
    return done(error)
  }
});
