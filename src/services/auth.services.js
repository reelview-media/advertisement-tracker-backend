const bcrypt = require("bcrypt");
const {
  findUserByEmail,
  createUser,
  updateLastLogin,
  updateUserActiveStatus,
} = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const handleCreateUserService = async ({
  full_name,
  email,
  password,
  confirmPassword,
  profile,
}) => {
  try {
    let user = await findUserByEmail(email);
    if (!user) {
      let hashedPassword = null;
      if (password && confirmPassword && password === confirmPassword) {
        hashedPassword = await bcrypt.hash(password, 10);
      } else if (password !== confirmPassword) {
        return { status: false, message: "Passwords do not match" };
      }

      user = await createUser({
        full_name: full_name
          ? full_name
          : profile
          ? profile.displayName
          : "Unknown User",
        email,
        profilePic: profile ? profile.photos[0].value : null,
        password: hashedPassword,
      });
    }

    await updateUserActiveStatus(email, true);
    const updatedUser = await updateLastLogin(email);

    const token = generateToken(
      { id: updatedUser.id, email: updatedUser.email },
      "1d"
    );

    return {
      status: true,
      message: "User created successfully",
      user: updatedUser,
      token,
    };
  } catch (error) {
    console.error("Error in handleCreateUserService:", error);
    return { status: false, message: "Server error during registration" };
  }
};

const handleLoginWithEmailService = async (user, password) => {
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return { status: false, message: "Invalid email or password" };

    const token = generateToken({ id: user.id, email: user.email });

    return {
      status: true,
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        profilePic: user.profilepic,
      },
      token,
    };
  } catch (error) {
    console.error("Login service error:", error);
    return { status: false, message: "Server error during login" };
  }
};

const handleLogoutService = async (email) => {
  await updateUserActiveStatus(email, false);
  return true;
};
module.exports = {
  handleCreateUserService,
  handleLogoutService,
  handleLoginWithEmailService,
};
