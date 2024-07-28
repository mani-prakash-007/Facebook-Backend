const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("Get all Post route", () => {
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
    console.log(user1Id);
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
  //Creating Post
  it("should create a post for User-2 after successful login", async () => {
    //Test
    const response = await request(app)
      .post("/api/post/")
      .set("Authorization", `Bearer ${user2Token}`)
      .send({
        feed: "Post - User2",
      });
    //Actual Response
    const expectedResponse = {
      Status: "Post Created",
      Post_Details: {
        user: expect.any(String),
        feed: "Post - User2",
        likes: [],
        dislikes: [],
        comments: [],
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v:  expect.any(Number),
      },
    };
    user2PostId = response.body.Post_Details._id;
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //No Bearer token
  it("should return notFound Error upon no token is passed in the Header.Authorization", async () => {
    //Test
    const response = await request(app)
      .get(`/api/post/allpost`)
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
      .get(`/api/post/allpost`)
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
  //Test - Return All post
  it("should return all post details upon hitting the endpoint", async () => {
    //Test
    const response = await request(app)
      .get(`/api/post/allpost`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send();
    //Actual Response
    const expectedResponse = {
      All_Post: expect.arrayContaining([expect.anything() || null]),
    };
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
});
