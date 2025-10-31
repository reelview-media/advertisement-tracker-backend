const bcrypt = require('bcrypt');
const {
  findUserByEmail,
  createUser,
  updateLastLogin,
  updateUserActiveStatus,
} = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const handleCreateUserService = async ({ full_name, email, password, confirmPassword,profile }) => {
  let user = await findUserByEmail(email);
  if (!user) {
    let hashedPassword = null;
    if (password && confirmPassword && password === confirmPassword) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    user = await createUser({
      full_name: full_name?full_name:profile?profile.displayName :"Unknown User",
      email,
      profilePic:profile?profile.photos[0].value : null,
      password: hashedPassword,
    });
  }

  await updateUserActiveStatus(email, true);
  const updatedUser = await updateLastLogin(email);

  const token = generateToken(
    { id: updatedUser.id, email: updatedUser.email },
    "1d"
  );

  return { user: updatedUser, token };
};

const handleLogoutService = async (email) => {
  await updateUserActiveStatus(email, false);
  return true;
};
module.exports = { handleCreateUserService, handleLogoutService };
