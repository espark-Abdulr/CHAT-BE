import { Router } from "express";
import { LoginHandler, RegisterHandler } from "../Controllers/AuthController.controller.js";
import { validateLogin } from "../validator/validator.js";

const authRoutes = Router();

authRoutes.post("/signup", validateLogin, RegisterHandler);
authRoutes.post("/login", validateLogin, LoginHandler);

export default authRoutes