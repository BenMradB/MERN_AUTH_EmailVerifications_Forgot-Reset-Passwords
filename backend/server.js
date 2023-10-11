import express from "express";
import userRouter from "./routes/user.router.js";
import connectToDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json()); // Allow  us to get the data from the req.body instead of getting undefined
app.use(express.urlencoded({ extended: true })); // Allow us to get Form data
app.use(cookieParser());

app.use("/api/users", userRouter);

app.use(notFound);
app.use(errorHandler);

connectToDB();
app.listen(8000, () =>
  console.log(`Server Listening for requests on port ${PORT}`)
);

// - **http://localhost:8000**- BASE_URL
// - **POST /api/users** - Register a user
// - **POST /api/users/auth** - Authenticate a user and get token
// - **POST /api/users/logout** - Logout user and clear cookie
// - **GET  /api/users/profile** - Get user profile
// - **PUT  /api/users/profile** - Update profile
