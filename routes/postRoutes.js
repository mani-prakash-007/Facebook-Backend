const express = require("express");
const postRouter = express.Router();
const { Authorization } = require("../middleware/AuthMidWare");

const {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getMyPost,
  addLike,
  addDislike,
} = require("../controllers/postController");
//Get Post , Create Post , Update Post  , Delete Post

postRouter.post("/", Authorization, createPost);
postRouter.put("/:id", Authorization, updatePost);
postRouter.delete("/:id", Authorization, deletePost);
postRouter.get("/", Authorization, getMyPost);
postRouter.get("/all", Authorization, getAllPost);
postRouter.post("/like/:id", Authorization, addLike);
postRouter.post("/dislike/:id", Authorization, addDislike);

module.exports = postRouter;
