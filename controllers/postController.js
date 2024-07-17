const Post = require("../models/postSchema");
const {
  validateFeed,
  validatePostId,
} = require("../validations/postValidations");

const {
  createNewPost,
  updateThePost,
  deleteThePost,
  findPostByUserId,
  findAllPost,
  findPostByPostId,
} = require("../services/postServices");

//After Authorization --> return type = req.user (id , Fname , lname , email)
//Creating Post - controller
const createPost = async (req, res) => {
  try {
    //checking req.body
    const { feed } = req.body;
    const currUserId = req.user.id;
    //Validating Feed
    const feedValidation = await validateFeed(feed);
    if (feedValidation) {
      return res.status(400).json({ Error: feedValidation.details[0].message });
    }
    //   creating New Post
    const post = await createNewPost(feed, currUserId);
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
    const currentUserId = req.user.id;
    //Updating Post...
    const updationProcess = await updateThePost(postId, currentUserId, feed);
    res.status(updationProcess.statuscode).json({ updationProcess });
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
    const currentUserId = req.user.id;
    //Deleting the post
    const deletionProcess = await deleteThePost(postId, currentUserId);
    res.status(deletionProcess.statuscode).json({ deletionProcess });
  } catch (error) {
    console.log("Error on Deleting post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Get All post in Application
const getAllPost = async (req, res) => {
  try {
    const all_post = await findAllPost();
    return res.status(200).json({ All_Post: all_post });
  } catch (error) {
    console.error("Error on getting all post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Get All Post of Current User  - Controller
const getMyPost = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserPost = await findPostByUserId(currentUserId);
    // const currentuser_post = await Post.find({ user: req.user.id });
    return res.status(200).json({ My_Post: currentUserPost });
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
    const post = await findPostByPostId(postId);
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
    const post = await findPostByPostId(postId);
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
    const post = await findPostByPostId(postId);
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
