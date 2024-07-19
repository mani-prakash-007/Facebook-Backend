//Importing Services and Validations
const { findPostByPostId } = require("../services/postServices");
const {
  createTheComment,
  getCommentsByPostId,
  updateTheComment,
  deleteTheComment,
  toggleCommentLike,
  toggleCommentDislike,
} = require("../services/commentServices");

const { notFoundError } = require("../customErrors/customErrorClass");

//Getting All Comments
const getComment = async (req, res) => {
  try {
    console.log("\n Controller (getComment) - Executing");
    //Variables
    const postId = req.params.id;

    //Services
    //Services - 1
    const post = await findPostByPostId(postId);
    if (!post) {
      const error = new notFoundError("Post not Found");
      return res.status(error.statusCode).json({ Details: error });
    }
    //Services - 2
    const gettingComments = await getCommentsByPostId(postId);
    res.status(gettingComments.statusCode).json(gettingComments);
  } catch (error) {
    console.error("Error on fetching comments \n", error);
    res.status(500).json({ Error: "Server Error" });
  }
};

//Creating Comment
const createComment = async (req, res) => {
  try {
    console.log("\n Controller (createComment) - Executing");
    //Variables
    const { comment } = req.body;
    const currentUserId = req.user.id;
    const postId = req.params.id;

    //Services
    const comentingProcess = await createTheComment(
      comment,
      postId,
      currentUserId
    );
    res.status(comentingProcess.statusCode).json({ comentingProcess });
  } catch (error) {
    console.error("Error on creating comment \n", error);
    res.status(500).json({ Error: "Server Error" });
  }
};

//Update Comment
const updateComment = async (req, res) => {
  try {
    console.log("\n Controller (updateComment) - Executing");
    //Variables
    const { comment } = req.body;
    const currentUserId = req.user.id;
    const commentId = req.params.id;

    //Services
    const updatingComment = await updateTheComment(
      commentId,
      currentUserId,
      comment
    );
    res.status(updatingComment.statusCode).json({ updatingComment });
  } catch (error) {
    console.error("Error on updating Comment \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Delete comment
const deleteComment = async (req, res) => {
  try {
    console.log("\n Controller (deleteComment) - Executing");
    //Variables
    const commentId = req.params.id;
    const currentUserId = req.user.id;

    //Services
    const deletingProcess = await deleteTheComment(commentId, currentUserId);
    res.status(deletingProcess.statusCode).json({ deletingProcess });
  } catch (error) {
    console.error("Error on Deleting Comment \n", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Toggling Like to Comment...
const addLike = async (req, res) => {
  try {
    console.log("\n Controller (addlike) - Executing");
    //Variables
    const commentId = req.params.id;
    const currentUserId = req.user.id;
    //Services
    const likeprocess = await toggleCommentLike(commentId, currentUserId);
    res.status(likeprocess.statusCode).json({ Details: likeprocess });
  } catch (error) {
    console.error("Error on Toggling Like \n", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Toggling Dislike to Comment...
const addDislike = async (req, res) => {
  try {
    console.log("\n Controller (addDislike) - Executing");
    //Variables
    const commentId = req.params.id;
    const currentUserId = req.user.id;

    //Services
    const dislikeProcess = await toggleCommentDislike(commentId, currentUserId);
    res.status(dislikeProcess.statusCode).json({ Details: dislikeProcess });
  } catch (error) {
    console.error("Error on Toggling Dislike \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

module.exports = {
  getComment,
  createComment,
  updateComment,
  deleteComment,
  addLike,
  addDislike,
};
