import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: {
      typeof: "string",
      required: true,
    },
    email: {
      typeof: "string",
      required: true,
      unique: true,
    },
    passwordHash: {
      typeof: "string",
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

export default UserSchema;
