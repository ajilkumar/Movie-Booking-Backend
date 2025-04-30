import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

const createMovie = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    duration,
    genre,
    mainImage,
    coverImage,
    trailerUrl,
    nowShowing,
  } = req.body;

  // Validate required fields
  if (
    [
      title,
      description,
      duration,
      genre,
      mainImage,
      coverImage,
      trailerUrl,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const movie = await Movie.create({
    title,
    description,
    duration,
    genre,
    mainImage,
    coverImage,
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
