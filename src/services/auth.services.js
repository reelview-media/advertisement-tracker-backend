const {
  findUserByEmail,
  createUser,
  updateLastLogin,
  updateUserActiveStatus,
} = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

//! This handler work is call user_model and store user info in db.
const handleCreateUserService = async ({ profile, email, profilePic }) => {
  //* This handler update is_Active in db . when user login.........
  await updateUserActiveStatus(email, true);
  //* This handler check this email is present in db or not.....
  let user = await findUserByEmail(email);
  //* if User not found in DB. then create a new Details of user and store in DB.
  if (!user) {
    user = await createUser({
      full_name: profile.displayName || "Unknown",
      email,
      profilePic: profilePic || "",
    });
  }

  //* updateLastLogin . This handler work is if user exist in db then update last_login data.
  const updatedUser = await updateLastLogin(email);

  const token = generateToken(
    { id: updatedUser.id, email: updatedUser.email },
    "1d"
  );

  return { user: updatedUser, token };
};

//! When user logout. then run this modal. and update in db is_Active
const handleLogoutService = async (email) => {
  await updateUserActiveStatus(email, false);
  return true;
};
module.exports = { handleCreateUserService, handleLogoutService };
