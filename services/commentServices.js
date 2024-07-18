const Comment = require("../models/commentSchema");
const { findPostByPostId } = require("../services/postServices");

//Creating Comment
const createTheComment = async (comment, postId, currentUserId) => {
  const post = await findPostByPostId(postId);
  if (!post) {
    return { Statuscode: 404, Error: "Post not Found" };
  }
  if (!currentUserId) {
    return { Statuscode: 404, Error: "Current userId not Found" };
  }
  post.comments.push(currentUserId);
  await post.save();
  const commentData = await Comment.create({
    user: currentUserId,
    post: postId,
    comment: comment,
  });
  return { Statuscode: 200, Status: "Comment Added", CommentData: commentData };
};

//Getting Comment By PostID
const getCommentsByPostId = async (postId) => {
  const commentData = await Comment.find({ post: postId });
  if (commentData.length > 0) {
    return { Statuscode: 200, Status: "Comments Found", Comments: commentData };
  } else {
    return { Statuscode: 200, Message: "No Comments for the Post" };
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
        Statuscode: 200,
        Status: " Comment Updated",
        UpdatedComment: updatedComment,
      };
    } else {
      return {
        Statuscode: 400,
        Error: "Comment not Belongs to current user",
      };
    }
  } else {
    return { Statuscode: 400, Error: "Comment not found" };
  }
};

//Deleting Comment
const deleteTheComment = async (commentId, currentUserId) => {
  const commentData = await getCommentById(commentId);
  if (commentData != null) {
    const postData = await findPostByPostId(commentData.post);
    if (
      currentUserId === commentData.user.toString() ||
      currentUserId === postData.user.toString()
    ) {
      console.log("Inside Main condition");
      //Removing CommentUserId in the Post
      if (postData.comments.includes(commentData.user)) {
        postData.comments.pop(commentData.user);
        await postData.save();
      }
      //Deleting Comment
      await Comment.findByIdAndDelete(commentId);
      return { StatusCode: 200, Status: "Comment Deleted" };
    } else {
      return { StatusCode: 400, Error: "Comment not Belongs to current user" };
    }
  } else {
    return { Statuscode: 400, Error: "Comment not found" };
  }
};
module.exports = {
  createTheComment,
  getCommentsByPostId,
  updateTheComment,
  getCommentById,
  deleteTheComment,
};
