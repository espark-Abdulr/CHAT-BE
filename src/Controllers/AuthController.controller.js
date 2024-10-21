import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User.model.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { validateLogin } from "../validator/validator.js";
import { validationResult } from "express-validator";
import { compare } from "bcrypt";

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
        profileSetup: user?.profileSetup
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
    const userResponse = {
        _id: findUser._id,
        email: findUser.email,
        createdAt: findUser?.createdAt,
        profileSetup: findUser?.profileSetup
    };
    return res.status(200).json(new ApiResponse(200, { userResponse, token }, "User registered successfully"));


})