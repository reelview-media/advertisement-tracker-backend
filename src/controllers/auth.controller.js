const { findUserByEmail } = require("../models/user.model");
const {
  handleCreateUserService,
  handleLogoutService,
  handleLoginWithEmailService,
} = require("../services/auth.services");
const { setAuthCookie, clearAuthCookie } = require("../utils/cookie");
const { verifyToken } = require("../utils/jwt");

const handleLoginWithEmailController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const response = await handleLoginWithEmailService(user, password);
    if (!response.status) {
      return res
        .status(401)
        .json({ success: false, message: response.message });
    }
    setAuthCookie(res, response.token);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: response.user,
      token: response.token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

const handleRegisterController = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword } = req.body;
    if (!full_name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userExist = await findUserByEmail(email);
    if (userExist)
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in instead.",
      });

    const response  = await handleCreateUserService({
      full_name,
      email,
      password,
      confirmPassword,
    });
    if (!response.status) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }
    setAuthCookie(res, response.token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: response.user,
      token: response.token,
    });
  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again.",
    });
  }
};

const handleLoginController = async (req, res) => {
  try {
    const { user, token } = await handleCreateUserService(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.APP_MODE === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:5173/dashboard");
  } catch (err) {
    console.error("Google callback error:", err.message);
    res.status(500).send("Login failed. Please try again.");
  }
};

const handlerLogoutController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    const decoded = await verifyToken(token);
    const email = decoded.email;
    const isActive = await handleLogoutService(email);
    if (isActive) {
      clearAuthCookie(res);
      if (req.session) {
        req.session.destroy((err) => {
          if (err) console.error("Session destroy error:", err);
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    }

    res.status(500).json({ success: false, message: "Logout failed" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

module.exports = {
  handleLoginController,
  handlerLogoutController,
  handleRegisterController,
  handleLoginWithEmailController,
};
