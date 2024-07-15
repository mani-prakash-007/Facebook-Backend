// getComment , createComment , updateComment,  deleteComment,
const Post = require("../models/postSchema");
const Comment = require("../models/commentSchema");

//Getting All Comments
const getComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ Error: "Post not Found" });
    }
    const AllComment = await Comment.find({ post: post.id });
    res.status(200).json({ All_Comments: AllComment });
  } catch (error) {
    console.error("Error on fetching comments \n", error);
    res.status(500).json({ Error: "Server Error" });
  }
};

//Creating Comment
const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ Error: "Post Not Found" });
    }
    const user_id = req.user.id;
    if (!user_id) {
      return res.status(401).json({ Error: "Login to Add Comment" });
    }
    if (!comment) {
      return res.status(400).json({ Error: "Enter Comment...!!" });
    }
    //add user id to comment array in commentSchema
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
    res
      .status(200)
      .json({ Status: "Comment Added", comment_Data: comment_data });
  } catch (error) {
    console.error("Error on creating comment \n", error);
    res.status(500).json({ Error: "Server Error" });
  }
};

//Update Comment
const updateComment = async (req, res) => {
  try {
    const comment_data = await Comment.findById(req.params.id);
    if (!comment_data) {
      res.status(404).json({ Error: "Comment not Found" });
    }
    if (req.user.id == comment_data.user) {
      try {
        const updatedComment = await Comment.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        res
          .status(200)
          .json({ Status: "Comment Updated", Updated_Comment: updatedComment });
      } catch (error) {
        return res
          .status(400)
          .json({ Status: "Comment not Updated", Error: error.message });
      }
    } else {
      res.status(403).json({ Error: "Comment not Belongs to current user" });
    }
  } catch (error) {
    console.error("Error on updating Comment \n", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment_data = await Comment.findById(req.params.id);
    if (!comment_data) {
      return res.status(404).json({ Error: "Comment not Found" });
    }
    const user = comment_data.user;
    const post = comment_data.post;
    const post_data = await Post.findById(post);

    if (req.user.id == comment_data.user) {
      if (post_data.comments.includes(user)) {
        post_data.comments.pop(comment_data.user);
        await post_data.save();
        console.log("Popped user id from post");
      }
      try {
        await Comment.findByIdAndDelete(req.params.id);
        return res.status(200).json({ Status: " Comment Deleted" });
      } catch (error) {
        return res
          .status(400)
          .json({ Status: "Comment not Deleted", Error: error.message });
      }
    } else {
      res.status(403).json({ Error: "Comment not Belongs to current user " });
    }
  } catch (error) {
    console.error("Error on Deleting Comment \n", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Toggling Like to Comment
const addLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const curr_user_id = req.user.id;

    if (!comment.likes.includes(curr_user_id)) {
      if (comment.dislike.includes(curr_user_id)) {
        comment.dislike.pop();
        await comment.save();
      }
      comment.likes.push(curr_user_id);
      await comment.save();
      res.status(200).json({ Status: "Like added to comment" });
    } else if (comment.likes.includes(curr_user_id)) {
      comment.likes.pop(curr_user_id);
      await comment.save();
      res.status(200).json({ Status: "Like removed from comment" });
    }
  } catch (error) {
    console.error("Error on Toggling Like \n", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Toggling Dislike to Comment
const addDislike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const curr_user_id = req.user.id;
    console.log(comment);
    console.log(curr_user_id);

    if (!comment.dislike.includes(curr_user_id)) {
      if (comment.likes.includes(curr_user_id)) {
        comment.likes.pop();
        await comment.save();
      }
      comment.dislike.push(curr_user_id);
      await comment.save();
      res.status(200).json({ Status: "Dislike added to comment" });
    } else if (comment.dislike.includes(curr_user_id)) {
      comment.dislike.pop(curr_user_id);
      await comment.save();
      res.status(200).json({ Status: "Dislike removed from comment" });
    }
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
