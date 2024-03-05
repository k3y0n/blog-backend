import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../Models/User.js";
import jwt from "jsonwebtoken";
import { secretKey } from "../constants/index.js";
import { postCreateValidation } from "../validation/index.js";

const router = express.Router({ mergeParams: true });

router.post("/create", postCreateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

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
      secretKey,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userInfo } = user._doc;

    res.status(200).send({
      ...userInfo,
      token,
      message: "User logged in successfully",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot login, try later",
      error: error.message,
    });
  }
});

export default router;
