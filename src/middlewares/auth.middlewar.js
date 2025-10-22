const { verifyToken } = require("../utils/jwt");

const handleProtectRoute = (req, res, next) => {
  try {
    const token = req.cookies.token; // token from cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // verify token
    const decoded = verifyToken(token);
    req.user = decoded; // attach user info to request
    next(); // allow access
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { handleProtectRoute };
