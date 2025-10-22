const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findUserByEmail, createUser } = require("../models/user.model");

// Google OAuth configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await findUserByEmail(email);

    if (!user) {
      // Create new user if doesn't exist
      user = await createUser({
        full_name: profile.displayName,
        email,
        hashedPassword: "", // OAuth user may not have password
        phone: null
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // Optional: fetch user from DB
  const user = await findUserByEmail(id); 
  done(null, user);
});

module.exports = passport;
