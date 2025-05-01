import { Router } from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateCoverImage,
  updateMainImage,
  updateMovie,
} from "../controllers/movie.controller.js";
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
movieRouter.route("/allmovies").get(verifyJWT, isAdmin, getAllMovies);
movieRouter.route("/:movieId").get(verifyJWT, isAdmin, getMovieById);
movieRouter.route("/update/:movieId").patch(verifyJWT, isAdmin, updateMovie);
movieRouter.put(
  "/update-main-image/:movieId",
  verifyJWT,
  isAdmin,
  upload.single("mainImage"),
  updateMainImage
);

movieRouter.put(
  "/update-cover-image/:movieId",
  verifyJWT,
  isAdmin,
  upload.single("coverImage"),
  updateCoverImage
);
movieRouter.route("/delete/:movieId").delete(verifyJWT, isAdmin, deleteMovie);

export default movieRouter;
