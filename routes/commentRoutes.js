// get Comment , Create Comment , Update Comment , Delete Comment
const express = require("express");
const commentRoute = express.Router();
const { Authorization } = require("../middleware/AuthMidWare");

const {
  getComment,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
commentRoute.get("/:id", Authorization, getComment);
commentRoute.post("/:id", Authorization, createComment);
commentRoute.put("/:id", Authorization, updateComment);
commentRoute.delete("/:id", Authorization, deleteComment);

module.exports = commentRoute;
