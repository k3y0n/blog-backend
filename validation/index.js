import { body } from "express-validator";

export const registerValidator = [
  body("email", "Invalid format email").isEmail(),
  body("password", "Min length password 5 char").isLength({ min: 5 }),
  body("fullName", "Min length full name 3 char").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];
export const loginValidator = [
  body("email", "Email not correct").not().isEmpty().normalizeEmail().isEmail(),
  body("password", "Password not correct").not().isEmpty().exists(),
];

export const postCreateValidation = [
  body("title", "Enter title of post").isLength({ min: 3 }).isString(),
  body("text", "Enter text of post").isLength({ min: 3 }).isString(),
  body("tags", "Invalid format tags").optional().isString(),
  body("imageUrl", "Invalid url for image").optional().isString(),
];
