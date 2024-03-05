import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import checkAuth from "./utils/checkAuth.js";
import path from "path";

const app = new express();
const PORT = 1010;

dotenv.config();

mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cors());

app.use("/", router);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({
      message: "File uploaded successfully",
      file: req.file,
      url: imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server listening on port: " + PORT);
});
