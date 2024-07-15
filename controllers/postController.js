const Post = require("../models/postSchema");
const User = require("../models/userSchema");

//After Authorization --> return type = req.user (id , Fname , lname , email)
//Creating Post - controller
const createPost = async (req, res) => {
  const { title, description, image, location } = req.body;
  if (!title || !description || !image) {
    res
      .send(400)
      .json({ message: "Enter required fields ( Title , desc , image )" });
  }
  //   creating New Post
  const post = await Post.create({
    user: req.user.id,
    title: title,
    description: description,
    image: image,
    location: location,
  });
  res.status(200).json({ Message: "Post Created", Post_Details: post });
};
//Update Post - Controller
const updatePost = async (req, res) => {
  const curr_user = req.user;
  const post_owner = await Post.findById(req.params.id);
  if (!post_owner) {
    return res.status(400).json({ Message: "No Post Found" });
  }
  if (!curr_user) {
    return res.status(400).json({ Message: "No User Found" });
  }

  if (curr_user.id === post_owner.user.toString()) {
    const updated_post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ status: "Post Updated", Updated_Post_Details: updated_post });
  } else {
    return res.status(200).json({
      message: "Post can't be Updated",
      Details: "Post not belongs to Current user",
    });
  }
};
//
const deletePost = async (req, res) => {
  const curr_user = req.user;
  const post_owner = await Post.findById(req.params.id);
  if (!post_owner) {
    return res.status(400).json({ Message: "No Post Found" });
  }
  if (!curr_user) {
    return res.status(400).json({ Message: "No User Found" });
  }
  if (curr_user.id === post_owner.user.toString()) {
    Post.findByIdAndDelete(req.params.id)
      .then(() => {
        return res.status(200).json({ Status: "Post Deleted" });
      })
      .catch((err) => {
        return res.status(400).json({ Status: "Post not Deleted", Error: err });
      });
  } else {
    return res.status(200).json({
      message: "Post can't be deleted",
      Details: "Post not belongs to Current user",
    });
  }
};

//Get All Post in the application - controller
const getAllPost = async (req, res) => {
  const all_post = await Post.find();
  return res.status(200).json({ All_Post: all_post });
};
//Get All Post of Current User  - Controller
const getMyPost = async (req, res) => {
  const all_post = await Post.find(req.params.id);
  return res.status(200).json({ My_Post: all_post });
};

const addLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const curr_user_id = req.user.id;

  if (!post.likes.includes(req.user.id)) {
    post.likes.push(curr_user_id);
    await post.save();
    res.status(200).json({ Message: "Like Added..." });
  } else if (post.likes.includes(req.user.id)) {
    post.likes.pop(curr_user_id);
    await post.save();
    res.status(200).json({ Message: "Like Removed..." });
  }
};
const addDislike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const curr_user_id = req.user.id;
  if (!post.dislikes.includes(curr_user_id)) {
    if (post.likes.includes(curr_user_id)) {
      post.likes.pop();
      await post.save();
      //   console.log("Like Removed");
    }
    post.dislikes.push(curr_user_id);
    await post.save();
    // console.log("Dislike Added");
    res.status(200).json({ Message: "Dislike Added..." });
  } else if (post.dislikes.includes(req.user.id)) {
    post.dislikes.pop(curr_user_id);
    await post.save();
    res.status(200).json({ Message: "Dislike Removed..." });
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
};
