const bcrypt = require('bcrypt');
//* Import custome file.....
const { findUserByEmail, createUser } = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const registerUserService = async ({
  full_name,
  email,
  password,
  confirm_password,
  session,
}) => {
  // Validate inputs
  if (!full_name || !email || !password || !confirm_password) {
    return {
      status: 400,
      body: { success: false, message: "All fields are required" },
    };
  }

  if (password !== confirm_password) {
    return {
      status: 400,
      body: { success: false, message: "Passwords do not match" },
    };
  }
  //* Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return {
      status: 409,
      body: { success: false, message: "Email already registered" },
    };
  }

  //* Hash password......
  const hashedPassword = await bcrypt.hash(password, 10);
  //* Create new user
  const newUser = await createUser({
    full_name,
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = generateToken({ id: newUser.id, email: newUser.email });

  // Save session
  session.user = { id: newUser.id, email: newUser.email };

  return {
    status: 201,
    body: {
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
      },
    },
  };
};


module.exports ={registerUserService}
