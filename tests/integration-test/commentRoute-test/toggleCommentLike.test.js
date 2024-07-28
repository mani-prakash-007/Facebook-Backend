const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("toggle comment Like route", () => {
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
  //Creating Post - 1
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
  //No Bearer token
  it("should return notFound Error upon no token is passed in the Header.Authorization", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/like/${comment1Id}`)
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
      .post(`/api/post/comment/like/${comment1Id}`)
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
  //Test - Req.params.id Validation
  it("should return Validation field error upon entering comment Id", async () => {
    //Test
    const id = "66a53545d5c556a2";
    const response = await request(app)
      .post(`/api/post/comment/like/${id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send();
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
  it("should return NotFoundError upon no comment exist for the comment Id", async () => {
    id = "669a4b0830deb6c38b110dc2";
    const response = await request(app)
      .post(`/api/post/comment/like/${id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send();
    //Actual response
    const expectedResponse = {
      StatusCode: 404,
      ErrorName: "NotFoundError",
      ErrorMessage: "Comment not found",
    };
    //Assertions
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Add like to comment
  it("should add like to the comment if comment found", async () => {
    // Test
    const response = await request(app)
      .post(`/api/post/comment/like/${comment1Id}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send();
    //Actual Response
    const expectedResponse = {
      Details: {
        statusCode: 200,
        Status: "Like added to comment",
      },
    };
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Add like to comment
  it("should remove like to the comment if comment already liked", async () => {
    // Test
    const response = await request(app)
      .post(`/api/post/comment/like/${comment1Id}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send();
    //Actual Response
    const expectedResponse = {
      Details: {
        statusCode: 200,
        Status: "Like removed from comment",
      },
    };
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
});
