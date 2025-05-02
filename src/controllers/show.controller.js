import { Movie } from "../models/movie.model.js";
import { Show } from "../models/show.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { generateSeats } from "../utils/generateSeats.js";

// Create shows
const createShows = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { date, time, showType } = req.body;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found!");
  }

  const seats = generateSeats();

  const show = await Show.create({
    movie: movieId,
    date,
    time,
    showType,
    seats,
  });

  // const createdShow = await Show.findById(show._id);

  // if (!createdShow) {
  //   throw new ApiError(500, "Something went wrong while creating a new show");
  // }

  // console.log(`Show created: ${show}`);

  return res
    .status(201)
    .json(new ApiResponse(201, show, "Show created successfully"));
});

// Get all shows for a specific movie
const getShowsForMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found!");
  }
  const shows = await Show.find({ movie: movieId });
  console.log(`All shows for a specific movie fetched successfully!`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        shows,
        "All shows for a specific movie fetched successfully!"
      )
    );
});

// Update show details
const updateShows = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { date, time, showType } = req.body;

  const show = await Show.findById(showId);

  if (!show) {
    throw new ApiError(404, "Show not found!");
  }

  if (date !== undefined) show.date = date;
  if (time !== undefined) show.time = time;
  if (showType !== undefined) show.showType = showType;

  await show.save();

  return res
    .status(200)
    .json(new ApiResponse(200, show, "Show details updated succesfully!"));
});

// Update show status
const updateShowStatus = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { isActive } = req.body;

  const show = await Show.findById(showId);

  if (!show) throw new ApiError(404, "Show not found!");

  show.isActive = isActive;

  await show.save();

  return res
    .status(200)
    .json(new ApiResponse(200, show, "Show status updated successfully!"));
});

// Delete show
const deleteShow = asyncHandler(async (req, res) => {
  const { showId } = req.params;

  const show = await Show.findById(showId);

  if (!show) {
    throw new ApiError(404, "Show not found!");
  }

  await show.deleteOne();
  console.log("Show deleted succesfully");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Show deleted successfully"));
});

export {
  createShows,
  updateShows,
  updateShowStatus,
  deleteShow,
  getShowsForMovie,
};
