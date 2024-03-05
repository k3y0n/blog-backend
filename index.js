import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

const app = new express();
const PORT = 1010;

dotenv.config();

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server listening on port: " + PORT);
});
