//Imports
const Comment = require("../models/commentSchema");
const { findPostByPostId } = require("../services/postServices");
const {
  notFoundError,
  ownerShipError,
} = require("../customErrors/customErrorClass");

//Services
//Creating Comment
const createTheComment = async (comment, postId, currentUserId) => {
  const post = await findPostByPostId(postId);
  if (!post) {
    throw notFoundError("Post not Found");

  }
  if (!currentUserId) {
    throw new notFoundError("Current userId not Found");
  }
  const commentData = await Comment.create({
    user: currentUserId,
    post: postId,
    comment: comment,
  });
  post.comments.push(commentData.id);
  await post.save();
  return { statusCode: 200, Status: "Comment Added", CommentData: commentData };
};

//Getting Comment By PostID
const getCommentsByPostId = async (postId) => {
  const commentData = await Comment.find({ post: postId });
  if (commentData.length > 0) {
    return { statusCode: 200, Status: "Comments Found", Comments: commentData };
  } else {
    throw new notFoundError("No Comments for the Post");
  }
};

// Getting Comment by CommentID
const getCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment;
};

//Updating the Comment
const updateTheComment = async (commentId, currentUserId, comment) => {
  const commentData = await getCommentById(commentId);
  if (commentData != null) {
    if (currentUserId === commentData.user.toString()) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { comment: comment },
        { new: true }
      );
      return {
        statusCode: 200,
        Status: " Comment Updated",
        UpdatedComment: updatedComment,
      };
    } else {
      throw new ownerShipError(" Post not belongs to Current User");
    }
  } else {
    throw new notFoundError("Comment not Found");
  }
};

//Deleting Comment
const deleteTheComment = async (commentId, currentUserId) => {
  const commentData = await getCommentById(commentId);
  if (!commentData) {
    throw new notFoundError("Comment not Found");
  }
  if (commentData) {
    const postData = await findPostByPostId(commentData.post);
    if (
      currentUserId === commentData.user.toString() ||
      currentUserId === postData.user.toString()
    ) {
      console.log("Iner if condition");
      //Removing CommentUserId in the Post
      if (postData.comments.includes(commentData.user)) {
        postData.comments.pop(commentData.user);
        await postData.save();
      }
      //Deleting Comment
      await Comment.findByIdAndDelete(commentId);
      return { statusCode: 200, Status: "Comment Deleted" };
    } else {
      throw ownerShipError("Comment not belongs to Current User");
    }
  } else {
  }
};

//Toggling Like
const toggleCommentLike = async (commentId, currentUserId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw notFoundError("Comment not found");
  }
  if (!comment.likes.includes(currentUserId)) {
    if (comment.dislikes.includes(currentUserId)) {
      comment.dislikes.pop();
      await comment.save();
    }
    comment.likes.push(currentUserId);
    await comment.save();
    return { statusCode: 200, Status: "Like added to comment" };
  } else if (comment.likes.includes(currentUserId)) {
    comment.likes.pop(currentUserId);
    await comment.save();
    return { statusCode: 200, Status: "Like removed from comment" };
  }
};

//Toggling Dislike
const toggleCommentDislike = async (commentId, currentUserId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw notFoundError("Comment not found");
  }
  if (!comment.dislikes.includes(currentUserId)) {
    if (comment.likes.includes(currentUserId)) {
      comment.likes.pop();
      await comment.save();
    }
    comment.dislikes.push(currentUserId);
    await comment.save();
    return { statusCode: 200, Status: "Dislike added to comment" };
  } else if (comment.dislikes.includes(currentUserId)) {
    comment.dislikes.pop(currentUserId);
    await comment.save();
    return { statusCode: 200, Status: "Dislike removed to comment" };
  }
};
module.exports = {
  createTheComment,
  getCommentsByPostId,
  updateTheComment,
  getCommentById,
  deleteTheComment,
  toggleCommentLike,
  toggleCommentDislike,
};
