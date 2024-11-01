import { Server as SocketIOServer } from "socket.io";
import MessageModel from "./src/Models/Chat.model.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173"],
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
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)


        const createMessage = await MessageModel.create(message);

        const messageData = await MessageModel.findById(createMessage?._id).populate("sender", "id firstName lastName email profileImg color").populate("recipient", "id firstName lastName email profileImg color")

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData)
        }
    };

    io.on("connection", (socket) => {
        // Access userId from the query parameter
        const userId = socket.handshake.query.userId;  // Changed from socket.handshake.userId to socket.handshake.query.userId
        console.log(userId);
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log("User Connected", userId, "with socket id", socket.id);
        } else {
            console.log("User id not provided");
        }


        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
