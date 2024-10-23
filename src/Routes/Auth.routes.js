import { Router } from "express";
import { LoginHandler, RegisterHandler, VerifyUser } from "../Controllers/AuthController.controller.js";
import { validateLogin, validateProfile } from "../validator/validator.js";
import { verifyToken } from "../Middlewares/Auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateLogin, RegisterHandler);
authRoutes.post("/login", validateLogin, LoginHandler);
authRoutes.get("/verify", verifyToken, VerifyUser);
authRoutes.get("/update-profile", verifyToken, validateProfile, VerifyUser);

export default authRoutes