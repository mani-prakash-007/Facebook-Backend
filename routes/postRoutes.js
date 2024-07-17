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
  getPost,
} = require("../controllers/postController");
//Get Post , Create Post , Update Post  , Delete Post

postRouter.post("/", Authorization, createPost);
postRouter.put("/:id", Authorization, updatePost);
postRouter.delete("/:id", Authorization, deletePost);
postRouter.get("/allpost", Authorization, getAllPost);
postRouter.get("/mypost", Authorization, getMyPost); //Add new route
postRouter.get("/:id", Authorization, getPost);
postRouter.post("/like/:id", Authorization, addLike);
postRouter.post("/dislike/:id", Authorization, addDislike);

module.exports = postRouter;
