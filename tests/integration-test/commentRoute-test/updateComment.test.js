const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("Update Post route", () => {
  //DB Connection Setup

  //Truncating all datas in the db
  const truncateAllCollections = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log("All collections truncated");
  };

  beforeAll(async () => {
    const PORT = generateRandomNumber();
    server = app.listen(PORT, () => {
      console.log(`Server Running on Port : ${PORT}`);
    });
    await mongoose.connect("mongodb://localhost:27017/Integration-TestDB");
    console.log("DB Connected...");
  });

  afterAll(async () => {
    await truncateAllCollections();
    await mongoose.connection.close();
    console.log("DB Connection Closed...");

    server.close();
    console.log("Connection Closed...");
  });

  //Creating a User-1 before login
  it("should return a response with 200 upon successful registration User 1", async () => {
    //Test
    const response = await request(app).post("/api/user/register").send({
      fname: "User1",
      lname: "User1",
      email: "user1@gmail.com",
      password: "User1@2003",
    });
    //Actual Response
    const expectedResponse = {
      Status: "Register Successful",
      UserData: {
        first_name: "User1",
        last_name: "User1",
        email: "user1@gmail.com",
        password: expect.any(String),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    };
    //User1 ID
    user1Id = response.body.UserData._id;
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Creating a User-2 before login
  it("should return a response with 200 upon successful registration of User 2", async () => {
    //Test
    const response = await request(app).post("/api/user/register").send({
      fname: "User2",
      lname: "User2",
      email: "user2@gmail.com",
      password: "User2@2003",
    });
    //Actual Response
    const expectedResponse = {
      Status: "Register Successful",
      UserData: {
        first_name: "User2",
        last_name: "User2",
        email: "user2@gmail.com",
        password: expect.any(String),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    };
    //User2 ID
    user2Id = response.body.UserData._id;
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Login User1
  it("should return a response with 200 upon successful login of User - 1", async () => {
    //Test
    const response = await request(app).post("/api/user/login").send({
      email: "user1@gmail.com",
      password: "User1@2003",
    });
    //Actual Response
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    const expectedResponse = {
      Details: {
        statusCode: 200,
        status: "Login Success",
        token: expect.stringMatching(jwtRegex),
      },
    };
    //JWT Token
    user1Token = response.body.Details.token;
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Login User2
  it("should return a response with 200 upon successful login of User - 2", async () => {
    //Test
    const response = await request(app).post("/api/user/login").send({
      email: "user2@gmail.com",
      password: "User2@2003",
    });
    //Actual Response
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    const expectedResponse = {
      Details: {
        statusCode: 200,
        status: "Login Success",
        token: expect.stringMatching(jwtRegex),
      },
    };
    //JWT Token
    user2Token = response.body.Details.token;
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Creating Post
  it("should create a post for User-1 after successful login", async () => {
    //Test
    const response = await request(app)
      .post("/api/post/")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        feed: "Post - User1",
      });
    //Actual Response
    const expectedResponse = {
      Status: "Post Created",
      Post_Details: {
        user: expect.any(String),
        feed: "Post - User1",
        likes: [],
        dislikes: [],
        comments: [],
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    };
    user1PostId = response.body.Post_Details._id;
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Create comment - 1 (User 1)
  it("should create a comment-1 for the given post Id", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/${user1PostId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ comment: "Hello World by User 1" });
    //Actual response
    const expectedResponse = {
      comentingProcess: {
        statusCode: 200,
        Status: "Comment Added",
        CommentData: {
          user: user1Id,
          post: user1PostId,
          comment: "Hello World by User 1",
          likes: [],
          dislikes: [],
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        },
      },
    };
    //comment ID
    comment1Id = response.body.comentingProcess.CommentData._id;
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Create comment - 1 (User 2)
  it("should create a comment-2 for the given post Id", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/${user1PostId}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({ comment: "Hello World by User 2" });
    //Actual response
    const expectedResponse = {
      comentingProcess: {
        statusCode: 200,
        Status: "Comment Added",
        CommentData: {
          user: user2Id,
          post: user1PostId,
          comment: "Hello World by User 2",
          likes: [],
          dislikes: [],
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        },
      },
    };
    //comment ID
    comment2Id = response.body.comentingProcess.CommentData._id;
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //No Bearer token
  it("should return notFound Error upon no token is passed in the Header.Authorization", async () => {
    //Test
    const response = await request(app)
      .put(`/api/post/comment/${comment1Id}`)
      .set("Authorization", `Bearer `)
      .send();
    //Actual Response
    const expectedResponse = {
      StatusCode: 404,
      ErrorName: "NotFoundError",
      ErrorMessage: "Token not Found in Header",
    };

    //Assertions
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - JWT token verification fails
  it("should return JsonWebTokenError upon token verification fails", async () => {
    //Test
    const response = await request(app)
      .put(`/api/post/comment/${comment1Id}`)
      .set("Authorization", `Bearer ${user1Token}siuf`)
      .send();
    //Actual Response
    const expectedResponse = {
      StatusCode: 401,
      ErrorName: "UnauthorizedError",
      ErrorMessage: "JsonWebTokenError: invalid signature",
    };

    //Assertions
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(expectedResponse);
  });

  //Test - No Comment field
  it("should return required field error upon missing field", async () => {
    //Test
    const response = await request(app)
      .put(`/api/post/comment/${comment1Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send();
    //Actual response
    const expectedResponse = {
      error: "Comment is required.",
    };
    //Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - No comment value
  it("should return required feed Value Error upon no value in comment field", async () => {
    //Test
    const response = await request(app)
      .put(`/api/post/comment/${comment1Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ comment: "" });
    //Actual response
    const expectedResponse = {
      error: '"comment" is not allowed to be empty',
    };
    //Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Req.params.id Validation
  it("should return Validation field error upon entering comment Id", async () => {
    //Test
    const id = "66a53545d5c556a2";
    const response = await request(app)
      .put(`/api/post/comment/${id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ comment: "Updated Comment" });
    //Actual response
    const expectedResponse = {
      error:
        "Invalid ID format. Please provide a valid 24-character hexadecimal ID.",
    };
    //Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - comment Exist
  it("should retrun NotFoundError upon no comment exist for the comment Id", async () => {
    id = "669a4b0830deb6c38b110dc2";
    const response = await request(app)
      .put(`/api/post/comment/${id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ comment: "Updated Comment" });
    //Actual response
    const expectedResponse = {
      StatusCode: 404,
      ErrorName: "NotFoundError",
      ErrorMessage: "Comment not Found",
    };
    //Assertions
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Comment ownership
  it("should return OwnerShipError upon trying to update others post", async () => {
    //Test
    const response = await request(app)
      .put(`/api/post/comment/${comment2Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ comment: "Updated Comment" });
    //Actual response
    const expectedResponse = {
      StatusCode: 403,
      ErrorName: "OwnerShipError",
      ErrorMessage: " Comment not belongs to Current User",
    };
    //Assertions
    expect(response.status).toBe(403);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Updated Comment
  it("should return message with updated comment for thw given comment id", async () => {
    //Test
    const response = await request(app)
      .put(`/api/post/comment/${comment1Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ comment: "Updated Comment" });
    //Actual response
    const expectedResponse = {
      updatingComment: {
        statusCode: 200,
        Status: " Comment Updated",
        UpdatedComment: {
          _id: expect.any(String),
          user: user1Id,
          post: user1PostId,
          comment: "Updated Comment",
          likes: [],
          dislikes: [],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        },
      },
    };
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
});
