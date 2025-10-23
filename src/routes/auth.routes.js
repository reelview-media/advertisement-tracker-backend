const express = require("express");
const passport = require("passport");
const {handlerLogoutController, handleLoginController } = require("../controllers/auth.controller");
const { handleProtectRoute } = require("../middlewares/auth.middlewar");

const router = express.Router();

//! Step 1: redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//! Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  handleLoginController
);

//! Logout Routes...............
router.get("/logout", handleProtectRoute, handlerLogoutController);

module.exports = router;
