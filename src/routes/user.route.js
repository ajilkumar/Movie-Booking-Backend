import { Router } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

// User routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);
userRouter.route("/verify-email").get(verifyEmail);

export default userRouter;
