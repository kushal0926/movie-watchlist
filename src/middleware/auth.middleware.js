import jwt from "jsonwebtoken";
import { prisma } from "../config/database.config.js";
import httpStatus from "http-status";
import { JWT_SECRET } from "../config/env.config.js";

const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "not authorized, no token has been provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "user no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    consolr.log(error)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "not authorized, invalid token" });
  }
};

export { authenticate };
