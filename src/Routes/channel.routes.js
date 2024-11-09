import { Router } from "express";
import { verifyToken } from "../Middlewares/Auth.middleware.js";
import { CreateChannelController, GetUserChannelsController } from "../Controllers/Channel.controller.js";

const channelRoutes = Router();
channelRoutes.post("/create-channel", verifyToken, CreateChannelController)
channelRoutes.get("/user-channels", verifyToken, GetUserChannelsController)

export default channelRoutes
