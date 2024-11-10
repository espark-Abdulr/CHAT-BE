import { Router } from "express";
import { LoginHandler, LogoutHandler, RegisterHandler, RemoveImageHandler, UpdatePictureHandler, UpdateProfile, VerifyUser } from "../Controllers/AuthController.controller.js";
import { validateLogin, validateProfile } from "../validator/validator.js";
import { verifyToken } from "../Middlewares/Auth.middleware.js";
import { singleAvatar } from "../Middlewares/profileImage.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateLogin, RegisterHandler);
authRoutes.post("/login", validateLogin, LoginHandler);
authRoutes.get("/verify", verifyToken, VerifyUser);
authRoutes.put("/update-profile", verifyToken, validateProfile, UpdateProfile);
authRoutes.put("/update-picture", verifyToken, singleAvatar, UpdatePictureHandler);
authRoutes.delete("/remove-image", verifyToken, RemoveImageHandler)
authRoutes.put("/logout", verifyToken, LogoutHandler)

export default authRoutes