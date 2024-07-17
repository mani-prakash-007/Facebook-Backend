const Post = require("../models/postSchema");

const createNewPost = async (feed, userId) => {
  const post = await Post.create({
    user: userId,
    feed: feed,
  });
  return post;
};

//Update the post...
const updateThePost = async (postId, userId, feed) => {
  const post = await findPostByPostId(postId);
  if (!post) {
    return { statuscode: 404, Error: "Post not Found" };
  }
  if (userId === post.user.toString()) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { feed: feed },
      {
        new: true,
      }
    );
    console.log(updatedPost);
    return {
      statuscode: 200,
      Status: "Post Updated",
      Updated_Post_Details: updatedPost,
    };
  } else {
    return { statuscode: 403, Error: " Post not belongs to Current User" };
  }
};

//Delete the post

const deleteThePost = async (postId, userId) => {
  const post = await findPostByPostId(postId);
  if (!post) {
    return { statuscode: 404, Error: "No Post Found" };
  }
  if (userId === post.user.toString()) {
    await Post.findByIdAndDelete(postId);
    return { statuscode: 200, Status: "Post Deleted" };
  } else {
    return { statuscode: 400, Error: "Post not belongs to current user" };
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
module.exports = {
  createNewPost,
  updateThePost,
  deleteThePost,
  findPostByUserId,
  findAllPost,
  findPostByPostId,
};
