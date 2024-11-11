import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { validateLogin } from "../validator/validator.js";
import { validationResult } from "express-validator";
import { compare } from "bcrypt";
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../Utils/cloudinary.js";

const maxAge = "10d";
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_SECRET_KEY, { expiresIn: maxAge })
}

export const RegisterHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg });
    }

    const findUser = await UserModel.find({ email });
    if (findUser.length != 0) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const user = await UserModel.create({ email, password });
    // const token = createToken(user.email, user._id);
    const userResponse = {
        _id: user._id,
        email: user.email,
        createdAt: user?.createdAt,
        profileSetup: user?.profileSetup,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profileImg: user?.profileImg,
        color: user?.color,
    };
    const responseData = { user: userResponse };
    return res.status(200).json(new ApiResponse(200, responseData, "User registered successfully"));
});


export const LoginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg });
    }

    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
        return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const passChecker = await compare(password, findUser.password);
    if (!passChecker) {
        return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = createToken(findUser.email, findUser._id);

    // Set the cookie
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 24 * 60 * 60 * 1000
    });

    const userResponse = {
        _id: findUser._id,
        email: findUser.email,
        createdAt: findUser.createdAt,
        profileSetup: findUser.profileSetup,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        profileImg: findUser.profileImg,
        color: findUser.color,
    };

    return res.status(200).json(new ApiResponse(200, { userResponse }, "User login successfully"));
});


export const VerifyUser = asyncHandler(async (req, res) => {
    const userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    console.log(userId)
    const user = await UserModel.findById(userId);
    console.log(user)
    if (!user) {
        return res.status(404).json({ message: "User with this id not found" });
    }
    const userResponse = {
        email: user?.email,
        profileSetup: user?.profileSetup,
        firstName: user?.firstName,
        lastName: user?.lastName,
        profileImg: user?.profileImg,
        color: user?.color,
        _id: user?._id
    }
    return res.status(200).json(new ApiResponse(200, { userResponse }, "Token checking"));

})

export const UpdateProfile = asyncHandler(async (req, res) => {
    const userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User with this id not found" });
    }
    const { firstName, lastName, color } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ message: firstError.msg });
    }
    // if (!image) {
    //     return res.status(400).json({ message: "Profile image is required" });
    // }

    const userData = await UserModel.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true })

    const userResponse = {
        email: userData?.email,
        profileSetup: userData?.profileSetup,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        profileImg: userData?.profileImg,
        color: userData?.color,
    }
    return res.status(200).json(new ApiResponse(200, { userResponse }, "Profile Updated Successfully"));

})


export const UpdatePictureHandler = asyncHandler(async (req, res) => {
    const userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User with this id not found" });
    }

    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Please upload an image" });
    }

    const result = await uploadFilesToCloudinary([file], "Chats/User")
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { profileImg: result[0] }, { new: true, runValidators: true });

    return res.status(200).json(new ApiResponse(200, { profileImg: updatedUser?.profileImg }, "Profile Image Updated Successfully"));

})


export const RemoveImageHandler = asyncHandler(async (req, res) => {
    const userId = req?.userId;
    if (!userId) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User with this id not found" });
    }

    const { imgUrl } = req.body;
    if (!imgUrl) {
        return res.status(401).json({ message: "Image URL is required for deletion" });
    }

    try {
        await deleteFilesFromCloudinary([imgUrl]);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { profileImg: { url: null } }, { new: true, runValidators: true });
        return res.status(200).json(new ApiResponse(200, { profileImg: updatedUser?.profileImg }, "Profile Image Deleted Successfully"));
    } catch (err) {
        return res.status(500).json({ message: `Error deleting image: ${err.message}` });
    }
})


export const LogoutHandler = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'Strict',
        sameSite: 'None',
        maxAge: 0
    });

    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});
