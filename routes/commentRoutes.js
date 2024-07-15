// get Comment , Create Comment , Update Comment , Delete Comment
const express = require("express");
const commentRoute = express.Router();
const { Authorization } = require("../middleware/AuthMidWare");

const {
  getComment,
  createComment,
  updateComment,
  deleteComment,
  addLike,
  addDislike,
} = require("../controllers/commentController");
commentRoute.get("/:id", Authorization, getComment);
commentRoute.post("/:id", Authorization, createComment);
commentRoute.put("/:id", Authorization, updateComment);
commentRoute.delete("/:id", Authorization, deleteComment);
commentRoute.post("/like/:id", Authorization, addLike);
commentRoute.post("/dislike/:id", Authorization, addDislike);

module.exports = commentRoute;
