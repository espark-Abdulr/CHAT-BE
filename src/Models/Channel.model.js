import mongoose from "mongoose"


const channelSchema = new mongoose.Schema({
    name: {
        type: "String",
        require: true
    },
    members: [
        { type: mongoose.Schema.ObjectId, ref: "User", require: true }
    ],
    admin: { type: mongoose.Schema.ObjectId, ref: "User", require: true },
    messages: [
        { type: mongoose.Schema.ObjectId, ref: "Chat", require: false }
    ]
}, {
    timestamps: true
})

const ChannelModel = new mongoose.model("Group", channelSchema)

export default ChannelModel;