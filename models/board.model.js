import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      maxLength: [50, "Title cannot exceed 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },
    pins: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pin",
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

boardSchema.index({ owner: 1, title: 1 }, { unique: true });

const Board = mongoose.model("Board", boardSchema);

export default Board;
