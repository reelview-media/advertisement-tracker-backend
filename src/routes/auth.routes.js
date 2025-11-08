const express = require("express");
const passport = require("passport");
const {
  handlerLogoutController,
  handleLoginController,
  handleRegisterController,
  handleLoginWithEmailController,
} = require("../controllers/auth.controller");
const { handleProtectRoute } = require("../middlewares/auth.middlewar");

const router = express.Router();

router.post("/login",handleLoginWithEmailController);
router.post("/register", handleRegisterController);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",   //controll choose email
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  handleLoginController
);

router.get("/logout", handleProtectRoute, handlerLogoutController);

module.exports = router;
