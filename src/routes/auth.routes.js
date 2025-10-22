const express = require("express");
const passport = require("passport");
const { handlerLoginUser, handlerLogoutUser } = require("../controllers/auth.controller");

const router = express.Router();

// Step 1: redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  handlerLoginUser
);

//* Logout ....
router.get("/logout", handlerLogoutUser);

module.exports = router;
