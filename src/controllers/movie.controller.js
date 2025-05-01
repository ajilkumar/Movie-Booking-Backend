import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createMovie = asyncHandler(async (req, res) => {
  const { title, description, duration, genre, trailerUrl, nowShowing } =
    req.body;

  // Validate required text fields
  if (
    [title, description, duration, genre, trailerUrl].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // Validate images
  if (!req.files?.mainImage?.[0]?.path || !req.files?.coverImage?.[0]?.path) {
    throw new ApiError(400, "Main image and cover image are required.");
  }

  const mainImageLocalPath = req.files.mainImage[0].path;
  const coverImageLocalPath = req.files.coverImage[0].path;

  // Upload to Cloudinary
  const mainImage = await uploadOnCloudinary(mainImageLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!mainImage || !coverImage) {
    throw new ApiError(500, "Something went wrong while uploading images.");
  }

  const movie = await Movie.create({
    title,
    description,
    duration,
    genre,
    mainImage: mainImage.url,
    coverImage: coverImage.url,
    trailerUrl,
    nowShowing,
  });

  if (!movie) {
    throw new ApiError(500, "Something went wrong while creating the movie.");
  }

  console.log(`Movie created: ${movie}`);

  return res
    .status(201)
    .json(new ApiResponse(200, movie, "Movie created successfully."));
});

export { createMovie };
