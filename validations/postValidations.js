//Imports
const Joi = require("joi");

//Schemas for Post
//Feed schema
const feedSchema = Joi.object({
  feed: Joi.string().min(1).required().messages({
    "string.min": "Feed must contain at least 1 letter.",
    "any.required": "Feed is required.",
  }),
});

//Post Id schema
const postIdSchema = Joi.object({
  id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).messages({
    "string.pattern.base":
      "Invalid ID format. Please provide a valid 24-character hexadecimal ID.",
  }),
});

module.exports = { feedSchema, postIdSchema };
