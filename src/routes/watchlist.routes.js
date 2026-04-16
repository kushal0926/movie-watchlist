import { Router } from "express";
import {
  addToWatchList,
  deleteFromWatchlist,
  updateWatchlist,
} from "../controller/watchlist.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { addToWatchlistSchema } from "../validators/watchlist.validators.js";

const watchlistRoute = Router();

watchlistRoute.use(authenticate);
watchlistRoute.post("/", validateRequest(addToWatchlistSchema), addToWatchList);

// {{baseUrl}}/watchlist/:id
watchlistRoute.put("/:id", updateWatchlist);

// {{baseUrl}}/watchlist/:id
watchlistRoute.delete("/:id", deleteFromWatchlist);

export default watchlistRoute;
