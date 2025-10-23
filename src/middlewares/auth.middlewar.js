const { verifyToken } = require("../utils/jwt");

const handleProtectRoute = (req, res, next) => {
  try {
    const token = req.cookies.token; // token from cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // verify token
    const decoded = verifyToken(token);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { handleProtectRoute };
