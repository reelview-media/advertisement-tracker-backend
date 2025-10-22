const express = require("express");
const router = express.Router();
//* All Handler related to login.....
const { handleLogin, handleRegister } = require("../controllers/auth.controller");

//* POST /api/v1/login
router.post("/login", handleLogin);
//* POST /api/v1/register
router.post("/register", handleRegister);

module.exports = router;

