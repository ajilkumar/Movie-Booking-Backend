import { asyncHandler } from "../utils/asynHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

// Generate access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:  false});

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating tokens. ${error.message}`
    );
  }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // create user object - create entry in db
  // remove password and refresh token from response
  // check for user creation
  // return response to frontend

  // -------------------------------------------------//

  // get user details from frontend
  const { name, email, password } = req.body;

  // validation - not empty
  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  // check if user already exists: username, email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists.");
  }

  // create user object - create entry
  const user = await User.create({
    name,
    email,
    password,
  });

  // remove password and refresh token from response
  const createdUser = await User.findByIdAndUpdate(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  console.log(`User created: ${createdUser}`);

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully."));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findByIdAndUpdate(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  console.log(`Logged in user: ${loggedInUser}`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export { registerUser, loginUser };
