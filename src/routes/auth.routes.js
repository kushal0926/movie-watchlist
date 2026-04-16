import { Router } from "express";
import { signIn, signOut, signUp } from "../controller/auth.controller.js";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", signIn);
authRoute.post("/logout", signOut);

export default authRoute;
