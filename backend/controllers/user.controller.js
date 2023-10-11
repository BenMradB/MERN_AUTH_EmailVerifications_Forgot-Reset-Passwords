import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.util.js";

// @Route   POST /api/users/auth
// @Access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists || !(await userExists.matchPasswords(password))) {
    res.status(401);
    throw new Error("Invalid email or password ...");
  }

  generateToken(res, userExists._id);

  return res.status(200).json({
    _id: userExists._id,
    userName: userExists.userName,
    email: userExists.email,
  });
});

// @Route   POST /api/users
// @Access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists ...");
  }

  const user = await User.create({
    userName,
    email,
    password,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  generateToken(res, user._id);

  return res.status(201).json({
    _id: user._id,
    userName: user.userName,
    email: user.email,
  });
});

// @Route   POST /api/users/logout
// @Access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({
    message: "User Logged out",
  });
});

// @Route   GET /api/users/profile
// @Access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "Get User Profile",
    user: req.user,
  });
});

// @Route   PUT /api/users/profile
// @Access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.userName = userName || user.userName;
  user.email = email || user.email;

  if (password) user.password = password;

  const updatedUser = await user.save();

  return res.status(200).json({
    _id: updatedUser._id,
    userName: updatedUser.userName,
    email: updatedUser.email,
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
