import { Router } from "express";
import { verifyToken } from "../Middlewares/Auth.middleware.js";
import { CreateChannelController } from "../Controllers/Channel.controller.js";

const channelRoutes = Router();
channelRoutes.post("/create-channel", verifyToken, CreateChannelController)

export default channelRoutes
