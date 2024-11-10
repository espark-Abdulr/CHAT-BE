import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { UserModel } from "../Models/User.model.js";
import ChannelModel from "../Models/Channel.model.js";
import mongoose from "mongoose";

export const CreateChannelController = asyncHandler(async (req, res) => {
    const { name, members } = req.body
    const userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }


    const admin = await UserModel.findById(userId)
    if (!admin) {
        return res.status(400).json({ message: "Admin User Not Found" });
    }

    console.log(members);

    const validateMember = await UserModel.find({ _id: { $in: members } })
    if (validateMember?.length !== members?.length) {
        return res.status(400).json({ message: "Member Users Not Found" });
    }

    const newChannel = await ChannelModel.create({
        name,
        members,
        admin: userId
    })

    return res.status(200).json(new ApiResponse(200, { channel: newChannel }, "Channel created successfully"));
})


export const GetUserChannelsController = asyncHandler(async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req?.userId)
    const channels = await ChannelModel.find({
        $or: [
            { admin: userId },
            { members: userId }
        ]
    }).sort({ updatedAt: -1 })

    return res.status(200).json(new ApiResponse(200, { channel: channels }, "Got channels successfully"));
})


export const ChannelMessages = asyncHandler(async (req, res) => {
    const { channelId } = req.query;
    // console.log(channelId)

    const channel = await ChannelModel.findById(channelId).populate({
        path: "messages", populate: {
            path: "sender", select: "firstName lastName email _id profileImg color"
        }
    })
    if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
    }

    const messages = channel.messages;
    return res.status(200).json(new ApiResponse(200, { messages: messages }, "Got messages successfully"));
})