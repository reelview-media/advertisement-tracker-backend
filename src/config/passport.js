const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findUserByEmail, createUser } = require("../models/user.model");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8081/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Safe email extraction
        const email = profile.emails?.[0]?.value || profile._json?.email;
        if (!email) return done(new Error("No email found in Google profile"));

        const profilePic = profile.photos?.[0]?.value || null;

        console.log("profile Picture",profile.photos[0].value ,profile)

        // Pass the Google profile + extracted info to the service layer
        done(null, { profile, email, profilePic });
      } catch (err) {
        done(err, null);
      }
    }
  )
);



passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser(async (email, done) => {
  try {
    const user = await findUserByEmail(email);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
