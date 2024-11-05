import express from "express";
import cors from "cors";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigins = [
  'http://localhost:5174',
  process.env.FRONT_END_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => o.test && o.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies, etc.)
  })
);


app.use(express.static("public"));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(bodyParser.json());


import authRoutes from "./Routes/Auth.routes.js";
import contactRoutes from "./Routes/ContactRoutes..routes.js";
import messageRoutes from "./Routes/messages.routes.js";
app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactRoutes)
app.use("/api/messages", messageRoutes)

export { app };
