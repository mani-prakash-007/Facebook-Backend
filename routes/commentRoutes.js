//Imports
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
const {
  commentSchema,
  commentIdSchema,
} = require("../validations/commentValidations");
const { postIdSchema } = require("../validations/postValidations");
const {
  validateFields,
  validateParams,
} = require("../middleware/validateFields");

//Routes
//Getting Comment
commentRoute.get(
  "/:id",
  Authorization,
  validateParams(postIdSchema),
  getComment
);

//Creating Comment
commentRoute.post(
  "/:id",
  Authorization,
  validateParams(postIdSchema),
  validateFields(commentSchema),
  createComment
);

//Updating Comment
commentRoute.put(
  "/:id",
  Authorization,
  validateParams(commentIdSchema),
  validateFields(commentSchema),
  updateComment
);

//Deleting Comment
commentRoute.delete(
  "/:id",
  Authorization,
  validateParams(commentIdSchema),
  deleteComment
);

//Toggling like to comment
commentRoute.post(
  "/like/:id",
  Authorization,
  validateParams(commentIdSchema),
  addLike
);

//Toggling dislike to comment
commentRoute.post(
  "/dislike/:id",
  Authorization,
  validateParams(commentIdSchema),
  addDislike
);

module.exports = commentRoute;
