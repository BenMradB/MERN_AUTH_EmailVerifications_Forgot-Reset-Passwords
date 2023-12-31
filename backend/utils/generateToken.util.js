import jwt from "jsonwebtoken";

const generateToken = (res, userId, type = "reset") => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: type === "login" ? process.env.JWT_EXPIRES : "1d",
  });

  if (type === "login") {
    res.cookie("jwt", token, {
      maxAge: Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // https
      sameSite: "strict", // Against CSRF Attacks
    });
  }
  return token;
};

export default generateToken;
