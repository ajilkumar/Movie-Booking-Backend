import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  cancelBooking,
  createBooking,
  getUserBookingWithDetails,
} from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.route("/:showId").post(verifyJWT, createBooking);
bookingRouter.route("/:bookingId").delete(verifyJWT, cancelBooking);
bookingRouter.route("/user-bookings").get(verifyJWT, getUserBookingWithDetails);

export default bookingRouter;
