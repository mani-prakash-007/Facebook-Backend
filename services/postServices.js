//Imports
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");
const {
  NotFoundError,
  OwnerShipError,
} = require("../customErrors/customErrorClass");
//Services
//Create Post
const createNewPost = async (feed, userId) => {
  const post = await Post.create({
    user: userId,
    feed: feed,
  });
  return post;
};

//Update the post...
const updateThePost = async (postId, userId, feed) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not Found");
  }
  if (userId === post.user.toString()) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { feed: feed },
      {
        new: true,
      }
    );
    return {
      statusCode: 200,
      Status: "Post Updated",
      Updated_Post_Details: updatedPost,
    };
  } else {
    throw new OwnerShipError(" Post not belongs to Current User");
  }
};

//Delete the post
const deleteThePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not Found");
  }
  if (userId === post.user.toString()) {
    const commentIds = post.comments;
    for (let i = 0; i < commentIds.length; i++) {
      await Comment.findByIdAndDelete(commentIds[i]); //Avoiding Circular dependency
    }
    await Post.findByIdAndDelete(postId);
    return { statusCode: 200, Status: "Post Deleted" };
  } else {
    throw new OwnerShipError(" Post not belongs to Current User");
  }
};

//Find Post by UserID
const findPostByUserId = async (userId) => {
  return await Post.find({ user: userId });
};

//Find All Post
const findAllPost = async () => {
  return await Post.find();
};

//Find Post by postId
const findPostByPostId = async (postId) => {
  return await Post.findById(postId);
};

//Toggling Like
const toggleLike = async (postId, currentUserId) => {
  const post = await findPostByPostId(postId);
  if (!post) {
    throw new NotFoundError("Post not found");
  }
  if (!post.likes.includes(currentUserId)) {
    if (post.dislikes.includes(currentUserId)) {
      post.dislikes.pop();
      await post.save();
    }
    post.likes.push(currentUserId);
    await post.save();
    return { statusCode: 200, Status: "Like Added to the post" };
  } else if (post.likes.includes(currentUserId)) {
    post.likes.pop(currentUserId);
    await post.save();
    return { statusCode: 200, Status: "Like Removed from the post" };
  }
};

//Toggling Dislike
const toggleDislike = async (postId, currentUserId) => {
  const post = await findPostByPostId(postId);
  if (!post) {
    throw new NotFoundError("Post not found");
  }
  if (!post.dislikes.includes(currentUserId)) {
    if (post.likes.includes(currentUserId)) {
      post.likes.pop();
      await post.save();
    }
    post.dislikes.push(currentUserId);
    await post.save();
    return { statusCode: 200, Status: "Dislike Added to the post" };
  } else if (post.dislikes.includes(currentUserId)) {
    post.dislikes.pop(currentUserId);
    await post.save();
    return { statusCode: 200, Status: "Dislike Removed from the post" };
  }
};
module.exports = {
  createNewPost,
  updateThePost,
  deleteThePost,
  findPostByUserId,
  findAllPost,
  findPostByPostId,
  toggleLike,
  toggleDislike,
};
