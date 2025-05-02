import { Router } from "express";
import { isAdmin, verifyJWT } from "../middleware/auth.middleware.js";
import {
  createShows,
  deleteShow,
  getShowsForMovie,
  updateShows,
  updateShowStatus,
} from "../controllers/show.controller.js";

const showRouter = Router();

showRouter.route("/create/:movieId").post(verifyJWT, isAdmin, createShows);
showRouter.route("/movie/:movieId").get(verifyJWT, isAdmin, getShowsForMovie);
showRouter.route("/update/:showId").patch(verifyJWT, isAdmin, updateShows);
showRouter
  .route("/update-status/:showId")
  .put(verifyJWT, isAdmin, updateShowStatus);
showRouter.route("/delete/:showId").delete(verifyJWT, isAdmin, deleteShow);
export default showRouter;
