const { findUserByEmail } = require("../models/user.model");
const {
  handleCreateUserService,
  handleLogoutService,
} = require("../services/auth.services");
const { verifyToken } = require("../utils/jwt");

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

    const { user, token } = await handleCreateUserService({
      full_name,
      email,
      password,
      confirmPassword,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.APP_MODE === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
    });
  } catch(error) {
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
    const decoded = await verifyToken(token);
    const email = decoded.email;
    const isActive = await handleLogoutService(email);
    if (isActive) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.APP_MODE === "production",
        sameSite: "lax",
      });
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
};
