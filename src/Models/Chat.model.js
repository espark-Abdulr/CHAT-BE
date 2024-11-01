import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text"
        },
    },
    file: {
        type: {
            public_id: {
                type: String,
                required: function () {
                    return this.messageType === "file"
                }
            },
            url: {
                type: String,
                required: function () {
                    return this.messageType === "file"
                }
            }
        },
        required: function () {
            return this.messageType === "file"
        }
    },
}, {
    timestamps: true
})

const MessageModel = new mongoose.model("Chat", chatSchema)

export default MessageModel;