import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: [true, "Show is required"],
    },
    seatsBooked: [
      {
        seatNumber: {
          type: String,
          required: [true, "Seat number is required"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.plugin(mongooseAggregatePaginate);

export const Booking = mongoose.model("Booking", bookingSchema);
