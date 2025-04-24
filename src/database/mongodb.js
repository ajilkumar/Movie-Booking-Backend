import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

// console.log(DB_URI);

if (!DB_URI) {
  throw new Error(
    "DB_URI is not defined in the environment variables. Please set it in your .env<development/production>.local file."
  );
}

// Connect to MonogDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`MongoDB connected successfully in ${NODE_ENV} mode.`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default connectToMongoDB;
