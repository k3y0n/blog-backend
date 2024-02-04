import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router({ mergeParams: true });

router.use("/auth", authRoutes);

export default router;
