const { handlerCreateUser } = require("../services/auth.services");

const handlerLoginUser = async (req, res) => {
  try {
    // Pass the full object returned by Passport
    const { user, token } = await handlerCreateUser(req.user);

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

const handlerLogoutUser = (req, res) => {
  try {
    // Clear JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.APP_MODE === "production",
      sameSite: "lax",
    });

    // Destroy session
    if (req.session) {
      req.session.destroy(err => {
        if (err) console.error("Session destroy error:", err);
      });
    }

    // Redirect or send response
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};



module.exports = { handlerLoginUser,handlerLogoutUser };
