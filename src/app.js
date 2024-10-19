import express from "express";
import cors from "cors";
import bodyParser from "body-parser"

const app = express();
app.use(
  cors({
    // origin: ["Place URL"],
    credentials: true,
  })
);

app.use(express.json({}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(bodyParser.json());

export { app };
