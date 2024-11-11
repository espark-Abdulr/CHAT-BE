import { Server as SocketIOServer } from "socket.io";
import MessageModel from "./src/Models/Chat.model.js";
import ChannelModel from "./src/Models/Channel.model.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log("Client Disconnected", socket.id);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        // console.log(message)
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)


        const createMessage = await MessageModel.create(message);

        const messageData = await MessageModel.findById(createMessage?._id).populate("sender", "id firstName lastName email profileImg color").populate("recipient", "id firstName lastName email profileImg color")

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData)
        }
    };

    const SendChannelMessage = async (message) => {
        const { sender, content, channelId, messageType, fileUrl } = message
        const createMessage = await MessageModel.create({
            sender,
            recipient: null,
            content,
            messageType,
            fileUrl
        })

        const messageData = await MessageModel.findById(createMessage?._id).populate(
            "sender", "id firstName lastName email profileImg color"
        ).exec()

        await ChannelModel.findByIdAndUpdate(channelId, { $push: { messages: createMessage?._id } })

        const channel = await ChannelModel.findById(channelId).populate("members")

        const finalData = { ...messageData._doc, channelId: channel._id }

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finalData)
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin._id.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finalData)
            }

        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log("User Connected", userId, "with socket id", socket.id);
        } else {
            console.log("User id not provided");
        }


        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", SendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
