import { Movie } from "../models/movie.model.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// Create a movie
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

// Get all movies
const getAllMovies = asyncHandler(async (req, res) => {
  // Fetch movies in ascending order in which they created
  const movies = await Movie.find({}).sort({ createdAt: 1 });

  if (movies.length === 0) {
    throw new ApiError(404, "No movied found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, movies, "Movies fetched successfully."));
});

// Get movie by ID
const getMovieById = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  // console.log(movieId);

  const movie = await Movie.findById(movieId);
  // console.log(movie);

  if (!movie) {
    throw new ApiError(400, "Movie not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Movie details fetched successfully"));
});

// Updated movie details
const updateMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const { title, description, duration, genre, trailerUrl, nowShowing } =
    req.body;

  // Update text fields only if provided
  if (title !== undefined) movie.title = title;
  if (description !== undefined) movie.description = description;
  if (duration !== undefined) movie.duration = duration;
  if (genre !== undefined) movie.genre = genre;
  if (trailerUrl !== undefined) movie.trailerUrl = trailerUrl;
  if (nowShowing !== undefined) movie.nowShowing = nowShowing;

  await movie.save();

  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Movie updated succssfully!"));
});

// Update movie main image
const updateMainImage = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  if (!req.file?.path) {
    throw new ApiError(400, "Main image file is required");
  }

  const uploadedImage = await uploadOnCloudinary(req.file.path);
  if (!uploadedImage?.url) {
    throw new ApiError(500, "Failed to upload main image");
  }

  movie.mainImage = uploadedImage.url;
  await movie.save();

  fs.unlink(req.file.path, () => {}); // cleanup local file

  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Main image updated successfully"));
});

// Update movie cover image
const updateCoverImage = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  if (!req.file?.path) {
    throw new ApiError(400, "Cover image file is required");
  }

  const uploadedImage = await uploadOnCloudinary(req.file.path);
  if (!uploadedImage?.url) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  movie.coverImage = uploadedImage.url;
  await movie.save();

  fs.unlink(req.file.path, () => {}); // cleanup local file

  return res
    .status(200)
    .json(new ApiResponse(200, movie, "Cover image updated successfully"));
});

// Delete a movie
const deleteMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found!");
  }

  // Step 3: Optionally delete images from Cloudinary
  try {
    // Extract public_id from the URL if stored
    const getPublicId = (url) => {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      return `movie-app/${filename.split(".")[0]}`;
    };

    if (movie.mainImage) {
      await cloudinary.uploader.destroy(getPublicId(movie.mainImage));
    }
    if (movie.coverImage) {
      await cloudinary.uploader.destroy(getPublicId(movie.coverImage));
    }
  } catch (err) {
    console.error("Error deleting images from Cloudinary:", err);
    // Optional: don't block movie deletion even if Cloudinary fails
  }

  await movie.deleteOne();
  console.log(`Movie deleted successfully!`);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Movie deleted successfully"));
});

export {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  updateMainImage,
  updateCoverImage,
};
