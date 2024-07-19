//Importing Services and Validations
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

//After Authorization --> return type = req.user (id , Fname , lname , email)
//Creating Post - controller
const createPost = async (req, res) => {
  try {
    console.log("Controller (createPost) - Executing");
    //Variables
    const { feed } = req.body;
    const currUserId = req.user.id;

    //Services
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
    console.log("Controller (UpdatePost) - Executing");
    //Variables
    const { feed } = req.body;
    const postId = req.params.id;
    const currentUserId = req.user.id;

    //Services
    const updationProcess = await updateThePost(postId, currentUserId, feed);
    res.status(updationProcess.statusCode).json({ updationProcess });
  } catch (error) {
    console.error("Error on Updating Post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//delete post - controller
const deletePost = async (req, res) => {
  try {
    console.log("Controller (deletePost) - Executing");
    //Variables
    const postId = req.params.id;
    const currentUserId = req.user.id;

    //Services
    const deletionProcess = await deleteThePost(postId, currentUserId);
    res.status(deletionProcess.statusCode).json({ Details: deletionProcess });
  } catch (error) {
    console.log("Error on Deleting post \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Get All post in Application
const getAllPost = async (req, res) => {
  try {
    //services
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
    //Variables
    const currentUserId = req.user.id;

    //Services
    const currentUserPost = await findPostByUserId(currentUserId);
    return res.status(200).json({ My_Post: currentUserPost });
  } catch (error) {
    console.error("Error on getting current user post\n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Getting a particular post
const getPost = async (req, res) => {
  try {
    console.log("Controller (getPost) - Executing");
    //Variables
    const postId = req.params.id;

    //Services
    const post = await findPostByPostId(postId);
    if (!post) {
      const error = new notFoundError();
      return res.status(error.statusCode).json({ Details: error });
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
    console.log("Controller (addlike) - Executing");
    //Variables
    const postId = req.params.id;
    const currentUserId = req.user.id;

    //Service
    const likeProcess = await toggleLike(postId, currentUserId);
    res.status(likeProcess.statusCode).json({ Details: likeProcess });
  } catch (error) {
    console.error("Error on Toggling Like \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};
//Adding Dislike to post
const addDislike = async (req, res) => {
  try {
    console.log("Controller (addDislike) - Executing");
    //Variables...
    const postId = req.params.id;
    const currentUserId = req.user.id;

    //Services
    const dislikeProcess = await toggleDislike(postId, currentUserId);
    res.status(dislikeProcess.statusCode).json({ Details: dislikeProcess });
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
