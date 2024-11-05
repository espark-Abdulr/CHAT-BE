import { Router } from "express";
import { verifyToken } from "../Middlewares/Auth.middleware.js";
import { FetchAllMessages } from "../Controllers/Messages.controller.js";


const messageRoutes = Router();

messageRoutes.post("/get-messages", verifyToken, FetchAllMessages)

export default messageRoutes