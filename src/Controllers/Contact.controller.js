import { UserModel } from "../Models/User.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import MessageModel from "../Models/Chat.model.js";

export const SearchContactsController = asyncHandler(async (req, res) => {
    const { searchTerm } = req.body
    if (searchTerm === undefined || searchTerm === null) {
        return res.status(400).json({ message: "Search value is required" });
    }
    const userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User with this id not found" });
    }
    // console.log(user)

    const cleanSearch = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    )
    const regex = new RegExp(cleanSearch, "i");

    const contacts = await UserModel.find({
        $and: [
            {
                "_id": { $ne: user?._id }
            },
            {
                $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
            },
            {
                profileSetup: true,
            }
        ]
    })
    return res.status(200).json(new ApiResponse(200, { contacts }, "Users found successfully"));
})


export const GetAllContactsForDmController = asyncHandler(async (req, res) => {
    let userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User with this id not found" });
    }
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await MessageModel.aggregate([
        {
            $match: {
                $or: [
                    { sender: userId },
                    { recipient: userId }
                ]
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ["$sender", userId] },
                        then: "$recipient",
                        else: "$sender"
                    }
                },
                lastMessageTime: { $first: "$createdAt" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "contactInfo"
            }
        },
        {
            $unwind: "$contactInfo"
        },
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                email: "$contactInfo.email",
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                profileImg: "$contactInfo.profileImg",
                color: "$contactInfo.color",
            }
        },
        {
            $sort: { lastMessageTime: -1 }
        }
    ]);


    return res.status(200).json(new ApiResponse(200, { contacts }, "Users found successfully"));
})


export const GetAllContacts = asyncHandler(async (req, res) => {
    let userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }

    // const users = await UserModel.find({ _id: { $ne: userId } }, "firstName lastName _id")
    const users = await UserModel.find({
        $and: [
            {
                profileSetup: true,
            },
            {
                "_id": { $ne: userId }
            }
        ]
    })

    const contacts = users.map((user) => ({
        label: user?.firstName ? `${user?.firstName} ${user?.lastName}` : user?.email,
        value: user?._id
    }))
    return res.status(200).json(new ApiResponse(200, { contacts }, "Users found successfully"));
})