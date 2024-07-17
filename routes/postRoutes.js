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

postRouter.post("/", Authorization, createPost);
postRouter.put("/:id", Authorization, updatePost);
postRouter.delete("/:id", Authorization, deletePost);
postRouter.get("/allpost", Authorization, getAllPost);
postRouter.get("/mypost", Authorization, getMyPost);
postRouter.get("/:id", Authorization, getPost);
postRouter.post("/like/:id", Authorization, addLike);
postRouter.post("/dislike/:id", Authorization, addDislike);

module.exports = postRouter;
