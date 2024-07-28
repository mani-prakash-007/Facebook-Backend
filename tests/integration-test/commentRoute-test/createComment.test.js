const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("Create Comment route", () => {
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
    console.log(PORT);
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

  //Creating a User before login
  it("should return a response with 200 upon successful registration", async () => {
    //Test
    const response = await request(app).post("/api/user/register").send({
      fname: "Mani",
      lname: "Prakash",
      email: "mani@gmail.com",
      password: "Mani@2003",
    });
    //Actual Response
    const expectedResponse = {
      Status: "Register Successful",
      UserData: {
        first_name: "Mani",
        last_name: "Prakash",
        email: "mani@gmail.com",
        password: expect.any(String),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    };
    //UserId
    user1Id = response.body.UserData._id;
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Login
  it("should return a response with 200 upon successful login", async () => {
    //Test
    const response = await request(app).post("/api/user/login").send({
      email: "mani@gmail.com",
      password: "Mani@2003",
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
    token = response.body.Details.token;
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  it("should create a post upon successful Authorization of User", async () => {
    //Test
    const response = await request(app)
      .post("/api/post/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        feed: "New Post",
      });
    //Actual Response
    const expectedResponse = {
      Status: "Post Created",
      Post_Details: {
        user: expect.any(String),
        feed: "New Post",
        likes: [],
        dislikes: [],
        comments: [],
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    };
    //Post Id
    user1PostId = response.body.Post_Details._id;
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //No Bearer token
  it("should return notFound Error upon no token is passed in the Header.Authorization", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/${user1PostId}`)
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
  it("should return notFound Error upon no token is passed in the Header.Authorization", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/${user1PostId}`)
      .set("Authorization", `Bearer ${token}siuf`)
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
      .post(`/api/post/comment/${user1PostId}`)
      .set("Authorization", `Bearer ${token}`)
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
  it("should return field value required error upon no value on the field", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/${user1PostId}`)
      .set("Authorization", `Bearer ${token}`)
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
  it("should return Validation field error upon entering post Id", async () => {
    //Test
    const id = "66a53545d5c556a233239bd";
    const response = await request(app)
      .post(`/api/post/comment/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Hello World" });
    //Actual response
    const expectedResponse = {
      error:
        "Invalid ID format. Please provide a valid 24-character hexadecimal ID.",
    };
    //Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Post not Exist
  it("should return NotFoundError error upon entering postId is not exist", async () => {
    //Test
    const id = "669a061576c54cbc43de69df";
    const response = await request(app)
      .post(`/api/post/comment/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Hello World" });
    //Actual response
    const expectedResponse = {
      StatusCode: 404,
      ErrorName: "NotFoundError",
      ErrorMessage: "Post not Found",
    };
    //Assertions
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Create Comment
  it("should create a comment for the given post Id", async () => {
    //Test
    const response = await request(app)
      .post(`/api/post/comment/${user1PostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "Hello World" });
    //Actual response
    const expectedResponse = {
      comentingProcess: {
        statusCode: 200,
        Status: "Comment Added",
        CommentData: {
          user: user1Id,
          post: user1PostId,
          comment: "Hello World",
          likes: [],
          dislikes: [],
          _id: expect.any(String),
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
