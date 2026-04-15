import { Router } from "express";
import { addToWatchList } from "../controller/watchlist.controller.js";

const watchlistRoute = Router();

watchlistRoute.post("/", addToWatchList);

export default watchlistRoute;
