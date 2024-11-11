import jwt from "jsonwebtoken";
import { UserModel } from "../Models/User.model.js";

export const verifyToken = async (req, res, next) => {
    const token = req?.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "You are not authenticated" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY)
    // const user = await UserModel.findOne({ email: verify?.email })
    // if (!user) {
    //     return res.status(500).json({ message: "Something went wrong" });
    // }
    req.userId = verify?.userId;
    next();
}