const express = require("express");
const { verifyToken } = require("../utils/jwt");
const { handleProtectRoute } = require("../middlewares/auth.middlewar");

const router = express.Router();

router.get("/me", handleProtectRoute, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user, // info from token
  });
});

module.exports = router;
