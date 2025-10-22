const { findUserByEmail } = require("../models/user.model");
const { registerUserService } = require("../services/auth.services");
const { generateToken } = require("../utils/jwt");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });

    // Save user info in session
    req.session.user = { id: user.id, email: user.email };

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const handleRegister = async (req, res) => {
  try {
    const { full_name, email, password, confirm_password } = req.body;
    const response = await registerUserService({
      full_name,
      email,
      password,
      confirm_password,
      session: req.session,
    });
    return res.status(response.status).json(response.body);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { handleLogin, handleRegister };
