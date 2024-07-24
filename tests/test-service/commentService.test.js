const Comment = require("../../models/commentSchema");
const Post = require("../../models/postSchema");
const {
  createTheComment,
  getCommentsByPostId,
  updateTheComment,
  getCommentById,
  deleteTheComment,
  toggleCommentLike,
  toggleCommentDislike,
} = require("../../services/commentServices");

const {
  NotFoundError,
  OwnerShipError,
} = require("../../customErrors/customErrorClass");

// mocking the imports
jest.mock("../../models/commentSchema");
jest.mock("../../models/postSchema");

//Test - create the comment
describe("Create Comment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return NotFoundError if no post found for the postId", async () => {
    const comment = "demo comment";
    const postId = "postId1";
    const currentUserId = "userId1";

    //mocking the post.findById
    Post.findById.mockResolvedValue(null);

    //Assertions
    await expect(
      createTheComment(comment, postId, currentUserId)
    ).rejects.toThrow(new NotFoundError("Post not Found"));
  });
  it("should return NotFoundError if currentuser not found", async () => {
    const comment = "demo comment";
    const postId = "postId1";
    const currentUserId = null;

    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: [],
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);

    //assertions
    await expect(
      createTheComment(comment, postId, currentUserId)
    ).rejects.toThrow(new NotFoundError("Current userId not Found"));
  });
  it("should create a comment for the post if post and currentUser if found", async () => {
    const comment = "demo comment";
    const postId = "postId1";
    const currentUserId = "userId1";

    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: [],
    };
    const commentData = {
      user: currentUserId,
      post: postId,
      comment: comment,
    };
    const returnObj = {
      statusCode: 200,
      Status: "Comment Added",
      CommentData: commentData,
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the comment.create
    Comment.create.mockResolvedValue(commentData);
    //mocking the post.save
    mockPost.save = jest.fn().mockResolvedValue(mockPost);

    //call the function
    const result = await createTheComment(comment, postId, currentUserId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(Comment.create).toHaveBeenCalledWith({
      user: currentUserId,
      post: postId,
      comment: comment,
    });
    expect(mockPost.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnObj);
  });
});

describe("get Comment by PostId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return comments , if found in the post", async () => {
    const postId = "postId1";
    const mockComments = [
      {
        user: "userId1",
        post: postId,
        comment: "Demo feed - 1",
      },
      {
        user: "userId2",
        post: postId,
        comment: "Demo feed - 2",
      },
    ];

    const returnObj = {
      statusCode: 200,
      Status: "Comments Found",
      Comments: mockComments,
    };

    //mocking the post.findById
    Comment.find.mockResolvedValue(mockComments);

    //call the function
    const result = await getCommentsByPostId(postId);

    //Assertions
    expect(Comment.find).toHaveBeenCalledWith({ post: postId });
    expect(result).toEqual(returnObj);
  });
});

describe("get comment by Id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return a specific comment for commentId", async () => {
    const commentId = "commentId1";

    const mockComment = {
      id: commentId,
      user: "userId2",
      post: "postId1",
      comment: "Demo feed - 2",
      likes: [],
      dislikes: [],
    };
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await getCommentById(commentId);

    //Assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(result).toEqual(mockComment);
  });
  it("should return NotFoundError if no comment found commentId", async () => {
    const commentId = "commentId1";

    const mockComment = [];
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);
    //call the function
    const result = await getCommentById(commentId);

    //Assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(result).toEqual(mockComment);
  });
});

describe("update the comment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return  notFoundError if not comment found for the given comment id", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";
    const comment = "Demo comment";

    const mockComment = null;
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);

    //Assertions
    await expect(
      updateTheComment(commentId, currentUserId, comment)
    ).rejects.toThrow(new NotFoundError("Comment not Found"));
  });

  it("should return OwnerShipError if currentUser is notSame in comment.user", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";
    const comment = "Demo comment";

    const mockComment = {
      id: commentId,
      user: "userId2",
      post: "postId1",
      comment: "Demo feed - 2",
      likes: [],
      dislikes: [],
    };
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);

    //Assertions
    await expect(
      updateTheComment(commentId, currentUserId, comment)
    ).rejects.toThrow(new OwnerShipError(" Post not belongs to Current User"));
  });
  it("should update the comment if currentUserId and comment.user is same", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";
    const comment = "Demo comment";

    const mockComment = {
      id: commentId,
      user: currentUserId,
      post: "postId1",
      comment: "Demo feed - 2",
      likes: [],
      dislikes: [],
    };
    const updatedMockComment = {
      id: commentId,
      user: currentUserId,
      post: "postId1",
      comment: comment,
      likes: [],
      dislikes: [],
    };
    const returnObj = {
      statusCode: 200,
      Status: " Comment Updated",
      UpdatedComment: updatedMockComment,
    };
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);
    //mocking the comment.findByIdAndUpdate
    Comment.findByIdAndUpdate.mockResolvedValue(updatedMockComment);

    //call the function
    const result = await updateTheComment(commentId, currentUserId, comment);

    //Assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      commentId,
      { comment: comment },
      { new: true }
    );
    expect(result).toEqual(returnObj);
  });
});

describe("delete the comment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return NotFoundError if no comment found for the commentId", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = null;
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);

    //Assertions
    await expect(deleteTheComment(commentId, currentUserId)).rejects.toThrow(
      new NotFoundError("Comment not Found")
    );
  });
  it("should return OnerShipError if currentUser id not matched with comment.user or post.user", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId5",
      post: "postId1",
      comment: "Demo feed - 2",
      likes: [],
      dislikes: [],
    };
    const mockPost = {
      id: mockComment.post,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1"],
    };
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);

    //Assertions
    await expect(deleteTheComment(commentId, currentUserId)).rejects.toThrow(
      new OwnerShipError("Comment not belongs to Current User")
    );
  });
  it("should remove the commentid from the post and delete the comment", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: currentUserId,
      post: "postId1",
      comment: "Demo feed - 2",
      likes: [],
      dislikes: [],
    };
    const mockPost = {
      id: mockComment.post,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: [commentId],
    };
    const updatedMockPost = {
      id: mockComment.post,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: [],
    };
    //mocking the comment.findById
    Comment.findById.mockResolvedValue(mockComment);
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the Post.save
    mockPost.save = jest.fn().mockResolvedValue(updatedMockPost);
    //mocking the Comment.findByIdAndDelete
    Comment.findByIdAndDelete.mockResolvedValue(null);
    //call the function
    const result = await deleteTheComment(commentId, currentUserId);
    //Assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(Post.findById).toHaveBeenCalledWith(mockComment.post);
    expect(mockPost.save).toHaveBeenCalledTimes(1);
    expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(commentId);
    expect(result).toEqual({ statusCode: 200, Status: "Comment Deleted" });
  });
});

describe("Toggle Comment Like", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw NotFoundError upon no post for the given postId", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    //mocking the post.findById
    Comment.findById.mockResolvedValue(null);
    //Assertions
    await expect(toggleCommentLike(commentId, currentUserId)).rejects.toThrow(
      new NotFoundError("Comment not found")
    );
  });
  it("should comment.likes not includes currrentUserId add like and remove the userid from comment.dislike", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [currentUserId],
      save: jest.fn().mockResolvedValueOnce(),
    };
    //mocking the comment.findByid
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await toggleCommentLike(commentId, currentUserId);

    //Assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(mockComment.dislikes).not.toContain(currentUserId);
    expect(mockComment.likes).toContain(currentUserId);
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      Status: "Like added to comment",
    });
  });
  it("should add like to the comment if user doesn't liked the post", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      save: jest.fn().mockResolvedValueOnce(),
    };
    //mocking the comment.findByid
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await toggleCommentLike(commentId, currentUserId);
    //assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(mockComment.likes).toContain(currentUserId);
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      Status: "Like added to comment",
    });
  });
  it("should remove the like if user already liked the comment", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId4",
      feed: "Feed",
      likes: [currentUserId],
      dislikes: [],
      save: jest.fn().mockResolvedValueOnce(),
    };
    //mocking the comment.findByid
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await toggleCommentLike(commentId, currentUserId);
    //assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(mockComment.likes).not.toContain(currentUserId);
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      Status: "Like removed from comment",
    });
  });
});

describe("Toggle Comment Dislike", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw NotFoundError upon no post for the given postId", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    //mocking the post.findById
    Comment.findById.mockResolvedValue(null);
    //Assertions
    await expect(
      toggleCommentDislike(commentId, currentUserId)
    ).rejects.toThrow(new NotFoundError("Comment not found"));
  });
  it("should comment.likes not includes currrentUserId add like and remove the userid from comment.dislike", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId4",
      feed: "Feed",
      likes: [currentUserId],
      dislikes: [],
      save: jest.fn().mockResolvedValueOnce(),
    };
    //mocking the comment.findByid
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await toggleCommentDislike(commentId, currentUserId);

    //Assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(mockComment.dislikes).toContain(currentUserId);
    expect(mockComment.likes).not.toContain(currentUserId);
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      Status: "Dislike added to comment",
    });
  });
  it("should add like to the comment if user doesn't liked the post", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      save: jest.fn().mockResolvedValueOnce(),
    };
    //mocking the comment.findByid
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await toggleCommentDislike(commentId, currentUserId);
    //assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(mockComment.dislikes).toContain(currentUserId);
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      Status: "Dislike added to comment",
    });
  });
  it("should remove the like if user already liked the comment", async () => {
    const commentId = "commentId1";
    const currentUserId = "userId1";

    const mockComment = {
      id: commentId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [currentUserId],
      save: jest.fn().mockResolvedValueOnce(),
    };
    //mocking the comment.findByid
    Comment.findById.mockResolvedValue(mockComment);

    //call the function
    const result = await toggleCommentDislike(commentId, currentUserId);
    //assertions
    expect(Comment.findById).toHaveBeenCalledWith(commentId);
    expect(mockComment.dislikes).not.toContain(currentUserId);
    expect(mockComment.save).toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 200,
      Status: "Dislike removed from comment",
    });
  });
});
