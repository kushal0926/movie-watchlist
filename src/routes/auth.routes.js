import { Router } from "express";
import { request } from "../controller/auth.controller.js";

const authRoute = Router()

authRoute.post("/request", request)

export default authRoute;