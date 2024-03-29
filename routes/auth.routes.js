import express from "express";
import bcrypt from "bcrypt";
import { loginValidator, registerValidator } from "../validation/index.js";
import UserModel from "../Models/User.js";
import jwt from "jsonwebtoken";
import { checkAuth, handleError } from "../utils/index.js";

const router = express.Router({ mergeParams: true });

router.post("/login", loginValidator, handleError, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Incorrect password or login" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userInfo } = user._doc;

    res.json({ ...userInfo, token });
  } catch (error) {
    res.status(500).json({
      message: "Cannot login, try later",
      error: error.message,
    });
  }
});

router.post("/register", registerValidator, handleError, async (req, res) => {
  try {
    const { password, email, fullName, avatarUrl } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const document = new UserModel({
      email,
      fullName,
      avatarUrl,
      passwordHash: hash,
    });

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return res.status(409).json({ message: "User already exist" });
    }

    const user = await document.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userInfo } = user._doc;

    res.status(201).json({ ...userInfo, token });
  } catch (error) {
    res.status(500).json({
      message: "Cannot register, try later",
      error: error.message,
    });
  }
});

router.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { passwordHash, ...userInfo } = user._doc;

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default router;
