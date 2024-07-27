const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("Create Post route", () => {
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
  //No Bearer token
  it("should return notFound Error upon no token is passed in the Header.Authorization", async () => {
    //Test
    const response = await request(app)
      .post("/api/post/")
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
      .post("/api/post/")
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
        __v: 0,
      },
    };
    //Assertions
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - No feed field
  it("should return required field error upon missing field", async () => {
    //Test
    const response = await request(app)
      .post("/api/post/")
      .set("Authorization", `Bearer ${token}`)
      .send();
    //Actual response
    const expectedResponse = {
      error: "Feed is required.",
    };
    //Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - No feed value
  it("should return required field error upon missing field", async () => {
    //Test
    const response = await request(app)
      .post("/api/post/")
      .set("Authorization", `Bearer ${token}`)
      .send({ feed: "" });
    //Actual response
    const expectedResponse = {
      error: '"feed" is not allowed to be empty',
    };
    //Assertions
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
});
