import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/verify/:uniqueString", verifyUserEmail);
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:id/:token", resetPassword);

export default router;
