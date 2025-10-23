const express = require("express");
const { handleProtectRoute } = require("../middlewares/auth.middlewar");

const router = express.Router();

router.get("/dashboard", handleProtectRoute, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
});

module.exports = router;
