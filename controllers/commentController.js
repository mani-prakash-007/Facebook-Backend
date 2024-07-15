// getComment , createComment , updateComment,  deleteComment,
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");

//Getting All Comments
const getComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  //   console.log(post.id);
  if (!post) {
    return res.status(200).json({ Error: "Post not Found" });
  }
  const AllComment = await Comment.find({ post: post.id });
  res.status(200).json({ All_Comments: AllComment });
};

//Creating Comment
const createComment = async (req, res) => {
  const { comment } = req.body;
  const post = await Post.findById(req.params.id);
  //   console.log(`Post id : ${post_id}`);
  if (!post) {
    return res.status(200).json({ Error: "Post Not Found" });
  }
  const user_id = req.user.id;
  //   console.log(`User ID : ${user_id}`);
  if (!user_id) {
    return res.status(200).json({ Error: "Login to Add Comment" });
  }
  if (!comment) {
    return res.status(400).json({ Error: "Enter a Comment.." });
  }
  //
  if (!post.comments.includes(user_id)) {
    post.comments.push(user_id);
    await post.save();
  }
  //
  const comment_data = await Comment.create({
    user: req.user.id,
    post: req.params.id,
    comment: comment,
  });
  res.status(200).json({ Status: "Comment Added", comment_Data: comment_data });
};

//Update Comment
const updateComment = async (req, res) => {
  //   const { comment } = req.body;
  const comment_data = await Comment.findById(req.params.id);
  if (!comment_data) {
    res.status(200).json({ Error: "Comment not Found" });
  }
  if (req.user.id == comment_data.user) {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ Status: "Comment Updated...", Updated_Comment: updatedComment });
  } else {
    res.status(400).json({ Error: "Comment not Belongs to current user" });
  }
};

//Delete comment
const deleteComment = async (req, res) => {
  const comment_data = await Comment.findById(req.params.id);
  if (!comment_data) {
    return res.status(200).json({ Error: "Comment not Found" });
  }
  const user = comment_data.user;
  const post = comment_data.post;
  //   console.log("1.Comment Owner :", user);
  //   console.log("2.Comment Data : ", comment_data, typeof comment_data);
  //   console.log("3.Current User ID : ", req.user.id, typeof req.user.id);
  const post_data = await Post.findById(post);
  //   console.log("4.Post Details :  ", post_data);

  if (req.user.id == comment_data.user) {
    if (post_data.comments.includes(user)) {
      post_data.comments.pop(comment_data.user);
      await post_data.save();
      console.log("Popped user id from post");
    }
    Comment.findByIdAndDelete(req.params.id)
      .then(() => {
        return res.status(200).json({ Status: "Comment Deleted" });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ Status: "Comment not Deleted", Error: err });
      });
  } else {
    res.status(400).json({ Error: "Comment not Belongs to current user " });
  }
};

module.exports = { getComment, createComment, updateComment, deleteComment };
