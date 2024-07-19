//Imports
const Joi = require("joi");

//Schemas for Comment
//comment schema
const commentSchema = Joi.object({
  comment: Joi.string().min(1).required().messages({
    "string.min": "Comment must contain at least 1 letter.",
    "any.required": "Comment is required.",
  }),
});

//CommentId schema
const commentIdSchema = Joi.object({
  id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).messages({
    "string.pattern.base":
      "Invalid ID format. Please provide a valid 24-character hexadecimal ID.",
  }),
});

module.exports = {
  commentSchema,
  commentIdSchema,
};
