import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "User email is required field"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "User password is required field"],
        trim: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    profileImg: {
        type: {
            public_id: {
                type: String,
                required: false
            },
            url: {
                type: String,
                required: false
            }
        },
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profileSetup: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});


userSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    }
    next();
});


export const UserModel = mongoose.model("User", userSchema);
