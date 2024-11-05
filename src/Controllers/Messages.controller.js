import MessageModel from "../Models/Chat.model.js";
import { UserModel } from "../Models/User.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandler.js";

export const FetchAllMessages = asyncHandler(async (req, res) => {

    const { user2 } = req.body
    if (user2 === undefined || user2 === null) {
        return res.status(400).json({ message: "User 2 id is required" });
    }

    const user2Details = await UserModel.findById(user2)
    if (!user2Details) {
        return res.status(404).json({ message: "User2 with this id not found" });
    }

    const user1 = req?.userId;
    if (!user1) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const user1Details = await UserModel.findById(user1);
    if (!user1Details) {
        return res.status(404).json({ message: "User1 with this id not found" });
    }

    const messages = await MessageModel.find({
        $or: [
            { sender: user1, recipient: user2 }, { sender: user2, recipient: user1 }
        ]
    }).sort({ timestamp: 1 })

    return res.status(200).json(new ApiResponse(200, { messages }, "Messages found successfully"));
})