const Joi = require("joi");

//Joi Validation of Post Feed
const validateFeed = async (feed) => {
  const feedSchema = Joi.object({
    feed: Joi.string().min(1).required().messages({
      "string.min": "Feed must contain at least 1 letter.",
      "any.required": "Feed is required.",
    }),
  });
  const { error : feedError, value : feedValue } = feedSchema.validate({ feed: feed });
  if (feedError) {
    return feedError;
  }
};

// Joi Validation on Post Id
const validatePostId = async (postId) => {
  const postIdSchema = Joi.object({
    id: Joi.string().pattern(new RegExp("^[0-9a-fA-F]{24}$")).messages({
      "string.pattern.base":
        "Invalid ID format. Please provide a valid 24-character hexadecimal ID.",
    }),
  });
  const { error: postIdError, value: postIdValue } = postIdSchema.validate({
    id: postId,
  });
  if (postIdError) {
    return postIdError;
  }
};

module.exports = { validateFeed, validatePostId };
