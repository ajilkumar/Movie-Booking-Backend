import mongoose, { Schema } from "mongoose";

// Seat Schema embedded inside Show
const seatSchema = new Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  seatType: {
    type: String,
    enum: ["Regular", "VIP", "Premium"],
    default: "Regular",
  },
  price: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookingRef: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
});

const showSchema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie is required"],
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    showType: {
      type: String,
      required: [true, "Show type is required"],
      enum: ["2D", "3D", "IMAX"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seats: [seatSchema], // Array of seat objects
  },
  {
    timestamps: true,
  }
);

export const Show = mongoose.model("Show", showSchema);
