import mongoose from "mongoose";

const userVerification = new mongoose.Schema(
  {
    userId: String,
    uniqueString: String,
  },
  { timestamps: true }
);

const UserVerification = mongoose.model("UserVerification", userVerification);
export default UserVerification;
