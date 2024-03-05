import express from "express";
import { validationResult } from "express-validator";
import PostsModel from "../Models/Posts.js";
import { postCreateValidation } from "../validation/index.js";
import { checkAuth } from "../utils/index.js";

const router = express.Router({ mergeParams: true });

router.get("/getAll", async (_, res) => {
  try {
    const posts = await PostsModel.find()
      .populate({
        path: "user",
        select: "-passwordHash",
      })
      .exec();

    res.status(200).send({
      posts,
      message: "Success",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get all posts",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const post = await PostsModel.findOneAndUpdate(
      { _id: id },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).send({
      post,
      message: "Success",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get post",
      error: error.message,
    });
  }
});

router.post("/create", checkAuth, postCreateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { title, text, imageUrl, tags, userId } = req.body;

    const doc = new PostsModel({
      title,
      text,
      tags,
      user: userId,
      imageUrl,
    });

    const post = await doc.save();

    res.status(200).send({
      post,
      message: "Post create successfully",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Create post failed",
      error: error.message,
    });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const id = req.params.id;

    const post = await PostsModel.findOneAndDelete({ _id: id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).send({
      post,
      message: "Post deleted successfully",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
});

router.patch("/:id", checkAuth, async (req, res) => {
  try {
    const id = req.params.id;

    const { title, text, imageUrl, userId, tags } = req.body;

    const post = await PostsModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        text,
        imageUrl,
        user: userId,
        tags: tags?.split(","),
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).send({
      post,
      message: "Post updated successfully",
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
});

export default router;
