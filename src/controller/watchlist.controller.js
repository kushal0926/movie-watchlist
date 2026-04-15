import { prisma } from "../config/database.config.js";
import httpStatus from "http-status";

const addToWatchList = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized" });
    }

    const { movieId, status, rating, notes } = req.body;

    // verifying if the movies exists or notes
    const movieExist = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movieExist) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "movie not found" });
    }

    // checking if movie already exixts or not
    const existInWatchlist = await prisma.watchlistItems.findUnique({
      where: {
        userId_movieId: {
          userId: req.user.id,
          movieId: movieId,
        },
      },
    });

    if (existInWatchlist) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "movie already exist in the watchlist" });
    }

    const watchlistItem = await prisma.watchlistItems.create({
      data: {
        userId: req.user.id,
        movieId,
        status: status || "PLANNED",
        rating,
        notes,
      },
    });

    res
      .status(httpStatus.CREATED)
      .json({ status: "success", data: { watchlistItem } });
  } catch (error) {
    console.log(error);
  }
};

export { addToWatchList };
