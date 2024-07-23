const Post = require("../../models/postSchema");
const Comment = require("../../models/commentSchema");
const {
  createNewPost,
  updateThePost,
  deleteThePost,
  findPostByUserId,
  findAllPost,
  findPostByPostId,
  toggleLike,
  toggleDislike,
} = require("../../services/postServices");

const {
  NotFoundError,
  OwnerShipError,
} = require("../../customErrors/customErrorClass");

jest.mock("../../models/postSchema");
jest.mock("../../models/commentSchema");

describe("createNewPost", () => {
  it("should return a post upon creation", async () => {
    const feed = "Demo feed";
    const userId = "userId1";

    const mockPost = {
      id: "demoPostId1",
      user: userId,
      feed,
      likes: [],
      dislikes: [],
      comments: [],
    };
    //mocking the post.create
    Post.create.mockResolvedValue(mockPost);

    //call the function
    const result = await createNewPost(feed, userId);

    //Assertions
    expect(result).toEqual(mockPost);
  });
});

describe("updatePost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw NotFoundError upon no post found for the given postId", async () => {
    const postId = "postId1";
    const userId = "UserId1";
    const feed = "Update feed";

    //Mocking the post.
    Post.findById.mockResolvedValue(null);

    //Assertion
    await expect(updateThePost(postId, userId, feed)).rejects.toThrow(
      new NotFoundError("Post not Found")
    );
  });

  it("should update the post upon correct userId and postId", async () => {
    const postId = "postId1";
    const userId = "UserId1";
    const feed = "Update feed";

    const mockPost = {
      id: postId,
      user: userId,
      feed: "feed",
      likes: [],
      dislikes: [],
      comments: [],
    };

    const updatedMockPost = {
      id: postId,
      user: userId,
      feed,
      likes: [],
      dislikes: [],
      comments: [],
    };

    const returnObject = {
      statusCode: 200,
      Status: "Post Updated",
      Updated_Post_Details: updatedMockPost,
    };
    //mocking the Post.findById
    Post.findById.mockResolvedValue(mockPost);

    //mocking the post.findByIdAndUpdate
    Post.findByIdAndUpdate.mockResolvedValue(updatedMockPost);

    //call the function
    const result = await updateThePost(postId, userId, feed);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
      postId,
      { feed: feed },
      {
        new: true,
      }
    );
    expect(result).toEqual(returnObject);
  });
  it("should return OwnerShipError if userId not matched with post.userId", async () => {
    const postId = "postId1";
    const userId = "UserId1";
    const feed = "feed";

    const mockPost = {
      id: postId,
      user: "UserId2",
      feed,
      likes: [],
      dislikes: [],
      comments: [],
    };

    //Mocking the Post.findById
    Post.findById.mockResolvedValue(mockPost);

    //Assertion
    await expect(updateThePost(postId, userId, feed)).rejects.toThrow(
      new OwnerShipError(" Post not belongs to Current User")
    );
  });
});

describe("deletePost", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return NotFoundError if no post found for the postId", async () => {
    const postId = "postId1";
    const userId = "userId1";

    //Mocking the post.findById
    Post.findById.mockResolvedValue(null);

    //Assertion
    await expect(deleteThePost(postId, userId)).rejects.toThrow(
      new NotFoundError("Post not Found")
    );
  });
  it("should delete the post if userId and post.userId matchs", async () => {
    const postId = "postId1";
    const userId = "userId1";

    const mockPost = {
      id: postId,
      user: userId,
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1", "commentId2"],
    };
    const returnObj = {
      statusCode: 200,
      Status: "Post Deleted",
    };
    //mocking the Post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the comment.findByIdAndDelete
    Comment.findByIdAndDelete.mockResolvedValue(null);
    //mocking the Post.findByIdAndDelete
    Post.findByIdAndDelete.mockResolvedValue(null);
    //call the function
    const result = await deleteThePost(postId, userId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    for (let commentId of mockPost.comments) {
      expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(commentId);
    }
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith(postId);
    expect(result).toEqual(returnObj);
  });
  it("should return OwnerShipError upon not matched with userId and post.userId", async () => {
    const postId = "postId1";
    const userId = "userId1";

    const mockPost = {
      id: postId,
      user: "userId2",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1", "commentId2"],
    };
    //mocking the Post.findById
    Post.findById.mockResolvedValue(mockPost);

    //Assertions
    await expect(deleteThePost(postId, userId)).rejects.toThrow(
      new OwnerShipError(" Post not belongs to Current User")
    );
  });
});
