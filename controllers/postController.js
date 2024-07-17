const Post = require("../models/postSchema");
const User = require("../models/userSchema");
const Joi = require("joi");
const {
  validateFeed,
  validatePostId,
} = require("../validations/postValidations");

//After Authorization --> return type = req.user (id , Fname , lname , email)
//Creating Post - controller
const createPost = async (req, res) => {
  try {
    //checking req.body
    const { feed } = req.body;
    //Validating Feed
    const feedValidation = await validateFeed(feed);
    if (feedValidation) {
      return res.status(400).json({ Error: feedValidation.details[0].message });
    }
    //   creating New Post
    const post = await Post.create({
      user: req.user.id,
      feed: feed,
    });
    res.status(200).json({ Status: "Post Created", Post_Details: post });
  } catch (error) {
    console.error("Error on Creating Post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Update Post - Controller
const updatePost = async (req, res) => {
  try {
    //checking req.body
    const { feed } = req.body;
    //Validating Feed...
    const feedValidation = await validateFeed(feed);
    if (feedValidation) {
      return res.status(400).json({ Error: feedValidation.details[0].message });
    }
    //Validating PostId
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    //Current user id
    const curr_user = req.user;
    if (!curr_user) {
      return res.status(404).json({ Error: "Not a registered user" });
    }
    //fetching post by id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ Error: "No Post Found" });
    }
    //updating post by id
    if (curr_user.id === post.user.toString()) {
      try {
        const updated_post = await Post.findByIdAndUpdate(
          req.params.id,
          { feed: feed },
          {
            new: true,
          }
        );
        return res
          .status(200)
          .json({ Status: "Post Updated", Updated_Post_Details: updated_post });
      } catch (error) {
        return res.status(400).json({
          Status: "Post not Updated",
          Error: error.message,
        });
      }
    } else {
      return res.status(403).json({
        Error: "Post not belongs to Current user",
      });
    }
  } catch (error) {
    console.error("Error on Updating Post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//delete post - controller
const deletePost = async (req, res) => {
  try {
    //Validating PostId
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    const curr_user = req.user;
    //fetching post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ Error: "No Post Found" });
    }
    if (!curr_user) {
      return res.status(400).json({ Error: "Not a registered user" });
    }
    //deleting post
    if (curr_user.id === post.user.toString()) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({ Status: "Post Deleted" });
      } catch (err) {
        return res.status(400).json({ Status: "Post not Deleted", Error: err });
      }
    } else {
      return res.status(200).json({
        Status: "Post can't be deleted",
        Details: "Post not belongs to Current user",
      });
    }
  } catch (error) {
    console.log("Error on Deleting post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Get All post in Application
const getAllPost = async (req, res) => {
  try {
    const all_post = await Post.find();
    return res.status(200).json({ All_Post: all_post });
  } catch (error) {
    console.error("Error on getting all post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Get All Post of Current User  - Controller
const getMyPost = async (req, res) => {
  try {
    const currentuser_post = await Post.find({ user: req.user.id });
    return res.status(200).json({ My_Post: currentuser_post });
  } catch (error) {
    console.error("Error on getting current user post\n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Getting a particular post
const getPost = async (req, res) => {
  try {
    //Validating PostId
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    //fetching post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ Error: "Post not Found" });
    }
    res.status(200).json({ Status: "Post Found", Post_Details: post });
  } catch (error) {
    console.error("Running getPost Controller...");
    console.error("Error on getting particular post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Adding Like to post
const addLike = async (req, res) => {
  try {
    //checking req.params
    //Validating PostId
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    //fetching post by id
    const post = await Post.findById(postId);
    const currentUserId = req.user.id;
    //Toggling like to post
    if (!post.likes.includes(currentUserId)) {
      if (post.dislikes.includes(currentUserId)) {
        post.dislikes.pop();
        await post.save();
      }
      post.likes.push(currentUserId);
      await post.save();
      res.status(200).json({ Status: "Like Added to the post" });
    } else if (post.likes.includes(currentUserId)) {
      post.likes.pop(currentUserId);
      await post.save();
      res.status(200).json({ Status: "Like Removed from the post" });
    }
  } catch (error) {
    console.error("Error on Toggling Like \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Adding Dislike to post
const addDislike = async (req, res) => {
  try {
    //checking req.params
    //Validating PostId
    const postId = req.params.id;
    const postIdValidation = await validatePostId(postId);
    if (postIdValidation) {
      return res
        .status(400)
        .json({ Error: postIdValidation.details[0].message });
    }
    //fetching post by id
    const post = await Post.findById(postId);
    const currentUserId = req.user.id;
    //Toggling dislike to post
    if (!post.dislikes.includes(currentUserId)) {
      if (post.likes.includes(currentUserId)) {
        post.likes.pop();
        await post.save();
      }
      post.dislikes.push(currentUserId);
      await post.save();
      res.status(200).json({ Message: "Dislike Added to the post" });
    } else if (post.dislikes.includes(req.user.id)) {
      post.dislikes.pop(currentUserId);
      await post.save();
      res.status(200).json({ Message: "Dislike Removed from post" });
    }
  } catch (error) {
    console.error("Error on Toggling Dislike \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getMyPost,
  addLike,
  addDislike,
  getPost,
};
