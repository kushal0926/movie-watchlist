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
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "invalid request" });
  }
};

const updateWatchlist = async (req, res) => {
  try {
    const { status, rating, notes } = req.body;

    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItems.findUnique({
      where: { id: req.params.id },
    });

    if (!watchlistItem) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "watchlist item not found" });
    }

    // Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ error: "not allowed to update this watchlist item" });
    }

    // Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    // Update watchlist item
    const updatedItem = await prisma.watchlistItems.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(httpStatus.OK).json({
      status: "success",
      data: {
        watchlistItem: updatedItem,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "cannot updtae the list" });
  }
};

const deleteFromWatchlist = async (req, res) => {
  try {
    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItems.findUnique({
      where: { id: req.params.id },
    });

    if (!watchlistItem) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Watchlist item not found" });
    }

    // Ensure only owner can delete
    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ error: "Not allowed to update this watchlist item" });
    }

    await prisma.watchlistItems.delete({
      where: { id: req.params.id },
    });

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Movie removed from watchlist",
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "cannot delete the selected item" });
  }
};

export { addToWatchList, updateWatchlist, deleteFromWatchlist };
