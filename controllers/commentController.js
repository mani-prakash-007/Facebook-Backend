//Importing Services and Validations
const {
  validateComment,
  validateCommentId,
} = require("../validations/commentValidations");
const { validatePostId } = require("../validations/postValidations");
const { findPostByPostId } = require("../services/postServices");
const {
  createTheComment,
  getCommentsByPostId,
  updateTheComment,
  getCommentById,
  deleteTheComment,
} = require("../services/commentServices");

//Getting All Comments
const getComment = async (req, res) => {
  try {
    //Validating postid
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    //Fetching Post by id and Returning the all comments of the post
    const post = await findPostByPostId(postId);
    if (!post) {
      return res.status(404).json({ Error: "Post not Found" });
    }
    const gettingComments = await getCommentsByPostId(postId);
    res.status(gettingComments.Statuscode).json(gettingComments);
  } catch (error) {
    console.error("Error on fetching comments \n", error);
    res.status(500).json({ Error: "Server Error" });
  }
};

//Creating Comment
const createComment = async (req, res) => {
  try {
    // Validating Comment
    const { comment } = req.body;
    const commentValidation = await validateComment(comment);
    if (commentValidation) {
      return res
        .status(400)
        .json({ Error: commentValidation.details[0].message });
    }
    //Validating PostId
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    //Fetching post
    const post = await findPostByPostId(postId);
    if (!post) {
      return res.status(404).json({ Error: "Post Not Found" });
    }
    //Checking User id
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ Error: "Login to Add Comment" });
    }
    //add user id to comment array in commentSchema
    if (!post.comments.includes(userId)) {
      post.comments.push(userId);
      await post.save();
    }
    //creating comment for the post
    const comentingProcess = await createTheComment(comment, postId, userId);
    res.status(comentingProcess.Statuscode).json({ comentingProcess });
  } catch (error) {
    console.error("Error on creating comment \n", error);
    res.status(500).json({ Error: "Server Error" });
  }
};

//Update Comment
const updateComment = async (req, res) => {
  try {
    //Validating Comment
    const { comment } = req.body;
    const currentUserId = req.user.id;
    const commentValidation = await validateComment(comment);
    if (commentValidation) {
      return res
        .status(400)
        .json({ Error: commentValidation.details[0].message });
    }
    //Validating Comment id..
    const commentId = req.params.id;
    const commentIdValidation = await validateCommentId(commentId);
    if (commentIdValidation) {
      return res
        .status(400)
        .json({ Error: commentIdValidation.details[0].message });
    }
    // fetching comment by id
    const updatingComment = await updateTheComment(
      commentId,
      currentUserId,
      comment
    );
    res.status(updatingComment.Statuscode).json({ updatingComment });
  } catch (error) {
    console.error("Error on updating Comment \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Delete comment
const deleteComment = async (req, res) => {
  try {
    //Validating Comment id..
    const commentId = req.params.id;
    const currentUserId = req.user.id;
    const commentIdValidation = await validateCommentId(commentId);
    if (commentIdValidation) {
      return res
        .status(400)
        .json({ Error: commentIdValidation.details[0].message });
    }
    //Deleting Comment
    const deletingProcess = await deleteTheComment(commentId, currentUserId);
    res.status(deletingProcess.StatusCode).json({ deletingProcess });
  } catch (error) {
    console.error("Error on Deleting Comment \n", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Toggling Like to Comment...
const addLike = async (req, res) => {
  try {
    //Checking Comment id..
    const commentId = req.params.id;
    const commentIdValidation = await validateCommentId(commentId);
    if (commentIdValidation) {
      return res
        .status(400)
        .json({ Error: commentIdValidation.details[0].message });
    }
    //fetching comment
    const comment = await getCommentById(commentId);
    const currentUserId = req.user.id;
    //Checking the comment exist
    if (!comment) {
      return res.status(404).json({ Error: "Comment not found" });
    }
    //Toggling like for the comment
    if (!comment.likes.includes(currentUserId)) {
      if (comment.dislikes.includes(currentUserId)) {
        comment.dislikes.pop();
        await comment.save();
      }
      comment.likes.push(currentUserId);
      await comment.save();
      res.status(200).json({ Status: "Like added to comment" });
    } else if (comment.likes.includes(currentUserId)) {
      comment.likes.pop(currentUserId);
      await comment.save();
      res.status(200).json({ Status: "Like removed from comment" });
    }
  } catch (error) {
    console.error("Error on Toggling Like \n", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Toggling Dislike to Comment...
const addDislike = async (req, res) => {
  try {
    //Checking Comment id..
    const commentId = req.params.id;
    const commentIdValidation = await validateCommentId(commentId);
    if (commentIdValidation) {
      return res
        .status(400)
        .json({ Error: commentIdValidation.details[0].message });
    }
    //fetching comment
    const comment = await getCommentById(commentId);
    const currentUserId = req.user.id;
    //Checking the comment exist
    if (!comment) {
      return res.status(404).json({ Error: "Comment not found" });
    }
    //toggling dislikes to comment
    if (!comment.dislikes.includes(currentUserId)) {
      if (comment.likes.includes(currentUserId)) {
        comment.likes.pop();
        await comment.save();
      }
      comment.dislikes.push(currentUserId);
      await comment.save();
      res.status(200).json({ Status: "Dislike added to comment" });
    } else if (comment.dislikes.includes(currentUserId)) {
      comment.dislikes.pop(currentUserId);
      await comment.save();
      res.status(200).json({ Status: "Dislike removed from comment" });
    }
  } catch (error) {
    console.error("Error on Toggling Dislike \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

module.exports = {
  getComment,
  createComment,
  updateComment,
  deleteComment,
  addLike,
  addDislike,
};
