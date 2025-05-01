import express from "express";
import cors from "cors";
import connectToMongoDB from "./src/database/mongodb.js";
import cookieParser from "cookie-parser";

import { HOST, PORT, CLIENT_ORIGIN } from "./src/config/env.js";

// Routes import
import userRouter from "./src/routes/user.route.js";
import movieRouter from "./src/routes/movie.route.js";

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/movie", movieRouter);

app.listen(PORT, HOST || "localhost", () => {
  console.log(`Server running at http://${HOST || "localhost"}:${PORT}`);
  connectToMongoDB();
});
