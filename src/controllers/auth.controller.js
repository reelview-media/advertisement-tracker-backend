const {
  handleCreateUserService,
  handleLogoutService,
} = require("../services/auth.services");
const { verifyToken } = require("../utils/jwt");

//! This is login Controller. when user login................
const handleLoginController = async (req, res) => {
  try {
    //* handleCreateUserService This is user service . that connect to db and store user information.
    const { user, token } = await handleCreateUserService(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.APP_MODE === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:5173/dashboard"); //frontend url
  } catch (err) {
    console.error("Google callback error:", err.message);
    res.status(500).send("Login failed. Please try again.");
  }
};

//! When user click on  logout button controller...........
const handlerLogoutController = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = await verifyToken(token);
    const email = decoded.email;
    //* handleLogoutService This handler work when user click on logout button then in db is_Active status update false.
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

module.exports = { handleLoginController, handlerLogoutController };
