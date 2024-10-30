import { UserModel } from "../Models/User.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";

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