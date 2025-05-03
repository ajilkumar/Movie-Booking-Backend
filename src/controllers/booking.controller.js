import { asyncHandler } from "../utils/asynHandler.js";
import { Show } from "../models/show.model.js";
import { ApiError } from "../utils/apiError.js";
import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Create Booking
const createBooking = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { seatNumbers } = req.body; // should be "seatNumbers" (plural)
  const userId = req.user._id; // destructure directly

  // Validate show
  const show = await Show.findById(showId);
  if (!show) {
    throw new ApiError(404, "Show not found!");
  }

  // Find selected seats
  const selectedSeats = show.seats.filter((seat) =>
    seatNumbers.includes(seat.seatNumber)
  );

  // Validate seat selection
  if (selectedSeats.length !== seatNumbers.length) {
    throw new ApiError(400, "Some seat numbers are invalid");
  }

  if (selectedSeats.some((seat) => seat.isBooked)) {
    throw new ApiError(400, "Some selected seats are already booked");
  }

  // Calculate total
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Create booking
  const booking = await Booking.create({
    user: userId,
    show: showId,
    seatsBooked: selectedSeats.map((seat) => ({
      seatNumber: seat.seatNumber,
      price: seat.price,
    })),
    totalAmount,
  });

  // Mark seats as booked in show
  show.seats.forEach((seat) => {
    if (seatNumbers.includes(seat.seatNumber)) {
      seat.isBooked = true;
      seat.bookingRef = booking._id;
    }
  });

  await show.save();

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking successful"));
});

// Cancel booking
const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user._id;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found!");
  }

  if (booking.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized tocancel this booking");
  }

  const show = await Show.findById(booking.show);

  if (!show) {
    throw new ApiError(404, "Show not found!");
  }

  // Unmark the booked seats
  show.seats.forEach((seat) => {
    if (booking.seatsBooked.some((s) => s.seatNumber === seat.seatNumber)) {
      seat.isBooked = false;
      seat.bookingRef = null;
    }
  });

  await show.save();
  await Booking.findByIdAndDelete(bookingId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Booking cancelled successfully"));
});

// User booking with details
const getUserBookingWithDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const aggregatePipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "shows",
        localField: "show",
        foreignField: "_id",
        as: "showDetails",
      },
    },
    { $unwind: "$showDetails" },
    {
      $lookup: {
        from: "movies",
        localField: "showDetails.movie",
        foreignField: "_id",
        as: "movieDetails",
      },
    },
    { $unwind: "$movieDetails" },
    {
      $project: {
        seatsBooked: 1,
        totalAmount: 1,
        paymentStatus: 1,
        bookedAt: 1,
        "showDetails.date": 1,
        "showDetails.time": 1,
        "showDetails.showType": 1,
        "movieDetails.title": 1,
        "movieDetails.description": 1,
        "movieDetails.duration": 1,
        "movieDetails.genre": 1,
        "movieDetails.nowShowing": 1,
        "movieDetails.mainImage": 1,
        "movieDetails.trailerUrl": 1,
      },
    },
  ];

  const aggregateQuery = Booking.aggregate(aggregatePipeline);

  const result = await Booking.aggregatePaginate(aggregateQuery, {
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "User booking history fetched"));
});
export { createBooking, cancelBooking, getUserBookingWithDetails };
