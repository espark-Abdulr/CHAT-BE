import dotenv from "dotenv";
import { app } from "./app.js";
import DBConnectionHandler from "./DB/database.js";
import setupSocket from "../socket.js";
dotenv.config({ path: "./env" });

DBConnectionHandler()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log("Server Started At:", process.env.PORT || 8000);
    });

    setupSocket(server);
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });