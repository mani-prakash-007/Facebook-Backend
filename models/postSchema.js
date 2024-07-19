//Post Schema
const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    feed: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
    },
    dislikes: {
      type: [String],
    },
    comments: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
