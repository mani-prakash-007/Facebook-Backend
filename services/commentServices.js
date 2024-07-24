//Imports
const Comment = require("../models/commentSchema");
const Post = require("../models/postSchema");
const {
  NotFoundError,
  OwnerShipError,
} = require("../customErrors/customErrorClass");

//Services
//Creating Comment
const createTheComment = async (comment, postId, currentUserId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not Found");
  }
  if (!currentUserId) {
    throw new NotFoundError("Current userId not Found");
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
    throw new NotFoundError("No Comments for the Post");
  }
};

// Getting Comment by CommentID
const getCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment;
};

//Updating the Comment
const updateTheComment = async (commentId, currentUserId, comment) => {
  const commentData = await Comment.findById(commentId);
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
      throw new OwnerShipError(" Post not belongs to Current User");
    }
  } else {
    throw new NotFoundError("Comment not Found");
  }
};

//Deleting Comment
const deleteTheComment = async (commentId, currentUserId) => {
  const commentData = await Comment.findById(commentId);
  if (!commentData) {
    throw new NotFoundError("Comment not Found");
  }
  if (commentData) {
    const postData = await Post.findById(commentData.post);
    if (
      currentUserId === commentData.user.toString() ||
      currentUserId === postData.user.toString()
    ) {
      //Removing CommentUserId in the Post
      if (postData.comments.includes(commentData.id)) {
        postData.comments.pop(commentData.id);
        await postData.save();
      }
      //Deleting Comment
      await Comment.findByIdAndDelete(commentId);
      return { statusCode: 200, Status: "Comment Deleted" };
    } else {
      throw new OwnerShipError("Comment not belongs to Current User");
    }
  }
};

//Toggling Like
const toggleCommentLike = async (commentId, currentUserId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
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
    throw new NotFoundError("Comment not found");
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
    return { statusCode: 200, Status: "Dislike removed from comment" };
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
