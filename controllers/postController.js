//Import
const {
  createNewPost,
  updateThePost,
  deleteThePost,
  findPostByUserId,
  findAllPost,
  findPostByPostId,
  toggleLike,
  toggleDislike,
} = require("../services/postServices");
const { notFoundError } = require("../customErrors/customErrorClass");
const { catchError } = require("../utils/catchAsync");

//Controller
//Creating Post - controller
const createPost = catchError(async (req, res) => {
  //Variables
  const { feed } = req.body;
  const currUserId = req.user.id;

  //Services
  const post = await createNewPost(feed, currUserId);
  res.status(200).json({ Status: "Post Created", Post_Details: post });
});

//Update Post - Controller
const updatePost = catchError(async (req, res) => {
  //Variables
  const { feed } = req.body;
  const postId = req.params.id;
  const currentUserId = req.user.id;

  //Services
  const updationProcess = await updateThePost(postId, currentUserId, feed);
  res.status(updationProcess.statusCode).json({ updationProcess });
});

//delete post - controller
const deletePost = catchError(async (req, res) => {
  //Variables
  const postId = req.params.id;
  const currentUserId = req.user.id;

  //Services
  const deletionProcess = await deleteThePost(postId, currentUserId);
  res.status(deletionProcess.statusCode).json({ Details: deletionProcess });
});

//Get All post in Application
const getAllPost = catchError(async (req, res) => {
  //services
  const all_post = await findAllPost();
  return res.status(200).json({ All_Post: all_post });
});

//Get All Post of Current User  - Controller
const getMyPost = catchError(async (req, res) => {
  //Variables
  const currentUserId = req.user.id;

  //Services
  const currentUserPost = await findPostByUserId(currentUserId);
  return res.status(200).json({ My_Post: currentUserPost });
});

//Getting a particular post
const getPost = catchError(async (req, res) => {
  //Variables
  const postId = req.params.id;

  //Services
  const post = await findPostByPostId(postId);
  if (!post) {
    const error = new notFoundError();
    return res.status(error.statusCode).json({ Details: error });
  }
  res.status(200).json({ Status: "Post Found", Post_Details: post });
});

//Adding Like to post
const addLike = catchError(async (req, res) => {
  //Variables
  const postId = req.params.id;
  const currentUserId = req.user.id;

  //Service
  const likeProcess = await toggleLike(postId, currentUserId);
  res.status(likeProcess.statusCode).json({ Details: likeProcess });
});

//Adding Dislike to post
const addDislike = catchError(async (req, res) => {
  //Variables...
  const postId = req.params.id;
  const currentUserId = req.user.id;

  //Services
  const dislikeProcess = await toggleDislike(postId, currentUserId);
  res.status(dislikeProcess.statusCode).json({ Details: dislikeProcess });
});

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
