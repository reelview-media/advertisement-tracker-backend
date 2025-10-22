const {
  findUserByEmail,
  createUser,
  updateLastLogin,
} = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const handlerCreateUser = async ({ profile, email, profilePic }) => {
  let user = await findUserByEmail(email);

  if (!user) {
    user = await createUser({
      full_name: profile.displayName || "Unknown",
      email,
      profilePic: profilePic || "",
    });
  }

  const updatedUser = await updateLastLogin(email);
  
  const token = generateToken({ id: updatedUser.id, email: updatedUser.email }, "1d");

  return { user: updatedUser, token };
};
module.exports = { handlerCreateUser };
