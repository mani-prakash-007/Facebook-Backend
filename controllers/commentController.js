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
const { catchError } = require("../utils/catchAsync");
("");

//Getting All Comments
const getComment = catchError(async (req, res) => {
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
});

//Creating Comment
const createComment = catchError(async (req, res) => {
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
});

//Update Comment
const updateComment = catchError(async (req, res) => {
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
});

//Delete comment
const deleteComment = catchError(async (req, res) => {
  console.log("\n Controller (deleteComment) - Executing");
  //Variables
  const commentId = req.params.id;
  const currentUserId = req.user.id;

  //Services
  const deletingProcess = await deleteTheComment(commentId, currentUserId);
  res.status(deletingProcess.statusCode).json({ deletingProcess });
});

//Toggling Like to Comment...
const addLike = catchError(async (req, res) => {
  console.log("\n Controller (addlike) - Executing");
  //Variables
  const commentId = req.params.id;
  const currentUserId = req.user.id;
  //Services
  const likeprocess = await toggleCommentLike(commentId, currentUserId);
  res.status(likeprocess.statusCode).json({ Details: likeprocess });
});

//Toggling Dislike to Comment...
const addDislike = catchError(async (req, res) => {
  console.log("\n Controller (addDislike) - Executing");
  //Variables
  const commentId = req.params.id;
  const currentUserId = req.user.id;

  //Services
  const dislikeProcess = await toggleCommentDislike(commentId, currentUserId);
  res.status(dislikeProcess.statusCode).json({ Details: dislikeProcess });
});

module.exports = {
  getComment,
  createComment,
  updateComment,
  deleteComment,
  addLike,
  addDislike,
};
