import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    genre: {
      type: [String],
      required: [true, "At least one genre is required"],
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Mystery",
        "Romance",
        "Thriller",
        "Sci-Fi",
        "Animation",
        "Documentary",
      ],
    },
    mainImage: {
      type: String, //cloudinary URL
      required: [true, "Main image is required"],
    },
    coverImage: {
      type: String, //cloudinary URL
      required: [true, "Cover image is required"],
    },
    trailerUrl: {
      type: String,
      required: [true, "Trailer URL is required"],
    },
    nowShowing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted duration (e.g., "2h 15m")
movieSchema.virtual("durationFormatted").get(function () {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Text index for search
movieSchema.index({
  title: "text",
  description: "text",
});

export const Movie = mongoose.model("Movie", movieSchema);
