import { Router } from "express";
import { login, logout, request } from "../controller/auth.controller.js";

const authRoute = Router();

authRoute.post("/request", request);
authRoute.post("/login", login);
authRoute.post("/logout", logout);




export default authRoute;
