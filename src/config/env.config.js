import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
  quiet: true,
});

export const PORT = process.env.PORT || "8026";
export const NODE_ENV = process.env.NODE_ENV || "development";
