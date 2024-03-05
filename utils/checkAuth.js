import jwt from "jsonwebtoken";
import { secretKey } from "../constants/index.js";

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(403).json({
      message: "Invalid permission",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    req.userId = decoded._id;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid permission",
      error: error.message,
    });
  }
};

export default checkAuth;
