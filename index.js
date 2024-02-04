import express from "express";
import router from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors";

const app = new express();
const PORT = 1010;

mongoose
  .connect("mongodb+srv://vlaconory:111@blog-app-cluster.oonguwk.mongodb.net/")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server listening on port: " + PORT);
});
