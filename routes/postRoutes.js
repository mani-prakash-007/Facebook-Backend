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
const {
  validateFields,
  validateParams,
} = require("../middleware/validateFields");
const { feedSchema, postIdSchema } = require("../validations/postValidations");

//Routes
//Creating Post
postRouter.post("/", Authorization, validateFields(feedSchema), createPost);

//Updating post
postRouter.put(
  "/:id",
  Authorization,
  validateParams(postIdSchema),
  validateFields(feedSchema),
  updatePost
);

//Deleting post
postRouter.delete(
  "/:id",
  Authorization,
  validateParams(postIdSchema),
  deletePost
);

//Getting all Post
postRouter.get("/allpost", Authorization, getAllPost);

//Getting current user post
postRouter.get("/mypost", Authorization, getMyPost);

//Getting post by Id
postRouter.get("/:id", Authorization, validateParams(postIdSchema), getPost);

//Toggling likes to post
postRouter.post(
  "/like/:id",
  Authorization,
  validateParams(postIdSchema),
  addLike
);

//Toggling dislikes to post
postRouter.post(
  "/dislike/:id",
  Authorization,
  validateParams(postIdSchema),
  addDislike
);

module.exports = postRouter;
