const Post = require("../../../models/postSchema");
const Comment = require("../../../models/commentSchema");
const {
  createNewPost,
  updateThePost,
  deleteThePost,
  findPostByUserId,
  findAllPost,
  findPostByPostId,
  toggleLike,
  toggleDislike,
} = require("../../../services/postServices");

const {
  NotFoundError,
  OwnerShipError,
} = require("../../../customErrors/customErrorClass");

jest.mock("../../../models/postSchema");
jest.mock("../../../models/commentSchema");

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

//Test - Find Post by User Id
describe("Find Post by User Id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return all post the particular user", async () => {
    const userId = "userId1";

    const mockPosts = [
      {
        id: "postId1",
        user: userId,
        feed: "Feed",
        likes: [],
        dislikes: [],
        comments: ["commentId1", "commentId2"],
      },
      {
        id: "postId2",
        user: userId,
        feed: "Feed",
        likes: [],
        dislikes: [],
        comments: ["commentId1"],
      },
    ];

    //Mocking the post.find
    Post.find.mockResolvedValue(mockPosts);

    //call the function
    const result = await findPostByUserId(userId);

    //Assertions
    expect(Post.find).toHaveBeenCalledWith({ user: userId });
    expect(result).toEqual(mockPosts);
  });
  it("should return null upon no post found for the given userId", async () => {
    const userId = "userId1";
    const mockPost = [];

    //mocking the Post.find
    Post.find.mockResolvedValue(mockPost);

    //Call the function
    const result = await findPostByUserId(userId);

    //Assetions
    expect(Post.find).toHaveBeenCalledWith({ user: userId });
    expect(result).toEqual(mockPost);
  });
});

describe("Find All posts", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all posts", async () => {
    const mockPosts = [
      {
        id: "postId1",
        user: "userId1",
        feed: "Feed",
        likes: [],
        dislikes: [],
        comments: ["commentId1", "commentId2"],
      },
      {
        id: "postId2",
        user: "userId2",
        feed: "Feed",
        likes: [],
        dislikes: [],
        comments: ["commentId1"],
      },
      {
        id: "postId3",
        user: "userId3",
        feed: "Feed",
        likes: [],
        dislikes: [],
        comments: ["commentId1", "commentId2"],
      },
      {
        id: "postId4",
        user: "userId4",
        feed: "Feed",
        likes: [],
        dislikes: [],
        comments: ["commentId1"],
      },
    ];

    //mocking the Post.find
    Post.find.mockResolvedValue(mockPosts);

    //call the function
    const result = await findAllPost();

    //assertions
    expect(Post.find).toHaveBeenCalledWith();
    expect(result).toEqual(mockPosts);
  });
  it("should return null upon no post found", async () => {
    const mockPosts = [];

    //mocking the Post.find
    Post.find.mockResolvedValue(mockPosts);
    //call the function
    const result = await findAllPost();
    //assertions
    expect(Post.find).toHaveBeenCalledWith();
    expect(result).toEqual(mockPosts);
  });
});

describe("find post by postId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return a particular post for the postId", async () => {
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1"],
    };

    //mocking the Post.findById
    Post.findById.mockResolvedValue(mockPost);

    //call the function
    const result = await findPostByPostId(postId);

    //assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(result).toEqual(mockPost);
  });
  it("should return a null upon given postId", async () => {
    const postId = "postId1";

    //mocking the Post.findById
    Post.findById.mockResolvedValue(null);

    //call the function
    const result = await findPostByPostId(postId);

    //assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(result).toEqual(null);
  });
});

describe("Toggle Like", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw NotFoundError upon no post for the given postId", async () => {
    const postId = "postId1";
    const currentUserId = "userId1";

    //mocking the post.findById
    Post.findById.mockResolvedValue(null);
    //Assertions
    await expect(toggleLike(postId, currentUserId)).rejects.toThrow(
      new NotFoundError("Post not found")
    );
  });
  it("should remove dislike and add like in the post if current disliked the post before and liked the post", async () => {
    const currentUserId = "userId1";
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [currentUserId],
      comments: ["commentId1"],
      save: jest.fn(),
    };

    const returnObj = {
      statusCode: 200,
      Status: "Like Added to the post",
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //call the function
    const result = await toggleLike(postId, currentUserId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);

    //
    expect(mockPost.save).toHaveBeenCalledTimes(2);
    expect(mockPost.dislikes).not.toContain(currentUserId);
    expect(mockPost.likes).toContain(currentUserId);
    expect(result).toEqual(returnObj);
  });
  it("should add like in the post if the currentUser doesn't liked the post", async () => {
    const currentUserId = "userId1";
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1"],
    };

    const updatedMockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [currentUserId],
      dislikes: [],
      comments: ["commentId1"],
    };

    const returnObj = {
      statusCode: 200,
      Status: "Like Added to the post",
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the post.save
    mockPost.save = jest.fn().mockReturnValue(updatedMockPost);

    //call the function
    const result = await toggleLike(postId, currentUserId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(mockPost.save).toHaveBeenCalledWith();
    expect(result).toEqual(returnObj);
  });

  it("should remove like in the post if the currentUser liked the post", async () => {
    const currentUserId = "userId1";
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [currentUserId],
      dislikes: [],
      comments: ["commentId1"],
    };

    const updatedMockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1"],
    };

    const returnObj = {
      statusCode: 200,
      Status: "Like Removed from the post",
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the post.save
    mockPost.save = jest.fn().mockReturnValue(updatedMockPost);

    //call the function
    const result = await toggleLike(postId, currentUserId);
    

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(mockPost.save).toHaveBeenCalledWith();
    expect(result).toEqual(returnObj);
  });
});

describe("Toggle DisLike", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should throw NotFoundError upon no post for the given postId", async () => {
    const postId = "postId1";
    const currentUserId = "userId1";

    //mocking the post.findById
    Post.findById.mockResolvedValue(null);
    //Assertions
    await expect(toggleDislike(postId, currentUserId)).rejects.toThrow(
      new NotFoundError("Post not found")
    );
  });
  it("should remove like and add dislike in the post if current liked the post before and disliked the post", async () => {
    const currentUserId = "userId1";
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [currentUserId],
      dislikes: [],
      comments: ["commentId1"],
      save: jest.fn(),
    };

    const returnObj = {
      statusCode: 200,
      Status: "Dislike Added to the post",
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //call the function
    const result = await toggleDislike(postId, currentUserId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);

    //
    expect(mockPost.save).toHaveBeenCalledTimes(2);
    expect(mockPost.likes).not.toContain(currentUserId);
    expect(mockPost.dislikes).toContain(currentUserId);
    expect(result).toEqual(returnObj);
  });
  it("should add like in the post if the currentUser doesn't liked the post", async () => {
    const currentUserId = "userId1";
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1"],
    };

    const updatedMockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [currentUserId],
      comments: ["commentId1"],
    };

    const returnObj = {
      statusCode: 200,
      Status: "Dislike Added to the post",
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the post.save
    mockPost.save = jest.fn().mockReturnValue(updatedMockPost);

    //call the function
    const result = await toggleDislike(postId, currentUserId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(mockPost.save).toHaveBeenCalledWith();
    expect(result).toEqual(returnObj);
  });

  it("should remove dislike in the post if the currentUser disliked the post", async () => {
    const currentUserId = "userId1";
    const postId = "postId1";
    const mockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [currentUserId],
      comments: ["commentId1"],
    };

    const updatedMockPost = {
      id: postId,
      user: "userId4",
      feed: "Feed",
      likes: [],
      dislikes: [],
      comments: ["commentId1"],
    };

    const returnObj = {
      statusCode: 200,
      Status: "Dislike Removed from the post",
    };
    //mocking the post.findById
    Post.findById.mockResolvedValue(mockPost);
    //mocking the post.save
    mockPost.save = jest.fn().mockReturnValue(updatedMockPost);

    //call the function
    const result = await toggleDislike(postId, currentUserId);

    //Assertions
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(mockPost.save).toHaveBeenCalledWith();
    expect(result).toEqual(returnObj);
  });
});
