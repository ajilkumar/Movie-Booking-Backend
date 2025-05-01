import { Router } from "express";
import { createMovie } from "../controllers/movie.controller.js";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const movieRouter = Router();

// Movie routes
movieRouter.route("/create").post(
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  verifyJWT,
  isAdmin,
  createMovie
);

export default movieRouter;
