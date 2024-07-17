const Joi = require("joi");

const validateComment = async (comment) => {
  const schema = Joi.object({
    feed: Joi.string().min(1).required().messages({
      "string.min": "Comment must contain at least 1 letter.",
      "any.required": "Comment is required.",
    }),
  });
  const { error: commentError, value: commentValue } = schema.validate({
    feed: comment,
  });
  if (commentError) {
    return commentError;
  }
};

const validateCommentId = async (commentId) => {
  const postIdSchema = Joi.object({
    id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).messages({
      "string.pattern.base":
        "Invalid ID format. Please provide a valid 24-character hexadecimal ID.",
    }),
  });
  const { error: commentIdError, value: postIdValue } = postIdSchema.validate({
    id: commentId,
  });
  if (commentIdError) {
    return commentIdError;
  }
};

module.exports = { validateComment, validateCommentId };
