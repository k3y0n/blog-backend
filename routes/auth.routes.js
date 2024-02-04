import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { loginValidator, registerValidator } from "../validation/index.js";
import UserSchema from "../Models/User.js";

const router = express.Router({ mergeParams: true });

router.post("/login", loginValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return req.status(400).json(errors.array());
    }

    const { email, password } = req.body;

    const user = await UserSchema.findOne({ email });

    const isValid = await bcrypt.compare(user.password, password);

    if (!isValid) {
      return res.status(404).json({ message: "Incorrect password or email" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "token123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userInfo } = user.doc;

    return res.status(200).send({
      ...userInfo,
      token,
      message: "User logged in successfully",
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot login, try later",
    });
  }
});

router.post("/register", registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return req.status(400).json(errors.array());
    }

    const { password, email, fullName, avatarUrl } = req.body;
    const salt = bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);

    const document = new UserSchema({
      email,
      fullName,
      avatarUrl,
      passwordHash: hash,
    });

    const user = await document.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "token123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userInfo } = user.doc;

    return res.status(201).send({
      ...userInfo,
      token,
      message: "User created successfully",
      code: 201,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot register, try later",
    });
  }
});

router.get("/me", (req, res) => {
  try {
  } catch (error) {}
});

export default router;
