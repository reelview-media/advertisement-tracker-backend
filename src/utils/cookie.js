const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.APP_MODE === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, 
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.APP_MODE === "production",
    sameSite: "lax",
  });
};

module.exports = { setAuthCookie, clearAuthCookie };
