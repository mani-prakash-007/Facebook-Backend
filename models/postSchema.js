const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
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
});

module.exports = mongoose.model("Post", postSchema);
