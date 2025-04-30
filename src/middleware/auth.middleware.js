import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access. No token provided.");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    console.log(decodedToken);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    console.log(user);

    if (!user) {
      throw new ApiError(401, "Unauthorized access. User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized access");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      throw new ApiError(403, "Forbidden access. Admins only.");
    }
    next();
  } catch (error) {
    throw new ApiError(403, error?.message || "Forbidden access");
  }
});

export { verifyJWT, isAdmin };
