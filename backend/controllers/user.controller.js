import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";
import UserVerification from "../models/user.verification.js";
import generateToken from "../utils/generateToken.util.js";
import { sendMails } from "../utils/sendMails.js";

// @Route   POST /api/users/auth
// @Access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists || !(await userExists.matchPasswords(password))) {
    res.status(401);
    throw new Error("Invalid email or password ...");
  }

  generateToken(res, userExists._id, "login");

  return res.status(200).json({
    _id: userExists._id,
    userName: userExists.userName,
    email: userExists.email,
    verified: userExists.verified,
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

  const userVerification = await UserVerification.create({
    userId: user._id,
    uniqueString: `${uuidv4()}${user._id}`,
  });

  const link = `http://localhost:8000/api/users/verify/${userVerification.uniqueString}`;
  const mailBody = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Account Verification",
    html: `
        <div>
          <p><b><u>Hi ${email}</u></b></p>,
  
          <p>We just need to verify your email address before you can access <b>Cloudiasys</b> platform.</p>
  
          <p>Verify your email address : <a href=${link}>verification link</a></p>
  
          <p><u>Thanks! – The <b>Cloudiasys</b> team</u></p>
        </div>
      `,
  };
  sendMails(res, mailBody);

  return res.status(201).json({
    _id: user._id,
    userName: user.userName,
    email: user.email,
    verified: user.verified,
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

const verifyUserEmail = asyncHandler(async (req, res) => {
  const { uniqueString } = req.params;
  const verifiedUser = await UserVerification.findOne({ uniqueString });
  await User.findByIdAndUpdate(
    verifiedUser.userId,
    { verified: true },
    {
      runValidators: true,
      new: true,
    }
  );

  await UserVerification.findByIdAndRemove(verifiedUser._id);
  return res.end(
    "<h1>Your Gmail account has been verified, go back and login.</h1>"
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not exists");
  }

  const token = generateToken(res, user._id);

  const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
  const mailBody = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Resetting Password",
    html: `
        <div>
          <p><b><u>Hi ${email},</u></b></p>
          <p> Trouble signing in? Resetting your password is easy. <p>

          <p>
            Just press the link below and follow the instructions. We’ll have you up and running in no time.
            <br />
            <a href=${link}>Reset Password</a>
          </p>
          <p><u>Thanks! – The <b>Cloudiasys</b> team</u></p>
        </div>
      `,
  };
  sendMails(res, mailBody);
  res.status(200).json({
    message: "Email sent successfully",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);
    user.password = password;
    const updatedUserPassword = await user.save();

    return res.status(200).json({
      _id: updatedUserPassword._id,
      userName: updatedUserPassword.userName,
      email: updatedUserPassword.email,
    });
  } catch (error) {
    res.status(403);
    throw new Error("Not authorized to do this action. Invalid token.");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
};
